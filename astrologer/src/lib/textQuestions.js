// Text-Based Questions + Subscription Questions rules and formatters, ported from the
// reference prototype (reference/*/astro-converse-app-*.html, "02 Text-Based Questions +
// Subscription Questions"). Spec: docs/02-astrologer-app/02_TEXT_BASED_QUESTIONS.md (AD-24 – AD-73).

// The prototype is pinned to a fixed "today" so the sample deadlines and priorities stay
// meaningful. Other modules import TODAY from here (via lib/format.js).
// Replace with `new Date()` once real data exists.
export const TODAY = new Date('2026-11-20T12:00:00');
export const DAY = 864e5;
export const MAX_CHARS = 1500; // answer and dispute answer (AD-36, AD-44)
export const MAX_FILES = 3; // answer attachments (AD-45)
export const MAX_MB = 10; // per answer attachment (AD-45)
export const MAX_QUESTION = 1000; // user question text (AD-69)
export const DEADLINE_DAYS = 30; // answer deadline (AD-30)
export const DISPUTE_DAYS = 3; // dispute answer deadline (AD-41)
export const FILE_TYPES = /\.(jpe?g|pdf|txt)$/i;

export const dt = (s) => new Date(s);
const asDate = (d) => (typeof d === 'string' ? dt(d) : d);
export const fmtDate = (d) => asDate(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
export const fmtDateTime = (d) => `${fmtDate(d)}, ${asDate(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
const dayStart = (d) => new Date(asDate(d).toDateString());
const sameDay = (a, b) => fmtDate(a) === fmtDate(b);
export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN', Number(n) % 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 0 });

// ---- Status, priority, deadlines (AD-30 – AD-33, AD-51; calendar days, AD-71) ----
export const OPEN_STATUSES = ['New', 'Pending', 'Correction Requested'];
export const isOpen = (q) => OPEN_STATUSES.includes(q.status);
export const pendingDay = (q) => Math.round((dayStart(TODAY) - dayStart(q.recv)) / DAY) + 1;
/** Answer deadline: the received date + 30 calendar days (e.g. received 25 Nov → 25 Dec), IST (AD-30, AD-71).
 *  The astrologer can answer until the end of that day. Shown as "Answer by". */
export const answerBy = (q) => new Date(+dayStart(q.recv) + DEADLINE_DAYS * DAY);
/** Moment the deadline has passed: the start of the day after `answerBy` (auto-cancel and refund, AD-30). */
export const dueDate = (q) => new Date(+answerBy(q) + DAY);
/** An open question whose 30-day deadline has passed is auto-cancelled and refunded → Expired (AD-30, AD-47). */
export const applyDeadline = (q) => (OPEN_STATUSES.includes(q.status) && TODAY >= dueDate(q) ? { ...q, status: 'Expired' } : q);
/** Whole days left until the end of the deadline day (0 on the deadline day itself). */
export const daysLeft = (q) => Math.round((dayStart(answerBy(q)) - dayStart(TODAY)) / DAY);
/** 1 = Priority 1 (day 20–30), 2 = Priority 2 (day 1–19), 0 = not open. */
export const priority = (q) => (isOpen(q) ? (pendingDay(q) >= 20 ? 1 : 2) : 0);
/** Dispute answer deadline: 3 days after the dispute was raised (AD-41). */
export const disputeDue = (q) => new Date(+dt(q.disputeAt) + DISPUTE_DAYS * DAY);
export const disputeDaysLeft = (q) => Math.ceil((disputeDue(q) - TODAY) / DAY);

/** Badge colour for each question status. */
export const STATUS_KIND = {
  New: 'info',
  Pending: 'warn',
  'Correction Requested': 'accent',
  Completed: 'ok',
  Settled: 'ok',
  Disputed: 'bad',
  'Dispute Answered': 'info',
  Expired: 'bad',
};
export const statusLabel = (s) => (s === 'New' ? 'New / Received' : s);

// ---- Categories and tabs (AD-46, AD-72) ----
export const CATEGORIES = [['text', 'Text-Based Questions'], ['sub', 'Subscription Questions']];
/** Four main lifecycle tabs, then the secondary tabs Drafts and Expired (AD-46). */
export const TABS = [
  { key: 'received', label: 'Received Questions', test: (q) => isOpen(q) },
  { key: 'answered', label: 'Answered Questions', test: (q) => ['Completed', 'Settled'].includes(q.status) },
  { key: 'dispute', label: 'Dispute Questions', test: (q) => q.status === 'Disputed' },
  { key: 'solved', label: 'Dispute Solved / Resolved', test: (q) => q.status === 'Dispute Answered' },
  { key: 'drafts', label: 'Drafts', test: (q) => isOpen(q) && !!q.draft },
  { key: 'expired', label: 'Expired', test: (q) => q.status === 'Expired' },
];
const tabTest = (key) => (TABS.find((t) => t.key === key) || TABS[0]).test;
export const inCat = (questions, cat) => questions.filter((q) => q.cat === cat);
export const countTab = (questions, cat, key) => inCat(questions, cat).filter(tabTest(key)).length;
export const openCount = (questions, cat) => inCat(questions, cat).filter(isOpen).length;

export const EMPTY_FILTERS = { q: '', camp: '', type: '', status: '' };
export const activeFilterCount = (f) => Object.values(f).filter(Boolean).length;
export const matchesId = (q, text) => !text || (q.id + q.uid).toLowerCase().includes(text.toLowerCase());

/** The list for a category + tab, with filters, search and the Priority urgency filter (Received only). */
export function filterQuestions(questions, { cat, tab, prio, f }) {
  return inCat(questions, cat)
    .filter(tabTest(tab))
    .filter(
      (q) =>
        matchesId(q, f.q) &&
        (!f.camp || q.camp === f.camp) &&
        (!f.type || q.type === f.type) &&
        (!f.status || q.status === f.status) &&
        (tab !== 'received' || !prio || String(priority(q)) === prio)
    )
    .sort((a, b) => pendingDay(b) - pendingDay(a));
}

// ---- Selectors for Home / My Work (IST calendar day, AD-71) ----
// `cat` is 'text' (Text-Based Questions) or 'sub' (Subscription Questions); never merged (AD-72).
export const receivedToday = (questions, cat) => questions.filter((q) => q.cat === cat && sameDay(q.recv, TODAY)).length;
export const answeredToday = (questions, cat) => questions.filter((q) => q.cat === cat && q.answeredAt && sameDay(q.answeredAt, TODAY)).length;
export const pendingToday = (questions, cat) => questions.filter((q) => q.cat === cat && sameDay(q.recv, TODAY) && isOpen(q)).length;
/** Priority 1 (day 20–30) Text-Based Questions. */
export const critical = (questions) => questions.filter((q) => q.cat === 'text' && priority(q) === 1).length;
/** Questions with an open (unanswered) dispute, earliest deadline first. */
export const openDisputes = (questions) =>
  questions.filter((q) => q.status === 'Disputed').sort((a, b) => disputeDue(a) - disputeDue(b));

/** Fill in the derived and per-session fields of a sample question (reference `Q`). */
export function buildQuestion(raw) {
  return applyDeadline({
    age: 28, gender: 'Female', loc: 'Chennai, TN', paid: 0, slots: 1, prev: [], draft: '', att: [], links: [], remedy: '', events: [],
    ...raw,
    ini: raw.name.split(' ').map((w) => w[0]).join('').slice(0, 2),
    purchased: new Date(dt(raw.recv) - DAY * 1.2).toISOString(),
  });
}

/** Timeline entries: [title, detail, kind]. kind: done | bad | accent | now | '' (AD-50). */
export function timelineEvents(q) {
  const ev = [
    ['Question Purchased', fmtDateTime(q.purchased), 'done'],
    ['Question Submitted', fmtDateTime(q.recv), 'done'],
    ...q.events,
  ];
  if (q.answeredAt) ev.push(['Answer Submitted (Completed)', fmtDateTime(q.answeredAt), 'done']);
  if (q.disputeAt) ev.push(['Dispute Raised', fmtDateTime(q.disputeAt), 'bad']);
  if (q.disputeAnswer) ev.push(['Dispute Answered', fmtDateTime(q.disputeAnsweredAt || TODAY), 'done']);
  if (q.status === 'Settled') ev.push(['Settled', 'No dispute within 7 days; amount eligible for settlement', 'done']);
  if (q.status === 'Expired') ev.push(['Expired', `${fmtDate(dueDate(q))} · auto-cancelled and refunded`, 'bad']);
  if (isOpen(q)) {
    ev.push([`Answer pending · Day ${pendingDay(q)}`, `Answer by ${fmtDate(answerBy(q))} · ${daysLeft(q)} ${daysLeft(q) === 1 ? 'day' : 'days'} left`, 'now']);
    ev.push(['Auto-cancel and refund if unanswered', `After ${fmtDate(answerBy(q))}`, '']);
  }
  return ev;
}

// ---- Campaigns, Open Questions and quota (AD-24 – AD-27, AD-54 – AD-57) ----
export const campTotal = (c) => (c.G ? +c.gSlots || 0 : 0) + (c.P ? +c.pSlots || 0 : 0);
export const campSold = (c) => (c.G ? c.gSold : 0) + (c.P ? c.pSold : 0);
/** Allocated slots: every campaign that is not cancelled/deleted, plus Open Questions. */
export const allocated = (campaigns, open) =>
  campaigns.filter((c) => !['Cancelled', 'Deleted'].includes(c.status)).reduce((s, c) => s + campTotal(c), 0) + open.gSlots + open.pSlots;
/** Final payable price after an optional discount (AD-56). */
export const finalPrice = (p, d) => (d && d.on && d.pct ? Math.round(p * (100 - d.pct)) / 100 : p);
/** Name for a question's campaign id: a campaign, 'open' (Open Questions) or 'tier:<Tier>' (subscription). */
export function campaignName(campaigns, id) {
  if (id === 'open') return 'Open Questions';
  if (id?.startsWith('tier:')) return `${id.slice(5)} subscription`;
  return campaigns.find((c) => c.id === id)?.name || '—';
}

// ---- History (AD-47, AD-50) ----
export const HISTORY_FILTERS = {
  all: (q) => !isOpen(q),
  answered: (q) => ['Completed', 'Settled'].includes(q.status),
  disputed: (q) => ['Disputed', 'Dispute Answered'].includes(q.status),
  expired: (q) => q.status === 'Expired',
};
export const HISTORY_MONTHS = [
  { value: '2026-11', label: 'November 2026' },
  { value: '2026-10', label: 'October 2026' },
];
