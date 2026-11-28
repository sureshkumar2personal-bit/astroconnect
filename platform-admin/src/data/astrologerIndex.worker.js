// Background worker: builds the Astrologers List rating / services index.
import { computeAstrologerIndex } from './astrologerIndex.js';

self.onmessage = (event) => {
  const now = new Date(event.data?.now ?? Date.now());
  self.postMessage(computeAstrologerIndex(now));
};
