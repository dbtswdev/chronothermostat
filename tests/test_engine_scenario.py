"""Tests for scenario changes, the return timer and startup."""

from datetime import UTC, datetime
from zoneinfo import ZoneInfo

import pytest
from homeassistant.const import EVENT_CALL_SERVICE
from homeassistant.core import callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from pytest_homeassistant_custom_component.common import async_capture_events

from custom_components.chronothermostat.const import SIGNAL_UPDATED, Scenario

ROME = ZoneInfo("Europe/Rome")
ZONE_A = "climate.zone_a"
ZONE_B = "climate.zone_b"


def at(day: int, hour: int, minute: int = 0) -> datetime:
    """Return a Europe/Rome wall-clock time in November 2026 (10 = Tuesday)."""
    return datetime(2026, 11, day, hour, minute, tzinfo=ROME)


def commands(events) -> list[tuple[str, dict]]:
    """Return the climate service calls, in the order they were made."""
    return [
        (event.data["service"], dict(event.data["service_data"]))
        for event in events
        if event.data["domain"] == "climate"
    ]


def heat(zone_id: str) -> tuple[str, dict]:
    return ("set_hvac_mode", {"entity_id": zone_id, "hvac_mode": "heat"})


def off(zone_id: str) -> tuple[str, dict]:
    return ("set_hvac_mode", {"entity_id": zone_id, "hvac_mode": "off"})


def temperature(zone_id: str, value: float) -> tuple[str, dict]:
    return ("set_temperature", {"entity_id": zone_id, "temperature": value})


def stored(hass_storage, entry_id: str) -> dict:
    """Return the persisted scenario data of the entry."""
    data = hass_storage[f"chronothermostat.{entry_id}"]["data"]
    return {"scenario": data["scenario"], "return_at": data["return_at"]}


async def test_set_scenario_work_turns_zones_on_and_sends_current_value(
    hass, setup_at
):
    data = await setup_at(at(10, 8))
    data.store.set_day(ZONE_A, Scenario.WORK, "tue", [20.5] * 96)
    await data.engine.async_set_scenario(Scenario.OFF)
    for zone_id in (ZONE_A, ZONE_B):
        hass.states.async_set(zone_id, "off", {"temperature": 19.0})
    events = async_capture_events(hass, EVENT_CALL_SERVICE)

    await data.engine.async_set_scenario(Scenario.WORK)

    assert commands(events) == [
        heat(ZONE_A),
        temperature(ZONE_A, 20.5),
        heat(ZONE_B),
        temperature(ZONE_B, 19.0),
    ]
    assert data.engine.scenario is Scenario.WORK


async def test_set_scenario_off_turns_zones_off(hass, hass_storage, setup_at):
    data = await setup_at(at(10, 8))
    updates = []
    async_dispatcher_connect(
        hass,
        SIGNAL_UPDATED.format(entry_id=data.engine.entry_id),
        callback(lambda: updates.append(None)),
    )
    events = async_capture_events(hass, EVENT_CALL_SERVICE)

    await data.engine.async_set_scenario(Scenario.OFF)

    assert commands(events) == [off(ZONE_A), off(ZONE_B)]
    assert data.engine.scenario is Scenario.OFF
    assert data.engine.return_at is None
    assert stored(hass_storage, data.engine.entry_id) == {
        "scenario": "off",
        "return_at": None,
    }
    assert len(updates) == 1


async def test_set_scenario_away_requires_future_return(
    hass, hass_storage, setup_at
):
    data = await setup_at(at(10, 8))
    events = async_capture_events(hass, EVENT_CALL_SERVICE)
    naive_future = datetime(2026, 11, 10, 12, 0)

    for return_at in (None, naive_future):
        with pytest.raises(ValueError):
            await data.engine.async_set_scenario(Scenario.AWAY, return_at)

    assert data.engine.scenario is Scenario.WORK
    assert data.engine.return_at is None
    assert stored(hass_storage, data.engine.entry_id) == {
        "scenario": "work",
        "return_at": None,
    }
    assert commands(events) == []


async def test_set_scenario_away_rejects_past_return(
    hass, hass_storage, setup_at, time_travel
):
    data = await setup_at(at(10, 8))
    planned = at(12, 18)
    await data.engine.async_set_return_at(planned)
    events = async_capture_events(hass, EVENT_CALL_SERVICE)

    with pytest.raises(ValueError):
        await data.engine.async_set_scenario(Scenario.AWAY, at(10, 7, 45))

    assert data.engine.scenario is Scenario.WORK
    assert data.engine.return_at == planned
    assert stored(hass_storage, data.engine.entry_id) == {
        "scenario": "work",
        "return_at": planned.astimezone(UTC).isoformat(),
    }
    await time_travel(at(10, 8, 5))
    assert data.engine.scenario is Scenario.WORK
    assert commands(events) == []


