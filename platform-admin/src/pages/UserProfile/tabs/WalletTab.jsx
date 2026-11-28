import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Icon from '../../../components/icons.jsx';
import {
  buildStatement,
  createAdjustment,
  decideAdjustment,
  logWalletAudit,
  statementMonths,
} from '../../../data/profileStore.js';
import {
  DataTable,
  DetailPanel,
  Empty,
  Fields,
  FilterBar,
  Pill,
  SearchFilter,
  Section,
  SelectFilter,
  dash,
  dt,
  inMonth,
  money,
  monthKey,
  monthLabel,
  useMonths,
  usePaged,
} from '../components/ui.jsx';

const STATUSES = ['Success', 'Pending', 'Failed', 'Reversed', 'Refunded'];
// Only completed transactions change the balance (§5.7).
const affects = (t) => t.status === 'Success' || t.status === 'Refunded';

// Tab 2 — Wallet (§5). Available Balance only; no direct balance editing.
export default function WalletTab({ profile, session, refresh, notify }) {
  const { wallet, user } = profile;
  const logged = useRef(false);

  // §5.8: viewing wallet transactions is recorded once per visit.
  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    logWalletAudit(profile.userId, 'Viewed wallet transactions', session);
    refresh();
  }, [profile.userId, session, refresh]);

  return (
    <div className="p-stack">
      <section className="p-balance" aria-label="Wallet overview">
        <span className="p-balance__icon">
          <Icon name="finance" size={22} />
        </span>
        <div>
          <p className="p-balance__label">Available Balance</p>
          <p className="p-balance__value">{money(wallet.balance)}</p>
        </div>
        <p className="p-balance__note">
          Only completed transactions change the balance. Pending, Failed and Reversed transactions do not.
        </p>
      </section>

      <Transactions wallet={wallet} />
      <Statement profile={profile} />

      <div className="p-grid-2">
        <Refunds wallet={wallet} />
        <Withdrawals wallet={wallet} />
      </div>

      <Adjustments profile={profile} session={session} refresh={refresh} notify={notify} user={user} />
      <WalletAudit entries={profile.walletAudit} />
    </div>
  );
}

