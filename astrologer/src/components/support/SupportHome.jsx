import { useEffect, useMemo, useState } from 'react';
import { PendingTag } from '@/components/ui/sectionKit.jsx';
import RowChevron from '@/components/ui/RowChevron.jsx';
import { CAT_ICON, CHANNELS, STATUSES, SUPPORT_CATEGORIES } from '@/data/mockSupport.js';
import { lastUpdate } from '@/hooks/useSupport.js';
import { ADMIN, Ic, Pill, ReopenButton, allFiles, createdOf, fmt, fmtDate, isFinal, msgsOf, needsReply } from './TicketDetail.jsx';

// Help & Support main screen (AD-158 – AD-162; reference "Help & Support"): New Ticket, tickets that need
// your reply, Your Tickets (status chips, search, category and last-updated filters, expandable rows,
// 6 per page), the 16 categories (AD-159) and which channel to use (AD-162).
// Ticket statuses are the spec's list, "suggested" in the source (AP-16-01).
const PER = 6;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const KIND = { module: ['k-module', 'arrow'], admin: ['k-admin', 'shield'], ticket: ['k-ticket', 'msg'] };
const channelText = (parts) => parts.map((p, i) => (Array.isArray(p) ? <a key={i} href={`#${p[1]}`}>{p[0]}</a> : <span key={i}>{p}</span>));

/** Category name for display: "Wallet/Earnings/Withdrawal" → "Wallet, Earnings & Withdrawal" (stored names stay unchanged). */
const catLabel = (c) => {
  const parts = String(c || '').split('/').map((s) => s.trim()).filter(Boolean);
  return parts.length < 2 ? parts.join('') : parts.slice(0, -1).join(', ') + ' & ' + parts[parts.length - 1];
};

function Empty({ icon, title, text, children }) {
  return <div className="empty"><div className="e-mark"><Ic n={icon} /></div><h3>{title}</h3><p>{text}</p>{children}</div>;
}

// Expanded ticket: the same dropdown design as an opened question in My Work (QCard) — shared .qcard__body /
// __grid / __cell / __more classes and the app-wide RowChevron toggle — showing the Help & Support ticket content.
const PREVIEW_CHARS = 100; // same short preview as My Work, with Show More / Show Less

function Detail({ t, ui, onOpen }) {
  const [full, setFull] = useState(false);
  const msgs = msgsOf(t), files = allFiles(t), hist = msgs.slice(-3), more = msgs.length - hist.length;
  const long = t.desc.length > PREVIEW_CHARS;
  const cells = [
    ['Ticket ID', t.id], ['Subject', t.subject], ['Category', catLabel(t.cat) + (t.sub ? ' · ' + t.sub : '')],
    ['Related ID', t.ref || '—'], ['Created', fmt(createdOf(t))], ['Status', <Pill key="st" st={t.status} />],
    ['Last updated', fmt(lastUpdate(t))], ['Attachments', files.length ? files.join(', ') : 'None'],
  ];
  return (
    <div className="qcard__body sp-qbody" id={'sp-d-' + t.id}>
      <div className="sp-qh">Description</div>
      <p className="qt">{long && !full ? `${t.desc.slice(0, PREVIEW_CHARS).trimEnd()}…` : t.desc}</p>
      {long && <button type="button" className="qcard__more" aria-expanded={full} onClick={() => setFull((v) => !v)}>{full ? 'Show Less' : 'Show More'}</button>}
      <div className="qcard__grid">
        {cells.map(([k, v]) => <div key={k} className="qcard__cell"><span className="muted sm">{k}</span><b>{v}</b></div>)}
      </div>
      <div className="sp-qh">Conversation ({msgs.length})</div>
      {msgs.length ? (
        <>
          <ul className="history">
            {hist.map((m, i) => {
              const latest = i === hist.length - 1;
              return (
                <li key={i} className={(m.from === 'admin' ? 'admin' : 'me') + (latest ? ' latest' : '')}>
                  <span className="h-who">{m.from === 'admin' ? ADMIN + ' (Platform Admin)' : 'You'}</span>
                  <span className="h-when">{fmt(m.time)}</span>
                  {latest && <span className="tag-latest">Latest response</span>}
                  <div className="h-text">{m.text}</div>
                </li>
              );
            })}
          </ul>
          {more > 0 && <p className="faint sp-more">{more} earlier message{more > 1 ? 's' : ''} in the full conversation</p>}
        </>
      ) : <p className="muted sp-none">No replies yet. Platform Admin responses will appear here.</p>}
      <div className="dactions">
        {needsReply(t) && <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpen(t.id, true)}><Ic n="msg" />Reply to Platform Admin</button>}
        <button type="button" className={'btn btn-sm ' + (needsReply(t) ? 'btn-quiet' : 'btn-primary')} onClick={() => onOpen(t.id, false)}><Ic n="open" />Open full conversation</button>
        {isFinal(t) && <ReopenButton t={t} ui={ui} sm />}
      </div>
    </div>
  );
}

