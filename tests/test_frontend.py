"""Tests for the frontend bundle registration."""

import logging

from homeassistant.components.lovelace.const import LOVELACE_DATA
from homeassistant.setup import async_setup_component

from custom_components.chronothermostat.frontend import (
    BUNDLE_URL,
    async_register_frontend,
)

VERSION = "0.2.1"


def _matching(hass):
    return [
        item
        for item in hass.data[LOVELACE_DATA].resources.async_items()
        if item["url"].startswith(BUNDLE_URL)
    ]


async def test_static_path_serves_bundle(hass, hass_client, setup_integration):
    client = await hass_client()

    resp = await client.get(BUNDLE_URL)

    assert resp.status == 200
    assert "chronothermostat" in await resp.text()


async def test_lovelace_resource_created_once(hass, setup_integration):
    await async_register_frontend(hass)
    await async_register_frontend(hass)

    items = _matching(hass)
    assert len(items) == 1
    assert items[0]["type"] == "module"
    assert items[0]["url"] == f"{BUNDLE_URL}?v={VERSION}"


async def test_lovelace_resource_url_updated_on_new_version(hass, setup_integration):
    resources = hass.data[LOVELACE_DATA].resources
    (item,) = _matching(hass)
    await resources.async_update_item(item["id"], {"url": f"{BUNDLE_URL}?v=0.0.1"})

    await async_register_frontend(hass)

    items = _matching(hass)
    assert len(items) == 1
    assert items[0]["id"] == item["id"]
    assert items[0]["url"] == f"{BUNDLE_URL}?v={VERSION}"


async def test_yaml_resource_mode_warns_and_does_not_raise(hass, caplog):
    assert await async_setup_component(
        hass, "lovelace", {"lovelace": {"resource_mode": "yaml"}}
    )
    await hass.async_block_till_done()

    with caplog.at_level(logging.WARNING):
        await async_register_frontend(hass)

    assert f"url: {BUNDLE_URL}?v={VERSION}" in caplog.text
    assert "type: module" in caplog.text


async def test_registration_logged(hass, setup_integration, caplog):
    resources = hass.data[LOVELACE_DATA].resources
    (item,) = _matching(hass)
    await resources.async_delete_item(item["id"])

    with caplog.at_level(logging.INFO):
        await async_register_frontend(hass)

    assert "registered Lovelace resource" in caplog.text
