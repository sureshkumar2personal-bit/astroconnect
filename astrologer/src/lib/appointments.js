// Appointments helpers (spec 05_APPOINTMENTS.md, AD-88 – AD-102) for the screens built from the reference
// "AstroConnect – Astrologer Appointments": dates/times, status styling, the join window, availability per date,
// free slots and the summary figures. "Now" is the app's fixed today (lib/textQuestions.js TODAY).
import { TODAY } from '@/lib/textQuestions.js';

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WD_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // settings.week keys (Monday first)
const pad = (n) => String(n).padStart(2, '0');

export const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const dOf = (iso) => new Date(`${iso}T00:00`);
export const addDays = (iso, n) => { const d = dOf(iso); d.setDate(d.getDate() + n); return isoOf(d); };
export const TODAY_ISO = isoOf(TODAY);
export const NOW_MIN = TODAY.getHours() * 60 + TODAY.getMinutes();
export const wdOf = (iso) => dOf(iso).getDay();
export const wdShort = (iso) => WD[wdOf(iso)];
export const wdFull = (iso) => WD_FULL[wdOf(iso)];
export const dayKey = (iso) => DAY_KEYS[(wdOf(iso) + 6) % 7];
export const monthLabel = (iso) => MON[dOf(iso).getMonth()];
export const isPast = (iso) => iso < TODAY_ISO;

export const dateOfA = (a) => a.at.slice(0, 10);
export const startOf = (a) => { const d = new Date(a.at); return d.getHours() * 60 + d.getMinutes(); };
/** Minutes since "now" (negative = in the past). */
export const minsFromNow = (a) => (new Date(a.at) - TODAY) / 6e4;
export const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
export const hm24 = (min) => `${pad(Math.floor(min / 60) % 24)}:${pad(min % 60)}`;
export const hm12 = (min) => { const h = Math.floor(min / 60) % 24; return `${pad(h % 12 || 12)}:${pad(min % 60)} ${h >= 12 ? 'PM' : 'AM'}`; };
export const fmtD = (iso) => { const d = dOf(iso); return `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`; };
export const fmtDW = (iso) => `${wdShort(iso)}, ${fmtD(iso)}`;
export const fmtDShort = (iso) => { const d = dOf(iso); return `${d.getDate()} ${MON[d.getMonth()]}`; };
/** "27 Nov 2026, 10:55 AM IST" for a Date / timestamp. */
export const fmtStamp = (t) => { const d = new Date(t); return `${fmtD(isoOf(d))}, ${hm12(d.getHours() * 60 + d.getMinutes())} IST`; };
export const whenShort = (a) => `${fmtD(dateOfA(a))}, ${hm12(startOf(a))}`;
export const whenLong = (a) => `${fmtDW(dateOfA(a))}, ${hm12(startOf(a))} – ${hm12(startOf(a) + a.dur)} IST`;
export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
export const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
export const firstName = (name) => name.split(/\s+/)[0];

/** Badge / event / dot classes per status (the app's statuses, incl. Missed / No-show). */
export const STATUS = {
  Confirmed: { label: 'Confirmed', b: 'b-conf', e: 'e-conf', d: 'd-conf', order: 0 },
  'Under Review': { label: 'Under review', b: 'b-rev', e: 'e-rev', d: 'd-rev', order: 1 },
  Completed: { label: 'Completed', b: 'b-done', e: 'e-done', d: 'd-done', order: 2 },
  Cancelled: { label: 'Cancelled', b: 'b-cx', e: 'e-cx', d: 'd-cx', order: 3 },
  'Missed / No-show': { label: 'Missed / No-show', b: 'b-ns', e: 'e-ns', d: 'd-ns', order: 4 },
};
export const stOf = (a) => STATUS[a.status] || STATUS.Confirmed;
export const isOpenStatus = (a) => a.status === 'Confirmed' || a.status === 'Under Review';
export const payCls = (pay = '') => (/refund/i.test(pay) ? 'pay-ref' : /held|offered/i.test(pay) ? 'pay-held' : 'pay-ok');
export const inCall = (a) => !!a.callStart && !a.callEnd;

/** Who cancelled, and why, from the stored fields. */
export function cancelInfo(a) {
  const raw = a.cancelBy || '';
  const by = /^user/i.test(raw) ? 'client' : 'you';
  const m = /\(([^)]+)\)/.exec(raw) || /—\s*(.+)$/.exec(raw);
  return { by, at: a.cancelAt ? fmtStamp(a.cancelAt) : '', reason: a.cancelReason || (m ? m[1] : raw || '—'), note: a.cancelNote || '' };
}

