import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { getInfo, setScenario, type Hass, type Info, type Scenario } from "./shared/api";
import { formatReturn } from "./shared/format";
import { langOf, t, type Lang } from "./shared/i18n";
import { CardConfigEditor, NAME_FIELD, type FormField } from "./shared/zone-card-editor";

export const SCENARIO_CARD_TAG = "chronothermostat-scenario-card";
export const SCENARIO_CARD_EDITOR_TAG = "chronothermostat-scenario-card-editor";

export interface ScenarioCardConfig {
  type?: string;
  name?: string;
}

type HassState = { state: string; attributes: Record<string, unknown> };
type Failure = "error_load";

const SCENARIOS: Scenario[] = ["work", "holiday", "away", "off"];
const INFO_RETRY_MS = 30000;

const pad = (n: number): string => (n < 10 ? `0${n}` : String(n));
const isScenario = (v: unknown): v is Scenario => SCENARIOS.includes(v as Scenario);

/** Tomorrow 19:00 in the browser's local time, as the values of the date and time inputs. */
function defaultReturn(now: Date): { date: string; time: string } {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 19, 0);
  return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: "19:00" };
}

/** The instant on the nearest quarter hour of the local clock (the return is on a 15-minute grid). */
function roundToQuarter(d: Date): Date {
  const rounded = new Date(d.getTime());
  rounded.setMinutes(Math.round(rounded.getMinutes() / 15) * 15, 0, 0);
  return rounded;
}

/** Local instant of a date input ("YYYY-MM-DD") and a time input ("HH:MM"), or undefined. */
function parseLocal(date: string, time: string): Date | undefined {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const m = /^(\d{2}):(\d{2})/.exec(time);
  if (!d || !m) return undefined;
  const result = new Date(+d[1], +d[2] - 1, +d[3], +m[1], +m[2]);
  return isNaN(result.getTime()) ? undefined : result;
}

