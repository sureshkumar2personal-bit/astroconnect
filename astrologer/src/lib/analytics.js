// Analytics calculations (spec 13_ANALYTICS_AND_PERFORMANCE.md, AD-145 – AD-147), following the
// reference "AstroConnect · Astrologer Analytics". Records come from each module's own state
// (AD-147); this file only buckets and compares them. Calendar days are local (IST) days.
import { TODAY, applyDeadline } from '@/lib/textQuestions.js';

export const DAY = 864e5;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EPOCH = Date.UTC(2026, 0, 1);

/** Day index (days since 1 Jan 2026) of a local date / ISO string. */
export function dayOf(v) {
  const d = v instanceof Date ? v : new Date(v);
  return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - EPOCH) / DAY);
}
export const TODAY_DAY = dayOf(TODAY);
export const dateOf = (i) => new Date(EPOCH + i * DAY);
export const dl = (i) => { const d = dateOf(i); return d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; };
export const wd = (i) => WD[dateOf(i).getUTCDay()];
export const isoOf = (i) => dateOf(i).toISOString().slice(0, 10);
export const fromIso = (s) => { const t = Date.parse(s + 'T00:00:00Z'); return Number.isNaN(t) ? null : Math.round((t - EPOCH) / DAY); };
export const hh = (h) => String(h).padStart(2, '0') + ':00';
export const hm = (h, m) => String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');

export const n = (x) => Math.round(x).toLocaleString('en-IN');
export const r = (x) => '₹' + Math.round(x).toLocaleString('en-IN');
export const rk = (x) => '₹' + (x / 1000).toFixed(1) + 'k';
export const pct = (a, b) => (b ? (a / b * 100).toFixed(1) + '%' : '—');

/** Previous-period change chip (AD-146). invert: a fall is good (pending, cancelled, missed…). */
export function chg(cur, prev, invert, fmt = n) {
  if (prev == null) return { txt: 'No prior data', cls: 'chg na', calc: 'No earlier data for an equal-length comparison period.' };
  if (prev === 0) return cur === 0 ? { txt: '0%', cls: 'chg flat', calc: 'No change (0 → 0).' } : { txt: 'New', cls: 'chg na', calc: 'Previous period was 0, so a percentage is not meaningful.' };
  const p = (cur - prev) / prev * 100; const a = Math.abs(p);
  const rr = a < 10 ? a.toFixed(1) : String(Math.round(a));
  if (Number(rr) === 0) return { txt: '0%', cls: 'chg flat', calc: '(' + fmt(cur) + ' − ' + fmt(prev) + ') ÷ ' + fmt(prev) + ' × 100 = 0%' };
  const good = invert ? p < 0 : p > 0;
  return {
    txt: (p > 0 ? '↑ +' : '↓ −') + rr + '%',
    cls: 'chg ' + (good ? 'good' : 'bad'),
    calc: '(' + fmt(cur) + ' − ' + fmt(prev) + ') ÷ ' + fmt(prev) + ' × 100 = ' + (p > 0 ? '+' : '−') + rr + '%',
  };
}
export const HIDDEN_CHG = { txt: '', cls: 'chg hidden', calc: '' };

/** Tooltip row. c: swatch colour (none → no swatch). cls: 'strong', 'sep'… */
export const row = (k, v, c, cls) => ({ k, v, c: c || 'transparent', cls: 'tip-r' + (c ? '' : ' nosw') + (cls ? ' ' + cls : '') });
/** Tooltip horizontal position for an x in % of the plot: beside the point near the edges, centred in the middle
 *  third so it never runs off a narrow (tablet / phone) chart. */
export const tp = (x) => (x < 35 ? { left: `calc(${x.toFixed(2)}% + 14px)` }
  : x > 65 ? { right: `calc(${(100 - x).toFixed(2)}% + 14px)` }
    : { left: `${x.toFixed(2)}%`, transform: 'translateX(-50%)' });

