import React from "react";
import { useApp } from "../../context/AppContext";
import { ini, mobM, emM, LANGS } from "./profileData";
import { Group, Row, Badge, Field, Ic } from "./ui";

// Edit Profile: photo, name, verified contacts, language and theme. Prototype data only.
export default function EditProfileScreen({ s, set, toast, go }) {
  const app = useApp();
  const ed = s.ed;
  const setEd = (p) => set((x) => ({ ed: { ...x.ed, ...p } }));
  const save = () => {
    if (!ed.name.trim()) { set({ nameErr: true }); return; }
    set({ name: ed.name.trim(), lang: ed.lang, photo: ed.photo, nameErr: false });
    if ((ed.theme === "Dark") !== !!app.isDark) app.toggleTheme();
    toast("Profile updated"); go("/profile");
  };
  return (
    <>
      <Group>
        <div className="pf-pad pf-photo">
          <div className="pf-av lg">{ed.photo ? ini(ed.name || s.name) : "+"}</div>
          <div><div className="pf-t">Profile photo</div>
            <div className="pf-btns"><button className="pf-btn2" onClick={() => { setEd({ photo: true }); toast("New photo selected"); }}><Ic n="camera" size={16} />Change</button><button className="pf-btn2" onClick={() => setEd({ photo: false })}>Remove</button></div></div>
        </div>
      </Group>
      <Group>
        <div className="pf-pad">
          <Field id="pf-e1" label="Full name"><input id="pf-e1" className="pf-inp" value={ed.name} onChange={(e) => { setEd({ name: e.target.value }); set({ nameErr: false }); }} /></Field>
          {s.nameErr ? <div className="pf-err">Full name is required.</div> : null}
        </div>
        <Row icon="phone" label={<span className="pf-mut">Mobile number</span>} sub={s.mobile ? mobM(s.mobile) : "Not added"} right={<><Badge tone="ok">Verified</Badge><button className="pf-btn2" onClick={() => set({ modal: "verify", vType: "mobile", vStep: 1, vVal: "", vCode: "", vErr: "" })}>Change</button></>} />
        <Row icon="mail" label={<span className="pf-mut">Email address</span>} sub={s.email ? emM(s.email) : "Not added"} right={<><Badge tone="ok">Verified</Badge><button className="pf-btn2" onClick={() => set({ modal: "verify", vType: "email", vStep: 1, vVal: "", vCode: "", vErr: "" })}>Change</button></>} />
        <div className="pf-pad">
          <Field id="pf-e3" label="Language"><select id="pf-e3" className="pf-inp" value={ed.lang} onChange={(e) => setEd({ lang: e.target.value })}>{LANGS.map((l) => (<option key={l}>{l}</option>))}</select></Field>
          <div className="pf-fld"><span className="pf-lbl">Theme</span>
            <div className="pf-seg">{["Light", "Dark"].map((t) => (<button key={t} className={ed.theme === t ? "on" : ""} aria-pressed={ed.theme === t} onClick={() => setEd({ theme: t })}>{t}</button>))}</div></div>
        </div>
      </Group>
      <div className="pf-btns pf-end"><button className="pf-btn2" onClick={() => go("/profile")}>Cancel</button><button className="pf-btn" onClick={save}>Save Changes</button></div>
    </>
  );
}
