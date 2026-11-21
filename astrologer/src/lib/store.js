import { useSyncExternalStore } from 'react';

// Tiny module-level store for prototype page state. State lives in memory for the
// browser session (it survives navigating between pages, and resets on reload).
// Nothing is sent to a server.
export function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  return {
    get: () => state,
    set: (next) => {
      state = typeof next === 'function' ? next(state) : next;
      listeners.forEach((l) => l());
    },
    /** Merge a partial object (or the result of fn(state)) into the state. */
    patch: (part) => {
      const p = typeof part === 'function' ? part(state) : part;
      state = { ...state, ...p };
      listeners.forEach((l) => l());
    },
    subscribe: (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

export const useStore = (store) => useSyncExternalStore(store.subscribe, store.get, store.get);
