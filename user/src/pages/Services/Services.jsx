import React, { Fragment } from "react";
import { useApp } from "../../context/AppContext";
import "./Services.css";

function Services() {
  const app = useApp();
  const instant = app.services.filter((v) => v.name === "Instant Call" || v.name === "Instant Chat");
  const call = instant.find((v) => v.name === "Instant Call") || instant[0];
  return (
    <div className="services-page page">
      <div>
        <h1 className="u-22">Services</h1>
      </div>
      <div className="u-18">
        {app.services.map((v, i1) => (
          v.name === "Instant Call" ? (
            <div className="card services-2" key="instant">
              <div className="services-3">Instant Call &amp; Chat</div>
              <div className="services-4">Talk or chat with an astrologer now.</div>
              <div>
                <button className="btn-p" onClick={call ? call.go : undefined}>Start</button>
              </div>
            </div>
          ) : v.name === "Instant Chat" ? null : (
          <Fragment key={i1}>
            <div className="card services-2">
              <div className="services-3">{v.name}</div>
              <div className="services-4">{v.blurb}</div>
              <div>
                <button className="btn-p" onClick={v.go}>Start</button>
              </div>
            </div>
          </Fragment>
          )
        ))}
      </div>
      <p className="u-15">
        {"Which services appear here and their layout — "}
      </p>
    </div>
  );
}

export default Services;
