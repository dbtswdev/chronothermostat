"""Tests for zone events, pending retries and program saving."""

import asyncio
from copy import deepcopy
from datetime import datetime
import logging
import math
from zoneinfo import ZoneInfo

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.chronothermostat import engine as engine_module
from custom_components.chronothermostat.const import (
    DOMAIN,
    SIGNAL_UPDATED,
    WEEKDAYS,
    Scenario,
)
from custom_components.chronothermostat.engine import PendingCommand
from custom_components.chronothermostat.status import ZoneStatusKey

ROME = ZoneInfo("Europe/Rome")
ZONE_A = "climate.zone_a"
ZONE_B = "climate.zone_b"
SLOT_0700 = 28
SLOT_0800 = 32
ZONE_ATTRIBUTES = {"temperature": 19.0, "min_temp": 5, "max_temp": 30}
# A setpoint other than the program's 19.0.
FORCED_ATTRIBUTES = {**ZONE_ATTRIBUTES, "temperature": 21.0}


def at(day: int, hour: int, minute: int = 0, second: int = 0) -> datetime:
    """Return a Europe/Rome wall-clock time in November 2026 (10 = Tuesday)."""
    return datetime(2026, 11, day, hour, minute, second, tzinfo=ROME)


def step_day(before: float, after: float, from_slot: int) -> list[float]:
    """Return a program day that changes from `before` to `after` at a slot."""
    return [before] * from_slot + [after] * (96 - from_slot)


def temperatures(temp_calls) -> list[tuple[str, float]]:
    """Return the (entity_id, temperature) pairs of set_temperature calls."""
    return [(c.data["entity_id"], c.data["temperature"]) for c in temp_calls]


def modes(mode_calls) -> list[tuple[str, str]]:
    """Return the (entity_id, hvac_mode) pairs of set_hvac_mode calls."""
    return [(c.data["entity_id"], c.data["hvac_mode"]) for c in mode_calls]


def register_climate_services(hass, handler) -> None:
    """Route both climate services to one handler."""
    for service in ("set_hvac_mode", "set_temperature"):
        hass.services.async_register("climate", service, handler)


def call_value(call) -> tuple[str, object]:
    """Return (entity_id, hvac mode or temperature) of a climate call."""
    return call.data["entity_id"], call.data.get(
        "hvac_mode", call.data.get("temperature")
    )


def register_fake_climates(hass, sent: list) -> None:
    """Make the climate services record the call and update the state."""

    async def climate_service(call):
        sent.append(call_value(call))
        entity_id = call.data["entity_id"]
        state = hass.states.get(entity_id)
        attributes = dict(state.attributes)
        if call.service == "set_hvac_mode":
            hass.states.async_set(entity_id, call.data["hvac_mode"], attributes)
        else:
            attributes["temperature"] = call.data["temperature"]
            hass.states.async_set(entity_id, state.state, attributes)

    register_climate_services(hass, climate_service)


def stored_day(
    hass_storage, entry_id: str, zone_id: str, program: str, weekday: str
) -> list[float]:
    """Return a persisted program day."""
    data = hass_storage[f"chronothermostat.{entry_id}"]["data"]
    return data["zones"][zone_id][program][weekday]


def warnings_about(caplog, text: str) -> list[str]:
    """Return the WARNING messages that mention a text."""
    return [
        record.getMessage()
        for record in caplog.records
        if record.levelno == logging.WARNING and text in record.getMessage()
    ]


