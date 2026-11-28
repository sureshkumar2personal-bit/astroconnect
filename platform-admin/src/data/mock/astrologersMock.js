// Astrologer directory (local data): exactly the Dashboard's 328 astrologers,
// generated from a fixed seed. AST-2001 – AST-2010 keep the names, status and
// per-minute rates used before. Joining dates follow the Dashboard (5 today,
// including Lakshmi Narayanan at 13:40; the last 14 days match the growth
// chart). Availability matches the Dashboard: 23 Available and 18 Busy
// (7 calls + 11 chats); the rest are DND or Offline.
//
// Values follow approved Astrologer App decisions: expertise examples (AD-82),
// voice-only 15 / 30-minute appointments with separate prices (AD-88, AD-90),
// prepaid Call / Chat packages of at least 5 minutes (AD-106; per-minute
// rates only price packages), Silver / Gold / Platinum plans (AD-65, D-31;
// amounts are recorded values, PP-16), and verification statuses for KYC,
// Identity and Certificate (AD-85; values approved 2026-11-28).

import { accounts, registrations, liveNow } from './dashboardMock.js';
import { DAY, HOUR, MIN, iso, rng, snapshotTime, startOfToday } from './seed.js';

const SEED = 3282026;
const HISTORY_DAYS = 1460;

const FIXED = [
  ['Acharya Venkatesh', 'Active', 25, 'Male'],
  ['Jyotish Meera Devi', 'Active', 30, 'Female'],
  ['Dr. Sundar Rajan', 'Active', 35, 'Male'],
  ['Pandit Raghav Shastri', 'Active', 20, 'Male'],
  ['Kavitha Ganesh', 'Active', 18, 'Female'],
  ['Sri Ramesh Joshi', 'Active', 22, 'Male'],
  ['Acharya Lakshmi', 'Active', 28, 'Female'],
  ['Pt. Gopal Mishra', 'Active', 15, 'Male'],
  ['Jyotish Anand Varma', 'Active', 24, 'Male'],
  ['Revathi Iyengar', 'Suspended', 20, 'Female'],
];

const MALE = ['Venkatesh', 'Sundar', 'Raghav', 'Ramesh', 'Gopal', 'Anand', 'Krishna', 'Suresh', 'Mahesh', 'Ganesh', 'Hari', 'Srinivas', 'Narayan', 'Subramaniam', 'Shankar', 'Vishwanath', 'Prakash', 'Mohan', 'Ravi', 'Karthik', 'Balaji', 'Murali', 'Dinesh', 'Rajendra', 'Ashok'];
const FEMALE = ['Meera', 'Kavitha', 'Revathi', 'Lalitha', 'Saraswathi', 'Gayathri', 'Padma', 'Uma', 'Radha', 'Vasanthi', 'Shobha', 'Anjali', 'Bhavani', 'Kamala', 'Jayanthi', 'Sujatha', 'Usha', 'Indira'];
const FAMILY = ['Iyer', 'Sharma', 'Rao', 'Shastri', 'Joshi', 'Mishra', 'Varma', 'Iyengar', 'Reddy', 'Nair', 'Pillai', 'Bhat', 'Hegde', 'Kulkarni', 'Pandey', 'Trivedi', 'Dixit', 'Menon', 'Krishnan', 'Raman', 'Acharya', 'Dwivedi', 'Tiwari', 'Murthy'];
const TITLES_M = ['Acharya', 'Pandit', 'Jyotish', 'Dr.', 'Sri', 'Pt.'];
const TITLES_F = ['Jyotish', 'Dr.', 'Smt.', 'Acharya'];

export const SPECIALIZATIONS = ['Marriage', 'Career', 'Finance', 'Family', 'Health'];
export const ASTROLOGY_TYPES = ['Vedic', 'KP', 'Numerology', 'Vastu'];
const LANGUAGES = ['English', 'Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Bengali'];
const QUALIFICATIONS = ['Jyotish Visharad', 'M.A. in Jyotish Shastra', 'Certified KP Astrologer', 'Diploma in Vastu Shastra', 'Advanced Numerology Certificate', 'Jyotish Acharya', 'B.A. in Sanskrit'];
const PLACES = [
  ['Mylapore', 'Chennai', 'Tamil Nadu'],
  ['Basavanagudi', 'Bengaluru', 'Karnataka'],
  ['Ameerpet', 'Hyderabad', 'Telangana'],
  ['Dadar', 'Mumbai', 'Maharashtra'],
  ['Shivajinagar', 'Pune', 'Maharashtra'],
  ['Thrissur Round', 'Thrissur', 'Kerala'],
  ['Srirangam', 'Tiruchirappalli', 'Tamil Nadu'],
  ['Lanka', 'Varanasi', 'Uttar Pradesh'],
  ['Karol Bagh', 'New Delhi', 'Delhi'],
  ['Gariahat', 'Kolkata', 'West Bengal'],
  ['Maninagar', 'Ahmedabad', 'Gujarat'],
  ['Udupi Car Street', 'Udupi', 'Karnataka'],
];

