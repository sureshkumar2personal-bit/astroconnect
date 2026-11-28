// Documented Dispute Management actions that have no open rule
// (07-dispute-complaint-management.md): Internal Notes — Admin / authorized
// Support only (§3, §5) — and the evidence access log: who viewed which
// evidence and when (§8). Saved in this browser's localStorage; the dispute
// record itself is never changed, so its history is preserved.

const NOTES_KEY = 'astroconnect.disputeNotes';
const VIEWS_KEY = 'astroconnect.disputeEvidenceLog';
const ROLE = 'Super Admin';
export const NOTE_MAX = 1000;

function read(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function write(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}
const newId = (p) => `${p}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;
const actor = (s) => ({ id: s.accountId, name: s.fullName, role: ROLE });

export function addDisputeNote(disputeId, text, session) {
  const value = text.trim();
  if (!value) return { ok: false, error: 'Enter a note.' };
  if (value.length > NOTE_MAX) return { ok: false, error: `Notes can be up to ${NOTE_MAX} characters.` };
  const note = { id: newId('DN'), disputeId, text: value, by: actor(session), at: new Date().toISOString() };
  if (!write(NOTES_KEY, [...read(NOTES_KEY), note])) return { ok: false, error: 'The note could not be saved.' };
  return { ok: true, note };
}

export const disputeNotes = (disputeId) => read(NOTES_KEY).filter((n) => n.disputeId === disputeId).sort((a, b) => b.at.localeCompare(a.at));

export const allDisputeNotes = () => read(NOTES_KEY);
export const allEvidenceViews = () => read(VIEWS_KEY);

export function logEvidenceView(disputeId, evidenceLabel, session) {
  write(VIEWS_KEY, [...read(VIEWS_KEY), { id: newId('EV'), disputeId, evidence: evidenceLabel, by: actor(session), at: new Date().toISOString() }]);
}

export const evidenceViews = (disputeId) => read(VIEWS_KEY).filter((v) => v.disputeId === disputeId).sort((a, b) => b.at.localeCompare(a.at));
