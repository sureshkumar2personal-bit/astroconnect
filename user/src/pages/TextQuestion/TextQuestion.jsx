import React, { Fragment, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useApp, cssToStyle } from "../../context/AppContext";
import AstroAvatar from "../../components/AstroAvatar/AstroAvatar";
import "./TextQuestion.css";

function Facts({ a }) {
  return (
    <div className="tx-facts">
      <span>{a.ratingText}</span>
      <span>{a.years}</span>
      <span className={"pill ex-avail " + a.availCls}>{a.avail}</span>
    </div>
  );
}

function PickAstrologer() {
  const app = useApp();
  const [subShown, setSubShown] = useState(6);
  const [recShown, setRecShown] = useState(6);
  return (
    <>
      <section className="tx-block">
        <h2 className="tx-h2">Choose astrologer</h2>
        <p className="u-33">Astrologers you are subscribed to. A subscription is needed before you can ask an astrologer a question (D-04).</p>
        {app.txSub.length ? <div className="u-13">{"Showing "}{Math.min(subShown, app.txSub.length)}{" of "}{app.txSub.length}</div> : null}
        <div className="tx-grid">
          {app.txSub.slice(0, subShown).map((a, i1) => (
            <Fragment key={i1}>
              <article className="card tx-card">
                <button className="tx-pick" onClick={a.pick} aria-label={"Ask a question with " + a.name}>
                  <AstroAvatar id={a.id} size={52} name={a.name} />
                  <div className="tx-who">
                    <div className="tx-name">{a.name}</div>
                    <div className="u-13">{a.spec}</div>
                  </div>
                  <span className="pill tx-sub">{"Subscribed · "}{a.tier}</span>
                </button>
                <Facts a={a} />
                <div className="u-13">{"Subscription valid for "}{a.days}{" more days"}</div>
                {a.susp ? <div className="tq-warn">Text Questions are suspended: new slots cannot be bought (D-39).</div> : null}
                <div><button className="btn-p tx-btn" onClick={a.pick}>Ask a question</button></div>
              </article>
            </Fragment>
          ))}
        </div>
        {app.txSub.length === 0 ? <p className="u-15">You have no active subscriptions yet. Subscribe to an astrologer below.</p> : null}
        {app.txSub.length > subShown ? <div><button className="btn-g" onClick={() => setSubShown(subShown + 6)}>{"View More ("}{app.txSub.length - subShown}{" more)"}</button></div> : null}
      </section>

      <section className="tx-block">
        <h2 className="tx-h2">Recommended astrologers</h2>
        <p className="u-33">Subscribe to one of these astrologers to unlock asking them a text-based question.</p>
        {app.txRec.length ? <div className="u-13">{"Showing "}{Math.min(recShown, app.txRec.length)}{" of "}{app.txRec.length}</div> : null}
        <div className="tx-grid">
          {app.txRec.slice(0, recShown).map((a, i1) => (
            <Fragment key={i1}>
              <article className="card tx-card">
                <button className="tx-pick" onClick={a.open} aria-label={"View " + a.name + " profile"}>
                  <AstroAvatar id={a.id} size={52} name={a.name} />
                  <div className="tx-who">
                    <div className="tx-name">{a.name}</div>
                    <div className="u-13">{a.spec}</div>
                  </div>
                </button>
                <Facts a={a} />
                <div className="u-13">{"Languages: "}{a.langList.join(" · ")}</div>
                {a.susp ? <div className="tq-warn">Text Questions are suspended for this astrologer (D-39).</div> : null}
                <div className="tx-actions">
                  <button className="btn-p tx-btn" onClick={a.subscribe}>Subscribe</button>
                  <button className="btn-g tx-btn" onClick={a.open}>View Profile</button>
                </div>
              </article>
            </Fragment>
          ))}
        </div>
        {app.txRec.length > recShown ? <div><button className="btn-g" onClick={() => setRecShown(recShown + 6)}>{"View More ("}{app.txRec.length - recShown}{" more)"}</button></div> : null}
      </section>
    </>
  );
}

