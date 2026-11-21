import React, { Fragment, useEffect, useState } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./Session.css";

function Session() {
  const app = useApp();
  const [, tick] = useState(0);
  const running = app.sesWait || app.sesLive;
  // One-second heartbeat: refreshes countdowns and lets the simulated astrologer respond.
  useEffect(() => {
    if (!running) return undefined;
    const t = setInterval(() => { tick((n) => n + 1); app.tickNow(); }, 1000);
    return () => clearInterval(t);
  }, [running]);
  // A rating is required right after a consultation (D-10).
  useEffect(() => {
    if (app.sesEnd && app.sesNeedRate && !app.dlgOn) app.rateSes();
  }, [app.sesEnd, app.sesNeedRate]);
  return (
    <div className="session-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goServices}>← Services</button>
      </div>
      <h1 className="u-10">{app.sesTitle}</h1>

      {app.sesIdle ? (
        <div className="u-25">
          <section className="card u-27">
            <h2 className="u-28">1 · Available astrologers</h2>
            <div className="u-12">
              {app.availList.map((p, i1) => (
                <Fragment key={i1}>
                  <button className={p.cls} onClick={p.go}>{p.name}</button>
                </Fragment>
              ))}
            </div>
            <p className="u-15">Only astrologers available for this service are shown. You are never routed to another astrologer automatically (D-44).</p>
            <h2 className="appointment-1">2 · Prepaid package</h2>
            <div className="u-12">
              {app.pkgList.map((p, i1) => (
                <Fragment key={i1}>
                  <button className={p.cls} onClick={p.go}>{p.label}</button>
                </Fragment>
              ))}
            </div>
            <p className="u-15">Packages start at 5 minutes. You pay the whole package before the session starts; ending early is not refunded (D-45).</p>
          </section>
          <section className="card u-29">
            <h2 className="u-28">Request</h2>
            <div className="ss-name">{app.cur.name}</div>
            <div className="u-32">{app.pkgLabel}</div>
            <div>
              <button className="btn-p" onClick={app.sendReq} disabled={!app.curAvail}>Send request</button>
            </div>
            <p className="u-33">The astrologer must accept within 30 seconds, otherwise the request expires. You can cancel before it is accepted (D-44).</p>
            <span className="tag u-24">{"Subscription requirement · PENDING · "}{app.pidSub}</span>
          </section>
        </div>
      ) : null}

      {app.sesWait ? (
        <section className="card ss-box">
          <h2 className="u-28">{"Waiting for "}{app.reqName}</h2>
          <div className="ss-timer" role="timer">{app.reqLeft}{"s left to accept"}</div>
          <div className="u-13">{app.reqPkg}</div>
          <div><button className="btn-g" onClick={app.cancelReq}>Cancel request</button></div>
        </section>
      ) : null}

      {app.sesFailed ? (
        <section className="card ss-box">
          <h2 className="u-28">{app.reqStatus}</h2>
          <p className="u-30">{app.reqMsg}</p>
          <div className="ss-row">
            <button className="btn-p" onClick={app.tryAgain}>Try Again</button>
            <button className="btn-g" onClick={app.tryOther}>Try Some Other Astrologer</button>
          </div>
        </section>
      ) : null}

      {app.sesAccepted ? (
        <section className="card ss-box">
          <h2 className="u-28">{app.reqName}{" accepted your request"}</h2>
          <p className="u-30">{"Pay the full package ("}{app.reqPkg}{") to start the session. The Wallet balance is ₹"}{app.wallet}{"."}</p>
          <span className="u-13">Pay with</span>
          <div className="u-12">
            {app.payChips.map((c, i1) => (
              <Fragment key={i1}>
                <button className={c.cls} onClick={c.go}>{c.label}</button>
              </Fragment>
            ))}
          </div>
          <div className="ss-row">
            <button className="btn-p" onClick={app.payStart}>Pay &amp; start</button>
            <button className="btn-g" onClick={app.cancelReq}>Cancel</button>
          </div>
        </section>
      ) : null}

      {app.sesLive ? (
        <section className="card ss-box">
          <div className="ss-head">
            <h2 className="u-28">{app.sesTitle}</h2>
            <span className="ss-timer" role="timer">{app.discNow ? "Paused · " : ""}{app.remText}{" left"}</span>
          </div>
          {app.discNow ? <p className="u-30">{"Connection lost. Reconnecting for up to 5 minutes; your remaining paid time is preserved (D-46). If reconnection fails permanently: "}<span className="tag">PENDING · AP-06-01</span></p> : null}
          {app.reconn && !app.discNow ? <p className="u-15">Reconnected. Your remaining time was preserved.</p> : null}
          {app.isChat ? (
            <>
              <div className="ss-msgs">
                {app.msgs.map((m, i1) => (
                  <Fragment key={i1}>
                    <div style={cssToStyle(m.st)}>{m.t}</div>
                  </Fragment>
                ))}
              </div>
              <div className="ss-row">
                <input id="cd" className="inp" placeholder="Type a message" value={app.chatDraft ?? ""} onChange={app.onChat} />
                <button className="btn-p" onClick={app.sendChat}>Send</button>
              </div>
              <p className="u-15">Messages are saved if you disconnect. Chat messages stay available for 24 hours only (D-46, D-47).</p>
            </>
          ) : (
            <p className="u-30">Voice call in progress with {app.cur.name}.</p>
          )}
          {app.extOffer ? (
            <div className="ss-ext" role="alert">
              <span>{"Your package ends in under a minute. Pay for the next package ("}{app.pkgLabel}{") before it ends to continue the same session; otherwise it ends automatically (D-45)."}</span>
              <button className="btn-p" onClick={app.extend}>Extend session</button>
              <span className="u-13">{app.payModeText}</span>
            </div>
          ) : null}
          <div className="ss-row">
            <button className="btn-g" onClick={app.endNow("user")}>End session</button>
          </div>
          <p className="u-15">Ending early is not refunded (D-45). No dispute option for this service (D-09).</p>
          <div className="ss-proto">
            <span className="u-13">Prototype controls (sample):</span>
            <button className="chip" onClick={app.addMin}>+1 minute</button>
            <button className="chip" onClick={app.disc} disabled={app.discNow}>Simulate disconnect</button>
            <button className="chip" onClick={app.endNow("astro")}>Astrologer ends early</button>
          </div>
        </section>
      ) : null}

      {app.sesEnd ? (
        <section className="card ss-box">
          <h2 className="u-28">Session ended</h2>
          <p className="u-30">{app.endSummary}</p>
          <div className="u-13">{app.endPaid}</div>
          <p className="u-15">It is now in Activity. A remedy from the astrologer is added to your Remedy Tracker (D-11).{app.isChat ? " Chat messages stay available for 24 hours (D-47)." : ""}</p>
          <div className="ss-row">
            {app.sesNeedRate ? <button className="btn-p" onClick={app.rateSes}>Rate this consultation (required)</button> : null}
            {app.astroEarly && !app.complained ? <button className="btn-g" onClick={app.complainSes}>Submit Platform complaint</button> : null}
            {app.complained ? <span className="pill ss-pill">Platform complaint submitted</span> : null}
            <button className="btn-g" onClick={app.startAnother}>Start another</button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default Session;
