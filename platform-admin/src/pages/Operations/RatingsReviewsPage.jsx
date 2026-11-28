import { useMemo, useState } from 'react';
import { loadServiceIndex, reviewDetails } from '../../data/serviceIndex.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, SubHeading, Timeline, ViewButton, dt, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, NOT_FINALISED, PageHead, UnavailableAction, UserLink, useToast } from '../Services/components/ServiceBits.jsx';
import { inRange, iso, useLoaded } from '../Finance/components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const TYPES = ['Text Question', 'Appointment', 'Instant Call', 'Instant Chat'];
const STATUSES = ['Published', 'Pending Publication', 'Hidden'];
const SORTS = [
  ['at:desc', 'Newest first'],
  ['at:asc', 'Oldest first'],
  ['rating:desc', 'Rating (highest)'],
  ['rating:asc', 'Rating (lowest)'],
];
const EMPTY = { query: '', rating: 'all', type: 'all', status: 'all', reply: 'all', from: '', to: '' };
const stars = (n) => `${'★'.repeat(n)}${'☆'.repeat(5 - n)}`;
// AD-133 Admin permissions are approved, but their steps (reasons, astrologer
// notification, effect on the published rating) are not documented.
const ADMIN_ACTIONS = ['Publish / Hide Review', 'Remove Review (policy violation)', 'Hide / Remove Reply', 'Flag and Investigate'];

// Operations → Ratings & Reviews (10-ratings-reviews.md). The same review
// records as the Astrologer Profile → Ratings & Reviews tab (reviewsMock.reviewFor).
// AD-132: the overall rating uses Published reviews only.
export default function RatingsReviewsPage() {
  const state = useLoaded(loadServiceIndex);
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState('at:desc');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));
  const all = state.data?.reviews ?? [];

  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = all.filter(
      (r) =>
        (f.rating === 'all' || r.rating === Number(f.rating)) &&
        (f.type === 'all' || r.serviceType === f.type) &&
        (f.status === 'all' || r.status === f.status) &&
        (f.reply === 'all' || (f.reply === 'Replied') === r.replied) &&
        inRange(r.at, f.from, f.to) &&
        (!q || [r.id, r.userId, r.userName, r.astroId, r.astroName, r.serviceId].some((v) => v.toLowerCase().includes(q)))
    );
    const [k, dir] = sort.split(':');
    return list.sort((a, b) => (dir === 'asc' ? a[k] - b[k] : b[k] - a[k]) || a.id.localeCompare(b.id));
  }, [all, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);

  // Overview (§2) for the filtered reviews.
  const overview = useMemo(() => {
    const published = rows.filter((r) => r.status === 'Published');
    const by = (st) => rows.filter((r) => r.status === st).length;
    return {
      total: rows.length,
      published: published.length,
      pending: by('Pending Publication'),
      hidden: by('Hidden'),
      replied: rows.filter((r) => r.replied).length,
      average: published.length ? Math.round((published.reduce((t, r) => t + r.rating, 0) / published.length) * 10) / 10 : null,
      distribution: [5, 4, 3, 2, 1].map((n) => [n, published.filter((r) => r.rating === n).length]),
    };
  }, [rows]);

  const columns = [
    { header: 'Review ID', value: (r) => r.id, width: 18 },
    { header: 'User', value: (r) => `${r.userName} (${r.userId})`, width: 26 },
    { header: 'Astrologer', value: (r) => `${r.astroName} (${r.astroId})`, width: 26 },
    { header: 'Service Type', value: (r) => r.serviceType, width: 14 },
    { header: 'Service ID', value: (r) => r.serviceId, width: 16 },
    { header: 'Rating', value: (r) => r.rating, width: 8 },
    { header: 'Review Text', value: (r) => r.text, width: 40 },
    { header: 'Review Date', value: (r) => dt(iso(r.at)), width: 20 },
    { header: 'Status', value: (r) => r.status, width: 18 },
    { header: 'Reply', value: (r) => (r.replied ? 'Replied' : 'Not Replied'), width: 12 },
  ];

  return (
    <div className="users services">
      <PageHead section="Operations" title="Ratings & Reviews" subtitle="Reviews after Text Questions, Appointments, Instant Calls and Instant Chats. The overall rating uses Published reviews only." />
      {state.status === 'loading' && <LoadingState label="Loading reviews" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <Section
          id="rr-list"
          title="Reviews"
          description={`Total ${formatNumber(overview.total)} · Published ${formatNumber(overview.published)} · Pending Publication ${formatNumber(overview.pending)} · Hidden ${formatNumber(overview.hidden)} · Replied ${formatNumber(overview.replied)} · Not Replied ${formatNumber(overview.total - overview.replied)} · Average Rating ${overview.average ?? '—'} (Published)`}
          actions={<ExportPair title="Ratings & Reviews" columns={columns} rows={rows} fileBase="astroconnect-reviews" notify={notify} />}
        >
          <p className="p-small" aria-label="Rating distribution of Published reviews">
            Rating distribution (Published): {overview.distribution.map(([n, c]) => `${n}★ ${formatNumber(c)}`).join(' · ')}
          </p>
          <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
            <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Review ID, User, Astrologer or Service ID" />
            <SelectFilter label="Rating" value={f.rating} onChange={(v) => set({ rating: v })} options={[['all', 'All ratings'], ...[5, 4, 3, 2, 1].map((n) => [String(n), `${n} star${n === 1 ? '' : 's'}`])]} />
            <SelectFilter label="Service Type" value={f.type} onChange={(v) => set({ type: v })} options={[['all', 'All services'], ...TYPES]} />
            <SelectFilter label="Status" value={f.status} onChange={(v) => set({ status: v })} options={[['all', 'All statuses'], ...STATUSES]} />
            <SelectFilter label="Reply" value={f.reply} onChange={(v) => set({ reply: v })} options={[['all', 'Replied and Not Replied'], 'Replied', 'Not Replied']} />
            <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
            <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
            <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
          </FilterBar>
          <p className="p-small p-muted">{formatNumber(rows.length)} reviews match.</p>
          <DataTable
            caption="Reviews"
            rows={paged.rows}
            onRowClick={setOpen}
            empty={<Empty icon="search" title="No matching reviews" text="Change or clear the filters." />}
            columns={[
              { key: 'id', header: 'Review ID', primary: true, render: (r) => <span className="p-mono">{r.id}</span> },
              { key: 'u', header: 'User', render: (r) => <UserLink id={r.userId} name={r.userName} /> },
              { key: 'a', header: 'Astrologer', render: (r) => <AstroLink id={r.astroId} name={r.astroName} tab="reviews" /> },
              { key: 's', header: 'Service', render: (r) => <span className="p-desc"><span className="p-mono">{r.serviceId}</span><span className="p-small">{r.serviceType}</span></span> },
              { key: 'r', header: 'Rating', render: (r) => <span aria-label={`${r.rating} out of 5`}>{stars(r.rating)}</span> },
              { key: 't', header: 'Review', className: 'p-wrap', render: (r) => r.text || <span className="p-muted">No written feedback</span> },
              { key: 'st', header: 'Status', render: (r) => <span className="p-desc"><Pill value={r.status} /><span className="p-small">{r.replied ? 'Replied' : 'Not Replied'}</span></span> },
              { key: 'd', header: 'Date', render: (r) => dt(iso(r.at)) },
              { key: 'v', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
            ]}
          />
          {paged.pager('reviews')}
        </Section>
      )}
      {open && <ReviewDetails row={open} onClose={() => setOpen(null)} />}
      {toastNode}
    </div>
  );
}

