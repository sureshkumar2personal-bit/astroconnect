import { Avatar } from '../../Users/components/UserBits.jsx';
import { DataTable, Empty, Pill, Section, Stats, dt, usePaged } from '../components/ui.jsx';

// Tab 4 — Following (§7). Current follows only; view only. Following is
// free and is not a paid subscription (D-36).
export default function FollowingTab({ profile }) {
  const { following, followEvents } = profile;
  const history = usePaged(followEvents, 10);

  return (
    <div className="p-stack">
      <Stats label="Following overview" items={[['Total Following', following.length, 'gold']]} />

      <Section id="f-current" title="Currently Following" description="Astrologers the user follows today. Following is free and is separate from paid subscriptions.">
        <DataTable
          caption="Currently followed astrologers"
          rows={following}
          rowKey={(f) => f.astrologer.id}
          empty={<Empty icon="people" title="Not following any astrologers" />}
          columns={[
            { key: 'photo', header: 'Photo', render: (f) => <Avatar user={f.astrologer} size={32} /> },
            { key: 'name', header: 'Astrologer Name', primary: true, render: (f) => <span className="p-strong">{f.astrologer.name}</span> },
            { key: 'id', header: 'Astrologer ID', render: (f) => <span className="p-mono">{f.astrologer.id}</span> },
            { key: 'at', header: 'Followed Date / Time', render: (f) => dt(f.followedAt) },
            { key: 'status', header: 'Current Status', render: (f) => <Pill value={f.astrologer.status} /> },
          ]}
        />
      </Section>

      <Section id="f-history" title="Follow / Unfollow History" description="Kept for Admin reference. Unfollowed astrologers do not appear in the current list.">
        <DataTable
          caption="Follow and unfollow history"
          rows={history.rows}
          rowKey={(e) => `${e.at}-${e.astrologer.id}-${e.action}`}
          empty={<Empty icon="activity" title="No follow history" />}
          columns={[
            { key: 'at', header: 'Date / Time', primary: true, render: (e) => dt(e.at) },
            { key: 'action', header: 'Action', render: (e) => <Pill value={e.action} /> },
            { key: 'astro', header: 'Astrologer', render: (e) => `${e.astrologer.name} (${e.astrologer.id})` },
            { key: 'note', header: 'Note', render: (e) => e.note || '—' },
          ]}
        />
        {history.pager('events')}
      </Section>
    </div>
  );
}