/** Whole-house scenario: Work, Holiday, Away (asks the return), Off (asks confirmation). */
export class ChronothermostatScenarioCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _info: { state: true },
    _infoFailed: { state: true },
    _panel: { state: true },
    _message: { state: true },
    _busy: { state: true },
  };

  declare hass?: Hass;
  declare private _config: ScenarioCardConfig;
  declare private _info?: Info;
  declare private _infoFailed: boolean;
  declare private _panel?: "away" | "off";
  declare private _message?: string;
  declare private _busy: boolean;

  private _infoPending = false;
  private _infoTriedAt = 0;
  private _seen?: { select?: HassState; returnAt?: HassState; lang: Lang };

  constructor() {
    super();
    this._config = {};
    this._infoFailed = false;
    this._busy = false;
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(SCENARIO_CARD_EDITOR_TAG);
  }

  static getStubConfig(): ScenarioCardConfig {
    return {};
  }

  setConfig(config: ScenarioCardConfig): void {
    this._config = { ...(config ?? {}) };
  }

  getCardSize(): number {
    return 3;
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.has("hass")) this._ensureInfo();
    const current = this._current();
    const seen = this._seen;
    const same =
      !!seen &&
      seen.select === current.select &&
      seen.returnAt === current.returnAt &&
      seen.lang === current.lang;
    this._seen = current;
    if (changed.size === 1 && changed.has("hass")) return !same;
    return true;
  }

  /** Entity ids come from the backend once; after a failure retry on a later update, rate-limited. */
  private _ensureInfo(): void {
    if (!this.hass || this._infoPending) return;
    if (this._info && this._info.scenario_entity_id) return;
    if (this._infoTriedAt && Date.now() - this._infoTriedAt < INFO_RETRY_MS) return;
    this._infoTriedAt = Date.now();
    this._infoPending = true;
    getInfo(this.hass).then(
      (info) => {
        this._infoPending = false;
        this._info = info;
        this._infoFailed = !info?.scenario_entity_id;
      },
      () => {
        this._infoPending = false;
        this._infoFailed = true;
      },
    );
  }

  private _active(): Scenario | undefined {
    const state = this._current().select?.state;
    return isScenario(state) ? state : undefined;
  }

  private _current(): { select?: HassState; returnAt?: HassState; lang: Lang } {
    const states = this.hass?.states ?? {};
    const { scenario_entity_id: selectId, return_at_entity_id: returnId } = this._info ?? {};
    return {
      select: selectId ? states[selectId] : undefined,
      returnAt: returnId ? states[returnId] : undefined,
      lang: langOf(this.hass),
    };
  }

  // ---- actions -------------------------------------------------------------------------------

  private _tap(key: Scenario): void {
    if (this._busy) return;
    this._message = undefined;
    if (key === "away" || key === "off") {
      this._panel = this._panel === key ? undefined : key;
      return;
    }
    this._panel = undefined;
    // The active program is not applied again: that would switch zones turned off by hand back
    // on and drop forced setpoints.
    if (key === this._active()) return;
    void this._apply(key);
  }

  private async _apply(key: Scenario, returnAt?: Date): Promise<void> {
    if (!this.hass || this._busy) return;
    this._busy = true;
    this._message = undefined;
    try {
      await setScenario(this.hass, key, returnAt);
      if (key === "away" || key === "off") this._panel = undefined;
    } catch (err) {
      const text = err instanceof Error ? err.message : "";
      this._message = text || t(langOf(this.hass), "error_save");
    } finally {
      this._busy = false;
    }
  }

  private _confirmAway(): void {
    const field = (sel: string): string =>
      (this.renderRoot.querySelector(sel) as HTMLInputElement | null)?.value ?? "";
    // Native pickers ignore step="900", so the chosen time is put on the quarter hour here.
    const picked = parseLocal(field('input[type="date"]'), field('input[type="time"]'));
    const when = picked && roundToQuarter(picked);
    if (!when || when.getTime() <= Date.now()) {
      this._message = t(langOf(this.hass), "return_required");
      return;
    }
    void this._apply("away", when);
  }

  // ---- rendering -----------------------------------------------------------------------------

  protected render(): TemplateResult {
    const lang = langOf(this.hass);
    const { returnAt } = this._current();
    const active = this._active();
    const label = this._config.name || t(lang, "house_scenario");
    const failure: Failure | undefined = this._infoFailed ? "error_load" : undefined;

    return html`<ha-card>
      <div class="label">${label}</div>
      <div class="chips">
        ${SCENARIOS.map(
          (key) => html`<button
            class="chip ${key} ${active === key ? "active" : ""}"
            data-scenario=${key}
            aria-pressed=${active === key ? "true" : "false"}
            ?disabled=${this._busy}
            @click=${() => this._tap(key)}
          >${t(lang, key)}</button>`,
        )}
      </div>
      ${this._panel ? this._renderPanel(this._panel, lang) : nothing}
      ${this._message ? html`<div class="error">${this._message}</div>` : nothing}
      ${failure ? html`<div class="error">${t(lang, failure)}</div>` : nothing}
      ${!failure && active ? html`<div class="sentence">${this._sentence(active, returnAt, lang)}</div>` : nothing}
    </ha-card>`;
  }

  private _renderPanel(kind: "away" | "off", lang: Lang): TemplateResult {
    const buttons = html`<div class="buttons">
      <button class="action confirm" ?disabled=${this._busy}
        @click=${() => (kind === "off" ? void this._apply("off") : this._confirmAway())}>${t(lang, "confirm")}</button>
      <button class="action cancel" @click=${() => { this._panel = undefined; this._message = undefined; }}>${t(lang, "cancel")}</button>
    </div>`;
    if (kind === "off") return html`<div class="panel">${buttons}</div>`;
    const def = defaultReturn(new Date());
    return html`<div class="panel">
      <div class="fields">
        <label>${t(lang, "return_date")}<input type="date" .value=${def.date} /></label>
        <label>${t(lang, "return_time")}<input type="time" step="900" .value=${def.time} /></label>
      </div>
      ${buttons}
    </div>`;
  }

  private _sentence(active: Scenario, returnAt: HassState | undefined, lang: Lang): string {
    switch (active) {
      case "work":
        return t(lang, "house_work");
      case "holiday":
        return t(lang, "house_holiday");
      case "off":
        return t(lang, "house_off");
      default: {
        const when = new Date(returnAt?.state ?? "");
        if (isNaN(when.getTime()) || when.getTime() <= Date.now()) return t(lang, "house_away_no_return");
        return t(lang, "house_away", { when: formatReturn(when, lang) });
      }
    }
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
    .label {
      color: var(--secondary-text-color);
    }
    .chips {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 6px;
      margin-top: 6px;
    }
    button {
      font: inherit;
      font-size: 15px;
      color: var(--primary-text-color);
      background: transparent;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
      border-radius: 12px;
      min-height: 48px;
      padding: 0 4px;
      cursor: pointer;
      overflow-wrap: anywhere;
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .chip.active {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
      border-color: var(--primary-color);
      color: var(--primary-color);
      font-weight: 600;
    }
    .chip.away.active,
    .chip.off.active {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.15);
      border-color: var(--error-color, #db4437);
      color: var(--error-color, #db4437);
    }
    .panel {
      margin-top: 6px;
    }
    .fields {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .fields label {
      display: flex;
      flex: 1 1 140px;
      flex-direction: column;
      color: var(--secondary-text-color);
    }
    input {
      font: inherit;
      font-size: 16px;
      min-height: 48px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      background: transparent;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
      border-radius: 8px;
      padding: 0 8px;
    }
    .buttons {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
    .action {
      flex: 1;
    }
    .action.confirm {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.15);
      border-color: var(--error-color, #db4437);
      color: var(--error-color, #db4437);
      font-weight: 600;
    }
    .error {
      margin-top: 6px;
      color: var(--error-color, #db4437);
    }
    .sentence {
      margin-top: 6px;
      overflow-wrap: anywhere;
    }
  `;
}

/** Visual config editor of the scenario card: the optional name. */
export class ChronothermostatScenarioCardEditor extends CardConfigEditor<ScenarioCardConfig> {
  protected schema(): FormField[] {
    return [NAME_FIELD];
  }
}
