import { createStore, useStore } from '@/lib/store.js';
import { TODAY } from '@/lib/format.js';
import { callsSeed } from '@/data/mockCalls.js';
import { audienceSeed } from '@/data/mockAudience.js';
import { profileFor } from '@/data/mockSessionProfiles.js';

// Instant Call & Chat state and rules (spec 06_INSTANT_CALL_AND_CHAT.md, AD-103 – AD-111).
// Prototype only: no call, audio, chat connection, payment or notification is involved;
// incoming requests are simulated (from existing customer records) and state resets on reload.
// Incoming requests wait in two separate FIFO queues, one per service (queue.call / queue.chat):
// first in, first served; each still expires after 30 seconds (AD-104). Only one consultation runs
// at a time (AD-105). Queueing several requests at once is a change to AD-104/AD-105 (flagged).
// Online / Offline / DND and the Call / Chat switches live in useAvailability (AD-04 – AD-07).

export const ACCEPT_SECONDS = 30; // AD-104
export const MIN_PACKAGE_MINUTES = 5; // AD-106
export const COMMISSION = 0.02; // AD-124
export const CHAT_VISIBLE_HOURS = 24; // AD-111
export const WAITING_MAX = 3; // Call and Chat share one waiting list of at most 3 users (product decision 2026-11-26)

export const callsStore = createStore(structuredClone(callsSeed));
if (!callsStore.get().queue) callsStore.patch({ queue: { call: [], chat: [] } });

let clock = null;
let dropTimer = null;
let seq = 0; // request ids
let notify = () => {}; // toast function of the open page (expiry / auto-end messages)

export const svcName = (s) => (s === 'call' ? 'Instant Call' : 'Instant Chat');
export const tabLabel = (s) => (s === 'call' ? 'Call' : 'Chat');

/** Can a request for service `s` arrive right now? Online, not DND, switch on (AD-04 – AD-07, AD-104). */
export const availableFor = (av, s) => av.mode === 'online' && !av.dnd && !!av[s];

/** True while an Instant Call or Chat is running (DND can't be turned on then — AD-74). */
export const hasActiveSession = () => !!callsStore.get().session;

/** Elapsed / left seconds of the session. Call reconnection keeps the remaining paid time (AD-109). */
export function sessionClock(c, now) {
  const paused = c.pausedMs + (c.dropAt && c.s === 'call' ? now - c.dropAt : 0);
  const elapsed = Math.max(0, Math.floor((now - c.start - paused) / 1000));
  return { elapsed, left: Math.max(0, c.pk.m * 60 - elapsed) };
}

const mmss = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
export const sessionTime = (c, now) => {
  const { elapsed, left } = sessionClock(c, now);
  return `${mmss(elapsed)} elapsed · ${mmss(left)} left`;
};

function stopClock() { clearInterval(clock); clock = null; }
const queued = (s) => (s.queue?.call?.length || 0) + (s.queue?.chat?.length || 0);
function startClock() {
  if (clock) return;
  clock = setInterval(() => {
    const s = callsStore.get();
    if (!queued(s) && !s.session) { stopClock(); return; }
    if (queued(s)) {
      // Count every waiting request down; expired ones leave the queue (order of the rest is unchanged).
      const tick = (list) => list.map((r) => ({ ...r, left: r.left - 1 }));
      const call = tick(s.queue.call), chat = tick(s.queue.chat);
      const expired = [...call, ...chat].filter((r) => r.left <= 0);
      callsStore.patch({ queue: { call: call.filter((r) => r.left > 0), chat: chat.filter((r) => r.left > 0) }, now: Date.now() });
      expired.forEach((r) => logRequest(r, 'Missed', 'Not accepted within 30 s; the request expired.'));
      expired.forEach((r) => notify(`${r.user}'s ${svcName(r.s)} request expired. The user sees Try Again / Try Some Other Astrologer.`));
    }
    const c = callsStore.get().session;
    if (c) {
      const now = Date.now();
      // Unpaid extension: the session ends automatically when the package time runs out (AD-107).
      if (sessionClock(c, now).left <= 0) endSession(true);
      else callsStore.patch({ now });
    }
  }, 1000);
}

/** Add a request's outcome to Request History (newest first). */
function logRequest(r, status, outcome) {
  const at = new Date(r.at);
  const iso = `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, '0')}-${String(at.getDate()).padStart(2, '0')}T${at.toTimeString().slice(0, 8)}`;
  callsStore.patch((st) => ({ reqLog: [{ id: r.id, s: r.s, user: r.user, uid: r.uid, at: iso, status, topic: profileFor(r.uid).topic, outcome }, ...(st.reqLog || [])] }));
}

/** The shared waiting list, oldest first. `av` (optional) keeps only services whose switch is ON. */
export function waitingList(st, av) {
  const q = st.queue || { call: [], chat: [] };
  return ['call', 'chat'].filter((s) => !av || av[s]).flatMap((s) => q[s] || []).sort((a, b) => a.at - b.at);
}

