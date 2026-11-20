// Text Questions rules and formatters, ported from the reference prototypes
// (astrologer/reference/*/text-questions-*.html, AD-24 – AD-51).

// The prototype is pinned to a fixed "today" so the sample deadlines and
// priorities stay meaningful. Replace with `new Date()` once real data exists.
export const TODAY = new Date('2026-11-20T12:00:00');
export const DAY = 864e5;
export const MAX_CHARS = 1500;
export const MAX_FILES = 2;
export const DEADLINE_DAYS = 30;

export const dt = (s) => new Date(s);
export const fmtDate = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
export const fmtDateTime = (d) => `${fmtDate(d)}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

export const OPEN_STATUSES = ['New', 'Pending', 'Correction Requested'];
export const isOpen = (q) => OPEN_STATUSES.includes(q.status);
export const pendingDay = (q) => Math.floor((TODAY - dt(q.recv)) / DAY) + 1;
export const dueDate = (q) => new Date(+dt(q.recv) + DEADLINE_DAYS * DAY);
export const daysLeft = (q) => DEADLINE_DAYS - pendingDay(q);
/** 1 = Priority 1 (day 20–30), 2 = Priority 2 (day 1–19), 0 = not open. */
export const priority = (q) => (isOpen(q) ? (pendingDay(q) >= 20 ? 1 : 2) : 0);

export const TABS = [
  { key: 'p1', label: 'Priority 1', test: (q) => isOpen(q) && pendingDay(q) >= 20 },
  { key: 'p2', label: 'Priority 2', test: (q) => isOpen(q) && pendingDay(q) < 20 },
  { key: 'new', label: 'New Questions', test: (q) => q.status === 'New' },
  { key: 'answered', label: 'Answered', test: (q) => ['Answered', 'Completed'].includes(q.status) },
  { key: 'disputed', label: 'Disputed', test: (q) => ['Disputed', 'Dispute Answered'].includes(q.status) },
  { key: 'drafts', label: 'Drafts', test: (q) => isOpen(q) && !!q.draft },
  { key: 'expired', label: 'Expired', test: (q) => q.status === 'Expired' },
];
const tabTest = (key) => TABS.find((t) => t.key === key).test;
export const countTab = (questions, key) => questions.filter(tabTest(key)).length;

/** Badge colour for each question status. */
export const STATUS_KIND = {
  New: 'info',
  Pending: 'warn',
  'Correction Requested': 'accent',
  Answered: 'ok',
  Disputed: 'bad',
  'Dispute Answered': 'info',
  Completed: 'ok',
  Expired: 'bad',
};

export const EMPTY_FILTERS = { q: '', camp: '', type: '', status: '', prio: '' };
export const activeFilterCount = (f) => Object.values(f).filter(Boolean).length;
const matchesId = (q, text) => !text || (q.id + q.uid).toLowerCase().includes(text.toLowerCase());

export function filterQuestions(questions, tab, f) {
  return questions
    .filter(tabTest(tab))
    .filter(
      (q) =>
        matchesId(q, f.q) &&
        (!f.camp || q.camp === f.camp) &&
        (!f.type || q.type === f.type) &&
        (!f.status || q.status === f.status) &&
        (!f.prio || String(priority(q)) === f.prio)
    )
    .sort((a, b) => pendingDay(b) - pendingDay(a));
}

/** Fill in the derived and per-session fields of a sample question. */
export function buildQuestion(raw) {
  return {
    draft: '',
    att: [],
    links: [],
    remedy: '',
    remember: false,
    events: [],
    ...raw,
    ini: raw.name.split(' ').map((w) => w[0]).join('').slice(0, 2),
    purchased: new Date(dt(raw.recv) - DAY * 1.1).toISOString(),
  };
}

/** Timeline entries: [title, detail, kind]. kind: done | bad | accent | now | todo. */
export function timelineEvents(q) {
  const ev = [
    ['Question Purchased', fmtDateTime(dt(q.purchased)), 'done'],
    ['Question Submitted', fmtDateTime(dt(q.recv)), 'done'],
    ...q.events,
  ];
  if (q.answeredAt) ev.push(['Answer Submitted', fmtDateTime(dt(q.answeredAt)), 'done']);
  if (q.disputeAt) ev.push(['Dispute Raised', fmtDateTime(dt(q.disputeAt)), 'bad']);
  if (q.disputeAnswer) ev.push(['Dispute Answered', fmtDateTime(TODAY), 'done']);
  if (q.status === 'Completed') ev.push(['Completed', 'Settled after 7 days', 'done']);
  if (q.status === 'Expired') ev.push(['Expired', `${fmtDate(dueDate(q))} · auto-cancelled and refunded`, 'bad']);
  if (isOpen(q)) {
    ev.push([`Answer pending · Day ${pendingDay(q)} of ${DEADLINE_DAYS}`, `Answer by ${fmtDate(dueDate(q))}`, 'now']);
    ev.push(['Auto-cancel and refund if unanswered', `After ${fmtDate(dueDate(q))}`, 'todo']);
  }
  return ev;
}

// ---- Campaigns and quota ----
export const allocated = (campaigns) =>
  campaigns.reduce((s, c) => s + (c.status === 'Cancelled' ? c.sold : c.slots), 0);

// ---- History ----
export const HISTORY_FILTERS = {
  all: (q) => ['Answered', 'Completed', 'Disputed', 'Dispute Answered', 'Expired'].includes(q.status),
  answered: (q) => ['Answered', 'Completed'].includes(q.status),
  disputed: (q) => ['Disputed', 'Dispute Answered'].includes(q.status),
  expired: (q) => q.status === 'Expired',
};
export const HISTORY_MONTHS = [
  { value: '2026-11', label: 'November 2026' },
  { value: '2026-10', label: 'October 2026' },
];
export { matchesId };
