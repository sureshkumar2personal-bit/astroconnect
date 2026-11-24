import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import AstroAvatar from "../../components/AstroAvatar/AstroAvatar";
import "./Appointment.css";

function ApptTabs({ active }) {
  const navigate = useNavigate();
  return (
    <nav className="ah-tabs" aria-label="Appointment sections">
      <button className={"chip" + (active === "my" ? " on" : "")} onClick={() => navigate("/appt/my")}>Appointment History</button>
      <button className={"chip" + (active === "book" ? " on" : "")} onClick={() => navigate("/appt/book")}>Book an Appointment</button>
    </nav>
  );
}

function Chooser({ setStep }) {
  const app = useApp();
  const [moreSub, setMoreSub] = useState(false);
  const [moreRec, setMoreRec] = useState(false);
  {
    const subs = moreSub ? app.apptSubList : app.apptSubList.slice(0, 3);
    const recs = moreRec ? app.apptRecList : app.apptRecList.slice(0, 3);
    return (
      <div className="appointment-page page">
        <div><button className="btn-g u-16" onClick={app.goServices}>← Services</button></div>
        <ApptTabs active="book" />
        <h1 className="u-10">Book an appointment</h1>
        <section className="ap-sec" aria-label="Subscribed astrologers">
          <h2 className="ap-h2">Book with your subscribed astrologers</h2>
          {subs.length === 0 ? <div className="card ap-empty">You have no subscriptions yet. Subscribe to an astrologer below to book an appointment.</div> : null}
          <div className="ap-cards">
            {subs.map((a) => (
              <article key={a.id} className="card ap-acard">
                <AstroAvatar id={a.id} size={64} name={a.name} />
                <div className="ap-ainfo">
                  <div className="ap-aname">{a.name}</div>
                  <div className="u-13">{a.spec}</div>
                  <div className="ap-arow"><span className={"pill " + a.availCls}>{a.avail}</span><span className="pill">{a.tier} subscriber</span></div>
                  <div className="ap-slots"><strong>{a.slotsOpen}</strong>{" slots open in the next 7 days"}</div>
                </div>
                <button className="btn-p" onClick={() => { a.book(); setStep("form"); }}>Book appointment</button>
              </article>
            ))}
          </div>
          {app.apptSubList.length > 3 ? <div><button className="chip" onClick={() => setMoreSub(!moreSub)}>{moreSub ? "Show less" : "More (" + (app.apptSubList.length - 3) + ")"}</button></div> : null}
        </section>
        <section className="ap-sec" aria-label="Recommended astrologers">
          <h2 className="ap-h2">Recommended astrologers</h2>
          <p className="u-15">Subscribe to an astrologer first, then book an appointment with them (D-04).</p>
          {recs.length === 0 ? <div className="card ap-empty">You are subscribed to every astrologer.</div> : null}
          <div className="ap-cards">
            {recs.map((a) => (
              <article key={a.id} className="card ap-acard">
                <AstroAvatar id={a.id} size={64} name={a.name} />
                <div className="ap-ainfo">
                  <div className="ap-aname">{a.name}</div>
                  <div className="u-13">{a.spec}</div>
                  <div className="u-13">{a.ratingText}</div>
                  <div className="ap-slots">Subscribe to book an appointment</div>
                </div>
                <button className="btn-p" onClick={a.subscribe}>Subscribe</button>
              </article>
            ))}
          </div>
          {app.apptRecList.length > 3 ? <div><button className="chip" onClick={() => setMoreRec(!moreRec)}>{moreRec ? "Show less" : "More (" + (app.apptRecList.length - 3) + ")"}</button></div> : null}
        </section>
      </div>
    );
  }
}