@pytest.mark.parametrize(
    "return_at",
    [None, at(10, 7), datetime(2026, 11, 10, 12, 0)],
    ids=["none", "past", "naive"],
)
async def test_entity_can_set_away_without_return(
    hass, hass_storage, setup_at, time_travel, return_at
):
    data = await setup_at(at(10, 8))
    events = async_capture_events(hass, EVENT_CALL_SERVICE)

    await data.engine.async_set_scenario(Scenario.AWAY, return_at, source="entity")

    assert data.engine.scenario is Scenario.AWAY
    assert data.engine.return_at is None
    assert stored(hass_storage, data.engine.entry_id) == {
        "scenario": "away",
        "return_at": None,
    }
    assert commands(events) == [off(ZONE_A), off(ZONE_B)]

    # No return timer: hours later the house is still away and untouched.
    await time_travel(at(10, 13))
    assert data.engine.scenario is Scenario.AWAY
    assert commands(events) == [off(ZONE_A), off(ZONE_B)]


async def test_return_timer_switches_to_work(hass, hass_storage, setup_at, time_travel):
    data = await setup_at(at(10, 8))
    data.store.set_day(ZONE_A, Scenario.WORK, "tue", [21.0] * 96)
    await data.engine.async_set_scenario(Scenario.AWAY, at(10, 10))
    assert data.engine.return_at == at(10, 10)
    events = async_capture_events(hass, EVENT_CALL_SERVICE)

    await time_travel(at(10, 9, 59))
    assert data.engine.scenario is Scenario.AWAY
    assert commands(events) == []

    await time_travel(at(10, 10))
    assert data.engine.scenario is Scenario.WORK
    assert data.engine.return_at is None
    assert stored(hass_storage, data.engine.entry_id) == {
        "scenario": "work",
        "return_at": None,
    }
    assert commands(events) == [
        heat(ZONE_A),
        temperature(ZONE_A, 21.0),
        heat(ZONE_B),
        temperature(ZONE_B, 19.0),
    ]


async def test_set_return_at_rearms_return_timer(hass, setup_at, time_travel):
    data = await setup_at(at(10, 8))
    updates = []
    async_dispatcher_connect(
        hass,
        SIGNAL_UPDATED.format(entry_id=data.engine.entry_id),
        callback(lambda: updates.append(None)),
    )
    await data.engine.async_set_scenario(Scenario.AWAY, at(10, 10))

    await data.engine.async_set_return_at(at(10, 11))
    assert data.engine.return_at == at(10, 11)
    assert len(updates) == 2
    await time_travel(at(10, 10, 30))
    assert data.engine.scenario is Scenario.AWAY
    await time_travel(at(10, 11))
    assert data.engine.scenario is Scenario.WORK

    # A naive return time is no return: the timer is cancelled.
    await data.engine.async_set_scenario(Scenario.AWAY, at(10, 12))
    await data.engine.async_set_return_at(datetime(2026, 11, 10, 12, 0))
    assert data.engine.return_at is None
    await time_travel(at(10, 13))
    assert data.engine.scenario is Scenario.AWAY


async def test_startup_switches_to_work_when_return_passed(
    hass, hass_storage, config_entry, setup_at
):
    key = f"chronothermostat.{config_entry.entry_id}"
    hass_storage[key] = {
        "version": 1,
        "minor_version": 1,
        "key": key,
        "data": {
            "scenario": "away",
            "return_at": at(10, 7).astimezone(UTC).isoformat(),
            "zones": {},
        },
    }
    events = async_capture_events(hass, EVENT_CALL_SERVICE)

    data = await setup_at(at(10, 8))

    assert data.engine.scenario is Scenario.WORK
    assert data.engine.return_at is None
    assert stored(hass_storage, config_entry.entry_id) == {
        "scenario": "work",
        "return_at": None,
    }
    assert commands(events) == [
        heat(ZONE_A),
        temperature(ZONE_A, 19.0),
        heat(ZONE_B),
        temperature(ZONE_B, 19.0),
    ]


async def test_startup_applies_current_value_to_zones_on(hass, setup_at):
    hass.states.async_set(ZONE_B, "off", {"temperature": 19.0})
    events = async_capture_events(hass, EVENT_CALL_SERVICE)

    await setup_at(at(10, 5))

    # 05:00 is in the default night band (16.0); the off zone is left alone.
    assert commands(events) == [temperature(ZONE_A, 16.0)]
