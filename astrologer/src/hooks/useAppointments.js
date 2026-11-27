import { useCallback, useMemo, useState } from 'react';
import { appointments as seedAppointments, availabilitySettings } from '@/data/mockAppointments.js';
import { TODAY, dt } from '@/lib/textQuestions.js';

// Appointments state and rules (spec 05_APPOINTMENTS.md). Prototype only: everything
// lives in memory and resets on reload — nothing is sent to a server.

export const STATUS_KIND = {
  Confirmed: 'info',
  'Under Review': 'warn',
  Completed: 'ok',
  Cancelled: 'bad',
  'Missed / No-show': 'bad',
};
// Page subtitles from the reference (header on desktop, on the screen on mobile).
export const SUBTITLES = {
  list: 'Voice-only consultations · confirmed on payment, no approval step',
  detail: 'Voice-only appointment',
  calendar: 'Recurring weekly availability applies automatically for a rolling 90-day booking horizon',
};

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const ATTACHMENT_TYPES = ['Notes', 'Remedy', 'Recommendation', 'Report'];
export const JOIN_EARLY_MIN = 5; // AD-96
export const GRACE_MIN = 5; // AD-96

/** Local calendar date as YYYY-MM-DD (no UTC shift). */
export const isoDay = (d) => {
  const x = typeof d === 'string' ? dt(d) : d;
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};
export const sameDay = (a, b) => isoDay(a) === isoDay(b);
export const fmtTime = (d) => (typeof d === 'string' ? dt(d) : d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
export const isUpcoming = (a) => ['Confirmed', 'Under Review'].includes(a.status);

const TAB_TEST = {
  upcoming: isUpcoming,
  today: (a) => sameDay(a.at, TODAY),
  history: (a) => !isUpcoming(a),
};

/** Join opens 5 min before the start and closes after the 5-minute grace period (AD-96). */
export function joinWindow(a) {
  const start = +dt(a.at);
  return { opens: new Date(start - JOIN_EARLY_MIN * 6e4), canJoin: isUpcoming(a) && TODAY >= start - JOIN_EARLY_MIN * 6e4 && TODAY <= start + GRACE_MIN * 6e4 };
}

export default function useAppointments() {
  const [list, setList] = useState(seedAppointments);
  const [settings, setSettings] = useState(availabilitySettings);
  const [tab, setTab] = useState('upcoming');
  const [query, setQuery] = useState('');
  const [calView, setCalView] = useState('Weekly');

  const patch = useCallback((id, fn) => setList((l) => l.map((a) => (a.id === id ? { ...a, ...fn(a) } : a))), []);
  const set = useCallback((p) => setSettings((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) })), []);

  const byId = useCallback((id) => list.find((a) => a.id === id), [list]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list
      .filter(TAB_TEST[tab])
      .filter((a) => !q || (a.id + a.uid + a.user).toLowerCase().includes(q))
      .sort((a, b) => (tab === 'history' ? dt(b.at) - dt(a.at) : dt(a.at) - dt(b.at)));
  }, [list, tab, query]);

  const counts = useMemo(() => ({
    today: list.filter(TAB_TEST.today).length,
    upcoming: list.filter(isUpcoming).length,
  }), [list]);

  // Opening the booking details puts a Confirmed appointment Under Review (AD-89).
  const open = useCallback((id) => patch(id, (a) => (a.opened ? {} : { opened: true, status: a.status === 'Confirmed' ? 'Under Review' : a.status })), [patch]);

  const setNote = useCallback((id, pnotes) => patch(id, () => ({ pnotes })), [patch]);

  // Astrologer cancellation: no earnings; the user picks a reschedule or a full Wallet refund (AD-91, AD-98).
  const cancel = useCallback((id) => patch(id, () => ({
    status: 'Cancelled',
    cancelBy: 'Astrologer — user offered reschedule or full Wallet refund',
    pay: 'Refund / reschedule offered',
  })), [patch]);

  const addAttachment = useCallback((id, type, text) => patch(id, (a) => ({ att: [...a.att, { type, text }] })), [patch]);

  // Call workflow (prototype, in memory): Join → consultation → End Call → send attachment (+ remedy if needed) → Completed.
  // The call is a local session only; nothing is placed or sent to a server.
  const startCall = useCallback((id) => patch(id, () => ({ callStart: Date.now(), callEnd: null, callSecs: null })), [patch]);
  const endCall = useCallback((id) => patch(id, (a) => {
    const end = Date.now();
    return { callEnd: end, callSecs: Math.max(1, Math.round((end - (a.callStart || end)) / 1000)) };
  }), [patch]);
  /** After End Call: saves the attachment(s) and the optional remedy against this appointment, then marks it Completed. */
  const completeAppointment = useCallback((id, { attachments = [], remedy = '' }) => {
    attachments.forEach((x) => addAttachment(id, x.type, x.text));
    if (remedy.trim()) addAttachment(id, 'Remedy', remedy.trim());
    patch(id, () => ({ status: 'Completed' }));
  }, [addAttachment, patch]);

  const confirmedOn = useCallback((day) => list.filter((a) => isoDay(a.at) === day && isUpcoming(a)), [list]);

  // Closing a date offers each affected user a reschedule or full refund (AD-94).
  const closeDate = useCallback((day) => {
    set((s) => ({ closed: s.closed.includes(day) ? s.closed : [...s.closed, day] }));
    setList((l) => l.map((a) => (isoDay(a.at) === day && isUpcoming(a)
      ? { ...a, status: 'Cancelled', cancelBy: 'Date closed by astrologer — user offered reschedule or full Wallet refund', pay: 'Refund / reschedule offered' }
      : a)));
  }, [set]);

  return {
    list, visible, counts, settings, tab, setTab, query, setQuery, calView, setCalView,
    byId, open, setNote, cancel, addAttachment, startCall, endCall, completeAppointment, confirmedOn, closeDate,
    setDuration: (dur) => set({ dur }),
    setPrice: (key, value) => set({ [key]: value }),
    setBuffer: (buffer) => set({ buffer }),
    addBreak: (from, to) => set((s) => ({ breaks: [...s.breaks, [from, to]] })),
    removeBreak: (i) => set((s) => ({ breaks: s.breaks.filter((_, j) => j !== i) })),
    editDay: (day, ranges) => set((s) => ({ week: { ...s.week, [day]: ranges } })),
    addOverride: (date) => set((s) => ({ overrides: [...s.overrides, { date, note: 'Single-date override' }] })),
  };
}
