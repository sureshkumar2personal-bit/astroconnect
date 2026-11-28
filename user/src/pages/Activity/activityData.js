// Sample (prototype) data and helpers for the Activity page. Records are illustrative; dates are shifted so "today" is the real current day.

const DAY_MS = 86400000;
const _now = new Date();
export const TODAY = _now.getFullYear() + "-" + String(_now.getMonth() + 1).padStart(2, "0") + "-" + String(_now.getDate()).padStart(2, "0");
const DELTA = Math.round((new Date(TODAY + "T00:00") - new Date("2026-11-27T00:00")) / DAY_MS);
const DATE_RE = /^(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2})?$/;
function shiftVal(v) {
  if (typeof v === "string") {
    const m = DATE_RE.exec(v);
    if (!m) return v;
    const d = new Date(m[1] + "T00:00"); d.setDate(d.getDate() + DELTA);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0") + (m[2] || "");
  }
  if (Array.isArray(v)) return v.map(shiftVal);
  if (v && typeof v === "object") { const o = {}; Object.keys(v).forEach((k) => { o[k] = shiftVal(v[k]); }); return o; }
  return v;
}
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export function pad(n) { return String(n).padStart(2, '0'); }
function dt(s) { return new Date(s.length === 10 ? s + 'T00:00' : s); }
function toKey(x) { return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate()); }
export function fDate(s) { const x = dt(s); return x.getDate() + ' ' + MON[x.getMonth()] + ' ' + x.getFullYear(); }
export function fShort(s) { const x = dt(s); return x.getDate() + ' ' + MON[x.getMonth()]; }
export function fTime(s) { const x = dt(s); let h = x.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + pad(x.getMinutes()) + ' ' + ap; }
export function fDT(s) { return fDate(s) + ', ' + fTime(s); }
export function fDow(s) { const x = dt(s); return DOW[x.getDay()] + ', ' + fDate(s); }
export function diff(a, b) { return Math.round((dt(a) - dt(b)) / 86400000); }
export function addDays(k, n) { const x = dt(k); x.setDate(x.getDate() + n); return toKey(x); }
export function weekOf(k) { const x = dt(k); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return toKey(x); }

