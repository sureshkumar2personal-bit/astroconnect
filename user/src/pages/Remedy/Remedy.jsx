import React, { Fragment } from "react";
import { useApp } from "../../context/AppContext";
import "./Remedy.css";

function Remedy() {
  const app = useApp();
  return (
    <div className="remedy-page page">
      <div>
        <h1 className="u-22">Remedy Tracker</h1>
        <p className="u-23">Every remedy, note, recommendation and report an astrologer prescribes or attaches, from any service (D-11, D-51).</p>
      </div>
      <div className="u-18">
        {app.remedies.map((r, i1) => (
          <Fragment key={i1}>
            <div className="card u-45 rm-card">
              <div className="rm-head">
                <span className="pill rm-kind">{r.kindLabel}</span>
                {r.isDone ? <span className="pill rm-done">Completed ✓</span> : null}
              </div>
              <div className="u-35">{r.title}</div>
              <div className="u-13">{r.srcText}</div>
              {r.isDone ? <div className="u-13">{r.doneText}</div> : null}
              <div className="rm-actions">
                {r.canView ? <button className="chip" onClick={r.view}>View consultation ›</button> : null}
                {r.canDone ? <button className="btn-g rm-btn" onClick={r.mark}>Mark Completed</button> : null}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      {app.noRem ? (
        <div className="card u-39">
          <div className="u-40">No remedies yet</div>
          <div className="remedy-1">
            {"Remedies, notes and reports from any service will appear here. "}
            <span className="tag">Fields · PENDING · P-16-01</span>
          </div>
        </div>
      ) : null}
      <p className="u-15">
        {"Only you can mark a remedy Completed, and you can attach a photo or document that the prescribing astrologer can view (D-29). "}
        <span className="tag">Reminders · PENDING · P-16-03</span>{" "}
        <span className="tag">Your own remedies · PENDING · P-16-04</span>{" "}
        <span className="tag">Astrologer edits · PENDING · P-16-06</span>
      </p>
    </div>
  );
}

export default Remedy;
