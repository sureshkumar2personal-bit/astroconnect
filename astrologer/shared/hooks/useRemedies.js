import { createStore, useStore } from '../lib/store.js';
import { TODAY } from '../lib/format.js';
import { remedySeed, userProgress } from '../data/mockRemedies.js';

// Remedy Tracker state and rules (spec 17_REMEDY_TRACKER.md). Prototype only; resets on reload.
// - AD-163 / AD-102: every appointment attachment (notes, remedy, recommendation, report) is
//   listed, linked to the User and the originating appointment — read live from the
//   Appointments state, so a newly saved attachment appears here at once.
// - AD-39: remedies from submitted Text Question answers and Dispute Answers are listed too.
// - AD-22 / REM-05: only the User marks a remedy Completed — there is no astrologer action for it.

export const remediesStore = createStore({ filter: '' });
export const setRemedyFilter = (filter) => remediesStore.patch({ filter });

const key = (ref, text) => `${ref}|${text.trim()}`;
const progress = new Map(userProgress.map((p) => [key(p.ref, p.text), p]));
const qHref = (id) => `/work/questions/${id}`;

/** All remedy records, newest first. `appointments` = ctx.apt.list, `questions` = ctx.tq.questions. */
export function buildRemedies(appointments = [], questions = []) {
  const out = remedySeed.map((r) => ({ ...r, href: qHref(r.ref) }));
  const seen = new Set(out.map((r) => key(r.ref, r.text)));
  const add = (r) => { const k = key(r.ref, r.text); if (!seen.has(k)) { seen.add(k); out.push(r); } };

  questions.forEach((q) => {
    if (q.answeredAt && q.remedy?.trim()) {
      add({ id: `RM-${q.id}`, uid: q.uid, user: q.name, src: 'Text Question', ref: q.id, href: qHref(q.id), text: q.remedy.trim(), date: q.answeredAt, done: false, file: '' });
    }
    if (q.disputeRemedy?.trim()) {
      add({ id: `RM-${q.id}-D`, uid: q.uid, user: q.name, src: 'Dispute Answer', ref: q.id, href: qHref(q.id), text: q.disputeRemedy.trim(), date: q.disputeAnsweredAt || TODAY.toISOString(), done: false, file: '' });
    }
  });

  appointments.forEach((a) => (a.att || []).forEach((x, i) => {
    const p = progress.get(key(a.id, x.text)) || {};
    add({
      id: p.id || `RM-${a.id}-${i + 1}`, uid: a.uid, user: a.user, src: `Appointment · ${x.type}`, ref: a.id,
      href: `/work/appointments/${a.id}`, text: x.text,
      // The appointment state keeps no save time; an attachment saved in this session is "today".
      date: p.date || TODAY.toISOString(), done: !!p.done, file: p.file || '',
    });
  }));

  return out.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const filterRemedies = (list, f) => list.filter((r) => !f || (f === 'done' ? r.done : !r.done));

export default function useRemedies() {
  return useStore(remediesStore);
}
