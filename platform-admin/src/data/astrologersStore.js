// Astrologers (local data). The List and the Astrologer Profile read the same
// directory and saved changes (astrologerStatus.js); a profile's services,
// followers, subscribers, remedies, disputes, reviews and earnings come from
// the linked users' own records (decision 1A), so both sides always agree.
//
// Earnings follow only the confirmed rules (decision 3a): Call / Chat 2%,
// Appointment 3% on the amount the user paid; no earnings for astrologer-
// cancelled appointments (AD-91); Held = services not yet completed;
// Appointment earnings are released on the next Tuesday / Friday at least
// 3 days after completion (AD-126). Pending Balance (PP-11), Text Question
// commission (PP-09) and the Call / Chat release date (PP-10) are shown as
// "Not finalised". Withdrawals: minimum ₹500; Bank Account or UPI; Pending /
// Processing / Paid / Failed; a failed payout returns to Available (AD-125).

import { getUser } from './usersStore.js';
import { getBaseProfile } from './profileStore.js';
import { usersForAstrologer } from './astrologerLinks.js';
import { loadAstrologerIndex } from './astrologerIndex.js';
import { reviewFor } from './mock/reviewsMock.js';
import { DAY, HOUR, MIN, hashString, iso, rng, snapshotTime } from './mock/seed.js';
import { SPECIALIZATIONS } from './mock/astrologersMock.js';
import {
  allAstrologers,
  getAstrologer,
  getAstrologerAudit,
  getAstrologerNotes,
  getEditLog,
} from './astrologerStatus.js';
import { activityForAstrologer } from './assistantsStore.js';
import { applyPostModeration, applyRemedyModeration, moderationIndex } from './moderationStore.js';

export { SPECIALIZATIONS };
export const AVAILABILITY = ['Available', 'Busy', 'Offline', 'DND'];
export const VERIFICATION = ['Not Submitted', 'Submitted', 'Approved', 'Rejected'];
export const SERVICE_KEYS = [
  ['text', 'Text'],
  ['appointment', 'Appointment'],
  ['call', 'Call'],
  ['chat', 'Chat'],
];
export const EXPERIENCE_BANDS = [
  ['0-2', '0–2 years', 0, 2],
  ['3-5', '3–5 years', 3, 5],
  ['6-10', '6–10 years', 6, 10],
  ['11+', '10+ years', 11, 99],
];
export const RATING_BANDS = [
  ['4.5', '4.5 and above', 4.5],
  ['4', '4.0 and above', 4],
  ['3', '3.0 and above', 3],
  ['below3', 'Below 3.0', 0],
  ['none', 'No published reviews', null],
];

const COMMISSION = { Appointment: 0.03, 'Instant Call': 0.02, 'Instant Chat': 0.02 };
export const NOT_FINALISED = 'Not finalised';
const round2 = (v) => Math.round(v * 100) / 100;

// ---------- list ----------
export async function loadAstrologers() {
  const scenario = new URLSearchParams(window.location.search).get('mock');
  const index = await loadAstrologerIndex();
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (scenario === 'error') throw new Error('The astrologer list could not be loaded.');
  if (scenario === 'empty') return [];
  return withIndex(allAstrologers(), index);
}

export function withIndex(list, index) {
  return list.map((a) => {
    const row = index[a.id] ?? { completed: 0, ratingSum: 0, ratingCount: 0 };
    return {
      ...a,
      totalServices: row.completed,
      rating: row.ratingCount ? Math.round((row.ratingSum / row.ratingCount) * 10) / 10 : null,
      reviewCount: row.ratingCount,
    };
  });
}

export function countAstrologers(list) {
  const c = { total: list.length, Active: 0, Suspended: 0, Blocked: 0, available: 0 };
  for (const a of list) {
    c[a.status] += 1;
    if (a.availability === 'Available') c.available += 1;
  }
  c.restricted = c.Suspended + c.Blocked;
  return c;
}

/**
 * f: { query, status ('all'|'Active'|'Suspended'|'Blocked'|'restricted'),
 *      availability, specialization, service, experience, verification,
 *      rating, from, to }
 */
