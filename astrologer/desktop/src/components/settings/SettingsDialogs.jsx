import { useState } from 'react';
import { Field } from '../section/kit.jsx';
import { validatePassword } from '@shared/hooks/useSettings.js';

// Dialog bodies for Settings (shown in SectionPage's shared dialog). Prototype only.

/** Change Password (AD-152). A Password Changed notification follows (AD-148). */
export function ChangePassword({ onCancel, onDone }) {
  const [f, setF] = useState({ current: '', next: '', confirm: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => { setErr(''); setF({ ...f, [k]: e.target.value }); };
  const submit = () => {
    const e = validatePassword(f);
    if (e) return setErr(e);
    onDone();
  };
  return (
    <>
      <div className="form">
        <Field label="Current password" req><input type="password" autoComplete="current-password" value={f.current} onChange={set('current')} /></Field>
        <Field label="New password" req><input type="password" autoComplete="new-password" value={f.next} onChange={set('next')} /></Field>
        <Field label="Confirm new password" req><input type="password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} /></Field>
        <p className="warn-t sm" role="alert">{err}</p>
      </div>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-p" onClick={submit}>Update password</button>
      </div>
    </>
  );
}

/** Privacy Policy, Terms, Data/Privacy Information, About AstroConnect (AD-156, AD-157). */
export function PlatformDoc({ name, onClose }) {
  return (
    <>
      <p className="sm">{name} content is provided by the Platform.</p>
      <div className="actions"><button type="button" className="btn btn-p" onClick={onClose}>Close</button></div>
    </>
  );
}

/** Account deactivation / deletion request — routed to Platform Admin for approval (AD-157, SET-04). */
export function AccountRequest({ onCancel, onSend }) {
  const [reason, setReason] = useState('');
  return (
    <>
      <p>This sends a request to Platform Admin for approval. Your account stays active until it is approved.</p>
      <Field label="Reason (optional)"><textarea className="short" value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn danger-f" onClick={onSend}>Send request</button>
      </div>
    </>
  );
}