/* Illustrative sample records only — replace with the User App's existing activity data. */
export const A = {
  raghav: { name: 'Pandit Raghav Iyer', init: 'RI' },
  meera: { name: 'Meera Subramanian', init: 'MS' },
  arvind: { name: 'Dr. Arvind Nair', init: 'AN' },
  lakshmi: { name: 'Lakshmi Venkat', init: 'LV' }
};
const _QUESTIONS = [
  { id: 'Q-10482', a: 'meera', qType: 'Career', submitted: '2026-11-27T10:15', answered: null },
  { id: 'Q-10457', a: 'raghav', qType: 'Marriage', submitted: '2026-11-25T18:40', answered: '2026-11-26T09:05' },
  { id: 'Q-10391', a: 'arvind', qType: 'Finance', submitted: '2026-11-13T20:10', answered: '2026-11-14T11:30' }
];
const _APPTS = [
  { id: 'BK-23071', a: 'raghav', when: '2026-11-29T11:00', dur: 30, amt: '₹1,200', status: 'Booked', at: '2026-11-26T12:10' },
  { id: 'BK-23044', a: 'meera', when: '2026-11-26T17:00', dur: 45, amt: '₹1,650', status: 'Completed', at: '2026-11-26T17:45' },
  { id: 'BK-23012', a: 'lakshmi', when: '2026-12-02T16:30', prev: '2026-11-28T16:30', dur: 30, amt: '₹900', status: 'Rescheduled', at: '2026-11-24T14:20' },
  { id: 'BK-22987', a: 'arvind', when: '2026-11-18T19:00', dur: 30, amt: '₹1,500', status: 'Cancelled', at: '2026-11-17T09:30' }
];
const _CALLS = [
  { id: 'CL-88410', a: 'lakshmi', at: '2026-11-27T08:20', dur: '14 min', amt: '₹420', rate: '₹30/min', status: 'Completed' },
  { id: 'CL-88391', a: 'arvind', at: '2026-11-23T21:45', dur: '', amt: '₹0', rate: '₹35/min', status: 'Not connected' },
  { id: 'CL-88302', a: 'raghav', at: '2026-11-12T19:05', dur: '22 min', amt: '₹770', rate: '₹35/min', status: 'Completed' }
];
const _CHATS = [
  { id: 'CH-55120', a: 'meera', at: '2026-11-26T22:30', dur: '18 min', amt: '₹360', rate: '₹20/min', status: 'Completed' },
  { id: 'CH-55087', a: 'lakshmi', at: '2026-11-21T13:15', dur: '9 min', amt: '₹180', rate: '₹20/min', status: 'Completed' },
  { id: 'CH-55001', a: 'arvind', at: '2026-11-10T20:00', dur: '', amt: '₹0', rate: '₹25/min', status: 'Not accepted' }
];
const _SUBS = [
  { id: 'SB-4021', a: 'raghav', plan: 'Monthly Guidance Plan', start: '2026-11-25', end: '2026-12-24', amt: '₹2,499', status: 'Active', at: '2026-11-25T11:00' },
  { id: 'SB-3890', a: 'meera', plan: 'Quarterly Plan', start: '2026-08-20', end: '2026-11-19', amt: '₹5,999', status: 'Expired', at: '2026-11-19T23:59' }
];
const _REMEDIES = [
  { id: 'RM-701', a: 'raghav', name: 'Recite Hanuman Chalisa', instr: 'Recite once every morning after your bath, facing east.', freq: 'Daily', start: '2026-11-15', due: '2026-12-05', target: 21, assigned: '2026-11-15T18:30', from: '' },
  { id: 'RM-702', a: 'meera', name: 'Offer water to the Sun (Surya Arghya)', instr: 'At sunrise, offer water to the Sun from a copper vessel.', freq: 'Daily', start: '2026-11-27', due: '2026-12-07', target: 11, assigned: '2026-11-26T17:50', from: 'Appointment BK-23044' },
  { id: 'RM-698', a: 'lakshmi', name: 'Donate food on Saturdays', instr: 'Donate a meal or uncooked grains to someone in need, once every Saturday.', freq: 'Weekly', start: '2026-11-07', due: '2026-11-28', target: 4, assigned: '2026-11-05T16:00', from: '' },
  { id: 'RM-684', a: 'arvind', name: 'Wear a silver ring on the little finger', instr: 'Wear it for the first time on a Monday morning and keep it on.', freq: '', start: '2026-11-09', due: '', target: 1, assigned: '2026-11-06T19:20', from: '' }
];
const _SEED = {
  'RM-701': ['2026-11-15T07:05','2026-11-16T06:50','2026-11-17T07:10','2026-11-18T06:45','2026-11-20T07:20','2026-11-21T06:55','2026-11-22T08:05','2026-11-23T06:40','2026-11-24T06:50','2026-11-25T07:00','2026-11-26T06:48'],
  'RM-702': [],
  'RM-698': ['2026-11-07T12:30','2026-11-14T13:10','2026-11-21T11:45'],
  'RM-684': ['2026-11-09T08:10']
};
export const TABS = [
  { key: 'all', label: 'All' }, { key: 'question', label: 'Questions' }, { key: 'appointment', label: 'Appointments' },
  { key: 'call', label: 'Calls' }, { key: 'chat', label: 'Chats' }, { key: 'subscription', label: 'Subscriptions' }, { key: 'remedy', label: 'Remedies' }
];
export const STATUS = {
  question: { label: 'Question status', opts: ['Awaiting answer', 'Answered'] },
  appointment: { label: 'Appointment status', opts: ['Booked', 'Completed', 'Rescheduled', 'Cancelled'] },
  call: { label: 'Call status', opts: ['Completed', 'Not connected'] },
  chat: { label: 'Chat status', opts: ['Completed', 'Not accepted'] },
  subscription: { label: 'Subscription status', opts: ['Active', 'Expired'] },
  remedy: { label: 'Completion status', opts: ['Pending', 'Completed'] }
};
export const EMPTY = {
  all: 'Your activity will appear here as you use AstroConnect services.',
  question: "You haven't submitted any questions yet.",
  appointment: "You don't have any appointments yet.",
  call: 'Your call history will appear here.',
  chat: 'Your chat history will appear here.',
  subscription: 'Your subscriptions will appear here.',
  remedy: 'Remedies assigned by your astrologer will appear here.'
};
export const EMPTY_ACT = {
  all: { label: 'Explore astrologers', to: '/explore' },
  question: { label: 'Ask a question', to: '/text' },
  appointment: { label: 'Book an appointment', to: '/appt/book' },
  call: { label: 'Find an astrologer', to: '/explore' },
  chat: { label: 'Find an astrologer', to: '/explore' },
  subscription: { label: 'Browse astrologers', to: '/explore' },
  remedy: null
};
export const SEARCH_PH = {
  all: 'Search astrologer, Question ID, Booking ID…',
  question: 'Search astrologer or Question ID…',
  appointment: 'Search astrologer or Booking ID…',
  call: 'Search astrologer or Call ID…',
  chat: 'Search astrologer or Chat ID…',
  subscription: 'Search astrologer, plan or ID…',
  remedy: 'Search remedy, astrologer or ID…'
};
export const BADGE = { 'Booked': 'b-booked', 'Completed': 'b-done', 'Rescheduled': 'b-resched', 'Cancelled': 'b-cancel', 'Not connected': 'b-cancel', 'Not accepted': 'b-cancel', 'Active': 'b-sub', 'Expired': 'b-muted', 'Answered': 'b-done', 'Awaiting answer': 'b-booked' };


