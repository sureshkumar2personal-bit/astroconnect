import { useState } from 'react';
import { dt, fmtDate, isOpen } from '@shared/lib/textQuestions.js';
import { Badge, PendingTag } from '@shared/components/ui.jsx';

export function QuotaCard({ quota, alloc, free }) {
  const p = Math.round((alloc / quota) * 100);
  return (
    <section className="card quota">
      <div className="ring" style={{ background: `conic-gradient(var(--tq-accent) 0 ${p}%, var(--line) ${p}% 100%)` }} role="img" aria-label={`${p}% of quota allocated`}>
        <span><b>{p}%</b><small>allocated</small></span>
      </div>
      <div className="grow">
        <h3>Monthly Slot Quota</h3>
        <div><b className="xl">{quota}</b> slots this month</div>
        <div className="row sm"><span>{alloc} in campaigns</span><span className="ok-t">{free} available</span></div>
        <div className="row wrap"><PendingTag id="AP-02-01 reset / carry-forward" /></div>
      </div>
    </section>
  );
}

function CampaignCard({ c, onAction }) {
  const p = Math.round((c.sold / c.slots) * 100);
  const cancelled = c.status === 'Cancelled';
  return (
    <section className={`card camp${cancelled ? ' dim' : ''}`}>
      <div className="row">
        <h3 className="grow">{c.name}</h3>
        <Badge kind="info">{c.type}</Badge>
        {c.special && <Badge kind="accent">Special</Badge>}
        <Badge kind={cancelled ? 'bad' : 'ok'}>{c.status}</Badge>
      </div>
      <div className="muted sm">{fmtDate(dt(c.start))} – {fmtDate(dt(c.end))} · Offer: {c.offer}</div>
      <div className="bar"><span style={{ width: `${p}%` }} /></div>
      <div className="row sm wrap">
        <span className="grow">{c.sold} / {c.slots} sold · {c.slots - c.sold} unused</span>
        <span>General <b>₹{c.pg}</b></span>
        <span>Personal <b>₹{c.pp}</b></span>
      </div>
      {cancelled ? (
        <p className="muted sm">Cancelled. Submitted questions keep their original deadlines.</p>
      ) : (
        <div className="row wrap">
          <button type="button" className="btn btn-o sm" onClick={() => onAction('editCamp', c.id)}>Edit</button>
          <button type="button" className="btn btn-o sm" onClick={() => onAction('slots', c.id)}>Increase / Decrease</button>
          <button type="button" className="btn btn-o sm" onClick={() => onAction('realloc', c.id)}>Reallocate</button>
          <button type="button" className="btn btn-o sm danger" onClick={() => onAction('cancelCamp', c.id)}>Cancel</button>
        </div>
      )}
    </section>
  );
}

export default function CampaignManagement({ tq, onAction }) {
  return (
    <>
      <QuotaCard quota={tq.quota} alloc={tq.alloc} free={tq.free} />
      <div className="row">
        <h3 className="grow">Your Campaigns ({tq.campaigns.length})</h3>
        <button type="button" className="btn btn-p" onClick={() => onAction('newCamp')}>+ Create Campaign</button>
      </div>
      {tq.campaigns.map((c) => <CampaignCard key={c.id} c={c} onAction={onAction} />)}
      <p className="muted sm">Delete isn't offered: <PendingTag id="AP-02-13" /></p>
    </>
  );
}

// ---------- Dialog bodies ----------

const BLANK = { name: '', type: 'Specific', special: false, start: '2026-12-01', end: '2026-12-31', slots: '', pg: '', pp: '', offer: 'No Offer' };

