import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./Profile.css";

function Profile() {
  const app = useApp();
  return (
    <div className="profile-page page">
      <section className="card profile-1">
        <div className="profile-2">{app.pini}</div>
        <div className="u-19">
          <h1 className="u-10">{app.pname}</h1>
          <div className="u-17">{app.profile.city ? app.profile.city : "Your profile"}</div>
        </div>
        <button className="btn-g" onClick={app.goEdit}>Edit profile</button>
      </section>
      <div className="profile-3">
        <section className="card u-20">
          {app.menu.map((m, i1) => (
            <Fragment key={i1}>
              <button className="profile-4" onClick={m.go}>
                <span>{m.label}</span>
                <span className="u-17">›</span>
              </button>
            </Fragment>
          ))}
        </section>
        <section className="card u-43">
          <h2 className="u-28">Notification settings</h2>
          {app.toggles.map((t, i1) => (
            <Fragment key={i1}>
              <div className="u-44">
                <div className="u-19">
                  <div className="u-38">{t.label}</div>
                  <div className="u-21">{t.note}</div>
                </div>
                <button
                  className="tb"
                  role="switch"
                  aria-checked={t.on}
                  aria-label={t.label}
                  onClick={t.go}
                  style={cssToStyle(t.just)}>
                  <span className="kn" />
                </button>
              </div>
            </Fragment>
          ))}
          <p className="u-33">
            {"Critical alerts cannot be turned off (D-15). Email, WhatsApp and SMS are not confirmed — "}
          </p>
        </section>
      </div>
    </div>
  );
}

export default Profile;
