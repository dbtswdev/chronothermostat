"""Scenario select."""

from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN, Scenario
from .entity import ChronoEntity
from .engine import Engine


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add the scenario select."""
    async_add_entities([ScenarioSelect(hass.data[DOMAIN][entry.entry_id].engine)])


class ScenarioSelect(ChronoEntity, SelectEntity):
    """House-wide scenario."""

    _attr_translation_key = "scenario"
    _attr_options = [scenario.value for scenario in Scenario]

    def __init__(self, engine: Engine) -> None:
        """Set the unique id."""
        super().__init__(engine)
        self._attr_unique_id = f"{engine.entry_id}_scenario"

    @property
    def current_option(self) -> str:
        """Return the current scenario."""
        return self._engine.scenario.value

    async def async_select_option(self, option: str) -> None:
        """Switch scenario, keeping the stored return time."""
        await self._engine.async_set_scenario(
            Scenario(option), self._engine.return_at, source="entity"
        )
