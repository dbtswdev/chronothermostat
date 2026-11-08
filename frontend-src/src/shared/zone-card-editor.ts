import { LitElement, html, nothing, type TemplateResult } from "lit";
import type { Hass } from "./api";
import { langOf, t } from "./i18n";

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

/** Visual config editor of a card: an ha-form over `schema`, dropping an empty name. */
export class CardConfigEditor<C extends { name?: string }> extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  declare hass?: Hass;
  declare private _config?: C;

  /** The fields shown, in order. */
  protected get schema(): FormField[] {
    return [ENTITY_FIELD, NAME_FIELD];
  }

  setConfig(config: C): void {
    this._config = config;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`<ha-form .hass=${this.hass} .data=${this._config} .schema=${this.schema}
      .computeLabel=${this._label} @value-changed=${this._changed}></ha-form>`;
  }

  private _label = (item: { name: string }): string =>
    t(langOf(this.hass), item.name === "entity" ? "config_entity" : "config_name");

  private _changed(ev: CustomEvent<{ value: C }>): void {
    ev.stopPropagation();
    const config: C = { ...ev.detail.value };
    if (!config.name) delete config.name;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }),
    );
  }
}

/** Visual config editor of the editor card: climate entity and optional name. */
export class ChronothermostatZoneCardEditor extends CardConfigEditor<ZoneCardConfig> {}

/** Visual config editor of the viewer card: the climate entity only (the viewer shows no name). */
export class ChronothermostatViewerCardEditor extends CardConfigEditor<ZoneCardConfig> {
  protected get schema(): FormField[] {
    return [ENTITY_FIELD];
  }
}

// Registered here, once, for every card that imports it (the bundle may also be evaluated twice).
if (!customElements.get(ZONE_CARD_EDITOR_TAG)) {
  customElements.define(ZONE_CARD_EDITOR_TAG, ChronothermostatZoneCardEditor);
}
if (!customElements.get(VIEWER_CARD_EDITOR_TAG)) {
  customElements.define(VIEWER_CARD_EDITOR_TAG, ChronothermostatViewerCardEditor);
}
