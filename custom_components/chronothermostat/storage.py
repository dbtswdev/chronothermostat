"""Persistence of programs, scenario and return time."""

from __future__ import annotations

from copy import deepcopy
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import PROGRAM_SCENARIOS, WEEKDAYS, Scenario
from .program import Week, default_week

STORAGE_VERSION = 1


class ProgramStore:
    """Weekly programs per zone plus the house-wide scenario."""

    def __init__(self, hass: HomeAssistant, entry_id: str) -> None:
        """Create the store; call async_load before use."""
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, f"chronothermostat.{entry_id}"
        )
        self._data: dict[str, Any] = self._empty()

    @staticmethod
    def _empty() -> dict[str, Any]:
        return {"scenario": Scenario.WORK.value, "return_at": None, "zones": {}}

    async def async_load(self) -> None:
        """Load persisted data, keeping defaults when nothing is stored."""
        stored = await self._store.async_load()
        if stored is not None:
            self._data = {**self._empty(), **stored}

    async def async_save(self) -> None:
        """Write the current data to disk immediately."""
        await self._store.async_save(self._data)

    @property
    def scenario(self) -> Scenario:
        """Return the current house-wide scenario."""
        return Scenario(self._data["scenario"])

    @property
    def return_at(self) -> datetime | None:
        """Return the stored return time as an aware UTC datetime, or None."""
        raw = self._data["return_at"]
        if raw is None:
            return None
        parsed = dt_util.parse_datetime(raw)
        return None if parsed is None else dt_util.as_utc(parsed)

    @property
    def zone_ids(self) -> list[str]:
        """Return the ids of all known zones."""
        return list(self._data["zones"])

    def ensure_zone(self, zone_id: str) -> None:
        """Create default work and holiday programs if the zone is new."""
        if zone_id not in self._data["zones"]:
            self._data["zones"][zone_id] = {
                scenario.value: default_week() for scenario in PROGRAM_SCENARIOS
            }

    def remove_zone(self, zone_id: str) -> None:
        """Forget a zone and its programs; unknown zones are ignored."""
        self._data["zones"].pop(zone_id, None)

    def _week(self, zone_id: str, scenario: Scenario) -> Week:
        """Return the live week; raise KeyError for an unknown zone and
        ValueError for a scenario without a program (away, off)."""
        if scenario not in PROGRAM_SCENARIOS:
            raise ValueError(f"Scenario {scenario!s} has no program")
        return self._data["zones"][zone_id][scenario.value]

    def get_week(self, zone_id: str, scenario: Scenario) -> Week:
        """Return a deep copy of a zone's week.

        Raises KeyError for an unknown zone and ValueError for a scenario
        that has no program (away, off).
        """
        return deepcopy(self._week(zone_id, scenario))

    def set_day(
        self, zone_id: str, scenario: Scenario, weekday: str, values: list[float]
    ) -> None:
        """Replace one day of a program with already normalised values.

        Raises KeyError for an unknown zone and ValueError for a scenario
        without a program or an invalid weekday key.
        """
        week = self._week(zone_id, scenario)
        if weekday not in WEEKDAYS:
            raise ValueError(f"Invalid weekday {weekday!r}")
        week[weekday] = list(values)

    def set_scenario(self, scenario: Scenario, return_at: datetime | None) -> None:
        """Set the scenario and its optional return time (stored as ISO)."""
        self._data["scenario"] = Scenario(scenario).value
        self._data["return_at"] = (
            None if return_at is None else dt_util.as_utc(return_at).isoformat()
        )
