"""Tests for the engine decision rules."""

from datetime import datetime
from zoneinfo import ZoneInfo

from custom_components.chronothermostat.const import Scenario
from custom_components.chronothermostat.rules import (
    save_target,
    scenario_change,
    startup_target,
    tick_target,
    zone_turned_on_target,
)
from custom_components.chronothermostat.status import ZoneState

ROME = ZoneInfo("Europe/Rome")
NOW = datetime(2026, 11, 10, 8, 28, tzinfo=ROME)  # Tuesday, slot 33
ON = ZoneState("heat", 19.0)
OFF = ZoneState("off", 15.0)
UNAVAILABLE = ZoneState(None, None)


def make_week():
    """Every day 15.0 except 07:00-09:00 (slots 28..35) at 19.0."""
    day = [15.0] * 96
    day[28:36] = [19.0] * 8
    return {d: list(day) for d in ("mon", "tue", "wed", "thu", "fri", "sat", "sun")}


def at(hour, minute, day=10):
    return datetime(2026, 11, day, hour, minute, tzinfo=ROME)


def test_tick_sends_value_only_on_step():
    week = make_week()
    assert tick_target(Scenario.WORK, ON, week, at(7, 0)) == 19.0
    assert tick_target(Scenario.WORK, ON, week, at(7, 15)) is None
    assert tick_target(Scenario.HOLIDAY, ON, week, at(9, 0)) == 15.0


def test_tick_ignores_zone_off_unavailable_and_non_program_scenarios():
    week = make_week()
    assert tick_target(Scenario.WORK, OFF, week, at(7, 0)) is None
    assert tick_target(Scenario.WORK, UNAVAILABLE, week, at(7, 0)) is None
    assert tick_target(Scenario.AWAY, ON, week, at(7, 0)) is None
    assert tick_target(Scenario.OFF, ON, week, at(7, 0)) is None
    assert tick_target(Scenario.WORK, ON, None, at(7, 0)) is None


def test_tick_midnight_step_uses_previous_day():
    week = make_week()
    week["mon"][95] = 17.0  # Monday 23:45 differs from Tuesday 00:00 (15.0)
    assert tick_target(Scenario.WORK, ON, week, at(0, 0, day=10)) == 15.0
    # Wednesday 00:00 compares with Tuesday 23:45 (15.0): no step
    assert tick_target(Scenario.WORK, ON, week, at(0, 0, day=11)) is None


def test_startup_target_only_for_zones_on_in_program_scenario():
    week = make_week()
    assert startup_target(Scenario.WORK, ON, week, NOW) == 19.0
    assert startup_target(Scenario.HOLIDAY, ON, week, at(12, 0)) == 15.0
    assert startup_target(Scenario.WORK, OFF, week, NOW) is None
    assert startup_target(Scenario.WORK, UNAVAILABLE, week, NOW) is None
    assert startup_target(Scenario.AWAY, ON, week, NOW) is None
    assert startup_target(Scenario.OFF, ON, week, NOW) is None
    assert startup_target(Scenario.WORK, ON, None, NOW) is None


def test_zone_turned_on_target():
    week = make_week()
    assert zone_turned_on_target(Scenario.WORK, week, NOW) == 19.0
    assert zone_turned_on_target(Scenario.HOLIDAY, week, at(12, 0)) == 15.0
    assert zone_turned_on_target(Scenario.AWAY, week, NOW) is None
    assert zone_turned_on_target(Scenario.OFF, week, NOW) is None
    assert zone_turned_on_target(Scenario.WORK, None, NOW) is None


def test_scenario_change_values():
    week = make_week()
    assert scenario_change(Scenario.WORK, week, NOW) == ("heat", 19.0)
    assert scenario_change(Scenario.HOLIDAY, week, at(12, 0)) == ("heat", 15.0)
    assert scenario_change(Scenario.AWAY, week, NOW) == ("off", None)
    assert scenario_change(Scenario.OFF, week, NOW) == ("off", None)
    assert scenario_change(Scenario.WORK, None, NOW) == ("heat", None)


def test_save_target_applies_only_when_today_active_and_changed_and_zone_on():
    old = make_week()
    new = make_week()
    new["tue"][33] = 21.0
    w, h = Scenario.WORK, Scenario.HOLIDAY
    assert save_target(w, w, ON, old, new, NOW) == 21.0
    # saved program is not the active one
    assert save_target(w, h, ON, old, new, NOW) is None
    # active scenario is not a program scenario
    assert save_target(Scenario.AWAY, Scenario.AWAY, ON, old, new, NOW) is None
    # zone off / unavailable
    assert save_target(w, w, OFF, old, new, NOW) is None
    assert save_target(w, w, UNAVAILABLE, old, new, NOW) is None
    # current quarter unchanged (edit at another slot of today)
    other = make_week()
    other["tue"][50] = 22.0
    assert save_target(w, w, ON, old, other, NOW) is None
    # edit on another weekday
    wed = make_week()
    wed["wed"][33] = 22.0
    assert save_target(w, w, ON, old, wed, NOW) is None
    # change below tolerance
    tiny = make_week()
    tiny["tue"][33] = 19.04
    assert save_target(w, w, ON, old, tiny, NOW) is None
