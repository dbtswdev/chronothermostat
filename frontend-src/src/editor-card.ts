import { LitElement, css, html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import {
  getInfo, getProgram, setProgram, type Hass, type Info, type Program, type ProgramData,
} from "./shared/api";
import { SLOTS, barGeometry, slotFromX, tempRange } from "./shared/chart";
import {
  adjust, continueNext, isDirty, moveCursor, replaceValues, setCursor, type EditorState,
} from "./shared/editor-state";
import {
  WEEKDAY_KEYS, formatTemp, slotLabel, weekdayKeyOf, weekdayName, type WeekdayKey,
} from "./shared/format";
import { attachHold } from "./shared/hold";
import { langOf, t, type Lang } from "./shared/i18n";
import { ZONE_CARD_EDITOR_TAG, type ZoneCardConfig } from "./shared/zone-card-editor";

export const EDITOR_CARD_TAG = "chronothermostat-editor-card";

interface Target {
  program: Program;
  day: WeekdayKey;
}

type Failure = "error_load" | "error_save";

const PROGRAMS: Program[] = ["work", "holiday"];
const HOLD_BUTTONS = ["prev", "next", "cont", "minus", "plus"] as const;
type HoldButton = (typeof HOLD_BUTTONS)[number];

const TEMP_STEP = 0.5;
const SAVED_MESSAGE_MS = 3000;
const CHART_HEIGHT = 150;
const CHART_PAD_TOP = 8;
const CHART_PAD_LEFT = 26;
const CHART_PAD_BOTTOM = 22;
const DEFAULT_CHART_WIDTH = 452;

const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
const currentSlot = (d: Date): number => d.getHours() * 4 + Math.floor(d.getMinutes() / 15);
const round2 = (n: number): number => Math.round(n * 100) / 100;
const validWeek = (data: ProgramData): boolean =>
  WEEKDAY_KEYS.every((k) => Array.isArray(data.weekdays?.[k]) && data.weekdays[k].length === SLOTS);

const CONTINUE_ICON = html`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M3 12h13M11 6l6 6-6 6M21 5v14" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;

/** Weekly program editor for one zone (§5.2): one day of 96 quarter-hour setpoints at a time. */
export class ChronothermostatEditorCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _program: { state: true },
    _day: { state: true },
    _state: { state: true },
    _loadFailed: { state: true },
    _failure: { state: true },
    _savedDay: { state: true },
    _pending: { state: true },
    _copyOpen: { state: true },
    _saving: { state: true },
    _chartWidth: { state: true },
  };

  declare hass?: Hass;
  declare private _config?: ZoneCardConfig;
  declare private _program: Program;
  declare private _day: WeekdayKey;
  declare private _state?: EditorState;
  declare private _loadFailed: boolean;
  declare private _failure?: Failure;
  declare private _savedDay?: WeekdayKey;
  declare private _pending?: Target;
  declare private _copyOpen: boolean;
  declare private _saving: boolean;
  declare private _chartWidth: number;

  /** Last program loaded from the backend: the saved week that "Copy from…" and day switches read. */
  private _data?: ProgramData;
  private _info?: Info;
  private _loadedFor?: string;
  private _loadToken = 0;
  private _savedTimer?: ReturnType<typeof setTimeout>;
  private _holds = new Map<HoldButton, { el: HTMLElement; detach: () => void }>();
  private _resizeObserver?: ResizeObserver;
  private _observedChart: Element | null = null;

  constructor() {
    super();
    this._program = "work";
    this._day = weekdayKeyOf(new Date());
    this._loadFailed = false;
    this._copyOpen = false;
    this._saving = false;
    this._chartWidth = DEFAULT_CHART_WIDTH;
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
    if (this._config && this._config.entity !== config.entity) this._reset();
    this._config = { ...config };
  }

  getCardSize(): number {
    return 8;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Re-attach the hold handlers and the resize observer dropped on disconnect.
    if (this.hasUpdated) this.requestUpdate();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._holds.forEach((hold) => hold.detach());
    this._holds.clear();
    if (this._resizeObserver) this._resizeObserver.disconnect();
    this._observedChart = null;
    this._clearSaved();
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    // hass changes on every state change in the house; only the language matters here.
    if (changed.size === 1 && changed.has("hass")) {
      const old = changed.get("hass") as Hass | undefined;
      return !old || langOf(old) !== langOf(this.hass);
    }
    return true;
  }

  protected willUpdate(): void {
    if (this.hass && this._config && this._loadedFor !== this._config.entity) void this._load();
  }

  protected updated(): void {
    if (!this.isConnected) return;
    this._syncHolds();
    this._observeChart();
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const lang = langOf(this.hass);
    if (this._loadFailed) {
      return html`<ha-card><div class="load-error error">${t(lang, "error_load")}</div></ha-card>`;
    }
    const state = this._state;
    if (!state) return html`<ha-card></ha-card>`;
    const [status, statusKind] = this._status(lang, state);
    return html`<ha-card>
      <div class="row">
        <span class="label">${t(lang, "editing")}</span>
        ${PROGRAMS.map((p) => html`<button class="chip program ${p === this._program ? "on" : ""}"
          data-program=${p} aria-pressed=${p === this._program ? "true" : "false"}
          @click=${() => this._select({ program: p, day: this._day })}>${t(lang, p)}</button>`)}
      </div>
      <div class="row days">
        ${WEEKDAY_KEYS.map((d) => html`<button class="chip day ${d === this._day ? "on" : ""}"
          data-day=${d} aria-pressed=${d === this._day ? "true" : "false"}
          @click=${() => this._select({ program: this._program, day: d })}>
          ${weekdayName(d, lang, true)}
        </button>`)}
      </div>
      ${this._pending ? this._renderDirtyBar(lang) : nothing}
      <div class="reading">
        <span><span class="day-name">${capitalize(weekdayName(this._day, lang))}</span><span
          class="time">${slotLabel(state.cursor)}</span></span>
        <span class="temp">${formatTemp(state.values[state.cursor], lang)}</span>
      </div>
      ${this._renderChart(state)}
      <div class="controls">
        <button class="big hold" id="prev" aria-label=${t(lang, "prev_slot")}>
          <span class="glyph" aria-hidden="true">‹</span>
        </button>
        <button class="big hold" id="next" aria-label=${t(lang, "next_slot")}>
          <span class="glyph" aria-hidden="true">›</span>
        </button>
        <button class="big hold wide" id="cont">
          ${CONTINUE_ICON}<span>${t(lang, "continue")}</span>
        </button>
        <button class="big hold" id="minus" aria-label=${t(lang, "temp_down")}>
          <span class="glyph" aria-hidden="true">−</span>
        </button>
        <button class="big hold" id="plus" aria-label=${t(lang, "temp_up")}>
          <span class="glyph" aria-hidden="true">+</span>
        </button>
        <button class="big" id="copy" aria-expanded=${this._copyOpen ? "true" : "false"}
          @click=${this._toggleCopy}>${t(lang, "copy_from")}</button>
        <button class="big save" id="save" ?disabled=${this._saving} @click=${this._onSave}>
          ${t(lang, "save")}
        </button>
      </div>
      <div class="footer">
        <span class="name">${this._zoneName()}</span>
        <span class="status ${statusKind}">${status}</span>
      </div>
      ${this._copyOpen ? this._renderCopyPanel(lang) : nothing}
    </ha-card>`;
  }

  private _renderDirtyBar(lang: Lang): TemplateResult {
    return html`<div class="dirty-bar">
      <span class="message">${t(lang, "unsaved")}</span>
      <button class="big" id="bar-discard" @click=${this._discardPending}>${t(lang, "discard")}</button>
      <button class="big save" id="bar-save" ?disabled=${this._saving} @click=${this._savePending}>
        ${t(lang, "save")}
      </button>
    </div>`;
  }

  private _renderChart(state: EditorState): TemplateResult {
    const width = this._chartWidth;
    const height = CHART_HEIGHT - CHART_PAD_TOP;
    const [min, max] = tempRange(state.values, state.min, state.max);
    const geo = barGeometry(state.values, {
      width, height, min, max, padLeft: CHART_PAD_LEFT, padBottom: CHART_PAD_BOTTOM,
    });
    const base = height - CHART_PAD_BOTTOM;
    const cursor = geo.bars[state.cursor];
    const cursorX = round2(cursor.x + cursor.w / 2);
    const last = geo.xTicks.length - 1;
    return html`<div class="chart">
      <svg viewBox="0 0 ${width} ${CHART_HEIGHT}" @pointerdown=${this._onChartDown}>
        <g transform="translate(0 ${CHART_PAD_TOP})">
          ${geo.yTicks.map((tick) => svg`
            <line class="grid" x1=${CHART_PAD_LEFT} x2=${width}
              y1=${round2(tick.y)} y2=${round2(tick.y)}></line>
            <text class="axis" x=${CHART_PAD_LEFT - 5} y=${round2(tick.y)} dy="0.35em"
              text-anchor="end">${tick.label}</text>`)}
          ${geo.bars.map((bar, i) => svg`<rect class="bar ${i === state.cursor ? "cursor" : ""}"
            x=${round2(bar.x)} y=${round2(bar.y)} width=${round2(Math.max(0, bar.w - 0.6))}
            height=${round2(bar.h)}></rect>`)}
          <line class="cursor-line" x1=${cursorX} x2=${cursorX} y1="0" y2=${base + 4}></line>
          ${geo.xTicks.map((tick, i) => svg`<text class="axis" x=${round2(tick.x)} y=${base + 18}
            text-anchor=${i === 0 ? "start" : i === last ? "end" : "middle"}>${tick.label}</text>`)}
        </g>
      </svg>
    </div>`;
  }

  private _renderCopyPanel(lang: Lang): TemplateResult {
    return html`<div class="copy-panel">
      <div class="hint">${t(lang, "copy_from_hint")}</div>
      <div class="copy-days">
        ${WEEKDAY_KEYS.filter((d) => d !== this._day).map(
          (d) => html`<button class="chip" data-day=${d} @click=${() => this._copyFrom(d)}>
            ${capitalize(weekdayName(d, lang))}
          </button>`,
        )}
      </div>
    </div>`;
  }

  private _status(lang: Lang, state: EditorState): [string, string] {
    if (this._failure) return [t(lang, this._failure), "error"];
    if (isDirty(state)) return [t(lang, "unsaved"), "warning"];
    if (this._savedDay) {
      return [t(lang, "saved_day", { day: weekdayName(this._savedDay, lang) }), "success"];
    }
    return [t(lang, "none"), ""];
  }

  private _zoneName(): string {
    const config = this._config;
    if (!config) return "";
    if (config.name) return config.name;
    const zones = this._info ? this._info.zones : [];
    const zone = zones.find((z) => z.entity_id === config.entity);
    return zone ? zone.name : "";
  }

  // ---- loading -------------------------------------------------------------------------------

  private _reset(): void {
    this._loadToken++;
    this._loadedFor = undefined;
    this._data = undefined;
    this._state = undefined;
    this._loadFailed = false;
    this._failure = undefined;
    this._pending = undefined;
    this._copyOpen = false;
    this._clearSaved();
  }

  private async _load(): Promise<void> {
    const hass = this.hass;
    const config = this._config;
    if (!hass || !config) return;
    const entity = config.entity;
    this._loadedFor = entity;
    let program: Program;
    try {
      if (!this._info) this._info = await getInfo(hass);
      if (this._loadedFor !== entity) return;
      if (!this._info.zones.some((z) => z.entity_id === entity)) {
        throw new Error(`${entity} is not a chronothermostat zone`);
      }
      // Open on the active scenario's program; away and off have none, so Work.
      const scenarioId = this._info.scenario_entity_id;
      const scenarioState = scenarioId ? hass.states[scenarioId] : undefined;
      program = scenarioState && scenarioState.state === "holiday" ? "holiday" : "work";
    } catch {
      if (this._loadedFor === entity) this._loadFailed = true;
      return;
    }
    const now = new Date();
    await this._loadProgram({ program, day: weekdayKeyOf(now) }, currentSlot(now));
  }

  private async _loadProgram(target: Target, cursor: number): Promise<boolean> {
    const hass = this.hass;
    const config = this._config;
    if (!hass || !config) return false;
    const token = ++this._loadToken;
    try {
      const data = await getProgram(hass, config.entity, target.program);
      if (token !== this._loadToken) return false;
      if (!validWeek(data)) throw new Error("Invalid program data");
      this._program = target.program;
      this._showDay(data, target.day, cursor);
      return true;
    } catch {
      if (token !== this._loadToken) return false;
      if (this._state) this._failure = "error_load";
      else this._loadFailed = true;
      return false;
    }
  }

  private _showDay(data: ProgramData, day: WeekdayKey, cursor: number): void {
    const values = data.weekdays[day];
    this._data = data;
    this._day = day;
    this._failure = undefined;
    this._state = {
      values: values.slice(),
      saved: values.slice(),
      cursor,
      min: data.min_temp,
      max: data.max_temp,
    };
  }

  // ---- program and day switching -------------------------------------------------------------

  private _select(target: Target): void {
    if (target.program === this._program && target.day === this._day) {
      this._pending = undefined;
      return;
    }
    if (this._state && isDirty(this._state)) {
      this._pending = target;
      return;
    }
    void this._switchTo(target);
  }

  private async _switchTo(target: Target): Promise<void> {
    this._pending = undefined;
    this._copyOpen = false;
    const cursor = this._state ? this._state.cursor : 0;
    if (target.program === this._program && this._data) {
      this._showDay(this._data, target.day, cursor);
      return;
    }
    await this._loadProgram(target, cursor);
  }

  private async _savePending(): Promise<void> {
    if ((await this._save()) && this._pending) await this._switchTo(this._pending);
  }

  private _discardPending(): void {
    const target = this._pending;
    if (!target || !this._state) return;
    this._state = replaceValues(this._state, this._state.saved);
    void this._switchTo(target);
  }

  // ---- editing -------------------------------------------------------------------------------

  private _hold(button: HoldButton): void {
    const state = this._state;
    if (!state) return;
    if (button === "prev") this._state = moveCursor(state, -1);
    else if (button === "next") this._state = moveCursor(state, 1);
    else if (button === "cont") this._edit(continueNext(state));
    else if (button === "minus") this._edit(adjust(state, -TEMP_STEP));
    else this._edit(adjust(state, TEMP_STEP));
  }

  private _edit(next: EditorState): void {
    this._state = next;
    this._failure = undefined;
    this._clearSaved();
  }

  private _onChartDown(ev: PointerEvent): void {
    const state = this._state;
    const box = (ev.currentTarget as Element).getBoundingClientRect();
    if (!state || box.width <= 0) return;
    const x = ((ev.clientX - box.left) / box.width) * this._chartWidth;
    const slot = slotFromX(x, { width: this._chartWidth, padLeft: CHART_PAD_LEFT });
    this._state = setCursor(state, slot);
  }

  private _toggleCopy(): void {
    this._copyOpen = !this._copyOpen;
  }

  private _copyFrom(day: WeekdayKey): void {
    this._copyOpen = false;
    if (!this._state || !this._data) return;
    this._edit(replaceValues(this._state, this._data.weekdays[day]));
  }

  // ---- saving --------------------------------------------------------------------------------

  private _onSave(): void {
    void this._save();
  }

  private async _save(): Promise<boolean> {
    const hass = this.hass;
    const config = this._config;
    const state = this._state;
    if (!hass || !config || !state || this._saving) return false;
    const program = this._program;
    const day = this._day;
    const values = state.values.slice();
    this._saving = true;
    try {
      await setProgram(hass, config.entity, program, day, values);
      const data = await getProgram(hass, config.entity, program);
      const sameDay = program === this._program && day === this._day;
      if (program === this._program && validWeek(data)) this._data = data;
      // Mark what was sent as saved: edits made while the request was in flight stay unsaved.
      if (sameDay && this._state) this._state = { ...this._state, saved: values };
      this._failure = undefined;
      this._flashSaved(day);
      return true;
    } catch {
      this._failure = "error_save";
      return false;
    } finally {
      this._saving = false;
    }
  }

  private _flashSaved(day: WeekdayKey): void {
    this._clearSaved();
    this._savedDay = day;
    this._savedTimer = setTimeout(() => {
      this._savedTimer = undefined;
      this._savedDay = undefined;
    }, SAVED_MESSAGE_MS);
  }

  private _clearSaved(): void {
    if (this._savedTimer !== undefined) clearTimeout(this._savedTimer);
    this._savedTimer = undefined;
    this._savedDay = undefined;
  }

  // ---- DOM wiring ----------------------------------------------------------------------------

  /** Attach hold-to-repeat to the current buttons; re-attach when Lit replaced an element. */
  private _syncHolds(): void {
    for (const id of HOLD_BUTTONS) {
      const el = this.renderRoot.querySelector<HTMLElement>(`#${id}`);
      const current = this._holds.get(id);
      if (current && current.el === el) continue;
      if (current) current.detach();
      this._holds.delete(id);
      if (el) this._holds.set(id, { el, detach: attachHold(el, () => this._hold(id)) });
    }
  }

  /** Track the chart's pixel width so bars and labels are drawn unscaled. */
  private _observeChart(): void {
    const chart = this.renderRoot.querySelector(".chart");
    if (chart === this._observedChart) return;
    if (this._resizeObserver) this._resizeObserver.disconnect();
    this._observedChart = chart;
    if (!chart || typeof ResizeObserver === "undefined") return;
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver((entries) => {
        const width = Math.round(entries[0].contentRect.width);
        if (width > 0) this._chartWidth = width;
      });
    }
    this._resizeObserver.observe(chart);
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
    button {
      font: inherit;
      color: inherit;
      background: none;
      margin: 0;
      padding: 0 6px;
      min-width: 0;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
      border-radius: 8px;
      cursor: pointer;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;
    }
    button[disabled] {
      opacity: 0.6;
      cursor: default;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .days {
      gap: 4px;
      margin-top: 8px;
    }
    .label {
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .chip {
      flex: 1 1 0;
      min-height: 48px;
    }
    .days .chip {
      padding: 0;
    }
    .chip.on {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
      border-color: var(--primary-color);
      color: var(--primary-color);
      font-weight: 500;
    }
    .reading {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      margin-top: 8px;
      /* 28 px strut so the 15 px day name does not grow the 34 px line box */
      font-size: 28px;
      font-weight: 500;
      line-height: 34px;
      white-space: nowrap;
    }
    .day-name {
      font-size: 15px;
      font-weight: normal;
      line-height: 20px;
      color: var(--secondary-text-color);
    }
    .time {
      margin-left: 8px;
    }
    .temp {
      color: var(--chronothermostat-cursor-color, #d85a30);
    }
    .chart {
      margin-top: 4px;
    }
    .chart svg {
      display: block;
      width: 100%;
      height: 150px;
    }
    .grid {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.4));
      stroke-width: 1;
    }
    .axis {
      fill: var(--secondary-text-color);
      font-size: 15px;
    }
    .bar {
      fill: var(--chronothermostat-bar-color, #1d9e75);
    }
    .bar.cursor {
      fill: var(--chronothermostat-cursor-color, #d85a30);
    }
    .cursor-line {
      stroke: var(--chronothermostat-cursor-color, #d85a30);
      stroke-width: 1;
      stroke-dasharray: 3 3;
    }
    .controls {
      display: grid;
      grid-template-columns: minmax(48px, 1fr) minmax(48px, 1fr) 1.8fr 1.8fr;
      gap: 8px;
      margin-top: 8px;
    }
    .big {
      min-height: 56px;
      font-size: 17px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .hold {
      touch-action: none;
      -webkit-touch-callout: none;
    }
    .wide {
      grid-column: span 2;
    }
    .glyph {
      font-size: 28px;
      line-height: 1;
    }
    .icon {
      width: 22px;
      height: 22px;
      flex: none;
    }
    .save {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
      font-weight: 500;
    }
    .footer {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      min-height: 20px;
    }
    .name {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--secondary-text-color);
    }
    .status {
      flex: none;
      margin-left: auto;
      white-space: nowrap;
      color: var(--secondary-text-color);
    }
    .warning {
      color: var(--warning-color, #ffa600);
    }
    .success {
      color: var(--success-color, #43a047);
    }
    .error {
      color: var(--error-color, #db4437);
    }
    .load-error {
      padding: 8px 0;
    }
    .dirty-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      padding: 8px;
      border: 1px solid var(--warning-color, #ffa600);
      border-radius: 8px;
    }
    .dirty-bar .message {
      flex: 1 1 140px;
      color: var(--warning-color, #ffa600);
    }
    .dirty-bar .big {
      flex: 1 1 80px;
    }
    .copy-panel {
      margin-top: 8px;
      padding: 8px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
      border-radius: 8px;
    }
    .hint {
      color: var(--secondary-text-color);
      margin-bottom: 6px;
    }
    .copy-days {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
    }
  `;
}
