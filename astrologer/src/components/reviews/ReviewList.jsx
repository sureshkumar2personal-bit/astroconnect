import { useState } from 'react';
import { fmtDate, dt } from '@/lib/format.js';
import { SERVICES, STATUSES, REPLY_STATES, RATINGS, DATES, SORTS, PER_PAGE } from '@/data/mockReviews.js';
import { activeFilterCount, avgRating, filterReviews, publishedOnly, reviewsActions, statusKind } from '@/hooks/useReviews.js';
import { Badge, PendingTag, Stars } from '@/components/ui/sectionKit.jsx';
import RowChevron from '@/components/ui/RowChevron.jsx';
import { ReviewInfo } from './ReviewDetail.jsx';

// Ratings & Reviews list (reference "AstroConnect – Ratings & Reviews", AD-186): public + service-wise ratings
// (AD-132, AD-134), All / Pending Publication / Published / Hidden tabs, search, Service / Rating / Reply / Date
// filters, sort, Reset filters and the review table (AD-130, AD-131). View opens a review's details in place,
// Close collapses them; several can be open at once (no separate page).
const COLS = ['Review', 'Service', 'Rating', 'Feedback', 'Status', 'Reply', 'Action'];
const TABS = [['', 'All'], ...STATUSES.map((s) => [s, s])];
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function Select({ label, k, value, all, options }) {
  return (
    <label className="rr-sel">
      <span className="sr">{label}</span>
      <select value={value} onChange={(e) => reviewsActions.setFilter(k, e.target.value)}>
        {all && <option value="">{all}</option>}
        {options.map((o) => (Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o} value={o}>{o}</option>))}
      </select>
    </label>
  );
}