export const QUESTIONS = shiftVal(_QUESTIONS), APPTS = shiftVal(_APPTS), CALLS = shiftVal(_CALLS), CHATS = shiftVal(_CHATS), SUBS = shiftVal(_SUBS), REMEDIES = shiftVal(_REMEDIES), SEED = shiftVal(_SEED);

export function remInfo(r, list) {
  list = list.slice().sort();
  let periods;
  if (r.freq === 'Daily') periods = new Set(list.map(t => t.slice(0, 10)));
  else if (r.freq === 'Weekly') periods = new Set(list.map(t => weekOf(t.slice(0, 10))));
  else periods = new Set(list.length ? ['once'] : []);
  const done = periods.size;
  const finished = done >= r.target;
  const curKey = r.freq === 'Daily' ? TODAY : r.freq === 'Weekly' ? weekOf(TODAY) : 'once';
  const periodDone = periods.has(curKey);
  const started = TODAY >= r.start;
  const canMark = !finished && !periodDone && started;
  const unit = r.freq === 'Weekly' ? 'weeks' : 'days';
  let statusLabel, group;
  if (finished) { statusLabel = 'Completed'; group = 'Completed'; }
  else if (periodDone) { statusLabel = r.freq === 'Weekly' ? 'Done this week' : 'Done today'; group = 'Completed'; }
  else { statusLabel = 'Pending'; group = 'Pending'; }
  let missed = 0;
  if (r.freq === 'Daily') { for (let k = r.start; k < TODAY; k = addDays(k, 1)) if (!periods.has(k)) missed++; }
  const pct = Math.min(100, Math.round(done / r.target * 100));
  let progText, progSub, progShort;
  if (!r.freq) { progText = done ? 'Completed' : 'Not completed yet'; progSub = 'One-time remedy'; progShort = ''; }
  else {
    progText = done + ' of ' + r.target + ' ' + unit + ' completed';
    progShort = done + '/' + r.target + ' ' + unit;
    if (r.freq === 'Daily') { const day = Math.min(r.target, diff(TODAY, r.start) + 1); progSub = finished ? 'Finished' : 'Day ' + day + ' of ' + r.target + (missed ? ' · ' + missed + ' missed' : ''); }
    else { const wk = Math.min(r.target, Math.floor(diff(weekOf(TODAY), weekOf(r.start)) / 7) + 1); progSub = finished ? 'Finished' : 'Week ' + wk + ' of ' + r.target; }
  }
  const last = list.length ? list[list.length - 1] : null;
  return { list, done, finished, periodDone, canMark, statusLabel, group, pct, progText, progSub, progShort, last, periods, missed };
}


