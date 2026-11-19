import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./Following.css";

function Following() {
  const app = useApp();
  return (
    <div className="following-page page">
      <h1 className="u-10">{"Following & subscriptions"}</h1>
      <span className="tag u-24">Follow vs Subscribe · PENDING · P-14-01</span>
      <h2 className="following-1">Subscribed</h2>
      <div className="u-4">
        {app.subList.map((a, i1) => (
          <Fragment key={i1}>
            <div className="card following-2">
              <button className="following-3" onClick={a.open}>
                <div style={cssToStyle(a.av)}>{a.ini}</div>
                <div>
                  <div className="following-4">{a.name}</div>
                  <div className="u-13">{a.spec}</div>
                </div>
              </button>
              <div>
                <button className="btn-g u-16" onClick={a.unsub}>Unsubscribe</button>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      {app.noSubs ? (
        <div className="card following-5">You have no subscriptions. Price, duration and renewal — PENDING · P-14-02 – P-14-05</div>
      ) : null}
      <h2 className="following-6">Discover</h2>
      <div className="u-4">
        {app.otherList.map((a, i1) => (
          <Fragment key={i1}>
            <div className="card following-7">
              <div style={cssToStyle(a.av)}>{a.ini}</div>
              <div className="u-5">
                <div className="following-4">{a.name}</div>
              </div>
              <button className="btn-p u-31" onClick={a.sub}>Subscribe</button>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Following;
