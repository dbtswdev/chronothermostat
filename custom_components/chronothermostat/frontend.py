"""Serve the Lovelace cards bundle and register it as a Lovelace resource."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace.const import LOVELACE_DATA, MODE_STORAGE
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

BUNDLE_URL = "/chronothermostat/chronothermostat-cards.js"
BUNDLE_PATH = Path(__file__).parent / "frontend" / "chronothermostat-cards.js"
_STATIC_REGISTERED = f"{DOMAIN}_frontend_static_registered"


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Serve the bundle and make sure Lovelace loads it. Idempotent."""
    if not hass.data.get(_STATIC_REGISTERED):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(BUNDLE_URL, str(BUNDLE_PATH), cache_headers=False)]
        )
        hass.data[_STATIC_REGISTERED] = True

    integration = await async_get_integration(hass, DOMAIN)
    url = f"{BUNDLE_URL}?v={integration.version}"

    lovelace = hass.data.get(LOVELACE_DATA)
    if lovelace is None:
        return
    if lovelace.resource_mode != MODE_STORAGE:
        _LOGGER.warning(
            "Lovelace resources are in YAML mode: add this to your resources "
            "to load the Chronothermostat cards: url: %s, type: module",
            url,
        )
        return

    resources = lovelace.resources
    await resources.async_get_info()  # loads the collection lazily
    matching = [
        item for item in resources.async_items() if item["url"].startswith(BUNDLE_URL)
    ]
    if not matching:
        await resources.async_create_item({"res_type": "module", "url": url})
    elif matching[0]["url"] != url:
        await resources.async_update_item(matching[0]["id"], {"url": url})
    else:
        return
    _LOGGER.info("registered Lovelace resource %s", url)
