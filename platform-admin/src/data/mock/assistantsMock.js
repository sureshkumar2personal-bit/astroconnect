// Assistants (local data): the Dashboard's 42 assistant accounts plus a few
// Removed records kept as read-only history. IDs follow AST-AS-0001 in
// creation order. Kavya R (AST-AS-0001, Finance + Operations) is the Wallet
// Management Assistant already named in user wallet adjustment records.
//
// Rules (assistant-management.md + AD-173, decisions of 2026-11-28):
// - Types: Admin Assistant (Super Admin; one or more departments, no
//   astrologer) and Astrologer Assistant (exactly one astrologer).
// - Roles: Assistant · Editor (presets); permissions may be customised.
// - Statuses: Pending · Active · Suspended · Expired · Removed; invitations
//   are valid for 7 days.

import { generateAstrologers } from './astrologersMock.js';
import { DAY, HOUR, MIN, iso, rng, snapshotTime } from './seed.js';

export const KAVYA_ID = 'AST-AS-0001';
export const INVITE_DAYS = 7;

// ---------- permission catalogue ----------
export const ADMIN_ACTIONS = ['View', 'Create', 'Edit', 'Assign', 'Approve', 'Reject', 'Cancel', 'Export'];
export const ASTRO_ACTIONS = ['View', 'Create', 'Edit', 'Manage', 'Delete'];

/** Admin departments and modules. Assistant Management is Super Admin only. */
export const ADMIN_DEPARTMENTS = {
  'People Management': ['Users', 'Astrologers'],
  'Service Management': ['Overview', 'Text Questions', 'Appointments', 'Instant Call', 'Instant Chat'],
  Finance: ['Wallet Overview', 'Service Revenue', 'Platform Commission', 'Astrologer Earnings', 'User Wallet Deposits', 'Payment Transactions', 'Refunds', 'Settlements', 'Payouts', 'Commission Settings', 'Financial Reports'],
  Operations: ['Disputes', 'Technical Complaints', 'Remedies', 'Content Management', 'Ratings & Reviews', 'Availability'],
  'Recent Activity': ['Recent Activity'],
  'Document Management': ['Document Management'],
};

/** Astrologer App modules. My Assistants and Settings cannot be delegated. */
export const ASTRO_MODULES = ['Home', 'Text Questions', 'Appointments', 'Instant Call & Chat', 'Live Sessions', 'Wallet & Earnings', 'Offers', 'Ratings & Reviews', 'Audience', 'Content Management', 'Analytics', 'Notifications', 'Help & Support', 'Remedy Tracker', 'Service Management'];

/** Actions that may ever be granted for a module (forbidden ones excluded). */
export function allowedActions(type, module) {
  if (type === 'Astrologer Assistant') {
    if (!ASTRO_MODULES.includes(module)) return [];
    // Wallet: view only — transfers, withdrawals and approvals are never granted.
    return module === 'Wallet & Earnings' ? ['View'] : ASTRO_ACTIONS;
  }
  const dept = Object.keys(ADMIN_DEPARTMENTS).find((d) => ADMIN_DEPARTMENTS[d].includes(module));
  if (!dept) return [];
  if (module === 'Commission Settings') return ['View', 'Export']; // Super Admin controls
  if (dept === 'Finance') return ADMIN_ACTIONS.filter((a) => a !== 'Approve' && a !== 'Reject'); // no financial approvals
  return ADMIN_ACTIONS;
}

/** Modules an assistant can be granted (by type and departments). */
export function grantableModules(type, departments = []) {
  if (type === 'Astrologer Assistant') return ASTRO_MODULES;
  return departments.flatMap((d) => ADMIN_DEPARTMENTS[d] ?? []);
}

const PRESET = {
  'Admin Assistant': { Assistant: ['View', 'Export'], Editor: ['View', 'Create', 'Edit', 'Assign', 'Export'] },
  'Astrologer Assistant': { Assistant: ['View'], Editor: ['View', 'Create', 'Edit'] },
};

