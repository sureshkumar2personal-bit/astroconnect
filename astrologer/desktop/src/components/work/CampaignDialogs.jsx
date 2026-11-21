import { useState } from 'react';
import { Field, Note, PendingTag } from '../section/kit.jsx';
import { campTotal, fmtDate, isOpen } from '@shared/lib/textQuestions.js';

// Campaign Management dialogs (reference A.cSlots, A.cRealloc, A.cExtend, A.cCancel, A.cDelete;
// AD-27, AD-31, AD-57, AD-58). Deleting keeps the earlier rule while AP-02-24 is open.

const Actions = ({ onCancel, cancelLabel = 'Cancel', children }) => (
  <div className="actions">
    <button type="button" className="btn btn-o" onClick={onCancel}>{cancelLabel}</button>
    {children}
  </div>
);

/** Increase / Decrease Slots; going below the number sold is allowed (AD-57). */
export function SlotsBody({ c, free, onCancel, onSave }) {
  const [g, setG] = useState(String(c.gSlots));
  const [p, setP] = useState(String(c.pSlots));
  const [err, setErr] = useState('');
  const save = () => {
    const gv = c.G ? +g : 0;
    const pv = c.P ? +p : 0;
    if (gv < 0 || pv < 0) return setErr('Slots can’t be negative.');
    if (gv + pv - campTotal(c) > free) return setErr('Not enough free quota.');
    onSave(gv, pv);
  };
  return (
    <>
      <p><b>{c.name}</b> · {free} free in quota</p>
      <div className="form">
        {c.G && <Field label={`General slots (sold ${c.gSold})`}><input type="number" value={g} onChange={(e) => { setG(e.target.value); setErr(''); }} /></Field>}
        {c.P && <Field label={`Personal slots (sold ${c.pSold})`}><input type="number" value={p} onChange={(e) => { setP(e.target.value); setErr(''); }} /></Field>}
        <p className="muted sm">You may go below the number sold; purchased questions are not cancelled and must still be answered.</p>
        <p className="warn-t sm" role="alert">{err}</p>
      </div>
      <Actions onCancel={onCancel}><button type="button" className="btn btn-p" onClick={save}>Save</button></Actions>
    </>
  );
}

/** Reallocate unsold slots to another campaign, question type or Open Questions (AD-57). */
export function ReallocBody({ c, campaigns, onCancel, onMove }) {
  const unsold = (k) => Math.max(0, k === 'G' ? c.gSlots - c.gSold : c.pSlots - c.pSold);
  const from = [c.G && ['G', `General (${unsold('G')} unsold)`], c.P && ['P', `Personal (${unsold('P')} unsold)`]].filter(Boolean);
  const to = [
    ...campaigns.filter((x) => x.status === 'Active').flatMap((x) => [x.G && [`${x.id}:G`, `${x.name} – General`], x.P && [`${x.id}:P`, `${x.name} – Personal`]]).filter(Boolean),
    ['open:G', 'Open Questions – General'],
    ['open:P', 'Open Questions – Personal'],
  ];
  const [fk, setFk] = useState(from[0]?.[0] || 'G');
  const [dest, setDest] = useState(to[0][0]);
  const [n, setN] = useState('10');
  const [err, setErr] = useState('');
  const move = () => {
    const [tid, tk] = dest.split(':');
    const avail = unsold(fk);
    if (!(+n > 0) || +n > avail) return setErr(`Choose 1 – ${avail} slots.`);
    if (tid === c.id && tk === fk) return setErr('Choose a different destination.');
    onMove(fk, tid, tk, +n);
  };
  return (
    <>
      <p>Move unsold slots from <b>{c.name}</b> ({unsold('G') * (c.G ? 1 : 0) + unsold('P') * (c.P ? 1 : 0)} unsold) to another campaign, question type, or Open Questions.</p>
      <div className="form">
        <Field label="From"><select value={fk} onChange={(e) => { setFk(e.target.value); setErr(''); }}>{from.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
        <Field label="Move to"><select value={dest} onChange={(e) => { setDest(e.target.value); setErr(''); }}>{to.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
        <Field label="Number of slots"><input type="number" value={n} onChange={(e) => { setN(e.target.value); setErr(''); }} /></Field>
        <p className="warn-t sm" role="alert">{err}</p>
      </div>
      <Actions onCancel={onCancel}><button type="button" className="btn btn-p" onClick={move}>Move Slots</button></Actions>
    </>
  );
}

/** Extend Campaign (AD-58). */
export function ExtendBody({ c, onCancel, onExtend, toast }) {
  const [v, setV] = useState(c.end);
  return (
    <>
      <p><b>{c.name}</b> currently expires {fmtDate(c.end)}.</p>
      <div className="form"><Field label="New expiry date"><input type="date" value={v} onChange={(e) => setV(e.target.value)} /></Field></div>
      <Note>The extension also applies to unused purchased slots of this campaign. Reactivating a campaign doesn't restore slots that already expired.</Note>
      <Actions onCancel={onCancel}>
        <button type="button" className="btn btn-p" onClick={() => (v <= c.end ? toast('Choose a later date.') : onExtend(v))}>Extend</button>
      </Actions>
    </>
  );
}

/** Cancel Campaign (AD-31, ruling C1): purchased unused slots are refunded. */
export function CancelBody({ c, questions, onKeep, onConfirm }) {
  const n = questions.filter((q) => q.camp === c.id && isOpen(q)).length;
  return (
    <>
      <p><b>{c.name}</b></p>
      <ul className="cons">
        <li><b>{n}</b> submitted questions stay in My Work and must still be answered within their 30-day deadlines.</li>
        <li>Users get a <b>refund for purchased unused slots</b>.</li>
        <li>Unsold allocation returns to your monthly quota.</li>
      </ul>
      <Actions onCancel={onKeep} cancelLabel="Keep Campaign"><button type="button" className="btn danger-f" onClick={onConfirm}>Cancel Campaign</button></Actions>
    </>
  );
}

/** Delete Campaign (AD-31): earlier no-refund rule kept while AP-02-24 is pending. */
export function DeleteBody({ c, onKeep, onConfirm }) {
  return (
    <>
      <p><b>{c.name}</b></p>
      <ul className="cons">
        <li>Submitted questions are not cancelled and must still be answered.</li>
        <li>
          No refund is issued just because a campaign is deleted; a purchased unused slot stays usable until its original deadline
          (earlier of purchase + 7 days and the original expiry). <PendingTag id="AP-02-24" />
        </li>
        <li>Unsold allocation can be reused in your quota.</li>
      </ul>
      <Actions onCancel={onKeep} cancelLabel="Keep Campaign"><button type="button" className="btn danger-f" onClick={onConfirm}>Delete Campaign</button></Actions>
    </>
  );
}
