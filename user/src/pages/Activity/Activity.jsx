import React, { Fragment, useEffect } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./Activity.css";

function Activity() {
  const app = useApp();
  // Coming from a Remedy Tracker link: scroll to and highlight the originating consultation (D-51).
  useEffect(() => {
    const el = app.focusId != null && document.getElementById("act-" + app.focusId);
    if (el) el.scrollIntoView({ block: "center" });
  }, []);
  return (
    <div className="activity-page page">
      <div>
        <h1 className="u-22">Activity</h1>
      </div>
      <div className="u-12">
        {app.actTabs.map((t, i1) => (
          <Fragment key={i1}>
            <button className={`${t.cls}`} onClick={t.go}>{t.label}</button>
          </Fragment>
        ))}
        <button className="chip" onClick={app.goApptHistory}>Appointment History ›</button>
      </div>
      {app.hasHeld ? (
        <button className="card hov activity-1" onClick={app.goText}>
          <span className="pill u-34">Held slots</span>
          <span className="activity-2">{app.heldText}</span>
        </button>
      ) : null}
      <div className="activity-3">
        {app.actList.map((x, i1) => (
          <Fragment key={i1}>
            <div className={x.focus ? "card activity-4 act-focus" : "card activity-4"} id={"act-" + x.id}>
              <div className="activity-5">
                <span className="pill u-9">{x.type}</span>
                <span className="activity-6">{x.who}{" · "}{x.when}</span>
                <span className="pill" style={cssToStyle(x.st)}>{x.status}</span>
              </div>
              <div className="u-35">{x.title}</div>
              {x.canView ? (
                <div>
                  <button className="btn-g u-16" onClick={x.view}>{x.viewLabel}</button>
                </div>
              ) : null}
              {x.canChatLog ? (
                <div className="u-36">
                  <button className="btn-g u-16" onClick={x.chatLog}>View chat messages</button>
                  <span className="u-21">Available for 24 hours after the chat only (D-47)</span>
                </div>
              ) : null}
              {x.apptInfo ? <div className="u-13">{x.apptInfo}</div> : null}
              {x.canJoin ? (
                <div className="u-36">
                  <button className="btn-p u-16" onClick={x.join}>Join consultation</button>
                </div>
              ) : null}
              {x.inProg ? (
                <div className="u-36">
                  <span className="u-13">{x.discNow ? "Connection lost - reconnecting for up to 5 minutes; your remaining time is preserved (D-42)." : "In progress. If you disconnect we reconnect automatically for 5 minutes and keep your remaining time (D-42)."}</span>
                </div>
              ) : null}
              {x.astroCx ? (
                <div className="u-36">
                  <span className="u-13">The astrologer cancelled. Choose a new time or a full refund to your Wallet (D-41).</span>
                  <button className="btn-p u-16" onClick={x.cxResched}>Reschedule</button>
                  <button className="btn-g u-16" onClick={x.cxRefund}>Full refund</button>
                </div>
              ) : null}
              {x.canResched ? (
                <div>
                  <button className="btn-g u-16" onClick={x.resched}>Reschedule or cancel</button>
                </div>
              ) : null}
              {x.corrActive ? (
                <div className="u-36">
                  <span className="u-13">{"The astrologer asked for a correction. Original deadline: "}{x.corrDue}{" (IST)."}</span>
                  <button className="btn-p u-16" onClick={x.corrReplace}>Replace question</button>
                </div>
              ) : null}
              {x.needRate ? (
                <div className="u-36">
                  <button className="btn-p u-16" onClick={x.rate}>{x.rateLabel}</button>
                </div>
              ) : null}
              {x.canDispute ? (
                <div className="u-36">
                  <button className="btn-g u-16" onClick={x.dispute}>Raise dispute</button>
                  <span className="u-21">{"Open for "}{x.dLeft}{" more day(s) · requests an additional answer"}</span>
                </div>
              ) : null}
              {x.canReview ? (
                <div>
                  <button className="btn-g u-16" onClick={x.review}>Write a review</button>
                </div>
              ) : null}
              {x.reviewed ? (
                <span className="activity-7">Review submitted</span>
              ) : null}
            </div>
          </Fragment>
        ))}
      </div>
      {app.noActs ? (
        <div className="card activity-8">
          <div className="activity-9">Nothing here yet</div>
          <div className="activity-10">Services you buy or use will appear here with their status.</div>
          <button className="btn-p" onClick={app.goServices}>Browse services</button>
        </div>
      ) : null}
    </div>
  );
}

export default Activity;
