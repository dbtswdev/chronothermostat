// Entry point of the cards bundle: registers the custom elements and the card picker entries.
import { ChronothermostatEditorCard, EDITOR_CARD_TAG } from "./editor-card";
import {
  ChronothermostatScenarioCard,
  ChronothermostatScenarioCardEditor,
  SCENARIO_CARD_EDITOR_TAG,
  SCENARIO_CARD_TAG,
} from "./scenario-card";
import { ChronothermostatViewerCard, VIEWER_CARD_TAG } from "./viewer-card";

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

define(EDITOR_CARD_TAG, ChronothermostatEditorCard);
addCard({ type: EDITOR_CARD_TAG, name: "Chronothermostat editor", preview: false });
define(VIEWER_CARD_TAG, ChronothermostatViewerCard);
addCard({ type: VIEWER_CARD_TAG, name: "Chronothermostat viewer", preview: false });
define(SCENARIO_CARD_TAG, ChronothermostatScenarioCard);
define(SCENARIO_CARD_EDITOR_TAG, ChronothermostatScenarioCardEditor);
addCard({ type: SCENARIO_CARD_TAG, name: "Chronothermostat scenario", preview: false });
