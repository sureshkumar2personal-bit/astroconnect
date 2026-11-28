// Sample (prototype) data and helpers for the Wallet page. Records are illustrative; dates are shifted so the newest sample is near the real current day.
export const MIN_BALANCE = 500; // D-32: the Wallet keeps at least ₹500 after a withdrawal.
export const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const inr = (n) => "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pad = (n) => String(n).padStart(2, "0");
export const fmt = (ts) => { const d = new Date(ts); let h = d.getHours(); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return d.getDate() + " " + MON[d.getMonth()] + ", " + h + ":" + pad(d.getMinutes()) + " " + ap; };
export const fmtD = (ts) => { const d = new Date(ts); return d.getDate() + " " + MON[d.getMonth()] + " " + d.getFullYear(); };
export const parseD = (s, end) => { if (!s) return null; const p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2], end ? 23 : 0, end ? 59 : 0, end ? 59 : 0).getTime(); };
export const rangeOf = (kind, from, to) => {
  const n = new Date(), y = n.getFullYear(), m = n.getMonth();
  if (kind === "this") return [new Date(y, m, 1).getTime(), new Date(y, m + 1, 1).getTime() - 1];
  if (kind === "last") return [new Date(y, m - 1, 1).getTime(), new Date(y, m, 1).getTime() - 1];
  if (kind === "custom") return [parseD(from, false), parseD(to, true)];
  return [null, null];
};
export const inRange = (ts, r) => (r[0] === null || ts >= r[0]) && (r[1] === null || ts <= r[1]);

export const ICON = {
  recharge: "M12 5v14M5 12h14",
  appointment: "M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
  call: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z",
  chat: "M4 5h16v11H9l-5 4z",
  question: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 16.8v.01",
  refund: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
  withdraw: "M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18",
  upi: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2",
};
export const ST = { Successful: "ok", Pending: "pend", Failed: "fail", Refunded: "ref" };

// Seed transactions are written for 28 Nov 2026 and shifted by the number of days between then and today.
const DELTA = Math.round((new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) - new Date(2026, 10, 28)) / 86400000);
const T = (ref, kind, title, amt, status, mo, d, h, mi) => ({ ref, kind, title, amt, status, ts: new Date(2026, mo, d + DELTA, h, mi).getTime() });
export const SEED_TXNS = [
  T("AC47381K", "chat", "Instant Chat Payment", -180, "Successful", 10, 28, 10, 15),
  T("AC47352M", "recharge", "Wallet Recharge", 1000, "Successful", 10, 27, 19, 42),
  T("AC47310P", "appointment", "Appointment Payment", -500, "Pending", 10, 26, 16, 30),
  T("AC47288T", "call", "Instant Call Payment", -360, "Successful", 10, 25, 20, 5),
  T("AC47245Q", "question", "Text Question Payment", -99, "Successful", 10, 24, 9, 20),
  T("AC47190R", "refund", "Refund", 500, "Refunded", 10, 22, 12, 10),
  T("AC47144W", "withdraw", "Withdrawal", -1000, "Successful", 10, 20, 15, 0),
  T("AC47103B", "recharge", "Wallet Recharge", 2000, "Failed", 10, 18, 11, 48),
  T("AC47062D", "appointment", "Appointment Payment", -1200, "Successful", 10, 15, 18, 0),
  T("AC46990H", "recharge", "Wallet Recharge", 5000, "Successful", 10, 10, 8, 55),
  T("AC46931L", "chat", "Instant Chat Payment", -240, "Successful", 10, 6, 21, 10),
  T("AC46822N", "call", "Instant Call Payment", -420, "Successful", 9, 29, 19, 25),
  T("AC46777C", "question", "Text Question Payment", -99, "Successful", 9, 21, 13, 40),
  T("AC46701G", "recharge", "Wallet Recharge", 2000, "Successful", 9, 14, 10, 5),
];
export const SEED_BANK = { holder: "Aarav Mehta", bankName: "HDFC Bank", acct: "50100234564821", ifsc: "HDFC0001234" };
