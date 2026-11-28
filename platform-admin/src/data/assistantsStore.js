// Assistants (local data + saved Admin changes in this browser).
// Single source for the Assistants List, the Assistant Profile and the
// assistant entries shown in an Astrologer's Activity tab.
//
// Who can act (assistant-management.md §2, §4, §10): Super Admin manages
// Admin Assistants; only the assigned Astrologer manages an Astrologer
// Assistant, so those are view-only here. Account actions (decision 5):
// Pending / Expired → Resend Invitation; Active → Suspend or Remove;
// Suspended → Reactivate or Remove; a reason is required for every action.

import {
  ADMIN_DEPARTMENTS,
  INVITE_DAYS,
  allowedActions,
  generateAssistants,
  grantableModules,
  presetPermissions,
} from './mock/assistantsMock.js';
import { DAY } from './mock/seed.js';
import { generateProfile } from './mock/profileMock.js';
import { generateUsers } from './mock/usersMock.js';

export { ADMIN_DEPARTMENTS, allowedActions, grantableModules, presetPermissions };
export const STATUSES = ['Pending', 'Active', 'Suspended', 'Expired', 'Removed'];
export const ROLES = ['Assistant', 'Editor'];
export const TYPES = ['Admin Assistant', 'Astrologer Assistant'];

const KEY = 'astroconnect.assistants';
const ROLE_LABEL = 'Super Admin';

function readState() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (s) return { created: s.created ?? [], overrides: s.overrides ?? {}, events: s.events ?? [] };
  } catch {
    /* fall through */
  }
  return { created: [], overrides: {}, events: [] };
}

