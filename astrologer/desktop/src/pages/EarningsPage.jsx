import useEarnings, { earningsStore } from '@shared/hooks/useEarnings.js';
import EarningsOverview from '../components/earnings/EarningsOverview.jsx';
import TransactionDetails from '../components/earnings/TransactionDetails.jsx';
import OfferPerformance from '../components/earnings/OfferPerformance.jsx';

// Earnings & Wallet (spec 08_WALLET_AND_EARNINGS.md, AD-120 – AD-126) and Offers
// (spec 09_OFFERS_AND_EARNINGS_CALCULATIONS.md, AD-127, AD-128). Routes:
//   #/earnings             wallet overview, service-wise earnings, transactions, withdrawals, settlement
//   #/earnings/tx/<id>     transaction details
//   #/earnings/offers      offer performance & discount calculation
const view = (route) => (route.parts[0] === 'tx' ? 'tx' : route.parts[0] === 'offers' ? 'offers' : 'overview');

export function meta(route) {
  const v = view(route);
  if (v === 'tx') {
    const t = earningsStore.get().tx.find((x) => x.id === route.parts[1]);
    return t ? { title: `Transaction ${t.id}`, subtitle: t.svc, parent: '/earnings' } : { title: 'Transaction not found', parent: '/earnings' };
  }
  if (v === 'offers') return { title: 'Offer performance', subtitle: 'Matches Wallet & Earnings · revenue and discounts never double-counted', parent: '/earnings' };
  return { title: 'Earnings & Wallet', subtitle: 'Gross revenue, commission and net earnings · refunds appear only here' };
}

export default function EarningsPage({ route, ui, ctx }) {
  const s = useEarnings();
  const v = view(route);
  if (v === 'tx') return <TransactionDetails t={s.tx.find((x) => x.id === route.parts[1])} />;
  if (v === 'offers') return <OfferPerformance campaigns={ctx?.tq?.campaigns} />;
  return <EarningsOverview s={s} ui={ui} />;
}
