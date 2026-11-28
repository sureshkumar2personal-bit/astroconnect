import { useEffect, useRef, useState } from 'react';
import { FILTERS, SORTS, SUB_FILTERS, FOLLOW_FILTERS } from '@/data/mockAudience.js';
import { audienceActions, audienceCounts, effectiveFilters, subStatus, visibleUsers, SINCE_PRESETS } from '@/hooks/useAudience.js';
import CustomerCard, { Ic, fmtD } from './CustomerCard.jsx';

const PER_PAGE = 10;
const UNIT = { all: ['user', 'users'], followers: ['follower', 'followers'], subscribers: ['subscriber', 'subscribers'] };

/** "Customer since" range: From / To dates and presets in a popover (reference "Customer since · Any time"). */
function SinceFilter({ f }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);
  const label = f.from && f.to ? `${fmtD(f.from)} – ${fmtD(f.to)}` : f.from ? `From ${fmtD(f.from)}` : f.to ? `Until ${fmtD(f.to)}` : 'Any time';
  return (
    <div className="au-since-f" ref={box}>
      <button type="button" className={`au-sel au-sel--btn${f.from || f.to ? ' is-set' : ''}`} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(!open)}>
        <Ic n="calendar" size={15} /><span className="au-sel__k">Customer since</span><b>{label}</b>
      </button>
      {open && (
        <div className="au-pop" role="dialog" aria-label="Customer since">
          <div className="au-pop__dates">
            <label><span>From</span><input type="date" value={f.from} max={f.to || undefined} onChange={(e) => audienceActions.setFilter('from', e.target.value)} /></label>
            <label><span>To</span><input type="date" value={f.to} min={f.from || undefined} onChange={(e) => audienceActions.setFilter('to', e.target.value)} /></label>
          </div>
          <div className="au-pop__presets">
            {SINCE_PRESETS.map(([l, from, to]) => <button type="button" key={l} className={`au-chip${f.from === from && f.to === to ? ' is-on' : ''}`} onClick={() => audienceActions.setFilters({ from, to })}>{l}</button>)}
          </div>
          <div className="au-pop__foot">
            <button type="button" className="au-link" onClick={() => audienceActions.setFilters({ from: '', to: '' })}>Clear dates</button>
            <button type="button" className="au-btn au-btn--p" onClick={() => setOpen(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

const Select = ({ k, label, options, value }) => (
  <label className="au-sel">
    <span className="au-sel__k">{label}</span>
    <select value={value} onChange={(e) => audienceActions.setFilter(k, e.target.value)}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
  </label>
);

// The one Audience list (AD-135): summary, All Users / Followers / Subscribers tabs, search by name or User ID,
// subscription / follow / customer-since filters, sort and pages (AD-137). Filter state lives in the store, so it is
// kept while a profile is open and when coming back (AD-77).
export default function AudienceList({ s, onView }) {
  const f = s.filters;
  const eff = effectiveFilters(f);
  const set = audienceActions.setFilter;
  const c = audienceCounts(s.list);
  const users = visibleUsers(s.list, f);
  const pages = Math.max(1, Math.ceil(users.length / PER_PAGE));
  const page = Math.min(f.page, pages);
  const rows = users.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);
  const active = (f.q.trim() ? 1 : 0) + (eff.subF !== 'all' ? 1 : 0) + (eff.followF !== 'all' ? 1 : 0) + (f.from || f.to ? 1 : 0);
  const [one, many] = UNIT[f.f];
  const subsInTab = s.list.filter((u) => subStatus(u) !== 'none');
  const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

  return (
    <div className="au-list">
      <dl className="au-stats">
        <div><dt>Total users</dt><dd>{c.total}</dd><small>All relationships</small></div>
        <div><dt>Current followers</dt><dd>{c.followers}</dd><small>{pct(c.followers, c.total)}% of all users</small></div>
        <div><dt>Active subscribers</dt><dd>{c.active}</dd><small className="au-tiers">{c.byTier.map(([t, n]) => <span key={t} className={`t-${t.toLowerCase()}`} title={`${t}: ${n}`}><Ic n="diamond" size={10} />{n}<span className="au-sr"> {t}</span></span>)}</small></div>
        <div><dt>Expired subscribers</dt><dd>{c.expired}</dd><small>{pct(c.expired, c.subscribers)}% of all subscribers</small></div>
      </dl>

      <div className="au-tabs" role="tablist" aria-label="Audience">
        {FILTERS.map(([v, l]) => (
          <button type="button" role="tab" key={v} aria-selected={f.f === v} className="au-tab" onClick={() => set('f', v)}>
            {l}<span className="au-count">{v === 'all' ? c.total : v === 'followers' ? c.followers : c.subscribers}</span>
          </button>
        ))}
      </div>

      <div className="au-tools">
        <label className="au-search">
          <Ic n="search" size={16} /><span className="au-sr">Search customers</span>
          <input type="search" placeholder="Search by name or User ID" value={f.q} onChange={(e) => set('q', e.target.value)} />
        </label>
        <button type="button" className={`au-btn au-filters-btn${active ? ' is-set' : ''}`} aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)}>
          <Ic n="filter" size={15} />Filters{active > 0 && <span className="au-count">{active}</span>}
        </button>
        <div className={`au-filters${showFilters ? ' is-open' : ''}`}>
          {f.f !== 'subscribers' && <Select k="subF" label="Subscription" options={SUB_FILTERS} value={eff.subF} />}
          {f.f !== 'followers' && <Select k="followF" label="Follow" options={FOLLOW_FILTERS} value={eff.followF} />}
          <SinceFilter f={f} />
          <Select k="sort" label="Sort" options={SORTS} value={f.sort} />
        </div>
      </div>

      {f.f === 'subscribers' && (
        <div className="au-chips" role="group" aria-label="Subscription status">
          {[['all', 'All', subsInTab.length], ['active', 'Active', c.active], ['expired', 'Expired', c.expired]].map(([v, l, n]) => (
            <button type="button" key={v} className={`au-chip${eff.subF === v ? ' is-on' : ''}`} aria-pressed={eff.subF === v} onClick={() => set('subF', v)}>{l}<span className="au-count">{n}</span></button>
          ))}
        </div>
      )}

      <div className="au-meta">
        <span>{users.length ? `Showing ${(page - 1) * PER_PAGE + 1}–${(page - 1) * PER_PAGE + rows.length} of ${users.length} ${users.length === 1 ? one : many}` : `No ${many} found`}
          {active > 0 && <> · <button type="button" className="au-link" onClick={audienceActions.resetFilters}>Clear filters</button></>}</span>
      </div>

      {rows.length ? (
        <div className="au-table">
          <div className="au-thead" aria-hidden="true"><span>Customer</span><span>Relationship</span><span>Customer since</span><span>Last activity</span><span /></div>
          <ul className="au-rows">{rows.map((u) => <CustomerCard key={u.uid} u={u} onView={onView} />)}</ul>
        </div>
      ) : (
        <div className="au-empty">
          <span className="au-empty__ic"><Ic n={f.q.trim() ? 'search' : 'users'} size={22} /></span>
          <b>{f.q.trim() ? `No results for “${f.q.trim()}”` : `No ${many} match these filters`}</b>
          <span>{f.q.trim() ? 'Check the spelling, or search by User ID — for example U-44821.' : 'Try a different filter or date range.'}</span>
          {active > 0 && <button type="button" className="au-btn" onClick={audienceActions.resetFilters}>Clear filters</button>}
        </div>
      )}

      {pages > 1 && (
        <nav className="au-pager" aria-label="Pages">
          <span>Page <b>{page}</b> of <b>{pages}</b> · {PER_PAGE} per page</span>
          <div className="au-pager__b">
            <button type="button" className="au-pb" disabled={page === 1} onClick={() => set('page', page - 1)}><Ic n="chevL" size={14} />Previous</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button type="button" key={n} className={`au-pb au-pnum${n === page ? ' is-on' : ''}`} aria-label={`Page ${n}`} aria-current={n === page ? 'page' : undefined} onClick={() => set('page', n)}>{n}</button>
            ))}
            <button type="button" className="au-pb" disabled={page === pages} onClick={() => set('page', page + 1)}>Next<Ic n="chevR" size={14} /></button>
          </div>
        </nav>
      )}

      <p className="au-note">Follow is free and never subscribes; subscribing is paid and also follows. Counts here are sample data.</p>
    </div>
  );
}
