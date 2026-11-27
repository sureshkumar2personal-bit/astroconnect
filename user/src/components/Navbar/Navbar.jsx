import React, { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./Navbar.css";

function Navbar() {
  const app = useApp();
  const profRef = useRef(null);
  const moreRef = useRef(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const { pathname } = useLocation();
  const byLabel = (l) => app.nav.find((n) => n.label === l);
  const onWallet = pathname.startsWith("/wallet");
  const navigate = useNavigate();
  const activity = byLabel("Activity");
  const moreItems = [
    { label: "Activity", paths: ["/activity", "/answer"], go: app.goActivity },
    { label: "Remedy Tracker", paths: ["/remedy"], go: app.goRemedy },
    { label: "Following and Subscriptions", paths: ["/follow"], go: () => navigate("/follow") },
    { label: "Birth Profiles and Kundli", paths: ["/kundli"], go: app.goKundli },
    { label: "Notifications", paths: ["/notifs"], go: app.goNotifs },
  ];
  const itemOn = (it) => it.paths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const moreOn = moreItems.some(itemOn) || (!!activity && / on\b/.test(activity.cls));
  // "More…" menu: close on an outside click or the Escape key.
  useEffect(() => {
    if (!moreOpen) return undefined;
    const onDown = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setMoreOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [moreOpen]);
  // Close the profile menu on an outside click or the Escape key.
  useEffect(() => {
    if (!app.profMenu) return undefined;
    const onDown = (e) => { if (profRef.current && !profRef.current.contains(e.target)) app.closeProf(); };
    const onKey = (e) => { if (e.key === "Escape") app.closeProf(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [app.profMenu]);

  return (
    <header className="navbar">
      <nav className="navbar-1" aria-label="Main">
        <button className="navbar-2" onClick={app.goHome}>
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 1.5 13.6 10.4 22.5 12 13.6 13.6 12 22.5 10.4 13.6 1.5 12 10.4 10.4Z" fill="var(--em)" />
            <path
              d="M12 5.5 12.9 11.1 18.5 12 12.9 12.9 12 18.5 11.1 12.9 5.5 12 11.1 11.1Z"
              fill="var(--acc2)"
              transform="rotate(45 12 12)"
            />
          </svg>
          <span className="navbar-3">ASTRUM</span>
        </button>
        <div className="navbar-4">
          {["Home", "Explore", "Services"].map((l) => byLabel(l) && (
            <button key={l} className={byLabel(l).cls} onClick={byLabel(l).go}>{l}</button>
          ))}
          <button className={"nv" + (onWallet ? " on" : "")} onClick={app.goWallet}>Wallet</button>
          {byLabel("Profile") && (
            <button className={byLabel("Profile").cls.replace(" on", "") + (!onWallet && !moreOn && / on\b/.test(byLabel("Profile").cls) ? " on" : "")} onClick={byLabel("Profile").go}>Profile</button>
          )}
          <div className="navbar-more" ref={moreRef}>
            <button className={"nv navbar-morebtn" + (moreOn ? " on" : "")} onClick={() => setMoreOpen(!moreOpen)} aria-haspopup="menu" aria-expanded={moreOpen}>
              <span className="navbar-moretxt">More</span>
              <span className={"navbar-caretbox" + (moreOpen ? " open" : "")} aria-hidden="true">
                <svg className="navbar-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 9.5 12 15l5.5-5.5" /></svg>
              </span>
            </button>
            {moreOpen ? (
              <div className="card navbar-menu navbar-more-menu" role="menu" aria-label="More">
                {moreItems.map((it) => (
                  <button key={it.label} className={"navbar-item" + (itemOn(it) ? " on" : "")} role="menuitem" aria-current={itemOn(it) ? "page" : undefined} onClick={() => { setMoreOpen(false); it.go(); }}>{it.label}</button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <button className="ico" onClick={app.toggleTheme} aria-label={app.themeLabel} title={app.themeLabel}>
          {app.isDark ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--acc)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
          ) : null}
          {app.isLight ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--acc)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
            </svg>
          ) : null}
        </button>
        <button className="ico" onClick={app.goWallet} aria-label={"Wallet balance ₹" + app.wallet}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--acc)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            <path d="M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l2-3h12M16 14h2" />
          </svg>
          ₹{app.wallet}
        </button>
        <button className="ico" onClick={app.toggleNotif} aria-label="Notifications">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--acc)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            <path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4" />
          </svg>
        </button>
        <div className="navbar-prof" ref={profRef}>
          <button className="ico navbar-5" onClick={app.toggleProf} aria-label="Profile" aria-haspopup="menu" aria-expanded={app.profMenu}>{app.pini}</button>
          {app.profMenu ? (
            <div className="card navbar-menu" role="menu" aria-label="Profile menu">
              <button className="navbar-item" role="menuitem" onClick={app.viewProfile}>View profile</button>
              <button className="navbar-item" role="menuitem" onClick={app.logout}>Log out</button>
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
