// Illustrative seed data for the Activity & Notification Centre (spec 14_NOTIFICATIONS_AND_REMINDERS.md,
// AD-148 categories A–I, AD-149 read/unread + deep links). Prototype only; resets on reload.
// `href` is the exact related detail page in this app (AD-149, AD-76).
// Exactly three items start unread — the same count the header bell shows.

export const NCAT = {
  A: 'New Activity & Customers',
  B: 'Text Questions',
  C: 'Appointments',
  D: 'Instant Call & Chat',
  E: 'Content',
  F: 'Live',
  G: 'Wallet & Earnings',
  H: 'Account & Security',
  I: 'Platform & Support',
};

export const notificationsSeed = [
  { id: 'N1', cat: 'B', title: 'New Dispute / Clarification Request', text: 'Rahul K. raised a dispute on TQ-97790. Answer within 3 days.', at: '2026-11-19T10:00', href: '/work/questions/TQ-97790', read: true },
  { id: 'N2', cat: 'B', title: 'Dispute Response Required', text: 'Reminder: dispute on TQ-97790 is due 22 Nov 2026, 10:00 AM.', at: '2026-11-20T10:00', href: '/work/questions/TQ-97790', read: false },
  { id: 'N3', cat: 'C', title: 'New Booking', text: 'Nila V. booked a 30-min appointment today at 7:30 PM.', at: '2026-11-20T08:00', href: '/work/appointments/APT-5014', read: true },
  { id: 'N4', cat: 'B', title: 'New Question Received', text: 'Priya S. sent TQ-98275 (Navaratri Blessings).', at: '2026-11-20T11:40', href: '/work/questions/TQ-98275', read: true },
  { id: 'N5b', cat: 'A', title: 'New Subscriber', text: 'Maya J. subscribed to Silver.', at: '2026-11-20T09:30', href: '/audience/user/U-40011', read: true },
  { id: 'N5', cat: 'A', title: 'New Subscriber', text: 'Hari K. subscribed to Gold.', at: '2026-11-19T16:00', href: '/audience/user/U-41870', read: true },
  { id: 'N6', cat: 'G', title: 'Withdrawal Processing', text: 'WD-2231 · ₹5,000 to UPI is processing.', at: '2026-11-19T18:30', href: '/earnings', read: true },
  { id: 'N7', cat: 'H', title: 'New Device Login', text: 'New login from Chrome on Windows, Chennai.', at: '2026-11-20T07:55', href: '/settings', read: false, security: true },
  { id: 'N8', cat: 'D', title: 'Accepted', text: 'You accepted an Instant Call from Divya S.', at: '2026-11-20T09:05', href: '/calls/c/CON-7781', read: true },
  { id: 'N9', cat: 'E', title: 'Content Delivery Missed', text: 'Weekly Prediction · Week 47 was not delivered.', at: '2026-11-16T06:05', href: '/content', read: true },
  { id: 'N10', cat: 'F', title: 'Live Reminders', text: 'No Live scheduled yet this month.', at: '2026-11-15T09:00', href: '/live', read: true },
  { id: 'N11', cat: 'I', title: 'Support Ticket Updates', text: 'Platform replied on TCK-1201.', at: '2026-11-18T12:00', href: '/support/t/TCK-1201', read: true },
  { id: 'N12', cat: 'C', title: 'Upcoming Reminder', text: 'Appointment with Divya S. in 1 hour (4:30 PM).', at: '2026-11-20T15:30', href: '/work/appointments/APT-5012', read: false },
];
