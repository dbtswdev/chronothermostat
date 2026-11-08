import { LitElement, html, nothing, type TemplateResult } from "lit";
import type { Hass } from "./api";
import { langOf, t } from "./i18n";

export const ZONE_CARD_EDITOR_TAG = "chronothermostat-zone-card-editor";

/** Configuration of the per-zone cards (editor, viewer). */
export interface ZoneCardConfig {
  type?: string;
  entity: string;
  name?: string;
}

const CONFIG_SCHEMA = [
  { name: "entity", selector: { entity: { domain: "climate" } } },
  { name: "name", selector: { text: {} } },
];

/** Visual config editor shared by the zone cards: climate entity and optional name. */
export class ChronothermostatZoneCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  declare hass?: Hass;
  declare private _config?: ZoneCardConfig;

  setConfig(config: ZoneCardConfig): void {
    this._config = config;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`<ha-form .hass=${this.hass} .data=${this._config} .schema=${CONFIG_SCHEMA}
      .computeLabel=${this._label} @value-changed=${this._changed}></ha-form>`;
  }

  private _label = (item: { name: string }): string =>
    t(langOf(this.hass), item.name === "entity" ? "config_entity" : "config_name");

  private _changed(ev: CustomEvent<{ value: ZoneCardConfig }>): void {
    ev.stopPropagation();
    const config: ZoneCardConfig = { ...ev.detail.value };
    if (!config.name) delete config.name;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }),
    );
  }
}

// Registered here, once, for every card that imports it (the bundle may also be evaluated twice).
if (!customElements.get(ZONE_CARD_EDITOR_TAG)) {
  customElements.define(ZONE_CARD_EDITOR_TAG, ChronothermostatZoneCardEditor);
}
