import { createStore, useStore } from '@/lib/store.js';
import { analyticsSeed } from '@/data/mockAnalytics.js';

// Analytics period filter (spec 13, AD-146): Daily / Weekly / Monthly / Custom date range.
// Module-level so the choice is kept when the astrologer navigates away and back.
// Prototype: the sample figures do not change with the period.

export const analyticsStore = createStore(analyticsSeed);

export const analyticsActions = {
  setPeriod: (per) => analyticsStore.patch({ per }),
  setRange: (part) => analyticsStore.patch(part),
};

export default function useAnalytics() {
  return useStore(analyticsStore);
}
