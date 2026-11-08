"""Tests for the Chronothermostat websocket API."""

from custom_components.chronothermostat.const import DOMAIN, Scenario


async def test_ws_info_lists_zones_and_entities(hass, hass_ws_client, setup_integration):
    client = await hass_ws_client(hass)

    await client.send_json({"id": 1, "type": "chronothermostat/info"})
    msg = await client.receive_json()

    assert msg["success"]
    assert msg["result"] == {
        "scenario_entity_id": "select.chronothermostat_scenario",
        "return_at_entity_id": "datetime.chronothermostat_return_at",
        "zones": [
            {
                "entity_id": "climate.zone_a",
                "name": "Zone A",
                "status_entity_id": "sensor.chronothermostat_zone_a_status",
            },
            {
                "entity_id": "climate.zone_b",
                "name": "Zone B",
                "status_entity_id": "sensor.chronothermostat_zone_b_status",
            },
        ],
    }


async def test_ws_get_program_returns_week_and_limits(hass, hass_ws_client, setup_integration):
    data = hass.data[DOMAIN][setup_integration.entry_id]
    client = await hass_ws_client(hass)

    await client.send_json(
        {"id": 1, "type": "chronothermostat/get_program", "zone": "climate.zone_a", "program": "work"}
    )
    msg = await client.receive_json()

    assert msg["success"]
    result = msg["result"]
    assert result["weekdays"] == data.store.get_week("climate.zone_a", Scenario.WORK)
    assert set(result["weekdays"]) == {"mon", "tue", "wed", "thu", "fri", "sat", "sun"}
    assert all(len(day) == 96 for day in result["weekdays"].values())
    assert (result["min_temp"], result["max_temp"], result["step"]) == (5.0, 30.0, 0.5)


async def test_ws_get_program_holiday(hass, hass_ws_client, setup_integration):
    data = hass.data[DOMAIN][setup_integration.entry_id]
    client = await hass_ws_client(hass)
    await data.engine.async_save_day("climate.zone_b", Scenario.HOLIDAY, "sun", [22.0] * 96)

    await client.send_json(
        {"id": 1, "type": "chronothermostat/get_program", "zone": "climate.zone_b", "program": "holiday"}
    )
    msg = await client.receive_json()

    assert msg["success"]
    assert msg["result"]["weekdays"]["sun"] == [22.0] * 96


async def test_ws_get_program_unknown_zone_errors(hass, hass_ws_client, setup_integration):
    client = await hass_ws_client(hass)

    await client.send_json(
        {"id": 1, "type": "chronothermostat/get_program", "zone": "climate.nowhere", "program": "work"}
    )
    msg = await client.receive_json()

    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"


async def test_ws_not_loaded_errors(hass, hass_ws_client, setup_integration):
    client = await hass_ws_client(hass)
    await hass.config_entries.async_unload(setup_integration.entry_id)
    await hass.async_block_till_done()

    await client.send_json({"id": 1, "type": "chronothermostat/info"})
    msg = await client.receive_json()

    assert not msg["success"]
    assert msg["error"]["code"] == "not_loaded"
