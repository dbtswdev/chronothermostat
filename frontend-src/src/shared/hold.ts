export interface HoldOpts {
  delay: number;
  interval: number;
}

/** Events that end a pointer hold (blur and a lost capture cover a release seen elsewhere). */
const STOP_EVENTS = ["pointerup", "pointerleave", "pointercancel", "lostpointercapture", "blur"];

/**
 * Runs fn on pointerdown, then repeats while the pointer stays down; from the keyboard, runs fn
 * on every Enter or Space keydown (the keyboard's own repeat does the rest). Returns a detach
 * function.
 */
export function attachHold(
  el: HTMLElement,
  fn: () => void,
  opts: HoldOpts = { delay: 450, interval: 110 },
): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const stop = (): void => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };
  const tick = (): void => {
    fn();
    timer = setTimeout(tick, opts.interval);
  };
  const start = (ev: Event): void => {
    ev.preventDefault();
    stop();
    fn();
    timer = setTimeout(tick, opts.delay);
  };
  const key = (ev: Event): void => {
    const pressed = (ev as KeyboardEvent).key;
    if (pressed !== "Enter" && pressed !== " ") return;
    // Also keeps Space from scrolling the page.
    ev.preventDefault();
    fn();
  };
  const noMenu = (ev: Event): void => ev.preventDefault();

  el.addEventListener("pointerdown", start);
  for (const name of STOP_EVENTS) el.addEventListener(name, stop);
  el.addEventListener("keydown", key);
  el.addEventListener("contextmenu", noMenu);

  return () => {
    stop();
    el.removeEventListener("pointerdown", start);
    for (const name of STOP_EVENTS) el.removeEventListener(name, stop);
    el.removeEventListener("keydown", key);
    el.removeEventListener("contextmenu", noMenu);
  };
}
