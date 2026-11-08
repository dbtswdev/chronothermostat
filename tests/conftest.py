"""Shared test fixtures."""

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.chronothermostat.const import DOMAIN


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Enable loading of custom integrations in all tests."""
    yield


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
def config_entry(hass, two_climates):
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
async def setup_integration(hass, config_entry):
    """Set up the integration and yield its entry."""
    await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    yield config_entry
