import { describe, expect, it } from "vitest";
import {
  configProblem, scaleProblem, thermostatBounds, viewerOptions, viewerScale,
} from "../src/shared/viewer-options";

const day = (lo: number, hi: number): number[] =>
  Array.from({ length: 96 }, (_, i) => (i < 48 ? lo : hi));

describe("viewer options", () => {
  it("defaults to both axes and the automatic scale", () => {
    expect(viewerOptions({ entity: "climate.a" })).toEqual({
      temperatureAxis: true, timeAxis: true, fixed: undefined,
    });
  });

  it("reads hidden axes and a fixed scale", () => {
    expect(
      viewerOptions({
        entity: "climate.a", show_temperature_axis: false, show_time_axis: false,
        scale: "fixed", scale_min: 15, scale_max: 22,
      }),
    ).toEqual({ temperatureAxis: false, timeAxis: false, fixed: [15, 22] });
  });

  it("ignores scale_min/scale_max while the scale is automatic", () => {
    expect(viewerOptions({ entity: "climate.a", scale_min: 15, scale_max: 22 }).fixed).toBeUndefined();
  });

  it("automatic scale follows the day's values (one degree around, at least five)", () => {
    expect(viewerScale(undefined, day(16, 20))).toEqual([15, 21]);
    expect(viewerScale(undefined, day(18, 19))).toEqual([17, 22]);
  });

  it("fixed scale is used as is, whatever the values", () => {
    expect(viewerScale([15, 22], day(10, 28))).toEqual([15, 22]);
  });

  it("thermostat bounds come from the climate, else 5–30", () => {
    expect(thermostatBounds({ min_temp: 7, max_temp: 25 })).toEqual([7, 25]);
    expect(thermostatBounds(undefined)).toEqual([5, 30]);
    expect(thermostatBounds({ min_temp: "x", max_temp: 25 })).toEqual([5, 30]);
  });

  it("setConfig problem: a fixed scale needs two numbers, min below max", () => {
    expect(configProblem({ entity: "climate.a" })).toBeUndefined();
    expect(configProblem({ entity: "climate.a", scale: "fixed", scale_min: 15, scale_max: 22 })).toBeUndefined();
    expect(configProblem({ entity: "climate.a", scale: "fixed", scale_min: 15 })).toMatch(/scale_max/);
    expect(configProblem({ entity: "climate.a", scale: "fixed", scale_min: 22, scale_max: 22 })).toMatch(
      /lower/,
    );
    expect(configProblem({ entity: "climate.a", scale: "bogus" as never })).toMatch(/scale/);
  });

  it("editor problem: the fixed range must sit inside the thermostat's limits", () => {
    const fixed = (scale_min?: number, scale_max?: number) => ({
      entity: "climate.a", scale: "fixed" as const, scale_min, scale_max,
    });
    expect(scaleProblem(fixed(15, 22), [5, 30])).toBeUndefined();
    expect(scaleProblem({ entity: "climate.a" }, [5, 30])).toBeUndefined();
    expect(scaleProblem(fixed(4, 22), [5, 30])).toEqual({ field: "scale_min", key: "config_error_below" });
    expect(scaleProblem(fixed(15, 31), [5, 30])).toEqual({ field: "scale_max", key: "config_error_above" });
    expect(scaleProblem(fixed(22, 15), [5, 30])).toEqual({ field: "scale_max", key: "config_error_order" });
    expect(scaleProblem(fixed(undefined, 22), [5, 30])).toEqual({
      field: "scale_min", key: "config_error_missing",
    });
  });
});
