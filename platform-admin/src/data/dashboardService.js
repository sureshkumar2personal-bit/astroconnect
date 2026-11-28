// Dashboard data access. Today it reads the local demonstration snapshot; a
// real API can later replace fetchDashboard() without changing the screens.
//
// For reviewing states in the browser: add "?mock=empty" or "?mock=error"
// to the page URL (before the "#").

import * as mock from './mock/dashboardMock.js';

const SERVICE_LABELS = {
  text: 'Text Questions',
  appointment: 'Appointments',
  call: 'Instant Calls',
  chat: 'Instant Chats',
};

const SHORT_LABELS = { text: 'Questions', appointment: 'Appts', call: 'Calls', chat: 'Chats' };

const EMPTY = {
  SNAPSHOT_TIME: mock.SNAPSHOT_TIME,
  accounts: {
    users: { total: 0, online: 0 },
    astrologers: { total: 0, online: 0 },
    assistants: { total: 0, online: 0 },
  },
  registrations: { users: Array(14).fill(0), astrologers: Array(14).fill(0) },
  servicesToday: mock.servicesToday.map((s) => ({ ...s, new: 0, completed: 0 })),
  revenueBlocks: [],
  appointmentsToday: [],
  questionsDueToday: [],
  liveNow: { calls: [], chats: [], availableAstrologers: 0 },
  cancellationsToday: [],
  overdueAppointmentTasks: [],
  platformTasks: [],
  recentActivity: [],
};

const sum = (list, pick) => list.reduce((total, item) => total + pick(item), 0);
const pad = (n) => String(n).padStart(2, '0');

function lastDays(count, today = new Date()) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (count - 1 - i));
    return d;
  });
}

/** Turn the raw snapshot into everything the Dashboard displays. */
export function buildDashboard(raw, today = new Date()) {
  const services = raw.servicesToday;
  const revenue = raw.revenueBlocks.map((b) => ({
    label: pad(b.start),
    fullLabel: `${pad(b.start)}:00 – ${pad(b.start + 2)}:00${b.partial ? ' (in progress)' : ''}`,
    values: { call: b.call, chat: b.chat, appointment: b.appointment },
  }));
  const revenueBy = {
    call: sum(raw.revenueBlocks, (b) => b.call),
    chat: sum(raw.revenueBlocks, (b) => b.chat),
    appointment: sum(raw.revenueBlocks, (b) => b.appointment),
  };

  const days = lastDays(raw.registrations.users.length, today);
  const growth = days.map((d, i) => ({
    label: String(d.getDate()),
    fullLabel: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
    users: raw.registrations.users[i],
    astrologers: raw.registrations.astrologers[i],
  }));

  // Astrologer Tasks & Deadline (03 §6.1).
  const astrologerTasks = [
    ...raw.questionsDueToday.map((q) => ({
      id: q.id,
      service: 'text',
      astrologer: q.astrologer,
      deadline: 'Today',
      status: 'Due Today',
    })),
    ...raw.appointmentsToday.map((a) => ({
      id: a.id,
      service: 'appointment',
      astrologer: a.astrologer,
      deadline: `Today ${a.time}`,
      status: 'Due Today',
    })),
    ...raw.overdueAppointmentTasks.map((a) => ({
      id: a.id,
      service: 'appointment',
      astrologer: a.astrologer,
      deadline: `Today ${a.time}`,
      status: 'Overdue',
    })),
  ];
  const taskSummary = ['text', 'appointment', 'call', 'chat'].map((key) => {
    const tasks = astrologerTasks.filter((t) => t.service === key);
    return {
      key,
      label: SERVICE_LABELS[key],
      dueToday: tasks.filter((t) => t.status === 'Due Today').length,
      // Text Question "Overdue" is not defined yet (PP-21).
      overdue: key === 'text' ? null : tasks.filter((t) => t.status === 'Overdue').length,
    };
  });

  const order = { Urgent: 0, Overdue: 1, 'Due Today': 2 };
  const platformTasks = [...raw.platformTasks].sort(
    (a, b) => Number(Boolean(b.emergency)) - Number(Boolean(a.emergency)) || order[a.status] - order[b.status]
  );

  return {
    dateLabel: today.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    snapshotTime: raw.SNAPSHOT_TIME,
    counts: [
      { key: 'users', label: 'Users', path: '/people/users', ...raw.accounts.users },
      { key: 'astrologers', label: 'Astrologers', path: '/people/astrologers', ...raw.accounts.astrologers },
      { key: 'assistants', label: 'Assistants', path: '/people/assistants', ...raw.accounts.assistants },
    ],
    kpis: {
      newUsers: growth.at(-1)?.users ?? 0,
      newAstrologers: growth.at(-1)?.astrologers ?? 0,
      servicesNew: sum(services, (s) => s.new),
      servicesCompleted: sum(services, (s) => s.completed),
      activeCalls: raw.liveNow.calls.length,
      activeChats: raw.liveNow.chats.length,
      revenue: revenueBy.call + revenueBy.chat + revenueBy.appointment,
    },
    operations: {
      appointments: raw.appointmentsToday,
      questions: raw.questionsDueToday,
      live: {
        calls: raw.liveNow.calls.length,
        chats: raw.liveNow.chats.length,
        available: raw.liveNow.availableAstrologers,
      },
      cancellations: raw.cancellationsToday,
    },
    astrologerTasks: {
      tasks: astrologerTasks,
      summary: taskSummary,
      dueToday: astrologerTasks.filter((t) => t.status === 'Due Today').length,
      overdue: astrologerTasks.filter((t) => t.status === 'Overdue').length,
    },
    platformTasks: {
      tasks: platformTasks,
      dueToday: platformTasks.filter((t) => t.status === 'Due Today').length,
      overdue: platformTasks.filter((t) => t.status === 'Overdue').length,
      urgent: platformTasks.filter((t) => t.status === 'Urgent').length,
    },
    charts: {
      services: services.map((s) => ({
        label: s.label,
        shortLabel: SHORT_LABELS[s.key],
        fullLabel: s.label,
        values: { new: s.new, completed: s.completed },
      })),
      revenue,
      revenueBy,
      growth,
    },
    activity: raw.recentActivity.slice(0, 10),
  };
}

export const SERVICE_NAMES = SERVICE_LABELS;

export async function fetchDashboard() {
  const scenario = new URLSearchParams(window.location.search).get('mock');
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (scenario === 'error') {
    throw new Error('The dashboard data could not be loaded.');
  }
  return buildDashboard(scenario === 'empty' ? EMPTY : mock);
}
