// Background worker: builds the Finance wallet / payment index.
import { computeWalletIndex } from './walletIndex.js';

self.onmessage = (event) => {
  self.postMessage(computeWalletIndex(event.data?.now ?? Date.now()));
};
