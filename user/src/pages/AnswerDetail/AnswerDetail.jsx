import React from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./AnswerDetail.css";

function AnswerDetail() {
  const app = useApp();
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
        <section className="card u-14">{"Waiting for "}{app.ans.who}{" to answer. We will notify you (critical alert · D-15)."}</section>
      ) : null}
      {app.ansDone ? (
        <div className="u-25">
          <section className="card answer-detail-2">
            <h2 className="u-41">Astrologer's answer</h2>
            <p className="answer-detail-3">
              Sample answer: your chart shows a supportive period for change between March and June. Prepare early and avoid signing anything in the first week of April.
            </p>
            <button className="card hov answer-detail-4" onClick={app.goRemedy}>
              <span className="answer-detail-5">REMEDY ATTACHED</span>
              <span className="answer-detail-6">Chant a short mantra on Thursday mornings.</span>
              <span className="u-21">Also saved in your Remedy Tracker (D-11) ›</span>
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
            {app.ans.canDispute ? (
              <div>
                <button className="btn-p" onClick={app.ans.dispute}>Raise dispute</button>
              </div>
            ) : null}
            {app.ans.disputed ? (
              <span className="pill answer-detail-8">Dispute raised — additional answer requested</span>
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default AnswerDetail;
