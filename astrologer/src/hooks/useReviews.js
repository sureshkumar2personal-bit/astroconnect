import { createStore, useStore } from '@/lib/store.js';
import { reviewsSeed, REVIEWS_TODAY } from '@/data/mockReviews.js';

// Ratings & Reviews state and rules (spec 10_RATINGS_AND_REVIEWS.md). Prototype only: nothing is
// sent to the User App or Platform Admin; state resets on reload. Filters survive navigation (AD-77).

export const reviewsStore = createStore({ ...reviewsSeed, open: [] }); // open = review IDs expanded in the list

/** Badge colour for a review status (AD-131). */
export const statusKind = (st) => (st === 'Published' ? 'ok' : st === 'Hidden' ? 'bad' : 'warn');

/** Average star rating as "4.7", or "—" when there are no reviews. */
export const avgRating = (l) => (l.length ? (l.reduce((s, r) => s + r.stars, 0) / l.length).toFixed(1) : '—');

/** The public rating uses Published reviews only (AD-132). */
export const publishedOnly = (list) => list.filter((r) => r.st === 'Published');

const day = (iso) => { const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return Date.UTC(y, m - 1, d) / 864e5; };
const daysAgo = (iso) => day(REVIEWS_TODAY) - day(iso);
const SORT = {
  newest: (a, b) => b.at.localeCompare(a.at),
  oldest: (a, b) => a.at.localeCompare(b.at),
  high: (a, b) => b.stars - a.stars || b.at.localeCompare(a.at),
  low: (a, b) => a.stars - b.stars || b.at.localeCompare(a.at),
};

/**
 * Reviews matching the tab (status), Service, Reply, Rating and Date filters and the search
 * (review ID or customer name), in the chosen order (AD-131, AD-134, AD-186).
 */
export function filterReviews(list, f) {
  const q = (f.q || '').trim().toLowerCase();
  return list.filter((r) => (!f.svc || r.svc === f.svc)
    && (!f.st || r.st === f.st)
    && (!f.rep || (f.rep === 'Replied' ? !!r.reply : !r.reply))
    && (!f.rating || r.stars === Number(f.rating))
    && (!q || r.id.toLowerCase().includes(q) || r.user.toLowerCase().includes(q))
    && (!f.date
      || (f.date === 'today' && daysAgo(r.at) === 0)
      || (f.date === '7d' && daysAgo(r.at) >= 0 && daysAgo(r.at) < 7)
      || (f.date === '30d' && daysAgo(r.at) >= 0 && daysAgo(r.at) < 30)
      || (f.date === 'custom' && (!f.from || r.at.slice(0, 10) >= f.from) && (!f.to || r.at.slice(0, 10) <= f.to))))
    .sort(SORT[f.sort] || SORT.newest);
}

/** Number of filters in use besides the tab and the sort (for Reset filters and the phone Filters button). */
export const activeFilterCount = (f) => ['q', 'svc', 'rating', 'rep', 'date'].filter((k) => (f[k] || '').trim()).length;

const update = (id, part) => reviewsStore.patch((s) => ({ list: s.list.map((r) => (r.id === id ? { ...r, ...part } : r)) }));

export const reviewsActions = {
  /** Change one filter; any change other than the page goes back to page 1. */
  setFilter: (k, v) => reviewsStore.patch((s) => ({ filters: { ...s.filters, [k]: v, ...(k === 'page' ? {} : { page: 1 }) } })),
  /** Reset filters: search, Service, Rating, Reply, Date and sort; the tab stays. */
  resetFilters: () => reviewsStore.patch((s) => ({ filters: { ...reviewsSeed.filters, st: s.filters.st } })),
  /** View / Close a review in the list (several can be open at once). */
  toggleOpen: (id) => reviewsStore.patch((s) => ({ open: s.open.includes(id) ? s.open.filter((x) => x !== id) : [...s.open, id] })),
  /** Publish or hide (AD-130). */
  setStatus: (id, st) => update(id, { st }),
  /** Add or replace the single current reply (AD-130). */
  saveReply: (id, text) => update(id, { reply: text }),
  deleteReply: (id) => update(id, { reply: '' }),
};

export default function useReviews() {
  return useStore(reviewsStore);
}
