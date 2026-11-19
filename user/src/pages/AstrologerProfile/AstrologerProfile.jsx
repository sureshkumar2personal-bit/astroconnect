import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./AstrologerProfile.css";

function AstrologerProfile() {
  const app = useApp();
  return (
    <div className="astrologer-profile-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goExplore}>← Back</button>
      </div>
      <section className="card astrologer-profile-1">
        <div style={cssToStyle(app.cur.avL)}>{app.cur.ini}</div>
        <div className="astrologer-profile-2">
          <h1 className="u-10">{app.cur.name}</h1>
          <div className="astrologer-profile-3">{app.cur.spec}</div>
          <div className="u-17">{app.cur.langs}</div>
          <div className="astrologer-profile-4">{app.cur.bio}</div>
        </div>
        <div className="astrologer-profile-5">
          <button className={`${app.subCls}`} onClick={app.toggleSub}>{app.subLabel}</button>
          <div className="u-12">
            <button className="btn-g astrologer-profile-6" onClick={app.openTerms}>Subscription terms</button>
            <button className="btn-g astrologer-profile-6" onClick={app.openReport}>Share or report</button>
          </div>
        </div>
      </section>
      <section>
        <h2 className="u-2">Services</h2>
        <div className="u-18">
          {app.astroSvc.map((v, i1) => (
            <Fragment key={i1}>
              <div className="card astrologer-profile-7">
                <div className="u-19">
                  <div className="u-6">{v.name}</div>
                  <div className="u-13">{v.note}</div>
                </div>
                <button className="btn-p u-20" onClick={v.go}>Start</button>
              </div>
            </Fragment>
          ))}
        </div>
      </section>
      <section>
        <h2 className="u-2">Reviews</h2>
        <div className="u-18">
          <div className="card astrologer-profile-8">
            <p className="astrologer-profile-9">“Clear, kind and specific. I knew exactly what to do next.”</p>
            <span className="u-21">Sample review · after Instant Chat (D-10)</span>
          </div>
          <div className="card astrologer-profile-8">
            <p className="astrologer-profile-9">“The appointment ran on time and the answers were thoughtful.”</p>
            <span className="u-21">Sample review · after Appointment (D-10)</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AstrologerProfile;
