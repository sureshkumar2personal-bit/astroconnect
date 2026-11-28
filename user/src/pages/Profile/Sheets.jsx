import React from "react";
import { pwOK } from "./profileData";
import { Sheet, Field } from "./ui";

// Modal sheets for the Profile section. All flows are simulated.
export default function Sheets({ s, set, toast, onLogout }) {
  const close = () => set({ modal: "" });
  const m = s.modal;
  if (!m) return null;
  const Btns = ({ children }) => <div className="pf-btns pf-end">{children}</div>;

  if (m === "verify") {
    const mob = s.vType === "mobile";
    const next = () => {
      if (s.vStep === 1) {
        const ok = mob ? /^\d{10}$/.test(s.vVal.replace(/\s/g, "")) : /^\S+@\S+\.\S+$/.test(s.vVal);
        if (!ok) { set({ vErr: mob ? "Enter a valid 10-digit number." : "Enter a valid email address." }); return; }
        set({ vStep: 2, vErr: "" });
      } else {
        if (!/^\d{4,6}$/.test(s.vCode)) { set({ vErr: "Enter the 4–6 digit code." }); return; }
        set({ [s.vType]: mob ? s.vVal.replace(/\s/g, "") : s.vVal, modal: "" }); toast((mob ? "Mobile number" : "Email") + " verified and updated");
      }
    };
    const has = mob ? s.mobile : s.email;
    return (
      <Sheet title={(has ? "Change" : "Add") + (mob ? " mobile number" : " email address")} onClose={close} label="Verify contact">
        {s.vStep === 1 ? <Field id="pf-v1" label={mob ? "New mobile number (10 digits)" : "New email address"}><input id="pf-v1" className="pf-inp" value={s.vVal} onChange={(e) => set({ vVal: e.target.value, vErr: "" })} /></Field> : (
          <>
            <div className="pf-mut">A verification code was sent. Enter the 4–6 digit code.</div>
            <Field id="pf-v2" label="Verification code"><input id="pf-v2" inputMode="numeric" className="pf-inp" value={s.vCode} onChange={(e) => set({ vCode: e.target.value.replace(/\D/g, ""), vErr: "" })} /></Field>
            <button className="pf-link" onClick={() => toast("Code resent")}>Resend code</button>
          </>
        )}
        {s.vErr ? <div className="pf-err">{s.vErr}</div> : null}
        <Btns><button className="pf-btn2" onClick={close}>Cancel</button><button className="pf-btn" onClick={next}>{s.vStep === 1 ? "Send code" : "Verify"}</button></Btns>
      </Sheet>
    );
  }
  if (m === "recover") return (
    <Sheet title="Lost access to a contact?" onClose={close} label="Account recovery">
      <div className="pf-mut">If you still have another verified contact, use it to confirm it’s you and add a new one. If you have neither, the Platform team can review your request.</div>
      <div className="pf-btns pf-col">
        <button className="pf-btn" onClick={() => { close(); toast("Code sent to your other verified contact"); }}>Verify with my other contact</button>
        <button className="pf-btn2" onClick={() => { close(); toast("Request sent to Platform Support"); }}>Contact Platform Support</button>
        <button className="pf-btn2" onClick={close}>Close</button>
      </div>
    </Sheet>
  );
  if (m === "reset") {
    const next = () => {
      if (s.rStep === 1) { set({ rStep: 2, rErr: "" }); return; }
      const e = !/^\d{4,6}$/.test(s.rCode) ? "Enter the 4–6 digit code." : pwOK(s.rPw, s.rPw2);
      if (e) { set({ rErr: e }); return; }
      set({ modal: "" }); toast("Password reset");
    };
    return (
      <Sheet title="Reset password" onClose={close} label="Reset password">
        {s.rStep === 1 ? (
          <><div className="pf-mut">We’ll send a reset code to your verified contact.</div>
            <div className="pf-seg">{["Mobile", "Email"].map((v) => (<button key={v} className={s.rVia === v ? "on" : ""} onClick={() => set({ rVia: v })}>{v}</button>))}</div></>
        ) : (
          <><Field id="pf-r1" label="Code (any 4–6 digits)"><input id="pf-r1" inputMode="numeric" className="pf-inp" value={s.rCode} onChange={(e) => set({ rCode: e.target.value.replace(/\D/g, ""), rErr: "" })} /></Field>
            <Field id="pf-r2" label="New password"><input id="pf-r2" type="password" className="pf-inp" value={s.rPw} onChange={(e) => set({ rPw: e.target.value, rErr: "" })} /></Field>
            <Field id="pf-r3" label="Confirm new password"><input id="pf-r3" type="password" className="pf-inp" value={s.rPw2} onChange={(e) => set({ rPw2: e.target.value, rErr: "" })} /></Field></>
        )}
        {s.rErr ? <div className="pf-err">{s.rErr}</div> : null}
        <Btns><button className="pf-btn2" onClick={close}>Cancel</button><button className="pf-btn" onClick={next}>{s.rStep === 1 ? "Send code" : "Reset password"}</button></Btns>
      </Sheet>
    );
  }
  if (m === "google") return (
    <Sheet title="Google login" onClose={close} label="Manage Google login">
      <div className="pf-mut">{s.googleLinked ? "Unlinking Google means you will sign in with your mobile/email and password. Your account and data stay the same." : "Link your Google account to sign in without a password."}</div>
      <Btns><button className="pf-btn2" onClick={close}>Close</button><button className="pf-btn" onClick={() => { set({ googleLinked: !s.googleLinked, modal: "" }); toast(s.googleLinked ? "Google unlinked" : "Google linked"); }}>{s.googleLinked ? "Unlink Google" : "Link Google"}</button></Btns>
    </Sheet>
  );
  if (m === "logout") return (
    <Sheet title="Log out of AstroConnect?" onClose={close} label="Confirm logout">
      <div className="pf-mut">You’ll need to log in again to access your account.</div>
      <Btns><button className="pf-btn2" onClick={close}>Cancel</button><button className="pf-btn" onClick={() => { close(); onLogout(); }}>Log out</button></Btns>
    </Sheet>
  );
  if (m === "deact") return (
    <Sheet title="Deactivate your account?" onClose={close} label="Confirm deactivation">
      <div className="pf-mut">Your profile will be hidden. You can reactivate by logging in again.</div>
      <Btns><button className="pf-btn2" onClick={close}>Cancel</button><button className="pf-btn" onClick={() => set({ modal: "", deactivated: true })}>Deactivate</button></Btns>
    </Sheet>
  );
  if (m === "delfinal") return (
    <Sheet title="Final confirmation" onClose={close} label="Final confirmation">
      <div className="pf-mut">Type DELETE to submit your deletion request.</div>
      <input aria-label="Type DELETE" className="pf-inp" value={s.delType} onChange={(e) => set({ delType: e.target.value })} />
      <Btns><button className="pf-btn2" onClick={close}>Cancel</button><button className="pf-btn3" disabled={s.delType !== "DELETE"} onClick={() => set({ modal: "", delDone: true, dStep: 0, delAck: false })}>Submit request</button></Btns>
    </Sheet>
  );
  if (m === "consent") return (
    <Sheet title="Share Kundli for selected paid services?" onClose={close} label="Kundli sharing consent">
      <div className="pf-mut">Your Kundli is shared only with the astrologer you book, only for that paid service, and each share appears in Sharing History.</div>
      <label className="pf-ck"><input type="checkbox" checked={s.consentOn} onChange={() => set({ consentOn: !s.consentOn })} /><span className="pf-t">I consent to this.</span></label>
      <Btns><button className="pf-btn2" onClick={close}>Cancel</button><button className="pf-btn" disabled={!s.consentOn} onClick={() => { set({ kundliPaid: true, modal: "" }); toast("Kundli sharing allowed for selected paid services"); }}>Allow</button></Btns>
    </Sheet>
  );
  return null;
}
