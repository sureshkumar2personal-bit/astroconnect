import { navigate } from '@shared/lib/router.js';
import { contentActions } from '@shared/hooks/useContent.js';
import { BtnRow, Empty, Kpi, KpiGrid, Sec } from '../section/kit.jsx';
import { edit } from './nav.js';

// Content Details page (AD-78): status and engagement (AD-139), text, Edit and Delete.
export default function ContentPost({ post: p, id, ui }) {
  if (!p) return <Empty title="Post not found">{id} may have been deleted.</Empty>;
  const askDelete = () => ui.dialog({
    title: 'Delete post',
    body: (close) => (
      <div className="stack">
        <p>Delete this post?</p>
        <BtnRow>
          <button type="button" className="btn btn-o" onClick={close}>Keep</button>
          <button type="button" className="btn btn-o danger" onClick={() => {
            contentActions.remove(p.id); close(); ui.toast('Post deleted'); navigate('/content');
          }}>Delete</button>
        </BtnRow>
      </div>
    ),
  });
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