export function filterAstrologers(list, f) {
  const q = (f.query ?? '').trim().toLowerCase();
  const digits = q.replace(/\D/g, '');
  const fromTs = f.from ? new Date(`${f.from}T00:00:00`).getTime() : null;
  const toTs = f.to ? new Date(`${f.to}T23:59:59.999`).getTime() : null;
  const band = EXPERIENCE_BANDS.find((b) => b[0] === f.experience);
  const rate = RATING_BANDS.find((b) => b[0] === f.rating);
  return list.filter((a) => {
    if (f.status === 'restricted' ? a.status === 'Active' : f.status && f.status !== 'all' && a.status !== f.status) return false;
    if (f.availability && f.availability !== 'all' && a.availability !== f.availability) return false;
    if (f.specialization && f.specialization !== 'all' && !a.specializations.includes(f.specialization)) return false;
    if (f.service && f.service !== 'all' && !a.offers[f.service]) return false;
    if (band && (a.experience < band[2] || a.experience > band[3])) return false;
    if (f.verification && f.verification !== 'all' && a.verification.kyc !== f.verification) return false;
    if (rate) {
      if (rate[0] === 'none' ? a.rating !== null : rate[0] === 'below3' ? !(a.rating !== null && a.rating < 3) : !(a.rating !== null && a.rating >= rate[2])) return false;
    }
    const joined = new Date(a.joinedAt).getTime();
    if (fromTs !== null && joined < fromTs) return false;
    if (toTs !== null && joined > toTs) return false;
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (digits.length >= 3 && a.mobile.replace(/\D/g, '').includes(digits))
    );
  });
}

const SORTERS = {
  joined: (a, b) => a.joinedAt.localeCompare(b.joinedAt) || a.id.localeCompare(b.id),
  name: (a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id),
  id: (a, b) => a.id.localeCompare(b.id),
  experience: (a, b) => a.experience - b.experience || a.name.localeCompare(b.name),
  rating: (a, b) => (a.rating ?? -1) - (b.rating ?? -1) || a.name.localeCompare(b.name),
  totalServices: (a, b) => a.totalServices - b.totalServices || a.name.localeCompare(b.name),
};

export function sortAstrologers(list, { key, dir }) {
  const sorted = [...list].sort(SORTERS[key] ?? SORTERS.joined);
  return dir === 'desc' ? sorted.reverse() : sorted;
}

// ---------- profile ----------
const astroStatusOf = (s, disputesByQuestion, snapshot) => {
  if (s.type !== 'Text Question') return s.status;
  if (s.status !== 'Completed') return s.status;
  const d = disputesByQuestion.get(s.id);
  if (d) return d.responses.some((r) => r.from.includes('(Astrologer)')) ? 'Dispute Answered' : 'Disputed';
  return new Date(s.answeredAt).getTime() + 7 * DAY <= snapshot ? 'Settled' : 'Completed';
};

function completionTime(s) {
  if (s.type === 'Text Question') return s.answeredAt;
  if (s.type === 'Appointment') return iso(new Date(s.serviceAt).getTime() + s.duration * MIN);
  return s.endedAt;
}

/** Next Tuesday or Friday release run (10:00) on or after `ts`. */
function nextRelease(ts) {
  const d = new Date(ts);
  if (d.getHours() >= 10) d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  while (![2, 5].includes(d.getDay())) d.setDate(d.getDate() + 1);
  return d.getTime();
}

const cache = new Map();

/** Everything the Astrologer Profile needs, or null. */
export function getAstrologerProfile(id) {
  const astrologer = getAstrologer(id);
  if (!astrologer) return null;
  if (!cache.has(id)) cache.set(id, buildBase(astrologer));
  const base = cache.get(id);
  const audit = getAstrologerAudit(id);
  const edits = getEditLog(id);
  const notes = getAstrologerNotes(id);
  // Followers / subscribers show each user's current account status.
  const followers = base.followers.map((f) => ({ ...f, user: { ...f.user, status: getUser(f.user.id)?.status ?? f.user.status } }));
  // Admin moderation (Remedy / Content Management) applied at read time.
  const remedyMod = moderationIndex('remedy');
  const postMod = moderationIndex('post');
  return {
    ...base,
    remedies: base.remedies.map((r) => applyRemedyModeration(r, remedyMod.get(r.id) ?? [])),
    content: { ...base.content, posts: base.content.posts.map((p) => applyPostModeration(p, postMod.get(p.id) ?? [])) },
    astrologer,
    followers,
    audit,
    edits,
    notes,
    activity: buildActivity(base, astrologer, audit, edits, notes),
  };
}

