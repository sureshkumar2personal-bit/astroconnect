import { dt, fmtDateTime } from '@/lib/format.js';
import { contentActions } from '@/hooks/useContent.js';
import { Badge, Seg, Table } from '@/components/ui/sectionKit.jsx';
import ExpandTable from '@/components/ui/ExpandTable.jsx';
import { PostInfo } from './ContentPost.jsx';
import BenefitTab from './BenefitTab.jsx';
import TemplatesTab from './TemplatesTab.jsx';
import { create } from './nav.js';

// Benefits & Content main screen (AD-138): General Posts (AD-139), Subscriber Benefit Content (AD-140),
// Templates (AD-141 – AD-143) and Delivery History (AD-140).
const TABS = [['posts', 'General Posts'], ['benefit', 'Subscriber Benefit Content'], ['templates', 'Templates'], ['delivery', 'Delivery History']];
const postKind = (st) => (st === 'Published' ? 'ok' : st === 'Scheduled' ? 'info' : 'gen');
const deliveryKind = (st) => (st === 'Delivered' ? 'ok' : st === 'Missed' ? 'bad' : 'warn');

export default function ContentList({ s, ui }) {
  return (
    <>
      <div className="row wrap cm-top">
        <button type="button" className="btn btn-p" onClick={() => create('General Post')}>+ New General Post</button>
      </div>
      <Seg label="Content type" options={TABS} value={s.tab} onChange={contentActions.setTab} />

      {s.tab === 'posts' && (
        // A post expands in place to show its details, Edit and Delete (no separate page).
        <ExpandTable multi className="card" cols={['Post', 'Format', 'Audience', 'Status', 'Date', 'Views', 'Likes', 'Comments']}
          rows={s.posts.filter((p) => p.kind === 'General Post' || p.kind === 'Custom').map((p) => ({
            key: p.id,
            detail: () => <PostInfo p={p} ui={ui} />,
            cells: [
              <div><b>{p.title}</b><div className="muted sm">{p.id}</div></div>,
              p.fmt, p.aud, <Badge kind={postKind(p.st)}>{p.st}</Badge>, fmtDateTime(dt(p.at)), p.views, p.likes, p.comments,
            ],
          }))} />
      )}

      {s.tab === 'benefit' && <BenefitTab recur={s.recur} />}
      {s.tab === 'templates' && <TemplatesTab />}

      {s.tab === 'delivery' && (
        <Table cols={['Content', 'Tier', 'Delivery', 'Scheduled']}
          rows={s.delivery.map((d, i) => ({
            key: `${d.content}-${i}`,
            cells: [d.content, d.tier, <Badge kind={deliveryKind(d.st)}>{d.st}</Badge>, fmtDateTime(dt(d.at))],
          }))} />
      )}
    </>
  );
}
