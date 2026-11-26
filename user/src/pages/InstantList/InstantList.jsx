import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import AstroAvatar from "../../components/AstroAvatar/AstroAvatar";
import { FiltersDrawer, GROUPS, EMPTY_F, matchF, nSel } from "../Explore/Explore";
import { useInstant, WAIT_LIMIT } from "../Instant/InstantContext";
import { ordinal } from "../Instant/instantUtils";
import "./InstantList.css";

const KINDS = {
  call: { title: "Instant Call", intro: "Pick an astrologer to talk to now, then choose a prepaid package (D-45)." },
  chat: { title: "Instant Chat", intro: "Pick an astrologer to chat with now, then choose a prepaid package (D-45)." },
};
const SORTS = [["rec", "Recommended"], ["rating", "Highest rated"], ["exp", "Most experienced"], ["fol", "Most followed"]];
const GROUPS_I = GROUPS.filter((g) => g.key !== "avail");

const Star = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" /></svg>);

// Card for one astrologer on the Instant list: available ones start a booking, busy ones offer Notify me or the waiting list.
function InstantCard({ a, kind, busy, children }) {
  const ck = kind === "call" ? "Call" : "Chat";
  const price = kind === "call" ? a.callFrom : a.chatFrom;
  return (
    <article className="card ic-card" aria-label={a.name}>
      <div className="ic-top">
        <span className="ic-ph"><AstroAvatar id={a.id} size={56} name={a.name} /><i className={"ic-dot" + (busy ? " busy" : "")} /></span>
        <div className="ic-id">
          <div className="ic-line"><h3>{a.name}</h3><span className={"ic-st" + (busy ? " busy" : "")}>{busy ? "Busy" : "Available"}</span></div>
          <div className="ic-spec">{a.specLabel}</div>
          <div className="ic-stats"><span><b><Star />{a.ratingAvg}</b>{" (" + a.ratingN + ")"}</span><span>{a.yearsN + " yrs"}</span><span>{a.followers.replace(" Followers", "")}</span></div>
        </div>
      </div>
      <div className="ic-badges">
        {a.fol && !a.sub ? <span className="ic-badge">Following</span> : null}
        {a.sub ? <span className="ic-badge plan">{a.planText.replace(" plan · until", ", till").replace(" (IST)", "")}</span> : null}
        {a.isNew ? <span className="ic-badge new">New</span> : null}
      </div>
      <div className="ic-tags">{a.expertise.slice(0, 3).map((t, i) => (<span key={i}>{t}</span>))}</div>
      <div className="ic-lang">{a.langList.join(", ")}</div>
      {busy ? children[0] : <div className="ic-note">Prepaid minimum 5 min</div>}
      <div className="ic-price"><span><b>{"₹" + price}</b><small>{" / 5 min " + ck.toLowerCase()}</small></span><button className="in-link" onClick={a.open}>View Profile</button></div>
      {busy ? children[1] : children}
    </article>
  );
}

