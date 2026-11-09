import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import type { ChronothermostatViewerCard } from "../src/viewer-card";

const ZONE = "climate.zone_a";
const SENSOR = "sensor.chronothermostat_zone_a_status";

type State = { state: string; attributes: Record<string, unknown> };

/** 19 °C all day, 15 °C from 09:00 (slot 36) on. */
const today = (): number[] => Array.from({ length: 96 }, (_, i) => (i < 36 ? 19 : 15));

const sensor = (state: string, attrs: Record<string, unknown> = {}): State => ({
  state,
  attributes: {
    zone: ZONE,
    program: "work",
    program_target: 19,
    next_step_at: new Date(2026, 10, 9, 9, 0).toISOString(),
    next_step_target: 15,
    today: today(),
    return_at: null,
    ...attrs,
  },
});

const climate = (temperature = 19): State => ({ state: "heat", attributes: { temperature } });

function makeHass(states: Record<string, State>, language = "it") {
  return { states, locale: { language }, callWS: vi.fn(), callService: vi.fn() };
}

async function mount(states: Record<string, State>, config: Record<string, unknown> = { entity: ZONE }, language = "it") {
  const el = document.createElement("chronothermostat-viewer-card") as ChronothermostatViewerCard;
  el.setConfig(config as never);
  const hass = makeHass(states, language);
  el.hass = hass as never;
  document.body.appendChild(el);
  await el.updateComplete;
  return { el, hass };
}

const root = (el: HTMLElement): ShadowRoot => el.shadowRoot as ShadowRoot;
const sentence = (el: HTMLElement): HTMLElement => root(el).querySelector(".sentence") as HTMLElement;

