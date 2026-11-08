"""Scheduling engine: wires the pure rules to Home Assistant."""

from __future__ import annotations

import asyncio
from collections.abc import Coroutine
from dataclasses import dataclass
from datetime import datetime
import logging
from typing import Any

from homeassistant.components.climate import (
    ATTR_HVAC_MODE,
    ATTR_MAX_TEMP,
    ATTR_MIN_TEMP,
    DOMAIN as CLIMATE_DOMAIN,
    SERVICE_SET_HVAC_MODE,
    SERVICE_SET_TEMPERATURE,
)
from homeassistant.const import (
    ATTR_ENTITY_ID,
    ATTR_FRIENDLY_NAME,
    ATTR_TEMPERATURE,
    STATE_UNAVAILABLE,
    STATE_UNKNOWN,
)
from homeassistant.core import (
    CALLBACK_TYPE,
    HomeAssistant,
    callback,
    split_entity_id,
)
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import (
    async_track_point_in_time,
    async_track_time_change,
)
from homeassistant.helpers.start import async_at_started
from homeassistant.util import dt as dt_util

from . import rules
from .const import (
    DEFAULT_MAX_TEMP,
    DEFAULT_MIN_TEMP,
    DOMAIN,
    PROGRAM_SCENARIOS,
    SIGNAL_UPDATED,
    Scenario,
)
from .program import Week
from .status import ZoneState, ZoneStatus, compute_zone_status
from .storage import ProgramStore

_LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class PendingCommand:
    """Parts of a zone command that have not been delivered yet."""

    hvac_mode: str | None
    temperature: float | None


def _is_future(value: datetime | None) -> bool:
    """Return True for a timezone-aware datetime strictly in the future."""
    return (
        value is not None and value.tzinfo is not None and value > dt_util.utcnow()
    )


def _as_float(value: Any, default: float) -> float:
    """Return value as a float, or the default when it is not a number."""
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


