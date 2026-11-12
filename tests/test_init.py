"""Tests for entry setup, unload and removal."""

from datetime import datetime
import logging
from unittest.mock import AsyncMock
from zoneinfo import ZoneInfo

from homeassistant.config_entries import ConfigEntryState
from homeassistant.helpers import entity_registry as er
from homeassistant.util.unit_system import US_CUSTOMARY_SYSTEM

from custom_components.chronothermostat import ChronoData
from custom_components.chronothermostat.const import DOMAIN, Scenario

ROME = ZoneInfo("Europe/Rome")


def at(hour: int, minute: int = 0, second: int = 0) -> datetime:
    """Return a Europe/Rome wall-clock time on Tuesday 10 November 2026."""
    return datetime(2026, 11, 10, hour, minute, second, tzinfo=ROME)


async def test_setup_and_unload(hass, config_entry, two_climates, climate_calls):
    await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    assert config_entry.state is ConfigEntryState.LOADED

    data = hass.data[DOMAIN][config_entry.entry_id]
    assert isinstance(data, ChronoData)
    assert data.zone_ids == two_climates
    assert data.store.zone_ids == two_climates

    await hass.config_entries.async_unload(config_entry.entry_id)
    await hass.async_block_till_done()
    assert config_entry.state is ConfigEntryState.NOT_LOADED
    assert DOMAIN not in hass.data


async def test_failed_platform_setup_stops_the_engine(
    hass, config_entry, climate_calls, freezer, time_travel, monkeypatch
):
    temp_calls, mode_calls = climate_calls
    monkeypatch.setattr(
        hass.config_entries,
        "async_forward_entry_setups",
        AsyncMock(side_effect=RuntimeError("platform failure")),
    )
    freezer.move_to(at(5, 59, 59))

    await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    assert config_entry.state is ConfigEntryState.SETUP_ERROR
    assert DOMAIN not in hass.data
    temp_calls.clear()
    mode_calls.clear()

    # 06:00 is a step of the default program: a running engine would send it.
    await time_travel(at(6))

    assert temp_calls == []
    assert mode_calls == []


async def test_setup_refuses_non_celsius_systems(
    hass, config_entry, climate_calls, caplog
):
    temp_calls, mode_calls = climate_calls
    hass.config.units = US_CUSTOMARY_SYSTEM

    await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()

    assert config_entry.state is ConfigEntryState.SETUP_ERROR
    assert DOMAIN not in hass.data
    assert temp_calls == []
    assert mode_calls == []
    assert [
        record.getMessage()
        for record in caplog.records
        if record.levelno == logging.ERROR
        and record.name.startswith(f"custom_components.{DOMAIN}")
    ] == [
        "Chronothermostat works only with temperatures in °C; "
        "switch Home Assistant to the metric unit system"
    ]


async def test_removing_the_entry_deletes_its_programs(
    hass, hass_storage, setup_integration
):
    entry = setup_integration
    key = f"chronothermostat.{entry.entry_id}"
    assert key in hass_storage

    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()

    assert key not in hass_storage


async def test_renamed_climate_keeps_its_zone_program_and_sensor(
    hass, config_entry, two_climates, climate_calls
):
    registry = er.async_get(hass)
    # Give zone A a registry entry (the fixture only sets its state).
    state = hass.states.get("climate.zone_a")
    hass.states.async_remove("climate.zone_a")
    climate = registry.async_get_or_create(
        "climate", "demo", "a", suggested_object_id="zone_a"
    )
    assert climate.entity_id == "climate.zone_a"
    hass.states.async_set("climate.zone_a", state.state, state.attributes)
    await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    entry_id = config_entry.entry_id
    data = hass.data[DOMAIN][entry_id]
    data.store.set_day("climate.zone_a", Scenario.WORK, "mon", [21.0] * 96)
    await data.store.async_save()
    sensor_id = registry.async_get_entity_id(
        "sensor", DOMAIN, f"{entry_id}_climate.zone_a_status"
    )
    assert sensor_id is not None

    # Home Assistant renames the entity: its state moves to the new id.
    hass.states.async_remove("climate.zone_a")
    registry.async_update_entity("climate.zone_a", new_entity_id="climate.living")
    hass.states.async_set("climate.living", state.state, state.attributes)
    await hass.async_block_till_done()

    assert config_entry.state is ConfigEntryState.LOADED
    data = hass.data[DOMAIN][entry_id]
    assert data.zone_ids == ["climate.living", "climate.zone_b"]
    assert data.store.zone_ids == ["climate.living", "climate.zone_b"]
    assert data.store.get_week("climate.living", Scenario.WORK)["mon"] == [21.0] * 96
    # The status sensor is the same entity, now of the renamed zone.
    assert registry.async_get(sensor_id).unique_id == f"{entry_id}_climate.living_status"
    assert hass.states.get(sensor_id).attributes["zone"] == "climate.living"
    assert hass.states.get(sensor_id).state != "unavailable"


async def test_rename_onto_another_configured_zone_changes_nothing(
    hass, config_entry, two_climates, climate_calls, caplog
):
    registry = er.async_get(hass)
    state = hass.states.get("climate.zone_a")
    hass.states.async_remove("climate.zone_a")
    registry.async_get_or_create("climate", "demo", "a", suggested_object_id="zone_a")
    hass.states.async_set("climate.zone_a", state.state, state.attributes)
    # Zone B is configured but its climate is gone, so its id is free.
    hass.states.async_remove("climate.zone_b")
    await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    data = hass.data[DOMAIN][config_entry.entry_id]
    data.store.set_day("climate.zone_a", Scenario.WORK, "mon", [21.0] * 96)
    data.store.set_day("climate.zone_b", Scenario.WORK, "mon", [17.0] * 96)
    await data.store.async_save()

    hass.states.async_remove("climate.zone_a")
    registry.async_update_entity("climate.zone_a", new_entity_id="climate.zone_b")
    hass.states.async_set("climate.zone_b", state.state, state.attributes)
    await hass.async_block_till_done()

    # Two zones cannot share one climate: nothing is moved, and it is logged.
    data = hass.data[DOMAIN][config_entry.entry_id]
    assert data.zone_ids == two_climates
    assert data.store.get_week("climate.zone_a", Scenario.WORK)["mon"] == [21.0] * 96
    assert data.store.get_week("climate.zone_b", Scenario.WORK)["mon"] == [17.0] * 96
    assert "already a zone" in caplog.text
    assert not [r for r in caplog.records if r.levelno >= logging.ERROR]
