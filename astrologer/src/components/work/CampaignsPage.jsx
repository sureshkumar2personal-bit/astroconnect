import { useEffect, useMemo, useRef, useState } from 'react';
import { campSold, campTotal, fmtDate, fmtDateTime, finalPrice, inr, TODAY } from '@/lib/textQuestions.js';
import { routes } from '@/lib/router.js';

// Campaign Management (design: "AstroConnect – Campaign Management prototype"; rules unchanged:
// AD-24 – AD-27, AD-31, AD-52, AD-54 – AD-58, AD-70, AD-73). Monthly summary panels, filterable
// paginated campaign cards and a per-card "more actions" menu. Styles: sections.css, ".cm-*".

const pad = (n) => String(n).padStart(2, '0');
const TODAY_ISO = `${TODAY.getFullYear()}-${pad(TODAY.getMonth() + 1)}-${pad(TODAY.getDate())}`;
const MONTH_END = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0);
const CYCLE = `1–${MONTH_END.getDate()} ${MONTH_END.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`;
const num = (n) => Number(n).toLocaleString('en-IN');

/** Stored status (Active / Cancelled) refined by dates into the four states the UI filters on. */
export const campStatus = (c) => {
  if (c.status === 'Draft') return 'draft';
  if (c.status === 'Cancelled') return 'cancelled';
  if (c.publishAt ? new Date(c.publishAt) > TODAY : c.start > TODAY_ISO) return 'scheduled';
  if (c.end < TODAY_ISO) return 'expired';
  return 'active';
};
export const STATUS_LABEL = { active: 'Active', scheduled: 'Scheduled', expired: 'Expired', cancelled: 'Cancelled', draft: 'Draft' };
const RANK = { active: 0, scheduled: 1, expired: 2, cancelled: 3, draft: 4 };
const FILTERS = [['all', 'All'], ['active', 'Active'], ['scheduled', 'Scheduled'], ['expired', 'Expired'], ['cancelled', 'Cancelled'], ['draft', 'Draft']];

const perPage = () => (window.innerWidth >= 1024 ? 9 : window.innerWidth >= 640 ? 6 : 5);
function usePerPage() {
  const [n, setN] = useState(perPage);
  useEffect(() => {
    let t;
    const on = () => { clearTimeout(t); t = setTimeout(() => setN(perPage()), 120); };
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('resize', on); clearTimeout(t); };
  }, []);
  return n;
}

const CalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
);
const DotsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);

/** One question-type block (General / Personal): slots, price and offer tag, or "Not offered". */
function QBlock({ label, on, sold, slots, price, disc }) {
  if (!on) return <div className="cm-q off"><span className="cm-q-label">{label}</span><span>Not offered</span></div>;
  const offer = disc && disc.on && disc.pct;
  return (
    <div className="cm-q">
      <span className="cm-q-label">{label}</span>
      <span className="cm-q-slots"><b>{num(sold)}</b> / {num(slots)} slots</span>
      <span className="cm-q-price">
        {offer ? <>{inr(finalPrice(price, disc))} <s>{inr(price)}</s></> : inr(price)}
      </span>
      <span className={`cm-offer ${offer ? 'on' : 'off'}`}>{offer ? `${disc.pct}% off` : 'No offer'}</span>
    </div>
  );
}

/** "More actions" dropdown for one campaign card. */
function CampMenu({ c, st, onAction }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const live = st === 'active' || st === 'scheduled';
  const cancelled = st === 'cancelled';
  const draft = st === 'draft';
  const noLive = draft ? 'Campaign is a draft' : 'Campaign has ended';
  const items = [
    { k: 'slots', t: 'Increase / decrease slots', ok: live, why: noLive },
    { k: 'realloc', t: 'Reallocate slots', ok: live, why: noLive },
    { k: 'extend', t: 'Extend campaign', ok: !cancelled && !draft, why: draft ? 'Campaign is a draft' : 'Campaign was cancelled' },
    'hr',
    { k: 'cancel', t: 'Cancel campaign', ok: live, danger: true, why: noLive },
    { k: 'delete', t: 'Delete campaign', ok: !cancelled, danger: true, why: 'Campaign was cancelled' },
  ];

  useEffect(() => {
    if (!open) return undefined;
    const down = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const key = (e) => {
      if (e.key === 'Escape') { setOpen(false); wrap.current?.querySelector('.cm-more')?.focus(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const els = [...wrap.current.querySelectorAll('.cm-mi:not(:disabled)')];
        const i = els.indexOf(document.activeElement);
        els[(i + (e.key === 'ArrowDown' ? 1 : -1) + els.length) % els.length]?.focus();
      }
    };
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    wrap.current.querySelector('.cm-mi:not(:disabled)')?.focus();
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); };
  }, [open]);

  return (
    <div className="cm-menu-wrap" ref={wrap}>
      <button type="button" className="cm-icon-btn cm-more" aria-haspopup="menu" aria-expanded={open}
        aria-label={`More actions for ${c.name}`} onClick={() => setOpen((o) => !o)}><DotsIcon /></button>
      {open && (
        <div className="cm-menu" role="menu">
          {items.map((i, n) => (i === 'hr' ? <hr key={n} /> : (
            <button key={i.k} type="button" role="menuitem" className={`cm-mi${i.danger ? ' danger' : ''}`} disabled={!i.ok}
              onClick={() => { setOpen(false); onAction(i.k, c.id); }}>
              {i.t}{!i.ok && <small>{i.why}</small>}
            </button>
          )))}
        </div>
      )}
    </div>
  );
}