// ---------- transactions ----------
function Transactions({ wallet }) {
  const [month, setMonth] = useState('');
  const [direction, setDirection] = useState('all');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);

  const months = useMonths(wallet.transactions.map((t) => t.at));
  const types = useMemo(() => [...new Set(wallet.transactions.map((t) => t.serviceType))].sort(), [wallet.transactions]);
  const q = query.trim().toLowerCase();
  const rows = wallet.transactions.filter(
    (t) =>
      inMonth(t.at, month) &&
      (direction === 'all' || (direction === 'credit' ? t.credit : t.debit)) &&
      (type === 'all' || t.serviceType === type) &&
      (status === 'all' || t.status === status) &&
      (!q ||
        [t.id, t.description, t.gatewayRef, t.serviceId, t.details].some((v) => v && v.toLowerCase().includes(q)))
  );
  const filtered = Boolean(month || direction !== 'all' || type !== 'all' || status !== 'all' || q);
  const paged = usePaged(rows, 10, `${month}|${direction}|${type}|${status}|${q}`);

  return (
    <Section id="w-tx" title="Transaction History" description="One list of all wallet credits and debits, newest first.">
      <FilterBar
        canClear={filtered}
        onClear={() => {
          setMonth('');
          setDirection('all');
          setType('all');
          setStatus('all');
          setQuery('');
        }}
      >
        <SearchFilter label="Search" value={query} onChange={setQuery} placeholder="Transaction, reference or service ID" />
        <SelectFilter label="Month" value={month} onChange={setMonth} options={[['', 'All months'], ...months.map((m) => [m, monthLabel(m)])]} />
        <SelectFilter label="Credit / Debit" value={direction} onChange={setDirection} options={[['all', 'All'], ['credit', 'Credit'], ['debit', 'Debit']]} />
        <SelectFilter label="Service Type" value={type} onChange={setType} options={[['all', 'All types'], ...types]} />
        <SelectFilter label="Status" value={status} onChange={setStatus} options={[['all', 'All statuses'], ...STATUSES]} />
      </FilterBar>
      <DataTable
        caption="Wallet transactions"
        rows={paged.rows}
        onRowClick={setOpen}
        empty={
          wallet.transactions.length ? (
            <Empty title="No matching transactions" text="Change or clear the filters." />
          ) : (
            <Empty icon="finance" title="No wallet transactions yet" />
          )
        }
        columns={[
          { key: 'id', header: 'Transaction ID', primary: true, render: (t) => <span className="p-mono">{t.id}</span> },
          { key: 'at', header: 'Date / Time', render: (t) => dt(t.at) },
          { key: 'desc', header: 'Description / Service Type', render: (t) => <Desc main={t.description} sub={t.serviceType} /> },
          { key: 'credit', header: 'Credit', className: 'is-num', render: (t) => (t.credit ? <span className={affects(t) ? 'p-credit' : 'p-void'}>{money(t.credit)}</span> : '—') },
          { key: 'debit', header: 'Debit', className: 'is-num', render: (t) => (t.debit ? <span className={affects(t) ? 'p-debit' : 'p-void'}>{money(t.debit)}</span> : '—') },
          { key: 'bal', header: 'Balance After', className: 'is-num', render: (t) => money(t.balanceAfter) },
          { key: 'method', header: 'Payment Method', render: (t) => t.method },
          { key: 'gw', header: 'Gateway Reference ID', render: (t) => <span className="p-mono">{dash(t.gatewayRef)}</span> },
          { key: 'svc', header: 'Related Service ID', render: (t) => <span className="p-mono">{dash(t.serviceId)}</span> },
          { key: 'status', header: 'Status', render: (t) => <Pill value={t.status} /> },
          { key: 'details', header: 'Failure / Refund Details', className: 'p-wrap', render: (t) => <span className="p-small">{dash(t.details)}</span> },
        ]}
      />
      {paged.pager('transactions')}
      {open && (
        <DetailPanel title={open.id} subtitle={open.description} onClose={() => setOpen(null)}>
          <Fields
            columns={2}
            items={[
              ['Date / Time', dt(open.at)],
              ['Service Type', open.serviceType],
              ['Credit', open.credit ? money(open.credit) : '—'],
              ['Debit', open.debit ? money(open.debit) : '—'],
              ['Balance After', money(open.balanceAfter)],
              ['Payment Method', open.method],
              ['Gateway Reference ID', dash(open.gatewayRef)],
              ['Related Service ID', dash(open.serviceId)],
              ['Status', <Pill key="s" value={open.status} />],
              ['Failure / Refund Details', dash(open.details), { wide: true }],
            ]}
          />
        </DetailPanel>
      )}
    </Section>
  );
}

function Desc({ main, sub }) {
  return (
    <span className="p-desc">
      <span>{main}</span>
      <span className="p-small">{sub}</span>
    </span>
  );
}

