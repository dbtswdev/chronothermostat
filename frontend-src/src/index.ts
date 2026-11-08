// Entry point of the cards bundle: registers the custom elements and the card picker entries.
import {
  ChronothermostatEditorCard, ChronothermostatZoneCardEditor, EDITOR_CARD_TAG, ZONE_CARD_EDITOR_TAG,
} from "./editor-card";

interface CustomCardEntry {
  type: string;
  name: string;
  preview?: boolean;
  description?: string;
}

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
  }
}

// The bundle may be evaluated twice (e.g. the resource added with another query string).
function define(tag: string, element: CustomElementConstructor): void {
  if (!customElements.get(tag)) customElements.define(tag, element);
}

function addCard(entry: CustomCardEntry): void {
  window.customCards = window.customCards || [];
  if (!window.customCards.some((card) => card.type === entry.type)) window.customCards.push(entry);
}

define(ZONE_CARD_EDITOR_TAG, ChronothermostatZoneCardEditor);
define(EDITOR_CARD_TAG, ChronothermostatEditorCard);
addCard({ type: EDITOR_CARD_TAG, name: "Chronothermostat editor", preview: false });