function CampaignCard({ c, onAction, onEdit }) {
  const st = campStatus(c);
  const live = st === 'active' || st === 'scheduled';
  const editable = live || st === 'draft';
  const t = campTotal(c);
  const s = campSold(c);
  return (
    <article className="cm-card" data-status={st}>
      <div className="cm-c-head">
        <div>
          <h3 className="cm-c-name">{c.name}</h3>
          <div className="cm-c-tags">
            <span className={`cm-tag${c.special ? ' special' : ''}`}>{c.special ? 'Special' : 'Regular'}</span>
            {c.special && c.label && <span className="cm-tag occ">{c.label}</span>}
          </div>
        </div>
        <span className={`cm-pill s-${st}`}>{STATUS_LABEL[st]}</span>
      </div>
      <div className="cm-c-dates"><CalIcon /><span>{fmtDate(c.start)} – {fmtDate(c.end)}</span></div>
      {st === 'scheduled' && c.publishAt && <div className="cm-c-pub">Publishes {fmtDateTime(c.publishAt)}</div>}
      <div className="cm-c-total">
        <span><b>{num(s)}</b> / {num(t)} sold</span>
        <span className="unsold"><b>{num(Math.max(0, t - s))}</b> {st === 'cancelled' || st === 'expired' ? 'released' : 'unsold'}</span>
      </div>
      <div className="cm-c-split">
        <QBlock label="General" on={c.G} sold={c.gSold} slots={c.gSlots} price={c.pg} disc={c.gDisc} />
        <QBlock label="Personal" on={c.P} sold={c.pSold} slots={c.pSlots} price={c.pp} disc={c.pDisc} />
      </div>
      <div className="cm-c-foot">
        {editable
          ? <button type="button" className="btn btn-o" onClick={() => onEdit(c.id)}>Edit</button>
          : <button type="button" className="btn btn-o" disabled title="Only draft, active or scheduled campaigns can be edited">Edit</button>}
        <CampMenu c={c} st={st} onAction={onAction} />
      </div>
    </article>
  );
}

function Pager({ page, pages, from, shown, total, onPage }) {
  const nums = [];
  for (let i = 1; i <= pages; i += 1) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  return (
    <nav className="cm-pager" aria-label="Campaign pages">
      <span className="cm-pager-info">Showing {from + 1}–{from + shown} of {total} campaigns</span>
      {pages > 1 && (
        <div className="cm-pages">
          <button type="button" className="cm-pg" disabled={page === 1} onClick={() => onPage(page - 1)} aria-label="Previous page">Previous</button>
          {nums.map((n, i) => (n === '…'
            ? <span key={`g${i}`} className="cm-pg-gap">…</span>
            : <button key={n} type="button" className="cm-pg" aria-current={n === page ? 'page' : undefined} onClick={() => onPage(n)}>{n}</button>))}
          <button type="button" className="cm-pg" disabled={page === pages} onClick={() => onPage(page + 1)} aria-label="Next page">Next</button>
        </div>
      )}
    </nav>
  );
}

