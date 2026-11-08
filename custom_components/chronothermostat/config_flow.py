"""Config flow for Chronothermostat."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlowWithReload,
)
from homeassistant.const import UnitOfTemperature
from homeassistant.core import callback
from homeassistant.helpers.selector import EntitySelector, EntitySelectorConfig

from .const import CONF_ZONES, DOMAIN


def _schema(default: list[str] | None = None) -> vol.Schema:
    key = (
        vol.Required(CONF_ZONES, default=default)
        if default is not None
        else vol.Required(CONF_ZONES)
    )
    return vol.Schema(
        {key: EntitySelector(EntitySelectorConfig(domain="climate", multiple=True))}
    )


class ChronothermostatConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle the initial setup."""

    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlowWithReload:
        """Return the options flow."""
        return ChronothermostatOptionsFlow()

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Ask which climates are zones."""
        if self.hass.config.units.temperature_unit != UnitOfTemperature.CELSIUS:
            return self.async_abort(reason="celsius_only")
        errors: dict[str, str] = {}
        if user_input is not None:
            if user_input[CONF_ZONES]:
                await self.async_set_unique_id(DOMAIN)
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title="Chronothermostat", data={CONF_ZONES: user_input[CONF_ZONES]}
                )
            errors["base"] = "no_zones"
        return self.async_show_form(
            step_id="user", data_schema=_schema(), errors=errors
        )


class ChronothermostatOptionsFlow(OptionsFlowWithReload):
    """Change the configured zones."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the zones."""
        errors: dict[str, str] = {}
        if user_input is not None:
            if user_input[CONF_ZONES]:
                return self.async_create_entry(data={CONF_ZONES: user_input[CONF_ZONES]})
            errors["base"] = "no_zones"
        current = self.config_entry.options.get(
            CONF_ZONES, self.config_entry.data[CONF_ZONES]
        )
        return self.async_show_form(
            step_id="init", data_schema=_schema(list(current)), errors=errors
        )
