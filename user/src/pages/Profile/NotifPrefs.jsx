import React from "react";
import { CRITICAL, CATS } from "./profileData";
import { Group, Row, H, Note, Switch, Badge } from "./ui";

// Notification preferences. Critical alerts cannot be turned off (D-15); the confirmed channels are push and in-app (D-16).
export default function NotifPrefs({ s, set, toast }) {
  const chan = (on, label, desc, fn, locked) => (
    <div className="pf-row" key={label}><span className="pf-rt"><span className="pf-t">{label}</span>{desc ? <span className="pf-mut">{desc}</span> : null}</span><Switch on={on} label={label} onClick={fn} locked={locked} /></div>
  );
  return (
    <>
      <H>Channels</H>
      <Group>
        {chan(s.push, "Push notifications", "", () => set({ push: !s.push }))}
        {chan(s.inapp, "In-app notifications", "", () => set({ inapp: !s.inapp }))}
        {chan(true, "Critical alerts", "", () => toast("Critical alerts cannot be disabled"), true)}
      </Group>
      <Note>{(s.push ? "" : "Push is off: no push alerts are sent. ") + (s.inapp ? "Updates still appear in your Notifications inbox." : "In-app is off: ordinary updates will not appear in the inbox.")}</Note>
      <H>Critical alerts · always on</H>
      <Group>{CRITICAL.map((c) => (<div className="pf-row" key={c}><span className="pf-rt"><span className="pf-t">{c}</span></span><Badge tone="ok">On</Badge></div>))}</Group>
      <H>Activity notifications</H>
      <Group>{CATS.map(([k, l]) => (<div className="pf-row" key={k}><span className="pf-rt"><span className="pf-t">{l}</span></span><Switch on={s.cats[k]} label={l} onClick={() => set({ cats: { ...s.cats, [k]: !s.cats[k] } })} /></div>))}</Group>
      <Note>Turning a category off stops ordinary updates only. Critical alerts stay on.</Note>
    </>
  );
}
