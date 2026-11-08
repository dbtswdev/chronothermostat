from datetime import datetime, timezone

import pytest

from custom_components.chronothermostat.const import Scenario
from custom_components.chronothermostat.storage import ProgramStore


async def test_fresh_store_has_defaults(hass, hass_storage):
    s = ProgramStore(hass, "e1")
    await s.async_load()
    assert s.scenario == Scenario.WORK and s.return_at is None and s.zone_ids == []


async def test_ensure_zone_creates_default_weeks_and_persists(hass, hass_storage):
    s = ProgramStore(hass, "e1")
    await s.async_load()
    s.ensure_zone("climate.a")
    await s.async_save()
    assert s.get_week("climate.a", Scenario.HOLIDAY)["sun"][0] == 16.0
    assert "climate.a" in hass_storage["chronothermostat.e1"]["data"]["zones"]
    assert hass_storage["chronothermostat.e1"]["version"] == 1


async def test_ensure_zone_is_idempotent(hass, hass_storage):
    s = ProgramStore(hass, "e1")
    await s.async_load()
    s.ensure_zone("climate.a")
    s.set_day("climate.a", Scenario.WORK, "mon", [21.0] * 96)
    s.ensure_zone("climate.a")
    assert s.get_week("climate.a", Scenario.WORK)["mon"][5] == 21.0
    assert s.zone_ids == ["climate.a"]


async def test_set_day_and_reload(hass, hass_storage):
    s = ProgramStore(hass, "e1")
    await s.async_load()
    s.ensure_zone("climate.a")
    s.set_day("climate.a", Scenario.WORK, "tue", [21.0] * 96)
    await s.async_save()
    s2 = ProgramStore(hass, "e1")
    await s2.async_load()
    assert s2.get_week("climate.a", Scenario.WORK)["tue"][5] == 21.0
    assert s2.get_week("climate.a", Scenario.WORK)["mon"][5] == 16.0
    assert s2.get_week("climate.a", Scenario.HOLIDAY)["tue"][5] == 16.0


async def test_get_week_returns_copy(hass, hass_storage):
    s = ProgramStore(hass, "e1")
    await s.async_load()
    s.ensure_zone("climate.a")
    s.get_week("climate.a", Scenario.WORK)["mon"][0] = 99
    assert s.get_week("climate.a", Scenario.WORK)["mon"][0] == 16.0


async def test_set_day_copies_input(hass, hass_storage):
    s = ProgramStore(hass, "e1")
    await s.async_load()
    s.ensure_zone("climate.a")
    values = [21.0] * 96
    s.set_day("climate.a", Scenario.WORK, "mon", values)
    values[0] = 99
    assert s.get_week("climate.a", Scenario.WORK)["mon"][0] == 21.0


async def test_scenario_and_return_at_roundtrip(hass, hass_storage):
    s = ProgramStore(hass, "e1")
    await s.async_load()
    ra = datetime(2026, 11, 15, 18, 0, tzinfo=timezone.utc)
    s.set_scenario(Scenario.AWAY, ra)
    await s.async_save()
    assert hass_storage["chronothermostat.e1"]["data"]["scenario"] == "away"
    s2 = ProgramStore(hass, "e1")
    await s2.async_load()
    assert s2.scenario == Scenario.AWAY and s2.return_at == ra
    assert s2.return_at.tzinfo is not None


async def test_set_scenario_clears_return_at(hass, hass_storage):
    s = ProgramStore(hass, "e1")
    await s.async_load()
    s.set_scenario(Scenario.AWAY, datetime(2026, 11, 15, 18, 0, tzinfo=timezone.utc))
    s.set_scenario(Scenario.WORK, None)
    await s.async_save()
    s2 = ProgramStore(hass, "e1")
    await s2.async_load()
    assert s2.scenario == Scenario.WORK and s2.return_at is None


async def test_remove_zone(hass, hass_storage):
    s = ProgramStore(hass, "e1")
    await s.async_load()
    s.ensure_zone("climate.a")
    s.ensure_zone("climate.b")
    s.remove_zone("climate.a")
    s.remove_zone("climate.missing")  # no-op
    await s.async_save()
    assert s.zone_ids == ["climate.b"]
    assert list(hass_storage["chronothermostat.e1"]["data"]["zones"]) == ["climate.b"]


async def test_get_week_rejects_unknown_zone_and_non_program_scenario(
    hass, hass_storage
):
    s = ProgramStore(hass, "e1")
    await s.async_load()
    s.ensure_zone("climate.a")
    with pytest.raises(KeyError):
        s.get_week("climate.nope", Scenario.WORK)
    for scenario in (Scenario.AWAY, Scenario.OFF):
        with pytest.raises(ValueError):
            s.get_week("climate.a", scenario)


async def test_set_day_rejects_bad_target(hass, hass_storage):
    s = ProgramStore(hass, "e1")
    await s.async_load()
    s.ensure_zone("climate.a")
    with pytest.raises(KeyError):
        s.set_day("climate.nope", Scenario.WORK, "mon", [20.0] * 96)
    with pytest.raises(ValueError):
        s.set_day("climate.a", Scenario.AWAY, "mon", [20.0] * 96)
    with pytest.raises(ValueError):
        s.set_day("climate.a", Scenario.WORK, "xyz", [20.0] * 96)
