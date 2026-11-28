// Per-user profile records (local data). Every record set is generated from
// a fixed seed derived from the User ID, so a profile always shows the same
// records. All dates fall between the user's registration and their Last
// Active time (user actions) or the data snapshot (system events).
//
// Rules followed (docs/03-platform-admin/04-people-management/user-management.md):
// - Wallet: balance = completed transactions only; Pending / Failed / Reversed
//   never change it; one refund credit per refund; withdrawals keep ₹500 (D-32).
// - Text Questions: 30-day deadline (D-18); user-facing statuses (D-25).
// - Appointments: voice-only, 15 / 30 minutes (D-40); one user reschedule;
//   astrologer cancellation → full refund to Wallet (D-41).
// - Calls / Chats: prepaid packages (min 5 min), extensions, no early-end
//   refund (D-45). No per-minute billing.
// - Subscriptions: Silver / Gold / Platinum benefit questions 1 / 3 / 4
//   (D-31); auto-renewal off by default (D-36); failed payments are not
//   subscriptions. Amounts and periods are per-record values (PP-16 on hold).
// - Remedies: statuses and daily progress per 08-remedy-management.md.

import { DAY, HOUR, MIN, hashString, iso, mulberry32, pad, snapshotTime } from './seed.js';
import { favouritesFor } from '../astrologerLinks.js';
import { KAVYA_ID } from './assistantsMock.js';

// Re-exported for existing importers.
export { hashString, mulberry32, snapshotTime };

// ---------- reference lists ----------
// Astrologers come from the shared directory (astrologersMock.js) through the
// reversible assignment in astrologerLinks.js (decision 1A).

const FEMALE = new Set([
  'Aditi', 'Ananya', 'Anitha', 'Bhavana', 'Deepa', 'Divya', 'Gayathri', 'Harini', 'Janani', 'Kavya',
  'Keerthana', 'Lakshmi', 'Lavanya', 'Meera', 'Meena', 'Nandini', 'Nisha', 'Pooja', 'Priya', 'Ramya',
  'Saranya', 'Shalini', 'Shreya', 'Sneha', 'Sowmya', 'Swathi', 'Uma', 'Vidya', 'Yamini', 'Zoya',
  'Farah', 'Mary', 'Ayesha', 'Neha', 'Tanvi', 'Pallavi', 'Rekha',
]);

const PLACES = [
  ['Anna Nagar', 'Chennai', 'Tamil Nadu'],
  ['Indiranagar', 'Bengaluru', 'Karnataka'],
  ['Banjara Hills', 'Hyderabad', 'Telangana'],
  ['Andheri West', 'Mumbai', 'Maharashtra'],
  ['Kothrud', 'Pune', 'Maharashtra'],
  ['Kakkanad', 'Kochi', 'Kerala'],
  ['RS Puram', 'Coimbatore', 'Tamil Nadu'],
  ['KK Nagar', 'Madurai', 'Tamil Nadu'],
  ['Malviya Nagar', 'New Delhi', 'Delhi'],
  ['Salt Lake', 'Kolkata', 'West Bengal'],
  ['Navrangpura', 'Ahmedabad', 'Gujarat'],
  ['Vaishali Nagar', 'Jaipur', 'Rajasthan'],
];

const LANGUAGES = ['English', 'Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam'];
const DEVICES = [
  'Android 14 · Samsung Galaxy A54',
  'Android 13 · Redmi Note 12',
  'iOS 17 · iPhone 13',
  'Android 14 · OnePlus Nord CE 3',
  'iOS 18 · iPhone 15',
];
const APP_VERSIONS = ['2.3.1', '2.4.0', '2.4.2', '2.5.0'];

const QUESTIONS = [
  'When is a favourable period to change my job this year?',
  'Will my business partnership with my friend be successful?',
  'What does my chart say about marriage timing?',
  'Is it a good time to buy a house in the next twelve months?',
  'My son is preparing for exams. Which period is supportive for him?',
  'I have frequent health worries. What does Saturn’s transit indicate for me?',
  'Should I accept the overseas job offer I received?',
  'When will my financial situation become more stable?',
];

const ANSWERS = [
  'Based on your birth chart, the period after the Jupiter transit into your tenth house is supportive. Plan the change after mid-year and avoid signing during the retrograde phase.',
  'The seventh house is well placed and the partnership shows promise. Formalise roles and responsibilities in writing before you begin.',
  'Venus and the seventh lord are strong in the coming dasha. A favourable window opens within the next eighteen months.',
  'Your fourth house is activated by Jupiter. Property decisions are supported, preferably after careful document checks.',
  'Mercury’s position supports focused study. The months ahead are favourable; a steady routine will help.',
  'Saturn’s transit asks for discipline rather than worry. Regular routines and the suggested remedy will bring steadiness.',
];

