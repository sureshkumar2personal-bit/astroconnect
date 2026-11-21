import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./Dialog.css";

function Dialog() {
  const app = useApp();
  if (!app.dlgOn) return null;
  return (
    <div className="dialog-overlay">
      <div className="card dialog-1" role="dialog" aria-label={app.dlgTitle}>
        <div className="dialog-2">
          <h2 className="u-47">{app.dlgTitle}</h2>
          {app.noClose ? null : <button className="ico u-46" onClick={app.closeDlg} aria-label="Close">✕</button>}
        </div>
        {app.dQrate ? (
          <>
            <p className="u-30">{app.rateNote}</p>
            <div className="dialog-3">
              {app.stars.map((st, i1) => (
                <Fragment key={i1}>
                  <button className={`${st.cls} dialog-4`} aria-label={st.label} onClick={st.go}>★</button>
                </Fragment>
              ))}
            </div>
            <label className="u-11" htmlFor="rn">Written review (optional)</label>
            <textarea className="inp" id="rn" rows="4" placeholder="Share your experience (optional)" value={app.note ?? ""} onChange={app.onNote} />
            <p className="u-15">A submitted review cannot be edited or deleted. Ask Platform Support for changes (D-17).</p>
            <div className="u-1">
              <button className="btn-p" onClick={app.submitRate}>Submit rating</button>
            </div>
          </>
        ) : null}
        {app.dRdone ? (
          <>
            <p className="u-30">{app.rdTitle}</p>
            <p className="u-15">Only you can mark a remedy Completed. You may attach a photo or document as proof; the astrologer who prescribed it can view it (D-29).</p>
            <label className="btn-g rd-file" htmlFor="rdf">Attach photo / document (optional)</label>
            <input id="rdf" className="tq-hidden" type="file" accept="image/*,.pdf,.doc,.docx,.txt" onChange={app.onRdFile} />
            {app.rdFile ? <div className="u-13">{"Attached: "}{app.rdFile}</div> : null}
            <div className="u-1">
              <button className="btn-p" onClick={app.confirmDone}>Mark Completed</button>
              <button className="btn-g" onClick={app.closeDlg}>Cancel</button>
            </div>
          </>
        ) : null}
        {app.dSubscribe ? (
          <>
            <p className="u-30">{"Subscribe to "}{app.subDlgName}{". Subscribing also follows them automatically (D-36)."}</p>
            <div className="u-12">
              {app.subTiers.map((t, i1) => (
                <Fragment key={i1}>
                  <button className={t.cls} onClick={t.go}>{t.label}</button>
                </Fragment>
              ))}
            </div>
            <p className="u-15">Benefit questions are shown separately from questions you buy, and are valid for 7 days (D-31).</p>
            <label className="tq-check"><input type="checkbox" checked={!!app.autoRen} onChange={app.toggleAutoRen} />{" Auto-renew (optional, off by default)"}</label>
            <div className="u-12">
              {app.payChips.map((c, i1) => (
                <Fragment key={i1}>
                  <button className={c.cls} onClick={c.go}>{c.label}</button>
                </Fragment>
              ))}
            </div>
            <span className="tag">Price, term, renewal and cancellation · PENDING · P-14-02 – P-14-05 (sample values)</span>
            <div className="u-1">
              <button className="btn-p" onClick={app.confirmSubscribe}>{"Subscribe · ₹"}{app.subPrice}</button>
              <button className="btn-g" onClick={app.closeDlg}>Cancel</button>
            </div>
          </>
        ) : null}
        {app.dPay ? (
          <>
            <div className="u-32">{app.payLabel}</div>
            <div className="u-32">{"Amount: ₹"}{app.payAmt}</div>
            <div className="u-12">
              {app.payMs.map((m, i1) => (
                <Fragment key={i1}>
                  <button className={m.cls} onClick={m.go}>{m.label}</button>
                </Fragment>
              ))}
            </div>
            {app.payIsUpi ? (
              <>
                <label className="u-11" htmlFor="upi">UPI ID</label>
                <input id="upi" className="inp" placeholder="name@bank" value={app.upi ?? ""} onChange={app.onUpi} />
              </>
            ) : <p className="u-15">You would be taken to your bank or card page here (sample).</p>}
            <p className="u-15">This payment does not use your Wallet (D-33). Sample screen: <span className="tag">PENDING · P-10-02</span></p>
            <div className="u-1">
              <button className="btn-p" onClick={app.confirmDirect}>{"Pay ₹"}{app.payAmt}</button>
              <button className="btn-g" onClick={app.closeDlg}>Cancel</button>
            </div>
          </>
        ) : null}
        {app.dScomplaint ? (
          <>
            <p className="u-30">Use this if the astrologer ended the session early without answering. The Platform investigates; no automatic refund is issued (D-45).</p>
            <label className="u-11" htmlFor="cn">What happened?</label>
            <textarea className="inp" id="cn" rows="4" placeholder="Describe what happened" value={app.note ?? ""} onChange={app.onNote} />
            <div className="u-1">
              <button className="btn-p" onClick={app.submitComplaint}>Submit complaint</button>
              <button className="btn-g" onClick={app.closeDlg}>Cancel</button>
            </div>
          </>
        ) : null}
        {app.dChatlog ? (
          app.cl.open ? (
            <>
              <div className="dialog-chat">
                {app.cl.msgs.map((m, i1) => (
                  <Fragment key={i1}>
                    <div style={cssToStyle(m.st)}>{m.t}</div>
                  </Fragment>
                ))}
              </div>
              <p className="u-15">{"Messages are visible for 24 hours after the chat ends - about "}{app.cl.hours}{" h left (D-47)."}</p>
            </>
          ) : (
            <p className="u-23">The 24-hour period has passed, so the chat messages are no longer available to you or the astrologer (D-47). Booking details, the date and time, astrologer details and payment records remain in Activity.</p>
          )
        ) : null}
        {app.dComplaint ? (
          <>
            <p className="u-30">Use this only for an inappropriate or improper answer, within 7 days of the dispute answer. The Platform handles complaints separately from disputes (D-27).</p>
            <label className="u-11" htmlFor="cn">What went wrong?</label>
            <textarea className="inp" id="cn" rows="4" placeholder="Describe the problem" value={app.note ?? ""} onChange={app.onNote} />
            <div className="u-1">
              <button className="btn-p" onClick={app.submitComplaint}>Submit complaint</button>
              <button className="btn-g" onClick={app.closeDlg}>Cancel</button>
            </div>
          </>
        ) : null}
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
              <span className="pill u-34">{app.dn.cat}{app.dn.crit ? " · Critical" : ""}</span>
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
            <div className="u-13">{app.rs.title}</div>
            <div className="u-32">{app.rs.when}{" · ₹"}{app.rs.price}</div>
            {app.rs.early ? (
              <p className="u-23">{"Free cancellation applies: more than 12 hours remain ("}{app.rs.hours}{" h). The full amount is refunded to your Wallet (D-41, D-32)."}</p>
            ) : (
              <p className="u-23">Less than 12 hours remain, so this is a late cancellation. A percentage deduction applies, but the percentage is not decided yet, so cancelling is not available.</p>
            )}
            <div className="u-1">
              <button className="btn-g" onClick={app.rs.resched} disabled={!app.rs.canR}>Reschedule (once)</button>
              <button className="btn-g" onClick={app.rs.cancel} disabled={!app.rs.early}>Cancel appointment</button>
            </div>
            {app.rs.canR ? null : <p className="u-15">You have already rescheduled this appointment once.</p>}
            {app.rs.early ? null : <span className="tag">Late-cancellation deduction · PENDING · AP-05-01</span>}
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
