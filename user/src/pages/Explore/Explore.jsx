import React, { Fragment, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useApp, cssToStyle } from "../../context/AppContext";
import AstroAvatar from "../../components/AstroAvatar/AstroAvatar";
import "./Explore.css";

function AstroCard({ a }) {
  return (
    <article className="card ex-card">
      <span className="ex-price" title={a.priceText}>{"from ₹" + a.chatFrom}</span>
      <button className="ex-top" onClick={a.open} aria-label={"Open " + a.name + " profile"}>
        <span className="ex-ph">
          <AstroAvatar id={a.id} size={68} name={a.name} />
          <i className={"ex-dot " + a.availCls} title={a.avail} aria-label={a.avail} />
        </span>
        <span className="ex-who">
          <span className="ex-name">{a.name}</span>
          <span className="ex-spec">{a.spec}</span>
          <span className="ex-facts"><span><b>{"★ " + a.ratingAvg}</b>{" (" + a.ratingN + ")"}</span><span>{a.years}</span></span>
          <span className="ex-foll">{a.followers}</span>
        </span>
      </button>
      <div className="ex-tags" aria-label="Areas of expertise">
        {a.expertise.map((t, i1) => (<Fragment key={i1}><span className="ex-chip">{t}</span></Fragment>))}
      </div>
      <div className="ex-langs" aria-label="Languages">
        {a.langList.map((t, i1) => (<Fragment key={i1}><span className="ex-lang">{t}</span></Fragment>))}
      </div>
      <div className="ex-actions">
        {a.canContact ? (
          <>
            <button className="ex-act ex-call" onClick={a.call}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>Call
            </button>
            <button className="ex-act ex-chat" onClick={a.chat}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /></svg>Chat
            </button>
          </>
        ) : (
          <span className={"ex-unavail " + a.availCls}>{a.avail}</span>
        )}
        <button className="ex-view" onClick={a.open}>{"View Profile →"}</button>
      </div>
    </article>
  );
}

function Home() {
  const app = useApp();
  const [sOpen, setSOpen] = useState(false);
  const sRef = useRef(null);
  // Collapsed icon search: click opens and focuses; typing filters live; the button or Escape clears and closes.
  const openSearch = () => { setSOpen(true); setTimeout(() => sRef.current && sRef.current.focus(), 30); };
  const closeSearch = () => { app.onQ({ target: { value: "" } }); setSOpen(false); };
  return (
    <div className="explore-page page">
      <div className="ex-headrow">
        <div>
          <h1 className="u-10">Explore Astrologers</h1>
          <p className="u-23">Find an astrologer for your next consultation</p>
        </div>
        <div className={"ex-sbar" + (sOpen || app.q ? " open" : "")}>
          <input
            ref={sRef}
            className="ex-sinput"
            id="sq"
            placeholder="Search by name, speciality, expertise or language"
            aria-label="Search astrologers"
            value={app.q ?? ""}
            onChange={app.onQ}
            onKeyDown={(e) => { if (e.key === "Escape") closeSearch(); }}
            tabIndex={sOpen || app.q ? 0 : -1}
          />
          <button className="ex-sbtn" aria-label={sOpen || app.q ? "Close search" : "Open search"} aria-expanded={sOpen || !!app.q} onClick={() => (sOpen || app.q ? closeSearch() : openSearch())}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </button>
        </div>
      </div>
      {app.exSearching ? (
        <section>
          <h2 className="ex-h2">Search results</h2>
          <div className="ex-grid">
            {app.exFound.map((a, i1) => (<Fragment key={i1}><AstroCard a={a} /></Fragment>))}
          </div>
          {app.exFound.length === 0 ? <div className="card u-39"><div className="u-40">No astrologers match your search</div></div> : null}
        </section>
      ) : (
        app.exSections.map((sec, i1) => (
          <Fragment key={i1}>
            <section className="ex-section" aria-label={sec.title}>
              <div className="ex-sec-head">
                <h2 className="ex-h2">{sec.title}</h2>
                {sec.more ? <button className="chip" onClick={sec.view}>View More</button> : null}
              </div>
              {sec.has ? (
                <div className="ex-grid">
                  {sec.items.map((a, i2) => (<Fragment key={i2}><AstroCard a={a} /></Fragment>))}
                </div>
              ) : <p className="u-15">{sec.empty}</p>}
              
            </section>
          </Fragment>
        ))
      )}
    </div>
  );
}

function Full({ section }) {
  const app = useApp();
  const g = app.exAll(section);
  const [shown, setShown] = useState(6);
  if (!g) {
    return (
      <div className="explore-page page">
        <div><button className="btn-g u-16" onClick={app.goExplore}>← Back</button></div>
        <div className="card u-39"><div className="u-40">This list was not found</div></div>
      </div>
    );
  }
  return (
    <div className="explore-page page">
      <div className="ex-sec-head">
        <h1 className="u-10">{g.title}</h1>
        <button className="btn-g u-16" onClick={app.goExplore}>← Back</button>
      </div>
      {g.items.length ? (
        <div className="ex-grid">
          {g.items.slice(0, shown).map((a, i1) => (<Fragment key={i1}><AstroCard a={a} /></Fragment>))}
        </div>
      ) : <p className="u-15">{g.empty}</p>}
      {g.items.length > shown ? <div><button className="btn-g" onClick={() => setShown(shown + 6)}>See More</button></div> : null}
    </div>
  );
}

function Explore() {
  const { section } = useParams();
  return section ? <Full key={section} section={section} /> : <Home />;
}

export default Explore;
