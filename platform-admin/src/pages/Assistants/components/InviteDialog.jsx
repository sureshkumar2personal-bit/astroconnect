import { useEffect, useId, useRef, useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { ADMIN_DEPARTMENTS, ROLES, nextAssistantId } from '../../../data/assistantsStore.js';

// Super Admin invites an Admin Assistant (assistant-management.md §9.1).
// Astrologer Assistants are invited by their astrologer in the Astrologer App.
export default function InviteDialog({ onClose, onInvite }) {
  const ref = useRef(null);
  const uid = useId();
  const [values, setValues] = useState({ name: '', email: '', mobile: '', role: 'Assistant', departments: [] });
  const [error, setError] = useState('');
  useEffect(() => {
    if (!ref.current.open) ref.current.showModal();
  }, []);
  const set = (k, v) => {
    setValues((s) => ({ ...s, [k]: v }));
    setError('');
  };
  return (
    <dialog ref={ref} className="u-dialog as-invite" aria-labelledby={`${uid}-t`} onCancel={(e) => { e.preventDefault(); onClose(); }}>
      <form
        className="u-dialog__form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const result = onInvite(values);
          if (result && !result.ok) setError(result.error);
        }}
      >
        <header className="u-dialog__head">
          <h2 id={`${uid}-t`} className="u-dialog__title">
            Invite Admin Assistant
          </h2>
          <button type="button" className="u-dialog__close" aria-label="Cancel" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </header>
        <p className="u-dialog__note">
          The new assistant will receive ID <strong>{nextAssistantId()}</strong>. The invitation is valid for 7 days; the account stays Pending until the email is verified and the invitation accepted.
        </p>
        <div className="as-invite__grid">
          <div className="u-dialog__field">
            <label htmlFor={`${uid}-n`} className="u-label">Full Name</label>
            <input id={`${uid}-n`} className="u-input" value={values.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="u-dialog__field">
            <label htmlFor={`${uid}-e`} className="u-label">Email</label>
            <input id={`${uid}-e`} type="email" className="u-input" value={values.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="u-dialog__field">
            <label htmlFor={`${uid}-m`} className="u-label">Mobile Number</label>
            <input id={`${uid}-m`} className="u-input" placeholder="+91 98765 43210" value={values.mobile} onChange={(e) => set('mobile', e.target.value)} />
          </div>
          <div className="u-dialog__field">
            <label htmlFor={`${uid}-r`} className="u-label">Role (permission preset)</label>
            <select id={`${uid}-r`} className="u-input u-select" value={values.role} onChange={(e) => set('role', e.target.value)}>
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
        <fieldset className="as-depts">
          <legend className="u-label">Departments (one or more)</legend>
          {Object.keys(ADMIN_DEPARTMENTS).map((d) => (
            <label key={d} className="p-radio">
              <input
                type="checkbox"
                checked={values.departments.includes(d)}
                onChange={(e) => set('departments', e.target.checked ? [...values.departments, d] : values.departments.filter((x) => x !== d))}
              />
              {d}
            </label>
          ))}
        </fieldset>
        {error && (
          <p className="u-field__error" role="alert">
            {error}
          </p>
        )}
        <footer className="u-dialog__actions">
          <button type="button" className="u-btn u-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="u-btn u-btn--primary">
            Send Invitation
          </button>
        </footer>
      </form>
    </dialog>
  );
}
