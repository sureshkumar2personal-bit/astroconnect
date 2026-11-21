import { useState } from 'react';
import { Badge, Field, Note, Sec, SwitchRow } from '../section/kit.jsx';
import { campTotal, fmtDate } from '@shared/lib/textQuestions.js';
import Discount from './Discount.jsx';
import { PriceText } from './bits.jsx';

// Create / Edit Campaign (reference TQSUB.campaign + cfSave). One editor for Regular and Special
// Campaigns; a Special Campaign needs a label (AD-26). General only, Personal only or both (AD-26);
// independent prices (AD-55) and optional discounts (AD-56); slots split per type and capped by the
// shared monthly quota; reducing below sold is allowed (AD-57).
const BLANK = {
  id: '', name: '', special: false, label: '', G: true, P: true, start: '2026-12-01', end: '2026-12-31',
  gSlots: 0, pSlots: 0, gSold: 0, pSold: 0, pg: 0, pp: 0, gDisc: { on: false, pct: 0 }, pDisc: { on: false, pct: 0 }, status: 'Active',
};

export function validateCampaign(cf, max) {
  if (!cf.name.trim()) return 'Enter a campaign theme or name.';
  if (cf.special && !cf.label.trim()) return 'A Special Campaign needs a label.';
  if (!cf.G && !cf.P) return 'Choose at least one question type.';
  if (cf.end < cf.start) return 'Expiry date must be after the start date.';
  if (!(campTotal(cf) > 0)) return 'Allocate slots for the selected types.';
  if (campTotal(cf) > max) return `Only ${max} slots are available in your monthly quota.`;
  if ((cf.G && !(cf.pg > 0)) || (cf.P && !(cf.pp > 0))) return 'Set a price for each selected type.';
  if ([cf.G && cf.gDisc, cf.P && cf.pDisc].some((d) => d && d.on && !d.pct)) return 'Choose a discount percentage (1–99%) or turn the discount off.';
  return '';
}

function TypePrice({ kind, cf, set }) {
  const pk = kind === 'G' ? 'pg' : 'pp';
  const dk = kind === 'G' ? 'gDisc' : 'pDisc';
  return (
    <div className="card type-price">
      <b>{kind === 'G' ? 'General' : 'Personal'} price</b>
      <Field label="Price (₹)" req>
        <input type="number" min="1" value={cf[pk] || ''} onChange={(e) => set({ [pk]: +e.target.value || 0 })} />
      </Field>
      <Discount kind={kind} disc={cf[dk]} price={cf[pk]} onChange={(d) => set({ [dk]: { ...cf[dk], ...d } })} />
    </div>
  );
}

export default function CampaignEditor({ campaign, free, onCancel, onSave }) {
  const [cf, setCf] = useState(() => (campaign ? JSON.parse(JSON.stringify(campaign)) : { ...BLANK }));
  const [err, setErr] = useState('');
  const set = (patch) => { setCf((c) => ({ ...c, ...patch })); setErr(''); };
  const max = free + (campaign ? campTotal(campaign) : 0);

  const save = () => {
    const e = validateCampaign(cf, max);
    if (e) return setErr(e);
    onSave(cf);
  };

  return (
    <div className="split2">
      <Sec className="form">
        <Field label="Campaign theme / name" req>
          <input value={cf.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Marriage, Career, Education" />
        </Field>
        <SwitchRow label={<b>Special Campaign</b>} sub="Limited-time or occasion-based. A label is mandatory." on={cf.special} onToggle={() => set({ special: !cf.special })} />
        {cf.special && (
          <Field label="Special Campaign label" req>
            <input value={cf.label} onChange={(e) => set({ label: e.target.value })} placeholder="e.g. Navaratri Special" />
          </Field>
        )}
        <fieldset>
          <legend className="req">Question types</legend>
          <div className="grid2">
            <label className="check"><input type="checkbox" checked={cf.G} onChange={(e) => set({ G: e.target.checked })} /> General</label>
            <label className="check"><input type="checkbox" checked={cf.P} onChange={(e) => set({ P: e.target.checked })} /> Personal</label>
          </div>
          <span className="muted sm">General only, Personal only, or both.</span>
        </fieldset>
        <div className="grid2">
          <Field label="Start date" req><input type="date" value={cf.start} onChange={(e) => set({ start: e.target.value })} /></Field>
          <Field label="Expiry date" req><input type="date" value={cf.end} onChange={(e) => set({ end: e.target.value })} /></Field>
        </div>
        <div className="grid2">
          {cf.G && <Field label="General slots" req><input type="number" min="0" value={cf.gSlots || ''} onChange={(e) => set({ gSlots: +e.target.value || 0 })} /></Field>}
          {cf.P && <Field label="Personal slots" req><input type="number" min="0" value={cf.pSlots || ''} onChange={(e) => set({ pSlots: +e.target.value || 0 })} /></Field>}
        </div>
        <Note>
          Total allocation <b>{campTotal(cf)}</b> = General + Personal · max <b>{max}</b> within your monthly quota.
          You may reduce below slots already sold; purchased questions still must be answered.
        </Note>
        {cf.G && <TypePrice kind="G" cf={cf} set={set} />}
        {cf.P && <TypePrice kind="P" cf={cf} set={set} />}
        <p className="warn-t sm" role="alert">{err}</p>
        <div className="actions">
          <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn btn-p" onClick={save}>{cf.id ? 'Save Changes' : 'Create Campaign'}</button>
        </div>
      </Sec>
      <Sec title="How users will see it">
        <div className="preview">
          <div className="row wrap"><b className="lg grow">{cf.name || 'Campaign name'}</b>{cf.special && <Badge kind="accent">{cf.label || 'Special Campaign'}</Badge>}</div>
          <span className="muted sm">{fmtDate(cf.start)} – {fmtDate(cf.end)}</span>
          {cf.G && <div className="row"><span className="grow">General question</span><PriceText price={cf.pg || 0} disc={cf.gDisc} /></div>}
          {cf.P && <div className="row"><span className="grow">Personal question</span><PriceText price={cf.pp || 0} disc={cf.pDisc} /></div>}
        </div>
      </Sec>
    </div>
  );
}
