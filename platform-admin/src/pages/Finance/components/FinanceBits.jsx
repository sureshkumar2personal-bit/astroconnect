import { useEffect, useState } from 'react';
import { href } from '../../../router/useHashRoute.js';
import { userProfilePath } from '../../../router/navigation.js';
import { DetailPanel, Fields, Pill, SubHeading, dt, money } from '../../UserProfile/components/ui.jsx';
import { AstroLink, UserLink } from '../../Services/components/ServiceBits.jsx';
import { affectsBalance } from '../../../data/walletIndex.js';

export const iso = (t) => (t ? new Date(t).toISOString() : null);

/** { status: 'loading' | 'ready' | 'error', data, message, reload } for an async loader. */
export function useLoaded(loader) {
  const [state, setState] = useState({ status: 'loading', data: null, message: '' });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    loader().then(
      (data) => live && setState({ status: 'ready', data, message: '' }),
      (e) => live && setState({ status: 'error', data: null, message: e.message })
    );
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);
  return { ...state, reload: () => setTick((t) => t + 1) };
}

/** Text search + date range + sort shared by the Finance lists. */
export function inRange(ms, from, to) {
  if (from && ms < new Date(`${from}T00:00:00`).getTime()) return false;
  if (to && ms > new Date(`${to}T23:59:59`).getTime()) return false;
  return true;
}

export function FinanceHead({ title, subtitle }) {
  return (
    <header className="u-head">
      <nav aria-label="Breadcrumb" className="u-crumbs">
        <ol>
          <li>
            <a href={href('/dashboard')}>Dashboard</a>
          </li>
          <li>Finance</li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>
      <div className="u-head__row">
        <div>
          <h1 className="u-head__title">{title}</h1>
          <p className="u-head__subtitle">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}

export function Amount({ row }) {
  if (row.credit) return <span className={affectsBalance(row) ? 'p-credit' : 'p-void'}>+{money(row.credit)}</span>;
  if (row.debit) return <span className={affectsBalance(row) ? 'p-debit' : row.direct && row.status !== 'Failed' ? '' : 'p-void'}>−{money(row.debit)}</span>;
  return '—';
}

/** Details of one transaction row; refunds show their original payment. */
export function TxDetails({ row, rows, onClose, onOpen }) {
  const original = row.originalTx ? rows.find((r) => r.id === row.originalTx) : null;
  const refundRow = row.status === 'Refunded' ? rows.find((r) => r.category === 'Refund' && r.originalTx === row.id && r.userId === row.userId) : null;
  return (
    <DetailPanel title={row.id} subtitle={`${row.category} · ${row.userName} (${row.userId})`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Status', <Pill key="s" value={row.status} />],
          ['Date / Time', dt(iso(row.at))],
          ['Type', row.category],
          ['Service Type', row.serviceType],
          ['Amount', <Amount key="a" row={row} />],
          ['Wallet Balance After', row.direct ? 'Not a wallet transaction' : money(row.balanceAfter)],
          ['Changes Wallet Balance', row.direct ? 'No (paid directly)' : affectsBalance(row) ? 'Yes' : 'No — only completed transactions change the balance'],
          ['Payment Method', row.method ?? '—'],
          ['Gateway / Bank Reference', row.gatewayRef ?? '—'],
          ['User', <UserLink key="u" id={row.userId} name={row.userName} />],
          ['Description', row.description, { wide: true }],
          ['Details', row.details || '—', { wide: true }],
        ]}
      />
      {(row.serviceId || row.astroId) && (
        <>
          <SubHeading>Related Service</SubHeading>
          <Fields columns={2} items={[['Service ID', row.serviceId ?? '—'], ['Astrologer', row.astroId ? <AstroLink key="a" id={row.astroId} name={row.astroName} /> : '—']]} />
        </>
      )}
      {row.category === 'Refund' && (
        <>
          <SubHeading>Original Payment</SubHeading>
          <Fields
            columns={2}
            items={[
              ['Refund ID', row.refundId ?? '—'],
              ['Original Transaction', original ? <button key="o" type="button" className="p-link" onClick={() => onOpen(original)}>{original.id}</button> : row.originalTx ?? '—'],
              ['Original Status', original ? <Pill key="os" value={original.status} /> : '—'],
              ['Credited to Wallet', 'Once, by this transaction'],
              ['Super Admin approval for automatic refunds', 'Not finalised'],
            ]}
          />
        </>
      )}
      {refundRow && (
        <>
          <SubHeading>Refund</SubHeading>
          <Fields columns={2} items={[['Refund Credit', <button key="r" type="button" className="p-link" onClick={() => onOpen(refundRow)}>{refundRow.id}</button>], ['Amount', money(refundRow.credit)]]} />
        </>
      )}
      <p className="p-small p-muted">
        <a className="u-name" href={`${href(userProfilePath(row.userId))}?tab=wallet`}>Open the user’s Wallet</a> to see the full ledger, statements and adjustment requests.
      </p>
    </DetailPanel>
  );
}
