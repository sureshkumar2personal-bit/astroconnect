import { useMemo, useState } from 'react';

// Availability rules: AD-04 – AD-08 (docs/02-astrologer-app/01_HOME_SCREEN.md).
// mode: 'online' | 'offline' | null (null = DND just turned off, AD-08).
export default function useAvailability(answeredToday) {
  const [state, setState] = useState({ mode: 'online', call: true, chat: true, dnd: false, goal: 5 });

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
    }),
    []
  );

  const { mode, call, chat, dnd, goal } = state;
  const sub = (on) => (dnd ? 'Paused by DND' : mode !== 'online' && on ? 'Not available while offline' : '');
  const left = Math.max(0, goal - answeredToday);

  let note;
  if (dnd) note = 'DND is on: Text Questions, Appointments, Instant Call and Instant Chat are all stopped.';
  else if (mode === null) note = 'DND is off. Choose Online or Offline to resume.';
  else if (mode === 'offline')
    note = 'Offline: Text Questions and Appointments can still arrive. Instant Call and Chat cannot.';
  else note = 'DND stops all services. Offline still allows Text Questions and Appointments.';

  return {
    mode, call, chat, dnd, goal,
    callSub: sub(call),
    chatSub: sub(chat),
    note,
    pct: Math.min(100, Math.round((answeredToday / goal) * 100)),
    goalText:
      left > 0
        ? `${left} more answer${left === 1 ? '' : 's'} to reach today’s goal`
        : 'Today’s goal reached. Keep going!',
    ...actions,
  };
}
