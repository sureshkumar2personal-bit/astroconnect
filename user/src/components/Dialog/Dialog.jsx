import React, { Fragment } from "react";
import { useApp } from "../../context/AppContext";
import "./Dialog.css";

function Dialog() {
  const app = useApp();
  if (!app.dlgOn) return null;
  return (
    <div className="dialog-overlay">
      <div className="card dialog-1" role="dialog" aria-label={app.dlgTitle}>
        <div className="dialog-2">
          <h2 className="u-47">{app.dlgTitle}</h2>
          <button className="ico u-46" onClick={app.closeDlg} aria-label="Close">✕</button>
        </div>
        {app.dReview ? (
          <>
            <div className="dialog-3">
              {app.stars.map((st, i1) => (
                <Fragment key={i1}>
                  <button className={`${st.cls} dialog-4`} aria-label={st.label} onClick={st.go}>★</button>
                </Fragment>
              ))}
            </div>
            <label className="u-11" htmlFor="rn">Review</label>
            <textarea
              className="inp"
              id="rn"
              rows="4"
              placeholder="Share your experience (optional)"
              value={app.note ?? ""}
              onChange={app.onNote}
            />
            <span className="tag u-24">{"Rating scale, edit & time limit · PENDING · P-07-10"}</span>
            <div className="u-1">
              <button className="btn-p" onClick={app.submitReview}>Submit review</button>
              <button className="btn-g" onClick={app.closeDlg}>Cancel</button>
            </div>
          </>
        ) : null}
        {app.dDispute ? (
          <>
            <p className="dialog-5">
              A dispute asks the astrologer for an additional answer. It must be raised within 7 days of receiving the answer (D-08).
            </p>
            <label className="u-11" htmlFor="dn">Reason</label>
            <textarea
              className="inp"
              id="dn"
              rows="4"
              placeholder="What was missing from the answer?"
              value={app.note ?? ""}
              onChange={app.onNote}
            />
            <div className="u-1">
              <button className="btn-p" onClick={app.submitDispute}>Submit dispute</button>
              <button className="btn-g" onClick={app.closeDlg}>Cancel</button>
            </div>
          </>
        ) : null}
        {app.dNotif ? (
          <>
            <div>
              <span className="pill u-34">{app.dn.cat}{" · Critical"}</span>
            </div>
            <p className="dialog-6">{app.dn.text}</p>
            <div className="u-21">{app.dn.time}{" · sample · delivered by push and in-app (D-16)"}</div>
            <div className="u-1">
              <button className="btn-p" onClick={app.dn.go}>{app.dn.cta}</button>
              <button className="btn-g" onClick={app.closeDlg}>Close</button>
            </div>
          </>
        ) : null}
        {app.dResched ? (
          <>
            <p className="u-23">Rules are not decided yet, so these actions are not available.</p>
            <div className="u-1">
              <button className="btn-g u-42" disabled>Reschedule</button>
              <button className="btn-g u-42" disabled>Cancel appointment</button>
            </div>
            <div className="u-12">
              <span className="tag">Reschedule · PENDING · P-07-04</span>
              <span className="tag">Cancel · PENDING · P-07-05</span>
            </div>
          </>
        ) : null}
        {app.dReport ? (
          <>
            <p className="u-23">Whether users can share or report an astrologer profile is not decided.</p>
            <button className="btn-g dialog-7" disabled>Report or share</button>
            <span className="tag u-24">PENDING · P-05-05</span>
          </>
        ) : null}
        {app.dTerms ? (
          <>
            <div className="dialog-8">
              {app.terms.map((t, i1) => (
                <Fragment key={i1}>
                  <div className="dialog-9">
                    <span>{t.l}</span>
                    <span className="tag">{"PENDING · "}{t.p}</span>
                  </div>
                </Fragment>
              ))}
            </div>
            <p className="u-15">A subscription is required before asking a Text Question (D-04).</p>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Dialog;
