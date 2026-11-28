// Admin moderation for Remedies (08-remedy-management.md §7) and Astrologer
// content (09-content-management.md §4). Documented actions only: Flag /
// Report, Review, Hide. Each action logs Reason · Admin · Date / Time. Admin
// cannot edit or delete; there is no documented "unhide". A Remedy is hidden
// only after review (§7). Saved in this browser and applied when records are
// read, so the Astrologer Profile and the Operations pages show the same state.

const KEY = 'astroconnect.moderation';
const ROLE = 'Super Admin';
export const MODERATION_ACTIONS = ['Flagged', 'Reviewed', 'Hidden'];

function read() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** All moderation entries (Recent Activity). */
export const allModeration = () => read();

/** Stored moderation entries for one target, oldest first. */
export function moderationFor(kind, targetId) {
  return read().filter((m) => m.kind === kind && m.targetId === targetId).sort((a, b) => a.at.localeCompare(b.at));
}

/** Map of targetId → entries, for applying to many records at once. */
export function moderationIndex(kind) {
  const map = new Map();
  for (const m of read()) {
    if (m.kind !== kind) continue;
    if (!map.has(m.targetId)) map.set(m.targetId, []);
    map.get(m.targetId).push(m);
  }
  for (const list of map.values()) list.sort((a, b) => a.at.localeCompare(b.at));
  return map;
}

/**
 * Record a moderation action. `state` = { hidden, reviewed } of the record as
 * currently shown. Returns { ok, entry } or { ok: false, error }.
 */
export function moderate(kind, targetId, action, reason, session, state) {
  if (!MODERATION_ACTIONS.includes(action)) return { ok: false, error: 'This action is not available.' };
  const text = reason.trim();
  if (!text) return { ok: false, error: 'A reason is required.' };
  if (state.hidden) return { ok: false, error: 'This item is already hidden.' };
  if (action === 'Hidden' && kind === 'remedy' && !state.reviewed) return { ok: false, error: 'Review the remedy before hiding it.' };
  const entry = {
    id: `MOD-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`,
    kind,
    targetId,
    action,
    reason: text,
    by: { id: session.accountId, name: session.fullName, role: ROLE },
    at: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify([...read(), entry]));
  } catch {
    return { ok: false, error: 'The action could not be saved.' };
  }
  return { ok: true, entry };
}

const label = { Flagged: 'Flagged / reported', Reviewed: 'Reviewed', Hidden: 'Hidden from the User App' };

/** A remedy with stored moderation applied (visibility + full moderation log). */
export function applyRemedyModeration(r, entries = moderationFor('remedy', r.id)) {
  const seeded = r.moderation ? [{ id: `${r.id}-seed`, action: r.moderation.action, reason: r.moderation.reason, by: { name: r.moderation.by, role: 'Super Admin' }, at: r.moderation.at }] : [];
  const log = [...seeded, ...entries];
  if (!entries.length) return { ...r, moderationLog: log };
  const hidden = r.visibility === 'Hidden' || entries.some((m) => m.action === 'Hidden');
  const last = [...log].reverse().find((m) => m.action === 'Hidden');
  return {
    ...r,
    visibility: hidden ? 'Hidden' : 'Visible',
    moderation: last ? { action: 'Hidden', reason: last.reason, by: last.by.name, at: last.at } : r.moderation,
    moderationLog: log,
    timeline: [...r.timeline, ...entries.map((m) => ({ at: m.at, text: `${label[m.action]} by ${m.by.name} (Admin) — ${m.reason}` }))].sort((a, b) => a.at.localeCompare(b.at)),
  };
}

/** A content post with stored moderation applied. */
export function applyPostModeration(p, entries = moderationFor('post', p.id)) {
  if (!entries.length) return { ...p, moderationLog: [] };
  return {
    ...p,
    hidden: p.hidden || entries.some((m) => m.action === 'Hidden'),
    moderationLog: entries,
    history: [...p.history, ...entries.map((m) => ({ at: m.at, text: `${label[m.action]} by ${m.by.name} (Platform Admin) — ${m.reason}` }))].sort((a, b) => b.at.localeCompare(a.at)),
  };
}