/** Availability and content (raw, before moderation) — the same cached records as the profile. */
export function getAstrologerOps(id) {
  const astrologer = getAstrologer(id);
  if (!astrologer) return null;
  if (!cache.has(id)) cache.set(id, buildBase(astrologer));
  const base = cache.get(id);
  return { astrologer, availability: base.availability, content: base.content, documents: base.documents };
}

/**
 * The astrologer's wallet only (earnings, settlements, withdrawals) — the same
 * cached records the Astrologer Profile Wallet tab shows. Used by Finance.
 */
export function getAstrologerWallet(id) {
  const astrologer = getAstrologer(id);
  if (!astrologer) return null;
  if (!cache.has(id)) cache.set(id, buildBase(astrologer));
  return { astrologer, wallet: cache.get(id).wallet };
}

export async function loadAstrologerProfile(id) {
  const scenario = new URLSearchParams(window.location.search).get('mock');
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (scenario === 'error') throw new Error('The astrologer profile could not be loaded.');
  return getAstrologerProfile(id);
}

function buildBase(a) {
  const snapshot = snapshotTime();
  const todayStart = new Date(snapshot);
  todayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(todayStart);
  monthStart.setDate(1);

  // Records from the linked users (same objects the User Profile shows).
  const linked = usersForAstrologer(a.id)
    .map((uid) => getUser(uid))
    .filter(Boolean)
    .map((user) => ({ user, rec: getBaseProfile(user) }));

  const disputes = [];
  const complaints = [];
  const services = [];
  const subscriptions = [];
  const failures = [];
  const remedies = [];
  const followers = [];
  const followHistory = [];
  for (const { user, rec } of linked) {
    const u = { id: user.id, name: user.name, status: user.status };
    const mine = rec.services.filter((s) => s.astrologer.id === a.id);
    const ids = new Set(mine.map((s) => s.id));
    for (const d of rec.disputes) if (d.astrologer.id === a.id) disputes.push({ ...d, user: u });
    for (const c of rec.complaints) if (c.serviceId && ids.has(c.serviceId)) complaints.push({ ...c, user: u });
    for (const s of mine) services.push({ ...s, user: u, userLastActive: user.lastActiveAt });
    for (const s of rec.subscriptions) if (s.astrologer.id === a.id) subscriptions.push({ ...s, user: u });
    for (const f of rec.subscriptionFailures) if (f.astrologer.id === a.id) failures.push({ ...f, user: u });
    for (const r of rec.remedies) if (r.astrologer.id === a.id) remedies.push({ ...r, user: u });
    for (const f of rec.following) if (f.astrologer.id === a.id) followers.push({ user: u, followedAt: f.followedAt });
    for (const e of rec.followEvents) if (e.astrologer.id === a.id) followHistory.push({ ...e, user: u });
  }
  const disputesByQuestion = new Map(disputes.map((d) => [d.questionId, d]));
  for (const s of services) {
    s.userStatus = s.status;
    s.status = astroStatusOf(s, disputesByQuestion, snapshot);
    s.completed = s.userStatus === 'Completed';
    s.completedAt = s.completed ? completionTime(s) : null;
  }
  services.sort((x, y) => y.createdAt.localeCompare(x.createdAt));

  // ---------- reviews ----------
  const reviews = services
    .map((s) => {
      const r = reviewFor(s.completed ? { ...s, status: 'Completed' } : s, s.userLastActive);
      return r ? { ...r, user: s.user } : null;
    })
    .filter(Boolean)
    .sort((x, y) => y.at.localeCompare(x.at));
  const published = reviews.filter((r) => r.status === 'Published');
  const rating = published.length ? Math.round((published.reduce((t, r) => t + r.rating, 0) / published.length) * 10) / 10 : null;

  // ---------- earnings ----------
  const earnings = [];
  const refunds = [];
  for (const s of [...services].reverse()) {
    if (s.type === 'Appointment' && s.cancellation) {
      refunds.push({ service: s, amount: s.refundInfo?.amount ?? s.amount, at: s.refundInfo?.at ?? s.cancellation.at });
      continue; // AD-91: no earnings for astrologer-cancelled appointments
    }
    const rate = COMMISSION[s.type];
    const known = rate !== undefined;
    const commission = known ? round2(s.amount * rate) : null;
    const net = known ? round2(s.amount - commission) : null;
    let state;
    let releaseAt = null;
    if (!s.completed) state = 'Held';
    else if (s.type === 'Appointment') {
      releaseAt = nextRelease(new Date(s.completedAt).getTime() + 3 * DAY);
      state = releaseAt <= snapshot ? 'Released' : 'Awaiting release';
    } else state = NOT_FINALISED;
    earnings.push({ service: s, gross: s.amount, rate, commission, net, state, at: s.completed ? s.completedAt : s.createdAt, releaseAt });
  }

  // Settlement runs (Tuesday / Friday) for released appointment earnings.
  const runs = new Map();
  for (const e of earnings) {
    if (e.state !== 'Released') continue;
    const run = runs.get(e.releaseAt) ?? { at: e.releaseAt, items: [] };
    run.items.push(e);
    runs.set(e.releaseAt, run);
  }
  const num = a.id.replace(/\D/g, '');
  const settlements = [...runs.values()]
    .sort((x, y) => x.at - y.at)
    .map((run, i) => ({
      id: `STL-${num}-${String(i + 1).padStart(3, '0')}`,
      at: iso(run.at),
      count: run.items.length,
      gross: round2(run.items.reduce((t, e) => t + e.gross, 0)),
      commission: round2(run.items.reduce((t, e) => t + e.commission, 0)),
      net: round2(run.items.reduce((t, e) => t + e.net, 0)),
      status: 'Released',
      services: run.items.map((e) => e.service.id),
    }));
  for (const st of settlements) for (const e of earnings) if (st.services.includes(e.service.id)) e.settlementId = st.id;

  // Available-balance ledger: settlement credits and withdrawals.
  const w = rng(hashString(`${a.id}:wallet`));
  const ledger = [];
  const withdrawals = [];
  let available = 0;
  let seq = 0;
  const nextTx = () => `ATX-${num}${String(++seq).padStart(4, '0')}`;
  const aLast = new Date(a.lastActiveAt).getTime();
  const workingDaysBetween = (from, to) => {
    let n = 0;
    const d = new Date(from);
    while (d.getTime() < to) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) n += 1;
    }
    return n;
  };
  for (const st of settlements) {
    available = round2(available + st.net);
    ledger.push({ id: nextTx(), at: st.at, serviceType: 'Settlement', description: `Settlement released · ${st.id} (${st.count} appointment${st.count === 1 ? '' : 's'})`, credit: st.net, debit: null, refund: null, status: 'Released', affects: true, balanceAfter: available, ref: st.id });
    if (available >= 500 && w.chance(0.45)) {
      const requestedAt = new Date(st.at).getTime() + w.between(4 * HOUR, 4 * DAY);
      if (requestedAt > Math.min(snapshot, aLast)) continue;
      const amount = Math.max(500, Math.floor((available * (0.5 + w.rand() * 0.5)) / 100) * 100);
      if (amount > available) continue;
      const days = workingDaysBetween(requestedAt, snapshot);
      let status = days === 0 ? 'Pending' : days <= 2 ? 'Processing' : w.chance(0.9) ? 'Paid' : 'Failed';
      const method = w.chance(0.6) ? 'Bank Account' : 'UPI';
      const wid = `WDR-${num}${String(withdrawals.length + 1).padStart(3, '0')}`;
      const affects = status !== 'Failed';
      if (affects) available = round2(available - amount);
      withdrawals.push({
        id: wid,
        amount,
        method,
        requestedAt: iso(requestedAt),
        status,
        paidAt: status === 'Paid' ? iso(requestedAt + w.between(1, 3) * DAY) : null,
        reference: status === 'Paid' ? `UTR${String(Math.floor(w.rand() * 1e11)).padStart(11, '0')}` : '—',
        failureReason: status === 'Failed' ? 'Bank account verification failed; amount returned to Available Balance.' : '',
      });
      ledger.push({ id: nextTx(), at: iso(requestedAt), serviceType: 'Withdrawal', description: `Withdrawal to ${method} · ${wid}`, credit: null, debit: amount, refund: null, status, affects, balanceAfter: available, ref: wid });
    }
  }

  // Unified transaction list: earnings, refunds, settlements and withdrawals.
  const transactions = [
    ...earnings.map((e) => ({
      id: `ETX-${e.service.id}`, // keeps the service prefix so IDs stay unique across service types
      at: e.at,
      serviceType: e.service.type,
      description: `${e.state === 'Held' ? 'Earnings held' : 'Net earnings recorded'} · ${e.service.id}`,
      credit: e.net,
      debit: null,
      refund: null,
      status: e.state,
      affects: false,
      ref: e.service.id,
      gross: e.gross,
      commission: e.commission,
    })),
    ...refunds.map((r) => ({
      id: `RTX-${r.service.id.replace(/\D/g, '')}`,
      at: r.at,
      serviceType: 'Appointment',
      description: `Appointment cancelled by astrologer · user refunded · ${r.service.id}`,
      credit: null,
      debit: null,
      refund: r.amount,
      status: 'No earnings',
      affects: false,
      ref: r.service.id,
    })),
    ...ledger,
  ].sort((x, y) => x.at.localeCompare(y.at));
  let running = 0;
  for (const t of transactions) {
    if (t.affects) running = t.balanceAfter;
    t.balanceAfter = running;
  }
  transactions.reverse();

  const knownNet = (pred) => round2(earnings.filter(pred).reduce((t, e) => t + (e.net ?? 0), 0));
  const wallet = {
    available,
    held: knownNet((e) => e.state === 'Held'),
    heldTextQuestions: earnings.filter((e) => e.state === 'Held' && e.rate === undefined).length,
    totalEarnings: knownNet((e) => e.service.completed && e.net !== null),
    totalWithdrawn: round2(withdrawals.filter((x) => x.status === 'Paid').reduce((t, x) => t + x.amount, 0)),
    totalRefunded: round2(refunds.reduce((t, r) => t + r.amount, 0)),
    earnings,
    settlements: [...settlements].reverse(),
    withdrawals: withdrawals.reverse(),
    transactions,
  };

  // ---------- availability & schedule ----------
  const availability = buildAvailability(a, services, snapshot);
  // ---------- content ----------
  const content = buildContent(a, snapshot);
  // ---------- documents ----------
  const documents = buildDocuments(a);

  return {
    services,
    reviews,
    rating,
    publishedCount: published.length,
    disputes: disputes.sort((x, y) => y.raisedAt.localeCompare(x.raisedAt)),
    complaints: complaints.sort((x, y) => y.raisedAt.localeCompare(x.raisedAt)),
    subscriptions: subscriptions.sort((x, y) => y.purchasedAt.localeCompare(x.purchasedAt)),
    failures,
    remedies: remedies.sort((x, y) => y.suggestedAt.localeCompare(x.suggestedAt)),
    followers: followers.sort((x, y) => y.followedAt.localeCompare(x.followedAt)),
    followHistory: followHistory.sort((x, y) => y.at.localeCompare(x.at)),
    wallet,
    availability,
    content,
    documents,
    linkedUsers: linked.length,
    todayStart: todayStart.getTime(),
    monthStart: monthStart.getTime(),
  };
}

