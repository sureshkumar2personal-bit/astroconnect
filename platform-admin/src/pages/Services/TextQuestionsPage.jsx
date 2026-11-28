import { useEffect, useMemo, useState } from 'react';
import { loadServiceIndex, serviceDetails } from '../../data/serviceIndex.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import {
  DataTable,
  DateFilter,
  DetailPanel,
  Empty,
  Fields,
  FilterBar,
  Pill,
  SearchFilter,
  Section,
  SelectFilter,
  Stats,
  SubHeading,
  ViewButton,
  dt,
  money,
  usePaged,
} from '../UserProfile/components/ui.jsx';
import { AstroLink, DAY, ErrorState, ExportPair, LoadingState, NOT_FINALISED, PageHead, UnavailableAction, UserLink, startOfDay, useToast } from './components/ServiceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import './ServicesPage.css';

// Service Management → Text Questions (text-based-question-management.md).
// Approved statuses (AD-51); 30-day answer deadline (AD-30 / D-18); question
// text ≤ 1,000 characters (AD-69); answer ≤ 1,500 characters (AD-36);
// Personal Question attachments: up to 2 PDF / JPEG files of 10 MB (D-35).
// No assignment, no Category (PP-05), no Follow-up (PP-06). Admin cancel is
// unavailable until its effect is decided (PP-13); "Due today" / "Overdue"
// is PP-21.

export const QUESTION_STATUSES = ['New / Received', 'Pending', 'Completed', 'Settled', 'Correction Requested', 'Disputed', 'Dispute Answered', 'Expired'];
const SORTS = [
  ['submitted:desc', 'Newest submitted'],
  ['submitted:asc', 'Oldest submitted'],
  ['deadline:asc', 'Deadline (soonest)'],
  ['amount:desc', 'Amount (highest)'],
];

