// DEMONSTRATION DATA ONLY — not live platform data.
//
// One consistent snapshot of "today" for the Platform Admin Dashboard. The
// Dashboard derives its counts from these records (see dashboardService.js),
// so the same figure always agrees across sections. All names are fictional;
// ID formats are placeholders because they are not finalized (PP-15).

export const SNAPSHOT_TIME = '14:30';

// Section A — overall counts. Online = actively using the app (03 §2).
export const accounts = {
  users: { total: 12450, online: 39 },
  astrologers: { total: 328, online: 59 },
  assistants: { total: 42, online: 4 },
};

// Daily registrations for the last 14 days; the last entry is today.
export const registrations = {
  users: [38, 42, 35, 51, 47, 40, 44, 56, 49, 43, 52, 58, 50, 46],
  astrologers: [2, 4, 3, 1, 5, 3, 2, 4, 6, 3, 2, 5, 4, 5],
};

// Services today (03 §4): New = submitted/booked/created today; Completed =
// actually completed today. Cancelled and failed services are not counted.
export const servicesToday = [
  { key: 'text', label: 'Text Questions', new: 38, completed: 29 },
  { key: 'appointment', label: 'Appointments', new: 24, completed: 7 },
  { key: 'call', label: 'Instant Calls', new: 61, completed: 54 },
  { key: 'chat', label: 'Instant Chats', new: 73, completed: 66 },
];

// Platform Revenue (commission) recorded today, in ₹, per two-hour block.
// Approved rates: Instant Call 2%, Instant Chat 2%, Appointment 3% (AD-124).
// Text Questions have no approved rate yet (PP-09), so no value is shown.
export const revenueBlocks = [
  { start: 0, call: 2, chat: 6, appointment: 0 },
  { start: 2, call: 0, chat: 2, appointment: 0 },
  { start: 4, call: 0, chat: 0, appointment: 0 },
  { start: 6, call: 10, chat: 12, appointment: 0 },
  { start: 8, call: 30, chat: 40, appointment: 90 },
  { start: 10, call: 60, chat: 72, appointment: 105 },
  { start: 12, call: 80, chat: 88, appointment: 75 },
  { start: 14, call: 48, chat: 40, appointment: 45, partial: true },
];

// Section C — Confirmed appointments scheduled to take place today (still to come).
export const appointmentsToday = [
  { id: 'APT-30418', time: '14:45', user: 'Priya Raman', astrologer: 'Acharya Venkatesh' },
  { id: 'APT-30421', time: '15:30', user: 'Arjun Sharma', astrologer: 'Jyotish Meera Devi' },
  { id: 'APT-30409', time: '16:00', user: 'Divya Nair', astrologer: 'Dr. Sundar Rajan' },
  { id: 'APT-30426', time: '16:30', user: 'Karthik Iyer', astrologer: 'Acharya Venkatesh' },
  { id: 'APT-30411', time: '17:15', user: 'Sneha Patel', astrologer: 'Pandit Raghav Shastri' },
  { id: 'APT-30430', time: '18:00', user: 'Vikram Rao', astrologer: 'Kavitha Ganesh' },
  { id: 'APT-30415', time: '18:45', user: 'Anitha Joseph', astrologer: 'Jyotish Meera Devi' },
  { id: 'APT-30433', time: '19:30', user: 'Harish Kumar', astrologer: 'Sri Ramesh Joshi' },
  { id: 'APT-30436', time: '20:15', user: 'Lavanya M', astrologer: 'Dr. Sundar Rajan' },
];

// Questions due / targeted for an answer today. How "due today" maps to the
// 30-day answer deadline is not finalized (PP-21); these are mock records.
export const questionsDueToday = [
  { id: 'TQ-58213', user: 'Rahul Verma', astrologer: 'Acharya Lakshmi', status: 'Pending' },
  { id: 'TQ-58190', user: 'Meena Krishnan', astrologer: 'Pandit Raghav Shastri', status: 'New / Received' },
  { id: 'TQ-58177', user: 'Suresh Babu', astrologer: 'Acharya Lakshmi', status: 'Pending' },
  { id: 'TQ-58204', user: 'Divya Nair', astrologer: 'Kavitha Ganesh', status: 'New / Received' },
  { id: 'TQ-58168', user: 'Arjun Sharma', astrologer: 'Sri Ramesh Joshi', status: 'Pending' },
  { id: 'TQ-58199', user: 'Anitha Joseph', astrologer: 'Jyotish Meera Devi', status: 'New / Received' },
];

// Active Instant Call / Instant Chat sessions right now (approved state: Active).
export const liveNow = {
  calls: ['CL-77120', 'CL-77124', 'CL-77131', 'CL-77133', 'CL-77138', 'CL-77140', 'CL-77142'],
  chats: [
    'CH-88201', 'CH-88205', 'CH-88209', 'CH-88213', 'CH-88214', 'CH-88218',
    'CH-88221', 'CH-88223', 'CH-88226', 'CH-88229', 'CH-88230',
  ],
  // Online astrologers who are available for instant requests (not in a session).
  availableAstrologers: 23,
};