// ---------- availability ----------
function buildAvailability(a, services, snapshot) {
  const r = rng(hashString(`${a.id}:schedule`));
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const off = r.pick(['Sunday', 'Tuesday', 'Wednesday', 'Sunday']);
  const morning = r.pick([['09:00', '13:00'], ['10:00', '13:30'], ['08:30', '12:30']]);
  const evening = r.pick([['16:00', '20:00'], ['17:00', '21:00'], ['15:30', '19:30']]);
  const duration = r.pick([15, 30]);
  const buffer = r.pick([5, 10]);
  const weekly = days.map((d) => ({
    day: d,
    working: d !== off,
    sessions: d === off ? [] : [morning, evening],
    breaks: d === off ? [] : [[morning[1], evening[0]]],
  }));

  // Busy history = the astrologer's own Call / Chat sessions (last 30 days).
  const busy = services
    .filter((s) => (s.type === 'Instant Call' || s.type === 'Instant Chat') && new Date(s.connectedAt).getTime() > snapshot - 30 * DAY)
    .map((s) => ({ state: 'Busy', from: s.connectedAt, to: s.endedAt, note: `${s.type} ${s.id}` }));
  // DND periods placed outside active Call / Chat sessions (AD-74).
  const sessions = services.filter((s) => s.connectedAt).map((s) => [new Date(s.connectedAt).getTime(), new Date(s.endedAt).getTime()]);
  const clashes = (from, to) => sessions.some(([x, y]) => from < y && to > x);
  const dnd = [];
  const aLast = new Date(a.lastActiveAt).getTime();
  for (let i = 0; i < 4; i++) {
    const from = snapshot - r.between(2 * DAY, 28 * DAY);
    const to = from + r.between(2 * HOUR, 30 * HOUR);
    if (to > aLast || clashes(from, to)) continue;
    dnd.push({ state: 'DND', from: iso(from), to: iso(to), note: r.pick(['Planned unavailability', 'Personal commitment', 'Travel']) });
  }
  if (a.availability === 'DND') dnd.push({ state: 'DND', from: iso(snapshot - r.between(HOUR, 6 * HOUR)), to: null, note: 'DND Mode is ON' });
  const history = [...busy, ...dnd].sort((x, y) => y.from.localeCompare(x.from));

  // Next 7 days: booked = the astrologer's confirmed appointments.
  const confirmed = services.filter((s) => s.type === 'Appointment' && s.status === 'Confirmed');
  const closures = [];
  const upcoming = [];
  const minutesOf = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
  for (let i = 0; i < 7; i++) {
    const d = new Date(snapshot);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    const name = days[(d.getDay() + 6) % 7];
    const schedule = weekly.find((x) => x.day === name);
    const booked = confirmed.filter((s) => new Date(s.serviceAt).toDateString() === d.toDateString());
    const slotLen = duration + buffer;
    const capacity = schedule.working ? schedule.sessions.reduce((t, [f, to]) => t + Math.floor((minutesOf(to) - minutesOf(f)) / slotLen), 0) : 0;
    const closed = schedule.working && !booked.length && i > 1 && r.chance(0.08);
    if (closed) closures.push({ date: d.toISOString(), reason: r.pick(['Temple festival', 'Family function', 'Travel']), at: iso(snapshot - r.between(DAY, 5 * DAY)), affected: 0 });
    upcoming.push({
      date: d.toISOString(),
      day: name,
      working: schedule.working && !closed,
      closed,
      booked,
      available: schedule.working && !closed ? Math.max(0, capacity - booked.length) : 0,
      blocked: closed ? capacity : 0,
    });
  }
  // Past closures (no confirmed appointments on those dates).
  for (let i = 0; i < 2; i++) {
    const day = snapshot - r.between(10 * DAY, 120 * DAY);
    if (day < new Date(a.joinedAt).getTime() || day > aLast) continue;
    const hasAppt = services.some((s) => s.type === 'Appointment' && new Date(s.serviceAt).toDateString() === new Date(day).toDateString());
    if (hasAppt) continue;
    closures.push({ date: iso(day), reason: r.pick(['Temple festival', 'Family function', 'Travel', 'Health']), at: iso(day - r.between(DAY, 6 * DAY)), affected: 0 });
  }
  const changes = [];
  const joined = new Date(a.joinedAt).getTime();
  changes.push({ at: iso(joined + HOUR), text: `Weekly schedule created: ${morning.join('–')} and ${evening.join('–')}, ${duration}-minute appointments, ${buffer}-minute buffer` });
  if (aLast - joined > 30 * DAY && r.chance(0.6)) changes.push({ at: iso(r.between(joined + 7 * DAY, aLast)), text: `Weekly off day set to ${off}` });
  if (aLast - joined > 60 * DAY && r.chance(0.4)) changes.push({ at: iso(r.between(joined + 30 * DAY, aLast)), text: `Buffer changed to ${buffer} minutes` });

  return {
    current: a.availability,
    weekly,
    duration,
    buffer,
    history,
    closures: closures.sort((x, y) => y.date.localeCompare(x.date)),
    upcoming,
    changes: changes.sort((x, y) => y.at.localeCompare(x.at)),
  };
}

