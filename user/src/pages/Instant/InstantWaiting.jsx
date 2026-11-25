import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import AstroAvatar from "../../components/AstroAvatar/AstroAvatar";
import { useInstant, WAIT_LIMIT } from "./InstantContext";
import { KIND, METHODS, inr } from "./instantUtils";

// Paid waiting list: position, who is ahead, leave, and start when it is your turn.
function InstantWaiting() {
  const app = useApp();
  const navigate = useNavigate();
  const { wait, myPos, leaveWait, startFromWait, others } = useInstant();
  const [ask, setAsk] = useState(false);
  if (!wait) {
    return (
      <div className="in-page page">
        <div><button className="btn-g u-16" onClick={() => navigate("/services/call")}>← Instant consultations</button></div>
        <div className="card in-card in-empty"><h2>Waiting list</h2><p>You have no active waiting request.</p></div>
      </div>
    );
  }
  const a = app.exCards.find((x) => x.id === wait.astroId);
  const k = KIND[wait.kind];
  const ready = wait.state === "ready";
  const ahead = others[wait.astroId] || 0;
  const slots = Array.from({ length: WAIT_LIMIT }, (_, i) => (i + 1 === myPos ? "You" : i + 1 < myPos ? "Paid user" : i < ahead + 1 && i + 1 > myPos ? "Paid user" : "Open"));
  const rows = [["Payment", "Successful"], ["Package", wait.mins + " min " + k.name.toLowerCase()], ["Paid", inr(wait.price)], ["Payment reference", wait.payRef], ["Expected wait", "No reliable estimate yet"], ["Notifications", "On for position changes"]];
  return (
    <div className="in-page page">
      <div><button className="btn-g u-16" onClick={() => navigate("/services/" + wait.kind)}>← Instant consultations</button></div>
      <section className="card in-card in-wait">
        <div className="in-who2"><AstroAvatar id={a.id} size={52} name={a.name} /><div><small>{ready ? "Your turn with" : "Waiting for"}</small><b>{a.name}</b></div><span className="in-pill">{k.label}</span></div>
        {ready ? (
          <div className="in-ready">
            <h1>{a.name + " is ready for you"}</h1>
            <p>{"Your prepaid " + wait.mins + "-minute " + k.name.toLowerCase() + " can start now."}</p>
            <button className="btn-p" onClick={startFromWait}>{"Start " + k.name}</button>
          </div>
        ) : (
          <>
            <div className="in-pos"><small>Your position</small><b>{myPos} <span>of {WAIT_LIMIT}</span></b></div>
            <ol className="in-slots" aria-label="Waiting list">
              <li className="now"><b>Now</b>In session</li>
              {slots.map((s, i) => (<li key={i} className={s === "You" ? "me" : s === "Open" ? "open" : ""}><b>{i + 1}</b>{s}</li>))}
            </ol>
            <p className="in-note">The person in session isn’t counted. Order follows payment confirmation time.</p>
          </>
        )}
        <dl className="in-dl">{rows.map((r) => (<div key={r[0]}><dt>{r[0]}</dt><dd>{r[1]}</dd></div>))}</dl>
        <div className="in-info">If your request isn’t picked up within AstroConnect’s configured waiting time, it’s cancelled, your spot is released and the full amount is refunded automatically.</div>
        <button className="btn-g in-leave" onClick={() => setAsk(true)}>Leave Waiting List</button>
      </section>
      {ask ? (
        <>
          <button className="in-scrim" aria-label="Close" onClick={() => setAsk(false)} />
          <div className="in-modal" role="alertdialog" aria-modal="true" aria-label="Leave the waiting list">
            <h3>Leave the waiting list?</h3>
            <p>{"Your spot is released and " + inr(wait.price) + " is refunded to your " + METHODS[wait.method].name + "."}</p>
            <div className="in-modal-acts"><button className="btn-g" onClick={() => setAsk(false)}>Stay in list</button><button className="btn-p" onClick={() => { setAsk(false); leaveWait(); }}>Leave Waiting List</button></div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default InstantWaiting;
