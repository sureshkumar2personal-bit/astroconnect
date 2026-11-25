import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import AstroAvatar from "../../components/AstroAvatar/AstroAvatar";
import { PKGS } from "../../data/mockData";
import { useInstant, PACKAGES, WAIT_LIMIT } from "./InstantContext";
import { KIND, METHODS, inr, showDate, showTime } from "./instantUtils";

// Step 2 of the Instant flow: prepaid package and payment (D-33, D-45).
function InstantPay() {
  const app = useApp();
  const navigate = useNavigate();
  const { bk, patchBk, det, payErr, confirmPay, priceOf, waitingCount } = useInstant();
  if (!bk) return <Navigate to="/services/call" replace />;
  const a = app.exCards.find((x) => x.id === bk.astroId);
  if (!a) return <Navigate to="/services/call" replace />;
  const k = KIND[bk.kind];
  const wl = bk.mode === "waitlist";
  const price = priceOf(bk.kind, bk.mins);
  const wallet = app.walletNow;
  const method = !bk.method || (bk.method === "wallet" && wallet < price) ? (wallet >= price ? "wallet" : "upi") : bk.method;
  const rows = [["Service", k.label + (wl ? " (waiting list)" : "")], ["Selected duration", bk.mins + " min"], ["Package total", inr(price)], ["Wallet balance", inr(wallet)], ["Paying with", METHODS[method].name]];
  const mine = [["Full name", det.name], ["Date of birth", showDate(det.dob)], ["Time of birth", showTime(det.tob)], ["Place of birth", det.pob || "Not provided"], ["Horoscope", det.file && det.file.status === "done" ? det.file.name : "Not uploaded"]];
  return (
    <div className="in-page page">
      <div><button className="btn-g u-16" onClick={() => navigate("/services/instant/details")}>← Your Consultation Details</button></div>
      <div className="in-head">
        <h1 className="in-h1">Booking &amp; Payment</h1>
        <p className="in-sub">{wl ? "Your waiting-list spot is assigned only after payment succeeds." : "Your " + k.name.toLowerCase() + " starts automatically once payment succeeds."}</p>
      </div>
      {payErr ? <div className="in-alert" role="alert"><b>{payErr.t}</b>{payErr.d}</div> : null}
      <div className="in-cols">
        <div className="in-main">
          <section className="card in-card">
            <div className="in-who2"><AstroAvatar id={a.id} size={52} name={a.name} /><div><b>{a.name}</b></div><span className="in-pill">{k.label}</span></div>
            {wl ? <div className="in-info"><b>{"Waiting-list booking, spot " + (waitingCount(a.id) + 1) + " of " + WAIT_LIMIT}</b> We check the list again just before charging you. If it can’t be honoured, the full amount is refunded automatically.</div> : null}
            <h2>Prepaid package <small>minimum 5 min (D-45)</small></h2>
            <div className="in-opts" role="radiogroup" aria-label="Package">
              {PACKAGES.map((m) => (
                <button key={m} role="radio" aria-checked={bk.mins === m} className={"in-opt" + (bk.mins === m ? " on" : "")} onClick={() => patchBk({ mins: m })}>
                  <b>{m} <small>min</small></b><span>{inr(PKGS[k.name].find((p) => p.mins === m).price)}</span>{m === 5 ? <em>Minimum</em> : null}
                </button>
              ))}
            </div>
            <h2>Payment method</h2>
            <div className="in-methods" role="radiogroup" aria-label="Payment method">
              {Object.entries(METHODS).map(([key, m]) => {
                const dis = key === "wallet" && wallet < price;
                return (
                  <button key={key} role="radio" aria-checked={method === key} disabled={dis} className={"in-method" + (method === key ? " on" : "")} onClick={() => patchBk({ method: key })}>
                    <span className="in-dot" aria-hidden="true" />
                    <span><b>{m.name}</b><small>{key === "wallet" ? "Balance " + inr(wallet) + (dis ? ", not enough for this package" : "") : m.sub}</small></span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
        <aside className="card in-card in-summary">
          <h2>Summary</h2>
          <dl className="in-dl">{rows.map((r) => (<div key={r[0]}><dt>{r[0]}</dt><dd>{r[1]}</dd></div>))}</dl>
          <div className="in-total"><span>Final payable</span><b>{inr(price)}</b></div>
          <h2 className="in-row">Your details <button className="in-link" onClick={() => navigate("/services/instant/details")}>Edit</button></h2>
          <dl className="in-dl">{mine.map((r) => (<div key={r[0]}><dt>{r[0]}</dt><dd>{r[1]}</dd></div>))}</dl>
        </aside>
      </div>
      <div className="in-bar-actions in-sticky">
        <div className="in-due"><small>{bk.mins + " min, " + METHODS[method].name}</small><b>{inr(price)}</b></div>
        <button className="btn-p" onClick={() => { patchBk({ method }); confirmPay(); }}>{wl ? "Confirm Payment & Join Waiting List" : "Confirm Payment & Start " + k.name}</button>
      </div>
    </div>
  );
}

export default InstantPay;