// ---------- monthly statement ----------
function Statement({ profile }) {
  const months = useMemo(() => statementMonths(profile), [profile]);
  // Open on the month of the latest transaction (or the current month).
  const [month, setMonth] = useState(() => {
    const latest = profile.wallet.transactions[0];
    const key = latest ? monthKey(latest.at) : null;
    return key && months.includes(key) ? key : months[0];
  });
  const [busy, setBusy] = useState(null);
  const [feedback, setFeedback] = useState('');
  const statement = useMemo(() => buildStatement(profile, month), [profile, month]);

  async function exportIt(kind) {
    setBusy(kind);
    setFeedback('');
    try {
      const { exportStatement } = await import('../../../data/exporters.js');
      await exportStatement(kind, profile.user, statement);
      setFeedback(`${kind === 'pdf' ? 'PDF' : 'Excel'} statement for ${monthLabel(month)} downloaded.`);
    } catch (err) {
      console.warn(err);
      setFeedback('The statement could not be created. Please try again.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <Section
      id="w-statement"
      title="Monthly Statement"
      actions={
        <div className="p-actions">
          <button type="button" className="u-btn" onClick={() => exportIt('pdf')} disabled={Boolean(busy)}>
            <Icon name="download" size={16} />
            {busy === 'pdf' ? 'Preparing…' : 'Download PDF'}
          </button>
          <button type="button" className="u-btn" onClick={() => exportIt('excel')} disabled={Boolean(busy)}>
            <Icon name="download" size={16} />
            {busy === 'excel' ? 'Preparing…' : 'Download Excel'}
          </button>
        </div>
      }
    >
      <div className="p-statement">
        <SelectFilter label="Statement Month" value={month} onChange={setMonth} options={months.map((m) => [m, monthLabel(m)])} />
        <dl className="p-statement__figures">
          <div>
            <dt>Opening Balance</dt>
            <dd>{money(statement.opening)}</dd>
          </div>
          <div>
            <dt>Total Credit</dt>
            <dd className="p-credit">{money(statement.totalCredit)}</dd>
          </div>
          <div>
            <dt>Total Debit</dt>
            <dd className="p-debit">{money(statement.totalDebit)}</dd>
          </div>
          <div>
            <dt>Closing Balance</dt>
            <dd>{money(statement.closing)}</dd>
          </div>
        </dl>
      </div>
      <p className="p-small p-statement__count" aria-live="polite">
        {statement.rows.length} transaction{statement.rows.length === 1 ? '' : 's'} in {monthLabel(month)}. The downloaded statement includes the full transaction list.
        {feedback && <span className="p-feedback"> {feedback}</span>}
      </p>
    </Section>
  );
}

// ---------- refunds ----------
function Refunds({ wallet }) {
  return (
    <Section
      id="w-refunds"
      title="Refund History"
      description="Refunds are approved in Refund Management. Every user refund is credited to the Wallet once."
    >
      <DataTable
        caption="Refund history"
        rows={wallet.refunds}
        empty={<Empty icon="finance" title="No refunds" />}
        columns={[
          { key: 'id', header: 'Refund Request ID', primary: true, render: (r) => <span className="p-mono">{r.id}</span> },
          { key: 'orig', header: 'Original Transaction ID', render: (r) => <span className="p-mono">{r.originalTx}</span> },
          { key: 'svc', header: 'Related Service', render: (r) => <Desc main={r.serviceId} sub={r.serviceType} /> },
          { key: 'amt', header: 'Amount', className: 'is-num', render: (r) => money(r.amount) },
          { key: 'reason', header: 'Reason', className: 'p-wrap', render: (r) => r.reason },
          { key: 'status', header: 'Status', render: (r) => <Pill value={r.status} /> },
          { key: 'at', header: 'Processed Date', render: (r) => dt(r.processedAt) },
          { key: 'fail', header: 'Failure Reason', render: (r) => dash(r.failureReason) },
        ]}
      />
    </Section>
  );
}

// ---------- withdrawals ----------
function Withdrawals({ wallet }) {
  return (
    <Section
      id="w-withdrawals"
      title="Withdrawal History"
      description="Withdrawals are debits. ₹500 must remain in the Wallet; only the amount above ₹500 can be withdrawn."
    >
      <DataTable
        caption="Withdrawal history"
        rows={wallet.withdrawals}
        empty={<Empty icon="finance" title="No withdrawals" />}
        columns={[
          { key: 'id', header: 'Withdrawal Request ID', primary: true, render: (w) => <span className="p-mono">{w.id}</span> },
          { key: 'amt', header: 'Amount', className: 'is-num', render: (w) => <span className="p-debit">{money(w.amount)}</span> },
          { key: 'ref', header: 'Bank / Payment Reference', render: (w) => <span className="p-mono">{w.bankRef}</span> },
          { key: 'at', header: 'Date / Time', render: (w) => dt(w.at) },
          { key: 'status', header: 'Status', render: (w) => <Pill value={w.status} /> },
          { key: 'fail', header: 'Failure Reason', className: 'p-wrap', render: (w) => dash(w.failureReason) },
        ]}
      />
    </Section>
  );
}

// ---------- adjustments ----------
function Adjustments({ profile, session, refresh, notify, user }) {
  const [creating, setCreating] = useState(false);
  const [deciding, setDeciding] = useState(null); // { request, approve }
  const list = profile.wallet.adjustments;

  return (
    <Section
      id="w-adjust"
      title="Wallet Adjustments"
      description="Balances are never edited directly. An adjustment request needs Super Admin approval; only an approved request changes the balance."
      actions={
        <button type="button" className="u-btn" onClick={() => setCreating(true)}>
          New Adjustment Request
        </button>
      }
    >
      <DataTable
        caption="Wallet adjustment requests"
        rows={list}
        empty={<Empty icon="finance" title="No adjustment requests" />}
        columns={[
          { key: 'id', header: 'Request ID', primary: true, render: (a) => <span className="p-mono">{a.id}</span> },
          { key: 'type', header: 'Credit / Debit', render: (a) => a.type },
          { key: 'amt', header: 'Amount', className: 'is-num', render: (a) => money(a.amount) },
          { key: 'reason', header: 'Reason', className: 'p-wrap', render: (a) => a.reason },
          { key: 'ref', header: 'Supporting Reference', render: (a) => dash(a.reference) },
          { key: 'req', header: 'Requested By', render: (a) => <Desc main={a.requestedBy.name} sub={dt(a.requestedAt)} /> },
          {
            key: 'status',
            header: 'Status',
            render: (a) => (
              <span className="p-desc">
                <Pill value={a.status} />
                {a.decidedBy && <span className="p-small">{a.decidedBy.name} · {dt(a.decidedAt)}</span>}
                {a.rejectionReason && <span className="p-small">Reason: {a.rejectionReason}</span>}
              </span>
            ),
          },
          {
            key: 'actions',
            header: 'Approval',
            render: (a) =>
              a.status === 'Pending' ? (
                <span className="p-actions">
                  <button type="button" className="p-view" onClick={() => setDeciding({ request: a, approve: true })}>
                    Approve
                  </button>
                  <button type="button" className="p-view p-view--danger" onClick={() => setDeciding({ request: a, approve: false })}>
                    Reject
                  </button>
                </span>
              ) : (
                <span className="p-small">{a.txId ? `Posted · ${a.txId}` : 'No balance change'}</span>
              ),
          },
        ]}
      />
      {creating && (
        <AdjustmentDialog
          user={user}
          onClose={() => setCreating(false)}
          onSubmit={(values) => {
            const result = createAdjustment(profile.userId, values, session);
            if (!result.ok) return result;
            setCreating(false);
            refresh();
            notify('success', `Adjustment request ${result.request.id} created and awaiting Super Admin approval.`);
            return result;
          }}
        />
      )}
      {deciding && (
        <DecisionDialog
          {...deciding}
          onClose={() => setDeciding(null)}
          onSubmit={(rejectionReason) => {
            const result = decideAdjustment(profile.userId, deciding.request.id, { approve: deciding.approve, rejectionReason }, session);
            if (!result.ok) return result;
            setDeciding(null);
            refresh();
            notify(
              'success',
              deciding.approve
                ? `Request ${result.request.id} approved. ${deciding.request.type} of ${money(deciding.request.amount)} posted to the Wallet.`
                : `Request ${result.request.id} rejected. The balance is unchanged.`
            );
            return result;
          }}
        />
      )}
    </Section>
  );
}

function Modal({ title, onClose, children, onSubmit }) {
  const ref = useRef(null);
  const uid = useId();
  useEffect(() => {
    if (!ref.current.open) ref.current.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="u-dialog"
      aria-labelledby={uid}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <form className="u-dialog__form" onSubmit={onSubmit} noValidate>
        <header className="u-dialog__head">
          <h2 id={uid} className="u-dialog__title">
            {title}
          </h2>
          <button type="button" className="u-dialog__close" aria-label="Cancel" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </header>
        {children}
      </form>
    </dialog>
  );
}

function AdjustmentDialog({ user, onClose, onSubmit }) {
  const [type, setType] = useState('Credit');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const uid = useId();

  function submit(e) {
    e.preventDefault();
    if (!(Number(amount) > 0)) return setError('Enter an amount greater than zero.');
    if (!reason.trim()) return setError('A reason is required.');
    const result = onSubmit({ type, amount, reason, reference });
    if (result && !result.ok) setError(result.error);
  }

  return (
    <Modal title="New Wallet Adjustment Request" onClose={onClose} onSubmit={submit}>
      <p className="u-dialog__note">
        For {user.name} ({user.id}). The balance changes only after Super Admin approval.
      </p>
      <fieldset className="p-radio-row">
        <legend className="u-label">Adjustment Type</legend>
        {['Credit', 'Debit'].map((t) => (
          <label key={t} className="p-radio">
            <input type="radio" name={`${uid}-type`} value={t} checked={type === t} onChange={() => setType(t)} />
            {t}
          </label>
        ))}
      </fieldset>
      <div className="u-dialog__field">
        <label htmlFor={`${uid}-amt`} className="u-label">
          Amount (₹) <span className="u-required">(required)</span>
        </label>
        <input id={`${uid}-amt`} type="number" min="1" step="1" inputMode="decimal" className="u-input" value={amount} onChange={(e) => { setAmount(e.target.value); setError(''); }} />
      </div>
      <div className="u-dialog__field">
        <label htmlFor={`${uid}-reason`} className="u-label">
          Reason <span className="u-required">(required)</span>
        </label>
        <textarea id={`${uid}-reason`} className="u-input u-textarea" rows={3} maxLength={500} value={reason} onChange={(e) => { setReason(e.target.value); setError(''); }} />
      </div>
      <div className="u-dialog__field">
        <label htmlFor={`${uid}-ref`} className="u-label">
          Supporting Reference <span className="u-optional">(optional)</span>
        </label>
        <input id={`${uid}-ref`} className="u-input" maxLength={80} value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. complaint or transaction ID" />
      </div>
      {error && (
        <p className="u-field__error" role="alert">
          {error}
        </p>
      )}
      <footer className="u-dialog__actions">
        <button type="button" className="u-btn u-btn--ghost" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="u-btn u-btn--primary">
          Submit for Approval
        </button>
      </footer>
    </Modal>
  );
}

export function DecisionDialog({ request, approve, onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const uid = useId();

  function submit(e) {
    e.preventDefault();
    if (!approve && !reason.trim()) return setError('A rejection reason is required.');
    const result = onSubmit(reason);
    if (result && !result.ok) setError(result.error);
  }

  return (
    <Modal title={approve ? 'Approve Adjustment Request' : 'Reject Adjustment Request'} onClose={onClose} onSubmit={submit}>
      <Fields
        columns={2}
        items={[
          ['Request ID', request.id],
          ['Type', request.type],
          ['Amount', money(request.amount)],
          ['Requested By', request.requestedBy.name],
          ['Reason', request.reason, { wide: true }],
        ]}
      />
      <p className={`u-dialog__note${approve ? '' : ' is-warning'}`}>
        {approve
          ? `Approving posts a ${request.type.toLowerCase()} of ${money(request.amount)} to the user’s Wallet.`
          : 'Rejecting leaves the balance unchanged.'}
      </p>
      {!approve && (
        <div className="u-dialog__field">
          <label htmlFor={`${uid}-r`} className="u-label">
            Rejection Reason <span className="u-required">(required)</span>
          </label>
          <textarea id={`${uid}-r`} className="u-input u-textarea" rows={3} value={reason} onChange={(e) => { setReason(e.target.value); setError(''); }} />
        </div>
      )}
      {error && (
        <p className="u-field__error" role="alert">
          {error}
        </p>
      )}
      <footer className="u-dialog__actions">
        <button type="button" className="u-btn u-btn--ghost" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={`u-btn ${approve ? 'u-btn--primary' : 'u-btn--danger'}`}>
          {approve ? 'Approve' : 'Reject'}
        </button>
      </footer>
    </Modal>
  );
}

// ---------- wallet audit ----------
function WalletAudit({ entries }) {
  const paged = usePaged(entries, 5);
  return (
    <Section id="w-audit" title="Wallet Audit" description="Who viewed transactions, requested adjustments, and approved or rejected them.">
      <DataTable
        caption="Wallet audit"
        rows={paged.rows}
        empty={<Empty icon="document" title="No wallet audit entries" />}
        columns={[
          { key: 'at', header: 'Date / Time', primary: true, render: (e) => dt(e.at) },
          { key: 'action', header: 'Action', className: 'p-wrap', render: (e) => e.action },
          { key: 'by', header: 'By', render: (e) => <Desc main={e.by?.name ?? '—'} sub={e.by ? `${e.by.role} · ${e.by.id}` : ''} /> },
        ]}
      />
      {paged.pager('entries')}
    </Section>
  );
}