async def test_zone_turned_on_receives_current_value(
    hass, setup_at, climate_calls, caplog
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 8))
    data.store.set_day(ZONE_A, Scenario.WORK, "tue", [20.5] * 96)
    hass.states.async_set(ZONE_A, "off", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()
    temp_calls.clear()
    mode_calls.clear()
    caplog.set_level(logging.INFO, logger=engine_module.__name__)

    hass.states.async_set(ZONE_A, "heat", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()

    assert temperatures(temp_calls) == [(ZONE_A, 20.5)]
    assert mode_calls == []
    assert "climate.zone_a: set temperature 20.5 (zone_on)" in caplog.text


async def test_engine_heat_is_not_mistaken_for_zone_turned_on(hass, setup_at):
    data = await setup_at(at(10, 8))
    data.store.set_day(ZONE_A, Scenario.WORK, "tue", [20.5] * 96)
    sent = []
    register_fake_climates(hass, sent)
    await data.engine.async_set_scenario(Scenario.OFF)
    await hass.async_block_till_done()
    sent.clear()

    # The engine's own heat turns the zones off -> heat; by the time the
    # queued zone_on work runs, the zones already hold the program value.
    await data.engine.async_set_scenario(Scenario.WORK)
    await hass.async_block_till_done()

    assert sent == [
        (ZONE_A, "heat"),
        (ZONE_A, 20.5),
        (ZONE_B, "heat"),
        (ZONE_B, 19.0),
    ]


async def test_zone_turned_on_with_program_target_sends_nothing(
    hass, setup_at, climate_calls
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 8))
    data.store.set_day(ZONE_A, Scenario.WORK, "tue", [20.5] * 96)
    hass.states.async_set(ZONE_A, "off", {**ZONE_ATTRIBUTES, "temperature": 20.4})
    await hass.async_block_till_done()
    temp_calls.clear()

    # 20.4 (a 0.1-step thermostat) rounds to 20.5: already on program.
    hass.states.async_set(ZONE_A, "heat", {**ZONE_ATTRIBUTES, "temperature": 20.4})
    await hass.async_block_till_done()
    assert temp_calls == []

    # Switched on by hand with another target: it gets the program value.
    hass.states.async_set(ZONE_A, "off", {**ZONE_ATTRIBUTES, "temperature": 17.0})
    hass.states.async_set(ZONE_A, "heat", {**ZONE_ATTRIBUTES, "temperature": 17.0})
    await hass.async_block_till_done()
    assert temperatures(temp_calls) == [(ZONE_A, 20.5)]
    assert mode_calls == []


@pytest.mark.parametrize("scenario", [Scenario.OFF, Scenario.AWAY])
async def test_zone_turned_on_in_off_scenario_is_left_alone(
    hass, setup_at, time_travel, climate_calls, scenario
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 6, 59, 59))
    for zone_id in (ZONE_A, ZONE_B):
        data.store.set_day(
            zone_id, Scenario.WORK, "tue", step_day(15.0, 19.0, SLOT_0700)
        )
    await data.engine.async_set_scenario(
        scenario, at(11, 18) if scenario is Scenario.AWAY else None
    )
    for zone_id in (ZONE_A, ZONE_B):
        hass.states.async_set(zone_id, "off", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()
    temp_calls.clear()
    mode_calls.clear()

    hass.states.async_set(ZONE_A, "heat", {**ZONE_ATTRIBUTES, "temperature": 22.0})
    await hass.async_block_till_done()
    await time_travel(at(10, 7))

    assert temp_calls == []
    assert mode_calls == []
    assert data.engine.scenario is scenario


async def test_missing_zone_entity_is_skipped(
    hass, config_entry, setup_at, climate_calls, caplog
):
    temp_calls, mode_calls = climate_calls
    hass.states.async_remove(ZONE_B)

    data = await setup_at(at(10, 8))

    assert config_entry.state is ConfigEntryState.LOADED
    assert warnings_about(caplog, ZONE_B) == [
        "Zone climate.zone_b not found; it will be skipped until it appears"
    ]
    assert warnings_about(caplog, ZONE_A) == []
    assert data.engine.zone_status(ZONE_B).key is ZoneStatusKey.UNAVAILABLE
    assert temperatures(temp_calls) == [(ZONE_A, 19.0)]
    assert mode_calls == []

    # Once the entity appears it gets the current value it missed.
    hass.states.async_set(ZONE_B, "heat", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()
    assert temperatures(temp_calls) == [(ZONE_A, 19.0), (ZONE_B, 19.0)]
    assert data.engine._pending == {}


async def test_step_during_unavailable_is_retried_when_zone_returns(
    hass, setup_at, time_travel, climate_calls
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 6, 59, 59))
    data.store.set_day(ZONE_A, Scenario.WORK, "tue", step_day(15.0, 19.0, SLOT_0700))
    hass.states.async_set(ZONE_A, "unavailable")
    await hass.async_block_till_done()
    temp_calls.clear()
    mode_calls.clear()

    await time_travel(at(10, 7))
    assert temp_calls == []
    assert data.engine._pending == {ZONE_A: PendingCommand(None, 19.0)}

    hass.states.async_set(ZONE_A, "heat", {**ZONE_ATTRIBUTES, "temperature": 15.0})
    await hass.async_block_till_done()
    assert temperatures(temp_calls) == [(ZONE_A, 19.0)]
    assert data.engine._pending == {}

    # Sent once: the next quarter has nothing left to retry.
    await time_travel(at(10, 7, 15))
    assert temperatures(temp_calls) == [(ZONE_A, 19.0)]
    assert mode_calls == []


async def test_failed_service_call_is_retried_next_quarter(
    hass, setup_at, time_travel
):
    data = await setup_at(at(10, 6, 59, 59))
    data.store.set_day(ZONE_A, Scenario.WORK, "tue", step_day(15.0, 19.0, SLOT_0700))
    attempts = []
    failures = [HomeAssistantError("climate failure")]

    async def set_temperature(call):
        attempts.append(call_value(call))
        if failures:
            raise failures.pop()

    hass.services.async_register("climate", "set_temperature", set_temperature)

    await time_travel(at(10, 7))
    assert attempts == [(ZONE_A, 19.0)]
    assert data.engine._pending == {ZONE_A: PendingCommand(None, 19.0)}

    await time_travel(at(10, 7, 15))
    assert attempts == [(ZONE_A, 19.0), (ZONE_A, 19.0)]
    assert data.engine._pending == {}

    await time_travel(at(10, 7, 30))
    assert len(attempts) == 2


async def test_save_today_applies_new_current_value(
    hass, hass_storage, setup_at, climate_calls
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 8))
    updates = []
    async_dispatcher_connect(
        hass,
        SIGNAL_UPDATED.format(entry_id=data.engine.entry_id),
        callback(lambda: updates.append(None)),
    )
    temp_calls.clear()
    mode_calls.clear()

    await data.engine.async_save_day(ZONE_A, Scenario.WORK, "tue", [21.0] * 96)

    assert temperatures(temp_calls) == [(ZONE_A, 21.0)]
    assert mode_calls == []
    assert data.store.get_week(ZONE_A, Scenario.WORK)["tue"] == [21.0] * 96
    entry_id = data.engine.entry_id
    assert stored_day(hass_storage, entry_id, ZONE_A, "work", "tue") == [21.0] * 96
    assert len(updates) == 1


