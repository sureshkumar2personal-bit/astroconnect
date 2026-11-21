import { useMemo, useState } from 'react';

// Availability rules: AD-04 – AD-09 (docs/02-astrologer-app/01_HOME_SCREEN.md), shared live by
// Home, Instant Call & Chat and Profile (App passes one instance to every page).
// mode: 'online' | 'offline' | null (null = DND just turned off, AD-08).
// pu: Planned Unavailability period { start, end } (YYYY-MM-DD) or null (AD-09).
// Daily Answer Goal default 10, as in the reference (tq.goal).
export default function useAvailability(answeredToday) {
  const [state, setState] = useState({ mode: 'online', call: true, chat: true, dnd: false, goal: 10, pu: null });

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
