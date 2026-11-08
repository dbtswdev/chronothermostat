"""Zone status sensors."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event

from .const import DOMAIN
from .entity import ChronoEntity
from .engine import Engine
from .status import ZoneStatusKey


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add one status sensor per zone."""
    engine = hass.data[DOMAIN][entry.entry_id].engine
    async_add_entities(ZoneStatusSensor(engine, zone_id) for zone_id in engine.zone_ids)


class ZoneStatusSensor(ChronoEntity, SensorEntity):
    """Display status of one zone."""

    _attr_translation_key = "zone_status"
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = [key.value for key in ZoneStatusKey]

    def __init__(self, engine: Engine, zone_id: str) -> None:
        """Set ids and the zone name placeholder."""
        super().__init__(engine)
        self._zone_id = zone_id
        self._attr_unique_id = f"{engine.entry_id}_{zone_id}_status"
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
        """Write the new state."""
        self.async_write_ha_state()

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
        }