// ---------- content ----------
function buildContent(a, snapshot) {
  const r = rng(hashString(`${a.id}:content`));
  const joined = new Date(a.joinedAt).getTime();
  const aLast = new Date(a.lastActiveAt).getTime();
  const ageDays = (Math.min(aLast, snapshot) - joined) / DAY;
  const count = ageDays < 1 ? 0 : Math.min(18, 2 + Math.floor(ageDays / 60) + Math.floor(r.rand() * 4));
  const titles = ['Weekly guidance for all Rasis', 'Remedies for Saturn transit', 'Choosing an auspicious date', 'Understanding your Navamsa', 'Rahu–Ketu transit and its effects', 'Vastu tips for the home office', 'Numerology of your name', 'Full moon observances'];
  const audiences = ['Public', 'Public', 'Followers', 'Subscribers', 'Silver', 'Gold', 'Platinum'];
  const posts = [];
  const num = a.id.replace(/\D/g, '');
  for (let i = 0; i < count; i++) {
    const created = r.between(joined + HOUR, Math.min(aLast, snapshot));
    const kind = r.chance(0.6) ? 'Text' : 'Image';
    const x = r.rand();
    let status = x < 0.72 ? 'Published' : x < 0.86 ? 'Scheduled' : 'Draft';
    const history = [{ at: iso(created), text: status === 'Draft' ? 'Saved as draft' : 'Created' }];
    let publishedAt = null;
    let scheduledFor = null;
    if (status === 'Published') {
      publishedAt = created + r.between(0, 2 * DAY);
      if (publishedAt > snapshot) publishedAt = created;
      history.push({ at: iso(publishedAt), text: 'Published' });
      if (r.chance(0.2)) history.push({ at: iso(Math.min(snapshot, publishedAt + r.between(HOUR, 3 * DAY))), text: 'Edited' });
    }
    if (status === 'Scheduled') {
      scheduledFor = snapshot + r.between(HOUR, 10 * DAY);
      history.push({ at: iso(created + MIN), text: `Scheduled for ${new Date(scheduledFor).toLocaleString('en-IN')}` });
    }
    const hidden = status === 'Published' && r.chance(0.06);
    if (hidden) history.push({ at: iso(Math.min(snapshot, publishedAt + r.between(HOUR, 2 * DAY))), text: 'Hidden by Platform Admin after review' });
    posts.push({
      id: `PST-${num}${String(i + 1).padStart(3, '0')}`,
      title: r.pick(titles),
      kind,
      audience: r.pick(audiences),
      status,
      hidden,
      createdAt: iso(created),
      publishedAt: publishedAt ? iso(publishedAt) : null,
      scheduledFor: scheduledFor ? iso(scheduledFor) : null,
      likes: status === 'Published' ? r.between(3, 400) : 0,
      comments: status === 'Published' ? r.between(0, 60) : 0,
      history: history.sort((x2, y) => y.at.localeCompare(x2.at)),
    });
  }
  posts.sort((x, y) => y.createdAt.localeCompare(x.createdAt));

  // Subscriber benefit content: Daily and Weekly Predictions (AD-140).
  const predictions = [];
  if (a.status === 'Active' && ageDays > 14) {
    for (let d = 0; d < 14; d++) {
      const day = new Date(snapshot);
      day.setHours(6, 0, 0, 0);
      day.setDate(day.getDate() - d);
      const t = day.getTime();
      const status = t > snapshot ? 'Pending' : r.chance(0.92) ? 'Delivered' : 'Missed';
      predictions.push({ id: `PRD-${num}-D${d}`, type: 'Daily Predictions', for: iso(t), audience: 'Subscribers', status });
      if (day.getDay() === 1) predictions.push({ id: `PRD-${num}-W${d}`, type: 'Weekly Predictions', for: iso(t), audience: 'Subscribers', status: t > snapshot ? 'Pending' : 'Delivered' });
    }
  }
  return { posts, predictions };
}

