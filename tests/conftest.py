"""Shared test fixtures."""

from datetime import datetime

import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
    async_mock_service,
)

from custom_components.chronothermostat import ChronoData
from custom_components.chronothermostat.const import DOMAIN


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Enable loading of custom integrations in all tests."""
    yield


@pytest.fixture
async def rome_time_zone(hass):
    """Run Home Assistant on Europe/Rome local time."""
    await hass.config.async_set_time_zone("Europe/Rome")


@pytest.fixture
def climate_calls(hass):
    """Mock the climate services and return (temp_calls, mode_calls)."""
    temp_calls = async_mock_service(hass, "climate", "set_temperature")
    mode_calls = async_mock_service(hass, "climate", "set_hvac_mode")
    return temp_calls, mode_calls


@pytest.fixture
def two_climates(hass):
    """Register two climate states and return their entity ids."""
    for entity_id, name in (
        ("climate.zone_a", "Zone A"),
        ("climate.zone_b", "Zone B"),
    ):
        hass.states.async_set(
            entity_id,
            "heat",
            {
                "temperature": 19.0,
                "min_temp": 5,
                "max_temp": 30,
                "hvac_modes": ["off", "heat"],
                "friendly_name": name,
            },
        )
    return ["climate.zone_a", "climate.zone_b"]


@pytest.fixture
def config_entry(hass, rome_time_zone, two_climates):
    """Return a Chronothermostat config entry with both zones."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Chronothermostat",
        unique_id="chronothermostat",
        data={"zones": two_climates},
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
async def setup_integration(hass, config_entry, climate_calls):
    """Set up the integration and yield its entry."""
    await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    yield config_entry


@pytest.fixture
def setup_at(hass, freezer, config_entry, climate_calls):
    """Return a coroutine that freezes time, sets up the entry and returns its data."""

    async def _setup_at(when: datetime) -> ChronoData:
        freezer.move_to(when)
        await hass.config_entries.async_setup(config_entry.entry_id)
        await hass.async_block_till_done()
        return hass.data[DOMAIN][config_entry.entry_id]

    return _setup_at


@pytest.fixture
def time_travel(hass, freezer):
    """Return a coroutine that moves time forward and runs the due timers."""

    async def _time_travel(when: datetime) -> None:
        freezer.move_to(when)
        async_fire_time_changed(hass, when)
        await hass.async_block_till_done()

    return _time_travel
