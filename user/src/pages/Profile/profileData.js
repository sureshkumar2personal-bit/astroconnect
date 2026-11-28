// Sample (prototype) data and helpers for the Profile section. Nothing here is real account data.
export const ini = (n) => (n || "?").split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();
export const mobM = (m) => (m ? "+91 ••••• " + m.replace(/\D/g, "").slice(-4) : "");
export const emM = (e) => (e ? e[0] + "•••" + e.slice(e.indexOf("@")) : "");
export const pwScore = (p) => (p.length >= 12 ? "Strong" : p.length >= 8 && /\d/.test(p) ? "Good" : p ? "Weak" : "–");
export const pwOK = (p, q) => (p.length < 8 || !/\d/.test(p) ? "Use at least 8 characters including a number." : p !== q ? "Passwords do not match." : "");

export const LANGS = ["English", "Tamil", "Hindi", "Malayalam", "Telugu", "Marathi"];
export const CRITICAL = ["Appointments", "Questions", "Payment / Wallet", "Subscription", "Security", "Account alerts"];
export const CATS = [["appt", "Appointments"], ["text", "Text Questions"], ["call", "Instant Call & Chat"], ["subs", "Subscriptions & Astrologer Updates"], ["remedy", "Remedy Tracker"], ["pay", "Payments & Wallet"]];
export const AUDS = [["pub", "Public", "Anyone can see what you allow."], ["fol", "Followers", "Only people who follow you."], ["sub", "Subscribers", "Only your subscribers."]];
export const VIS_LABELS = ["Profile details", "Profile photo", "Followers list", "Following list", "Subscriptions", "Followed / subscribed hashtags", "Public activity / profile info"];
export const audOpts = (a) => (a.pub ? ["Everyone", "Only me"] : a.fol && a.sub ? ["Followers", "Subscribers", "Followers & Subscribers", "Only me"] : a.fol ? ["Followers", "Only me"] : ["Subscribers", "Only me"]);
export const IMPACT = [["Active appointments", "1 upcoming: 3 Dec, 6:00 PM", 1], ["Pending text questions", "1 awaiting an answer", 1], ["Active subscriptions", "2 subscriptions", 2], ["Wallet balance", "₹240.00 remaining", 1], ["Pending refunds", "1 refund of ₹150 in progress", 1], ["Open disputes", "None", 0], ["Open support tickets", "2 tickets open", 1]];
export const DATA_LABELS = ["Not requested", "Requested", "Preparing", "Ready"];
export const DELETE_REASONS = ["I no longer need the service", "Privacy concerns", "Switching to another app", "Other"];

export const INIT = {
  name: "Priya Raman", photo: true, lang: "English", mobile: "9876543210", email: "priya.raman@example.com",
  ed: { name: "", lang: "English", theme: "Light", photo: true }, nameErr: false,
  onlyFirst: true, kundliPaid: false, analytics: true, personalised: true, marketing: false,
  push: true, inapp: true, cats: { appt: true, text: true, call: true, subs: true, remedy: true, pay: true },
  googleLinked: true, pwOpen: false, pwCur: "", pwNew: "", pwConf: "", pwErr: "",
  sessions: [
    { id: 1, device: "Chrome on Pixel 8", loc: "Chennai, India", last: "Active now", cur: true },
    { id: 2, device: "Safari on iPad", loc: "Bengaluru, India", last: "Yesterday, 9:12 PM", cur: false },
    { id: 3, device: "Edge on Windows", loc: "Coimbatore, India", last: "8 days ago, 6:40 PM", cur: false },
  ],
  aud: { pub: false, fol: true, sub: true }, visOpen: false, blkOpen: false,
  vis: { v0: "Followers & Subscribers", v1: "Followers & Subscribers", v2: "Followers", v3: "Followers", v4: "Only me", v5: "Followers & Subscribers", v6: "Followers" },
  blocked: [{ id: 1, name: "Pt. Mohan Das", type: "Astrologer" }, { id: 2, name: "user_9281", type: "User" }],
  dataStatus: 0, deactivated: false, dStep: 0, resolved: false, delReason: "", delAck: false, delDone: false,
  modal: "", vType: "mobile", vStep: 1, vVal: "", vCode: "", vErr: "", rStep: 1, rVia: "Mobile", rCode: "", rPw: "", rPw2: "", rErr: "", consentOn: false, delType: "",
};
