"""Pure decision rules: what the engine sends to a zone's climate."""

from __future__ import annotations

from datetime import datetime

from .const import HVAC_OFF, HVAC_ON, PROGRAM_SCENARIOS, TEMP_TOLERANCE, Scenario
from .program import Week, is_step, slot_index, weekday_key
from .status import ZoneState


def _zone_on(zone: ZoneState) -> bool:
    """Return True if the zone is on (unavailable counts as not on)."""
    return zone.hvac_mode is not None and zone.hvac_mode != HVAC_OFF


def _current_value(week: Week | None, local_now: datetime) -> float | None:
    """Return the program value of the current quarter, if there is a week."""
    if week is None:
        return None
    return week[weekday_key(local_now)][slot_index(local_now)]


def tick_target(
    scenario: Scenario, zone: ZoneState, week: Week | None, local_now: datetime
) -> float | None:
    """Return the setpoint to send at a quarter tick, only on a program step."""
    if scenario not in PROGRAM_SCENARIOS or week is None or not _zone_on(zone):
        return None
    if not is_step(week, weekday_key(local_now), slot_index(local_now)):
        return None
    return _current_value(week, local_now)


def startup_target(
    scenario: Scenario, zone: ZoneState, week: Week | None, local_now: datetime
) -> float | None:
    """Return the setpoint to send at startup for a zone that is on."""
    if scenario not in PROGRAM_SCENARIOS or not _zone_on(zone):
        return None
    return _current_value(week, local_now)


def zone_turned_on_target(
    scenario: Scenario, week: Week | None, local_now: datetime
) -> float | None:
    """Return the setpoint to send when a zone is switched on by hand."""
    if scenario not in PROGRAM_SCENARIOS:
        return None
    return _current_value(week, local_now)


def scenario_change(
    new: Scenario, week: Week | None, local_now: datetime
) -> tuple[str, float | None]:
    """Return the hvac mode and setpoint to apply to every zone."""
    if new in PROGRAM_SCENARIOS:
        return HVAC_ON, _current_value(week, local_now)
    return HVAC_OFF, None


def save_target(
    active: Scenario,
    saved: Scenario,
    zone: ZoneState,
    old_week: Week | None,
    new_week: Week | None,
    local_now: datetime,
) -> float | None:
    """Return the new current-quarter value if saving a program changed it."""
    if active not in PROGRAM_SCENARIOS or saved != active or not _zone_on(zone):
        return None
    old = _current_value(old_week, local_now)
    new = _current_value(new_week, local_now)
    if old is None or new is None or abs(new - old) <= TEMP_TOLERANCE:
        return None
    return new
