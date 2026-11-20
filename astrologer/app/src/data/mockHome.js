// Illustrative mock data only (spec 01_HOME_SCREEN.md AD-15, §6.4).
// Replace with real API responses later; component props keep this shape.

export const astrologer = { firstName: 'Ananya', initial: 'A' };

export const notifications = { unread: 3 };

export const earnings = {
  today: { amount: '₹2,450', change: 18, versus: 'Yesterday' },
  week: { label: 'This Week', amount: '₹14,800', change: 21, versus: 'Last Week' },
  month: { label: 'This Month', amount: '₹48,500', change: 17, versus: 'Last Month' },
};

export const peakDemand = {
  peak: 'Evening',
  periods: [
    { key: 'Morning', value: 24, icon: 'morning' },
    { key: 'Afternoon', value: 41, icon: 'afternoon' },
    { key: 'Evening', value: 76, icon: 'evening' },
    { key: 'Night', value: 38, icon: 'night' },
  ],
};

export const todaysWork = {
  appointments: { today: 3, next: { time: '4:30 PM', user: 'Rahul' } },
  textQuestions: { received: 12, answered: 8, pending: 4 },
  answeredToday: 3, // drives the Daily Answer Goal progress
};

export const recentActivity = [
  { icon: 'chat', text: 'New Question Received', time: '2 min ago' },
  { icon: 'calendarPlus', text: 'Appointment Booked', time: '18 min ago' },
  { icon: 'checkCircle', text: 'Consultation Completed', time: '1 hr ago' },
  { icon: 'userPlus', text: 'New Follower', time: '3 hrs ago' },
];

// Exactly four, in this order (AD-21). Destinations are pending (AP-01-08, AP-01-11).
export const quickActions = [
  { icon: 'megaphone', label: 'Campaign Questions' },
  { icon: 'live', label: 'Go Live' },
  { icon: 'edit', label: 'Content Creation' },
  { icon: 'lotus', label: 'Remedy Tracker' },
];

// Navigation (AD-03). Only Home exists in this task.
export const mainNav = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'work', label: 'My Work', icon: 'briefcase' },
  { key: 'live', label: 'Live', icon: 'live' },
  { key: 'earnings', label: 'Earnings', icon: 'coins' },
  { key: 'profile', label: 'Profile', icon: 'user' },
];
export const secondaryNav = [
  { key: 'support', label: 'Support', icon: 'headset' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];
