import { useMemo, useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { NOT_FINALISED } from '../../../data/astrologersStore.js';
import {
  DataTable,
  Empty,
  FilterBar,
  Pill,
  SearchFilter,
  Section,
  SelectFilter,
  dt,
  inMonth,
  money,
  monthKey,
  monthLabel,
  useMonths,
  usePaged,
} from '../../UserProfile/components/ui.jsx';
import ExportButtons from '../components/ExportButtons.jsx';

const TYPES = ['Text Question', 'Appointment', 'Instant Call', 'Instant Chat'];
const RATE_LABEL = { 'Text Question': NOT_FINALISED, Appointment: '3%', 'Instant Call': '2%', 'Instant Chat': '2%' };
const amount = (v) => (v === null || v === undefined ? NOT_FINALISED : money(v));

// Tab 3 — Wallet & Earnings (§6, AD-120 – AD-127). Only confirmed rules are
// calculated (decision 3a). Read only.
export default function WalletTab({ profile, notify }) {
  const { wallet, astrologer: a } = profile;
  const settlements = usePaged(wallet.settlements, 10);
  const withdrawals = usePaged(wallet.withdrawals, 10);

  return (
    <div className="p-stack">
      <ul className="p-stats a-wallet-stats" aria-label="Wallet overview">
        <Stat label="Available Balance" value={money(wallet.available)} tone="gold" note="Released settlements less withdrawals" />
        <Stat label="Pending Balance" value={NOT_FINALISED} note="Definition not finalised" muted />
        <Stat label="Held Balance" value={money(wallet.held)} note={wallet.heldTextQuestions ? `Services not yet completed; ${wallet.heldTextQuestions} Text Question${wallet.heldTextQuestions === 1 ? '' : 's'} not included` : 'Services not yet completed'} />
        <Stat label="Total Earnings" value={money(wallet.totalEarnings)} note="Net, completed services; Text Questions not included" />
        <Stat label="Total Withdrawn" value={money(wallet.totalWithdrawn)} note="Paid withdrawals" />
        <Stat label="Total Refunded" value={money(wallet.totalRefunded)} note="Refunded to users" />
      </ul>

      <ServiceEarnings wallet={wallet} />
      <Transactions wallet={wallet} astrologer={a} notify={notify} />
      <MonthWise wallet={wallet} astrologer={a} notify={notify} />

      <div className="p-grid-2">
        <Section id="aw-settlements" title="Settlement History" description="Released on Tuesday and Friday after the eligibility period: Appointments 3 days after completion. Text Question rate and Call / Chat release are not finalised.">
          <DataTable
            caption="Settlement history"
            rows={settlements.rows}
            empty={<Empty icon="finance" title="No settlements released yet" />}
            columns={[
              { key: 'id', header: 'Settlement ID', primary: true, render: (s) => <span className="p-mono">{s.id}</span> },
              { key: 'at', header: 'Released', render: (s) => dt(s.at) },
              { key: 'count', header: 'Services', className: 'is-num', render: (s) => s.count },
              { key: 'gross', header: 'Gross', className: 'is-num', render: (s) => money(s.gross) },
              { key: 'comm', header: 'Commission', className: 'is-num', render: (s) => money(s.commission) },
              { key: 'net', header: 'Net Released', className: 'is-num', render: (s) => <span className="p-credit">{money(s.net)}</span> },
            ]}
          />
          {settlements.pager('settlements')}
        </Section>
        <Section id="aw-withdrawals" title="Withdrawals" description="Minimum ₹500 · Bank Account or UPI · processed within 3 working days. A failed payout returns to the Available Balance.">
          <DataTable
            caption="Withdrawals"
            rows={withdrawals.rows}
            empty={<Empty icon="finance" title="No withdrawals" />}
            columns={[
              { key: 'id', header: 'Withdrawal ID', primary: true, render: (w) => <span className="p-mono">{w.id}</span> },
              { key: 'amt', header: 'Amount', className: 'is-num', render: (w) => money(w.amount) },
              { key: 'method', header: 'Method', render: (w) => w.method },
              { key: 'at', header: 'Requested', render: (w) => dt(w.requestedAt) },
              { key: 'status', header: 'Status', render: (w) => <Pill value={w.status} /> },
              { key: 'ref', header: 'Reference / Failure', className: 'p-wrap', render: (w) => w.failureReason || w.reference },
            ]}
          />
          {withdrawals.pager('withdrawals')}
        </Section>
      </div>
    </div>
  );
}

function Stat({ label, value, note, tone, muted }) {
  return (
    <li className={`p-stat${tone ? ` p-stat--${tone}` : ''}${muted ? ' is-muted' : ''}`}>
      <span className="p-stat__value">{value}</span>
      <span className="p-stat__label">{label}</span>
      {note && <span className="a-stat-note">{note}</span>}
    </li>
  );
}

function ServiceEarnings({ wallet }) {
  const rows = TYPES.map((t) => {
    const list = wallet.earnings.filter((e) => e.service.type === t);
    const completed = list.filter((e) => e.service.completed);
    const known = t !== 'Text Question';
    const sum = (arr, k) => Math.round(arr.reduce((s, e) => s + (e[k] ?? 0), 0) * 100) / 100;
    return {
      type: t,
      count: completed.length,
      gross: sum(completed, 'gross'),
      commission: known ? sum(completed, 'commission') : null,
      net: known ? sum(completed, 'net') : null,
      released: t === 'Appointment' ? sum(completed.filter((e) => e.state === 'Released'), 'net') : null,
      awaiting: t === 'Appointment' ? sum(completed.filter((e) => e.state === 'Awaiting release'), 'net') : null,
    };
  });
  return (
    <Section id="aw-service" title="Service-wise Earnings and Commission" description="Commission is calculated on the amount the user actually paid: Instant Call 2%, Instant Chat 2%, Appointment 3%. No earnings for appointments cancelled by the astrologer.">
      <DataTable
        caption="Service-wise earnings"
        rows={rows}
        rowKey={(r) => r.type}
        columns={[
          { key: 'type', header: 'Service', primary: true, render: (r) => r.type },
          { key: 'count', header: 'Completed', className: 'is-num', render: (r) => r.count },
          { key: 'gross', header: 'Gross Revenue', className: 'is-num', render: (r) => money(r.gross) },
          { key: 'rate', header: 'Commission Rate', render: (r) => RATE_LABEL[r.type] },
          { key: 'comm', header: 'Commission', className: 'is-num', render: (r) => amount(r.commission) },
          { key: 'net', header: 'Net Earnings', className: 'is-num', render: (r) => amount(r.net) },
          { key: 'released', header: 'Released', className: 'is-num', render: (r) => (r.type === 'Appointment' ? money(r.released) : NOT_FINALISED) },
          { key: 'awaiting', header: 'Awaiting Release', className: 'is-num', render: (r) => (r.type === 'Appointment' ? money(r.awaiting) : NOT_FINALISED) },
        ]}
      />
    </Section>
  );
}

const TX_COLUMNS = [
  { header: 'Transaction ID', value: (t) => t.id, width: 18 },
  { header: 'Date / Time', value: (t) => dt(t.at), width: 20 },
  { header: 'Service Type', value: (t) => t.serviceType, width: 14 },
  { header: 'Description', value: (t) => t.description, width: 44 },
  { header: 'Credit', value: (t) => (t.credit ?? (t.serviceType === 'Text Question' && !t.debit && !t.refund ? NOT_FINALISED : '')), width: 12 },
  { header: 'Debit', value: (t) => t.debit ?? '', width: 10 },
  { header: 'Refund Amount', value: (t) => t.refund ?? '', width: 12 },
  { header: 'Balance After', value: (t) => t.balanceAfter, width: 12 },
  { header: 'Status', value: (t) => t.status, width: 16 },
];

function Transactions({ wallet, astrologer, notify }) {
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [month, setMonth] = useState('');
  const [query, setQuery] = useState('');
  const months = useMonths(wallet.transactions.map((t) => t.at));
  const statuses = useMemo(() => [...new Set(wallet.transactions.map((t) => t.status))].sort(), [wallet.transactions]);
  const types = useMemo(() => [...new Set(wallet.transactions.map((t) => t.serviceType))].sort(), [wallet.transactions]);
  const q = query.trim().toLowerCase();
  const rows = wallet.transactions.filter(
    (t) => (type === 'all' || t.serviceType === type) && (status === 'all' || t.status === status) && inMonth(t.at, month) && (!q || t.id.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
  );
  const paged = usePaged(rows, 10, `${type}|${status}|${month}|${q}`);
  return (
    <Section
      id="aw-tx"
      title="Transactions"
      description="Earnings, refunds, settlements and withdrawals. Balance After refers to the Available Balance; only settlements and withdrawals change it."
      actions={<ExportButtons title="Wallet Transactions" astrologer={astrologer} columns={TX_COLUMNS} rows={rows} fileBase="astrologer-transactions" notify={notify} label="transactions" />}
    >
      <FilterBar canClear={type !== 'all' || status !== 'all' || month || q} onClear={() => { setType('all'); setStatus('all'); setMonth(''); setQuery(''); }}>
        <SearchFilter label="Search" value={query} onChange={setQuery} placeholder="Transaction or service ID" />
        <SelectFilter label="Service Type" value={type} onChange={setType} options={[['all', 'All types'], ...types]} />
        <SelectFilter label="Status" value={status} onChange={setStatus} options={[['all', 'All statuses'], ...statuses]} />
        <SelectFilter label="Month" value={month} onChange={setMonth} options={[['', 'All months'], ...months.map((m) => [m, monthLabel(m)])]} />
      </FilterBar>
      <DataTable
        caption="Wallet transactions"
        rows={paged.rows}
        empty={wallet.transactions.length ? <Empty title="No matching transactions" text="Change or clear the filters." /> : <Empty icon="finance" title="No transactions yet" />}
        columns={[
          { key: 'id', header: 'Transaction ID', primary: true, render: (t) => <span className="p-mono">{t.id}</span> },
          { key: 'at', header: 'Date / Time', render: (t) => dt(t.at) },
          { key: 'type', header: 'Service Type', render: (t) => t.serviceType },
          { key: 'desc', header: 'Description', className: 'p-wrap', render: (t) => t.description },
          { key: 'credit', header: 'Credit', className: 'is-num', render: (t) => (t.credit !== null && t.credit !== undefined ? <span className={t.affects ? 'p-credit' : 'a-soft'}>{money(t.credit)}</span> : t.serviceType === 'Text Question' && !t.refund ? <span className="a-soft">{NOT_FINALISED}</span> : '—') },
          { key: 'debit', header: 'Debit', className: 'is-num', render: (t) => (t.debit ? <span className={t.affects ? 'p-debit' : 'p-void'}>{money(t.debit)}</span> : '—') },
          { key: 'refund', header: 'Refund Amount', className: 'is-num', render: (t) => (t.refund ? money(t.refund) : '—') },
          { key: 'bal', header: 'Balance After', className: 'is-num', render: (t) => money(t.balanceAfter) },
          { key: 'status', header: 'Status', render: (t) => <Pill value={t.status} /> },
        ]}
      />
      {paged.pager('transactions')}
    </Section>
  );
}

function MonthWise({ wallet, astrologer, notify }) {
  const months = useMemo(() => {
    const map = new Map();
    for (const e of wallet.earnings) {
      if (!e.service.completed) continue;
      const k = monthKey(e.at);
      const m = map.get(k) ?? { month: k, count: 0, gross: 0, commission: 0, net: 0, released: 0, tq: 0 };
      m.count += 1;
      m.gross += e.gross;
      if (e.net !== null) {
        m.commission += e.commission;
        m.net += e.net;
      } else m.tq += 1;
      if (e.state === 'Released') m.released += e.net;
      map.set(k, m);
    }
    return [...map.values()].map((m) => ({ ...m, gross: Math.round(m.gross * 100) / 100, commission: Math.round(m.commission * 100) / 100, net: Math.round(m.net * 100) / 100, released: Math.round(m.released * 100) / 100 })).sort((x, y) => y.month.localeCompare(x.month));
  }, [wallet.earnings]);
  const [statementMonth, setStatementMonth] = useState(months[0]?.month ?? '');
  const paged = usePaged(months, 6);
  const statementRows = wallet.transactions.filter((t) => inMonth(t.at, statementMonth));
  const summary = months.find((m) => m.month === statementMonth);
  return (
    <Section
      id="aw-months"
      title="Month-wise Earnings"
      actions={
        months.length ? (
          <div className="p-actions a-statement">
            <SelectFilter label="Earnings Statement" value={statementMonth} onChange={setStatementMonth} options={months.map((m) => [m.month, monthLabel(m.month)])} />
            <StatementButton astrologer={astrologer} month={statementMonth} summary={summary} rows={statementRows} notify={notify} />
          </div>
        ) : null
      }
    >
      <DataTable
        caption="Month-wise earnings"
        rows={paged.rows}
        rowKey={(m) => m.month}
        empty={<Empty icon="finance" title="No completed services yet" />}
        columns={[
          { key: 'm', header: 'Month', primary: true, render: (m) => monthLabel(m.month) },
          { key: 'c', header: 'Completed Services', className: 'is-num', render: (m) => m.count },
          { key: 'g', header: 'Gross', className: 'is-num', render: (m) => money(m.gross) },
          { key: 'cm', header: 'Commission (excl. Text Questions)', className: 'is-num', render: (m) => money(m.commission) },
          { key: 'n', header: 'Net (excl. Text Questions)', className: 'is-num', render: (m) => money(m.net) },
          { key: 'r', header: 'Released', className: 'is-num', render: (m) => money(m.released) },
          { key: 'tq', header: 'Text Questions (not finalised)', className: 'is-num', render: (m) => m.tq },
        ]}
      />
      {paged.pager('months')}
    </Section>
  );
}

function StatementButton({ astrologer, month, summary, rows, notify }) {
  const [busy, setBusy] = useState(false);
  async function run() {
    setBusy(true);
    try {
      const { exportTable } = await import('../../../data/exporters.js');
      await exportTable('pdf', {
        title: `AstroConnect - Earnings Statement, ${monthLabel(month)}`,
        lines: [
          `${astrologer.name} (${astrologer.id})`,
          `Completed services ${summary?.count ?? 0} · Gross ${money(summary?.gross ?? 0)} · Commission ${money(summary?.commission ?? 0)} · Net (excl. Text Questions) ${money(summary?.net ?? 0)} · Released ${money(summary?.released ?? 0)}`,
          'Text Question commission and net earnings, Pending Balance and Call / Chat release dates are not finalised.',
        ],
        columns: TX_COLUMNS,
        rows,
        fileBase: `earnings-statement_${astrologer.id}_${month}`,
      });
      notify('success', `Earnings statement for ${monthLabel(month)} downloaded.`);
    } catch (err) {
      console.warn(err);
      notify('error', 'The statement could not be created. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <button type="button" className="u-btn" onClick={run} disabled={busy || !month}>
      <Icon name="download" size={16} />
      {busy ? 'Preparing…' : 'Download PDF Statement'}
    </button>
  );
}
