import { useMemo, useState } from 'react';
import { COMMISSION_RULES, SERVICE_TYPES, groupTotals, loadRevenueData, monthOf } from '../../data/revenueData.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, Empty, FilterBar, SearchFilter, Section, SelectFilter, monthLabel, money, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, NOT_FINALISED, useToast } from '../Services/components/ServiceBits.jsx';
import { FinanceHead, inRange, useLoaded } from './components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const EMPTY = { type: 'all', from: '', to: '' };
const rateText = (r) => (r.free ? 'Free — no commission' : r.rate === null ? NOT_FINALISED : `${Math.round(r.rate * 100)}%`);

// Finance → Platform Commission. Commission is taken from Astrologer Earnings
// (confirmed rates only: Call / Chat 2%, Appointment 3%, on the amount the
// user paid), so totals match that page. Text Questions and Subscriptions
// stay Not finalised (PP-09). Rates are changed in Commission Settings
// (Super Admin), not here.
export default function PlatformCommissionPage() {
  const state = useLoaded(loadRevenueData);
  const [f, setF] = useState(EMPTY);
  const [astroQuery, setAstroQuery] = useState('');
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));

  const earnings = useMemo(() => (state.data?.astro.earnings ?? []).filter((e) => (f.type === 'all' || e.serviceType === f.type) && inRange(e.bookedAt, f.from, f.to)), [state.data, f]);
  const services = useMemo(() => (state.data?.services ?? []).filter((s) => (f.type === 'all' || s.type === f.type) && inRange(s.at, f.from, f.to)), [state.data, f]);
  const byType = useMemo(() => {
    const g = groupTotals(services, (s) => s.type);
    return SERVICE_TYPES.filter((t) => g.has(t)).map((t) => g.get(t));
  }, [services]);
  const split = useMemo(() => {
    const known = earnings.filter((e) => e.commission !== null);
    const sum = (l) => l.reduce((t, e) => t + e.commission, 0);
    return { total: sum(known), completed: sum(known.filter((e) => e.status !== 'Held')), held: sum(known.filter((e) => e.status === 'Held')), count: known.length };
  }, [earnings]);
  const byMonth = useMemo(() => [...groupTotals(services, (s) => monthOf(s.at)).values()].sort((a, b) => b.key.localeCompare(a.key)), [services]);
  const months = usePaged(byMonth, 12, JSON.stringify(f));
  const byAstro = useMemo(() => {
    const m = new Map();
    for (const e of earnings) {
      if (e.commission === null) continue;
      const g = m.get(e.astroId) ?? { astroId: e.astroId, astroName: e.astroName, count: 0, gross: 0, commission: 0, net: 0 };
      g.count += 1;
      g.gross += e.gross;
      g.commission += e.commission;
      g.net += e.net;
      m.set(e.astroId, g);
    }
    const q = astroQuery.trim().toLowerCase();
    return [...m.values()].filter((g) => !q || g.astroId.toLowerCase().includes(q) || g.astroName.toLowerCase().includes(q)).sort((a, b) => b.commission - a.commission || a.astroId.localeCompare(b.astroId));
  }, [earnings, astroQuery]);
  const astros = usePaged(byAstro, 10, JSON.stringify(f) + astroQuery);

  const typeCols = [
    { header: 'Service', value: (g) => g.key, width: 16 },
    { header: 'Services', value: (g) => g.count, width: 10 },
    { header: 'Amount Paid (after refunds)', value: (g) => g.net, width: 18 },
    { header: 'Platform Commission', value: (g) => (g.commissionUnknown === g.count ? NOT_FINALISED : g.commission), width: 16 },
    { header: 'Astrologer Net', value: (g) => (g.commissionUnknown === g.count ? NOT_FINALISED : g.astroNet), width: 14 },
  ];
  const astroCols = [
    { header: 'Astrologer', value: (g) => `${g.astroName} (${g.astroId})`, width: 30 },
    { header: 'Services (confirmed rates)', value: (g) => g.count, width: 14 },
    { header: 'Gross', value: (g) => g.gross, width: 14 },
    { header: 'Platform Commission', value: (g) => g.commission, width: 16 },
    { header: 'Astrologer Net', value: (g) => g.net, width: 14 },
  ];

  return (
    <div className="users services">
      <FinanceHead title="Platform Commission" subtitle="Commission on paid services at the approved rates, calculated on the amount the user paid after any offer discount." />
      {state.status === 'loading' && <LoadingState label="Calculating platform commission" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <>
          <Section id="pc-rates" title="Commission Rates" description="Rates are controlled by Super Admin in Commission Settings. Old transactions keep their historical commission.">
            <DataTable
              caption="Approved commission rates"
              rows={COMMISSION_RULES}
              rowKey={(r) => r.service}
              columns={[
                { key: 's', header: 'Service', primary: true, render: (r) => r.service },
                { key: 'r', header: 'Rate', render: (r) => (r.rate === null && !r.free ? <span className="p-muted">{NOT_FINALISED}</span> : rateText(r)) },
                { key: 'src', header: 'Source', render: (r) => <span className="p-small">{r.source}</span> },
              ]}
            />
          </Section>
          <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
            <SelectFilter label="Service Type" value={f.type} onChange={(v) => set({ type: v })} options={[['all', 'All services'], ...SERVICE_TYPES]} />
            <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
            <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
          </FilterBar>
          <Section
            id="pc-type"
            title="Commission by Service"
            description={`Total ${money(split.total)} from ${formatNumber(split.count)} services · completed ${money(split.completed)} · services not yet completed (Held) ${money(split.held)}.`}
            actions={<ExportPair title="Platform Commission by Service" columns={typeCols} rows={byType} fileBase="astroconnect-platform-commission" notify={notify} />}
          >
            <DataTable
              caption="Commission by service"
              rows={byType}
              rowKey={(g) => g.key}
              empty={<Empty title="No services in this period" />}
              columns={[
                { key: 'k', header: 'Service', primary: true, render: (g) => g.key },
                { key: 'c', header: 'Services', className: 'is-num', render: (g) => formatNumber(g.count) },
                { key: 'n', header: 'Amount Paid (after refunds)', className: 'is-num', render: (g) => money(g.net) },
                { key: 'cm', header: 'Platform Commission', className: 'is-num', render: (g) => (g.commissionUnknown === g.count ? <span className="p-muted">{NOT_FINALISED}</span> : money(g.commission)) },
                { key: 'an', header: 'Astrologer Net', className: 'is-num', render: (g) => (g.commissionUnknown === g.count ? <span className="p-muted">{NOT_FINALISED}</span> : money(g.astroNet)) },
              ]}
            />
            <p className="p-small p-muted">Refunded appointments (cancelled by the astrologer) earn no commission. Text Question and Subscription commission is not finalised (PP-09).</p>
          </Section>
          <div className="p-grid-2">
            <Section id="pc-month" title="Commission by Month">
              <DataTable
                caption="Commission by month"
                rows={months.rows}
                rowKey={(g) => g.key}
                empty={<Empty title="No services in this period" />}
                columns={[
                  { key: 'm', header: 'Month', primary: true, render: (g) => monthLabel(g.key) },
                  { key: 'cm', header: 'Commission', className: 'is-num', render: (g) => money(g.commission) },
                  { key: 'u', header: 'Not finalised', className: 'is-num', render: (g) => formatNumber(g.commissionUnknown) },
                ]}
              />
              {months.pager('months')}
            </Section>
            <Section id="pc-astro" title="Commission by Astrologer" actions={<ExportPair title="Platform Commission by Astrologer" columns={astroCols} rows={byAstro} fileBase="astroconnect-commission-by-astrologer" notify={notify} />}>
              <FilterBar>
                <SearchFilter label="Search astrologer" value={astroQuery} onChange={setAstroQuery} placeholder="Astrologer name or ID" />
              </FilterBar>
              <DataTable
                caption="Commission by astrologer"
                rows={astros.rows}
                rowKey={(g) => g.astroId}
                empty={<Empty title="No matching astrologers" />}
                columns={[
                  { key: 'a', header: 'Astrologer', primary: true, render: (g) => <AstroLink id={g.astroId} name={g.astroName} tab="wallet" /> },
                  { key: 'c', header: 'Services', className: 'is-num', render: (g) => formatNumber(g.count) },
                  { key: 'cm', header: 'Commission', className: 'is-num', render: (g) => money(g.commission) },
                ]}
              />
              {astros.pager('astrologers')}
            </Section>
          </div>
        </>
      )}
      {toastNode}
    </div>
  );
}
