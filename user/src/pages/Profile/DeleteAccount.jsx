import React from "react";
import { IMPACT, DELETE_REASONS } from "./profileData";
import { Group, Row, H, Note, Badge, Field, Ic } from "./ui";

// Deactivate (temporary) and delete (permanent). Simulated: nothing is changed.
export default function DeleteAccount({ s, set, toast }) {
  return (
    <>
      {s.deactivated ? <Note tone="w">Account deactivated. Log in again to reactivate. <button className="pf-link" onClick={() => { set({ deactivated: false }); toast("Account reactivated"); }}>Reactivate now</button></Note> : null}
      {s.delDone ? <Note tone="w">Deletion request recorded.</Note> : null}
      <H>Deactivate · temporary</H>
      <Group><div className="pf-pad pf-act"><span className="pf-ico w"><Ic n="pause" /></span><div className="pf-rt"><div className="pf-t">Take a break, keep your account</div><div className="pf-mut">Your profile is hidden from astrologers and others until you log in again. Nothing is deleted.</div></div><button className="pf-btn2" onClick={() => set({ modal: "deact" })}>Deactivate account</button></div></Group>
      <H>Delete · permanent</H>
      <Group><div className="pf-pad pf-act"><span className="pf-ico d"><Ic n="trash" /></span><div className="pf-rt"><div className="pf-t">Delete your account for good</div><div className="pf-mut">This cannot be undone. Financial, legal and transaction records may be kept as required.</div></div>{s.dStep === 0 ? <button className="pf-btn3" onClick={() => set({ dStep: 1 })}>Review account impact</button> : null}</div></Group>
      {s.dStep === 1 ? (
        <>
          <H>Account impact review</H>
          <Group>
            {IMPACT.map(([l, d, n]) => (<div className="pf-row" key={l}><span className="pf-rt"><span className="pf-t">{l}</span><span className="pf-mut">{d}</span></span><Badge tone={n === 0 || s.resolved ? "ok" : "bd"}>{n === 0 ? "Clear" : s.resolved ? "Resolved" : "Action needed"}</Badge></div>))}
            <div className="pf-pad">{!s.resolved ? <><Note tone="e">Resolve the items above before you can continue.</Note><div className="pf-btns"><button className="pf-btn2" onClick={() => set({ resolved: true })}>Mark all resolved</button></div></> : <div className="pf-btns"><button className="pf-btn3" onClick={() => set({ dStep: 2 })}>Continue</button></div>}</div>
          </Group>
        </>
      ) : null}
      {s.dStep === 2 ? (
        <>
          <Note tone="e">Warning: deleting removes your profile, birth profiles, Kundli and saved documents.</Note>
          <Group><div className="pf-pad">
            <Field id="pf-dr" label="Reason (optional)"><select id="pf-dr" className="pf-inp" value={s.delReason} onChange={(e) => set({ delReason: e.target.value })}><option value="">Select a reason</option>{DELETE_REASONS.map((r) => (<option key={r}>{r}</option>))}</select></Field>
            <label className="pf-ck"><input type="checkbox" checked={s.delAck} onChange={() => set({ delAck: !s.delAck })} /><span className="pf-t">I understand this is permanent.</span></label>
            <div className="pf-btns"><button className="pf-btn3" disabled={!s.delAck} onClick={() => set({ modal: "delfinal", delType: "" })}>Request deletion</button></div>
          </div></Group>
        </>
      ) : null}
    </>
  );
}