function ReviewDetails({ row, onClose }) {
  const details = useMemo(() => reviewDetails(row.userId, row.serviceId), [row]);
  const rv = details?.review;
  if (!rv) {
    return (
      <DetailPanel title={row.id} subtitle="Review" onClose={onClose}>
        <p className="p-muted">This review could not be loaded.</p>
      </DetailPanel>
    );
  }
  const { user, service: s } = details;
  return (
    <DetailPanel title={rv.id} subtitle={`${s.type} review · ${row.astroName} (${row.astroId})`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Rating', <span key="r" aria-label={`${rv.rating} out of 5`}>{stars(rv.rating)} ({rv.rating} / 5)</span>],
          ['Status', <Pill key="s" value={rv.status} />],
          ['Review Date', dt(rv.at)],
          ['Counts Toward Rating', rv.status === 'Published' ? 'Yes (Published)' : 'No — only Published reviews count'],
          ['User', <UserLink key="u" id={user.id} name={user.name} />],
          ['Astrologer', <AstroLink key="a" id={row.astroId} name={row.astroName} tab="reviews" />],
          ['Service Type', s.type],
          ['Service ID', s.id],
          ['Review Text', rv.text || 'No written feedback', { wide: true }],
        ]}
      />
      <SubHeading>Astrologer Reply</SubHeading>
      <p className={rv.reply ? '' : 'p-muted'}>{rv.reply || 'Not Replied'}</p>
      <Timeline items={rv.replyHistory.map((h) => ({ at: h.at, text: `${h.action}: ${h.text}` }))} />
      <SubHeading>Admin Actions</SubHeading>
      {ADMIN_ACTIONS.map((label) => (
        <UnavailableAction key={label} label={label} reason={`${NOT_FINALISED}: steps, reasons and astrologer notification (AD-133) are not documented.`} />
      ))}
    </DetailPanel>
  );
}
