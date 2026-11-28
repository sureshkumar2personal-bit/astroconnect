import { useEffect, useId, useRef, useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { ACCOUNT_ACTIONS } from '../../../data/assistantsStore.js';

const STATUS_CLASS = { Active: 'is-active', Pending: 'is-pending', Suspended: 'is-suspended', Expired: 'is-expired', Removed: 'is-removed' };

export function AssistantStatus({ status }) {
  return (
    <span className={`as-status ${STATUS_CLASS[status]}`}>
      <span className="as-status__dot" aria-hidden="true" />
      {status}
    </span>
  );
}

export function TypeTag({ type }) {
  return <span className={`as-type${type === 'Admin Assistant' ? ' is-admin' : ' is-astro'}`}>{type}</span>;
}

export function RoleTag({ role }) {
  return <span className={`as-role${role === 'Editor' ? ' is-editor' : ''}`}>{role}</span>;
}

export const ACTION_ICONS = { resend: 'refresh', suspend: 'userPause', reactivate: 'userCheck', remove: 'userBlock' };

/** Confirmation with a mandatory reason for every account action. */
export function AssistantActionDialog({ assistant, action, onConfirm, onCancel }) {
  const ref = useRef(null);
  const uid = useId();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const meta = ACCOUNT_ACTIONS[action];
  useEffect(() => {
    if (!ref.current.open) ref.current.showModal();
  }, []);
  const consequence = {
    resend: `A new invitation will be sent to ${assistant.email}, valid for 7 days.`,
    suspend: 'The assistant will lose access until reactivated. History is preserved.',
    reactivate: 'The assistant regains access with their current permissions.',
    remove: 'Removal is permanent: access ends now, the record and activity stay as read-only history, and this email can never be used for another assistant account.',
  }[action];
  return (
    <dialog ref={ref} className="u-dialog" aria-labelledby={`${uid}-t`} onCancel={(e) => { e.preventDefault(); onCancel(); }}>
      <form
        className="u-dialog__form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!reason.trim()) return setError('Enter a reason. It is required for every account action.');
          const result = onConfirm(reason);
          if (result && !result.ok) setError(result.error);
        }}
      >
        <header className="u-dialog__head">
          <h2 id={`${uid}-t`} className="u-dialog__title">
            {meta.label}
          </h2>
          <button type="button" className="u-dialog__close" aria-label="Cancel" onClick={onCancel}>
            <Icon name="close" size={18} />
          </button>
        </header>
        <p className="u-dialog__note">
          {assistant.name} ({assistant.id}) · {assistant.status}
          {meta.to !== assistant.status ? ` → ${meta.to}` : ''}
        </p>
        <p className={`u-dialog__note${meta.danger ? ' is-warning' : ''}`}>{consequence}</p>
        <div className="u-dialog__field">
          <label htmlFor={`${uid}-r`} className="u-label">
            Reason <span className="u-required">(required)</span>
          </label>
          <textarea id={`${uid}-r`} className={`u-input u-textarea${error ? ' has-error' : ''}`} rows={3} value={reason} onChange={(e) => { setReason(e.target.value); setError(''); }} />
          {error && (
            <p className="u-field__error" role="alert">
              {error}
            </p>
          )}
        </div>
        <footer className="u-dialog__actions">
          <button type="button" className="u-btn u-btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={`u-btn ${meta.danger ? 'u-btn--danger' : 'u-btn--primary'}`}>
            {meta.label}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
