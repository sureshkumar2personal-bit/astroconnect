import { dt, fmtDateTime, inr2 } from '@shared/lib/format.js';
import { wdStatusKind, withdrawalInProgress } from '@shared/hooks/useEarnings.js';
import { SERVICE_EARNINGS } from '@shared/data/mockEarnings.js';
import { Badge, Grid, Kpi, KpiGrid, Note, PendingTag, Sec, Table } from '../section/kit.jsx';
import EarningsTransactions from './EarningsTransactions.jsx';
import WithdrawDialog from './WithdrawDialog.jsx';

// Wallet overview (AD-120), service-wise earnings (AD-121), transactions (AD-122/123),
// withdrawals (AD-125) and settlement (AD-126). Reference "08 Wallet & Earnings".
export default function EarningsOverview({ s, ui }) {
  const openWithdraw = () => {
    if (withdrawalInProgress(s)) { ui.toast('A withdrawal is already in progress.'); return; }
    ui.dialog({
      title: 'Withdraw',
      body: (close) => (
        <WithdrawDialog s={s} onCancel={close} onDone={() => {
          close();
          ui.toast('Withdrawal requested · status Pending (prototype — no money is moved)');
        }} />
      ),
    });
  };

  return (
    <>
      <div className="row ern-head">
        <span className="grow" />
        <button type="button" className="btn btn-p" onClick={openWithdraw}>Withdraw</button>
      </div>

      <KpiGrid>
        <Kpi label="Available Balance" value={inr2(s.avail)} sub={<span className="sm">Can be withdrawn</span>} />
        <Kpi label="Pending Balance" value={inr2(s.pending)} sub={<PendingTag id="AP-08-01 definition" />} />
        <Kpi label="Held Balance" value={inr2(s.held)} sub={<span className="sm">Services not yet completed</span>} />
        <Kpi label="Total Earnings" value={inr2(s.total)} />
        <Kpi label="Total Withdrawn" value={inr2(s.withdrawn)} />
      </KpiGrid>

      <Sec title="Service-wise earnings">
        <Table bare
          cols={['Service', 'Gross revenue', 'Commission', 'Net earnings', 'Pending / Available']}
          rows={SERVICE_EARNINGS.map((r) => ({
            key: r.name,
            cells: [
              <b>{r.name}</b>, inr2(r.gross),
              r.comm == null ? <PendingTag id="AP-08-02 rate" /> : `${inr2(r.comm)} (${r.rate})`,
              r.comm == null ? '—' : inr2(r.gross - r.comm),
              inr2(r.pa),
            ],
          }))} />
        <p className="muted sm">Live Sessions are free — no Live earnings now.</p>
      </Sec>

      <EarningsTransactions s={s} ui={ui} />

      <Grid size="lg">
        <Sec title="Withdrawals">
          <Table bare cols={['ID', 'Amount', 'Method', 'Requested', 'Status']}
            rows={s.wd.map((w) => ({
              key: w.id,
              cells: [w.id, inr2(w.amt), w.m, fmtDateTime(dt(w.at)), <Badge kind={wdStatusKind(w.st)}>{w.st}</Badge>],
            }))} />
          <p className="muted sm">Minimum ₹500 · any time · Bank Account or UPI (verified) · processed within 3 working days · a failed payout returns to Available Balance.</p>
        </Sec>
        <Sec title="Settlement">
          <Note>Eligible earnings are released twice a week, <b>Tuesday and Friday</b>. Next run: <b>Tue, 24 Nov 2026</b>.</Note>
          <Table bare cols={['Service', 'Eligible after', 'Commission']}
            rows={[
              { key: 'tq', cells: ['Text Questions', '7 days after answer (no dispute)', <PendingTag id="AP-08-02" />] },
              { key: 'apt', cells: ['Appointments', '3 days after completion', '3%'] },
              { key: 'call', cells: ['Instant Call', <>Not confirmed <PendingTag id="AP-08-03" /></>, '2%'] },
              { key: 'chat', cells: ['Instant Chat', <>Not confirmed <PendingTag id="AP-08-03" /></>, '2%'] },
            ]} />
          <p className="muted sm">Complaints or reviews never move earnings to Held. Service completion, settlement release and withdrawal status are separate.</p>
        </Sec>
      </Grid>

      <a className="lnk ern-lnk" href="#/earnings/offers">Offer performance &amp; discount calculation</a>
    </>
  );
}