/** Permissions of a preset (Assistant / Editor) for a type and departments. */
export function presetPermissions(type, role, departments = []) {
  const out = {};
  for (const m of grantableModules(type, departments)) {
    const acts = PRESET[type][role].filter((a) => allowedActions(type, m).includes(a));
    if (acts.length) out[m] = acts;
  }
  return out;
}

// ---------- generator ----------
const GIVEN = ['Kavya', 'Rohan', 'Sindhu', 'Arvind', 'Megha', 'Pranav', 'Divya', 'Nikhil', 'Aparna', 'Vishal', 'Keerthi', 'Sanjana', 'Hemant', 'Ritika', 'Gautam', 'Lavanya', 'Abhinav', 'Pavithra', 'Sharath', 'Nithya', 'Yogesh', 'Bhuvana', 'Deepak', 'Monica'];
const FAMILY = ['R', 'Menon', 'Iyer', 'Patil', 'Nair', 'Kulkarni', 'Rao', 'Sharma', 'Desai', 'Pillai', 'Reddy', 'Joshi', 'Bhat', 'Varma'];

const TASKS = {
  Finance: ['Review pending wallet top-ups', 'Prepare monthly payout summary', 'Reconcile refund credits', 'Check failed payment transactions'],
  Operations: ['Follow up on open technical complaints', 'Review disputes waiting for Admin Review', 'Check hidden reviews flagged by users', 'Review remedy reports'],
  'People Management': ['Verify updated astrologer profiles', 'Review newly registered users', 'Follow up on suspended accounts'],
  'Service Management': ['Monitor today’s confirmed appointments', 'Review overdue Text Questions', 'Check instant session issues'],
  'Recent Activity': ['Review weekly activity export'],
  'Document Management': ['Organise uploaded astrologer documents'],
};

const WORK = {
  Finance: ['Viewed wallet transactions', 'Exported payment transactions report', 'Reviewed refund details'],
  Operations: ['Added internal note to a dispute', 'Replied to a technical complaint', 'Reviewed a reported review'],
  'People Management': ['Viewed a user profile', 'Viewed an astrologer profile'],
  'Service Management': ['Viewed appointment details', 'Viewed Text Question details'],
  'Recent Activity': ['Exported activity history'],
  'Document Management': ['Viewed an astrologer document'],
  astro: ['Replied to a review', 'Scheduled a content post', 'Updated appointment notes', 'Viewed Text Questions', 'Drafted daily predictions'],
};

let cache = null;

