// Illustrative mock data only — My Assistants (reference "AstroConnect – My Assistants (Prototype)").
// No emails are sent and nothing is saved to a backend; replace with the real ACL definitions and records later.
// Sample dates follow the reference's "today" (27 Nov 2026).

export const TODAY_LABEL = '27 Nov 2026';
export const EXPIRY_LABEL = '4 Dec 2026'; // invitation validity: 7 days

export const MODULES = [
  { id: 'home', label: 'Home', actions: ['view'] },
  { id: 'mywork', label: 'My Work', actions: ['view', 'create', 'edit'] },
  { id: 'live', label: 'Live', actions: ['view', 'manage'] },
  { id: 'earnings', label: 'Earnings', actions: ['view'], note: 'Read-only figures' },
  { id: 'profile', label: 'My Profile', actions: ['view', 'edit'] },
  { id: 'callchat', label: 'Instant Call & Chat', actions: ['view', 'manage'] },
  { id: 'audience', label: 'Audience', actions: ['view'] },
  { id: 'reviews', label: 'Ratings & Reviews', actions: ['view', 'manage'] },
  { id: 'content', label: 'Benefits & Contents', actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'analytics', label: 'Analytics', actions: ['view'] },
  { id: 'remedy', label: 'Remedy Tracker', actions: ['view', 'create', 'edit'] },
  { id: 'notifications', label: 'Notifications', actions: ['view'] },
  { id: 'services', label: 'Service Management', actions: ['view', 'edit'] },
];
export const LOCKED_MODULES = [{ label: 'My Assistants', why: 'Astrologer only · can’t be delegated' }, { label: 'Settings', why: 'Astrologer only · can’t be delegated' }];

export const PRESETS = {
  assistant: { home: ['view'], mywork: ['view', 'create', 'edit'], live: ['view'], callchat: ['view', 'manage'], audience: ['view'], reviews: ['view'], remedy: ['view', 'create', 'edit'], notifications: ['view'] },
  editor: { home: ['view'], mywork: ['view'], profile: ['view', 'edit'], reviews: ['view', 'manage'], content: ['view', 'create', 'edit'], analytics: ['view'], services: ['view'], notifications: ['view'] },
};
export const ROLE_CARDS = [
  { v: 'assistant', title: 'Assistant', desc: 'Day-to-day operations: consultations, chat queue, remedy follow-ups.' },
  { v: 'editor', title: 'Editor', desc: 'Content and profile upkeep: benefits & contents, reviews, service descriptions.' },
];
export const STATUS_INFO = {
  active: { label: 'Active', desc: 'Email verified and invitation accepted.' },
  pending: { label: 'Pending', desc: 'Invitation sent; awaiting verification and acceptance.' },
  expired: { label: 'Expired', desc: 'Not accepted within 7 days. Can be resent.' },
  suspended: { label: 'Suspended', desc: 'Access temporarily disabled; data kept.' },
  removed: { label: 'Removed', desc: 'Access revoked for good; history retained.' },
};
export const OTHER_ACCOUNTS = ['ramesh.astro@example.com', 'help@astroconnect.example'];

export const cloneP = (p) => { const o = {}; Object.keys(p || {}).forEach((k) => { o[k] = p[k].slice(); }); return o; };
export const preset = (r) => cloneP(PRESETS[r] || {});

