import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { ExCard } from "../Explore/Explore";
import InstantFlow from "../../components/InstantFlow/InstantFlow";
import "./InstantList.css";

const KINDS = {
  call: { title: "Instant Call", intro: "Pick an astrologer to talk to now, then choose a prepaid package (D-45)." },
  chat: { title: "Instant Chat", intro: "Pick an astrologer to chat with now, then choose a prepaid package (D-45)." },
};

// Services tab: every astrologer, with only the action that belongs to the chosen service plus View Profile.
function InstantList() {
  const { kind } = useParams();
  const app = useApp();
  const k = KINDS[kind];
  const [flow, setFlow] = useState(null);
  if (!k) {
    return (
      <div className="explore-page xp-page page">
        <div><button className="btn-g u-16" onClick={app.goServices}>← Services</button></div>
        <div className="card u-39"><div className="u-40">This service was not found</div></div>
      </div>
    );
  }
  const list = app.exCards.slice().sort((x, y) => Number(y.online) - Number(x.online) || Number(y.ratingAvg) - Number(x.ratingAvg));
  return (
    <div className="explore-page xp-page page il-page">
      <div><button className="btn-g u-16" onClick={app.goServices}>← Services</button></div>
      <div className="il-head">
        <h1 className="xp-h1">{k.title}</h1>
        <p className="il-intro">{k.intro}</p>
        <p className="il-count">{list.filter((a) => a.online).length + " online · " + list.length + " astrologers"}</p>
      </div>
      <div className="xp-grid">
        {list.map((a) => (<ExCard key={a.id} a={{ ...a, call: () => setFlow({ a, kind: "Call" }), chat: () => setFlow({ a, kind: "Chat" }) }} mode={kind} onFollow={() => {}} />))}
      </div>
      {flow ? <InstantFlow key={flow.a.id + flow.kind} a={flow.a} kind={flow.kind} onClose={() => setFlow(null)} /> : null}
    </div>
  );
}

export default InstantList;
