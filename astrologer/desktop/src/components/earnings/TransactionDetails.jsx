import { dt, fmtDateTime, inr2 } from '@shared/lib/format.js';
import { relatedHref, txNet } from '@shared/hooks/useEarnings.js';
import { Empty, Facts, Sec } from '../section/kit.jsx';

// Transaction Details (AD-122, opened from a transaction row — AD-78).
// Links to the related Appointment, Consultation or Text Question (WAL-03).
export default function TransactionDetails({ t }) {
  if (!t) return <Empty title="Transaction not found"><a href="#/earnings">Back to Earnings & Wallet</a></Empty>;
  const net = txNet(t);
  return (
    <Sec>
      <Facts items={[
        ['Transaction ID', t.id],
        ['Service / type', t.svc],
        ['Related ID', t.ref],
        ['User', t.user],
        ['Date & time', fmtDateTime(dt(t.at))],
        ['Gross', inr2(t.g)],
        ['Commission', t.c == null ? 'Rate pending (AP-08-02)' : inr2(t.c)],
        ['Net', net == null ? '—' : inr2(net)],
        ['Status', t.st],
      ]} />
      <a className="btn btn-o ern-open" href={relatedHref(t.ref)}>Open {t.ref}</a>
    </Sec>
  );
}
