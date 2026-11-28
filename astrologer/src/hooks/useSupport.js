import { createStore, useStore } from '@/lib/store.js';
import { TODAY } from '@/lib/format.js';
import { ticketsSeed } from '@/data/mockSupport.js';

// Help & Support tickets (spec 16_HELP_AND_SUPPORT.md, AD-158 – AD-162). Prototype only:
// nothing reaches the Platform, attachments are not uploaded; state resets on reload.
// Status changes after a reply / reopen follow the reference prototype; transitions are not
// defined in the spec (AP-16-01) and reopen conditions are pending (AP-16-02).

export const supportStore = createStore({ tickets: ticketsSeed });

const now = () => TODAY.toISOString();
const update = (id, fn) => supportStore.patch((s) => ({ tickets: s.tickets.map((t) => (t.id === id ? fn(t) : t)) }));

export const lastUpdate = (t) => t.hist[t.hist.length - 1].at;
export const findTicket = (id) => supportStore.get().tickets.find((t) => t.id === id);

/** Draft for a new ticket. `ref` + Audience/Customers pre-fills a user-block request (AD-161). */
export function newDraft(cat = '', ref = '') {
  return {
    cat: cat || '', sub: 'General', subject: '', ref,
    desc: ref && cat === 'Audience/Customers' ? `Please review and block user ${ref}. Reason: ` : '',
    files: [],
  };
}

export const supportActions = {
  /** Create a ticket; returns { error, field } or { id }. Category, Subject and Issue description are required. */
  create(d) {
    const desc = d.desc.trim(), subject = (d.subject || '').trim();
    if (!d.cat) return { error: 'Choose a category.', field: 'cat' };
    if (!subject) return { error: 'Add a short subject.', field: 'subject' };
    if (!desc) return { error: 'Describe the issue.', field: 'desc' };
    const { tickets } = supportStore.get();
    const id = `TCK-${1210 + tickets.length}`;
    const t = { id, cat: d.cat, sub: d.sub, subject, ref: d.ref.trim(), files: d.files, desc, status: 'Open', hist: [{ title: 'Ticket created', at: now(), by: 'me', text: desc }] };
    supportStore.patch({ tickets: [t, ...tickets] });
    return { id };
  },
  reply: (id, text, files = []) => update(id, (t) => ({ ...t, status: 'Under Review', hist: [...t.hist, { title: 'Your reply', at: now(), by: 'me', text, files }] })),
  reopen: (id) => update(id, (t) => ({ ...t, status: 'Open', hist: [...t.hist, { title: 'Reopened', at: now(), by: 'me', text: 'Ticket reopened' }] })),
};

export default function useSupport() {
  return useStore(supportStore);
}
