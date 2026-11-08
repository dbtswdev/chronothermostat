export interface EditorState {
  values: number[];
  saved: number[];
  cursor: number;
  min: number;
  max: number;
}

const LAST = 95;
const STEP = 0.5;

const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

export function setCursor(s: EditorState, slot: number): EditorState {
  return { ...s, cursor: clamp(Math.round(slot), 0, LAST) };
}

export function moveCursor(s: EditorState, delta: number): EditorState {
  return setCursor(s, s.cursor + delta);
}

export function adjust(s: EditorState, delta: number): EditorState {
  const next = clamp(Math.round((s.values[s.cursor] + delta) / STEP) * STEP, s.min, s.max);
  const values = s.values.slice();
  values[s.cursor] = next;
  return { ...s, values };
}

export function continueNext(s: EditorState): EditorState {
  if (s.cursor >= LAST) return s;
  const values = s.values.slice();
  values[s.cursor + 1] = values[s.cursor];
  return { ...s, values, cursor: s.cursor + 1 };
}

export function replaceValues(s: EditorState, values: number[]): EditorState {
  return { ...s, values: values.slice() };
}

export function markSaved(s: EditorState): EditorState {
  return { ...s, saved: s.values.slice() };
}

export function isDirty(s: EditorState): boolean {
  return s.values.length !== s.saved.length || s.values.some((v, i) => v !== s.saved[i]);
}
