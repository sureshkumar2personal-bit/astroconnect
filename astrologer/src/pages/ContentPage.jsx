import { useEffect, useRef } from 'react';
import { navigate } from '@/lib/router.js';
import useStudio, { bindToast, PATH, set as setStudio, studioStore } from '@/hooks/useStudio.js';
import StudioContent from '@/components/content/studio/StudioContent.jsx';
import BenefitsOffers from '@/components/content/studio/BenefitsOffers.jsx';
import PostEditor from '@/components/content/studio/PostEditor.jsx';
import PostPreview from '@/components/content/studio/PostPreview.jsx';
import { Ic } from '@/components/content/studio/csShared.jsx';

// Benefits & Content (spec 12_CONTENT_MANAGEMENT.md, AD-138 – AD-144; reference "Benefits & Content"). Routes:
//   #/content               Content Studio (create a post · your content · templates · delivery history)
//   #/content/benefits      Benefits & Offers (subscriber benefits · offer performance · offer transactions)
//   #/content/edit/new      create a post          #/content/edit/<id>   edit a post (Save draft · Publish / Schedule)
//   #/content/preview       User App preview of the post being edited or chosen from the list
//   #/content/p/<id>        a post's preview (links from AD-78)
// On a phone, swiping left / right switches between Content Studio and Benefits & Offers. Back goes to Home from the
// two main tabs and to Content Studio from the editor. From the preview, Back returns to the same post's editor
// when the preview was opened from the editor, otherwise to Content Studio.
export const meta = (route) => {
  const p0 = route.parts[0];
  if (p0 === 'preview') {
    const { previewFrom, draft } = studioStore.get();
    return { title: 'Benefits & Content', parent: previewFrom === 'editor' && draft ? PATH.edit(draft.id || 'new') : PATH.studio };
  }
  return { title: 'Benefits & Content', parent: p0 === 'edit' || p0 === 'p' ? PATH.studio : '/' };
};

const TABS = [['content', 'Content Studio', 'edit', PATH.studio], ['benefits', 'Benefits & Offers', 'users', PATH.benefits]];

export default function ContentPage({ route, mobile, ui }) {
  const s = useStudio();
  const [p0, p1] = route.parts;
  const touch = useRef(null);
  useEffect(() => { bindToast(ui.toast); return () => bindToast(null); }, [ui]);

  // Old post links (#/content/p/<id>) open that post's preview.
  const linked = p0 === 'p' ? s.posts.find((x) => x.id === p1) : null;
  useEffect(() => {
    if (p0 !== 'p') return;
    if (linked) { setStudio({ draft: { ...linked }, previewFrom: 'studio' }); navigate(PATH.preview); } else navigate(PATH.studio);
  }, [p0, linked]);
  // The preview needs a post: with none (e.g. after a reload) go back to Content Studio.
  useEffect(() => { if (p0 === 'preview' && !s.draft) navigate(PATH.studio); }, [p0, s.draft]);

  const frame = (node) => <div className={`cs${mobile ? ' cs--m' : ''}`}><div className="cs-cq">{node}</div></div>;
  if (p0 === 'edit') return frame(<PostEditor s={s} id={p1 || 'new'} />);
  if (p0 === 'preview') return s.draft ? frame(<PostPreview s={s} />) : null;
  if (p0 === 'p') return null;

  const tab = p0 === 'benefits' ? 'benefits' : 'content';
  const go = (id) => navigate(id === 'benefits' ? PATH.benefits : PATH.studio);
  // Swipe between the two tabs (phones). Wide tables and the like opt out with data-noswipe.
  const onTouchStart = (e) => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY, skip: !!e.target.closest('[data-noswipe], input, textarea, select') }; };
  const onTouchEnd = (e) => {
    const st = touch.current; touch.current = null;
    if (!st || st.skip) return;
    const t = e.changedTouches[0]; const dx = t.clientX - st.x; const dy = t.clientY - st.y;
    if (Math.abs(dx) < 70 || Math.abs(dy) > 45 || Math.abs(dx) < Math.abs(dy) * 2) return;
    if (dx < 0 && tab === 'content') go('benefits');
    else if (dx > 0 && tab === 'benefits') go('content');
  };
  return (
    <div className={`cs${mobile ? ' cs--m' : ''}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="cs-cq">
        <div className="cs-tabs" role="tablist" aria-label="Benefits and Content sections">
          {TABS.map(([id, label, ic]) => (
            <button type="button" role="tab" key={id} className="cs-tab" aria-selected={tab === id} onClick={() => go(id)}><Ic n={ic} size={18} />{label}</button>
          ))}
        </div>
        {tab === 'content' ? <StudioContent s={s} /> : <BenefitsOffers s={s} />}
      </div>
    </div>
  );
}