function seedActivity(a) {
  const L = [];
  const add = (d, t, age, action, module, desc) => L.push({ d, t, age, action, module, desc });
  const tail = (ageJ, ageI) => {
    add(a.joined, '19:02', ageJ, 'Invitation accepted', 'My Assistants', 'Email verified, password set and invitation accepted');
    add(a.invited, '11:15', ageI, 'Invitation sent', 'My Assistants', `Invitation emailed to ${a.email}`);
  };
  if (a.status === 'removed') {
    add(a.removedOn, '17:20', 56, 'Account removed', 'My Assistants', 'Access revoked by Astrologer. Records retained; email blocked from reuse.');
    add('30 Sep 2026', '12:05', 58, 'Edited content', 'Benefits & Contents', 'Edited “Rahu–Ketu transit FAQ”');
    add('28 Sep 2026', '09:41', 60, 'Logged in', '—', 'Signed in to the Astrologer Portal');
    tail(168, 170); return L;
  }
  if (a.status === 'pending') { add(a.invited, '10:30', a.id === 'AST-AS-0003' ? 3 : 1, 'Invitation sent', 'My Assistants', `Invitation emailed to ${a.email} · valid 7 days`); return L; }
  if (a.status === 'expired') {
    add(a.expires, '10:30', 10, 'Invitation expired', 'My Assistants', 'Not accepted within 7 days');
    add(a.invited, '10:30', 17, 'Invitation sent', 'My Assistants', `Invitation emailed to ${a.email} · valid 7 days`); return L;
  }
  if (a.status === 'suspended') {
    add(a.statusSince, '15:48', 7, 'Account suspended', 'My Assistants', 'Access suspended by Astrologer');
    add('19 Nov 2026', '11:12', 8, 'Updated a task', 'My Work', 'Moved “Follow up on remedy check-ins” to In Progress');
    add('18 Nov 2026', '09:30', 9, 'Logged in', '—', 'Signed in to the Astrologer Portal');
    tail(86, 87); return L;
  }
  if (a.role === 'editor') {
    add('27 Nov 2026', '10:02', 0, 'Logged in', '—', 'Signed in to the Astrologer Portal');
    add('26 Nov 2026', '16:45', 1, 'Edited content', 'Benefits & Contents', 'Edited “Navagraha remedies guide”');
    add('24 Nov 2026', '12:10', 3, 'Created content', 'Benefits & Contents', 'Created draft “Margazhi month horoscope”');
    add('21 Nov 2026', '18:30', 6, 'Replied to a review', 'Ratings & Reviews', 'Posted a reply to a 4-star review');
    if (a.id === 'AST-AS-0002') add('12 Nov 2026', '10:05', 15, 'Permission changed', 'My Assistants', 'Astrologer granted Earnings › View and Benefits & Contents › Delete');
    tail(100, 101); return L;
  }
  add('27 Nov 2026', '09:14', 0, 'Logged in', '—', 'Signed in to the Astrologer Portal');
  add('26 Nov 2026', '18:02', 1, 'Updated a task', 'My Work', 'Marked “Reply to new chat requests backlog” as Completed');
  add('25 Nov 2026', '11:30', 2, 'Created a record', 'Remedy Tracker', 'Added a remedy check-in for client C-2291');
  add('22 Nov 2026', '16:20', 5, 'Viewed a record', 'Audience', 'Viewed follow-up list (12 clients)');
  add('2 Nov 2026', '10:05', 25, 'Permission changed', 'My Assistants', 'Astrologer applied the Assistant preset');
  tail(a.id === 'AST-AS-0009' ? 30 : 60, a.id === 'AST-AS-0009' ? 31 : 62);
  return L;
}

function seedTasks(a) {
  if (a.status === 'pending' || a.status === 'expired') return [];
  const T = (name, assigned, due, priority, status) => ({ name, assigned, due, priority, status });
  if (a.status === 'removed') return [
    T('Edit “Rahu–Ketu transit FAQ”', '22 Sep 2026', '30 Sep 2026', 'Medium', 'Completed'),
    T('Respond to September reviews', '15 Sep 2026', '25 Sep 2026', 'Low', 'Completed'),
    T('Draft Navaratri content series', '20 Sep 2026', '5 Oct 2026', 'High', 'Pending'),
  ];
  if (a.role === 'editor') return [
    T('Draft Margazhi month horoscope post', '23 Nov 2026', '1 Dec 2026', 'High', 'In Progress'),
    T('Edit Benefits & Contents: Navagraha remedies guide', '19 Nov 2026', '27 Nov 2026', 'Medium', 'Completed'),
    T('Respond to 4-star reviews from last week', '21 Nov 2026', '28 Nov 2026', 'Medium', 'Pending'),
    T('Refresh service descriptions for video consultations', '15 Nov 2026', '22 Nov 2026', 'Low', 'Completed'),
  ];
  return [
    T('Confirm tomorrow’s consultation slots', '24 Nov 2026', '28 Nov 2026', 'High', 'In Progress'),
    T('Follow up on pending remedy check-ins (6 clients)', '22 Nov 2026', '29 Nov 2026', 'Medium', 'Pending'),
    T('Reply to new chat requests backlog', '20 Nov 2026', '21 Nov 2026', 'High', 'Completed'),
    T('Update Remedy Tracker for November sessions', '18 Nov 2026', '30 Nov 2026', 'Low', 'Pending'),
  ];
}