// ---------- documents ----------
function buildDocuments(a) {
  const r = rng(hashString(`${a.id}:documents`));
  const joined = new Date(a.joinedAt).getTime();
  const docs = [];
  const add = (name, type, related, status) => {
    docs.push({ id: `DOC-${a.id.replace(/\D/g, '')}${String(docs.length + 1).padStart(2, '0')}`, name, type, related, status, uploadedAt: iso(joined + r.between(HOUR, 3 * DAY)), uploadedBy: 'Astrologer', size: `${r.between(200, 2400)} KB` });
  };
  add('profile-photo.jpg', 'Profile Photo', '—', '—');
  if (a.verification.kyc !== 'Not Submitted') add('kyc-document.pdf', 'KYC document', 'KYC', a.verification.kyc);
  if (a.verification.identity !== 'Not Submitted') add('identity-proof.pdf', 'Identity document', 'Identity', a.verification.identity);
  if (a.verification.certificate !== 'Not Submitted') {
    for (const q of a.qualifications) add(`${q.toLowerCase().replace(/[^a-z]+/g, '-')}.pdf`, 'Certificate / Qualification', 'Certificate', a.verification.certificate);
  }
  if (r.chance(0.35)) add('supporting-document.pdf', 'Supporting Document', '—', '—');
  return docs;
}

