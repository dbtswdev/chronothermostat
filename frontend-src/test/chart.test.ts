import { describe, expect, it } from "vitest";
import { barGeometry, slotFromX, tempRange } from "../src/shared/chart";

const opts = { width: 480, height: 200, min: 5, max: 30, padLeft: 24, padBottom: 20 };

describe("chart", () => {
  const values = Array.from({ length: 96 }, (_, i) => 16 + (i % 4));
  const g = barGeometry(values, opts);

  it("spans the plot width with 96 bars", () => {
    expect(g.bars).toHaveLength(96);
    expect(g.bars[0].x).toBeCloseTo(opts.padLeft);
    const last = g.bars[95];
    expect(last.x + last.w).toBeCloseTo(opts.width);
  });

  it("sizes bars by value, bottom aligned", () => {
    for (const b of g.bars) expect(b.y + b.h).toBeCloseTo(opts.height - opts.padBottom);
    expect(g.bars[3].h).toBeGreaterThan(g.bars[0].h);
  });

  it("makes slotFromX the inverse of bar x", () => {
    g.bars.forEach((b, i) => expect(slotFromX(b.x + b.w / 2, opts)).toBe(i));
    expect(slotFromX(-10, opts)).toBe(0);
    expect(slotFromX(9999, opts)).toBe(95);
  });

  it("builds axes", () => {
    expect(g.xTicks.map((t) => t.label)).toEqual(["0", "6", "12", "18", "24"]);
    expect(g.xTicks[4].x).toBeCloseTo(opts.width);
    expect(g.yTicks.length).toBeGreaterThan(1);
  });

  it("computes the temperature range", () => {
    expect(tempRange([15.6, 17, 19], 5, 30)).toEqual([14, 20]);
    expect(tempRange([19, 19], 5, 30)).toEqual([18, 23]);
    expect(tempRange([29.5], 5, 30)).toEqual([25, 30]);
    expect(tempRange([], 5, 30)).toEqual([5, 30]);
  });
});