// Services tab: every astrologer for Instant Call or Chat. Available astrologers start a booking; busy ones offer Notify me or a paid waiting list.
function InstantList() {
  const { kind } = useParams();
  const app = useApp();
  const navigate = useNavigate();
  const inst = useInstant();
  const k = KINDS[kind];
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("rec");
  const [filters, setFilters] = useState(EMPTY_F());
  const [draft, setDraft] = useState(EMPTY_F());
  const [drawer, setDrawer] = useState(false);
  if (!k) {
    return (
      <div className="explore-page xp-page page">
        <div><button className="btn-g u-16" onClick={app.goServices}>← Services</button></div>
        <div className="card u-39"><div className="u-40">This service was not found</div></div>
      </div>
    );
  }
  const fCount = nSel(filters);
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hay = (a) => [a.name, a.spec, a.specLabel].concat(a.topics, a.langList, a.expertise).join(" ").toLowerCase();
  const pass = (a) => words.every((w) => hay(a).indexOf(w) > -1) && matchF(a, filters);
  const rank = (a) => (a.sub || a.fol ? 1 : 0);
  const sortFn = (x, y) => (sort === "rating" ? Number(y.ratingAvg) - Number(x.ratingAvg) : sort === "exp" ? y.yearsN - x.yearsN : sort === "fol" ? y.followersN - x.followersN : rank(y) - rank(x) || Number(y.ratingAvg) - Number(x.ratingAvg));
  const all = app.exCards.filter(pass);
  const available = all.filter((a) => a.avail === "Online").sort(sortFn);
  const busy = all.filter((a) => a.avail === "Busy").sort(sortFn);
  const wa = inst.wait ? app.exCards.find((a) => a.id === inst.wait.astroId) : null;
  const clearAll = () => { setQ(""); setFilters(EMPTY_F()); };
  return (
    <div className="explore-page xp-page page il-page">
      <div><button className="btn-g u-16" onClick={app.goServices}>← Services</button></div>
      <div className="il-head">
        <h1 className="xp-h1">Instant Call &amp; Chat</h1>
        <div className="il-tabs" role="tablist" aria-label="Instant Call or Chat">
          {Object.keys(KINDS).map((key) => (
            <button key={key} role="tab" aria-selected={key === kind} className={"il-tab" + (key === kind ? " on" : "")} onClick={() => navigate("/services/" + key, { replace: true })}>{KINDS[key].title}</button>
          ))}
        </div>
        <p className="il-intro">{k.intro}</p>
        <p className="il-count">{available.length + " available now" + (busy.length ? " · " + busy.length + " busy" : "")}</p>
      </div>
      {wa ? (
        <div className="il-banner" role="status">
          <div><b>{inst.wait.state === "ready" ? wa.name + " is ready for you" : "You’re #" + inst.myPos + " of " + WAIT_LIMIT + " for " + wa.name}</b><span>{inst.wait.kind === "call" ? "Instant Call" : "Instant Chat"} waiting list</span></div>
          <button className="btn-p il-b" onClick={() => navigate("/services/instant/waiting")}>View status</button>
        </div>
      ) : null}
      <div className="il-tools">
        <label className="il-search">
          <span className="sr-only">Search astrologers</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, specialization, expertise, topic or language" />
        </label>
        <button className="xp-filterbtn" onClick={() => { setDraft(filters); setDrawer(true); }}>{fCount ? "Filters (" + fCount + ")" : "Filters"}</button>
        <select className="inp il-sort" aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}>{SORTS.map((s) => (<option key={s[0]} value={s[0]}>{s[1]}</option>))}</select>
      </div>
      <section aria-label="Available now">
        <h2 className="il-sec">Available now</h2>
        {available.length ? (
          <div className="xp-grid">
            {available.map((a) => (
              <InstantCard key={a.id} a={a} kind={kind}>
                <button className="btn-p ic-cta" onClick={() => inst.begin(a, kind, "book")}>{kind === "call" ? "Call Now" : "Chat Now"}</button>
              </InstantCard>
            ))}
          </div>
        ) : (<p className="il-none">No astrologers match. <button className="in-link" onClick={clearAll}>Clear search and filters</button></p>)}
      </section>
      {busy.length ? (
        <section aria-label="Currently busy">
          <h2 className="il-sec">Currently busy</h2>
          <p className="il-note">Join a paid waiting list (up to {WAIT_LIMIT} people per astrologer, Call and Chat combined) or turn on Notify me for a free alert.</p>
          <div className="xp-grid">
            {busy.map((a) => {
              const n = inst.waitingCount(a.id), mine = inst.wait && inst.wait.astroId === a.id, full = n >= WAIT_LIMIT && !mine, on = !!inst.notify[a.id + ":" + kind];
              return (
                <InstantCard key={a.id} a={a} kind={kind} busy>
                  {[
                    <div key="m" className="il-meter" role="img" aria-label={n + " of " + WAIT_LIMIT + " waiting list places filled"}>
                      <span className="il-boxes" aria-hidden="true">
                        {Array.from({ length: WAIT_LIMIT }, (_, i) => (<i key={i} className={i < n ? (mine && inst.myPos === i + 1 ? "il-box mine" : "il-box on") : "il-box"} />))}
                      </span>
                      <span className="il-wl">{full ? "Waiting list full. " + WAIT_LIMIT + " users already waiting" : "Waiting list: " + n + " of " + WAIT_LIMIT + " filled" + (mine ? " · You’re " + ordinal(inst.myPos) : "")}</span>
                    </div>,
                    <div key="a" className="il-busy-actions">
                      <button className="btn-g il-b" aria-pressed={on} onClick={() => inst.toggleNotify(a, kind)}>{on ? "Notify me on" : "Notify me"}</button>
                      {mine ? (
                        <button className="btn-p il-b" onClick={() => navigate("/services/instant/waiting")}>View status</button>
                      ) : (
                        <button className="btn-p il-b" disabled={full || !!inst.wait} onClick={() => inst.begin(a, kind, "waitlist")}>{full ? "Waiting list full" : "Join waiting list"}</button>
                      )}
                    </div>,
                  ]}
                </InstantCard>
              );
            })}
          </div>
        </section>
      ) : null}
      {drawer ? <FiltersDrawer cards={app.exCards} groups={GROUPS_I} draft={draft} setDraft={setDraft} onClose={() => setDrawer(false)} onApply={() => { setFilters(draft); setDrawer(false); }} /> : null}
    </div>
  );
}

export default InstantList;