const REMEDIES = [
  {
    title: 'Hanuman Chalisa recitation',
    instructions: 'Recite the Hanuman Chalisa every morning after bathing, facing east.',
    steps: ['Light a lamp', 'Recite the Hanuman Chalisa once', 'Offer jaggery and roasted gram'],
  },
  {
    title: 'Saturday sesame oil lamp',
    instructions: 'Light a sesame oil lamp near a peepal tree in the evening.',
    steps: ['Prepare the sesame oil lamp', 'Light it at sunset', 'Sit quietly for five minutes'],
  },
  {
    title: 'Surya Arghya at sunrise',
    instructions: 'Offer water to the rising sun from a copper vessel.',
    steps: ['Fill a copper vessel with water', 'Offer water while facing the sun', 'Chant the Gayatri mantra three times'],
  },
  {
    title: 'Feeding birds on Wednesdays',
    instructions: 'Feed green gram to birds every Wednesday morning.',
    steps: ['Soak green gram overnight', 'Offer it to birds in the morning'],
  },
  {
    title: 'Lakshmi mantra meditation',
    instructions: 'Chant the Mahalakshmi mantra 108 times on a lotus-seed mala.',
    steps: ['Sit facing north', 'Chant the mantra 108 times', 'Close with a short prayer'],
  },
  {
    title: 'Donation of rice on Mondays',
    instructions: 'Donate a small measure of rice to someone in need every Monday.',
    steps: ['Set aside one measure of rice', 'Donate it before noon'],
  },
];

const COMPLAINTS = {
  Appointment: 'The astrologer joined the appointment late and the call disconnected twice.',
  Call: 'The call audio was unclear for several minutes during my session.',
  Chat: 'Messages were delayed and the chat showed a reconnecting banner repeatedly.',
  Subscription: 'My subscription benefit question was not shown after renewal.',
  Payment: 'Payment was deducted from my bank account but the app showed a failure.',
  Wallet: 'My wallet top-up is not reflected in the balance.',
  Login: 'I am unable to sign in on my new phone with my registered mobile number.',
  'Technical problem': 'The app closes when I open the Remedy Tracker.',
};

const DISPUTE_REASONS = [
  'The answer did not address the timing I asked about.',
  'The answer seems general and does not refer to my birth details.',
  'I asked about my career, but the answer focuses on marriage.',
];

// ---------- generator ----------

