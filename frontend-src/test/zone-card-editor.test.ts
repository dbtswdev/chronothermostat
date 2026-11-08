import { afterEach, describe, expect, it, vi } from "vitest";
import { ChronothermostatEditorCard } from "../src/editor-card";
import {
  ChronothermostatZoneCardEditor, ZONE_CARD_EDITOR_TAG,
} from "../src/shared/zone-card-editor";

interface HaFormLike extends HTMLElement {
  hass: unknown;
  data: unknown;
  schema: unknown;
  computeLabel: (item: { name: string }) => string;
}

async function mountEditor(language: string, config: Record<string, unknown>) {
  const el = ChronothermostatEditorCard.getConfigElement() as ChronothermostatZoneCardEditor;
  el.hass = { callWS: vi.fn(), callService: vi.fn(), states: {}, locale: { language } } as never;
  el.setConfig(config as never);
  document.body.appendChild(el);
  await el.updateComplete;
  const form = el.shadowRoot?.querySelector("ha-form") as HaFormLike | null;
  if (!form) throw new Error("missing ha-form");
  return { el, form };
}

describe("zone card editor", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("is the registered config element of the editor card", () => {
    expect(customElements.get(ZONE_CARD_EDITOR_TAG)).toBe(ChronothermostatZoneCardEditor);
    const el = ChronothermostatEditorCard.getConfigElement();
    expect(el.tagName.toLowerCase()).toBe(ZONE_CARD_EDITOR_TAG);
  });

  it("renders ha-form with the entity and name schema and translated labels", async () => {
    const config = { type: "custom:chronothermostat-editor-card", entity: "climate.zone_a" };
    const { form } = await mountEditor("it", config);
    expect(form.data).toEqual(config);
    expect(form.schema).toEqual([
      { name: "entity", selector: { entity: { domain: "climate" } } },
      { name: "name", selector: { text: {} } },
    ]);
    expect(form.computeLabel({ name: "entity" })).toBe("Termostato");
    expect(form.computeLabel({ name: "name" })).toBe("Nome (facoltativo)");
  });

  it("emits config-changed and drops an empty name", async () => {
    const { el, form } = await mountEditor("en", { type: "custom:x", entity: "climate.zone_a" });
    const seen: unknown[] = [];
    el.addEventListener("config-changed", (ev) => seen.push((ev as CustomEvent).detail.config));
    const change = (value: Record<string, unknown>): void => {
      form.dispatchEvent(new CustomEvent("value-changed", { detail: { value }, bubbles: true }));
    };
    change({ type: "custom:x", entity: "climate.zone_b", name: "" });
    change({ type: "custom:x", entity: "climate.zone_b", name: "Upstairs" });
    expect(seen).toEqual([
      { type: "custom:x", entity: "climate.zone_b" },
      { type: "custom:x", entity: "climate.zone_b", name: "Upstairs" },
    ]);
  });
});
