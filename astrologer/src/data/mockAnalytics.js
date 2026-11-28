// Analytics and Performance (spec 13_ANALYTICS_AND_PERFORMANCE.md, AD-145 – AD-147).
// Text Questions, Appointments, Instant Call & Chat, Live sessions, posts and earnings are counted from
// their own modules (AD-147). This file holds ONLY the illustrative sample figures that no module
// records yet: day-by-day profile views / followers / subscribers, live viewers in 5-minute windows,
// and each post's day-by-day views and audience split. Samples are deterministic and add up to the
// module totals (e.g. a post's daily views sum to its lifetime views).
import { TODAY_DAY } from '@/lib/analytics.js';

export const PERIODS = [['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly'], ['custom', 'Custom']];

/** Analytics page choices, kept while the astrologer navigates away and back. */
export const analyticsSeed = {
  per: 'weekly', from: '2026-10-31', to: '2026-11-20',
  prof: 'views', svc: 'all', hidden: {}, cFilter: 'all', cSort: 'views',
  sec: 'prof', // section shown on a phone (section tabs)
};

function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** Split an integer total over weights (largest remainder). */
export function dist(total, w) {
  total = Math.max(0, Math.round(total));
  const s = w.reduce((a, b) => a + b, 0);
  if (!s) { const z = w.map(() => 0); if (z.length) z[0] = total; return z; }
  const raw = w.map((x) => x * total / s); const fl = raw.map(Math.floor);
  const rem = total - fl.reduce((a, b) => a + b, 0);
  const ord = raw.map((x, i) => [x - fl[i], i]).sort((a, b) => b[0] - a[0]);
  for (let k = 0; k < rem; k++) fl[ord[k % ord.length][1]]++;
  return fl;
}

// Hour-of-day weights for spreading one day's profile activity over 24 hours.
const HW = [1, 0.6, 0.4, 0.3, 0.3, 0.6, 1.6, 3, 4, 4.2, 3.6, 3, 2.8, 2.6, 2.4, 2.6, 3, 3.6, 4.4, 5.2, 5.6, 5, 3.4, 2];
const SPAN = 182; // days of profile history kept (about 6 months up to today)

/**
 * Profile performance by day (sample). The last 7 days add up to the profile totals used across the
 * app (3,482 views · +148 followers · +22 subscribers) and the 7 days before to 3,109 · 136 · 23.
 */
function profileSeries() {
  const R = rng(20261120); const start = TODAY_DAY - SPAN + 1;
  const WF = [1.3, 0.9, 0.95, 1, 1.05, 1.1, 1.2];
  const wf = (d) => WF[((d % 7) + 7 + 4) % 7]; // 1 Jan 2026 is a Thursday
  const mk = (avg, cur, prev) => {
    const out = {};
    for (let d = start; d <= TODAY_DAY; d++) out[d] = Math.max(0, Math.round(avg / 7 * wf(d) * (0.8 + 0.2 * (d - start) / SPAN) * (0.7 + 0.6 * R())));
    const wk = (k) => Array.from({ length: 7 }, (_, j) => wf(k + j) * (0.75 + 0.5 * R()));
    dist(cur, wk(TODAY_DAY - 6)).forEach((v, j) => { out[TODAY_DAY - 6 + j] = v; });
    dist(prev, wk(TODAY_DAY - 13)).forEach((v, j) => { out[TODAY_DAY - 13 + j] = v; });
    return out;
  };
  return { start, views: mk(3250, 3482, 3109), followers: mk(128, 148, 136), subs: mk(21, 22, 23) };
}
export const PROFILE = profileSeries();

const hourCache = {};
/** One metric's value for a bucket { d0, d1, h } (h = hour on a single day). */
export function profileValue(metric, b) {
  const arr = PROFILE[metric];
  if (b.h == null) { let s = 0; for (let d = b.d0; d <= b.d1; d++) s += arr[d] || 0; return s; }
  const k = metric + ':' + b.d0;
  if (!hourCache[k]) { const R = rng(b.d0 * 104729 + metric.length * 7919); hourCache[k] = dist(arr[b.d0] || 0, HW.map((w) => w * (0.7 + 0.6 * R()))); }
  return hourCache[k][b.h];
}

const LIVE_SHAPE = [0.35, 0.6, 0.8, 0.92, 1, 0.97, 0.9, 0.86, 0.8, 0.7, 0.55, 0.4];
/** A past live session's concurrent viewers and comments per 5-minute window (sample, scaled to its peak and comment total). */
export function liveWindows(s) {
  const R = rng(s.day * 31 + s.participants);
  const k = Math.max(1, Math.ceil((s.durMin || 5) / 5));
  const shape = Array.from({ length: k }, (_, i) => LIVE_SHAPE[Math.min(LIVE_SHAPE.length - 1, Math.round(i * (LIVE_SHAPE.length - 1) / Math.max(1, k - 1)))]);
  const peak = s.peak || Math.round(s.participants * 0.62);
  const viewers = shape.map((w) => Math.round(peak * w * (0.95 + R() * 0.1)));
  const cm = dist(s.comments, shape.map((w) => 1 + w * 4));
  return { viewers, cm };
}

// Audience split for a post's views (sample shares by audience).
const PUBLIC_SPLIT = [['Non-subscribers', 0.56], ['Silver', 0.2], ['Gold', 0.15], ['Platinum', 0.09]];
const TIER_SHARE = { Silver: 0.3, Gold: 0.42, Platinum: 0.28, Followers: 0.5, Subscribers: 0.5 };
/** A post's day-by-day views / likes / comments since publishing, and its audience split (sample). */
export function postDetail(p) {
  const R = rng(p.day * 13 + p.views);
  const len = Math.max(1, Math.min(14, TODAY_DAY - p.day + 1));
  const w = Array.from({ length: len }, (_, k) => Math.exp(-0.42 * k) * (0.85 + 0.3 * R()));
  const shares = p.aud[0] === 'Public' ? PUBLIC_SPLIT : p.aud.map((a) => [a, TIER_SHARE[a] || 0.3]);
  const cnt = dist(p.views, shares.map((s) => s[1]));
  return {
    tViews: dist(p.views, w), tLikes: dist(p.likes, w), tComments: dist(p.comments, w),
    audDist: shares.map((s, i) => ({ name: s[0], n: cnt[i] })),
  };
}
