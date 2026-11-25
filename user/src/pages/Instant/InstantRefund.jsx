import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useInstant } from "./InstantContext";
import { KIND, METHODS, inr } from "./instantUtils";

const TEXT = {
  race: ["Waiting list filled during your payment", "Another user’s payment was confirmed first. We cancelled your request immediately and started a full refund.", "List was full when payment was captured"],
  timeout: ["Waiting time limit reached", "Your request reached AstroConnect’s configured waiting time, so it was cancelled and your spot released.", "Configured waiting time reached"],
  manual: ["You left the waiting list", "Your spot has been released. The refund follows AstroConnect’s cancellation policy.", "Cancelled by you before the consultation"],
};

// Full refund after a waiting-list booking is cancelled (race, timeout, or the user leaving).
function InstantRefund() {
  const app = useApp();
  const navigate = useNavigate();
  const { refund: r } = useInstant();
  if (!r) {
    return (
      <div className="in-page page">
        <div className="card in-card in-empty"><h2>Refund</h2><p>No refund in progress.</p><button className="btn-p" onClick={() => navigate("/services/call")}>Back to Instant Call</button></div>
      </div>
    );
  }
  const a = app.exCards.find((x) => x.id === r.astroId);
  const done = r.status === "done";
  const T = TEXT[r.type];
  const rows = [["Astrologer", a ? a.name : ""], ["Service", KIND[r.kind].label + " waiting list"], ["Refund amount", inr(r.price) + " (full)"], ["Refund to", METHODS[r.method].name], ["Refund reference", r.ref], ["Original payment", r.payRef]];
  const steps = [["Payment received", inr(r.price), true], ["Request cancelled, spot released", T[2], true], ["Refund initiated", r.at, true], [done ? "Refund completed" : "Refund processing", done ? r.doneAt : "Timing depends on your payment method", done]];
  return (
    <div className="in-page page">
      <section className="card in-card in-refund">
        <h1>{done ? "Refund completed" : T[0]}</h1>
        <p>{done ? inr(r.price) + " has been returned to your " + METHODS[r.method].name + "." : T[1]}</p>
        <dl className="in-dl">{rows.map((x) => (<div key={x[0]}><dt>{x[0]}</dt><dd>{x[1]}</dd></div>))}</dl>
        <ol className="in-steps">{steps.map((st, i) => (<li key={i} className={st[2] ? "ok" : ""}><span aria-hidden="true">{st[2] ? "✓" : ""}</span><div><b>{st[0]}</b><small>{st[1]}</small></div></li>))}</ol>
        <button className="btn-p" onClick={() => navigate("/services/" + r.kind)}>Back to {KIND[r.kind].label}</button>
      </section>
    </div>
  );
}

export default InstantRefund;
