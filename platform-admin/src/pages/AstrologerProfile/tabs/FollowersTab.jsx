import { href } from '../../../router/useHashRoute.js';
import { userProfilePath } from '../../../router/navigation.js';
import { Avatar, StatusBadge } from '../../Users/components/UserBits.jsx';
import { DataTable, Empty, Pill, Section, Stats, dt, usePaged } from '../../UserProfile/components/ui.jsx';
import ExportButtons from '../components/ExportButtons.jsx';

// Tab 5 — Followers (§8). Current followers only; unfollowed users appear in
// Follow History. View only.
export default function FollowersTab({ profile, notify }) {
  const { followers, followHistory, subscriptions, astrologer, todayStart, monthStart } = profile;
  const active = new Map(subscriptions.filter((s) => s.status === 'Active').map((s) => [s.user.id, s.plan]));
  const rows = followers.map((f) => ({ ...f, subscription: active.has(f.user.id) ? `Active · ${active.get(f.user.id)}` : 'Not subscribed' }));
  const paged = usePaged(rows, 10);
  const history = usePaged(followHistory, 10);
  const newSince = (ts) => followers.filter((f) => new Date(f.followedAt).getTime() >= ts).length;

  const columns = [
    { header: 'Name', value: (f) => f.user.name, width: 24 },
    { header: 'User ID', value: (f) => f.user.id, width: 14 },
    { header: 'Follow Date / Time', value: (f) => dt(f.followedAt), width: 20 },
    { header: 'Subscription Status', value: (f) => f.subscription, width: 18 },
    { header: 'Account Status', value: (f) => f.user.status, width: 14 },
  ];

  return (
    <div className="p-stack">
      <Stats
        label="Followers overview"
        items={[
          ['Total Followers', followers.length, 'gold'],
          ['New Today', newSince(todayStart)],
          ['New This Month', newSince(monthStart)],
          ['Unfollowed', followHistory.filter((e) => e.action === 'Unfollowed').length],
        ]}
      />
      <Section id="af-current" title="Current Followers" description="Following is free and is separate from paid subscriptions." actions={<ExportButtons title="Followers" astrologer={astrologer} columns={columns} rows={rows} fileBase="astrologer-followers" notify={notify} label="followers" />}>
        <DataTable
          caption="Current followers"
          rows={paged.rows}
          rowKey={(f) => f.user.id}
          empty={<Empty icon="people" title="No followers yet" />}
          columns={[
            { key: 'photo', header: 'Photo', render: (f) => <Avatar user={f.user} size={32} /> },
            { key: 'name', header: 'Name', primary: true, render: (f) => <span className="p-strong">{f.user.name}</span> },
            { key: 'id', header: 'User ID', render: (f) => <span className="p-mono">{f.user.id}</span> },
            { key: 'at', header: 'Follow Date / Time', render: (f) => dt(f.followedAt) },
            { key: 'sub', header: 'Subscription Status', render: (f) => f.subscription },
            { key: 'status', header: 'Account Status', render: (f) => <StatusBadge status={f.user.status} /> },
            { key: 'actions', header: 'User Profile', render: (f) => <a className="p-view" href={href(userProfilePath(f.user.id))}>View User Profile</a> },
          ]}
        />
        {paged.pager('followers')}
      </Section>
      <Section id="af-history" title="Follow History" description="Includes users who later unfollowed.">
        <DataTable
          caption="Follow history"
          rows={history.rows}
          rowKey={(e) => `${e.at}-${e.user.id}-${e.action}`}
          empty={<Empty icon="activity" title="No follow history" />}
          columns={[
            { key: 'at', header: 'Date / Time', primary: true, render: (e) => dt(e.at) },
            { key: 'action', header: 'Action', render: (e) => <Pill value={e.action} /> },
            { key: 'user', header: 'User', render: (e) => `${e.user.name} (${e.user.id})` },
            { key: 'note', header: 'Note', render: (e) => e.note || '—' },
          ]}
        />
        {history.pager('events')}
      </Section>
    </div>
  );
}
