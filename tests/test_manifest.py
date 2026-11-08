import json
import pathlib

MANIFEST = pathlib.Path("custom_components/chronothermostat/manifest.json")


def test_manifest_fields():
    m = json.loads(MANIFEST.read_text())
    assert m["domain"] == "chronothermostat"
    assert m["config_flow"] is True and m["single_config_entry"] is True
    assert "websocket_api" in m["dependencies"] and "lovelace" in m["dependencies"]
    assert m["version"].count(".") == 2
