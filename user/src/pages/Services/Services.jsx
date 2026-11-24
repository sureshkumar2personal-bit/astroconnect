import React, { Fragment } from "react";
import { useApp } from "../../context/AppContext";
import "./Services.css";

function Services() {
  const app = useApp();
  return (
    <div className="services-page page">
      <div>
        <h1 className="u-22">Services</h1>
        <p className="u-23">
          {"Start something new. Already bought or used a service? "}
          <button className="services-1" onClick={app.goActivity}>Open Activity</button>
        </p>
      </div>
      <div className="u-18">
        {app.services.map((v, i1) => (
          <Fragment key={i1}>
            <div className="card services-2">
              <div className="services-3">{v.name}</div>
              <div className="services-4">{v.blurb}</div>
              <div>
                <button className="btn-p" onClick={v.go}>Start</button>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <p className="u-15">
        {"Which services appear here and their layout — "}
      </p>
    </div>
  );
}

export default Services;
