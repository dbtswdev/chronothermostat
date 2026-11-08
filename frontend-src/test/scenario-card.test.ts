import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import type { ChronothermostatScenarioCard } from "../src/scenario-card";

const SELECT = "select.chronothermostat_scenario";
const RETURN_AT = "datetime.chronothermostat_return_at";

type State = { state: string; attributes: Record<string, unknown> };
const st = (state: string): State => ({ state, attributes: {} });

function makeHass(scenario: string, returnAt = "unknown", language = "en") {
  return {
    states: { [SELECT]: st(scenario), [RETURN_AT]: st(returnAt) } as Record<string, State>,
    locale: { language },
    callWS: vi.fn().mockResolvedValue({
      scenario_entity_id: SELECT,
      return_at_entity_id: RETURN_AT,
      zones: [],
    }),
    callService: vi.fn().mockResolvedValue(undefined),
  };
}

const flush = async (el: { updateComplete: Promise<unknown> }): Promise<void> => {
  for (let i = 0; i < 4; i++) {
    await Promise.resolve();
    await el.updateComplete;
  }
};

async function mount(scenario: string, returnAt = "unknown", config: Record<string, unknown> = {}) {
  const el = document.createElement("chronothermostat-scenario-card") as ChronothermostatScenarioCard;
  el.setConfig(config as never);
  const hass = makeHass(scenario, returnAt);
  el.hass = hass as never;
  document.body.appendChild(el);
  await flush(el);
  return { el, hass };
}

const root = (el: HTMLElement): ShadowRoot => el.shadowRoot as ShadowRoot;
const chip = (el: HTMLElement, key: string): HTMLButtonElement =>
  root(el).querySelector(`.chip[data-scenario="${key}"]`) as HTMLButtonElement;
const sentence = (el: HTMLElement): string =>
  (root(el).querySelector(".sentence") as HTMLElement).textContent?.trim() ?? "";
const confirmBtn = (el: HTMLElement): HTMLButtonElement =>
  root(el).querySelector(".confirm") as HTMLButtonElement;
const setInput = (el: HTMLElement, sel: string, value: string): void => {
  const input = root(el).querySelector(sel) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
};

