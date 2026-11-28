import { AUD, AUDM, STATUS, TYPE } from '@/data/mockStudio.js';
import * as C from '@/hooks/useStudio.js';
import { Ic, Pill, artStyle, AUD_ICON } from './csShared.jsx';
import { SAMPLES } from '@/data/mockStudio.js';

const FILTERS = [['all', 'All posts'], ['draft', 'Drafts'], ['scheduled', 'Scheduled'], ['published', 'Published']];

/** Your content: toolbar (search + status filters) and the aligned post list (image, title, audience, status, actions). */
export default function PostsList({ s }) {
  const q = (s.postQuery || '').trim().toLowerCase();
  const counts = { all: s.posts.length, draft: 0, scheduled: 0, published: 0 };
  s.posts.forEach((p) => { if (counts[p.status] !== undefined) counts[p.status] += 1; });
  const visible = s.posts.filter((p) => (s.postFilter === 'all' || p.status === s.postFilter) && (!q || (p.title || '').toLowerCase().includes(q)));
  return (
    <div className="cs-stack">
      <div className="cs-toolbar">
        <label className="cs-search"><span className="cs-sr">Search posts</span><Ic n="search" size={16} /><input type="search" value={s.postQuery} onChange={(e) => C.set({ postQuery: e.target.value })} placeholder="Search your posts" /></label>
        <div className="cs-chips" role="group" aria-label="Filter posts by status">
          {FILTERS.map(([id, label]) => (
            <button type="button" key={id} className="cs-chip" aria-pressed={s.postFilter === id} onClick={() => C.set({ postFilter: id })}>{label} <span className="cs-chip__n">{counts[id]}</span></button>
          ))}
        </div>
      </div>
      <div className="cs-card cs-list">
        <div className="cs-lhead" aria-hidden="true"><span /><span>Post</span><span>Audience</span><span>Status</span><span>Actions</span></div>
        {visible.map((p) => {
          const t = TYPE[p.type]; const a = AUDM[p.audience] || AUD[0]; const st = STATUS[p.status] || STATUS.draft; const img = p.image;
          const fmt = p.type === 'general' ? (img ? (p.body ? 'Text + image' : 'Image') : 'Text') + (p.useRasi ? ' · Rasi sections' : '') : (p.format === 'rasi' ? 'Rasi & Nakshatra' : 'General prediction');
          return (
            <div className={`cs-row${s.highlight === p.id ? ' is-new' : ''}`} key={p.id}>
              <div className="cs-thumb">
                {img?.kind === 'sample' && <div className="cs-thumb__art" style={artStyle(SAMPLES[img.id].css)} />}
                {img?.kind === 'file' && <img src={img.url} alt="" />}
                {!img && <Ic n={p.type === 'general' ? 'text' : 'moon'} size={22} />}
              </div>
              <div className="cs-row__main">
                <div className="cs-row__title">{p.title || 'Untitled post'}</div>
                <div className="cs-row__meta"><span className={`cs-type t-${p.type}`}>{t.label}</span><span>{fmt}</span><span>Created {p.created}</span></div>
              </div>
              <div className="cs-row__aud"><Pill cls={`a-${p.audience}`}><Ic n={AUD_ICON[p.audience] || 'users'} size={13} />{a.label}</Pill></div>
              <div className="cs-row__st"><Pill cls={`s-${p.status}`}><i className="cs-dot" />{st.label}</Pill><span className="cs-row__when">{p.when}</span></div>
              <div className="cs-row__act">
                <button type="button" className="cs-btn cs-btn--sm" onClick={() => C.openPreview(p, 'studio')}><Ic n="eye" size={15} />Preview</button>
                <button type="button" className="cs-btn cs-btn--sm" onClick={() => C.editPost(p)}><Ic n="edit" size={15} />Edit</button>
                {p.status === 'published' && <><button type="button" className="cs-btn cs-btn--ghost cs-btn--sm" onClick={() => C.duplicatePost(p)}><Ic n="copy" size={15} />Duplicate</button>
                  <button type="button" className="cs-btn cs-btn--ghost cs-btn--sm" onClick={() => C.unpublishPost(p)}><Ic n="undo" size={15} />Unpublish</button></>}
                {p.status === 'scheduled' && <button type="button" className="cs-btn cs-btn--p cs-btn--sm" onClick={() => C.publishPostNow(p)}><Ic n="send" size={15} />Publish now</button>}
              </div>
            </div>
          );
        })}
        {visible.length === 0 && <div className="cs-empty">No posts here yet. <button type="button" className="cs-link" onClick={() => C.startNew('general')}>Create a post</button></div>}
      </div>
    </div>
  );
}
