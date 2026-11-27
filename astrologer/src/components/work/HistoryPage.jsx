import { useEffect, useState } from 'react';
import ExpandTable from '@/components/ui/ExpandTable.jsx';
import Icon from '@/components/ui/Icon.jsx';
import { HISTORY_FILTERS, TODAY, answerBy, fmtDate } from '@/lib/textQuestions.js';
import { QStatus } from './bits.jsx';
import { SearchIcon } from './QuestionToolbar.jsx';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [['all', 'All statuses'], ['answered', 'Answered'], ['disputed', 'Disputed'], ['expired', 'Expired']];
const COLS = ['User', 'Question ID', 'Category', 'Received', 'Amount', 'Status'];
/** "25 Nov 2026 · 6:42 PM" (no leading zero on the hour). */
export const when = (d) => `${fmtDate(d)} · ${new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "2026-11" for a date or ISO string (local time). */
export const monthKey = (d) => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}`; };
export const monthLabel = (k) => `${MONTH_NAMES[Number(k.slice(5)) - 1]} ${k.slice(0, 4)}`;
/** Month choices, newest first: the last 12 months up to the current month, plus any older month that has records. */
export function monthOptions(dates) {
  const keys = new Set(dates.map(monthKey));
  for (let i = 0; i < 12; i += 1) keys.add(monthKey(new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1)));
  return [...keys].sort().reverse();
}
/** Month + year filter shared by Appointment History and Text-Based History. "" = All months. */
export function MonthSelect({ value, onChange, dates }) {
  return (
    <label className="hx-sel hx-sel--month"><span>Month</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All months</option>
        {monthOptions(dates).map((k) => <option key={k} value={k}>{monthLabel(k)}</option>)}
      </select>
    </label>
  );
}

// History (reference TQSUB.history; AD-47, AD-50): the records that are no longer open, for Text-Based
// Questions (#/work/history) or Subscription Questions (#/work/history/sub); the two categories are never
// merged (AD-72). Search, Status and Category filters, expandable rows and 10 rows per page.
export default function HistoryPage({ tq, cat = 'text', toast }) {
  const { status, q: search } = tq.history;
  const [category, setCategory] = useState('');
  const [month, setMonth] = useState(''); // Text-Based questions only (AD-49, AD-50)
  const [page, setPage] = useState(1);
  const term = search.trim().toLowerCase();
  const done = tq.questions.filter((q) => q.cat === cat).filter(HISTORY_FILTERS.all);
  const categories = [...new Set(done.map((q) => tq.campaignName(q.camp)))];
  const list = done
    .filter(HISTORY_FILTERS[status])
    .filter((q) => !category || tq.campaignName(q.camp) === category)
    .filter((q) => !month || monthKey(q.recv) === month)
    .filter((q) => !term || [q.name, q.uid, q.id].some((v) => String(v).toLowerCase().includes(term)))
    .sort((a, b) => new Date(b.recv) - new Date(a.recv));
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  useEffect(() => { setPage(1); }, [status, category, month, search]);
  const cur = Math.min(page, pages);
  const shown = list.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE);
  const from = list.length ? (cur - 1) * PAGE_SIZE + 1 : 0;
  const to = (cur - 1) * PAGE_SIZE + shown.length;

  return (
    <div className="hx">
      <div className="hx-tools">
        <label className="search hx-search">
          <SearchIcon />
          <span className="sr">Search history</span>
          <input type="search" value={search} placeholder="Search by user name, User ID or Question ID" onChange={(e) => tq.setHistory({ q: e.target.value })} />
        </label>
        <label className="hx-sel"><span>Status</span>
          <select value={status} onChange={(e) => tq.setHistory({ status: e.target.value })}>
            {STATUS_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label className="hx-sel"><span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        {cat === 'text' && <MonthSelect value={month} onChange={setMonth} dates={done.map((q) => q.recv)} />}
      </div>
      <div className="hx-card">
        <ExpandTable animate cols={COLS} empty={month ? `No questions in ${monthLabel(month)} match your filters.` : 'No history matches your filters.'}
          rows={shown.map((q) => ({
            key: q.id,
            cells: [
              <span key="u" className="hx-user"><b>{q.name}</b><small>{q.uid}</small></span>,
              <span key="i" className="hx-id">{q.id}</span>,
              tq.campaignName(q.camp),
              when(q.recv),
              <b key="a" className="hx-amt">{q.paid != null ? `₹${q.paid}` : '—'}</b>,
              <span key="s" className="hx-status"><QStatus status={q.status} /></span>,
            ],
            detail: () => <HistoryDetail q={q} toast={toast} />,
          }))}
        />
        <Pager cur={cur} pages={pages} from={from} to={to} total={list.length} onPage={setPage} />
      </div>

    </div>
  );
}

