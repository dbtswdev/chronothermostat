export interface HoldOpts {
  delay: number;
  interval: number;
}

/** Runs fn on pointerdown, then repeats while the pointer stays down. Returns a detach function. */
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
  const noMenu = (ev: Event): void => ev.preventDefault();

  el.addEventListener("pointerdown", start);
  el.addEventListener("pointerup", stop);
  el.addEventListener("pointerleave", stop);
  el.addEventListener("pointercancel", stop);
  el.addEventListener("contextmenu", noMenu);

  return () => {
    stop();
    el.removeEventListener("pointerdown", start);
    el.removeEventListener("pointerup", stop);
    el.removeEventListener("pointerleave", stop);
    el.removeEventListener("pointercancel", stop);
    el.removeEventListener("contextmenu", noMenu);
  };
}
