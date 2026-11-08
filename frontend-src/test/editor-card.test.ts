import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import type { ChronothermostatEditorCard } from "../src/editor-card";
import { WEEKDAY_KEYS, type WeekdayKey } from "../src/shared/format";

const ZONE = "climate.zone_a";
const SCENARIO = "select.chronothermostat_scenario";
type Week = Record<WeekdayKey, number[]>;

const flatWeek = (value: number): Week =>
  Object.fromEntries(WEEKDAY_KEYS.map((k) => [k, new Array(96).fill(value)])) as Week;

interface FakeOpts {
  scenario?: string;
  failProgram?: boolean;
  failSave?: boolean;
  zones?: string[];
}

/** A fake hass whose websocket/service calls behave like a tiny backend. */
function fakeHass(opts: FakeOpts = {}) {
  const store: Record<string, Week> = { work: flatWeek(19), holiday: flatWeek(17) };
  store.work.tue = new Array(96).fill(21);
  const callWS = vi.fn(async (msg: Record<string, unknown>) => {
    if (msg.type === "chronothermostat/info") {
      return {
        scenario_entity_id: SCENARIO,
        return_at_entity_id: null,
        zones: (opts.zones ?? [ZONE]).map((id) => ({ entity_id: id, name: "Zone A", status_entity_id: null })),
      };
    }
    if (msg.type === "chronothermostat/get_program") {
      if (opts.failProgram) throw new Error("boom");
      const week = store[msg.program as string];
      const copy = Object.fromEntries(WEEKDAY_KEYS.map((k) => [k, week[k].slice()]));
      return { weekdays: copy, min_temp: 7, max_temp: 30, step: 0.5 };
    }
    throw new Error(`unexpected ${String(msg.type)}`);
  });
  const callService = vi.fn(async (_domain: string, service: string, data: Record<string, unknown>) => {
    if (opts.failSave) throw new Error("boom");
    if (service === "set_program") {
      store[data.program as string][data.weekday as WeekdayKey] = (data.values as number[]).slice();
    }
    return {};
  });
  return {
    callWS,
    callService,
    states: { [SCENARIO]: { state: opts.scenario ?? "work", attributes: {} } },
    locale: { language: "en" },
  };
}

const flush = async (el: ChronothermostatEditorCard): Promise<void> => {
  for (let i = 0; i < 10; i++) await Promise.resolve();
  await el.updateComplete;
};

async function mount(opts: FakeOpts = {}, config: Record<string, unknown> = { entity: ZONE }) {
  const hass = fakeHass(opts);
  const el = document.createElement("chronothermostat-editor-card") as ChronothermostatEditorCard;
  el.setConfig(config as never);
  el.hass = hass as never;
  document.body.appendChild(el);
  await flush(el);
  return { el, hass };
}

const root = (el: HTMLElement): ShadowRoot => el.shadowRoot as ShadowRoot;
const q = (el: HTMLElement, sel: string): HTMLElement => {
  const found = root(el).querySelector<HTMLElement>(sel);
  if (!found) throw new Error(`missing ${sel}`);
  return found;
};
const text = (el: HTMLElement, sel: string): string => (q(el, sel).textContent ?? "").trim();

/** A short press on a hold-to-repeat button. */
async function press(el: ChronothermostatEditorCard, sel: string): Promise<void> {
  const button = q(el, sel);
  button.dispatchEvent(new Event("pointerdown"));
  button.dispatchEvent(new Event("pointerup"));
  await flush(el);
}

async function tap(el: ChronothermostatEditorCard, sel: string): Promise<void> {
  q(el, sel).click();
  await flush(el);
}

