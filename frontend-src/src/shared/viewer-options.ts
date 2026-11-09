import { tempRange } from "./chart";
import type { StringKey } from "./i18n";
import type { ZoneCardConfig } from "./zone-card-editor";

/** Configuration of the viewer card: the zone plus how its chart is drawn. */
export interface ViewerCardConfig extends ZoneCardConfig {
  /** Temperature labels on the left (default true). */
  show_temperature_axis?: boolean;
  /** Hour labels below (default true). */
  show_time_axis?: boolean;
  /** "auto" (default) follows the day's values; "fixed" uses scale_min..scale_max. */
  scale?: "auto" | "fixed";
  scale_min?: number;
  scale_max?: number;
}

export interface ViewerOptions {
  temperatureAxis: boolean;
  timeAxis: boolean;
  /** The fixed vertical range, or undefined for the automatic one. */
  fixed?: [number, number];
}

/** Bounds of the automatic scale (wider than any thermostat, as before v0.2.0). */
const AUTO_MIN = 5;
const AUTO_MAX = 35;
/** Thermostat limits used when the climate does not report them (as the integration does). */
export const FALLBACK_BOUNDS: [number, number] = [5, 30];

const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export function viewerOptions(config: ViewerCardConfig): ViewerOptions {
  const fixed =
    config.scale === "fixed" && isNumber(config.scale_min) && isNumber(config.scale_max)
      ? ([config.scale_min, config.scale_max] as [number, number])
      : undefined;
  return {
    temperatureAxis: config.show_temperature_axis !== false,
    timeAxis: config.show_time_axis !== false,
    fixed,
  };
}

/** The chart's vertical range: the fixed one, else one degree around the day's values. */
export function viewerScale(fixed: [number, number] | undefined, values: number[]): [number, number] {
  return fixed ?? tempRange(values, AUTO_MIN, AUTO_MAX);
}

/** The thermostat's allowed range, from its `min_temp`/`max_temp` attributes. */
export function thermostatBounds(attrs: Record<string, unknown> | undefined): [number, number] {
  const lo = attrs?.min_temp;
  const hi = attrs?.max_temp;
  return isNumber(lo) && isNumber(hi) && lo < hi ? [lo, hi] : FALLBACK_BOUNDS;
}

/** Why a YAML configuration cannot be drawn (thrown by setConfig), or undefined. */
export function configProblem(config: ViewerCardConfig): string | undefined {
  if (config.scale === undefined || config.scale === "auto") return undefined;
  if (config.scale !== "fixed") return 'scale must be "auto" or "fixed"';
  for (const key of ["scale_min", "scale_max"] as const) {
    if (config[key] === undefined) return `${key} is required with a fixed scale`;
    if (!isNumber(config[key])) return `${key} must be a number`;
  }
  const { scale_min: min, scale_max: max } = config as { scale_min: number; scale_max: number };
  if (min >= max) return "scale_min must be lower than scale_max";
  return undefined;
}

/** At most this many temperature labels: more would overlap in the viewer's short chart. */
const MAX_LABELS = 7;

/** Every k-th tick (k = 1, 2, 4, 10, …) so that at most MAX_LABELS remain. */
export function thinTicks<T>(ticks: T[]): T[] {
  for (const k of [1, 2, 4, 10, 20, 40, 100]) {
    if (Math.ceil(ticks.length / k) <= MAX_LABELS) return ticks.filter((_, i) => i % k === 0);
  }
  return ticks.filter((_, i) => i === 0 || i === ticks.length - 1);
}

/** A fixed range inside the thermostat's limits: [min, max] clamped, else the whole range. */
export function fitRange(
  [min, max]: [number, number],
  [lo, hi]: [number, number],
): [number, number] {
  const a = Math.min(hi, Math.max(lo, min));
  const b = Math.min(hi, Math.max(lo, max));
  return a < b ? [a, b] : [lo, hi];
}

/** What is wrong with the fixed range for this thermostat (shown by the config editor). */
export function scaleProblem(
  config: ViewerCardConfig,
  [lo, hi]: [number, number],
): { field: "scale_min" | "scale_max"; key: StringKey } | undefined {
  if (config.scale !== "fixed") return undefined;
  const { scale_min: min, scale_max: max } = config;
  if (!isNumber(min)) return { field: "scale_min", key: "config_error_missing" };
  if (!isNumber(max)) return { field: "scale_max", key: "config_error_missing" };
  if (min < lo) return { field: "scale_min", key: "config_error_below" };
  if (min > hi) return { field: "scale_min", key: "config_error_above" };
  if (max > hi) return { field: "scale_max", key: "config_error_above" };
  if (max < lo) return { field: "scale_max", key: "config_error_below" };
  if (min >= max) return { field: "scale_max", key: "config_error_order" };
  return undefined;
}
