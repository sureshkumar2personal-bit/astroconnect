import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./Services.css";

// Card look per service: tint class, description and the two icon paths.
const META = {
  "Text Question": { tint: "sv-t1", desc: "Ask an astrologer your question and receive a written answer.", d1: "M4 5h16v11H9l-5 4z", d2: "M8 9.5h8M8 12.5h5" },
  Appointment: { tint: "sv-t2", desc: "Schedule a voice consultation at your convenience.", d1: "M4 6h16v14H4zM4 10.5h16", d2: "M8 3.5v4M16 3.5v4M8.5 14.5h2M13.5 14.5h2M8.5 17.5h2" },
  "Instant Call": { tint: "sv-t3", desc: "Speak directly with an available astrologer.", d1: "M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z", d2: "M15 4.5a5 5 0 0 1 4.5 4.5M15 8a2 2 0 0 1 1.5 1.5" },
  "Instant Chat": { tint: "sv-t4", desc: "Connect instantly with an astrologer through live chat.", d1: "M3.5 4.5h11v8h-6l-3.5 3v-3h-1.5z", d2: "M17.5 9h3v8.5h-1.5v3l-3.5-3h-5v-2.5" },
  "Instant Call & Chat": { tint: "sv-t3", desc: "Talk or chat with an available astrologer right now.", d1: "M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z", d2: "M14 3.5h6.5v5H18l-2 2v-2h-2z" },
  Live: { tint: "sv-t4", desc: "Join free live sessions from astrologers.", d1: "M4 7h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4z", d2: "M17 10.5 21.5 8v8L17 13.5" },
};

function Services() {
  const app = useApp();
  const navigate = useNavigate();
  // Instant Call and Instant Chat share one card; Live takes the fourth slot.
  const pick = (n) => app.services.find((v) => v.name === n);
  const cards = [
    pick("Text Question"),
    pick("Appointment"),
    { name: "Instant Call & Chat", go: () => navigate("/services/call") },
    { name: "Live", go: () => navigate("/services/live") },
  ].filter(Boolean);
  return (
    <div className="services-page page">
      <section aria-labelledby="sv-choose">
        <h2 className="sv-sec" id="sv-choose">Choose Your Service</h2>
        <div className="sv-grid">
          {cards.map((v) => {
            const m = META[v.name] || META["Text Question"];
            return (
              <button key={v.name} className={"card sv-card " + m.tint} onClick={v.go}>
                <span className="sv-ib">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={m.d1}></path><path d={m.d2}></path></svg>
                </span>
                <h3>{v.name}</h3>
                <p>{m.desc}</p>
                <span className="sv-ex">
                  Explore
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <section className="sv-prev" aria-labelledby="sv-prev-h">
        <div>
          <h2 id="sv-prev-h">Your Previous Services</h2>
        </div>
        <button className="services-1" onClick={app.goActivity}>View Activity →</button>
      </section>
    </div>
  );
}

export default Services;
