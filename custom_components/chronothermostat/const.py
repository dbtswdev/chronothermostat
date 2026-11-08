"""Constants for the Chronothermostat integration."""

from enum import StrEnum

DOMAIN = "chronothermostat"
PLATFORMS = ["select", "datetime", "sensor"]

CONF_ZONES = "zones"

SLOTS = 96
WEEKDAYS = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")

TEMP_TOLERANCE = 0.05
TEMP_STEP = 0.5
DEFAULT_NIGHT_TEMP = 16.0
DEFAULT_DAY_TEMP = 19.0


class Scenario(StrEnum):
    """Operating scenarios."""

    WORK = "work"
    HOLIDAY = "holiday"
    AWAY = "away"
    OFF = "off"


PROGRAM_SCENARIOS = (Scenario.WORK, Scenario.HOLIDAY)

SIGNAL_UPDATED = "chronothermostat_updated_{entry_id}"

HVAC_ON = "heat"
HVAC_OFF = "off"
