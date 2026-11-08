"""Tests for entry setup and unload."""

from homeassistant.config_entries import ConfigEntryState

from custom_components.chronothermostat import ChronoData
from custom_components.chronothermostat.const import DOMAIN


async def test_setup_and_unload(hass, config_entry, two_climates):
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
