import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { PKGS } from "../../data/mockData";
import { KIND, METHODS, clock, inr, rid, toDate, toTime } from "./instantUtils";
import InstantSession from "./InstantSession";
import "./Instant.css";

export const WAIT_LIMIT = 3; // at most 3 people on one astrologer's waiting list (UI mock-up; the rule is not in the specs yet)
// People already waiting for each busy astrologer (mock data).
const WAIT_SEED = { 3: 3, 14: 2, 15: 1, 16: 3, 17: 1, 18: 0 };
export const PACKAGES = [5, 10, 15];

const Ctx = createContext(null);
export const useInstant = () => useContext(Ctx);

const EMPTY_DET = () => ({ name: "", dob: "", tob: "", pob: "", file: null, err: {} });

// State for the Instant Call / Chat flow in the Services tab: booking, details, payment, waiting list and refunds.
export function InstantProvider({ children }) {
  const app = useApp();
  const navigate = useNavigate();
  const appRef = useRef(app);
  appRef.current = app;
  const [det, setDet] = useState(EMPTY_DET);
  const [bk, setBk] = useState(null);
  const [others, setOthers] = useState(() => ({ ...WAIT_SEED }));
  const [wait, setWait] = useState(null);
  const [refund, setRefund] = useState(null);
  const [notify, setNotify] = useState({});
  const [payErr, setPayErr] = useState(null);
  const [modal, setModal] = useState(null);
  const [outcome, setOutcome] = useState("success");
  const [dev] = useState(() => { try { if (/[?&]dev=1/.test(window.location.search)) sessionStorage.setItem("ac-dev", "1"); return sessionStorage.getItem("ac-dev") === "1"; } catch (e) { return false; } });
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)); };
  const toast = (m) => appRef.current.homeToast(m);
  const astroById = (id) => appRef.current.exCards.find((a) => a.id === id);

  const waitingCount = (id) => (others[id] || 0) + (wait && wait.astroId === id ? 1 : 0);
  const myPos = wait ? (wait.pos || 1) : 0;
  const priceOf = (kind, mins) => (PKGS[KIND[kind].name].find((p) => p.mins === mins) || PKGS[KIND[kind].name][0]).price;

  const begin = (a, kind, mode) => {
    if (mode === "waitlist" && waitingCount(a.id) >= WAIT_LIMIT) { toast("The waiting list for " + a.name + " is full"); return; }
    setBk({ astroId: a.id, kind, mins: 5, mode: mode || "book", method: null });
    setPayErr(null);
    navigate("/services/instant/details");
  };
  const fillFromProfile = () => {
    const bp = appRef.current.instantBp || {};
    setDet((d) => ({ ...d, name: bp.name || d.name, dob: toDate(bp.dob) || d.dob, tob: toTime(bp.tob) || d.tob, pob: bp.pob || d.pob, err: {} }));
  };
  const validate = () => {
    const e = {};
    if (det.name.trim().length < 2) e.name = "Enter your full name.";
    if (!det.dob) e.dob = "Enter your date of birth.";
    else if (new Date(det.dob) > new Date()) e.dob = "Date of birth can’t be in the future.";
    setDet((d) => ({ ...d, err: e }));
    return !Object.keys(e).length;
  };
  const patchBk = (p) => setBk((b) => (b ? { ...b, ...p } : b));

  const startRefund = (type, w) => {
    const label = "Refund · " + KIND[w.kind].label + " waiting list";
    appRef.current.instantRefund(w.price, label, w.method);
    setOthers((o) => ({ ...o, [w.astroId]: type === "race" ? WAIT_LIMIT : o[w.astroId] || 0 }));
    setWait(null);
    setRefund({ type, astroId: w.astroId, kind: w.kind, price: w.price, method: w.method, payRef: w.payRef, ref: rid("AC-RF"), at: clock(), status: "processing" });
    toast(type === "race" ? "Waiting list filled first. Full refund started." : type === "timeout" ? "Waiting time limit reached. Full refund started." : "You left the waiting list. Refund started.");
    navigate("/services/instant/refund");
  };

  const resolvePay = (b) => {
    const a = astroById(b.astroId);
    const wl = b.mode === "waitlist";
    const price = priceOf(b.kind, b.mins);
    const method = b.method;
    let o = outcome;
    if (o === "race" && !wl) o = "success";
    const payRef = rid("AC-PAY");
    if (o === "fail") {
      setModal(null);
      setPayErr({ t: "Payment failed", d: " No money was taken. " + (wl ? "No waiting-list spot was assigned." : "Your " + KIND[b.kind].name.toLowerCase() + " hasn’t started.") + " Try again or choose another method." });
      return;
    }
    const label = KIND[b.kind].label + " · " + b.mins + " min · " + a.name;
    if (!appRef.current.instantPay(price, label, method)) { setModal(null); return; }
    setModal(null);
    const snap = { ...det, file: det.file ? { ...det.file } : null };
    if (wl) {
      if (o === "race") setOthers((x) => ({ ...x, [a.id]: WAIT_LIMIT }));
      const total = o === "race" ? WAIT_LIMIT : others[a.id] || 0;
      const w = { astroId: a.id, kind: b.kind, mins: b.mins, price, method, payRef, det: snap, state: "waiting", pos: total + 1 };
      if (total >= WAIT_LIMIT) { startRefund("race", w); return; }
      setWait(w);
      toast("Payment successful. You’re #" + (total + 1) + " of " + WAIT_LIMIT + " for " + a.name + ".");
      navigate("/services/instant/waiting");
      return;
    }
    toast("Payment successful. Connecting you to " + a.name + "…");
    appRef.current.instantStartSess({ astro: a.id, kind: KIND[b.kind].name, mins: b.mins, price, info: { ...snap, payRef } }, "/services/" + b.kind);
  };
  const confirmPay = () => {
    if (!bk) return;
    const price = priceOf(bk.kind, bk.mins);
    const wl = bk.mode === "waitlist";
    const a = astroById(bk.astroId);
    const b = { ...bk, method: bk.method || (appRef.current.walletNow >= price ? "wallet" : "upi") };
    setPayErr(null);
    if (wl) {
      setModal({ type: "processing", text: "Checking waiting-list availability…" });
      later(() => {
        if (waitingCount(a.id) >= WAIT_LIMIT) { setModal({ type: "full", astroId: a.id }); return; }
        setModal({ type: "processing", text: "Confirming payment…" });
        later(() => resolvePay(b), 1300);
      }, 900);
    } else {
      setModal({ type: "processing", text: "Confirming payment…" });
      later(() => resolvePay(b), 1300);
    }
  };

  const toggleNotify = (a, kind) => {
    const k = a.id + ":" + kind;
    const on = !notify[k];
    setNotify((n) => ({ ...n, [k]: on }));
    toast(on ? "We will notify you when " + a.name + " is available" : "Notification cancelled for " + a.name);
  };
  const leaveWait = () => { if (wait) startRefund("manual", wait); };
  const startFromWait = () => {
    if (!wait) return;
    const a = astroById(wait.astroId);
    const w = wait;
    setWait(null);
    toast("Connecting you to " + a.name + "…");
    appRef.current.instantStartSess({ astro: a.id, kind: KIND[w.kind].name, mins: w.mins, price: w.price, info: { ...w.det, payRef: w.payRef } }, "/services/" + w.kind);
  };
  // Prototype controls (only with ?dev=1)
  const qAdvance = () => {
    if (!wait) { toast("No active waiting request."); return; }
    if (wait.pos === 1) { setWait({ ...wait, state: "ready" }); toast(astroById(wait.astroId).name + " is ready for you."); return; }
    setOthers((o) => ({ ...o, [wait.astroId]: Math.max(0, (o[wait.astroId] || 0) - 1) }));
    setWait({ ...wait, pos: wait.pos - 1 });
    toast("Queue update: you’re now #" + (wait.pos - 1) + " of " + WAIT_LIMIT + ".");
  };
  const qTimeout = () => { if (wait) startRefund("timeout", wait); };
  const refundDone = () => setRefund((r) => (r ? { ...r, status: "done", doneAt: clock() } : r));

  const value = {
    dev, det, setDet, bk, patchBk, begin, fillFromProfile, validate, payErr, outcome, setOutcome, confirmPay,
    others, wait, myPos, waitingCount, notify, toggleNotify, leaveWait, startFromWait, refund, qAdvance, qTimeout, refundDone, priceOf,
  };
  const a = modal && modal.type === "full" ? astroById(modal.astroId) : null;
  return (
    <Ctx.Provider value={value}>
      {children}
      <InstantSession />
      {modal ? (
        <>
          <div className="in-scrim" />
          <div className="in-modal" role="alertdialog" aria-modal="true" aria-label={modal.type === "full" ? "Waiting list full" : "Processing"}>
            {modal.type === "processing" ? (
              <><span className="in-spin" aria-hidden="true" /><p>{modal.text}</p><small>Please don’t close this page.</small></>
            ) : (
              <>
                <h3>That waiting list just filled</h3>
                <p>{(a ? a.name : "The astrologer") + "’s waiting list now has " + WAIT_LIMIT + " people. No money was taken."}</p>
                <button className="btn-p" onClick={() => { setModal(null); navigate("/services/" + bk.kind); }}>Back to {KIND[bk.kind].label}</button>
              </>
            )}
          </div>
        </>
      ) : null}
      {dev ? (
        <div className="in-dev" role="group" aria-label="Test controls">
          <b>Test controls</b>
          <label>Next payment<select value={outcome} onChange={(e) => setOutcome(e.target.value)}><option value="success">Success</option><option value="fail">Failure</option><option value="race">Race</option></select></label>
          {wait ? <><button onClick={qAdvance}>Move queue forward</button><button onClick={qTimeout}>Timeout</button></> : null}
          {refund && refund.status !== "done" ? <button onClick={refundDone}>Complete refund</button> : null}
          <span>{inr(app.walletNow)}</span>
        </div>
      ) : null}
    </Ctx.Provider>
  );
}
