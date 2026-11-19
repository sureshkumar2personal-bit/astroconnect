import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./Activity.css";

function Activity() {
  const app = useApp();
  return (
    <div className="activity-page page">
      <div>
        <h1 className="u-22">Activity</h1>
        <p className="u-23">Services you have already bought or used.</p>
      </div>
      <div className="u-12">
        {app.actTabs.map((t, i1) => (
          <Fragment key={i1}>
            <button className={`${t.cls}`} onClick={t.go}>{t.label}</button>
          </Fragment>
        ))}
      </div>
      {app.hasHeld ? (
        <button className="card hov activity-1" onClick={app.goText}>
          <span className="pill u-34">Held slots</span>
          <span className="activity-2">{app.heldText}</span>
          <span className="tag">Placement · PENDING · P-01-09</span>
        </button>
      ) : null}
      <div className="activity-3">
        {app.actList.map((x, i1) => (
          <Fragment key={i1}>
            <div className="card activity-4">
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
              {x.canResched ? (
                <div>
                  <button className="btn-g u-16" onClick={x.resched}>Reschedule or cancel</button>
                </div>
              ) : null}
              {x.canDispute ? (
                <div className="u-36">
                  <button className="btn-g u-16" onClick={x.dispute}>Raise dispute</button>
                  <span className="u-21">Open for 5 more days · requests an additional answer</span>
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