// Build every activity record. Actions are descriptors: { label, cls, kind: "to" | "open" | "mark", to? }.
export function buildAll(comp) {
  const out = [];
  const to = (label, cls, path) => ({ label, cls, kind: "to", to: path });
  const open = (label, cls, id) => ({ label, cls, kind: "open", id });
  QUESTIONS.forEach((q) => {
    const as = A[q.a];
    const st = q.answered ? "Answered" : "Awaiting answer";
    const actions = [to("View Question", "btn btn-ghost", "/text")];
    if (q.answered) actions.push(to("View Answer", "btn btn-primary", "/answer"));
    out.push({ id: q.id, type: "question", at: q.answered || q.submitted, astro: as, init: as.init, name: as.name,
      kind: q.answered ? "Question answered" : "Question submitted", service: q.qType + " question · Text-based",
      statusLabel: st, statusKey: st, whenText: "Submitted " + fDT(q.submitted), facts: [],
      note: q.answered ? "Answer available · " + fShort(q.answered) + ", " + fTime(q.answered) : "Answer not available yet",
      noteCls: q.answered ? "note ok" : "note", actions });
  });
  const AK = { Booked: "Appointment booked", Completed: "Appointment completed", Rescheduled: "Appointment rescheduled", Cancelled: "Appointment cancelled" };
  APPTS.forEach((p) => {
    const as = A[p.a];
    out.push({ id: p.id, type: "appointment", at: p.at, astro: as, init: as.init, name: as.name, kind: AK[p.status],
      service: "Audio / Voice Call · " + p.dur + " min", statusLabel: p.status, statusKey: p.status,
      whenText: "Appointment " + fDT(p.when), facts: [{ t: "Paid " + p.amt }],
      note: p.prev ? "Moved from " + fDT(p.prev) : "", noteCls: p.prev ? "note warn" : "note",
      actions: [to("View Appointment Details", "btn btn-ghost", "/appt/my")] });
  });
  CALLS.forEach((c) => {
    const as = A[c.a];
    const facts = []; if (c.dur) facts.push({ t: c.dur }); facts.push({ t: "Charged " + c.amt });
    out.push({ id: c.id, type: "call", at: c.at, astro: as, init: as.init, name: as.name,
      kind: c.status === "Completed" ? "Audio call completed" : "Audio call not connected", service: "Instant Audio / Voice Call",
      statusLabel: c.status, statusKey: c.status, whenText: fDT(c.at), facts, note: c.status === "Completed" ? "" : "No charge applied", noteCls: "note",
      actions: [open("View Details", "btn btn-ghost", c.id)], raw: c });
  });
  CHATS.forEach((c) => {
    const as = A[c.a];
    const facts = []; if (c.dur) facts.push({ t: c.dur }); facts.push({ t: "Charged " + c.amt });
    out.push({ id: c.id, type: "chat", at: c.at, astro: as, init: as.init, name: as.name,
      kind: c.status === "Completed" ? "Chat completed" : "Chat not accepted", service: "Instant Chat",
      statusLabel: c.status, statusKey: c.status, whenText: fDT(c.at), facts, note: c.status === "Completed" ? "" : "No charge applied", noteCls: "note",
      actions: [open("View Chat History", "btn btn-ghost", c.id)], raw: c });
  });
  SUBS.forEach((s) => {
    const as = A[s.a];
    const left = diff(s.end, TODAY);
    out.push({ id: s.id, type: "subscription", at: s.at, astro: as, init: as.init, name: as.name,
      kind: s.status === "Active" ? "Subscription purchased" : "Subscription expired", service: s.plan,
      statusLabel: s.status, statusKey: s.status, whenText: fDate(s.start) + " – " + fDate(s.end), facts: [{ t: "Paid " + s.amt }],
      note: s.status === "Active" ? left + " days left" : "Ended " + fDate(s.end), noteCls: "note",
      actions: [open("View Subscription Details", "btn btn-ghost", s.id)], raw: s });
  });
  REMEDIES.forEach((r) => {
    const as = A[r.a];
    const ri = remInfo(r, comp[r.id] || []);
    let at = r.assigned, kind = "Remedy assigned";
    if (ri.last && ri.last > at) { at = ri.last; kind = ri.finished ? "Remedy completed" : "Remedy marked completed"; }
    const actions = [];
    if (ri.canMark) actions.push({ label: "Mark as Completed", cls: "btn btn-primary", kind: "mark", id: r.id });
    actions.push(open("View Remedy", "btn btn-ghost", r.id));
    out.push({ id: r.id, type: "remedy", at, astro: as, init: as.init, name: r.name, kind,
      service: "Assigned by " + as.name + " · " + (r.freq || "One-time"), statusLabel: ri.statusLabel, statusKey: ri.group,
      whenText: "Started " + fDate(r.start) + (r.due ? " · Due " + fDate(r.due) : ""), facts: [],
      hasProgress: !!r.freq, pct: ri.pct, progShort: ri.progShort,
      note: ri.canMark ? (r.freq === "Weekly" ? "Due this week" : "Due today") : (ri.last ? "Last done " + fShort(ri.last) + ", " + fTime(ri.last) : ""),
      noteCls: ri.canMark ? "note warn" : "note", actions, raw: r, ri });
  });
  out.forEach((o) => {
    o.badgeCls = "badge " + (BADGE[o.statusLabel] || (o.type === "remedy" ? (o.statusKey === "Pending" ? "b-resched" : "b-done") : "b-muted"));
    o.search = [o.id, o.name, o.service, o.astro.name, o.kind].join(" ").toLowerCase();
  });
  return out;
}

