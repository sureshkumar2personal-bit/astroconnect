import { createStore, useStore } from '@/lib/store.js';
import { EXPIRY_LABEL, MODULES, OTHER_ACCOUNTS, TODAY_LABEL, cloneP, preset, seedAssistants } from '@/data/mockAssistants.js';

// My Assistants state and rules (prototype; reference "My Assistants"). In memory only: nothing is sent or saved.
export const assistantStore = createStore({ assistants: seedAssistants(), nextNum: 10, lastId: null });
export const useAssistants = () => useStore(assistantStore);

export const roleLabel = (r) => (r === 'editor' ? 'Editor' : r === 'assistant' ? 'Assistant' : '—');
export const initials = (n) => String(n || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
const norm = (p) => JSON.stringify(Object.keys(p || {}).filter((k) => p[k] && p[k].length).sort().map((k) => [k, p[k].slice().sort()]));
const nowHM = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };

/** Preset / customised label for a permission set (reference permState). */
export function permState(perms, base) {
  const isPreset = base && norm(perms) === norm(preset(base));
  return {
    isPreset,
    label: isPreset ? `Preset: ${roleLabel(base)}` : `Customised · based on ${roleLabel(base)}`,
    short: isPreset ? `${roleLabel(base)} preset` : `Custom (from ${roleLabel(base)})`,
    count: `${Object.keys(perms).length} of ${MODULES.length} modules enabled`,
  };
}
export const samePerms = (a, b) => norm(a) === norm(b);

/** Validate the invitation form; returns { field: message }. */
export function validateInvite(f, list) {
  const e = {};
  const nm = (f.name || '').trim();
  if (nm.length < 2) e.name = nm ? 'Enter the full name (at least 2 characters).' : 'Enter the assistant’s full name.';
  const em = (f.email || '').trim().toLowerCase();
  if (!em) e.email = 'Enter an email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) e.email = 'Enter a valid email address, like name@example.com.';
  else {
    const hit = list.find((a) => a.email.toLowerCase() === em);
    if (hit && hit.status === 'removed') e.email = `This email belonged to a removed assistant (${hit.id}) and can’t be reused.`;
    else if (hit) e.email = `This email already has an assistant account (${hit.id}).`;
    else if (OTHER_ACCOUNTS.includes(em)) e.email = 'This email is already linked to another AstroConnect account.';
  }
  const digits = (f.mobile || '').replace(/\D/g, '');
  if (!digits) e.mobile = 'Enter a mobile number.';
  else if (!/^[6-9]\d{9}$/.test(digits)) e.mobile = 'Enter a valid 10-digit Indian mobile number.';
  if (!f.role) e.role = 'Select a role: Assistant or Editor.';
  else if (!Object.keys(f.perms || {}).length) e.perms = 'Give access to at least one module.';
  return e;
}

const log = (a, action, desc) => ({ ...a, activity: [{ d: TODAY_LABEL, t: nowHM(), age: 0, action, module: 'My Assistants', desc }, ...a.activity] });
const patch = (id, part, act) => assistantStore.patch((s) => ({ assistants: s.assistants.map((a) => (a.id === id ? (act ? log({ ...a, ...part }, act[0], act[1]) : { ...a, ...part }) : a)) }));

export const assistantActions = {
  /** Send an invitation: adds a Pending assistant and returns its id. */
  invite(f) {
    let id = '';
    assistantStore.patch((s) => {
      id = `AST-AS-${String(s.nextNum).padStart(4, '0')}`;
      const email = f.email.trim().toLowerCase();
      const a = {
        id, name: f.name.trim(), email, mobile: f.mobile.trim(), role: f.role, base: f.base || f.role, status: 'pending', invited: TODAY_LABEL, expires: EXPIRY_LABEL,
        joined: '', removedOn: '', statusSince: '', revoked: false, perms: cloneP(f.perms), av: (s.nextNum % 4) + 1, tasks: [],
        activity: [{ d: TODAY_LABEL, t: nowHM(), age: 0, action: 'Invitation sent', module: 'My Assistants', desc: `Invitation emailed to ${email} · valid 7 days` }],
      };
      return { assistants: [...s.assistants, a], nextNum: s.nextNum + 1, lastId: id };
    });
    return id;
  },
  editDetails: (id, name, mobile) => patch(id, { name, mobile }, ['Details edited', 'Astrologer updated name or mobile number']),
  savePerms(id, perms, base) {
    const ps = permState(perms, base);
    patch(id, { perms: cloneP(perms), base }, ['Permission changed', `Astrologer updated permissions · ${ps.short}, ${Object.keys(perms).length} modules`]);
  },
  suspend: (id) => patch(id, { status: 'suspended', statusSince: TODAY_LABEL }, ['Account suspended', 'Access suspended by Astrologer']),
  reactivate: (id) => patch(id, { status: 'active', statusSince: '' }, ['Account reactivated', 'Access restored with existing permissions']),
  remove: (id) => patch(id, { status: 'removed', removedOn: TODAY_LABEL }, ['Account removed', 'Access revoked by Astrologer. Records retained; email blocked from reuse.']),
  revoke: (id) => patch(id, { status: 'removed', removedOn: TODAY_LABEL, revoked: true }, ['Invitation revoked', 'Pending invitation revoked; link invalidated']),
  resend: (id, email) => patch(id, { status: 'pending', invited: TODAY_LABEL, expires: EXPIRY_LABEL }, ['Invitation resent', `New invitation emailed to ${email} · valid 7 days`]),
};
