import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { PKGS } from "../../data/mockData";
import "./InstantFlow.css";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Saved profiles keep "01 Jan 1990" and "06:30 AM"; the form uses native date and time inputs.
const toDate = (s) => { const m = /^(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})$/.exec((s || "").trim()); if (!m) return ""; const i = MON.indexOf(m[2].slice(0, 1).toUpperCase() + m[2].slice(1, 3).toLowerCase()); return i < 0 ? "" : m[3] + "-" + String(i + 1).padStart(2, "0") + "-" + m[1].padStart(2, "0"); };
const toTime = (s) => { const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec((s || "").trim()); if (!m) return ""; let h = Number(m[1]); const ap = (m[3] || "").toUpperCase(); if (ap === "PM" && h < 12) h += 12; if (ap === "AM" && h === 12) h = 0; return String(h).padStart(2, "0") + ":" + m[2]; };
const showDate = (v) => { if (!v) return "—"; const [y, m, d] = v.split("-"); return d + " " + MON[Number(m) - 1] + " " + y; };
const showTime = (v) => { if (!v) return "—"; const [h, m] = v.split(":").map(Number); return ((h % 12) || 12) + ":" + String(m).padStart(2, "0") + " " + (h < 12 ? "AM" : "PM"); };
const PURPOSES = [["Career", "💼"], ["Business", "📈"], ["Marriage", "💍"], ["Others", "✨"]];

