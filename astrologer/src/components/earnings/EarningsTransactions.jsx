import { dt, fmtDateTime, inr2 } from '@/lib/format.js';
import { earningsActions, monthTx, txNet, txStatusKind } from '@/hooks/useEarnings.js';
import { MONTHS, SERVICES, TX_STATUSES } from '@/data/mockEarnings.js';
import { Badge, Kpi, KpiGrid, PendingTag, Sec } from '@/components/ui/sectionKit.jsx';
import ExpandTable from '@/components/ui/ExpandTable.jsx';
import { TxInfo } from './TransactionDetails.jsx';

const COLS = ['Transaction', 'Service', 'Related ID', 'Date & time', 'Gross', 'Commission', 'Net', 'Status'];

// Transactions (AD-122) with month-wise summary and PDF statement (AD-123).
// Clicking a transaction expands its details in place (no separate page); clicking again collapses it.
// Filters are kept in the store so they persist on Back (AD-77).
export default function EarningsTransactions({ s, ui }) {
  const list = monthTx(s);
  const monthName = MONTHS.find(([v]) => v === s.month)?.[1] || s.month;
  const sum = (fn) => list.reduce((a, t) => a + fn(t), 0);

  return (
    <Sec title="Transactions">
      <div className="row wrap ern-filters">
        <label>Month{' '}
          <select value={s.month} onChange={(e) => earningsActions.setMonth(e.target.value)}>
            {MONTHS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label>Service{' '}
          <select value={s.f.svc} onChange={(e) => earningsActions.setFilter({ svc: e.target.value })}>
            <option value="">All services</option>
            {SERVICES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        <label>Status{' '}
          <select value={s.f.st} onChange={(e) => earningsActions.setFilter({ st: e.target.value })}>
            <option value="">All statuses</option>
            {TX_STATUSES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        <span className="grow" />
        <button type="button" className="btn btn-o" onClick={() => ui.toast(`Earnings Statement PDF for ${monthName} is downloading (prototype).`)}>
          Download PDF statement
        </button>
      </div>
      <KpiGrid>
        <Kpi label="Month gross" value={inr2(sum((t) => t.g))} />
        <Kpi label="Month commission" value={inr2(sum((t) => t.c || 0))} />
        <Kpi label="Month net (known rates)" value={inr2(sum((t) => txNet(t) ?? 0))} />
      </KpiGrid>
      <ExpandTable cols={COLS}
        rows={list.map((t) => ({
          key: t.id,
          detail: () => <TxInfo t={t} />,
          cells: [
            <b>{t.id}</b>, t.svc, `${t.ref} · ${t.user}`, fmtDateTime(dt(t.at)), inr2(t.g),
            t.c == null ? <PendingTag id="AP-08-02" /> : inr2(t.c),
            txNet(t) == null ? '—' : inr2(txNet(t)),
            <Badge kind={txStatusKind(t.st)}>{t.st}</Badge>,
          ],
        }))} />
    </Sec>
  );
}
