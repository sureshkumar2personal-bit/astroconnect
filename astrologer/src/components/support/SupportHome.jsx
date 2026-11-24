import { Badge, Grid, PendingTag, Sec, Table } from '@/components/ui/sectionKit.jsx';
import ExpandTable from '@/components/ui/ExpandTable.jsx';
import { TicketInfo } from './TicketDetail.jsx';
import { dt, fmtDateTime } from '@/lib/format.js';
import { CHANNELS, STATUS_KIND, SUPPORT_CATEGORIES } from '@/data/mockSupport.js';
import { lastUpdate } from '@/hooks/useSupport.js';

// Help & Support main screen (AD-158 – AD-162): your tickets, the 16 categories (AD-159),
// and which channel to use (AD-162). Status list is "suggested" in the source (AP-16-01).
const channelCell = (parts) => parts.map((p, i) => (Array.isArray(p) ? <a key={i} href={`#${p[1]}`}>{p[0]}</a> : <span key={i}>{p}</span>));

export default function SupportHome({ tickets }) {
  return (
    <>
      <div className="row sp-top">
        <a className="btn btn-p" href="#/support/new">+ New ticket</a>
      </div>

      <Sec title="Your tickets">
        {/* A ticket expands in place to show its details, reply / reopen and history (no separate page). */}
        <ExpandTable multi cols={['Ticket', 'Category', 'Related ID', 'Status', 'Updated']}
          empty="No tickets yet."
          rows={tickets.map((t) => ({
            key: t.id,
            detail: () => <TicketInfo t={t} />,
            cells: [<b key="id">{t.id}</b>, t.cat, t.ref || '—', <Badge key="st" kind={STATUS_KIND[t.status]}>{t.status}</Badge>, fmtDateTime(dt(lastUpdate(t)))],
          }))} />
        <span className="muted sm">Ticket statuses are listed as suggested in the source: <PendingTag id="AP-16-01" /></span>
      </Sec>

      <Sec title="Categories" className="sp-cats">
        <Grid size="sm">
          {SUPPORT_CATEGORIES.map((c) => <a key={c} className="kpi kpi--link" href={`#/support/new/${encodeURIComponent(c)}`}><b>{c}</b></a>)}
        </Grid>
      </Sec>

      <Sec title="Which channel to use">
        <Table bare cols={['Situation', 'Channel']}
          rows={CHANNELS.map((r) => ({ key: r.situation, cells: [r.situation, <span key="c">{channelCell(r.channel)}</span>] }))} />
      </Sec>
    </>
  );
}
