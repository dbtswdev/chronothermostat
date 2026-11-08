import type { WeekdayKey } from "./format";

export type Program = "work" | "holiday";
export type Scenario = "work" | "holiday" | "away" | "off";

export interface Hass {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
  states: Record<string, { state: string; attributes: Record<string, unknown> } | undefined>;
  entities?: Record<string, { platform?: string } | undefined>;
  locale?: { language?: string };
  language?: string;
}

export interface ZoneInfo {
  entity_id: string;
  name: string;
  status_entity_id: string | null;
}

export interface Info {
  scenario_entity_id: string | null;
  return_at_entity_id: string | null;
  zones: ZoneInfo[];
}

export interface ProgramData {
  weekdays: Record<WeekdayKey, number[]>;
  min_temp: number;
  max_temp: number;
  step: number;
}

const DOMAIN = "chronothermostat";

export function getInfo(hass: Hass): Promise<Info> {
  return hass.callWS<Info>({ type: `${DOMAIN}/info` });
}

export function getProgram(hass: Hass, zone: string, program: Program): Promise<ProgramData> {
  return hass.callWS<ProgramData>({ type: `${DOMAIN}/get_program`, zone, program });
}

export function setProgram(
  hass: Hass,
  zone: string,
  program: Program,
  weekday: WeekdayKey,
  values: number[],
): Promise<unknown> {
  return hass.callService(DOMAIN, "set_program", { zone, program, weekday, values });
}

export function copyDay(
  hass: Hass,
  zone: string,
  program: Program,
  fromWeekday: WeekdayKey,
  toWeekday: WeekdayKey,
): Promise<unknown> {
  return hass.callService(DOMAIN, "copy_day", {
    zone,
    program,
    from_weekday: fromWeekday,
    to_weekday: toWeekday,
  });
}

const pad = (n: number): string => (n < 10 ? `0${n}` : String(n));

/** ISO 8601 in local time with an explicit UTC offset, so the browser's time zone is the one used. */
export function toOffsetIso(d: Date): string {
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const abs = Math.abs(off);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  );
}

export function setScenario(hass: Hass, scenario: Scenario, returnAt?: Date): Promise<unknown> {
  const data: Record<string, unknown> = { scenario };
  if (returnAt) data.return_at = toOffsetIso(returnAt);
  return hass.callService(DOMAIN, "set_scenario", data);
}
