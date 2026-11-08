import { LitElement, css, html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import type { Hass } from "./shared/api";
import { SLOTS, barGeometry, tempRange } from "./shared/chart";
import { formatReturn, formatTemp, formatUntil, weekdayKeyOf, weekdayName } from "./shared/format";
import { langOf, t, type Lang, type StringKey } from "./shared/i18n";
import { ZONE_CARD_EDITOR_TAG, type ZoneCardConfig } from "./shared/zone-card-editor";

export const VIEWER_CARD_TAG = "chronothermostat-viewer-card";

type HassState = { state: string; attributes: Record<string, unknown> };

const PLATFORM = "chronothermostat";
const CLOCK_MS = 60000;
const CHART_WIDTH = 480;
const CHART_HEIGHT = 100;
const MIN_TEMP = 5;
const MAX_TEMP = 35;
/** Sensor states for which the chart of today makes no sense. */
const CHARTLESS = new Set(["away", "away_no_return", "off", "zone_on_manual"]);

const pad = (n: number): string => (n < 10 ? `0${n}` : String(n));
const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
const round2 = (n: number): number => Math.round(n * 100) / 100;
const slotOf = (d: Date): number => d.getHours() * 4 + Math.floor(d.getMinutes() / 15);
const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const dayStart = (d: Date): number => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** Read-only summary of one zone: what it is doing now, and today's program. */
export class ChronothermostatViewerCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _now: { state: true },
  };

  declare hass?: Hass;
  declare private _config?: ZoneCardConfig;
  declare private _now: Date;

  private _sensorId?: string;
  private _seen?: { sensor?: HassState; climate?: HassState; lang: Lang };
  private _timer?: ReturnType<typeof setInterval>;

  constructor() {
    super();
    this._now = new Date();
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(ZONE_CARD_EDITOR_TAG);
  }

  static getStubConfig(hass?: Hass): ZoneCardConfig {
    const climate = Object.keys(hass?.states ?? {}).find((id) => id.startsWith("climate."));
    return { entity: climate ?? "" };
  }

  setConfig(config: ZoneCardConfig): void {
    if (!config || typeof config.entity !== "string" || config.entity === "") {
      throw new Error("entity is required");
    }
    if (this._config && this._config.entity !== config.entity) this._sensorId = undefined;
    this._config = { ...config };
  }

  getCardSize(): number {
    return 4;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._now = new Date();
    this._timer = setInterval(() => {
      this._now = new Date();
    }, CLOCK_MS);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._timer !== undefined) clearInterval(this._timer);
    this._timer = undefined;
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

  // ---- rendering -----------------------------------------------------------------------------

  protected render(): TemplateResult {
    const { sensor, climate, lang } = this._current();
    const key = !sensor || sensor.state === "unavailable" || sensor.state === "unknown" ? "unavailable" : sensor.state;
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
    const [min, max] = tempRange(forced ? [...values, target] : values, MIN_TEMP, MAX_TEMP);
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

    return html`<div class="chart">
      <svg viewBox="0 0 ${CHART_WIDTH} ${CHART_HEIGHT}" preserveAspectRatio="none" aria-hidden="true">
        ${[6, 12, 18].map((hour) => svg`<line class="grid" x1=${hour * 20} x2=${hour * 20}
          y1="0" y2=${CHART_HEIGHT}></line>`)}
        ${geo.bars.map((bar, i) => svg`<rect class="bar ${i < cur ? "past" : ""}" shape-rendering="crispEdges"
          x=${round2(bar.x)} y=${round2(bar.y)} width=${round2(bar.w)}
          height=${round2(bar.h)}></rect>`)}
        ${band}
        <line class="now" x1=${round2(nowX)} x2=${round2(nowX)} y1="0" y2=${CHART_HEIGHT}></line>
      </svg>
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
    }
    .chart svg {
      display: block;
      width: 100%;
      height: 100px;
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
