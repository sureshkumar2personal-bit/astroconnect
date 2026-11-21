import { dueDate, fmtDate, fmtDateTime, isOpen, pendingDay } from '@shared/lib/textQuestions.js';
import { routes } from '@shared/lib/router.js';
import { Avatar, PrioBadge, QStatus, TypeBadge } from './bits.jsx';

// Question card (AD-48): IDs, user, campaign, type, received, pending days, deadline, priority,
// horoscope / attachment indicator (Personal only, AD-45/AD-61), status, View Question / Answer Now.
// No Cancel Question action (AD-62).
export default function QCard({ q, campaignName, selected, onSelect }) {
  const open = isOpen(q);
  const n = q.files.length;
  return (
    <a className={`qcard${selected ? ' on' : ''}`} href={`#${routes.detail(q.id)}`} aria-current={selected || undefined} onClick={onSelect}>
      <div className="row">
        <Avatar q={q} />
        <div className="grow">
          <div className="nm">{q.name}</div>
          <div className="muted sm">{q.uid} · {q.id}</div>
        </div>
        <TypeBadge type={q.type} />
      </div>
      <div className="qt">{q.text}</div>
      <div className="meta">
        <span>{campaignName}</span>
        <span>Received {fmtDateTime(q.recv)}</span>
        {open && <><span>Pending {pendingDay(q)} days</span><span className="dl">Due {fmtDate(dueDate(q))}</span></>}
      </div>
      <div className="row wrap">
        <PrioBadge q={q} />
        <QStatus status={q.status} />
        {q.type === 'Personal'
          ? <span className={`ind${n ? '' : ' off'}`}>{n ? `Horoscope · ${n} file${n > 1 ? 's' : ''}` : 'No horoscope'}</span>
          : <span className="ind off">No attachments (General)</span>}
        <span className="grow" />
        <span className="go">{open ? 'Answer Now' : 'View Question'} ›</span>
      </div>
    </a>
  );
}
