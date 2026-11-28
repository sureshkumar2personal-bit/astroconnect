import { useMemo, useState } from 'react';
import { loadAstroFinanceIndex } from '../../data/astroFinanceIndex.js';
import { getAstrologerProfile } from '../../data/astrologersStore.js';
import { moderationIndex } from '../../data/moderationStore.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, SubHeading, Timeline, ViewButton, dt, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, PageHead, useToast } from '../Services/components/ServiceBits.jsx';
import { inRange, iso, useLoaded } from '../Finance/components/FinanceBits.jsx';
import ModerationPanel from './components/ModerationPanel.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const STATUSES = ['Published', 'Scheduled', 'Draft'];
const SORTS = [
  ['createdAt:desc', 'Newest first'],
  ['createdAt:asc', 'Oldest first'],
  ['likes:desc', 'Most liked'],
];
const EMPTY = { query: '', status: 'all', kind: 'all', audience: 'all', from: '', to: '' };

// Operations → Content Management (09-content-management.md). Text and Image
// posts only (no video); Publish Now · Schedule · Draft; Daily and Weekly
// Predictions for subscribers. The same records as the Astrologer Profile →
// Content Management tab. Admin: View · Flag · Review · Hide.
export default function ContentManagementPage({ session }) {
  const state = useLoaded(loadAstroFinanceIndex);
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState('createdAt:desc');
  const [open, setOpen] = useState(null);
  const [tick, setTick] = useState(0);
  const [predType, setPredType] = useState('all');
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));

  const all = useMemo(() => {
    const mod = moderationIndex('post');
    return (state.data?.posts ?? []).map((p) => (mod.get(p.id)?.some((m) => m.action === 'Hidden') ? { ...p, hidden: true } : p));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data, tick]);
  const audiences = useMemo(() => [...new Set(all.map((p) => p.audience))].sort(), [all]);
  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = all.filter(
      (p) =>
        (f.status === 'all' || (f.status === 'Hidden' ? p.hidden : p.status === f.status)) &&
        (f.kind === 'all' || p.kind === f.kind) &&
        (f.audience === 'all' || p.audience === f.audience) &&
        inRange(p.createdAt, f.from, f.to) &&
        (!q || [p.id, p.astroId, p.astroName, p.title].some((v) => v.toLowerCase().includes(q)))
    );
    const [k, dir] = sort.split(':');
    return list.sort((a, b) => (dir === 'asc' ? a[k] - b[k] : b[k] - a[k]) || a.id.localeCompare(b.id));
  }, [all, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);
  const counts = useMemo(() => ({ total: rows.length, hidden: rows.filter((p) => p.hidden).length, ...Object.fromEntries(STATUSES.map((s) => [s, rows.filter((p) => p.status === s).length])) }), [rows]);

  const preds = useMemo(() => {
    const m = new Map();
    for (const p of state.data?.predictions ?? []) {
      if (predType !== 'all' && p.type !== predType) continue;
      const g = m.get(p.astroId) ?? { astroId: p.astroId, astroName: p.astroName, Delivered: 0, Missed: 0, Pending: 0 };
      g[p.status] += 1;
      m.set(p.astroId, g);
    }
    return [...m.values()].sort((a, b) => b.Missed - a.Missed || a.astroId.localeCompare(b.astroId));
  }, [state.data, predType]);
  const predPaged = usePaged(preds, 10, predType);
  const predTotals = useMemo(() => preds.reduce((t, g) => ({ Delivered: t.Delivered + g.Delivered, Missed: t.Missed + g.Missed, Pending: t.Pending + g.Pending }), { Delivered: 0, Missed: 0, Pending: 0 }), [preds]);

  const columns = [
    { header: 'Post ID', value: (p) => p.id, width: 14 },
    { header: 'Title', value: (p) => p.title, width: 30 },
    { header: 'Astrologer', value: (p) => `${p.astroName} (${p.astroId})`, width: 26 },
    { header: 'Type', value: (p) => p.kind, width: 8 },
    { header: 'Audience', value: (p) => p.audience, width: 12 },
    { header: 'Status', value: (p) => p.status + (p.hidden ? ' (Hidden)' : ''), width: 18 },
    { header: 'Created', value: (p) => dt(iso(p.createdAt)), width: 20 },
    { header: 'Published / Scheduled', value: (p) => dt(iso(p.publishedAt ?? p.scheduledFor)) || '', width: 20 },
    { header: 'Likes', value: (p) => p.likes, width: 8 },
    { header: 'Comments', value: (p) => p.comments, width: 10 },
  ];

  return (
    <div className="users services">
      <PageHead section="Operations" title="Content Management" subtitle="Astrologer text and image posts, and subscriber Daily and Weekly Predictions. Admin may view, flag, review and hide inappropriate content." />
      {state.status === 'loading' && <LoadingState label="Loading content" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <>
          <Section
            id="cm-list"
            title="Posts"
            description={`Total Posts ${formatNumber(counts.total)} · Published ${formatNumber(counts.Published)} · Scheduled ${formatNumber(counts.Scheduled)} · Drafts ${formatNumber(counts.Draft)} · Hidden ${formatNumber(counts.hidden)}`}
            actions={<ExportPair title="Content Management — Posts" columns={columns} rows={rows} fileBase="astroconnect-content-posts" notify={notify} />}
          >
            <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
              <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Post ID, title or Astrologer" />
              <SelectFilter label="Status" value={f.status} onChange={(v) => set({ status: v })} options={[['all', 'All posts'], ...STATUSES, 'Hidden']} />
              <SelectFilter label="Post Type" value={f.kind} onChange={(v) => set({ kind: v })} options={[['all', 'Text and Image'], 'Text', 'Image']} />
              <SelectFilter label="Audience" value={f.audience} onChange={(v) => set({ audience: v })} options={[['all', 'All audiences'], ...audiences]} />
              <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
              <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
              <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
            </FilterBar>
            <p className="p-small p-muted">{formatNumber(rows.length)} posts match.</p>
            <DataTable
              caption="Astrologer posts"
              rows={paged.rows}
              onRowClick={setOpen}
              empty={<Empty icon="search" title="No matching posts" text="Change or clear the filters." />}
              columns={[
                { key: 'id', header: 'Post', primary: true, render: (p) => <span className="p-desc"><span>{p.title}</span><span className="p-small p-mono">{p.id}</span></span> },
                { key: 'a', header: 'Astrologer', render: (p) => <AstroLink id={p.astroId} name={p.astroName} tab="content" /> },
                { key: 'k', header: 'Type / Audience', render: (p) => <span className="p-desc"><span>{p.kind}</span><span className="p-small">{p.audience}</span></span> },
                { key: 's', header: 'Status', render: (p) => <span className="p-desc"><Pill value={p.status} />{p.hidden && <span className="p-small">Hidden</span>}</span> },
                { key: 'e', header: 'Engagement', render: (p) => (p.status === 'Published' ? `${formatNumber(p.likes)} likes · ${formatNumber(p.comments)} comments` : '—') },
                { key: 'd', header: 'Created', render: (p) => dt(iso(p.createdAt)) },
                { key: 'v', header: 'Details', render: (p) => <ViewButton onClick={() => setOpen(p)} /> },
              ]}
            />
            {paged.pager('posts')}
          </Section>
          <Section id="cm-pred" title="Subscriber Predictions" description={`Last 14 days · Delivered ${formatNumber(predTotals.Delivered)} · Missed ${formatNumber(predTotals.Missed)} · Pending ${formatNumber(predTotals.Pending)}`}>
            <FilterBar>
              <SelectFilter label="Prediction Type" value={predType} onChange={setPredType} options={[['all', 'Daily and Weekly'], 'Daily Predictions', 'Weekly Predictions']} />
            </FilterBar>
            <DataTable
              caption="Subscriber predictions by astrologer"
              rows={predPaged.rows}
              rowKey={(g) => g.astroId}
              empty={<Empty title="No predictions" />}
              columns={[
                { key: 'a', header: 'Astrologer', primary: true, render: (g) => <AstroLink id={g.astroId} name={g.astroName} tab="content" /> },
                { key: 'd', header: 'Delivered', className: 'is-num', render: (g) => g.Delivered },
                { key: 'm', header: 'Missed', className: 'is-num', render: (g) => g.Missed },
                { key: 'p', header: 'Pending', className: 'is-num', render: (g) => g.Pending },
              ]}
            />
            {predPaged.pager('astrologers')}
          </Section>
        </>
      )}
      {open && (
        <PostDetails
          key={`${open.id}:${tick}`}
          row={open}
          session={session}
          onChanged={(entry) => {
            setTick((t) => t + 1);
            notify('success', `${open.id}: ${entry.action === 'Hidden' ? 'hidden from the User App' : entry.action.toLowerCase()}. Logged with reason.`);
          }}
          onClose={() => setOpen(null)}
        />
      )}
      {toastNode}
    </div>
  );
}

