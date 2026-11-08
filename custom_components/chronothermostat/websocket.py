"""Websocket API of the Chronothermostat integration (feeds the editor card)."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er

from .const import DOMAIN, TEMP_STEP, Scenario
from .services import PROGRAMS, get_chrono_data


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    """Register the websocket commands (once, from async_setup)."""
    websocket_api.async_register_command(hass, ws_info)
    websocket_api.async_register_command(hass, ws_get_program)


def _entity_id(
    registry: er.EntityRegistry, platform_domain: str, unique_id: str
) -> str | None:
    return registry.async_get_entity_id(platform_domain, DOMAIN, unique_id)


@websocket_api.websocket_command({vol.Required("type"): "chronothermostat/info"})
@callback
def ws_info(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the entity ids the cards need."""
    try:
        data = get_chrono_data(hass)
    except ServiceValidationError:
        connection.send_error(msg["id"], "not_loaded", "Chronothermostat is not loaded")
        return
    registry = er.async_get(hass)
    entry_id = data.engine.entry_id
    connection.send_result(
        msg["id"],
        {
            "scenario_entity_id": _entity_id(
                registry, "select", f"{entry_id}_scenario"
            ),
            "return_at_entity_id": _entity_id(
                registry, "datetime", f"{entry_id}_return_at"
            ),
            "zones": [
                {
                    "entity_id": zone_id,
                    "name": data.engine.zone_name(zone_id),
                    "status_entity_id": _entity_id(
                        registry, "sensor", f"{entry_id}_{zone_id}_status"
                    ),
                }
                for zone_id in data.engine.zone_ids
            ],
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "chronothermostat/get_program",
        vol.Required("zone"): str,
        vol.Required("program"): vol.In(PROGRAMS),
    }
)
@callback
def ws_get_program(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return one zone's weekly program with its temperature limits."""
    try:
        data = get_chrono_data(hass)
    except ServiceValidationError:
        connection.send_error(msg["id"], "not_loaded", "Chronothermostat is not loaded")
        return
    zone = msg["zone"]
    if zone not in data.engine.zone_ids:
        connection.send_error(msg["id"], "not_found", f"Unknown zone {zone}")
        return
    min_temp, max_temp = data.engine.min_max(zone)
    connection.send_result(
        msg["id"],
        {
            "weekdays": data.store.get_week(zone, Scenario(msg["program"])),
            "min_temp": min_temp,
            "max_temp": max_temp,
            "step": TEMP_STEP,
        },
    )
