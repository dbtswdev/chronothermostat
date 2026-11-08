import type { Lang } from "./i18n";

export type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const WEEKDAY_KEYS: WeekdayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const NAMES: Record<Lang, Record<WeekdayKey, [string, string]>> = {
  it: {
    mon: ["lunedì", "Lun"],
    tue: ["martedì", "Mar"],
    wed: ["mercoledì", "Mer"],
    thu: ["giovedì", "Gio"],
    fri: ["venerdì", "Ven"],
    sat: ["sabato", "Sab"],
    sun: ["domenica", "Dom"],
  },
  en: {
    mon: ["Monday", "Mon"],
    tue: ["Tuesday", "Tue"],
    wed: ["Wednesday", "Wed"],
    thu: ["Thursday", "Thu"],
    fri: ["Friday", "Fri"],
    sat: ["Saturday", "Sat"],
    sun: ["Sunday", "Sun"],
  },
};

export function weekdayName(key: WeekdayKey, lang: Lang, short = false): string {
  return NAMES[lang][key][short ? 1 : 0];
}

/** Weekday key of a Date (local time). */
export function weekdayKeyOf(d: Date): WeekdayKey {
  return WEEKDAY_KEYS[(d.getDay() + 6) % 7];
}

const pad = (n: number): string => (n < 10 ? `0${n}` : String(n));

export function formatTemp(v: number, lang: Lang): string {
  const text = v.toFixed(1);
  return `${lang === "it" ? text.replace(".", ",") : text} °C`;
}

export function slotLabel(slot: number): string {
  return `${pad(Math.floor(slot / 4))}:${pad((slot % 4) * 15)}`;
}

const clock = (d: Date): string => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export function formatUntil(nextStepAt: Date, now: Date, lang: Lang): string {
  const time = clock(nextStepAt);
  const dayStart = (d: Date): number => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  const target = dayStart(nextStepAt);
  if (target <= dayStart(now)) return lang === "it" ? `fino alle ${time}` : `until ${time}`;
  if (target === tomorrow) {
    return lang === "it" ? `fino a domani alle ${time}` : `until tomorrow at ${time}`;
  }
  const day = weekdayName(weekdayKeyOf(nextStepAt), lang);
  return lang === "it" ? `fino a ${day} alle ${time}` : `until ${day} at ${time}`;
}

export function formatReturn(d: Date, lang: Lang): string {
  const day = weekdayName(weekdayKeyOf(d), lang);
  return lang === "it"
    ? `${day} ${d.getDate()} alle ${clock(d)}`
    : `${day} ${d.getDate()} at ${clock(d)}`;
}
