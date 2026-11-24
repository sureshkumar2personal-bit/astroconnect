import { useEffect, useState } from 'react';
import { dueDate, fmtDate, fmtDateTime, inr, isOpen, pendingDay, priority } from '@/lib/textQuestions.js';
import { routes } from '@/lib/router.js';
import Icon from '@/components/ui/Icon.jsx';
import { Avatar, QStatus } from './bits.jsx';

// Question row (AD-48): a compact row with the user, IDs, campaign, received time, priority and pending
// days. The selected row opens into the details grid (type, source, attachments, payment); on phones the
// chevron opens it in place. No Cancel Question action (AD-62).
// The short preview of the question shown until "Show More" is pressed.
const PREVIEW_CHARS = 100;

export default function QCard({ q, campaignName, selected, onSelect, mobile }) {
  // `open` is the astrologer's own choice for this row (null = follow the selection: the selected row is open).
  const [open, setOpen] = useState(null);
  const [full, setFull] = useState(false);
  useEffect(() => { setOpen(null); }, [selected]);
  useEffect(() => { if (!(open ?? selected)) setFull(false); }, [open, selected]);
  const isOpen_ = isOpen(q);
  const p = priority(q);
  const n = q.files.length;
  const expanded = open ?? selected;
  const long = q.text.length > PREVIEW_CHARS;
  const days = (d) => `${d} ${d === 1 ? 'day' : 'days'}`;
  // Desktop: pressing the row selects it and opens it; pressing the open row again closes it.
  // Phones work the same way; the chevron is also a separate tap target that only folds or unfolds the row.
  const onRow = (e) => {
    if (selected) e.preventDefault(); // already showing in the pane: just fold or unfold the row
    setOpen(expanded ? false : true);
    onSelect?.(e);
  };
  const toggle = (e) => { e.preventDefault(); e.stopPropagation(); setOpen(expanded ? false : true); };
  const more = (e) => { e.preventDefault(); e.stopPropagation(); setFull((v) => !v); };
  const attach = q.type === 'General' ? 'None (General)' : n ? `${n} incl. horoscope` : 'None';
  const cells = [
    [isOpen_ ? 'Pending' : 'Status', isOpen_ ? days(pendingDay(q)) : q.status],
    ['Answer by', fmtDate(dueDate(q))],
    ['Type', q.type],
    ['Source', campaignName],
    ['Attachments', attach],
    ['Payment', q.cat === 'sub' ? 'Subscription' : inr(q.paid)],
  ];
  return (
    <a className={`qcard${selected ? ' on' : ''}`} href={`#${routes.detail(q.id)}`} aria-current={selected || undefined} aria-expanded={expanded} onClick={onRow}>
      <div className="qcard__top">
        <Avatar q={q} />
        <div className="qcard__main">
          <div className="qcard__name"><span className="nm">{q.name}</span><span className="muted sm">{q.uid} · {q.id}</span></div>
          <div className="qcard__sub">
            <span className="qchip">{campaignName}</span>
            <span className="muted sm">Received {fmtDateTime(q.recv)}</span>
            {isOpen_ && q.draft ? <span className="qtag qtag--draft">Draft</span> : null}
            {q.status === 'New' ? <span className="qtag qtag--new">New</span> : null}
          </div>
        </div>
        <div className="qcard__side">
          {isOpen_ && p ? <span className={`qd-prio qd-prio--${p}`}>Priority {p}</span> : <QStatus status={q.status} />}
          {isOpen_ && <span className={`sm qcard__pend${p === 1 ? ' dl' : ' muted'}`}>Pending {days(pendingDay(q))}</span>}
        </div>
        {mobile ? (
          <span className="qcard__chev" role="button" tabIndex={0} aria-label={expanded ? 'Hide details' : 'Show details'} aria-expanded={expanded}
            onClick={toggle} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(e)}>
            <Icon name="chevronDown" size={18} className={expanded ? 'is-up' : ''} />
          </span>
        ) : (
          <span className="qcard__chev" aria-hidden="true"><Icon name="chevronDown" size={18} className={expanded ? 'is-up' : ''} /></span>
        )}
      </div>
      {expanded && (
        <div className="qcard__body">
          <p className="qt">{long && !full ? `${q.text.slice(0, PREVIEW_CHARS).trimEnd()}…` : q.text}</p>
          {long && (
            <button type="button" className="qcard__more" aria-expanded={full} onClick={more}>{full ? 'Show Less' : 'Show More'}</button>
          )}
          <div className="qcard__grid">
            {cells.map(([k, v]) => <div key={k} className="qcard__cell"><span className="muted sm">{k}</span><b>{v}</b></div>)}
          </div>
        </div>
      )}
    </a>
  );
}
