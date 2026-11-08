"""Services of the Chronothermostat integration."""

from __future__ import annotations

from typing import TYPE_CHECKING

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.util import dt as dt_util

from .const import DOMAIN, WEEKDAYS, Scenario

if TYPE_CHECKING:
    from . import ChronoData

SERVICE_SET_SCENARIO = "set_scenario"
SERVICE_SET_PROGRAM = "set_program"
SERVICE_COPY_DAY = "copy_day"

PROGRAMS = ("work", "holiday")

SET_SCENARIO_SCHEMA = vol.Schema(
    {
        vol.Required("scenario"): vol.In([s.value for s in Scenario]),
        vol.Optional("return_at"): cv.datetime,
    }
)
SET_PROGRAM_SCHEMA = vol.Schema(
    {
        vol.Required("zone"): cv.entity_id,
        vol.Required("program"): vol.In(PROGRAMS),
        vol.Required("weekday"): vol.In(WEEKDAYS),
        # Content and length are decided by the engine (normalize_day).
        vol.Required("values"): list,
    }
)
COPY_DAY_SCHEMA = vol.Schema(
    {
        vol.Required("zone"): cv.entity_id,
        vol.Required("program"): vol.In(PROGRAMS),
        vol.Required("from_weekday"): vol.In(WEEKDAYS),
        vol.Required("to_weekday"): vol.In(WEEKDAYS),
    }
)


def _error(key: str, **placeholders: str) -> ServiceValidationError:
    return ServiceValidationError(
        translation_domain=DOMAIN,
        translation_key=key,
        translation_placeholders=placeholders or None,
    )


def get_chrono_data(hass: HomeAssistant) -> ChronoData:
    """Return the loaded entry's runtime data or raise not_loaded."""
    loaded = hass.data.get(DOMAIN)
    if not loaded:
        raise _error("not_loaded")
    return next(iter(loaded.values()))


def _zone(data: ChronoData, zone: str) -> str:
    if zone not in data.engine.zone_ids:
        raise _error("unknown_zone", zone=zone)
    return zone


async def _async_set_scenario(call: ServiceCall) -> None:
    data = get_chrono_data(call.hass)
    scenario = Scenario(call.data["scenario"])
    return_at = call.data.get("return_at")
    if return_at is not None and return_at.tzinfo is None:
        # The service's own datetime selector sends local times without offset.
        return_at = return_at.replace(tzinfo=dt_util.get_default_time_zone())
    if scenario is Scenario.AWAY and return_at is None:
        raise _error("return_at_required")
    try:
        await data.engine.async_set_scenario(scenario, return_at, source="service")
    except ValueError as err:
        raise _error("return_at_required") from err


async def _async_set_program(call: ServiceCall) -> None:
    data = get_chrono_data(call.hass)
    zone = _zone(data, call.data["zone"])
    try:
        await data.engine.async_save_day(
            zone,
            Scenario(call.data["program"]),
            call.data["weekday"],
            call.data["values"],
        )
    except ValueError as err:
        raise _error("invalid_program", error=str(err)) from err


async def _async_copy_day(call: ServiceCall) -> None:
    data = get_chrono_data(call.hass)
    zone = _zone(data, call.data["zone"])
    try:
        await data.engine.async_copy_day(
            zone,
            Scenario(call.data["program"]),
            call.data["from_weekday"],
            call.data["to_weekday"],
        )
    except ValueError as err:
        raise _error("invalid_program", error=str(err)) from err


def async_register_services(hass: HomeAssistant) -> None:
    """Register the integration services (once, from async_setup)."""
    hass.services.async_register(
        DOMAIN, SERVICE_SET_SCENARIO, _async_set_scenario, SET_SCENARIO_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SET_PROGRAM, _async_set_program, SET_PROGRAM_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_COPY_DAY, _async_copy_day, COPY_DAY_SCHEMA
    )
