import { useState } from 'react';
import { DataTable, DetailPanel, Empty, Fields, FilterBar, Pill, Section, SelectFilter, Stats, SubHeading, Timeline, ViewButton, dt, usePaged } from '../../UserProfile/components/ui.jsx';
import ExportButtons from '../components/ExportButtons.jsx';

// Tab 9 — Content Management (§12, AD-138 – AD-144). View only; flag / hide
// and all other actions belong to the Content Management module. Text and
// Image posts only (no video).
export default function ContentTab({ profile, notify }) {
  const { content, astrologer } = profile;
  const posts = content.posts;
  const [status, setStatus] = useState('all');
  const [open, setOpen] = useState(null);
  const rows = posts.filter((p) => status === 'all' || (status === 'Hidden' ? p.hidden : p.status === status));
  const paged = usePaged(rows, 10, status);
  const predictions = usePaged(content.predictions, 7);
  const columns = [
    { header: 'Post ID', value: (p) => p.id, width: 16 },
    { header: 'Title', value: (p) => p.title, width: 34 },
    { header: 'Type', value: (p) => p.kind, width: 10 },
    { header: 'Audience', value: (p) => p.audience, width: 12 },
    { header: 'Status', value: (p) => p.status + (p.hidden ? ' (Hidden)' : ''), width: 18 },
    { header: 'Published / Scheduled', value: (p) => dt(p.publishedAt ?? p.scheduledFor ?? p.createdAt), width: 20 },
    { header: 'Likes', value: (p) => p.likes, width: 8 },
    { header: 'Comments', value: (p) => p.comments, width: 10 },
  ];
  return (
    <div className="p-stack">
      <Stats
        label="Content overview"
        items={[
          ['Total Posts', posts.length, 'gold'],
          ['Published', posts.filter((p) => p.status === 'Published').length, 'green'],
          ['Scheduled', posts.filter((p) => p.status === 'Scheduled').length],
          ['Drafts', posts.filter((p) => p.status === 'Draft').length],
          ['Hidden', posts.filter((p) => p.hidden).length],
        ]}
      />
      <Section id="ac-posts" title="Posts" description="Text and image posts. Audience: Public, Followers, Subscribers or a subscription tier." actions={<ExportButtons title="Content" astrologer={astrologer} columns={columns} rows={rows} fileBase="astrologer-content" notify={notify} label="posts" />}>
        <FilterBar canClear={status !== 'all'} onClear={() => setStatus('all')}>
          <SelectFilter label="Status" value={status} onChange={setStatus} options={[['all', 'All posts'], 'Published', 'Scheduled', 'Draft', 'Hidden']} />
        </FilterBar>
        <DataTable
          caption="Posts"
          rows={paged.rows}
          onRowClick={setOpen}
          empty={posts.length ? <Empty title="No matching posts" /> : <Empty icon="document" title="No posts yet" />}
          columns={[
            { key: 'id', header: 'Post ID', primary: true, render: (p) => <span className="p-mono">{p.id}</span> },
            { key: 'title', header: 'Title', render: (p) => p.title },
            { key: 'kind', header: 'Type', render: (p) => p.kind },
            { key: 'aud', header: 'Audience', render: (p) => p.audience },
            { key: 'status', header: 'Status', render: (p) => <span className="p-inline"><Pill value={p.status} />{p.hidden && <span className="a-hidden-tag">Hidden</span>}</span> },
            { key: 'date', header: 'Published / Scheduled', render: (p) => dt(p.publishedAt ?? p.scheduledFor ?? p.createdAt) },
            { key: 'eng', header: 'Likes / Comments', className: 'is-num', render: (p) => `${p.likes} / ${p.comments}` },
            { key: 'actions', header: 'Details', render: (p) => <ViewButton onClick={() => setOpen(p)} /> },
          ]}
        />
        {paged.pager('posts')}
      </Section>
      <Section id="ac-pred" title="Subscriber Benefit Content" description="Daily and Weekly Predictions delivered to subscribers. Missed scheduled content is recorded as Missed.">
        <DataTable
          caption="Prediction delivery history"
          rows={predictions.rows}
          empty={<Empty icon="document" title="No prediction deliveries recorded" />}
          columns={[
            { key: 'type', header: 'Content', primary: true, render: (p) => p.type },
            { key: 'for', header: 'Scheduled For', render: (p) => dt(p.for) },
            { key: 'aud', header: 'Audience', render: (p) => p.audience },
            { key: 'status', header: 'Delivery', render: (p) => <Pill value={p.status} /> },
          ]}
        />
        {predictions.pager('deliveries')}
      </Section>
      {open && (
        <DetailPanel title={open.title} subtitle={`${open.id} · ${open.kind} post`} onClose={() => setOpen(null)}>
          <Fields columns={2} items={[['Audience', open.audience], ['Status', open.status + (open.hidden ? ' · Hidden by Admin' : '')], ['Created', dt(open.createdAt)], ['Published', dt(open.publishedAt)], ['Scheduled For', dt(open.scheduledFor)], ['Likes / Comments', `${open.likes} / ${open.comments}`]]} />
          <SubHeading>Edit / Publish / Schedule History</SubHeading>
          <Timeline items={open.history} />
          <p className="p-small p-muted p-panel__foot">Moderation is handled in Content Management.</p>
        </DetailPanel>
      )}
    </div>
  );
}