function PostDetails({ row, session, onChanged, onClose }) {
  const post = useMemo(() => getAstrologerProfile(row.astroId)?.content.posts.find((p) => p.id === row.id) ?? null, [row]);
  if (!post) {
    return (
      <DetailPanel title={row.id} subtitle="Post" onClose={onClose}>
        <p className="p-muted">This post could not be loaded.</p>
      </DetailPanel>
    );
  }
  return (
    <DetailPanel title={post.id} subtitle={`${post.kind} post · ${row.astroName} (${row.astroId})`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Title', post.title, { wide: true }],
          ['Status', <Pill key="s" value={post.status} />],
          ['Visibility', post.hidden ? 'Hidden from the User App' : 'Visible'],
          ['Astrologer', <AstroLink key="a" id={row.astroId} name={row.astroName} tab="content" />],
          ['Post Type', post.kind],
          ['Audience', post.audience],
          ['Created', dt(post.createdAt)],
          ['Published', post.publishedAt ? dt(post.publishedAt) : '—'],
          ['Scheduled For', post.scheduledFor ? dt(post.scheduledFor) : '—'],
          ['Likes', formatNumber(post.likes)],
          ['Comments', formatNumber(post.comments)],
        ]}
      />
      <ModerationPanel kind="post" targetId={post.id} hidden={post.hidden} log={post.moderationLog ?? []} session={session} onDone={onChanged} />
      <SubHeading>Content History</SubHeading>
      <Timeline items={post.history} />
    </DetailPanel>
  );
}
