import { createStore, useStore } from '../lib/store.js';
import { TODAY } from '../lib/format.js';
import { ticketsSeed } from '../data/mockSupport.js';

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
    cat: cat || 'Account/Profile/KYC', sub: 'General', ref,
    desc: ref && cat === 'Audience/Customers' ? `Please review and block user ${ref}. Reason: ` : '',
    files: [],
  };
}

export const supportActions = {
  /** Create a ticket; returns { error } or { id }. */
  create(d) {
    const desc = d.desc.trim();
    if (!desc) return { error: 'Describe the issue.' };
    const { tickets } = supportStore.get();
    const id = `TCK-${1210 + tickets.length}`;
    const t = { id, cat: d.cat, sub: d.sub, ref: d.ref.trim(), files: d.files, desc, status: 'Open', hist: [{ title: 'Ticket created', at: now(), by: 'me', text: desc }] };
    supportStore.patch({ tickets: [t, ...tickets] });
    return { id };
  },
  reply: (id, text) => update(id, (t) => ({ ...t, status: 'Under Review', hist: [...t.hist, { title: 'Your reply', at: now(), by: 'me', text }] })),
  reopen: (id) => update(id, (t) => ({ ...t, status: 'Open', hist: [...t.hist, { title: 'Reopened', at: now(), by: 'me', text: 'Ticket reopened' }] })),
};

export default function useSupport() {
  return useStore(supportStore);
}
