import React from "react";
import { mobM, emM, pwScore, pwOK } from "./profileData";
import { Group, Row, H, Badge, Field } from "./ui";

// Login & Security: contacts, password, login methods and activity. Everything is simulated.
export default function Security({ s, set, toast }) {
  const others = s.sessions.filter((x) => !x.cur).length;
  const startVerify = (type) => set({ modal: "verify", vType: type, vStep: 1, vVal: "", vCode: "", vErr: "" });
  const savePw = () => {
    const e = !s.pwCur ? "Enter your current password." : pwOK(s.pwNew, s.pwConf);
    if (e) { set({ pwErr: e }); return; }
    set({ pwErr: "", pwCur: "", pwNew: "", pwConf: "", pwOpen: false }); toast("Password updated");
  };
  return (
    <>
      <H>Contact information</H>
      <Group>
        <Row icon="phone" label={<span className="pf-mut">Mobile number</span>} sub={s.mobile ? mobM(s.mobile) : "Not added"} right={<>{s.mobile ? <Badge tone="ok">Verified</Badge> : null}<button className="pf-btn2" onClick={() => startVerify("mobile")}>{s.mobile ? "Change" : "Add"}</button></>} />
        <Row icon="mail" label={<span className="pf-mut">Email address</span>} sub={s.email ? emM(s.email) : "Not added"} right={<>{s.email ? <Badge tone="ok">Verified</Badge> : null}<button className="pf-btn2" onClick={() => startVerify("email")}>{s.email ? "Change" : "Add"}</button></>} />
        <Row label="Lost access to your mobile or email?" onClick={() => set({ modal: "recover" })} chev />
      </Group>
      <H>Password &amp; recovery</H>
      <Group>
        <Row icon="key" label="Change password" sub="Last changed 3 months ago" onClick={() => set({ pwOpen: !s.pwOpen })} chev expanded={s.pwOpen} />
        {s.pwOpen ? (
          <div className="pf-pad pf-two">
            <Field id="pf-p1" label="Current password"><input id="pf-p1" type="password" className="pf-inp" value={s.pwCur} onChange={(e) => set({ pwCur: e.target.value })} /></Field>
            <Field id="pf-p2" label="New password"><input id="pf-p2" type="password" className="pf-inp" value={s.pwNew} onChange={(e) => set({ pwNew: e.target.value })} /><span className="pf-mut">{"Strength: " + pwScore(s.pwNew) + " · min 8 characters with a number"}</span></Field>
            <Field id="pf-p3" label="Confirm new password"><input id="pf-p3" type="password" className="pf-inp" value={s.pwConf} onChange={(e) => set({ pwConf: e.target.value })} /></Field>
            {s.pwErr ? <div className="pf-err">{s.pwErr}</div> : null}
            <div className="pf-btns"><button className="pf-btn" onClick={savePw}>Update password</button></div>
          </div>
        ) : null}
        <Row icon="lock" label="Forgot / reset password" onClick={() => set({ modal: "reset", rStep: 1, rCode: "", rPw: "", rPw2: "", rErr: "" })} chev />
      </Group>
      <H>Login methods</H>
      <Group>
        <Row icon="key" label="Mobile / email + password" sub="Sign in with your verified contact and password." right={<Badge tone="ok">Active</Badge>} />
        <Row icon="globe" label="Google" sub={s.googleLinked ? "Linked to priya.raman@gmail.com. Sign in with one tap." : "Link Google to sign in with one tap."} right={<><Badge tone={s.googleLinked ? "ok" : "nt"}>{s.googleLinked ? "Linked" : "Not linked"}</Badge><button className="pf-btn2" onClick={() => set({ modal: "google" })}>Manage</button></>} />
      </Group>
      <H>Login activity</H>
      <Group>
        {s.sessions.map((x) => (
          <Row key={x.id} icon="device" tone={x.cur ? "" : ""} label={<>{x.device}{x.cur ? <Badge tone="ok">This device</Badge> : null}</>} sub={x.loc + " · " + x.last} />
        ))}
        {others > 0 ? <div className="pf-pad"><button className="pf-btn2" onClick={() => { set({ sessions: s.sessions.filter((x) => x.cur) }); toast("Logged out from other sessions"); }}>Log out from other sessions</button></div> : <div className="pf-pad pf-mut">No other active sessions.</div>}
      </Group>
    </>
  );
}
