import { useCallback, useMemo, useRef, useState } from 'react';
import { appointments as seedAppointments, availabilitySettings } from '@/data/mockAppointments.js';
import { TODAY, dt } from '@/lib/textQuestions.js';
import { cfgFromSettings, cloneCfg, conflictsOf, settingsFromCfg } from '@/lib/appointments.js';

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
// Event times (activity log, cancellation, sharing) on the app's clock: its fixed today plus the time since the page opened.
const LOADED = Date.now();
export const appNow = () => TODAY.getTime() + (Date.now() - LOADED);
// Schedule versions start from the current live settings as "v1 · Current hours" (no invented history).
const V1_CFG = cfgFromSettings(availabilitySettings);

const TAB_TEST = {
  upcoming: isUpcoming,
  today: (a) => sameDay(a.at, TODAY),
  history: (a) => !isUpcoming(a),
  completed: (a) => a.status === 'Completed',
  cancelled: (a) => a.status === 'Cancelled',
  all: () => true,
};

/** Join opens 5 min before the start and closes after the 5-minute grace period (AD-96). */
export function joinWindow(a) {
  const start = +dt(a.at);
  return { opens: new Date(start - JOIN_EARLY_MIN * 6e4), canJoin: isUpcoming(a) && TODAY >= start - JOIN_EARLY_MIN * 6e4 && TODAY <= start + GRACE_MIN * 6e4 };
}

