import { navigate } from '@/lib/router.js';
import { contentActions } from '@/hooks/useContent.js';
import { BtnRow, Empty, Facts, Kpi, KpiGrid, Sec } from '@/components/ui/sectionKit.jsx';
import { dt, fmtDateTime } from '@/lib/format.js';
import { edit } from './nav.js';

/** Delete confirmation; `after` runs once the post is deleted. */
const confirmDelete = (p, ui, after) => ui.dialog({
  title: 'Delete post',
  body: (close) => (
    <div className="stack">
      <p>Delete this post?</p>
      <BtnRow>
        <button type="button" className="btn btn-o" onClick={close}>Keep</button>
        <button type="button" className="btn btn-o danger" onClick={() => {
          contentActions.remove(p.id); close(); ui.toast('Post deleted'); after?.();
        }}>Delete</button>
      </BtnRow>
    </div>
  ),
});

/** A post's details and actions, shown inside its expanded row in General Posts. */
export function PostInfo({ p, ui }) {
  return (
    <>
      <Facts items={[
        ['Post ID', p.id], ['Format', p.fmt], ['Audience', p.aud], ['Status', p.st],
        ['Date', fmtDateTime(dt(p.at))], ['Views', p.views], ['Likes', p.likes], ['Comments', p.comments],
      ]} />
      <p className="cm-pv-text">{p.text || <span className="muted">No text</span>}</p>
      <BtnRow>
        <button type="button" className="btn btn-o" onClick={() => edit(p.id)}>Edit</button>
        <button type="button" className="btn btn-o danger" onClick={() => confirmDelete(p, ui)}>Delete</button>
      </BtnRow>
    </>
  );
}

// Content Details page (#/content/p/<id>), kept for direct links.
// Content Details (AD-78): status and engagement (AD-139), text, Edit and Delete.
export default function ContentPost({ post: p, id, ui }) {
  if (!p) return <Empty title="Post not found">{id} may have been deleted.</Empty>;
  const askDelete = () => confirmDelete(p, ui, () => navigate('/content'));
  return (
    <>
      <KpiGrid>
        <Kpi label="Status" value={p.st} />
        <Kpi label="Views" value={p.views} />
        <Kpi label="Likes" value={p.likes} />
        <Kpi label="Comments" value={p.comments} />
        <Kpi label="Audience" value={p.aud} />
      </KpiGrid>
      <Sec>
        <p className="cm-pv-text">{p.text || <span className="muted">No text</span>}</p>
        <BtnRow>
          <button type="button" className="btn btn-o" onClick={() => edit(p.id)}>Edit</button>
          <button type="button" className="btn btn-o danger" onClick={askDelete}>Delete</button>
        </BtnRow>
      </Sec>
    </>
  );
}