describe("editor card", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 9, 6, 30)); // Monday 06:30 → slot 26
  });
  afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
  });

  it("test_requires_entity_in_config", () => {
    const el = document.createElement("chronothermostat-editor-card") as ChronothermostatEditorCard;
    expect(() => el.setConfig({} as never)).toThrow("entity is required");
    expect(() => el.setConfig({ entity: "" })).toThrow("entity is required");
    expect(() => el.setConfig({ entity: ZONE })).not.toThrow();
  });

  it("registers the element and the card picker entry", () => {
    const el = document.createElement("chronothermostat-editor-card") as ChronothermostatEditorCard;
    expect(el.getCardSize()).toBe(8);
    const cards = (window as unknown as { customCards: unknown[] }).customCards;
    expect(cards).toContainEqual({
      type: "chronothermostat-editor-card",
      name: "Chronothermostat editor",
      preview: false,
    });
  });

  it("test_renders_seven_weekday_chips_and_96_bars", async () => {
    const { el, hass } = await mount();
    const days = root(el).querySelectorAll(".day");
    expect(days.length).toBe(7);
    expect(text(el, ".day.on")).toBe("Mon");
    expect(text(el, ".program.on")).toBe("Work");
    expect(root(el).querySelectorAll("rect.bar").length).toBe(96);
    expect(root(el).querySelectorAll("rect.bar.cursor").length).toBe(1);
    expect(root(el).querySelector(".cursor-line")).not.toBeNull();
    expect(text(el, ".day-name")).toBe("Monday");
    expect(text(el, ".time")).toBe("06:30");
    expect(text(el, ".temp")).toBe("19.0 °C");
    expect(text(el, ".status")).toBe("No changes");
    expect(hass.callWS).toHaveBeenCalledWith({
      type: "chronothermostat/get_program",
      zone: ZONE,
      program: "work",
    });
  });

  it("opens on the active scenario's program", async () => {
    const { el, hass } = await mount({ scenario: "holiday" });
    expect(text(el, ".program.on")).toBe("Holiday");
    expect(text(el, ".temp")).toBe("17.0 °C");
    expect(hass.callWS).toHaveBeenCalledWith({
      type: "chronothermostat/get_program",
      zone: ZONE,
      program: "holiday",
    });
  });

  it("test_plus_button_changes_cursor_value_and_marks_unsaved", async () => {
    const { el } = await mount();
    await press(el, "#plus");
    expect(text(el, ".temp")).toBe("19.5 °C");
    expect(text(el, ".time")).toBe("06:30");
    expect(text(el, ".status")).toBe("Unsaved changes");
    expect(q(el, ".status").classList.contains("warning")).toBe(true);
  });

  it("hold on + repeats", async () => {
    const { el } = await mount();
    const plus = q(el, "#plus");
    plus.dispatchEvent(new Event("pointerdown"));
    vi.advanceTimersByTime(450 + 110 * 2);
    plus.dispatchEvent(new Event("pointerup"));
    vi.advanceTimersByTime(1000);
    await flush(el);
    expect(text(el, ".temp")).toBe("21.0 °C");
  });

  it("test_continue_copies_value_to_next_slot", async () => {
    const { el } = await mount();
    await press(el, "#plus");
    await press(el, "#cont");
    expect(text(el, ".time")).toBe("06:45");
    expect(text(el, ".temp")).toBe("19.5 °C");
    await press(el, "#next");
    expect(text(el, ".time")).toBe("07:00");
    expect(text(el, ".temp")).toBe("19.0 °C");
    await press(el, "#prev");
    await press(el, "#prev");
    expect(text(el, ".time")).toBe("06:30");
    expect(text(el, ".temp")).toBe("19.5 °C");
  });

  it("tapping the chart moves the cursor to that quarter hour", async () => {
    const { el } = await mount();
    const chart = q(el, ".chart svg");
    chart.getBoundingClientRect = () => ({ left: 0, top: 0, width: 452, height: 150 }) as DOMRect;
    // Plot starts at x=26 and is 426 px wide: the middle of slot 48 (12:00) is at 26 + 48.5 * 426 / 96.
    chart.dispatchEvent(new PointerEvent("pointerdown", { clientX: 26 + (48.5 * 426) / 96 }));
    await flush(el);
    expect(text(el, ".time")).toBe("12:00");
    expect(text(el, ".status")).toBe("No changes");
  });

  it("test_switching_day_while_dirty_shows_save_discard_bar", async () => {
    const { el } = await mount();
    expect(root(el).querySelector(".dirty-bar")).toBeNull();
    await press(el, "#plus");
    await tap(el, '.day[data-day="tue"]');
    expect(text(el, ".dirty-bar .message")).toBe("Unsaved changes");
    expect(text(el, "#bar-save")).toBe("Save");
    expect(text(el, "#bar-discard")).toBe("Discard");
    expect(text(el, ".day.on")).toBe("Mon");
    expect(text(el, ".temp")).toBe("19.5 °C");
    await tap(el, '.program[data-program="holiday"]');
    expect(text(el, ".program.on")).toBe("Work");
    expect(root(el).querySelector(".dirty-bar")).not.toBeNull();
  });

  it("discard in the dirty bar switches the day and drops the edits", async () => {
    const { el, hass } = await mount();
    await press(el, "#plus");
    await tap(el, '.day[data-day="tue"]');
    await tap(el, "#bar-discard");
    expect(root(el).querySelector(".dirty-bar")).toBeNull();
    expect(text(el, ".day.on")).toBe("Tue");
    expect(text(el, ".temp")).toBe("21.0 °C");
    expect(text(el, ".status")).toBe("No changes");
    await tap(el, '.day[data-day="mon"]');
    expect(root(el).querySelector(".dirty-bar")).toBeNull();
    expect(text(el, ".temp")).toBe("19.0 °C");
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it("save in the dirty bar saves the current day, then switches", async () => {
    const { el, hass } = await mount();
    await press(el, "#plus");
    await tap(el, '.day[data-day="tue"]');
    await tap(el, "#bar-save");
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService.mock.calls[0][2].weekday).toBe("mon");
    expect(text(el, ".day.on")).toBe("Tue");
    expect(text(el, ".status")).toBe("Monday program saved");
    await tap(el, '.day[data-day="mon"]');
    expect(text(el, ".temp")).toBe("19.5 °C");
  });

  it("test_save_calls_set_program_service_with_96_values", async () => {
    const { el, hass } = await mount();
    await press(el, "#plus");
    hass.callWS.mockClear();
    await tap(el, "#save");
    expect(hass.callService).toHaveBeenCalledTimes(1);
    const [domain, service, data] = hass.callService.mock.calls[0];
    expect(domain).toBe("chronothermostat");
    expect(service).toBe("set_program");
    expect(data.zone).toBe(ZONE);
    expect(data.program).toBe("work");
    expect(data.weekday).toBe("mon");
    const values = data.values as number[];
    expect(values.length).toBe(96);
    expect(values[26]).toBe(19.5);
    expect(values.filter((v) => v === 19).length).toBe(95);
    expect(hass.callWS).toHaveBeenCalledWith({
      type: "chronothermostat/get_program",
      zone: ZONE,
      program: "work",
    });
    expect(text(el, ".status")).toBe("Monday program saved");
    expect(q(el, ".status").classList.contains("success")).toBe(true);
    vi.advanceTimersByTime(3000);
    await flush(el);
    expect(text(el, ".status")).toBe("No changes");
  });

  it("save failure shows the error and keeps the edits", async () => {
    const { el } = await mount({ failSave: true });
    await press(el, "#plus");
    await tap(el, "#save");
    expect(text(el, ".status")).toBe("Could not save.");
    expect(q(el, ".status").classList.contains("error")).toBe(true);
    expect(text(el, ".temp")).toBe("19.5 °C");
    expect((q(el, "#save") as HTMLButtonElement).disabled).toBe(false);
  });

  it("copy from copies the saved values of the chosen day and marks unsaved", async () => {
    const { el } = await mount();
    expect(root(el).querySelector(".copy-panel")).toBeNull();
    await tap(el, "#copy");
    const choices = root(el).querySelectorAll(".copy-panel .chip");
    expect(choices.length).toBe(6);
    expect(root(el).querySelector('.copy-panel [data-day="mon"]')).toBeNull();
    await tap(el, '.copy-panel [data-day="tue"]');
    expect(root(el).querySelector(".copy-panel")).toBeNull();
    expect(text(el, ".day.on")).toBe("Mon");
    expect(text(el, ".temp")).toBe("21.0 °C");
    expect(text(el, ".status")).toBe("Unsaved changes");
  });

  it("shows the load error instead of throwing", async () => {
    const failed = await mount({ failProgram: true });
    expect(text(failed.el, ".error")).toBe("Could not load the data.");
    const unknown = await mount({ zones: ["climate.other"] });
    expect(text(unknown.el, ".error")).toBe("Could not load the data.");
    expect(root(unknown.el).querySelector(".chart")).toBeNull();
  });
});