async def test_save_other_day_sends_nothing(
    hass, hass_storage, setup_at, climate_calls
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 8))
    temp_calls.clear()
    mode_calls.clear()

    await data.engine.async_save_day(ZONE_A, Scenario.WORK, "wed", [21.0] * 96)
    # Today, but in the holiday program while work is active: nothing either.
    await data.engine.async_save_day(ZONE_A, Scenario.HOLIDAY, "tue", [22.0] * 96)

    assert temp_calls == []
    assert mode_calls == []
    entry_id = data.engine.entry_id
    assert stored_day(hass_storage, entry_id, ZONE_A, "work", "wed") == [21.0] * 96
    assert stored_day(hass_storage, entry_id, ZONE_A, "holiday", "tue") == [22.0] * 96


async def test_copy_day_copies_saved_values(
    hass, hass_storage, setup_at, climate_calls
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 8))
    monday = step_day(17.0, 21.5, SLOT_0800)
    await data.engine.async_save_day(ZONE_A, Scenario.WORK, "mon", monday)
    updates = []
    async_dispatcher_connect(
        hass,
        SIGNAL_UPDATED.format(entry_id=data.engine.entry_id),
        callback(lambda: updates.append(None)),
    )
    temp_calls.clear()
    mode_calls.clear()

    await data.engine.async_copy_day(ZONE_A, Scenario.WORK, "mon", "tue")

    assert data.store.get_week(ZONE_A, Scenario.WORK)["tue"] == monday
    entry_id = data.engine.entry_id
    assert stored_day(hass_storage, entry_id, ZONE_A, "work", "tue") == monday
    # Tuesday is today and its 08:00 value changed from 19.0 to 21.5.
    assert temperatures(temp_calls) == [(ZONE_A, 21.5)]
    assert len(updates) == 1


async def test_save_dispatches_before_climate_call(hass, setup_at):
    data = await setup_at(at(10, 8))
    order = []
    entered = asyncio.Event()
    release = asyncio.Event()
    async_dispatcher_connect(
        hass,
        SIGNAL_UPDATED.format(entry_id=data.engine.entry_id),
        callback(lambda: order.append("dispatch")),
    )

    async def hung_climate_service(call):
        order.append(call_value(call))
        entered.set()
        await release.wait()

    register_climate_services(hass, hung_climate_service)

    save = hass.async_create_task(
        data.engine.async_save_day(ZONE_A, Scenario.WORK, "tue", [21.0] * 96)
    )
    await entered.wait()
    # The climate call is still hanging and the update is already out.
    assert order == ["dispatch", (ZONE_A, 21.0)]

    release.set()
    await save
    assert order == ["dispatch", (ZONE_A, 21.0)]