export function seedAssistants() {
  const A = (o) => ({ mobile: '', joined: '', invited: '', expires: '', removedOn: '', statusSince: '', revoked: false, ...o });
  const karthik = preset('editor'); karthik.content.push('delete'); karthik.earnings = ['view'];
  const list = [
    A({ id: 'AST-AS-0001', name: 'Priya Raman', email: 'priya.raman@example.com', mobile: '98410 22341', role: 'assistant', base: 'assistant', status: 'active', invited: '5 Aug 2026', joined: '7 Aug 2026', perms: preset('assistant'), av: 1 }),
    A({ id: 'AST-AS-0002', name: 'Karthik Subramanian', email: 'karthik.s@example.com', mobile: '99620 48112', role: 'editor', base: 'editor', status: 'active', invited: '18 Aug 2026', joined: '19 Aug 2026', perms: karthik, av: 3 }),
    A({ id: 'AST-AS-0003', name: 'Meena Lakshmi', email: 'meena.lakshmi@example.com', mobile: '94440 77210', role: 'assistant', base: 'assistant', status: 'pending', invited: '24 Nov 2026', expires: '1 Dec 2026', perms: preset('assistant'), av: 2 }),
    A({ id: 'AST-AS-0004', name: 'Arjun Nair', email: 'arjun.nair@example.com', mobile: '90030 51874', role: 'editor', base: 'editor', status: 'expired', invited: '10 Nov 2026', expires: '17 Nov 2026', perms: preset('editor'), av: 4 }),
    A({ id: 'AST-AS-0005', name: 'Divya Krishnan', email: 'divya.k@example.com', mobile: '98845 30027', role: 'assistant', base: 'assistant', status: 'suspended', invited: '1 Sep 2026', joined: '2 Sep 2026', statusSince: '20 Nov 2026', perms: preset('assistant'), av: 1 }),
    A({ id: 'AST-AS-0006', name: 'Rahul Menon', email: 'rahul.menon@example.com', mobile: '97890 11456', role: 'editor', base: 'editor', status: 'removed', invited: '10 Jun 2026', joined: '12 Jun 2026', removedOn: '2 Oct 2026', perms: preset('editor'), av: 3 }),
    A({ id: 'AST-AS-0007', name: 'Lavanya Iyer', email: 'lavanya.iyer@example.com', mobile: '93800 64519', role: 'assistant', base: 'assistant', status: 'active', invited: '1 Oct 2026', joined: '3 Oct 2026', perms: preset('assistant'), av: 2 }),
    A({ id: 'AST-AS-0008', name: 'Sanjay Pillai', email: 'sanjay.pillai@example.com', mobile: '96000 23987', role: 'editor', base: 'editor', status: 'pending', invited: '26 Nov 2026', expires: '3 Dec 2026', perms: preset('editor'), av: 4 }),
    A({ id: 'AST-AS-0009', name: 'Nithya Rao', email: 'nithya.rao@example.com', mobile: '98402 90671', role: 'assistant', base: 'assistant', status: 'active', invited: '27 Oct 2026', joined: '28 Oct 2026', perms: preset('assistant'), av: 3 }),
  ];
  return list.map((a) => ({ ...a, activity: seedActivity(a), tasks: seedTasks(a) }));
}
