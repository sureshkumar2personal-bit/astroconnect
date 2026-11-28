import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FEATURED, findLive } from "./liveData";
import { Ic } from "./Live";
import "./LiveWatch.css";

// Join Live placeholder: confirms where Join Live leads. Streaming, comments, reactions and gifting are not designed or built.
function LiveWatch() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const x = findLive(params.get("id")) || FEATURED;
  const back = () => navigate("/services/live");
  return (
    <div className="watch-page page">
      <div className="lw-top">
        <button type="button" className="lw-back" onClick={back}><Ic name="back" size={20} />Back to Astrologer Live</button>
      </div>
      <div className="lw-row">
        <div className="lw-stage">
          <div className="lw-portrait" role="img" aria-label={x.name + " profile photo (placeholder)"}>{x.initials}</div>
          <div>
            <span className="lw-badge"><i />LIVE</span>
            <span className="lw-pill"><Ic name="eye" size={15} />{x.viewers || "418 watching"}</span>
            <span className="lw-caption">Live video would appear here</span>
          </div>
        </div>
        <aside className="lw-side">
          <div className="lw-who">
            <div className="lw-av" role="img" aria-label={x.name + " profile photo (placeholder)"}>{x.initials}</div>
            <div><h1>{x.name}</h1><p>{x.spec}</p></div>
          </div>
          <p className="lw-topic">{x.topic}</p>
          <div className="lw-chips"><span className="lw-chip"><Ic name={x.aud || "public"} size={14} />{x.audience || "Public"}</span><span className="lw-chip"><Ic name="clock" size={14} />{x.duration || "Live for 18 min"}</span></div>
          <div className="lw-dashed">Live streaming, comments and reactions will be available here soon.</div>
        </aside>
      </div>
    </div>
  );
}

export default LiveWatch;