/** Full record set for one user (memoise in the caller). */
export function generateProfile(user, now = new Date()) {
  const rand = mulberry32(hashString(user.id));
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const chance = (p) => rand() < p;
  const between = (a, b) => a + Math.floor(rand() * Math.max(0, b - a));
  const num = user.id.replace(/\D/g, '');

  const snapshot = snapshotTime(now);
  const reg = new Date(user.registeredAt).getTime();
  const last = Math.max(reg, new Date(user.lastActiveAt).getTime());
  const ageDays = (last - reg) / DAY;
  const userTime = (t) => Math.min(Math.max(t, reg), last);

  const seq = {};
  const nextId = (prefix) => {
    seq[prefix] = (seq[prefix] ?? 0) + 1;
    return `${prefix}-${num}${pad(seq[prefix])}`;
  };

  // ---------- personal ----------
  const [given] = user.name.split(' ');
  const gender = FEMALE.has(given) ? 'Female' : 'Male';
  const age = 21 + Math.floor(rand() * 38);
  const dob = new Date(reg);
  dob.setFullYear(dob.getFullYear() - age);
  dob.setMonth(Math.floor(rand() * 12), 1 + Math.floor(rand() * 28));
  const [locality, city, state] = pick(PLACES);
  const birthPlace = pick(PLACES);
  const birthHour = Math.floor(rand() * 24);
  const birthMinute = Math.floor(rand() * 60);
  const registrationMethod = pick(['Mobile number', 'Mobile number', 'Email', 'Google']);
  const device = pick(DEVICES);

  const personal = {
    gender,
    dateOfBirth: dob.toISOString().slice(0, 10),
    location: `${locality}, ${city}, ${state}`,
    birth: {
      date: dob.toISOString().slice(0, 10),
      time: `${pad(birthHour, 2)}:${pad(birthMinute, 2)}`,
      place: `${birthPlace[1]}, ${birthPlace[2]}`,
    },
  };

  // ---------- preferences, consent, referral ----------
  const marketingAtReg = chance(0.6);
  const consentHistory = [
    { at: iso(reg), item: 'Terms of Service', action: 'Accepted', version: 'v3.1' },
    { at: iso(reg + 2000), item: 'Privacy Policy', action: 'Accepted', version: 'v2.4' },
    { at: iso(reg + 4000), item: 'Marketing notifications', action: marketingAtReg ? 'Granted' : 'Declined', version: '—' },
  ];
  let marketing = marketingAtReg;
  if (ageDays > 20 && chance(0.25)) {
    marketing = !marketing;
    consentHistory.push({
      at: iso(between(reg + 5 * DAY, last)),
      item: 'Marketing notifications',
      action: marketing ? 'Granted' : 'Withdrawn',
      version: '—',
    });
  }
  const referred = chance(0.28);
  const referrerNum = 100001 + Math.floor(rand() * Math.max(1, Number(num) - 100001));
  const preferences = {
    language: pick(LANGUAGES),
    notifications: { push: true, email: chance(0.7), sms: chance(0.45) },
    communication: pick(['Push notification', 'Email', 'SMS']),
    termsAcceptedAt: consentHistory[0].at,
    privacyAcceptedAt: consentHistory[1].at,
    marketingConsent: marketing,
    consentHistory: consentHistory.sort((a, b) => a.at.localeCompare(b.at)),
  };
  const ownCode = `${given.toUpperCase().slice(0, 5)}${num.slice(-3)}`;
  const referral = {
    referredBy: referred ? { id: `USR-${referrerNum}`, code: `AC${(referrerNum % 9000) + 1000}R` } : null,
    referralCodeUsed: referred ? `AC${(referrerNum % 9000) + 1000}R` : null,
    ownCode,
  };

  // ---------- services ----------
  const favs = favouritesFor(user.id);
  const ref = (a) => ({ id: a.id, name: a.name, status: a.status });
  const astroLast = (a) => new Date(a.lastActiveAt).getTime();
  // A service can only happen while both the user and the astrologer are active.
  const windowOf = (a) => [Math.max(reg, new Date(a.joinedAt).getTime()) + HOUR, Math.min(last, astroLast(a))];
  const pickFav = () => {
    const x = rand();
    return favs[x < 0.5 ? 0 : x < 0.8 ? 1 : 2];
  };
  const SERVICE_WEIGHTS = [['text', 0.32], ['appointment', 0.2], ['call', 0.24], ['chat', 0.24]];
  const serviceCount = Math.min(28, Math.floor(ageDays / 18) + (ageDays > 2 ? Math.floor(rand() * 4) : 0));
  const services = [];
  const payments = []; // wallet / direct payments for the ledger
  const refunds = [];

  for (let i = 0; i < serviceCount; i++) {
    const fav = pickFav();
    const [from, to] = windowOf(fav);
    if (to <= from) continue;
    const createdAt = between(from, to);
    const a = ref(fav);
    const method = chance(0.62) ? 'Wallet' : pick(['UPI', 'UPI', 'Card', 'Net Banking']);
    // Only services the astrologer offers (Service Information, AD-84).
    const offered = SERVICE_WEIGHTS.filter(([k]) => fav.offers[k]);
    let roll = rand() * offered.reduce((t, [, w]) => t + w, 0);
    let kind = offered[offered.length - 1][0];
    for (const [k, w] of offered) {
      if (roll < w) {
        kind = k;
        break;
      }
      roll -= w;
    }

    if (kind === 'text') {
      // Text Question
      const price = fav.charges.text;
      const id = nextId('TQ');
      const answeredAt = createdAt + between(6 * HOUR, 9 * DAY);
      const openedAt = createdAt + between(HOUR, Math.max(2 * HOUR, answeredAt - createdAt));
      const status = answeredAt <= snapshot ? 'Completed' : openedAt <= snapshot ? 'Pending' : 'New / Received';
      const attachments = chance(0.35)
        ? [{ name: 'horoscope-chart.pdf', type: 'PDF', size: '1.8 MB', sender: 'User', at: iso(createdAt) }]
        : [];
      if (status === 'Completed' && chance(0.3)) {
        attachments.push({ name: 'remedy-guidance.jpg', type: 'JPEG', size: '640 KB', sender: 'Astrologer', at: iso(answeredAt) });
      }
      services.push({
        id,
        type: 'Text Question',
        astrologer: a,
        createdAt: iso(createdAt),
        serviceAt: null,
        amount: price,
        paymentStatus: 'Success',
        method,
        status,
        question: pick(QUESTIONS),
        attachments,
        birthDetailsUsed: attachments.some((f) => f.sender === 'User')
          ? 'Horoscope file attached by the user'
          : `Profile birth details, shared with consent on ${new Date(createdAt).toLocaleDateString('en-IN')}`,
        answer: status === 'Completed' ? pick(ANSWERS) : null,
        answeredAt: status === 'Completed' ? iso(answeredAt) : null,
        deadline: iso(createdAt + 30 * DAY),
      });
      payments.push({ at: createdAt, serviceId: id, type: 'Text Question', amount: price, method });
    } else if (kind === 'appointment') {
      // Appointment
      const duration = chance(0.5) ? 15 : 30;
      const price = duration === 15 ? fav.charges.appointment15 : fav.charges.appointment30;
      const slot = (t) => {
        const d = new Date(t);
        d.setHours(9 + Math.floor(rand() * 11), chance(0.5) ? 0 : 30, 0, 0);
        return d.getTime();
      };
      let start = slot(createdAt + between(DAY, 15 * DAY));
      const reschedules = [];
      if (chance(0.2)) {
        const at = userTime(createdAt + between(HOUR, Math.max(2 * HOUR, start - createdAt - 12 * HOUR)));
        if (at < start - 12 * HOUR) {
          const to = slot(start + between(DAY, 5 * DAY));
          reschedules.push({ at: iso(at), from: iso(start), to: iso(to), by: 'User' });
          start = to;
        }
      }
      // No appointment after an astrologer's account stopped being active.
      if (fav.status !== 'Active' && start > astroLast(fav)) continue;
      const id = nextId('APT');
      let status = start > snapshot ? 'Confirmed' : 'Completed';
      let cancellation = null;
      let refund = null;
      if (status === 'Completed' && chance(0.15)) {
        const cancelAt = Math.max(createdAt + HOUR, start - between(2 * HOUR, 30 * HOUR));
        status = 'Cancelled';
        cancellation = { at: iso(cancelAt), by: 'Astrologer', reason: 'Astrologer cancelled the appointment; user chose a full refund to the Wallet.' };
        refund = { at: cancelAt + 20 * MIN, amount: price };
      }
      const notifications = [{ at: iso(createdAt + MIN), text: 'Booking confirmation sent' }];
      if (reschedules.length) notifications.push({ at: reschedules[0].at, text: 'Reschedule confirmation sent' });
      if (cancellation) notifications.push({ at: cancellation.at, text: 'Cancellation notice sent' });
      else if (start - HOUR <= snapshot) notifications.push({ at: iso(start - HOUR), text: 'Appointment reminder sent' });
      services.push({
        id,
        type: 'Appointment',
        astrologer: a,
        createdAt: iso(createdAt),
        serviceAt: iso(start),
        amount: price,
        paymentStatus: refund ? 'Refunded' : 'Success',
        method,
        status,
        duration,
        reschedules,
        cancellation,
        refundInfo: null,
        notifications: notifications.sort((x, y) => x.at.localeCompare(y.at)),
      });
      payments.push({ at: createdAt, serviceId: id, type: 'Appointment', amount: price, method });
      if (refund) refunds.push({ ...refund, serviceId: id, serviceType: 'Appointment', reason: 'Appointment cancelled by astrologer' });
    } else {
      // Instant Call or Chat (prepaid packages)
      const isCall = kind === 'call';
      const pkg = pick(fav.charges.packages);
      const minutes = pkg.minutes;
      const price = pkg.price;
      const extensions = chance(0.7) ? 0 : chance(0.65) ? 1 : 2;
      const id = nextId(isCall ? 'CL' : 'CH');
      // Accepted within the 30-second acceptance window (AD-104).
      const connectedAt = createdAt + between(8 * 1000, 30 * 1000);
      const total = minutes * (1 + extensions);
      const termination = pick(['Package time completed', 'Package time completed', 'Ended early by user', 'Ended early by astrologer']);
      const used = termination === 'Package time completed' ? total : Math.max(2, total - between(1, minutes));
      // The user's own session must end before their Last Active time.
      const shift = Math.max(0, connectedAt + used * MIN + MIN - Math.min(last, astroLast(fav)));
      const startAt = createdAt - shift;
      const connectedAtFinal = connectedAt - shift;
      const endedAt = connectedAtFinal + used * MIN;
      services.push({
        id,
        type: isCall ? 'Instant Call' : 'Instant Chat',
        astrologer: a,
        createdAt: iso(startAt),
        serviceAt: iso(connectedAtFinal),
        amount: price * (1 + extensions),
        paymentStatus: 'Success',
        method,
        status: 'Completed',
        requestedAt: iso(startAt),
        connectedAt: iso(connectedAtFinal),
        endedAt: iso(endedAt),
        usedMinutes: used,
        termination,
        package: { minutes, price },
        extensions,
      });
      payments.push({ at: startAt, serviceId: id, type: isCall ? 'Instant Call' : 'Instant Chat', amount: price, method });
      for (let e = 1; e <= extensions; e++) {
        payments.push({
          at: connectedAtFinal + (minutes * e - 1) * MIN,
          serviceId: id,
          type: isCall ? 'Instant Call' : 'Instant Chat',
          amount: price,
          method,
          extension: e,
        });
      }
    }
  }
  services.sort((x, y) => y.createdAt.localeCompare(x.createdAt));

  // ---------- subscriptions ----------
  const subscriptions = [];
  const subscriptionFailures = [];
  const BENEFITS = { Silver: 1, Gold: 3, Platinum: 4 };
  if (ageDays > 30 && chance(0.32)) {
    const count = 1 + Math.floor(rand() * 2);
    for (let i = 0; i < count; i++) {
      const plan = pick(['Silver', 'Silver', 'Gold', 'Gold', 'Platinum']);
      const fav = pick(favs);
      const [from, to] = windowOf(fav);
      if (fav.status !== 'Active' || to - 2 * DAY <= from + DAY) continue;
      const amount = fav.plans[plan];
      const benefits = BENEFITS[plan];
      const a = ref(fav);
      const purchasedAt = between(from + DAY, to - 2 * DAY);
      const method = chance(0.55) ? 'Wallet' : 'UPI';
      if (chance(0.3)) {
        subscriptionFailures.push({
          txId: null,
          at: iso(purchasedAt - between(10 * MIN, 3 * HOUR)),
          astrologer: a,
          plan,
          amount,
          method: 'UPI',
          status: 'Failed',
          reason: 'Payment declined by the bank',
        });
      }
      const autoRenew = chance(0.3);
      let start = purchasedAt;
      let renewalOf = null;
      for (let r = 0; r < (autoRenew ? 2 : 1); r++) {
        const id = nextId('SUB');
        // Automatic renewals are charged to the user's UPI autopay, not the Wallet.
        const payMethod = r === 0 ? method : 'UPI';
        const expiry = start + 30 * DAY;
        let status = expiry > snapshot ? 'Active' : 'Expired';
        let cancelledAt = null;
        if (status === 'Active' && !autoRenew && chance(0.2)) {
          cancelledAt = userTime(start + between(DAY, 20 * DAY));
          status = 'Cancelled';
        }
        subscriptions.push({
          id,
          astrologer: a,
          plan,
          amount,
          benefits,
          purchasedAt: iso(start),
          startAt: iso(start),
          expiryAt: iso(expiry),
          status,
          autoRenew,
          renewalOf,
          cancelledAt: cancelledAt ? iso(cancelledAt) : null,
          method: payMethod,
        });
        payments.push({ at: start, serviceId: id, type: 'Subscription', amount, method: payMethod });
        if (!autoRenew || expiry > snapshot) break;
        renewalOf = id;
        start = expiry;
      }
    }
  }
  subscriptions.sort((x, y) => y.purchasedAt.localeCompare(x.purchasedAt));

  // ---------- following ----------
  const followEvents = [];
  const followed = new Map();
  for (const s of [...subscriptions].sort((x, y) => x.purchasedAt.localeCompare(y.purchasedAt))) {
    if (!followed.has(s.astrologer.id)) {
      const at = new Date(s.purchasedAt).getTime() + MIN;
      followed.set(s.astrologer.id, { astrologer: s.astrologer, at });
      followEvents.push({ at: iso(at), action: 'Followed', astrologer: s.astrologer, note: 'Automatic follow with subscription' });
    }
  }
  const extraFollows = ageDays > 3 ? Math.floor(rand() * 4) : 0;
  const seen = new Set(followed.keys());
  for (let i = 0; i < extraFollows; i++) {
    const fav = pick(favs);
    if (seen.has(fav.id)) continue;
    seen.add(fav.id);
    const [from, to] = windowOf(fav);
    if (to <= from) continue;
    const a = ref(fav);
    const at = between(from, to);
    followEvents.push({ at: iso(at), action: 'Followed', astrologer: a, note: '' });
    if (chance(0.25) && at + DAY < last) {
      const un = between(at + DAY, last);
      followEvents.push({ at: iso(un), action: 'Unfollowed', astrologer: a, note: '' });
    } else {
      followed.set(a.id, { astrologer: a, at });
    }
  }
  const following = [...followed.values()]
    .map((f) => ({ astrologer: f.astrologer, followedAt: iso(f.at) }))
    .sort((x, y) => y.followedAt.localeCompare(x.followedAt));
  followEvents.sort((x, y) => y.at.localeCompare(x.at));

  // ---------- wallet ledger ----------
  const ledgerEvents = [];
  for (const p of payments) ledgerEvents.push({ kind: 'payment', ...p });
  for (const r of refunds) ledgerEvents.push({ kind: 'refund', ...r });
  const topups = Math.floor(ageDays / 45);
  for (let i = 0; i < topups; i++) ledgerEvents.push({ kind: 'topup', at: between(reg + HOUR, last) });
  if (ageDays > 10 && chance(0.4)) ledgerEvents.push({ kind: 'failedTopup', at: between(reg + HOUR, last) });
  if (ageDays > 60 && chance(0.12)) ledgerEvents.push({ kind: 'reversedTopup', at: between(reg + HOUR, last) });
  if (ageDays > 40 && chance(0.35)) ledgerEvents.push({ kind: 'withdrawal', at: between(reg + 20 * DAY, last) });
  if (last > snapshot - 2 * DAY && ageDays > 5 && chance(0.25)) ledgerEvents.push({ kind: 'pendingTopup', at: last - between(5 * MIN, HOUR) });
  if (ageDays > 90 && chance(0.1)) ledgerEvents.push({ kind: 'adjustment', at: between(reg + 30 * DAY, last) });
  ledgerEvents.sort((x, y) => x.at - y.at);

  const transactions = [];
  const refundRecords = [];
  const withdrawals = [];
  const adjustments = [];
  const txByService = new Map();
  let balance = 0;
  const gw = () => `pay_${Math.floor(rand() * 36 ** 8).toString(36).padStart(8, '0').toUpperCase()}`;
  const addTx = (tx) => {
    const affects = tx.status === 'Success' || tx.status === 'Refunded';
    if (affects) balance += (tx.credit ?? 0) - (tx.debit ?? 0);
    const full = {
      credit: null,
      debit: null,
      gatewayRef: null,
      serviceId: null,
      details: '',
      ...tx,
      id: nextId('TXN'),
      at: iso(tx.at),
      balanceAfter: balance,
    };
    transactions.push(full);
    return full;
  };
  const topUp = (at, amount, status = 'Success', details = '') =>
    addTx({
      at,
      description: 'Wallet top-up',
      serviceType: 'Wallet Top-up',
      credit: amount,
      method: pick(['UPI', 'UPI', 'Card', 'Net Banking']),
      gatewayRef: gw(),
      status,
      details,
    });

  for (const ev of ledgerEvents) {
    if (ev.kind === 'topup') topUp(ev.at, pick([500, 1000, 1000, 2000]));
    if (ev.kind === 'failedTopup') topUp(ev.at, pick([500, 1000]), 'Failed', 'Payment failed at the gateway. No amount was credited.');
    if (ev.kind === 'pendingTopup') topUp(ev.at, pick([500, 1000]), 'Pending', 'Awaiting confirmation from the payment gateway.');
    if (ev.kind === 'reversedTopup') topUp(ev.at, 1000, 'Reversed', 'Reversed by the bank before settlement. Balance unchanged.');
    if (ev.kind === 'payment') {
      const label = ev.extension ? `${ev.type} · package extension ${ev.extension}` : ev.type;
      if (ev.method === 'Wallet') {
        if (balance < ev.amount) topUp(ev.at - 3 * MIN, Math.ceil((ev.amount - balance) / 500) * 500);
        const tx = addTx({
          at: ev.at,
          description: `${label} payment`,
          serviceType: ev.type,
          debit: ev.amount,
          method: 'Wallet',
          serviceId: ev.serviceId,
          status: 'Success',
        });
        if (!txByService.has(ev.serviceId)) txByService.set(ev.serviceId, []);
        txByService.get(ev.serviceId).push({ id: tx.id, amount: ev.amount, method: 'Wallet', at: tx.at, gatewayRef: null });
      } else {
        const ref = gw();
        if (!txByService.has(ev.serviceId)) txByService.set(ev.serviceId, []);
        txByService
          .get(ev.serviceId)
          .push({ id: nextId('PAY'), amount: ev.amount, method: ev.method, at: iso(ev.at), gatewayRef: ref });
      }
    }
    if (ev.kind === 'refund') {
      const original = txByService.get(ev.serviceId)?.[0];
      const walletTx = transactions.find((t) => t.id === original?.id);
      const refundId = nextId('RF');
      const credit = addTx({
        at: ev.at,
        description: `Refund · ${ev.serviceType} ${ev.serviceId}`,
        serviceType: 'Refund',
        credit: ev.amount,
        method: 'Wallet',
        serviceId: ev.serviceId,
        status: 'Success',
        details: `${refundId} · ${ev.reason}`,
      });
      if (walletTx) {
        walletTx.status = 'Refunded';
        walletTx.details = `Refunded to Wallet on ${new Date(ev.at).toLocaleDateString('en-IN')} · ${refundId}`;
      }
      refundRecords.push({
        id: refundId,
        originalTx: original?.id ?? '—',
        serviceId: ev.serviceId,
        serviceType: ev.serviceType,
        amount: ev.amount,
        reason: ev.reason,
        status: 'Success',
        processedAt: iso(ev.at),
        failureReason: '',
        creditTx: credit.id,
      });
      const svc = services.find((s) => s.id === ev.serviceId);
      if (svc) svc.refundInfo = { id: refundId, amount: ev.amount, status: 'Refunded to Wallet', at: iso(ev.at), creditTx: credit.id };
    }
    if (ev.kind === 'withdrawal') {
      const available = balance - 500;
      if (available >= 200) {
        const amount = Math.floor((available * (0.4 + rand() * 0.6)) / 100) * 100;
        const failed = chance(0.15);
        const wid = nextId('WD');
        const bankRef = `UTR${Math.floor(rand() * 1e11).toString().padStart(11, '0')}`;
        const tx = addTx({
          at: ev.at,
          description: 'Withdrawal to bank account',
          serviceType: 'Withdrawal',
          debit: amount,
          method: 'Bank transfer',
          gatewayRef: failed ? null : bankRef,
          status: failed ? 'Failed' : 'Success',
          details: failed ? 'Bank account details could not be verified.' : `${wid}`,
        });
        withdrawals.push({
          id: wid,
          txId: tx.id,
          amount,
          bankRef: failed ? '—' : bankRef,
          at: tx.at,
          status: failed ? 'Failed' : 'Success',
          failureReason: failed ? 'Bank account details could not be verified.' : '',
          balanceBefore: balance + (failed ? 0 : amount),
        });
      }
    }
    if (ev.kind === 'adjustment') {
      const amount = pick([100, 150, 250]);
      const requestedAt = ev.at;
      const decidedAt = ev.at + between(2 * HOUR, 2 * DAY);
      const rejected = chance(0.35);
      const adjId = nextId('ADJ');
      const reason = rejected
        ? 'Duplicate request for an earlier top-up issue'
        : 'Top-up credited late by the gateway; balance correction';
      const adj = {
        id: adjId,
        type: 'Credit',
        amount,
        reason,
        reference: `TC-${num.slice(-4)}`,
        status: rejected ? 'Rejected' : 'Approved',
        requestedBy: { id: KAVYA_ID, name: 'Kavya R', role: 'Wallet Management Assistant' }, // Assistant AST-AS-0001
        requestedAt: iso(requestedAt),
        decidedBy: { id: 'SA-1001', name: 'Platform Super Admin', role: 'Super Admin' },
        decidedAt: iso(Math.min(decidedAt, snapshot)),
        rejectionReason: rejected ? 'A correction for this top-up was already applied.' : '',
        txId: null,
      };
      if (!rejected) {
        const tx = addTx({
          at: Math.min(decidedAt, snapshot),
          description: 'Wallet adjustment (credit)',
          serviceType: 'Adjustment',
          credit: amount,
          method: 'Adjustment',
          status: 'Success',
          details: `${adjId} · approved by Super Admin`,
        });
        adj.txId = tx.id;
      }
      adjustments.push(adj);
    }
  }

  // Link each service to its payment transaction(s).
  for (const s of [...services, ...subscriptions]) s.payments = txByService.get(s.id) ?? [];
  for (const f of subscriptionFailures) f.txId = nextId('PAY');

  // ---------- remedies ----------
  const remedies = [];
  const sources = services.filter(
    (s) => (s.type === 'Appointment' && s.status === 'Completed') || (s.type === 'Text Question' && s.status === 'Completed')
  );
  for (const src of sources) {
    if (!chance(0.35)) continue;
    const r = pick(REMEDIES);
    const suggestedAt = new Date(src.type === 'Appointment' ? src.serviceAt : src.answeredAt).getTime() + 40 * MIN;
    if (suggestedAt > snapshot) continue;
    const duration = pick([7, 11, 21, 41]);
    const history = [];
    const timeline = [{ at: iso(suggestedAt), text: `Suggested by ${src.astrologer.name}` }];
    let status = 'Suggested';
    let startAt = null;
    let dueAt = null;
    const progress = [];
    const proof = [];
    const reminders = [];
    let completedAt = null;
    if (chance(0.12)) {
      const at = suggestedAt + between(2 * HOUR, DAY);
      history.push({ at: iso(at), action: 'Edited', by: src.astrologer.name, detail: 'Instructions updated before start; previous version preserved.' });
      timeline.push({ at: iso(at), text: 'Edited by astrologer before start (user notified)' });
    }
    const willStart = chance(0.72);
    const startCandidate = suggestedAt + between(2 * HOUR, 3 * DAY);
    if (!willStart && chance(0.35) && suggestedAt + DAY < snapshot) {
      const at = suggestedAt + between(6 * HOUR, DAY);
      status = 'Cancelled';
      history.push({ at: iso(at), action: 'Cancelled', by: src.astrologer.name, detail: 'Replaced by an updated remedy after a follow-up review. Reason shared with the user.' });
      timeline.push({ at: iso(at), text: 'Cancelled by astrologer before start (user notified)' });
    } else if (willStart && startCandidate <= last) {
      startAt = startCandidate;
      dueAt = startAt + (duration - 1) * DAY;
      timeline.push({ at: iso(startAt), text: 'Started by user (Day 1)' });
      const lastDay = Math.min(dueAt, snapshot);
      for (let d = 0; startAt + d * DAY <= lastDay; d++) {
        const dayAt = startAt + d * DAY;
        const reminderStatus = chance(0.06) ? 'Failed' : chance(0.15) ? 'Sent' : 'Delivered';
        reminders.push({
          at: iso(dayAt - 30 * MIN + d * 1000),
          type: 'Daily progress reminder',
          day: d + 1,
          status: reminderStatus,
          failureReason: reminderStatus === 'Failed' ? 'Device unreachable' : '',
        });
        if (dayAt > last) {
          progress.push({ day: d + 1, at: iso(dayAt), value: 'Missed Update', reason: '' });
          continue;
        }
        const v = rand();
        const value = v < 0.75 ? 'Completed for Today' : v < 0.84 ? 'Not Done' : v < 0.9 ? 'Unable to Do' : 'Missed Update';
        progress.push({
          day: d + 1,
          at: iso(Math.min(dayAt + between(HOUR, 10 * HOUR), last)),
          value,
          reason: value === 'Unable to Do' ? pick(['Travelling for work', 'Unwell today', 'Family function']) : '',
        });
      }
      if (dueAt <= snapshot) {
        if (last >= dueAt + HOUR && chance(0.8)) {
          status = 'Completed';
          completedAt = Math.min(dueAt + between(HOUR, 8 * HOUR), last);
          timeline.push({ at: iso(completedAt), text: 'Marked completed by user' });
        } else {
          status = 'Overdue';
          timeline.push({ at: iso(dueAt + DAY), text: 'Due date passed without completion' });
        }
      } else {
        status = 'In Progress';
      }
      const lastUpdate = [...progress].reverse().find((p) => p.value !== 'Missed Update');
      if (lastUpdate && chance(0.4)) {
        proof.push({ name: `remedy-day-${lastUpdate.day}.jpg`, type: 'Photo', at: lastUpdate.at });
      }
    }
    remedies.push({
      id: nextId('RM'),
      title: r.title,
      instructions: r.instructions,
      steps: r.steps,
      duration,
      astrologer: src.astrologer,
      serviceId: src.id,
      suggestedAt: iso(suggestedAt),
      startAt: startAt ? iso(startAt) : null,
      dueAt: dueAt ? iso(dueAt) : null,
      completedAt: completedAt ? iso(completedAt) : null,
      status,
      progress,
      proof,
      reminders,
      history,
      timeline: timeline.sort((x, y) => x.at.localeCompare(y.at)),
    });
  }
  remedies.sort((x, y) => y.suggestedAt.localeCompare(x.suggestedAt));
  // A few remedies were hidden from the User App after Admin review in
  // Remedy Management (08 §7); the record and its reason stay visible to Admin.
  for (const r of remedies) {
    const hidden = hashString(`${r.id}:moderation`) % 25 === 0;
    r.visibility = hidden ? 'Hidden' : 'Visible';
    r.moderation = hidden
      ? {
          action: 'Hidden',
          reason: 'Instructions reported as unsuitable; hidden from the User App after review.',
          by: 'Platform Super Admin',
          at: iso(Math.min(snapshot, new Date(r.suggestedAt).getTime() + 2 * DAY)),
        }
      : null;
  }

  // ---------- login sessions & profile events ----------
  const sessions = [];
  const sessionCount = Math.min(60, Math.max(1, Math.floor(ageDays / 4)));
  let currentDevice = device;
  let currentVersion = pick(APP_VERSIONS.slice(0, 2));
  const deviceEvents = [{ at: iso(reg), text: `First sign-in on ${currentDevice}`, version: currentVersion }];
  for (let i = 0; i < sessionCount; i++) {
    const at = i === 0 ? reg + 30 * 1000 : between(reg + HOUR, last);
    sessions.push({ at, device: currentDevice, version: currentVersion, logout: chance(0.45) ? Math.min(at + between(10 * MIN, 2 * HOUR), last) : null });
  }
  sessions.push({ at: Math.max(reg + 30 * 1000, last - between(5 * MIN, 50 * MIN)), device: currentDevice, version: currentVersion, logout: null });
  sessions.sort((x, y) => x.at - y.at);
  if (ageDays > 40 && chance(0.5)) {
    const at = between(reg + 20 * DAY, last);
    currentVersion = APP_VERSIONS.at(-1);
    deviceEvents.push({ at: iso(at), text: `App updated to version ${currentVersion}`, version: currentVersion });
  }
  if (ageDays > 120 && chance(0.3)) {
    const at = between(reg + 60 * DAY, last);
    deviceEvents.push({ at: iso(at), text: `Signed in on a new device: ${pick(DEVICES)}`, version: currentVersion });
  }
  const lastLogin = sessions.at(-1).at;

  const profileChanges = [];
  if (ageDays > 7 && chance(0.5)) profileChanges.push({ at: between(reg + DAY, last), category: 'Profile Changes', text: 'Updated location / address' });
  if (ageDays > 7 && chance(0.35)) profileChanges.push({ at: between(reg + DAY, last), category: 'Profile Changes', text: 'Updated preferred language' });
  if (ageDays > 7 && chance(0.25)) profileChanges.push({ at: between(reg + DAY, last), category: 'Birth Details Changes', text: 'Corrected birth time' });
  if (ageDays > 3 && chance(0.4)) profileChanges.push({ at: between(reg + HOUR, last), category: 'Profile Photo Changes', text: 'Updated profile photo' });
  if (ageDays > 30 && chance(0.2)) profileChanges.push({ at: between(reg + DAY, last), category: 'Password Reset', text: 'Password reset completed via registered mobile number' });
  const failedLogins = ageDays > 10 && chance(0.3) ? [between(reg + DAY, last)] : [];

  // ---------- assemble ----------
  return {
    userId: user.id,
    personal,
    account: {
      registrationMethod,
      lastLoginAt: iso(lastLogin),
      updatedAt: iso(
        Math.max(reg, ...profileChanges.map((c) => c.at), ...preferences.consentHistory.map((c) => new Date(c.at).getTime()))
      ),
    },
    preferences,
    referral,
    wallet: {
      balance,
      transactions: transactions.sort((x, y) => y.at.localeCompare(x.at)),
      refunds: refundRecords.sort((x, y) => y.processedAt.localeCompare(x.processedAt)),
      withdrawals: withdrawals.sort((x, y) => y.at.localeCompare(x.at)),
      adjustments,
    },
    services,
    following,
    followEvents,
    subscriptions,
    subscriptionFailures,
    remedies,
    sessions: sessions.map((s) => ({ ...s, at: iso(s.at), logout: s.logout ? iso(s.logout) : null })),
    deviceEvents,
    profileChanges: profileChanges.map((c) => ({ ...c, at: iso(c.at) })),
    failedLogins: failedLogins.map(iso),
  };
}