function BookForm({ setStep }) {
  const app = useApp();
  const [, tick] = useState(0);
  // Re-render every second while a slot is held so the countdown stays live.
  useEffect(() => {
    if (!app.holdOn) return undefined;
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [app.holdOn]);
  return (
    <div className="appointment-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goServices}>← Services</button>
      </div>
      <ApptTabs active="book" />
      <h1 className="u-10">{app.isResched ? "Reschedule appointment" : "Book an appointment"}</h1>
      {app.isResched ? (
        <div className="card ap-banner">
          <span>{"Choosing a new time for "}{app.reschedTitle}{". Same astrologer and duration, no extra payment. You can reschedule once (D-41)."}</span>
          <button className="btn-g" onClick={app.cancelResched}>Cancel rescheduling</button>
        </div>
      ) : null}
      <div className="u-25">
        <section className="card u-27">
          <h2 className="u-28">1 · Astrologer</h2>
          <div className="ap-chosen">
            <AstroAvatar id={app.cur.id} size={44} name={app.cur.name} />
            <strong>{app.cur.name}</strong>
            {app.isResched ? null : <button className="chip" onClick={() => setStep("pick")}>← Choose another astrologer</button>}
          </div>
          <h2 className="appointment-1">2 · Duration (voice only)</h2>
          <div className="u-12">
            {app.durs.map((d, i1) => (
              <Fragment key={i1}>
                <button className={d.cls} onClick={d.go} disabled={d.dis}>{d.label}</button>
              </Fragment>
            ))}
          </div>
          <h2 className="appointment-1">3 · Day (up to 90 days ahead)</h2>
          <div className="ap-days">
            <button className="ico ap-nav" onClick={app.weekPrev} disabled={app.weekPrevDis} aria-label="Earlier days">‹</button>
            <div className="u-12">
              {app.weekDays.map((d, i1) => (
                <Fragment key={i1}>
                  <button className={d.cls} onClick={d.go} disabled={d.dis}>{d.label}</button>
                </Fragment>
              ))}
            </div>
            <button className="ico ap-nav" onClick={app.weekNext} disabled={app.weekNextDis} aria-label="Later days">›</button>
          </div>
          <h2 className="appointment-1">4 · Time (IST)</h2>
          <div className="u-12">
            {app.slotList.map((d, i1) => (
              <Fragment key={i1}>
                <button className={d.cls} onClick={d.go} disabled={d.dis}>{d.label}</button>
              </Fragment>
            ))}
          </div>
          <p className="u-15">Greyed slots are already taken, held, or in the past. A slot can never be booked twice (D-40).</p>
        </section>
        <section className="card u-29">
          <h2 className="u-28">Summary</h2>
          <div className="appointment-2">{app.cur.name}</div>
          <div className="u-32">{app.apptDurLabel}{" · ₹"}{app.apptPrice}</div>
          <div className="u-32">{app.apptHasSel ? app.apptWhen : "Pick a day and time"}</div>
          {app.isResched ? (
            <div>
              <button className="btn-p" onClick={app.confirmResched}>Confirm new time</button>
            </div>
          ) : app.holdOn ? (
            <div className="ap-hold">
              <div className="ap-timer" role="timer">{"Slot held for "}{app.holdLeft}</div>
              <div className="u-13">{app.holdWhen}</div>
              <span className="u-13">Pay with</span>
              <div className="u-12">
                {app.payChips.map((c, i1) => (
                  <Fragment key={i1}>
                    <button className={c.cls} onClick={c.go}>{c.label}</button>
                  </Fragment>
                ))}
              </div>
              <div className="ap-actions">
                <button className="btn-p" onClick={app.payHold}>{"Pay & confirm"}</button>
                <button className="btn-g" onClick={app.releaseHold}>Release slot</button>
              </div>
              <p className="u-15">Payment confirms the appointment immediately, without astrologer approval. If payment fails or the 10 minutes pass, the slot is released (D-40).</p>
            </div>
          ) : (
            <div>
              <button className="btn-p" onClick={app.startHold}>Hold slot &amp; continue</button>
            </div>
          )}
          <p className="u-33">
            {"No dispute option for appointments (D-09). After the consultation you give a 1–5 rating (D-10). Cancel up to 12 hours before the start; reschedule once (D-41). Late-cancellation deduction: "}
            <span className="tag">PENDING · AP-05-01</span>
          </p>
        </section>
      </div>
      <section className="card ap-proto">
        <div className="ap-proto-title">Prototype controls (sample)</div>
        <div className="u-13">Simulate astrologer-side events to test the rules. Prices and slot availability are sample values.</div>
        <div className="ap-actions">
          <button className="chip" onClick={app.toggleDnd}>{"Put " + app.cur.name + " in Do Not Disturb"}</button>
          <button className="chip" onClick={app.protoCancel}>Astrologer cancels my next appointment</button>
          <button className="chip" onClick={app.protoDate}>Astrologer closes that date</button>
          {app.hasDnd ? <button className="chip" onClick={app.clearDnd}>{"Clear Do Not Disturb (" + app.dndOn + ")"}</button> : null}
        </div>
      </section>
    </div>
  );
}



// ---------- Appointment History ----------
const OFF = 19800000; // IST offset
const DAY = 86400000;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WD = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const parts = (ms) => { const d = new Date(ms + OFF); return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), dow: d.getUTCDay() }; };
const startOf = (y, m, d) => Date.UTC(y, m, d) - OFF;
const dayStartMs = (ms) => { const p = parts(ms); return startOf(p.y, p.m, p.d); };
const keyOf = (ms) => { const p = parts(ms); return p.y * 10000 + p.m * 100 + p.d; };
const fmtDay = (ms) => { const p = parts(ms); return WD[p.dow].slice(0, 1) + WD[p.dow].slice(1).toLowerCase() + ", " + p.d + " " + MONTHS[p.m].slice(0, 3) + " " + p.y; };