/** Table footer: "Showing a–b of n", Previous / page numbers / Next, "Page x of y". */
export function Pager({ cur, pages, from, to, total, onPage }) {
  return (
    <div className="hx-pager">
      <span className="hx-pager__count">Showing <b>{from}–{to}</b> of <b>{total}</b></span>
      <div className="hx-pager__nav" role="navigation" aria-label="History pages">
        <button type="button" className="hx-pg" disabled={cur === 1} onClick={() => onPage(cur - 1)}><Icon name="chevronRight" size={14} stroke={2.2} className="hx-pg__prev" />Previous</button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" className={`hx-pg hx-pg--n${n === cur ? ' on' : ''}`} aria-current={n === cur ? 'page' : undefined} onClick={() => onPage(n)}>{n}</button>
        ))}
        <button type="button" className="hx-pg" disabled={cur === pages} onClick={() => onPage(cur + 1)}>Next<Icon name="chevronRight" size={14} stroke={2.2} /></button>
      </div>
      <span className="hx-pager__page">Page {cur} of {pages}</span>
    </div>
  );
}

const fileType = (f) => (String(f).split('.').pop() || '').toUpperCase();

/** One section of the expanded row: icon + uppercase label on the left, content on the right. */
const Sec = ({ icon, label, tone, children }) => (
  <div className={`hx-sec${tone ? ` hx-sec--${tone}` : ''}`}>
    <span className="hx-sec__label"><Icon name={icon} size={15} stroke={1.9} />{label}</span>
    <div className="hx-sec__body">{children}</div>
  </div>
);
const KV = ({ k, v }) => <div className="hx-kv"><span>{k}</span><b>{v}</b></div>;

/** Expanded row (reference layout): Payment & Timeline, question, answer, dispute, attachments, review. */
function HistoryDetail({ q, toast }) {
  const refunded = q.status === 'Expired'; // expired questions are auto-cancelled and refunded (timeline rule)
  return (
    <div className="hx-detail">
      <Sec icon="coins" label="Payment & Timeline">
        <div className="hx-kvs">
          <div className="hx-kvcol">
            <KV k="Payment" v={q.paid != null ? `₹${q.paid} · ${refunded ? 'Refunded' : 'Paid'}` : '—'} />
            <KV k="Answer by" v={fmtDate(answerBy(q))} />
          </div>
          <div className="hx-kvcol">
            <KV k="Received" v={when(q.recv)} />
            <KV k="Answered" v={q.answeredAt ? when(q.answeredAt) : '—'} />
          </div>
        </div>
      </Sec>
      <Sec icon="chat" label="User's Question"><p>{q.text}</p></Sec>
      <Sec icon="edit" label="Your Answer" tone="ok"><p className={q.answer ? '' : 'muted'}>{q.answer || 'Not answered'}</p></Sec>
      {q.dispute && <Sec icon="alert" label="Dispute" tone="bad"><p>{q.dispute}</p>{q.disputeAt && <small className="muted">{when(q.disputeAt)}</small>}</Sec>}
      {q.disputeAnswer && <Sec icon="edit" label="Dispute Reply" tone="ok"><p>{q.disputeAnswer}</p>{q.disputeAnsweredAt && <small className="muted">{when(q.disputeAnsweredAt)}</small>}</Sec>}
      <Sec icon="paperclip" label="Attachments">
        {(q.files || []).length ? (
          <div className="hx-files">
            {q.files.map((f) => (
              <span key={f} className="hx-file">
                <span className="hx-file__type">{fileType(f)}</span>
                <span className="hx-file__name">{f}</span>
                <button type="button" className="hx-file__dl" aria-label={`Download ${f}`} title="Prototype: no real file"
                  onClick={() => toast?.('Prototype: no real file to download.')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
                </button>
              </span>
            ))}
          </div>
        ) : <p className="muted">No attachments shared.</p>}
      </Sec>
      <Sec icon="star" label="Review & Rating"><p className="muted">The user hasn't rated this answer yet.</p></Sec>
    </div>
  );
}
