// Reversible User ↔ Astrologer assignment (approved 2026-11-28, decision 1A).
//
// Each user consults three astrologers: index (n·A + k·B) mod N for k = 0..2,
// where n is the user's position (USR-100001 → 0) and N = 328 astrologers.
// Because A is invertible mod N, every astrologer can list exactly the users
// assigned to it, so the User Profile and the Astrologer Profile read the same
// underlying records.

import { generateAstrologers } from './mock/astrologersMock.js';

const A = 97;
const B = 113;
const K = 3;
const USER_BASE = 100001;
const USER_COUNT = 12450;

function modInverse(a, m) {
  let [oldR, r] = [a, m];
  let [oldS, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  return ((oldS % m) + m) % m;
}

const N = () => generateAstrologers().length;

/** The three astrologers assigned to a user, most-consulted first. */
export function favouritesFor(userId) {
  const list = generateAstrologers();
  const n = Number(String(userId).replace(/\D/g, '')) - USER_BASE;
  return Array.from({ length: K }, (_, k) => list[(n * A + k * B) % list.length]);
}

/** IDs of every user assigned to an astrologer. */
export function usersForAstrologer(astrologerId) {
  const count = N();
  const x = Number(String(astrologerId).replace(/\D/g, '')) - 2001;
  const inv = modInverse(A, count);
  const ids = new Set();
  for (let k = 0; k < K; k++) {
    const r = ((((x - k * B) % count) + count) % count) * inv % count;
    for (let n = r; n < USER_COUNT; n += count) ids.add(`USR-${USER_BASE + n}`);
  }
  return [...ids].sort();
}