// ---------- activity (§15: includes Admin actions) ----------
export const ASTRO_ACTIVITY_CATEGORIES = [
  'Account',
  'Login / Device',
  'Professional Profile',
  'Services',
  'Wallet',
  'Subscriptions',
  'Content',
  'Reviews',
  'Remedies',
  'Disputes',
  'Availability',
  'Documents',
  'Assistants',
  'Admin Actions',
];

function buildActivity(base, a, audit, edits, notes) {
  const out = [];
  const add = (at, category, title, ref = '', admin = null) => at && out.push({ id: `${category}-${out.length}`, at, category, title, ref, admin });
  const joined = a.joinedAt;
  add(joined, 'Account', `Registered via ${a.registrationMethod.toLowerCase()}`);
  add(a.lastLoginAt, 'Login / Device', 'Signed in to the Astrologer App');
  add(a.lastActiveAt, 'Login / Device', 'Last active');
  for (const d of base.documents) add(d.uploadedAt, 'Documents', `Uploaded ${d.type.toLowerCase()}`, d.id);
  for (const s of base.services) {
    if (s.type === 'Text Question') {
      add(s.createdAt, 'Services', `Text Question received from ${s.user.name}`, s.id);
      if (s.answeredAt) add(s.answeredAt, 'Services', 'Answer submitted', s.id);
    } else if (s.type === 'Appointment') {
      add(s.createdAt, 'Services', `Appointment booked by ${s.user.name}`, s.id);
      if (s.cancellation) add(s.cancellation.at, 'Services', 'Appointment cancelled by astrologer', s.id);
      else if (s.completed) add(s.completedAt, 'Services', 'Appointment completed', s.id);
    } else {
      add(s.connectedAt, 'Services', `${s.type} with ${s.user.name}`, s.id);
    }
  }
  for (const st of base.wallet.settlements) add(st.at, 'Wallet', `Settlement released (${st.count} appointments)`, st.id);
  for (const w of base.wallet.withdrawals) add(w.requestedAt, 'Wallet', `Withdrawal requested · ${w.status}`, w.id);
  for (const s of base.subscriptions) add(s.purchasedAt, 'Subscriptions', `${s.renewalOf ? 'Subscription renewed' : 'New subscriber'} · ${s.plan} · ${s.user.name}`, s.id);
  for (const p of base.content.posts) for (const h of p.history) add(h.at, 'Content', `${h.text} · ${p.title}`, p.id);
  for (const rv of base.reviews) for (const h of rv.replyHistory) add(h.at, 'Reviews', `${h.action} to a review by ${rv.user.name}`, rv.id);
  for (const r of base.remedies) add(r.suggestedAt, 'Remedies', `Remedy suggested · ${r.title}`, r.id);
  for (const d of base.disputes) for (const resp of d.responses) if (resp.from.includes('(Astrologer)')) add(resp.at, 'Disputes', `Dispute answered for ${d.questionId}`, d.id);
  for (const h of base.availability.history) if (h.state === 'DND') add(h.from, 'Availability', `DND turned on (${h.note})`, '');
  for (const c of base.availability.changes) add(c.at, 'Professional Profile', c.text);
  for (const e of audit) add(e.at, 'Admin Actions', `${e.action}: ${e.previousStatus} → ${e.newStatus} · Reason: ${e.reason}`, e.id, { id: e.adminId, name: e.adminName });
  for (const e of edits) add(e.at, 'Admin Actions', `Profile details edited (${e.changes.map((c) => c.label).join(', ')}) · Reason: ${e.reason}`, e.id, { id: e.adminId, name: e.adminName });
  for (const n of notes) add(n.at, 'Admin Actions', 'Internal note added', n.id, { id: n.by.id, name: n.by.name });
  // Astrologer Assistant activity — the same records shown in the Assistant
  // Profile (assistant-management.md §6).
  for (const e of activityForAstrologer(a.id)) {
    out.push({ id: e.id, at: e.at, category: 'Assistants', title: `${e.assistant.name} (${e.assistant.id}) · ${e.action} · ${e.module}: ${e.description}`, ref: e.assistant.id, admin: null });
  }
  return out.sort((x, y) => y.at.localeCompare(x.at));
}
