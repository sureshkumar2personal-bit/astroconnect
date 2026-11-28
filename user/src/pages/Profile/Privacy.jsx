import React from "react";
import { AUDS, VIS_LABELS, audOpts, DATA_LABELS } from "./profileData";
import { Group, Row, H, Note, Switch } from "./ui";

// Privacy & Visibility: audiences, controls, blocked accounts, data and Kundli consent (D-37). Prototype only.
export default function Privacy({ s, set, toast, later }) {
  const a = s.aud;
  const setAud = (k) => {
    let n = { ...a, [k]: !a[k] };
    if (k === "pub" && n.pub) n = { pub: true, fol: false, sub: false };
    if ((k === "fol" || k === "sub") && n[k]) n.pub = false;
    if (!n.pub && !n.fol && !n.sub) { toast("Choose at least one audience"); return; }
    set({ aud: n });
  };
  const opts = audOpts(a);
  const sw = (on, label, desc, fn) => (<div className="pf-row" key={label}><span className="pf-rt"><span className="pf-t">{label}</span>{desc ? <span className="pf-mut">{desc}</span> : null}</span><Switch on={on} label={label} onClick={fn} /></div>);
  const reqData = () => {
    if (s.dataStatus === 1 || s.dataStatus === 2) return;
    set({ dataStatus: 1 }); toast("Data request submitted");
    later(() => set({ dataStatus: 2 }), 1800); later(() => set({ dataStatus: 3 }), 3800);
  };
  return (
    <>
      <H>Profile visibility</H>
      <Group>
        <div className="pf-pad"><span className="pf-t">Who can view your profile?</span></div>
        {AUDS.map(([k, l]) => (
          <label className="pf-ck" key={k}><input type="checkbox" checked={a[k]} onChange={() => setAud(k)} /><span className="pf-rt"><span className="pf-t">{l}</span></span></label>
        ))}
        <Row label="Fine-tune what each audience sees" onClick={() => set({ visOpen: !s.visOpen })} chev expanded={s.visOpen} />
        {s.visOpen ? (
          <div className="pf-vis">
            {VIS_LABELS.map((l, i) => {
              let v = s.vis["v" + i]; if (!opts.includes(v)) v = opts[0];
              return (<div className="pf-row" key={l}><label htmlFor={"pf-vis" + i} className="pf-t">{l}</label><select id={"pf-vis" + i} className="pf-inp pf-sel" value={v} onChange={(e) => set({ vis: { ...s.vis, ["v" + i]: e.target.value } })}>{opts.map((o) => (<option key={o}>{o}</option>))}</select></div>);
            })}
          </div>
        ) : null}
      </Group>
      <Note>Wallet, payments and account details are never visible to others.</Note>
      <H>Privacy controls</H>
      <Group>
        {sw(s.onlyFirst, "Show only first name to astrologers", "", () => set({ onlyFirst: !s.onlyFirst }))}
        {sw(s.kundliPaid, "Share Kundli only for selected paid services", "", () => (s.kundliPaid ? set({ kundliPaid: false }) : set({ modal: "consent", consentOn: false })))}
        <Row icon="trash" tone="d" label="Blocked accounts" sub={s.blocked.length + " blocked"} onClick={() => set({ blkOpen: !s.blkOpen })} chev expanded={s.blkOpen} />
        {s.blkOpen ? (
          <div>
            {s.blocked.map((b) => (<div className="pf-row" key={b.id}><span className="pf-rt"><span className="pf-t">{b.name}</span><span className="pf-mut">{b.type}</span></span><button className="pf-btn2" onClick={() => { set({ blocked: s.blocked.filter((x) => x.id !== b.id) }); toast(b.name + " unblocked"); }}>Unblock</button></div>))}
            {s.blocked.length === 0 ? <div className="pf-pad pf-mut">No blocked accounts.</div> : null}
          </div>
        ) : null}
      </Group>
      <H>Data &amp; consent</H>
      <Group>
        {sw(s.analytics, "Usage analytics", "", () => set({ analytics: !s.analytics }))}
        {sw(s.personalised, "Personalised recommendations", "Use your activity to suggest astrologers and content.", () => set({ personalised: !s.personalised }))}
        {sw(s.marketing, "Marketing communications", "", () => set({ marketing: !s.marketing }))}
        <div className="pf-row"><span className="pf-rt"><span className="pf-t">Kundli sharing consent</span>{s.kundliPaid ? <span className="pf-mut">Given for selected paid services only.</span> : null}</span>{s.kundliPaid ? <button className="pf-btn2" onClick={() => { set({ kundliPaid: false }); toast("Consent withdrawn"); }}>Withdraw</button> : null}</div>
        <div className="pf-row"><span className="pf-rt"><span className="pf-t">Download my data</span>{s.dataStatus > 0 ? <span className="pf-mut">{"Status: " + DATA_LABELS[s.dataStatus]}</span> : null}</span><button className="pf-btn2" disabled={s.dataStatus === 1 || s.dataStatus === 2} onClick={reqData}>Request</button></div>
      </Group>
    </>
  );
}