export default function TextQuestionsPage() {
  const [state, setState] = useState({ status: 'loading', index: null, message: '' });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [payment, setPayment] = useState('all');
  const [astro, setAstro] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState('submitted:desc');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();

  useEffect(() => {
    let live = true;
    loadServiceIndex().then((index) => live && setState({ status: 'ready', index, message: '' }), (e) => live && setState({ status: 'error', index: null, message: e.message }));
    return () => {
      live = false;
    };
  }, []);

  const qs = state.index?.questions ?? [];
  const snapshot = state.index?.snapshot ?? Date.now();
  const astrologers = useMemo(() => [...new Map(qs.map((q) => [q.astroId, q.astroName])).entries()].sort((a, b) => a[1].localeCompare(b[1])), [qs]);
  const payments = useMemo(() => [...new Set(qs.map((q) => q.paymentStatus))].sort(), [qs]);
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const f = from ? new Date(`${from}T00:00:00`).getTime() : null;
    const t = to ? new Date(`${to}T23:59:59`).getTime() : null;
    const list = qs.filter(
      (x) =>
        (status === 'all' || x.status === status) &&
        (payment === 'all' || x.paymentStatus === payment) &&
        (astro === 'all' || x.astroId === astro) &&
        (f === null || x.createdAt >= f) &&
        (t === null || x.createdAt <= t) &&
        (!q || x.id.toLowerCase().includes(q) || x.userId.toLowerCase().includes(q) || x.astroId.toLowerCase().includes(q) || x.userName.toLowerCase().includes(q) || x.astroName.toLowerCase().includes(q))
    );
    const [key, dir] = sort.split(':');
    const val = { submitted: (x) => x.createdAt, deadline: (x) => x.deadline, amount: (x) => x.amount }[key];
    return list.sort((a, b) => (dir === 'asc' ? val(a) - val(b) : val(b) - val(a)) || a.id.localeCompare(b.id));
  }, [qs, query, status, payment, astro, from, to, sort]);
  const paged = usePaged(rows, 10, [query, status, payment, astro, from, to, sort].join('|'));

  const report = useMemo(() => {
    const today = startOfDay(snapshot);
    const answered = qs.filter((x) => x.answeredAt);
    const avgHours = answered.length ? answered.reduce((s, x) => s + (x.answeredAt - x.createdAt), 0) / answered.length / 3600000 : 0;
    const monthStart = new Date(today);
    monthStart.setDate(1);
    const perAstro = new Map();
    for (const x of qs) {
      const r = perAstro.get(x.astroId) ?? { id: x.astroId, name: x.astroName, total: 0, answered: 0, time: 0, month: 0 };
      r.total += 1;
      if (x.answeredAt) {
        r.answered += 1;
        r.time += x.answeredAt - x.createdAt;
      }
      if (x.createdAt >= monthStart.getTime()) r.month += 1;
      perAstro.set(x.astroId, r);
    }
    return {
      total: qs.length,
      newToday: qs.filter((x) => x.createdAt >= today && x.createdAt <= snapshot).length,
      answeredToday: qs.filter((x) => x.answeredAt && x.answeredAt >= today && x.answeredAt <= snapshot).length,
      pending: qs.filter((x) => x.status === 'Pending').length,
      expired: qs.filter((x) => x.status === 'Expired').length,
      avg: avgHours >= 48 ? `${(avgHours / 24).toFixed(1)} days` : `${avgHours.toFixed(1)} hours`,
      astro: [...perAstro.values()].sort((a, b) => b.total - a.total).slice(0, 10),
    };
  }, [qs, snapshot]);

  const columns = [
    { header: 'Question ID', value: (x) => x.id, width: 16 },
    { header: 'User', value: (x) => `${x.userName} (${x.userId})`, width: 28 },
    { header: 'Astrologer', value: (x) => `${x.astroName} (${x.astroId})`, width: 30 },
    { header: 'Submitted', value: (x) => dt(new Date(x.createdAt).toISOString()), width: 20 },
    { header: 'Deadline (30 days)', value: (x) => dt(new Date(x.deadline).toISOString()), width: 20 },
    { header: 'User Paid Amount', value: (x) => x.amount, width: 12 },
    { header: 'Payment Status', value: (x) => x.paymentStatus, width: 12 },
    { header: 'Question Status', value: (x) => x.status, width: 18 },
  ];

  return (
    <div className="users services">
      <PageHead title="Text Questions" subtitle="Questions bought from an astrologer’s campaigns or Open Questions, answered within 30 days of submission." />
      {state.status === 'loading' && <LoadingState label="Loading text questions" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <>
          <Stats
            label="Text question report"
            items={[
              ['Total Questions', formatNumber(report.total), 'gold'],
              ['New Today', report.newToday],
              ['Answered Today', report.answeredToday, 'green'],
              ['Pending', formatNumber(report.pending)],
              ['Due Today', NOT_FINALISED],
              ['Expired', report.expired],
              ['Average Answer Time', report.avg],
            ]}
          />
          <Section id="tq-list" title="Questions" actions={<ExportPair title="Text Questions" columns={columns} rows={rows} fileBase="astroconnect-text-questions" notify={notify} />}>
            <FilterBar canClear={Boolean(query || status !== 'all' || payment !== 'all' || astro !== 'all' || from || to)} onClear={() => { setQuery(''); setStatus('all'); setPayment('all'); setAstro('all'); setFrom(''); setTo(''); }}>
              <SearchFilter label="Search" value={query} onChange={setQuery} placeholder="Question, User or Astrologer ID / name" />
              <SelectFilter label="Question Status" value={status} onChange={setStatus} options={[['all', 'All statuses'], ...QUESTION_STATUSES]} />
              <SelectFilter label="Payment Status" value={payment} onChange={setPayment} options={[['all', 'All'], ...payments]} />
              <SelectFilter label="Astrologer" value={astro} onChange={setAstro} options={[['all', 'All astrologers'], ...astrologers]} />
              <DateFilter label="Submitted from" value={from} onChange={setFrom} max={to || undefined} />
              <DateFilter label="Submitted to" value={to} onChange={setTo} min={from || undefined} />
              <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
            </FilterBar>
            <p className="p-small p-muted">{formatNumber(rows.length)} questions · “Due today” and “Overdue” views: {NOT_FINALISED}.</p>
            <DataTable
              caption="Text questions"
              rows={paged.rows}
              onRowClick={setOpen}
              empty={<Empty title="No matching questions" text="Change or clear the filters." />}
              columns={[
                { key: 'id', header: 'Question ID', primary: true, render: (x) => <span className="p-mono">{x.id}</span> },
                { key: 'user', header: 'User', render: (x) => <UserLink id={x.userId} name={x.userName} /> },
                { key: 'astro', header: 'Astrologer', render: (x) => <AstroLink id={x.astroId} name={x.astroName} /> },
                { key: 'sub', header: 'Submitted', render: (x) => dt(new Date(x.createdAt).toISOString()) },
                { key: 'dl', header: 'Deadline (30 days)', render: (x) => dt(new Date(x.deadline).toISOString()) },
                { key: 'amt', header: 'User Paid Amount', className: 'is-num', render: (x) => money(x.amount) },
                { key: 'pay', header: 'Payment Status', render: (x) => <Pill value={x.paymentStatus} /> },
                { key: 'st', header: 'Question Status', render: (x) => <Pill value={x.status} /> },
                { key: 'v', header: 'View Details', render: (x) => <ViewButton onClick={() => setOpen(x)} /> },
              ]}
            />
            {paged.pager('questions')}
          </Section>
          <Section id="tq-astro" title="Astrologer-wise Answer Performance" description="Each astrologer has one shared monthly quota of 1,000 question slots across Campaign and Open Questions, reset on the 1st of each month at 12:00 AM IST.">
            <DataTable
              caption="Astrologer answer performance"
              rows={report.astro}
              columns={[
                { key: 'a', header: 'Astrologer', primary: true, render: (r) => <AstroLink id={r.id} name={r.name} tab="services" /> },
                { key: 't', header: 'Questions', className: 'is-num', render: (r) => r.total },
                { key: 'an', header: 'Answered', className: 'is-num', render: (r) => r.answered },
                { key: 'avg', header: 'Average Answer Time', className: 'is-num', render: (r) => (r.answered ? `${(r.time / r.answered / DAY).toFixed(1)} days` : '—') },
                { key: 'm', header: 'Received This Month (of 1,000)', className: 'is-num', render: (r) => r.month },
              ]}
            />
          </Section>
        </>
      )}
      {open && <QuestionDetails row={open} onClose={() => setOpen(null)} />}
      {toastNode}
    </div>
  );
}

