import { createStore, useStore } from '@/lib/store.js';
import { navigate } from '@/lib/router.js';
import { TEMPLATES, USERS, SEED, TONES, seedMethods, seedA, snap, addAct } from '@/data/remedyData.js';
import {
  TODAY, SERVICE_NAMES, addD, nowT, deriveAssignment, fD, plural,
} from '@/lib/remedyModel.js';

// Remedy Tracker state (spec 17_REMEDY_TRACKER.md; AD-174 – AD-178). Prototype only: nothing is saved
// to a server; the state lives for the browser session. Daily statuses and final completion are
// reported by the User (User App) — there is no astrologer action that sets them (AD-22).
// Routes: #/remedies[/methods|/assignments|/attention|/history|/remedy/<id>|/assignment/<id>|/form].

const methods0 = seedMethods();
const k = (() => { let n = 1; return () => `k${++n}`; })();

// The method form being edited is kept in session storage so a reload (or a dev-server hot reload)
// returns to the same form instead of an empty address. Only the in-progress form is stored, in this
// browser tab only; an image chosen from the device is not stored (its preview address is session-bound).
const DRAFT_KEY = 'rm-method-draft';
function loadDraft() {
  try {
    const f = JSON.parse(window.sessionStorage.getItem(DRAFT_KEY) || 'null');
    return f && typeof f === 'object' && Array.isArray(f.materials) && Array.isArray(f.steps) ? f : null;
  } catch { return null; }
}

export const remedyStore = createStore({
  stack: [],
  users: USERS,
  methods: methods0,
  assignments: SEED.map((s) => seedA(s, methods0)),
  seq: 2061,
  oq: '', ouq: '', oservice: 'all', ostatus: 'all', ofrom: '', oto: '', osort: 'newest', oseg: 'all', ofOpen: false,
  lq: '', lservice: 'all', lstatus: 'all', lfrom: '', lto: '', lsort: 'newest', lpage: 1, expanded: {},
  aservice: 'all', agroup: 'all', rconsec: '2', rgrace: '0',
  hq: '', hservice: 'all', hfilter: 'all', hfrom: '', hto: '',
  mtab: 'templates', mq: '', mcat: 'all', mstatus: 'all', mflag: 'all', tq: '', tcat: 'all',
  form: loadDraft(), modal: null, assign: null, editA: null, confirm: null, lightbox: null, tplId: null, viewMethodId: null,
  noteDraft: '', editNoteId: null, editNoteText: '', toast: null,
});

