// Astrologer account status, Admin profile edits and internal notes, kept in
// this browser's localStorage. Shared by the Astrologers List, the Astrologer
// Profile and the User Profile (which shows each astrologer's current name
// and status). Same approved transitions and mandatory reason as Users.

import { generateAstrologers, astrologerById } from './mock/astrologersMock.js';
import { ACTIONS, TRANSITIONS } from './usersStore.js';

const STATUS_KEY = 'astroconnect.astrologerStatus';
const EDITS_KEY = 'astroconnect.astrologerEdits';
const NOTES_KEY = 'astroconnect.astrologerNotes';
export const ADMIN_ROLE = 'Super Admin';

function read(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null');
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

const newId = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;

// ---------- editable profile fields (decision 4) ----------
export const EDITABLE_FIELDS = [
  ['name', 'Full Name', 'text'],
  ['displayName', 'Display Name', 'text'],
  ['gender', 'Gender', 'select', ['Female', 'Male', 'Other']],
  ['dateOfBirth', 'Date of Birth', 'date'],
  ['mobile', 'Mobile', 'text'],
  ['email', 'Email', 'email'],
  ['location', 'Location / Address', 'text'],
  ['preferredLanguage', 'Preferred Language', 'text'],
  ['bio', 'Bio', 'textarea'],
  ['specializations', 'Specializations', 'list'],
  ['astrologyTypes', 'Astrology Types', 'list'],
  ['experience', 'Years of Experience', 'number'],
  ['languages', 'Languages', 'list'],
  ['qualifications', 'Qualifications', 'list'],
  ['introduction', 'Professional Introduction', 'textarea'],
];

function editsState() {
  return read(EDITS_KEY, { byId: {}, log: [] });
}

/** Directory entry with saved status and Admin edits applied. */
export function getAstrologer(id) {
  const base = astrologerById(id);
  if (!base) return null;
  const status = read(STATUS_KEY, { overrides: {} }).overrides?.[id];
  const edits = editsState().byId[id] ?? {};
  return { ...base, ...edits, ...(status ? { status } : {}), availability: status && status !== 'Active' ? 'Offline' : base.availability };
}

/** All astrologers with saved changes applied. */
export function allAstrologers() {
  const overrides = read(STATUS_KEY, { overrides: {} }).overrides ?? {};
  const byId = editsState().byId;
  return generateAstrologers().map((a) => {
    const status = overrides[a.id];
    const merged = { ...a, ...(byId[a.id] ?? {}) };
    if (status) {
      merged.status = status;
      if (status !== 'Active') merged.availability = 'Offline';
    }
    return merged;
  });
}

/** Current { id, name, status } used inside other records. */
export function liveAstrologerRef(ref) {
  const a = getAstrologer(ref.id);
  return a ? { id: a.id, name: a.name, status: a.status } : ref;
}

// ---------- status (approved transitions, mandatory reason) ----------
export function getAstrologerAudit(id) {
  return (read(STATUS_KEY, { audit: [] }).audit ?? [])
    .filter((a) => a.userId === id)
    .sort((a, b) => b.at.localeCompare(a.at));
}

export function changeAstrologerStatus({ user: astrologer, action, reason, notes, admin }) {
  const meta = ACTIONS[action];
  if (!meta || !TRANSITIONS[astrologer.status]?.includes(action)) {
    return { ok: false, error: `${meta?.verb ?? 'This action'} is not available for a ${astrologer.status} account.` };
  }
  if (!reason || !reason.trim()) return { ok: false, error: 'A reason is required.' };
  const state = read(STATUS_KEY, { overrides: {}, audit: [] });
  const entry = {
    id: newId('AUD'),
    userId: astrologer.id,
    userName: astrologer.name,
    action: meta.verb,
    previousStatus: astrologer.status,
    newStatus: meta.to,
    reason: reason.trim(),
    notes: notes?.trim() || '',
    adminId: admin.accountId,
    adminName: admin.fullName,
    at: new Date().toISOString(),
  };
  const next = {
    overrides: { ...(state.overrides ?? {}), [astrologer.id]: meta.to },
    audit: [...(state.audit ?? []), entry],
  };
  if (!write(STATUS_KEY, next)) return { ok: false, error: 'The change could not be saved.' };
  return { ok: true, user: { ...astrologer, status: meta.to }, entry };
}

// ---------- profile edits ----------
export function getEditLog(id) {
  return editsState()
    .log.filter((e) => e.astrologerId === id)
    .sort((a, b) => b.at.localeCompare(a.at));
}

export function saveProfileEdit(id, values, reason, admin) {
  const current = getAstrologer(id);
  if (!current) return { ok: false, error: 'Astrologer not found.' };
  if (!reason.trim()) return { ok: false, error: 'A reason is required.' };
  const changes = [];
  const patch = {};
  for (const [key, label, type] of EDITABLE_FIELDS) {
    let v = values[key];
    if (type === 'list') v = String(v).split(',').map((x) => x.trim()).filter(Boolean);
    if (type === 'number') v = Number(v);
    const before = current[key];
    if (JSON.stringify(before) !== JSON.stringify(v)) {
      changes.push({ field: key, label, from: Array.isArray(before) ? before.join(', ') : String(before ?? ''), to: Array.isArray(v) ? v.join(', ') : String(v) });
      patch[key] = v;
    }
  }
  if (!changes.length) return { ok: false, error: 'No details were changed.' };
  if (patch.name !== undefined && !String(patch.name).trim()) return { ok: false, error: 'Full Name cannot be empty.' };
  if (patch.experience !== undefined && !(patch.experience >= 0 && patch.experience <= 70)) {
    return { ok: false, error: 'Enter a valid number of years of experience.' };
  }
  const state = editsState();
  const entry = {
    id: newId('EDIT'),
    astrologerId: id,
    changes,
    reason: reason.trim(),
    adminId: admin.accountId,
    adminName: admin.fullName,
    at: new Date().toISOString(),
  };
  const next = {
    byId: { ...state.byId, [id]: { ...(state.byId[id] ?? {}), ...patch } },
    log: [...state.log, entry],
  };
  if (!write(EDITS_KEY, next)) return { ok: false, error: 'The changes could not be saved.' };
  return { ok: true, entry };
}

// ---------- all logs (Recent Activity) ----------
export const allAstrologerAudit = () => read(STATUS_KEY, { audit: [] }).audit ?? [];
export const allAstrologerEdits = () => editsState().log;
export const allAstrologerNotes = () => read(NOTES_KEY, []);

// ---------- internal notes ----------
export function getAstrologerNotes(id) {
  return read(NOTES_KEY, [])
    .filter((n) => n.astrologerId === id)
    .sort((a, b) => b.at.localeCompare(a.at));
}

export function addAstrologerNote(id, text, admin) {
  if (!text.trim()) return { ok: false, error: 'Enter the note text.' };
  const note = { id: newId('NOTE'), astrologerId: id, text: text.trim(), by: { id: admin.accountId, name: admin.fullName, role: ADMIN_ROLE }, at: new Date().toISOString() };
  if (!write(NOTES_KEY, [...read(NOTES_KEY, []), note])) return { ok: false, error: 'The note could not be saved.' };
  return { ok: true, note };
}
