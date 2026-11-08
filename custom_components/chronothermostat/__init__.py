"""The Chronothermostat integration."""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import CONF_ZONES, DOMAIN, PLATFORMS
from .engine import Engine
from .services import async_register_services
from .storage import ProgramStore
from .websocket import async_register_websocket

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


@dataclass
class ChronoData:
    """Runtime objects of a config entry."""

    store: ProgramStore
    engine: Engine
    zone_ids: list[str]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the services and websocket commands once."""
    async_register_services(hass)
    async_register_websocket(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Chronothermostat from a config entry."""
    zone_ids: list[str] = list(entry.options.get(CONF_ZONES, entry.data[CONF_ZONES]))

    store = ProgramStore(hass, entry.entry_id)
    await store.async_load()
    for zone_id in zone_ids:
        store.ensure_zone(zone_id)
    await store.async_save()

    engine = Engine(hass, entry.entry_id, store, zone_ids)
    await engine.async_start()

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = ChronoData(
        store, engine, zone_ids
    )
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    data: ChronoData = hass.data[DOMAIN].pop(entry.entry_id)
    await data.engine.async_stop()
    if not hass.data[DOMAIN]:
        hass.data.pop(DOMAIN)
    return True