class Engine:
    """Drives the zones from their programs."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry_id: str,
        store: ProgramStore,
        zone_ids: list[str],
    ) -> None:
        """Keep the collaborators; call async_start to begin."""
        self.hass = hass
        self.entry_id = entry_id
        self.store = store
        self.zone_ids = zone_ids
        self._pending: dict[str, PendingCommand] = {}
        self._lock = asyncio.Lock()
        self._unsub_quarter: CALLBACK_TYPE | None = None
        self._unsub_return: CALLBACK_TYPE | None = None
        self._unsub_started: CALLBACK_TYPE | None = None

    @property
    def scenario(self) -> Scenario:
        """Return the current house-wide scenario."""
        return self.store.scenario

    @property
    def return_at(self) -> datetime | None:
        """Return the return time of the away scenario, if any."""
        return self.store.return_at

    async def async_start(self) -> None:
        """Start the timers; zone work waits until Home Assistant has started."""
        self._unsub_quarter = async_track_time_change(
            self.hass, self._on_quarter, minute=[0, 15, 30, 45], second=0
        )
        if _is_future(self.return_at):
            self._arm_return_timer()
        self._unsub_started = async_at_started(self.hass, self._async_startup)

    async def async_stop(self) -> None:
        """Cancel every timer and listener; safe to call more than once."""
        for unsub in (self._unsub_quarter, self._unsub_started):
            if unsub is not None:
                unsub()
        self._unsub_quarter = self._unsub_started = None
        self._cancel_return_timer()

    async def async_set_scenario(
        self,
        scenario: Scenario,
        return_at: datetime | None = None,
        *,
        source: str = "service",
    ) -> None:
        """Switch the scenario and apply it to every zone (§4.9).

        Away keeps return_at only when it is timezone-aware and in the future.
        Otherwise a service call raises ValueError, and any other source (the
        select entity, startup) gets away without return. Other scenarios
        clear return_at.
        """
        scenario = Scenario(scenario)
        if scenario is not Scenario.AWAY:
            return_at = None
        elif not _is_future(return_at):
            if source == "service":
                raise ValueError(
                    "Away needs a timezone-aware return time in the future"
                )
            return_at = None
        await self._async_change_scenario(scenario, return_at, f"scenario {scenario}")

    async def async_set_return_at(self, return_at: datetime | None) -> None:
        """Store a new return time (naive or past means none) and re-arm."""
        if not _is_future(return_at):
            return_at = None
        self.store.set_scenario(self.scenario, return_at)
        await self.store.async_save()
        self._arm_return_timer()
        self._dispatch()

    def zone_state(self, zone_id: str) -> ZoneState:
        """Return the observed state of a zone's climate entity."""
        state = self.hass.states.get(zone_id)
        if state is None or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return ZoneState(None, None)
        return ZoneState(state.state, state.attributes.get(ATTR_TEMPERATURE))

    def zone_status(self, zone_id: str) -> ZoneStatus:
        """Return the display status of a zone."""
        weeks = {
            scenario: self.store.get_week(zone_id, scenario)
            for scenario in PROGRAM_SCENARIOS
        }
        return compute_zone_status(
            self.scenario,
            self.return_at,
            self.zone_state(zone_id),
            weeks,
            dt_util.now(),
        )

    def zone_name(self, zone_id: str) -> str:
        """Return the zone's friendly name, or its object id."""
        state = self.hass.states.get(zone_id)
        if state is not None and (name := state.attributes.get(ATTR_FRIENDLY_NAME)):
            return str(name)
        return split_entity_id(zone_id)[1]

    def min_max(self, zone_id: str) -> tuple[float, float]:
        """Return the zone's setpoint range from its climate attributes."""
        state = self.hass.states.get(zone_id)
        attributes = state.attributes if state is not None else {}
        return (
            _as_float(attributes.get(ATTR_MIN_TEMP), DEFAULT_MIN_TEMP),
            _as_float(attributes.get(ATTR_MAX_TEMP), DEFAULT_MAX_TEMP),
        )

    async def _async_startup(self, _hass: HomeAssistant) -> None:
        """Bring the zones in line once Home Assistant has started (§4.11).

        Away whose return time passed while Home Assistant was down switches
        to work. Otherwise, in work or holiday, zones that are on get the
        current value and zones not available yet keep it as pending.
        """
        self._unsub_started = None
        return_at = self.return_at
        if (
            self.scenario is Scenario.AWAY
            and return_at is not None
            and return_at <= dt_util.utcnow()
        ):
            await self.async_set_scenario(Scenario.WORK, source="startup")
            return
        async with self._lock:
            scenario = self.scenario
            local_now = dt_util.now()
            for zone_id in self.zone_ids:
                zone = self.zone_state(zone_id)
                week = self._week(zone_id, scenario)
                if zone.hvac_mode is None:
                    target = rules.zone_turned_on_target(scenario, week, local_now)
                else:
                    target = rules.startup_target(scenario, zone, week, local_now)
                if target is not None:
                    await self._send(
                        zone_id, hvac_mode=None, temperature=target, reason="startup"
                    )

    @callback
    def _on_quarter(self, now: datetime) -> None:
        """Handle a quarter-hour tick (§4.4)."""
        self._create_task(self._async_quarter(dt_util.as_local(now)))

    @callback
    def _on_return(self, _now: datetime) -> None:
        """Switch to work when the away return time arrives (§4.7)."""
        self._unsub_return = None
        self._create_task(
            self._async_change_scenario(Scenario.WORK, None, "return")
        )

    @callback
    def _create_task(self, coro: Coroutine[Any, Any, None]) -> None:
        """Run engine work as a tracked task."""
        self.hass.async_create_task(coro, f"{DOMAIN} {self.entry_id}")

    async def _async_change_scenario(
        self, scenario: Scenario, return_at: datetime | None, reason: str
    ) -> None:
        """Persist an already validated scenario and apply it to every zone.

        Runs under the engine lock, so concurrent changes apply one after the
        other and the zones end in the last scenario's state.
        """
        async with self._lock:
            self.store.set_scenario(scenario, return_at)
            await self.store.async_save()
            self._arm_return_timer()
            self._dispatch()
            self._pending.clear()
            local_now = dt_util.now()
            for zone_id in self.zone_ids:
                hvac_mode, temperature = rules.scenario_change(
                    scenario, self._week(zone_id, scenario), local_now
                )
                await self._send(
                    zone_id,
                    hvac_mode=hvac_mode,
                    temperature=temperature,
                    reason=reason,
                )

    async def _async_quarter(self, local_now: datetime) -> None:
        """Send each zone that is on its program step, if any."""
        async with self._lock:
            scenario = self.scenario
            for zone_id in self.zone_ids:
                target = rules.tick_target(
                    scenario,
                    self.zone_state(zone_id),
                    self._week(zone_id, scenario),
                    local_now,
                )
                if target is not None:
                    await self._send(
                        zone_id, hvac_mode=None, temperature=target, reason="step"
                    )

    def _week(self, zone_id: str, scenario: Scenario) -> Week | None:
        """Return the zone's week for a program scenario, else None."""
        if scenario not in PROGRAM_SCENARIOS:
            return None
        return self.store.get_week(zone_id, scenario)

    def _arm_return_timer(self) -> None:
        """Arm the return timer when away with a return time, else cancel it."""
        self._cancel_return_timer()
        return_at = self.return_at
        if self.scenario is Scenario.AWAY and return_at is not None:
            self._unsub_return = async_track_point_in_time(
                self.hass, self._on_return, return_at
            )

    def _cancel_return_timer(self) -> None:
        if self._unsub_return is not None:
            self._unsub_return()
            self._unsub_return = None

    def _dispatch(self) -> None:
        async_dispatcher_send(self.hass, SIGNAL_UPDATED.format(entry_id=self.entry_id))

    async def _send(
        self,
        zone_id: str,
        *,
        hvac_mode: str | None,
        temperature: float | None,
        reason: str,
    ) -> None:
        """Send hvac mode then temperature to a zone's climate.

        Parts that cannot be delivered (zone unavailable, unknown or missing,
        or a failed service call) become the zone's pending command; parts
        delivered now drop out of it.
        """
        mode_left, temperature_left = hvac_mode, temperature
        if self.zone_state(zone_id).hvac_mode is None:
            _LOGGER.debug("%s: unavailable, command kept pending (%s)", zone_id, reason)
        else:
            try:
                if mode_left is not None:
                    await self._call(
                        zone_id,
                        SERVICE_SET_HVAC_MODE,
                        ATTR_HVAC_MODE,
                        mode_left,
                        reason,
                    )
                    mode_left = None
                if temperature_left is not None:
                    await self._call(
                        zone_id,
                        SERVICE_SET_TEMPERATURE,
                        ATTR_TEMPERATURE,
                        temperature_left,
                        reason,
                    )
                    temperature_left = None
            except HomeAssistantError as err:
                _LOGGER.warning("%s: command failed (%s): %s", zone_id, reason, err)
        old = self._pending.pop(zone_id, PendingCommand(None, None))
        pending = PendingCommand(
            mode_left if hvac_mode is not None else old.hvac_mode,
            temperature_left if temperature is not None else old.temperature,
        )
        if pending != PendingCommand(None, None):
            self._pending[zone_id] = pending

    async def _call(
        self, zone_id: str, service: str, attribute: str, value: Any, reason: str
    ) -> None:
        """Call a climate service on one zone and log the command."""
        await self.hass.services.async_call(
            CLIMATE_DOMAIN,
            service,
            {ATTR_ENTITY_ID: zone_id, attribute: value},
            blocking=True,
        )
        _LOGGER.info("%s: set %s (%s)", zone_id, f"{attribute} {value}", reason)