// Instant Call / Chat: birth details, then package, then review, then the existing request flow.
function InstantFlow({ a, kind, onClose }) {
  const app = useApp();
  const bp = app.instantBp || {};
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ name: bp.name || "", gender: "", pob: bp.pob || "", dob: toDate(bp.dob), tob: toTime(bp.tob), purpose: "Career", pName: "", pPob: "", pDob: "", pTob: "" });
  const [mins, setMins] = useState(PKGS[kind][0].mins);
  const [consent, setConsent] = useState(false);
  const [tried, setTried] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const pk = PKGS[kind].find((p) => p.mins === mins);
  const bad = { name: !f.name.trim(), gender: !f.gender, pob: !f.pob.trim(), dob: !f.dob, tob: !f.tob };
  const partnerPartial = [f.pName, f.pPob, f.pDob, f.pTob].some(Boolean) && ![f.pName, f.pPob, f.pDob, f.pTob].every(Boolean);
  const next1 = () => { setTried(true); if (Object.values(bad).some(Boolean) || partnerPartial) return; setTried(false); setStep(2); };
  const send = () => { if (!consent) return; if (app.instantSend(a.id, kind, mins, { ...f })) onClose(); };
  const low = pk.price > app.walletNow;
  return (
    <>
      <button className="if-scrim" tabIndex={-1} aria-label="Close" onClick={onClose} />
      <div className="if-dialog" role="dialog" aria-modal="true" aria-label={"Instant " + kind + " with " + a.name}>
        <div className="if-head">
          <div>
            <p className="if-step">{"Step " + step + " of 3"}</p>
            <h2>{step === 1 ? "Share your birth details" : step === 2 ? "Choose " + kind.toLowerCase() + " duration" : "Review and send request"}</h2>
            <p className="if-who">{"Instant " + kind + " with " + a.name}</p>
          </div>
          <button className="ico" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {step === 1 ? (
          <div className="if-body">
            <p className="if-note">{"Your astrologer needs these to read your chart before the " + kind.toLowerCase() + " begins. They are shared with " + a.name + " only for this paid service (D-37)."}</p>
            <div className="if-grid">
              <label className="if-f">Full name<input className="inp" value={f.name} onChange={set("name")} aria-invalid={tried && bad.name} />{tried && bad.name ? <em>Enter your name</em> : null}</label>
              <label className="if-f">Gender
                <select className="inp" value={f.gender} onChange={set("gender")} aria-invalid={tried && bad.gender}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option></select>
                {tried && bad.gender ? <em>Select a gender</em> : null}
              </label>
              <label className="if-f">Place of birth<input className="inp" placeholder="City, State, Country" value={f.pob} onChange={set("pob")} aria-invalid={tried && bad.pob} />{tried && bad.pob ? <em>Enter the place of birth</em> : null}</label>
              <label className="if-f">Date of birth<input className="inp" type="date" value={f.dob} onChange={set("dob")} aria-invalid={tried && bad.dob} />{tried && bad.dob ? <em>Enter the date of birth</em> : null}</label>
              <label className="if-f">Time of birth<input className="inp" type="time" value={f.tob} onChange={set("tob")} aria-invalid={tried && bad.tob} />{tried && bad.tob ? <em>Enter the time of birth</em> : null}</label>
            </div>
            <h3>{"Purpose of " + kind.toLowerCase()}</h3>
            <p className="if-note">{"Choose what you want to consult about:"}</p>
            <div className="if-tiles" role="radiogroup" aria-label="Purpose">
              {PURPOSES.map((p) => (
                <button key={p[0]} role="radio" aria-checked={f.purpose === p[0]} className={"if-tile" + (f.purpose === p[0] ? " on" : "")} onClick={() => setF({ ...f, purpose: p[0] })}><span aria-hidden="true">{p[1]}</span>{p[0]}</button>
              ))}
            </div>
            <h3>Partner birth details (optional)</h3>
            <p className="if-note">Add these only if you want your astrologer to match charts with a partner.</p>
            <div className="if-grid">
              <label className="if-f">Partner name<input className="inp" value={f.pName} onChange={set("pName")} /></label>
              <label className="if-f">Partner birth place<input className="inp" placeholder="City, State, Country" value={f.pPob} onChange={set("pPob")} /></label>
              <label className="if-f">Partner date of birth<input className="inp" type="date" value={f.pDob} onChange={set("pDob")} /></label>
              <label className="if-f">Partner birth time<input className="inp" type="time" value={f.pTob} onChange={set("pTob")} /></label>
            </div>
            {tried && partnerPartial ? <p className="if-err">Fill all four partner fields, or leave them all empty.</p> : null}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="if-body">
            <div className="if-pkgs" role="radiogroup" aria-label="Prepaid package">
              {PKGS[kind].map((p) => (
                <button key={p.mins} role="radio" aria-checked={mins === p.mins} className={"if-pkg" + (mins === p.mins ? " on" : "")} onClick={() => setMins(p.mins)}>
                  <b>{p.mins + " minutes"}</b><span>{"₹" + p.price}</span>{mins === p.mins ? <em>Selected</em> : null}
                </button>
              ))}
            </div>
            <p className="if-note">Packages start at 5 minutes. You pay the whole package before the session starts; ending early is not refunded (D-45).</p>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="if-body">
            <dl className="if-sum">
              <div><dt>Astrologer</dt><dd>{a.name}</dd></div>
              <div><dt>Birth details</dt><dd>{f.name + " · " + showDate(f.dob) + ", " + showTime(f.tob)}</dd></div>
              <div><dt>Purpose</dt><dd>{f.purpose}</dd></div>
              <div><dt>{kind + " package"}</dt><dd>{mins + " minutes"}</dd></div>
              <div><dt>Amount</dt><dd>{"₹" + pk.price}</dd></div>
              <div><dt>Wallet balance</dt><dd>{"₹" + Number(app.walletNow).toLocaleString("en-IN")}</dd></div>
            </dl>
            <label className="if-consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />{"I agree to share my birth details with " + a.name + " for this paid " + kind.toLowerCase() + " (D-37)."}</label>
            <p className="if-note">{"The astrologer must accept within 30 seconds. You pay ₹" + pk.price + " only after they accept, then the " + kind.toLowerCase() + " starts (D-44)."}{low ? " Your wallet balance is low, so you will be asked to add money at payment." : ""}</p>
          </div>
        ) : null}

        <div className="if-foot">
          {step === 1 ? <button className="btn-g" onClick={onClose}>Back</button> : <button className="btn-g" onClick={() => setStep(step - 1)}>{step === 2 ? "Back to birth details" : "Back"}</button>}
          {step === 1 ? <button className="btn-p" onClick={next1}>Continue</button> : null}
          {step === 2 ? <button className="btn-p" onClick={() => setStep(3)}>Continue</button> : null}
          {step === 3 ? <button className="btn-p" onClick={send} disabled={!consent}>Send request</button> : null}
        </div>
      </div>
    </>
  );
}

export default InstantFlow;
