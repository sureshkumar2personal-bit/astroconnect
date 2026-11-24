import React, { Fragment, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import "./Navbar.css";

function Navbar() {
  const app = useApp();
  const profRef = useRef(null);
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
          {app.nav.map((n, i1) => (
            <Fragment key={i1}>
              <button className={`${n.cls}`} onClick={n.go}>{n.label}</button>
            </Fragment>
          ))}
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
        <button className="ico" onClick={app.goWallet} aria-label="Wallet">
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
