"""Scheduling engine: wires the pure rules to Home Assistant."""

from __future__ import annotations

import asyncio
from collections.abc import Coroutine, Sequence
from dataclasses import dataclass, replace
from datetime import datetime
import logging
from typing import Any, TypeIs

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
    Event,
    EventStateChangedData,
    HomeAssistant,
    State,
    callback,
    split_entity_id,
)
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import (
    async_track_point_in_time,
    async_track_state_change_event,
    async_track_time_change,
)
from homeassistant.helpers.start import async_at_started
from homeassistant.util import dt as dt_util

from . import rules
from .const import (
    DEFAULT_MAX_TEMP,
    DEFAULT_MIN_TEMP,
    DOMAIN,
    HVAC_OFF,
    HVAC_ON,
    PROGRAM_SCENARIOS,
    SIGNAL_UPDATED,
    TEMP_TOLERANCE,
    WEEKDAYS,
    Scenario,
)
from .program import (
    Week,
    is_step,
    normalize_day,
    round_half,
    slot_index,
    weekday_key,
)
from .status import ZoneState, ZoneStatus, compute_zone_status
from .storage import ProgramStore

_LOGGER = logging.getLogger(__name__)

# Seconds a climate service call may take before it counts as undelivered.
CALL_TIMEOUT = 10
# Seconds async_stop waits for engine work in flight (longer than CALL_TIMEOUT).
STOP_TIMEOUT = 15
# Seconds after a mode command in which a zone showing that mode is the
# command's own, possibly late, effect and not something done by hand.
REPORT_WINDOW = 60


@dataclass(frozen=True)
class PendingCommand:
    """Parts of a zone command that have not been delivered yet."""

    hvac_mode: str | None
    temperature: float | None


@dataclass
class _ModeCall:
    """What a zone did while a set_hvac_mode call to it was in flight."""

    mode: str
    # The zone switched to the mode asked for.
    reached: bool = False
    # The zone was switched on or off by hand.
    by_hand: bool = False


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


def _is_available(state: State | None) -> TypeIs[State]:
    """Return True if a climate state exists and is not unavailable or unknown."""
    return state is not None and state.state not in (STATE_UNAVAILABLE, STATE_UNKNOWN)


def _step_value(week: Week | None, local_now: datetime) -> float | None:
    """Return the program value of the current quarter if it is a step."""
    if week is None:
        return None
    weekday, slot = weekday_key(local_now), slot_index(local_now)
    if not is_step(week, weekday, slot):
        return None
    return week[weekday][slot]


def _check_weekday(weekday: str) -> None:
    """Raise ValueError unless weekday is one of the seven weekday keys."""
    if weekday not in WEEKDAYS:
        raise ValueError(f"Invalid weekday {weekday!r}")