function QuestionDetails({ row, onClose }) {
  const detail = serviceDetails(row.userId, row.id);
  if (!detail) return null;
  const { service: s, dispute, transactions, user } = detail;
  const userFiles = s.attachments.filter((f) => f.sender === 'User');
  const answerFiles = s.attachments.filter((f) => f.sender === 'Astrologer');
  return (
    <DetailPanel title={s.id} subtitle={`${user.name} (${user.id}) → ${s.astrologer.name} (${s.astrologer.id})`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Status', <Pill key="s" value={row.status} />],
          ['Submitted', dt(s.createdAt)],
          ['Answer Deadline', `${dt(s.deadline)} (30 days)`],
          ['Answered', dt(s.answeredAt)],
          ['User', <UserLink key="u" id={user.id} name={user.name} />],
          ['Astrologer', <AstroLink key="a" id={s.astrologer.id} name={s.astrologer.name} />],
          ['Birth Details Used', s.birthDetailsUsed, { wide: true }],
        ]}
      />
      <SubHeading>Question ({s.question.length} / 1,000 characters)</SubHeading>
      <p className="p-quote">{s.question}</p>
      <SubHeading>Question Attachments ({userFiles.length} of up to 2 · PDF / JPEG · 10 MB each)</SubHeading>
      {userFiles.length ? <ul className="p-list">{userFiles.map((f) => <li key={f.name}><span className="p-file">{f.name}</span> · {f.type} · {f.size}</li>)}</ul> : <p className="p-muted">No attachments.</p>}
      <SubHeading>Astrologer Answer {s.answer ? `(${s.answer.length} / 1,500 characters)` : ''}</SubHeading>
      <p className="p-quote">{s.answer ?? 'Not answered yet.'}</p>
      {answerFiles.length > 0 && <ul className="p-list">{answerFiles.map((f) => <li key={f.name}><span className="p-file">{f.name}</span> · {f.type} · {f.size}</li>)}</ul>}
      <p className="p-small p-muted">Answers cannot be edited after submission.</p>
      <SubHeading>Payment Details</SubHeading>
      <Fields
        columns={2}
        items={[
          ['User Paid Amount', money(s.amount)],
          ['Payment Status', <Pill key="p" value={s.paymentStatus} />],
          ['Payment Method', s.payments?.[0]?.method ?? s.method],
          ['Payment Transaction ID', (s.payments ?? []).map((p) => p.id).join(', ') || '—'],
          ['Wallet Transactions', transactions.map((t) => `${t.id} (${t.status})`).join(', ') || 'Paid directly', { wide: true }],
          ['Cancellation / Refund', s.refundInfo ? `${money(s.refundInfo.amount)} · ${s.refundInfo.status}` : 'None'],
        ]}
      />
      <SubHeading>Related Dispute</SubHeading>
      {dispute ? (
        <Fields columns={2} items={[['Dispute ID', dispute.id], ['Status', <Pill key="d" value={dispute.status} />], ['Raised', dt(dispute.raisedAt)], ['Astrologer Answer Deadline', dt(dispute.deadline)]]} />
      ) : (
        <p className="p-muted">No dispute raised.</p>
      )}
      <SubHeading>Actions</SubHeading>
      <UnavailableAction label="Cancel with Reason" reason={`${NOT_FINALISED}: the resulting status and refund are not yet decided.`} />
    </DetailPanel>
  );
}
