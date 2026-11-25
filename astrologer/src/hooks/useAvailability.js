import { useEffect, useMemo, useState } from 'react';
import { isFreshLogin, loadAvailability, saveAvailability } from '@/lib/session.js';

// Availability rules: AD-04 – AD-09 (docs/02-astrologer-app/01_HOME_SCREEN.md), shared live by
// Home, Instant Call & Chat and Profile (App passes one instance to every page).
// mode: 'online' | 'offline' | null (null = DND just turned off, AD-08).
// pu: Planned Unavailability period { start, end } (YYYY-MM-DD) or null (AD-09).
// Daily Answer Goal default 10, as in the reference (tq.goal).
/** Confirmation shown after Instant Call / Instant Chat is switched; `on` is the new state. */
export const SERVICE_MESSAGES = {
  chat: {
    on: 'Instant Chat is now ON. You are available to receive chat requests.',
    off: 'Instant Chat is now OFF. You will not receive new chat requests.',
  },
  call: {
    on: 'Instant Call is now ON. You are available to receive call requests.',
    off: 'Instant Call is now OFF. You will not receive new call requests.',
  },
};
export const serviceMessage = (service, on) => SERVICE_MESSAGES[service][on ? 'on' : 'off'];

export default function useAvailability(answeredToday) {
  // Login (new tab or after Logout): Online, DND off, and Instant Call and Instant Chat OFF — the
  // astrologer switches each one on from the dashboard header when ready. Refresh in the same session:
  // everything as it was. Call and Chat are independent switches (AD-04 – AD-06); requests only arrive
  // for a service that is ON while Online and not on DND (availableFor in hooks/useCalls.js).
  const [state, setState] = useState(() => {
    const base = { mode: 'online', call: false, chat: false, dnd: false, goal: 10, pu: null };
    const saved = loadAvailability();
    if (!saved) return base;
    if (isFreshLogin) return { ...base, goal: saved.goal ?? 10, pu: saved.pu ?? null };
    return { ...base, ...saved };
  });
  // Saved on every change, so every page and a refresh see the same availability.
  useEffect(() => { saveAvailability(state); }, [state]);

  const actions = useMemo(
    () => ({
      setOnline: () => setState((s) => ({ ...s, mode: 'online' })),
      setOffline: () => setState((s) => ({ ...s, mode: 'offline' })),
      toggleCall: () => setState((s) => ({ ...s, call: !s.call })),
      toggleChat: () => setState((s) => ({ ...s, chat: !s.chat })),
      // Turning DND off does not make the astrologer Online (AD-08).
      toggleDnd: () =>
        setState((s) => (s.dnd ? { ...s, dnd: false, mode: null } : { ...s, dnd: true })),
      setGoal: (goal) => setState((s) => ({ ...s, goal: Number(goal) })),
      setPlanned: (pu) => setState((s) => ({ ...s, pu })),
    }),
    []
  );

  const { mode, call, chat, dnd, goal, pu } = state;
  const sub = (on) => (dnd ? 'Paused by DND' : mode !== 'online' && on ? 'Not available while offline' : '');
  const left = Math.max(0, goal - answeredToday);

  // Note wording from the reference Home (AD-07 – AD-09, AD-164).
  let note;
  if (dnd) note = 'DND is on: your whole profile is hidden and no new service can be booked or submitted. Confirmed appointments stay valid; submitted questions keep their 30-day deadlines.';
  else if (mode === null) note = 'DND is off. Choose Online or Offline to resume.';
  else if (mode === 'offline')
    note = 'Offline: Text Questions and Appointments can still arrive. Instant Call and Chat cannot.';
  else note = 'DND stops all new services. Offline still allows Text Questions and Appointments.';

  return {
    mode, call, chat, dnd, goal, pu,
    callSub: sub(call),
    chatSub: sub(chat),
    note,
    pct: Math.min(100, Math.round((answeredToday / goal) * 100)),
    goalText:
      left > 0
        ? `${left} more answer${left === 1 ? '' : 's'} to reach today’s goal`
        : 'Goal reached — no cap, keep going!',
    ...actions,
  };
}
