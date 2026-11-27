// Sample (prototype) data for the Astrologer Live pages. Names, counts and times are illustrative.
export const FEATURED = {
  id: "mi-live", initials: "MI", avatarBg: "#0F4C5C", name: "Meenakshi Iyer", spec: "Vedic Astrology · Marriage & Family",
  topic: "Guru Peyarchi 2026 – Important Predictions", audience: "Public", aud: "public", viewers: "418 watching", duration: "Live for 18 min", eligible: true, isLive: true,
};

export const OTHERS = [
  { id: "kr", initials: "KR", avatarBg: "#2F5D50", name: "Karthik Raman", spec: "KP Astrology · Career & Finance", topic: "December Career Transits – Live Q&A", audience: "Followers", aud: "followers", viewers: "126 watching", duration: "Live for 9 min", eligible: true, note: "You follow Karthik", isLive: true },
  { id: "pv", initials: "PV", avatarBg: "#6B4E8A", name: "Priya Venkatesh", spec: "Numerology · Name Correction", topic: "Lucky Numbers & Dates for 2027", audience: "Subscribers", aud: "subs", viewers: "89 watching", duration: "Live for 24 min", eligible: false, reason: "Subscribers only. Subscribe to Priya to watch.", actionLabel: "Subscribe", isLive: true },
  { id: "rs", initials: "RS", avatarBg: "#9A4F3A", name: "Revathi Sundaram", spec: "Tarot · Love & Relationships", topic: "Weekly Love Tarot Reading", audience: "Followers", aud: "followers", viewers: "", duration: "Live for 4 min", eligible: false, reason: "Followers only. Follow Revathi to watch.", actionLabel: "Follow", isLive: true },
  { id: "as", initials: "AS", avatarBg: "#1F4E79", name: "Arun Sekar", spec: "Prasna Astrology · Health", topic: "Silver Tier Live Q&A: Health & Wellbeing", audience: "Silver Subscribers", aud: "tier", viewers: "54 watching", duration: "Live for 31 min", eligible: false, reason: "Silver tier only. Your current plan is Basic.", actionLabel: "Upgrade", isLive: true },
];

export const UPCOMING = [
  { id: "ln", at: [2026, 10, 28, 18, 0], initials: "LN", avatarBg: "#7A5A1E", name: "Lakshmi Narayanan", spec: "Vedic Astrology · Career", topic: "Weekly Astrology Predictions", mon: "NOV", day: "28", when: "Tomorrow · 6:00 PM", short: "Starts tomorrow", audience: "Subscribers", aud: "subs", eligible: true },
  { id: "si", at: [2026, 10, 29, 19, 0], initials: "SI", avatarBg: "#4A3F7A", name: "Suresh Iyer", spec: "Nadi Astrology · Life Path", topic: "Gold Tier Special Predictions", mon: "NOV", day: "29", when: "November 29 · 7:00 PM", short: "Starts Nov 29", audience: "Gold Subscribers", aud: "tier", eligible: false, reason: "Gold tier only. Your current plan is Basic.", actionLabel: "Upgrade" },
  { id: "mi", at: [2026, 11, 1, 7, 30], initials: "MI", avatarBg: "#0F4C5C", name: "Meenakshi Iyer", spec: "Vedic Astrology · Marriage & Family", topic: "Monthly Rasi Palan – December 2026", mon: "DEC", day: "01", when: "December 1 · 7:30 AM", short: "Starts Dec 1", audience: "Public", aud: "public", eligible: true },
];

export const findLive = (id) => [FEATURED].concat(OTHERS, UPCOMING).find((x) => x.id === id);

// Small stroke icons (24x24 paths) used on the Live pages.
export const ICON = {
  public: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
  followers: "M9 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5",
  subs: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  tier: "M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  lock: "M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2ZM8 11V7a4 4 0 0 1 8 0v4",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7v5l3 2",
  cal: "M5.5 5h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3.5 10h17M8 3v4M16 3v4",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0",
  close: "M6 6l12 12M18 6L6 18",
  radio: "M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14",
  back: "M15 5l-7 7 7 7",
};
