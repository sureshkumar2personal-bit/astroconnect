import { createStore, useStore } from '@/lib/store.js';
import { reviewsSeed } from '@/data/mockReviews.js';

// Ratings & Reviews state and rules (spec 10_RATINGS_AND_REVIEWS.md). Prototype only: nothing is
// sent to the User App or Platform Admin; state resets on reload. Filters survive navigation (AD-77).

export const reviewsStore = createStore(reviewsSeed);

/** Badge colour for a review status (AD-131). */
export const statusKind = (st) => (st === 'Published' ? 'ok' : st === 'Hidden' ? 'bad' : 'warn');

/** Average star rating as "4.7", or "—" when there are no reviews. */
export const avgRating = (l) => (l.length ? (l.reduce((s, r) => s + r.stars, 0) / l.length).toFixed(1) : '—');

/** The public rating uses Published reviews only (AD-132). */
export const publishedOnly = (list) => list.filter((r) => r.st === 'Published');

/** Reviews matching the Service / Status / Reply filters (AD-131, AD-134). */
export function filterReviews(list, f) {
  return list.filter((r) => (!f.svc || r.svc === f.svc)
    && (!f.st || r.st === f.st)
    && (!f.rep || (f.rep === 'Replied' ? !!r.reply : !r.reply)));
}

const update = (id, part) => reviewsStore.patch((s) => ({ list: s.list.map((r) => (r.id === id ? { ...r, ...part } : r)) }));

export const reviewsActions = {
  setFilter: (k, v) => reviewsStore.patch((s) => ({ filters: { ...s.filters, [k]: v } })),
  /** Publish or hide (AD-130). */
  setStatus: (id, st) => update(id, { st }),
  /** Add or replace the single current reply (AD-130). */
  saveReply: (id, text) => update(id, { reply: text }),
  deleteReply: (id) => update(id, { reply: '' }),
};

export default function useReviews() {
  return useStore(reviewsStore);
}
