// Deterministic helpers shared by the local data generators.
import { SNAPSHOT_TIME } from './dashboardMock.js';

export const MIN = 60 * 1000;
export const HOUR = 60 * MIN;
export const DAY = 24 * HOUR;

/** Small, fast, deterministic PRNG. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Today's data snapshot time (14:30 local). */
export function snapshotTime(now = new Date()) {
  const d = new Date(now);
  const [h, m] = SNAPSHOT_TIME.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

export function startOfToday(now = new Date()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Helper bundle around one PRNG stream. */
export function rng(seed) {
  const rand = mulberry32(seed);
  return {
    rand,
    pick: (list) => list[Math.floor(rand() * list.length)],
    chance: (p) => rand() < p,
    between: (a, b) => a + Math.floor(rand() * Math.max(0, b - a)),
    some: (list, min, max) => {
      const n = min + Math.floor(rand() * (max - min + 1));
      const copy = [...list];
      const out = [];
      while (out.length < n && copy.length) out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
      return out;
    },
  };
}

export const iso = (ms) => new Date(ms).toISOString();
export const pad = (n, w = 3) => String(n).padStart(w, '0');
