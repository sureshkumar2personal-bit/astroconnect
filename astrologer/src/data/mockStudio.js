// Illustrative sample data only — Benefits & Content (spec 12_CONTENT_MANAGEMENT.md, AD-138 – AD-144, AD-179 – AD-183).
// Sample values come from the "Benefits & Content" reference prototype; subscriber counts, offers, redemptions and
// transactions are samples, not real records. The reference's "Pro" tier is shown as "Platinum" (AD-72).
import { contentSeed } from '@/data/mockContent.js';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function fmtDate(iso) { if (!iso) return ''; const p = iso.split('-'); if (p.length < 3) return iso; return `${parseInt(p[2], 10)} ${MONTHS[parseInt(p[1], 10) - 1]} ${p[0]}`; }
export function fmtTime(t) { if (!t) return ''; const p = t.split(':'); let h = parseInt(p[0], 10); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${p[1]} ${ap}`; }
export function fmtShort(iso, t) { const p = (iso || '').split('-'); if (p.length < 3) return ''; return `${parseInt(p[2], 10)} ${MONTHS[parseInt(p[1], 10) - 1]}${t ? `, ${fmtTime(t)}` : ''}`; }
export function inr(n) { return `₹${Math.round(n).toLocaleString('en-IN')}`; }

export const RASIS = [
  { id: "mesham", ta: "மேஷம்", en: "Aries", nta: "அஸ்வினி · பரணி · கார்த்திகை (பாதம் 1)", nen: "Ashwini · Bharani · Krittika (pada 1)" },
  { id: "rishabam", ta: "ரிஷபம்", en: "Taurus", nta: "கார்த்திகை (பாதம் 2–4) · ரோகிணி · மிருகசீரிஷம் (பாதம் 1–2)", nen: "Krittika (2–4) · Rohini · Mrigashira (1–2)" },
  { id: "mithunam", ta: "மிதுனம்", en: "Gemini", nta: "மிருகசீரிஷம் (பாதம் 3–4) · திருவாதிரை · புனர்பூசம் (பாதம் 1–3)", nen: "Mrigashira (3–4) · Thiruvathirai · Punarpoosam (1–3)" },
  { id: "kadagam", ta: "கடகம்", en: "Cancer", nta: "புனர்பூசம் (பாதம் 4) · பூசம் · ஆயில்யம்", nen: "Punarpoosam (4) · Poosam · Ayilyam" },
  { id: "simmam", ta: "சிம்மம்", en: "Leo", nta: "மகம் · பூரம் · உத்திரம் (பாதம் 1)", nen: "Magam · Pooram · Uthiram (1)" },
  { id: "kanni", ta: "கன்னி", en: "Virgo", nta: "உத்திரம் (பாதம் 2–4) · அஸ்தம் · சித்திரை (பாதம் 1–2)", nen: "Uthiram (2–4) · Hastham · Chithirai (1–2)" },
  { id: "thulam", ta: "துலாம்", en: "Libra", nta: "சித்திரை (பாதம் 3–4) · சுவாதி · விசாகம் (பாதம் 1–3)", nen: "Chithirai (3–4) · Swathi · Visakam (1–3)" },
  { id: "viruchigam", ta: "விருச்சிகம்", en: "Scorpio", nta: "விசாகம் (பாதம் 4) · அனுஷம் · கேட்டை", nen: "Visakam (4) · Anusham · Kettai" },
  { id: "dhanusu", ta: "தனுசு", en: "Sagittarius", nta: "மூலம் · பூராடம் · உத்திராடம் (பாதம் 1)", nen: "Moolam · Pooradam · Uthiradam (1)" },
  { id: "magaram", ta: "மகரம்", en: "Capricorn", nta: "உத்திராடம் (பாதம் 2–4) · திருவோணம் · அவிட்டம் (பாதம் 1–2)", nen: "Uthiradam (2–4) · Thiruvonam · Avittam (1–2)" },
  { id: "kumbam", ta: "கும்பம்", en: "Aquarius", nta: "அவிட்டம் (பாதம் 3–4) · சதயம் · பூரட்டாதி (பாதம் 1–3)", nen: "Avittam (3–4) · Sathayam · Poorattathi (1–3)" },
  { id: "meenam", ta: "மீனம்", en: "Pisces", nta: "பூரட்டாதி (பாதம் 4) · உத்திரட்டாதி · ரேவதி", nen: "Poorattathi (4) · Uthirattathi · Revathi" }
];

export const TYPES = [
  { id: "general", label: "General Post", sub: "Text or image update", color: "#3A1020", soft: "#EEF1F6" },
  { id: "daily", label: "Daily Prediction", sub: "Guidance for one day", color: "#7A1F3A", soft: "#E3F0EE" },
  { id: "weekly", label: "Weekly Prediction", sub: "Outlook for the week", color: "#2A5598", soft: "#E6EEFA" },
  { id: "monthly", label: "Monthly Prediction", sub: "Outlook for the month", color: "#4B3F8F", soft: "#ECEAF7" },
  { id: "special", label: "Special Prediction", sub: "Festival, transit, guidance", color: "#7A5712", soft: "#F6EEDB" },
  { id: "event", label: "Astrology Event", sub: "Peyarchi & event templates", color: "#A33A2A", soft: "#FBEAE6" }
];
export const TYPE = {}; TYPES.forEach(function (t) { TYPE[t.id] = t; });

export const AUD = [
  { id: "public", label: "Public / General", short: "Public", sub: "Everyone on AstroConnect", fg: "#3A1020", bg: "#EEF1F6" },
  { id: "followers", label: "Followers", short: "Followers", sub: "3,420 people follow you", fg: "#7A1F3A", bg: "#E3F0EE" },
  { id: "silver", label: "Silver Subscribers", short: "Silver", sub: "412 subscribers", fg: "#4B5563", bg: "#EEF0F3" },
  { id: "gold", label: "Gold Subscribers", short: "Gold", sub: "186 subscribers", fg: "#7A5712", bg: "#F6EEDB" },
  { id: "pro", label: "Platinum Subscribers", short: "Platinum", sub: "64 subscribers", fg: "#4B3F8F", bg: "#ECEAF7" }
];
export const AUDM = {}; AUD.forEach(function (a) { AUDM[a.id] = a; });

export const STATUS = {
  draft: { label: "Draft", fg: "#4B5563", bg: "#EEF0F3" },
  scheduled: { label: "Scheduled", fg: "#2A5598", bg: "#E6EEFA" },
  published: { label: "Published", fg: "#7A1F3A", bg: "#E3F0EE" },
  delivered: { label: "Delivered", fg: "#7A1F3A", bg: "#E3F0EE" },
  failed: { label: "Failed", fg: "#A33A2A", bg: "#FBEAE6" },
  retrying: { label: "Retrying", fg: "#7A5712", bg: "#F6EEDB" }
};

export const SAMPLES = {
  sunrise: { label: "Sunrise artwork", css: "background: radial-gradient(circle at 50% 82%, #F2C46D 0 16%, rgba(242,196,109,0) 17%), radial-gradient(circle at 50% 82%, rgba(242,196,109,0.35) 0 30%, rgba(242,196,109,0) 31%), linear-gradient(180deg, #FBF3E2 0%, #EBCB8B 100%)" },
  lamp: { label: "Oil lamp artwork", css: "background: radial-gradient(ellipse 10% 16% at 50% 40%, #FFE3A3 0 60%, rgba(255,227,163,0) 61%), radial-gradient(circle at 50% 44%, rgba(255,214,128,0.35) 0 22%, rgba(255,214,128,0) 23%), radial-gradient(ellipse 26% 8% at 50% 66%, #B8892B 0 70%, rgba(184,137,43,0) 71%), linear-gradient(180deg, #3A1020, #5A1A32)" },
  night: { label: "Moon and stars artwork", css: "background: radial-gradient(circle at 72% 30%, #F4E9CF 0 9%, rgba(244,233,207,0) 10%), radial-gradient(circle at 20% 25%, #F4E9CF 0 0.6%, rgba(0,0,0,0) 0.8%), radial-gradient(circle at 35% 60%, #F4E9CF 0 0.5%, rgba(0,0,0,0) 0.7%), radial-gradient(circle at 85% 70%, #F4E9CF 0 0.5%, rgba(0,0,0,0) 0.7%), linear-gradient(160deg, #3A1020, #7A1F3A)" }
};

export const EVENTS = [
  { id: "guru", ta: "குரு பெயர்ச்சி", en: "Guru Peyarchi · Jupiter transit", tag: "Jupiter", color: "#B8892B", bg: "#3A2E14", size: 46 },
  { id: "sani", ta: "சனிப் பெயர்ச்சி", en: "Sani Peyarchi · Saturn transit", tag: "Saturn", color: "#9FB0CF", bg: "#3A1020", size: 40 },
  { id: "rahu", ta: "ராகு–கேது பெயர்ச்சி", en: "Rahu–Ketu Peyarchi · Nodes transit", tag: "Rahu · Ketu", color: "#B9AEEA", bg: "#2C2557", size: 34 },
  { id: "chevvai", ta: "செவ்வாய் பெயர்ச்சி", en: "Chevvai Peyarchi · Mars transit", tag: "Mars", color: "#E58E78", bg: "#4A1F17", size: 30 },
  { id: "surya", ta: "சூரியப் பெயர்ச்சி", en: "Surya Peyarchi · Sun transit, Tamil month", tag: "Sun", color: "#F2C46D", bg: "#5A3510", size: 52 },
  { id: "grahanam", ta: "கிரகணம்", en: "Grahanam · Solar or lunar eclipse", tag: "Eclipse", color: "#F1D9E0", bg: "#4A1230", size: 44 }
];
export const EVM = {}; EVENTS.forEach(function (e) { EVM[e.id] = e; });

export function blank(type) {
  var t = type || "general";
  return {
    id: null, created: null, status: null, title: "", type: t, format: t === "general" ? "general" : "rasi", mode: "text", body: "",
    bold: false, italic: false, underline: false, textColor: "#3A1020", bgColor: "#FFFFFF", image: null, useRasi: false,
    specialTopic: "", eventId: "", contentDate: "", contentTime: "", audience: t === "general" ? "public" : "followers",
    publishMode: "now", schedDate: "2026-11-28", schedTime: "06:00", preds: {}, open: { mesham: true, rishabam: true }
  };
}
export function mk(o) { return Object.assign(blank(o.type), o); }
export function eventDraft(ev) {
  return mk({ type: "event", eventId: ev.id, title: ev.ta + " பலன்கள் — " + ev.en.split(" · ")[0] + " predictions",
    body: ev.en.split(" · ")[0] + " is an important transit. Here is how it may influence each Rasi and Nakshatra. [Add transit date and time]",
    contentDate: "", audience: "followers" });
}

export const SAMPLE_POSTS = [
  mk({ id: "p1", type: "daily", title: "இன்றைய ராசி பலன் — 27 Nov", audience: "followers", status: "published", created: "27 Nov 2026", when: "Published 27 Nov, 6:10 AM · 1,284 views", contentDate: "2026-11-27",
    body: "A calm day for decisions made with patience. Find your Rasi below.",
    preds: { mesham: "Good day to finish pending paperwork. Avoid hasty spending in the evening.", rishabam: "Family support strengthens your plans. A short trip brings good news.", mithunam: "Communication flows well — a good day for interviews and meetings.", kadagam: "Rest well. Financial matters stay steady." } }),
  mk({ id: "p2", type: "weekly", title: "Weekly outlook · 30 Nov – 6 Dec", audience: "silver", status: "scheduled", created: "26 Nov 2026", when: "Scheduled 30 Nov, 6:00 AM", publishMode: "schedule", schedDate: "2026-11-30", schedTime: "06:00", body: "Your Rasi-wise outlook for the coming week.", preds: { mesham: "Career momentum builds mid-week." } }),
  mk({ id: "p3", type: "monthly", title: "December monthly predictions", audience: "gold", status: "draft", created: "25 Nov 2026", when: "Edited 25 Nov, 9:42 PM" }),
  mk({ id: "p4", type: "general", title: "Why we light the lamp at dusk", audience: "public", status: "published", created: "24 Nov 2026", when: "Published 24 Nov, 6:30 PM · 3,910 views", mode: "both", image: { kind: "sample", id: "lamp" }, body: "Lighting a lamp at sandhya time is a simple daily practice that settles the home before evening." }),
  Object.assign(eventDraft(EVM.sani), { id: "p5", audience: "pro", status: "draft", created: "22 Nov 2026", when: "Edited 22 Nov, 11:05 AM", title: "Sani Peyarchi — what changes for your Rasi" }),
  mk({ id: "p6", type: "special", specialTopic: "Special astrology guidance", format: "general", title: "Remedies for a smooth Sani period", audience: "gold", status: "scheduled", created: "21 Nov 2026", when: "Scheduled 4 Dec, 6:00 PM", publishMode: "schedule", schedDate: "2026-12-04", schedTime: "18:00", body: "Simple, practical remedies you can follow at home during a demanding Sani period." }),
  mk({ id: "p7", type: "general", title: "Answering your questions on marriage timing", audience: "followers", status: "published", created: "20 Nov 2026", when: "Published 20 Nov, 7:15 PM · 2,106 views", body: "Many of you asked how marriage timing is read from a horoscope. Here is what I look at first." }),
  mk({ id: "p8", type: "general", title: "Morning prayer for a focused day", audience: "public", status: "published", created: "18 Nov 2026", when: "Published 18 Nov, 5:45 AM · 4,452 views", mode: "both", image: { kind: "sample", id: "sunrise" }, bgColor: "#F6EEDB", textColor: "#7A5712", body: "Start with three deep breaths and a short prayer facing east." })
];

export const SAMPLE_HISTORY = [
  { id: "h1", title: "இன்றைய ராசி பலன் — 27 Nov", type: "Daily Prediction", aud: "followers", status: "delivered", when: "27 Nov 2026, 6:10 AM", detail: "Delivered to 3,388 followers · 61% opened" },
  { id: "h2", title: "Why we light the lamp at dusk", type: "General Post", aud: "public", status: "delivered", when: "24 Nov 2026, 6:30 PM", detail: "Shown in public feed · 3,910 views" },
  { id: "h3", title: "Weekly outlook · 23 – 29 Nov", type: "Weekly Prediction", aud: "silver", status: "delivered", when: "23 Nov 2026, 6:00 AM", detail: "Delivered to 406 of 412 Silver subscribers" },
  { id: "h4", title: "Daily guidance — 22 Nov", type: "Daily Prediction", aud: "followers", status: "failed", when: "22 Nov 2026, 6:00 AM", detail: "Post is live; push notification failed on 132 devices" },
  { id: "h5", title: "Answering your questions on marriage timing", type: "General Post", aud: "followers", status: "delivered", when: "20 Nov 2026, 7:15 PM", detail: "Delivered to 3,301 followers · 48% opened" },
  { id: "h6", title: "Weekly outlook · 30 Nov – 6 Dec", type: "Weekly Prediction", aud: "silver", status: "scheduled", when: "30 Nov 2026, 6:00 AM", detail: "Will deliver to 412 Silver subscribers" },
  { id: "h7", title: "Remedies for a smooth Sani period", type: "Special Prediction", aud: "gold", status: "scheduled", when: "4 Dec 2026, 6:00 PM", detail: "Will deliver to 186 Gold subscribers" }
];

export const SERVICES = [
  { id: "text", name: "Text Questions", group: "Consultations" },
  { id: "appt", name: "Appointments", group: "Consultations" },
  { id: "call", name: "Instant Call", group: "Consultations" },
  { id: "chat", name: "Instant Chat", group: "Consultations" },
  { id: "live", name: "Live Sessions", group: "Consultations" },
  { id: "daily", name: "Daily Prediction", group: "Predictions" },
  { id: "weekly", name: "Weekly Prediction", group: "Predictions" },
  { id: "monthly", name: "Monthly Prediction", group: "Predictions" },
  { id: "special", name: "Special Prediction", group: "Predictions" }
];
function b(on, type, detail) { return { on: on, type: type, detail: detail }; }
export const BENEFITS = {
  followers: { text: b(true, "Discount", "10% off the first question"), appt: b(false, "Not set", "—"), call: b(false, "Not set", "—"), chat: b(true, "Discount", "5% off the first chat"), live: b(true, "Free benefit", "Join public live sessions"), daily: b(true, "Free benefit", "Daily Rasi summary"), weekly: b(false, "Not set", "—"), monthly: b(false, "Not set", "—"), special: b(false, "Not set", "—") },
  silver: { text: b(true, "Free benefit", "1 free question every month"), appt: b(true, "Discount", "Special 10% discount"), call: b(false, "Not set", "—"), chat: b(true, "Discount", "5% off every chat"), live: b(true, "Subscriber access", "Subscriber-only live sessions"), daily: b(true, "Subscriber access", "Full Rasi & Nakshatra daily prediction"), weekly: b(false, "Exclusive access", "Weekly outlook"), monthly: b(false, "Not set", "—"), special: b(false, "Not set", "—") },
  gold: { text: b(true, "Free benefit", "2 free questions every month"), appt: b(true, "Discount", "15% off appointments"), call: b(true, "Discount", "10% off instant calls"), chat: b(true, "Special benefit", "Special 15% chat discount"), live: b(true, "Subscriber access", "All live sessions"), daily: b(true, "Subscriber access", "Full daily prediction"), weekly: b(true, "Exclusive access", "Weekly prediction, Gold only"), monthly: b(true, "Subscriber access", "Monthly outlook"), special: b(false, "Not set", "—") },
  pro: { text: b(true, "Free benefit", "4 free questions every month"), appt: b(true, "Special benefit", "Priority booking + 20% off"), call: b(true, "Discount", "20% off instant calls"), chat: b(true, "Discount", "20% off instant chats"), live: b(true, "Subscriber access", "All live sessions + replays"), daily: b(true, "Subscriber access", "Full daily prediction"), weekly: b(true, "Subscriber access", "Weekly prediction"), monthly: b(true, "Subscriber access", "Monthly prediction"), special: b(true, "Exclusive access", "Special predictions, Platinum only") }
};
export const BTYPE = {
  "Free benefit": ["#7A1F3A", "#E3F0EE"], "Discount": ["#7A5712", "#F6EEDB"], "Exclusive access": ["#4B3F8F", "#ECEAF7"],
  "Subscriber access": ["#2A5598", "#E6EEFA"], "Special benefit": ["#A33A2A", "#FBEAE6"], "Not set": ["#4B5563", "#EEF0F3"]
};
export const TIERS = [
  { id: "followers", name: "Followers", members: "3,420 followers", medal: "#7A1F3A" },
  { id: "silver", name: "Silver", members: "412 subscribers", medal: "#A9B0BC" },
  { id: "gold", name: "Gold", members: "186 subscribers", medal: "#C9A24A" },
  { id: "pro", name: "Platinum", members: "64 subscribers", medal: "#4B3F8F" }
];

export const OFFERS = [
  { id: "o1", name: "Silver welcome question", service: "Text Questions", tier: "Silver", unit: 199, pct: 100, users: 38, uses: 38, acq: 9 },
  { id: "o2", name: "Gold chat 15% off", service: "Instant Chat", tier: "Gold", unit: 240, pct: 15, users: 54, uses: 121, acq: 6 },
  { id: "o3", name: "Silver appointment 10% off", service: "Appointments", tier: "Silver", unit: 600, pct: 10, users: 29, uses: 31, acq: 4 },
  { id: "o4", name: "Platinum priority appointment", service: "Appointments", tier: "Platinum", unit: 900, pct: 20, users: 12, uses: 15, acq: 2 },
  { id: "o5", name: "Followers first chat 5% off", service: "Instant Chat", tier: "Followers", unit: 150, pct: 5, users: 86, uses: 86, acq: 0 },
  { id: "o6", name: "Gold call 10% off", service: "Instant Call", tier: "Gold", unit: 300, pct: 10, users: 21, uses: 44, acq: 3 }
];
export const RANGE = { today: { m: 0.05, label: "Today, 27 Nov 2026." }, "7d": { m: 0.27, label: "21 – 27 Nov 2026." }, "30d": { m: 1, label: "29 Oct – 27 Nov 2026." }, custom: { m: 0.6, label: "" } };
export const FEE = 0.2;

const NAMES = ["Priya S.", "Karthik R.", "Meena V.", "Arun K.", "Lakshmi N.", "Senthil M.", "Divya P.", "Ganesh T.", "Revathi A.", "Bala J.", "Saranya D.", "Vignesh L."];
export const TX = [];
(function () {
  for (var i = 0; i < 30; i++) {
    var o = OFFERS[(i * 5 + 1) % 6];
    var day = 27 - Math.floor(i * 0.93);
    var status = (i === 6 || i === 19) ? "Refunded" : (i % 8 === 2 ? "Pending" : "Completed");
    var discount = Math.round(o.unit * o.pct / 100);
    var paid = o.unit - discount;
    var fee = Math.round(paid * FEE);
    var hh = 8 + (i * 3) % 13; var mm = (i * 17) % 60;
    TX.push({ id: "t" + i, daysAgo: 27 - day, date: day + " Nov 2026", time: fmtTime((hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm),
      customer: NAMES[(i * 7) % NAMES.length], offerId: o.id, offer: o.name, service: o.service, tier: o.tier,
      offerAmt: o.pct === 100 ? "Free (" + inr(discount) + ")" : "−" + inr(discount), paid: paid, net: status === "Refunded" ? 0 : paid - fee, status: status });
  }
})();
export const TXS = { Completed: ["#7A1F3A", "#E3F0EE"], Pending: ["#7A5712", "#F6EEDB"], Refunded: ["#A33A2A", "#FBEAE6"] };

export const EMOJIS = [["✨", "Sparkles"], ["🌙", "Crescent moon"], ["☀️", "Sun"], ["🪐", "Planet"], ["⭐", "Star"], ["🙏", "Folded hands"], ["🪔", "Oil lamp"], ["🌸", "Blossom"], ["🕉️", "Om"], ["🔱", "Trident"], ["💫", "Dizzy star"], ["🌿", "Herb"]];
export const TEXT_COLORS = [["#3A1020", "Deep burgundy text"], ["#7A1F3A", "Burgundy text"], ["#7A5712", "Gold text"], ["#A33A2A", "Rust text"], ["#4B3F8F", "Indigo text"], ["#FFFFFF", "White text"]];
export const BG_COLORS = [["#FFFFFF", "White background"], ["#FAF7F0", "Ivory background"], ["#F6EEDB", "Gold tint background"], ["#E3F0EE", "Rose tint background"], ["#3A1020", "Deep burgundy background"], ["#7A1F3A", "Burgundy background"]];
export const PRED_TPL = {
  daily: { title: "இன்றைய ராசி பலன் — [Date]", body: "Here is today's guidance for all 12 Rasis. Find your Rasi and Nakshatra below.", desc: "Intro + 12 Rasi sections for one day" },
  weekly: { title: "Weekly outlook · [Week]", body: "Your Rasi-wise outlook for the week ahead.", desc: "Intro + 12 Rasi sections for the week" },
  monthly: { title: "[Month] monthly predictions", body: "What the month holds for each Rasi — career, family, health and finance.", desc: "Intro + 12 Rasi sections for the month" },
  special: { title: "Special prediction — [Topic]", body: "Guidance for this special occasion.", desc: "Topic field + Rasi or general content" }
};



// Delivery statuses of the existing history (AD-140: Delivered, Missed, Pending) join the reference's.
STATUS.missed = { label: 'Missed' };
STATUS.pending = { label: 'Pending' };

// ---- the existing posts and delivery history (contentSeed, AD-138 – AD-140), mapped into the new post model ----
const AUD_OF = { Public: 'public', Followers: 'followers', Subscribers: 'silver', Silver: 'silver', Gold: 'gold', Platinum: 'platinum' };
const KIND_OF = { 'General Post': 'general', Custom: 'general', 'Daily Prediction': 'daily', 'Weekly Prediction': 'weekly', 'Monthly Prediction': 'monthly', 'Special Prediction': 'special' };
const ST_OF = { Published: 'published', Scheduled: 'scheduled', Draft: 'draft' };
const longDate = (at) => { const [d, t] = at.split('T'); return { d: fmtDate(d), s: fmtShort(d, t.slice(0, 5)) }; };

export const EXISTING_POSTS = contentSeed.posts.map((p) => {
  const type = KIND_OF[p.kind] || 'general';
  const ld = longDate(p.at);
  const status = ST_OF[p.st] || 'draft';
  const when = status === 'published' ? `Published ${ld.s} · ${p.views.toLocaleString('en-IN')} views` : status === 'scheduled' ? `Scheduled ${ld.s}` : `Edited ${ld.s}`;
  return mk({
    id: p.id, type, title: p.title, body: p.text || '', audience: AUD_OF[p.aud.split(', ')[0]] || 'followers', status, created: ld.d, when,
    mode: p.fmt === 'Image' ? 'image' : p.fmt === 'Text + Image' ? 'both' : 'text', image: p.fmt === 'Image' || p.fmt === 'Text + Image' ? { kind: 'sample', id: type === 'general' ? 'lamp' : 'sunrise' } : null,
    format: type === 'general' ? 'general' : 'rasi', publishMode: status === 'scheduled' ? 'schedule' : 'now', schedDate: p.at.slice(0, 10), schedTime: p.at.slice(11, 16),
  });
});
export const EXISTING_HISTORY = contentSeed.delivery.map((d, i) => {
  const ld = longDate(d.at);
  const missed = d.st === 'Missed';
  return {
    id: `d${i + 1}`, title: d.content, type: d.content.split(' · ')[0], aud: AUD_OF[d.tier.split(', ')[0]] || 'silver', status: d.st.toLowerCase(),
    when: `${ld.d}, ${fmtTime(d.at.slice(11, 16))}`, detail: missed ? 'Not delivered — the scheduled send was missed' : d.st === 'Pending' ? `Will deliver to ${d.tier}` : `Delivered to ${d.tier}`,
  };
});
export const SEED_POSTS = [...EXISTING_POSTS, ...SAMPLE_POSTS];
export const SEED_HISTORY = [...SAMPLE_HISTORY, ...EXISTING_HISTORY];
