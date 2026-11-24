import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GR, ASTRO, CATS, CAMPS, ACTS0, ICON, APPT_PRICE, PKGS, REQ_BEHAVIOR, REVIEWS, TIERS, TIER_DAYS, POSTS, ASTRO_META } from "../data/mockData";

// Converts an inline-style string ("a:b;c:d") into a React style object.
export function cssToStyle(str) {
  const o = {};
  if (!str) return o;
  str.split(/;(?![^(]*\))/).forEach((d) => {
    const i = d.indexOf(":");
    if (i < 0) return;
    const k = d.slice(0, i).trim();
    const v = d.slice(i + 1).trim();
    if (!k) return;
    o[k.startsWith("--") ? k : k.replace(/^-ms-/, "ms-").replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  });
  return o;
}

const T0=(function(){try{return localStorage.getItem('ac-theme')==='light'?'light':'dark';}catch(e){return 'dark';}})();

// localStorage is the backend of this prototype: state is saved on every change.
const STORE_KEY = "ac-state-v1";
const TRANSIENT = ["toast","dlg","modal","notifOpen","profMenu","chatDraft","upi","rdFile","consentChk","rate","note","preview"];
const DAY = 86400000;
function loadState(base) {
  try {
    const sv = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (sv && typeof sv === "object") return migrate({ ...base, ...sv });
  } catch (e) { /* ignore unreadable storage */ }
  return migrate(base);
}
function migrate(o) {
  if (o.remedies) {
    o.remedies = o.remedies.map((r, i) => {
      const x = r.id ? r : { ...r, id: "seed" + i, type: "Remedy", actId: i === 0 ? 1 : 0, astro: 0 };
      if ((x.type || "Remedy") !== "Remedy" || x.days) return x;
      const src = x.src || "";
      const source = /^Instant Call/.test(src) ? "Call" : /^Instant Chat/.test(src) ? "Chat" : /^Appointment/.test(src) ? "Appointment" : "Text";
      return { ...x, ...ATONE_TPL.one, title: x.title, source, notes: "Mark each day once you have performed the ritual.", place: "Temple", time: "7:30 am", startDate: dayStart(Date.now()), completedDays: x.done ? [0] : [], proofs: x.proof ? { 0: { name: x.proof, type: "", size: 0 } } : {}, status: x.done ? "Completed" : "Pending" };
    });
  }
  return o;
}
function saveState(st) {
  try {
    const o = { ...st };
    TRANSIENT.forEach((k) => delete o[k]);
    localStorage.setItem(STORE_KEY, JSON.stringify(o));
  } catch (e) { /* storage unavailable */ }
}
const fmtIST = (t) => new Date(t).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" });

const SAMPLE_ANSWER = "The coming months look supportive. Take the steps in your remedy and revisit this in a few weeks.";
const SAMPLE_DISPUTE = "Here is more detail on the point you raised, with a clearer timeline.";
// Question status shown to users (D-25): New / Received, Pending, Completed.
export const qStatus = (x) => x.cancelled ? "Cancelled · refunded" : x.answeredAt ? "Completed" : x.openedAt ? "Pending" : "New";
const dispLabel = (d) => d.admin ? "Admin Review" : d.answeredAt ? "Dispute answered" : "Dispute raised";

const IST = { timeZone: "Asia/Kolkata" };
const fmtT = (t) => new Date(t).toLocaleTimeString("en-IN", { ...IST, hour: "numeric", minute: "2-digit" });
const fmtD = (t) => new Date(t).toLocaleDateString("en-IN", { ...IST, weekday: "short", day: "numeric", month: "short" });
const fmtDT = (t) => fmtD(t) + ", " + fmtT(t);
const dayStart = (t) => Math.floor((t + 19800000) / DAY) * DAY - 19800000; // midnight IST
const fmtLong = (t) => new Date(t).toLocaleDateString("en-IN", { ...IST, weekday: "long", day: "numeric", month: "long", year: "numeric" });

// Atonement (multi-day remedy) templates. Titles, gods, items and times are sample content.
const ATONE_TPL = {
  one: { days: 1, title: "A one-day Ganapati pooja for clarity and steady progress.", god: "Lord Ganesha", instruction: "Light the lamp and perform the Ganapati pooja with a calm intention.", things: ["Flowers", "Turmeric", "A small lamp"] },
  five: { days: 5, title: "Five-day Ganapati pooja for career confidence.", god: "Lord Ganesha", instruction: "Light the lamp and perform the Ganapati pooja with a calm intention.", things: ["Flowers", "Turmeric", "A small lamp"] },
  three: { days: 3, title: "Three-day lamp offering for calm decision-making.", god: "Goddess Durga", instruction: "Offer a lamp at sunrise and sit quietly for a few minutes.", things: ["Ghee lamp", "Cotton wick", "Red flowers"] },
  seven: { days: 7, title: "Seven-day Shiva abhishekam and prayer routine.", god: "Lord Shiva", instruction: "Perform the abhishekam and recite the prayer with a steady mind.", things: ["Water", "Milk", "Bilva leaves"] },
  lakshmi: { days: 7, title: "Seven-day Lakshmi pooja for financial stability.", god: "Goddess Lakshmi", instruction: "Light two lamps and offer flowers before the idol each morning.", things: ["Lotus or marigold flowers", "Two lamps", "Rice"] },
};
const mkAtone = (key, source, o) => {
  const t = ATONE_TPL[key];
  return { id: o.id, type: "Remedy", actId: o.actId, astro: o.astro, src: o.src, source, ...t, notes: "Mark each day once you have performed the ritual.", place: "Temple", time: "7:30 am", startDate: dayStart(o.now), completedDays: o.completed || [], proofs: o.proofs || {}, status: o.status || "Pending", done: o.status === "Completed" };
};
const seedRemedies = (now) => [
  mkAtone("one", "Text", { id: "ATN-1", actId: 1, astro: 0, src: "Text Question · Meenakshi Iyer", now }),
  mkAtone("five", "Chat", { id: "ATN-2", actId: 4, astro: 5, src: "Instant Chat · Rahul Menon", now: now - 2 * DAY, completed: [0, 1] }),
  mkAtone("three", "Call", { id: "ATN-3", actId: 3, astro: 3, src: "Instant Call · Karthik Subramanian", now: now - 5 * DAY, completed: [0, 1, 2], proofs: { 0: { name: "day1.jpg", type: "image/jpeg", size: 120000 }, 1: { name: "day2.jpg", type: "image/jpeg", size: 130000 }, 2: { name: "day3.jpg", type: "image/jpeg", size: 110000 } }, status: "Completed" }),
  { id: "ND-11", type: "Note", actId: 11, astro: 0, src: "Appointment · Meenakshi Iyer", title: "We reviewed family timing and agreed to revisit in a month." },
  { id: "RP-11", type: "Report", actId: 11, astro: 0, src: "Appointment · Meenakshi Iyer", title: "Summary of your chart reading from this consultation." },
  mkAtone("three", "Appointment", { id: "ATN-5", actId: 11, astro: 0, src: "Appointment · Meenakshi Iyer", now: now - 3 * DAY, completed: [0, 1, 2], proofs: { 0: { name: "d1.jpg", type: "image/jpeg", size: 90000 }, 1: { name: "d2.jpg", type: "image/jpeg", size: 90000 }, 2: { name: "d3.jpg", type: "image/jpeg", size: 90000 } }, status: "Completed" }),
  { id: "ND-12", type: "Recommendation", actId: 12, astro: 1, src: "Appointment · Arvind Nair", title: "Plan important decisions after the new moon." },
  mkAtone("seven", "Appointment", { id: "ATN-4", actId: 2, astro: 1, src: "Appointment · Arvind Nair", now: now - DAY, completed: [0] }),
];
const SLOT_MINS = [...Array(17)].map((_, i) => 600 + i * 30); // 10:00 - 18:00 IST
const slotTaken = (astro, start) => (astro * 7 + Math.floor(start / 1800000) * 13) % 5 === 0; // sample availability
const critCats = ["Appointment", "Question", "Payment/wallet", "Subscription", "Security", "Account"]; // critical categories (D-15)
const FREES = /^(Cancelled|Astrologer)/;
const REMINDERS = [[3 * DAY, "3 days"], [2 * DAY, "2 days"], [DAY, "1 day"], [3600000, "1 hour"], [900000, "15 minutes"]];

// Ends an Instant Call/Chat: creates the Activity record and the remedy (D-11, D-45).
function finishSess(st, sess, now, how) {
  const id = sess.actId || now;
  const who = ASTRO[sess.astro].name;
  const act = { id, type: sess.kind, astro: sess.astro, who, when: "Just now", title: "Instant " + sess.kind + " · " + sess.mins + " min package", status: "Completed", price: sess.paid, mins: sess.mins, startedAt: sess.startedAt, endedAt: now, msgs: sess.kind === "Chat" ? sess.msgs : null, earlyEnd: how !== "time", astroEarly: how === "astro" };
  const remedy = mkAtone(sess.kind === "Call" ? "three" : "lakshmi", sess.kind, { id: "r-" + id, actId: id, astro: sess.astro, src: "Instant " + sess.kind + " · " + who, now });
  return { act, remedy, sess: { ...sess, status: "ended", endedAt: now, actId: id, how } };
}

// Simulated server: moves questions and disputes forward over time. Real elapsed
// time drives the astrologer's replies; the prototype clock (skew) drives deadlines.
function advance(st) {
  const real = Date.now(), now = real + (st.skew || 0);
  let wallet = st.wallet, txns = st.txns, remedies = st.remedies, msg = null;
  let nl = st.notifLog || [], hold = st.hold, req = st.req, sess = st.sess, lastId = st.lastId, newActs = [];
  if (req && req.status === "Waiting") {
    const el = real - req.sentAt, b = REQ_BEHAVIOR[req.astro] || "accept";
    if (b === "accept" && el >= 4000) req = { ...req, status: "Accepted" };
    else if (b === "decline" && el >= 4000) req = { ...req, status: "Declined" };
    else if (el >= 30000) req = { ...req, status: "Expired" };
  }
  if (sess && sess.status === "live") {
    if (sess.discAt && real - sess.discAt >= 8000) sess = { ...sess, discAt: null, endsAt: sess.endsAt + (real - sess.discAt), reconnected: true };
    if (!sess.discAt && now >= sess.endsAt) {
      const f = finishSess(st, sess, now, "time");
      sess = f.sess; lastId = f.act.id; newActs = [f.act]; remedies = [f.remedy].concat(remedies);
      msg = "Your session ended - the package time is over";
    }
  }
  if (hold && hold.until <= now) { hold = null; msg = "Slot hold expired - the slot was released"; }
  const logOld = st.slotLog || [];
  const gone = st.slots.filter((x) => x.expiresAt <= now);
  const slotLog = gone.length ? logOld.concat(gone.map((x) => ({ ...x, status: "Expired", at: now }))) : logOld;
  const live0 = st.slots.filter((x) => x.expiresAt > now);
  // Expiry reminders 3, 2 and 1 day before a slot expires (D-26); they never change expiry or refunds.
  const grp = {};
  const live = live0.map((sl) => {
    const rem = sl.rem || [];
    const due = [[3 * DAY, 3], [2 * DAY, 2], [DAY, 1]].filter(([ms]) => !rem.includes(ms) && now >= sl.expiresAt - ms && sl.expiresAt - ms >= sl.boughtAt);
    if (!due.length) return sl;
    due.forEach(([ms, d]) => { const k = sl.astro + "|" + sl.campId + "|" + sl.expiresAt + "|" + ms; grp[k] = grp[k] || { n: 0, sl, d }; grp[k].n++; });
    return { ...sl, rem: rem.concat(due.map((x) => x[0])) };
  });
  Object.keys(grp).forEach((k) => {
    const r = grp[k];
        nl = nl.concat([{ id: now + "-sr-" + k, cat: "Question", go: "text", cta: "Use a slot", at: now, text: "Reminder: " + r.n + " " + r.sl.type + " question slot(s) with " + ASTRO[r.sl.astro].name + (r.sl.label ? " (" + r.sl.label + ")" : "") + " expire in " + r.d + " day(s), on " + fmtIST(r.sl.expiresAt) + " (IST). Expired slots are not refunded (D-07)." }]);
  });
  if (live.length !== st.slots.length) msg = (st.slots.length - live.length) + " unused slot(s) expired - no refund (D-07)";
  let subs = st.subs;
  const sInfo = st.subInfo || {};
  const ended = subs.filter((id) => sInfo[id] && sInfo[id].expiresAt <= now);
  if (ended.length) {
    subs = subs.filter((id) => !ended.includes(id));
    nl = nl.concat(ended.map((id) => ({ id: now + "-se-" + id, cat: "Subscription", go: "follow", cta: "Manage subscriptions", at: now, text: "Your subscription to " + ASTRO[id].name + " has ended. Subscriber-only content is locked and you keep following. Renewal rules are not decided yet (P-14-04)." })));
    msg = "A subscription ended - subscriber-only content is locked";
  }
  const acts = st.acts.map((q) => {
    if (q.type === "Appointment" && q.start) {
      let a = q;
      if (a.status === "Upcoming") {
        const sent = a.sent || [];
        const fresh = REMINDERS.filter(([ms]) => !sent.includes("r" + ms) && now >= a.start - ms && a.start - ms >= (a.bookedAt || 0) && now < a.start);
        if (fresh.length) {
          a = { ...a, sent: sent.concat(fresh.map(([ms]) => "r" + ms)) };
          nl = nl.concat(fresh.map(([ms, lb]) => ({ id: now + "-" + ms + "-" + a.id, text: "Reminder: your appointment with " + a.who + " is in " + lb + " (" + fmtDT(a.start) + " IST).", at: now })));
        }
        if (now >= a.start + 5 * 60000) {
          if (ASTRO[a.astro] && !ASTRO[a.astro].online) {
            a = { ...a, status: "Astrologer no-show · refunded" };
            wallet += a.price || 0;
            txns = [{ label: "Refund · astrologer no-show · " + a.who, when: "Just now", amt: a.price || 0, sign: 1 }].concat(txns);
            nl = nl.concat([{ id: now + "-ns-" + a.id, text: "The astrologer did not join. Full refund credited to your Wallet.", at: now }]);
            msg = "Astrologer no-show - full refund to your Wallet (D-41)";
          } else {
            a = { ...a, status: "No-show" };
            msg = "Marked as no-show.";
          }
        }
      } else if (a.status === "In progress") {
        if (a.discAt && real - a.discAt >= 8000) a = { ...a, discAt: null, reconnected: true };
        if (now >= a.start + a.dur * 60000) {
          a = { ...a, status: "Completed" };
          remedies = [
            mkAtone("seven", "Appointment", { id: "r-" + a.id + "-rem", actId: a.id, astro: a.astro, src: "Appointment · " + a.who, now }),
            { id: "r-" + a.id + "-rec", type: "Recommendation", title: "Plan important decisions after the new moon." },
            { id: "r-" + a.id + "-note", type: "Note", title: "We discussed career timing and agreed a follow-up in six weeks." },
            { id: "r-" + a.id + "-rep", type: "Report", title: "Summary of your chart reading from this consultation." },
          ].map((x) => ({ ...x, actId: a.id, astro: a.astro, src: "Appointment · " + a.who })).concat(remedies);
        }
      }
      return a;
    }
    if (q.type !== "Question" || q.cancelled) return q;
    const online = ASTRO[q.astro] && ASTRO[q.astro].online;
    let n = q;
    // Astrologer asked for a correction: the question waits for the user, and the original
    // 30-day deadline keeps running (AD-35). No reply in time: cancelled and refunded to the Wallet.
    if (!n.answeredAt && n.corr && n.corr.active) {
      if (now - n.submittedAt >= 30 * DAY) {
        n = { ...n, cancelled: true };
        wallet += n.paid || 0;
        txns = [{ label: "Refund · correction not answered · " + q.who, when: "Just now", amt: n.paid || 0, sign: 1 }].concat(txns);
        msg = "No reply to the correction request before the original deadline - question cancelled and refunded to your Wallet (AD-35, D-32)";
      }
      return n;
    }
    if (!n.answeredAt) {
      if (online) {
        if (!n.openedAt && real - (n.simStart || 0) >= 10000) n = { ...n, openedAt: now };
        if (n.openedAt && real - (n.simStart || 0) >= 25000) {
          n = { ...n, answeredAt: now, answer: SAMPLE_ANSWER, attachments: [{ name: "chart.jpg" }, { name: "guidance.pdf" }, { name: "notes.txt" }], links: [{ label: "Reading about your planetary periods", url: "https://example.com/periods" }] };
          remedies = [mkAtone("five", "Text", { id: "r-" + q.id + "-a", actId: q.id, astro: q.astro, src: "Text Question · " + q.who, now })].concat(remedies);
          msg = q.who + " answered your question - please rate the answer";
        }
      } else if (now - n.submittedAt >= 30 * DAY) {
        n = { ...n, cancelled: true };
        wallet += n.paid || 0;
        txns = [{ label: "Refund · unanswered question · " + q.who, when: "Just now", amt: n.paid || 0, sign: 1 }].concat(txns);
        msg = "Not answered in 30 days - question cancelled and refunded to your Wallet (D-18)";
      }
    }
    const dp = n.dispute;
    if (dp && !dp.answeredAt && !dp.admin) {
      if (now - dp.raisedAt >= 3 * DAY) { n = { ...n, dispute: { ...dp, admin: true } }; msg = "Dispute not answered in 3 days - moved to Admin Review (D-19)"; }
      else if (online && real - dp.simStart >= 20000) {
        n = { ...n, dispute: { ...dp, answeredAt: now, answer: SAMPLE_DISPUTE } };
        remedies = [mkAtone("one", "Text", { id: "r-" + q.id + "-d", actId: q.id, astro: q.astro, src: "Dispute answer · " + q.who, now })].concat(remedies);
        msg = "Dispute answered by " + q.who;
      }
    }
    return n;
  });
  const changed = msg || slotLog !== logOld || subs !== st.subs || live.some((x, i) => x !== st.slots[i]) || req !== st.req || sess !== st.sess || nl !== (st.notifLog || []) || hold !== st.hold || acts.some((a, i) => a !== st.acts[i]);
  if (!changed) return null;
  return { patch: { subs, slotLog, slots: live, acts: newActs.concat(acts), wallet, txns, remedies, hold, notifLog: nl, req, sess, lastId }, msg };
}

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const pathOf = (screen) => (screen === "home" ? "/" : "/" + screen);

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const st = pathname === "/" ? "home" : pathname.split("/")[1];

  const [state, setRaw] = useState(() => loadState({slotLog:[],slotFilter:'Total',txStep:'pick',rmSrc:'All Sources',rmStat:'All',rdFile:'',consentChk:false,focusId:null,follows:[0,6,7,8,9],subInfo:{0:{tier:'Silver',startedAt:Date.now()-10*86400000,expiresAt:Date.now()+20*86400000,autoRenew:false}},lives:[],liveIn:{},liveCm:{},liveDraft:'',postLike:{},postCm:{},cmDraft:{},subTier:'Gold',autoRen:false,revSt:{},pendBio:{},apprBio:{},tqSusp:{},campOv:{},payMode:'wallet',upi:'',payM:'UPI',wdAmt:'',req:null,sess:null,pkgMins:5,skew:0,dnd:{},hold:null,apptDur:30,apptDay:1,apptSlot:null,apptWeek:0,reschedId:null,reschedFree:false,notifLog:[],astro:0,campBase:Date.now(),askType:'General',qFiles:[],useSaved:false,preview:false,q:'',cat:'All',online:false,subs:[0],slots:[],qty:1,wallet:500,txns:[{label:'Money added',when:'Last week',amt:500,sign:1}],actTab:'All',acts:ACTS0,disputed:{},reviewed:{},toggles:{push:true,inapp:true},modal:false,amt:500,toast:'',notifOpen:false,theme:T0,draft:'',day:0,time:0,kind:'Call',phase:'idle',msgs:[],chatDraft:'',lastId:0,bps:[{name:'Self',dob:'01 Jan 1990',tob:'06:30 AM',pob:'Chennai'},{name:'Family member',dob:'12 Aug 1962',tob:'09:10 PM',pob:'Madurai'}],bp:0,files:[],remedies:seedRemedies(Date.now()),faq:-1,loginStep:1,dlg:null,rate:0,note:'',ansId:1,prof:{email:'',gender:'',dob:'',city:'',lang:'English',hideName:false,kundliOnly:true},pname:'Priya Sharma',empty:false}));
  const ref = useRef(state);
  const timer = useRef(null);
  const payRef = useRef(null);

  // Same merge semantics as the original DCLogic.setState.
  const setState = (s) => {
    const patch = typeof s === "function" ? s(ref.current) : s;
    ref.current = { ...ref.current, ...patch };
    saveState(ref.current);
    setRaw(ref.current);
  };
  const showToast = (m) => {
    setState({ toast: m });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState({ toast: "" }), 2600);
  };
  const navTo = (screen, patch) => {
    setState(patch || {});
    navigate(pathOf(screen));
  };
  const go = (screen, extra) => () => {
    setState({ notifOpen: false, profMenu: false, dlg: null, ...(screen !== "appt" ? { reschedId: null } : {}), ...(extra || {}) });
    navigate(pathOf(screen));
  };

  // Simulated backend tick: slot expiry (D-07), answers, disputes, 30-day refunds (D-18, D-19).
  const runAdvance = () => {
    const r = advance(ref.current);
    if (!r) return;
    setState(r.patch);
    if (r.msg) showToast(r.msg);
  };
  useEffect(() => {
    runAdvance();
    const t = setInterval(runAdvance, 3000);
    return () => clearInterval(t);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  const renderVals = () => {
const s=state,cur=ASTRO[s.astro];
const isSub=i=>s.subs.indexOf(i)>=0;
const vis=a=>!s.dnd[a.id];
const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
const revsOf=id=>REVIEWS.filter(r=>r.astro===id).map(r=>({key:'r'+r.id,n:r.stars,text:r.text,src:r.source,status:s.revSt['r'+r.id]||r.status||'Published',mine:false}))
.concat(s.acts.filter(x=>x.astro===id&&x.rating).map(x=>({key:'a'+x.id,n:x.rating,text:x.review||'No written feedback',src:x.type==='Question'?'Text Question':x.type,status:s.revSt['a'+x.id]||'Published',mine:true})));
const ratingOf=id=>{const p=revsOf(id).filter(r=>r.status==='Published');return p.length?{avg:(p.reduce((a,r)=>a+r.n,0)/p.length).toFixed(1),n:p.length}:null;};
const ratingText=id=>{const r=ratingOf(id);return r?'★ '+r.avg+' ('+r.n+' review'+(r.n>1?'s':'')+')':'No reviews yet';};
// One payment path for every purchase: Wallet balance or direct UPI/bank payment (D-33).
const charge=(amt,label,apply,done,low)=>{
if(s.payMode==='direct'){payRef.current={amt,label,apply,done};setState({dlg:{k:'pay',amt,label},note:'',upi:'',payM:'UPI'});return false;}
if(s.wallet<amt){setState({modal:true,amt:Math.max(100,Math.ceil((amt-s.wallet)/100)*100)});showToast(low||'Add money to continue');return false;}
const c=ref.current,patch=apply(c);if(!patch){showToast('This purchase is no longer available');return false;}
setState({...patch,wallet:c.wallet-amt,txns:[{label,when:'Just now',amt,sign:-1}].concat(c.txns)});if(done)showToast(done);return true;};
const dndBlock=()=>{if(s.dnd[cur.id]){showToast(cur.name+' is unavailable (Do Not Disturb)');return true;}return false;};
const av=(i,z)=>'width:'+z+'px;height:'+z+'px;border-radius:99px;flex:none;display:flex;align-items:center;justify-content:center;font:700 '+Math.round(z*0.42)+'px var(--font-head);color:#fff;background-image:linear-gradient(135deg,'+GR[i%GR.length]+')';
const ini=a=>a.name.split(' ').map(w=>w[0]).slice(0,2).join('');
const card=a=>({...a,ratingText:ratingText(a.id),ini:ini(a),av:av(a.id,52),sub:isSub(a.id),open:()=>navTo('astro',{astro:a.id,notifOpen:false})});
const chipSt=t=>t==='Answered'||t==='Completed'||t==='Review submitted'?'background:rgba(var(--gn),.15);color:var(--green)':t==='Dispute raised'?'background:rgba(195,169,255,.2);color:var(--em)':'background:rgba(var(--gd),.16);color:var(--gold)';
const top={Home:'home',Explore:'explore',astro:'explore',Services:'services',text:'services',Activity:'activity',Profile:'profile',wallet:'profile'};
const keyOf={home:'Home',explore:'Explore',astro:'Explore',services:'Services',text:'Services',appt:'Services',session:'Services',activity:'Activity',profile:'Profile',wallet:'Profile',kundli:'Profile',follow:'Profile',notifs:'Profile',remedy:'Profile',help:'Profile',answer:'Activity',edit:'Profile'};
const nav=['Home','Explore','Services','Activity','Profile'].map(l=>{const on=keyOf[st]===l;return{label:l,d:ICON[l],cls:'nv'+(on?' on':''),mcls:'mt'+(on?' on':''),go:go(l.toLowerCase())};});
const svc=(n,b,go,pend,pid)=>({name:n,blurb:b,go,pend,pid});
const soon=()=>showToast('This flow is designed in the next pass');
const services=[svc('Text Question','Ask an astrologer a written question and receive an answer.',go('text',{txStep:'pick'}),false,''),svc('Appointment','Book a scheduled voice consultation.',go('appt'),false,''),svc('Instant Call','Talk to an astrologer now.',go('session',{kind:'Call',phase:'idle'}),false,''),svc('Instant Chat','Chat with an astrologer now.',go('session',{kind:'Chat',phase:'idle'}),false,'')];
const list=ASTRO.filter(a=>vis(a)&&(s.cat==='All'||a.cats.indexOf(s.cat)>=0)&&(!s.online||a.online)&&(!s.q||(a.name+a.spec+a.langs).toLowerCase().indexOf(s.q.toLowerCase())>=0)).map(card);
const openDlg=(k,e)=>()=>setState({dlg:{k,...(e||{})},rate:0,note:''});
const nowT=Date.now()+(s.skew||0);
const liveSlots=s.slots.filter(x=>x.expiresAt>nowT);
const slotsOf=(i,t)=>liveSlots.filter(x=>x.astro===i&&(!t||x.type===t||x.benefit)).length;
const slotsN=slotsOf(s.astro,s.askType);
const tabType={Questions:'Question',Appointments:'Appointment',Calls:'Call',Chats:'Chat'};
const dayLeft=x=>x.answeredAt?Math.max(0,7-Math.floor((nowT-x.answeredAt)/DAY)):0;
const actList=s.acts.filter(x=>s.actTab==='All'||x.type===tabType[s.actTab]).map(x=>{const isQ=x.type==='Question',rv=!!s.reviewed[x.id];const status=isQ?(x.dispute?dispLabel(x.dispute):qStatus(x)):x.status;
const isA=x.type==='Appointment'&&!!x.start,leftMs=isA?x.start-nowT:0;
const patchAct=u=>setState({acts:s.acts.map(a=>a.id===x.id?{...a,...u}:a)});
const startResched=(free)=>()=>{setState({reschedId:x.id,reschedFree:!!free,astro:x.astro,apptSlot:null,apptDay:Math.max(0,Math.floor((x.start-dayStart(nowT))/DAY)),apptWeek:0,dlg:null});navigate('/appt');};
return{...x,focus:s.focusId===x.id,corrActive:isQ&&!x.answeredAt&&!x.cancelled&&!!(x.corr&&x.corr.active),corrDue:fmtIST((x.submittedAt||nowT)+30*DAY),corrReplace:openDlg('correct',{id:x.id}),when:isA?fmtDT(x.start)+' IST · '+x.dur+' min':x.when,apptInfo:isA?'Voice consultation · '+x.dur+' min · booked price ₹'+x.price+' · you can join from 5 minutes before the start, with a 5-minute grace period after it (D-42)':'',
canJoin:isA&&x.status==='Upcoming'&&leftMs<=5*60000&&leftMs>-5*60000,join:()=>{patchAct({status:'In progress',joinedAt:nowT});showToast('Joined the consultation');},
inProg:isA&&x.status==='In progress',discNow:!!x.discAt,disc:()=>patchAct({discAt:Date.now()}),
astroCx:isA&&x.status==='Astrologer cancelled',cxRefund:()=>{patchAct({status:'Cancelled by astrologer · refunded'});setState({wallet:s.wallet+(x.price||0),txns:[{label:'Refund · astrologer cancelled · '+x.who,when:'Just now',amt:x.price||0,sign:1}].concat(s.txns),acts:s.acts.map(a=>a.id===x.id?{...a,status:'Cancelled by astrologer · refunded'}:a)});showToast('Full refund credited to your Wallet (D-41)');},cxResched:startResched(true),
canResched:isA&&x.status==='Upcoming',canDispute:isQ&&!!x.answeredAt&&!x.dispute&&dayLeft(x)>0,dispute:openDlg('dispute',{id:x.id}),canView:isQ,viewLabel:isQ&&x.answeredAt?'View answer':'View question',view:()=>navTo('answer',{ansId:x.id}),dLeft:dayLeft(x),needRate:((isQ&&!!x.answeredAt)||(!isQ&&['Call','Chat','Appointment'].includes(x.type)&&x.status==='Completed'))&&!x.rating,rateLabel:isQ?'Rate this answer (required)':'Rate this consultation (required)',canChatLog:x.type==='Chat',chatLog:openDlg('chatlog',{id:x.id}),rate:openDlg('qrate',{id:x.id}),resched:openDlg('resched',{id:x.id}),canReview:false,reviewed:rv,review:openDlg('review',{id:x.id})};});

const DAYS=['Thu 19 Nov','Fri 20 Nov','Sat 21 Nov','Sun 22 Nov','Mon 23 Nov'],TIMES=['10:00 AM','11:30 AM','2:00 PM','4:30 PM','6:00 PM','7:30 PM'];
const isCall=s.kind==='Call';
const sess=(patch)=>setState(patch);
const addAct=(type,title,status,when)=>{const id=Date.now();setState({acts:[{id,type,who:cur.name,when,title,status}].concat(ref.current.acts),lastId:id});return id;};
const bp=s.bps[s.bp];
const setBp=k=>e=>{const b=s.bps.slice();b[s.bp]={...b[s.bp],[k]:e.target.value};setState({bps:b});};
const faqs=[['Can I dispute an answer?','Only Text Questions can be disputed, within 7 days after you receive the answer, to request an additional answer (D-08). Appointments, Instant Calls and Instant Chats have no dispute option (D-09).'],['When do question slots expire?','A purchased slot must be used within 7 days of purchase. Holding it does not extend this, and expired slots are not refunded (D-06, D-07).'],['Which notifications can I turn off?','Critical alerts — appointment, question, payment/wallet, subscription, security and account — are always on (D-15). Push and in-app are the confirmed channels (D-16).'],['Can I review a consultation?','Yes. You can submit a review after an Appointment, Instant Call or Instant Chat (D-10).']];
const NT0=[['Question','Your question to Meenakshi Iyer was answered.','2 days ago','answer','View answer'],['Question','A held question slot expires in 2 days.','Today','text','Use a slot'],['Payment/wallet','₹500 was added to your wallet.','Last week','wallet','Open wallet'],['Subscription','Your subscription to Meenakshi Iyer is active.','Last week','follow','Manage subscriptions'],['Security','New login to your account.','Last week','profile','Open profile'],['Appointment','Appointment with Arvind Nair is on Saturday.','Yesterday','activity','Open Activity']];
const NT=(s.notifLog||[]).slice().reverse().map(n=>[n.cat||'Appointment',n.text,fmtDT(n.at)+' IST',n.go||'activity',n.cta||'Open Activity']).concat(NT0);
const NL=NT.map((n,i)=>({cat:n[0],text:n[1],crit:critCats.includes(n[0]),open:openDlg('notif',{i})}));
const dn=s.dlg&&s.dlg.k==='notif'?NT[s.dlg.i]:NT[0];
const ansItem=s.acts.find(x=>x.id===s.ansId)||s.acts[0]||{who:'',when:'',title:'',status:'New'};
const ansDone=!!ansItem.answeredAt,ansDsp=!!ansItem.dispute,ansCancelled=!!ansItem.cancelled;
const ansLeft=dayLeft(ansItem),dpo=ansItem.dispute||null,cmpt=ansItem.complaint||null;
const ansStatus=ansDsp?dispLabel(dpo):qStatus(ansItem);
const complaintLeft=dpo&&dpo.answeredAt?Math.max(0,7-Math.floor((nowT-dpo.answeredAt)/DAY)):0;
const dk=s.dlg?s.dlg.k:'';
const confirmDirect=()=>{const pr=payRef.current;if(!pr){setState({dlg:null});return;}
if(s.payM==='UPI'&&!/^[\w.\-]{2,}@[A-Za-z]{2,}$/.test((s.upi||'').trim())){showToast('Enter a valid UPI ID, for example name@bank');return;}
const c=ref.current,patch=pr.apply(c);if(!patch){payRef.current=null;setState({dlg:null});showToast('This purchase is no longer available - you were not charged');return;}
payRef.current=null;setState({...patch,dlg:null,txns:[{label:pr.label+' · paid directly ('+(s.payM==='UPI'?'UPI':'bank/card')+')',when:'Just now',amt:pr.amt,sign:0}].concat(c.txns)});if(pr.done)showToast(pr.done);};
const rtItem=dk==='qrate'?s.acts.find(x=>x.id===s.dlg.id):null;
const rateIsQ=!rtItem||rtItem.type==='Question';
const clItem=dk==='chatlog'?s.acts.find(x=>x.id===s.dlg.id):null;
const clLeftH=clItem&&clItem.endedAt?24-(nowT-clItem.endedAt)/3600000:0;
const cl=clItem&&clItem.msgs&&clLeftH>0?{open:true,hours:Math.max(1,Math.ceil(clLeftH)),msgs:clItem.msgs.map(m=>({t:m.t,st:'max-width:80%;padding:10px 14px;border-radius:16px;line-height:1.35;'+(m.me?'align-self:flex-end;background:#5a3cc0':'align-self:flex-start;background:rgba(var(--gl),.15)')}))}:{open:false,hours:0,msgs:[]};
const rsItem=dk==='resched'?s.acts.find(x=>x.id===s.dlg.id):null;
const rsHours=rsItem?(rsItem.start-nowT)/3600000:0;
const rs=rsItem?{title:rsItem.title+' · '+rsItem.who,when:fmtDT(rsItem.start)+' IST · '+rsItem.dur+' min',price:rsItem.price,early:rsHours>=12,hours:Math.max(0,Math.floor(rsHours)),canR:(rsItem.reschedCount||0)<1,
cancel:()=>{setState({wallet:s.wallet+(rsItem.price||0),txns:[{label:'Refund · appointment cancelled · '+rsItem.who,when:'Just now',amt:rsItem.price||0,sign:1}].concat(s.txns),dlg:null,acts:s.acts.map(a=>a.id===rsItem.id?{...a,status:'Cancelled · refunded'}:a),notifLog:(s.notifLog||[]).concat([{id:nowT+'-c',text:'Appointment with '+rsItem.who+' cancelled. ₹'+rsItem.price+' refunded to your Wallet.',at:nowT}])});showToast('Cancelled - full refund credited to your Wallet');},
resched:()=>{setState({reschedId:rsItem.id,reschedFree:false,astro:rsItem.astro,apptSlot:null,apptDay:Math.max(0,Math.floor((rsItem.start-dayStart(nowT))/DAY)),apptWeek:0,dlg:null});navigate('/appt');}}:{title:'',when:'',price:0,early:false,hours:0,canR:false,cancel:()=>{},resched:()=>{}};
const heldMap={};liveSlots.forEach(x=>{heldMap[x.astro]=(heldMap[x.astro]||0)+1;});
const heldKeys=Object.keys(heldMap);
const campsAll=CAMPS.map(c=>({...c,...(s.campOv[c.id]||{})}));
const campExp=c=>c.daysLeft==null?null:s.campBase+(c.daysLeft+(c.extra||0))*DAY;
const campActive=c=>(c.status||'active')==='active';
const buy=(c,k)=>()=>{if(dndBlock())return;if(s.tqSusp[cur.id]){showToast('Text Questions are suspended for '+cur.name+': new slots cannot be bought (D-39)');return;}if(!campActive(c)){showToast('This campaign is no longer available');return;}const p=c[k],fin=Math.round(p.price*(100-p.disc)/100),tot=fin*s.qty,ce=campExp(c);
if(ce!=null&&ce<=nowT){showToast('This campaign has expired');return;}
const type=k==='general'?'General':'Personal',exp=Math.min(nowT+7*DAY,ce==null?Infinity:ce),qn=s.qty,ast=s.astro;
const mk=c0=>{const add=[];for(let n=0;n<qn;n++)add.push({id:nowT+'-'+n,astro:ast,type,campId:c.id,label:c.name,boughtAt:nowT,expiresAt:exp,price:fin});return{slots:c0.slots.concat(add),askType:type};};
charge(tot,qn+' '+type+' question slot(s) · '+cur.name,mk,qn+' slot(s) added · expire '+fmtIST(exp)+' (IST)');};
const amts=[100,250,500,1000].map(v=>({v,cls:'chip'+(s.amt===v?' on':''),go:()=>setState({amt:v})}));
const tgl=(k,label,note)=>({label,note,on:s.toggles[k]?'true':'false',just:s.toggles[k]?'justify-content:flex-end':'justify-content:flex-start',go:()=>setState({toggles:{...s.toggles,[k]:!s.toggles[k]}})});

const ss=(()=>{
const sx=s.sess,rq=s.req,kk=sx?sx.kind:(rq?rq.kind:s.kind),isC=kk==='Call',PK=PKGS[kk];
const live=!!sx&&sx.status==='live',ended=!!sx&&sx.status==='ended';
const pkg=PK.find(p=>p.mins===s.pkgMins)||PK[0];
const availOk=cur.online&&vis(cur);
const reqEl=rq?Math.floor((Date.now()-rq.sentAt)/1000):0;
const sendReq=()=>{if(dndBlock())return;if(!availOk){showToast('Choose an available astrologer');return;}
const busy=(REQ_BEHAVIOR[cur.id]||'')==='busy';setState({req:{astro:cur.id,kind:kk,mins:pkg.mins,price:pkg.price,sentAt:Date.now(),status:busy?'Busy':'Waiting'}});showToast(busy?cur.name+' is busy right now':'Request sent - waiting for '+cur.name+' (30 seconds)');};
const remMs=live?Math.max(0,sx.endsAt-(sx.discAt?sx.discNow:nowT)):0;
const rm=Math.floor(remMs/60000),rsec=Math.floor(remMs/1000)%60;
const act=ended?s.acts.find(x=>x.id===sx.actId):null;
const msgsView=live&&sx.msgs?sx.msgs.map(m=>({t:m.t,st:'max-width:80%;padding:10px 14px;border-radius:16px;line-height:1.35;'+(m.me?'align-self:flex-end;background:#5a3cc0':'align-self:flex-start;background:rgba(var(--gl),.15)')})):[];
const reqName=rq?ASTRO[rq.astro].name:'';
return{
sesTitle:'Instant '+kk,isCall:isC,isChat:!isC,
sesIdle:!sx&&!rq,sesWait:!sx&&!!rq&&rq.status==='Waiting',sesAccepted:!sx&&!!rq&&rq.status==='Accepted',sesFailed:!sx&&!!rq&&['Declined','Busy','Expired'].includes(rq.status),sesLive:live,sesEnd:ended,
reqName,reqLeft:Math.max(0,30-reqEl),reqStatus:rq?rq.status:'',reqPkg:rq?rq.mins+' min · ₹'+rq.price:'',
reqMsg:rq?({Declined:reqName+' declined your request.',Busy:reqName+' is busy: another request or consultation is active.',Expired:reqName+' did not respond within 30 seconds, so the request expired.'}[rq.status]||''):'',
availList:ASTRO.filter(a=>a.online&&vis(a)).map(a=>({name:a.name,cls:'chip'+(s.astro===a.id?' on':''),go:()=>setState({astro:a.id})})),curAvail:availOk,
pkgList:PK.map(p=>({label:p.mins+' min · ₹'+p.price,cls:'chip'+(pkg.mins===p.mins?' on':''),go:()=>setState({pkgMins:p.mins})})),pkgLabel:pkg.mins+' min · ₹'+pkg.price,
pidSub:(isC?'P-08-06':'P-09-06'),
sendReq,cancelReq:()=>{setState({req:null});showToast('Request cancelled');},tryAgain:()=>{setState({astro:rq.astro});sendReq();},tryOther:()=>setState({req:null}),
tickNow:runAdvance,
payStart:()=>{if(!rq||rq.status!=='Accepted')return;const r0=rq;charge(r0.price,'Instant '+r0.kind+' · '+r0.mins+' min · '+reqName,c=>(c.req&&c.req.status==='Accepted')?{req:null,
sess:{kind:r0.kind,astro:r0.astro,mins:r0.mins,paid:r0.price,startedAt:nowT,endsAt:nowT+r0.mins*60000,status:'live',msgs:r0.kind==='Chat'?[{me:false,t:'Namaste! How can I help you today?',at:nowT}]:[]}}:null,'Package paid - your session has started','Add money to pay for the package');},
remText:rm+':'+String(rsec).padStart(2,'0'),discNow:live&&!!sx.discAt,reconn:live&&!!sx.reconnected,
extOffer:live&&!sx.discAt&&remMs>0&&remMs<=60000,
extend:()=>{const pk=pkg,k0=kk;charge(pk.price,'Extension · Instant '+k0+' · '+pk.mins+' min',c=>(c.sess&&c.sess.status==='live')?{sess:{...c.sess,endsAt:c.sess.endsAt+pk.mins*60000,mins:c.sess.mins+pk.mins,paid:c.sess.paid+pk.price}}:null,'Session extended by '+pk.mins+' minutes','Add money to extend');},
endNow:how=>()=>{const f=finishSess(s,sx,nowT,how);setState({sess:f.sess,lastId:f.act.id,acts:[f.act].concat(s.acts),remedies:[f.remedy].concat(s.remedies)});showToast(how==='astro'?'Simulated: the astrologer ended the session early':'Session ended early - no refund for early termination (D-45)');},
disc:()=>setState({sess:{...sx,discAt:Date.now(),discNow:nowT}}),addMin:()=>setState({skew:(s.skew||0)+60000}),
msgs:msgsView,chatDraft:s.chatDraft,onChat:e=>setState({chatDraft:e.target.value}),
sendChat:()=>{const t=(s.chatDraft||'').trim();if(!t||!live)return;setState({sess:{...sx,msgs:sx.msgs.concat([{me:true,t,at:nowT}])},chatDraft:''});
setTimeout(()=>{const c=ref.current.sess;if(c&&c.status==='live')setState({sess:{...c,msgs:c.msgs.concat([{me:false,t:'Thank you. I will be glad to help further.',at:Date.now()+(ref.current.skew||0)}])}});},1000);},
endSummary:ended?(sx.how==='time'?'The package time ended.':sx.how==='astro'?'The astrologer ended the session early.':'You ended the session early. There is no refund for early termination (D-45).'):'',
endPaid:ended?'Paid ₹'+sx.paid+' · '+sx.mins+' min':'',astroEarly:ended&&sx.how==='astro',complained:!!(act&&act.complaint),
sesNeedRate:!!act&&!act.rating,rateSes:openDlg('qrate',{id:ended?sx.actId:0}),complainSes:openDlg('scomplaint',{id:ended?sx.actId:0}),
startAnother:()=>setState({sess:null,req:null})};})();
const campNote=(id,cat,go,cta,text)=>({id:nowT+'-'+id+'-'+Math.random().toString(36).slice(2,6),cat,go,cta,text,at:nowT});
const campChange=(c,kind)=>()=>{const ov=s.campOv,cur0=ov[c.id]||{};const mine=s.slots.filter(x=>x.campId===c.id&&x.expiresAt>nowT);
const st0=c.status||'active';
if(kind==='cancel'||kind==='delete'){if(st0!=='active'){showToast('This campaign is already '+st0);return;}}
if(kind==='cancel'){const amt=mine.reduce((a,x)=>a+(x.price||0),0);
setState({campOv:{...ov,[c.id]:{...cur0,status:'cancelled'}},slots:s.slots.filter(x=>!mine.includes(x)),slotLog:(s.slotLog||[]).concat(mine.map(x=>({...x,status:'Refunded',at:nowT}))),wallet:s.wallet+amt,
txns:amt>0?[{label:'Refund · campaign cancelled · '+c.name+' ('+mine.length+' slot(s))',when:'Just now',amt,sign:1}].concat(s.txns):s.txns,
notifLog:(s.notifLog||[]).concat([campNote('cx','Payment/wallet','wallet','Open wallet','The campaign "'+c.name+'" was cancelled. '+(amt>0?'₹'+amt+' was refunded to your Wallet for '+mine.length+' unused slot(s). ':'You had no unused slots. ')+'Questions you already submitted will still be answered.')])});
showToast(amt>0?'Campaign cancelled - ₹'+amt+' refunded to your Wallet (D-21)':'Campaign cancelled');return;}
if(kind==='delete'){const first=mine.length?Math.min(...mine.map(x=>x.expiresAt)):null;
setState({campOv:{...ov,[c.id]:{...cur0,status:'deleted'}},notifLog:(s.notifLog||[]).concat([campNote('del','Question','text','Use a slot','The campaign "'+c.name+'" was deleted. No refund is issued for the deletion. '+(mine.length?'Your '+mine.length+' unused slot(s) stay usable until their original deadline'+(first?' ('+fmtIST(first)+' IST at the earliest)':'')+'. ':'')+'Submitted questions are unaffected.')])});
showToast('Campaign deleted - your unused slots keep their original deadline (D-21)');return;}
if(kind==='reduce'){setState({campOv:{...ov,[c.id]:{...cur0,reduced:true}},notifLog:(s.notifLog||[]).concat([campNote('red','Question','text','Open Text Question','The astrologer reduced the number of slots offered in "'+c.name+'". Slots you already bought and questions you submitted are not affected.')])});showToast('Slot reduction does not cancel purchased slots or submitted questions (D-21)');return;}
if(kind==='extend'){const nc={...c,extra:(c.extra||0)+7},ne=campExp(nc);
setState({campOv:{...ov,[c.id]:{...cur0,extra:nc.extra}},slots:s.slots.map(x=>x.campId===c.id&&x.expiresAt>nowT&&ne!=null?{...x,expiresAt:Math.max(x.expiresAt,Math.min(x.boughtAt+7*DAY,ne))}:x),notifLog:(s.notifLog||[]).concat([campNote('ext','Question','text','Use a slot','The campaign "'+c.name+'" was extended by 7 days. The extension also applies to your unused slots, up to 7 days from purchase.')])});showToast('Campaign extended - unused slots can last longer, up to 7 days from purchase (D-21)');return;}
if(kind==='reactivate'){if(st0==='active'){showToast('Already active');return;}setState({campOv:{...ov,[c.id]:{...cur0,status:'active'}}});showToast('Campaign active again. Slots that already expired are not restored (D-21)');}};
const campCtl=campsAll.filter(c=>c.id!=='open').map(c=>({name:c.name,statusText:({active:'Active',cancelled:'Cancelled',deleted:'Deleted'})[c.status||'active']+(c.reduced?' · fewer slots offered':'')+(c.extra?' · +'+c.extra+' days':''),isActive:campActive(c),cancel:campChange(c,'cancel'),del:campChange(c,'delete'),reduce:campChange(c,'reduce'),extend:campChange(c,'extend'),reactivate:campChange(c,'reactivate')}));
const mySlots=s.slots.filter(x=>x.expiresAt>nowT).slice().sort((a,b)=>a.expiresAt-b.expiresAt).map(x=>({benefit:!!x.benefit,text:x.type+' · '+(ASTRO[x.astro]?ASTRO[x.astro].name:'')+(x.label?' · '+x.label:''),exp:'expires '+fmtIST(x.expiresAt)+' (IST) · '+Math.max(0,Math.ceil((x.expiresAt-nowT)/DAY))+' day(s) left'}));
const tierOf=id=>(isSub(id)&&s.subInfo[id])?s.subInfo[id].tier:null;
const isFol=i=>s.follows.includes(i);
const expiredSub=id=>!isSub(id)&&!!s.subInfo[id];
const openSub=(id)=>()=>{if(isSub(id)){showToast('Already subscribed. Renewal and upgrade rules are on hold (P-14-04)');return;}setState({astro:id,dlg:{k:'subscribe'},note:'',subTier:'Gold',autoRen:false});};
const subscribeTier=()=>{const t=TIERS.find(x=>x.name===s.subTier)||TIERS[1],id=s.astro,nm=ASTRO[id].name;
if(isSub(id)){showToast('Already subscribed');return;}
charge(t.price,t.name+' subscription · '+nm,c=>{const bens=[];for(let n=0;n<t.benefit;n++)bens.push({id:nowT+'-b'+n,astro:id,type:'Benefit',benefit:true,label:'Subscription benefit ('+t.name+')',boughtAt:nowT,expiresAt:nowT+7*DAY,price:0});
return{dlg:null,subs:c.subs.includes(id)?c.subs:c.subs.concat(id),follows:c.follows.includes(id)?c.follows:c.follows.concat(id),subInfo:{...c.subInfo,[id]:{tier:t.name,startedAt:nowT,expiresAt:nowT+TIER_DAYS*DAY,autoRenew:s.autoRen}},slots:c.slots.concat(bens),
notifLog:(c.notifLog||[]).concat([{id:nowT+'-sub',cat:'Subscription',go:'follow',cta:'Manage subscriptions',at:nowT,text:'You subscribed to '+nm+' ('+t.name+'). You now follow them too, and you received '+t.benefit+' benefit question(s) valid for 7 days.'}])};},
'Subscribed to '+nm+' - you now follow them too and got '+t.benefit+' benefit question(s)');};
const eligAud=aud=>aud==='Public'||(aud==='Followers'&&isFol(cur.id))||(aud==='Subscribers'&&isSub(cur.id))||(aud==='Gold & Platinum'&&['Gold','Platinum'].indexOf(tierOf(cur.id))>=0);
const lockWhy=p=>{const tr=tierOf(p.astro);if(p.kind==='General'||(tr&&p.tiers.includes(tr)))return '';return expiredSub(p.astro)?'Your subscription has ended, so subscriber-only content is locked (D-50).':!tr?'Subscribers only ('+p.tiers.join(', ')+'). Subscribe to read.':'Available to '+p.tiers.join(' and ')+' subscribers.';};
const fp=(()=>{
const tr=tierOf(cur.id),inf=s.subInfo[cur.id];
const lives=s.lives.filter(l=>l.astro===cur.id).map(l=>{const el=eligAud(l.audience),jn=!!s.liveIn[l.id];return{title:l.title,aud:'Audience: '+l.audience,eligible:el,joined:jn&&el,comments:(s.liveCm[l.id]||[]),
join:()=>setState({liveIn:{...s.liveIn,[l.id]:true}}),leave:()=>setState({liveIn:{...s.liveIn,[l.id]:false}}),
send:()=>{const t=(s.liveDraft||'').trim();if(!t)return;setState({liveCm:{...s.liveCm,[l.id]:(s.liveCm[l.id]||[]).concat([t])},liveDraft:''});},end:()=>setState({lives:s.lives.filter(x=>x.id!==l.id)})};});
const posts=POSTS.filter(p=>p.astro===cur.id).map(p=>{const why=lockWhy(p),locked=!!why;return{title:p.title,kind:p.kind==='General'?'General post':'Subscriber post',locked,why,text:locked?'':p.text,general:p.kind==='General',
liked:!!s.postLike[p.id],likes:(s.postLike[p.id]?1:0)+3,like:()=>setState({postLike:{...s.postLike,[p.id]:!s.postLike[p.id]}}),
comments:(s.postCm[p.id]||[]),draft:s.cmDraft[p.id]||'',onDraft:e=>setState({cmDraft:{...s.cmDraft,[p.id]:e.target.value}}),
comment:()=>{const t=(s.cmDraft[p.id]||'').trim();if(!t)return;setState({postCm:{...s.postCm,[p.id]:(s.postCm[p.id]||[]).concat([t])},cmDraft:{...s.cmDraft,[p.id]:''}});}};});
const goLive=aud=>()=>{if(dndBlock())return;const id=nowT;const el=eligAud(aud);
setState({lives:s.lives.filter(l=>l.astro!==cur.id).concat([{id,astro:cur.id,title:'Live Q&A with '+cur.name,audience:aud}]),
notifLog:el?(s.notifLog||[]).concat([{id:id+'-lv',cat:'Live',go:'astro',cta:'Open profile',at:nowT,text:cur.name+' is live now (free). Open the profile to join.'}]):(s.notifLog||[])});
showToast(el?'Live started: you are in the audience, so you got a Live notification (D-50)':'Live started for '+aud+'. You are not in that audience, so you got no notification and cannot comment (D-50)');};
return{fp:{followLabel:isFol(cur.id)?'Following ✓':'Follow',followCls:isFol(cur.id)?'btn-g':'btn-p',
toggleFollow:()=>{if(isFol(cur.id)){setState({follows:s.follows.filter(x=>x!==cur.id)});showToast('Unfollowed');}else{setState({follows:s.follows.concat(cur.id)});showToast('Following '+cur.name+' (free). Following never subscribes you automatically (D-36)');}},
subStatus:tr?'Subscribed · '+tr+' · until '+fmtIST(inf.expiresAt)+' (IST)':expiredSub(cur.id)?'Subscription ended':'Not subscribed',isSubd:isSub(cur.id),
openSub:openSub(cur.id),lives,hasLive:lives.length>0,posts,liveDraft:s.liveDraft,onLiveDraft:e=>setState({liveDraft:e.target.value}),
goLiveBtns:['Public','Followers','Subscribers','Gold & Platinum'].map(a=>({label:'Go live: '+a,go:goLive(a)}))}};})();
const subVals={subTiers:TIERS.map(t=>({label:t.name+' · ₹'+t.price+' · '+t.benefit+' benefit question'+(t.benefit>1?'s':''),cls:'chip'+(s.subTier===t.name?' on':''),go:()=>setState({subTier:t.name})})),
subPrice:(TIERS.find(x=>x.name===s.subTier)||TIERS[1]).price,subTierName:s.subTier,autoRen:s.autoRen,toggleAutoRen:()=>setState({autoRen:!s.autoRen}),confirmSubscribe:subscribeTier,dSubscribe:dk==='subscribe',subDlgName:cur.name,
followList:ASTRO.filter(a=>isFol(a.id)&&vis(a)).map(a=>({...card(a),tierText:tierOf(a.id)||'',unfollow:()=>{setState({follows:s.follows.filter(x=>x!==a.id)});showToast('Unfollowed');}})),noFollows:s.follows.length===0,
subList:ASTRO.filter(a=>isSub(a.id)&&vis(a)).map(a=>{const inf=s.subInfo[a.id];return{...card(a),tierText:inf.tier,until:fmtIST(inf.expiresAt)+' (IST)',autoRenew:!!inf.autoRenew,toggleAuto:()=>setState({subInfo:{...s.subInfo,[a.id]:{...inf,autoRenew:!inf.autoRenew}}})};}),
otherList:ASTRO.filter(a=>!isFol(a.id)&&!isSub(a.id)&&vis(a)).slice(0,4).map(a=>({...card(a),follow:()=>{setState({follows:s.follows.concat(a.id)});showToast('Following '+a.name+' (free)');},subscribe:openSub(a.id)}))};
// Explore cards (sample facts; per-minute prices are not used: Instant Call and Chat are prepaid packages, D-45).
const xcard=a=>{const mt=ASTRO_META[a.id]||{},busy=(REQ_BEHAVIOR[a.id]||'')==='busy',av2=!a.online?'Offline':busy?'Busy':'Online';
const go2=kind=>()=>{setState({astro:a.id,kind,notifOpen:false,dlg:null});navigate('/session');};
return{...card(a),avail:av2,availCls:'ex-'+av2.toLowerCase(),years:(mt.years||0)+' Years',followers:(mt.followers||'0')+' Followers',expertise:mt.exp||[],langList:a.langs.split(', '),
priceText:'Call from ₹'+PKGS.Call[0].price+' · Chat from ₹'+PKGS.Chat[0].price+' (prepaid, 5 min minimum)',canContact:a.online,call:go2('Call'),chat:go2('Chat')};};
const ratingNum=id=>{const r=ratingOf(id);return r?parseFloat(r.avg):0;};
const exSubs=ASTRO.filter(a=>isSub(a.id)&&vis(a)),exFol=ASTRO.filter(a=>isFol(a.id)&&!isSub(a.id)&&vis(a)),
exSug=ASTRO.filter(a=>!isFol(a.id)&&!isSub(a.id)&&vis(a)).slice().sort((a,b)=>ratingNum(b.id)-ratingNum(a.id));
const exGroups={subscribed:{title:'Subscribed Astrologers',list:exSubs,empty:'You have no subscriptions yet.'},followed:{title:'Followed Astrologers',list:exFol,empty:'You are not following anyone else yet.'},suggested:{title:'Suggested Astrologers',list:exSug,empty:'No suggestions right now.'}};
const qq=(s.q||'').trim().toLowerCase();
const exFound=qq?ASTRO.filter(a=>vis(a)&&(a.name+' '+a.spec+' '+a.langs+' '+((ASTRO_META[a.id]||{}).exp||[]).join(' ')).toLowerCase().indexOf(qq)>=0).map(xcard):[];
const exVals={exSections:Object.keys(exGroups).map(k=>({key:k,title:exGroups[k].title,empty:exGroups[k].empty,items:exGroups[k].list.slice(0,3).map(xcard),has:exGroups[k].list.length>0,more:exGroups[k].list.length>3,view:()=>navigate('/explore/'+k)})),
exAll:k=>exGroups[k]?{title:exGroups[k].title,empty:exGroups[k].empty,items:exGroups[k].list.map(xcard)}:null,exSearching:!!qq,exFound};
const pf=(()=>{
const all=revsOf(cur.id),pub=all.filter(r=>r.status==='Published');
const toggle=r=>()=>{setState({revSt:{...s.revSt,[r.key]:r.status==='Published'?'Hidden':'Published'}});showToast(r.status==='Published'?'Review hidden (by astrologer / Platform Admin): it is no longer shown or counted':'Review published again');};
return{pf:{
bio:s.apprBio[cur.id]||cur.bio,rating:ratingText(cur.id),
reviews:pub.map(r=>({stars:stars(r.n),text:r.text,src:r.src+(r.mine?' · your review':''),})),noReviews:pub.length===0,
allReviews:all.map(r=>({stars:stars(r.n),text:r.text.slice(0,48),status:r.status,hidden:r.status!=='Published',toggle:toggle(r)})),
pkgs:['Call','Chat'].map(k=>({kind:'Instant '+k,items:PKGS[k].map(p=>p.mins+' min · ₹'+p.price).join('   ·   ')})),
dnd:!!s.dnd[cur.id],tqSusp:!!s.tqSusp[cur.id],pend:s.pendBio[cur.id]||'',hasPend:!!s.pendBio[cur.id],
toggleDnd:()=>{setState({dnd:{...s.dnd,[cur.id]:!s.dnd[cur.id]}});showToast(s.dnd[cur.id]?'Do Not Disturb cleared':cur.name+' is in Do Not Disturb: the profile is hidden from users (D-38)');},
toggleSusp:()=>{setState({tqSusp:{...s.tqSusp,[cur.id]:!s.tqSusp[cur.id]}});showToast(s.tqSusp[cur.id]?'Text Questions available again':'Text Questions suspended: no new slots can be bought (D-39)');},
submitChange:()=>{setState({pendBio:{...s.pendBio,[cur.id]:'Updated profile text for '+cur.name+': now also offering extended remedy guidance.'}});showToast('Profile change submitted: users keep seeing the previously verified details (D-48)');},
approve:()=>{const n={...s.pendBio},t=n[cur.id];delete n[cur.id];setState({pendBio:n,apprBio:{...s.apprBio,[cur.id]:t}});showToast('Platform Admin approved the change: users now see the new details');}}};})();
const ap=(()=>{
const item=s.reschedId?s.acts.find(x=>x.id===s.reschedId):null;
const dur=item?item.dur:s.apptDur,price=item?item.price:APPT_PRICE[dur];
const base=dayStart(nowT),wk=s.apptWeek,dayTs=base+s.apptDay*DAY;
const days=[...Array(7)].map((_,i)=>{const off=wk*7+i;return{label:fmtD(base+off*DAY+43200000),cls:'chip'+(s.apptDay===off?' on':''),dis:off>90,go:()=>setState({apptDay:off,apptSlot:null})};});
const holdOn=!!(s.hold&&s.hold.until>nowT);
const slots=SLOT_MINS.map(m=>{const t=dayTs+m*60000;const mine=s.acts.some(a=>a.type==='Appointment'&&a.start===t&&a.astro===s.astro&&!FREES.test(a.status));const held=holdOn&&s.hold.astro===s.astro&&s.hold.start===t;return{label:fmtT(t),cls:'chip'+(s.apptSlot===m?' on':''),dis:t<=nowT||slotTaken(s.astro,t)||mine||held,go:()=>setState({apptSlot:m})};});
const selStart=s.apptSlot==null?null:dayTs+s.apptSlot*60000;
const freeNow=t=>t>nowT&&t<=base+91*DAY&&!slotTaken(s.astro,t)&&!s.acts.some(a=>a.type==='Appointment'&&a.start===t&&a.astro===s.astro&&!FREES.test(a.status)&&a.id!==s.reschedId);
const leftMs=holdOn?s.hold.until-nowT:0,mm=Math.floor(leftMs/60000),ss=Math.floor(leftMs/1000)%60;
const nextAppt=s.acts.find(x=>x.type==='Appointment'&&x.status==='Upcoming'&&x.start>nowT);
const proto=kind=>()=>{if(!nextAppt){showToast('No upcoming appointment to change');return;}
setState({acts:s.acts.map(a=>a.id===nextAppt.id?{...a,status:'Astrologer cancelled'}:a),notifLog:(s.notifLog||[]).concat([{id:nowT+'-cx',text:(kind==='date'?nextAppt.who+' closed the date of your appointment. ':nextAppt.who+' cancelled your appointment. ')+'Choose a new time or a full refund to your Wallet.',at:nowT}])});
showToast('Simulated: '+(kind==='date'?'astrologer closed the date':'astrologer cancelled')+' - choose a reschedule or full refund in Activity');};
return{
isResched:!!item,reschedTitle:item?item.title+' · '+item.who:'',
apptSubList:ASTRO.filter(a=>isSub(a.id)).map(a=>{const open=[...Array(7)].reduce((n,_,d)=>n+SLOT_MINS.filter(m=>{const t=base+d*DAY+m*60000;return t>nowT&&!slotTaken(a.id,t)&&!s.acts.some(x=>x.type==='Appointment'&&x.start===t&&x.astro===a.id&&!FREES.test(x.status))&&!(holdOn&&s.hold.astro===a.id&&s.hold.start===t);}).length,0);
const x=xcard(a);return{id:a.id,name:a.name,spec:a.spec,avail:x.avail,availCls:x.availCls,tier:s.subInfo[a.id]?s.subInfo[a.id].tier:'',slotsOpen:open,book:()=>setState({astro:a.id,apptSlot:null,apptDay:0,apptWeek:0})};}),
apptRecList:ASTRO.filter(a=>!isSub(a.id)).slice().sort((a,b)=>ratingNum(b.id)-ratingNum(a.id)).map(a=>({id:a.id,name:a.name,spec:a.spec,ratingText:ratingText(a.id),subscribe:openSub(a.id)})),
cancelResched:()=>setState({reschedId:null,reschedFree:false}),
durs:[15,30].map(x=>({label:x+' min · ₹'+APPT_PRICE[x],cls:'chip'+(dur===x?' on':''),dis:!!item,go:()=>setState({apptDur:x})})),
weekDays:days,weekPrev:()=>setState({apptWeek:Math.max(0,wk-1),apptSlot:null}),weekNext:()=>setState({apptWeek:Math.min(12,wk+1),apptSlot:null}),weekPrevDis:wk<=0,weekNextDis:wk>=12,
slotList:slots,apptHasSel:selStart!=null,apptWhen:selStart!=null?fmtDT(selStart)+' IST':'',apptDurLabel:dur+' min voice',apptPrice:price,
holdOn,holdLeft:mm+':'+String(ss).padStart(2,'0'),holdWhen:holdOn?fmtDT(s.hold.start)+' IST · '+s.hold.dur+' min · ₹'+s.hold.price:'',
startHold:()=>{if(dndBlock())return;if(selStart==null){showToast('Pick a time slot first');return;}if(!freeNow(selStart)){showToast('That slot is no longer available');return;}
setState({hold:{astro:s.astro,start:selStart,dur,price,until:nowT+600000}});showToast('Slot held for 10 minutes - complete payment to confirm');},
releaseHold:()=>{setState({hold:null,apptSlot:null});showToast('Slot released');},
payHold:()=>{const h=s.hold;if(!h||h.until<=nowT){setState({hold:null});showToast('The 10-minute hold expired - slot released');return;}
if(dndBlock())return;if(s.acts.some(a=>a.type==='Appointment'&&a.start===h.start&&a.astro===h.astro&&!FREES.test(a.status))){setState({hold:null});showToast('That slot was already booked - released');return;}
const id=Date.now(),hh=h;
charge(h.price,'Appointment · '+ASTRO[h.astro].name,c=>{if(!c.hold||c.hold.start!==hh.start)return null;return{hold:null,apptSlot:null,
acts:[{id,type:'Appointment',astro:hh.astro,who:ASTRO[hh.astro].name,when:'',title:'Voice consultation · '+hh.dur+' min',status:'Upcoming',start:hh.start,dur:hh.dur,price:hh.price,bookedAt:nowT,sent:[],reschedCount:0}].concat(c.acts),
notifLog:(c.notifLog||[]).concat([{id:id+'-b',text:'Appointment confirmed with '+ASTRO[hh.astro].name+' on '+fmtDT(hh.start)+' IST.',at:nowT}])};},'Appointment confirmed - no astrologer approval needed','Payment failed: add money. Your slot stays held for '+mm+':'+String(ss).padStart(2,'0'));},
confirmResched:()=>{if(!item)return;if(selStart==null){showToast('Pick a new time slot first');return;}if(!freeNow(selStart)){showToast('That slot is no longer available');return;}
if(!s.reschedFree&&(item.reschedCount||0)>=1){showToast('You can reschedule only once');return;}
setState({reschedId:null,reschedFree:false,apptSlot:null,acts:s.acts.map(a=>a.id===item.id?{...a,start:selStart,status:'Upcoming',bookedAt:nowT,sent:[],reschedCount:s.reschedFree?(a.reschedCount||0):(a.reschedCount||0)+1}:a),
notifLog:(s.notifLog||[]).concat([{id:nowT+'-rs',text:'Appointment with '+item.who+' rescheduled to '+fmtDT(selStart)+' IST.',at:nowT}])});navigate('/activity');showToast('Appointment rescheduled');},
dndOn:Object.keys(s.dnd).filter(k=>s.dnd[k]).map(k=>ASTRO[k].name).join(', '),hasDnd:Object.keys(s.dnd).some(k=>s.dnd[k]),
toggleDnd:()=>{const nxt=ASTRO.find(a=>a.id!==cur.id&&vis(a));setState({dnd:{...s.dnd,[cur.id]:true},astro:nxt?nxt.id:s.astro,apptSlot:null});showToast(cur.name+' is now in Do Not Disturb: profile hidden, nothing can be bought, booked or started (D-38). Confirmed appointments stay valid (D-30)');},
clearDnd:()=>setState({dnd:{}}),protoCancel:proto('cancel'),protoDate:proto('date')};})();
const slotAll=s.slots.map(x=>({...x,st:x.expiresAt>nowT?'Available':'Expired'})).concat((s.slotLog||[]).map(x=>({...x,st:x.status})));
const cnt=f=>slotAll.filter(x=>f==='Total'||x.st===f).length;
const batchMap={};slotAll.forEach(x=>{const k=[x.astro,x.campId||'',x.type,x.boughtAt,x.benefit?1:0].join('|');(batchMap[k]=batchMap[k]||[]).push(x);});
const campInfo=cid=>{const c=campsAll.find(z=>z.id===cid);if(!c)return null;const ce=campExp(c);return{name:c.name,end:ce==null?'No campaign end':'Campaign ends '+fmtIST(ce)+' (IST)'};};
const batches=Object.keys(batchMap).map(k=>{const g=batchMap[k],f=g[0],av=g.filter(x=>x.st==='Available').length,us=g.filter(x=>x.st==='Used').length,ex=g.filter(x=>x.st==='Expired').length,rf=g.filter(x=>x.st==='Refunded').length;
const exp=Math.max(...g.map(x=>x.expiresAt)),st=av>0?'Available':us===g.length?'Used':rf===g.length?'Refunded':ex>0?'Expired':'Used',paid=g.reduce((a,x)=>a+(x.price||0),0),ci=campInfo(f.campId);
return{key:k,type:f.benefit?'Benefit':f.type,id:'#SLOT-'+Number(f.boughtAt).toString(36).toUpperCase().slice(-5),who:ASTRO[f.astro]?ASTRO[f.astro].name:'',camp:f.benefit?f.label:(f.label||'Slot'),remaining:av,n:g.length,paid:f.benefit?'Included in subscription':'₹'+paid,bought:fmtIST(f.boughtAt),valid:fmtIST(exp)+' (IST)',sched:f.benefit?'7-day benefit validity':(ci?ci.end:''),
status:st,pillCls:st==='Available'?'pill tx-sub':'pill ex-offline',days:av>0?Math.max(0,Math.ceil((exp-nowT)/DAY)):0,canUse:av>0&&!(s.tqSusp[f.astro]&&false),at:f.boughtAt,counts:{Available:av,Used:us,Expired:ex},
use:()=>{setState({astro:f.astro,askType:f.type==='Personal'?'Personal':'General',txStep:'buy',preview:false});navigate('/text/new');}};}).filter(b=>s.slotFilter==='Total'||b.counts[s.slotFilter]>0).sort((a,b)=>b.at-a.at);
const qMonth=t=>new Date(t).toLocaleDateString('en-IN',{...IST,month:'long',year:'numeric'});
const myQs=s.acts.filter(x=>x.type==='Question').slice().sort((a,b)=>(b.submittedAt||0)-(a.submittedAt||0)).map(x=>{const dp=x.dispute||null,ans=!!x.answeredAt,wait=!ans&&!x.cancelled,left=dayLeft(x),cl=dp&&dp.answeredAt?Math.max(0,7-Math.floor((nowT-dp.answeredAt)/DAY)):0;
const stt=x.cancelled?'Cancelled · refunded':ans?'Completed':x.openedAt?'Pending':'New / Received',sub=dp?dispLabel(dp):'';
return{id:x.id,qid:'QTN-'+new Date(x.submittedAt||nowT).getFullYear()+'-'+String(x.id%1000000).padStart(6,'0'),status:stt,subStatus:sub,statusKey:x.cancelled?'cancelled':ans?'completed':'waiting',disputed:!!dp,
kind:x.kind||'General',paid:x.paid>0?'₹'+x.paid:(x.benefit?'Free (benefit)':'Included'),title:x.title,who:x.who,camp:x.camp||'Question',date:fmtIST(x.submittedAt||nowT),month:qMonth(x.submittedAt||nowT),
guarantee:wait&&!(x.corr&&x.corr.active)?'Day '+Math.min(30,Math.floor((nowT-(x.submittedAt||nowT))/DAY)+1)+' of 30 guarantee':'',due:fmtIST((x.submittedAt||nowT)+30*DAY),
answered:ans,answer:x.answer||'',len:(x.answer||'').length,attList:(x.attachments||[]).slice(0,3).map(a=>({name:a.name,kind:(a.name.split('.').pop()||'').toUpperCase().replace('JPG','JPEG'),open:()=>showToast('Download is not available yet')})),linkList:x.links||[],
rated:!!x.rating,stars:'★'.repeat(x.rating||0)+'☆'.repeat(5-(x.rating||0)),canRate:ans&&!x.rating,rate:openDlg('qrate',{id:x.id}),
canDispute:ans&&!dp&&left>0,dLeft:left,windowClosed:ans&&!dp&&left<=0,raise:openDlg('dispute',{id:x.id}),dAnswered:!!(dp&&dp.answeredAt),dAdmin:!!(dp&&dp.admin),dAnswer:dp?dp.answer||'':'',
canComplain:!!(dp&&dp.answeredAt)&&!x.complaint&&cl>0,complain:openDlg('complaint',{id:x.id}),complained:!!x.complaint,
corrActive:wait&&!!(x.corr&&x.corr.active),corrReplace:openDlg('correct',{id:x.id}),view:()=>navTo('answer',{ansId:x.id})};});
const myQMonths=[...new Set(myQs.map(q=>q.month))];
// History archive: cancelled questions, and completed ones whose dispute window is over or whose dispute is finished (sample rule; retention is P-11-04).
const histQs=s.acts.filter(x=>x.type==='Question'&&(x.cancelled||(x.answeredAt&&(dayLeft(x)<=0||(x.dispute&&(x.dispute.answeredAt||x.dispute.admin)))))).slice().sort((a,b)=>(b.submittedAt||0)-(a.submittedAt||0)).map(x=>{const canc=!!x.cancelled,closedAt=canc?(x.submittedAt||nowT)+30*DAY:x.answeredAt;
return{id:x.id,qid:'QTN-'+new Date(x.submittedAt||nowT).getFullYear()+'-'+String(x.id%1000000).padStart(6,'0'),camp:x.camp||'Question',who:x.who,kind:x.kind||'General',title:x.title,statusKey:canc?'cancelled':'completed',status:canc?'Cancelled':'Completed',
tags:[x.dispute?'Dispute':'',x.complaint?'Platform Complaint':''].filter(Boolean),asked:fmtIST(x.submittedAt||nowT),closed:fmtIST(closedAt),closedLabel:canc?'Cancelled':'Completed',
money:canc?(x.paid>0?'Refunded · ₹'+x.paid:'Refunded'):(x.paid>0?'Paid · ₹'+x.paid:'Free (benefit)'),month:qMonth(x.submittedAt||nowT),view:()=>navTo('answer',{ansId:x.id})};});
const histMonths=[...new Set(histQs.map(q=>q.month))];
const apptHist=s.acts.filter(x=>x.type==='Appointment'&&x.start).slice().sort((a,b)=>b.start-a.start).map(x=>{const stt=x.status,key=(stt==='Upcoming'||stt==='In progress')?'booked':stt==='Completed'?'completed':'cancelled';
const rel=s.remedies.filter(r=>r.actId===x.id),at=rel.find(r=>(r.type||'Remedy')==='Remedy');
return{id:x.id,bookingId:'apt-'+Number(x.id).toString(36).slice(-8),who:x.who,spec:ASTRO[x.astro]?ASTRO[x.astro].spec:'',status:stt==='Upcoming'?'Booked':stt,statusKey:key,rescheduled:(x.reschedCount||0)>0,
paid:'₹'+x.price+' paid',start:x.start,dayText:fmtD(x.start),timeText:fmtT(x.start)+' – '+fmtT(x.start+x.dur*60000),durText:x.dur+' Minutes',
bookedOn:x.bookedAt?fmtDT(x.bookedAt)+' IST':'—',payVia:x.payVia||'Wallet',ref:x.txn||'TXN-'+Number(x.id).toString(36).toUpperCase().slice(-6),
refund:/refunded/.test(stt)?'₹'+x.price+' refunded to your Wallet (D-32)':'',
notes:rel.filter(r=>(r.type||'Remedy')!=='Remedy').map(r=>({kind:r.type,title:r.title})),atoneId:at?at.id:null,atoneTitle:at?at.title:'',openAtone:()=>at&&navigate('/remedy/'+at.id),
manage:()=>navTo('activity',{focusId:x.id,actTab:'Appointments'})};});
const homeTicker=(()=>{const out=[],cut=t=>t.length>44?t.slice(0,43)+'…':t,td=dayStart(nowT);
const qs=s.acts.filter(x=>x.type==='Question'&&x.answeredAt&&!x.cancelled);
qs.filter(x=>nowT-x.answeredAt<7*DAY).slice().sort((p,q)=>q.answeredAt-p.answeredAt).slice(0,3).forEach(x=>out.push({key:'ans'+x.id,icon:'✦',text:x.who+' answered your question: “'+cut(x.title)+'”',go:()=>navTo('activity',{focusId:x.id,actTab:'Questions'})}));
s.acts.filter(x=>x.type==='Appointment'&&x.start&&(x.status==='Upcoming'||x.status==='In progress')).slice().sort((p,q)=>p.start-q.start).forEach(x=>{const d=x.start-nowT;if(d<-x.dur*60000)return;const go=()=>navTo('activity',{focusId:x.id,actTab:'Appointments'});
if(d>0&&d<=3600000)out.push({key:'soon'+x.id,icon:'⏰',text:'Appointment with '+x.who+' starts in '+Math.max(1,Math.round(d/60000))+' min',go});
else if(dayStart(x.start)===td)out.push({key:'tod'+x.id,icon:'📅',text:'Today '+fmtT(x.start)+' · Audio Call with '+x.who,go});});
s.remedies.filter(r=>(r.type||'Remedy')==='Remedy'&&r.days&&r.status!=='Completed'&&!r.done).forEach(r=>{const di=Math.floor((td-r.startDate)/DAY);if(di>=0&&di<r.days&&!(r.completedDays||[]).includes(di))out.push({key:'atn'+r.id,icon:'🪔',text:'Today: do your '+(r.god||'')+' atonement · '+(r.time||'')+' · day '+(di+1)+' of '+r.days,go:()=>navigate('/remedy/'+r.id)});});
qs.filter(x=>!s.reviewed[x.id]&&!x.dispute).slice(0,2).forEach(x=>out.push({key:'rate'+x.id,icon:'★',text:'Rate the answer from '+x.who,go:()=>navTo('activity',{focusId:x.id,actTab:'Questions'})}));
s.acts.filter(x=>x.type==='Appointment'&&x.start&&x.status==='Upcoming'&&dayStart(x.start)===td+DAY).forEach(x=>out.push({key:'tom'+x.id,icon:'🗓',text:'Tomorrow '+fmtT(x.start)+' · '+x.who,go:()=>navTo('activity',{focusId:x.id,actTab:'Appointments'})}));
return out;})();
const homeUpcoming=s.acts.filter(x=>x.type==='Appointment'&&x.start&&(x.status==='Upcoming'||x.status==='In progress')&&x.start+x.dur*60000>nowT).slice().sort((a,b)=>a.start-b.start).map(x=>({id:x.id,who:x.who,spec:ASTRO[x.astro]?ASTRO[x.astro].spec:'',dayText:fmtD(x.start),timeText:fmtT(x.start)+' – '+fmtT(x.start+x.dur*60000),durText:x.dur+' min',status:x.status==='Upcoming'?'Booked':x.status,open:()=>navTo('activity',{focusId:x.id,actTab:'Appointments'})}));
const homeLog=s.acts.map((x,i)=>({x,i})).sort((p,q)=>((q.x.submittedAt||q.x.bookedAt||0)-(p.x.submittedAt||p.x.bookedAt||0))||p.i-q.i).map(o=>o.x).map(x=>{const isQ=x.type==='Question';const status=isQ?(x.dispute?dispLabel(x.dispute):qStatus(x)):x.status;const ts=x.submittedAt||x.bookedAt;return{id:x.id,type:x.type,status,st:chipSt(status)+';',title:x.title,who:x.who||'',dateText:ts?fmtD(ts):(x.when||''),open:()=>navTo('activity',{focusId:x.id,actTab:'All'})};});
const txVals={homeTicker,homeUpcoming,homeLog,nowMs:nowT,apptHist,goApptHistory:()=>navigate('/appt/my'),histQs,histMonths,myQs,myQMonths,slotBatches:batches,slotFilter:s.slotFilter,slotOpts:['Total','Available','Used','Expired'].map(f=>({value:f,label:(f==='Total'?'Total Purchased':f)+' ('+cnt(f)+')'})),onSlotFilter:e=>setState({slotFilter:e.target.value}),buySlots:()=>{setState({txStep:'pick'});navigate('/text/new');},txStep:s.txStep,changeAstro:()=>setState({txStep:'pick'}),
txSub:ASTRO.filter(a=>isSub(a.id)&&vis(a)).map(a=>{const inf=s.subInfo[a.id];return{...xcard(a),days:inf?Math.max(0,Math.ceil((inf.expiresAt-nowT)/DAY)):0,tier:inf?inf.tier:'',susp:!!s.tqSusp[a.id],pick:()=>setState({astro:a.id,txStep:'buy',preview:false})};}),
txRec:ASTRO.filter(a=>!isSub(a.id)&&vis(a)).map(a=>({...xcard(a),susp:!!s.tqSusp[a.id],subscribe:openSub(a.id)})),
txCounts:{q:s.acts.filter(x=>x.type==='Question').length,slots:liveSlots.length}};
return{
...txVals,...exVals,...fp,...subVals,tqSuspCur:!!s.tqSusp[cur.id],dndCur:!!s.dnd[cur.id],
...ap,...ss,...pf,campCtl,mySlots,hasSlots:mySlots.length>0,mySlotsPaid:mySlots.filter(x=>!x.benefit),mySlotsBen:mySlots.filter(x=>x.benefit),benefitN:liveSlots.filter(x=>x.astro===s.astro&&x.benefit).length,nav,sHome:st==='home',sExplore:st==='explore',sAstro:st==='astro',sServices:st==='services',sText:st==='text',sActivity:st==='activity',sWallet:st==='wallet',sProfile:st==='profile',sAppt:st==='appt',sSession:st==='session',sKundli:st==='kundli',sFollow:st==='follow',sNotifs:st==='notifs',sRemedy:st==='remedy',sHelp:st==='help',sLogin:st==='login',goNotifs:go('notifs'),goRemedy:go('remedy'),
goHome:go('home'),goExplore:go('explore'),goServices:go('services'),goActivity:go('activity'),goWallet:go('wallet'),goProfile:go('profile'),goText:go('text'),
toggleNotif:()=>setState({notifOpen:!s.notifOpen,profMenu:false}),profMenu:!!s.profMenu,toggleProf:()=>setState({profMenu:!s.profMenu,notifOpen:false}),closeProf:()=>setState({profMenu:false}),viewProfile:go('profile'),logout:go('login',{loginStep:1}),notifOpen:s.notifOpen,wallet:s.wallet,services,
onlineList:ASTRO.filter(a=>a.online&&vis(a)).slice(0,3).map(xcard),lastAct:s.acts.length?{...s.acts[0],st:chipSt(s.acts[0].status)+';'}:{type:'New',title:'No activity yet — start with a Text Question.',status:'Start',st:'background:rgba(var(--gd),.16);color:var(--gold);'},lastGo:s.acts.length?go('activity'):go('services'),
q:s.q,onQ:e=>setState({q:e.target.value}),onlineCls:'chip'+(s.online?' on':''),toggleOnline:()=>setState({online:!s.online}),
cats:CATS.map(c=>({label:c,cls:'chip'+(s.cat===c?' on':''),go:()=>setState({cat:c})})),exploreList:list,noResults:list.length===0,
cur:{...cur,ini:ini(cur),avL:av(cur.id,96)},subCls:isSub(cur.id)?'btn-g':'btn-p',subLabel:isSub(cur.id)?'Subscribed ✓':'Subscribe',
toggleSub:openSub(cur.id),
astroSvc:[{name:'Text Question',go:go('text',{txStep:'buy'}),note:s.tqSusp[cur.id]?'Suspended: new slots cannot be bought. Your valid slots stay usable (D-39)':isSub(cur.id)?'Subscribed — ready to ask':'Subscribe first (D-04)'},{name:'Appointment',note:'Scheduled consultation',go:go('appt')},{name:'Instant Call',note:'Talk now',go:go('session',{kind:'Call',phase:'idle'})},{name:'Instant Chat',note:'Chat now',go:go('session',{kind:'Chat',phase:'idle'})}],
pickList:ASTRO.filter(vis).map(a=>({name:a.name,cls:'chip'+(s.astro===a.id?' on':''),go:()=>setState({astro:a.id})})),
notSub:!isSub(cur.id),isSub:isSub(cur.id),subscribeNow:openSub(cur.id),
camps:campsAll.filter(campActive).map(c=>{const ce=campExp(c),left=ce==null?null:Math.ceil((ce-nowT)/DAY);
const types=['general','personal'].filter(k=>c[k]).map(k=>{const p=c[k],fin=Math.round(p.price*(100-p.disc)/100);return{label:k==='general'?'General':'Personal',price:p.price,disc:p.disc,hasDisc:p.disc>0,final:fin,total:fin*s.qty,saves:(p.price-fin)*s.qty,buy:buy(c,k)};});
return{...c,types,special:c.special||'',expired:left!=null&&left<=0,hasWarn:left!=null&&left>0&&left<=3,warn:'Expires in '+left+' day(s) on '+(ce?fmtIST(ce):'')+' (IST). Slots bought now expire with the campaign (D-07, D-26).',expText:ce==null?'No campaign expiry':'Campaign ends '+fmtIST(ce)+' (IST)'};}).filter(c=>!c.expired),qty:s.qty,qtyUp:()=>setState({qty:Math.min(5,s.qty+1)}),qtyDown:()=>setState({qty:Math.max(1,s.qty-1)}),
slotsN,slotStyle:slotsN?'background:rgba(var(--gn),.15);color:var(--green)':'background:rgba(var(--gd),.16);color:var(--gold)',
draft:s.draft,onDraft:e=>setState({draft:e.target.value}),
askType:s.askType,isGen:s.askType==='General',isPers:s.askType==='Personal',
typeOpts:['General','Personal'].map(t=>({label:t+' ('+slotsOf(s.astro,t)+')',cls:'chip'+(s.askType===t?' on':''),go:()=>setState({askType:t,qFiles:[]})})),
qLen:(s.draft||'').length,qFiles:s.qFiles.map(n=>({name:n})),hasFiles:s.qFiles.length>0,useSaved:s.useSaved,toggleSaved:()=>setState({useSaved:!s.useSaved}),
onQFile:e=>{const fl=[...(e.target.files||[])];e.target.value='';const ok=[...s.qFiles];
for(const f of fl){if(!/\.(jpe?g|pdf)$/i.test(f.name)){showToast('Only PDF or JPEG files (D-35)');continue;}if(f.size>10*1024*1024){showToast(f.name+' is over 10 MB');continue;}if(ok.length>=2){showToast('At most 2 files per question (D-22)');break;}ok.push(f.name);}
setState({qFiles:ok});},
rmQFile:n=>()=>setState({qFiles:s.qFiles.filter(x=>x!==n)}),
previewOn:s.preview,
goPreview:()=>{if(dndBlock())return;const t=(s.draft||'').trim();if(!isSub(cur.id)){showToast('Subscribe to this astrologer first');return;}if(!slotsN){showToast('Buy a '+s.askType+' question slot first');return;}if(!t){showToast('Write your question first');return;}if(t.length>1000){showToast('Questions are limited to 1,000 characters');return;}
if(s.askType==='Personal'&&!s.qFiles.length&&!s.useSaved){showToast('Attach a horoscope file or use your saved birth details');return;}setState({preview:true,consentChk:false});},
backEdit:()=>setState({preview:false}),
pvText:(s.draft||'').trim(),pvAtt:s.askType==='Personal'?(s.qFiles.length?s.qFiles.join(', '):'Saved birth details from your profile'):'None (General Questions have no attachments)',
submitFinal:()=>{const t=(s.draft||'').trim();if(s.askType==='Personal'&&!s.consentChk){showToast('Please consent to share your birth details with '+cur.name+' for this paid Personal Question (D-37)');return;}const cand=liveSlots.filter(x=>x.astro===s.astro&&(x.type===s.askType||x.benefit)).sort((a,b)=>a.expiresAt-b.expiresAt)[0];if(!cand){showToast('No valid slot left');setState({preview:false});return;}
setState({slots:s.slots.filter(x=>x.id!==cand.id),slotLog:(s.slotLog||[]).concat([{...cand,status:'Used',at:nowT}]),draft:'',qFiles:[],useSaved:false,preview:false,acts:[{id:Date.now(),type:'Question',kind:s.askType,camp:cand.label||'Question',benefit:!!cand.benefit,astro:s.astro,who:cur.name,when:'Just now',title:t,submittedAt:nowT,simStart:Date.now(),paid:cand.price||0,consentAt:s.askType==='Personal'?nowT:null}].concat(s.acts)});showToast('Question sent - it cannot be edited now (D-34). See it in Activity');},
actTabs:['All','Questions','Appointments','Calls','Chats'].map(t=>({label:t,cls:'chip'+(s.actTab===t?' on':''),go:()=>setState({actTab:t})})),actList,noActs:actList.length===0,
hasHeld:heldKeys.length>0,heldText:heldKeys.map(k=>heldMap[k]+' slot(s) with '+ASTRO[k].name+' (next expiry '+fmtIST(Math.min(...liveSlots.filter(x=>x.astro==k).map(x=>x.expiresAt)))+' IST)').join(' · '),
txns:s.txns.map(t=>({label:t.label,when:t.when,amt:(t.sign>0?'+ ₹':t.sign<0?'− ₹':'₹')+t.amt,isRefund:/^Refund/.test(t.label),st:'font-size:19px;font-weight:600;color:'+(t.sign>0?'var(--green)':'var(--ink)')})),
openTop:()=>setState({modal:true}),closeTop:()=>setState({modal:false}),modal:s.modal,amts,amt:s.amt,
payChips:[['wallet','Wallet (₹'+s.wallet+')'],['direct','UPI / bank (direct)']].map(m=>({label:m[1],cls:'chip'+(s.payMode===m[0]?' on':''),go:()=>setState({payMode:m[0]})})),payModeText:s.payMode==='direct'?'Direct payment: UPI or bank, your Wallet is not used':'Paying from your Wallet',
wdMax:Math.max(0,s.wallet-500),wdAmt:s.wdAmt,onWd:e=>setState({wdAmt:e.target.value.replace(/[^0-9]/g,'')}),wdAll:()=>setState({wdAmt:String(Math.max(0,s.wallet-500))}),
withdraw:()=>{const a=parseInt(s.wdAmt||'0',10);const mx=Math.max(0,s.wallet-500);if(!a||a<=0){showToast('Enter an amount to withdraw');return;}
if(a>mx){showToast('A withdrawal must leave at least ₹500 in your Wallet (D-32). You can withdraw up to ₹'+mx);return;}
setState({wallet:s.wallet-a,wdAmt:'',txns:[{label:'Withdrawal to bank account',when:'Just now',amt:a,sign:-1}].concat(s.txns)});showToast('₹'+a+' withdrawn to your bank account');},
payNow:()=>{setState({wallet:s.wallet+s.amt,modal:false,txns:[{label:'Money added',when:'Just now',amt:s.amt,sign:1}].concat(s.txns)});showToast('₹'+s.amt+' added to wallet');},
menu:[{label:'Wallet',go:go('wallet')},{label:'Birth profiles & Kundli',go:go('kundli')},{label:'Following & subscriptions',go:go('follow')},{label:'Remedy Tracker',go:go('remedy')},{label:'Notifications',go:go('notifs')},{label:'Help & support',go:go('help')},{label:'Log out',go:go('login',{loginStep:1})}],
toggles:[tgl('push','Push notifications','Channel confirmed (D-16)'),tgl('inapp','In-app notifications','Channel confirmed (D-16)'),{label:'Critical alerts',note:'Always on (D-15)',on:'true',just:'justify-content:flex-end;opacity:.6',go:()=>showToast('Critical alerts cannot be turned off')}],
soon,
isDark:s.theme==='dark',isLight:s.theme==='light',themeLabel:s.theme==='dark'?'Switch to light mode':'Switch to dark mode',toggleTheme:()=>{const n=s.theme==='dark'?'light':'dark';try{localStorage.setItem('ac-theme',n);}catch(e){}setState({theme:n});},
sAnswer:st==='answer',sEdit:st==='edit',goEdit:go('edit'),
ans:{...ansItem,corrActive:!ansDone&&!ansCancelled&&!!(ansItem.corr&&ansItem.corr.active),corrCycles:(ansItem.corr&&ansItem.corr.cycles)||0,corrReplace:openDlg('correct',{id:ansItem.id}),
canReqCorr:!ansDone&&!ansCancelled&&!(ansItem.corr&&ansItem.corr.active),
reqCorr:()=>{setState({acts:s.acts.map(x=>x.id===ansItem.id?{...x,corr:{...(x.corr||{}),active:true,at:nowT}}:x),notifLog:(s.notifLog||[]).concat([{id:nowT+'-corr',cat:'Question',go:'activity',cta:'Open Activity',at:nowT,text:ansItem.who+' asked you to correct your question. Replace it with another General Question: same slot, no extra payment. The original deadline ('+fmtIST((ansItem.submittedAt||nowT)+30*DAY)+' IST) continues.'}])});showToast('Simulated: the astrologer requested a correction');},
attList:(ansItem.attachments||[]).slice(0,3).map(a=>({name:a.name,kind:(a.name.split('.').pop()||'').toUpperCase().replace('JPG','JPEG'),open:()=>showToast('Download is not available yet')})),linkList:ansItem.links||[],len:(ansItem.answer||'').length,status:ansStatus,st:chipSt(ansStatus)+';',left:ansLeft,bar:'height:100%;width:'+Math.round(ansLeft/7*100)+'%;background:var(--acc)',canDispute:ansDone&&!ansDsp&&ansLeft>0,windowClosed:ansDone&&!ansDsp&&ansLeft<=0,disputed:ansDsp,dispute:openDlg('dispute',{id:ansItem.id}),
due:fmtIST((ansItem.submittedAt||nowT)+30*DAY),rated:!!ansItem.rating,stars:'★'.repeat(ansItem.rating||0),needRate:ansDone&&!ansItem.rating,rate:openDlg('qrate',{id:ansItem.id}),
dRaised:dpo?fmtIST(dpo.raisedAt):'',dAnswered:!!(dpo&&dpo.answeredAt),dAnswerText:dpo?dpo.answer:'',dAdmin:!!(dpo&&dpo.admin),
canComplain:!!(dpo&&dpo.answeredAt)&&!cmpt&&complaintLeft>0,complaint:openDlg('complaint',{id:ansItem.id}),complained:!!cmpt,cLeft:complaintLeft},ansWaiting:!ansDone&&!ansCancelled,ansCancelled,ansDone,
skewDays:Math.round((s.skew||0)/DAY),addSkew:n=>()=>{setState({skew:(s.skew||0)+n*DAY});setTimeout(runAdvance,0);},resetSkew:()=>setState({skew:0}),
submitRate:()=>{if(!s.rate){showToast('A rating is required');return;}setState({acts:s.acts.map(x=>x.id===s.dlg.id?{...x,rating:s.rate,review:(s.note||'').trim(),ratedAt:nowT}:x),dlg:null});showToast('Thank you. Your review cannot be edited or deleted; ask Platform Support for changes.');},
submitComplaint:()=>{const t=(s.note||'').trim();if(!t){showToast('Describe the problem first');return;}setState({acts:s.acts.map(x=>x.id===s.dlg.id?{...x,complaint:{at:nowT,text:t}}:x),dlg:null});showToast('Platform Complaint submitted');},
profile:s.prof||{},saveProfile:(name,p)=>{setState({pname:(name||'').trim()||s.pname,prof:p});showToast('Profile saved');},pname:s.pname,pini:(s.pname||'G')[0].toUpperCase(),onName:e=>setState({pname:e.target.value}),saveName:()=>showToast('Profile saved'),
dlgOn:!!s.dlg,dlgTitle:{correct:'Replace your question',rdone:'Mark remedy Completed',subscribe:'Subscribe',pay:'Pay directly',qrate:(rateIsQ?'Rate this answer':'Rate this consultation'),scomplaint:'Platform complaint',chatlog:'Chat messages',complaint:'Platform Complaint',review:'Write a review',dispute:'Raise a dispute',notif:'Notification',resched:'Reschedule or cancel',report:'Share or report',terms:'Subscription terms'}[dk]||'',
rs,rateNote:rateIsQ?'A rating is required after every answer. It does not stop you from raising a dispute (D-17).':'A rating of 1–5 stars is required after every consultation; written feedback is optional (D-10).',dScomplaint:dk==='scomplaint',dChatlog:dk==='chatlog',cl,dPay:dk==='pay',payAmt:s.dlg&&s.dlg.k==='pay'?s.dlg.amt:0,payLabel:s.dlg&&s.dlg.k==='pay'?s.dlg.label:'',upi:s.upi,onUpi:e=>setState({upi:e.target.value}),payMs:['UPI','Bank / card'].map(m=>({label:m,cls:'chip'+(s.payM===m?' on':''),go:()=>setState({payM:m})})),payIsUpi:s.payM==='UPI',confirmDirect,dReview:dk==='review',dQrate:dk==='qrate',dComplaint:dk==='complaint',noClose:dk==='qrate',dDispute:dk==='dispute',dNotif:dk==='notif',dResched:dk==='resched',dReport:dk==='report',dTerms:dk==='terms',closeDlg:()=>setState({dlg:null}),
stars:[1,2,3,4,5].map(n=>({label:n+' star'+(n>1?'s':''),cls:'chip'+(s.rate>=n?' on':''),go:()=>setState({rate:n})})),note:s.note,onNote:e=>setState({note:e.target.value}),
submitReview:()=>{if(!s.rate){showToast('Select a rating first');return;}setState({reviewed:{...s.reviewed,[s.dlg.id]:1},dlg:null});showToast('Review submitted. Thank you!');},
submitDispute:()=>{const q=s.acts.find(x=>x.id===s.dlg.id);if(!q||q.dispute||!q.answeredAt||dayLeft(q)<=0){showToast('A dispute is no longer available for this question');setState({dlg:null});return;}
setState({acts:s.acts.map(x=>x.id===q.id?{...x,dispute:{raisedAt:nowT,simStart:Date.now(),reason:(s.note||'').trim()}}:x),dlg:null});showToast('Dispute raised - the astrologer answers once within 3 days (D-19)');},
dn:{crit:critCats.includes(dn[0]),cat:dn[0],text:dn[1],time:dn[2],cta:dn[4],go:go(dn[3])},openTerms:openDlg('terms'),openReport:openDlg('report'),
terms:[['Price','P-14-02'],['Duration','P-14-03'],['Renewal','P-14-04'],['Cancellation & refund','P-14-05']].map(x=>({l:x[0],p:x[1]})),
noTxns:s.txns.length===0,noRem:s.remedies.length===0,
bps:s.bps.map((b,i)=>({name:b.name,cls:'chip'+(s.bp===i?' on':''),go:()=>setState({bp:i})})),bp,addBp:()=>setState({bps:s.bps.concat([{name:'New profile',dob:'',tob:'',pob:''}]),bp:s.bps.length}),
setName:setBp('name'),setDob:setBp('dob'),setTob:setBp('tob'),setPob:setBp('pob'),saveBp:()=>showToast('Saved — Kundli updated automatically. Uploaded files unchanged.'),
files:s.files.map(n=>({name:n})),onFile:e=>{const f=e.target.files&&e.target.files[0];if(!f)return;if(!/\.(jpe?g|png|pdf)$/i.test(f.name)){showToast('Only JPG, PNG or PDF files');return;}setState({files:s.files.concat([f.name])});showToast('Uploaded '+f.name);},
noSubs:s.subs.length===0,
notifs:NL,bellList:NL.slice(0,3),
focusId:s.focusId,rmSrcChips:['All Sources','Text','Calls & Chats','Appointments'].map(x=>({label:x,cls:'chip'+(s.rmSrc===x?' on':''),go:()=>setState({rmSrc:x})})),rmStat:s.rmStat,onRmStat:e=>setState({rmStat:e.target.value}),
atoneList:s.remedies.filter(r=>(r.type||'Remedy')==='Remedy'&&r.days&&(s.rmSrc==='All Sources'||(s.rmSrc==='Text'&&r.source==='Text')||(s.rmSrc==='Calls & Chats'&&(r.source==='Call'||r.source==='Chat'))||(s.rmSrc==='Appointments'&&r.source==='Appointment'))&&(s.rmStat==='All'||r.status===s.rmStat)).map(r=>{const dn=(r.completedDays||[]).length,who=ASTRO[r.astro]?ASTRO[r.astro].name:'Astrologer';
return{id:r.id,who,status:r.status,source:({Text:'Text Based',Call:'Call',Chat:'Chat',Appointment:'Appointment'})[r.source]||r.source,daysLabel:r.days+'-Day Remedy',title:r.title,progress:r.status==='Completed'?r.days+' of '+r.days+' days':'Day '+Math.min(dn+1,r.days)+' of '+r.days,view:()=>navigate('/remedy/'+r.id)};}),
noteList:s.remedies.filter(r=>(r.type||'Remedy')!=='Remedy').map(r=>{const act=s.acts.find(x=>x.id===r.actId);return{kindLabel:r.type,title:r.title,srcText:'From '+r.src,canView:!!act,view:()=>act&&act.type==='Question'?navTo('answer',{ansId:act.id}):navTo('activity',{focusId:r.actId,actTab:'All'})};}),
atoneOf:id=>{const r=s.remedies.find(x=>x.id===id);if(!r||(r.type||'Remedy')!=='Remedy'||!r.days)return null;
const who=ASTRO[r.astro]?ASTRO[r.astro].name:'Astrologer',act=s.acts.find(x=>x.id===r.actId),comp=r.completedDays||[],pr=r.proofs||{};
const days=[...Array(r.days)].map((_,i)=>{const dt=r.startDate+i*DAY,done=comp.includes(i),locked=dt>nowT;return{i,n:i+1,date:fmtLong(dt),state:done?'Completed':locked?'Locked':'Pending',done,locked,proof:pr[i]||null};});
const proofN=days.filter(d=>d.proof).length,last=r.days-1;
const addProof=i=>e=>{const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;
if(!/^(image|video|audio)\//.test(f.type)&&!/\.(jpe?g|png|gif|webp|mp4|mov|webm|mp3|wav|m4a|ogg)$/i.test(f.name)){showToast('Attach a photo, video or audio file');return;}
if(f.size>2*1024*1024){showToast('Proofs can be up to 2 MB');return;}
setState({remedies:s.remedies.map(x=>x.id===id?{...x,proofs:{...(x.proofs||{}),[i]:{name:f.name,type:f.type,size:f.size}}}:x)});showToast('Proof added for day '+(i+1));};
const markDay=i=>()=>{const d=days[i];if(d.done)return;if(d.locked){showToast('This day is locked until its date');return;}
if(i===last){if(days.slice(0,last).some(x=>!x.done)){showToast('Complete the earlier days first');return;}if(proofN<r.days){showToast('Attach proofs for all '+r.days+' days before completing');return;}}
const nd=comp.concat([i]),all=nd.length===r.days;
setState({remedies:s.remedies.map(x=>x.id===id?{...x,completedDays:nd,status:all?'Completed':'Pending',done:all,doneAt:all?nowT:x.doneAt}:x)});showToast(all?'Atonement completed. Only you can mark days completed (D-29)':'Day '+(i+1)+' marked completed');};
return{id,who,title:r.title,source:r.source,daysN:r.days,doneN:comp.length,status:r.status,god:r.god,instruction:r.instruction,things:r.things||[],notes:r.notes,place:r.place,time:r.time,days,proofN,last,
proofsText:proofN+' / '+r.days+' Attached · Required Before Complete',canView:!!act,view:()=>act&&act.type==='Question'?navTo('answer',{ansId:act.id}):navTo('activity',{focusId:r.actId,actTab:'All'}),addProof,markDay};},

rdTitle:(()=>{const r=s.dlg&&s.dlg.k==='rdone'?s.remedies.find(x=>x.id===s.dlg.id):null;return r?r.title:'';})(),rdFile:s.rdFile,
onRdFile:e=>{const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;if(!/\.(jpe?g|png|pdf|docx?|txt)$/i.test(f.name)){showToast('Attach a photo or document (JPG, PNG, PDF, DOC or TXT)');return;}if(f.size>10*1024*1024){showToast('Files can be up to 10 MB');return;}setState({rdFile:f.name});},
confirmDone:()=>{const id=s.dlg&&s.dlg.id;setState({remedies:s.remedies.map(r=>r.id===id?{...r,done:true,doneAt:nowT,proof:s.rdFile||null}:r),dlg:null,rdFile:''});showToast('Marked Completed. Only you can do this (D-29)');},
dRdone:dk==='rdone',dCorrect:dk==='correct',
corrQ:(()=>{const q=dk==='correct'?s.acts.find(x=>x.id===s.dlg.id):null;return q?{title:q.title,due:fmtIST((q.submittedAt||nowT)+30*DAY),n:(s.note||'').length}:{title:'',due:'',n:0};})(),
submitCorrection:()=>{const id=s.dlg&&s.dlg.id,t=(s.note||'').trim();const q=s.acts.find(x=>x.id===id);if(!q||!q.corr||!q.corr.active){setState({dlg:null});showToast('There is no correction request to answer');return;}
if(!t){showToast('Write the replacement General Question first');return;}if(t.length>1000){showToast('Questions are limited to 1,000 characters');return;}
setState({dlg:null,acts:s.acts.map(x=>x.id===id?{...x,title:t,kind:'General',consentAt:null,openedAt:null,simStart:Date.now(),corr:{active:false,cycles:((x.corr&&x.corr.cycles)||0)+1,lastAt:nowT}}:x),
notifLog:(s.notifLog||[]).concat([{id:nowT+'-rs',cat:'Question',go:'activity',cta:'Open Activity',at:nowT,text:'Your corrected General Question went back to '+q.who+'. The original deadline continues.'}])});showToast('Replaced with a General Question - it returned to the astrologer (AD-35)');},

consentChk:s.consentChk,toggleConsent:()=>setState({consentChk:!s.consentChk}),consents:s.acts.filter(x=>x.consentAt).map(x=>({text:x.kind+' Question to '+x.who,when:fmtDT(x.consentAt)+' IST'})),hasConsents:s.acts.some(x=>x.consentAt),
faqs:faqs.map((f,i)=>({q:f[0],a:f[1],open:s.faq===i,sign:s.faq===i?'−':'+',go:()=>setState({faq:s.faq===i?-1:i})})),contact:()=>showToast('Support channels are not decided yet'),
login1:s.loginStep===1,login2:s.loginStep===2,loginNext:()=>setState({loginStep:2}),
toast:s.toast};

  };

  return <AppContext.Provider value={renderVals()}>{children}</AppContext.Provider>;
}
