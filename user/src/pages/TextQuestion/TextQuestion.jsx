import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./TextQuestion.css";

function TextQuestion() {
  const app = useApp();
  return (
    <div className="text-question-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goServices}>← Services</button>
      </div>
      <h1 className="u-10">Text Question</h1>
      <div className="u-25">
        <div className="u-26">
          <section className="card u-27">
            <h2 className="u-28">1 · Choose an astrologer</h2>
            <div className="u-12">
              {app.pickList.map((p, i1) => (
                <Fragment key={i1}>
                  <button className={`${p.cls}`} onClick={p.go}>{p.name}</button>
                </Fragment>
              ))}
            </div>
          </section>
          {app.notSub ? (
            <section className="card u-29">
              <h2 className="u-28">Subscribe to ask</h2>
              <p className="u-30">{"You need to subscribe to "}{app.cur.name}{" before asking a question (D-04)."}</p>
              <div>
                <button className="btn-p" onClick={app.subscribeNow}>Subscribe</button>
              </div>
              <span className="tag u-24">Terms · PENDING · P-14-02</span>
            </section>
          ) : null}
          {app.isSub ? (
            <section className="card u-27">
              <h2 className="u-28">2 · Buy question slots</h2>
              {app.camps.map((c, i1) => (
                <Fragment key={i1}>
                  <div className="text-question-1">
                    <div className="text-question-2">
                      <div className="text-question-3">{c.name}</div>
                      <div className="u-13">{c.note}{" · ₹"}{c.price}{" per slot"}</div>
                    </div>
                    <button className="btn-p u-31" onClick={c.buy}>{"Buy "}{app.qty}{" · ₹"}{c.total}</button>
                  </div>
                </Fragment>
              ))}
              <div className="text-question-4">
                <span className="u-32">Slots</span>
                <button className="ico text-question-5" onClick={app.qtyDown} aria-label="Fewer slots">−</button>
                <span className="text-question-6">{app.qty}</span>
                <button className="ico text-question-5" onClick={app.qtyUp} aria-label="More slots">+</button>
              </div>
              <p className="u-33">
                Use a slot now or hold it. Slots expire 7 days after purchase, holding does not extend this, and expired slots are not refunded (D-05 – D-07).
              </p>
            </section>
          ) : null}
        </div>
        <section className="card u-27">
          <h2 className="u-28">3 · Ask your question</h2>
          <div>
            <span className="pill" style={cssToStyle(app.slotStyle)}>{app.slotsN}{" slot(s) available · "}{app.cur.name}</span>
          </div>
          <label className="u-11" htmlFor="dq">Your question</label>
          <textarea
            className="inp text-question-7"
            id="dq"
            rows="6"
            placeholder="Write your question for the astrologer…"
            value={app.draft ?? ""}
            onChange={app.onDraft}
          />
          <div>
            <button className="btn-p" onClick={app.submitQ}>Submit question</button>
          </div>
          <p className="u-15">Your question appears in Activity once sent. Answers can be disputed within 7 days (D-08).</p>
        </section>
      </div>
    </div>
  );
}

export default TextQuestion;
