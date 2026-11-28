// Per-astrologer Rating and Total Services Completed for the Astrologers List.
// Built once from every user's records (the same records the profiles show)
// in a background worker, then cached for the day in sessionStorage.

import { generateUsers } from './mock/usersMock.js';
import { generateProfile } from './mock/profileMock.js';
import { reviewFor } from './mock/reviewsMock.js';

const CACHE_PREFIX = 'astroconnect.astrologerIndex.v2.';

/** { [astrologerId]: { completed, total, ratingSum, ratingCount } } */
export function computeAstrologerIndex(now = new Date()) {
  const index = {};
  for (const user of generateUsers(now)) {
    const p = generateProfile(user, now);
    for (const s of p.services) {
      const id = s.astrologer.id;
      const row = (index[id] ??= { completed: 0, total: 0, ratingSum: 0, ratingCount: 0 });
      row.total += 1;
      if (s.status === 'Completed') {
        row.completed += 1;
        const review = reviewFor(s, user.lastActiveAt, now);
        if (review && review.status === 'Published') {
          row.ratingSum += review.rating;
          row.ratingCount += 1;
        }
      }
    }
  }
  return index;
}

function cacheKey(now = new Date()) {
  return `${CACHE_PREFIX}${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

let pending = null;

/** Resolve the index (cached → worker → main-thread fallback). */
export function loadAstrologerIndex() {
  if (pending) return pending;
  pending = new Promise((resolve) => {
    try {
      const cached = sessionStorage.getItem(cacheKey());
      if (cached) {
        resolve(JSON.parse(cached));
        return;
      }
    } catch {
      /* no cache */
    }
    const finish = (index) => {
      try {
        sessionStorage.setItem(cacheKey(), JSON.stringify(index));
      } catch {
        /* storage full or blocked */
      }
      resolve(index);
    };
    try {
      const worker = new Worker(new URL('./astrologerIndex.worker.js', import.meta.url), { type: 'module' });
      worker.onmessage = (e) => {
        finish(e.data);
        worker.terminate();
      };
      worker.onerror = () => {
        worker.terminate();
        finish(computeAstrologerIndex());
      };
      worker.postMessage({ now: Date.now() });
    } catch {
      finish(computeAstrologerIndex());
    }
  });
  return pending;
}
