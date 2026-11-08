import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { getInfo, setScenario, type Hass, type Info, type Scenario } from "./shared/api";
import { formatReturn } from "./shared/format";
import { langOf, t, type Lang } from "./shared/i18n";

export const SCENARIO_CARD_TAG = "chronothermostat-scenario-card";

export interface ScenarioCardConfig {
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
    this._message = undefined;
    if (key === "away" || key === "off") {
      this._panel = this._panel === key ? undefined : key;
      return;
    }
    this._panel = undefined;
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
    const when = parseLocal(field('input[type="date"]'), field('input[type="time"]'));
    if (!when || when.getTime() <= Date.now()) {
      this._message = t(langOf(this.hass), "return_required");
      return;
    }
    void this._apply("away", when);
  }

  // ---- rendering -----------------------------------------------------------------------------

  protected render(): TemplateResult {
    const lang = langOf(this.hass);
    const { select, returnAt } = this._current();
    const active = isScenario(select?.state) ? select?.state : undefined;
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
            @click=${() => this._tap(key)}
          >${t(lang, key)}</button>`,
        )}
      </div>
      ${this._panel ? this._renderPanel(this._panel, lang) : nothing}
      ${failure ? html`<div class="error">${t(lang, failure)}</div>` : nothing}
      ${!failure && active ? html`<div class="sentence">${this._sentence(active, returnAt, lang)}</div>` : nothing}
    </ha-card>`;
  }

  private _renderPanel(kind: "away" | "off", lang: Lang): TemplateResult {
    const message = this._message ? html`<div class="error">${this._message}</div>` : nothing;
    const buttons = html`<div class="buttons">
      <button class="action confirm" ?disabled=${this._busy}
        @click=${() => (kind === "off" ? void this._apply("off") : this._confirmAway())}>${t(lang, "confirm")}</button>
      <button class="action cancel" @click=${() => { this._panel = undefined; this._message = undefined; }}>${t(lang, "cancel")}</button>
    </div>`;
    if (kind === "off") return html`<div class="panel">${buttons}${message}</div>`;
    const def = defaultReturn(new Date());
    return html`<div class="panel">
      <div class="fields">
        <label>${t(lang, "return_date")}<input type="date" .value=${def.date} /></label>
        <label>${t(lang, "return_time")}<input type="time" step="900" .value=${def.time} /></label>
      </div>
      ${buttons}${message}
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
