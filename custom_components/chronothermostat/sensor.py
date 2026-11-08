"""Zone status sensors."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event

from .const import DOMAIN
from .entity import ChronoEntity
from .engine import Engine
from .status import ZoneStatusKey


def status_unique_id(entry_id: str, zone_id: str) -> str:
    """Return the unique id of a zone's status sensor."""
    return f"{entry_id}_{zone_id}_status"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add one status sensor per zone, after removing those of removed zones."""
    engine = hass.data[DOMAIN][entry.entry_id].engine
    _remove_stale_sensors(hass, entry.entry_id, engine.zone_ids)
    async_add_entities(ZoneStatusSensor(engine, zone_id) for zone_id in engine.zone_ids)


@callback
def _remove_stale_sensors(
    hass: HomeAssistant, entry_id: str, zone_ids: list[str]
) -> None:
    """Drop registry entries of status sensors whose zone is no longer configured.

    Only the registry entry goes; the zone's stored programs are kept, so adding
    the zone back restores its program.
    """
    registry = er.async_get(hass)
    current = {status_unique_id(entry_id, zone_id) for zone_id in zone_ids}
    for entity in er.async_entries_for_config_entry(registry, entry_id):
        if (
            entity.domain == "sensor"
            and entity.unique_id.endswith("_status")
            and entity.unique_id not in current
        ):
            registry.async_remove(entity.entity_id)


class ZoneStatusSensor(ChronoEntity, SensorEntity):
    """Display status of one zone."""

    _attr_translation_key = "zone_status"
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = [key.value for key in ZoneStatusKey]
    # Derived from the program; today's 96 values would bloat the database.
    _unrecorded_attributes = frozenset(
        {"today", "next_step_at", "next_step_target", "program_target", "return_at"}
    )

    def __init__(self, engine: Engine, zone_id: str) -> None:
        """Set ids and the zone name placeholder."""
        super().__init__(engine)
        self._zone_id = zone_id
        self._attr_unique_id = status_unique_id(engine.entry_id, zone_id)
        self._attr_translation_placeholders = {"zone": engine.zone_name(zone_id)}

    async def async_added_to_hass(self) -> None:
        """Also refresh when the zone's climate changes."""
        await super().async_added_to_hass()
        self.async_on_remove(
            async_track_state_change_event(
                self.hass, [self._zone_id], self._handle_zone_change
            )
        )

    @callback
    def _handle_zone_change(self, event: Event[EventStateChangedData]) -> None:
        """Follow the zone's name and write the new state."""
        self._refresh_zone_name()
        self.async_write_ha_state()

    @callback
    def _refresh_zone_name(self) -> None:
        """Take the zone's current friendly name (its climate may load later)."""
        name = self._engine.zone_name(self._zone_id)
        if self._attr_translation_placeholders.get("zone") != name:
            self._attr_translation_placeholders = {"zone": name}
            # The entity name is cached; drop it, as Home Assistant's Hue
            # integration does, so the new placeholder is used.
            self.__dict__.pop("name", None)

    @property
    def available(self) -> bool:
        """Unavailable when the zone's climate is missing or unavailable."""
        return self._engine.zone_status(self._zone_id).key is not ZoneStatusKey.UNAVAILABLE

    @property
    def native_value(self) -> str:
        """Return the status key."""
        return self._engine.zone_status(self._zone_id).key.value

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return the program details used by the card."""
        status = self._engine.zone_status(self._zone_id)
        return {
            "zone": self._zone_id,
            "program": status.program,
            "program_target": status.program_target,
            "next_step_at": status.next_step_at.isoformat()
            if status.next_step_at
            else None,
            "next_step_target": status.next_step_target,
            "today": status.today,
            "return_at": self._engine.return_at.isoformat()
            if self._engine.return_at
            else None,
        }