async def test_save_today_replaces_pending_temperature(
    hass, setup_at, time_travel, climate_calls
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 6, 59, 59))
    data.store.set_day(ZONE_A, Scenario.WORK, "tue", step_day(15.0, 19.0, SLOT_0700))
    hass.states.async_set(ZONE_A, "unavailable")
    await time_travel(at(10, 7))
    assert data.engine._pending == {ZONE_A: PendingCommand(None, 19.0)}
    temp_calls.clear()

    # Other day, or the inactive program: the current value is unchanged.
    await data.engine.async_save_day(ZONE_A, Scenario.WORK, "wed", [22.0] * 96)
    await data.engine.async_save_day(ZONE_A, Scenario.HOLIDAY, "tue", [22.0] * 96)
    assert data.engine._pending == {ZONE_A: PendingCommand(None, 19.0)}

    await data.engine.async_save_day(ZONE_A, Scenario.WORK, "tue", [21.0] * 96)
    assert temp_calls == []
    assert data.engine._pending == {ZONE_A: PendingCommand(None, 21.0)}

    hass.states.async_set(ZONE_A, "heat", {**ZONE_ATTRIBUTES, "temperature": 15.0})
    await hass.async_block_till_done()
    assert temperatures(temp_calls) == [(ZONE_A, 21.0)]
    assert mode_calls == []
    assert data.engine._pending == {}


@pytest.mark.parametrize(
    "values",
    [
        [19.0] * 95,
        [19.0] * 95 + [math.nan],
        [19.0] * 95 + ["19"],
        "19" * 48,
    ],
    ids=["95_values", "nan", "string_value", "string"],
)
async def test_save_rejects_bad_values_without_storing(
    hass, hass_storage, setup_at, climate_calls, values
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 8))
    entry_id = data.engine.entry_id
    week_before = data.store.get_week(ZONE_A, Scenario.WORK)
    stored_before = stored_day(hass_storage, entry_id, ZONE_A, "work", "tue")
    temp_calls.clear()

    with pytest.raises(ValueError):
        await data.engine.async_save_day(ZONE_A, Scenario.WORK, "tue", values)

    assert data.store.get_week(ZONE_A, Scenario.WORK) == week_before
    assert stored_day(hass_storage, entry_id, ZONE_A, "work", "tue") == stored_before
    assert temp_calls == []
    assert mode_calls == []


@pytest.mark.parametrize(
    "values",
    [[19.0] * 95 + [99.0], [19.0] * 95 + [4.5], [30.5] * 96],
    ids=["above_max", "below_min", "all_above_max"],
)
async def test_save_rejects_out_of_range_values_without_storing(
    hass, hass_storage, setup_at, climate_calls, values
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 8))
    entry_id = data.engine.entry_id
    week_before = data.store.get_week(ZONE_A, Scenario.WORK)
    stored_before = stored_day(hass_storage, entry_id, ZONE_A, "work", "tue")
    temp_calls.clear()

    with pytest.raises(ValueError, match="range"):
        await data.engine.async_save_day(ZONE_A, Scenario.WORK, "tue", values)

    assert data.store.get_week(ZONE_A, Scenario.WORK) == week_before
    assert stored_day(hass_storage, entry_id, ZONE_A, "work", "tue") == stored_before
    assert temp_calls == []
    assert mode_calls == []


async def test_save_accepts_values_at_the_limits(hass, setup_at, climate_calls):
    data = await setup_at(at(10, 8))
    day = [5.0] * 48 + [30.0] * 48

    await data.engine.async_save_day(ZONE_A, Scenario.WORK, "wed", day)

    assert data.store.get_week(ZONE_A, Scenario.WORK)["wed"] == day


async def test_save_rejects_unknown_zone_program_or_weekday(
    hass, setup_at, climate_calls
):
    temp_calls, _ = climate_calls
    data = await setup_at(at(10, 8))
    week_before = data.store.get_week(ZONE_A, Scenario.WORK)
    temp_calls.clear()
    day = [21.0] * 96

    for zone_id, scenario, weekday in (
        ("climate.other", Scenario.WORK, "tue"),
        (ZONE_A, Scenario.AWAY, "tue"),
        (ZONE_A, "weekend", "tue"),
        (ZONE_A, Scenario.WORK, "tuesday"),
    ):
        with pytest.raises(ValueError):
            await data.engine.async_save_day(zone_id, scenario, weekday, day)
    with pytest.raises(ValueError):
        await data.engine.async_copy_day(ZONE_A, Scenario.WORK, "monday", "tue")
    with pytest.raises(ValueError):
        await data.engine.async_copy_day(ZONE_A, Scenario.OFF, "mon", "tue")

    assert data.store.get_week(ZONE_A, Scenario.WORK) == week_before
    assert temp_calls == []


