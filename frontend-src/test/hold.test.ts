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
});
