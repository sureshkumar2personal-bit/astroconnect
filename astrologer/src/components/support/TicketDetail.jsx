import { useState } from 'react';
import { Badge, Empty, Facts, PendingTag, Sec } from '@/components/ui/sectionKit.jsx';
import { dt, fmtDateTime } from '@/lib/format.js';
import { CLOSED_STATUSES, STATUS_KIND } from '@/data/mockSupport.js';
import { supportActions } from '@/hooks/useSupport.js';

// Ticket detail (AD-160): Category/Subcategory, Related ID, Status, Attachments, description,
// reply to the Platform, Platform replies + Ticket History, and Reopen "where allowed" (AP-16-02).
/** Facts, description and the reply box (open) or Reopen (closed). */
function TicketBody({ t }) {
  const [msg, setMsg] = useState('');
  const closed = CLOSED_STATUSES.includes(t.status);
  const send = () => { const m = msg.trim(); if (!m) return; supportActions.reply(t.id, m); setMsg(''); };
  return (
    <>
      <Facts items={[
        ['Category / Subcategory', t.cat + (t.sub ? ` / ${t.sub}` : '')],
        ['Related ID', t.ref || '—'],
        ['Status', t.status],
        ['Attachments', t.files.join(', ') || 'None'],
      ]} />
      <p>{t.desc}</p>
      {closed ? (
        <>
          <button type="button" className="btn btn-o" onClick={() => supportActions.reopen(t.id)}>Reopen ticket</button>
          <span className="muted sm">Where allowed <PendingTag id="AP-16-02" /></span>
        </>
      ) : (
        <>
          <textarea className="short" aria-label="Reply to the Platform" placeholder="Reply to the Platform" value={msg} onChange={(e) => setMsg(e.target.value)} />
          <button type="button" className="btn btn-p" onClick={send}>Send reply</button>
        </>
      )}
    </>
  );
}

function TicketHistory({ t }) {
  return (
    <ol className="tl">
      {t.hist.map((h, i) => (
        <li key={i} className={h.by === 'pf' ? 'accent' : 'done'}>
          <b>{h.title}</b>
          <span className="sm">{h.text}</span>
          <span className="muted sm">{fmtDateTime(dt(h.at))}</span>
        </li>
      ))}
    </ol>
  );
}

/** A ticket's full details, shown inside its expanded row in "Your tickets". */
export function TicketInfo({ t }) {
  return (
    <>
      <TicketBody t={t} />
      <div className="sp-hist">
        <b className="sp-hist__h">Ticket history</b>
        <TicketHistory t={t} />
      </div>
    </>
  );
}

// Full page (#/support/t/<id>), kept for direct links and for a newly submitted ticket.
export default function TicketDetail({ t }) {
  if (!t) return <Empty title="Ticket not found">It may have been removed. <a href="#/support">Back to Help &amp; Support</a></Empty>;
  return (
    <>
      <div className="row sp-top"><Badge kind={STATUS_KIND[t.status]}>{t.status}</Badge></div>
      <div className="split2">
        <Sec><TicketBody t={t} /></Sec>
        <Sec title="Ticket history"><TicketHistory t={t} /></Sec>
      </div>
    </>
  );
}
