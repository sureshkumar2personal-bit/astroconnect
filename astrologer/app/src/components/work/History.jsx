import { HISTORY_FILTERS, HISTORY_MONTHS, dt, dueDate, fmtDate, matchesId } from '../../lib/textQuestions.js';
import { Avatar, StatusBadge } from './ui.jsx';

const CHIPS = ['all', 'answered', 'disputed', 'expired'];

export default function History({ questions, history, setHistory, onOpen }) {
  const { month, status, q: search } = history;
  const received = questions.filter((q) => q.recv.slice(0, 7) === month).length;
  const answered = questions.filter((q) => q.answeredAt && q.answeredAt.slice(0, 7) === month).length;
  const expired = questions.filter((q) => q.status === 'Expired' && dueDate(q).toISOString().slice(0, 7) === month).length;
  const list = questions.filter(HISTORY_FILTERS[status]).filter((q) => matchesId(q, search));

  return (
    <>
      <div className="row wrap">
        <label className="grow">Month{' '}
          <select className="month" value={month} onChange={(e) => setHistory({ month: e.target.value })}>
            {HISTORY_MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>
      </div>
      <div className="facts three">
        <div className="fact"><span className="muted sm">Received</span><b className="xl">{received}</b></div>
        <div className="fact"><span className="muted sm">Answered</span><b className="xl ok-t">{answered}</b></div>
        <div className="fact"><span className="muted sm">Expired</span><b className="xl warn-t">{expired}</b></div>
      </div>
      <div className="row wrap">
        {CHIPS.map((k) => (
          <button key={k} type="button" className={`chip${status === k ? ' on' : ''}`} aria-pressed={status === k} onClick={() => setHistory({ status: k })}>
            {k[0].toUpperCase() + k.slice(1)}
          </button>
        ))}
        <label className="search grow">
          <span className="sr">Search history</span>
          <input type="search" placeholder="User ID / Question ID" value={search} onChange={(e) => setHistory({ q: e.target.value })} />
        </label>
      </div>
      {list.length ? (
        list.map((q) => (
          <button key={q.id} type="button" className="qcard" onClick={() => onOpen(q.id)}>
            <div className="row">
              <Avatar q={q} />
              <div className="grow">
                <b>{q.id}</b>
                <div className="muted sm">
                  {q.name} · {q.status === 'Expired' ? `Auto-cancelled ${fmtDate(dueDate(q))}` : q.answeredAt ? `Answered ${fmtDate(dt(q.answeredAt))}` : ''}
                </div>
              </div>
              <StatusBadge status={q.status} />
            </div>
          </button>
        ))
      ) : (
        <div className="empty"><b>No records</b></div>
      )}
    </>
  );
}