async def test_pending_hvac_mode_is_resent_when_zone_returns(
    hass, setup_at, climate_calls
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 8))
    hass.states.async_set(ZONE_B, "unavailable")
    await data.engine.async_set_scenario(Scenario.OFF)
    assert data.engine._pending == {ZONE_B: PendingCommand("off", None)}
    temp_calls.clear()
    mode_calls.clear()

    # Back on (the Wall Display blip): the house is off, so the zone must be too.
    hass.states.async_set(ZONE_B, "heat", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()

    assert modes(mode_calls) == [(ZONE_B, "off")]
    assert temp_calls == []
    assert data.engine._pending == {}


async def test_pending_temperature_is_dropped_when_zone_returns_off(
    hass, setup_at, time_travel, climate_calls
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 6, 59, 59))
    data.store.set_day(ZONE_A, Scenario.WORK, "tue", step_day(15.0, 19.0, SLOT_0700))
    hass.states.async_set(ZONE_A, "unavailable")
    await time_travel(at(10, 7))
    assert data.engine._pending == {ZONE_A: PendingCommand(None, 19.0)}
    temp_calls.clear()
    mode_calls.clear()

    hass.states.async_set(ZONE_A, "off", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()
    assert data.engine._pending == {}
    await time_travel(at(10, 7, 15))

    assert temp_calls == []
    assert mode_calls == []


async def test_zone_unavailable_between_mode_and_temperature_keeps_it_pending(
    hass, setup_at, caplog
):
    data = await setup_at(at(10, 8))
    await data.engine.async_set_scenario(Scenario.OFF)
    sent = []

    async def climate_service(call):
        sent.append(call_value(call))
        if call.service == "set_hvac_mode" and call.data["entity_id"] == ZONE_A:
            # The Wall Display goes unavailable right after a command.
            hass.states.async_set(ZONE_A, "unavailable")

    register_climate_services(hass, climate_service)
    caplog.set_level(logging.INFO, logger=engine_module.__name__)
    caplog.clear()

    await data.engine.async_set_scenario(Scenario.WORK)

    assert sent == [(ZONE_A, "heat"), (ZONE_B, "heat"), (ZONE_B, 19.0)]
    assert data.engine._pending == {ZONE_A: PendingCommand(None, 19.0)}
    assert "climate.zone_a: set temperature" not in caplog.text

    hass.states.async_set(ZONE_A, "heat", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()

    assert sent[3:] == [(ZONE_A, 19.0)]
    assert data.engine._pending == {}
    assert "climate.zone_a: set temperature 19.0 (retry)" in caplog.text


async def test_unavailable_blip_sends_nothing(hass, setup_at, climate_calls):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 8))
    # Forced by hand to 17.0 (program 19.0): a blip must not undo it.
    hand_target = {**ZONE_ATTRIBUTES, "temperature": 17.0}
    hass.states.async_set(ZONE_A, "heat", hand_target)
    await hass.async_block_till_done()
    temp_calls.clear()
    mode_calls.clear()

    hass.states.async_set(ZONE_A, "unavailable")
    await hass.async_block_till_done()
    hass.states.async_set(ZONE_A, "heat", hand_target)
    await hass.async_block_till_done()

    assert temp_calls == []
    assert mode_calls == []
    assert data.engine._pending == {}


async def test_zone_turned_on_during_blip_receives_current_value(
    hass, setup_at, climate_calls
):
    temp_calls, mode_calls = climate_calls
    # Off before setup: the last known mode comes from the initial state.
    hand_target = {**ZONE_ATTRIBUTES, "temperature": 17.0}
    hass.states.async_set(ZONE_A, "off", hand_target)
    data = await setup_at(at(10, 8))
    data.store.set_day(ZONE_A, Scenario.WORK, "tue", [20.5] * 96)
    temp_calls.clear()
    mode_calls.clear()

    # Switched on by hand, with the new state arriving after a blip.
    hass.states.async_set(ZONE_A, "unavailable")
    await hass.async_block_till_done()
    hass.states.async_set(ZONE_A, "heat", hand_target)
    await hass.async_block_till_done()

    assert temperatures(temp_calls) == [(ZONE_A, 20.5)]
    assert mode_calls == []
    assert data.engine._pending == {}


async def test_zone_turned_on_after_missed_step_gets_one_command(
    hass, setup_at, time_travel, climate_calls
):
    temp_calls, mode_calls = climate_calls
    hand_target = {**ZONE_ATTRIBUTES, "temperature": 17.0}
    hass.states.async_set(ZONE_A, "off", hand_target)
    data = await setup_at(at(10, 6, 59, 59))
    data.store.set_day(ZONE_A, Scenario.WORK, "tue", step_day(15.0, 19.0, SLOT_0700))
    hass.states.async_set(ZONE_A, "unavailable")
    await time_travel(at(10, 7))
    assert data.engine._pending == {ZONE_A: PendingCommand(None, 19.0)}
    temp_calls.clear()

    # Comes back switched on: the switch-on value absorbs the pending step.
    hass.states.async_set(ZONE_A, "heat", hand_target)
    await hass.async_block_till_done()

    assert temperatures(temp_calls) == [(ZONE_A, 19.0)]
    assert mode_calls == []
    assert data.engine._pending == {}


