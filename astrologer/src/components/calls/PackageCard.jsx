import { useState } from 'react';
import { Sec, Table } from '@/components/ui/sectionKit.jsx';
import { inr2 } from '@/lib/format.js';
import { COMMISSION, MIN_PACKAGE_MINUTES, callsActions, svcName } from '@/hooks/useCalls.js';

// Prepaid package list for one service (AD-106); commission 2% and net (AD-124 → 08).
export default function PackageCard({ s, list, ui }) {
  const [m, setM] = useState('');
  const [p, setP] = useState('');
  const add = () => {
    const err = callsActions.addPackage(s, m, p);
    if (err) { ui.toast(err); return; }
    setM(''); setP('');
  };
  return (
    <Sec title={`${svcName(s)} packages`}>
      <Table bare cols={['Duration', 'Price', 'Commission 2%', 'Your net', '']}
        rows={list.map((x, i) => ({
          key: `${x.m}-${x.p}-${i}`,
          cells: [`${x.m} min`, inr2(x.p), inr2(x.p * COMMISSION), inr2(x.p * (1 - COMMISSION)),
            <button type="button" className="btn btn-o sm danger" onClick={() => callsActions.removePackage(s, i)}>Remove</button>],
        }))} />
      <div className="row wrap cc-add">
        <input type="number" className="cc-min" min={MIN_PACKAGE_MINUTES} placeholder="Minutes (min 5)" aria-label={`${svcName(s)} package minutes (minimum 5)`}
          value={m} onChange={(e) => setM(e.target.value)} />
        <input type="number" className="cc-price" min="1" placeholder="Price ₹" aria-label={`${svcName(s)} package price in rupees`}
          value={p} onChange={(e) => setP(e.target.value)} />
        <button type="button" className="btn btn-o sm" onClick={add}>Add package</button>
      </div>
      <span className="muted sm">Users pay the full package before the session. Example ₹75 for 5 minutes is illustrative.</span>
    </Sec>
  );
}
