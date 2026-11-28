import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { INIT, ini } from "./profileData";
import { Ic, Group, Row, Back } from "./ui";
import EditProfileScreen from "./EditProfileScreen";
import NotifPrefs from "./NotifPrefs";
import Security from "./Security";
import Privacy from "./Privacy";
import DeleteAccount from "./DeleteAccount";
import Sheets from "./Sheets";
import "./Profile.css";

const TITLES = { edit: "Edit Profile", notifications: "Notification Preferences", security: "Login & Security", privacy: "Privacy & Visibility", delete: "Deactivate & Delete Account" };

// Profile section: hub plus Edit Profile, Notification Preferences, Login & Security, Privacy & Visibility and Deactivate & Delete.
// Routes /profile and /profile/<screen>. Prototype data only: nothing here changes the real account.
function Profile() {
  const app = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const screen = pathname.replace(/^\/profile\/?/, "").split("/")[0] || "hub";
  const [s, setS] = useState(INIT);
  const [toast, setToastMsg] = useState("");
  const timers = useRef([]);
  const set = (p) => setS((x) => ({ ...x, ...(typeof p === "function" ? p(x) : p) }));
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.current.push(t); return t; };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const showToast = (msg) => { setToastMsg(msg); later(() => setToastMsg((t) => (t === msg ? "" : t)), 2600); };
  useEffect(() => {
    if (!s.modal) return undefined;
    const onKey = (e) => { if (e.key === "Escape") set({ modal: "" }); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [s.modal]);
  const go = (p) => navigate(p);
  // The Edit screen starts from the saved values each time it opens.
  useEffect(() => { if (screen === "edit") set({ ed: { name: s.name, lang: s.lang, theme: app.isDark ? "Dark" : "Light", photo: s.photo }, nameErr: false }); }, [screen]);

  const ctx = { s, set, toast: showToast, go, later };
  return (
    <div className="profile-page page">
      <div className="pfp">
        <main className="pf-wrap">
          {screen !== "hub" ? <Back title={TITLES[screen] || "Profile"} onBack={() => go("/profile")} /> : null}

          {screen === "hub" ? (
            <>
              <section className="pf-hero">
                <div className="pf-av">{s.photo ? ini(s.name) : "+"}</div>
                <div className="pf-rt"><h1 className="pf-name">{s.name}</h1><div className="pf-mut">AstroConnect member</div></div>
                <button className="pf-btn2" onClick={() => go("/profile/edit")}>Edit Profile</button>
              </section>
              <Group>
                <Row icon="star" label="Birth Profiles & Kundli" sub="Saved profiles and Kundli" onClick={() => go("/kundli")} chev />
                <Row icon="help" label="Help & Support" sub="FAQs, tickets and contact" onClick={() => go("/help")} chev />
              </Group>
              <h2 className="pf-h">Account Settings</h2>
              <Group>
                <Row icon="bell" label="Notification Preferences" onClick={() => go("/profile/notifications")} chev />
                <Row icon="lock" label="Login & Security" onClick={() => go("/profile/security")} chev />
                <Row icon="eye" label="Privacy & Visibility" onClick={() => go("/profile/privacy")} chev />
                <Row icon="trash" tone="d" label="Deactivate & Delete Account" onClick={() => go("/profile/delete")} chev />
                <Row icon="logout" tone="d" label="Logout" onClick={() => set({ modal: "logout" })} chev />
              </Group>
            </>
          ) : null}
          {screen === "edit" ? <EditProfileScreen {...ctx} /> : null}
          {screen === "notifications" ? <NotifPrefs {...ctx} /> : null}
          {screen === "security" ? <Security {...ctx} /> : null}
          {screen === "privacy" ? <Privacy {...ctx} /> : null}
          {screen === "delete" ? <DeleteAccount {...ctx} /> : null}
          {!["hub", "edit", "notifications", "security", "privacy", "delete"].includes(screen) ? <div className="pf-note pf-note-i">This screen was not found.</div> : null}
        </main>
        <Sheets s={s} set={set} toast={showToast} onLogout={app.logout} />
        {toast ? <div role="status" className="pf-toast">{toast}</div> : null}
      </div>
    </div>
  );
}

export default Profile;
