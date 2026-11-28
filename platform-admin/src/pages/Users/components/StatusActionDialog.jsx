import { useEffect, useId, useRef, useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { ACTIONS } from '../../../data/usersStore.js';
import { Avatar, StatusBadge } from './UserBits.jsx';

const CONSEQUENCE = {
  user: {
    suspend: 'The user will not be able to log in or use services while suspended. Their history, wallet and services are preserved.',
    block: 'The user will not be able to log in or use services while blocked. Their history, wallet and services are preserved.',
    reactivate: 'The user will be able to log in and use services again.',
    unblock: 'The user will be able to log in and use services again.',
  },
  astrologer: {
    suspend: 'The astrologer will not be able to log in or provide services while suspended. Services, wallet, earnings, settlements and disputes are preserved.',
    block: 'The astrologer will not be able to log in or provide services while blocked. Services, wallet, earnings, settlements and disputes are preserved.',
    reactivate: 'The astrologer will be able to log in and provide services again.',
    unblock: 'The astrologer will be able to log in and provide services again.',
  },
};

// Confirmation dialog for Suspend / Block / Reactivate / Unblock.
// A reason is mandatory for every action (user-management.md §12).
export default function StatusActionDialog({ user, action, onConfirm, onCancel, subject = 'user' }) {
  const dialogRef = useRef(null);
  const reasonRef = useRef(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const uid = useId();
  const meta = ACTIONS[action];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    reasonRef.current?.focus();
  }, []);

  function submit(event) {
    event.preventDefault();
    if (!reason.trim()) {
      setError('Enter a reason. It is required for every account status change.');
      reasonRef.current?.focus();
      return;
    }
    const result = onConfirm({ reason, notes });
    if (result && !result.ok) setError(result.error);
  }

  const destructive = action === 'suspend' || action === 'block';

  return (
    <dialog
      ref={dialogRef}
      className="u-dialog"
      aria-labelledby={`${uid}-title`}
      aria-describedby={`${uid}-desc`}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      <form className="u-dialog__form" onSubmit={submit} noValidate>
        <header className="u-dialog__head">
          <h2 id={`${uid}-title`} className="u-dialog__title">
            {meta.label}
          </h2>
          <button type="button" className="u-dialog__close" aria-label="Cancel" onClick={onCancel}>
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className="u-dialog__user">
          <Avatar user={user} size={40} />
          <div>
            <p className="u-dialog__name">{user.name}</p>
            <p className="u-dialog__uid u-mono">{user.id}</p>
          </div>
        </div>

        <div className="u-dialog__change" aria-label="Status change">
          <StatusBadge status={user.status} />
          <Icon name="arrowRight" size={16} />
          <StatusBadge status={meta.to} />
        </div>

        <p id={`${uid}-desc`} className={`u-dialog__note${destructive ? ' is-warning' : ''}`}>
          {CONSEQUENCE[subject][action]}
        </p>

        <div className="u-dialog__field">
          <label htmlFor={`${uid}-reason`} className="u-label">
            Reason <span className="u-required">(required)</span>
          </label>
          <textarea
            ref={reasonRef}
            id={`${uid}-reason`}
            className={`u-input u-textarea${error ? ' has-error' : ''}`}
            rows={3}
            maxLength={500}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${uid}-err` : undefined}
            required
          />
          {error && (
            <p id={`${uid}-err`} className="u-field__error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="u-dialog__field">
          <label htmlFor={`${uid}-notes`} className="u-label">
            Additional notes <span className="u-optional">(optional)</span>
          </label>
          <textarea
            id={`${uid}-notes`}
            className="u-input u-textarea"
            rows={2}
            maxLength={500}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <p className="u-dialog__audit">
          This change is recorded in the account’s status history with your name, the date and time,
          and the reason.
        </p>

        <footer className="u-dialog__actions">
          <button type="button" className="u-btn u-btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={`u-btn ${destructive ? 'u-btn--danger' : 'u-btn--primary'}`}>
            {meta.verb} account
          </button>
        </footer>
      </form>
    </dialog>
  );
}