describe("scenario card", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 9, 6, 30)); // Monday 06:30
  });
  afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
  });

  it("test_tapping_work_calls_set_scenario_immediately", async () => {
    const { el, hass } = await mount("holiday");
    expect(hass.callWS).toHaveBeenCalledWith({ type: "chronothermostat/info" });
    chip(el, "work").click();
    await flush(el);
    expect(hass.callService).toHaveBeenCalledWith("chronothermostat", "set_scenario", { scenario: "work" });
    chip(el, "holiday").click();
    await flush(el);
    expect(hass.callService).toHaveBeenLastCalledWith("chronothermostat", "set_scenario", { scenario: "holiday" });
  });

  it("test_tapping_off_requires_confirm", async () => {
    const { el, hass } = await mount("work");
    chip(el, "off").click();
    await flush(el);
    expect(hass.callService).not.toHaveBeenCalled();
    expect(confirmBtn(el)).not.toBeNull();
    confirmBtn(el).click();
    await flush(el);
    expect(hass.callService).toHaveBeenCalledWith("chronothermostat", "set_scenario", { scenario: "off" });
    expect(root(el).querySelector(".confirm")).toBeNull();
  });

  it("test_away_requires_future_return_then_calls_service_with_iso_datetime", async () => {
    const { el, hass } = await mount("work");
    chip(el, "away").click();
    await flush(el);
    setInput(el, 'input[type="date"]', "2026-11-08"); // yesterday relative to the fake clock
    setInput(el, 'input[type="time"]', "19:00");
    confirmBtn(el).click();
    await flush(el);
    expect(root(el).querySelector(".error")?.textContent?.trim()).toBe("Set the return day and time");
    expect(hass.callService).not.toHaveBeenCalled();

    setInput(el, 'input[type="date"]', "2026-11-12");
    setInput(el, 'input[type="time"]', "18:45");
    confirmBtn(el).click();
    await flush(el);
    expect(hass.callService).toHaveBeenCalledTimes(1);
    const [domain, service, data] = hass.callService.mock.calls[0];
    expect([domain, service, data.scenario]).toEqual(["chronothermostat", "set_scenario", "away"]);
    expect(data.return_at).toMatch(/[+-]\d\d:\d\d$/);
    expect(Date.parse(data.return_at)).toBe(new Date(2026, 10, 12, 18, 45).getTime());
    expect(root(el).querySelector(".panel")).toBeNull();
  });

  it("test_sentence_reflects_select_and_datetime_states", async () => {
    const { el, hass } = await mount("work");
    expect(sentence(el)).toBe("The house follows the Work program.");
    const set = async (scenario: string, returnAt = "unknown"): Promise<void> => {
      hass.states = { [SELECT]: st(scenario), [RETURN_AT]: st(returnAt) };
      el.hass = { ...hass } as never;
      await flush(el);
    };
    await set("holiday");
    expect(sentence(el)).toBe("The house follows the Holiday program.");
    await set("away", new Date(2026, 10, 12, 19, 0).toISOString());
    expect(sentence(el)).toBe("Heating off until Thursday 12 at 19:00, then it switches to Work by itself.");
    await set("away", "unknown");
    expect(sentence(el)).toBe("Away with no return: stays off until you set a return.");
    await set("away", new Date(2026, 10, 8, 19, 0).toISOString());
    expect(sentence(el)).toBe("Away with no return: stays off until you set a return.");
    await set("away", "garbage");
    expect(sentence(el)).toBe("Away with no return: stays off until you set a return.");
    await set("off");
    expect(sentence(el)).toBe("Heating off until you pick another scenario.");
    expect(chip(el, "off").classList.contains("active")).toBe(true);
  });

  it("prefills the away panel with tomorrow 19:00 local", async () => {
    const { el } = await mount("work");
    chip(el, "away").click();
    await flush(el);
    expect((root(el).querySelector('input[type="date"]') as HTMLInputElement).value).toBe("2026-11-10");
    const time = root(el).querySelector('input[type="time"]') as HTMLInputElement;
    expect(time.value).toBe("19:00");
    expect(time.getAttribute("step")).toBe("900");
    chip(el, "work").click(); // tapping another chip closes the panel
    await flush(el);
    expect(root(el).querySelector(".panel")).toBeNull();
  });

  it("shows a service failure inline and keeps the panel open", async () => {
    const { el, hass } = await mount("work");
    hass.callService.mockRejectedValueOnce(new Error("Return must be in the future"));
    chip(el, "away").click();
    await flush(el);
    confirmBtn(el).click();
    await flush(el);
    expect(root(el).querySelector(".error")?.textContent?.trim()).toBe("Return must be in the future");
    expect(root(el).querySelector(".panel")).not.toBeNull();
  });

  it("cancel on Off closes without a call", async () => {
    const { el, hass } = await mount("work");
    chip(el, "off").click();
    await flush(el);
    (root(el).querySelector(".cancel") as HTMLButtonElement).click();
    await flush(el);
    expect(root(el).querySelector(".panel")).toBeNull();
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it("uses the name override, and retries info after a failure no sooner than 30 s", async () => {
    const el = document.createElement("chronothermostat-scenario-card") as ChronothermostatScenarioCard;
    el.setConfig({ name: "Casa" });
    const hass = makeHass("work");
    hass.callWS.mockRejectedValueOnce(new Error("boom"));
    el.hass = hass as never;
    document.body.appendChild(el);
    await flush(el);
    expect(root(el).querySelector(".label")?.textContent?.trim()).toBe("Casa");
    expect(root(el).querySelector(".error")?.textContent?.trim()).toBe("Could not load the data.");
    el.hass = { ...hass } as never;
    await flush(el);
    expect(hass.callWS).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(31_000);
    el.hass = { ...hass } as never;
    await flush(el);
    expect(hass.callWS).toHaveBeenCalledTimes(2);
    expect(root(el).querySelector(".error")).toBeNull();
  });

  it("registers the element and the card picker entry", () => {
    expect(customElements.get("chronothermostat-scenario-card")).toBeDefined();
    expect(window.customCards).toContainEqual({
      type: "chronothermostat-scenario-card",
      name: "Chronothermostat scenario",
      preview: false,
    });
    const el = document.createElement("chronothermostat-scenario-card") as ChronothermostatScenarioCard;
    expect(() => el.setConfig({})).not.toThrow();
    expect(el.getCardSize()).toBe(3);
    expect((el.constructor as unknown as { getStubConfig(): unknown }).getStubConfig()).toEqual({});
  });
});