// New cancellation requests received today (older ones stay in Appointments).
export const cancellationsToday = [
  { id: 'APT-30377', receivedAt: '09:12', user: 'Vikram Rao', astrologer: 'Acharya Venkatesh' },
  { id: 'APT-30390', receivedAt: '11:40', user: 'Lavanya M', astrologer: 'Kavitha Ganesh' },
  { id: 'APT-30402', receivedAt: '13:05', user: 'Harish Kumar', astrologer: 'Dr. Sundar Rajan' },
];

// Section D.1 — Astrologer tasks with a deadline today or already passed.
// Text Question tasks are the questions due today above; appointment tasks are
// today's confirmed appointments plus two whose time passed without an outcome.
export const overdueAppointmentTasks = [
  { id: 'APT-30352', time: '11:00', user: 'Rahul Verma', astrologer: 'Pandit Raghav Shastri' },
  { id: 'APT-30361', time: '12:30', user: 'Meena Krishnan', astrologer: 'Sri Ramesh Joshi' },
];

// Section D.2 — Platform operational tasks (mock priorities; no rules implied).
export const platformTasks = [
  {
    id: 'TSK-9031',
    category: 'Suspicious transactions',
    title: 'Repeated failed wallet top-ups from one account',
    ref: 'TXN-771204',
    status: 'Urgent',
    emergency: true,
    path: '/finance/payment-transactions',
  },
  {
    id: 'TSK-9027',
    category: 'Payouts',
    title: 'Astrologer payout failed — bank account details rejected',
    ref: 'PO-11873',
    status: 'Overdue',
    path: '/finance/payouts',
  },
  {
    id: 'TSK-9033',
    category: 'Technical problems',
    title: 'Instant Chat reconnection failures reported by users',
    ref: 'TC-3391',
    status: 'Urgent',
    path: '/operations/technical-complaints',
  },
  {
    id: 'TSK-9029',
    category: 'Settlements',
    title: 'Astrologer settlement batch awaiting Super Admin approval',
    ref: 'STL-2611-04',
    status: 'Due Today',
    path: '/finance/settlements',
  },
  {
    id: 'TSK-9024',
    category: 'Refunds',
    title: 'Refund for appointment cancelled by astrologer to be processed',
    ref: 'RF-40562',
    status: 'Due Today',
    path: '/finance/refunds',
  },
  {
    id: 'TSK-9020',
    category: 'Disputes / Complaints',
    title: 'Dispute answered by astrologer — awaiting Admin Review',
    ref: 'DSP-1208',
    status: 'Due Today',
    path: '/operations/disputes',
  },
  {
    id: 'TSK-9018',
    category: 'Wallet issues',
    title: 'Wallet top-up still Pending after payment confirmation',
    ref: 'TXN-770981',
    status: 'Overdue',
    path: '/finance/user-wallet-deposits',
  },
  {
    id: 'TSK-9035',
    category: 'Appointment / Service issues',
    title: 'New cancellation request received',
    ref: 'APT-30402',
    status: 'Due Today',
    path: '/services/appointments',
  },
];

// Section F — latest activities (newest first).
export const recentActivity = [
  { id: 'ACT-220931', time: '14:26', category: 'User', description: 'New user registered', actor: 'Meena Krishnan', path: '/people/users' },
  { id: 'ACT-220928', time: '14:18', category: 'Service', description: 'Appointment booked · APT-30436', actor: 'Lavanya M', path: '/services/appointments', ref: 'APT-30436' },
  { id: 'ACT-220925', time: '14:05', category: 'Service', description: 'Instant Chat completed · CH-88198', actor: 'Jyotish Meera Devi', path: '/services/instant-chat', ref: 'CH-88198' },
  { id: 'ACT-220921', time: '13:52', category: 'Wallet', description: 'Wallet top-up ₹1,000 · TXN-771188', actor: 'Karthik Iyer', path: '/finance/user-wallet-deposits', ref: 'TXN-771188' },
  { id: 'ACT-220917', time: '13:40', category: 'Astrologer', description: 'New astrologer registered', actor: 'Lakshmi Narayanan', path: '/people/astrologers' },
  { id: 'ACT-220912', time: '13:22', category: 'Payment', description: 'Payout marked Paid · PO-11861', actor: 'Super Admin', path: '/finance/payouts', ref: 'PO-11861' },
  { id: 'ACT-220908', time: '13:05', category: 'Service', description: 'Cancellation request received · APT-30402', actor: 'Harish Kumar', path: '/services/appointments', ref: 'APT-30402' },
  { id: 'ACT-220903', time: '12:47', category: 'Dispute / Complaint', description: 'Note added to dispute · DSP-1208', actor: 'Admin Assistant · Kavya R', path: '/operations/disputes', ref: 'DSP-1208' },
];
