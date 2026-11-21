// Illustrative mock data only (spec 01_HOME_SCREEN.md AD-15, §6.4).
// Replace with real API responses later; component props keep this shape.

export const astrologer = { firstName: 'Ananya', initial: 'A' };

export const notifications = { unread: 3 };

export const earnings = {
  today: { amount: '₹2,450', change: 18, versus: 'Yesterday' },
  week: { label: 'This Week', amount: '₹14,800', change: 22, versus: 'Last Week' },
  month: { label: 'This Month', amount: '₹48,500', change: 15, versus: 'Last Month' },
};

export const peakDemand = {
  peak: 'Evening',
  periods: [
    { key: 'Morning', value: 18, icon: 'morning', range: '5:00 AM – 11:00 AM' },
    { key: 'Afternoon', value: 27, icon: 'afternoon', range: '11:00 AM – 4:00 PM' },
    { key: 'Evening', value: 41, icon: 'evening', range: '4:00 PM – 8:00 PM' },
    { key: 'Night', value: 15, icon: 'night', range: '8:00 PM – 5:00 AM' },
  ],
};

// Today's Work counts are derived live from Text Questions and Appointments (TodaysWorkSection).

export const recentActivity = [
  { icon: 'chat', text: 'New Question Received', time: '2 min ago', href: '#/work/questions/TQ-98275' },
  { icon: 'calendarPlus', text: 'Appointment Booked', time: '18 min ago', href: '#/work/appointments/APT-5014' },
  { icon: 'checkCircle', text: 'Consultation Completed', time: '1 hr ago', href: '#/calls/c/CON-7781' },
  { icon: 'userPlus', text: 'New Follower', time: '3 hrs ago', href: '#/audience/user/U-40011' },
];

// Exactly four, in this order, with their destinations (AD-21).
export const quickActions = [
  { icon: 'megaphone', label: 'Campaign Questions', href: '#/work/questions' },
  { icon: 'live', label: 'Go Live', href: '#/live' },
  { icon: 'edit', label: 'Content Creation', href: '#/content' },
  { icon: 'lotus', label: 'Remedy Tracker', href: '#/remedies' },
];

// Navigation (AD-03). Only Home exists in this task.
export const mainNav = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'work', label: 'My Work', icon: 'briefcase' },
  { key: 'live', label: 'Live', icon: 'live' },
  { key: 'earnings', label: 'Earnings', icon: 'coins' },
  { key: 'profile', label: 'Profile', icon: 'user' },
];
// Destinations that exist so far (hash routes, see lib/router.js).
export const navHref = { home: '#/', work: '#/work', live: '#/live', earnings: '#/earnings', profile: '#/profile' };
// My Work sub-pages, in the reference sidebar order (Text Questions, Subscription Questions,
// Campaign Management, Appointments). Answer Templates and History open from the My Work page.
export const workNav = [
  { key: 'questions', label: 'Text Questions', href: '#/work/questions' },
  { key: 'subscriptions', label: 'Subscription Questions', href: '#/work/subscriptions' },
  { key: 'campaigns', label: 'Campaign Management', href: '#/work/campaigns' },
  { key: 'appointments', label: 'Appointments', href: '#/work/appointments' },
];
// "More" pages, in the reference sidebar order. Their placement under the five main
// tabs is still open (AP-GL-02), so they are listed separately, as in the reference.
export const secondaryNav = [
  { key: 'calls', label: 'Instant Call & Chat', icon: 'phone', href: '#/calls' },
  { key: 'audience', label: 'Audience', icon: 'users', href: '#/audience' },
  { key: 'reviews', label: 'Ratings & Reviews', icon: 'star', href: '#/reviews' },
  { key: 'content', label: 'Benefits & Content', icon: 'book', href: '#/content' },
  { key: 'analytics', label: 'Analytics', icon: 'chart', href: '#/analytics' },
  { key: 'remedies', label: 'Remedy Tracker', icon: 'lotus', href: '#/remedies' },
  { key: 'notifications', label: 'Notifications', icon: 'bell', href: '#/notifications' },
  { key: 'settings', label: 'Settings', icon: 'settings', href: '#/settings' },
  { key: 'support', label: 'Help & Support', icon: 'headset', href: '#/support' },
];
