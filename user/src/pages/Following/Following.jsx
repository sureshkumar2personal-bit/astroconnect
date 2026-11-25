import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import AstroAvatar from "../../components/AstroAvatar/AstroAvatar";
import "./Following.css";

function Following() {
  const app = useApp();
  return (
    <div className="following-page page">
      <div><button className="btn-g u-16" onClick={app.goProfile}>← Profile</button></div>
      <h1 className="u-10">{"Following & subscriptions"}</h1>

      <h2 className="following-1">Subscribed</h2>
      <div className="u-4">
        {app.subList.map((a, i1) => (
          <Fragment key={i1}>
            <div className="card following-2 fl-card">
              <button className="following-3" onClick={a.open}>
                <AstroAvatar id={a.id} size={52} name={a.name} />
                <div>
                  <div className="following-4">{a.name}</div>
                  <div className="u-13">{a.tierText}{" · until "}{a.until}</div>
                </div>
              </button>
              <label className="fl-auto"><input type="checkbox" checked={!!a.autoRenew} onChange={a.toggleAuto} />{" Auto-renew (off by default)"}</label>
            </div>
          </Fragment>
        ))}
      </div>
      {app.noSubs ? (
        <div className="card following-5">{"You have no active subscriptions. Price, duration and renewal are "}</div>
      ) : null}

      <h2 className="following-1">Following</h2>
      <div className="u-4">
        {app.followList.map((a, i1) => (
          <Fragment key={i1}>
            <div className="card following-2">
              <button className="following-3" onClick={a.open}>
                <AstroAvatar id={a.id} size={52} name={a.name} />
                <div>
                  <div className="following-4">{a.name}</div>
                  <div className="u-13">{a.tierText ? "Subscribed · " + a.tierText : "Following (free)"}</div>
                </div>
              </button>
              <div>
                <button className="btn-g u-16" onClick={a.unfollow}>Unfollow</button>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      {app.noFollows ? <div className="card following-5">You are not following anyone yet.</div> : null}

      <h2 className="following-6">Discover</h2>
      <div className="u-4">
        {app.otherList.map((a, i1) => (
          <Fragment key={i1}>
            <div className="card following-7">
              <AstroAvatar id={a.id} size={52} name={a.name} />
              <div className="u-5">
                <div className="following-4">{a.name}</div>
              </div>
              <button className="btn-g u-31" onClick={a.follow}>Follow</button>
              <button className="btn-p u-31" onClick={a.subscribe}>Subscribe</button>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Following;
