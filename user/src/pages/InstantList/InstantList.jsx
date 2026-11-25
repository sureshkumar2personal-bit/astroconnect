import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { ExCard } from "../Explore/Explore";
import InstantFlow from "../../components/InstantFlow/InstantFlow";
import "./InstantList.css";

const WAIT_LIMIT = 3; // at most 3 people on one astrologer's waiting list (UI prototype; the rule is not in the specs yet)

// Mock waiting-list data per busy astrologer: people already on the list, and the user's own place if they have joined.
const WAIT_SEED = {
  3: { count: 3, pos: null },  // full
  14: { count: 2, pos: null }, // 2 filled; joining makes you 3rd
  15: { count: 1, pos: null }, // 1 filled; joining makes you 2nd
  16: { count: 3, pos: null }, // full
  17: { count: 1, pos: null }, // you would be 2nd
  18: { count: 0, pos: null }, // empty
};
const ordinal = (n) => n + (n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th");

const KINDS = {
  call: { title: "Instant Call", intro: "Pick an astrologer to talk to now, then choose a prepaid package (D-45)." },
  chat: { title: "Instant Chat", intro: "Pick an astrologer to chat with now, then choose a prepaid package (D-45)." },
};

// Services tab: every astrologer, with only the action that belongs to the chosen service plus View Profile.
function InstantList() {
  const { kind } = useParams();
  const app = useApp();
  const navigate = useNavigate();
  const k = KINDS[kind];
  const [flow, setFlow] = useState(null);
  // Per busy astrologer: "notify" or "wait" (one at a time). Kept in this page only; no real notifications or queue yet.
  const [choice, setChoice] = useState(() => Object.fromEntries(Object.entries(WAIT_SEED).filter(([, v]) => v.pos).map(([id]) => [id, "wait"])));
  const [waitCount, setWaitCount] = useState(() => Object.fromEntries(Object.entries(WAIT_SEED).map(([id, v]) => [id, v.count])));
  const [myPos, setMyPos] = useState(() => Object.fromEntries(Object.entries(WAIT_SEED).filter(([, v]) => v.pos).map(([id, v]) => [id, v.pos])));
  if (!k) {
    return (
      <div className="explore-page xp-page page">
        <div><button className="btn-g u-16" onClick={app.goServices}>← Services</button></div>
        <div className="card u-39"><div className="u-40">This service was not found</div></div>
      </div>
    );
  }
  const sortFn = (x, y) => Number(y.ratingAvg) - Number(x.ratingAvg);
  const available = app.exCards.filter((a) => a.avail === "Online").sort(sortFn);
  const busy = app.exCards.filter((a) => a.avail === "Busy").sort(sortFn);
  const toggle = (a, want) => {
    const cur = choice[a.id];
    if (cur === want) {
      setChoice({ ...choice, [a.id]: null });
      if (want === "wait") { setWaitCount({ ...waitCount, [a.id]: Math.max(0, (waitCount[a.id] || 0) - 1) }); setMyPos({ ...myPos, [a.id]: null }); }
      app.homeToast(want === "wait" ? "You left the waiting list for " + a.name : "Notification cancelled for " + a.name);
      return;
    }
    if (want === "wait" && (waitCount[a.id] || 0) >= WAIT_LIMIT) { app.homeToast("The waiting list for " + a.name + " is full"); return; }
    setChoice({ ...choice, [a.id]: want });
    if (want === "wait") { setWaitCount({ ...waitCount, [a.id]: (waitCount[a.id] || 0) + 1 }); setMyPos({ ...myPos, [a.id]: (waitCount[a.id] || 0) + 1 }); }
    app.homeToast(want === "wait" ? "You joined the waiting list for " + a.name + " as " + ordinal((waitCount[a.id] || 0) + 1) : "We will notify you when " + a.name + " is available");
  };
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
        <p className="il-count">{available.length + " available now" + (busy.length ? " · " + busy.length + " busy" : "")}</p>
      </div>
      <section aria-label="Available now">
        <h2 className="il-sec">Available now</h2>
        {available.length ? (
          <div className="xp-grid">
            {available.map((a) => (<ExCard key={a.id} a={{ ...a, call: () => setFlow({ a, kind: "Call" }), chat: () => setFlow({ a, kind: "Chat" }) }} mode={kind} onFollow={() => {}} />))}
          </div>
        ) : (<p className="il-none">No astrologers are available right now.</p>)}
      </section>
      {busy.length ? (
        <section aria-label="Currently busy">
          <h2 className="il-sec">Currently busy</h2>
          <div className="xp-grid">
            {busy.map((a) => {
              const cur = choice[a.id], n = waitCount[a.id] || 0, full = n >= WAIT_LIMIT && cur !== "wait";
              return (
                <div key={a.id} className="card il-busy">
                  <ExCard a={{ ...a, canContact: false }} mode={kind} onFollow={() => {}} />
                  <span className="il-pill">Busy</span>
                  <div className="il-meter" role="img" aria-label={n + " of " + WAIT_LIMIT + " waiting list places filled"}>
                    <span className="il-boxes" aria-hidden="true">
                      {Array.from({ length: WAIT_LIMIT }, (_, i) => (<i key={i} className={i < n ? (myPos[a.id] === i + 1 ? "il-box mine" : "il-box on") : "il-box"} />))}
                    </span>
                    <span className="il-wl">{"Waiting list: " + n + " of " + WAIT_LIMIT + " filled" + (myPos[a.id] ? " · You're " + ordinal(myPos[a.id]) : full ? " · Full" : "")}</span>
                  </div>
                  <div className="il-busy-actions">
                    <button className="btn-g il-b" disabled={cur === "wait"} onClick={() => toggle(a, "notify")}>{cur === "notify" ? "Cancel notify" : "Notify me"}</button>
                    <button className="btn-p il-b" disabled={cur === "notify" || full} onClick={() => toggle(a, "wait")}>{cur === "wait" ? "Leave waiting list" : "Join waiting list"}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
      {flow ? <InstantFlow key={flow.a.id + flow.kind} a={flow.a} kind={flow.kind} onClose={() => setFlow(null)} /> : null}
    </div>
  );
}

export default InstantList;
