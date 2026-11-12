"""The Chronothermostat integration."""

from __future__ import annotations

from dataclasses import dataclass
import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfTemperature
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import config_validation as cv, entity_registry as er
from homeassistant.helpers.event import async_track_entity_registry_updated_event
from homeassistant.helpers.typing import ConfigType

from .const import CONF_ZONES, DOMAIN, PLATFORMS, status_unique_id
from .engine import Engine
from .frontend import async_register_frontend
from .services import async_register_services
from .storage import ProgramStore
from .websocket import async_register_websocket

_LOGGER = logging.getLogger(__name__)

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
    if hass.config.units.temperature_unit != UnitOfTemperature.CELSIUS:
        _LOGGER.error(
            "Chronothermostat works only with temperatures in °C; "
            "switch Home Assistant to the metric unit system"
        )
        return False
    await async_register_frontend(hass)

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
    try:
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    except Exception:
        _pop_data(hass, entry)
        await engine.async_stop()
        raise

    @callback
    def on_zone_registry_update(
        event: Event[er.EventEntityRegistryUpdatedData],
    ) -> None:
        """Follow a zone whose climate entity id was changed."""
        if event.data["action"] == "update" and "old_entity_id" in event.data:
            entry.async_create_task(
                hass,
                _async_rename_zone(
                    hass, entry, event.data["old_entity_id"], event.data["entity_id"]
                ),
            )

    entry.async_on_unload(
        async_track_entity_registry_updated_event(
            hass, zone_ids, on_zone_registry_update
        )
    )
    return True


async def _async_rename_zone(
    hass: HomeAssistant, entry: ConfigEntry, old_id: str, new_id: str
) -> None:
    """Move a zone to its climate's new entity id, then reload the entry.

    The zone's programs and its status sensor follow the new id. Dashboard
    cards keep the old id until they are edited.
    """
    data: ChronoData | None = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    if data is None or old_id not in data.zone_ids:
        return
    data.store.rename_zone(old_id, new_id)
    await data.store.async_save()
    registry = er.async_get(hass)
    sensor_id = registry.async_get_entity_id(
        "sensor", DOMAIN, status_unique_id(entry.entry_id, old_id)
    )
    if sensor_id is not None:
        registry.async_update_entity(
            sensor_id, new_unique_id=status_unique_id(entry.entry_id, new_id)
        )
    zones = [new_id if zone_id == old_id else zone_id for zone_id in data.zone_ids]
    if CONF_ZONES in entry.options:
        hass.config_entries.async_update_entry(
            entry, options={**entry.options, CONF_ZONES: zones}
        )
    else:
        hass.config_entries.async_update_entry(
            entry, data={**entry.data, CONF_ZONES: zones}
        )
    _LOGGER.info("Zone %s follows its climate's new entity id %s", old_id, new_id)
    hass.config_entries.async_schedule_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    await _pop_data(hass, entry).engine.async_stop()
    return True


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Delete the entry's stored programs when the integration is removed."""
    await ProgramStore(hass, entry.entry_id).async_remove()


def _pop_data(hass: HomeAssistant, entry: ConfigEntry) -> ChronoData:
    """Take the entry's runtime data out of hass.data."""
    data: ChronoData = hass.data[DOMAIN].pop(entry.entry_id)
    if not hass.data[DOMAIN]:
        hass.data.pop(DOMAIN)
    return data
