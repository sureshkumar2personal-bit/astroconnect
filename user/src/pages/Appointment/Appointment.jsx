import React, { Fragment } from "react";
import { useApp } from "../../context/AppContext";
import "./Appointment.css";

function Appointment() {
  const app = useApp();
  return (
    <div className="appointment-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goServices}>← Services</button>
      </div>
      <h1 className="u-10">Book an appointment</h1>
      <div className="u-25">
        <section className="card u-27">
          <h2 className="u-28">1 · Astrologer</h2>
          <div className="u-12">
            {app.pickList.map((p, i1) => (
              <Fragment key={i1}>
                <button className={`${p.cls}`} onClick={p.go}>{p.name}</button>
              </Fragment>
            ))}
          </div>
          <h2 className="appointment-1">2 · Day</h2>
          <div className="u-12">
            {app.days.map((d, i1) => (
              <Fragment key={i1}>
                <button className={`${d.cls}`} onClick={d.go}>{d.label}</button>
              </Fragment>
            ))}
          </div>
          <h2 className="appointment-1">3 · Time</h2>
          <div className="u-12">
            {app.times.map((d, i1) => (
              <Fragment key={i1}>
                <button className={`${d.cls}`} onClick={d.go}>{d.label}</button>
              </Fragment>
            ))}
          </div>
          <span className="tag u-24">{"Booking window & durations · PENDING · P-07-01, P-07-02"}</span>
        </section>
        <section className="card u-29">
          <h2 className="u-28">Summary</h2>
          <div className="appointment-2">{app.cur.name}</div>
          <div className="u-32">{app.dayLabel}{" · "}{app.timeLabel}</div>
          <div className="u-32">Sample price ₹299 · wallet ₹{app.wallet}</div>
          <div>
            <button className="btn-p" onClick={app.bookAppt}>{"Confirm & pay"}</button>
          </div>
          <p className="u-33">
            {"No dispute option for appointments (D-09). You can write a review after the consultation (D-10). Reschedule / cancel — "}
            <span className="tag">PENDING · P-07-04, P-07-05</span>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Appointment;
