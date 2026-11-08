export const SLOTS = 96;

export interface ChartOpts {
  width: number;
  height: number;
  min: number;
  max: number;
  padLeft: number;
  padBottom: number;
}

export interface Bar {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Geometry {
  bars: Bar[];
  yTicks: { y: number; label: string }[];
  xTicks: { x: number; label: string }[];
}

export function tempRange(
  values: number[],
  minTemp: number,
  maxTemp: number,
): [number, number] {
  if (values.length === 0) return [minTemp, maxTemp];
  let lo = Math.max(minTemp, Math.floor(Math.min(...values)) - 1);
  let hi = Math.min(maxTemp, Math.ceil(Math.max(...values)) + 1);
  if (hi - lo < 5) {
    hi = Math.min(maxTemp, lo + 5);
    lo = Math.max(minTemp, hi - 5);
  }
  return [lo, hi];
}

export function barGeometry(values: number[], opts: ChartOpts): Geometry {
  const { width, height, min, max, padLeft, padBottom } = opts;
  const plotW = width - padLeft;
  const plotH = height - padBottom;
  const span = max - min || 1;
  const yOf = (v: number): number => plotH * (1 - (Math.min(max, Math.max(min, v)) - min) / span);
  const w = plotW / SLOTS;

  const bars = values.map((v, i) => {
    const y = yOf(v);
    return { x: padLeft + i * w, y, w, h: plotH - y };
  });

  const step = span <= 6 ? 1 : span <= 12 ? 2 : 5;
  const yTicks: Geometry["yTicks"] = [];
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) {
    yTicks.push({ y: yOf(v), label: String(v) });
  }

  const xTicks = [0, 6, 12, 18, 24].map((hour) => ({
    x: padLeft + (plotW * hour) / 24,
    label: String(hour),
  }));

  return { bars, yTicks, xTicks };
}

export function slotFromX(x: number, opts: Pick<ChartOpts, "width" | "padLeft">): number {
  const slot = Math.floor(((x - opts.padLeft) / (opts.width - opts.padLeft)) * SLOTS);
  return Math.min(SLOTS - 1, Math.max(0, slot));
}
