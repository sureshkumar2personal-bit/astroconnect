import { useEffect, useState } from 'react';
import { navigate } from '@/lib/router.js';
import { dt } from '@/lib/format.js';
import { NA, fmtWhen, monthName } from './liveFormat.js';

const PAGE = 10;
const na = (v) => (v == null ? NA : String(v));

const SearchIc = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>;
const LiveIc = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="2.2" /><path d="M7.8 7.8a6 6 0 000 8.4M16.2 7.8a6 6 0 010 8.4M5 5a10 10 0 000 14M19 5a10 10 0 010 14" /></svg>;

/** Right-side drawer with one session's details (reference "Session details"). */
function SessionDrawer({ rec, onClose }) {
  const [showComments, setShowComments] = useState(false);
  useEffect(() => { setShowComments(false); }, [rec.id]);
  useEffect(() => {
    const key = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [onClose]);
  const facts = [
    ['Date & time', fmtWhen(rec.date)], ['Duration', rec.dur], ['Audience', rec.aud], ['Status', rec.status],
    ['Total participants', na(rec.parts)], ['Unique participants', na(rec.unique)],
    ['Peak concurrent viewers', na(rec.peak)], ['Total comments', na(rec.comments)], ['Unique commenters', na(rec.commenters)],
  ];
  return (
    <div className="lv-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside className="lv-drawer" role="dialog" aria-modal="true" aria-labelledby="lv-dr-h">
        <header className="lv-drawer__h">
          <h2 id="lv-dr-h">Session details</h2>
          <button type="button" className="lv-x" aria-label="Close session details" onClick={onClose}>✕</button>
        </header>
        <div className="lv-drawer__b">
          <div className="lv-prev__thumb">{rec.thumbUrl ? <img src={rec.thumbUrl} alt="" /> : <span>Thumbnail</span>}</div>
          <h3 className="lv-prev__t">{rec.topic}</h3>
          <dl className="lv-facts">
            {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd className={v === NA ? 'is-na' : ''}>{v}</dd></div>)}
          </dl>
          <button type="button" className="btn btn-o lv-cbtn" aria-expanded={showComments} onClick={() => setShowComments((v) => !v)}>
            {showComments ? 'Hide comments' : 'View comments'} ({rec.comments})
          </button>
          {showComments && (
            <ul className="lv-clist">
              {(rec.commentList || []).length
                ? rec.commentList.map((c, i) => <li key={i}><b>{c.who}</b>{c.at && <span>{c.at}</span>}<p>{c.text}</p></li>)
                : <li className="lv-na">No comments were recorded.</li>}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

/** Live History tab (reference "Live History"): search, month filter, sessions list and the details drawer. */
export default function LiveHistory({ s, id }) {
  const [q, setQ] = useState('');
  const [month, setMonth] = useState('all');
  const [shown, setShown] = useState(PAGE);
  const months = [...new Set(s.past.map((p) => p.date.slice(0, 7)))].sort().reverse();
  const term = q.trim().toLowerCase();
  const rows = s.past
    .filter((p) => (!term || p.topic.toLowerCase().includes(term)) && (month === 'all' || p.date.slice(0, 7) === month))
    .sort((a, b) => dt(b.date) - dt(a.date));
  useEffect(() => { setShown(PAGE); }, [q, month]);
  const list = rows.slice(0, shown);
  const sel = id ? s.past.find((p) => p.id === id) : null;
  const close = () => navigate('/live/history');

  return (
    <section className="lv-card lv-hist" aria-label="Live History">
      <div className="lv-htools">
        <label className="lv-search"><SearchIc /><span className="sr">Search by topic</span>
          <input type="search" value={q} placeholder="Search by topic" onChange={(e) => setQ(e.target.value)} />
        </label>
        <label className="lv-sel"><span className="sr">Filter by month</span>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="all">All months</option>
            {months.map((k) => <option key={k} value={k}>{monthName(k)}</option>)}
          </select>
        </label>
      </div>

      {list.length ? (
        <ul className="lv-rows">
          {list.map((r) => (
            <li key={r.id} className="lv-row">
              <span className="lv-row__ic">{r.thumbUrl ? <img src={r.thumbUrl} alt="" /> : <LiveIc />}</span>
              <div className="lv-row__main"><b>{r.topic}</b><small>{fmtWhen(r.date)} · {r.aud}</small></div>
              <dl className="lv-row__st">
                <div><dt>Duration</dt><dd>{r.dur}</dd></div>
                <div><dt>Participants</dt><dd>{r.parts}</dd></div>
                <div><dt>Comments</dt><dd>{r.comments}</dd></div>
              </dl>
              <span className={`lv-st${r.status === 'Completed' ? ' ok' : ' warn'}`}>{r.status}</span>
              <button type="button" className="btn btn-o sm" onClick={() => navigate(`/live/history/${r.id}`)}>View details</button>
            </li>
          ))}
        </ul>
      ) : <p className="lv-empty">{s.past.length ? 'No sessions match your search.' : 'No past lives yet.'}</p>}

      <div className="lv-hfoot">
        <span>Showing {list.length} of {s.past.length} sessions</span>
        <button type="button" className="btn btn-o sm" disabled={list.length >= rows.length} onClick={() => setShown((n) => n + PAGE)}>Load more</button>
      </div>
      {sel && <SessionDrawer rec={sel} onClose={close} />}
      {id && !sel && <p className="lv-empty" role="alert">That session was not found. <a href="#/live/history">Back to Live History</a></p>}
    </section>
  );
}
