import React, { Fragment } from "react";
import { useApp } from "../../context/AppContext";
import "./Kundli.css";

function Kundli() {
  const app = useApp();
  return (
    <div className="kundli-page page">
      <div><button className="btn-g u-16" onClick={app.goProfile}>← Profile</button></div>
      <h1 className="u-10">{"Birth profiles & Kundli"}</h1>
      <div className="kundli-1">
        {app.bps.map((b, i1) => (
          <Fragment key={i1}>
            <button className={`${b.cls}`} onClick={b.go}>{b.name}</button>
          </Fragment>
        ))}
        <button className="btn-g u-16" onClick={app.addBp}>+ Add profile</button>
        <span className="tag">Unlimited for now (D-12)</span>
      </div>
      <div className="u-25">
        <section className="card u-29">
          <h2 className="u-41">Birth details</h2>
          <label className="u-7" htmlFor="bn">Name</label>
          <input className="inp" id="bn" value={app.bp.name ?? ""} onChange={app.setName} />
          <label className="u-7" htmlFor="bd">Date of birth</label>
          <input className="inp" id="bd" value={app.bp.dob ?? ""} onChange={app.setDob} />
          <label className="u-7" htmlFor="bt">Time of birth</label>
          <input className="inp" id="bt" value={app.bp.tob ?? ""} onChange={app.setTob} />
          <label className="u-7" htmlFor="bp">Place of birth</label>
          <input className="inp" id="bp" value={app.bp.pob ?? ""} onChange={app.setPob} />
          <div>
            <button className="btn-p" onClick={app.saveBp}>Save</button>
          </div>
          <p className="u-33">
            {"Changing date, time or place updates the Kundli automatically; uploaded files stay unchanged (D-14). Fields — "}
            {" Delete — "}
          </p>
        </section>
        <div className="u-26">
          <section className="card kundli-2">
            <h2 className="kundli-3">Kundli</h2>
            <svg
              viewBox="0 0 200 200"
              width="240"
              height="240"
              role="img"
              aria-label="Kundli chart"
              fill="none"
              stroke="var(--acc)"
              strokeWidth="1.5">
              <rect x="4" y="4" width="192" height="192" />
              <path d="M4 4 196 196M196 4 4 196M100 4 4 100 100 196 196 100Z" />
              <text x="100" y="52" fill="var(--em)" stroke="none" fontSize="14" textAnchor="middle">1</text>
              <text x="52" y="100" fill="var(--em)" stroke="none" fontSize="14" textAnchor="middle">4</text>
              <text x="100" y="156" fill="var(--em)" stroke="none" fontSize="14" textAnchor="middle">7</text>
              <text x="150" y="100" fill="var(--em)" stroke="none" fontSize="14" textAnchor="middle">10</text>
            </svg>
            <span className="u-21">
              {"Chart for "}{app.bp.name}{" · "}
            </span>
          </section>
          <section className="card u-29">
            <h2 className="u-41">Uploaded birth charts</h2>
            <label className="btn-g kundli-4" htmlFor="fu">Upload JPG, PNG or PDF</label>
            <input className="u-11" id="fu" type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={app.onFile} />
            {app.files.map((f, i1) => (
              <Fragment key={i1}>
                <div className="kundli-5">{f.name}</div>
              </Fragment>
            ))}
          </section>
        </div>
      </div>
      <section className="card kd-consent">
        <h2 className="u-41">Sharing your birth details</h2>
        <p className="u-33">Your birth details and horoscope are shared with an astrologer only with your consent for the paid service you choose (D-37). Which birth profile is shared for other services: </p>
        {app.hasConsents ? (
          app.consents.map((c, i1) => (
            <Fragment key={i1}>
              <div className="kd-consent-row"><strong>{c.text}</strong><span className="u-13">{"Consent given · "}{c.when}</span></div>
            </Fragment>
          ))
        ) : <span className="u-21">No consents given yet.</span>}
      </section>
    </div>
  );
}

export default Kundli;
