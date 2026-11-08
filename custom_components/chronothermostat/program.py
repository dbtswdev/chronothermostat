"""Pure weekly program model: 96 quarter-hour setpoints per weekday."""

from __future__ import annotations

from collections.abc import Sequence
from datetime import datetime, time, timedelta
import math
from typing import Any

from .const import (
    DEFAULT_DAY_TEMP,
    DEFAULT_NIGHT_TEMP,
    SLOTS,
    TEMP_TOLERANCE,
    WEEKDAYS,
)

Week = dict[str, list[float]]

_NIGHT_START_SLOT = 23 * 4
_DAY_START_SLOT = 6 * 4


def round_half(value: float) -> float:
    """Round to the nearest 0.5, halves going up."""
    return math.floor(value * 2 + 0.5) / 2


def slot_index(local_dt: datetime) -> int:
    """Return the quarter-hour slot (0-95) of a local wall-clock time."""
    return local_dt.hour * 4 + local_dt.minute // 15


def weekday_key(local_dt: datetime) -> str:
    """Return the weekday key (mon..sun) of a local datetime."""
    return WEEKDAYS[local_dt.weekday()]


def previous_slot(weekday: str, slot: int) -> tuple[str, int]:
    """Return the slot before the given one, wrapping across days."""
    if slot > 0:
        return weekday, slot - 1
    return WEEKDAYS[(WEEKDAYS.index(weekday) - 1) % len(WEEKDAYS)], SLOTS - 1


def _next_slot(weekday: str, slot: int) -> tuple[str, int, bool]:
    """Return the slot after the given one and whether the day changed."""
    if slot < SLOTS - 1:
        return weekday, slot + 1, False
    return WEEKDAYS[(WEEKDAYS.index(weekday) + 1) % len(WEEKDAYS)], 0, True


def is_step(week: Week, weekday: str, slot: int) -> bool:
    """Return True if the slot's value differs from its predecessor's."""
    prev_day, prev_slot = previous_slot(weekday, slot)
    return abs(week[weekday][slot] - week[prev_day][prev_slot]) > TEMP_TOLERANCE


def next_step(
    week: Week, weekday: str, slot: int
) -> tuple[int, str, int, float] | None:
    """Return (days_ahead, weekday, slot, value) of the next step, if any."""
    day, idx, days_ahead = weekday, slot, 0
    for _ in range(len(WEEKDAYS) * SLOTS):
        day, idx, rolled = _next_slot(day, idx)
        if rolled:
            days_ahead += 1
        if is_step(week, day, idx):
            return days_ahead, day, idx, week[day][idx]
    return None


def slot_to_datetime(local_now: datetime, days_ahead: int, slot: int) -> datetime:
    """Return the wall-clock datetime of a slot, in local_now's timezone."""
    target_date = local_now.date() + timedelta(days=days_ahead)
    return datetime.combine(
        target_date, time(slot // 4, (slot % 4) * 15), tzinfo=local_now.tzinfo
    )


def default_week() -> Week:
    """Return the default program: night temperature 23:00-06:00, day otherwise."""
    day = [
        DEFAULT_NIGHT_TEMP
        if slot >= _NIGHT_START_SLOT or slot < _DAY_START_SLOT
        else DEFAULT_DAY_TEMP
        for slot in range(SLOTS)
    ]
    return {weekday: list(day) for weekday in WEEKDAYS}


def normalize_day(
    values: Sequence[Any], min_temp: float, max_temp: float
) -> list[float]:
    """Validate a day of 96 setpoints, round to 0.5 and clamp to the range."""
    if isinstance(values, (str, bytes)) or not isinstance(values, Sequence):
        raise ValueError("A program day must be a list of numbers")
    if len(values) != SLOTS:
        raise ValueError(f"A program day must have exactly {SLOTS} values")
    result: list[float] = []
    for value in values:
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError(f"Invalid setpoint: {value!r}")
        number = float(value)
        if not math.isfinite(number):
            raise ValueError(f"Invalid setpoint: {value!r}")
        result.append(min(max(round_half(number), min_temp), max_temp))
    return result
