// Sample (prototype) data and helpers for Birth Profiles & Kundli. Chart data is mock, not a real horoscope calculation.
export const PLACES = [["Chennai", "Tamil Nadu"], ["Coimbatore", "Tamil Nadu"], ["Kochi", "Kerala"], ["Mumbai", "Maharashtra"], ["Hyderabad", "Telangana"], ["Bengaluru", "Karnataka"]];
export const RELS = ["Son", "Daughter", "Husband", "Wife", "Father", "Mother", "Brother", "Sister", "Other Family Relationship"];
export const CHARTS = ["Rasi", "Navamsa", "Hora", "Drekkana", "Chandra"];
export const TYPES = ["Self", "Family Member", "Other"];
export const SEED_PROFILES = [
  { id: "p1", type: "Self", rel: "Self", gender: "Female", name: "Priya Raman", dob: "1992-03-14", time: "06:42", unk: false, place: "0", sample: true },
  { id: "p2", type: "Family Member", rel: "Daughter", gender: "Female", name: "Sanu", dob: "2019-08-21", time: "09:10", unk: false, place: "2", sample: true },
  { id: "p3", type: "Other", rel: "Friend", gender: "Male", name: "Arun", dob: "1989-12-05", time: "22:15", unk: false, place: "4", sample: true },
];
export const SEED_DOCS = { p1: [{ name: "birth_certificate.pdf", size: "210 KB" }], p2: [], p3: [] };
export const SEED_SHARES = [
  { pid: "p1", astro: "Acharya Ravi Shankar", svc: "Appointment – 45 min", at: "12 Nov 2026, 5:30 PM", status: "Active" },
  { pid: "p1", astro: "Pt. Venkat Sharma", svc: "Instant Call", at: "20 Oct 2026, 8:10 PM", status: "Revoked" },
  { pid: "p2", astro: "Smt. Lakshmi Iyer", svc: "Text Question", at: "02 Nov 2026, 11:05 AM", status: "Expired" },
];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const ini = (n) => (n || "?").split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();
export const fmtD = (s) => { if (!s) return "—"; const p = s.split("-"); return +p[2] + " " + MON[+p[1] - 1] + " " + p[0]; };
export const fmtT = (p) => { if (p.unk) return "Time unknown"; if (!p.time) return "—"; let [h, m] = p.time.split(":").map(Number); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return h + ":" + String(m).padStart(2, "0") + " " + ap; };
export const typeLbl = (p) => (p.type === "Self" ? "Self" : p.type === "Family Member" ? "Family · " + p.rel : "Other" + (p.rel && p.rel !== "Other" ? " · " + p.rel : ""));
export const fsize = (f) => (f.size > 1048576 ? (f.size / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(f.size / 1024)) + " KB");

// Derived (mock) Kundli details for one profile.
export function describe(p) {
  const pi = +p.place || 0;
  return {
    place: PLACES[pi][0], placeFull: PLACES[pi].join(", ") + ", India", gender: p.gender || "Not specified",
    moon: ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya"][(p.name.length + pi) % 6],
    lagna: p.unk ? "Approximate" : ["Tula", "Dhanu", "Makara", "Kumbha", "Meena", "Simha"][(p.name.length + pi) % 6],
    nak: ["Ashwini", "Rohini", "Pushya", "Hasta", "Anuradha", "Revati"][((p.dob || "").length + (p.name.length % 6) - 1 + 6) % 6] || "Pushya",
  };
}
// 12 outer boxes of a North-style 4x4 chart, with mock planet placements.
const SIGNS = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];
const LAYOUT = [[11, 0, 0], [0, 0, 1], [1, 0, 2], [2, 0, 3], [10, 1, 0], [3, 1, 3], [9, 2, 0], [4, 2, 3], [8, 3, 0], [7, 3, 1], [6, 3, 2], [5, 3, 3]];
const CO = { Rasi: [0, 5], Navamsa: [3, 7], Hora: [1, 11], Drekkana: [6, 5], Chandra: [2, 7] };
export function chartCells(p, chart) {
  const co = CO[chart], pi = +p.place || 0, seed = p.name.length + pi;
  const hs = SIGNS.map(() => []);
  ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke", "As"].forEach((pl, i) => hs[(i * co[1] + co[0] + seed) % 12].push(pl));
  return LAYOUT.map(([i, r, c]) => ({ sign: SIGNS[i], pl: hs[i].join(" "), r: r + 1, c: c + 1 }));
}
