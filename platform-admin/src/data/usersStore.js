// Users data for Platform Admin (DEMO). Single source for the Users List
// cards, table, exports and the profile placeholder. Status changes and
// their audit entries are kept in this browser's localStorage so they
// survive a refresh. Replace this module with API calls later.
//
// For reviewing states: add "?mock=empty" or "?mock=error" to the URL
// (before the "#").

import { generateUsers } from './mock/usersMock.js';

const STORAGE_KEY = 'astroconnect.demo.userStatus';

export const STATUSES = ['Active', 'Suspended', 'Blocked'];
export const ACCOUNT_TYPES = ['Guest', 'Registered'];

// Approved transitions (2026-11-28): Active → Suspend / Block;
// Suspended → Reactivate / Block; Blocked → Unblock. Reason always required.
export const ACTIONS = {
  suspend: { label: 'Suspend Account', verb: 'Suspend', past: 'suspended', to: 'Suspended' },
  block: { label: 'Block Account', verb: 'Block', past: 'blocked', to: 'Blocked' },
  reactivate: { label: 'Reactivate Account', verb: 'Reactivate', past: 'reactivated', to: 'Active' },
  unblock: { label: 'Unblock Account', verb: 'Unblock', past: 'unblocked', to: 'Active' },
};

export const TRANSITIONS = {
  Active: ['suspend', 'block'],
  Suspended: ['reactivate', 'block'],
  Blocked: ['unblock'],
};

let baseUsers = null;
let byId = null;

function getBaseUsers() {
  if (!baseUsers) baseUsers = generateUsers();
  return baseUsers;
}

function baseUserById(id) {
  if (!byId) byId = new Map(getBaseUsers().map((u) => [u.id, u]));
  return byId.get(id);
}

function readState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (parsed && typeof parsed === 'object') {
      return { overrides: parsed.overrides ?? {}, audit: parsed.audit ?? [] };
    }
  } catch {
    /* fall through */
  }
  return { overrides: {}, audit: [] };
}

function writeState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

function withOverrides(users, overrides) {
  return users.map((u) => (overrides[u.id] ? { ...u, status: overrides[u.id] } : u));
}

/** Load all users (with saved status changes). Simulates a short request. */
export async function loadUsers() {
  const scenario = new URLSearchParams(window.location.search).get('mock');
  await new Promise((resolve) => setTimeout(resolve, 250));
  if (scenario === 'error') throw new Error('The user list could not be loaded.');
  if (scenario === 'empty') return [];
  return withOverrides(getBaseUsers(), readState().overrides);
}

/** One user by ID (with saved status), or null. */
export function getUser(id) {
  const user = baseUserById(id);
  if (!user) return null;
  const status = readState().overrides[id];
  return status ? { ...user, status } : user;
}

/** All user status changes (Recent Activity). */
export const allUserAudit = () => readState().audit;

/** Status history for one user, newest first. */
export function getAudit(userId) {
  return readState()
    .audit.filter((a) => a.userId === userId)
    .sort((a, b) => b.at.localeCompare(a.at));
}

/**
 * Apply a status action. Returns { ok, user, entry } or { ok: false, error }.
 * The reason is mandatory for every action.
 */
export function changeStatus({ user, action, reason, notes, admin }) {
  const meta = ACTIONS[action];
  if (!meta || !TRANSITIONS[user.status]?.includes(action)) {
    return { ok: false, error: `${meta?.verb ?? 'This action'} is not available for a ${user.status} account.` };
  }
  if (!reason || !reason.trim()) {
    return { ok: false, error: 'A reason is required.' };
  }
  const state = readState();
  const entry = {
    id: `AUD-${Date.now().toString(36).toUpperCase()}`,
    userId: user.id,
    userName: user.name,
    action: meta.verb,
    previousStatus: user.status,
    newStatus: meta.to,
    reason: reason.trim(),
    notes: notes?.trim() || '',
    adminId: admin.accountId,
    adminName: admin.fullName,
    at: new Date().toISOString(),
  };
  const next = {
    overrides: { ...state.overrides, [user.id]: meta.to },
    audit: [...state.audit, entry],
  };
  if (!writeState(next)) {
    return { ok: false, error: 'This browser blocked storage, so the change could not be saved.' };
  }
  return { ok: true, user: { ...user, status: meta.to }, entry };
}

// ---------- Filtering, sorting, counting (shared by table and exports) ----------

export function countByStatus(users) {
  const counts = { total: users.length, Active: 0, Suspended: 0, Blocked: 0 };
  for (const u of users) counts[u.status] += 1;
  counts.restricted = counts.Suspended + counts.Blocked;
  return counts;
}

/** status: 'all' | 'Active' | 'Suspended' | 'Blocked' | 'restricted' */
export function filterUsers(users, { query = '', status = 'all', from = '', to = '' }) {
  const q = query.trim().toLowerCase();
  const qDigits = q.replace(/\D/g, '');
  const fromTs = from ? new Date(`${from}T00:00:00`).getTime() : null;
  const toTs = to ? new Date(`${to}T23:59:59.999`).getTime() : null;
  return users.filter((u) => {
    if (status === 'restricted' && u.status === 'Active') return false;
    if (status !== 'all' && status !== 'restricted' && u.status !== status) return false;
    if (fromTs !== null || toTs !== null) {
      const t = new Date(u.registeredAt).getTime();
      if (fromTs !== null && t < fromTs) return false;
      if (toTs !== null && t > toTs) return false;
    }
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (qDigits.length >= 3 && u.mobile.replace(/\D/g, '').includes(qDigits))
    );
  });
}

const SORTERS = {
  name: (a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id),
  id: (a, b) => a.id.localeCompare(b.id),
  status: (a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name),
  registeredAt: (a, b) => a.registeredAt.localeCompare(b.registeredAt) || a.id.localeCompare(b.id),
  lastActiveAt: (a, b) => a.lastActiveAt.localeCompare(b.lastActiveAt) || a.id.localeCompare(b.id),
};

export function sortUsers(users, { key, dir }) {
  const cmp = SORTERS[key] ?? SORTERS.registeredAt;
  const sorted = [...users].sort(cmp);
  return dir === 'desc' ? sorted.reverse() : sorted;
}

// ---------- Display formats (shared by table, cards and exports) ----------

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

export const formatDate = (iso) => dateFmt.format(new Date(iso));
export const formatTime = (iso) => timeFmt.format(new Date(iso));
export const formatDateTime = (iso) => `${dateFmt.format(new Date(iso))}, ${timeFmt.format(new Date(iso))}`;