/**
 * Join button state (AD-96: join from 5 minutes before the start until the end of the 5-minute grace period).
 * Under Review can still be joined (AD-89 — it only means the astrologer has opened the booking).
 */
export function joinState(a) {
  const startLbl = (min) => hm12(min);
  const s = startOf(a), day = dateOfA(a), m = minsFromNow(a);
  if (a.status === 'Cancelled') return { on: false, label: 'Join call', hint: 'Cancelled appointments can’t be joined.' };
  if (a.status === 'Missed / No-show') return { on: false, label: 'Join call', hint: a.noShow || 'This appointment was missed.' };
  if (a.status === 'Completed') return { on: false, label: 'Call ended', hint: 'This consultation has been completed.' };
  if (inCall(a)) return { on: false, label: 'In call', hint: 'Call in progress. Use the call panel.' };
  if (a.callEnd) return { on: false, label: 'Call ended', hint: 'Share the post-call attachment below to complete this appointment.' };
  if (m > 5) {
    const opens = s - 5;
    return { on: false, label: 'Join call', hint: day === TODAY_ISO ? `Join opens 5 min before: today at ${startLbl(opens)} IST.` : `Join opens 5 min before: ${fmtDW(day)} at ${startLbl(opens)} IST.` };
  }
  if (m > 0) return { on: true, live: true, label: 'Join call', hint: `Join is open · call starts at ${startLbl(s)} IST` };
  if (m >= -5) return { on: true, label: 'Join call', hint: `Grace period · join by ${startLbl(s + 5)} IST` };
  return { on: false, label: 'Join call', hint: `Join window closed at ${startLbl(s + 5)} IST (5-min grace period ended).` };
}
export const canCancel = (a) => isOpenStatus(a) && minsFromNow(a) > 0 && !inCall(a);

/** Hours for a date: weekly hours (AD-92), closed dates and single-date overrides (AD-92/93). */
export function dayHours(settings, iso) {
  if (settings.closed.includes(iso)) return { closed: true, ranges: [], note: 'Closed' };
  const override = settings.overrides.find((o) => o.date === iso) || null;
  // A custom-hours override replaces that date's weekly hours (the weekly schedule itself is unchanged).
  const src = override?.ranges?.length ? override.ranges : (settings.week[dayKey(iso)] || []);
  const ranges = src.map(([a, b]) => [toMin(a), toMin(b)]);
  return { closed: false, ranges, override };
}
const overlaps = (a0, a1, b0, b1) => a0 < b1 && b0 < a1;
/** Start minutes of bookable slots on a date (AD-90/93): every 15 min where the selected duration fits before a
 *  break, an existing booking (+ buffer) or the end of the range; past times are never offered. */
export function freeSlots(settings, list, iso) {
  const { closed, ranges } = dayHours(settings, iso);
  if (closed || iso < TODAY_ISO) return [];
  const dur = settings.dur, buf = settings.buffer;
  const breaks = settings.breaks.map(([a, b]) => [toMin(a), toMin(b)]);
  const booked = list.filter((a) => dateOfA(a) === iso && a.status !== 'Cancelled').map((a) => [startOf(a), startOf(a) + a.dur + buf]);
  const out = [];
  for (const [r0, r1] of ranges) {
    for (let t = r0; t + dur <= r1; t += 15) {
      if (iso === TODAY_ISO && t <= NOW_MIN) continue;
      if (breaks.some(([b0, b1]) => overlaps(t, t + dur, b0, b1))) continue;
      if (booked.some(([b0, b1]) => overlaps(t, t + dur + buf, b0, b1))) continue;
      out.push(t);
    }
  }
  return out;
}