export function niceMax(v) {
  if (v <= 4) return 4;
  if (v <= 10) return Math.ceil(v / 2) * 2;
  const m = 10 ** Math.floor(Math.log10(v));
  for (const k of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (k * m >= v) return k * m;
  return 10 * m;
}

/** Monotone cubic path through points (no overshoot). */
export function mono(P) {
  const len = P.length; if (!len) return ''; const f = (v) => v.toFixed(1);
  if (len === 1) return `M${f(P[0][0] - 1)},${f(P[0][1])} L${f(P[0][0] + 1)},${f(P[0][1])}`;
  const dx = [], m = [];
  for (let i = 0; i < len - 1; i++) { dx[i] = P[i + 1][0] - P[i][0]; m[i] = (P[i + 1][1] - P[i][1]) / dx[i]; }
  const t = [m[0]];
  for (let i = 1; i < len - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  t[len - 1] = m[len - 2];
  for (let i = 0; i < len - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
    const a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
  }
  let d = `M${f(P[0][0])},${f(P[0][1])}`;
  for (let i = 0; i < len - 1; i++) {
    d += ` C${f(P[i][0] + dx[i] / 3)},${f(P[i][1] + t[i] * dx[i] / 3)} ${f(P[i + 1][0] - dx[i] / 3)},${f(P[i + 1][1] - t[i + 1] * dx[i] / 3)} ${f(P[i + 1][0])},${f(P[i + 1][1])}`;
  }
  return d;
}

/**
 * Period model (AD-146): Daily (today, 24 hours), Weekly (last 7 days), Monthly (last 4 weeks) or a
 * custom range, always compared with the previous period of the same length.
 * fine = points for line charts; coarse = bars (days, or weeks for ranges over 14 days).
 */
export function period(per, cStart, cEnd) {
  let s, e, err = null;
  const T = TODAY_DAY;
  if (per === 'daily') { s = e = T; }
  else if (per === 'weekly') { s = T - 6; e = T; }
  else if (per === 'monthly') { s = T - 27; e = T; }
  else {
    let a = fromIso(cStart), b = fromIso(cEnd);
    if (a == null || b == null) { a = T - 13; b = T; err = 'Pick both a start and an end date.'; }
    if (a > b) { const x = a; a = b; b = x; err = 'Start was after end, so the dates were swapped.'; }
    if (b > T) { err = 'Dates after today have no data yet, so the range was clamped.'; }
    s = Math.min(a, T); e = Math.min(b, T);
  }
  const len = e - s + 1;
  const mkB = (d0, d1, h, label, long) => ({ d0, d1, h, label, long });
  const hours = (d) => Array.from({ length: 24 }, (_, h) => mkB(d, d, h, String(h).padStart(2, '0'), dl(d) + ', ' + hh(h) + '–' + hh((h + 1) % 24)));
  const days = (a, b) => { const o = []; for (let d = a; d <= b; d++) o.push(mkB(d, d, null, len <= 7 ? wd(d) + ' ' + dateOf(d).getUTCDate() : dl(d), wd(d) + ', ' + dl(d) + ' ' + dateOf(d).getUTCFullYear())); return o; };
  const weeks = (a, b) => { const o = []; for (let d = a; d <= b; d += 7) { const z = Math.min(b, d + 6); o.push(mkB(d, z, null, dl(d), dl(d) + ' – ' + dl(z))); } return o; };
  const daily = per === 'daily';
  const rl = (a, b) => (a === b ? wd(a) + ', ' + dl(a) + ' ' + dateOf(a).getUTCFullYear() : dl(a) + ' – ' + dl(b) + ' ' + dateOf(b).getUTCFullYear());
  return {
    per, s, e, len, err,
    fine: daily ? hours(s) : days(s, e),
    coarse: daily ? hours(s) : (len <= 14 ? days(s, e) : weeks(s, e)),
    fineP: daily ? hours(s - 1) : days(s - len, e - len),
    coarseP: daily ? hours(s - 1) : (len <= 14 ? days(s - len, e - len) : weeks(s - len, e - len)),
    tot: { d0: s, d1: e, h: null },
    totP: { d0: s - len, d1: e - len, h: null },
    label: rl(s, e),
    prevLabel: rl(s - len, e - len),
    unit: daily ? 'hour' : (len <= 14 ? 'day' : 'week'),
    word: { daily: 'today', weekly: 'this week', monthly: 'over the last 4 weeks', custom: 'in the selected range' }[per],
  };
}

/** Records (with day/hour) inside a bucket. */
export const inB = (list, b) => list.filter((x) => x.day >= b.d0 && x.day <= b.d1 && (b.h == null || x.hour === b.h));

const stamp = (iso) => { const d = new Date(iso); return { day: dayOf(d), hour: d.getHours(), min: d.getMinutes() }; };
const minsOf = (dur) => { const m = /(\d+)m\s*(\d+)?s?/.exec(dur || ''); return m ? Math.round(+m[1] + (+(m[2] || 0)) / 60) : 0; };

/**
 * Normalise each module's records once (AD-147: one record per event, statuses never conflated).
 * Text Questions: answered = has an answer (Answered and Completed are one status, AD-145);
 * pending = still open; expired = deadline passed unanswered.
 * Appointments: by appointment date (the module keeps no separate booking date).
 * Instant Call & Chat: one record per history entry; Declined / Missed (no response) are not accepted.
 */
export function buildRecords({ questions, apts, hist, past, posts, tx }) {
  const Q = questions.map(applyDeadline).map((q) => ({
    ...stamp(q.recv), id: q.id, user: q.name, topic: q.type, price: q.paid || 0,
    status: q.answeredAt ? 'answered' : q.status === 'Expired' ? 'expired' : 'pending',
  }));
  const A = apts.map((a) => ({
    ...stamp(a.at), id: a.id, client: a.user, dur: a.dur, fee: a.amt, at: a.at,
    // Confirmed / Under Review slots stay "Upcoming" until they happen.
    status: a.status === 'Completed' ? 'completed' : /Missed|No-show/.test(a.status) ? 'missed' : /Cancel/.test(a.status) ? 'cancelled' : 'upcoming',
  }));
  const I = hist.map((h) => {
    const out = h.status === 'Declined' ? 'declined' : h.status === 'Missed' ? 'noresp' : 'accepted';
    const mins = out === 'accepted' ? minsOf(h.dur) : 0;
    return { ...stamp(h.at), id: h.id, client: h.user, svc: h.svc === 'Instant Call' ? 'call' : 'chat', out, done: out === 'accepted' && mins > 0, mins, gross: h.amt || 0 };
  });
  const L = past.map((p) => ({ ...stamp(p.date), id: p.id, title: p.topic, participants: p.parts || 0, comments: p.comments || 0, peak: p.peak || 0, durMin: parseInt(p.dur, 10) || 0, date: p.date }));
  const POSTS = posts.filter((p) => p.st === 'Published').map((p) => ({ ...stamp(p.at), id: p.id, title: p.title, kind: p.kind, aud: p.aud.split(',').map((x) => x.trim()), views: p.views || 0, likes: p.likes || 0, comments: p.comments || 0 }));
  const SVC = { 'Text Question': 'tq', Appointment: 'ap', 'Instant Call': 'call', 'Instant Chat': 'chat' };
  const E = tx.filter((t) => SVC[t.svc] && t.g > 0).map((t) => ({ ...stamp(t.at), id: t.id, svc: SVC[t.svc], who: t.user, what: t.ref, amt: t.g }));
  return { Q, A, I, L, POSTS, E };
}
