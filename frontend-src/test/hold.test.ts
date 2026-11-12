import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { attachHold } from "../src/shared/hold";

describe("hold", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("fires once, repeats after the delay, stops on release", () => {
    const el = document.createElement("button");
    const fn = vi.fn();
    const detach = attachHold(el, fn, { delay: 450, interval: 100 });
    el.dispatchEvent(new Event("pointerdown"));
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(449);
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(4);
    el.dispatchEvent(new Event("pointerup"));
    vi.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledTimes(4);
    detach();
  });

  it("steps once per Enter or Space keydown (key repeat included), not on other keys", () => {
    const el = document.createElement("button");
    const fn = vi.fn();
    const detach = attachHold(el, fn);
    const press = (key: string): KeyboardEvent => {
      const ev = new KeyboardEvent("keydown", { key, cancelable: true });
      el.dispatchEvent(ev);
      return ev;
    };
    expect(press("Enter").defaultPrevented).toBe(true);
    expect(press(" ").defaultPrevented).toBe(true);
    press(" "); // the keyboard's own repeat while the key is held
    expect(fn).toHaveBeenCalledTimes(3);
    expect(press("Tab").defaultPrevented).toBe(false);
    expect(press("a").defaultPrevented).toBe(false);
    expect(fn).toHaveBeenCalledTimes(3);
    // No timer: the keyboard repeats by itself.
    vi.advanceTimersByTime(2000);
    expect(fn).toHaveBeenCalledTimes(3);
    detach();
    press("Enter");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("stops repeating when the button loses focus or the pointer is lost", () => {
    for (const end of ["blur", "pointerleave", "pointercancel", "lostpointercapture"]) {
      const el = document.createElement("button");
      const fn = vi.fn();
      const detach = attachHold(el, fn, { delay: 100, interval: 100 });
      el.dispatchEvent(new Event("pointerdown"));
      vi.advanceTimersByTime(100);
      expect(fn, end).toHaveBeenCalledTimes(2);
      el.dispatchEvent(new Event(end));
      vi.advanceTimersByTime(1000);
      expect(fn, end).toHaveBeenCalledTimes(2);
      detach();
    }
  });
});