const KYC = (r, recent) => {
  if (recent) return r.pick(['Submitted', 'Submitted', 'Not Submitted', 'Approved']);
  const x = r.rand();
  return x < 0.85 ? 'Approved' : x < 0.91 ? 'Submitted' : x < 0.95 ? 'Rejected' : 'Not Submitted';
};

let cache = null;

/** The full directory (oldest first); memoised for the day. */
export function generateAstrologers(now = new Date()) {
  const dayKey = startOfToday(now);
  if (cache?.dayKey === dayKey) return cache.list;

  const r = rng(SEED);
  const today = startOfToday(now);
  const snapshot = snapshotTime(now);
  const total = accounts.astrologers.total;
  const recent = registrations.astrologers;
  const olderCount = total - recent.reduce((s, n) => s + n, 0);

  // Joining timestamps.
  const stamps = [];
  for (let i = 0; i < olderCount; i++) {
    const daysAgo = 14 + Math.floor(r.rand() * (HISTORY_DAYS - 14));
    stamps.push(today - daysAgo * DAY + (8 * 60 + Math.floor(r.rand() * 12 * 60)) * MIN);
  }
  stamps.sort((a, b) => a - b);
  // The ten existing astrologers are the earliest members.
  for (let i = 0; i < FIXED.length; i++) stamps[i] = today - (HISTORY_DAYS + 40 - i * 3) * DAY + 10 * HOUR;
  recent.forEach((count, idx) => {
    const daysAgo = recent.length - 1 - idx;
    for (let i = 0; i < count; i++) {
      if (daysAgo === 0) {
        if (i === count - 1) continue; // Lakshmi Narayanan, added below
        stamps.push(today + (9 * 60 + Math.floor(r.rand() * 4 * 60)) * MIN);
      } else {
        stamps.push(today - daysAgo * DAY + (8 * 60 + Math.floor(r.rand() * 12 * 60)) * MIN);
      }
    }
  });
  stamps.sort((a, b) => a - b);
  stamps.push(today + (13 * 60 + 40) * MIN);

  const usedEmails = new Map();
  const usedMobiles = new Set();
  const list = stamps.map((joined, i) => {
    let name;
    let status;
    let rate;
    let gender;
    if (i < FIXED.length) {
      [name, status, rate, gender] = FIXED[i];
    } else if (i === stamps.length - 1) {
      name = 'Lakshmi Narayanan';
      gender = 'Male';
      status = 'Active';
      rate = 18;
    } else {
      gender = r.chance(0.42) ? 'Female' : 'Male';
      const given = r.pick(gender === 'Female' ? FEMALE : MALE);
      const family = r.pick(FAMILY);
      const title = r.chance(0.45) ? `${r.pick(gender === 'Female' ? TITLES_F : TITLES_M)} ` : '';
      name = `${title}${given} ${family}`;
      const recentJoin = joined > today - 14 * DAY;
      const x = r.rand();
      status = recentJoin ? 'Active' : x < 0.04 ? 'Suspended' : x < 0.06 ? 'Blocked' : 'Active';
      rate = 12 + Math.floor(r.rand() * 29);
    }

    const plain = name.replace(/^(Acharya|Pandit|Jyotish|Dr\.|Sri|Smt\.|Pt\.)\s+/, '');
    const [g, ...rest] = plain.split(' ');
    const base = `${g}.${rest.join('') || 'astro'}`.toLowerCase().replace(/[^a-z.]/g, '');
    const n = (usedEmails.get(base) ?? 0) + 1;
    usedEmails.set(base, n);
    let mobile;
    do {
      mobile = String(6 + Math.floor(r.rand() * 4));
      for (let k = 0; k < 9; k++) mobile += Math.floor(r.rand() * 10);
    } while (usedMobiles.has(mobile));
    usedMobiles.add(mobile);

    const recentJoin = joined > today - 14 * DAY;
    const experience = recentJoin ? 1 + Math.floor(r.rand() * 8) : 2 + Math.floor(r.rand() * 28);
    const age = Math.max(26, experience + 22 + Math.floor(r.rand() * 12));
    const dob = new Date(joined);
    dob.setFullYear(dob.getFullYear() - age);
    dob.setMonth(Math.floor(r.rand() * 12), 1 + Math.floor(r.rand() * 28));
    const [locality, city, state] = r.pick(PLACES);
    const specializations = r.some(SPECIALIZATIONS, 2, 4);
    const types = r.some(ASTROLOGY_TYPES, 1, 3);
    const languages = r.some(LANGUAGES, 2, 3);
    const offers = {
      text: r.chance(0.88),
      appointment: r.chance(0.82),
      call: r.chance(0.9),
      chat: r.chance(0.92),
    };
    if (!Object.values(offers).some(Boolean)) offers.chat = true;
    const lastActive =
      status === 'Active'
        ? Math.max(joined + 20 * MIN, snapshot - Math.floor(r.rand() * 3 * DAY))
        : joined + Math.floor(r.rand() * Math.max(DAY, snapshot - 7 * DAY - joined));

    return {
      id: `AST-${2001 + i}`,
      name,
      displayName: name,
      gender,
      dateOfBirth: dob.toISOString().slice(0, 10),
      mobile: `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`,
      email: `${base}${n > 1 ? n : ''}@example.com`,
      location: `${locality}, ${city}, ${state}`,
      preferredLanguage: languages[0],
      registrationMethod: r.pick(['Mobile number', 'Mobile number', 'Email', 'Google']),
      joinedAt: iso(joined),
      lastActiveAt: iso(Math.min(lastActive, snapshot)),
      lastLoginAt: iso(Math.max(joined, Math.min(lastActive, snapshot) - Math.floor(r.rand() * 3 * HOUR))),
      status,
      experience,
      specializations,
      astrologyTypes: types,
      languages,
      qualifications: r.some(QUALIFICATIONS, 1, 2),
      bio: `${types.join(', ')} astrologer with ${experience} year${experience === 1 ? '' : 's'} of practice, guiding clients on ${specializations
        .map((s) => s.toLowerCase())
        .join(', ')}.`,
      introduction: `Namaste. I combine classical ${types[0]} methods with practical guidance, and consult in ${languages.join(', ')}.`,
      offers,
      rate,
      charges: {
        text: r.pick([290, 390, 490, 590]),
        appointment15: r.pick([499, 599, 699]),
        appointment30: r.pick([899, 999, 1199]),
        packages: [5, 10, 15, 20].map((m) => ({ minutes: m, price: m * rate })),
      },
      plans: {
        Silver: r.pick([199, 249]),
        Gold: r.pick([449, 499]),
        Platinum: r.pick([799, 899]),
      },
      verification: {
        kyc: KYC(r, recentJoin),
        identity: KYC(r, recentJoin),
        certificate: recentJoin ? r.pick(['Submitted', 'Not Submitted']) : r.pick(['Approved', 'Approved', 'Approved', 'Submitted', 'Not Submitted', 'Rejected']),
      },
      marketingConsent: r.chance(0.55),
      availability: 'Offline',
      seed: Math.floor(r.rand() * 1e9),
    };
  });

  // Availability: matches the Dashboard (Available / Busy); DND and Offline otherwise.
  const active = list.filter((a) => a.status === 'Active');
  const order = active.map((a) => ({ a, k: r.rand() })).sort((x, y) => x.k - y.k).map((x) => x.a);
  const busyNeeded = liveNow.calls.length + liveNow.chats.length;
  let available = 0;
  let busy = 0;
  let dnd = 0;
  for (const a of order) {
    const instant = a.offers.call || a.offers.chat;
    if (busy < busyNeeded && instant) {
      a.availability = 'Busy';
      busy += 1;
    } else if (available < liveNow.availableAstrologers && instant) {
      a.availability = 'Available';
      available += 1;
    } else if (dnd < 9) {
      a.availability = 'DND';
      dnd += 1;
    }
  }
  for (const a of list) {
    if (a.availability !== 'Offline') {
      a.lastActiveAt = iso(snapshot - (2 + (a.seed % 20)) * MIN);
      a.lastLoginAt = iso(Math.max(new Date(a.joinedAt).getTime(), snapshot - (1 + (a.seed % 5)) * HOUR));
    }
  }

  cache = { dayKey, list };
  return list;
}

export function astrologerById(id, now) {
  const index = Number(String(id).replace(/\D/g, '')) - 2001;
  return generateAstrologers(now)[index] ?? null;
}
