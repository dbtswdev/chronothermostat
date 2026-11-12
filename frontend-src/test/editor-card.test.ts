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
  failPrograms?: string[];
  failSave?: boolean;
  zones?: string[];
}

interface Held {
  program: string;
  release: () => void;
}

/** A fake hass whose websocket/service calls behave like a tiny backend. */
function fakeHass(opts: FakeOpts = {}) {
  const store: Record<string, Week> = { work: flatWeek(19), holiday: flatWeek(17) };
  store.work.tue = new Array(96).fill(21);
  /** Test controls: failing calls, and get_program / set_program held until released by hand. */
  const backend = {
    store,
    failInfo: false,
    failPrograms: new Set(opts.failPrograms ?? []),
    holdPrograms: false,
    heldPrograms: [] as Held[],
    holdSaves: false,
    heldSaves: [] as (() => void)[],
  };
  const answerProgram = (program: string) => {
    if (backend.failPrograms.has(program)) throw new Error("boom");
    const week = store[program];
    const copy = Object.fromEntries(WEEKDAY_KEYS.map((k) => [k, week[k].slice()]));
    return { weekdays: copy, min_temp: 7, max_temp: 30, step: 0.5 };
  };
  const callWS = vi.fn(async (msg: Record<string, unknown>) => {
    if (msg.type === "chronothermostat/info") {
      if (backend.failInfo) throw new Error("boom");
      return {
        scenario_entity_id: SCENARIO,
        return_at_entity_id: null,
        zones: (opts.zones ?? [ZONE]).map((id) => ({ entity_id: id, name: "Zone A", status_entity_id: null })),
      };
    }
    if (msg.type === "chronothermostat/get_program") {
      const program = msg.program as string;
      if (!backend.holdPrograms) return answerProgram(program);
      return new Promise((resolve, reject) => {
        backend.heldPrograms.push({
          program,
          release: () => {
            try {
              resolve(answerProgram(program));
            } catch (err) {
              reject(err);
            }
          },
        });
      });
    }
    throw new Error(`unexpected ${String(msg.type)}`);
  });
  const callService = vi.fn(async (_domain: string, service: string, data: Record<string, unknown>) => {
    if (backend.holdSaves) await new Promise<void>((resolve) => backend.heldSaves.push(resolve));
    if (opts.failSave) throw new Error("boom");
    if (service === "set_program") {
      store[data.program as string][data.weekday as WeekdayKey] = (data.values as number[]).slice();
    }
    return {};
  });
  const hass = {
    callWS,
    callService,
    states: { [SCENARIO]: { state: opts.scenario ?? "work", attributes: {} } },
    locale: { language: "en" },
  };
  return { hass, backend };
}

const flush = async (el: ChronothermostatEditorCard): Promise<void> => {
  for (let i = 0; i < 30; i++) await Promise.resolve();
  await el.updateComplete;
};

