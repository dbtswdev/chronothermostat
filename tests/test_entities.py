"""Tests for the scenario select, return-at datetime and zone status sensors."""

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.config_entries import ConfigEntryState
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.chronothermostat.const import DOMAIN, Scenario

ROME = ZoneInfo("Europe/Rome")
NOW = datetime(2026, 11, 10, 8, 28, tzinfo=ROME)  # Tuesday
SELECT = "select.chronothermostat_scenario"
DATETIME = "datetime.chronothermostat_return_at"
SENSOR_A = "sensor.chronothermostat_zone_a_status"


async def test_select_entity_exists_with_options_and_sets_scenario(hass, setup_at):
    data = await setup_at(NOW)

    state = hass.states.get(SELECT)
    assert state.state == "work"
    assert state.attributes["options"] == ["work", "holiday", "away", "off"]

    await hass.services.async_call(
        "select", "select_option", {"entity_id": SELECT, "option": "holiday"}, blocking=True
    )
    assert data.engine.scenario is Scenario.HOLIDAY
    assert hass.states.get(SELECT).state == "holiday"

    await hass.services.async_call(
        "select", "select_option", {"entity_id": SELECT, "option": "away"}, blocking=True
    )
    assert data.engine.scenario is Scenario.AWAY
    assert data.engine.return_at is None


async def test_entities_share_one_device(hass, setup_at):
    await setup_at(NOW)
    registry = er.async_get(hass)
    device_ids = {
        registry.async_get(entity_id).device_id
        for entity_id in (
            SELECT,
            DATETIME,
            SENSOR_A,
            "sensor.chronothermostat_zone_b_status",
        )
    }
    assert len(device_ids) == 1
    device = dr.async_get(hass).async_get(device_ids.pop())
    assert device.name == "Chronothermostat"
    assert device.manufacturer == "dbtswdev"


async def test_datetime_entity_roundtrip(hass, setup_at):
    data = await setup_at(NOW)
    assert hass.states.get(DATETIME).state == "unknown"

    value = NOW + timedelta(days=2)
    await hass.services.async_call(
        "datetime",
        "set_value",
        {"entity_id": DATETIME, "datetime": value.isoformat()},
        blocking=True,
    )
    assert data.engine.return_at == value
    assert datetime.fromisoformat(hass.states.get(DATETIME).state) == value

    await hass.services.async_call(
        "select", "select_option", {"entity_id": SELECT, "option": "away"}, blocking=True
    )
    assert data.engine.return_at == value


async def test_zone_sensor_state_and_attributes(hass, setup_at):
    await setup_at(NOW)

    state = hass.states.get(SENSOR_A)
    assert state.state == "schedule"
    attrs = state.attributes
    assert attrs["zone"] == "climate.zone_a"
    assert attrs["program"] == "work"
    assert attrs["program_target"] == 19.0
    assert attrs["next_step_at"] == datetime(2026, 11, 10, 23, 0, tzinfo=ROME).isoformat()
    assert attrs["next_step_target"] == 16.0
    assert len(attrs["today"]) == 96
    assert hass.states.get("sensor.chronothermostat_zone_b_status").state == "schedule"


async def test_zone_sensor_updates_on_climate_change(hass, setup_at):
    await setup_at(NOW)
    old = hass.states.get("climate.zone_a")

    hass.states.async_set("climate.zone_a", "heat", {**old.attributes, "temperature": 25.0})
    await hass.async_block_till_done()
    assert hass.states.get(SENSOR_A).state == "forced"

    hass.states.async_set("climate.zone_a", "off", {**old.attributes, "temperature": 25.0})
    await hass.async_block_till_done()
    assert hass.states.get(SENSOR_A).state == "zone_off"


async def test_zone_sensor_unavailable_when_climate_unavailable(hass, setup_at):
    await setup_at(NOW)
    hass.states.async_set("climate.zone_a", "unavailable")
    await hass.async_block_till_done()
    assert hass.states.get(SENSOR_A).state == "unavailable"


async def test_missing_zone_sensor_is_unavailable(hass, rome_time_zone, two_climates, climate_calls, freezer):
    freezer.move_to(NOW)
    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id="chronothermostat",
        data={"zones": ["climate.zone_a", "climate.gone"]},
    )
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert entry.state is ConfigEntryState.LOADED
    assert hass.states.get(SENSOR_A).state == "schedule"
    assert hass.states.get("sensor.chronothermostat_gone_status").state == "unavailable"


async def test_away_without_return_shows_away_no_return(hass, setup_at):
    data = await setup_at(NOW)
    await hass.services.async_call(
        "select", "select_option", {"entity_id": SELECT, "option": "away"}, blocking=True
    )
    assert data.engine.return_at is None

    old = hass.states.get("climate.zone_a")
    hass.states.async_set("climate.zone_a", "off", old.attributes)
    await hass.async_block_till_done()
    assert hass.states.get(SENSOR_A).state == "away_no_return"
