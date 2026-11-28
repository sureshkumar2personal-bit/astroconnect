// Background worker: builds Astrologer earnings and payout records. The
// worker has no localStorage, so it receives a copy of this browser's saved
// AstroConnect data and reads it through an in-memory stand-in.
self.onmessage = async (event) => {
  const data = { ...(event.data?.storage ?? {}) };
  const store = {
    get length() {
      return Object.keys(data).length;
    },
    key: (i) => Object.keys(data)[i] ?? null,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = String(v);
    },
    removeItem: (k) => {
      delete data[k];
    },
  };
  globalThis.localStorage = store;
  globalThis.sessionStorage = { getItem: () => null, setItem() {}, removeItem() {}, key: () => null, length: 0 };
  const { computeAstroFinanceIndex } = await import('./astroFinanceIndex.js');
  self.postMessage(computeAstroFinanceIndex());
};
