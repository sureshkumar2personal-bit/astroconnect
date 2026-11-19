import React, { Fragment } from "react";
import { useApp } from "../../context/AppContext";
import "./NotifDropdown.css";

function NotifDropdown() {
  const app = useApp();
  if (!app.notifOpen) return null;
  return (
    <div className="notif-dropdown card">
      <div className="notif-dropdown-1">
        <strong className="notif-dropdown-2">Notifications</strong>
        <button className="ico u-46" onClick={app.toggleNotif} aria-label="Close">✕</button>
      </div>
      {app.bellList.map((n, i1) => (
        <Fragment key={i1}>
          <button className="notif-dropdown-3" onClick={n.open}>
            {n.text}{" "}
            <span className="pill u-34">Critical</span>
          </button>
        </Fragment>
      ))}
      <button className="btn-g notif-dropdown-4" onClick={app.goNotifs}>See all</button>
    </div>
  );
}

export default NotifDropdown;
