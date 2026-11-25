const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Saved profiles keep "01 Jan 1990" and "06:30 AM"; the forms use native date and time inputs.
export const toDate = (s) => { const m = /^(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})$/.exec((s || "").trim()); if (!m) return ""; const i = MON.indexOf(m[2].slice(0, 1).toUpperCase() + m[2].slice(1, 3).toLowerCase()); return i < 0 ? "" : m[3] + "-" + String(i + 1).padStart(2, "0") + "-" + m[1].padStart(2, "0"); };
export const toTime = (s) => { const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec((s || "").trim()); if (!m) return ""; let h = Number(m[1]); const ap = (m[3] || "").toUpperCase(); if (ap === "PM" && h < 12) h += 12; if (ap === "AM" && h === 12) h = 0; return String(h).padStart(2, "0") + ":" + m[2]; };
export const showDate = (v) => { if (!v) return "Not provided"; const [y, m, d] = v.split("-"); return d + " " + MON[Number(m) - 1] + " " + y; };
export const showTime = (v) => { if (!v) return "Not provided"; const [h, m] = v.split(":").map(Number); return ((h % 12) || 12) + ":" + String(m).padStart(2, "0") + " " + (h < 12 ? "AM" : "PM"); };
export const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
export const rid = (p) => p + "-" + Math.floor(100000 + Math.random() * 900000);
export const clock = () => new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
export const ordinal = (n) => n + (n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th");
export const KIND = { call: { name: "Call", label: "Instant Call", cta: "Call Now", verb: "talk to" }, chat: { name: "Chat", label: "Instant Chat", cta: "Chat Now", verb: "chat with" } };
export const METHODS = { wallet: { name: "AstroConnect Wallet" }, upi: { name: "UPI", sub: "Pay with any UPI app" }, card: { name: "Saved card", sub: "Visa ending 2290" } };
