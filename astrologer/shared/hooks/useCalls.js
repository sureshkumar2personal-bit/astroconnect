import { createStore, useStore } from '../lib/store.js';
import { TODAY } from '../lib/format.js';
import { SIM_CHAT, SIM_USER, callsSeed } from '../data/mockCalls.js';

// Instant Call & Chat state and rules (spec 06_INSTANT_CALL_AND_CHAT.md, AD-103 – AD-111).
// Prototype only: no call, audio, chat connection, payment or notification is involved;
// incoming requests are simulated and state resets on reload.
// Online / Offline / DND and the Call / Chat switches live in useAvailability (AD-04 – AD-07).

export const ACCEPT_SECONDS = 30; // AD-104
export const MIN_PACKAGE_MINUTES = 5; // AD-106
export const COMMISSION = 0.02; // AD-124
export const CHAT_VISIBLE_HOURS = 24; // AD-111

export const callsStore = createStore(structuredClone(callsSeed));

let clock = null;
let dropTimer = null;
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
function startClock() {
  clearInterval(clock);
  clock = setInterval(() => {
    const s = callsStore.get();
    if (!s.req && !s.session) { stopClock(); return; }
    if (s.req) {
      if (s.req.left <= 1) endRequest('Expired');
      else callsStore.patch({ req: { ...s.req, left: s.req.left - 1 } });
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

/** Declined / Expired release the lock and restore availability (AD-104, AD-105). */
function endRequest(status) {
  const s = callsStore.get();
  if (!s.req) return;
  callsStore.patch({ req: null, lock: status === 'Accepted' ? s.lock : null });
  if (status !== 'Accepted') notify(`Request ${status}. Lock released; the user sees Try Again / Try Some Other Astrologer.`);
}

/** End the session: billing timer stops, lock released, record added to history (AD-105, AD-107). */
function endSession(auto = false) {
  const s = callsStore.get();
  const c = s.session;
  if (!c) return;
  clearTimeout(dropTimer);
  const { elapsed } = sessionClock(c, Date.now());
  const record = {
    id: `CON-${7800 + s.hist.length}`, svc: svcName(c.s), user: c.user, uid: SIM_USER.uid,
    at: TODAY.toISOString(), dur: `${Math.floor(elapsed / 60)}m ${String(elapsed % 60).padStart(2, '0')}s`,
    pk: `${c.pk.m} min`, amt: c.pk.p, pay: 'Paid · prepaid', att: '', msgs: c.s === 'chat' ? SIM_CHAT : undefined,
  };
  callsStore.patch({ session: null, lock: null, hist: [record, ...s.hist] });
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
  removePackage: (s, i) => callsStore.patch((st) => ({ pk: { ...st.pk, [s]: st.pk[s].filter((_, j) => j !== i) } })),

  /** Simulate an incoming request (prototype). Returns an error message, or '' when the popup opens. */
  simulate(s, av) {
    const st = callsStore.get();
    if (!availableFor(av, s)) return `${tabLabel(s)} requests can't arrive: the service is off, you're Offline, or DND is on.`;
    if (st.lock) return 'Busy: another request or session already holds the lock.';
    if (!st.pk[s].length) return `Add an ${svcName(s)} package first.`;
    callsStore.patch({ lock: `${tabLabel(s)} request`, req: { s, user: SIM_USER.name, pk: st.pk[s][0], left: ACCEPT_SECONDS } });
    startClock();
    return '';
  },
  decline: () => endRequest('Declined'),
  /** Accept within 30 seconds → the session starts; the lock stays held (AD-104, AD-105). */
  accept() {
    const r = callsStore.get().req;
    if (!r) return;
    const now = Date.now();
    callsStore.patch({ session: { s: r.s, user: r.user, pk: r.pk, start: now, state: 'Active', pausedMs: 0, dropAt: null }, lock: 'In session', now });
    endRequest('Accepted');
    startClock();
  },
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