// Detail drawer content for a call, chat, subscription or remedy record.
export function buildDetail(rec) {
  if (!rec) return null;
  const d = { typeLabel: "", title: "", name: rec.astro.name, init: rec.init, sub: "", statusLabel: rec.statusLabel, badgeCls: rec.badgeCls, rows: [], isRemedy: false };
  const r = rec.raw;
  if (rec.type === "call") {
    Object.assign(d, { typeLabel: "Call Details", title: "Instant Audio Call", sub: rec.id,
      rows: [{ k: "Call ID", v: r.id }, { k: "Date & time", v: fDT(r.at) }, { k: "Mode", v: "Audio / Voice Call" }, { k: "Duration", v: r.dur || "Not connected" }, { k: "Rate", v: r.rate }, { k: "Total charged", v: r.amt }, { k: "Status", v: r.status }] });
  } else if (rec.type === "chat") {
    Object.assign(d, { typeLabel: "Chat History", title: "Instant Chat", sub: rec.id,
      rows: [{ k: "Chat ID", v: r.id }, { k: "Date & time", v: fDT(r.at) }, { k: "Duration", v: r.dur || "Not accepted" }, { k: "Rate", v: r.rate }, { k: "Total charged", v: r.amt }, { k: "Status", v: r.status }] });
  } else if (rec.type === "subscription") {
    Object.assign(d, { typeLabel: "Subscription Details", title: r.plan, sub: rec.id,
      rows: [{ k: "Subscription ID", v: r.id }, { k: "Plan", v: r.plan }, { k: "Start date", v: fDate(r.start) }, { k: "Expiry date", v: fDate(r.end) }, { k: "Amount paid", v: r.amt }, { k: "Status", v: r.status }] });
  } else if (rec.type === "remedy") {
    const ri = rec.ri;
    const strip = [];
    if (r.freq === "Daily") {
      for (let i = 6; i >= 0; i--) {
        const k = addDays(TODAY, -i); const x = new Date(k + "T00:00");
        let cls = "pre", done = false, label = "Not started";
        if (k >= r.start) {
          if (ri.periods.has(k)) { cls = "done"; done = true; label = "Done"; }
          else if (k === TODAY) { cls = "today"; label = "Pending today"; }
          else { cls = "miss"; label = "Missed"; }
        }
        strip.push({ dow: DOW[x.getDay()], num: String(x.getDate()), cls, done, aria: fDow(k) + ": " + label });
      }
    }
    const freqText = r.freq === "Daily" ? "daily" : r.freq === "Weekly" ? "weekly" : "";
    Object.assign(d, { typeLabel: "Remedy Tracker", title: r.name, sub: "Assigned by " + rec.astro.name, isRemedy: true,
      instr: r.instr, progText: ri.progText, progSub: ri.progSub, pct: ri.pct, hasTarget: !!r.freq, strip,
      reminderText: r.freq ? "You get a " + freqText + " reminder while this remedy is active, based on your notification settings. A reminder never marks the remedy as done: tap Mark as Completed after you perform it." : "One-time remedy: tap Mark as Completed after you perform it.",
      canMark: ri.canMark, showDone: !ri.canMark && (ri.periodDone || ri.finished),
      doneMsg: ri.finished ? "Remedy completed" : (r.freq === "Weekly" ? "Completed for this week" : "Completed for today"),
      history: ri.list.slice().reverse().map((t) => ({ date: fDow(t), time: fTime(t) })),
      rows: [{ k: "Remedy ID", v: r.id }, { k: "Frequency", v: r.freq || "One-time" }, { k: "Start date", v: fDate(r.start) }, { k: "Due date", v: r.due ? fDate(r.due) : "—" }, { k: "Assigned on", v: fDT(r.assigned) }].concat(r.from ? [{ k: "From", v: r.from }] : []) });
  }
  return d;
}
