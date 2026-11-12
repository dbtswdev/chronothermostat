"""Persistence of programs, scenario and return time."""

from __future__ import annotations

from copy import deepcopy
from datetime import datetime
import logging
import math
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import PROGRAM_SCENARIOS, SLOTS, WEEKDAYS, Scenario
from .program import Week, default_week

_LOGGER = logging.getLogger(__name__)

STORAGE_VERSION = 1


def _valid_day(day: Any) -> bool:
    """Return True for a list of SLOTS finite numbers."""
    return (
        isinstance(day, list)
        and len(day) == SLOTS
        and all(
            isinstance(value, (int, float))
            and not isinstance(value, bool)
            and math.isfinite(value)
            for value in day
        )
    )


def _repaired_week(zone_id: str, program: str, stored: Any) -> Week:
    """Return a stored week with every unusable day replaced by the default."""
    week = default_week()
    if not isinstance(stored, dict):
        _LOGGER.warning(
            "Stored %s program of %s is unusable; using the default", program, zone_id
        )
        return week
    for weekday in WEEKDAYS:
        if _valid_day(stored.get(weekday)):
            week[weekday] = [float(value) for value in stored[weekday]]
        else:
            _LOGGER.warning(
                "Stored %s program of %s for %s is unusable; using the default",
                program,
                zone_id,
                weekday,
            )
    return week


def _repaired(stored: Any) -> dict[str, Any]:
    """Return stored data in the expected shape, whatever was on disk.

    A file edited by hand, cut short or written by another version must not
    leave the integration loaded but unable to work: whatever cannot be used
    is replaced by its default and logged.
    """
    data: dict[str, Any] = {
        "scenario": Scenario.WORK.value,
        "return_at": None,
        "zones": {},
    }
    if not isinstance(stored, dict):
        _LOGGER.warning("Stored data is unusable; starting from the defaults")
        return data
    scenario = stored.get("scenario", Scenario.WORK.value)
    if scenario in {item.value for item in Scenario}:
        data["scenario"] = scenario
    else:
        _LOGGER.warning("Stored scenario %r is unknown; using work", scenario)
    return_at = stored.get("return_at")
    if isinstance(return_at, str) and dt_util.parse_datetime(return_at) is not None:
        data["return_at"] = return_at
    elif return_at is not None:
        _LOGGER.warning("Stored return time %r is unusable; dropped", return_at)
    zones = stored.get("zones", {})
    if not isinstance(zones, dict):
        _LOGGER.warning("Stored zones are unusable; starting from the defaults")
        return data
    for zone_id, programs in zones.items():
        if not isinstance(programs, dict):
            programs = {}
        data["zones"][zone_id] = {
            scenario.value: _repaired_week(
                zone_id, scenario.value, programs.get(scenario.value)
            )
            for scenario in PROGRAM_SCENARIOS
        }
    return data


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
        """Load persisted data, keeping defaults when nothing is stored.

        Stored data that cannot be used is repaired (see _repaired).
        """
        stored = await self._store.async_load()
        if stored is not None:
            self._data = _repaired(stored)

    async def async_save(self) -> None:
        """Write the current data to disk immediately."""
        await self._store.async_save(self._data)

    async def async_remove(self) -> None:
        """Delete the stored file (the integration is being removed)."""
        await self._store.async_remove()

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

    def rename_zone(self, old_id: str, new_id: str) -> None:
        """Move a zone's programs to a new id, keeping the zones' order.

        Programs already stored under the new id are replaced; an unknown
        old id is ignored.
        """
        zones = self._data["zones"]
        if old_id not in zones or old_id == new_id:
            return
        self._data["zones"] = {
            (new_id if zone_id == old_id else zone_id): programs
            for zone_id, programs in zones.items()
            if zone_id != new_id
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