/** Remove one request from its queue (Declined / Accepted); the next one moves up. */
function removeRequest(id) {
  const s = callsStore.get();
  const r = [...s.queue.call, ...s.queue.chat].find((x) => x.id === id);
  if (!r) return null;
  callsStore.patch({ queue: { ...s.queue, [r.s]: s.queue[r.s].filter((x) => x.id !== id) } });
  return r;
}

/** Next customer for a simulated request: existing (not blocked) customers in turn, skipping anyone
 *  already waiting in that queue or in the running session. No new users are invented. */
let nextCustomer = 0;
function pickCustomer(s, svc) {
  const busy = new Set([...s.queue.call, ...s.queue.chat].map((r) => r.uid).concat(s.session?.uid)); // one place per user in the shared list
  const people = audienceSeed.list.filter((u) => !u.blocked);
  for (let i = 0; i < people.length; i++) {
    const u = people[(nextCustomer + i) % people.length];
    if (!busy.has(u.uid)) { nextCustomer = (nextCustomer + i + 1) % people.length; return u; }
  }
  return null;
}

/** End the session: billing timer stops, lock released, record added to history (AD-105, AD-107). */
function endSession(auto = false) {
  const s = callsStore.get();
  const c = s.session;
  if (!c) return;
  clearTimeout(dropTimer);
  const { elapsed } = sessionClock(c, Date.now());
  const record = {
    id: `CON-${7800 + s.hist.length}`, svc: svcName(c.s), user: c.user, uid: c.uid,
    at: TODAY.toISOString(), dur: `${Math.floor(elapsed / 60)}m ${String(elapsed % 60).padStart(2, '0')}s`,
    pk: `${c.pk.m} min`, amt: c.pk.p, pay: 'Paid · prepaid', att: '', status: 'Completed', review: null, notes: '',
    // Remedies and files shared in the chat (Attach remedy / file / PDF).
    remedies: (c.msgs || []).filter((m) => m.kind === 'remedy').map((m) => m.text),
    files: (c.msgs || []).filter((m) => m.kind === 'file').map((m) => m.text),
    // The conversation that actually took place (astrologer messages; no user replies are simulated).
    msgs: c.s === 'chat' ? (c.msgs || []).filter((m) => m.from !== 'sys').map((m) => [m.from === 'astro' ? 'me' : 'u', m.text]) : undefined,
  };
  callsStore.patch({ session: null, hist: [record, ...s.hist] });
  notify(auto
    ? 'Package time ended — the session ended automatically. Billing timer stopped; user will give a mandatory rating.'
    : 'Session ended. Billing timer stopped; user will give a mandatory rating.');
}

