import React, { Fragment, useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import "./Appointment.css";

function Appointment() {
  const app = useApp();
  const [, tick] = useState(0);
  // Re-render every second while a slot is held so the countdown stays live.
  useEffect(() => {
    if (!app.holdOn) return undefined;
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [app.holdOn]);
  return (
    <div className="appointment-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goServices}>← Services</button>
      </div>
      <h1 className="u-10">{app.isResched ? "Reschedule appointment" : "Book an appointment"}</h1>
      {app.isResched ? (
        <div className="card ap-banner">
          <span>{"Choosing a new time for "}{app.reschedTitle}{". Same astrologer and duration, no extra payment. You can reschedule once (D-41)."}</span>
          <button className="btn-g" onClick={app.cancelResched}>Cancel rescheduling</button>
        </div>
      ) : null}
      <div className="u-25">
        <section className="card u-27">
          <h2 className="u-28">1 · Astrologer</h2>
          <div className="u-12">
            {app.pickList.map((p, i1) => (
              <Fragment key={i1}>
                <button className={p.cls} onClick={p.go} disabled={app.isResched}>{p.name}</button>
              </Fragment>
            ))}
          </div>
          <h2 className="appointment-1">2 · Duration (voice only)</h2>
          <div className="u-12">
            {app.durs.map((d, i1) => (
              <Fragment key={i1}>
                <button className={d.cls} onClick={d.go} disabled={d.dis}>{d.label}</button>
              </Fragment>
            ))}
          </div>
          <h2 className="appointment-1">3 · Day (up to 90 days ahead)</h2>
          <div className="ap-days">
            <button className="ico ap-nav" onClick={app.weekPrev} disabled={app.weekPrevDis} aria-label="Earlier days">‹</button>
            <div className="u-12">
              {app.weekDays.map((d, i1) => (
                <Fragment key={i1}>
                  <button className={d.cls} onClick={d.go} disabled={d.dis}>{d.label}</button>
                </Fragment>
              ))}
            </div>
            <button className="ico ap-nav" onClick={app.weekNext} disabled={app.weekNextDis} aria-label="Later days">›</button>
          </div>
          <h2 className="appointment-1">4 · Time (IST)</h2>
          <div className="u-12">
            {app.slotList.map((d, i1) => (
              <Fragment key={i1}>
                <button className={d.cls} onClick={d.go} disabled={d.dis}>{d.label}</button>
              </Fragment>
            ))}
          </div>
          <p className="u-15">Greyed slots are already taken, held, or in the past. A slot can never be booked twice (D-40).</p>
        </section>
        <section className="card u-29">
          <h2 className="u-28">Summary</h2>
          <div className="appointment-2">{app.cur.name}</div>
          <div className="u-32">{app.apptDurLabel}{" · ₹"}{app.apptPrice}</div>
          <div className="u-32">{app.apptHasSel ? app.apptWhen : "Pick a day and time"}</div>
          {app.isResched ? (
            <div>
              <button className="btn-p" onClick={app.confirmResched}>Confirm new time</button>
            </div>
          ) : app.holdOn ? (
            <div className="ap-hold">
              <div className="ap-timer" role="timer">{"Slot held for "}{app.holdLeft}</div>
              <div className="u-13">{app.holdWhen}</div>
              <span className="u-13">Pay with</span>
              <div className="u-12">
                {app.payChips.map((c, i1) => (
                  <Fragment key={i1}>
                    <button className={c.cls} onClick={c.go}>{c.label}</button>
                  </Fragment>
                ))}
              </div>
              <div className="ap-actions">
                <button className="btn-p" onClick={app.payHold}>{"Pay & confirm"}</button>
                <button className="btn-g" onClick={app.releaseHold}>Release slot</button>
              </div>
              <p className="u-15">Payment confirms the appointment immediately, without astrologer approval. If payment fails or the 10 minutes pass, the slot is released (D-40).</p>
            </div>
          ) : (
            <div>
              <button className="btn-p" onClick={app.startHold}>Hold slot &amp; continue</button>
            </div>
          )}
          <p className="u-33">
            {"No dispute option for appointments (D-09). After the consultation you give a 1–5 rating (D-10). Cancel up to 12 hours before the start; reschedule once (D-41). Late-cancellation deduction: "}
            <span className="tag">PENDING · AP-05-01</span>
          </p>
        </section>
      </div>
      <section className="card ap-proto">
        <div className="ap-proto-title">Prototype controls (sample)</div>
        <div className="u-13">Simulate astrologer-side events to test the rules. Prices and slot availability are sample values.</div>
        <div className="ap-actions">
          <button className="chip" onClick={app.toggleDnd}>{"Put " + app.cur.name + " in Do Not Disturb"}</button>
          <button className="chip" onClick={app.protoCancel}>Astrologer cancels my next appointment</button>
          <button className="chip" onClick={app.protoDate}>Astrologer closes that date</button>
          {app.hasDnd ? <button className="chip" onClick={app.clearDnd}>{"Clear Do Not Disturb (" + app.dndOn + ")"}</button> : null}
        </div>
      </section>
    </div>
  );
}

export default Appointment;