function ApptCard({ x }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="card ah-card">
      <div className="ah-head">
        <div>
          <div className="ah-name">{x.who}</div>
          <div className="u-13">{x.spec}</div>
        </div>
        <div className="ah-pills">
          <span className={"pill ah-st-" + x.statusKey}>{x.status}</span>
          {x.rescheduled ? <span className="pill ah-st-resched">Rescheduled</span> : null}
        </div>
      </div>
      <div className="ah-meta">
        <span>{"Booking ID: "}{x.bookingId}</span>
        <span>{x.paid}</span>
        <span>Audio Call</span>
      </div>
      <div className="ah-when">
        <strong>{x.dayText}</strong>
        <span>{x.timeText}{" · "}{x.durText}</span>
      </div>
      <div><button className="chip" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Hide Details" : "View Details"}</button></div>
      {open ? (
        <div className="ah-detail">
          <dl className="ah-dl">
            <div><dt>Booked on</dt><dd>{x.bookedOn}</dd></div>
            <div><dt>Payment mode</dt><dd>{x.payVia}</dd></div>
            <div><dt>Reference ID</dt><dd>{x.ref}</dd></div>
            <div><dt>Mode</dt><dd>Voice (audio) call</dd></div>
            {x.refund ? <div><dt>Refund</dt><dd>{x.refund}</dd></div> : null}
            {x.rescheduled ? <div><dt>Rescheduling</dt><dd>Moved once (D-41)</dd></div> : null}
          </dl>
          <div className="ah-notes">
            <strong>Astrologer Consultation Notes</strong>
            <span className="u-13">Notes, remedies and guidance shared by your astrologer. Only you can see them.</span>
            {x.notes.map((n, i1) => (<Fragment key={i1}><div className="ah-note"><span className="pill rm-kind">{n.kind}</span>{" "}{n.title}</div></Fragment>))}
            {x.atoneId ? <div><button className="btn-g ah-btn" onClick={x.openAtone}>{"Open atonement ›"}</button><span className="u-13">{" "}{x.atoneTitle}</span></div> : null}
            {!x.notes.length && !x.atoneId ? <span className="u-15">{x.statusKey === "completed" ? "No notes were shared for this consultation." : "Notes appear here after the consultation."}</span> : null}
          </div>
          <div className="ah-actions">
            <button className="btn-g ah-btn" onClick={x.manage}>Manage in Activity</button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function History() {
  const app = useApp();
  const navigate = useNavigate();
  const today = dayStartMs(app.nowMs);
  const [view, setView] = useState("list");
  const [status, setStatus] = useState("All");
  const [range, setRange] = useState("Month");
  const [anchor, setAnchor] = useState(today);
  const [cal, setCal] = useState(() => { const p = parts(today); return { y: p.y, m: p.m }; });
  const [selDay, setSelDay] = useState(null);

  const matches = (x) => status === "All" || (status === "Booked" && x.statusKey === "booked") || (status === "Completed" && x.statusKey === "completed") || (status === "Cancelled" && x.statusKey === "cancelled") || (status === "Rescheduled" && x.rescheduled);
  const filtered = useMemo(() => app.apptHist.filter(matches), [app.apptHist, status]);

  // list range
  const ap = parts(anchor);
  let from, to, label;
  if (range === "Month") { from = startOf(ap.y, ap.m, 1); to = startOf(ap.y, ap.m + 1, 1); label = MONTHS[ap.m] + " " + ap.y; }
  else if (range === "Week") { from = anchor - ap.dow * DAY; to = from + 7 * DAY; const e = parts(to - DAY); label = ap.d + " " + MONTHS[ap.m].slice(0, 3) + " – " + e.d + " " + MONTHS[e.m].slice(0, 3) + " " + e.y; }
  else { from = anchor; to = anchor + DAY; label = fmtDay(anchor); }
  const inRange = filtered.filter((x) => x.start >= from && x.start < to);
  const shift = (dir) => {
    if (range === "Month") setAnchor(startOf(ap.y, ap.m + dir, 1));
    else setAnchor(anchor + dir * (range === "Week" ? 7 : 1) * DAY);
  };

  // calendar
  const first = startOf(cal.y, cal.m, 1);
  const gridStart = first - parts(first).dow * DAY;
  const cells = [...Array(42)].map((_, i) => gridStart + i * DAY);
  const byDay = {};
  filtered.forEach((x) => { const k = keyOf(x.start); (byDay[k] = byDay[k] || []).push(x); });
  const calShift = (dir) => { const t = new Date(Date.UTC(cal.y, cal.m + dir, 1)); setCal({ y: t.getUTCFullYear(), m: t.getUTCMonth() }); setSelDay(null); };
  const monthOpts = [...Array(19)].map((_, i) => { const t = new Date(Date.UTC(parts(today).y, parts(today).m - 12 + i, 1)); return { v: t.getUTCFullYear() + "-" + t.getUTCMonth(), l: MONTHS[t.getUTCMonth()] + " " + t.getUTCFullYear() }; });
  const selItems = selDay ? byDay[selDay] || [] : [];

  return (
    <div className="appointment-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goServices}>← Back</button>
      </div>
      <ApptTabs active="my" />
      <h1 className="u-10">Appointment History</h1>

      <div className="ah-bar">
        <div className="u-12" role="group" aria-label="Appointment status">
          {["All", "Booked", "Completed", "Cancelled", "Rescheduled"].map((s, i1) => (<Fragment key={i1}><button className={"chip" + (status === s ? " on" : "")} onClick={() => setStatus(s)}>{s}</button></Fragment>))}
        </div>
        <div className="u-12" role="group" aria-label="Appointment view">
          <button className={"chip" + (view === "calendar" ? " on" : "")} onClick={() => setView("calendar")}>Calendar</button>
          <button className={"chip" + (view === "list" ? " on" : "")} onClick={() => setView("list")}>List</button>
        </div>
      </div>

      {view === "list" ? (
        <section aria-label="Appointment list" className="ah-section">
          <div className="ah-toolbar">
            <div className="u-12" role="group" aria-label="List date range">
              {["Month", "Week", "Day"].map((r, i1) => (<Fragment key={i1}><button className={"chip" + (range === r ? " on" : "")} onClick={() => { setRange(r); setAnchor(today); }}>{r}</button></Fragment>))}
            </div>
            <div className="ah-nav">
              <button className="ico ah-arrow" aria-label="Previous period" onClick={() => shift(-1)}>‹</button>
              <strong>{label}</strong>
              <button className="ico ah-arrow" aria-label="Next period" onClick={() => shift(1)}>›</button>
              <button className="chip" onClick={() => setAnchor(today)}>Today</button>
            </div>
            <span className="u-13">{inRange.length}{inRange.length === 1 ? " appointment" : " appointments"}</span>
          </div>
          <div className="ah-list">
            {inRange.map((x, i1) => (<Fragment key={x.id}><ApptCard x={x} /></Fragment>))}
          </div>
          {inRange.length === 0 ? (
            <div className="card u-39">
              <div className="u-40">No appointments in this period</div>
              <div className="remedy-1">Try another period or status, or <button className="chip" onClick={() => navigate("/appt/book")}>book an appointment</button>.</div>
            </div>
          ) : null}
        </section>
      ) : (
        <section aria-label="Appointment calendar" className="ah-section">
          <div className="ah-toolbar">
            <div className="ah-nav">
              <button className="ico ah-arrow" aria-label="Previous month" onClick={() => calShift(-1)}>‹</button>
              <button className="chip" onClick={() => { const p = parts(today); setCal({ y: p.y, m: p.m }); setSelDay(keyOf(today)); }}>Today</button>
              <select className="inp ah-month" aria-label="Select month" value={cal.y + "-" + cal.m} onChange={(e) => { const [y, m] = e.target.value.split("-").map(Number); setCal({ y, m }); setSelDay(null); }}>
                {monthOpts.map((o, i1) => (<Fragment key={i1}><option value={o.v}>{o.l}</option></Fragment>))}
              </select>
              <button className="ico ah-arrow" aria-label="Next month" onClick={() => calShift(1)}>›</button>
            </div>
            <div className="ah-legend">
              <span><i className="ah-dot ah-st-booked" />Upcoming</span>
              <span><i className="ah-dot ah-st-completed" />Completed</span>
              <span><i className="ah-dot ah-st-cancelled" />Cancelled</span>
              <span><i className="ah-dot ah-st-resched" />Rescheduled</span>
            </div>
          </div>
          <div className="ah-grid" role="grid">
            {WD.map((w, i1) => (<Fragment key={i1}><div className="ah-wd" role="columnheader">{w}</div></Fragment>))}
            {cells.map((c, i1) => {
              const k = keyOf(c), items = byDay[k] || [], p = parts(c), out = p.m !== cal.m;
              const cls = "ah-cell" + (out ? " out" : "") + (k === keyOf(today) ? " today" : "") + (selDay === k ? " sel" : "");
              return (
                <Fragment key={i1}>
                  <button className={cls} onClick={() => setSelDay(k)} aria-label={fmtDay(c) + ", " + (items.length ? items.length + " appointment" + (items.length > 1 ? "s" : "") : "no appointments")}>
                    <span className="ah-dn">{p.d}</span>
                    {items.length ? (
                      <span className="ah-dots">
                        {items.slice(0, 4).map((x, i2) => (<Fragment key={i2}><i className={"ah-dot " + (x.rescheduled ? "ah-st-resched" : "ah-st-" + x.statusKey)} /></Fragment>))}
                        {items.length > 1 ? <span className="ah-count">{items.length}</span> : null}
                      </span>
                    ) : null}
                  </button>
                </Fragment>
              );
            })}
          </div>
          {selDay ? (
            <div className="ah-sel">
              <h2 className="ah-h2">{selItems.length ? selItems.length + (selItems.length === 1 ? " appointment" : " appointments") : "No appointments on this day"}</h2>
              <div className="ah-list">
                {selItems.map((x, i1) => (<Fragment key={x.id}><ApptCard x={x} /></Fragment>))}
              </div>
            </div>
          ) : <p className="u-15">Select a day to see its appointments.</p>}
        </section>
      )}
    </div>
  );
}

function Book() {
  const app = useApp();
  const [step, setStep] = useState("pick");
  return step === "pick" && !app.isResched ? <Chooser setStep={setStep} /> : <BookForm setStep={setStep} />;
}

function Appointment() {
  const { tab } = useParams();
  return tab === "my" ? <History /> : <Book />;
}



export default Appointment;
