// Instant Chat conversations and role-based retention (local data).
//
// Retention (owner decision, 2026-11-28):
// - User App and Astrologer App: full chat messages for 24 hours only
//   (AD-111, D-47) — unchanged.
// - Platform Admin: chat conversations viewable for 3 months after the
//   session; older conversations are no longer available.
// Calls are not recorded (recording is not default and needs prior notice
// and consent), so an Instant Call has no conversation to show.
// Admins open a conversation explicitly; each view is logged (who / when).

import { hashString, mulberry32, snapshotTime } from './mock/seed.js';

export const APP_RETENTION_HOURS = 24;
export const ADMIN_RETENTION_MONTHS = 3;

/** Start of the Admin retention window (3 calendar months before now). */
export function adminRetentionStart(now = snapshotTime()) {
  const d = new Date(now);
  d.setMonth(d.getMonth() - ADMIN_RETENTION_MONTHS);
  return d.getTime();
}

export const adminCanView = (endedAt, now = snapshotTime()) => new Date(endedAt).getTime() >= adminRetentionStart(now);
export const appCanView = (endedAt, now = snapshotTime()) => now - new Date(endedAt).getTime() <= APP_RETENTION_HOURS * 3600000;

const USER_LINES = [
  'Namaste. I would like guidance about my career this year.',
  'My birth details are in my profile. Is this a good time to change jobs?',
  'I have been worried about delays in my marriage proposals.',
  'Will the coming months be good for starting a business?',
  'Is there any remedy I should follow for Saturn?',
  'Thank you. Which days are better for important decisions?',
  'Should I wait until after the transit to sign the agreement?',
  'Can you suggest something for peace of mind at home?',
];
const ASTRO_LINES = [
  'Namaste. Thank you for sharing your birth details. Let me look at your chart.',
  'Your tenth house is getting support from Jupiter from the middle of next month.',
  'I see a favourable period starting after the current Rahu transit.',
  'Please avoid major commitments during the retrograde phase.',
  'Lighting a sesame oil lamp on Saturdays will help bring steadiness.',
  'Tuesdays and Thursdays look better for you for important steps.',
  'Yes, waiting a few weeks would be wise. The timing improves after that.',
  'Chanting the suggested mantra each morning will bring calm to the home.',
];

/** Deterministic messages for one chat session row. */
export function conversationFor(session) {
  const rand = mulberry32(hashString(`${session.id}:chat`));
  const start = session.connectedAt;
  const end = session.endedAt;
  const count = Math.max(4, Math.min(36, Math.round(session.usedMinutes * 1.4)));
  const messages = [{ at: start, from: 'system', text: `Chat started · ${session.packageMinutes}-minute prepaid package` }];
  for (let i = 0; i < count; i++) {
    const at = start + Math.round(((i + 1) / (count + 1)) * (end - start));
    const fromUser = i % 2 === 0;
    messages.push({ at, from: fromUser ? 'user' : 'astrologer', text: (fromUser ? USER_LINES : ASTRO_LINES)[Math.floor(rand() * 8)] });
  }
  for (let e = 1; e <= session.extensions; e++) {
    messages.push({ at: start + (session.packageMinutes * e - 1) * 60000, from: 'system', text: `Package extended (${e}) · ${session.packageMinutes} minutes` });
  }
  messages.push({ at: end, from: 'system', text: `Chat ended · ${session.termination}` });
  return messages.sort((a, b) => a.at - b.at);
}

// ---------- view log (who opened which conversation, when) ----------
const LOG_KEY = 'astroconnect.chatViewLog';

/** All transcript views (Recent Activity). */
export function allChatViews() {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || '[]') ?? [];
  } catch {
    return [];
  }
}

export function viewLog(sessionId) {
  try {
    return (JSON.parse(localStorage.getItem(LOG_KEY) || '[]') ?? []).filter((v) => v.sessionId === sessionId).sort((a, b) => b.at.localeCompare(a.at));
  } catch {
    return [];
  }
}

export function logView(sessionId, session) {
  try {
    const all = JSON.parse(localStorage.getItem(LOG_KEY) || '[]') ?? [];
    all.push({ sessionId, by: { id: session.accountId, name: session.fullName }, at: new Date().toISOString() });
    localStorage.setItem(LOG_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable */
  }
}
