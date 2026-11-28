import { useState } from 'react';
import { DataTable, DetailPanel, Empty, Fields, FilterBar, Pill, Section, SelectFilter, Stats, SubHeading, Timeline, ViewButton, dt, usePaged } from '../../UserProfile/components/ui.jsx';
import { Rating } from '../../Astrologers/components/AstroBits.jsx';
import ExportButtons from '../components/ExportButtons.jsx';

// Tab 10 — Ratings & Reviews (§13, AD-129 – AD-132). View only; moderation is
// in the Ratings & Reviews module. The overall rating uses Published reviews.
export default function ReviewsTab({ profile, notify }) {
  const { reviews, astrologer, rating } = profile;
  const [status, setStatus] = useState('all');
  const [stars, setStars] = useState('all');
  const [open, setOpen] = useState(null);
  const rows = reviews.filter((r) => (status === 'all' || (status === 'Replied' ? r.replied : status === 'Not Replied' ? !r.replied : r.status === status)) && (stars === 'all' || r.rating === Number(stars)));
  const paged = usePaged(rows, 10, `${status}|${stars}`);
  const published = reviews.filter((r) => r.status === 'Published');
  const dist = [5, 4, 3, 2, 1].map((n) => [n, published.filter((r) => r.rating === n).length]);
  const max = Math.max(1, ...dist.map(([, c]) => c));
  const columns = [
    { header: 'Review ID', value: (r) => r.id, width: 16 },
    { header: 'User', value: (r) => `${r.user.name} (${r.user.id})`, width: 28 },
    { header: 'Service', value: (r) => `${r.serviceType} ${r.serviceId}`, width: 26 },
    { header: 'Rating', value: (r) => r.rating, width: 8 },
    { header: 'Review Date', value: (r) => dt(r.at), width: 20 },
    { header: 'Review Text', value: (r) => r.text, width: 40 },
    { header: 'Status', value: (r) => r.status, width: 18 },
    { header: 'Reply', value: (r) => r.reply, width: 40 },
  ];
  return (
    <div className="p-stack">
      <Stats
        label="Reviews overview"
        items={[
          ['Total', reviews.length, 'gold'],
          ['Published', published.length, 'green'],
          ['Pending Publication', reviews.filter((r) => r.status === 'Pending Publication').length],
          ['Hidden', reviews.filter((r) => r.status === 'Hidden').length],
          ['Replied', reviews.filter((r) => r.replied).length],
          ['Not Replied', reviews.filter((r) => !r.replied).length],
        ]}
      />
      <Section id="arv-summary" title="Average Rating and Distribution" description="Calculated from Published reviews only. Hidden reviews are not shown in the User App and remain visible to Admin.">
        <div className="a-rating-summary">
          <div className="a-rating-big">
            <Rating value={rating} count={published.length} />
          </div>
          <ul className="a-dist" aria-label="Rating distribution (published reviews)">
            {dist.map(([n, c]) => (
              <li key={n}>
                <span className="a-dist__label">{n} ★</span>
                <span className="a-dist__bar"><span style={{ width: `${(c / max) * 100}%` }} /></span>
                <span className="a-dist__count">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <Section id="arv-list" title="Reviews" actions={<ExportButtons title="Reviews" astrologer={astrologer} columns={columns} rows={rows} fileBase="astrologer-reviews" notify={notify} label="reviews" />}>
        <FilterBar canClear={status !== 'all' || stars !== 'all'} onClear={() => { setStatus('all'); setStars('all'); }}>
          <SelectFilter label="Status" value={status} onChange={setStatus} options={[['all', 'All'], 'Published', 'Pending Publication', 'Hidden', 'Replied', 'Not Replied']} />
          <SelectFilter label="Rating" value={stars} onChange={setStars} options={[['all', 'All ratings'], ['5', '5 stars'], ['4', '4 stars'], ['3', '3 stars'], ['2', '2 stars'], ['1', '1 star']]} />
        </FilterBar>
        <DataTable
          caption="Reviews"
          rows={paged.rows}
          onRowClick={setOpen}
          empty={reviews.length ? <Empty title="No matching reviews" /> : <Empty icon="activity" title="No reviews yet" />}
          columns={[
            { key: 'user', header: 'User', primary: true, render: (r) => `${r.user.name}` },
            { key: 'svc', header: 'Service', render: (r) => <span className="p-desc"><span>{r.serviceType}</span><span className="p-small">{r.serviceId}</span></span> },
            { key: 'rating', header: 'Rating', render: (r) => <span className="a-stars" aria-label={`${r.rating} stars`}>{'★'.repeat(r.rating)}<span className="a-stars__off">{'★'.repeat(5 - r.rating)}</span></span> },
            { key: 'at', header: 'Review Date', render: (r) => dt(r.at) },
            { key: 'text', header: 'Review', className: 'p-wrap', render: (r) => r.text || <span className="p-small">No written feedback</span> },
            { key: 'status', header: 'Status', render: (r) => <Pill value={r.status} /> },
            { key: 'reply', header: 'Reply', render: (r) => (r.replied ? 'Replied' : 'Not Replied') },
            { key: 'actions', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
          ]}
        />
        {paged.pager('reviews')}
      </Section>
      {open && (
        <DetailPanel title={`Review ${open.id}`} subtitle={`${open.user.name} (${open.user.id}) · ${open.serviceType} ${open.serviceId}`} onClose={() => setOpen(null)}>
          <Fields columns={2} items={[['Rating', `${open.rating} of 5`], ['Status', <Pill key="s" value={open.status} />], ['Review Date', dt(open.at)], ['Reply', open.replied ? 'Replied' : 'Not Replied'], ['Review Text', open.text || 'No written feedback', { wide: true }]]} />
          <SubHeading>Reply History</SubHeading>
          <Timeline items={open.replyHistory.map((h) => ({ at: h.at, text: `${h.action}: “${h.text}”` }))} />
          <p className="p-small p-muted p-panel__foot">Moderation is handled in the Ratings &amp; Reviews module.</p>
        </DetailPanel>
      )}
    </div>
  );
}
