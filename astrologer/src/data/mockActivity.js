// Illustrative seed data for the dedicated Recent Activity tab (spec 01_HOME_SCREEN.md AD-20).
// Newest first. The first four are the same items as Home's Recent Activity card
// (mockHome.js `recentActivity`): their times give "2 min ago", "18 min ago", "1 hr ago",
// "3 hrs ago" against the prototype's today (20 Nov 2026, 12:00 PM — TODAY in src/lib/textQuestions.js).
// `icon` uses the shared Icon names (same icons as Home); `href` is the related detail page.

export const activitySeed = [
  { id: 'A1', icon: 'chat', title: 'New Question Received', text: 'Priya S. · TQ-98275', at: '2026-11-20T11:58', href: '/work/questions/TQ-98275' },
  { id: 'A2', icon: 'calendarPlus', title: 'Appointment Booked', text: 'Nila V. · today 7:30 PM', at: '2026-11-20T11:42', href: '/work/appointments/APT-5014' },
  { id: 'A3', icon: 'checkCircle', title: 'Consultation Completed', text: 'Instant Call with Divya S.', at: '2026-11-20T11:00', href: '/calls/c/CON-7781' },
  { id: 'A4', icon: 'userPlus', title: 'New Follower', text: 'Maya J. started following you', at: '2026-11-20T09:00', href: '/audience/user/U-40011' },
  { id: 'A5', icon: 'coins', title: 'Answer Submitted', text: 'TQ-98271 · Nila V.', at: '2026-11-20T08:20', href: '/work/questions' },
  { id: 'A6', icon: 'star', title: 'New Review', text: 'Sanjay R. rated 5 stars', at: '2026-11-20T07:30', href: '/reviews/r/RV-301' },
  { id: 'A7', icon: 'info', title: 'Dispute Raised', text: 'TQ-97790 · Rahul K.', at: '2026-11-19T10:00', href: '/work/questions/TQ-97790' },
];
