import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEED, TABS, STATUS, EMPTY, EMPTY_ACT, SEARCH_PH, TODAY, buildAll, buildDetail, diff, weekOf, pad, fDT } from "./activityData";
import "./Activity.css";

const Svg = ({ d, size = 18, w = 2, extra }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{d}{extra}</svg>
);
const KI = {
  question: <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />,
  appointment: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  call: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  subscription: <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />,
  remedy: <path d="M12 21c-5-3-8-7-8-12 4 0 6.5 1.5 8 4 1.5-2.5 4-4 8-4 0 5-3 9-8 12z" />,
};
const Ic = {
  cal14: <Svg size={14} d={<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>} />,
  chev: <Svg size={14} w={2.2} d={<path d="M9 18l6-6-6-6" />} />,
  bell: <Svg d={<><path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 20a2 2 0 004 0" /></>} />,
  bell16: <Svg size={16} d={<><path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 20a2 2 0 004 0" /></>} />,
  star: <Svg size={24} d={<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />} />,
  search: <Svg d={<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>} />,
  back: <Svg size={20} d={<path d="M15 18l-6-6 6-6" />} />,
  check: <Svg w={2.4} d={<path d="M5 12l5 5 9-10" />} />,
  check14: <Svg size={14} w={3} d={<path d="M5 12l5 5 9-10" />} />,
  info: <Svg size={14} d={<><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v5h1" /></>} />,
  x: <Svg size={16} w={2.2} d={<path d="M6 6l12 12M18 6L6 18" />} />,
};
const px = (cls) => cls.split(" ").map((t) => "ax-" + t).join(" ");

// My Activity (Activity tab): Questions, Appointments, Calls, Chats, Subscriptions and Remedies in one place. Prototype data only.
function Activity() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [range, setRange] = useState("any");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [typeF, setTypeF] = useState("all");
  const [statusBy, setStatusBy] = useState({});
  const [comp, setComp] = useState(null);
  const [openId, setOpenId] = useState("");
  const [toast, setToast] = useState(null);
  const tt = useRef(null);
  const closeRef = useRef(null);

  const all = useMemo(() => buildAll(comp || SEED), [comp]);

  const flash = (msg, undo) => {
    const id = Date.now();
    setToast({ msg, id, undo: undo || null });
    clearTimeout(tt.current);
    tt.current = setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 6000);
  };
  const mark = (id, remName) => {
    const now = new Date();
    const t = TODAY + "T" + pad(now.getHours()) + ":" + pad(now.getMinutes());
    setComp((c0) => { const c = c0 || SEED; return Object.assign({}, c, { [id]: (c[id] || []).concat([t]) }); });
    flash(remName + " marked as completed · " + fDT(t), { id, t });
  };
  const undo = () => {
    const u = toast && toast.undo; if (!u) return;
    setComp((c0) => { const c = c0 || SEED; const arr = (c[u.id] || []).slice(); const i = arr.lastIndexOf(u.t); if (i >= 0) arr.splice(i, 1); return Object.assign({}, c, { [u.id]: arr }); });
    clearTimeout(tt.current);
    setToast({ msg: "Completion removed", id: Date.now(), undo: null });
    tt.current = setTimeout(() => setToast(null), 6000);
  };
  useEffect(() => () => clearTimeout(tt.current), []);
  useEffect(() => {
    if (!openId) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setOpenId(""); };
    document.addEventListener("keydown", onKey);
    if (closeRef.current) closeRef.current.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  const inRange = (k) => {
    if (range === "today") return k === TODAY;
    if (range === "7") return diff(TODAY, k) <= 6 && diff(TODAY, k) >= 0;
    if (range === "30") return diff(TODAY, k) <= 29 && diff(TODAY, k) >= 0;
    if (range === "custom") return (!from || k >= from) && (!to || k <= to);
    return true;
  };
  const ql = q.trim().toLowerCase();
  const base = all.filter((r) => inRange(r.at.slice(0, 10)) && (!ql || r.search.includes(ql)));
  const curStatus = tab === "all" ? null : (statusBy[tab] || "all");
  const list = (tab === "all" ? base.filter((r) => typeF === "all" || r.type === typeF)
    : base.filter((r) => r.type === tab && (curStatus === "all" || r.statusKey === curStatus))).slice().sort((a, b) => (a.at < b.at ? 1 : -1));
  const tabs = TABS.map((t) => ({ ...t, on: t.key === tab, count: t.key === "all" ? base.length : base.filter((r) => r.type === t.key).length }));
  let chips = [];
  if (tab !== "all") {
    const ofType = base.filter((r) => r.type === tab);
    chips = [{ label: "All", val: "all", count: ofType.length }].concat(STATUS[tab].opts.map((o) => ({ label: o, val: o, count: ofType.filter((r) => r.statusKey === o).length })));
  }
  let sections = [];
  if (tab === "remedy") {
    ["Pending", "Completed"].forEach((g) => { const items = list.filter((r) => r.statusKey === g); if (items.length) sections.push({ title: g, items }); });
  } else {
    const wk = weekOf(TODAY);
    const G = [["Today", []], ["Yesterday", []], ["This Week", []], ["Earlier", []]];
    list.forEach((r) => { const k = r.at.slice(0, 10); const dd = diff(TODAY, k); G[dd <= 0 ? 0 : dd === 1 ? 1 : k >= wk ? 2 : 3][1].push(r); });
    sections = G.filter((g) => g[1].length).map((g) => ({ title: g[0], items: g[1] }));
  }
  const anyFilter = !!ql || range !== "any" || (tab === "all" ? typeF !== "all" : curStatus !== "all");
  const typeTotal = tab === "all" ? all.length : all.filter((r) => r.type === tab).length;
  const showEmpty = list.length === 0;
  const emptyIsFilter = showEmpty && typeTotal > 0;
  const ea = EMPTY_ACT[tab];
  const clearAll = () => { setQ(""); setRange("any"); setFrom(""); setTo(""); setTypeF("all"); if (tab !== "all") setStatusBy((s) => ({ ...s, [tab]: "all" })); };
  const pend = all.filter((r) => r.type === "remedy" && r.ri.canMark);
  const reminderText = pend.length === 1 ? "1 remedy still to do: " + pend[0].name + (pend[0].raw.freq === "Weekly" ? " (this week)." : " (today).")
    : pend.length + " remedies still to do: " + pend.map((r) => r.name + (r.raw.freq === "Weekly" ? " (this week)" : " (today)")).join(", ") + ".";
  const rec = openId ? all.find((r) => r.id === openId && ["call", "chat", "subscription", "remedy"].includes(r.type)) : null;
  const d = buildDetail(rec);
  const tabLabel = TABS.find((t) => t.key === tab).label;
  const doAction = (a) => {
    if (a.kind === "to") navigate(a.to);
    else if (a.kind === "open") setOpenId(a.id);
    else if (a.kind === "mark") mark(a.id, REM_NAME(all, a.id));
  };

  const card = (c) => (
    <article key={c.id} className="ax-acard">
      <div className="ax-c-top">
        <div className="ax-avatar" aria-hidden="true">{c.init}</div>
        <div className="ax-c-id">
          <div className="ax-kind"><span className={"ax-ki ax-" + c.type} aria-hidden="true"><Svg size={12} w={2.4} d={KI[c.type]} /></span><span>{c.kind}</span></div>
          <h3 className="ax-c-name">{c.name}</h3>
          <div className="ax-muted ax-sm">{c.service}</div>
        </div>
        <span className={px(c.badgeCls)}>{c.statusLabel}</span>
      </div>
      <div className="ax-meta"><span>{Ic.cal14}{c.whenText}</span><span className="ax-ref">{"ID " + c.id}</span>{c.facts.map((f, i) => (<span key={i}>{f.t}</span>))}</div>
      {c.hasProgress ? (<div className="ax-mini-prog"><div className="ax-bar" role="img" aria-label={c.progShort}><span style={{ width: c.pct + "%" }} /></div><span>{c.progShort}</span></div>) : null}
      <div className="ax-c-foot">
        <span className={px(c.noteCls)}>{c.note}</span>
        <div className="ax-cacts">
          {c.actions.map((a, i) => (
            <button key={i} className={px(a.cls)} onClick={() => doAction(a)}>{a.label}{a.kind === "to" ? Ic.chev : null}</button>
          ))}
        </div>
      </div>
    </article>
  );

  return (
    <div className="activity-page page">
      <div className="axp">
        <main className="ax-wrap">
          <div className="ax-pagehead"><h1>My Activity</h1></div>
          <div className="ax-tabs" role="tablist" aria-label="Activity categories">
            {tabs.map((t) => (<button key={t.key} className="ax-tab" role="tab" aria-selected={t.on} onClick={() => setTab(t.key)}>{t.label}<span className="ax-cnt">{t.count}</span></button>))}
          </div>
          <div role="tabpanel" aria-label={tabLabel}>
            <div className="ax-filterbar">
              <label className="ax-search">{Ic.search}<span className="ax-vh">Search activity</span><input type="search" placeholder={SEARCH_PH[tab]} value={q} onChange={(e) => setQ(e.target.value)} /></label>
              <label className="ax-fld">Date
                <select value={range} onChange={(e) => setRange(e.target.value)}>
                  <option value="any">All dates</option><option value="today">Today</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="custom">Custom range…</option>
                </select>
              </label>
              {tab === "all" ? (
                <label className="ax-fld">Activity type
                  <select value={typeF} onChange={(e) => setTypeF(e.target.value)}>
                    <option value="all">All types</option><option value="question">Questions</option><option value="appointment">Appointments</option><option value="call">Calls</option><option value="chat">Chats</option><option value="subscription">Subscriptions</option><option value="remedy">Remedies</option>
                  </select>
                </label>
              ) : null}
            </div>
            {range === "custom" ? (
              <div className="ax-custom">
                <label className="ax-fld">From<input type="date" max={TODAY} value={from} onChange={(e) => setFrom(e.target.value)} /></label>
                <label className="ax-fld">To<input type="date" max={TODAY} value={to} onChange={(e) => setTo(e.target.value)} /></label>
              </div>
            ) : null}
            {tab !== "all" ? (
              <div className="ax-chips" role="group" aria-label={STATUS[tab].label}>
                {chips.map((f) => (<button key={f.val} className="ax-chip" aria-pressed={curStatus === f.val} onClick={() => setStatusBy((s) => ({ ...s, [tab]: f.val }))}>{f.label}<span className="ax-cnt">{f.count}</span></button>))}
              </div>
            ) : null}
            <div className="ax-resline"><span className="ax-muted ax-sm" role="status">{list.length + (list.length === 1 ? " record" : " records") + (tab === "all" ? " · newest first" : "")}</span>{anyFilter ? <button className="ax-linkbtn" onClick={clearAll}>Clear filters</button> : null}</div>
            {(tab === "all" || tab === "remedy") && pend.length > 0 ? (
              <div className="ax-banner" role="note"><span className="ax-bicon">{Ic.bell}</span><div className="ax-bt"><b>Remedy reminder</b>{" · " + reminderText}</div>{tab === "all" ? <button className="ax-btn ax-btn-ghost" onClick={() => setTab("remedy")}>View remedies</button> : null}</div>
            ) : null}
            {tab === "appointment" ? (
              <div className="ax-banner ax-info" role="note"><span className="ax-bicon"><Svg d={<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>} /></span><div className="ax-bt"><b>Appointment History</b> has your calendar view, full filters and appointment details.</div><button className="ax-btn ax-btn-primary" onClick={() => navigate("/appt/my")}>Open Appointment History</button></div>
            ) : null}
            {sections.map((sec) => (
              <section key={sec.title} aria-label={sec.title}><h2 className="ax-sec-title">{sec.title}<span className="ax-cnt">{sec.items.length}</span></h2><div className="ax-cards">{sec.items.map(card)}</div></section>
            ))}
            {showEmpty ? (
              <div className="ax-empty"><span className="ax-eicon">{Ic.star}</span><p>{emptyIsFilter ? "No activity matches your search or filters." : EMPTY[tab]}</p>
                {emptyIsFilter ? <button className="ax-btn ax-btn-ghost" onClick={clearAll}>Clear filters</button> : null}
                {!emptyIsFilter && ea ? <button className="ax-btn ax-btn-primary" onClick={() => navigate(ea.to)}>{ea.label}</button> : null}
              </div>
            ) : null}
          </div>
        </main>

        {d ? (
          <div className="ax-overlay">
            <button className="ax-scrim" aria-label="Close details" onClick={() => setOpenId("")} />
            <div className="ax-drawer" role="dialog" aria-modal="true" aria-labelledby="ax-dtitle">
              <div className="ax-d-head">
                <button ref={closeRef} className="ax-iconbtn" aria-label="Back to My Activity" onClick={() => setOpenId("")}>{Ic.back}</button>
                <div className="ax-d-ttl"><div className="ax-muted ax-sm">{d.typeLabel}</div><h2 id="ax-dtitle">{d.title}</h2></div>
                <span className={px(d.badgeCls)}>{d.statusLabel}</span>
              </div>
              <div className="ax-d-body">
                <div className="ax-who"><div className="ax-avatar" aria-hidden="true">{d.init}</div><div><div className="ax-c-name">{d.name}</div><div className="ax-muted ax-sm">{d.sub}</div></div></div>
                {d.isRemedy ? (
                  <>
                    <div className="ax-panel"><h3>Instructions</h3><p>{d.instr}</p></div>
                    <div className="ax-panel"><h3>Progress</h3>
                      <div className="ax-progtop"><b>{d.progText}</b><span className="ax-muted ax-sm">{d.progSub}</span></div>
                      {d.hasTarget ? (<div className="ax-bar" role="img" aria-label={d.progText}><span style={{ width: d.pct + "%" }} /></div>) : null}
                      {d.strip.length ? (
                        <>
                          <div className="ax-strip" aria-label="Last 7 days">
                            {d.strip.map((s, i) => (
                              <div key={i} className={"ax-sd ax-" + s.cls} title={s.aria}><span aria-hidden="true">{s.dow}</span><span className="ax-dot">{s.done ? Ic.check14 : null}</span><b aria-hidden="true">{s.num}</b><span className="ax-vh">{s.aria}</span></div>
                            ))}
                          </div>
                          <div className="ax-legend"><span><i style={{ background: "#1f7a4a" }} />Done</span><span><i style={{ background: "rgba(240,120,120,.3)", border: "1px solid rgba(240,120,120,.6)" }} />Missed</span><span><i style={{ border: "1px dashed var(--gold)" }} />Today</span></div>
                        </>
                      ) : null}
                    </div>
                    <div className="ax-panel"><h3>{Ic.bell16}Reminder</h3><p className="ax-sm">{d.reminderText}</p></div>
                    {d.canMark ? <button className="ax-btn ax-btn-primary ax-wide" onClick={() => mark(rec.id, rec.name)}>{Ic.check}Mark as Completed</button> : null}
                    {d.showDone ? <div className="ax-donebox" role="status">{Ic.check}{d.doneMsg}</div> : null}
                    <div className="ax-panel"><h3>Completion history<span className="ax-cnt">{d.history.length}</span></h3>
                      {d.history.length ? (<ul className="ax-hist">{d.history.map((h, i) => (<li key={i}><span>{h.date}</span><span>{h.time}</span></li>))}</ul>) : (<p className="ax-muted ax-sm">No completions recorded yet. Tap Mark as Completed after you perform the remedy.</p>)}
                    </div>
                  </>
                ) : null}
                <div className="ax-panel"><h3>Details</h3><dl className="ax-dl">{d.rows.map((r, i) => (<div key={i}><dt>{r.k}</dt><dd>{r.v}</dd></div>))}</dl></div>
              </div>
            </div>
          </div>
        ) : null}

        {toast ? (
          <div className="ax-toast" role="status"><span>{toast.msg}</span>{toast.undo ? <button className="ax-linkbtn" onClick={undo}>Undo</button> : null}<button className="ax-tclose" aria-label="Dismiss" onClick={() => setToast(null)}>{Ic.x}</button></div>
        ) : null}
      </div>
    </div>
  );
}

function REM_NAME(all, id) { const r = all.find((x) => x.id === id); return r ? r.name : "Remedy"; }

export default Activity;