export function CampaignForm({ campaign, free, onCancel, onSave }) {
  const [v, setV] = useState(campaign || BLANK);
  const [err, setErr] = useState('');
  const max = free + (campaign ? campaign.slots : 0);
  const set = (k) => (e) => setV((cur) => ({ ...cur, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const save = () => {
    const n = +v.slots;
    if (!String(v.name).trim()) return setErr('Enter a campaign name.');
    if (!(n > 0)) return setErr('Enter the number of slots.');
    if (n > max) return setErr(`Only ${max} slots are available in your monthly quota.`);
    if (campaign && n < campaign.sold) return setErr(`${campaign.sold} slots are already sold.`);
    if (v.end < v.start) return setErr('Expiry date must be after the start date.');
    if (!(+v.pg > 0 && +v.pp > 0)) return setErr('Enter General and Personal prices.');
    onSave({ name: v.name.trim(), type: v.type, start: v.start, end: v.end, slots: n, pg: +v.pg, pp: +v.pp, special: v.special, offer: 'No Offer' });
  };

  return (
    <>
      <div className="form">
        <label>Campaign name *<input value={v.name} onChange={set('name')} placeholder="e.g. Career Guidance" /></label>
        <fieldset>
          <legend>Campaign type *</legend>
          <div className="grid2">
            {['Specific', 'Open Slots'].map((t) => (
              <label key={t} className="radio"><input type="radio" name="cf-type" value={t} checked={v.type === t} onChange={set('type')} /> {t}</label>
            ))}
          </div>
        </fieldset>
        <div className="grid2">
          <label>Start date *<input type="date" value={v.start} onChange={set('start')} /></label>
          <label>Expiry date *<input type="date" value={v.end} onChange={set('end')} /></label>
        </div>
        <label>Total slots * <span className="muted sm">(max {max} with your quota)</span><input type="number" min="1" max={max} value={v.slots} onChange={set('slots')} /></label>
        <p className="sm"><b>Price per question *</b> <span className="muted">Every campaign offers General and Personal.</span></p>
        <div className="grid2">
          <label>General (₹)<input type="number" value={v.pg} onChange={set('pg')} /></label>
          <label>Personal (₹)<input type="number" value={v.pp} onChange={set('pp')} /></label>
        </div>
        <label>Offer<select value={v.offer} onChange={set('offer')}><option>No Offer</option></select></label>
        <label className="check"><input type="checkbox" checked={v.special} onChange={set('special')} /> Mark as Special Campaign</label>
        <div className="row wrap"><PendingTag id="AP-02-02 editor, offer & special settings" /></div>
        <p className="warn-t sm" role="alert">{err}</p>
      </div>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-p" onClick={save}>{campaign ? 'Save Changes' : 'Create Campaign'}</button>
      </div>
    </>
  );
}

export function SlotsForm({ campaign: c, free, onCancel, onSave }) {
  const [n, setN] = useState(c.slots);
  const [err, setErr] = useState('');
  const save = () => {
    if (+n < c.sold) return setErr(`Can't go below ${c.sold} sold slots.`);
    if (+n > c.slots + free) return setErr('Not enough slots left in your quota.');
    onSave(+n);
  };
  return (
    <>
      <p><b>{c.name}</b></p>
      <div className="facts">
        {[['Total', c.slots], ['Sold (protected)', c.sold], ['Unused', c.slots - c.sold], ['Free in quota', free]].map(([k, val]) => (
          <div key={k} className="fact"><span className="muted sm">{k}</span><b>{val}</b></div>
        ))}
      </div>
      <div className="form">
        <label>New total slots<input type="number" value={n} min={c.sold} max={c.slots + free} onChange={(e) => { setN(e.target.value); setErr(''); }} /></label>
        <p className="muted sm">Range {c.sold} – {c.slots + free}. <PendingTag id="AP-02-14 below sold" /></p>
        <p className="warn-t sm" role="alert">{err}</p>
      </div>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-p" onClick={save}>Save</button>
      </div>
    </>
  );
}

export function ReallocForm({ campaign: c, campaigns, onCancel, onMove }) {
  const others = campaigns.filter((x) => x.id !== c.id && x.status !== 'Cancelled');
  const unused = c.slots - c.sold;
  const [to, setTo] = useState(others[0]?.id || '');
  const [n, setN] = useState(Math.min(10, unused));
  const [err, setErr] = useState('');
  const move = () => {
    const target = others.find((x) => x.id === to);
    if (!target || !(+n > 0) || +n > unused) return setErr(`Choose 1 – ${unused} slots.`);
    onMove(target, +n);
  };
  return (
    <>
      <p>Move unused slots from <b>{c.name}</b> ({unused} unused).</p>
      <div className="form">
        <label>Move to<select value={to} onChange={(e) => setTo(e.target.value)}>{others.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
        <label>Number of slots<input type="number" min="1" max={unused} value={n} onChange={(e) => { setN(e.target.value); setErr(''); }} /></label>
        <p className="warn-t sm" role="alert">{err}</p>
      </div>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-p" onClick={move}>Move Slots</button>
      </div>
    </>
  );
}

export function CancelCampaign({ campaign: c, questions, onKeep, onConfirm }) {
  const openCount = questions.filter((q) => q.camp === c.id && isOpen(q)).length;
  return (
    <>
      <p><b>{c.name}</b> · {c.sold} / {c.slots} sold</p>
      <ul className="cons">
        <li><b>{openCount}</b> open submitted questions stay in My Work with their original 30-day deadlines.</li>
        <li>Purchased slots not used yet: refund <PendingTag id="AP-02-07" /></li>
        <li><b>{c.slots - c.sold}</b> unsold slots go back to your quota.</li>
      </ul>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onKeep}>Keep Campaign</button>
        <button type="button" className="btn btn-p danger-f" onClick={onConfirm}>Cancel Campaign</button>
      </div>
    </>
  );
}
