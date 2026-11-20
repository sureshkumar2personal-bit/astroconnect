import { dt, dueDate, fmtDate, fmtDateTime, isOpen, pendingDay } from '../../lib/textQuestions.js';
import { Avatar, PriorityBadge, StatusBadge, TypeBadge } from './ui.jsx';

export default function QuestionCard({ q, campaignName, selected, onSelect }) {
  const open = isOpen(q);
  const files = q.files.length;
  return (
    <button type="button" className={`qcard${selected ? ' on' : ''}`} aria-current={selected || undefined} onClick={() => onSelect(q.id)}>
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
        <span>Received {fmtDateTime(dt(q.recv))}</span>
        {open && <><span>Pending {pendingDay(q)} days</span><span className="dl">Due {fmtDate(dueDate(q))}</span></>}
      </div>
      <div className="row wrap">
        <PriorityBadge q={q} />
        <StatusBadge status={q.status} />
        <span className={`ind${q.horo ? '' : ' off'}`}>{q.horo ? 'Horoscope' : 'No horoscope'}</span>
        <span className={`ind${files ? '' : ' off'}`}>{files ? `${files} file${files > 1 ? 's' : ''}` : 'No files'}</span>
        <span className="grow" />
        <span className="go">{open ? 'Answer Now' : 'View Question'} ›</span>
      </div>
    </button>
  );
}
