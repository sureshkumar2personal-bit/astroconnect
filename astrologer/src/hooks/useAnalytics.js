import { createStore, useStore } from '@/lib/store.js';
import { analyticsSeed } from '@/data/mockAnalytics.js';

// Analytics page choices (spec 13, AD-146): period (Daily / Weekly / Monthly / Custom date range),
// the custom dates, and the per-section pickers (profile metric, call/chat service, hidden growth
// series, content filter and sort). Module-level so they are kept when navigating away and back.
export const analyticsStore = createStore(analyticsSeed);

export const analyticsActions = {
  set: (part) => analyticsStore.patch(part),
  toggleSeries: (id) => analyticsStore.patch((s) => ({ hidden: { ...s.hidden, [id]: !s.hidden[id] } })),
};

export default function useAnalytics() {
  return useStore(analyticsStore);
}
