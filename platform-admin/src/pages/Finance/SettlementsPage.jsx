import { useMemo, useState } from 'react';
import { loadAstroFinanceIndex } from '../../data/astroFinanceIndex.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, SubHeading, ViewButton, dt, money, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, NOT_FINALISED, useToast } from '../Services/components/ServiceBits.jsx';
import { FinanceHead, inRange, iso, useLoaded } from './components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const EMPTY = { query: '', day: 'all', from: '', to: '' };
const SORTS = [
  ['at:desc', 'Newest first'],
  ['at:asc', 'Oldest first'],
  ['net:desc', 'Net (highest)'],
  ['net:asc', 'Net (lowest)'],
];
const DAY_NAME = (ms) => new Date(ms).toLocaleDateString('en-IN', { weekday: 'long' });

// Finance → Settlements. Astrologer settlement runs (Tuesday and Friday,
// AD-126) from the same wallet records as the Astrologer Profile: released
// Appointment earnings, 3 days after completion. Text Question and Instant
// Call / Chat release are not finalised (PP-09, PP-10). User Settlement is
// shown separately and is not defined yet (PP-12).
export default function SettlementsPage() {
  const state = useLoaded(loadAstroFinanceIndex);
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState('at:desc');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));
  const all = state.data?.settlements ?? [];
  const earnings = state.data?.earnings ?? [];

  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = all.filter(
      (r) =>
        (f.day === 'all' || DAY_NAME(r.at) === f.day) &&
        inRange(r.at, f.from, f.to) &&
        (!q || r.id.toLowerCase().includes(q) || r.astroId.toLowerCase().includes(q) || r.astroName.toLowerCase().includes(q) || r.services.some((s) => s.toLowerCase() === q))
    );
    const [k, dir] = sort.split(':');
    return list.sort((a, b) => (dir === 'asc' ? a[k] - b[k] : b[k] - a[k]) || a.id.localeCompare(b.id));
  }, [all, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);
  const summary = useMemo(() => {
    const awaiting = earnings.filter((e) => e.status === 'Awaiting release');
    const next = awaiting.length ? Math.min(...awaiting.map((e) => e.releaseAt)) : null;
    return {
      net: rows.reduce((t, r) => t + r.net, 0),
      awaiting: awaiting.length,
      awaitingNet: awaiting.reduce((t, e) => t + e.net, 0),
      next,
    };
  }, [rows, earnings]);

  const columns = [
    { header: 'Settlement ID', value: (r) => r.id, width: 16 },
    { header: 'Astrologer', value: (r) => `${r.astroName} (${r.astroId})`, width: 28 },
    { header: 'Settlement Run', value: (r) => `${DAY_NAME(r.at)} ${dt(iso(r.at))}`, width: 26 },
    { header: 'Services', value: (r) => r.count, width: 9 },
    { header: 'Gross', value: (r) => r.gross, width: 12 },
    { header: 'Commission', value: (r) => r.commission, width: 12 },
    { header: 'Net Released', value: (r) => r.net, width: 13 },
    { header: 'Status', value: (r) => r.status, width: 10 },
    { header: 'Wallet Transaction', value: (r) => r.walletTx ?? '', width: 16 },
    { header: 'Service IDs', value: (r) => r.services.join(', '), width: 40 },
  ];

  return (
    <div className="users services">
      <FinanceHead title="Settlements" subtitle="Astrologer earnings released to the Available Balance in the Tuesday and Friday settlement runs, after each service’s eligibility period." />
      {state.status === 'loading' && <LoadingState label="Loading settlements" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <>
          <Section
            id="st-list"
            title="Astrologer Settlements"
            description={`Released ${money(summary.net)} in ${formatNumber(rows.length)} runs shown · ${formatNumber(summary.awaiting)} appointment earnings (${money(summary.awaitingNet)}) awaiting release${summary.next ? `, next on ${dt(iso(summary.next))}` : ''}. Eligibility: Appointments 3 days after completion; Text Questions 7 days (commission not finalised); Instant Call / Chat ${NOT_FINALISED.toLowerCase()}.`}
            actions={<ExportPair title="Astrologer Settlements" columns={columns} rows={rows} fileBase="astroconnect-settlements" notify={notify} />}
          >
            <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
              <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Settlement ID, Astrologer or Service ID" />
              <SelectFilter label="Run Day" value={f.day} onChange={(v) => set({ day: v })} options={[['all', 'Tuesday and Friday'], 'Tuesday', 'Friday']} />
              <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
              <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
              <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
            </FilterBar>
            <p className="p-small p-muted">{formatNumber(rows.length)} settlements match.</p>
            <DataTable
              caption="Astrologer settlements"
              rows={paged.rows}
              onRowClick={setOpen}
              empty={<Empty icon="finance" title="No matching settlements" text="Change or clear the filters." />}
              columns={[
                { key: 'id', header: 'Settlement ID', primary: true, render: (r) => <span className="p-mono">{r.id}</span> },
                { key: 'a', header: 'Astrologer', render: (r) => <AstroLink id={r.astroId} name={r.astroName} tab="wallet" /> },
                { key: 'd', header: 'Settlement Run', render: (r) => <span className="p-desc"><span>{dt(iso(r.at))}</span><span className="p-small">{DAY_NAME(r.at)}</span></span> },
                { key: 'c', header: 'Services', className: 'is-num', render: (r) => r.count },
                { key: 'g', header: 'Gross', className: 'is-num', render: (r) => money(r.gross) },
                { key: 'cm', header: 'Commission', className: 'is-num', render: (r) => money(r.commission) },
                { key: 'n', header: 'Net Released', className: 'is-num', render: (r) => <span className="p-credit">{money(r.net)}</span> },
                { key: 'v', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
              ]}
            />
            {paged.pager('settlements')}
          </Section>
          <Section id="st-user" title="User Settlement" description="Shown separately from Astrologer Settlement.">
            <p className="p-small">What “User Settlement” contains is {NOT_FINALISED.toLowerCase()} (PP-12). No records are shown.</p>
          </Section>
        </>
      )}
      {open && <SettlementDetails row={open} earnings={earnings.filter((e) => e.settlementId === open.id && e.astroId === open.astroId)} onClose={() => setOpen(null)} />}
      {toastNode}
    </div>
  );
}

function SettlementDetails({ row: r, earnings, onClose }) {
  return (
    <DetailPanel title={r.id} subtitle={`Settlement · ${r.astroName} (${r.astroId})`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Status', <Pill key="s" value={r.status} />],
          ['Settlement Run', `${DAY_NAME(r.at)}, ${dt(iso(r.at))}`],
          ['Astrologer', <AstroLink key="a" id={r.astroId} name={r.astroName} tab="wallet" />],
          ['Wallet Transaction', r.walletTx ?? '—'],
          ['Services', r.count],
          ['Gross', money(r.gross)],
          ['Platform Commission', money(r.commission)],
          ['Net Released to Available Balance', money(r.net)],
        ]}
      />
      <SubHeading>Released Earnings</SubHeading>
      <DataTable
        caption="Earnings released in this settlement"
        rows={earnings}
        columns={[
          { key: 'id', header: 'Service ID', primary: true, render: (e) => <span className="p-desc"><span className="p-mono">{e.serviceId}</span><span className="p-small">{e.serviceType}</span></span> },
          { key: 'c', header: 'Completed', render: (e) => dt(iso(e.completedAt)) },
          { key: 'g', header: 'Gross', className: 'is-num', render: (e) => money(e.gross) },
          { key: 'n', header: 'Net', className: 'is-num', render: (e) => money(e.net) },
        ]}
      />
    </DetailPanel>
  );
}
