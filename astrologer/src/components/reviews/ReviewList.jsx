import { navigate } from '@/lib/router.js';
import { fmtDate, dt } from '@/lib/format.js';
import { SERVICES, STATUSES, REPLY_STATES } from '@/data/mockReviews.js';
import { avgRating, filterReviews, publishedOnly, reviewsActions, statusKind } from '@/hooks/useReviews.js';
import { Badge, Kpi, KpiGrid, PendingTag, Stars, Table } from '@/components/ui/sectionKit.jsx';

// Ratings & Reviews list: public + service-wise ratings (AD-132, AD-134), Service / Status / Reply
// filters and the review table (AD-130, AD-131). Rows open Review Details (AD-78).
const COLS = ['Review', 'Service', 'Rating', 'Feedback', 'Status', 'Reply'];

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="rv-filter">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {['', ...options].map((o) => <option key={o} value={o}>{o || 'All'}</option>)}
      </select>
    </label>
  );
}

export default function ReviewList({ s }) {
  const pub = publishedOnly(s.list);
  const avg = avgRating(pub);
  const rows = filterReviews(s.list, s.filters);
  const f = s.filters;
  const set = (k) => (v) => reviewsActions.setFilter(k, v);

  return (
    <>
      <KpiGrid>
        <Kpi label="Public rating (Published only)" value={`${avg} / 5`} sub={<Stars n={Math.round(Number(avg)) || 0} />} />
        {SERVICES.map((svc) => {
          const x = pub.filter((r) => r.svc === svc);
          return <Kpi key={svc} label={svc} value={avgRating(x)} sub={<span className="sm">{x.length} published</span>} />;
        })}
      </KpiGrid>

      <div className="row wrap rv-filters">
        <FilterSelect label="Service" value={f.svc} options={SERVICES} onChange={set('svc')} />
        <FilterSelect label="Status" value={f.st} options={STATUSES} onChange={set('st')} />
        <FilterSelect label="Reply" value={f.rep} options={REPLY_STATES} onChange={set('rep')} />
      </div>

      <Table cols={COLS} rows={rows.map((r) => ({
        key: r.id,
        onOpen: () => navigate(`/reviews/r/${encodeURIComponent(r.id)}`),
        cells: [
          <span key="id"><b>{r.id}</b><div className="muted sm">{r.user} · {fmtDate(dt(r.at))}</div></span>,
          r.svc,
          <Stars key="st" n={r.stars} />,
          r.text ? <span key="t">{r.text}</span> : <span key="t" className="muted">No written feedback</span>,
          <Badge key="b" kind={statusKind(r.st)}>{r.st}</Badge>,
          r.reply ? <Badge key="r" kind="info">Replied</Badge> : <Badge key="r" kind="gen">Not Replied</Badge>,
        ],
      }))} />

      <p className="muted sm">
        Hidden reviews never appear in the User App but stay visible to Platform Admin and count for internal monitoring.
        Users can't edit or delete reviews; they request changes through Platform Support.
        Enforcement of the mandatory rating: <PendingTag id="AP-10-01" />
      </p>
    </>
  );
}
