import { describe, expect, it } from "vitest";
import { formatReturn, formatTemp, formatUntil, slotLabel, weekdayName } from "../src/shared/format";

describe("format", () => {
  it("formats temperatures", () => {
    expect(formatTemp(19, "it")).toBe("19,0 °C");
    expect(formatTemp(19, "en")).toBe("19.0 °C");
    expect(formatTemp(15.5, "it")).toBe("15,5 °C");
  });

  it("labels slots", () => {
    expect(slotLabel(0)).toBe("00:00");
    expect(slotLabel(26)).toBe("06:30");
    expect(slotLabel(95)).toBe("23:45");
  });

  it("formats until, same day", () => {
    const now = new Date(2026, 10, 10, 7, 10);
    const at = new Date(2026, 10, 10, 9, 0);
    expect(formatUntil(at, now, "it")).toBe("fino alle 09:00");
    expect(formatUntil(at, now, "en")).toBe("until 09:00");
  });

  it("formats until, next calendar day", () => {
    const now = new Date(2026, 10, 10, 23, 30);
    const at = new Date(2026, 10, 11, 6, 30);
    expect(formatUntil(at, now, "it")).toBe("fino a domani alle 06:30");
    expect(formatUntil(at, now, "en")).toBe("until tomorrow at 06:30");
  });

  it("formats until, later day", () => {
    const now = new Date(2026, 10, 10, 12, 0);
    const at = new Date(2026, 10, 12, 6, 30); // Thursday
    expect(formatUntil(at, now, "it")).toBe("fino a giovedì alle 06:30");
    expect(formatUntil(at, now, "en")).toBe("until Thursday at 06:30");
  });

  it("formats the return moment", () => {
    const d = new Date(2026, 10, 15, 19, 0); // Sunday
    expect(formatReturn(d, "it")).toBe("domenica 15 alle 19:00");
    expect(formatReturn(d, "en")).toBe("Sunday 15 at 19:00");
  });

  it("names weekdays", () => {
    expect(weekdayName("mon", "it")).toBe("lunedì");
    expect(weekdayName("sun", "it", true)).toBe("Dom");
    expect(weekdayName("wed", "en")).toBe("Wednesday");
    expect(weekdayName("sat", "en", true)).toBe("Sat");
  });
});
