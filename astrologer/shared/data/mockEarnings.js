// Illustrative mock data only — Wallet & Earnings (spec 08_WALLET_AND_EARNINGS.md, AD-120 – AD-126)
// and Offers (spec 09_OFFERS_AND_EARNINGS_CALCULATIONS.md, AD-127, AD-128).
// Sample values come from the reference prototype ("08 Wallet & Earnings + 09 Offers").
// c: commission in ₹; null = Text Questions rate not decided (AP-08-02).

export const walletSeed = {
  avail: 18640,
  pending: 4210, // definition: AP-08-01
  held: 2750, // services not yet completed (AD-126)
  total: 212480,
  withdrawn: 186600,
  month: '2026-11',
  f: { svc: '', st: '' },
  acct: {
    bank: { verified: true, label: 'HDFC Bank ••4821' },
    upi: { verified: true, label: 'ananya@okhdfc' },
  },
  wd: [
    { id: 'WD-2208', amt: 15000, m: 'Bank Account', at: '2026-11-13T10:00', st: 'Paid' },
    { id: 'WD-2231', amt: 5000, m: 'UPI', at: '2026-11-19T18:20', st: 'Processing' },
  ],
  tx: [
    { id: 'TX-90311', svc: 'Appointment', ref: 'APT-5009', user: 'Arun R.', at: '2026-11-19T17:30', g: 550, c: 16.5, st: 'Held' },
    { id: 'TX-90302', svc: 'Instant Call', ref: 'CON-7781', user: 'Divya S.', at: '2026-11-20T09:15', g: 140, c: 2.8, st: 'Pending' },
    { id: 'TX-90298', svc: 'Instant Chat', ref: 'CON-7779', user: 'Gokul P.', at: '2026-11-20T08:30', g: 160, c: 3.2, st: 'Pending' },
    { id: 'TX-90240', svc: 'Text Question', ref: 'TQ-97821', user: 'Arun R.', at: '2026-11-04T12:00', g: 249, c: null, st: 'Settled' },
    { id: 'TX-90199', svc: 'Appointment', ref: 'APT-5007', user: 'Kavya M.', at: '2026-11-18T09:45', g: 300, c: 9, st: 'Pending' },
    { id: 'TX-90150', svc: 'Refund', ref: 'APT-5005', user: 'Lakshmi N.', at: '2026-11-16T09:00', g: -550, c: 0, st: 'Refunded to user' },
    { id: 'TX-89870', svc: 'Text Question', ref: 'TQ-97702', user: 'Kavya M.', at: '2026-10-31T10:00', g: 249, c: null, st: 'Settled' },
  ],
};

/** Service-wise earnings (AD-121): gross, commission (null = AP-08-02), rate label, pending/available. */
export const SERVICE_EARNINGS = [
  { name: 'Text Questions', gross: 38420, comm: null, rate: null, pa: 6120 },
  { name: 'Appointments', gross: 52800, comm: 1584, rate: '3%', pa: 9840 },
  { name: 'Instant Call', gross: 21460, comm: 429.2, rate: '2%', pa: 3950 },
  { name: 'Instant Chat', gross: 14980, comm: 299.6, rate: '2%', pa: 2730 },
];

export const MONTHS = [['2026-11', 'November 2026'], ['2026-10', 'October 2026']];
export const SERVICES = ['Text Question', 'Appointment', 'Instant Call', 'Instant Chat', 'Refund'];
export const TX_STATUSES = ['Held', 'Pending', 'Settled', 'Refunded to user'];
export const MIN_WITHDRAWAL = 500; // AD-125

/** Illustrative discount example (AD-127) — the 10% rate is an example only. */
export const DISCOUNT_EXAMPLE = [
  ['Original price', '₹100'],
  ['Discount (borne by you)', '₹20'],
  ['User pays', '₹80'],
  ['Commission at an illustrative 10%', '₹8 (on ₹80, not ₹100)'],
  ['Your net earnings', '₹72'],
];

/**
 * Discounted campaign offers used when the Text Questions campaigns carry no discount data
 * (reference campaigns c1 "Marriage" General 10% and c3 "Navaratri Blessings" Personal 20%).
 */
export const OFFER_SEED = [
  { name: 'Marriage – General', pct: 10, price: 199, sold: 140 },
  { name: 'Navaratri Blessings – Personal', pct: 20, price: 599, sold: 20 },
];