export default function ReviewList({ s, ui, ctx }) {
  const pub = publishedOnly(s.list);
  const avg = avgRating(pub);
  const f = s.filters;
  const [showFilters, setShowFilters] = useState(false);
  const all = filterReviews(s.list, f);
  const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const page = Math.min(f.page || 1, pages);
  const rows = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const active = activeFilterCount(f);
  const count = (st) => (st ? s.list.filter((r) => r.st === st).length : s.list.length);

  return (
    <div className="rr">
      <section className="rr-card rr-rating" aria-label="Public rating">
        <div className="rr-rating__main">
          <span className="rr-lbl">Public rating</span>
          <div className="rr-rating__big"><b>{avg}</b><span>/ 5</span></div>
          <Stars n={Math.round(Number(avg)) || 0} />
          <span className="rr-muted">Based on {plural(pub.length, 'published review', 'published reviews')}</span>
        </div>
        <div className="rr-rating__svcs">
          {SERVICES.map((svc) => {
            const x = pub.filter((r) => r.svc === svc);
            const a = avgRating(x);
            return (
              <div className="rr-svc" key={svc}>
                <span className="rr-svc__n">{svc}</span>
                <span className="rr-svc__v">{a}{x.length > 0 && <i aria-hidden="true">★</i>}</span>
                <span className="rr-svc__bar"><i style={{ width: `${x.length ? (Number(a) / 5) * 100 : 0}%` }} /></span>
                <span className="rr-muted">{x.length ? plural(x.length, 'published review', 'published reviews') : 'No reviews'}</span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="rr-head">
        <h2 className="rr-h2">Reviews</h2>
        <div className="rr-tabs" role="tablist" aria-label="Review status">
          {TABS.map(([v, l]) => (
            <button type="button" role="tab" key={l} aria-selected={f.st === v} className="rr-tab" onClick={() => reviewsActions.setFilter('st', v)}>
              {l}<span className="rr-count">{count(v)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rr-tools">
        <label className="rr-search">
          <span className="sr">Search</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 11a7 7 0 1 0 14 0a7 7 0 1 0-14 0M20 20l-3.5-3.5" /></svg>
          <input type="search" placeholder="Search review ID or customer" value={f.q} onChange={(e) => reviewsActions.setFilter('q', e.target.value)} />
        </label>
        <button type="button" className={`rr-filters-btn${active ? ' is-set' : ''}`} aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)}>
          Filters{active > 0 && <span className="rr-count">{active}</span>}
        </button>
        <div className={`rr-filters${showFilters ? ' is-open' : ''}`}>
          <Select label="Service" k="svc" value={f.svc} all="All services" options={SERVICES} />
          <Select label="Rating" k="rating" value={f.rating} all="All ratings" options={RATINGS} />
          <Select label="Reply" k="rep" value={f.rep} all="All replies" options={REPLY_STATES} />
          <Select label="Date" k="date" value={f.date} all="All dates" options={DATES} />
          {f.date === 'custom' && (
            <span className="rr-range">
              <label><span className="sr">From</span><input type="date" value={f.from} max={f.to || undefined} onChange={(e) => reviewsActions.setFilter('from', e.target.value)} /></label>
              <span aria-hidden="true">–</span>
              <label><span className="sr">To</span><input type="date" value={f.to} min={f.from || undefined} onChange={(e) => reviewsActions.setFilter('to', e.target.value)} /></label>
            </span>
          )}
          <Select label="Sort" k="sort" value={f.sort} options={SORTS} />
          <button type="button" className="rr-reset" disabled={!active && f.sort === 'newest'} onClick={reviewsActions.resetFilters}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" /></svg>
            Reset filters
          </button>
        </div>
      </div>
      <p className="rr-muted rr-total">{plural(all.length, 'review', 'reviews')}</p>

      {rows.length ? (
        <div className="rr-card rr-table">
          <div className="rr-thead" aria-hidden="true">{COLS.map((c) => <span key={c}>{c}</span>)}</div>
          <ul className="rr-rows">
            {rows.map((r) => {
              const open = s.open.includes(r.id);
              const id = `rr-d-${r.id}`;
              return (
                <li key={r.id} className={`rr-item${open ? ' is-open' : ''}`}>
                  <div className="rr-row">
                    <span className="rr-who"><b>{r.user}</b><small>{r.id} · {fmtDate(dt(r.at))}</small></span>
                    <span className="rr-c-svc" data-label="Service">{r.svc}</span>
                    <span className="rr-c-rate" data-label="Rating"><Stars n={r.stars} /></span>
                    <span className="rr-c-fb" data-label="Feedback">{r.text ? <span className="rr-clamp">{r.text}</span> : <span className="muted">No written feedback</span>}</span>
                    <span className="rr-c-st" data-label="Status"><Badge kind={statusKind(r.st)}>{r.st}</Badge></span>
                    <span className="rr-c-rep" data-label="Reply">{r.reply ? <Badge kind="info">Replied</Badge> : <Badge kind="gen">Not Replied</Badge>}</span>
                    <span className="rr-c-act">
                      <button type="button" className="rr-view" aria-expanded={open} aria-controls={id} onClick={() => reviewsActions.toggleOpen(r.id)}>
                        {open ? 'Close' : 'View'}<RowChevron open={open} />
                        <span className="sr"> details for {r.id}</span>
                      </button>
                    </span>
                  </div>
                  {open && <div className="rr-detail" id={id}><ReviewInfo r={r} ui={ui} ctx={ctx} /></div>}
                </li>
              );
            })}
          </ul>
          {pages > 1 && (
            <nav className="rr-pager" aria-label="Pages">
              <span className="rr-muted">Showing {(page - 1) * PER_PAGE + 1}–{(page - 1) * PER_PAGE + rows.length} of {all.length}</span>
              <div className="rr-pager__b">
                <button type="button" className="rr-pb" disabled={page === 1} onClick={() => reviewsActions.setFilter('page', page - 1)}>Previous</button>
                <span className="rr-muted">Page {page} of {pages}</span>
                <button type="button" className="rr-pb" disabled={page === pages} onClick={() => reviewsActions.setFilter('page', page + 1)}>Next</button>
              </div>
            </nav>
          )}
        </div>
      ) : (
        <div className="rr-card rr-empty">
          <b>No reviews match these filters</b>
          <span className="rr-muted">Try another tab, or reset the filters.</span>
          {active > 0 && <button type="button" className="btn btn-o sm" onClick={reviewsActions.resetFilters}>Reset filters</button>}
        </div>
      )}

      <p className="muted sm">
        Hidden reviews never appear in the User App but stay visible to Platform Admin and count for internal monitoring.
        Users can't edit or delete reviews; they request changes through Platform Support.
        Enforcement of the mandatory rating: <PendingTag id="AP-10-01" />
      </p>
    </div>
  );
}
