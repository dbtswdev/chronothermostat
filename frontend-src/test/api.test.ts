import { describe, expect, it, vi } from "vitest";
import {
  copyDay, getInfo, getProgram, setProgram, setScenario, type Hass,
} from "../src/shared/api";

const stub = (): Hass & { callWS: ReturnType<typeof vi.fn>; callService: ReturnType<typeof vi.fn> } =>
  ({ callWS: vi.fn(async () => ({})), callService: vi.fn(async () => ({})), states: {} }) as never;

describe("api", () => {
  it("setScenario sends return_at with an explicit offset, instant preserved", async () => {
    const hass = stub();
    const d = new Date(2026, 10, 15, 19, 0);
    await setScenario(hass, "away", d);
    const [domain, service, data] = hass.callService.mock.calls[0];
    expect(domain).toBe("chronothermostat");
    expect(service).toBe("set_scenario");
    expect(data.scenario).toBe("away");
    expect(data.return_at).toMatch(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d[+-]\d\d:\d\d$/);
    expect(Date.parse(data.return_at)).toBe(d.getTime());
  });

  it("setScenario omits return_at when not given", async () => {
    const hass = stub();
    await setScenario(hass, "work");
    expect(hass.callService).toHaveBeenCalledWith("chronothermostat", "set_scenario", {
      scenario: "work",
    });
  });

  it("getInfo and getProgram call the websocket API", async () => {
    const hass = stub();
    await getInfo(hass);
    expect(hass.callWS).toHaveBeenCalledWith({ type: "chronothermostat/info" });
    await getProgram(hass, "climate.z", "holiday");
    expect(hass.callWS).toHaveBeenCalledWith({
      type: "chronothermostat/get_program",
      zone: "climate.z",
      program: "holiday",
    });
  });

  it("setProgram uses the backend field names", async () => {
    const hass = stub();
    await setProgram(hass, "climate.z", "work", "tue", [19]);
    expect(hass.callService).toHaveBeenCalledWith("chronothermostat", "set_program", {
      zone: "climate.z",
      program: "work",
      weekday: "tue",
      values: [19],
    });
  });

  it("copyDay uses the backend field names", async () => {
    const hass = stub();
    await copyDay(hass, "climate.z", "work", "mon", "tue");
    expect(hass.callService).toHaveBeenCalledWith("chronothermostat", "copy_day", {
      zone: "climate.z",
      program: "work",
      from_weekday: "mon",
      to_weekday: "tue",
    });
  });
});
