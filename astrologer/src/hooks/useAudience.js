import { createStore, useStore } from '@/lib/store.js';
import { audienceSeed } from '@/data/mockAudience.js';

// Audience state and rules (spec 11_AUDIENCE.md). One list with All Users / Followers / Subscribers
// filters (AD-135); search, sort and the "Since" date filter are kept when returning (AD-77, AD-137).
// Prototype only; state resets on reload.

export const audienceStore = createStore(audienceSeed);

export const isExpired = (sub) => /expired/.test(sub);

const FILTER = {
  all: () => true,
  followers: (u) => u.follow,
  subscribers: (u) => !!u.sub && !isExpired(u.sub),
};

/** Customers for the current filter, search, date and sort. */
export function visibleUsers(list, f) {
  const q = f.q.trim().toLowerCase();
  return list
    .filter(FILTER[f.f])
    .filter((u) => !q || (u.name + u.uid).toLowerCase().includes(q))
    .filter((u) => !f.from || u.since >= f.from)
    .sort((a, b) => (f.sort === 'name' ? a.name.localeCompare(b.name) : b.last.localeCompare(a.last)));
}

/**
 * The customer for a User ID. A user who isn't in the audience list (e.g. opened from a question or
 * appointment) gets a basic profile built from the Text Questions and Appointments data.
 */
export function findUser(uid, ctx) {
  const u = audienceStore.get().list.find((x) => x.uid === uid);
  if (u) return u;
  const qs = (ctx?.tq?.questions || []).filter((q) => q.uid === uid);
  const as = (ctx?.apt?.list || []).filter((a) => a.uid === uid);
  return {
    uid,
    name: qs[0]?.name || as[0]?.user || uid,
    follow: false,
    sub: '',
    since: '2026-11-01',
    last: '2026-11-20',
    inter: [...qs.map((q) => ['Text Question', q.id]), ...as.map((a) => ['Appointment', a.id])],
    unknown: true,
  };
}

export const audienceActions = {
  setFilter: (k, v) => audienceStore.patch((s) => ({ filters: { ...s.filters, [k]: v } })),
};

export default function useAudience() {
  return useStore(audienceStore);
}