export default function useAppointments() {
  const [list, setList] = useState(seedAppointments);
  const [settings, setSettings] = useState(() => settingsFromCfg(V1_CFG));
  const [versions, setVersions] = useState(() => [{ id: 'v1', num: 1, title: 'Current hours', status: 'published', cfg: cloneCfg(V1_CFG), publishedAt: null, publishAt: null, updatedAt: null, endedAt: null, failReason: '' }]);
  const [schedHistory, setSchedHistory] = useState([]); // { at, action, detail, cls }
  const versionsRef = useRef(versions); versionsRef.current = versions;
  const seqRef = useRef(1);
  const [tab, setTab] = useState('upcoming');
  const [query, setQuery] = useState('');
  const [calView, setCalView] = useState('Weekly');

  const patch = useCallback((id, fn) => setList((l) => l.map((a) => (a.id === id ? { ...a, ...fn(a) } : a))), []);
  /** Activity log entry for this session (shown newest first in the appointment's Activity). */
  const logged = (a, text) => ({ log: [...(a.log || []), { at: appNow(), text }] });
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
  const open = useCallback((id) => patch(id, (a) => (a.opened ? {} : { opened: true, status: a.status === 'Confirmed' ? 'Under Review' : a.status, ...(a.status === 'Confirmed' ? logged(a, 'Placed under review · booking details opened') : {}) })), [patch]);

  const setNote = useCallback((id, pnotes) => patch(id, () => ({ pnotes })), [patch]);

  // Astrologer cancellation: no earnings; the user picks a reschedule or a full Wallet refund (AD-91, AD-98).
  // reason / note (optional): chosen in the Cancel dialog and shown to the client.
  const cancel = useCallback((id, { reason = '', note = '' } = {}) => patch(id, (a) => ({
    status: 'Cancelled',
    cancelBy: 'Astrologer — user offered reschedule or full Wallet refund',
    pay: 'Refund / reschedule offered',
    cancelReason: reason, cancelNote: note, cancelAt: appNow(),
    ...logged(a, `Cancelled by you${reason ? ' · ' + reason : ''} · client offered reschedule or full Wallet refund`),
  })), [patch]);

  const addAttachment = useCallback((id, type, text) => patch(id, (a) => ({ att: [...a.att, { type, text }] })), [patch]);

  // Call workflow (prototype, in memory): Join → consultation → End Call → send attachment (+ remedy if needed) → Completed.
  // The call is a local session only; nothing is placed or sent to a server.
  const startCall = useCallback((id) => patch(id, (a) => ({ callStart: Date.now(), callEnd: null, callSecs: null, ...logged(a, 'You joined the call') })), [patch]);
  // usedMin / note (optional): what the call panel reports when the call ends.
  const endCall = useCallback((id, { usedMin, note } = {}) => patch(id, (a) => {
    const end = Date.now();
    const used = usedMin ?? Math.max(1, Math.round((end - (a.callStart || end)) / 60000));
    return { callEnd: end, callSecs: Math.max(1, Math.round((end - (a.callStart || end)) / 1000)), ...logged(a, note || `Call ended · ${used} of ${a.dur} min`) };
  }), [patch]);
  const logEvent = useCallback((id, text) => patch(id, (a) => logged(a, text)), [patch]);
  /**
   * Share post-consultation items ({ kind: text|pdf|link|image, title, meta }). After the call has ended this is the
   * post-call attachment, so the appointment becomes Completed (AD-89, AD-102).
   */
  const shareItems = useCallback((id, items) => patch(id, (a) => {
    const at = appNow();
    const att = [...a.att, ...items.map((x) => ({ type: x.title, text: x.meta, kind: x.kind, title: x.title, meta: x.meta, at }))];
    const done = a.callEnd && a.status !== 'Completed';
    return { att, ...(done ? { status: 'Completed' } : {}), log: [...(a.log || []), { at, text: `Shared ${items.length} post-consultation item${items.length > 1 ? 's' : ''}: ${items.map((x) => x.title).join(', ')}` }, ...(done ? [{ at, text: 'Consultation completed · post-call attachment sent' }] : [])] };
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

  // ---- Schedule versions (Calendar & Availability) ----
  const hist = (action, detail, cls) => setSchedHistory((h) => [{ at: appNow(), action, detail, cls }, ...h]);
  /** Save (create or update) a version; returns its id. */
  const upsert = (v, patchFields) => {
    const cur = versionsRef.current;
    const exists = v.id && cur.some((x) => x.id === v.id);
    const num = exists ? null : Math.max(0, ...cur.map((x) => x.num), seqRef.current) + 1;
    const id = exists ? v.id : `v${num}`;
    if (!exists) seqRef.current = num; // never reuse a version number, even after a delete
    setVersions((vs) => (exists
      ? vs.map((x) => (x.id === id ? { ...x, title: v.title, cfg: cloneCfg(v.cfg), updatedAt: appNow(), ...patchFields } : x))
      : [...vs, { id, num, title: v.title, cfg: cloneCfg(v.cfg), status: 'draft', publishedAt: null, publishAt: null, updatedAt: appNow(), endedAt: null, failReason: '', ...patchFields }]));
    return id;
  };
  const saveDraft = useCallback((v) => { const id = upsert(v, { status: 'draft', publishAt: null, failReason: '' }); hist('Saved as draft', `${v.title}`, 'h-draft'); return id; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  /** Publish: becomes the live schedule. Dates it closes that have bookings: each client is offered a reschedule or a full refund (AD-94). */
  const publishVersion = useCallback((v, auto = false) => {
    const { closing } = conflictsOf(v.cfg, list, settings.closed);
    const id = upsert(v, { status: 'published', publishedAt: appNow(), publishAt: null, failReason: '' });
    setVersions((vs) => vs.map((x) => (x.id !== id && x.status === 'published' ? { ...x, status: 'superseded', endedAt: appNow() } : x)));
    setSettings(settingsFromCfg(v.cfg));
    if (closing.length) {
      const days = new Set(closing.map((a) => isoDay(a.at)));
      setList((l) => l.map((a) => (days.has(isoDay(a.at)) && isUpcoming(a)
        ? { ...a, status: 'Cancelled', cancelBy: 'Date closed by astrologer — user offered reschedule or full Wallet refund', pay: 'Refund / reschedule offered', cancelAt: appNow() }
        : a)));
    }
    hist(auto ? 'Published automatically' : 'Published', `${v.title} is now the live schedule${closing.length ? ` · ${closing.length} booking(s) on closed dates offered reschedule or refund` : ''}`, 'h-pub');
    return id;
  }, [list, settings]); // eslint-disable-line react-hooks/exhaustive-deps
  const scheduleVersion = useCallback((v, at) => { const id = upsert(v, { status: 'scheduled', publishAt: at, failReason: '' }); hist('Publication scheduled', `${v.title}`, 'h-sched'); return id; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const unscheduleVersion = useCallback((id) => { setVersions((vs) => vs.map((x) => (x.id === id ? { ...x, status: 'draft', publishAt: null } : x))); hist('Scheduled publication cancelled', id, 'h-cx'); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const deleteVersion = useCallback((id) => { setVersions((vs) => vs.filter((x) => x.id !== id)); hist('Version deleted', id, 'h-cx'); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  /** Publish versions whose scheduled time has passed; a version with booking conflicts fails instead (live schedule unchanged). */
  const runScheduled = useCallback(() => {
    const due = versions.filter((x) => x.status === 'scheduled' && x.publishAt <= appNow());
    const results = [];
    due.forEach((x) => {
      const { conflicts } = conflictsOf(x.cfg, list);
      if (conflicts.length) {
        const c = conflicts[0];
        const reason = `Not published: ${c.a.id} (${c.a.user}) — ${c.reason}${conflicts.length > 1 ? ` (+${conflicts.length - 1} more)` : ''}.`;
        setVersions((vs) => vs.map((y) => (y.id === x.id ? { ...y, status: 'failed', failReason: reason } : y)));
        hist('Publication failed', `${x.id} · ${x.title} · booking conflict`, 'h-fail'); results.push({ id: x.id, ok: false });
      } else { publishVersion(x, true); results.push({ id: x.id, ok: true }); }
    });
    return results;
  }, [versions, list, publishVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    versions, schedHistory, saveDraft,
    nextVersionNum: () => Math.max(0, ...versionsRef.current.map((x) => x.num), seqRef.current) + 1, publishVersion, scheduleVersion, unscheduleVersion, deleteVersion, runScheduled,
    list, visible, counts, settings, tab, setTab, query, setQuery, calView, setCalView,
    byId, open, setNote, cancel, addAttachment, startCall, endCall, completeAppointment, confirmedOn, closeDate, shareItems, logEvent,
    setDuration: (dur) => set({ dur }),
    setPrice: (key, value) => set({ [key]: value }),
    setBuffer: (buffer) => set({ buffer }),
    addBreak: (from, to) => set((s) => ({ breaks: [...s.breaks, [from, to]] })),
    removeBreak: (i) => set((s) => ({ breaks: s.breaks.filter((_, j) => j !== i) })),
    editDay: (day, ranges) => set((s) => ({ week: { ...s.week, [day]: ranges } })),
    addOverride: (date) => set((s) => ({ overrides: [...s.overrides, { date, note: 'Single-date override' }] })),
  };
}
