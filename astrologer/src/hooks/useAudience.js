import { createStore, useStore } from '@/lib/store.js';
import { audienceSeed, moreCustomers, AUDIENCE_TODAY, PLAN_NAME } from '@/data/mockAudience.js';

// Audience state and rules (spec 11_AUDIENCE.md). One list with All Users / Followers / Subscribers
// tabs (AD-135); search, filters, sort, page and the open profile are kept in the store, so closing a
// profile or coming back keeps them (AD-77, AD-137). Prototype only; state resets on reload.

const initialFilters = audienceSeed.filters;
export const audienceStore = createStore({
  ...audienceSeed,
  list: [...audienceSeed.list, ...moreCustomers],
  profile: null, // User ID of the customer whose profile panel is open
});

export const isExpired = (sub) => /expired/.test(sub);

const DAY = 864e5;
const toDays = (iso) => { const [y, m, d] = iso.split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / DAY); };
export const fromDays = (n) => new Date(n * DAY).toISOString().slice(0, 10);

/** Subscription history as objects, oldest first. */
export const subsOf = (u) => (u.subs || []).map(([tier, start, months, end, status]) => ({
  tier, start, months, end, status, plan: `${tier} ${PLAN_NAME[months]}`, period: `${months} ${months === 1 ? 'month' : 'months'}`,
}));
/** Current subscription state: 'active' | 'expired' | 'none' (from the history, or the status text for users without one). */
export function subStatus(u) {
  const s = u.subs || [];
  if (s.length) return s[s.length - 1][4] === 'Active' ? 'active' : 'expired';
  if (!u.sub) return 'none';
  return isExpired(u.sub) ? 'expired' : 'active';
}
/** Current tier name ('' when the customer has never subscribed). */
export const tierOf = (u) => { const s = u.subs || []; return s.length ? s[s.length - 1][0] : (u.sub || '').replace(/\s*\(expired\)/, ''); };

const TABS = {
  all: () => true,
  followers: (u) => u.follow,
  subscribers: (u) => subStatus(u) !== 'none', // active and expired (Active / Expired chips narrow it)
};
const CMP = {
  recent: (a, b) => (a.last === b.last ? a.name.localeCompare(b.name) : b.last.localeCompare(a.last)),
  name: (a, b) => a.name.localeCompare(b.name),
  since_new: (a, b) => (a.since === b.since ? a.name.localeCompare(b.name) : b.since.localeCompare(a.since)),
  since_old: (a, b) => (a.since === b.since ? a.name.localeCompare(b.name) : a.since.localeCompare(b.since)),
};

/** Filters that apply on the current tab (the Follow filter has no meaning on Followers; "No subscription" none on Subscribers). */
export function effectiveFilters(f) {
  return {
    ...f,
    subF: f.f === 'subscribers' && f.subF === 'none' ? 'all' : f.subF,
    followF: f.f === 'followers' ? 'all' : f.followF,
  };
}

/** Customers for the current tab, search (name or User ID), filters, customer-since range and sort. */
export function visibleUsers(list, filters) {
  const f = effectiveFilters(filters);
  const q = f.q.trim().toLowerCase();
  const qn = q.replace(/[^a-z0-9]/g, '');
  return list
    .filter(TABS[f.f])
    .filter((u) => !q || u.name.toLowerCase().includes(q) || (qn && u.uid.toLowerCase().replace(/[^a-z0-9]/g, '').includes(qn)))
    .filter((u) => f.subF === 'all' || subStatus(u) === f.subF)
    .filter((u) => f.followF === 'all' || (f.followF === 'following') === u.follow)
    .filter((u) => (!f.from || u.since >= f.from) && (!f.to || u.since <= f.to))
    .sort(CMP[f.sort] || CMP.recent);
}

/** Summary counts for the stats strip and the tab badges (sample data — AD-137). */
export function audienceCounts(list) {
  const followers = list.filter((u) => u.follow).length;
  const subs = list.filter((u) => subStatus(u) !== 'none');
  const active = subs.filter((u) => subStatus(u) === 'active');
  const byTier = ['Gold', 'Platinum', 'Silver'].map((t) => [t, active.filter((u) => tierOf(u) === t).length]);
  return { total: list.length, followers, subscribers: subs.length, active: active.length, expired: subs.length - active.length, byTier };
}

/** "Customer since" presets, relative to the sample data's today. */
export const SINCE_PRESETS = [
  ['Last 30 days', fromDays(toDays(AUDIENCE_TODAY) - 30), ''],
  ['Last 90 days', fromDays(toDays(AUDIENCE_TODAY) - 90), ''],
  ['This year', `${AUDIENCE_TODAY.slice(0, 4)}-01-01`, ''],
  [`Before ${AUDIENCE_TODAY.slice(0, 4)}`, '', `${Number(AUDIENCE_TODAY.slice(0, 4)) - 1}-12-31`],
];

/** Days used / left of a subscription term, measured to the sample data's today. */
export function termOf(s) {
  const total = toDays(s.end) - toDays(s.start);
  const left = Math.max(0, toDays(s.end) - toDays(AUDIENCE_TODAY));
  const used = Math.max(0, total - left);
  return { total, left, used, pct: Math.round(Math.min(100, (used / Math.max(1, total)) * 100)) };
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
  /** Change one filter; any change other than the page goes back to page 1. */
  setFilter: (k, v) => audienceStore.patch((s) => ({ filters: { ...s.filters, [k]: v, ...(k === 'page' ? {} : { page: 1 }) } })),
  setFilters: (p) => audienceStore.patch((s) => ({ filters: { ...s.filters, ...p, page: 1 } })),
  /** Clear search and filters; the tab stays. */
  resetFilters: () => audienceStore.patch((s) => ({ filters: { ...initialFilters, f: s.filters.f } })),
  openProfile: (uid) => audienceStore.patch({ profile: uid }),
  closeProfile: () => audienceStore.patch({ profile: null }),
};

export default function useAudience() {
  return useStore(audienceStore);
}
