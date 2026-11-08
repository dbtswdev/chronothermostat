"""Return-at datetime."""

from __future__ import annotations

from datetime import datetime

from homeassistant.components.datetime import DateTimeEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN
from .entity import ChronoEntity
from .engine import Engine


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add the return-at datetime."""
    async_add_entities([ReturnAtDateTime(hass.data[DOMAIN][entry.entry_id].engine)])


class ReturnAtDateTime(ChronoEntity, DateTimeEntity):
    """When the away scenario ends."""

    _attr_translation_key = "return_at"

    def __init__(self, engine: Engine) -> None:
        """Set the unique id."""
        super().__init__(engine)
        self._attr_unique_id = f"{engine.entry_id}_return_at"

    @property
    def native_value(self) -> datetime | None:
        """Return the stored return time."""
        return self._engine.return_at

    async def async_set_value(self, value: datetime) -> None:
        """Store the return time."""
        await self._engine.async_set_return_at(value)
