import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./Session.css";

function Session() {
  const app = useApp();
  return (
    <div className="session-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goServices}>← Services</button>
      </div>
      <h1 className="u-10">{app.sesTitle}</h1>
      {app.sesIdle ? (
        <section className="card session-1">
          <div className="u-12">
            {app.pickList.map((p, i1) => (
              <Fragment key={i1}>
                <button className={`${p.cls}`} onClick={p.go}>{p.name}</button>
              </Fragment>
            ))}
          </div>
          <div className="u-32">
            {app.cur.name}{" is "}
            <strong style={cssToStyle(app.onlineSt)}>{app.onlineTxt}</strong>
          </div>
          <div className="u-12">
            <span className="tag">{"Pricing · PENDING · "}{app.pidPrice}</span>
            <span className="tag">{"Minimum balance · PENDING · "}{app.pidMin}</span>
            <span className="tag">{"Subscription needed? · PENDING · "}{app.pidSub}</span>
          </div>
          <div>
            <button className="btn-p" onClick={app.startSes}>{app.startLabel}</button>
          </div>
        </section>
      ) : null}
      {app.sesConn ? (
        <section className="card session-2">{"Connecting to "}{app.cur.name}…</section>
      ) : null}
      {app.sesLive ? (
        <section className="card session-3">
          <div style={cssToStyle(app.cur.avL)}>{app.cur.ini}</div>
          <div className="u-40">{app.cur.name}</div>
          <span className="pill session-4">Connected</span>
          {app.isChat ? (
            <>
              <div className="session-5">
                {app.msgs.map((m, i1) => (
                  <Fragment key={i1}>
                    <div style={cssToStyle(m.st)}>{m.t}</div>
                  </Fragment>
                ))}
              </div>
              <div className="session-6">
                <label className="u-11" htmlFor="cd">Message</label>
                <input
                  className="inp"
                  id="cd"
                  placeholder="Type a message"
                  value={app.chatDraft ?? ""}
                  onChange={app.onChat}
                />
                <button className="btn-p" onClick={app.sendChat}>Send</button>
              </div>
            </>
          ) : null}
          {app.isCall ? (
            <p className="u-23">Call in progress (demo)</p>
          ) : null}
          <button className="btn-g session-7" onClick={app.endSes}>End session</button>
        </section>
      ) : null}
      {app.sesEnd ? (
        <section className="card session-8">
          <h2 className="session-9">Session ended</h2>
          <p className="u-30">
            It is now in Activity. A remedy from the astrologer is added to your Remedy Tracker (D-11). There is no dispute option for this service (D-09).
          </p>
          <div className="u-1">
            <button className="btn-p" onClick={app.reviewLast}>Write a review</button>
            <button className="btn-g" onClick={app.goActivity}>Open Activity</button>
            <button className="btn-g" onClick={app.goRemedy}>Remedy Tracker</button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default Session;