export default function SupportHome({ tickets, ui, onNew, onOpen, focusId }) {
  const [status, setStatus] = useState('All');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [month, setMonth] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [highlight, setHighlight] = useState(null);

  // A newly submitted ticket: clear the filters and show it at the top, expanded.
  useEffect(() => {
    if (!focusId) return;
    setStatus('All'); setQ(''); setCat(''); setMonth(''); setPage(1); setExpanded(focusId); setHighlight(focusId);
  }, [focusId]);

  const sorted = useMemo(() => tickets.slice().sort((a, b) => lastUpdate(b).localeCompare(lastUpdate(a))), [tickets]);
  const months = useMemo(() => {
    const seen = new Set(), out = [];
    sorted.forEach((t) => { const k = lastUpdate(t).slice(0, 7); if (!seen.has(k)) { seen.add(k); const d = new Date(lastUpdate(t)); out.push([k, MON[d.getMonth()] + ' ' + d.getFullYear()]); } });
    return out;
  }, [sorted]);
  const qq = q.trim().toLowerCase();
  const pre = sorted.filter((t) => (!cat || t.cat === cat) && (!month || lastUpdate(t).slice(0, 7) === month)
    && (!qq || `${t.id} ${t.subject} ${t.cat} ${t.ref}`.toLowerCase().includes(qq)));
  const counts = { All: pre.length }; STATUSES.forEach((s) => { counts[s] = 0; }); pre.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1; });
  const list = status === 'All' ? pre : pre.filter((t) => t.status === status);
  const pages = Math.max(1, Math.ceil(list.length / PER)), pg = Math.min(page, pages);
  const start = (pg - 1) * PER, slice = list.slice(start, start + PER);
  const attention = sorted.filter(needsReply);
  const reset = (fn) => { fn(); setPage(1); setExpanded(null); };

  const pickCat = (c) => {
    reset(() => { setCat(c); setStatus('All'); });
    document.getElementById('sp-tickets')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  let body;
  if (!sorted.length) {
    body = <Empty icon="inbox" title="No support tickets yet." text="Your submitted support requests will appear here."><button type="button" className="btn btn-primary" onClick={onNew}><Ic n="plus" />New Ticket</button></Empty>;
  } else if (!list.length) {
    body = (qq || cat || month) && counts.All === 0
      ? <Empty icon="search" title="No tickets match your search." text="Try changing your filters or search terms."><button type="button" className="btn btn-quiet" onClick={() => reset(() => { setQ(''); setCat(''); setMonth(''); setStatus('All'); })}>Clear filters</button></Empty>
      : <Empty icon="inbox" title={`No tickets in “${status}”`} text="Tickets appear here when Platform Admin moves them to this status."><button type="button" className="btn btn-quiet" onClick={() => reset(() => setStatus('All'))}>Show all tickets</button></Empty>;
  } else {
    body = slice.map((t) => {
      const open = expanded === t.id;
      return (
        // Ticket card in the My Work list design (shared .qcard classes): icon, subject, IDs, category chip,
        // updated date, a 2-line description, status + created date, and the ▶/▼ toggle.
        <div key={t.id} className={'qcard sp-tcard' + (open ? ' on' : '') + (highlight === t.id ? ' is-new' : '')}>
          <button type="button" className="qcard__top sp-ttop" aria-expanded={open} aria-controls={'sp-d-' + t.id} onClick={() => { setExpanded(open ? null : t.id); setHighlight(null); }}>
            <span className="av sp-tic" aria-hidden="true"><Ic n={CAT_ICON[t.cat] || 'buoy'} /></span>
            <span className="qcard__main">
              <span className="qcard__name"><span className="nm">{t.subject}</span><span className="muted sm">{t.id} · Related {t.ref || '—'}</span></span>
              <span className="qcard__sub"><span className="qchip" title={t.cat}>{catLabel(t.cat)}</span><span className="muted sm">Updated {fmt(lastUpdate(t))}</span></span>
              <span className="sp-tdesc">{t.desc}</span>
            </span>
            <span className="qcard__side"><Pill st={t.status} /><span className="muted sm">Created {fmtDate(createdOf(t))}</span></span>
            <span className="qcard__chev"><RowChevron open={open} /></span>
          </button>
          {open && <Detail t={t} ui={ui} onOpen={onOpen} />}
        </div>
      );
    });
  }

  return (
    <div className="spx">
      <div className="page-head">
        <button type="button" className="btn btn-primary" onClick={onNew}><Ic n="plus" /><span>New Ticket</span></button>
      </div>

      {attention.length > 0 && (
        <div className="attention" role="region" aria-label="Tickets needing your reply">
          <span className="att-icon"><Ic n="msg" /></span>
          <div className="att-body">
            <h2>{attention.length === 1 ? '1 ticket needs your reply' : attention.length + ' tickets need your reply'}</h2>
            <ul>
              {attention.map((t) => <li key={t.id}><b>{t.id}</b><span>{t.subject}</span><button type="button" className="btn btn-link" onClick={() => onOpen(t.id, true)}>Reply</button></li>)}
            </ul>
          </div>
        </div>
      )}

      <section className="panel" id="sp-tickets" aria-labelledby="sp-t-h">
        <div className="sec-head"><h2 className="sec" id="sp-t-h">Your Tickets</h2><span className="count">{sorted.length ? sorted.length + ' total' : ''}</span></div>
        <div className="toolbar">
          <div className="chips" aria-label="Filter by status">
            {['All', ...STATUSES].map((s) => (
              <button key={s} type="button" className="chip" aria-pressed={status === s} onClick={() => reset(() => setStatus(s))}>{s}<span className="n">{counts[s] || 0}</span></button>
            ))}
          </div>
          <div className="tools">
            <div className="field-inline sp-search"><Ic n="search" /><label className="sr" htmlFor="sp-q">Search tickets</label>
              <input className="input" id="sp-q" type="search" placeholder="Search by ticket ID, subject or category" autoComplete="off" value={q} onChange={(e) => reset(() => setQ(e.target.value))} />
            </div>
            {/* Same dropdown as Ratings & Reviews: its shared .rr-sel select style (also matched by Notifications). */}
            <label className="rr-sel sp-sel"><span className="sr">Category</span>
            <select id="sp-cat" value={cat} onChange={(e) => reset(() => setCat(e.target.value))}>
              <option value="">All categories</option>
              {SUPPORT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select></label>
            <label className="rr-sel sp-sel"><span className="sr">Last updated</span>
            <select id="sp-month" value={month} onChange={(e) => reset(() => setMonth(e.target.value))}>
              <option value="">Any date</option>
              {months.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select></label>
          </div>
        </div>
        <div className={list.length ? 'sp-tlist' : ''}>{body}</div>
        {/* Paging bar only when there is more than one page. */}
        {list.length > PER && (
          <div className="pager">
            <span>Showing {start + 1}–{start + slice.length} of {list.length}</span>
            <div className="pages">
              <button type="button" className="sp-pg" aria-label="Previous page" disabled={pg === 1} onClick={() => { setPage(pg - 1); setExpanded(null); }}><Ic n="left" /></button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((i) => <button key={i} type="button" className="sp-pg" aria-current={i === pg ? 'page' : undefined} aria-label={'Page ' + i} onClick={() => { setPage(i); setExpanded(null); }}>{i}</button>)}
              <button type="button" className="sp-pg" aria-label="Next page" disabled={pg === pages} onClick={() => { setPage(pg + 1); setExpanded(null); }}><Ic n="right" /></button>
            </div>
          </div>
        )}
        <p className="sp-statusnote">Ticket statuses are listed as suggested in the source: <PendingTag id="AP-16-01" /></p>
      </section>

      <div className="support-grid">
        <section className="panel lower" aria-labelledby="sp-c-h">
          <h2 className="sec" id="sp-c-h">Categories</h2>
          <ul className="cats">
            {SUPPORT_CATEGORIES.map((c) => {
              const n = sorted.filter((t) => t.cat === c).length;
              return (
                <li key={c}>
                  <button type="button" onClick={() => pickCat(c)}><Ic n={CAT_ICON[c]} /><span className="nm">{c}</span>{n > 0 && <span className="ct" aria-label={n + ' tickets'}>{n}</span>}</button>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="panel lower" aria-labelledby="sp-w-h">
          <h2 className="sec" id="sp-w-h">Which Channel to Use</h2>
          <div className="ch-head" aria-hidden="true"><span>Situation</span><span /><span>Correct channel</span></div>
          <div className="channels">
            {CHANNELS.map((c) => {
              const k = KIND[c.kind];
              return (
                <div key={c.situation} className="ch">
                  <div className="sit">{c.situation}</div>
                  <div className="arrow"><Ic n="arrow" /></div>
                  <div className="dest"><span className="where">{channelText(c.channel)}</span><span className={'kind ' + k[0]}><Ic n={k[1]} />{c.tag}</span></div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
