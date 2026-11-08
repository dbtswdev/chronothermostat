import { describe, expect, it } from "vitest";
import {
  adjust, continueNext, isDirty, markSaved, moveCursor, replaceValues, setCursor,
  type EditorState,
} from "../src/shared/editor-state";

const make = (): EditorState => {
  const values = Array.from({ length: 96 }, () => 19);
  return { values, saved: values.slice(), cursor: 0, min: 7, max: 30 };
};

describe("editor-state", () => {
  it("clamps the cursor", () => {
    expect(moveCursor(make(), -1).cursor).toBe(0);
    expect(moveCursor(make(), 200).cursor).toBe(95);
    expect(setCursor(make(), 40).cursor).toBe(40);
    expect(setCursor(make(), -3).cursor).toBe(0);
  });

  it("adjusts by half degrees within limits", () => {
    expect(adjust(make(), 0.5).values[0]).toBe(19.5);
    const high = { ...make(), max: 19 };
    expect(adjust(high, 0.5).values[0]).toBe(19);
    const low = { ...make(), min: 19 };
    expect(adjust(low, -0.5).values[0]).toBe(19);
  });

  it("continues to the next slot", () => {
    const s = adjust(make(), 1);
    const n = continueNext(s);
    expect(n.cursor).toBe(1);
    expect(n.values[1]).toBe(20);
    const end = setCursor(make(), 95);
    expect(continueNext(end)).toEqual(end);
  });

  it("tracks dirtiness without mutating", () => {
    const s = make();
    const edited = adjust(s, 0.5);
    expect(isDirty(s)).toBe(false);
    expect(isDirty(edited)).toBe(true);
    expect(isDirty(markSaved(edited))).toBe(false);
    expect(isDirty(replaceValues(edited, s.saved))).toBe(false);
  });
});
