// DEMONSTRATION DATA ONLY — 12,450 fictional users generated from a fixed
// seed, so every load produces exactly the same list. Names are combinations
// of common given names and family names; emails use the reserved
// example.com domain; photos are initials avatars (no real photographs).
//
// Consistency with the Dashboard (dashboardMock.js):
// - total users = accounts.users.total (12,450);
// - registrations for the last 14 days follow registrations.users, so
//   exactly 46 users registered today;
// - Meena Krishnan registered today at 14:26 (Recent Activity).
// User ID format is a placeholder (PP-15). Account Type: Guest / Registered.

import { accounts, registrations, SNAPSHOT_TIME } from './dashboardMock.js';

const SEED = 20261128;
const HISTORY_DAYS = 1095; // registrations spread over roughly three years

const GIVEN = [
  'Aarav', 'Aditi', 'Akash', 'Ananya', 'Anitha', 'Arjun', 'Arun', 'Bhavana', 'Deepa', 'Deepak',
  'Divya', 'Ganesh', 'Gayathri', 'Gokul', 'Harini', 'Harish', 'Ishaan', 'Janani', 'Karthik', 'Kavya',
  'Keerthana', 'Kiran', 'Lakshmi', 'Lavanya', 'Madhavan', 'Manoj', 'Meera', 'Mohan', 'Nandini', 'Naveen',
  'Nisha', 'Pooja', 'Prakash', 'Priya', 'Rahul', 'Rajesh', 'Ramya', 'Ravi', 'Rohit', 'Sanjay',
  'Saranya', 'Shalini', 'Shreya', 'Sneha', 'Sowmya', 'Srinivas', 'Suresh', 'Swathi', 'Tarun', 'Uma',
  'Varun', 'Vidya', 'Vignesh', 'Vikram', 'Vinod', 'Yamini', 'Yash', 'Zoya', 'Farah', 'Imran',
  'Joseph', 'Mary', 'Thomas', 'Ayesha', 'Neha', 'Siddharth', 'Tanvi', 'Kunal', 'Pallavi', 'Rekha',
];

const FAMILY = [
  'Raman', 'Sharma', 'Krishnan', 'Verma', 'Nair', 'Iyer', 'Patel', 'Rao', 'Joseph', 'Kumar',
  'Reddy', 'Menon', 'Pillai', 'Gupta', 'Das', 'Banerjee', 'Mukherjee', 'Singh', 'Chopra', 'Mehta',
  'Shah', 'Desai', 'Kulkarni', 'Joshi', 'Bhat', 'Hegde', 'Shetty', 'Naidu', 'Subramanian', 'Venkatesh',
  'Srinivasan', 'Chandran', 'Mathew', 'Thomas', 'Khan', 'Ali', 'Fernandes', 'DSouza', 'Agarwal', 'Bose',
];

// Small, fast, deterministic PRNG.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function startOfToday(now = new Date()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d;
}

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

/**
 * Generate the full user list (oldest registration first).
 * `now` only anchors "today"; the content is identical for a given day.
 */
export function generateUsers(now = new Date()) {
  const rand = mulberry32(SEED);
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const today = startOfToday(now);
  const [snapH, snapM] = SNAPSHOT_TIME.split(':').map(Number);
  const snapshot = new Date(today.getTime() + (snapH * 60 + snapM) * MINUTE);

  const total = accounts.users.total;
  const recent = registrations.users; // last 14 days, last entry = today
  const recentSum = recent.reduce((s, n) => s + n, 0);
  const olderCount = total - recentSum;

  // Registration timestamps.
  const stamps = [];
  for (let i = 0; i < olderCount; i++) {
    const daysAgo = 14 + Math.floor(rand() * (HISTORY_DAYS - 14));
    const minute = 6 * 60 + Math.floor(rand() * (17 * 60)); // 06:00–23:00
    stamps.push(today.getTime() - daysAgo * DAY + minute * MINUTE);
  }
  recent.forEach((count, idx) => {
    const daysAgo = recent.length - 1 - idx;
    for (let i = 0; i < count; i++) {
      if (daysAgo === 0) {
        // Today: up to 14:20; Meena Krishnan (14:26) is added separately.
        if (i === count - 1) continue;
        const minute = 30 + Math.floor(rand() * (14 * 60 - 10));
        stamps.push(today.getTime() + minute * MINUTE);
      } else {
        const minute = 6 * 60 + Math.floor(rand() * (17 * 60));
        stamps.push(today.getTime() - daysAgo * DAY + minute * MINUTE);
      }
    }
  });
  stamps.sort((a, b) => a - b);

  const usedEmails = new Map();
  const usedMobiles = new Set();

  function makeEmail(given, family) {
    const base = `${given}.${family}`.toLowerCase();
    const n = (usedEmails.get(base) ?? 0) + 1;
    usedEmails.set(base, n);
    return `${base}${n > 1 ? n : ''}@example.com`;
  }

  function makeMobile() {
    let digits;
    do {
      digits = String(6 + Math.floor(rand() * 4));
      for (let i = 0; i < 9; i++) digits += Math.floor(rand() * 10);
    } while (usedMobiles.has(digits));
    usedMobiles.add(digits);
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  function makeUser(index, registeredAt, given, family, forced = {}) {
    const statusRoll = rand();
    const status = forced.status ?? (statusRoll < 0.028 ? 'Suspended' : statusRoll < 0.045 ? 'Blocked' : 'Active');
    const accountType = forced.accountType ?? (rand() < 0.12 ? 'Guest' : 'Registered');
    // Last Active: between registration and the snapshot; restricted
    // accounts stopped being active some time ago.
    const span = Math.max(0, snapshot.getTime() - registeredAt);
    let lastActive;
    if (forced.lastActive) lastActive = forced.lastActive;
    else if (status !== 'Active') lastActive = registeredAt + Math.floor(rand() * span * 0.8);
    else if (rand() < 0.55) lastActive = snapshot.getTime() - Math.floor(rand() * Math.min(span, 7 * DAY));
    else lastActive = registeredAt + Math.floor(rand() * span);
    return {
      id: `USR-${100001 + index}`,
      name: `${given} ${family}`,
      mobile: makeMobile(),
      email: makeEmail(given, family),
      accountType,
      status,
      registeredAt: new Date(registeredAt).toISOString(),
      lastActiveAt: new Date(Math.max(lastActive, registeredAt)).toISOString(),
    };
  }

  const users = stamps.map((ts, i) => makeUser(i, ts, pick(GIVEN), pick(FAMILY)));

  // "Meena" is not in GIVEN, so the Dashboard's Meena Krishnan is unique.
  const meenaAt = today.getTime() + (14 * 60 + 26) * MINUTE;
  users.push(
    makeUser(users.length, meenaAt, 'Meena', 'Krishnan', {
      status: 'Active',
      accountType: 'Registered',
      lastActive: meenaAt + 3 * MINUTE,
    })
  );

  return users;
}
