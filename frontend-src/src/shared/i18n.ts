export type Lang = "en" | "it";

const EN = {
  none: "No changes",
  unsaved: "Unsaved changes",
  saved_day: "{day} program saved",
  editing: "Editing:",
  work: "Work",
  holiday: "Holiday",
  away: "Away",
  off: "Off",
  continue: "Continue",
  save: "Save",
  copy_from: "Copy from…",
  copy_from_hint: "Copy the saved program of:",
  discard: "Discard",
  confirm: "Confirm",
  cancel: "Cancel",
  today: "Today",
  today_day: "Today, {day}",
  prev_slot: "Previous quarter hour",
  next_slot: "Next quarter hour",
  temp_down: "Lower temperature",
  temp_up: "Raise temperature",
  return_date: "Return date",
  return_time: "Return time",
  error_load: "Could not load the data.",
  error_save: "Could not save.",
  house_scenario: "House scenario",
  return_required: "Set the return day and time",
  house_work: "The house follows the Work program.",
  house_holiday: "The house follows the Holiday program.",
  house_away: "Heating off until {when}, then it switches to Work by itself.",
  house_away_no_return: "Away with no return: stays off until you set a return.",
  house_off: "Heating off until you pick another scenario.",
  status_schedule: "Schedule: {temp} {until}, then {next}.",
  status_schedule_flat: "Schedule: {temp}.",
  status_forced: "Forced to {temp} {until}, then back to the schedule ({next}).",
  status_forced_flat: "Forced to {temp}.",
  status_zone_off: "Switched off by you. The schedule resumes when you turn it back on.",
  status_away: "Away: off until {when}, then Work.",
  status_away_no_return: "Away with no return: stays off until you set a return.",
  status_off: "Heating off.",
  status_zone_on_manual:
    "Turned on by hand with the heating off: stays at {temp} until you turn it off or change scenario.",
  status_unavailable: "Thermostat unavailable.",
  config_entity: "Thermostat",
  config_name: "Name (optional)",
} as const;

export type StringKey = keyof typeof EN;

const IT: Record<StringKey, string> = {
  none: "Nessuna modifica",
  unsaved: "Modifiche non salvate",
  saved_day: "Programma di {day} salvato",
  editing: "Stai modificando:",
  work: "Lavoro",
  holiday: "Ferie",
  away: "Fuori casa",
  off: "Spento",
  continue: "Prosegui",
  save: "Salva",
  copy_from: "Copia da…",
  copy_from_hint: "Copia il programma salvato di:",
  discard: "Scarta",
  confirm: "Conferma",
  cancel: "Annulla",
  today: "Oggi",
  today_day: "Oggi, {day}",
  prev_slot: "Quarto d'ora precedente",
  next_slot: "Quarto d'ora successivo",
  temp_down: "Abbassa la temperatura",
  temp_up: "Alza la temperatura",
  return_date: "Giorno di rientro",
  return_time: "Ora di rientro",
  error_load: "Impossibile caricare i dati.",
  error_save: "Salvataggio non riuscito.",
  house_scenario: "Scenario della casa",
  return_required: "Indica giorno e ora del rientro",
  house_work: "La casa segue il programma Lavoro.",
  house_holiday: "La casa segue il programma Ferie.",
  house_away: "Impianto spento fino a {when}, poi passa da solo a Lavoro.",
  house_away_no_return:
    "Fuori casa senza rientro: resta spento finché non imposti il rientro.",
  house_off: "Impianto spento finché non scegli un altro scenario.",
  status_schedule: "Programma: {temp} {until}, poi {next}.",
  status_schedule_flat: "Programma: {temp}.",
  status_forced: "Forzato a {temp} {until}, poi torna al programma ({next}).",
  status_forced_flat: "Forzato a {temp}.",
  status_zone_off: "Spento da te. Il programma riparte quando lo riaccendi.",
  status_away: "Fuori casa: spento fino a {when}, poi Lavoro.",
  status_away_no_return:
    "Fuori casa senza rientro: resta spento finché non imposti il rientro.",
  status_off: "Impianto spento.",
  status_zone_on_manual:
    "Acceso a mano con impianto spento: resta a {temp} finché non lo spegni o cambi scenario.",
  status_unavailable: "Termostato non disponibile.",
  config_entity: "Termostato",
  config_name: "Nome (facoltativo)",
};

export const STRINGS: Record<Lang, Record<StringKey, string>> = { en: EN, it: IT };

interface HassLike {
  locale?: { language?: string };
  language?: string;
}

export function langOf(hass: HassLike | undefined | null): Lang {
  const language = hass?.locale?.language ?? hass?.language ?? "";
  return language.toLowerCase().startsWith("it") ? "it" : "en";
}

export function t(lang: Lang, key: StringKey, vars?: Record<string, string | number>): string {
  const text = STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
