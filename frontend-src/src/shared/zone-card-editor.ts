import { LitElement, html, nothing, type TemplateResult } from "lit";
import type { Hass } from "./api";
import { langOf, t, type StringKey } from "./i18n";
import { fitRange, scaleProblem, thermostatBounds, type ViewerCardConfig } from "./viewer-options";

export const ZONE_CARD_EDITOR_TAG = "chronothermostat-zone-card-editor";
export const VIEWER_CARD_EDITOR_TAG = "chronothermostat-viewer-card-editor";

/** Configuration of the per-zone cards (editor, viewer). */
export interface ZoneCardConfig {
  type?: string;
  entity: string;
  name?: string;
}

/** One field of an ha-form schema. */
export interface FormField {
  name: string;
  selector: Record<string, unknown>;
}

const ENTITY_FIELD: FormField = { name: "entity", selector: { entity: { domain: "climate" } } };
export const NAME_FIELD: FormField = { name: "name", selector: { text: {} } };

/** What the form edits, and the configuration it yields (or why it yields none). */
export interface Prepared<C> {
  /** What the form shows next. */
  shown: C;
  /** The configuration to emit; absent while a field is wrong. */
  config?: C;
  /** Message per wrong field. */
  errors: Record<string, string>;
}

/** Visual config editor of a card: an ha-form over `schema`, dropping an empty name. */
export class CardConfigEditor<C extends { name?: string }> extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _errors: { state: true },
  };

  declare hass?: Hass;
  declare protected _config?: C;
  declare private _errors: Record<string, string>;

  constructor() {
    super();
    this._errors = {};
  }

  /** The fields shown, in order. */
  protected schema(_config: C): FormField[] {
    return [ENTITY_FIELD, NAME_FIELD];
  }

  /** What the form shows for a configuration (defaults filled in). */
  protected formData(config: C): C {
    return config;
  }

  /** Turn the form's value into the configuration to emit. */
  protected prepare(value: C): Prepared<C> {
    const config: C = { ...value };
    if (!config.name) delete config.name;
    return { shown: value, config, errors: {} };
  }

  protected get uiLang() {
    return langOf(this.hass);
  }

  setConfig(config: C): void {
    this._config = config;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`<ha-form .hass=${this.hass} .data=${this.formData(this._config)}
      .schema=${this.schema(this._config)} .error=${this._errors}
      .computeLabel=${this._label} @value-changed=${this._changed}></ha-form>`;
  }

  private _label = (item: { name: string }): string =>
    t(this.uiLang, `config_${item.name}` as StringKey);

  private _changed(ev: CustomEvent<{ value: C }>): void {
    ev.stopPropagation();
    const { shown, config, errors } = this.prepare(ev.detail.value);
    this._config = shown;
    this._errors = errors;
    if (!config) return;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }),
    );
  }
}

/** Visual config editor of the editor card: climate entity and optional name. */
export class ChronothermostatZoneCardEditor extends CardConfigEditor<ZoneCardConfig> {}

/** Range offered when switching the viewer to a fixed scale (clamped to the thermostat). */
const FIXED_PREFILL: [number, number] = [16, 22];

/**
 * Visual config editor of the viewer card: the climate entity (the viewer shows no name), the two
 * axes and the chart height, automatic or fixed within the thermostat's limits.
 */
export class ChronothermostatViewerCardEditor extends CardConfigEditor<ViewerCardConfig> {
  private _bounds(config: ViewerCardConfig): [number, number] {
    return thermostatBounds(this.hass?.states?.[config.entity]?.attributes);
  }

  protected schema(config: ViewerCardConfig): FormField[] {
    const lang = this.uiLang;
    const fields: FormField[] = [
      ENTITY_FIELD,
      { name: "show_temperature_axis", selector: { boolean: {} } },
      { name: "show_time_axis", selector: { boolean: {} } },
      {
        name: "scale",
        selector: {
          select: {
            mode: "list",
            options: [
              { value: "auto", label: t(lang, "config_scale_auto") },
              { value: "fixed", label: t(lang, "config_scale_fixed") },
            ],
          },
        },
      },
    ];
    if (config.scale !== "fixed") return fields;
    const [min, max] = this._bounds(config);
    const number = { number: { min, max, step: 0.5, mode: "box", unit_of_measurement: "°C" } };
    return [...fields, { name: "scale_min", selector: number }, { name: "scale_max", selector: number }];
  }

  protected formData(config: ViewerCardConfig): ViewerCardConfig {
    return { show_temperature_axis: true, show_time_axis: true, scale: "auto", ...config };
  }

  protected prepare(value: ViewerCardConfig): Prepared<ViewerCardConfig> {
    const shown: ViewerCardConfig = { ...value };
    const previous = this._config;
    const bounds = this._bounds(shown);
    const [lo, hi] = bounds;
    const fixed = shown.scale === "fixed";
    const set = ([min, max]: [number, number]): void => {
      shown.scale_min = min;
      shown.scale_max = max;
    };
    if (fixed && previous?.scale !== "fixed" &&
        shown.scale_min === undefined && shown.scale_max === undefined) {
      set(fitRange(FIXED_PREFILL, bounds));
    } else if (fixed && previous && previous.entity !== shown.entity &&
        typeof shown.scale_min === "number" && typeof shown.scale_max === "number") {
      // A different thermostat: keep the range where it fits, else bring it within the new limits.
      set(fitRange([shown.scale_min, shown.scale_max], bounds));
    }
    const problem = scaleProblem(shown, [lo, hi]);
    if (problem) {
      const limit = problem.key === "config_error_below" ? lo : hi;
      const message = t(this.uiLang, problem.key, { limit: limit.toLocaleString(this.uiLang) });
      return { shown, errors: { [problem.field]: message } };
    }
    const config: ViewerCardConfig = { ...shown };
    if (!config.name) delete config.name;
    if (config.show_temperature_axis !== false) delete config.show_temperature_axis;
    if (config.show_time_axis !== false) delete config.show_time_axis;
    if (config.scale !== "fixed") {
      delete config.scale;
      delete config.scale_min;
      delete config.scale_max;
    }
    return { shown, config, errors: {} };
  }
}

// Registered here, once, for every card that imports it (the bundle may also be evaluated twice).
if (!customElements.get(ZONE_CARD_EDITOR_TAG)) {
  customElements.define(ZONE_CARD_EDITOR_TAG, ChronothermostatZoneCardEditor);
}
if (!customElements.get(VIEWER_CARD_EDITOR_TAG)) {
  customElements.define(VIEWER_CARD_EDITOR_TAG, ChronothermostatViewerCardEditor);
}
