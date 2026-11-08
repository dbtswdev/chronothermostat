from datetime import datetime
from zoneinfo import ZoneInfo
import math, pytest
from custom_components.chronothermostat.program import (slot_index, weekday_key, previous_slot, is_step, next_step, slot_to_datetime, default_week, normalize_day, round_half)
ROME = ZoneInfo("Europe/Rome")

def flat(v): return {d: [v]*96 for d in ("mon","tue","wed","thu","fri","sat","sun")}

def test_slot_index_and_weekday():
    assert slot_index(datetime(2026, 11, 10, 6, 30, tzinfo=ROME)) == 26
    assert slot_index(datetime(2026, 11, 10, 23, 59, tzinfo=ROME)) == 95
    assert weekday_key(datetime(2026, 11, 10, tzinfo=ROME)) == "tue"

def test_slot_index_on_dst_days_never_raises():
    for h in range(24):
        for m in (0, 15, 30, 45):
            assert 0 <= slot_index(datetime(2026, 3, 29, h, m, tzinfo=ROME)) <= 95
            assert 0 <= slot_index(datetime(2026, 10, 25, h, m, tzinfo=ROME)) <= 95

def test_previous_slot_wraps_to_previous_day():
    assert previous_slot("mon", 0) == ("sun", 95)
    assert previous_slot("tue", 10) == ("tue", 9)

def test_is_step_detects_change_and_midnight_change():
    week = flat(15.6); week["tue"][26:] = [19.0]*70
    assert is_step(week, "tue", 26) and not is_step(week, "tue", 27)
    week["wed"] = [17.0]*96
    assert is_step(week, "wed", 0)

def test_next_step_finds_tomorrow_and_none_when_flat():
    week = flat(15.6); week["wed"][26:] = [19.0]*70
    assert next_step(week, "tue", 90) == (1, "wed", 26, 19.0)
    assert next_step(flat(15.6), "tue", 10) is None

def test_slot_to_datetime():
    now = datetime(2026, 11, 10, 8, 28, tzinfo=ROME)
    assert slot_to_datetime(now, 1, 26) == datetime(2026, 11, 11, 6, 30, tzinfo=ROME)

def test_default_week_values():
    w = default_week()
    assert w["mon"][0] == 16.0 and w["mon"][23*4] == 16.0 and w["mon"][6*4] == 19.0 and w["sun"][12*4] == 19.0

def test_normalize_day_rounds_and_clamps():
    out = normalize_day([18.74]*96, 5.0, 30.0)
    assert out[0] == 18.5 and len(out) == 96
    assert normalize_day([99]*96, 5.0, 30.0)[0] == 30.0

@pytest.mark.parametrize("bad", [[19.0]*95, ["x"]*96, [math.nan]*96, [19.0]*96 + [1.0]])
def test_normalize_day_rejects_bad_input(bad):
    with pytest.raises(ValueError):
        normalize_day(bad, 5.0, 30.0)

@pytest.mark.parametrize("bad", [[True]*96, [None]*96, [math.inf]*96, "x"*96])
def test_normalize_day_rejects_bool_none_inf_and_str(bad):
    with pytest.raises(ValueError):
        normalize_day(bad, 5.0, 30.0)

def test_round_half():
    assert round_half(18.96) == 19.0 and round_half(18.74) == 18.5 and round_half(18.25) == 18.5
