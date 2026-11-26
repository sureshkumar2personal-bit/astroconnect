import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { mountAsk } from "./askEngine";
import "./AskAstrologer.css";

// "Ask an Astrologer": My Questions, Ask New and Purchased Slots.
// The screen follows the approved prototype and keeps its own sample data.
function TextQuestion() {
  const app = useApp();
  const ref = useRef(null);
  const { tab } = useParams();
  const first = { new: "new", purchased: "slots" }[tab] || "questions";
  useEffect(() => mountAsk(ref.current, first), []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="text-question-page page aa-page">
      <div>
        <button className="btn-g u-16" onClick={app.goServices}>← Services</button>
      </div>
      <div className="aa-root" ref={ref}>
        <div className="page-head">
          <h1>Text questions</h1>
          <p>Written answers from astrologers you follow, within 30 days.</p>
        </div>
        <nav className="tabs" aria-label="Ask an Astrologer sections"><div className="tabs-in" role="tablist" id="tabs"></div></nav>
        <section id="panel" role="tabpanel"></section>
        <div id="overlay"></div>
        <div id="toast-host" aria-live="polite"></div>
      </div>
    </div>
  );
}

export default TextQuestion;
