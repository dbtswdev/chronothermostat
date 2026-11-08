"""Shared base for Chronothermostat entities."""

from __future__ import annotations

from homeassistant.core import callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import Entity

from .const import DOMAIN, SIGNAL_UPDATED
from .engine import Engine


def device_info(entry_id: str) -> DeviceInfo:
    """Return the single device shared by every entity of the entry."""
    return DeviceInfo(
        identifiers={(DOMAIN, entry_id)},
        name="Chronothermostat",
        manufacturer="dbtswdev",
        entry_type=DeviceEntryType.SERVICE,
    )


class ChronoEntity(Entity):
    """Entity that refreshes whenever the engine announces a change."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, engine: Engine) -> None:
        """Keep the engine and attach the shared device."""
        self._engine = engine
        self._attr_device_info = device_info(engine.entry_id)

    async def async_added_to_hass(self) -> None:
        """Refresh on engine updates."""
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass,
                SIGNAL_UPDATED.format(entry_id=self._engine.entry_id),
                self._handle_update,
            )
        )

    @callback
    def _handle_update(self) -> None:
        """Write the new state."""
        self.async_write_ha_state()
