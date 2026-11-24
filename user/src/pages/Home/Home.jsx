import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, cssToStyle } from "../../context/AppContext";
import heroImg from "../../assets/images/hero.jpg";
import AstroAvatar from "../../components/AstroAvatar/AstroAvatar";
import HeroWheel from "../../components/HeroWheel/HeroWheel";
import "./Home.css";

function Home() {
  const app = useApp();
  const navigate = useNavigate();
  // Time-of-day greeting for the hero banner.
  const hour = new Date().getHours();
  const greeting = hour >= 5 && hour < 12 ? "Good morning" : hour >= 12 && hour < 17 ? "Good afternoon" : "Good evening";
  return (
    <div className="home-page page">
      <section className="home-1">
        <img className="home-2" src={heroImg} alt="A figure meditating beneath a zodiac wheel under a violet night sky" />
        <HeroWheel />
        <div className="home-3" />
        <div className="home-4">
          <h1 className="home-greet">{greeting}{", "}{app.pname}{"\u00a0"}<span aria-hidden="true">🙏</span></h1>
        </div>
      </section>
      {app.homeTicker.length ? (
        <div className="home-ticker" role="region" aria-label="Updates for you">
          <div className="home-tk-track">
            {[0, 1].map((rep) => (
              <div className="home-tk-set" key={rep} aria-hidden={rep === 1 ? "true" : undefined}>
                {app.homeTicker.map((t) => (
                  <button key={t.key} className="home-tk-item" onClick={t.go} tabIndex={rep === 1 ? -1 : 0}>
                    <span className="home-tk-ico" aria-hidden="true">{t.icon}</span>{t.text}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <section>
        <h2 className="u-2">Four ways to get guidance</h2>
        <div className="home-9">
          {app.services.map((v, i1) => (
            <Fragment key={i1}>
              <button className="card hov home-10" onClick={v.go}>
                <span className="u-3">{v.name}</span>
                <span className="home-11">{v.blurb}</span>
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
              <article className="card hov home-15 home-online">
                <button className="home-top" onClick={a.open} aria-label={"Open " + a.name + " profile"}>
                  <AstroAvatar id={a.id} size={52} name={a.name} />
                  <div className="u-5">
                    <div className="u-6">{a.name}</div>
                    <div className="u-7">{a.spec}</div>
                  </div>
                  <span className="u-8" aria-label="Online" />
                </button>
                <div className="home-actions">
                  <button className="btn-p home-btn" onClick={a.call} disabled={!a.canContact}>Call</button>
                  <button className="btn-p home-btn" onClick={a.chat} disabled={!a.canContact}>Chat</button>
                  <button className="btn-g home-btn" onClick={a.open}>View Profile</button>
                </div>
              </article>
            </Fragment>
          ))}
        </div>
      </section>
      <div className="home-band">
        <section aria-label="Upcoming appointments" className="home-col">
          <div className="home-12">
            <h2 className="home-13">Upcoming appointments</h2>
            <button className="btn-g home-14" onClick={() => app.goApptHistory()}>History</button>
          </div>
          {app.homeUpcoming.length === 0 ? (
            <div className="card home-empty">
              <span>No upcoming appointments.</span>
              <button className="btn-p home-btn" onClick={() => navigate("/appt/book")}>Book an appointment</button>
            </div>
          ) : null}
          {app.homeUpcoming.slice(0, 3).map((x) => (
            <button key={x.id} className="card hov home-row" onClick={x.open}>
              <span className="home-rowtop"><strong>{x.who}</strong><span className="pill">{x.status}</span></span>
              <span className="home-rowsub">{x.spec}</span>
              <span className="home-rowsub">{"Audio Call · "}{x.dayText}{" · "}{x.timeText}{" · "}{x.durText}</span>
            </button>
          ))}
          {app.homeUpcoming.length > 3 ? <div><button className="chip" onClick={app.goApptHistory}>{"View more (" + (app.homeUpcoming.length - 3) + ") ›"}</button></div> : null}
        </section>
        <section aria-label="Recent activity" className="home-col">
          <div className="home-12">
            <h2 className="home-13">Recent activity</h2>
          </div>
          {app.homeLog.length === 0 ? <div className="card home-empty"><span>No activity yet. Start with a Text Question.</span></div> : null}
          {app.homeLog.slice(0, 3).map((x) => (
            <button key={x.id} className="card hov home-row" onClick={x.open}>
              <span className="home-rowtop"><span className="pill" style={cssToStyle(x.st)}>{x.status}</span><span className="home-rowsub">{x.dateText}</span></span>
              <span className="home-rowtitle">{x.title}</span>
              <span className="home-rowsub">{x.type}{x.who ? " · " + x.who : ""}</span>
            </button>
          ))}
          {app.homeLog.length > 3 ? <div className="home-more"><button className="chip" onClick={app.goActivity}>{"View more (" + (app.homeLog.length - 3) + ") ›"}</button></div> : null}
        </section>
      </div>
    </div>
  );
}

export default Home;