/** Summary tiles (real data only; "Growth" compares with the previous month's bookings). */
export function summary(list) {
  const mKey = TODAY_ISO.slice(0, 7);
  const prev = new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, 1);
  const pKey = isoOf(prev).slice(0, 7);
  const inMonth = list.filter((a) => a.at.startsWith(mKey));
  const prevCount = list.filter((a) => a.at.startsWith(pKey)).length;
  const today = list.filter((a) => dateOfA(a) === TODAY_ISO);
  const ahead = today.filter((a) => minsFromNow(a) > 0 && a.status !== 'Cancelled').length;
  const upcoming = list.filter((a) => minsFromNow(a) > 0 && isOpenStatus(a));
  const growth = prevCount ? (inMonth.length - prevCount) / prevCount * 100 : null;
  const mon = MON[TODAY.getMonth()], pmon = MON[prev.getMonth()];
  return [
    { label: `Total · ${MON_FULL[TODAY.getMonth()]}`, value: inMonth.length, sub: `${inMonth.filter((a) => a.status === 'Completed').length} completed so far`, color: 'var(--a-ink)' },
    { label: 'Today', value: today.length, sub: `${today.filter((a) => a.status === 'Completed').length} done · ${ahead} still ahead`, color: 'var(--a-tl)' },
    { label: 'Upcoming', value: upcoming.length, sub: `${upcoming.filter((a) => a.status === 'Under Review').length} under review`, color: 'var(--a-grb)' },
    { label: `Cancelled · ${MON_FULL[TODAY.getMonth()]}`, value: inMonth.filter((a) => a.status === 'Cancelled').length, sub: 'Kept in history', color: 'var(--a-rdb)' },
    growth == null
      ? { label: `Growth vs ${pmon}`, value: '—', sub: `No prior data for ${pmon}`, color: 'var(--a-gd)' }
      : { label: `Growth vs ${pmon}`, value: `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`, sub: `${inMonth.length} vs ${prevCount} bookings in ${pmon}`, color: 'var(--a-gd)', cls: growth >= 0 ? 'up' : 'dn', mon },
  ];
}
const MON_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Activity log, newest first: a starting entry from the stored status, then events recorded in this session. */
export function activityOf(a) {
  const base = [{ at: '—', text: `Booked by client · ${inr(a.amt)} ${/refund/i.test(a.pay || '') ? 'refunded' : 'paid'}` }];
  const logged = (a.log || []).some((l) => /^Placed under review/.test(l.text));
  if ((a.opened || a.status === 'Under Review') && !logged) base.push({ at: '—', text: 'Placed under review · booking details opened' });
  if (a.status === 'Completed' && !(a.log || []).length) base.push({ at: '—', text: `Consultation completed (${a.dur} min)` });
  if (a.status === 'Cancelled' && !a.cancelAt) { const c = cancelInfo(a); base.push({ at: '—', text: `Cancelled by ${c.by} · ${c.reason}` }); }
  if (a.status === 'Missed / No-show') base.push({ at: '—', text: a.noShow || 'Missed / No-show' });
  const real = (a.log || []).map((l) => ({ at: fmtStamp(l.at), text: l.text }));
  return [...real.reverse(), ...base.reverse()];
}

