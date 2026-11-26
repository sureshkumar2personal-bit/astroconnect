// Earnings & Wallet: prototype records and rules, ported unchanged from the reference design
// (AstroConnect – Earnings & Wallet Redesign). Every total on the page is derived from these records
// by the rules below; nothing is hard-coded.
// PROTOTYPE PLACEHOLDERS: the commission for Text Questions and Subscriptions and the settlement days
// for Instant Chat, Instant Call and Subscriptions are illustrative sample values, NOT business rules
// (see AP-08-04 in docs/02-astrologer-app/00_ASTROLOGER_APP_REVIEW_LIST.md and AD-124 / AD-126).
/* eslint-disable */

// ---------- AstroConnect · Earnings & Wallet · prototype data + rules ----------
// Prototype records for team review. Every total on the page is derived from these
// records using the configured rules below; nothing is hard-coded.

const NOW = new Date(2026, 10, 26, 18, 0).getTime();   // Thu 26 Nov 2026, 6:00 PM IST
const DAY = 86400000;
const MIN_WITHDRAWAL = 500;
const ASTRO = { name: 'Pt. Ramesh Iyer', id: 'AST-1042', initials: 'RI' };

// Configured rules (as stated in the current business rules).
// commission: number = configured %, 'pending' = awaiting business decision, null = not configured.
// Configured rules: APT 3% / 3 days, CALL 2%, CHAT 2%, TQ 7 days after answer.
// PROTOTYPE PLACEHOLDERS (illustrative only, NOT business rules): samplePct for TQ/SUB commission and
// sampleDays for CALL/CHAT/SUB settlement. They exist only so the UI can show complete sample values;
// replace them with the decided rules before any production use.
const SERVICES = [
  { key: 'TQ',   name: 'Text Questions', short: 'Text Question', color: '#8E4B7A', commission: null, samplePct: 10, settleDays: 7 },
  { key: 'APT',  name: 'Appointments',   short: 'Appointment',   color: '#0F6E6E', commission: 3, settleDays: 3 },
  { key: 'CHAT', name: 'Instant Chat',   short: 'Instant Chat',  color: '#3D5A99', commission: 2, settleDays: null, sampleDays: 3 },
  { key: 'CALL', name: 'Instant Call',   short: 'Instant Call',  color: '#B8862B', commission: 2, settleDays: null, sampleDays: 3 },
  { key: 'SUB',  name: 'Subscriptions',  short: 'Subscription',  color: '#C2603E', commission: null, samplePct: 10, settleDays: null, sampleDays: 7 }
];
const SVC = {}; SERVICES.forEach(function (s) { SVC[s.key] = s; });

