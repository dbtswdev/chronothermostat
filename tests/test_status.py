"""Tests for zone status computation."""

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from custom_components.chronothermostat.const import Scenario
from custom_components.chronothermostat.status import (
    ZoneState,
    ZoneStatusKey,
    compute_zone_status,
)

ROME = ZoneInfo("Europe/Rome")
NOW = datetime(2026, 11, 10, 8, 28, tzinfo=ROME)  # Tuesday, slot 33


def make_week():
    """Every day 15.0 except 07:00-09:00 (slots 28..35) at 19.0."""
    day = [15.0] * 96
    day[28:36] = [19.0] * 8
    return {d: list(day) for d in ("mon", "tue", "wed", "thu", "fri", "sat", "sun")}


def weeks():
    return {Scenario.WORK: make_week(), Scenario.HOLIDAY: make_week()}


def status(scenario=Scenario.WORK, hvac="heat", target=19.0, return_at=None, now=NOW):
    return compute_zone_status(
        scenario, return_at, ZoneState(hvac, target), weeks(), now
    )


def test_status_schedule_with_target_off_by_less_than_tolerance():
    s = status(target=18.96)
    assert s.key is ZoneStatusKey.SCHEDULE
    assert s.program == "work"
    assert s.program_target == 19.0
    assert s.next_step_at == datetime(2026, 11, 10, 9, 0, tzinfo=ROME)
    assert s.next_step_target == 15.0
    assert s.today == make_week()["tue"]


def test_status_schedule_when_target_is_none():
    s = status(target=None)
    assert s.key is ZoneStatusKey.SCHEDULE
    assert s.program_target == 19.0


def test_status_forced_reports_next_step_at_0900_and_15():
    s = status(Scenario.HOLIDAY, target=22.0)
    assert s.key is ZoneStatusKey.FORCED
    assert s.program == "holiday"
    assert s.program_target == 19.0
    assert s.next_step_at == datetime(2026, 11, 10, 9, 0, tzinfo=ROME)
    assert s.next_step_target == 15.0
    assert len(s.today) == 96


def test_status_zone_off_keeps_program_info():
    s = status(hvac="off", target=None)
    assert s.key is ZoneStatusKey.ZONE_OFF
    assert s.program == "work"
    assert s.program_target == 19.0
    assert s.next_step_at == datetime(2026, 11, 10, 9, 0, tzinfo=ROME)
    assert s.next_step_target == 15.0
    assert len(s.today) == 96


def test_status_away_with_future_return():
    s = status(Scenario.AWAY, hvac="off", return_at=NOW + timedelta(days=2))
    assert s.key is ZoneStatusKey.AWAY
    assert s.program is None
    assert s.program_target is None
    assert s.next_step_at is None
    assert s.next_step_target is None
    assert s.today is None


def test_status_away_without_return_or_past_return():
    for return_at in (None, NOW - timedelta(days=1), datetime(2026, 11, 12, 8, 0)):
        s = status(Scenario.AWAY, hvac="off", return_at=return_at)
        assert s.key is ZoneStatusKey.AWAY_NO_RETURN
        assert s.program is None
        assert s.today is None


def test_status_zone_on_manual_in_off_and_away():
    s = status(Scenario.OFF, hvac="heat")
    assert s.key is ZoneStatusKey.ZONE_ON_MANUAL
    assert s.program is None and s.today is None and s.next_step_at is None
    s = status(Scenario.AWAY, hvac="heat", return_at=NOW + timedelta(days=1))
    assert s.key is ZoneStatusKey.ZONE_ON_MANUAL
    assert s.program is None and s.program_target is None
    assert status(Scenario.OFF, hvac="off").key is ZoneStatusKey.OFF


def test_status_unavailable_zone_is_unavailable_not_zone_off():
    for scenario in Scenario:
        s = status(scenario, hvac=None, target=None, return_at=NOW + timedelta(days=1))
        assert s.key is ZoneStatusKey.UNAVAILABLE
        assert s.program is None
        assert s.program_target is None
        assert s.next_step_at is None
        assert s.next_step_target is None
        assert s.today is None


def test_status_next_step_tomorrow_when_rest_of_day_flat():
    now = datetime(2026, 11, 10, 22, 0, tzinfo=ROME)
    s = status(target=15.0, now=now)
    assert s.key is ZoneStatusKey.SCHEDULE
    assert s.program_target == 15.0
    assert s.next_step_at == datetime(2026, 11, 11, 7, 0, tzinfo=ROME)
    assert s.next_step_target == 19.0
