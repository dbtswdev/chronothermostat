"""Tests for the config and options flows."""

from homeassistant.config_entries import ConfigEntryState
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import entity_registry as er

from custom_components.chronothermostat.const import DOMAIN, Scenario


async def test_user_flow_creates_entry(hass, two_climates, climate_calls):
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"zones": two_climates}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Chronothermostat"
    assert result["data"] == {"zones": two_climates}
    assert result["result"].unique_id == "chronothermostat"


async def test_user_flow_rejects_empty_zones(hass, two_climates):
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"zones": []}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": "no_zones"}


async def test_single_instance_abort(hass, config_entry):
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "single_instance_allowed"


async def test_options_flow_updates_zones(hass, setup_integration):
    entry = setup_integration
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "init"

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"zones": ["climate.zone_a"]}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()

    assert entry.options["zones"] == ["climate.zone_a"]
    assert entry.state is ConfigEntryState.LOADED
    assert hass.data[DOMAIN][entry.entry_id].zone_ids == ["climate.zone_a"]


async def _set_zones(hass, entry, zones):
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"zones": zones}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()


async def test_options_flow_removes_status_sensor_of_removed_zone(
    hass, setup_integration
):
    entry = setup_integration
    registry = er.async_get(hass)
    assert registry.async_get("sensor.chronothermostat_zone_b_status") is not None

    await _set_zones(hass, entry, ["climate.zone_a"])

    assert registry.async_get("sensor.chronothermostat_zone_b_status") is None
    assert hass.states.get("sensor.chronothermostat_zone_b_status") is None
    assert registry.async_get("sensor.chronothermostat_zone_a_status") is not None
    assert registry.async_get("select.chronothermostat_scenario") is not None
    assert registry.async_get("datetime.chronothermostat_return_at") is not None


async def test_removed_zone_keeps_its_program_when_added_back(
    hass, setup_integration
):
    entry = setup_integration
    custom_day = [17.5] * 96
    await hass.data[DOMAIN][entry.entry_id].engine.async_save_day(
        "climate.zone_b", Scenario.WORK, "sat", custom_day
    )

    await _set_zones(hass, entry, ["climate.zone_a"])
    await _set_zones(hass, entry, ["climate.zone_a", "climate.zone_b"])

    data = hass.data[DOMAIN][entry.entry_id]
    assert data.store.get_week("climate.zone_b", Scenario.WORK)["sat"] == custom_day
    assert er.async_get(hass).async_get("sensor.chronothermostat_zone_b_status")
