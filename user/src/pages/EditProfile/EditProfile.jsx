import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import "./EditProfile.css";

const LANGS = ["English", "Tamil", "Hindi", "Malayalam", "Telugu", "Marathi"];
const GENDERS = ["", "Female", "Male", "Other", "Prefer not to say"];

function Switch({ on, onClick, label, note }) {
  return (
    <button type="button" role="switch" aria-checked={on} className="ep-switch" onClick={onClick}>
      <span className="ep-switch-text"><strong>{label}</strong>{note ? <span className="u-13">{note}</span> : null}</span>
      <span className={"ep-track" + (on ? " on" : "")}><span className="ep-knob" /></span>
    </button>
  );
}

function EditProfile() {
  const app = useApp();
  const [name, setName] = useState(app.pname || "");
  const [p, setP] = useState(() => ({ email: "", gender: "", dob: "", city: "", lang: "English", hideName: false, kundliOnly: true, ...app.profile }));
  const set = (k) => (e) => setP({ ...p, [k]: e.target.value });
  const emailBad = p.email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim());
  const nameBad = name.trim() === "";
  const save = () => { if (emailBad || nameBad) return; app.saveProfile(name, { ...p, email: p.email.trim(), city: p.city.trim() }); };
  const initial = (name.trim() || "?")[0].toUpperCase();
  return (
    <div className="edit-profile-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goProfile}>← Profile</button>
      </div>
      <h1 className="u-10">Edit profile</h1>

      <section className="card ep-card" aria-label="Personal details">
        <h2 className="ep-h2">Personal details</h2>
        <div className="ep-photo"><div className="ep-avatar" aria-hidden="true">{initial}</div><span className="u-13">Your initial is used as your profile picture.</span></div>
        <div className="ep-grid">
          <div className="ep-field">
            <label className="u-7" htmlFor="pn">Full name</label>
            <input className="inp" id="pn" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={nameBad} />
            {nameBad ? <span className="ep-err">Enter your name</span> : null}
          </div>
          <div className="ep-field">
            <label className="u-7" htmlFor="pm">Mobile number</label>
            <input className="inp" id="pm" value="Linked to your login" readOnly disabled />
          </div>
          <div className="ep-field">
            <label className="u-7" htmlFor="pe">Email (optional)</label>
            <input className="inp" id="pe" type="email" placeholder="name@example.com" value={p.email} onChange={set("email")} aria-invalid={emailBad} />
            {emailBad ? <span className="ep-err">Enter a valid email address</span> : null}
          </div>
          <div className="ep-field">
            <label className="u-7" htmlFor="pg">Gender</label>
            <select className="inp" id="pg" value={p.gender} onChange={set("gender")}>
              {GENDERS.map((g) => (<option key={g} value={g}>{g || "Select"}</option>))}
            </select>
          </div>
          <div className="ep-field">
            <label className="u-7" htmlFor="pd">Date of birth</label>
            <input className="inp" id="pd" type="date" max={new Date().toISOString().slice(0, 10)} value={p.dob} onChange={set("dob")} />
          </div>
          <div className="ep-field">
            <label className="u-7" htmlFor="pc">City</label>
            <input className="inp" id="pc" placeholder="Where you live" value={p.city} onChange={set("city")} />
          </div>
        </div>
      </section>

      <section className="card ep-card" aria-label="Preferences">
        <h2 className="ep-h2">Preferences</h2>
        <div className="ep-grid">
          <div className="ep-field">
            <label className="u-7" htmlFor="pl">Language</label>
            <select className="inp" id="pl" value={p.lang} onChange={set("lang")}>
              {LANGS.map((l) => (<option key={l} value={l}>{l}</option>))}
            </select>
          </div>
          <div className="ep-field">
            <span className="u-7">Theme</span>
            <div className="u-12" role="group" aria-label="Theme">
              <button className={"chip" + (app.isDark ? " on" : "")} onClick={() => { if (!app.isDark) app.toggleTheme(); }}>Dark</button>
              <button className={"chip" + (app.isLight ? " on" : "")} onClick={() => { if (!app.isLight) app.toggleTheme(); }}>Light</button>
            </div>
          </div>
        </div>
      </section>

      <section className="card ep-card" aria-label="Notifications">
        <h2 className="ep-h2">Notifications</h2>
        {app.toggles.map((t, i1) => (
          <Switch key={i1} on={t.on === "true"} label={t.label} note={t.note} onClick={t.go} />
        ))}
      </section>

      <section className="card ep-card" aria-label="Privacy">
        <h2 className="ep-h2">Privacy</h2>
        <Switch on={p.hideName} label="Show only my first name to astrologers" note="Your full name stays on your own profile" onClick={() => setP({ ...p, hideName: !p.hideName })} />
        <Switch on={p.kundliOnly} label="Share my Kundli only for the service I choose" note="Birth details are shared only with your consent for a paid service (D-37)" onClick={() => setP({ ...p, kundliOnly: !p.kundliOnly })} />
      </section>

      <div className="ep-actions">
        <button className="btn-p" onClick={save} disabled={emailBad || nameBad}>Save changes</button>
        <button className="btn-g" onClick={app.goProfile}>Cancel</button>
        <button className="btn-g ep-delete" disabled title="Coming soon">Delete account</button>
      </div>
    </div>
  );
}

export default EditProfile;
