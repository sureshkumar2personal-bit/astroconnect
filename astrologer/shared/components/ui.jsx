import { useEffect, useRef } from 'react';
import { STATUS_KIND, pendingDay, priority } from '../lib/textQuestions.js';

export function Badge({ kind, children }) {
  return <span className={`badge b-${kind}`}>{children}</span>;
}

export const StatusBadge = ({ status }) => <Badge kind={STATUS_KIND[status] || 'info'}>{status}</Badge>;

export const TypeBadge = ({ type }) => <Badge kind={type === 'General' ? 'gen' : 'per'}>{type}</Badge>;

export function PriorityBadge({ q }) {
  const p = priority(q);
  if (!p) return null;
  return <Badge kind={p === 1 ? 'bad' : 'warn'}>Priority {p} · Day {pendingDay(q)}</Badge>;
}

/** Marks a rule the specification has not decided yet (review-list ID). */
export const PendingTag = ({ id }) => (
  <span className="pend" title="Not decided yet in the spec">Pending decision · {id}</span>
);

export const Avatar = ({ q, large }) => (
  <span className={`av${large ? ' av-l' : ''}`} style={{ background: q.color }} aria-hidden="true">{q.ini}</span>
);

export function CharCount({ value, max }) {
  return <span>{value.length} / {max}</span>;
}

/** Native modal <dialog>: focus trap, Esc and backdrop handled by the browser. */
export function Dialog({ open, title, onClose, sheet, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`tq-dialog${sheet ? ' sheet' : ''}`}
      aria-labelledby="tq-dialog-title"
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      {open && (
        <>
          <div className="mhead">
            <h2 id="tq-dialog-title" className="grow">{title}</h2>
            <button type="button" className="btn btn-o sm" onClick={onClose} aria-label="Close">✕</button>
          </div>
          <div className="mbody">{children}</div>
        </>
      )}
    </dialog>
  );
}

export function Toast({ message }) {
  return <div className="toast" role="status" aria-live="polite">{message}</div>;
}
