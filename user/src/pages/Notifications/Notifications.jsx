import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./Notifications.css";

function Notifications() {
  const app = useApp();
  return (
    <div className="notifications-page page">
      <div><button className="btn-g u-16" onClick={app.goProfile}>← Profile</button></div>
      <h1 className="u-10">Notifications</h1>
      <div className="u-25">
        <section className="card u-37">
          {app.notifs.map((n, i1) => (
            <Fragment key={i1}>
              <button className="notifications-1" onClick={n.open}>
                <span className="pill u-34">{n.cat}{n.crit ? " · Critical" : ""}</span>
                <span className="notifications-2">{n.text}</span>
                <span className="u-17">›</span>
              </button>
            </Fragment>
          ))}
        </section>
        <section className="card u-43">
          <h2 className="u-41">Preferences</h2>
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
            {"Critical: appointment, question, payment/wallet, subscription, security and account alerts are always on (D-15). Non-critical list — "}
          </p>
        </section>
      </div>
    </div>
  );
}

export default Notifications;