const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function r2(x) { return Math.round(x * 100) / 100; }
function money(n) {
  const neg = n < 0; const v = Math.abs(n);
  const frac = Math.round(v * 100) % 100 !== 0;
  return (neg ? '−' : '') + '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: frac ? 2 : 0, maximumFractionDigits: 2 });
}
function fmtDT(t) {
  const d = new Date(t); let h = d.getHours(); const m = d.getMinutes(); const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear() + ', ' + h + ':' + String(m).padStart(2, '0') + ' ' + ap;
}
function fmtD(t) { const d = new Date(t); return WD[d.getDay()] + ' ' + d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); }
function monthKey(t) { const d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
function monthLabel(k) { const p = k.split('-'); return MONTH_FULL[Number(p[1]) - 1] + ' ' + p[0]; }

// Releases run twice weekly: Tuesday and Friday (10:00 AM).
function nextRelease(t) {
  const d = new Date(t); d.setHours(10, 0, 0, 0);
  let c = d.getTime(); if (c < t) c += DAY;
  for (let i = 0; i < 8; i++) { const wd = new Date(c).getDay(); if (wd === 2 || wd === 5) return c; c += DAY; }
  return c;
}
function addWorkingDays(t, n) {
  let c = t, k = 0;
  while (k < n) { c += DAY; const wd = new Date(c).getDay(); if (wd !== 0 && wd !== 6) k++; }
  return c;
}

// ---- deterministic prototype records ----
let seed = 20261126;
function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
function pick(a) { return a[Math.floor(rnd() * a.length)]; }

const TQ_CATS = ['Career', 'Marriage', 'Finance', 'Health', 'Education', 'Property'];
const RAW = [];
let txn = 40100, nTQ = 22100, nAPT = 5100, nCALL = 81200, nCHAT = 61400, nSUB = 1200;
const START = new Date(2026, 8, 1).getTime();
for (let day = START; day <= NOW; day += DAY) {
  const d = new Date(day);
  // Text Questions
  const tqCount = rnd() < 0.75 ? 1 : (rnd() < 0.5 ? 2 : 0);
  for (let i = 0; i < tqCount; i++) {
    const asked = day + (8 + Math.floor(rnd() * 12)) * 3600000 + Math.floor(rnd() * 60) * 60000;
    const price = pick([349, 399, 499, 599, 699]);
    const qid = 'TQ-' + (nTQ++);
    if (rnd() < 0.07) {
      RAW.push({ kind: 'refund', svc: 'TQ', rel: qid, t: asked + DAY, gross: price, reason: 'Question expired unanswered — full refund to user', category: pick(TQ_CATS) });
    } else {
      const answered = asked + (2 + Math.floor(rnd() * 14)) * 3600000;
      if (answered > NOW) continue;
      RAW.push({ kind: 'earn', svc: 'TQ', rel: qid, t: answered, gross: price, info: pick(TQ_CATS) + ' question · answered ' + fmtDT(answered) });
    }
  }
  // Appointments (~every other day)
  if (rnd() < 0.55) {
    const dur = pick([30, 45, 60]); const price = { 30: 1200, 45: 1800, 60: 2400 }[dur];
    const done = day + (10 + Math.floor(rnd() * 9)) * 3600000 + dur * 60000;
    const aid = 'APT-' + (nAPT++);
    if (done <= NOW) {
      if (rnd() < 0.08) RAW.push({ kind: 'refund', svc: 'APT', rel: aid, t: done - 3 * 3600000, gross: price, reason: 'Appointment cancelled by user before start — full refund to user' });
      else RAW.push({ kind: 'earn', svc: 'APT', rel: aid, t: done, gross: price, info: dur + '-min ' + pick(['video', 'voice']) + ' consultation · completed ' + fmtDT(done) });
    }
  }
  // Instant Call
  const nc = rnd() < 0.6 ? 1 : (rnd() < 0.5 ? 2 : 0);
  for (let i = 0; i < nc; i++) {
    const mins = 6 + Math.floor(rnd() * 23); const t = day + (9 + Math.floor(rnd() * 13)) * 3600000 + Math.floor(rnd() * 60) * 60000;
    if (t <= NOW) RAW.push({ kind: 'earn', svc: 'CALL', rel: 'CALL-' + (nCALL++), t: t, gross: mins * 30, info: mins + ' min call at ₹30/min' });
  }
  // Instant Chat
  const nh = rnd() < 0.55 ? 1 : (rnd() < 0.4 ? 2 : 0);
  for (let i = 0; i < nh; i++) {
    const mins = 8 + Math.floor(rnd() * 23); const t = day + (9 + Math.floor(rnd() * 13)) * 3600000 + Math.floor(rnd() * 60) * 60000;
    if (t <= NOW) RAW.push({ kind: 'earn', svc: 'CHAT', rel: 'CHAT-' + (nCHAT++), t: t, gross: mins * 25, info: mins + ' min chat at ₹25/min' });
  }
  // Subscriptions (new or renewed plans, a few per month)
  if (d.getDate() % 7 === 3) {
    const q = rnd() < 0.35; const t = day + 11 * 3600000;
    const end = t + (q ? 90 : 30) * DAY;
    if (t <= NOW) RAW.push({ kind: 'earn', svc: 'SUB', rel: 'SUB-' + (nSUB++), t: t, gross: q ? 2499 : 999,
      info: (q ? 'Quarterly' : 'Monthly') + ' guidance plan · ' + d.getDate() + ' ' + MON[d.getMonth()] + ' – ' + new Date(end).getDate() + ' ' + MON[new Date(end).getMonth()] });
  }
}

// A few fixed appointment records so every settlement state is represented
[[new Date(2026, 10, 21, 19, 15).getTime(), 1800, 45], [new Date(2026, 10, 23, 11, 40).getTime(), 2400, 60]].forEach(function (a) {
  RAW.push({ kind: 'earn', svc: 'APT', rel: 'APT-' + (nAPT++), t: a[0], gross: a[1], info: a[2] + '-min video consultation · completed ' + fmtDT(a[0]) });
});

// Apply rules to each earning
function settleEarning(r) {
  const s = SVC[r.svc];
  r.commissionPct = typeof s.commission === 'number' ? s.commission : s.samplePct;
  r.commission = r2(r.gross * r.commissionPct / 100);
  r.net = r2(r.gross - r.commission);
  r.releaseAt = nextRelease(r.t + (s.settleDays || s.sampleDays) * DAY);
  r.status = r.releaseAt <= NOW ? 'Completed' : 'Pending';
}
const USERS = ['Priya Raman','Arjun Mehta','Kavya Sundaram','Rohit Sharma','Meenakshi Iyer','Vikram Nair','Ananya Krishnan','Suresh Babu',
  'Divya Pillai','Karthik Subramanian','Lakshmi Narayanan','Harish Kumar','Nandhini Selvam','Aditya Rao','Sowmya Venkat','Ganesh Murugan',
  'Pooja Reddy','Senthil Arumugam','Revathi Mohan','Manoj Chandran','Shalini Gupta','Bharath Raj','Ishita Banerjee','Deepak Menon'];
const ALNUM = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function ref(prefix) { let x = ''; for (let i = 0; i < 10; i++) x += ALNUM[Math.floor(rnd() * ALNUM.length)]; return prefix + x; }
RAW.forEach(function (r) {
  r.user = USERS[Math.floor(rnd() * USERS.length)];
  if (r.kind === 'earn') { settleEarning(r); r.payId = ref('pay_'); }
  else { r.status = 'Refunded'; r.payId = ref('rfnd_'); }
});

// Withdrawals (generated against the balance actually available at that time)
function availableAt(t, wds) {
  let a = 0;
  RAW.forEach(function (r) { if (r.kind === 'earn' && r.releaseAt <= t && r.releaseAt <= NOW) a += r.net; });
  wds.forEach(function (w) { if (w.t <= t) { a -= w.amount; if (w.status === 'Failed' && w.failedAt <= t) a += w.amount; } });
  return r2(a);
}
const WDS = [];
let nWD = 2301;
function addWD(t, method, status, frac) {
  const avail = availableAt(t, WDS);
  const amount = Math.floor(avail * frac / 500) * 500;
  if (amount < MIN_WITHDRAWAL) return null;
  const w = { kind: 'wd', rel: 'WD-' + (nWD++), t: t, amount: amount, method: method, status: status, payId: ref('pout_') };
  if (status === 'Completed') w.paidAt = addWorkingDays(t, 2);
  if (status === 'Failed') w.failedAt = addWorkingDays(t, 1);
  if (status === 'Processing') w.dueBy = addWorkingDays(t, 3);
  WDS.push(w); return w;
}
addWD(new Date(2026, 8, 29, 11, 20).getTime(), 'Bank', 'Completed', 0.9);
const f = addWD(new Date(2026, 9, 14, 9, 45).getTime(), 'UPI', 'Failed', 0.8);
if (f) { f.reason = 'UPI ID could not be credited by the bank'; }
addWD(new Date(2026, 9, 19, 10, 5).getTime(), 'Bank', 'Completed', 0.85);
addWD(new Date(2026, 10, 10, 16, 30).getTime(), 'Bank', 'Completed', 0.8);
addWD(new Date(2026, 10, 25, 12, 10).getTime(), 'UPI', 'Processing', 0.6);
WDS.forEach(function (w) { RAW.push(w); });

RAW.sort(function (a, b) { return b.t - a.t; });
RAW.forEach(function (r) { r.id = 'TXN-' + (txn++); });
// re-number newest-first so IDs read in order
const N = RAW.length; RAW.forEach(function (r, i) { r.id = 'TXN-' + (40100 + N - i); });


// ---------- PDF statement (text-only, generated in the browser) ----------
function pdfText(s) { return String(s).replace(/₹/g, 'Rs ').replace(/[−–—]/g, '-').replace(/[·•]/g, '-').replace(/[^\x20-\x7E]/g, '').replace(/([\\()])/g, '\\$1'); }
function buildPdf(title, metaLines, header, rows, notes) {
  const W = 842, H = 595, cols = [36, 112, 330, 452, 566, 650, 712];
  const perPage = 34; const pages = [];
  for (let i = 0; i < Math.max(1, rows.length); i += perPage) pages.push(rows.slice(i, i + perPage));
  const streams = pages.map(function (chunk, pi) {
    let s = 'BT /F2 13 Tf 36 555 Td (' + pdfText(title) + ') Tj ET\n';
    let y = 538;
    if (pi === 0) metaLines.forEach(function (m) { s += 'BT /F1 8.5 Tf 36 ' + y + ' Td (' + pdfText(m) + ') Tj ET\n'; y -= 12; });
    y -= 6;
    header.forEach(function (h, ci) { s += 'BT /F2 7.5 Tf ' + cols[ci] + ' ' + y + ' Td (' + pdfText(h) + ') Tj ET\n'; });
    s += '0.6 w 36 ' + (y - 4) + ' m 806 ' + (y - 4) + ' l S\n'; y -= 15;
    chunk.forEach(function (row) { row.forEach(function (c, ci) { s += 'BT /F1 7.5 Tf ' + cols[ci] + ' ' + y + ' Td (' + pdfText(c) + ') Tj ET\n'; }); y -= 13; });
    if (pi === pages.length - 1) { y -= 8; notes.forEach(function (n) { s += 'BT /F1 7.5 Tf 36 ' + y + ' Td (' + pdfText(n) + ') Tj ET\n'; y -= 11; }); }
    s += 'BT /F1 7 Tf 36 24 Td (' + pdfText('Page ' + (pi + 1) + ' of ' + pages.length) + ') Tj ET\n';
    return s;
  });
  const objs = [];
  objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  const kids = streams.map(function (_, i) { return (5 + i * 2) + ' 0 R'; }).join(' ');
  objs[2] = '<< /Type /Pages /Kids [' + kids + '] /Count ' + streams.length + ' >>';
  objs[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objs[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  streams.forEach(function (st, i) {
    objs[5 + i * 2] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ' + (6 + i * 2) + ' 0 R >>';
    objs[6 + i * 2] = '<< /Length ' + st.length + ' >>\nstream\n' + st + 'endstream';
  });
  let out = '%PDF-1.4\n'; const offs = [];
  for (let i = 1; i < objs.length; i++) { offs[i] = out.length; out += i + ' 0 obj\n' + objs[i] + '\nendobj\n'; }
  const xref = out.length;
  out += 'xref\n0 ' + objs.length + '\n0000000000 65535 f \n';
  for (let i = 1; i < objs.length; i++) out += String(offs[i]).padStart(10, '0') + ' 00000 n \n';
  out += 'trailer\n<< /Size ' + objs.length + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';
  return 'data:application/pdf;base64,' + btoa(out);
}


// ---------- shared helpers ----------
const PILL = {
  'Completed': { bg: 'var(--ew-okS)', fg: 'var(--ew-okT)' },
  'Pending': { bg: 'var(--ew-warnS)', fg: 'var(--ew-warnT)' },
  'Processing': { bg: 'var(--ew-infoS)', fg: 'var(--ew-infoT)' },
  'Refunded': { bg: 'var(--ew-genS)', fg: 'var(--ew-genT)' },
  'Failed': { bg: 'var(--ew-badS)', fg: 'var(--ew-bad)' }
};
const ALL_STATUSES = ['Completed', 'Pending', 'Processing', 'Refunded', 'Failed'];
const SERVICE_FILTERS = [['All', 'All Services']].concat(SERVICES.map(function (s) { return [s.key, s.name]; }), [['WD', 'Withdrawals'], ['REF', 'Refunds']]);
const THIS_M = monthKey(NOW);

function availableFrom(list) {
  let a = 0;
  list.forEach(function (r) {
    if (r.kind === 'earn' && r.status === 'Completed') a += r.net;
    if (r.kind === 'wd' && r.status !== 'Failed') a -= r.amount;   // failed payouts return to Available
  });
  return r2(a);
}
function maskAcct(a) { return a ? '•••• ' + a.slice(-4) : ''; }
function maskUpi(id) {
  if (!id) return ''; const p = id.split('@'); const n = p[0];
  const shown = n.length <= 3 ? n.slice(0, 1) + '••' : n.slice(0, 2) + '•'.repeat(Math.min(6, n.length - 3)) + n.slice(-1);
  return shown + '@' + (p[1] || '');
}
function methodLabel(m, bank, upi) { return m === 'UPI' ? 'UPI · ' + maskUpi(upi && upi.id) : (bank ? bank.bankName : 'Bank account'); }
// Payout details (bank accounts and UPI IDs) are kept in this browser (localStorage) so they survive a reload of
// the prototype. The real app must save them through its payout-details API instead.
// Shape: { banks: [...], upis: [...], bankSel: id | null, upiSel: id | null }. No accounts exist until the user adds them.
const STORE_KEY = 'astroconnect.payoutAccounts.v2';
const MAX_UPI = 3;
function loadPayout() {
  try {
    const v = JSON.parse(window.localStorage.getItem(STORE_KEY) || 'null');
    if (!v || typeof v !== 'object') return null;
    return { banks: Array.isArray(v.banks) ? v.banks : [], upis: Array.isArray(v.upis) ? v.upis : [], bankSel: v.bankSel || null, upiSel: v.upiSel || null };
  } catch (e) { return null; }
}
function storePayout(v) { try { window.localStorage.setItem(STORE_KEY, JSON.stringify(v)); return true; } catch (e) { return false; } }
const BANK_EMPTY = { holder: '', bankName: '', acct: '', acct2: '', ifsc: '', type: '' };
const UPI_EMPTY = { id: '', id2: '' };
function validateBank(f) {
  const e = {};
  const holder = f.holder.trim(), bankName = f.bankName.trim(), acct = f.acct.trim(), ifsc = f.ifsc.trim().toUpperCase();
  if (!holder) e.holder = 'Enter the account holder name.';
  else if (!/^[A-Za-z][A-Za-z .']{1,59}$/.test(holder)) e.holder = 'Use letters, spaces, dots or apostrophes only.';
  if (!bankName) e.bankName = 'Enter the bank name.';
  else if (bankName.length < 2) e.bankName = 'Enter a valid bank name.';
  if (!acct) e.acct = 'Enter the account number.';
  else if (!/^[0-9]{9,18}$/.test(acct)) e.acct = 'Account number must be 9–18 digits.';
  if (!f.acct2.trim()) e.acct2 = 'Re-enter the account number.';
  else if (!e.acct && f.acct2.trim() !== acct) e.acct2 = 'Account numbers do not match.';
  if (!ifsc) e.ifsc = 'Enter the IFSC code.';
  else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) e.ifsc = 'IFSC must be 11 characters, like HDFC0001234.';
  if (f.type !== 'Savings' && f.type !== 'Current') e.type = 'Select the account type.';
  return e;
}
function validateUpi(f) {
  const e = {}; const id = f.id.trim();
  if (!id) e.id = 'Enter your UPI ID.';
  else if (!/^[A-Za-z0-9._-]{2,256}@[A-Za-z][A-Za-z0-9]{1,63}$/.test(id)) e.id = 'Enter a valid UPI ID, like name@upi.';
  if (!f.id2.trim()) e.id2 = 'Re-enter your UPI ID.';
  else if (!e.id && f.id2.trim().toLowerCase() !== id.toLowerCase()) e.id2 = 'UPI IDs do not match.';
  return e;
}
function txFor(r) {
  if (r.kind === 'earn') return SVC[r.svc].short + ' – ' + r.user;
  if (r.kind === 'refund') return 'Refund – ' + SVC[r.svc].short + ' · ' + r.user;
  return r.method === 'UPI' ? 'Withdrawal to UPI' : 'Withdrawal to Bank';
}
function isCredit(r) { return r.kind === 'earn'; }
function txAmount(r) { return r.kind === 'earn' ? r.net : r.kind === 'wd' ? r.amount : r.gross; }
function pieSlicePath(cx, cy, r, a0, a1) {
  if (a1 - a0 >= Math.PI * 2 - 1e-6) {
    return 'M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 1 1 ' + (cx + r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 1 1 ' + (cx - r) + ' ' + cy + ' Z';
  }
  const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return 'M ' + cx + ' ' + cy + ' L ' + x0.toFixed(2) + ' ' + y0.toFixed(2) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' Z';
}
// Donut segment between radii ri and ro. A full circle (one service only) is drawn as two half rings.
function ringSlicePath(cx, cy, ro, ri, a0, a1) {
  const pt = function (r, a) { return (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2); };
  if (a1 - a0 >= Math.PI * 2 - 1e-6) {
    const m = a0 + Math.PI;
    return ringSlicePath(cx, cy, ro, ri, a0, m) + ' ' + ringSlicePath(cx, cy, ro, ri, m, a1);
  }
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return 'M ' + pt(ro, a0) + ' A ' + ro + ' ' + ro + ' 0 ' + large + ' 1 ' + pt(ro, a1) + ' L ' + pt(ri, a1) + ' A ' + ri + ' ' + ri + ' 0 ' + large + ' 0 ' + pt(ri, a0) + ' Z';
}
// Thin arc along the inside edge of the ring; marks the selected segment without changing the chart's size.
function ringMarkPath(cx, cy, r, a0, a1) {
  const pt = function (a) { return (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2); };
  const e = Math.min(a1, a0 + Math.PI * 2 - 0.02);
  return 'M ' + pt(a0) + ' A ' + r + ' ' + r + ' 0 ' + (e - a0 > Math.PI ? 1 : 0) + ' 1 ' + pt(e);
}
function pct(x) { return (Math.round(x * 1000) / 10).toFixed(1) + '%'; }

export { NOW, DAY, MIN_WITHDRAWAL, ASTRO, MAX_UPI, SERVICES, SVC, RAW, r2, money, fmtDT, fmtD, monthKey, monthLabel, nextRelease, addWorkingDays, buildPdf, PILL, ALL_STATUSES, SERVICE_FILTERS, THIS_M, availableFrom, maskAcct, maskUpi, methodLabel, loadPayout, storePayout, BANK_EMPTY, UPI_EMPTY, validateBank, validateUpi, txFor, isCredit, txAmount, pieSlicePath, ringSlicePath, ringMarkPath, pct };