@pytest.mark.parametrize("scenario", [Scenario.OFF, Scenario.AWAY])
async def test_zone_turned_on_during_blip_in_off_scenario_is_left_alone(
    hass, setup_at, climate_calls, scenario
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 8))
    await data.engine.async_set_scenario(
        scenario, at(11, 18) if scenario is Scenario.AWAY else None
    )
    hand_target = {**ZONE_ATTRIBUTES, "temperature": 17.0}
    hass.states.async_set(ZONE_A, "off", hand_target)
    await hass.async_block_till_done()
    temp_calls.clear()
    mode_calls.clear()

    hass.states.async_set(ZONE_A, "unavailable")
    await hass.async_block_till_done()
    hass.states.async_set(ZONE_A, "heat", hand_target)
    await hass.async_block_till_done()

    assert temp_calls == []
    assert mode_calls == []


async def test_return_does_not_override_queued_scenario_change(
    hass, freezer, setup_at
):
    data = await setup_at(at(10, 9, 59, 59))
    sent = []
    entered = asyncio.Event()
    release = asyncio.Event()

    async def climate_service(call):
        sent.append(call_value(call))
        entered.set()
        await release.wait()

    register_climate_services(hass, climate_service)

    # Away (return at 10:00) holds the lock, mid-way through its commands;
    # OFF is queued behind it when the return timer fires and queues too.
    away_change = hass.async_create_task(
        data.engine.async_set_scenario(Scenario.AWAY, at(10, 10))
    )
    await entered.wait()
    off_change = hass.async_create_task(data.engine.async_set_scenario(Scenario.OFF))
    for _ in range(5):
        await asyncio.sleep(0)
    freezer.move_to(at(10, 10))
    async_fire_time_changed(hass, at(10, 10))
    for _ in range(5):
        await asyncio.sleep(0)
    release.set()
    await away_change
    await off_change
    await hass.async_block_till_done()

    assert data.engine.scenario is Scenario.OFF
    assert data.engine.return_at is None
    assert sent == [(ZONE_A, "off"), (ZONE_B, "off")] * 2


async def test_hung_climate_call_times_out_and_releases_lock(
    hass, setup_integration, monkeypatch, caplog
):
    monkeypatch.setattr(engine_module, "CALL_TIMEOUT", 0.05)
    data = hass.data[DOMAIN][setup_integration.entry_id]
    for zone_id in (ZONE_A, ZONE_B):
        for weekday in WEEKDAYS:
            data.store.set_day(zone_id, Scenario.WORK, weekday, [20.0] * 96)
    sent = []
    hung = {ZONE_A}

    async def climate_service(call):
        if call.data["entity_id"] in hung:
            await asyncio.Event().wait()
        sent.append(call_value(call))

    register_climate_services(hass, climate_service)

    await asyncio.wait_for(data.engine.async_set_scenario(Scenario.OFF), 5)

    assert sent == [(ZONE_B, "off")]
    assert data.engine._pending == {ZONE_A: PendingCommand("off", None)}
    assert warnings_about(caplog, "timed out") == [
        "climate.zone_a: set hvac_mode off timed out (scenario off)"
    ]

    # The lock was released: the next change runs to completion.
    hung.clear()
    await asyncio.wait_for(data.engine.async_set_scenario(Scenario.WORK), 5)

    assert data.engine.scenario is Scenario.WORK
    assert sent[1:] == [
        (ZONE_A, "heat"),
        (ZONE_A, 20.0),
        (ZONE_B, "heat"),
        (ZONE_B, 20.0),
    ]
    assert data.engine._pending == {}


def failing_climate(hass, sent: list, failing_zone: str, error: Exception) -> None:
    """Make the climate services raise for one zone and record the other calls."""

    async def climate_service(call):
        if call.data["entity_id"] == failing_zone:
            raise error
        sent.append(call_value(call))

    register_climate_services(hass, climate_service)


async def test_unexpected_error_in_scenario_change_keeps_serving_other_zones(
    hass, hass_storage, setup_at, caplog
):
    data = await setup_at(at(10, 8))
    sent = []
    failing_climate(hass, sent, ZONE_A, ConnectionError("link down"))

    await data.engine.async_set_scenario(Scenario.OFF)

    assert sent == [(ZONE_B, "off")]
    assert data.engine.scenario is Scenario.OFF
    assert data.engine._pending == {ZONE_A: PendingCommand("off", None)}
    assert "climate.zone_a: set hvac_mode off failed (scenario off)" in caplog.text