/** All assistant records (oldest first) with their seeded history. */
export function generateAssistants(now = new Date()) {
  const snapshot = snapshotTime(now);
  if (cache?.snapshot === snapshot) return cache.list;
  const r = rng(424242);
  const astrologers = generateAstrologers(now).filter((a) => a.status === 'Active' && snapshot - new Date(a.joinedAt).getTime() > 60 * DAY);
  const superAdmin = { id: 'SA-1001', name: 'Platform Super Admin', role: 'Super Admin' };

  // 42 current accounts + 4 removed = 46 records.
  const plan = [];
  plan.push({ type: 'Admin Assistant', status: 'Active', kavya: true });
  const statuses = [
    ...Array(30).fill('Active'),
    ...Array(4).fill('Pending'),
    ...Array(3).fill('Suspended'),
    ...Array(4).fill('Expired'),
    ...Array(4).fill('Removed'),
  ];
  for (const st of statuses) plan.push({ type: r.chance(0.4) ? 'Admin Assistant' : 'Astrologer Assistant', status: st });

  const created = plan.map((p, i) => {
    let invitedAt;
    if (p.kavya) invitedAt = snapshot - 1300 * DAY;
    else if (p.status === 'Pending') invitedAt = snapshot - r.between(2 * HOUR, 5 * DAY);
    else if (p.status === 'Expired') invitedAt = snapshot - r.between(10 * DAY, 80 * DAY);
    else invitedAt = snapshot - r.between(20 * DAY, 1000 * DAY);
    return { ...p, invitedAt, order: i };
  });
  created.sort((a, b) => a.invitedAt - b.invitedAt);

  const usedEmails = new Set();
  let onlineLeft = 4;
  const list = created.map((p, i) => {
    const id = `AST-AS-${String(i + 1).padStart(4, '0')}`;
    const given = p.kavya ? 'Kavya' : r.pick(GIVEN.slice(1));
    const family = p.kavya ? 'R' : r.pick(FAMILY.slice(1));
    const name = `${given} ${family}`;
    let base = `${given}.${family}`.toLowerCase().replace(/[^a-z.]/g, '');
    let email = `${base}@example.com`;
    for (let n = 2; usedEmails.has(email); n++) email = `${base}${n}@example.com`;
    usedEmails.add(email);
    const mobile = `+91 ${String(6 + Math.floor(r.rand() * 4))}${String(Math.floor(r.rand() * 1e4)).padStart(4, '0')} ${String(Math.floor(r.rand() * 1e5)).padStart(5, '0')}`;
    const role = p.kavya ? 'Editor' : r.chance(0.55) ? 'Assistant' : 'Editor';
    let departments = [];
    let astrologer = null;
    let invitedBy = superAdmin;
    if (p.type === 'Admin Assistant') {
      departments = p.kavya ? ['Finance', 'Operations'] : r.some(Object.keys(ADMIN_DEPARTMENTS), 1, 3);
    } else {
      const eligible = astrologers.filter((a) => new Date(a.joinedAt).getTime() < p.invitedAt - DAY);
      const a = r.pick(eligible.length ? eligible : astrologers);
      astrologer = { id: a.id, name: a.name };
      invitedBy = { id: a.id, name: a.name, role: 'Astrologer' };
    }

    const accepted = ['Active', 'Suspended', 'Removed'].includes(p.status);
    const acceptedAt = accepted ? p.invitedAt + r.between(2 * HOUR, 5 * DAY) : null;
    let permissions = presetPermissions(p.type, role, departments);
    let mode = `${role} preset`;
    const events = [];
    const ev = (at, action, module, description, by = invitedBy) => events.push({ at: iso(at), action, module, description, by });
    ev(p.invitedAt, 'Invitation sent', 'Account', `Invitation sent to ${email} as ${role} (${p.type}); valid for ${INVITE_DAYS} days`);
    if (p.status === 'Expired') {
      ev(p.invitedAt + INVITE_DAYS * DAY, 'Invitation expired', 'Account', 'Invitation was not accepted within 7 days', { id: 'system', name: 'AstroConnect', role: 'System' });
    }
    if (accepted) {
      ev(acceptedAt, 'Invitation accepted', 'Account', 'Email verified, password set and invitation accepted; account Active', { id, name, role: p.type });
    }
    // Some accounts were customised after joining.
    if (accepted && r.chance(0.35)) {
      const modules = Object.keys(permissions);
      const m = r.pick(modules);
      const extra = allowedActions(p.type, m).find((a) => !permissions[m].includes(a));
      if (extra) {
        const before = permissions[m].join(', ');
        permissions = { ...permissions, [m]: [...permissions[m], extra] };
        mode = 'Custom';
        ev(acceptedAt + r.between(DAY, 30 * DAY), 'Permission changed', m, `${before} → ${permissions[m].join(', ')}`);
      }
    }
    const lastSeen = snapshot - r.between(10 * MIN, 6 * DAY);
    let lastActiveAt = null;
    let suspendedAt = null;
    let removedAt = null;
    if (p.status === 'Active') {
      lastActiveAt = onlineLeft > 0 && r.chance(0.3) ? snapshot - r.between(MIN, 10 * MIN) : lastSeen;
      if (snapshot - lastActiveAt < 10 * MIN) onlineLeft -= 1;
    }
    if (p.status === 'Suspended') {
      suspendedAt = acceptedAt + r.between(10 * DAY, Math.max(11 * DAY, snapshot - acceptedAt - DAY));
      suspendedAt = Math.min(suspendedAt, snapshot - DAY);
      lastActiveAt = suspendedAt - r.between(HOUR, 2 * DAY);
      ev(suspendedAt, 'Suspended', 'Account', 'Reason: Access paused while responsibilities are reassigned');
    }
    if (p.status === 'Removed') {
      removedAt = Math.min(snapshot - DAY, acceptedAt + r.between(15 * DAY, 300 * DAY));
      lastActiveAt = removedAt - r.between(HOUR, 3 * DAY);
      ev(removedAt, 'Removed', 'Account', 'Reason: No longer part of the team. Email permanently blocked from reuse');
    }
    // Work activity (logins and module actions) while the account was usable.
    const workEnd = lastActiveAt ?? null;
    if (accepted && workEnd) {
      const count = Math.min(14, 3 + Math.floor((workEnd - acceptedAt) / (25 * DAY)));
      for (let k = 0; k < count; k++) {
        const at = r.between(acceptedAt + HOUR, workEnd);
        const module = p.type === 'Admin Assistant' ? r.pick(Object.keys(permissions)) : r.pick(Object.keys(permissions));
        const dept = p.type === 'Admin Assistant' ? Object.keys(ADMIN_DEPARTMENTS).find((d) => ADMIN_DEPARTMENTS[d].includes(module)) : 'astro';
        ev(at, 'Signed in', 'Login', p.type === 'Admin Assistant' ? 'Signed in to Platform Admin' : `Signed in to ${astrologer.name}’s dashboard`, { id, name, role: p.type });
        ev(at + r.between(5 * MIN, HOUR), r.pick(WORK[dept] ?? WORK.astro), module, `${module} · within granted permissions`, { id, name, role: p.type });
      }
      ev(workEnd, 'Last active', 'Login', 'Last activity recorded', { id, name, role: p.type });
    }

    // Tasks: Admin Assistants only (Astrologer App has no tasks — AD-173).
    const tasks = [];
    if (p.type === 'Admin Assistant' && accepted) {
      const n = 3 + Math.floor(r.rand() * 7);
      for (let k = 0; k < n; k++) {
        const dept = r.pick(departments);
        const assignedAt = r.between(acceptedAt + HOUR, (removedAt ?? suspendedAt ?? snapshot) - HOUR);
        const dueAt = assignedAt + r.between(DAY, 10 * DAY);
        const done = dueAt < snapshot - DAY ? r.chance(0.8) : r.chance(0.3);
        const completedAt = done ? Math.min(snapshot, assignedAt + r.between(HOUR, dueAt - assignedAt + 2 * DAY)) : null;
        const taskName = r.pick(TASKS[dept]);
        tasks.push({
          id: `TK-${id.slice(-4)}-${String(k + 1).padStart(2, '0')}`,
          name: taskName,
          department: dept,
          description: `${taskName} and update the record notes.`,
          assignedAt: iso(assignedAt),
          dueAt: iso(dueAt),
          priority: r.pick(['High', 'Medium', 'Medium', 'Low']),
          status: done ? 'Completed' : 'Pending',
          completedAt: completedAt ? iso(completedAt) : null,
          assignedBy: superAdmin,
        });
        ev(assignedAt, 'Task assigned', dept, `${taskName} (${tasks.at(-1).id}), due ${new Date(dueAt).toLocaleDateString('en-IN')}`, superAdmin);
        if (completedAt) ev(completedAt, 'Task completed', dept, `${taskName} (${tasks.at(-1).id})`, { id, name, role: p.type });
      }
      tasks.sort((a, b) => b.assignedAt.localeCompare(a.assignedAt));
    }

    return {
      id,
      name,
      email,
      mobile,
      type: p.type,
      role,
      departments,
      astrologer,
      status: p.status,
      invitedAt: iso(p.invitedAt),
      expiresAt: iso(p.invitedAt + INVITE_DAYS * DAY),
      acceptedAt: acceptedAt ? iso(acceptedAt) : null,
      lastActiveAt: lastActiveAt ? iso(lastActiveAt) : null,
      invitedBy,
      permissions,
      mode,
      resendCount: 0,
      tasks,
      events: events
        .sort((x, y) => x.at.localeCompare(y.at))
        .map((e, k) => ({ ...e, id: `AE-${id.slice(-4)}-${String(k + 1).padStart(3, '0')}` })),
    };
  });

  cache = { snapshot, list };
  return list;
}
