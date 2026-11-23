import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./Explore.css";

function AstroCard({ a }) {
  return (
    <article className="card ex-card">
      <button className="ex-top" onClick={a.open} aria-label={"Open " + a.name + " profile"}>
        <div style={cssToStyle(a.av)}>{a.ini}</div>
        <div className="ex-who">
          <div className="ex-name">{a.name}</div>
          <div className="u-13">{a.spec}</div>
        </div>
        <span className={"pill ex-avail " + a.availCls}>{a.avail}</span>
      </button>
      <div className="ex-facts">
        <span>{a.ratingText}</span>
        <span>{a.years}</span>
        <span>{a.followers}</span>
      </div>
      <div className="ex-tags" aria-label="Areas of expertise">
        {a.expertise.map((t, i1) => (<Fragment key={i1}><span className="chip ex-chip">{t}</span></Fragment>))}
      </div>
      <div className="u-13">{"Languages: "}{a.langList.join(", ")}</div>
      <div className="u-15">{a.priceText}</div>
      <div className="ex-actions">
        <button className="btn-p ex-btn" onClick={a.call} disabled={!a.canContact}>Call</button>
        <button className="btn-p ex-btn" onClick={a.chat} disabled={!a.canContact}>Chat</button>
        <button className="btn-g ex-btn" onClick={a.open}>View Profile</button>
      </div>
    </article>
  );
}

function Home() {
  const app = useApp();
  return (
    <div className="explore-page page">
      <div>
        <h1 className="u-10">Explore Astrologers</h1>
        <p className="u-23">Find an astrologer for your next consultation</p>
      </div>
      <div className="ex-search">
        <label className="u-11" htmlFor="sq">Search astrologers</label>
        <input className="inp" id="sq" placeholder="Search by name, speciality, expertise or language" value={app.q ?? ""} onChange={app.onQ} />
        <span className="tag u-24">Search fields, filters, sorting and ranking · PENDING · P-04-01 – P-04-04</span>
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
              {sec.key === "suggested" ? <span className="tag u-24">Suggestion order · PENDING · P-04-04</span> : null}
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
