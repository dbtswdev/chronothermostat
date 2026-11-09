import { LitElement, css, html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import type { Hass } from "./shared/api";
import { SLOTS, barGeometry } from "./shared/chart";
import { formatReturn, formatTemp, formatUntil, weekdayKeyOf, weekdayName } from "./shared/format";
import { langOf, t, type Lang, type StringKey } from "./shared/i18n";
import {
  configProblem, viewerOptions, viewerScale, type ViewerCardConfig,
} from "./shared/viewer-options";
import { VIEWER_CARD_EDITOR_TAG } from "./shared/zone-card-editor";

export const VIEWER_CARD_TAG = "chronothermostat-viewer-card";

type HassState = { state: string; attributes: Record<string, unknown> };

const PLATFORM = "chronothermostat";
const CLOCK_MS = 60000;
/** How long the last available rendering is kept when the zone turns unavailable. */
const GRACE_MS = 5000;
const CHART_WIDTH = 480;
const CHART_HEIGHT = 100;
/** Sensor states for which the chart of today makes no sense. */
const CHARTLESS = new Set(["away", "away_no_return", "off", "zone_on_manual"]);

const pad = (n: number): string => (n < 10 ? `0${n}` : String(n));
const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
const round2 = (n: number): number => Math.round(n * 100) / 100;
const slotOf = (d: Date): number => d.getHours() * 4 + Math.floor(d.getMinutes() / 15);
const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isAvailable = (s: HassState | undefined): s is HassState =>
  !!s && s.state !== "unavailable" && s.state !== "unknown";
const dayStart = (d: Date): number => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** Read-only summary of one zone: what it is doing now, and today's program. */
export class ChronothermostatViewerCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _now: { state: true },
  };

  declare hass?: Hass;
  declare private _config?: ViewerCardConfig;
  declare private _now: Date;

  private _sensorId?: string;
  private _seen?: { sensor?: HassState; climate?: HassState; lang: Lang };
  private _timer?: ReturnType<typeof setTimeout>;
  /** States of the last available rendering, kept through the Wall Display's short blip. */
  private _held?: { sensor: HassState; climate?: HassState };
  private _graceTimer?: ReturnType<typeof setTimeout>;
  /** What the next render shows (set in willUpdate). */
  private _display: { sensor?: HassState; climate?: HassState; lang: Lang } = { lang: "en" };

  constructor() {
    super();
    this._now = new Date();
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(VIEWER_CARD_EDITOR_TAG);
  }

  static getStubConfig(hass?: Hass): ViewerCardConfig {
    const climate = Object.keys(hass?.states ?? {}).find((id) => id.startsWith("climate."));
    return { entity: climate ?? "" };
  }

  setConfig(config: ViewerCardConfig): void {
    if (!config || typeof config.entity !== "string" || config.entity === "") {
      throw new Error("entity is required");
    }
    const problem = configProblem(config);
    if (problem) throw new Error(problem);
    if (this._config && this._config.entity !== config.entity) this._sensorId = undefined;
    this._config = { ...config };
  }

  getCardSize(): number {
    return 4;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._now = new Date();
    this._scheduleClock();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._timer !== undefined) clearTimeout(this._timer);
    this._timer = undefined;
    if (this._graceTimer !== undefined) clearTimeout(this._graceTimer);
    this._graceTimer = undefined;
    this._held = undefined;
  }

  /** Refresh the clock on every minute boundary. */
  private _scheduleClock(): void {
    const now = new Date();
    const delay = CLOCK_MS - (now.getSeconds() * 1000 + now.getMilliseconds());
    this._timer = setTimeout(() => {
      this._now = new Date();
      this._scheduleClock();
    }, delay);
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    const current = this._current();
    const seen = this._seen;
    const same =
      !!seen &&
      seen.sensor === current.sensor &&
      seen.climate === current.climate &&
      seen.lang === current.lang;
    this._seen = current;
    if (changed.size === 1 && changed.has("hass")) return !same;
    return true;
  }

  protected willUpdate(changed: PropertyValues): void {
    // A quarter-hour step or midnight can arrive before the minute timer fires.
    if (changed.has("hass")) this._now = new Date();
    this._display = this._shown();
  }

  /** The zone's status sensor: the `sensor.*` whose `zone` attribute is the configured climate. */
  private _resolveSensor(): HassState | undefined {
    const states = this.hass?.states ?? {};
    const zone = this._config?.entity;
    const cached = this._sensorId ? states[this._sensorId] : undefined;
    if (cached && cached.attributes?.zone === zone) return cached;
    const ids = Object.keys(states).filter(
      (id) => id.startsWith("sensor.") && states[id]?.attributes?.zone === zone,
    );
    const registry = this.hass?.entities;
    const id =
      (registry && ids.find((candidate) => registry[candidate]?.platform === PLATFORM)) || ids[0];
    this._sensorId = id;
    return id ? states[id] : undefined;
  }

  private _current(): { sensor?: HassState; climate?: HassState; lang: Lang } {
    return {
      sensor: this._resolveSensor(),
      climate: this._config ? this.hass?.states?.[this._config.entity] : undefined,
      lang: langOf(this.hass),
    };
  }

  /**
   * The states to render: the live ones or, for GRACE_MS after the zone turned unavailable, the
   * last available ones, so the Wall Display's blip after each command does not shrink the card.
   */
  private _shown(): { sensor?: HassState; climate?: HassState; lang: Lang } {
    const current = this._current();
    if (isAvailable(current.sensor)) {
      this._held = { sensor: current.sensor, climate: current.climate };
      if (this._graceTimer !== undefined) clearTimeout(this._graceTimer);
      this._graceTimer = undefined;
      return current;
    }
    if (!this._held) return current;
    if (this._graceTimer === undefined) {
      this._graceTimer = setTimeout(() => {
        this._graceTimer = undefined;
        this._held = undefined;
        this.requestUpdate();
      }, GRACE_MS);
    }
    return { ...this._held, lang: current.lang };
  }

  // ---- rendering -----------------------------------------------------------------------------

  protected render(): TemplateResult {
    const { sensor, climate, lang } = this._display;
    const key = isAvailable(sensor) ? sensor.state : "unavailable";
    const attrs = sensor?.attributes ?? {};
    const todayValues = Array.isArray(attrs.today) ? (attrs.today as unknown[]) : [];
    const showChart =
      !!sensor && !CHARTLESS.has(key) && key !== "unavailable" &&
      todayValues.length === SLOTS && todayValues.every(isNumber);
    const now = this._now;
    const day = weekdayName(weekdayKeyOf(now), lang);
    const program = attrs.program === "work" || attrs.program === "holiday" ? attrs.program : undefined;
    const title = program
      ? `${t(lang, "today_day", { day })} · ${t(lang, program)}`
      : capitalize(day);
    const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const [message, style] = this._sentence(key, attrs, climate, lang);

    return html`<ha-card>
      <div class="header">
        <span class="title">${title}</span><span class="clock">${clock}</span>
      </div>
      ${showChart ? this._chart(key, todayValues as number[], attrs, climate) : nothing}
      <div class="sentence" style=${style}>${message}</div>
    </ha-card>`;
  }

  /** The one-sentence status and its inline style. */
  private _sentence(
    key: string,
    attrs: Record<string, unknown>,
    climate: HassState | undefined,
    lang: Lang,
  ): [string, string] {
    const temp = climate?.attributes?.temperature;
    const now = this._now;
    const nextAt = typeof attrs.next_step_at === "string" ? new Date(attrs.next_step_at) : undefined;
    const hasStep = !!nextAt && !isNaN(nextAt.getTime()) && isNumber(attrs.next_step_target);
    const until = hasStep ? formatUntil(nextAt as Date, now, lang) : "";
    const nextTemp = hasStep ? formatTemp(attrs.next_step_target as number, lang) : "";
    const say = (k: StringKey, vars?: Record<string, string>): [string, string] => [t(lang, k, vars), ""];

    switch (key) {
      case "schedule":
        if (!isNumber(attrs.program_target)) return say("status_unavailable");
        return hasStep
          ? say("status_schedule", {
              temp: formatTemp(attrs.program_target, lang), until, next: nextTemp,
            })
          : say("status_schedule_flat", { temp: formatTemp(attrs.program_target, lang) });
      case "forced":
        if (!isNumber(temp)) return say("status_unavailable");
        return hasStep
          ? say("status_forced", { temp: formatTemp(temp, lang), until, next: nextTemp })
          : say("status_forced_flat", { temp: formatTemp(temp, lang) });
      case "zone_off":
        return [t(lang, "status_zone_off"), "color: var(--error-color)"];
      case "zone_on_manual":
        return isNumber(temp)
          ? say("status_zone_on_manual", { temp: formatTemp(temp, lang) })
          : say("status_unavailable");
      case "away": {
        const returnAt = typeof attrs.return_at === "string" ? new Date(attrs.return_at) : undefined;
        if (!returnAt || isNaN(returnAt.getTime())) return say("status_away_no_return");
        return say("status_away", { when: formatReturn(returnAt, lang) });
      }
      case "away_no_return":
        return say("status_away_no_return");
      case "off":
        return say("status_off");
      default:
        return say("status_unavailable");
    }
  }

  private _chart(
    key: string,
    values: number[],
    attrs: Record<string, unknown>,
    climate: HassState | undefined,
  ): TemplateResult {
    const now = this._now;
    const cur = slotOf(now);
    const target = climate?.attributes?.temperature;
    const forced = key === "forced" && isNumber(target);
    const options = viewerOptions(this._config as ViewerCardConfig);
    const [min, max] = viewerScale(options.fixed, forced ? [...values, target] : values);
    const opts = {
      width: CHART_WIDTH, height: CHART_HEIGHT, min, max, padLeft: 0, padBottom: 0,
    };
    const geo = barGeometry(values, opts);
    const slotW = CHART_WIDTH / SLOTS;

    let band: TemplateResult | typeof nothing = nothing;
    if (forced) {
      const nextAt = typeof attrs.next_step_at === "string" ? new Date(attrs.next_step_at) : undefined;
      const sameDay = nextAt && !isNaN(nextAt.getTime()) && dayStart(nextAt) <= dayStart(now);
      const end = sameDay ? Math.min(SLOTS, Math.max(cur, slotOf(nextAt as Date))) : SLOTS;
      const y = barGeometry([target], opts).bars[0].y;
      band = svg`<rect class="band" shape-rendering="crispEdges" x=${round2(cur * slotW)} y=${round2(y)}
        width=${round2((end - cur) * slotW)} height=${round2(CHART_HEIGHT - y)}></rect>`;
    }
    const nowX = ((now.getHours() * 60 + now.getMinutes()) / 1440) * CHART_WIDTH;

    const pct = (y: number): string => `${round2((y / CHART_HEIGHT) * 100)}%`;

    // Labels are HTML around the SVG: the SVG is stretched to the card width, text in it would be too.
    return html`<div class="chart ${options.temperatureAxis ? "with-temperatures" : ""}">
      <div class="plot">
        ${options.temperatureAxis
          ? html`<div class="y-labels" aria-hidden="true">
              ${geo.yTicks.map((tick) => html`<span style="top: ${pct(tick.y)}">${tick.label}°</span>`)}
            </div>`
          : nothing}
        <svg viewBox="0 0 ${CHART_WIDTH} ${CHART_HEIGHT}" preserveAspectRatio="none" aria-hidden="true">
        ${options.temperatureAxis
          ? geo.yTicks.map((tick) => svg`<line class="hgrid" x1="0" x2=${CHART_WIDTH}
              y1=${round2(tick.y)} y2=${round2(tick.y)}></line>`)
          : nothing}
        ${[6, 12, 18].map((hour) => svg`<line class="grid" x1=${hour * 20} x2=${hour * 20}
          y1="0" y2=${CHART_HEIGHT}></line>`)}
        ${geo.bars.map((bar, i) => svg`<rect class="bar ${i < cur ? "past" : ""}" shape-rendering="crispEdges"
          x=${round2(bar.x)} y=${round2(bar.y)} width=${round2(bar.w)}
          height=${round2(bar.h)}></rect>`)}
        ${band}
        <line class="now" x1=${round2(nowX)} x2=${round2(nowX)} y1="0" y2=${CHART_HEIGHT}></line>
        </svg>
      </div>
      ${options.timeAxis
        ? html`<div class="x-labels ${options.temperatureAxis ? "indent" : ""}" aria-hidden="true">
            ${geo.xTicks.map((tick) => html`<span style="left: ${round2((tick.x / CHART_WIDTH) * 100)}%"
              >${tick.label}</span>`)}
          </div>`
        : nothing}
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      display: block;
      padding: 8px 10px;
      box-sizing: border-box;
      font-size: 15px;
      line-height: 20px;
      color: var(--primary-text-color);
    }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      color: var(--secondary-text-color);
    }
    .clock {
      white-space: nowrap;
    }
    .chart {
      margin: 6px 0;
      height: 100px;
      display: flex;
      flex-direction: column;
    }
    /* Room above the plot for half of the top temperature label. */
    .chart.with-temperatures {
      margin-top: 10px;
    }
    .plot {
      flex: 1;
      min-height: 0;
      display: flex;
    }
    .chart svg {
      display: block;
      flex: 1;
      min-width: 0;
      height: 100%;
    }
    .y-labels,
    .x-labels {
      position: relative;
      font-size: 11px;
      line-height: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .y-labels {
      flex: none;
      width: 28px;
    }
    .y-labels span {
      position: absolute;
      right: 4px;
      transform: translateY(-50%);
    }
    .x-labels {
      flex: none;
      height: 14px;
    }
    .x-labels.indent {
      margin-left: 28px;
    }
    .x-labels span {
      position: absolute;
      top: 2px;
      transform: translateX(-50%);
    }
    .x-labels span:first-child {
      transform: none;
    }
    .x-labels span:last-child {
      transform: translateX(-100%);
    }
    .hgrid {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.4));
      stroke-width: 1;
      stroke-dasharray: 2 3;
      vector-effect: non-scaling-stroke;
    }
    .grid {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.4));
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .bar {
      fill: var(--chronothermostat-bar-color, #1d9e75);
    }
    .bar.past {
      opacity: 0.4;
    }
    .band {
      fill: var(--chronothermostat-cursor-color, #d85a30);
      opacity: 0.55;
    }
    .now {
      stroke: var(--primary-text-color);
      stroke-width: 2;
      vector-effect: non-scaling-stroke;
    }
    .sentence {
      margin-top: 6px;
      overflow-wrap: anywhere;
    }
  `;
}
