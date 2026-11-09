import { afterEach, describe, expect, it, vi } from "vitest";
import { ChronothermostatEditorCard } from "../src/editor-card";
import { ChronothermostatViewerCard } from "../src/viewer-card";
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

interface FieldLike {
  name: string;
  selector: unknown;
}

async function mountViewer(language: string, config: Record<string, unknown>) {
  const el = ChronothermostatViewerCard.getConfigElement() as ChronothermostatZoneCardEditor;
  el.hass = {
    callWS: vi.fn(), callService: vi.fn(), locale: { language },
    states: { "climate.zone_a": { state: "heat", attributes: { min_temp: 7, max_temp: 25 } } },
  } as never;
  el.setConfig(config as never);
  document.body.appendChild(el);
  await el.updateComplete;
  const form = el.shadowRoot?.querySelector("ha-form") as HaFormLike | null;
  if (!form) throw new Error("missing ha-form");
  return { el, form };
}

const listen = (el: HTMLElement): unknown[] => {
  const seen: unknown[] = [];
  el.addEventListener("config-changed", (ev) => seen.push((ev as CustomEvent).detail.config));
  return seen;
};

const change = (form: HTMLElement, value: Record<string, unknown>): void => {
  form.dispatchEvent(new CustomEvent("value-changed", { detail: { value }, bubbles: true }));
};

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

  it("gives the viewer card entity, axis and scale options with defaults filled in", async () => {
    const { form } = await mountViewer("it", { entity: "climate.zone_a" });
    expect(form.data).toEqual({
      entity: "climate.zone_a", show_temperature_axis: true, show_time_axis: true, scale: "auto",
    });
    expect((form.schema as { name: string }[]).map((f) => f.name)).toEqual([
      "entity", "show_temperature_axis", "show_time_axis", "scale",
    ]);
    expect((form.schema as FieldLike[])[1].selector).toEqual({ boolean: {} });
    expect((form.schema as FieldLike[])[3].selector).toEqual({
      select: {
        mode: "list",
        options: [
          { value: "auto", label: "Automatica (segue i valori del giorno)" },
          { value: "fixed", label: "Range fisso" },
        ],
      },
    });
    expect(form.computeLabel({ name: "entity" })).toBe("Termostato");
    expect(form.computeLabel({ name: "show_time_axis" })).toBe("Mostra le ore");
    expect(form.computeLabel({ name: "scale" })).toBe("Altezza del grafico");
  });

  it("asks for the fixed range within the thermostat's limits", async () => {
    const { form } = await mountViewer("en", {
      entity: "climate.zone_a", scale: "fixed", scale_min: 15, scale_max: 22,
    });
    const fields = form.schema as FieldLike[];
    expect(fields.map((f) => f.name).slice(-2)).toEqual(["scale_min", "scale_max"]);
    for (const field of fields.slice(-2)) {
      expect(field.selector).toEqual({
        number: { min: 7, max: 25, step: 0.5, mode: "box", unit_of_measurement: "°C" },
      });
    }
    expect(form.computeLabel({ name: "scale_max" })).toBe("Highest temperature");
  });

  it("prefills 16–22 (within the limits) when switching to a fixed range", async () => {
    const { el, form } = await mountViewer("en", { entity: "climate.zone_a" });
    const seen = listen(el);
    change(form, { entity: "climate.zone_a", show_temperature_axis: true, show_time_axis: true, scale: "fixed" });
    expect(seen).toEqual([{ entity: "climate.zone_a", scale: "fixed", scale_min: 16, scale_max: 22 }]);
  });

  it("refuses a range outside the thermostat's limits and says why", async () => {
    const { el, form } = await mountViewer("it", {
      entity: "climate.zone_a", scale: "fixed", scale_min: 15, scale_max: 22,
    });
    const seen = listen(el);
    change(form, { ...(form.data as object), scale_min: 6 });
    await el.updateComplete;
    expect(seen).toEqual([]);
    expect((form as unknown as { error: unknown }).error).toEqual({
      scale_min: "Il termostato non scende sotto 7 °C.",
    });
    expect((form.data as { scale_min: number }).scale_min).toBe(6);
    change(form, { ...(form.data as object), scale_min: 22.5, scale_max: 22 });
    await el.updateComplete;
    expect((form as unknown as { error: unknown }).error).toEqual({
      scale_max: "Deve essere più alta della temperatura minima.",
    });
    change(form, { ...(form.data as object), scale_min: 17.5 });
    await el.updateComplete;
    expect((form as unknown as { error: unknown }).error).toEqual({});
    expect(seen).toEqual([{ entity: "climate.zone_a", scale: "fixed", scale_min: 17.5, scale_max: 22 }]);
  });

  it("prefills only when switching to fixed: clearing both fields asks for values", async () => {
    const { el, form } = await mountViewer("en", {
      entity: "climate.zone_a", scale: "fixed", scale_min: 15, scale_max: 22,
    });
    const seen = listen(el);
    change(form, { ...(form.data as object), scale_min: undefined, scale_max: undefined });
    await el.updateComplete;
    expect(seen).toEqual([]);
    expect((form as unknown as { error: unknown }).error).toEqual({ scale_min: "Enter a value." });
  });

  it("prefills the whole thermostat range when 16–22 does not fit in it", async () => {
    const { el, form } = await mountViewer("en", { entity: "climate.zone_a" });
    el.hass = {
      ...(el.hass as object),
      states: { "climate.zone_a": { state: "heat", attributes: { min_temp: 23, max_temp: 30 } } },
    } as never;
    const seen = listen(el);
    change(form, { ...(form.data as object), scale: "fixed" });
    expect(seen).toEqual([{ entity: "climate.zone_a", scale: "fixed", scale_min: 23, scale_max: 30 }]);
  });

  it("fits the fixed range into a newly chosen thermostat's limits", async () => {
    const { el, form } = await mountViewer("en", {
      entity: "climate.zone_a", scale: "fixed", scale_min: 8, scale_max: 24,
    });
    el.hass = {
      ...(el.hass as object),
      states: {
        ...(el.hass as { states: object }).states,
        "climate.zone_b": { state: "heat", attributes: { min_temp: 10, max_temp: 20 } },
      },
    } as never;
    const seen = listen(el);
    change(form, { ...(form.data as object), entity: "climate.zone_b" });
    expect(seen).toEqual([{ entity: "climate.zone_b", scale: "fixed", scale_min: 10, scale_max: 20 }]);
  });

  it("keeps a name written in YAML", async () => {
    const { el, form } = await mountViewer("en", { entity: "climate.zone_a", name: "Office" });
    const seen = listen(el);
    change(form, { ...(form.data as object), show_time_axis: false });
    expect(seen).toEqual([{ entity: "climate.zone_a", name: "Office", show_time_axis: false }]);
  });

  it("keeps the YAML short: defaults and an unused range are dropped", async () => {
    const { el, form } = await mountViewer("en", {
      entity: "climate.zone_a", scale: "fixed", scale_min: 15, scale_max: 22,
    });
    const seen = listen(el);
    change(form, {
      type: "custom:x", entity: "climate.zone_a", show_temperature_axis: true, show_time_axis: false,
      scale: "auto", scale_min: 15, scale_max: 22,
    });
    expect(seen).toEqual([{ type: "custom:x", entity: "climate.zone_a", show_time_axis: false }]);
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