function Purchase() {
  const app = useApp();
  return (
    <>
      <div className="u-25">
        <div className="u-26">
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
              <div className="tx-head">
                <h2 className="u-28">{"Campaigns · "}{app.cur.name}</h2>
                <button className="btn-g tx-btn" onClick={app.changeAstro}>Change Astrologer</button>
              </div>
              {app.benefitN ? <div className="tq-ben-banner">{"⭐ "}{app.benefitN}{" subscription benefit question(s) available for this astrologer: use them without paying (D-31)."}</div> : null}
              {app.tqSuspCur ? <div className="tq-warn" role="alert">Text Questions are suspended for this astrologer: new slots cannot be bought. Your valid slots stay usable and submitted questions continue (D-39).</div> : null}
              <span className="u-13">Pay with</span>
              <div className="u-12">
                {app.payChips.map((c, i1) => (
                  <Fragment key={i1}>
                    <button className={c.cls} onClick={c.go}>{c.label}</button>
                  </Fragment>
                ))}
              </div>
              <div className="text-question-4">
                <span className="u-32">Slots</span>
                <button className="ico text-question-5" onClick={app.qtyDown} aria-label="Fewer slots">−</button>
                <span className="text-question-6">{app.qty}</span>
                <button className="ico text-question-5" onClick={app.qtyUp} aria-label="More slots">+</button>
              </div>
              {app.camps.map((c, i1) => (
                <Fragment key={i1}>
                  <div className="text-question-1 tq-camp">
                    <div className="tq-head">
                      <span className="text-question-3">{c.name}</span>
                      {c.special ? <span className="tag">{c.special}</span> : null}
                      <span className="pill tx-active">Active</span>
                    </div>
                    <div className="u-13">{c.note}</div>
                    <div className="u-13">{c.expText}</div>
                    {c.hasWarn ? <div className="tq-warn" role="alert">{c.warn}</div> : null}
                    {c.types.map((t, i2) => (
                      <Fragment key={i2}>
                        <div className="tq-row">
                          <div className="tq-price">
                            <strong>{t.label}{" Question"}</strong>
                            {t.hasDisc ? (<span className="tq-old">{"₹"}{t.price}</span>) : null}
                            {t.hasDisc ? <span className="pill tq-disc">{t.disc}{"% off"}</span> : null}
                            <span className="tq-final">{"₹"}{t.final}{" per slot"}</span>
                            {t.hasDisc ? <span className="u-13">{"saves ₹"}{t.saves}</span> : null}
                          </div>
                          <button className="btn-p u-31" onClick={t.buy}>{"Buy "}{app.qty}{" · ₹"}{t.total}</button>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              ))}
              <p className="u-33">
                Buy now and ask right away, or hold the slot and ask later. A slot expires at the earlier of 7 days after purchase and the campaign end date (IST). Holding does not extend this, and expired slots are not refunded (D-05 – D-07).
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
    </>
  );
}

function AskNew() {
  const app = useApp();
  return app.txStep === "pick" ? <PickAstrologer /> : <Purchase />;
}

function Purchased() {
  const app = useApp();
  return (
    <>
      <div className="tx-bar">
        <label className="u-13" htmlFor="slot-filter">Filter by purchase status</label>
        <select id="slot-filter" className="inp tx-select" value={app.slotFilter} onChange={app.onSlotFilter}>
          {app.slotOpts.map((o, i1) => (<Fragment key={i1}><option value={o.value}>{o.label}</option></Fragment>))}
        </select>
        <button className="btn-p tx-btn" onClick={app.buySlots}>Buy Question Slots</button>
      </div>
      <div className="card tx-note">
        <strong>7-Day Slot Validity</strong>
        <span className="u-13">A slot is valid until the earlier of 7 days after purchase and the campaign end date (IST). Holding a slot does not extend this, and expired slots cannot be refunded or rescheduled (D-06, D-07). Reminders arrive 3, 2 and 1 day before expiry (D-26).</span>
      </div>
      <div className="tx-grid">
        {app.slotBatches.map((b, i1) => (
          <Fragment key={i1}>
            <article className="card tx-card tx-slotcard">
              <div className="tx-slot-head">
                <span className="pill rm-kind">{b.type}{" Q&A"}</span>
                <span className={b.pillCls}>{b.status}{b.status === "Available" ? " · " + b.days + "d left" : ""}</span>
                <span className="u-13">{b.id}</span>
              </div>
              <div className="tx-name">{b.who}</div>
              <div className="u-13">{b.camp}</div>
              <dl className="tx-dl">
                <div><dt>Remaining</dt><dd>{b.remaining}{" of "}{b.n}{" questions"}</dd></div>
                <div><dt>Total paid</dt><dd>{b.paid}</dd></div>
                <div><dt>Purchased</dt><dd>{b.n}{" slot(s) · "}{b.bought}</dd></div>
                <div><dt>Valid until</dt><dd>{b.valid}</dd></div>
                <div><dt>Schedule</dt><dd>{b.sched}</dd></div>
              </dl>
              {b.status === "Available" ? <div className="u-15">{b.days}{" day(s) remaining (non-refundable)"}</div> : null}
              <div><button className="btn-p tx-btn" onClick={b.use} disabled={!b.canUse}>Use a Slot Now</button></div>
            </article>
          </Fragment>
        ))}
      </div>
      {app.slotBatches.length === 0 ? (
        <div className="card u-39">
          <div className="u-40">No slots to show</div>
          <div className="remedy-1">Buy question slots from an astrologer's campaign, or change the filter.</div>
        </div>
      ) : null}
    </>
  );
}

function MyQuestions() {
  const app = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Total");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [sOpen, setSOpen] = useState(false);
  const sRef = useRef(null);
  const [month, setMonth] = useState("All Months");
  const [view, setView] = useState("list");
  // Collapsed icon search: click opens and focuses; Enter or the Search button applies; Escape clears and closes.
  const openSearch = () => { setSOpen(true); setTimeout(() => sRef.current && sRef.current.focus(), 30); };
  const applySearch = () => setSearch(draft);
  const closeSearch = () => { setDraft(""); setSearch(""); setSOpen(false); };
  const onSearchBtn = () => { if (!sOpen) openSearch(); else if (!draft.trim()) closeSearch(); else applySearch(); };
  const onSearchKey = (e) => { if (e.key === "Enter") applySearch(); else if (e.key === "Escape") closeSearch(); };
  const [open, setOpen] = useState({});
  const text = search.trim().toLowerCase();
  const inMonth = app.myQs.filter((x) => month === "All Months" || x.month === month);
  const match = (x) => !text || (x.qid + " " + x.title + " " + x.who + " " + x.camp + " " + x.kind + " " + x.status + " " + (x.paid === "Free (benefit)" ? "free" : "paid") + (x.kind === "Personal" ? " individual" : "")).toLowerCase().includes(text);
  const byStatus = (x) => filter === "Total" || (filter === "Waiting" && x.statusKey === "waiting") || (filter === "Completed" && x.statusKey === "completed") || (filter === "Disputed" && x.disputed) || (filter === "Cancelled" && x.statusKey === "cancelled");
  const counts = {
    Total: inMonth.length,
    Waiting: inMonth.filter((x) => x.statusKey === "waiting").length,
    Completed: inMonth.filter((x) => x.statusKey === "completed").length,
    Disputed: inMonth.filter((x) => x.disputed).length,
    Cancelled: inMonth.filter((x) => x.statusKey === "cancelled").length,
  };
  const list = inMonth.filter(match).filter(byStatus);
  const stat = [["Total", "Total Questions"], ["Waiting", "Waiting for Answer"], ["Completed", "Completed"], ["Disputed", "Disputed"], ["Cancelled", "Cancelled"]];
  return (
    <>
      <section className="card tx-overview">
        <div className="tx-ov-top">
          <h2 className="tx-h2">Question Status Overview</h2>
          <div className="tx-ov-tools">
<div className={"tx-sbar" + (sOpen ? " open" : "")}>
              <input
                ref={sRef}
                className="tx-sinput"
                placeholder="Search Paid / Personal / General or a keyword"
                aria-label="Search questions"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onSearchKey}
                tabIndex={sOpen ? 0 : -1}
              />
              <button className="tx-sbtn" aria-label={sOpen ? "Search" : "Open search"} aria-expanded={sOpen} onClick={onSearchBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              </button>
            </div>
            <select className="inp tx-select" aria-label="Select month" value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="All Months">All Months</option>
              {app.myQMonths.map((m, i1) => (<Fragment key={i1}><option value={m}>{m}</option></Fragment>))}
            </select>
          </div>
        </div>
        <div className="tx-stats">
          {stat.map((st, i1) => (
            <Fragment key={i1}>
              <button className={"tx-stat" + (filter === st[0] ? " on" : "")} onClick={() => setFilter(st[0])}>
                <strong>{counts[st[0]]}</strong>
                <span>{st[1]}</span>
              </button>
            </Fragment>
          ))}
        </div>
      </section>
      <div className="tx-ov-top">
        <h3 className="tx-h3">{month === "All Months" ? "All months" : month}{" · Active Questions ("}{list.length}{")"}</h3>
        <div className="tx-view" role="group" aria-label="Question view">
          <button className={"chip" + (view === "list" ? " on" : "")} onClick={() => setView("list")}>List view</button>
          <button className={"chip" + (view === "grid" ? " on" : "")} onClick={() => setView("grid")}>Grid view</button>
        </div>
      </div>
      <div className={view === "grid" ? "tx-grid" : "tx-qlist"}>
        {list.map((x, i1) => (
          <Fragment key={i1}>
            <article className="card tx-q">
              <div className="tx-q-head">
                <span className="u-13">{x.qid}</span>
                <span className={"pill " + (x.statusKey === "completed" ? "tx-sub" : x.statusKey === "cancelled" ? "ex-offline" : "ex-busy")}>{x.status}</span>
                {x.subStatus ? <span className="pill rm-kind">{x.subStatus}</span> : null}
                <span className="pill rm-kind">{x.kind}</span>
                <span className="u-13">{"Paid: "}{x.paid}</span>
              </div>
              <h3 className="tx-q-title">{x.title}</h3>
              <div className="u-13">{x.who}{" • "}{x.camp}{" • "}{x.date}{x.guarantee ? " (" + x.guarantee + ")" : ""}</div>
              <div><button className="chip" aria-expanded={!!open[x.id]} onClick={() => setOpen({ ...open, [x.id]: !open[x.id] })}>{open[x.id] ? "Collapse answer" : "Expand answer"}</button></div>
              {open[x.id] ? (
                <div className="tx-q-body">
                  {x.answered ? (
                    <>
                      <div className="tx-ans">
                        <strong>{"Astrologer's Detailed Answer"}</strong>
                        <p className="u-30">{x.answer}</p>
                        <div className="u-13">{x.len}{" / 1,500 characters · cannot be edited after delivery (D-23)"}</div>
                      </div>
                      {x.attList.length ? (
                        <div className="tx-att">
                          <span className="u-13">{"Attachments ("}{x.attList.length}{" of 3)"}</span>
                          <div className="u-12">
                            {x.attList.map((f, i2) => (<Fragment key={i2}><button className="chip" onClick={f.open}>{f.name}{" · "}{f.kind}</button></Fragment>))}
                          </div>
                        </div>
                      ) : null}
                      {x.linkList.length ? (
                        <div className="tx-att">
                          <span className="u-13">Links</span>
                          {x.linkList.map((l, i2) => (<Fragment key={i2}><a className="ad-link" href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a></Fragment>))}
                        </div>
                      ) : null}
                      <div className="tx-rate">
                        {x.rated ? <span>{"Your rating: "}<span className="ap-stars">{x.stars}</span>{" · reviews cannot be edited or deleted"}</span> : <button className="btn-p tx-btn" onClick={x.rate}>Rate this answer (required)</button>}
                      </div>
                      {x.dAnswered ? (
                        <div className="tx-ans">
                          <strong>Dispute answer</strong>
                          <p className="u-30">{x.dAnswer}</p>
                          <div className="u-13">No further dispute can be raised after the dispute answer (D-19).</div>
                        </div>
                      ) : null}
                      {x.dAdmin ? <p className="u-33">The dispute was not answered within 3 days, so it moved to Admin Review (D-19).</p> : null}
                      <div className="tx-actions">
                        {x.canDispute ? <button className="btn-g tx-btn" onClick={x.raise}>{"🚩 Raise a Dispute ("}{x.dLeft}{"d left)"}</button> : null}
                        {x.windowClosed ? <span className="u-13">The 7-day dispute window has closed (D-08).</span> : null}
                        {x.canComplain ? <button className="btn-g tx-btn" onClick={x.complain}>Raise Platform Complaint</button> : null}
                        {x.complained ? <span className="pill tx-sub">Platform Complaint submitted</span> : null}
                        <button className="btn-g tx-btn" onClick={x.view}>Full Details</button>
                      </div>
                    </>
                  ) : (
                    <>
                      {x.statusKey === "cancelled" ? (
                        <p className="u-30">Not answered within 30 days: this question was cancelled and the amount refunded to your Wallet (D-18, D-32).</p>
                      ) : (
                        <p className="u-30">{"Waiting for "}{x.who}{". Answer due by "}{x.due}{" (30 days, IST). If it is not answered in time, the question is cancelled and refunded to your Wallet."}</p>
                      )}
                      {x.corrActive ? (
                        <div className="tq-warn" role="alert">
                          The astrologer asked for a correction. Replace it with another General Question: same slot, no extra payment.
                          <div><button className="btn-p tx-btn" onClick={x.corrReplace}>Replace question</button></div>
                        </div>
                      ) : null}
                      <div className="tx-actions"><button className="btn-g tx-btn" onClick={x.view}>Full Details</button></div>
                    </>
                  )}
                </div>
              ) : null}
            </article>
          </Fragment>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="card u-39">
          <div className="u-40">{"No active questions"}{month === "All Months" ? "" : " in " + month}{"."}</div>
          <div className="remedy-1">{"Finished questions are in History. "}<button className="chip" onClick={() => navigate("/text/history")}>Open History</button></div>
        </div>
      ) : null}
    </>
  );
}

function History() {
  const app = useApp();
  const [status, setStatus] = useState("All");
  const [month, setMonth] = useState("All Months");
  const [search, setSearch] = useState("");
  const text = search.trim().toLowerCase();
  const all = app.histQs;
  const n = { All: all.length, Completed: all.filter((x) => x.statusKey === "completed").length, Cancelled: all.filter((x) => x.statusKey === "cancelled").length };
  const list = all
    .filter((x) => status === "All" || x.status === status)
    .filter((x) => month === "All Months" || x.month === month)
    .filter((x) => !text || (x.qid + " " + x.title + " " + x.who + " " + x.camp + " " + x.kind).toLowerCase().includes(text));
  return (
    <>
      <section className="card tx-overview">
        <div className="tx-ov-top">
          <h2 className="tx-h2">Archived Questions</h2>
          <div className="tx-ov-tools">
            <select className="inp tx-select" aria-label="Filter by question status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">{"All (" + n.All + ")"}</option>
              <option value="Completed">{"Completed (" + n.Completed + ")"}</option>
              <option value="Cancelled">{"Cancelled (" + n.Cancelled + ")"}</option>
            </select>
            <select className="inp tx-select" aria-label="Select month" value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="All Months">All Months</option>
              {app.histMonths.map((m, i1) => (<Fragment key={i1}><option value={m}>{m}</option></Fragment>))}
            </select>
            <input className="inp tx-search" placeholder="Search question history" aria-label="Search question history" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="u-13">{"Showing "}{list.length}{" of "}{all.length}{" questions"}</div>
        <p className="u-15">Cancelled and completed questions whose dispute period is over are kept here. How long history is kept: <span className="tag">PENDING · P-11-04</span> Invoices: <span className="tag">PENDING · P-10-07</span></p>
      </section>
      <h3 className="tx-h3">Completed cycles and archives</h3>
      <div className="tx-qlist">
        {list.map((x, i1) => (
          <Fragment key={i1}>
            <article className="card tx-q">
              <div className="tx-q-head">
                <span className="u-13">{x.qid}</span>
                <span className="u-13">{"• "}{x.camp}{" • "}{x.who}</span>
                <span className="pill rm-kind">{x.kind}</span>
                <span className={"pill " + (x.statusKey === "completed" ? "tx-sub" : "ex-offline")}>{x.status}</span>
                {x.tags.map((t, i2) => (<Fragment key={i2}><span className="pill rm-kind">{t}</span></Fragment>))}
              </div>
              <h3 className="tx-q-title">{x.title}</h3>
              <div className="u-13">{"Asked "}{x.asked}{" • "}{x.closedLabel}{" "}{x.closed}{" • "}{x.money}</div>
              <div className="tx-actions">
                <button className="btn-g tx-btn" onClick={x.view}>View Details</button>
                <button className="btn-g tx-btn" disabled>Invoice</button>
              </div>
            </article>
          </Fragment>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="card u-39">
          <div className="u-40">No archived questions found</div>
          <div className="remedy-1">Try another status, month or search.</div>
        </div>
      ) : null}
    </>
  );
}

const TABS = [["my-questions", "My Questions"], ["new", "Ask New"], ["purchased", "Purchased Slots"], ["history", "History"]];

function TextQuestion() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const app = useApp();
  if (!tab) return <Navigate to="/text/new" replace />;
  if (!TABS.some((t) => t[0] === tab)) return <Navigate to="/text/new" replace />;
  const count = (k) => (k === "my-questions" ? app.txCounts.q : k === "purchased" ? app.txCounts.slots : null);
  return (
    <div className="text-question-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goServices}>← Services</button>
      </div>
      <div>
        <h1 className="u-10">Ask a Question</h1>
        <p className="u-23">Campaigns, held slots and a 30-day answer guarantee (D-18).</p>
      </div>
      <nav className="tx-tabs" aria-label="Ask a Question sections">
        {TABS.map((t, i1) => (
          <Fragment key={i1}>
            <button className={"chip tx-tab" + (tab === t[0] ? " on" : "")} onClick={() => navigate("/text/" + t[0])}>
              {t[1]}{count(t[0]) != null ? " (" + count(t[0]) + ")" : ""}
            </button>
          </Fragment>
        ))}
      </nav>
      {tab === "new" ? <AskNew /> : null}
      {tab === "purchased" ? <Purchased /> : null}
      {tab === "my-questions" ? <MyQuestions /> : null}
      {tab === "history" ? <History /> : null}
    </div>
  );
}

export default TextQuestion;
