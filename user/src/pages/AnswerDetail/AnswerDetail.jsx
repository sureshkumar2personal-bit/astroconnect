import React, { useEffect } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./AnswerDetail.css";

function AnswerDetail() {
  const app = useApp();
  const { needRate, rate } = app.ans;
  // A rating is required right after an answer is delivered (D-17).
  useEffect(() => {
    if (needRate && !app.dlgOn) rate();
  }, [needRate, app.ans.id]);
  return (
    <div className="answer-detail-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goActivity}>← Activity</button>
      </div>
      <h1 className="u-10">Your question</h1>
      <section className="card u-45">
        <div className="u-13">{"To "}{app.ans.who}{" · "}{app.ans.when}</div>
        <div className="answer-detail-1">{app.ans.title}</div>
        <div>
          <span className="pill" style={cssToStyle(app.ans.st)}>{app.ans.status}</span>
        </div>
      </section>
      {app.ansWaiting ? (
        <section className="card u-14">{"Waiting for "}{app.ans.who}{" to answer. Answer due by "}{app.ans.due}{" (30 days, IST). If it is not answered in time, the question is cancelled and refunded to your Wallet (D-18, D-32). We will notify you (critical alert · D-15)."}</section>
      ) : null}
      {app.ansCancelled ? (
        <section className="card u-14">{"Not answered within 30 days: this question was cancelled and the amount refunded to your Wallet (D-18, D-32)."}</section>
      ) : null}
      {app.ansDone ? (
        <div className="u-25">
          <section className="card answer-detail-2">
            <h2 className="u-41">Astrologer's answer</h2>
            <p className="answer-detail-3">{app.ans.answer}</p>
            {app.ans.rated ? <div className="u-13">{"Your rating: "}{app.ans.stars}{" · reviews cannot be edited or deleted"}</div> : <div><button className="btn-p" onClick={app.ans.rate}>Rate this answer (required)</button></div>}
            <button className="card hov answer-detail-4" onClick={app.goRemedy}>
              <span className="answer-detail-5">REMEDY ATTACHED</span>
              <span className="answer-detail-6">Open the Remedy Tracker to see the remedy attached to this answer.</span>
              <span className="u-21">Saved in your Remedy Tracker (D-11) ›</span>
            </button>
          </section>
          <section className="card u-29">
            <h2 className="u-41">Not satisfied?</h2>
            <div className="u-32">
              {"Dispute window: "}
              <strong>{app.ans.left}{" of 7 days left"}</strong>
            </div>
            <div className="answer-detail-7">
              <div style={cssToStyle(app.ans.bar)} />
            </div>
            <p className="u-33">You can dispute within 7 days of receiving the answer, to request an additional answer (D-08).</p>
            {app.ans.windowClosed ? <p className="u-33">The 7-day dispute window has closed (D-08).</p> : null}
            {app.ans.canDispute ? (
              <div>
                <button className="btn-p" onClick={app.ans.dispute}>Raise dispute</button>
              </div>
            ) : null}
            {app.ans.disputed ? (
              <span className="pill answer-detail-8">{"Dispute raised on "}{app.ans.dRaised}{" · one dispute per question (D-19)"}</span>
            ) : null}
            {app.ans.dAdmin ? <p className="u-33">The astrologer did not answer within 3 days, so the dispute moved to Admin Review (D-19).</p> : null}
            {app.ans.dAnswered ? (
              <div className="card answer-detail-2">
                <h2 className="u-41">Dispute answer</h2>
                <p className="answer-detail-3">{app.ans.dAnswerText}</p>
                <p className="u-33">No further dispute can be raised after the dispute answer (D-19).</p>
                {app.ans.canComplain ? (
                  <div>
                    <button className="btn-g" onClick={app.ans.complaint}>Raise Platform Complaint</button>
                    <span className="u-13">{" "}{app.ans.cLeft}{" of 7 days left"}</span>
                  </div>
                ) : null}
                {app.ans.complained ? <span className="pill answer-detail-8">Platform Complaint submitted</span> : null}
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default AnswerDetail;