describe("viewer card", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 9, 6, 30)); // Monday 06:30
  });
  afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
  });

  it("test_schedule_sentence_until_next_step", async () => {
    const { el } = await mount({ [SENSOR]: sensor("schedule"), [ZONE]: climate() });
    expect(sentence(el).textContent?.trim()).toBe("Programma: 19,0 °C fino alle 09:00, poi 15,0 °C.");
    expect(root(el).querySelector(".chart")).not.toBeNull();
    expect(root(el).querySelector(".header")?.textContent).toContain("Oggi, lunedì · Lavoro");
    expect(root(el).querySelector(".clock")?.textContent?.trim()).toBe("06:30");
    expect(root(el).querySelector(".now")).not.toBeNull();
    expect(root(el).querySelectorAll(".bar.past").length).toBe(26);
  });

  it("test_forced_sentence_and_band_rendered", async () => {
    const { el } = await mount({ [SENSOR]: sensor("forced"), [ZONE]: climate(22) });
    expect(sentence(el).textContent?.trim()).toBe(
      "Forzato a 22,0 °C fino alle 09:00, poi torna al programma (15,0 °C).",
    );
    const band = root(el).querySelector(".band");
    expect(band).not.toBeNull();
    // 06:30 is slot 26, 09:00 is slot 36: the band spans the 10 slots in between.
    const width = Number(band?.getAttribute("width"));
    const bar = root(el).querySelector(".bar")!;
    expect(width).toBeCloseTo(Number(bar.getAttribute("width")) * 10, 1);
  });

  it("test_bars_and_band_render_with_crisp_edges", async () => {
    // The 480-unit chart is stretched to the card width: without crisp edges the abutting bars
    // show light anti-aliasing seams between them.
    const { el } = await mount({ [SENSOR]: sensor("forced"), [ZONE]: climate(22) });
    const rects = Array.from(root(el).querySelectorAll(".bar, .band"));
    expect(rects.length).toBe(97);
    for (const rect of rects) expect(rect.getAttribute("shape-rendering")).toBe("crispEdges");
  });

  it("test_zone_off_sentence_in_error_colour", async () => {
    const { el } = await mount({ [SENSOR]: sensor("zone_off"), [ZONE]: { state: "off", attributes: {} } });
    expect(sentence(el).textContent?.trim()).toBe("Spento da te. Il programma riparte quando lo riaccendi.");
    expect(sentence(el).getAttribute("style")).toContain("var(--error-color)");
  });

  it("test_away_sentence_with_return_and_chart_hidden", async () => {
    const returnAt = new Date(2026, 10, 12, 18, 0);
    const { el } = await mount({
      [SENSOR]: sensor("away", { return_at: returnAt.toISOString() }),
      [ZONE]: { state: "off", attributes: {} },
    });
    expect(sentence(el).textContent?.trim()).toBe("Fuori casa: spento fino a giovedì 12 alle 18:00, poi Lavoro.");
    expect(root(el).querySelector(".chart")).toBeNull();
  });

  it("finds the sensor by the zone attribute among several sensors", async () => {
    const { el } = await mount({
      "sensor.other": { state: "forced", attributes: { zone: "climate.zone_b" } },
      "sensor.unrelated": { state: "5", attributes: {} },
      [SENSOR]: sensor("schedule"),
      [ZONE]: climate(),
    });
    expect(sentence(el).textContent).toContain("Programma: 19,0 °C");
  });

  it("prefers the chronothermostat platform entity when hass.entities is available", async () => {
    const el = document.createElement("chronothermostat-viewer-card") as ChronothermostatViewerCard;
    el.setConfig({ entity: ZONE });
    const decoy = sensor("off");
    el.hass = {
      ...makeHass({ "sensor.decoy": decoy, [SENSOR]: sensor("schedule"), [ZONE]: climate() }),
      entities: { "sensor.decoy": { platform: "template" }, [SENSOR]: { platform: "chronothermostat" } },
    } as never;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(sentence(el).textContent).toContain("Programma");
  });

  it("re-resolves the sensor when the cached one disappears", async () => {
    const { el, hass } = await mount({ [SENSOR]: sensor("schedule"), [ZONE]: climate() });
    const renamed = "sensor.renamed_status";
    el.hass = makeHass({ [renamed]: sensor("off"), [ZONE]: climate() }) as never;
    await el.updateComplete;
    expect(sentence(el).textContent?.trim()).toBe("Impianto spento.");
    expect(hass.callWS).not.toHaveBeenCalled();
  });

  it("shows the flat schedule sentence when there is no next step", async () => {
    const { el } = await mount({
      [SENSOR]: sensor("schedule", { next_step_at: null, next_step_target: null }),
      [ZONE]: climate(),
    });
    expect(sentence(el).textContent?.trim()).toBe("Programma: 19,0 °C.");
  });

  it("test_unavailable_sensor_shows_unavailable_and_no_chart", async () => {
    const { el } = await mount({ [SENSOR]: sensor("unavailable"), [ZONE]: climate() });
    expect(sentence(el).textContent?.trim()).toBe("Termostato non disponibile.");
    expect(root(el).querySelector(".chart")).toBeNull();
    const missing = await mount({ [ZONE]: climate() });
    expect(sentence(missing.el).textContent?.trim()).toBe("Termostato non disponibile.");
  });

  it("test_zone_on_manual_sentence_uses_climate_temperature", async () => {
    const { el } = await mount({ [SENSOR]: sensor("zone_on_manual"), [ZONE]: climate(21.5) });
    expect(sentence(el).textContent).toContain("21,5 °C");
    expect(root(el).querySelector(".chart")).toBeNull();
  });

  it("re-renders only when the sensor or climate state object changed", async () => {
    const sensorState = sensor("schedule");
    const climateState = climate();
    const { el } = await mount({ [SENSOR]: sensorState, [ZONE]: climateState });
    const spy = vi.spyOn(el as never, "render");
    el.hass = makeHass({ [SENSOR]: sensorState, [ZONE]: climateState, "light.x": climate() }) as never;
    await el.updateComplete;
    expect(spy).not.toHaveBeenCalled();
    el.hass = makeHass({ [SENSOR]: sensorState, [ZONE]: climate(20) }) as never;
    await el.updateComplete;
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("refreshes the clock every minute and stops the timer on disconnect", async () => {
    const { el } = await mount({ [SENSOR]: sensor("schedule"), [ZONE]: climate() });
    await vi.advanceTimersByTimeAsync(60_000);
    await el.updateComplete;
    expect(root(el).querySelector(".clock")?.textContent?.trim()).toBe("06:31");
    el.remove();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("ticks on the minute boundary", async () => {
    vi.setSystemTime(new Date(2026, 10, 9, 6, 30, 20));
    const { el } = await mount({ [SENSOR]: sensor("schedule"), [ZONE]: climate() });
    const clockAfter = async (ms: number): Promise<string | undefined> => {
      await vi.advanceTimersByTimeAsync(ms);
      await el.updateComplete;
      return root(el).querySelector(".clock")?.textContent?.trim();
    };
    expect(await clockAfter(0)).toBe("06:30");
    expect(await clockAfter(39_999)).toBe("06:30");
    expect(await clockAfter(1)).toBe("06:31");
    expect(await clockAfter(60_000)).toBe("06:32");
  });

  it("takes the current time on every update from Home Assistant", async () => {
    const { el } = await mount({ [SENSOR]: sensor("schedule"), [ZONE]: climate() });
    // The quarter-hour step arrives before the minute timer fires.
    vi.setSystemTime(new Date(2026, 10, 9, 6, 45, 0, 300));
    el.hass = makeHass({ [SENSOR]: sensor("schedule"), [ZONE]: climate() }) as never;
    await el.updateComplete;
    expect(root(el).querySelector(".clock")?.textContent?.trim()).toBe("06:45");
    expect(root(el).querySelectorAll(".bar.past").length).toBe(27);
  });

  it("keeps the last rendering through a short unavailable blip", async () => {
    const live = { [SENSOR]: sensor("schedule"), [ZONE]: climate() };
    // Unavailable entities lose their extra attributes, the zone attribute included.
    const blip = {
      [SENSOR]: { state: "unavailable", attributes: {} },
      [ZONE]: { state: "unavailable", attributes: {} },
    };
    const { el } = await mount(live);
    const schedule = "Programma: 19,0 °C fino alle 09:00, poi 15,0 °C.";
    const shownAfter = async (ms: number): Promise<string | undefined> => {
      await vi.advanceTimersByTimeAsync(ms);
      await el.updateComplete;
      return sentence(el).textContent?.trim();
    };
    expect(await shownAfter(0)).toBe(schedule);

    el.hass = makeHass(blip) as never;
    expect(await shownAfter(4_900)).toBe(schedule);
    expect(root(el).querySelector(".chart")).not.toBeNull();

    el.hass = makeHass({ [SENSOR]: sensor("schedule"), [ZONE]: climate() }) as never;
    expect(await shownAfter(4_900)).toBe(schedule);

    // Longer than the grace period: the zone really is unavailable.
    el.hass = makeHass(blip) as never;
    expect(await shownAfter(4_900)).toBe(schedule);
    expect(await shownAfter(100)).toBe("Termostato non disponibile.");
    expect(root(el).querySelector(".chart")).toBeNull();
    el.remove();
    expect(vi.getTimerCount()).toBe(0);
  });

  const labels = (el: HTMLElement, sel: string): string[] =>
    Array.from(root(el).querySelectorAll(`${sel} span`)).map((s) => s.textContent?.trim() ?? "");

  it("shows temperature and hour labels by default", async () => {
    // today(): 19 °C then 15 °C → automatic scale 14..20, one-degree ticks.
    const { el } = await mount({ [SENSOR]: sensor("schedule"), [ZONE]: climate() });
    expect(labels(el, ".y-labels")).toEqual(["14°", "15°", "16°", "17°", "18°", "19°", "20°"]);
    expect(labels(el, ".x-labels")).toEqual(["0", "6", "12", "18", "24"]);
    expect(root(el).querySelectorAll(".hgrid").length).toBe(7);
    // 19 °C sits at 1/6 of the height from the top of the 14..20 range.
    const top = (root(el).querySelectorAll(".y-labels span")[5] as HTMLElement).style.top;
    expect(parseFloat(top)).toBeCloseTo(100 / 6, 1);
  });

  it("hides each axis on request", async () => {
    const { el } = await mount(
      { [SENSOR]: sensor("schedule"), [ZONE]: climate() },
      { entity: ZONE, show_temperature_axis: false },
    );
    expect(root(el).querySelector(".y-labels")).toBeNull();
    expect(root(el).querySelector(".hgrid")).toBeNull();
    expect(labels(el, ".x-labels")).toHaveLength(5);
    el.setConfig({ entity: ZONE, show_time_axis: false } as never);
    await el.updateComplete;
    expect(root(el).querySelector(".x-labels")).toBeNull();
    expect(labels(el, ".y-labels")).toHaveLength(7);
  });

  it("draws a fixed range whatever the day's values, clipping what falls outside", async () => {
    const values = Array.from({ length: 96 }, (_, i) => (i < 36 ? 25 : 19));
    const { el } = await mount(
      { [SENSOR]: sensor("schedule", { today: values }), [ZONE]: climate() },
      { entity: ZONE, scale: "fixed", scale_min: 15, scale_max: 22 },
    );
    expect(labels(el, ".y-labels")).toEqual(["16°", "18°", "20°", "22°"]);
    const bars = root(el).querySelectorAll(".bar");
    expect(Number(bars[0].getAttribute("y"))).toBe(0); // 25 °C clipped at the top
    // 19 °C on 15..22: 4/7 of the height.
    expect(Number(bars[40].getAttribute("height"))).toBeCloseTo((100 * 4) / 7, 1);
  });

  it("thins the temperature labels of a very wide YAML range", async () => {
    const { el } = await mount(
      { [SENSOR]: sensor("schedule"), [ZONE]: climate() },
      { entity: ZONE, scale: "fixed", scale_min: 0, scale_max: 60 },
    );
    expect(labels(el, ".y-labels")).toEqual(["0°", "10°", "20°", "30°", "40°", "50°", "60°"]);
    expect(root(el).querySelectorAll(".hgrid").length).toBe(7);
  });

  it("rejects a fixed scale without a valid range", () => {
    const el = document.createElement("chronothermostat-viewer-card") as ChronothermostatViewerCard;
    expect(() =>
      el.setConfig({ entity: ZONE, scale: "fixed", scale_min: 22, scale_max: 18 } as never),
    ).toThrow("scale_min must be lower than scale_max");
  });

  it("registers the element and the card picker entry", () => {
    expect(customElements.get("chronothermostat-viewer-card")).toBeDefined();
    expect(window.customCards?.some((c) => c.type === "chronothermostat-viewer-card")).toBe(true);
    const el = document.createElement("chronothermostat-viewer-card") as ChronothermostatViewerCard;
    expect(() => el.setConfig({} as never)).toThrow("entity is required");
    expect(el.getCardSize()).toBe(4);
  });
});