export default function CampaignsPage({ tq, onAction, onEditOpen, onCreate, onEditCampaign }) {
  const o = tq.open;
  const all = useMemo(() => tq.campaigns.filter((c) => c.status !== 'Deleted'), [tq.campaigns]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);
  const pp = usePerPage();
  const headRef = useRef(null);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return all
      .filter((c) => (status === 'all' || campStatus(c) === status)
        && (type === 'all' || (type === 'special') === !!c.special)
        && (!t || c.name.toLowerCase().includes(t) || (c.label || '').toLowerCase().includes(t)))
      .sort((a, b) => RANK[campStatus(a)] - RANK[campStatus(b)] || (a.start < b.start ? 1 : a.start > b.start ? -1 : 0));
  }, [all, q, status, type]);

  const pages = Math.max(1, Math.ceil(list.length / pp));
  const cur = Math.min(page, pages);
  const from = (cur - 1) * pp;
  const slice = list.slice(from, from + pp);
  const goPage = (n) => { setPage(n); headRef.current?.scrollIntoView({ block: 'start' }); };
  const filter = (set) => (v) => { set(v); setPage(1); };

  const campAlloc = tq.alloc - o.gSlots - o.pSlots;
  const needed = Math.max(0, tq.target - tq.answeredMonth);

  return (
    <div className="cm">
      <div className="cm-cycle-row">
        <p className="cm-cycle">Quota cycle <b>{CYCLE}</b></p>
        <div className="cm-cycle-actions">
          <button type="button" className="btn btn-o" onClick={onEditOpen}>Open questions settings</button>
          <button type="button" className="btn btn-navy" onClick={onCreate}>+ Create campaign</button>
        </div>
      </div>

      <section className="cm-summary" aria-label="Monthly summary">
        <article className="cm-panel">
          <div className="cm-panel-h"><div><h2>Monthly slot quota</h2><p>Shared by open questions and all campaigns</p></div></div>
          <div className="cm-stats">
            <div className="cm-stat"><div className="v">{num(tq.quota)}</div><div className="l">Monthly quota</div></div>
            <div className="cm-stat"><div className="v">{num(tq.alloc)}</div><div className="l">Allocated</div></div>
            <div className={`cm-stat ${tq.free > 0 ? 'good' : 'bad'}`}><div className="v">{num(tq.free)}</div><div className="l">Available</div></div>
          </div>
          <div className="cm-ledger">
            <div><span>Open questions</span><b>{num(o.gSlots + o.pSlots)}</b></div>
            <div><span>Campaigns</span><b>{num(campAlloc)}</b></div>
          </div>
        </article>

        <article className="cm-panel">
          <div className="cm-panel-h">
            <div><h2>Monthly answer target</h2><p>Answered questions this month</p></div>
            <span className="cm-pill s-active">Normal quota</span>
          </div>
          <div className="cm-stats">
            <div className="cm-stat"><div className="v">{num(tq.answeredMonth)}</div><div className="l">Answered</div></div>
            <div className="cm-stat"><div className="v">{num(tq.target)}</div><div className="l">Target</div></div>
            <div className="cm-stat good"><div className="v">{num(1000)}</div><div className="l">Quota status</div></div>
          </div>
          <p className="cm-note">{needed ? `${num(needed)} more answers needed by ${MONTH_END.getDate()} ${MONTH_END.toLocaleDateString('en-GB', { month: 'short' })}.` : 'Target met for this month.'}</p>
          <details className="cm-rules">
            <summary>How the target affects your quota</summary>
            <ul>
              <li>Miss {num(tq.target)} in a month: the <b>following</b> month's quota is 900 (−10%).</li>
              <li>Miss twice in a row: the next quota is 800 (−20%).</li>
              <li>Meet the reduced target: quota returns to 1,000.</li>
              <li>Miss three times in a row: only Text-Based Questions pause for 3 months.</li>
            </ul>
          </details>
        </article>

        <article className="cm-panel cm-oq">
          <div className="cm-panel-h">
            <div><h2>Open questions</h2><p>Asked without choosing a campaign</p></div>
            <button type="button" className="btn btn-o sm" onClick={onEditOpen}>Edit</button>
          </div>
          <div className="cm-oq-grid">
            <QBlock label="General" on sold={o.gSold} slots={o.gSlots} price={o.pg} disc={o.gDisc} />
            <QBlock label="Personal" on sold={o.pSold} slots={o.pSlots} price={o.pp} disc={o.pDisc} />
          </div>
        </article>
      </section>

      <div className="cm-camp-head" ref={headRef}><h2>Your campaigns</h2><span>{all.length} total</span></div>
      <div className="cm-toolbar">
        <label className="cm-search">
          <SearchIcon />
          <input type="search" placeholder="Search campaigns" aria-label="Search campaigns" value={q} onChange={(e) => filter(setQ)(e.target.value)} />
        </label>
        <div className="cm-chips" role="group" aria-label="Filter by status">
          {FILTERS.map(([v, l]) => (
            <button key={v} type="button" className="cm-chip" aria-pressed={status === v} onClick={() => filter(setStatus)(v)}>{l}</button>
          ))}
        </div>
        <select aria-label="Filter by campaign type" value={type} onChange={(e) => filter(setType)(e.target.value)}>
          <option value="all">All types</option>
          <option value="regular">Regular</option>
          <option value="special">Special</option>
        </select>
      </div>

      <div className="cm-grid">
        {slice.length
          ? slice.map((c) => <CampaignCard key={c.id} c={c} onAction={onAction} onEdit={onEditCampaign} />)
          : <div className="cm-empty"><b>No campaigns match these filters</b>Try another status or search term, or create a new campaign.</div>}
      </div>
      {list.length > 0 && <Pager page={cur} pages={pages} from={from} shown={slice.length} total={list.length} onPage={goPage} />}
    </div>
  );
}
