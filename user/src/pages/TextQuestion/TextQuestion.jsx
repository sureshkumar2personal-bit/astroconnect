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
              {app.tqSuspCur ? <div className="tq-warn" role="alert">Text Questions are suspended for this astrologer: new slots cannot be bought. Your valid slots stay usable and submitted questions continue (D-39).</div> : null}
              <span className="u-13">Pay with</span>
              <div className="u-12">
                {app.payChips.map((c, i1) => (
                  <Fragment key={i1}>
                    <button className={c.cls} onClick={c.go}>{c.label}</button>
                  </Fragment>
                ))}
              </div>
              {app.camps.map((c, i1) => (
                <Fragment key={i1}>
                  <div className="text-question-1 tq-camp">
                    <div className="tq-head">
                      <span className="text-question-3">{c.name}</span>
                      {c.special ? <span className="tag">{c.special}</span> : null}
                    </div>
                    <div className="u-13">{c.note}{" · "}{c.expText}</div>
                    {c.hasWarn ? <div className="tq-warn" role="alert">{c.warn}</div> : null}
                    {c.types.map((t, i2) => (
                      <Fragment key={i2}>
                        <div className="tq-row">
                          <div className="tq-price">
                            <strong>{t.label}</strong>
                            {t.hasDisc ? (
                              <span className="tq-old">{"₹"}{t.price}</span>
                            ) : null}
                            {t.hasDisc ? <span className="pill tq-disc">{t.disc}{"% off"}</span> : null}
                            <span className="tq-final">{"₹"}{t.final}{" per slot"}</span>
                          </div>
                          <button className="btn-p u-31" onClick={t.buy}>{"Buy "}{app.qty}{" · ₹"}{t.total}</button>
                        </div>
                      </Fragment>
                    ))}
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
                Use a slot now or hold it. A slot expires at the earlier of 7 days after purchase and the campaign end date (IST). Holding does not extend this, and expired slots are not refunded (D-05 – D-07).
              </p>
              <span className="tag u-24">Campaign limits · PENDING · P-06-13</span>
            </section>
          ) : null}
        </div>
        <section className="card u-27">
          <h2 className="u-28">3 · Ask your question</h2>
          <div className="tq-types">
            {app.typeOpts.map((t, i1) => (
              <Fragment key={i1}>
                <button className={t.cls} onClick={t.go}>{t.label}</button>
              </Fragment>
            ))}
          </div>
          <div>
            <span className="pill" style={cssToStyle(app.slotStyle)}>{app.slotsN}{" "}{app.askType}{" slot(s) available · "}{app.cur.name}</span>
            {app.benefitN ? <span className="pill tq-ben">{app.benefitN}{" subscription benefit question(s) included"}</span> : null}
          </div>
          {app.previewOn ? (
            <div className="tq-preview">
              <h3 className="tq-prev-title">Preview your question</h3>
              <div className="u-13">{app.askType}{" Question · "}{app.cur.name}</div>
              <p className="tq-prev-text">{app.pvText}</p>
              <div className="u-13">{"Attachments: "}{app.pvAtt}</div>
              {app.isPers ? (
                <label className="tq-check tq-consent"><input type="checkbox" checked={!!app.consentChk} onChange={app.toggleConsent} />{" I consent to share my birth details and horoscope with "}{app.cur.name}{" for this paid Personal Question (D-37)."}</label>
              ) : null}
              <p className="u-15">After final submission the question cannot be edited or cancelled (D-24, D-34).</p>
              <div className="tq-actions">
                <button className="btn-p" onClick={app.submitFinal}>Submit final</button>
                <button className="btn-g" onClick={app.backEdit}>Edit</button>
              </div>
            </div>
          ) : (
            <>
              <label className="u-11" htmlFor="dq">Your question</label>
              <textarea
                className="inp text-question-7"
                id="dq"
                rows="6"
                maxLength="1000"
                placeholder="Write your question for the astrologer…"
                value={app.draft ?? ""}
                onChange={app.onDraft}
              />
              <div className="u-15">{app.qLen}{" / 1,000 characters"}</div>
              {app.isGen ? <p className="u-15">General Questions are answered without your birth chart and allow no attachments (D-20, D-22).</p> : null}
              {app.isPers ? (
                <div className="tq-attach">
                  <p className="u-15">Personal Questions are answered using your horoscope: attach up to 2 files (PDF or JPEG, 10 MB each) or use your saved birth details (D-22, D-35).</p>
                  <label className="btn-g tq-file" htmlFor="qf">Attach PDF / JPEG</label>
                  <input id="qf" className="tq-hidden" type="file" accept=".pdf,.jpg,.jpeg" multiple onChange={app.onQFile} />
                  {app.qFiles.map((f, i1) => (
                    <Fragment key={i1}>
                      <span className="chip tq-chip">{f.name}{" "}<button className="tq-x" aria-label={"Remove " + f.name} onClick={app.rmQFile(f.name)}>✕</button></span>
                    </Fragment>
                  ))}
                  <label className="tq-check"><input type="checkbox" checked={!!app.useSaved} onChange={app.toggleSaved} />{" Use birth details saved in my profile"}</label>
                  <span className="tag u-24">Birth profile choice · PENDING · P-06-07</span>
                </div>
              ) : null}
              <div>
                <button className="btn-p" onClick={app.goPreview}>Preview question</button>
              </div>
            </>
          )}
          <p className="u-15">Your question appears in Activity once sent. Answers can be disputed within 7 days (D-08).</p>
        </section>
      </div>
      <section className="card u-27">
        <h2 className="u-28">Your held slots</h2>
        {app.hasSlots ? (
          <>
            {app.mySlotsBen.length ? <div className="u-13">Subscription benefit questions (shown separately)</div> : null}
            {app.mySlotsBen.map((m, i1) => (
              <Fragment key={i1}>
                <div className="tq-slot"><strong>{m.text}</strong><span className="u-13">{m.exp}</span></div>
              </Fragment>
            ))}
            {app.mySlotsPaid.length ? <div className="u-13">Questions you bought</div> : null}
            {app.mySlotsPaid.map((m, i1) => (
              <Fragment key={i1}>
                <div className="tq-slot"><strong>{m.text}</strong><span className="u-13">{m.exp}</span></div>
              </Fragment>
            ))}
          </>
        ) : <p className="u-15">No unused slots. Slots expire at the earlier of 7 days after purchase and the campaign end, with no refund (D-07). You get reminders 3, 2 and 1 day before (D-26).</p>}
      </section>
      <section className="card tq-ctl">
        <div className="tq-ctl-title">Prototype controls: astrologer changes a campaign (sample)</div>
        <div className="u-13">Cancelling refunds unused slots to your Wallet. Deleting refunds nothing and keeps each slot's original deadline. Reducing never cancels purchases or questions. Extending also extends unused slots. Reactivating does not restore expired slots (D-21).</div>
        {app.campCtl.map((c, i1) => (
          <Fragment key={i1}>
            <div className="tq-ctl-row">
              <div className="tq-ctl-name"><strong>{c.name}</strong><span className="u-13">{c.statusText}</span></div>
              <div className="tq-ctl-btns">
                <button className="chip" onClick={c.cancel}>Cancel</button>
                <button className="chip" onClick={c.del}>Delete</button>
                <button className="chip" onClick={c.reduce}>Reduce slots</button>
                <button className="chip" onClick={c.extend}>Extend +7 days</button>
                <button className="chip" onClick={c.reactivate}>Reactivate</button>
              </div>
            </div>
          </Fragment>
        ))}
      </section>
    </div>
  );
}

export default TextQuestion;
