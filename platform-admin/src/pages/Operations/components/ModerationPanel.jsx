import { useState } from 'react';
import { moderate } from '../../../data/moderationStore.js';
import { DataTable, SubHeading, dt } from '../../UserProfile/components/ui.jsx';

const ACTIONS = [
  ['Flagged', 'Flag / Report'],
  ['Reviewed', 'Mark Reviewed'],
  ['Hidden', 'Hide from User App'],
];

/**
 * Documented moderation (Remedies 08 §7, Content 09 §4): Flag, Review, Hide,
 * each with a reason; logged with Admin and Date / Time. No edit, delete or
 * unhide. `kind` = 'remedy' | 'post'; `log` = moderation entries shown.
 */
export default function ModerationPanel({ kind, targetId, hidden, log, session, onDone }) {
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const reviewed = log.some((m) => m.action === 'Reviewed');

  function submit(e) {
    e.preventDefault();
    const result = moderate(kind, targetId, action, reason, session, { hidden, reviewed });
    if (!result.ok) return setError(result.error);
    setAction(null);
    setReason('');
    setError('');
    onDone(result.entry);
  }

  return (
    <>
      <SubHeading>Moderation</SubHeading>
      <p className="p-small p-muted">
        Admin is view-only and cannot edit or delete. {kind === 'remedy' ? 'A remedy can be hidden from the User App only after review. ' : ''}Hidden items stay visible to Admin.
      </p>
      {hidden ? (
        <p className="p-small"><strong>Hidden from the User App.</strong> No further moderation action is documented.</p>
      ) : (
        <div className="p-actions">
          {ACTIONS.map(([a, label]) => (
            <button
              key={a}
              type="button"
              className={`u-btn${a === 'Hidden' ? ' u-btn--danger' : ''}`}
              disabled={a === 'Hidden' && kind === 'remedy' && !reviewed}
              title={a === 'Hidden' && kind === 'remedy' && !reviewed ? 'Review the remedy first' : undefined}
              onClick={() => { setAction(a); setError(''); }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {action && (
        <form className="p-stack" onSubmit={submit} noValidate>
          <label htmlFor={`mod-${targetId}`} className="u-label">
            Reason for “{ACTIONS.find(([a]) => a === action)[1]}” <span className="u-required">(required)</span>
          </label>
          <textarea id={`mod-${targetId}`} className="u-input u-textarea" rows={2} maxLength={500} value={reason} onChange={(e) => { setReason(e.target.value); setError(''); }} />
          {error && <p className="u-field__error" role="alert">{error}</p>}
          <div className="p-actions">
            <button type="button" className="u-btn u-btn--ghost" onClick={() => setAction(null)}>Cancel</button>
            <button type="submit" className={`u-btn ${action === 'Hidden' ? 'u-btn--danger' : 'u-btn--primary'}`}>Confirm</button>
          </div>
        </form>
      )}
      <DataTable
        caption="Moderation log"
        rows={[...log].reverse()}
        empty={<p className="p-small p-muted">No moderation actions.</p>}
        columns={[
          { key: 'at', header: 'Date / Time', primary: true, render: (m) => dt(m.at) },
          { key: 'a', header: 'Action', render: (m) => m.action },
          { key: 'r', header: 'Reason', className: 'p-wrap', render: (m) => m.reason },
          { key: 'b', header: 'Admin', render: (m) => m.by?.name ?? '—' },
        ]}
      />
    </>
  );
}