async function mount(opts: FakeOpts = {}, config: Record<string, unknown> = { entity: ZONE }) {
  const { hass, backend } = fakeHass(opts);
  const el = document.createElement("chronothermostat-editor-card") as ChronothermostatEditorCard;
  el.setConfig(config as never);
  el.hass = hass as never;
  document.body.appendChild(el);
  await flush(el);
  return { el, hass, backend };
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

  it("the step buttons work from the keyboard", async () => {
    const { el } = await mount();
    const key = async (sel: string, k: string): Promise<void> => {
      q(el, sel).dispatchEvent(new KeyboardEvent("keydown", { key: k, cancelable: true }));
      await flush(el);
    };
    await key("#plus", "Enter");
    await key("#plus", " ");
    expect(text(el, ".temp")).toBe("20.0 °C");
    await key("#minus", "Enter");
    expect(text(el, ".temp")).toBe("19.5 °C");
    await key("#next", " ");
    expect(text(el, ".time")).toBe("06:45");
    await key("#prev", "Enter");
    expect(text(el, ".time")).toBe("06:30");
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
    const failed = await mount({ failPrograms: ["work", "holiday"] });
    expect(text(failed.el, ".error")).toBe("Could not load the data.");
    const unknown = await mount({ zones: ["climate.other"] });
    expect(text(unknown.el, ".error")).toBe("Could not load the data.");
    expect(root(unknown.el).querySelector(".chart")).toBeNull();
  });

  describe("switching", () => {
    const programOn = (el: HTMLElement): string => text(el, ".program.on");
    const dayOn = (el: HTMLElement): string => text(el, ".day.on");

    it("a late response never wipes edits and the last tap wins (program, then day)", async () => {
      const { el, backend } = await mount();
      backend.holdPrograms = true;
      await tap(el, '.program[data-program="holiday"]');
      expect(programOn(el)).toBe("Holiday");
      await tap(el, '.day[data-day="wed"]');
      expect(dayOn(el)).toBe("Wed");
      expect((q(el, "#plus") as HTMLButtonElement).disabled).toBe(true);
      expect((q(el, "#save") as HTMLButtonElement).disabled).toBe(true);
      expect((q(el, "#copy") as HTMLButtonElement).disabled).toBe(true);
      await press(el, "#plus"); // refused while loading: nothing to lose later
      expect([text(el, ".temp"), text(el, ".status")]).toEqual(["19.0 °C", "No changes"]);
      expect(backend.heldPrograms.map((h) => h.program)).toEqual(["holiday", "holiday"]);
      backend.heldPrograms[0].release(); // stale
      await flush(el);
      expect([programOn(el), dayOn(el)]).toEqual(["Holiday", "Wed"]);
      backend.heldPrograms[1].release();
      await flush(el);
      expect([programOn(el), dayOn(el), text(el, ".day-name")]).toEqual(["Holiday", "Wed", "Wednesday"]);
      expect(text(el, ".temp")).toBe("17.0 °C");
      expect(text(el, ".status")).toBe("No changes");
      expect(root(el).querySelector(".dirty-bar")).toBeNull();
      await press(el, "#plus");
      expect(text(el, ".temp")).toBe("17.5 °C");
      expect(text(el, ".status")).toBe("Unsaved changes");
    });

    it("the last program tap wins whatever order the responses arrive in", async () => {
      const { el, backend } = await mount();
      backend.holdPrograms = true;
      await tap(el, '.program[data-program="holiday"]');
      await tap(el, '.program[data-program="work"]');
      expect(programOn(el)).toBe("Work");
      backend.heldPrograms[0].release(); // holiday, stale
      await flush(el);
      backend.heldPrograms[1].release();
      await flush(el);
      expect([programOn(el), text(el, ".temp")]).toEqual(["Work", "19.0 °C"]);

      await tap(el, '.program[data-program="holiday"]');
      await tap(el, '.program[data-program="work"]');
      backend.heldPrograms[3].release(); // work, newest
      await flush(el);
      backend.heldPrograms[2].release(); // holiday, stale
      await flush(el);
      expect([programOn(el), text(el, ".temp")]).toEqual(["Work", "19.0 °C"]);
    });

    it("a program switch loads that program and keeps the cursor", async () => {
      const { el, hass } = await mount();
      await press(el, "#next");
      hass.callWS.mockClear();
      await tap(el, '.program[data-program="holiday"]');
      expect(hass.callWS).toHaveBeenCalledWith({
        type: "chronothermostat/get_program",
        zone: ZONE,
        program: "holiday",
      });
      expect([programOn(el), dayOn(el)]).toEqual(["Holiday", "Mon"]);
      expect(text(el, ".time")).toBe("06:45");
      expect(text(el, ".temp")).toBe("17.0 °C");
      expect(text(el, ".status")).toBe("No changes");
    });

    it("a day switch reloads the program, so changes made elsewhere are not overwritten", async () => {
      const { el, backend } = await mount();
      backend.store.work.tue = new Array(96).fill(22);
      await tap(el, '.day[data-day="tue"]');
      expect(text(el, ".temp")).toBe("22.0 °C");
    });

    it("a failed program switch shows the load error and keeps the card usable", async () => {
      const { el } = await mount({ failPrograms: ["holiday"] });
      await tap(el, '.program[data-program="holiday"]');
      expect(text(el, ".status")).toBe("Could not load the data.");
      expect(q(el, ".status").classList.contains("error")).toBe(true);
      expect([programOn(el), dayOn(el), text(el, ".temp")]).toEqual(["Work", "Mon", "19.0 °C"]);
      await press(el, "#plus");
      expect(text(el, ".temp")).toBe("19.5 °C");
      expect(text(el, ".status")).toBe("Unsaved changes");
    });

    it("bar Save towards another program saves the day, then loads that program", async () => {
      const { el, hass } = await mount();
      await press(el, "#plus");
      await tap(el, '.program[data-program="holiday"]');
      expect(programOn(el)).toBe("Work");
      await tap(el, "#bar-save");
      expect(hass.callService).toHaveBeenCalledTimes(1);
      const data = hass.callService.mock.calls[0][2];
      expect([data.program, data.weekday, (data.values as number[])[26]]).toEqual(["work", "mon", 19.5]);
      expect([programOn(el), dayOn(el), text(el, ".temp")]).toEqual(["Holiday", "Mon", "17.0 °C"]);
      expect(root(el).querySelector(".dirty-bar")).toBeNull();
      expect(text(el, ".status")).toBe("Monday program saved");
      await tap(el, '.program[data-program="work"]');
      expect(text(el, ".temp")).toBe("19.5 °C");
    });

    it("bar Discard towards another program drops the edits, then loads that program", async () => {
      const { el, hass } = await mount();
      await press(el, "#plus");
      await tap(el, '.program[data-program="holiday"]');
      await tap(el, "#bar-discard");
      expect([programOn(el), text(el, ".temp"), text(el, ".status")]).toEqual([
        "Holiday", "17.0 °C", "No changes",
      ]);
      await tap(el, '.program[data-program="work"]');
      expect(text(el, ".temp")).toBe("19.0 °C");
      expect(hass.callService).not.toHaveBeenCalled();
    });

    it("the bar goes away, with its pending switch, when the edits are undone", async () => {
      const { el } = await mount();
      await press(el, "#plus");
      await tap(el, '.day[data-day="tue"]');
      expect(root(el).querySelector(".dirty-bar")).not.toBeNull();
      await press(el, "#minus");
      expect(root(el).querySelector(".dirty-bar")).toBeNull();
      expect([dayOn(el), text(el, ".status")]).toEqual(["Mon", "No changes"]);
      await tap(el, "#save");
      expect(dayOn(el)).toBe("Mon");
      await tap(el, '.day[data-day="tue"]');
      expect([dayOn(el), text(el, ".temp")]).toEqual(["Tue", "21.0 °C"]);
      expect(root(el).querySelector(".dirty-bar")).toBeNull();
    });

    it("main Save with a pending switch saves the day, then switches", async () => {
      const { el, hass } = await mount();
      await press(el, "#plus");
      await tap(el, '.day[data-day="tue"]');
      await tap(el, "#save");
      expect(hass.callService.mock.calls[0][2].weekday).toBe("mon");
      expect([dayOn(el), text(el, ".temp"), text(el, ".status")]).toEqual([
        "Tue", "21.0 °C", "Monday program saved",
      ]);
      expect(root(el).querySelector(".dirty-bar")).toBeNull();
    });

    it("bar Save keeps the bar when edits were made while the save was in flight", async () => {
      const { el, hass, backend } = await mount();
      await press(el, "#plus");
      await tap(el, '.day[data-day="tue"]');
      backend.holdSaves = true;
      await tap(el, "#bar-save");
      expect((q(el, "#bar-save") as HTMLButtonElement).disabled).toBe(true);
      await press(el, "#plus"); // 20.0 while the 19.5 is being saved
      backend.heldSaves[0]();
      await flush(el);
      expect(root(el).querySelector(".dirty-bar")).not.toBeNull();
      expect([dayOn(el), text(el, ".temp"), text(el, ".status")]).toEqual([
        "Mon", "20.0 °C", "Unsaved changes",
      ]);
      backend.holdSaves = false;
      await tap(el, "#bar-save");
      expect(hass.callService).toHaveBeenCalledTimes(2);
      expect((hass.callService.mock.calls[1][2].values as number[])[26]).toBe(20);
      expect(dayOn(el)).toBe("Tue");
      expect(root(el).querySelector(".dirty-bar")).toBeNull();
    });
  });

  it("retries a failed first load on a later hass update, at most every 30 s", async () => {
    const { el, hass, backend } = await (async () => {
      const made = fakeHass();
      made.backend.failInfo = true;
      const card = document.createElement("chronothermostat-editor-card") as ChronothermostatEditorCard;
      card.setConfig({ entity: ZONE });
      card.hass = made.hass as never;
      document.body.appendChild(card);
      await flush(card);
      return { el: card, ...made };
    })();
    expect(text(el, ".error")).toBe("Could not load the data.");
    backend.failInfo = false;
    const calls = hass.callWS.mock.calls.length;
    el.hass = { ...hass } as never;
    await flush(el);
    expect(hass.callWS.mock.calls.length).toBe(calls);
    expect(text(el, ".error")).toBe("Could not load the data.");
    vi.advanceTimersByTime(30_000);
    el.hass = { ...hass } as never;
    await flush(el);
    expect(root(el).querySelector(".load-error")).toBeNull();
    expect(text(el, ".temp")).toBe("19.0 °C");
  });
});
