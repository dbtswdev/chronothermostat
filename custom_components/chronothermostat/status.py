"""Pure computation of a zone's status for display."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum

from .const import HVAC_OFF, PROGRAM_SCENARIOS, TEMP_TOLERANCE, Scenario
from .program import (
    Week,
    next_step,
    round_half,
    slot_index,
    slot_to_datetime,
    weekday_key,
)


@dataclass(frozen=True)
class ZoneState:
    """Observed state of a zone's climate entity (hvac_mode None = unavailable)."""

    hvac_mode: str | None
    target: float | None


class ZoneStatusKey(StrEnum):
    """Status keys, also used as translation keys."""

    SCHEDULE = "schedule"
    FORCED = "forced"
    ZONE_OFF = "zone_off"
    ZONE_ON_MANUAL = "zone_on_manual"
    AWAY = "away"
    AWAY_NO_RETURN = "away_no_return"
    OFF = "off"
    UNAVAILABLE = "unavailable"


@dataclass(frozen=True)
class ZoneStatus:
    """Status of a zone with the program details needed to describe it."""

    key: ZoneStatusKey
    program: str | None = None
    program_target: float | None = None
    next_step_at: datetime | None = None
    next_step_target: float | None = None
    today: list[float] | None = None


def compute_zone_status(
    scenario: Scenario,
    return_at: datetime | None,
    zone: ZoneState,
    weeks: dict[Scenario, Week],
    local_now: datetime,
) -> ZoneStatus:
    """Compute the status of a zone under the current scenario."""
    if zone.hvac_mode is None:
        return ZoneStatus(ZoneStatusKey.UNAVAILABLE)
    zone_on = zone.hvac_mode != HVAC_OFF

    if scenario not in PROGRAM_SCENARIOS:
        if zone_on:
            return ZoneStatus(ZoneStatusKey.ZONE_ON_MANUAL)
        if scenario is Scenario.OFF:
            return ZoneStatus(ZoneStatusKey.OFF)
        if (
            return_at is not None
            and return_at.tzinfo is not None
            and return_at > local_now
        ):
            return ZoneStatus(ZoneStatusKey.AWAY)
        return ZoneStatus(ZoneStatusKey.AWAY_NO_RETURN)

    week = weeks[scenario]
    weekday = weekday_key(local_now)
    slot = slot_index(local_now)
    today = list(week[weekday])
    program_target = today[slot]
    step = next_step(week, weekday, slot)
    next_at = next_target = None
    if step is not None:
        days_ahead, _, step_slot, next_target = step
        next_at = slot_to_datetime(local_now, days_ahead, step_slot)

    if not zone_on:
        key = ZoneStatusKey.ZONE_OFF
    elif (
        zone.target is not None
        and abs(round_half(zone.target) - program_target) > TEMP_TOLERANCE
    ):
        key = ZoneStatusKey.FORCED
    else:
        key = ZoneStatusKey.SCHEDULE
    return ZoneStatus(
        key, str(scenario), program_target, next_at, next_target, today
    )
