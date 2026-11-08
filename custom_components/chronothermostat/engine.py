"""Scheduling engine (skeleton, behavior added in later tasks)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from .storage import ProgramStore


class Engine:
    """Drives the zones from their programs."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry_id: str,
        store: ProgramStore,
        zone_ids: list[str],
    ) -> None:
        """Keep the collaborators for later use."""
        self.hass = hass
        self.entry_id = entry_id
        self.store = store
        self.zone_ids = zone_ids

    async def async_start(self) -> None:
        """Start the engine."""

    async def async_stop(self) -> None:
        """Stop the engine."""
