import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { TIERS } from "../../data/mockData";
import { FEATURED, OTHERS, UPCOMING, ICON, findLive } from "./liveData";
import "./Live.css";

export function Ic({ name, size = 12, stroke = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="lv-ic"><path d={ICON[name]} /></svg>
  );
}
const Play = () => (<span className="lv-play"><svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg></span>);
const pad = (n) => String(n).padStart(2, "0");
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const startOf = (x) => new Date(x.at[0], x.at[1], x.at[2], x.at[3], x.at[4]);
const fmtDT = (d) => d.getDate() + " " + MON[d.getMonth()] + ", " + ((d.getHours() % 12) || 12) + ":" + pad(d.getMinutes()) + " " + (d.getHours() >= 12 ? "PM" : "AM");
const REMIND_OPTS = [{ h: 1, label: "1 hour before" }, { h: 24, label: "24 hours before" }];
const hrsLabel = (arr) => arr.slice().sort((p, q) => p - q).map((h) => (h === 1 ? "1 hr" : h + " hrs")).join(" & ") + " before";
const leftLabel = (d) => {
  const ms = d.getTime() - Date.now();
  if (ms <= 0) return "Starting now";
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
  return h >= 48 ? "Starts in " + Math.floor(h / 24) + " days" : "Starts in " + (h ? h + " hr " : "") + m + " min";
};

function StatusChip({ ok }) {
  return ok
    ? <span className="lv-chip ok"><Ic name="check" size={11} stroke={2.5} />Eligible</span>
    : <span className="lv-chip lock"><Ic name="lock" size={11} stroke={2.5} />Locked</span>;
}

