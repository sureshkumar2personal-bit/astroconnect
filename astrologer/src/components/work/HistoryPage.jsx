import { Kpi, KpiGrid, Seg, Table } from '@/components/ui/sectionKit.jsx';
import { HISTORY_FILTERS, HISTORY_MONTHS, dueDate, fmtDate, matchesId } from '@/lib/textQuestions.js';
import { navigate, routes } from '@/lib/router.js';
import { QStatus } from './bits.jsx';

// History (reference TQSUB.history; AD-47, AD-50): month summary of Text-Based Questions and the
// records that are no longer open; a row opens the question timeline.
export default function HistoryPage({ tq }) {
  const { month, status, q: search } = tq.history;
  const inM = (d) => d && d.slice(0, 7) === month;
  const text = tq.questions.filter((q) => q.cat === 'text');
  const received = text.filter((q) => inM(q.recv)).length;
  const answered = text.filter((q) => inM(q.answeredAt)).length;
  const expired = text.filter((q) => q.status === 'Expired' && dueDate(q).toISOString().slice(0, 7) === month).length;
  const list = text.filter(HISTORY_FILTERS[status]).filter((q) => matchesId(q, search));
  return (
    <>
      <div className="row wrap">
        <label>Month{' '}
          <select value={month} onChange={(e) => tq.setHistory({ month: e.target.value })}>
            {HISTORY_MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>
      </div>
      <KpiGrid>
        <Kpi label="Received" value={received} />
        <Kpi label="Answered" value={<span className="ok-t">{answered}</span>} />
        <Kpi label="Expired" value={<span className="dl">{expired}</span>} />
      </KpiGrid>
      <div className="row wrap">
        <Seg label="History filter" value={status} onChange={(v) => tq.setHistory({ status: v })}
          options={[['all', 'All'], ['answered', 'Answered'], ['disputed', 'Disputed'], ['expired', 'Expired']]} />
        <label className="search">
          <span className="sr">Search history</span>
          <input type="search" value={search} placeholder="User ID / Question ID" onChange={(e) => tq.setHistory({ q: e.target.value })} />
        </label>
      </div>
      <Table
        cols={['Question', 'User', 'Campaign', 'Status', 'Date']}
        rows={list.map((q) => ({
          key: q.id,
          onOpen: () => navigate(routes.timeline(q.id)),
          cells: [<b key="i">{q.id}</b>, q.name, tq.campaignName(q.camp), <QStatus key="s" status={q.status} />, q.answeredAt ? fmtDate(q.answeredAt) : fmtDate(dueDate(q))],
        }))}
      />
    </>
  );
}
