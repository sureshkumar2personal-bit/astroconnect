import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import heroImg from "../../assets/images/hero.jpg";
import "./Home.css";

function Home() {
  const app = useApp();
  return (
    <div className="home-page page">
      <section className="home-1">
        <img className="home-2" src={heroImg} alt="A figure meditating beneath a zodiac wheel under a violet night sky" />
        <div className="home-3" />
        <div className="home-4">
          <span className="home-5">ASTROLOGY GUIDANCE</span>
          <h1 className="home-6">The stars have a story for you</h1>
          <p className="home-7">Ask an astrologer a question, book a consultation, or talk right now.</p>
          <div className="u-1">
            <button className="btn-p" onClick={app.goText}>Ask a question</button>
            <button className="btn-g home-8" onClick={app.goExplore}>Explore astrologers</button>
          </div>
        </div>
      </section>
      <section>
        <h2 className="u-2">Four ways to get guidance</h2>
        <div className="home-9">
          {app.services.map((v, i1) => (
            <Fragment key={i1}>
              <button className="card hov home-10" onClick={v.go}>
                <span className="u-3">{v.name}</span>
                <span className="home-11">{v.blurb}</span>
                {v.pend ? (
                  <span className="tag">{"PENDING · "}{v.pid}</span>
                ) : null}
              </button>
            </Fragment>
          ))}
        </div>
      </section>
      <section>
        <div className="home-12">
          <h2 className="home-13">Astrologers online</h2>
          <button className="btn-g home-14" onClick={app.goExplore}>See all</button>
        </div>
        <div className="u-4">
          {app.onlineList.map((a, i1) => (
            <Fragment key={i1}>
              <button className="card hov home-15" onClick={a.open}>
                <div style={cssToStyle(a.av)}>{a.ini}</div>
                <div className="u-5">
                  <div className="u-6">{a.name}</div>
                  <div className="u-7">{a.spec}</div>
                </div>
                <span className="u-8" aria-label="Online" />
              </button>
            </Fragment>
          ))}
        </div>
      </section>
      <section>
        <h2 className="u-2">Pick up where you left off</h2>
        <button className="card hov home-16" onClick={app.lastGo}>
          <span className="pill u-9">{app.lastAct.type}</span>
          <span className="home-17">{app.lastAct.title}</span>
          <span className="pill" style={cssToStyle(app.lastAct.st)}>{app.lastAct.status}</span>
        </button>
        <p className="home-18">
          {"Home contents are a design assumption — "}
          <span className="tag">PENDING · P-03-01</span>
        </p>
      </section>
    </div>
  );
}

export default Home;