async def test_unexpected_error_on_quarter_keeps_serving_other_zones(
    hass, setup_at, time_travel
):
    data = await setup_at(at(10, 6, 59, 59))
    for zone_id in (ZONE_A, ZONE_B):
        data.store.set_day(
            zone_id, Scenario.WORK, "tue", step_day(15.0, 19.0, SLOT_0700)
        )
    updates = []
    async_dispatcher_connect(
        hass,
        SIGNAL_UPDATED.format(entry_id=data.engine.entry_id),
        callback(lambda: updates.append(None)),
    )
    sent = []
    failing_climate(hass, sent, ZONE_A, ConnectionError("link down"))

    await time_travel(at(10, 7))

    assert sent == [(ZONE_B, 19.0)]
    assert data.engine._pending == {ZONE_A: PendingCommand(None, 19.0)}
    assert len(updates) == 1


async def test_unexpected_error_at_startup_keeps_serving_other_zones(hass, setup_at):
    sent = []
    failing_climate(hass, sent, ZONE_A, ConnectionError("link down"))

    data = await setup_at(at(10, 8))

    assert sent == [(ZONE_B, 19.0)]
    assert data.engine._pending == {ZONE_A: PendingCommand(None, 19.0)}


async def test_zone_switched_off_by_hand_drops_pending_heat(
    hass, setup_at, time_travel
):
    data = await setup_at(at(10, 7, 50))
    await data.engine.async_set_scenario(Scenario.OFF)
    for zone_id in (ZONE_A, ZONE_B):
        hass.states.async_set(zone_id, "off", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()
    sent = []
    failures = [HomeAssistantError("climate failure")] * 2

    async def climate_service(call):
        sent.append(call_value(call))
        if call.service == "set_hvac_mode" and failures:
            raise failures.pop()

    register_climate_services(hass, climate_service)
    # Work cannot switch either zone on: both keep heat pending.
    await data.engine.async_set_scenario(Scenario.WORK)
    assert data.engine._pending == {
        ZONE_A: PendingCommand("heat", 19.0),
        ZONE_B: PendingCommand("heat", 19.0),
    }

    # Zone A is switched on and then off again by hand; zone B stays off.
    hass.states.async_set(ZONE_A, "heat", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()
    hass.states.async_set(ZONE_A, "off", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()
    assert data.engine._pending == {ZONE_B: PendingCommand("heat", 19.0)}
    sent.clear()

    # The retry still switches on zone B, which never got the scenario change.
    await time_travel(at(10, 8))
    assert sent == [(ZONE_B, "heat"), (ZONE_B, 19.0)]


async def test_unload_stops_timers_and_queued_work(
    hass, hass_storage, config_entry, setup_at, time_travel
):
    data = await setup_at(at(10, 8))
    engine = data.engine
    key = f"chronothermostat.{config_entry.entry_id}"
    # Away until 09:00 while both zones are unavailable: their "off" stays pending.
    for zone_id in (ZONE_A, ZONE_B):
        hass.states.async_set(zone_id, "unavailable")
    await engine.async_set_scenario(Scenario.AWAY, at(10, 9))
    assert engine._pending == {
        ZONE_A: PendingCommand("off", None),
        ZONE_B: PendingCommand("off", None),
    }
    sent = []
    entered = asyncio.Event()
    release = asyncio.Event()

    async def hung_climate_service(call):
        sent.append(call_value(call))
        entered.set()
        await release.wait()

    register_climate_services(hass, hung_climate_service)

    # Zone A comes back: its retry holds the lock, hung on the climate call.
    # Zone B's retry and a scenario change queue behind it.
    hass.states.async_set(ZONE_A, "heat", ZONE_ATTRIBUTES)
    await entered.wait()
    hass.states.async_set(ZONE_B, "heat", ZONE_ATTRIBUTES)
    queued_change = hass.async_create_task(engine.async_set_scenario(Scenario.WORK))
    for _ in range(5):
        await asyncio.sleep(0)
    stored_before = deepcopy(hass_storage[key])

    assert await hass.config_entries.async_unload(config_entry.entry_id)
    release.set()
    with pytest.raises(HomeAssistantError):
        await queued_change
    await time_travel(at(10, 8, 15))
    await time_travel(at(10, 9))
    await time_travel(at(10, 9, 15))

    assert config_entry.state is ConfigEntryState.NOT_LOADED
    assert sent == [(ZONE_A, "off")]
    assert hass_storage[key] == stored_before


async def test_public_calls_after_unload_raise_and_change_nothing(
    hass, hass_storage, config_entry, setup_at, climate_calls
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 8))
    engine = data.engine
    key = f"chronothermostat.{config_entry.entry_id}"
    assert await hass.config_entries.async_unload(config_entry.entry_id)
    stored_before = deepcopy(hass_storage[key])
    temp_calls.clear()
    mode_calls.clear()

    for public_call in (
        lambda: engine.async_set_scenario(Scenario.OFF),
        lambda: engine.async_set_return_at(at(10, 9)),
        lambda: engine.async_save_day(ZONE_A, Scenario.WORK, "tue", [21.0] * 96),
        lambda: engine.async_copy_day(ZONE_A, Scenario.WORK, "mon", "tue"),
    ):
        with pytest.raises(HomeAssistantError):
            await public_call()

    assert temp_calls == []
    assert mode_calls == []
    assert hass_storage[key] == stored_before


async def test_zone_switched_off_while_heat_call_is_in_flight_stays_off(
    hass, setup_at, time_travel
):
    data = await setup_at(at(10, 7, 50))
    await data.engine.async_set_scenario(Scenario.OFF)
    for zone_id in (ZONE_A, ZONE_B):
        hass.states.async_set(zone_id, "off", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()
    sent = []

    async def climate_service(call):
        sent.append(call_value(call))
        if call.data["entity_id"] == ZONE_A and call.service == "set_hvac_mode":
            # The thermostat obeys, the user switches it off again by hand,
            # and only then the call fails: the hand wins.
            hass.states.async_set(ZONE_A, "heat", FORCED_ATTRIBUTES)
            hass.states.async_set(ZONE_A, "off", FORCED_ATTRIBUTES)
            raise TimeoutError

    register_climate_services(hass, climate_service)
    await data.engine.async_set_scenario(Scenario.WORK)
    await hass.async_block_till_done()

    assert sent == [(ZONE_A, "heat"), (ZONE_B, "heat"), (ZONE_B, 19.0)]
    assert data.engine._pending == {}
    sent.clear()

    await time_travel(at(10, 8))
    assert sent == []
    assert hass.states.get(ZONE_A).state == "off"


async def test_failed_mode_call_that_landed_counts_as_delivered(
    hass, setup_at, time_travel
):
    data = await setup_at(at(10, 7, 50))
    await data.engine.async_set_scenario(Scenario.OFF)
    for zone_id in (ZONE_A, ZONE_B):
        hass.states.async_set(zone_id, "off", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()
    sent = []

    async def climate_service(call):
        sent.append(call_value(call))
        if call.data["entity_id"] == ZONE_A and call.service == "set_hvac_mode":
            # The thermostat switches on but answers too late.
            hass.states.async_set(ZONE_A, "heat", ZONE_ATTRIBUTES)
            raise TimeoutError

    register_climate_services(hass, climate_service)
    await data.engine.async_set_scenario(Scenario.WORK)
    await hass.async_block_till_done()

    # The mode is not retried and the temperature follows at once.
    assert sent == [(ZONE_A, "heat"), (ZONE_A, 19.0), (ZONE_B, "heat"), (ZONE_B, 19.0)]
    assert data.engine._pending == {}


async def test_zone_switched_on_by_hand_after_a_late_off_is_left_alone(
    hass, setup_at, time_travel
):
    data = await setup_at(at(10, 7, 50))
    sent = []

    async def climate_service(call):
        sent.append(call_value(call))
        if call.data["entity_id"] == ZONE_A:
            raise TimeoutError

    register_climate_services(hass, climate_service)
    await data.engine.async_set_scenario(Scenario.OFF)
    assert data.engine._pending == {ZONE_A: PendingCommand("off", None)}

    # The off lands late: nothing is left to retry.
    hass.states.async_set(ZONE_A, "off", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()
    assert data.engine._pending == {}

    # Switched on by hand with the house off: left alone (§4.6).
    hass.states.async_set(ZONE_A, "heat", {**ZONE_ATTRIBUTES, "temperature": 21.0})
    await hass.async_block_till_done()
    sent.clear()
    await time_travel(at(10, 8))
    assert sent == []
    assert hass.states.get(ZONE_A).state == "heat"


async def test_pending_off_is_dropped_when_zone_returns_already_off(
    hass, setup_at, climate_calls
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 8))
    hass.states.async_set(ZONE_B, "unavailable")
    await data.engine.async_set_scenario(Scenario.OFF)
    assert data.engine._pending == {ZONE_B: PendingCommand("off", None)}
    mode_calls.clear()

    hass.states.async_set(ZONE_B, "off", ZONE_ATTRIBUTES)
    await hass.async_block_till_done()

    assert mode_calls == []
    assert data.engine._pending == {}
