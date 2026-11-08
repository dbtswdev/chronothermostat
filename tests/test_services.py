"""Tests for the Chronothermostat services."""

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError

from custom_components.chronothermostat.const import DOMAIN, Scenario

ROME = ZoneInfo("Europe/Rome")
NOW = datetime(2026, 11, 10, 8, 28, tzinfo=ROME)  # Tuesday
ZONE = "climate.zone_a"


def _call(hass: HomeAssistant, service: str, data: dict):
    return hass.services.async_call(DOMAIN, service, data, blocking=True)


async def test_set_scenario_service_sets_away_with_return(hass, setup_at):
    data = await setup_at(NOW)
    return_at = NOW + timedelta(days=2)

    await _call(hass, "set_scenario", {"scenario": "away", "return_at": return_at})

    assert data.engine.scenario is Scenario.AWAY
    assert data.engine.return_at == return_at


async def test_set_scenario_service_rejects_naive_return_at(hass, setup_at):
    data = await setup_at(NOW)

    with pytest.raises(ServiceValidationError) as err:
        await _call(
            hass, "set_scenario", {"scenario": "away", "return_at": "2026-11-12 18:00:00"}
        )

    assert err.value.translation_key == "return_at_required"
    assert data.engine.scenario is Scenario.WORK
    assert data.engine.return_at is None


async def test_set_scenario_service_rejects_past_return_at(hass, setup_at):
    data = await setup_at(NOW)

    with pytest.raises(ServiceValidationError) as err:
        await _call(
            hass,
            "set_scenario",
            {"scenario": "away", "return_at": NOW - timedelta(hours=1)},
        )

    assert err.value.translation_key == "return_at_required"
    assert data.engine.scenario is Scenario.WORK


async def test_set_scenario_service_away_without_return_at_rejected(hass, setup_at):
    data = await setup_at(NOW)

    with pytest.raises(ServiceValidationError) as err:
        await _call(hass, "set_scenario", {"scenario": "away"})

    assert err.value.translation_key == "return_at_required"
    assert data.engine.scenario is Scenario.WORK


async def test_set_scenario_service_ignores_return_at_for_holiday(hass, setup_at):
    data = await setup_at(NOW)

    await _call(
        hass,
        "set_scenario",
        {"scenario": "holiday", "return_at": NOW + timedelta(days=1)},
    )

    assert data.engine.scenario is Scenario.HOLIDAY
    assert data.engine.return_at is None


async def test_set_program_service_saves_day(hass, setup_at):
    data = await setup_at(NOW)
    values = [17.5] * 48 + [20.0] * 48

    await _call(
        hass,
        "set_program",
        {"zone": ZONE, "program": "holiday", "weekday": "sat", "values": values},
    )

    assert data.store.get_week(ZONE, Scenario.HOLIDAY)["sat"] == values


async def test_set_program_service_rejects_95_values(hass, setup_at):
    data = await setup_at(NOW)
    before = data.store.get_week(ZONE, Scenario.WORK)

    with pytest.raises(ServiceValidationError) as err:
        await _call(
            hass,
            "set_program",
            {"zone": ZONE, "program": "work", "weekday": "mon", "values": [18.0] * 95},
        )

    assert err.value.translation_key == "invalid_program"
    assert data.store.get_week(ZONE, Scenario.WORK) == before


async def test_set_program_service_rejects_non_numbers(hass, setup_at):
    data = await setup_at(NOW)
    before = data.store.get_week(ZONE, Scenario.WORK)

    with pytest.raises(ServiceValidationError) as err:
        await _call(
            hass,
            "set_program",
            {"zone": ZONE, "program": "work", "weekday": "mon", "values": ["hot"] * 96},
        )

    assert err.value.translation_key == "invalid_program"
    assert data.store.get_week(ZONE, Scenario.WORK) == before


async def test_set_program_service_rejects_out_of_range_values(hass, setup_at):
    data = await setup_at(NOW)
    before = data.store.get_week(ZONE, Scenario.WORK)

    with pytest.raises(ServiceValidationError) as err:
        await _call(
            hass,
            "set_program",
            {
                "zone": ZONE,
                "program": "work",
                "weekday": "mon",
                "values": [18.0] * 95 + [99],
            },
        )

    assert err.value.translation_key == "invalid_program"
    assert data.store.get_week(ZONE, Scenario.WORK) == before


async def test_set_program_service_accepts_value_at_max(hass, setup_at):
    data = await setup_at(NOW)
    values = [18.0] * 95 + [30.0]

    await _call(
        hass,
        "set_program",
        {"zone": ZONE, "program": "work", "weekday": "mon", "values": values},
    )

    assert data.store.get_week(ZONE, Scenario.WORK)["mon"] == values


async def test_set_program_service_rejects_unknown_zone(hass, setup_at):
    data = await setup_at(NOW)
    before = data.store.get_week(ZONE, Scenario.WORK)

    with pytest.raises(ServiceValidationError) as err:
        await _call(
            hass,
            "set_program",
            {
                "zone": "climate.nowhere",
                "program": "work",
                "weekday": "mon",
                "values": [18.0] * 96,
            },
        )

    assert err.value.translation_key == "unknown_zone"
    assert data.store.get_week(ZONE, Scenario.WORK) == before


async def test_copy_day_service(hass, setup_at):
    data = await setup_at(NOW)
    values = [18.0] * 40 + [21.5] * 56
    await _call(
        hass,
        "set_program",
        {"zone": ZONE, "program": "work", "weekday": "mon", "values": values},
    )

    await _call(
        hass,
        "copy_day",
        {"zone": ZONE, "program": "work", "from_weekday": "mon", "to_weekday": "wed"},
    )

    week = data.store.get_week(ZONE, Scenario.WORK)
    assert week["wed"] == values
    assert week["tue"] != values


async def test_copy_day_service_unknown_zone_rejected(hass, setup_at):
    await setup_at(NOW)

    with pytest.raises(ServiceValidationError) as err:
        await _call(
            hass,
            "copy_day",
            {
                "zone": "climate.nowhere",
                "program": "work",
                "from_weekday": "mon",
                "to_weekday": "wed",
            },
        )

    assert err.value.translation_key == "unknown_zone"


async def test_services_not_loaded_error(hass, setup_integration):
    await hass.config_entries.async_unload(setup_integration.entry_id)
    await hass.async_block_till_done()

    with pytest.raises(ServiceValidationError) as err:
        await _call(hass, "set_scenario", {"scenario": "work"})

    assert err.value.translation_key == "not_loaded"
