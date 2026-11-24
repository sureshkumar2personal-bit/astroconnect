import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./Remedy.css";

function List() {
  const app = useApp();
  return (
    <div className="remedy-page page">
      <div><button className="btn-g u-16" onClick={app.goProfile}>← Profile</button></div>
      <div>
        <h1 className="u-22">Atonement</h1>
        <p className="u-23">Remedies your astrologers prescribe or attach, from any service (D-11).</p>
      </div>
      <section className="card rm-filters">
        <div className="rm-filter">
          <span className="u-13">Source</span>
          <div className="u-12">
            {app.rmSrcChips.map((c, i1) => (
              <Fragment key={i1}>
                <button className={c.cls} onClick={c.go}>{c.label}</button>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="rm-filter">
          <label className="u-13" htmlFor="rm-status">Status</label>
          <select id="rm-status" className="inp rm-select" value={app.rmStat} onChange={app.onRmStat}>
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </section>
      <h2 className="rm-h2">Your atonements</h2>
      <div className="rm-list">
        {app.atoneList.map((a, i1) => (
          <Fragment key={i1}>
            <article className="card rm-card">
              <div className="rm-head">
                <strong>{a.who}</strong>
                <span className={a.status === "Completed" ? "pill rm-done" : "pill rm-pending"}>{a.status}</span>
                <span className="pill rm-kind">{a.source}</span>
                <span className="pill rm-kind">{a.daysLabel}</span>
              </div>
              <h3 className="rm-title">{a.title}</h3>
              <div className="rm-progress"><span className="u-13">Progress</span> <strong>{a.progress}</strong></div>
              <div><button className="btn-g rm-btn" onClick={a.view}>View Details</button></div>
            </article>
          </Fragment>
        ))}
      </div>
      {app.atoneList.length === 0 ? (
        <div className="card u-39">
          <div className="u-40">No atonements found</div>
          <div className="remedy-1">Remedies prescribed in any service appear here. Try another filter.</div>
        </div>
      ) : null}
      {app.noteList.length ? <h2 className="rm-h2">Notes, recommendations and reports</h2> : null}
      <div className="rm-list">
        {app.noteList.map((n, i1) => (
          <Fragment key={i1}>
            <div className="card rm-card">
              <div className="rm-head"><span className="pill rm-kind">{n.kindLabel}</span></div>
              <div className="u-35">{n.title}</div>
              <div className="u-13">{n.srcText}</div>
              {n.canView ? <div><button className="chip" onClick={n.view}>View consultation ›</button></div> : null}
            </div>
          </Fragment>
        ))}
      </div>
      <p className="u-15">
        {"Only you can mark days completed (D-29). "}
        <span className="tag">Reminders · PENDING · P-16-03</span>{" "}
        <span className="tag">Your own remedies · PENDING · P-16-04</span>{" "}
        <span className="tag">Astrologer edits · PENDING · P-16-06</span>
      </p>
    </div>
  );
}

function Detail({ id }) {
  const app = useApp();
  const d = app.atoneOf(id);
  const firstOpen = d ? d.days.findIndex((x) => x.state === "Pending") : 0;
  const [sel, setSel] = useState(firstOpen >= 0 ? firstOpen : d ? d.last : 0);
  if (!d) {
    return (
      <div className="remedy-page page">
        <div><button className="btn-g u-16" onClick={app.goRemedy}>← Back to Atonements</button></div>
        <div className="card u-39"><div className="u-40">This atonement was not found</div></div>
      </div>
    );
  }
  const day = d.days[Math.min(sel, d.last)];
  const isLast = day.i === d.last;
  const pct = Math.round((d.doneN / d.daysN) * 100);
  return (
    <div className="remedy-page page">
      <div><button className="btn-g u-16" onClick={app.goRemedy}>← Back to Atonements</button></div>
      <section className="card rm-hero">
        <div className="u-13">{d.who.toUpperCase()}</div>
        <h1 className="rm-detail-title">{d.title}</h1>
        <div className="rm-stats">
          <span><strong>{d.daysN}</strong> Days</span>
          <span><strong>{d.doneN}</strong> / {d.daysN} Days Completed</span>
          <span className={d.status === "Completed" ? "pill rm-done" : "pill rm-pending"}>{d.status === "Completed" ? "Completed" : "In Progress"}</span>
        </div>
        <div className="rm-bar" role="progressbar" aria-valuenow={d.doneN} aria-valuemin="0" aria-valuemax={d.daysN}><div className="rm-bar-fill" style={{ width: pct + "%" }} /></div>
        {d.canView ? <div><button className="chip" onClick={d.view}>View consultation ›</button></div> : null}
      </section>

      <nav className="rm-days" aria-label="Select day">
        {d.days.map((x, i1) => (
          <Fragment key={i1}>
            <button className={"chip rm-daybtn" + (sel === x.i ? " on" : "") + (x.done ? " rm-daydone" : "")} onClick={() => setSel(x.i)}>
              {"Day "}{x.n}{x.done ? " ✓" : x.locked ? " 🔒" : ""}
            </button>
          </Fragment>
        ))}
      </nav>

      <section className="card rm-day">
        <div className="rm-day-head">
          <h2 className="rm-h2">{"Day "}{day.n}{" · "}{day.date}</h2>
          <span className={day.state === "Completed" ? "pill rm-done" : day.state === "Locked" ? "pill rm-locked" : "pill rm-pending"}>{day.state}</span>
        </div>
        <div className="u-13">{d.place}{" · "}{d.time}</div>
        <ul className="rm-plan" aria-label="Ritual plan">
          <li><strong>{d.god}</strong><span className="u-13">God</span></li>
          <li><strong>Ritual Instruction</strong><blockquote className="rm-quote">{d.instruction}</blockquote></li>
          <li>
            <strong>Things Required</strong>
            <div className="u-12">
              {d.things.map((t, i1) => (<Fragment key={i1}><span className="chip">{t}</span></Fragment>))}
            </div>
          </li>
          <li><strong>Additional Notes</strong><p className="u-33">{d.notes}</p></li>
        </ul>
        <div className="rm-status-row">
          <div>
            <div className="u-13">STATUS</div>
            <strong>{"Day "}{day.n}{" of "}{d.daysN}</strong>
          </div>
          <button className="btn-p" onClick={d.markDay(day.i)} disabled={day.done || day.locked}>{day.done ? "Completed ✓" : "Mark Day as Completed"}</button>
        </div>
        <p className="u-15">{"Perform today's rituals and mark completed. Proofs are submitted on Day "}{d.daysN}{"."}</p>

        {isLast ? (
          <div className="rm-proofs">
            <h3 className="rm-h3">{"Pooja Proof Attachments (All "}{d.daysN}{" Days)"}</h3>
            <div className="rm-count">{d.proofsText}</div>
            <p className="u-15">{"As this is the final day, attach proofs for all "}{d.daysN}{" days before completing. Photo, video or audio, up to 2 MB each. Your astrologer can view them (D-29)."}</p>
            {d.days.map((x, i1) => (
              <Fragment key={i1}>
                <div className="rm-proof-row">
                  <div>
                    <strong>{"Day "}{x.n}</strong>
                    <span className="u-13">{" · "}{x.date}</span>
                    <div className="u-13">{x.proof ? "Attached: " + x.proof.name : "Pending Proof"}</div>
                  </div>
                  <label className="chip rm-add" htmlFor={"pf" + x.i}>{x.proof ? "Replace" : "+ Add Day " + x.n + " Proof"}</label>
                  <input id={"pf" + x.i} className="rm-file" type="file" accept="image/*,video/*,audio/*" onChange={d.addProof(x.i)} />
                </div>
              </Fragment>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Remedy() {
  const { id } = useParams();
  return id ? <Detail key={id} id={id} /> : <List />;
}

export default Remedy;