export const callsActions = {
  setNotifier: (fn) => { notify = fn; },
  setTab: (tab) => callsStore.patch({ tab }),

  /** Add a prepaid package. Returns an error message, or '' on success (AD-106). */
  addPackage(s, minutes, price) {
    const m = Number(minutes);
    const p = Number(price);
    if (!(m >= MIN_PACKAGE_MINUTES)) return 'Minimum package duration is 5 minutes.';
    if (!(p > 0)) return 'Enter a price.';
    callsStore.patch((st) => ({ pk: { ...st.pk, [s]: [...st.pk[s], { m, p }] } }));
    return '';
  },
  /** Edit a package's duration / price in place. Returns an error message, or '' when saved. */
  updatePackage(s, i, minutes, price) {
    const m = Number(minutes); const p = Number(price);
    if (!(m >= MIN_PACKAGE_MINUTES)) return 'Minimum package duration is 5 minutes.';
    if (!(p > 0)) return 'Enter a price above ₹0.';
    callsStore.patch((st) => ({ pk: { ...st.pk, [s]: st.pk[s].map((x, j) => (j === i ? { m, p } : x)) } }));
    return '';
  },
  /** Create or edit an offer (prototype; Call/Chat offers are pending product-owner confirmation). */
  saveOffer(o) {
    const name = String(o.name || '').trim(); const value = Number(o.value);
    if (!name) return 'Give the offer a name.';
    if (!(value > 0)) return 'Enter a discount above 0.';
    if (o.kind === 'pct' && value > 99) return 'A percentage discount can be at most 99%.';
    if (!o.from || !o.to) return 'Choose the start and end dates.';
    if (o.to < o.from) return 'The end date must be on or after the start date.';
    callsStore.patch((st) => {
      const list = st.offers || [];
      const clean = { ...o, name, value };
      return { offers: o.id ? list.map((x) => (x.id === o.id ? { ...x, ...clean } : x)) : [{ ...clean, id: `OF-${Date.now()}`, used: 0, paused: false }, ...list] };
    });
    return '';
  },
  /** Pause or resume an offer. */
  toggleOffer: (id) => callsStore.patch((st) => ({ offers: (st.offers || []).map((x) => (x.id === id ? { ...x, paused: !x.paused } : x)) })),
  removePackage: (s, i) => callsStore.patch((st) => ({ pk: { ...st.pk, [s]: st.pk[s].filter((_, j) => j !== i) } })),

  /** An incoming request arrives for service `s` (from lib/requestSource.js, or the test buttons):
   *  it joins the end of that service's queue. Returns an error message, or '' when it was added. */
  receive(s, av) {
    const st = callsStore.get();
    if (!availableFor(av, s)) return `${tabLabel(s)} requests can't arrive: the service is off, you're Offline, or DND is on.`;
    if (!st.pk[s].length) return `Add an ${svcName(s)} package first.`;
    if (queued(st) >= WAITING_MAX) return `The waiting list is full (${WAITING_MAX} users). New requests can join when a place frees up.`;
    const u = pickCustomer(st, s);
    if (!u) return 'Every customer already has a request waiting.';
    const pk = st.pk[s][st.queue[s].length % st.pk[s].length];
    seq += 1;
    const req = { id: `RQ-${seq}`, s, user: u.name, uid: u.uid, sub: u.sub, pk, at: Date.now(), left: ACCEPT_SECONDS };
    callsStore.patch({ queue: { ...st.queue, [s]: [...st.queue[s], req] } });
    startClock();
    return '';
  },
  /** Test button on the Instant Call & Chat page: same as an arriving request. */
  simulate(s, av) { return callsActions.receive(s, av); },
  /** Decline any waiting request; the rest keep their order. */
  decline: (id) => { const r = removeRequest(id); if (r) logRequest(r, 'Declined', 'Declined by you. The user was offered Try Again / Try Some Other Astrologer.'); if (r) notify(`${r.user}'s ${svcName(r.s)} request declined. The user sees Try Again / Try Some Other Astrologer.`); },
  /** Accept the first request in a queue (first in, first served) → the session starts (AD-104, AD-105). */
  accept(id, av) {
    const st = callsStore.get();
    if (st.session) return 'Finish your current session first.';
    const r = [...st.queue.call, ...st.queue.chat].find((x) => x.id === id);
    if (!r) return '';
    // One shared list: only the oldest waiting user (among the services that are ON) can be accepted.
    if (waitingList(st, av)[0]?.id !== id) return 'Accept the first request in the waiting list first.';
    removeRequest(id);
    logRequest(r, 'Accepted', `Joined after ${Math.max(1, Math.round((Date.now() - r.at) / 1000))} s`);
    const now = Date.now();
    const started = `${r.s === 'call' ? 'Call' : 'Chat'} started. ${r.pk.m} min booked.`;
    callsStore.patch({ session: {
      s: r.s, user: r.user, uid: r.uid, sub: r.sub, pk: r.pk, at: r.at, start: now, state: 'Active', pausedMs: 0, dropAt: null,
      // A chat opens with the User's question as their first message (sample data, mockSessionProfiles).
      msgs: [{ from: 'sys', text: started, t: now }, ...(r.s === 'chat' ? [{ from: 'user', text: profileFor(r.uid).question, t: now }] : [])],
      muted: false, speaker: false,
      // Session window (prototype): 'compact' window → 'expanded' workspace → 'minimized' pill.
      // Phones open it full screen and minimize it to a bar above the bottom navigation.
      mode: typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches ? 'expanded' : 'compact',
    }, now });
    startClock();
    return '';
  },
  /** Change the session window: 'compact' | 'expanded' | 'minimized'. Same session, messages and timer. */
  setMode: (mode) => { const c = callsStore.get().session; if (c) callsStore.patch({ session: { ...c, mode } }); },
  /** Astrologer sends a chat message in the active consultation (kept with the session).
   *  kind: undefined (text) | 'file' (meta: { size }) | 'link' | 'remedy'. Prototype: nothing is uploaded. */
  send(text, kind, meta) {
    const c = callsStore.get().session; const t = String(text || '').trim();
    if (!c || c.s !== 'chat' || !t) return;
    const m = { from: 'astro', text: t, t: Date.now(), ...(kind ? { kind } : {}), ...(meta ? { meta } : {}) };
    callsStore.patch({ session: { ...c, msgs: [...c.msgs, m] } });
  },
  /** Call controls for the active call (prototype: no audio is connected). */
  toggleMute: () => { const c = callsStore.get().session; if (c) callsStore.patch({ session: { ...c, muted: !c.muted } }); },
  toggleSpeaker: () => { const c = callsStore.get().session; if (c) callsStore.patch({ session: { ...c, speaker: !c.speaker } }); },
  /** Simulated disconnect: reconnects after 3 seconds (AD-109). */
  drop() {
    const c = callsStore.get().session;
    if (!c || c.dropAt) return;
    const state = c.s === 'call' ? 'Reconnecting (up to 5 min, remaining time kept)' : 'Reconnecting (messages saved)';
    callsStore.patch({ session: { ...c, state, dropAt: Date.now() } });
    clearTimeout(dropTimer);
    dropTimer = setTimeout(() => {
      const cur = callsStore.get().session;
      if (!cur) return;
      const pausedMs = cur.pausedMs + (cur.s === 'call' ? Date.now() - cur.dropAt : 0);
      callsStore.patch({ session: { ...cur, state: 'Active', dropAt: null, pausedMs } });
    }, 3000);
  },
  end: () => endSession(false),
};

export default function useCalls() {
  return useStore(callsStore);
}
