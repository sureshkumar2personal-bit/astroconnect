import { useState } from 'react';
import { inr2 } from '@shared/lib/format.js';
import { earningsActions } from '@shared/hooks/useEarnings.js';
import { Badge, Field } from '../section/kit.jsx';

// Withdraw dialog body (AD-125): ₹500 minimum, within the Available Balance, verified
// Bank Account or UPI, duplicate taps prevented. Prototype — no payout is made.
export default function WithdrawDialog({ s, onCancel, onDone }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Bank Account');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = () => {
    if (busy) return;
    const e = earningsActions.withdraw(Number(amount), method);
    if (e) { setErr(e); return; }
    setBusy(true);
    onDone();
  };

  const methods = [['Bank Account', s.acct.bank], ['UPI', s.acct.upi]];
  return (
    <>
      <p>Available Balance: <b>{inr2(s.avail)}</b></p>
      <div className="form">
        <Field label="Amount (₹)" req>
          <input type="number" inputMode="numeric" min="500" placeholder="Minimum 500" value={amount}
            onChange={(e) => { setAmount(e.target.value); setErr(''); }} />
        </Field>
        <fieldset>
          <legend>Payout method</legend>
          <div className="stack">
            {methods.map(([m, a]) => (
              <label key={m} className="radio">
                <input type="radio" name="ern-wm" value={m} checked={method === m} onChange={() => setMethod(m)} />
                <span className="grow">{m} · {a.label}</span>
                {a.verified && <Badge kind="ok">Verified</Badge>}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="warn-t sm" role="alert">{err}</p>
      </div>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-p" disabled={busy} onClick={submit}>Request withdrawal</button>
      </div>
    </>
  );
}
