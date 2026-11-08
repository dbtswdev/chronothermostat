import { describe, expect, it } from "vitest";
import { STRINGS, langOf, t, type StringKey } from "../src/shared/i18n";

describe("i18n", () => {
  it("detects the language", () => {
    expect(langOf({ locale: { language: "it-IT" } })).toBe("it");
    expect(langOf({ language: "it" })).toBe("it");
    expect(langOf({ locale: { language: "de" }, language: "it" })).toBe("en");
    expect(langOf(undefined)).toBe("en");
  });

  it("translates and interpolates", () => {
    expect(t("it", "unsaved")).toBe("Modifiche non salvate");
    expect(t("en", "unsaved")).toBe("Unsaved changes");
    expect(t("it", "saved_day", { day: "martedì" })).toBe("Programma di martedì salvato");
    expect(t("it", "status_schedule", { temp: "19,0 °C", until: "fino alle 09:00", next: "15,0 °C" })).toBe(
      "Programma: 19,0 °C fino alle 09:00, poi 15,0 °C.",
    );
  });

  it("never throws on unknown keys or languages", () => {
    expect(t("it", "nope" as StringKey)).toBe("nope");
    expect(t("fr" as never, "save")).toBe("Save");
  });

  it("keeps placeholders identical in both languages", () => {
    const vars = (s: string): string[] => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const key of Object.keys(STRINGS.en) as StringKey[]) {
      expect(vars(STRINGS.it[key]), key).toEqual(vars(STRINGS.en[key]));
    }
  });
});
