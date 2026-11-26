import { useState } from 'react';
import { Field, Grid, Sec } from '@/components/ui/sectionKit.jsx';
import Discount from './Discount.jsx';

// Open Questions settings (reference TQSUB.open; AD-24, AD-54 – AD-57): General and Personal slots,
// prices and optional discounts, within the shared monthly quota. Values apply when a field is left
// (reference "change" event); a slot increase beyond the free quota is refused.
function NumField({ label, value, onCommit }) {
  const [v, setV] = useState(String(value));
  return (
    <Field label={label}>
      <input type="number" value={v} onChange={(e) => setV(e.target.value)}
        onBlur={() => { if (!onCommit(+v || 0)) setV(String(value)); }}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} />
    </Field>
  );
}

export default function OpenSettings({ tq, toast }) {
  const o = tq.open;
  const commit = (k) => (v) => {
    if (/Slots/.test(k) && v - o[k] > tq.free) { toast('Not enough free quota.'); return false; }
    tq.setOpen({ [k]: v });
    return true;
  };
  return (
    <>
      <Grid size="lg">
        {[['G', 'General', 'gSlots', 'pg', 'gDisc'], ['P', 'Personal', 'pSlots', 'pp', 'pDisc']].map(([kind, title, sk, pk, dk]) => (
          <Sec key={kind} title={title} className="form">
            <NumField key={`${sk}-${o[sk]}`} label="Slots" value={o[sk]} onCommit={commit(sk)} />
            <NumField key={`${pk}-${o[pk]}`} label="Price (₹)" value={o[pk]} onCommit={commit(pk)} />
            <Discount kind={kind} disc={o[dk]} price={o[pk]} onChange={(d) => tq.setOpen({ [dk]: { ...o[dk], ...d } })} />
          </Sec>
        ))}
      </Grid>
      <p className="muted sm">{tq.alloc} of {tq.quota} slots allocated · {tq.free} free</p>
    </>
  );
}

/** Popup version of the settings: edits a draft, applied only on "Save changes" (Cancel / ✕ discard it). */
export function OpenSettingsBody({ tq, onCancel, onSave }) {
  const o = tq.open;
  const [d, setD] = useState({ gSlots: String(o.gSlots), pSlots: String(o.pSlots), pg: String(o.pg), pp: String(o.pp), gDisc: o.gDisc, pDisc: o.pDisc });
  const [err, setErr] = useState('');
  const set = (patch) => { setD((x) => ({ ...x, ...patch })); setErr(''); };
  const change = (+d.gSlots || 0) + (+d.pSlots || 0) - o.gSlots - o.pSlots;
  const save = () => {
    const v = { gSlots: +d.gSlots || 0, pSlots: +d.pSlots || 0, pg: +d.pg || 0, pp: +d.pp || 0, gDisc: d.gDisc, pDisc: d.pDisc };
    if (v.gSlots < 0 || v.pSlots < 0 || v.pg < 0 || v.pp < 0) return setErr('Values can’t be negative.');
    if (change > tq.free) return setErr('Not enough free quota.');
    onSave(v);
  };
  return (
    <div className="cm-dlg os-dlg">
      <p className="cm-sub">For questions asked without choosing a campaign. Slots come from the shared monthly quota.</p>
      <div className="os-grid">
        {[['G', 'General', 'gSlots', 'pg', 'gDisc', o.gSold], ['P', 'Personal', 'pSlots', 'pp', 'pDisc', o.pSold]].map(([kind, title, sk, pk, dk, sold]) => (
          <Sec key={kind} title={title} right={<span className="muted sm">{sold} sold</span>} className="form">
            <Field label="Slots"><input type="number" value={d[sk]} onChange={(e) => set({ [sk]: e.target.value })} /></Field>
            <Field label="Price (₹)"><input type="number" value={d[pk]} onChange={(e) => set({ [pk]: e.target.value })} /></Field>
            <Discount kind={kind} disc={d[dk]} price={+d[pk]} onChange={(x) => set({ [dk]: { ...d[dk], ...x } })} />
          </Sec>
        ))}
      </div>
      <div className="cm-alloc" aria-live="polite">
        <div><div className="l">Available quota</div><div className="v">{tq.free}</div></div>
        <div><div className="l">Change</div><div className="v">{change > 0 ? '+' : change < 0 ? '−' : ''}{Math.abs(change)}</div></div>
        <div><div className="l">Remaining after</div><div className={`v ${tq.free - change < 0 ? 'neg' : 'pos'}`}>{tq.free - change}</div></div>
      </div>
      <p className="warn-t sm cm-form-err" role="alert">{err}</p>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-p" onClick={save}>Save changes</button>
      </div>
    </div>
  );
}
