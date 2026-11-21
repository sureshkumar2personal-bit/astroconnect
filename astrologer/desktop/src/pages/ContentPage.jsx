import { useEffect } from 'react';
import useContent, { contentActions, contentStore } from '@shared/hooks/useContent.js';
import ContentList from '../components/content/ContentList.jsx';
import ContentEditor from '../components/content/ContentEditor.jsx';
import ContentPost from '../components/content/ContentPost.jsx';

// Benefits & Content — Content Management (spec 12_CONTENT_MANAGEMENT.md, AD-138 – AD-144). Routes:
//   #/content             General Posts · Subscriber Benefit Content · Templates · Delivery History
//   #/content/edit/new    editor for new content (opened from a Create / template button)
//   #/content/edit/<id>   editor for an existing post (AD-139 Edit)
//   #/content/p/<id>      post details (AD-78)
const LIST = { title: 'Benefits & Content', subtitle: 'General Posts and Subscriber Benefit Content · no video posts' };

/** Which screen the route shows, given the store. */
function screen(route, s) {
  const [sub, id] = route.parts;
  if (sub === 'p') return { kind: 'post', post: s.posts.find((p) => p.id === id) || null, id };
  if (sub === 'edit') {
    if (id && id !== 'new' && s.posts.some((p) => p.id === id)) return { kind: 'editor', loadId: s.ed?.id === id ? null : id };
    if (s.ed) return { kind: 'editor' };
  }
  return { kind: 'list' };
}

export function meta(route) {
  const sc = screen(route, contentStore.get());
  if (sc.kind === 'editor') return { title: 'Content editor', subtitle: 'Preview updates as you type, before Publish, Schedule or Draft', parent: '/content' };
  if (sc.kind === 'post') return sc.post ? { title: sc.post.title, subtitle: `${sc.post.id} · ${sc.post.kind}`, parent: '/content' } : { title: 'Post not found', parent: '/content' };
  return LIST;
}

export default function ContentPage({ route, mobile, ui }) {
  const s = useContent();
  const sc = screen(route, s);
  // Opening #/content/edit/<id> directly loads that post into the editor.
  useEffect(() => { if (sc.loadId) contentActions.startEdit(sc.loadId); }, [sc.loadId]);

  if (sc.kind === 'post') return <ContentPost post={sc.post} id={sc.id} ui={ui} />;
  if (sc.kind === 'editor') return sc.loadId || !s.ed ? <p className="muted" aria-busy="true">Loading…</p> : <ContentEditor s={s} mobile={mobile} ui={ui} />;
  return <ContentList s={s} />;
}