// Astrologer Live (Services > Live): live sessions the user can watch and upcoming lives. Prototype data only: no real follow, subscription or reminder is processed.
function Live() {
  const app = useApp();
  const navigate = useNavigate();
  const [st, setSt] = useState({ reminded: {}, unlocked: {}, modalId: null, modalDone: false });
  const [rem, setRem] = useState(null); // reminder box: { id, sel: [hours before] }
  const ok = (x) => x.eligible || !!st.unlocked[x.id];
  const watch = (id) => navigate("/services/live/watch?id=" + encodeURIComponent(id));
  const closeModal = () => setSt((s) => ({ ...s, modalId: null, modalDone: false }));
  useEffect(() => {
    if (!st.modalId && !rem) return undefined;
    const onKey = (e) => { if (e.key === "Escape") { closeModal(); setRem(null); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [st.modalId, rem]);

  const lives = [FEATURED].concat(OTHERS);
  const hasLive = lives.length > 0;
  const hasUp = UPCOMING.length > 0;

  const lockedPanel = (x) => (
    <div className="lv-locked">
      <Ic name="lock" size={16} />
      <span>{x.reason}</span>
      <button type="button" className="lv-btn-outline gold" onClick={() => setSt((s) => ({ ...s, modalId: x.id, modalDone: false }))}>{x.actionLabel}</button>
    </div>
  );

  const liveCard = (x) => {
    const e = ok(x);
    const note = st.unlocked[x.id] ? "Unlocked" : x.note;
    return (
      <article key={x.id} className="lv-card" aria-label={x.name + ": " + x.topic}>
        <div className="lv-card-top">
          <div className="lv-avwrap"><div className="lv-avatar md" role="img" aria-label={x.name + " profile photo (placeholder)"} style={{ background: x.avatarBg }}>{x.initials}</div><span className="lv-mini">LIVE</span></div>
          <div className="lv-main">
            <p className="lv-name">{x.name}</p>
            <p className="lv-spec">{x.spec}</p>
            <p className="lv-topic">{x.topic}</p>
            <div className="lv-chips mt">
              <span className="lv-chip"><Ic name={x.aud} />{x.audience}</span>
              <StatusChip ok={e} />
              {x.viewers ? <span className="lv-viewers"><Ic name="eye" size={13} />{x.viewers}</span> : null}
            </div>
          </div>
        </div>
        {e ? (
          <div className="lv-foot">
            <span className="lv-footnote">{(note ? note + " · " : "") + x.duration}</span>
            <button type="button" className="btn-p lv-join" onClick={() => watch(x.id)}>Join Live</button>
          </div>
        ) : lockedPanel(x)}
      </article>
    );
  };

  const upCard = (x) => {
    const e = ok(x);
    const set = st.reminded[x.id];
    const isSet = !!(set && set.length);
    const openRem = () => setRem({ id: x.id, sel: isSet ? set.slice() : [1] });
    return (
      <article key={x.id} className="lv-card" aria-label={x.name + ": " + x.topic}>
        <div className="lv-card-top">
          <div className="lv-date"><span className="lv-mon">{x.mon}</span><span className="lv-day">{x.day}</span></div>
          <div className="lv-main">
            <div className="lv-who">
              <div className="lv-avatar sm" role="img" aria-label={x.name + " profile photo (placeholder)"} style={{ background: x.avatarBg }}>{x.initials}</div>
              <div className="lv-who-t"><span className="lv-name sm">{x.name}</span><span className="lv-spec">{x.spec}</span></div>
            </div>
            <p className="lv-topic strong">{x.topic}</p>
            <span className="lv-when"><Ic name="cal" size={14} />{x.when}</span>
            <div className="lv-chips mt"><span className="lv-chip"><Ic name={x.aud} />{x.audience}</span><StatusChip ok={e} /></div>
          </div>
        </div>
        {e ? (
          <div className="lv-foot">
            <span className="lv-footnote">{isSet ? "Reminder: " + hrsLabel(set) : (st.unlocked[x.id] ? "Unlocked · " : "") + x.short}</span>
            <button type="button" className={"lv-btn-outline" + (isSet ? " done" : "")} onClick={openRem} aria-haspopup="dialog">
              {isSet ? <><Ic name="check" size={15} stroke={2.5} />Reminder set</> : <><Ic name="bell" size={15} />Remind me</>}
            </button>
          </div>
        ) : lockedPanel(x)}
      </article>
    );
  };

  const modal = () => {
    const m = findLive(st.modalId);
    if (!m) return null;
    const first = m.name.split(" ")[0];
    const tier = m.aud === "tier" ? m.audience.split(" ")[0] : "";
    let title, cta, plan = null, doneTitle;
    if (m.actionLabel === "Follow") {
      title = "Follow " + m.name; cta = "Follow"; doneTitle = "You’re following " + first;
    } else if (m.actionLabel === "Subscribe") {
      title = "Subscribe to " + m.name; cta = "Subscribe"; doneTitle = "You’re subscribed";
      plan = [first + " · Subscriber plan", "All subscriber-only lives", "From ₹" + TIERS[0].price + " / month"];
    } else {
      title = "Upgrade to " + tier + " tier"; cta = "Upgrade"; doneTitle = "You’re on " + tier + " tier";
      const tp = TIERS.find((t) => t.name === tier);
      plan = [tier + " tier", tier + " tier lives and everything in Basic", tp ? "₹" + tp.price + " / month" : ""];
    }
    const doneBody = m.isLive ? "This live is now unlocked. You can join it now." : "This session is now unlocked. Set a reminder from the Upcoming list.";
    return (
      <div className="lv-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="lv-modal" role="dialog" aria-modal="true" aria-labelledby="lv-modal-title">
          <div className="lv-modal-head end">
            <button type="button" className="lv-x" aria-label="Close" onClick={closeModal}><Ic name="close" size={20} /></button>
          </div>
          <div className="lv-modal-who">
            <div className="lv-avatar modal" role="img" aria-label={m.name + " profile photo (placeholder)"} style={{ background: m.avatarBg }}>{m.initials}</div>
            <div className="lv-who-t"><span className="lv-name sm">{m.name}</span><span className="lv-spec">{m.topic}</span></div>
          </div>
          {st.modalDone ? (
            <>
              <div className="lv-done"><span className="lv-donemark"><Ic name="check" size={18} stroke={2.5} /></span><h2 id="lv-modal-title">{doneTitle}</h2></div>
              <p>{doneBody}</p>
              <div className="lv-actions">
                <button type="button" className="btn-g" onClick={closeModal}>Back to list</button>
                {m.isLive ? <button type="button" className="btn-p lv-join" onClick={() => watch(m.id)}>Join Live</button> : null}
              </div>
            </>
          ) : (
            <>
              <h2 id="lv-modal-title">{title}</h2>
              {plan ? (<div className="lv-plan"><div className="lv-plan-t"><span>{plan[0]}</span><small>{plan[1]}</small></div><b>{plan[2]}</b></div>) : null}
              <div className="lv-actions">
                <button type="button" className="btn-g" onClick={closeModal}>Cancel</button>
                <button type="button" className="btn-p lv-join" onClick={() => setSt((s) => ({ ...s, unlocked: { ...s.unlocked, [m.id]: true }, modalDone: true }))}>{cta}</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const remBox = () => {
    const m = findLive(rem.id);
    if (!m) return null;
    const start = startOf(m);
    const had = !!(st.reminded[m.id] && st.reminded[m.id].length);
    const toggleH = (h) => setRem((r) => ({ ...r, sel: r.sel.indexOf(h) >= 0 ? r.sel.filter((v) => v !== h) : r.sel.concat([h]) }));
    const save = () => { setSt((s) => ({ ...s, reminded: { ...s.reminded, [m.id]: rem.sel.slice() } })); setRem(null); };
    const remove = () => { setSt((s) => { const r = { ...s.reminded }; delete r[m.id]; return { ...s, reminded: r }; }); setRem(null); };
    return (
      <div className="lv-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setRem(null); }}>
        <div className="lv-modal" role="dialog" aria-modal="true" aria-labelledby="lv-rem-title">
          <div className="lv-modal-head end">
            <button type="button" className="lv-x" aria-label="Close" onClick={() => setRem(null)}><Ic name="close" size={20} /></button>
          </div>
          <div className="lv-modal-who">
            <div className="lv-avatar modal" role="img" aria-label={m.name + " profile photo (placeholder)"} style={{ background: m.avatarBg }}>{m.initials}</div>
            <div className="lv-who-t"><span className="lv-name sm">{m.name}</span><span className="lv-spec">{m.topic}</span></div>
          </div>
          <h2 id="lv-rem-title">Remind me</h2>
          <div className="lv-remwhen"><Ic name="cal" size={16} /><span><b>{fmtDT(start)}</b><small>{leftLabel(start)}</small></span></div>
          <div className="lv-opts" role="group" aria-label="Remind me before the live">
            {REMIND_OPTS.map((o) => {
              const t = new Date(start.getTime() - o.h * 3600000);
              const past = t.getTime() <= Date.now();
              const on = rem.sel.indexOf(o.h) >= 0 && !past;
              return (
                <button key={o.h} type="button" className={"lv-opt" + (on ? " on" : "")} aria-pressed={on} disabled={past} onClick={() => toggleH(o.h)}>
                  <b>{o.label}</b><span>{past ? "Already passed" : fmtDT(t)}</span>
                </button>
              );
            })}
          </div>
          <div className="lv-actions">
            {had ? <button type="button" className="btn-g" onClick={remove}>Remove reminder</button> : <button type="button" className="btn-g" onClick={() => setRem(null)}>Cancel</button>}
            <button type="button" className="btn-p lv-join" disabled={!rem.sel.length} onClick={save}>Set reminder</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="live-page page">
      <div><button className="btn-g u-16" onClick={app.goServices}>← Services</button></div>
      <header className="lv-head">
        <h1 className="lv-h1">Astrologer Live</h1>
      </header>

      <section className="lv-sec" aria-labelledby="lv-now-h">
        <div className="lv-sechead">
          <div className="lv-sectitle">
            <span className={"lv-dot" + (hasLive ? " live" : "")} />
            <h2 id="lv-now-h">LIVE NOW</h2>
            <span className={"lv-count" + (hasLive ? " live" : "")}>{pad(lives.length)} Live</span>
          </div>
        </div>
        {!hasLive ? (
          <div className="lv-empty" role="status">
            <span className="lv-emptyico"><Ic name="radio" size={26} stroke={1.8} /></span>
            <p className="t">No astrologers are live right now</p>
            <p className="d">Live sessions will appear here as soon as an astrologer goes live. Check the upcoming lives below.</p>
          </div>
        ) : (
          <>
            <article className="lv-featured">
              <div className="lv-media">
                <svg className="lv-stars" viewBox="0 0 520 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g stroke="#D4AF63" strokeOpacity="0.28" strokeWidth="1" fill="none"><path d="M40 230 L100 180 L160 200 L215 140" /><path d="M330 70 L380 105 L440 88 L478 140" /></g><g fill="#D4AF63" fillOpacity="0.55"><circle cx="40" cy="230" r="2.2" /><circle cx="100" cy="180" r="2.8" /><circle cx="160" cy="200" r="2" /><circle cx="215" cy="140" r="2.4" /><circle cx="330" cy="70" r="2.4" /><circle cx="380" cy="105" r="2" /><circle cx="440" cy="88" r="2.8" /><circle cx="478" cy="140" r="2.2" /><circle cx="80" cy="60" r="1.4" /><circle cx="440" cy="250" r="1.6" /><circle cx="290" cy="265" r="1.2" /></g></svg>
                <div className="lv-portrait xl" role="img" aria-label={FEATURED.name + " profile photo (placeholder)"}>{FEATURED.initials}</div>
                <span className="lv-badge"><i />LIVE</span>
                <span className="lv-pill" style={{ top: 16, right: 16 }}><Ic name="eye" size={15} />{FEATURED.viewers}</span>
                <span className="lv-pill" style={{ bottom: 16, left: 16, fontWeight: 500 }}><Ic name="clock" size={14} />{FEATURED.duration.replace("Live for", "Live for")}</span>
              </div>
              <div className="lv-featured-body">
                <span className="lv-eyebrow">FEATURED LIVE</span>
                <div><h3>{FEATURED.name}</h3><p className="lv-sub">{FEATURED.spec}</p></div>
                <p className="lv-featured-topic">{FEATURED.topic}</p>
                <div className="lv-chips"><span className="lv-chip lg"><Ic name="public" size={14} />Public</span><span className="lv-chip lg ok"><Ic name="check" size={13} stroke={2.5} />Eligible</span></div>
                <button type="button" className="btn-p lv-join lg" onClick={() => watch(FEATURED.id)}><Play />Join Live</button>
              </div>
            </article>
            <div className="lv-more">
              <div className="lv-more-head"><h3>More live sessions</h3><span>{OTHERS.length} sessions</span></div>
              <div className="lv-grid live">{OTHERS.map(liveCard)}</div>
            </div>
          </>
        )}
      </section>

      <section className="lv-sec" aria-labelledby="lv-up-h">
        <div className="lv-sechead">
          <div className="lv-sectitle"><h2 id="lv-up-h">UPCOMING LIVES</h2><span className="lv-count neutral">{pad(UPCOMING.length)} Scheduled</span></div>
        </div>
        {!hasUp ? (
          <div className="lv-empty" role="status">
            <span className="lv-emptyico"><Ic name="cal" size={26} stroke={1.8} /></span>
            <p className="t">No upcoming lives scheduled</p>
            <p className="d">When astrologers schedule a live session, it will be listed here.</p>
          </div>
        ) : (<div className="lv-grid up">{UPCOMING.map(upCard)}</div>)}
      </section>

      {st.modalId ? modal() : null}
      {rem ? remBox() : null}
    </div>
  );
}

export default Live;