const S = () => remedyStore.get();
remedyStore.subscribe(() => {
  try {
    const f = remedyStore.get().form;
    if (!f) { window.sessionStorage.removeItem(DRAFT_KEY); return; }
    const image = f.image && f.image.url ? null : f.image;
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...f, image }));
  } catch { /* storage unavailable: the form simply isn't kept across reloads */ }
});
const patch = (p) => remedyStore.patch(p);
const here = () => (window.location.hash.replace(/^#/, '') || '/remedies');

let tt;
export function toast(msg, kind = 'ok') {
  clearTimeout(tt);
  patch({ toast: { msg, kind } });
  tt = setTimeout(() => patch({ toast: null }), 3000);
}

// ---------- navigation ----------
export const PATH = {
  overview: '/remedies', methods: '/remedies/methods', assignments: '/remedies/assignments',
  attention: '/remedies/attention', history: '/remedies/history', form: '/remedies/form',
  remedy: (id) => `/remedies/remedy/${encodeURIComponent(id)}`,
  assignment: (id) => `/remedies/assignment/${encodeURIComponent(id)}`,
};
export const nav = (path) => { patch((s) => ({ stack: [...s.stack, here()] })); navigate(path); };
export const goTab = (path) => { patch({ stack: [], modal: null, form: null }); navigate(path); };
export const back = (fallback = PATH.overview) => {
  const st = S().stack.slice();
  const to = st.pop() || fallback;
  patch({ stack: st, modal: null });
  navigate(to);
};
export const openRemedy = (id) => { patch({ lq: '', lservice: 'all', lstatus: 'all', lfrom: '', lto: '', lpage: 1 }); nav(PATH.remedy(id)); };
export const openA = (id) => { patch({ noteDraft: '', editNoteId: null, modal: null }); nav(PATH.assignment(id)); };
export const set = (p) => patch(p);
export const setL = (p) => patch({ ...p, lpage: 1 });
export const closeModal = () => patch({ modal: null, lightbox: null });

const updA = (id, fn) => patch((s) => ({ assignments: s.assignments.map((a) => (a.id === id ? fn(a) : a)) }));
const curId = () => decodeURIComponent((here().match(/\/remedies\/assignment\/([^/]+)/) || [])[1] || '');
const curA = () => S().assignments.find((a) => a.id === curId());

// ---------- methods & form ----------
const blankForm = () => ({ mode: 'create', methodId: null, templateId: null, templateName: null, name: '', category: 'Pooja', duration: '7', short: '', description: '', image: null, materials: [{ id: k(), name: '', qty: '' }], steps: [{ id: k(), title: '', detail: '' }], notes: '' });
const formFrom = (m, mode) => ({
  mode, methodId: mode === 'edit' ? m.id : null, templateId: m.templateId || null, templateName: m.templateName || null,
  name: m.name, category: m.category, duration: String(m.duration), short: m.short || '', description: m.description || '', image: m.image || null,
  materials: m.materials.map((x) => ({ id: k(), name: x.name, qty: x.qty })), steps: m.steps.map((x) => ({ id: k(), title: x.title, detail: x.detail })), notes: m.notes || '',
});
const openForm = (form) => { patch({ form, modal: null }); nav(PATH.form); };
export const createMethod = () => openForm(blankForm());
/** Opening the form address with no draft starts a blank Create New Method form (no navigation). */
export const ensureForm = () => { if (!S().form) patch({ form: blankForm() }); };
export const useTemplate = (t) => { patch({ modal: null }); openForm(formFrom({ ...t, templateId: t.id, templateName: t.name, notes: '', image: null }, 'template')); };
export const editMethod = (m) => { patch({ modal: null }); openForm(formFrom(m, 'edit')); };
export const setF = (key, v) => patch((s) => ({ form: { ...s.form, [key]: v } }));
export const setFL = (list, i, key, v) => patch((s) => ({ form: { ...s.form, [list]: s.form[list].map((x, j) => (j === i ? { ...x, [key]: v } : x)) } }));
export const addFL = (list, blank) => patch((s) => ({ form: { ...s.form, [list]: [...s.form[list], { id: k(), ...blank }] } }));
export const delFL = (list, i) => patch((s) => ({ form: { ...s.form, [list]: s.form[list].filter((_, j) => j !== i) } }));
export const moveFL = (list, i, dir) => patch((s) => {
  const l = s.form[list].slice(); const j = i + dir;
  if (j < 0 || j >= l.length) return {};
  [l[i], l[j]] = [l[j], l[i]];
  return { form: { ...s.form, [list]: l } };
});
export function saveForm(draft) {
  const s = S(); const f = s.form; const dur = parseInt(f.duration, 10);
  if (!f.name.trim()) { toast('Please enter a Remedy Name.', 'err'); return; }
  if (!(dur >= 1 && dur <= 60)) { toast('Recommended duration must be between 1 and 60 days.', 'err'); return; }
  const data = {
    name: f.name.trim(), category: f.category, duration: dur, short: f.short.trim(), description: f.description.trim(), image: f.image,
    materials: f.materials.filter((x) => x.name.trim()).map((x) => ({ name: x.name.trim(), qty: x.qty.trim() })),
    steps: f.steps.filter((x) => x.title.trim() || x.detail.trim()).map((x) => ({ title: x.title.trim() || 'Step', detail: x.detail.trim() })),
    notes: f.notes.trim(), edited: TODAY,
  };
  if (f.mode === 'edit') {
    patch((st) => ({ methods: st.methods.map((m) => (m.id === f.methodId ? { ...m, ...data, status: draft ? 'draft' : (m.status === 'draft' ? 'active' : m.status) } : m)), form: null }));
    back(PATH.methods);
    toast(draft ? 'Saved as draft.' : 'Method updated. Existing assignments keep their original snapshot.');
  } else {
    const nm = { id: `m${Date.now()}`, source: f.templateId ? 'template' : 'me', templateId: f.templateId, templateName: f.templateName, status: draft ? 'draft' : 'active', created: TODAY, tone: TONES[s.methods.length % TONES.length], ...data };
    patch((st) => ({ methods: [...st.methods, nm], form: null, stack: [], mtab: 'mine', mstatus: 'all', mq: '', mcat: 'all', mflag: 'all' }));
    navigate(PATH.methods);
    toast(draft ? `“${nm.name}” saved as a draft.` : `“${nm.name}” saved to My Saved Methods.`);
  }
}
export function dupMethod(m) {
  const nm = { ...m, id: `m${Date.now()}`, name: `${m.name} (Copy)`, created: TODAY, edited: TODAY, status: 'active', materials: m.materials.map((x) => ({ ...x })), steps: m.steps.map((x) => ({ ...x })) };
  patch((s) => ({ methods: [...s.methods, nm], mstatus: 'all', modal: null }));
  toast(`Duplicated as “${nm.name}”.`);
}

// ---------- confirm (archive / restore / delete / stop / cancel / delete note) ----------
export const ask = (c) => patch({ modal: 'confirm', confirm: { reason: '', ...c } });
export function doConfirm() {
  const c = S().confirm; if (!c) return;
  if (c.needReason && !c.reason.trim()) { toast('Please provide a reason to continue.', 'err'); return; }
  const r = c.reason.trim(); const close = { modal: null, confirm: null };
  if (c.action === 'archive') { patch((st) => ({ methods: st.methods.map((m) => (m.id === c.id ? { ...m, status: 'archived', edited: TODAY } : m)), ...close })); toast('Method archived. Existing assignments are unchanged.'); }
  else if (c.action === 'restore') { patch((st) => ({ methods: st.methods.map((m) => (m.id === c.id ? { ...m, status: 'active' } : m)), ...close })); toast('Method restored and available for new assignments.'); }
  else if (c.action === 'delete') { patch((st) => ({ methods: st.methods.filter((m) => m.id !== c.id), ...close })); toast('Method deleted.'); }
  else if (c.action === 'stop') { updA(c.id, (a) => addAct({ ...a, stopped: { d: TODAY, reason: r } }, 'stop', `Remedy stopped by you · ${r}`)); patch(close); toast('Remedy stopped. All recorded days are preserved.'); }
  else if (c.action === 'cancel') { updA(c.id, (a) => addAct({ ...a, cancelled: { d: TODAY, reason: r } }, 'cancel', `Assignment cancelled · ${r}`)); patch(close); toast('Assignment cancelled and kept in History.'); }
  else if (c.action === 'delnote') { updA(c.id, (a) => ({ ...a, notes: a.notes.filter((n) => n.id !== c.noteId) })); patch(close); toast('Private note deleted.'); }
}

// ---------- assign ----------
export function openAssign(pre = {}) {
  const a = { userId: pre.userId || null, userQ: '', service: pre.service || 'text', methodId: null, methodQ: '', assigned: TODAY, start: addD(TODAY, 1), duration: '', instructions: '', note: '' };
  if (pre.methodId) {
    const m = S().methods.find((x) => x.id === pre.methodId);
    if (m && m.status === 'active') { a.methodId = m.id; a.duration = String(m.duration); a.instructions = m.description; }
  }
  patch({ modal: 'assign', assign: a });
}
export const setAsg = (o) => patch((s) => ({ assign: { ...s.assign, ...o } }));
export function confirmAssign() {
  const s = S(); const f = s.assign;
  const m = s.methods.find((x) => x.id === f.methodId); const u = s.users.find((x) => x.id === f.userId); const dur = parseInt(f.duration, 10);
  if (!u) { toast('Select a User to continue.', 'err'); return; }
  if (!m) { toast('Select a Saved Method to continue.', 'err'); return; }
  if (!(dur >= 1 && dur <= 60)) { toast('Duration must be between 1 and 60 days.', 'err'); return; }
  if (!f.assigned || !f.start) { toast('Assignment and start dates are required.', 'err'); return; }
  if (f.start < f.assigned) { toast('Start date cannot be before the assignment date.', 'err'); return; }
  const id = `AS-${s.seq}`;
  const na = {
    id, userId: u.id, methodId: m.id, service: f.service, assigned: f.assigned, start: f.start, duration: dur, logs: {}, final: null, stopped: null, cancelled: null,
    instructions: f.instructions.trim() || m.description, astroNote: f.note.trim(), notes: [], followUp: false, snapshot: snap(m, TODAY),
    activity: [{ d: TODAY, t: nowT(), k: 'create', text: `Assignment created · ${dur} days via ${SERVICE_NAMES[f.service]}${dur !== m.duration ? ` (method default ${m.duration} days)` : ''}` }],
  };
  patch((st) => ({ assignments: [...st.assignments, na], seq: st.seq + 1, modal: null, assign: null, noteDraft: '', editNoteId: null }));
  nav(PATH.assignment(id));
  toast(`${m.name} assigned to ${u.name} · ${id}`);
}

// ---------- edit assignment ----------
export const minDur = (a) => { let mx = 0; Object.keys(a.logs).forEach((i) => { mx = Math.max(mx, +i + 1); }); return Math.max(1, mx); };
export function openEdit() { const a = curA(); patch({ modal: 'edit', editA: { duration: String(a.duration), instructions: a.instructions, note: a.astroNote } }); }
export const setEdit = (o) => patch((s) => ({ editA: { ...s.editA, ...o } }));
export function saveEdit() {
  const a = curA(); const e = S().editA; const dur = parseInt(e.duration, 10); const min = minDur(a);
  if (!(dur >= min && dur <= 60)) { toast(`Duration must be between ${min} and 60 days to preserve recorded days.`, 'err'); return; }
  let n = { ...a }; let changed = false;
  if (dur !== a.duration) { n.duration = dur; n = addAct(n, 'edit', `Duration changed from ${a.duration} to ${dur} days · recorded days preserved, schedule now ends ${fD(addD(a.start, dur - 1))}`); changed = true; }
  if (e.instructions.trim() !== a.instructions) { n.instructions = e.instructions.trim(); n = addAct(n, 'edit', 'Instructions updated for the remaining days'); changed = true; }
  if (e.note.trim() !== a.astroNote) { n.astroNote = e.note.trim(); n = addAct(n, 'edit', 'Assignment note updated'); changed = true; }
  if (!changed) { patch({ modal: null }); toast('No changes to save.'); return; }
  updA(a.id, () => n); patch({ modal: null, editA: null }); toast('Assignment updated. Earlier progress is unchanged.');
}

// ---------- assignment detail actions ----------
export function toggleFollow() {
  const a = curA();
  updA(a.id, (x) => addAct({ ...x, followUp: !x.followUp }, 'edit', x.followUp ? 'Follow-up flag removed' : 'Marked for follow-up'));
  toast(a.followUp ? 'Follow-up flag removed.' : 'Marked for follow-up. It now appears in Needs Attention.');
}
export const assignAgain = () => { const a = curA(); openAssign({ userId: a.userId, methodId: a.methodId, service: a.service }); };
export const stopRemedy = () => ask({ action: 'stop', id: curId(), title: 'Stop this remedy?', body: 'The status becomes Stopped / Skipped and the User can no longer send daily updates. Completed and skipped days, notes and history are all preserved.', confirmLabel: 'Stop remedy', danger: true, needReason: true, reasonLabel: 'Reason for stopping (required)' });
export const cancelAssignment = () => ask({ action: 'cancel', id: curId(), title: 'Cancel this assignment?', body: 'The assignment hasn’t started yet. It will be marked Cancelled and kept in History — it is never deleted.', confirmLabel: 'Cancel assignment', danger: true, needReason: true, reasonLabel: 'Cancellation reason (required)' });
export function addNote() {
  const t = S().noteDraft.trim();
  if (!t) { toast('Write a note first.', 'err'); return; }
  updA(curId(), (a) => ({ ...a, notes: [...a.notes, { id: k(), d: TODAY, t: nowT(), text: t }] }));
  patch({ noteDraft: '' }); toast('Private note added.');
}
export function saveNote() {
  const s = S(); const t = s.editNoteText.trim();
  if (!t) { toast('A note can’t be empty.', 'err'); return; }
  updA(curId(), (a) => ({ ...a, notes: a.notes.map((n) => (n.id === s.editNoteId ? { ...n, text: t, ed: true } : n)) }));
  patch({ editNoteId: null }); toast('Note updated.');
}
export const toggleExpanded = (id) => patch((s) => ({ expanded: { ...s.expanded, [id]: !s.expanded[id] } }));
export const openPhoto = (photos, idx) => patch({ modal: 'lightbox', lightbox: { photos, idx } });

// ---------- derived data ----------
/** All assignments, derived against the current attention rules. */
export function deriveAll(s) {
  const U = {}; s.users.forEach((u) => { U[u.id] = u; });
  const ctx = { U, consec: +s.rconsec, grace: +s.rgrace };
  const all = s.assignments.map((a) => deriveAssignment(a, ctx));
  const byId = {}; all.forEach((d) => { byId[d.id] = d; });
  const M = {}; s.methods.forEach((m) => { M[m.id] = m; });
  return { all, byId, U, M };
}

export { TEMPLATES, plural };
export default function useRemedies() {
  return useStore(remedyStore);
}
