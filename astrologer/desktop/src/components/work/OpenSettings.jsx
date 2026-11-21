import { useState } from 'react';
import { Field, Grid, Sec } from '../section/kit.jsx';
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
