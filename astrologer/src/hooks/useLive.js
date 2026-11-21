import { createStore, useStore } from '@/lib/store.js';
import { TODAY, dt, isoDay } from '@/lib/format.js';
import { liveRoomSeed, liveSeed } from '@/data/mockLive.js';

// Live Sessions state and rules (spec 07_LIVE_SESSIONS.md). Prototype only: no stream,
// camera, microphone or notification is involved; state resets on reload.

export const PAUSE_LIMIT_MS = 5 * 60 * 1000; // AD-116
export const MONTH = isoDay(TODAY).slice(0, 7); // calendar month of the prototype's "today"

export const liveStore = createStore(liveSeed);
let pauseTimer = null;

export const usedThisMonth = (s) => !!s.live || s.past.some((p) => p.date.slice(0, 7) === MONTH);
/** Can a new Live be created now? (Verified, nothing scheduled, none held this month — AD-112) */
export const canCreate = (s) => s.verified && !s.scheduled && !usedThisMonth(s);
export const audienceLabel = (f) => (f.aud === 'Specific tiers' ? `${f.tiers.join(', ')} subscribers` : f.aud);

const setForm = (part) => liveStore.patch((s) => ({ form: { ...s.form, ...part } }));

/** Validate the Create Live form; returns an error message or ''. */
export function validate(f) {
  if (!f.topic.trim() || !f.desc.trim()) return 'Topic and Description are required.';
  if (f.aud === 'Specific tiers' && !f.tiers.length) return 'Choose at least one tier.';
  if (f.mode === 'schedule' && (!f.when || dt(f.when) <= TODAY)) return 'Choose a future date and time.';
  return '';
}

function start() {
  liveStore.patch((s) => ({
    live: { ...s.scheduled, start: Date.now(), paused: false, pausedAt: null, ...structuredClone(liveRoomSeed) },
    scheduled: null,
  }));
}

/** End the Live: record it in Past Lives (which uses this month's Live) and keep a summary. */
function end(auto = false) {
  clearTimeout(pauseTimer);
  liveStore.patch((s) => {
    const l = s.live;
    if (!l) return {};
    const mins = Math.max(1, Math.round((Date.now() - l.start) / 6e4));
    const record = {
      id: `LV-${String(Date.now()).slice(-4)}`, topic: l.topic, date: TODAY.toISOString(),
      dur: `${mins} min`, parts: l.parts, comments: l.comments.length, auto,
    };
    return { live: null, past: [record, ...s.past] };
  });
  if (auto && window.location.hash.startsWith('#/live')) window.location.hash = '/live/summary';
}

export const liveActions = {
  setForm,
  toggleTier: (t) => setForm({ tiers: liveStore.get().form.tiers.includes(t) ? liveStore.get().form.tiers.filter((x) => x !== t) : [...liveStore.get().form.tiers, t] }),
  /** Schedule or start from the form. Returns an error message, or '' on success. */
  create() {
    const { form: f } = liveStore.get();
    const err = validate(f);
    if (err) return err;
    const entry = { topic: f.topic.trim(), desc: f.desc.trim(), aud: audienceLabel(f), thumb: f.thumb, when: f.mode === 'schedule' ? f.when : TODAY.toISOString() };
    liveStore.patch({ scheduled: entry, form: { ...liveSeed.form } });
    if (f.mode === 'now') start();
    return '';
  },
  /** Cancelling frees the month again (AD-112); the audience is notified (AD-118). */
  cancel: () => liveStore.patch({ scheduled: null }),
  start,
  pause() {
    liveStore.patch((s) => ({ live: { ...s.live, paused: true, pausedAt: Date.now() } }));
    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(() => end(true), PAUSE_LIMIT_MS);
  },
  resume() {
    clearTimeout(pauseTimer);
    liveStore.patch((s) => ({ live: { ...s.live, paused: false, pausedAt: null } }));
  },
  mute: (i) => liveStore.patch((s) => ({ live: { ...s.live, comments: s.live.comments.map((c, j) => (j === i ? { ...c, muted: true } : c)) } })),
  remove: (i) => liveStore.patch((s) => ({ live: { ...s.live, comments: s.live.comments.filter((_, j) => j !== i) } })),
  end: () => end(false),
};

export default function useLive() {
  return useStore(liveStore);
}