// ---------------------------------------------------------------------------------------------------------------
// Schedule versions (Calendar & Availability). A version's cfg is the editable schedule:
//   { week: { Mon: [['09:00','12:00'], …] … }, breaks: [{ name, from, to }], dur: 15|30 (one duration per schedule
//     period, AD-90), p15, p30, buffer: 5|10, ovs: [{ id, date, type: 'closed'|'custom', ranges, note }] }
// The live settings (read by the calendar, slots, Profile preview …) keep the app's existing shape.
const RANGE_RX = /(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i;
const to24 = (h, m, ap) => `${pad((Number(h) % 12) + (/pm/i.test(ap) ? 12 : 0))}:${m}`;
let ovSeq = 0;
export const newOvId = () => `ov${Date.now().toString(36)}${ovSeq++}`;

/** Live settings → editable cfg. Closed dates become "Closed" overrides; a note such as "4:00 PM – 7:00 PM" gives hours. */
export function cfgFromSettings(s) {
  const ovs = [
    ...s.closed.map((date) => ({ id: newOvId(), date, type: 'closed', ranges: [], note: (s.closedNotes || {})[date] || '' })),
    ...s.overrides.map((o) => {
      const m = RANGE_RX.exec(o.note || '');
      const ranges = o.ranges?.length ? o.ranges : m ? [[to24(m[1], m[2], m[3]), to24(m[4], m[5], m[6])]] : [];
      return { id: newOvId(), date: o.date, type: 'custom', ranges, note: o.ranges ? (o.note || '') : (m ? '' : o.note || '') };
    }),
  ].sort((a, b) => a.date.localeCompare(b.date));
  return {
    week: Object.fromEntries(DAY_KEYS.map((d) => [d, (s.week[d] || []).map((r) => [...r])])),
    breaks: s.breaks.map(([from, to], i) => ({ name: (s.breakNames || [])[i] || 'Break', from, to })),
    dur: s.dur, p15: s.p15, p30: s.p30, buffer: s.buffer, ovs,
  };
}
/** Editable cfg → live settings (same shape the rest of the app reads). */
export function settingsFromCfg(c) {
  return {
    dur: c.dur, p15: Number(c.p15), p30: Number(c.p30), buffer: c.buffer,
    week: Object.fromEntries(DAY_KEYS.map((d) => [d, c.week[d].map((r) => [...r])])),
    breaks: c.breaks.map((b) => [b.from, b.to]), breakNames: c.breaks.map((b) => b.name),
    closed: c.ovs.filter((o) => o.type === 'closed').map((o) => o.date),
    closedNotes: Object.fromEntries(c.ovs.filter((o) => o.type === 'closed' && o.note).map((o) => [o.date, o.note])),
    overrides: c.ovs.filter((o) => o.type === 'custom').map((o) => ({ date: o.date, note: o.note, ranges: o.ranges.map((r) => [...r]) })),
  };
}
export const cloneCfg = (c) => JSON.parse(JSON.stringify(c));
export const sameCfg = (a, b) => JSON.stringify(a) === JSON.stringify(b);
export const rangesText = (ranges) => ranges.map(([a, b]) => `${a}–${b}`).join(', ');
export const dayHoursTotal = (ranges) => ranges.reduce((s, [a, b]) => s + Math.max(0, toMin(b) - toMin(a)), 0) / 60;
export const badRange = (ranges, i) => {
  const [a, b] = ranges[i]; if (toMin(b) <= toMin(a)) return true;
  return ranges.some(([c, d], j) => j !== i && toMin(a) < toMin(d) && toMin(c) < toMin(b));
};

/** Validation before saving / scheduling / publishing (messages from the reference). */
export function validateCfg(c) {
  for (const d of DAY_KEYS) {
    const r = c.week[d];
    if (r.some(([a, b]) => toMin(b) <= toMin(a))) return `${d}: each time range must end after it starts.`;
    if (r.some((_, i) => badRange(r, i))) return `${d}: time ranges overlap.`;
  }
  const bb = c.breaks.find((b) => toMin(b.to) <= toMin(b.from));
  if (bb) return `Break “${bb.name || 'Break'}” must end after it starts.`;
  if (!(Number(c.p15) > 0) || !(Number(c.p30) > 0)) return 'Prices must be greater than ₹0.';
  return '';
}

/**
 * Existing Confirmed / Under Review bookings in the future that a version would leave outside its availability.
 * Bookings on a date this version newly closes (compared with the live schedule's closed dates) are listed separately: closing a date offers each client a reschedule or a
 * full refund (AD-94), so they are not blocking conflicts.
 */
export function conflictsOf(c, list, liveClosed = []) {
  const s = settingsFromCfg(c);
  const out = [], closing = [];
  list.filter((a) => isOpenStatus(a) && minsFromNow(a) > 0).forEach((a) => {
    const iso = dateOfA(a), st = startOf(a), en = st + a.dur;
    if (s.closed.includes(iso)) { if (!liveClosed.includes(iso)) closing.push(a); return; } // only dates this version newly closes
    const ov = c.ovs.find((o) => o.date === iso && o.type === 'custom');
    const ranges = (ov ? ov.ranges : c.week[dayKey(iso)]).map(([x, y]) => [toMin(x), toMin(y)]);
    let reason = '';
    if (!ranges.length) reason = `${wdFull(iso)} is unavailable in this version`;
    else if (!ranges.some(([x, y]) => st >= x && en <= y)) reason = `Outside ${ov ? 'override' : wdFull(iso)} hours (${rangesText((ov ? ov.ranges : c.week[dayKey(iso)]))})`;
    else { const b = c.breaks.find((k) => st < toMin(k.to) && toMin(k.from) < en); if (b) reason = `Overlaps break “${b.name || 'Break'}” (${b.from}–${b.to})`; }
    if (reason) out.push({ a, reason });
  });
  return { conflicts: out, closing };
}
/** "Keep these bookings": custom-hours overrides that cover each conflicting booking (weekly hours unchanged). */
export function protectCfg(c, conflicts) {
  const n = cloneCfg(c);
  conflicts.forEach(({ a }) => {
    const iso = dateOfA(a), st = startOf(a), en = st + a.dur;
    let ov = n.ovs.find((o) => o.date === iso);
    const base = ov && ov.type === 'custom' ? ov.ranges : n.week[dayKey(iso)];
    const ranges = [...base.map((r) => [...r]), [hm24(st), hm24(en)]].map(([x, y]) => [toMin(x), toMin(y)]).sort((p, q) => p[0] - q[0]);
    const merged = [];
    ranges.forEach(([x, y]) => { const l = merged[merged.length - 1]; if (l && x <= l[1]) l[1] = Math.max(l[1], y); else merged.push([x, y]); });
    const r = merged.map(([x, y]) => [hm24(x), hm24(y)]);
    if (ov) { ov.type = 'custom'; ov.ranges = r; } else n.ovs.push({ id: newOvId(), date: iso, type: 'custom', ranges: r, note: `Keeps ${a.id}` });
  });
  n.ovs.sort((p, q) => p.date.localeCompare(q.date));
  return n;
}
