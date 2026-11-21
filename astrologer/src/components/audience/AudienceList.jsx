import { FILTERS, SORTS } from '@/data/mockAudience.js';
import { audienceActions, visibleUsers } from '@/hooks/useAudience.js';
import { Empty, Grid, Seg } from '@/components/ui/sectionKit.jsx';
import CustomerCard from './CustomerCard.jsx';

// The one Audience list (AD-135): All Users / Followers / Subscribers, search, sort and the
// "Since" date filter (AD-137). Filter state lives in the store, so Back keeps it (AD-77).
export default function AudienceList({ s }) {
  const f = s.filters;
  const set = audienceActions.setFilter;
  const users = visibleUsers(s.list, f);

  return (
    <>
      <div className="row wrap au-filters">
        <Seg label="Audience filter" options={FILTERS} value={f.f} onChange={(v) => set('f', v)} />
        <label className="search">
          <span className="sr">Search</span>
          <input type="search" placeholder="Search name or User ID" value={f.q} onChange={(e) => set('q', e.target.value)} />
        </label>
        <label className="au-ctl">
          <span>Sort</span>
          <select value={f.sort} onChange={(e) => set('sort', e.target.value)}>
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label className="au-ctl">
          <span>Since</span>
          <input type="date" value={f.from} onChange={(e) => set('from', e.target.value)} />
        </label>
      </div>

      {users.length ? (
        <Grid>{users.map((u) => <CustomerCard key={u.uid} u={u} />)}</Grid>
      ) : (
        <Empty title="No customers for this filter" />
      )}

      <p className="muted sm">Follow is free and never subscribes; subscribing is paid and also follows. Counts here are sample data.</p>
    </>
  );
}
