import React, { useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import "./EditProfile.css";

const LANGS = ["English", "Tamil", "Hindi", "Malayalam", "Telugu", "Marathi"];
const GENDERS = ["", "Female", "Male", "Other", "Prefer not to say"];

// Spec references such as "(D-16)" are for the documents, not for the screen.
const clean = (t) => (t || "").replace(/\s*\(D-\d+\)/g, "");

const ICONS = {
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  sliders: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  shield: <><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
};

// One box: icon, title and one line on top, then rows. Every box on this page uses it.
function Box({ icon, title, sub, children }) {
  return (
    <section className="card ep-card" aria-label={title}>
      <header className="ep-head">
        <span className="ep-ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[icon]}</svg></span>
        <div><h2 className="ep-h2">{title}</h2><p className="ep-sub">{sub}</p></div>
      </header>
      <div className="ep-rows">{children}</div>
    </section>
  );
}

// One row: label and hint on the left, the control on the right.
function Row({ label, hint, htmlFor, error, children }) {
  return (
    <div className="ep-row">
      <div className="ep-lab">
        {htmlFor ? <label htmlFor={htmlFor}>{label}</label> : <span className="ep-lbl">{label}</span>}
        {hint ? <span className="ep-hint">{hint}</span> : null}
        {error ? <span className="ep-err">{error}</span> : null}
      </div>
      <div className="ep-ctl">{children}</div>
    </div>
  );
}

function Switch({ on, onClick, label, note }) {
  return (
    <button type="button" role="switch" aria-checked={on} className="ep-switch ep-row" onClick={onClick}>
      <span className="ep-lab"><strong className="ep-lbl">{label}</strong>{note ? <span className="ep-hint">{clean(note)}</span> : null}</span>
      <span className={"ep-track" + (on ? " on" : "")}><span className="ep-knob" /></span>
    </button>
  );
}

// Shrinks the chosen image to a small square so it fits in saved profile data.
function shrink(file, done) {
  const rd = new FileReader();
  rd.onload = () => {
    const img = new Image();
    img.onload = () => {
      const S = 200, c = document.createElement("canvas");
      c.width = S; c.height = S;
      const side = Math.min(img.width, img.height);
      c.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, S, S);
      done(c.toDataURL("image/jpeg", 0.85));
    };
    img.src = rd.result;
  };
  rd.readAsDataURL(file);
}

