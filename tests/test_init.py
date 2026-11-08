"""Tests for entry setup and unload."""

from datetime import datetime
import logging
from unittest.mock import AsyncMock
from zoneinfo import ZoneInfo

from homeassistant.config_entries import ConfigEntryState
from homeassistant.util.unit_system import US_CUSTOMARY_SYSTEM

from custom_components.chronothermostat import ChronoData
from custom_components.chronothermostat.const import DOMAIN

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
