"""Tests for the engine's quarter-hour ticks."""

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from custom_components.chronothermostat.const import Scenario

ROME = ZoneInfo("Europe/Rome")
ZONE_A = "climate.zone_a"
ZONE_B = "climate.zone_b"
SLOT_0700 = 28


def at(day: int, hour: int, minute: int = 0, second: int = 0) -> datetime:
    """Return a Europe/Rome wall-clock time in November 2026 (10 = Tuesday)."""
    return datetime(2026, 11, day, hour, minute, second, tzinfo=ROME)


def step_day(before: float, after: float, from_slot: int) -> list[float]:
    """Return a program day that changes from `before` to `after` at a slot."""
    return [before] * from_slot + [after] * (96 - from_slot)


def temperatures(temp_calls) -> list[tuple[str, float]]:
    """Return the (entity_id, temperature) pairs of set_temperature calls."""
    return [(c.data["entity_id"], c.data["temperature"]) for c in temp_calls]


async def test_quarter_step_sends_set_temperature(setup_at, time_travel, climate_calls):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 6, 59, 59))
    data.store.set_day(
        ZONE_A, Scenario.WORK, "tue", step_day(15.0, 19.0, SLOT_0700)
    )
    temp_calls.clear()
    mode_calls.clear()

    await time_travel(at(10, 7))

    assert temperatures(temp_calls) == [(ZONE_A, 19.0)]
    assert mode_calls == []


async def test_quarter_without_step_sends_nothing(setup_at, time_travel, climate_calls):
    temp_calls, mode_calls = climate_calls
    await setup_at(at(10, 6, 59, 59))
    temp_calls.clear()
    mode_calls.clear()

    await time_travel(at(10, 7))
    await time_travel(at(10, 7, 15))

    assert temp_calls == []
    assert mode_calls == []


async def test_zone_off_is_not_touched_on_step(
    hass, setup_at, time_travel, climate_calls
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 6, 59, 59))
    for zone_id in (ZONE_A, ZONE_B):
        data.store.set_day(
            zone_id, Scenario.WORK, "tue", step_day(15.0, 19.0, SLOT_0700)
        )
    hass.states.async_set(ZONE_A, "off", {"temperature": 15.0})
    temp_calls.clear()
    mode_calls.clear()

    await time_travel(at(10, 7))

    assert temperatures(temp_calls) == [(ZONE_B, 19.0)]
    assert mode_calls == []


@pytest.mark.parametrize("scenario", [Scenario.AWAY, Scenario.OFF])
async def test_no_commands_in_away_or_off(
    setup_at, time_travel, climate_calls, scenario
):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 6, 59, 59))
    for zone_id in (ZONE_A, ZONE_B):
        data.store.set_day(
            zone_id, Scenario.WORK, "tue", step_day(15.0, 19.0, SLOT_0700)
        )
    return_at = at(10, 6, 59, 59) + timedelta(days=1)
    await data.engine.async_set_scenario(
        scenario, return_at if scenario is Scenario.AWAY else None
    )
    # The mocked services do not change the states: both zones still read
    # "heat", so only the scenario keeps the step from being sent.
    temp_calls.clear()
    mode_calls.clear()

    await time_travel(at(10, 7))

    assert temp_calls == []
    assert mode_calls == []


async def test_midnight_step_sends_new_day_value(setup_at, time_travel, climate_calls):
    temp_calls, mode_calls = climate_calls
    data = await setup_at(at(10, 23, 59, 59))
    # Tuesday ends at 16.0 (default program); Wednesday starts at 18.0.
    data.store.set_day(ZONE_A, Scenario.WORK, "wed", step_day(18.0, 19.0, 24))
    temp_calls.clear()
    mode_calls.clear()

    await time_travel(at(11, 0))

    assert temperatures(temp_calls) == [(ZONE_A, 18.0)]
    assert mode_calls == []


async def test_quarter_tick_dispatches_update(hass, setup_at, time_travel):
    from homeassistant.helpers.dispatcher import async_dispatcher_connect

    from custom_components.chronothermostat.const import SIGNAL_UPDATED

    data = await setup_at(at(10, 6, 59, 59))
    calls = []
    async_dispatcher_connect(
        hass, SIGNAL_UPDATED.format(entry_id=data.engine.entry_id), lambda: calls.append(1)
    )

    await time_travel(at(10, 7))

    assert calls
