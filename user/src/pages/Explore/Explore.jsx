import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./Explore.css";

function Explore() {
  const app = useApp();
  return (
    <div className="explore-page page">
      <h1 className="u-10">Explore astrologers</h1>
      <div className="explore-1">
        <div className="explore-2">
          <label className="u-11" htmlFor="sq">Search astrologers</label>
          <input
            className="inp"
            id="sq"
            placeholder="Search by name, speciality or language"
            value={app.q ?? ""}
            onChange={app.onQ}
          />
        </div>
        <button className={`${app.onlineCls}`} onClick={app.toggleOnline}>Online now</button>
      </div>
      <div className="u-12">
        {app.cats.map((c, i1) => (
          <Fragment key={i1}>
            <button className={`${c.cls}`} onClick={c.go}>{c.label}</button>
          </Fragment>
        ))}
      </div>
      <div className="u-4">
        {app.exploreList.map((a, i1) => (
          <Fragment key={i1}>
            <button className="card hov explore-3" onClick={a.open}>
              <div className="explore-4">
                <div style={cssToStyle(a.av)}>{a.ini}</div>
                <div className="u-5">
                  <div className="u-3">{a.name}</div>
                  <div className="u-7">{a.spec}</div>
                </div>
                {a.online ? (
                  <span className="u-8" aria-label="Online" />
                ) : null}
              </div>
              <div className="u-13">{a.langs}</div>
              <div className="u-13">{a.ratingText}</div>
              {a.sub ? (
                <span className="pill explore-5">Subscribed</span>
              ) : null}
            </button>
          </Fragment>
        ))}
      </div>
      {app.noResults ? (
        <div className="card u-14">No astrologers match. Try another filter.</div>
      ) : null}
      <p className="u-15">
        {"Sample astrologers. Explore vs Services boundary — "}
        <span className="tag">PENDING · P-01-08</span>
      </p>
    </div>
  );
}

export default Explore;
