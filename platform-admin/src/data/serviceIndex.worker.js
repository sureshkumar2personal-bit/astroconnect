// Background worker: builds the Service Management index from user records.
import { computeServiceIndex } from './serviceIndex.js';

self.onmessage = (event) => {
  self.postMessage(computeServiceIndex(event.data?.now ?? Date.now()));
};