function EditProfile() {
  const app = useApp();
  const fileRef = useRef(null);
  const [photoErr, setPhotoErr] = useState("");
  const [name, setName] = useState(app.pname || "");
  const [p, setP] = useState(() => ({ email: "", gender: "", dob: "", city: "", lang: "English", hideName: false, kundliOnly: true, ...app.profile }));
  const set = (k) => (e) => setP({ ...p, [k]: e.target.value });
  const emailBad = p.email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim());
  const nameBad = name.trim() === "";
  const save = () => { if (emailBad || nameBad) return; app.saveProfile(name, { ...p, email: p.email.trim(), city: p.city.trim() }); };
  const pick = (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) { setPhotoErr("Choose an image file"); return; }
    setPhotoErr("");
    shrink(f, (url) => setP((q) => ({ ...q, photo: url })));
  };
  const initial = (name.trim() || "?")[0].toUpperCase();
  return (
    <div className="edit-profile-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goProfile}>← Profile</button>
      </div>
      <h1 className="u-10">Edit profile</h1>

      <div className="ep-cols">
        <div className="ep-col">
          <Box icon="user" title="Personal details" sub="How you appear to astrologers.">
            {/* Sample rows (photo, birth profiles) belong to the open profile-fields question P-12-01. */}
            <Row label="Photo" hint="Shown on your profile." error={photoErr || null}>
              {p.photo ? <img className="ep-avatar" src={p.photo} alt="Your profile" /> : <span className="ep-avatar" aria-hidden="true">{initial}</span>}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />
              <button type="button" className="btn-g ep-small" onClick={() => fileRef.current && fileRef.current.click()}>{p.photo ? "Change photo" : "Add photo"}</button>
              {p.photo ? <button type="button" className="btn-g ep-small" onClick={() => setP((q) => ({ ...q, photo: "" }))}>Remove</button> : null}
            </Row>
            <Row label="Full name" htmlFor="pn" error={nameBad ? "Enter your name" : null}>
              <input className="inp" id="pn" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={nameBad} />
            </Row>
            <Row label="Mobile number" htmlFor="pm" hint="Linked to your login">
              <input className="inp" id="pm" value="Linked to your login" readOnly disabled />
            </Row>
            <Row label="Email (optional)" htmlFor="pe" error={emailBad ? "Enter a valid email address" : null}>
              <input className="inp" id="pe" type="email" placeholder="name@example.com" value={p.email} onChange={set("email")} aria-invalid={emailBad} />
            </Row>
            <Row label="Gender" htmlFor="pg">
              <select className="inp" id="pg" value={p.gender} onChange={set("gender")}>
                {GENDERS.map((g) => (<option key={g} value={g}>{g || "Select"}</option>))}
              </select>
            </Row>
            <Row label="Date of birth" htmlFor="pd">
              <input className="inp" id="pd" type="date" max={new Date().toISOString().slice(0, 10)} value={p.dob} onChange={set("dob")} />
            </Row>
            <Row label="City" htmlFor="pc">
              <input className="inp" id="pc" placeholder="Where you live" value={p.city} onChange={set("city")} />
            </Row>
            <Row label="Birth profiles" hint="Birth details saved for your Kundli.">
              <button className="btn-g ep-small" onClick={app.goKundli}>Open</button>
            </Row>
          </Box>
        </div>

        <div className="ep-col">
          <Box icon="sliders" title="Preferences" sub="Language, theme and time.">
            <Row label="Language" htmlFor="pl">
              <select className="inp" id="pl" value={p.lang} onChange={set("lang")}>
                {LANGS.map((l) => (<option key={l} value={l}>{l}</option>))}
              </select>
            </Row>
            <Row label="Theme">
              <div className="ep-chips" role="group" aria-label="Theme">
                <button className={"chip" + (app.isDark ? " on" : "")} onClick={() => { if (!app.isDark) app.toggleTheme(); }}>Dark</button>
                <button className={"chip" + (app.isLight ? " on" : "")} onClick={() => { if (!app.isLight) app.toggleTheme(); }}>Light</button>
              </div>
            </Row>
            <Row label="Time zone" hint="Used for appointment times.">
              <span className="ep-static">India Standard Time (IST)</span>
            </Row>
          </Box>

          <Box icon="bell" title="Notifications" sub="Choose what reaches you.">
            {app.toggles.map((t, i1) => (
              <Switch key={i1} on={t.on === "true"} label={t.label} note={t.note} onClick={t.go} />
            ))}
          </Box>

          <Box icon="shield" title="Privacy" sub="Control what astrologers can see.">
            <Switch on={p.hideName} label="Show only my first name to astrologers" note="Your full name stays on your own profile" onClick={() => setP({ ...p, hideName: !p.hideName })} />
            <Switch on={p.kundliOnly} label="Share my Kundli only for the service I choose" note="Birth details are shared only with your consent for a paid service (D-37)" onClick={() => setP({ ...p, kundliOnly: !p.kundliOnly })} />
            <Row label="Download my data" hint="A copy of your profile and activity.">
              <button className="btn-g ep-small" disabled title="Coming soon">Request</button>
            </Row>
          </Box>
        </div>
      </div>

      <div className="ep-actions">
        <button className="btn-p" onClick={save} disabled={emailBad || nameBad}>Save changes</button>
        <button className="btn-g" onClick={app.goProfile}>Cancel</button>
        <button className="btn-g ep-delete" disabled title="Coming soon">Delete account</button>
      </div>
    </div>
  );
}

export default EditProfile;