function writeState(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

const admin = (session) => ({ id: session.accountId, name: session.fullName, role: ROLE_LABEL });
const newEventId = () => `AE-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;

/** Pending invitations past their 7-day validity become Expired. */
function withExpiry(a, now = Date.now()) {
  if (a.status === 'Pending' && new Date(a.expiresAt).getTime() < now) return { ...a, status: 'Expired' };
  return a;
}

/** All assistants with saved changes applied (oldest first). */
export function allAssistants() {
  const s = readState();
  return [...generateAssistants(), ...s.created].map((base) => {
    const o = s.overrides[base.id] ?? {};
    const events = [...base.events, ...s.events.filter((e) => e.assistantId === base.id)].sort((x, y) => x.at.localeCompare(y.at));
    return withExpiry({ ...base, ...o, events });
  });
}

export function getAssistant(id) {
  return allAssistants().find((a) => a.id === id) ?? null;
}

export async function loadAssistants() {
  const scenario = new URLSearchParams(window.location.search).get('mock');
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (scenario === 'error') throw new Error('The assistant list could not be loaded.');
  if (scenario === 'empty') return [];
  return allAssistants();
}

export async function loadAssistant(id) {
  const scenario = new URLSearchParams(window.location.search).get('mock');
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (scenario === 'error') throw new Error('The assistant profile could not be loaded.');
  return getAssistant(id);
}

/** Emails that can never be used again (Removed accounts). */
export function blockedEmails() {
  return new Set(allAssistants().filter((a) => a.status === 'Removed').map((a) => a.email.toLowerCase()));
}

/** Next sequential ID; IDs are never reused. */
export function nextAssistantId() {
  const max = allAssistants().reduce((m, a) => Math.max(m, Number(a.id.slice(-4))), 0);
  return `AST-AS-${String(max + 1).padStart(4, '0')}`;
}

// ---------- list helpers ----------
export function countAssistants(list) {
  const c = { all: list.length, current: 0, Pending: 0, Active: 0, Suspended: 0, Expired: 0, Removed: 0 };
  for (const a of list) {
    c[a.status] += 1;
    if (a.status !== 'Removed') c.current += 1;
  }
  return c;
}

export function filterAssistants(list, f) {
  const q = (f.query ?? '').trim().toLowerCase();
  return list.filter((a) => {
    if (f.status === 'current' ? a.status === 'Removed' : f.status && f.status !== 'all' && a.status !== f.status) return false;
    if (f.role && f.role !== 'all' && a.role !== f.role) return false;
    if (f.type && f.type !== 'all' && a.type !== f.type) return false;
    if (f.astrologer && f.astrologer !== 'all' && a.astrologer?.id !== f.astrologer) return false;
    if (!q) return true;
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
  });
}

const SORTERS = {
  name: (a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id),
  id: (a, b) => a.id.localeCompare(b.id),
  invited: (a, b) => a.invitedAt.localeCompare(b.invitedAt) || a.id.localeCompare(b.id),
  lastActive: (a, b) => (a.lastActiveAt ?? '').localeCompare(b.lastActiveAt ?? '') || a.id.localeCompare(b.id),
};

export function sortAssistants(list, { key, dir }) {
  const sorted = [...list].sort(SORTERS[key] ?? SORTERS.invited);
  return dir === 'desc' ? sorted.reverse() : sorted;
}

// ---------- invite (Super Admin → Admin Assistant) ----------
export function inviteAdminAssistant({ name, email, mobile, role, departments }, session) {
  const cleanEmail = email.trim().toLowerCase();
  if (!name.trim()) return { ok: false, error: 'Enter the assistant’s name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) return { ok: false, error: 'Enter a valid email address.' };
  if (blockedEmails().has(cleanEmail)) return { ok: false, error: 'This email belonged to a removed assistant and can never be used again.' };
  if (allAssistants().some((a) => a.email.toLowerCase() === cleanEmail)) return { ok: false, error: 'An assistant account already uses this email.' };
  if (!/^\+?91?\s?[6-9]\d{4}\s?\d{5}$/.test(mobile.trim())) return { ok: false, error: 'Enter a valid Indian mobile number.' };
  if (!ROLES.includes(role)) return { ok: false, error: 'Choose a role.' };
  if (!departments.length) return { ok: false, error: 'Choose at least one department.' };
  const id = nextAssistantId();
  const now = Date.now();
  const by = admin(session);
  const digits = mobile.replace(/\D/g, '').slice(-10);
  const record = {
    id,
    name: name.trim(),
    email: cleanEmail,
    mobile: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
    type: 'Admin Assistant',
    role,
    departments,
    astrologer: null,
    status: 'Pending',
    invitedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + INVITE_DAYS * DAY).toISOString(),
    acceptedAt: null,
    lastActiveAt: null,
    invitedBy: by,
    permissions: presetPermissions('Admin Assistant', role, departments),
    mode: `${role} preset`,
    resendCount: 0,
    tasks: [],
    events: [],
  };
  const s = readState();
  s.created.push(record);
  s.events.push({ id: newEventId(), assistantId: id, at: record.invitedAt, action: 'Invitation sent', module: 'Account', description: `Invitation sent to ${cleanEmail} as ${role} (Admin Assistant); valid for ${INVITE_DAYS} days`, by });
  if (!writeState(s)) return { ok: false, error: 'The invitation could not be saved.' };
  return { ok: true, assistant: getAssistant(id) };
}

// ---------- account actions ----------
export const ACCOUNT_ACTIONS = {
  resend: { label: 'Resend Invitation', verb: 'Resend', to: 'Pending' },
  suspend: { label: 'Suspend', verb: 'Suspend', to: 'Suspended', danger: true },
  reactivate: { label: 'Reactivate', verb: 'Reactivate', to: 'Active' },
  remove: { label: 'Remove', verb: 'Remove', to: 'Removed', danger: true },
};
const ACCOUNT_TRANSITIONS = { Pending: ['resend'], Expired: ['resend'], Active: ['suspend', 'remove'], Suspended: ['reactivate', 'remove'], Removed: [] };

/** Actions Platform Admin may take for this assistant. */
export function availableActions(a) {
  if (a.type !== 'Admin Assistant') return []; // managed by the assigned astrologer
  return ACCOUNT_TRANSITIONS[a.status] ?? [];
}

export function applyAccountAction(id, action, reason, session) {
  const a = getAssistant(id);
  if (!a) return { ok: false, error: 'Assistant not found.' };
  if (!availableActions(a).includes(action)) return { ok: false, error: 'This action is not available for this assistant.' };
  if (!reason.trim()) return { ok: false, error: 'A reason is required.' };
  const s = readState();
  const now = new Date();
  const meta = ACCOUNT_ACTIONS[action];
  const why = reason.trim().replace(/[.\s]+$/, '');
  const patch = { status: meta.to };
  let description = `${a.status} → ${meta.to}. Reason: ${why}`;
  if (action === 'resend') {
    patch.invitedAt = now.toISOString();
    patch.expiresAt = new Date(now.getTime() + INVITE_DAYS * DAY).toISOString();
    patch.resendCount = (a.resendCount ?? 0) + 1;
    description = `Invitation resent to ${a.email}; valid for ${INVITE_DAYS} days. Reason: ${why}`;
  }
  if (action === 'remove') description += '. Email permanently blocked from reuse';
  s.overrides[id] = { ...(s.overrides[id] ?? {}), ...patch };
  s.events.push({ id: newEventId(), assistantId: id, at: now.toISOString(), action: action === 'resend' ? 'Invitation resent' : meta.verb === 'Remove' ? 'Removed' : `${meta.verb}${meta.verb.endsWith('e') ? 'd' : 'ed'}`, module: 'Account', description, by: admin(session) });
  if (!writeState(s)) return { ok: false, error: 'The change could not be saved.' };
  return { ok: true, assistant: getAssistant(id) };
}

// ---------- permissions (immediate, logged) ----------
export function canEditPermissions(a) {
  return a.type === 'Admin Assistant' && a.status !== 'Removed';
}

/**
 * Save new departments / permissions / role. Changes apply immediately and
 * every module change is logged with Admin, action, module and description.
 */
export function savePermissions(id, { departments, permissions, role, mode }, session) {
  const a = getAssistant(id);
  if (!a || !canEditPermissions(a)) return { ok: false, error: 'Permissions for this assistant cannot be changed here.' };
  const depts = departments ?? a.departments;
  if (!depts.length) return { ok: false, error: 'At least one department is required.' };
  // Drop anything outside the type's documented authority.
  const clean = {};
  for (const m of grantableModules(a.type, depts)) {
    const allowed = allowedActions(a.type, m);
    const acts = (permissions[m] ?? []).filter((x) => allowed.includes(x));
    if (acts.length) clean[m] = allowed.filter((x) => acts.includes(x));
  }
  const by = admin(session);
  const now = new Date().toISOString();
  const s = readState();
  const log = (action, module, description) => s.events.push({ id: newEventId(), assistantId: id, at: now, action, module, description, by });
  const added = depts.filter((d) => !a.departments.includes(d));
  const removed = a.departments.filter((d) => !depts.includes(d));
  if (added.length || removed.length) log('Department access changed', 'Permissions', `${a.departments.join(', ') || '—'} → ${depts.join(', ')}`);
  if (role && role !== a.role) log('Role changed', 'Permissions', `${a.role} → ${role}`);
  const modules = new Set([...Object.keys(a.permissions), ...Object.keys(clean)]);
  let changes = 0;
  for (const m of modules) {
    const before = (a.permissions[m] ?? []).join(', ') || 'No access';
    const after = (clean[m] ?? []).join(', ') || 'No access';
    if (before !== after) {
      changes += 1;
      log('Permission changed', m, `${before} → ${after}`);
    }
  }
  if (!changes && !added.length && !removed.length && (!role || role === a.role)) return { ok: false, error: 'No permission changes to save.' };
  s.overrides[id] = { ...(s.overrides[id] ?? {}), departments: depts, permissions: clean, role: role ?? a.role, mode: mode ?? 'Custom' };
  if (!writeState(s)) return { ok: false, error: 'The changes could not be saved.' };
  return { ok: true, assistant: getAssistant(id), changes };
}

// ---------- tasks ----------
export function taskState(t, now = Date.now()) {
  if (t.status === 'Completed') return 'Completed';
  return new Date(t.dueAt).getTime() < now ? 'Overdue' : 'Pending';
}

// ---------- activity shared with astrologers ----------
/** Activity of the assistants assigned to one astrologer (same records). */
export function activityForAstrologer(astrologerId) {
  return allAssistants()
    .filter((a) => a.astrologer?.id === astrologerId)
    .flatMap((a) => a.events.map((e) => ({ ...e, assistant: { id: a.id, name: a.name, role: a.role } })));
}

// ---------- wallet access (read only) ----------
let adjustmentCache = null;

/** Wallet adjustment requests created by an assistant (scans user records). */
export async function requestsByAssistant(assistantId) {
  if (!adjustmentCache) {
    const users = generateUsers();
    const found = [];
    for (let i = 0; i < users.length; i += 400) {
      for (const u of users.slice(i, i + 400)) {
        for (const adj of generateProfile(u).wallet.adjustments) {
          found.push({ ...adj, user: { id: u.id, name: u.name } });
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 0)); // keep the page responsive
    }
    adjustmentCache = found;
  }
  return adjustmentCache.filter((x) => x.requestedBy?.id === assistantId).sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
}