def _check_range(values: Any, min_temp: float, max_temp: float) -> None:
    """Raise ValueError for a number outside the zone's setpoint range.

    Values that are not numbers are left to normalize_day, which rejects them.
    """
    if isinstance(values, (str, bytes)) or not isinstance(values, Sequence):
        return
    for value in values:
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            continue
        if not min_temp <= value <= max_temp:
            raise ValueError(
                f"Setpoint {value!r} is outside the range {min_temp} to {max_temp}"
            )


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
        self._unsub_zones: CALLBACK_TYPE | None = None
        # Last hvac mode of each zone seen while it was available.
        self._last_mode: dict[str, str] = {}
        # The mode call in flight to each zone.
        self._mode_calls: dict[str, _ModeCall] = {}
        # Mode commands sent to each zone whose mode the zone has not shown
        # yet, with the time they were sent.
        self._unconfirmed: dict[str, dict[str, datetime]] = {}
        # When each zone was last seen available.
        self._last_seen: dict[str, datetime] = {}
        # Set by async_stop: from then on the engine sends and saves nothing.
        self._stopped = False
        self._tasks: set[asyncio.Task[None]] = set()

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
        for zone_id in self.zone_ids:
            state = self.hass.states.get(zone_id)
            if _is_available(state):
                self._last_mode[zone_id] = state.state
                self._last_seen[zone_id] = dt_util.utcnow()
        self._unsub_zones = async_track_state_change_event(
            self.hass, self.zone_ids, self._on_zone_change
        )
        if _is_future(self.return_at):
            self._arm_return_timer()
        self._unsub_started = async_at_started(self.hass, self._on_started)

    async def async_stop(self) -> None:
        """Stop for good; safe to call more than once.

        Cancels the timers, the listeners and the engine's own queued or
        running work. A public call still holding the lock sends nothing more
        and is waited for (at most STOP_TIMEOUT seconds), so once this returns
        the engine no longer touches the zones or the store.
        """
        self._stopped = True
        for unsub in (self._unsub_quarter, self._unsub_zones, self._unsub_started):
            if unsub is not None:
                unsub()
        self._unsub_quarter = self._unsub_zones = self._unsub_started = None
        self._cancel_return_timer()
        tasks = list(self._tasks)
        for task in tasks:
            task.cancel()
        try:
            async with asyncio.timeout(STOP_TIMEOUT):
                if tasks:
                    await asyncio.wait(tasks)
                async with self._lock:
                    pass
        except TimeoutError:
            _LOGGER.warning("Engine work still running %s s after stop", STOP_TIMEOUT)

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
        clear return_at. Raises HomeAssistantError once the engine is stopped.
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
        """Store a new return time (naive or past means none) and re-arm.

        Raises HomeAssistantError once the engine is stopped.
        """
        if not _is_future(return_at):
            return_at = None
        async with self._lock:
            self._raise_if_stopped()
            self.store.set_scenario(self.scenario, return_at)
            await self.store.async_save()
            self._arm_return_timer()
            self._dispatch()

    async def async_save_day(
        self, zone_id: str, scenario: Scenario, weekday: str, values: list[float]
    ) -> None:
        """Save one program day and apply it if it changes the current value.

        Raises ValueError for a zone that is not configured, a scenario
        without a program, an invalid weekday or invalid values (including a
        value outside the zone's min/max); storage is left untouched and
        nothing is sent. Raises HomeAssistantError once the engine is stopped.
        """
        async with self._lock:
            self._raise_if_stopped()
            await self._async_save_day(zone_id, scenario, weekday, values)

    async def async_copy_day(
        self, zone_id: str, scenario: Scenario, from_weekday: str, to_weekday: str
    ) -> None:
        """Copy the saved values of one program day onto another day.

        Raises HomeAssistantError once the engine is stopped.
        """
        async with self._lock:
            self._raise_if_stopped()
            scenario = self._program_scenario(zone_id, scenario)
            _check_weekday(from_weekday)
            values = self.store.get_week(zone_id, scenario)[from_weekday]
            await self._async_save_day(zone_id, scenario, to_weekday, values)

    def zone_state(self, zone_id: str) -> ZoneState:
        """Return the observed state of a zone's climate entity."""
        state = self.hass.states.get(zone_id)
        if not _is_available(state):
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

    async def _async_startup(self) -> None:
        """Bring the zones in line once Home Assistant has started (§4.11).

        Configured zones missing from the states are logged; they are
        skipped until they appear. Away whose return time passed while Home
        Assistant was down switches to work. Otherwise, in work or holiday,
        zones that are on get the current value and zones not available yet
        keep it as pending.
        """
        for zone_id in self.zone_ids:
            if self.hass.states.get(zone_id) is None:
                _LOGGER.warning(
                    "Zone %s not found; it will be skipped until it appears", zone_id
                )
        async with self._lock:
            if self._stopped:
                return
            if self._return_due():
                await self._async_apply_scenario(Scenario.WORK, None, "return")
                return
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
    def _on_started(self, _hass: HomeAssistant) -> None:
        """Start the startup work once Home Assistant has started."""
        self._unsub_started = None
        self._create_task(self._async_startup())

    @callback
    def _on_quarter(self, now: datetime) -> None:
        """Handle a quarter-hour tick (§4.4)."""
        self._create_task(self._async_quarter(dt_util.as_local(now)))

    @callback
    def _on_return(self, _now: datetime) -> None:
        """Switch to work when the away return time arrives (§4.7)."""
        self._unsub_return = None
        self._create_task(self._async_return())

    @callback
    def _on_zone_change(self, event: Event[EventStateChangedData]) -> None:
        """React to a zone switched on by hand or becoming available.

        "Switched on" compares the new mode with the last mode seen while
        the zone was available, so the Wall Display's short unavailable blip
        after each command is neither "switched on" nor "switched off", and
        a switch-on that reaches Home Assistant across a blip still counts.
        A zone becoming available (from missing, unavailable or unknown)
        gets its pending command.

        A switch between off and on is the engine's own when the zone shows
        the mode of a command sent to it shortly before (see _confirm_mode);
        any other is done by hand. A zone switched off by hand drops its
        pending command, so no retry switches it back on (§4.6). A zone that
        shows the mode of its pending command needs that mode no more: a call
        that failed or timed out may still have reached the thermostat.
        """
        new_state = event.data["new_state"]
        if not _is_available(new_state):
            return
        zone_id = event.data["entity_id"]
        last_mode = self._last_mode.get(zone_id)
        self._last_mode[zone_id] = new_state.state
        turned_on = last_mode == HVAC_OFF and new_state.state != HVAC_OFF
        turned_off = last_mode not in (None, HVAC_OFF) and new_state.state == HVAC_OFF
        became_available = not _is_available(event.data["old_state"])
        own = self._confirm_mode(zone_id, new_state.state)
        self._last_seen[zone_id] = dt_util.utcnow()
        by_hand = (turned_on or turned_off) and not own
        mode_call = self._mode_calls.get(zone_id)
        if mode_call is not None:
            if new_state.state == mode_call.mode:
                mode_call.reached = True
            elif by_hand:
                mode_call.by_hand = True
        pending = self._pending.get(zone_id)
        if turned_off and by_hand and pending is not None:
            # Dropped right away, before a queued tick or retry can resend it:
            # a pending heat or temperature is not for a zone that is off, and
            # a pending off is done.
            del self._pending[zone_id]
            _LOGGER.debug(
                "%s: switched off by hand, pending command dropped", zone_id
            )
        elif pending is not None and pending.hvac_mode == new_state.state:
            self._drop_pending_mode(zone_id)
            _LOGGER.debug(
                "%s: already %s, pending mode dropped", zone_id, new_state.state
            )
        if turned_on or became_available:
            self._create_task(
                self._async_zone_event(
                    zone_id, turned_on=turned_on, became_available=became_available
                )
            )

    @callback
    def _create_task(self, coro: Coroutine[Any, Any, None]) -> None:
        """Run engine work as a task that async_stop cancels."""
        if self._stopped:
            coro.close()
            return
        task = self.hass.async_create_task(coro, f"{DOMAIN} {self.entry_id}")
        if not task.done():
            self._tasks.add(task)
            task.add_done_callback(self._tasks.discard)

    def _confirm_mode(self, zone_id: str, mode: str) -> bool:
        """Return True if the zone showing a mode is the effect of a command.

        That is the case for a mode sent to the zone and not shown by it yet,
        when it was sent at most REPORT_WINDOW seconds ago or the zone has
        not been seen available since (a thermostat that was away shows its
        last command when it returns). The command is confirmed either way.
        """
        sent_at = self._unconfirmed.get(zone_id, {}).pop(mode, None)
        if sent_at is None:
            return False
        last_seen = self._last_seen.get(zone_id)
        return (
            last_seen is None
            or last_seen <= sent_at
            or (dt_util.utcnow() - sent_at).total_seconds() <= REPORT_WINDOW
        )

    def _drop_pending_mode(self, zone_id: str) -> None:
        """Forget the hvac mode of a zone's pending command, keep the rest."""
        pending = self._pending.get(zone_id)
        if pending is None:
            return
        if pending.temperature is None:
            del self._pending[zone_id]
        else:
            self._pending[zone_id] = replace(pending, hvac_mode=None)

    def _raise_if_stopped(self) -> None:
        """Refuse a public call once the engine is stopped (lock held)."""
        if self._stopped:
            raise HomeAssistantError(
                translation_domain=DOMAIN, translation_key="not_loaded"
            )

    async def _async_change_scenario(
        self, scenario: Scenario, return_at: datetime | None, reason: str
    ) -> None:
        """Apply an already validated scenario under the engine lock.

        Concurrent changes apply one after the other, so the zones end in the
        last scenario's state.
        """
        async with self._lock:
            self._raise_if_stopped()
            await self._async_apply_scenario(scenario, return_at, reason)

    async def _async_apply_scenario(
        self, scenario: Scenario, return_at: datetime | None, reason: str
    ) -> None:
        """Persist a scenario and apply it to every zone (lock held)."""
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

    async def _async_return(self) -> None:
        """Switch to work if the away return time is still due.

        A scenario change or a new return time that took the lock first
        wins over a stale return.
        """
        async with self._lock:
            if self._stopped:
                return
            if self._return_due():
                await self._async_apply_scenario(Scenario.WORK, None, "return")

    def _return_due(self) -> bool:
        """Return True when away has a return time that has arrived."""
        return_at = self.return_at
        return (
            self.scenario is Scenario.AWAY
            and return_at is not None
            and return_at <= dt_util.utcnow()
        )

    async def _async_quarter(self, local_now: datetime) -> None:
        """Send each zone its program step, then retry other pending commands.

        A step that falls while a zone is unavailable or missing is kept
        pending for when the zone returns.
        """
        async with self._lock:
            if self._stopped:
                return
            scenario = self.scenario
            stepped: set[str] = set()
            for zone_id in self.zone_ids:
                zone = self.zone_state(zone_id)
                week = self._week(zone_id, scenario)
                if zone.hvac_mode is None:
                    target = _step_value(week, local_now)
                else:
                    target = rules.tick_target(scenario, zone, week, local_now)
                if target is not None:
                    await self._send(
                        zone_id, hvac_mode=None, temperature=target, reason="step"
                    )
                    stepped.add(zone_id)
            for zone_id in self.zone_ids:
                if zone_id not in stepped:
                    await self._async_retry(zone_id)
        self._dispatch()

    async def _async_zone_event(
        self, zone_id: str, *, turned_on: bool, became_available: bool
    ) -> None:
        """Handle a zone switched on and/or becoming available.

        The switch-on value goes first, so it takes the place of a pending
        temperature; the retry then resends whatever is still pending.
        """
        async with self._lock:
            if self._stopped:
                return
            if turned_on:
                await self._async_send_turned_on_value(zone_id)
            if became_available:
                await self._async_retry(zone_id)

    async def _async_send_turned_on_value(self, zone_id: str) -> None:
        """Send the current value to a zone switched on by hand (lock held).

        In away or off the zone is left alone (§4.6). A zone that already
        holds the value is not sent it again: that is also the case when the
        engine itself turned the zone on, since its own set_temperature lands
        under the lock before this runs. A zone switched off again before
        this runs gets nothing.
        """
        zone = self.zone_state(zone_id)
        if zone.hvac_mode in (None, HVAC_OFF):
            # Switched off again (or gone) before this queued work ran.
            return
        scenario = self.scenario
        target = rules.zone_turned_on_target(
            scenario, self._week(zone_id, scenario), dt_util.now()
        )
        if target is None:
            return
        current = zone.target
        if current is not None and abs(round_half(current) - target) <= TEMP_TOLERANCE:
            _LOGGER.debug("%s: turned on, already at %s", zone_id, target)
            pending = self._pending.get(zone_id)
            if pending is not None and pending.hvac_mode is None:
                # The zone holds the program value: nothing is left to resend.
                del self._pending[zone_id]
            return
        await self._send(zone_id, hvac_mode=None, temperature=target, reason="zone_on")

    async def _async_retry(self, zone_id: str) -> None:
        """Resend a zone's pending command if the zone is available (lock held).

        A pending hvac mode belongs to the current scenario and is always
        resent. A temperature-only command is resent only while the scenario
        has a program and the zone is on; otherwise it is dropped.
        """
        pending = self._pending.get(zone_id)
        zone = self.zone_state(zone_id)
        if pending is None or zone.hvac_mode is None:
            return
        if pending.hvac_mode is None and (
            self.scenario not in PROGRAM_SCENARIOS or zone.hvac_mode == HVAC_OFF
        ):
            del self._pending[zone_id]
            _LOGGER.debug(
                "%s: zone is off, pending temperature %s dropped",
                zone_id,
                pending.temperature,
            )
            return
        await self._send(
            zone_id,
            hvac_mode=pending.hvac_mode,
            temperature=pending.temperature,
            reason="retry",
        )

    async def _async_save_day(
        self, zone_id: str, scenario: Scenario, weekday: str, values: list[float]
    ) -> None:
        """Validate, persist and apply one program day (lock held).

        The update is dispatched as soon as the day is persisted. When the
        save changes the current value of the active program, a pending
        temperature of the zone takes the new value, and a zone that is on
        is sent it now.
        """
        scenario = self._program_scenario(zone_id, scenario)
        _check_weekday(weekday)
        min_temp, max_temp = self.min_max(zone_id)
        _check_range(values, min_temp, max_temp)
        day = normalize_day(values, min_temp, max_temp)
        old_week = self.store.get_week(zone_id, scenario)
        self.store.set_day(zone_id, scenario, weekday, day)
        await self.store.async_save()
        self._dispatch()
        new_week = self.store.get_week(zone_id, scenario)
        local_now = dt_util.now()
        if scenario is self.scenario:
            self._refresh_pending_temperature(zone_id, old_week, new_week, local_now)
        target = rules.save_target(
            self.scenario,
            scenario,
            self.zone_state(zone_id),
            old_week,
            new_week,
            local_now,
        )
        if target is not None:
            await self._send(zone_id, hvac_mode=None, temperature=target, reason="save")

    def _refresh_pending_temperature(
        self, zone_id: str, old_week: Week, new_week: Week, local_now: datetime
    ) -> None:
        """Give a pending temperature the new current value of a saved week."""
        pending = self._pending.get(zone_id)
        if pending is None or pending.temperature is None:
            return
        weekday, slot = weekday_key(local_now), slot_index(local_now)
        new_value = new_week[weekday][slot]
        if abs(new_value - old_week[weekday][slot]) > TEMP_TOLERANCE:
            self._pending[zone_id] = replace(pending, temperature=new_value)

    def _program_scenario(self, zone_id: str, scenario: Scenario | str) -> Scenario:
        """Return the scenario of a zone program; raise ValueError if invalid."""
        if zone_id not in self.zone_ids:
            raise ValueError(f"Unknown zone {zone_id!r}")
        scenario = Scenario(scenario)
        if scenario not in PROGRAM_SCENARIOS:
            raise ValueError(f"Scenario {scenario!s} has no program")
        return scenario

    def _week(self, zone_id: str, scenario: Scenario) -> Week | None:
        """Return the zone's week for a program scenario, else None."""
        if scenario not in PROGRAM_SCENARIOS:
            return None
        return self.store.get_week(zone_id, scenario)

    def _arm_return_timer(self) -> None:
        """Arm the return timer when away with a return time, else cancel it."""
        self._cancel_return_timer()
        if self._stopped:
            return
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

        Parts that cannot be delivered (zone unavailable, unknown or missing
        right before the call, a failed or timed out call) become the zone's
        pending command; parts delivered now drop out of it. The temperature
        is not sent while the hvac mode is undelivered.

        A zone switched on or off by hand while the mode call is in flight
        is left as the hand left it: the temperature is not sent and nothing
        of this command stays pending (§4.6). Otherwise a mode call that
        fails or times out did land if the zone shows the mode now, or
        reached it during the call and has shown no other mode since (the
        Wall Display's blip right after a command must not hide it). Anything
        else, such as a zone that is away or the late report of an earlier
        command, leaves the mode pending.
        """
        mode_left, temperature_left = hvac_mode, temperature
        if mode_left is not None:
            mode_call = self._mode_calls[zone_id] = _ModeCall(mode_left)
            try:
                delivered = await self._call(
                    zone_id, SERVICE_SET_HVAC_MODE, ATTR_HVAC_MODE, mode_left, reason
                )
            finally:
                self._mode_calls.pop(zone_id, None)
            if mode_call.by_hand:
                _LOGGER.info(
                    "%s: switched by hand during set hvac_mode %s, left alone (%s)",
                    zone_id,
                    mode_left,
                    reason,
                )
                self._pending.pop(zone_id, None)
                return
            if (
                delivered
                or self.zone_state(zone_id).hvac_mode == mode_left
                or (mode_call.reached and self._last_mode.get(zone_id) == mode_left)
            ):
                mode_left = None
        if (
            mode_left is None
            and temperature_left is not None
            and await self._call(
                zone_id,
                SERVICE_SET_TEMPERATURE,
                ATTR_TEMPERATURE,
                temperature_left,
                reason,
            )
        ):
            temperature_left = None
        old = self._pending.pop(zone_id, PendingCommand(None, None))
        pending = PendingCommand(
            mode_left if hvac_mode is not None else old.hvac_mode,
            temperature_left if temperature is not None else old.temperature,
        )
        if pending != PendingCommand(None, None):
            self._pending[zone_id] = pending

    async def _call(
        self, zone_id: str, service: str, attribute: str, value: Any, reason: str
    ) -> bool:
        """Call a climate service on one zone; return True if it was delivered.

        Availability is checked right before the call: Home Assistant skips
        unavailable entities without raising, so a call made during the Wall
        Display's blip would be lost silently. Any error of one zone's call
        leaves the part undelivered, so the other zones are still served.
        Once the engine is stopped nothing is sent.
        """
        if self._stopped:
            _LOGGER.debug(
                "%s: engine stopped, set %s %s not sent (%s)",
                zone_id,
                attribute,
                value,
                reason,
            )
            return False
        if self.zone_state(zone_id).hvac_mode is None:
            _LOGGER.debug(
                "%s: unavailable, set %s %s kept pending (%s)",
                zone_id,
                attribute,
                value,
                reason,
            )
            return False
        if service == SERVICE_SET_HVAC_MODE and self._last_mode.get(zone_id) != value:
            # The zone is about to change mode because of this command.
            self._unconfirmed.setdefault(zone_id, {})[value] = dt_util.utcnow()
        try:
            async with asyncio.timeout(CALL_TIMEOUT):
                await self.hass.services.async_call(
                    CLIMATE_DOMAIN,
                    service,
                    {ATTR_ENTITY_ID: zone_id, attribute: value},
                    blocking=True,
                )
        except TimeoutError:
            _LOGGER.warning(
                "%s: set %s %s timed out (%s)", zone_id, attribute, value, reason
            )
            return False
        except HomeAssistantError as err:
            _LOGGER.warning(
                "%s: set %s %s failed (%s): %s", zone_id, attribute, value, reason, err
            )
            return False
        except Exception:
            _LOGGER.exception(
                "%s: set %s %s failed (%s)", zone_id, attribute, value, reason
            )
            return False
        _LOGGER.info("%s: set %s %s (%s)", zone_id, attribute, value, reason)
        return True
