import React, { Fragment } from "react";
import { useApp } from "../../context/AppContext";
import "./Remedy.css";

function Remedy() {
  const app = useApp();
  return (
    <div className="remedy-page page">
      <div>
        <h1 className="u-22">Remedy Tracker</h1>
        <p className="u-23">Every remedy an astrologer prescribes or attaches, from any service (D-11).</p>
      </div>
      <div className="u-18">
        {app.remedies.map((r, i1) => (
          <Fragment key={i1}>
            <div className="card u-45">
              <div className="u-35">{r.title}</div>
              <div className="u-13">{"From "}{r.src}</div>
            </div>
          </Fragment>
        ))}
      </div>
      {app.noRem ? (
        <div className="card u-39">
          <div className="u-40">No remedies yet</div>
          <div className="remedy-1">
            {"Remedies prescribed in any service will appear here. "}
            <span className="tag">Content · PENDING · P-16-01</span>
          </div>
        </div>
      ) : null}
      <p className="u-15">
        {"Progress, reminders and user-added remedies — "}
        <span className="tag">PENDING · P-16-02 – P-16-04</span>
      </p>
    </div>
  );
}

export default Remedy;
