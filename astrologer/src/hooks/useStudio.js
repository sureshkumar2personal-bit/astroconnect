import { createStore, useStore } from '@/lib/store.js';
import { navigate } from '@/lib/router.js';
import {
  AUD, AUDM, EVM, PRED_TPL, TYPE, BENEFITS, SERVICES, TIERS, RANGE, TX, SEED_POSTS, SEED_HISTORY,
  blank, eventDraft, fmtShort,
} from '@/data/mockStudio.js';

// Benefits & Content state (spec 12_CONTENT_MANAGEMENT.md, AD-138 – AD-144, AD-179 – AD-183). Prototype only:
// nothing is published, delivered or uploaded; state lives for the browser session. The editor draft is kept in
// session storage so a reload returns to the same editor (an uploaded image is not kept).
// Routes: #/content (Content Studio) · #/content/benefits (Benefits & Offers) · #/content/edit/new|<id> · #/content/preview

const DRAFT_KEY = 'cs-post-draft';
function loadDraft() {
  try { const d = JSON.parse(window.sessionStorage.getItem(DRAFT_KEY) || 'null'); return d && typeof d === 'object' && d.type ? d : null; } catch { return null; }
}

export const studioStore = createStore({
  contentTab: 'posts', postFilter: 'all', postQuery: '',
  posts: SEED_POSTS, history: SEED_HISTORY,
  draft: loadDraft(), previewFrom: 'editor', emojiOpen: false, savedNote: '', err: '', highlight: '',
  tier: 'gold', benefits: JSON.parse(JSON.stringify(BENEFITS)), editing: '', editType: '', editDetail: '',
  range: '30d', customFrom: '2026-11-01', customTo: '2026-11-27',
  txQuery: '', txRange: 'all', txOffer: 'all', txService: 'all', txStatus: 'all', txPage: 1,
});

const S = () => studioStore.get();
const patchS = (p) => studioStore.patch(p);
studioStore.subscribe(() => {
  try {
    const d = studioStore.get().draft;
    if (!d) { window.sessionStorage.removeItem(DRAFT_KEY); return; }
    const image = d.image && d.image.kind === 'file' ? null : d.image;
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...d, image }));
  } catch { /* storage unavailable: the draft just isn't kept across reloads */ }
});

let notify = () => {};
/** The page binds its toast (ui.toast) here so actions can confirm what they did. */
export const bindToast = (fn) => { notify = fn || (() => {}); };

export const PATH = { studio: '/content', benefits: '/content/benefits', preview: '/content/preview', edit: (id) => `/content/edit/${id}` };

// ---------- editor ----------
const predTpl = (type) => { const t = PRED_TPL[type]; return { ...blank(type), title: t.title, body: t.body, specialTopic: type === 'special' ? 'Festival prediction' : '' }; };
export function openEditor(draft, id) {
  patchS({ draft, savedNote: '', err: '', emojiOpen: false });
  navigate(PATH.edit(id || 'new'));
}
export const startNew = (type, extra) => openEditor({ ...blank(type), ...(extra || {}) });
export const startPrediction = (type) => openEditor(predTpl(type));
export const startEvent = (ev) => openEditor(eventDraft(ev));
export const editPost = (post) => openEditor({ ...post }, post.id);
/** Make the editor ready for #/content/edit/<id>: load that post, or a blank post for "new" when no draft exists. */
export function ensureEditor(id) {
  const s = S();
  if (id && id !== 'new') {
    if (s.draft?.id === id) return;
    const p = s.posts.find((x) => x.id === id);
    if (p) patchS({ draft: { ...p }, savedNote: '', err: '' });
  } else if (!s.draft) patchS({ draft: blank('general'), savedNote: '', err: '' });
}
export const patchDraft = (p) => patchS((s) => ({ draft: { ...s.draft, ...p }, err: '' }));
export const setOpen = (id) => patchS((s) => ({ draft: { ...s.draft, open: { ...s.draft.open, [id]: !s.draft.open?.[id] } } }));
export const setPred = (id, v) => patchS((s) => ({ draft: { ...s.draft, preds: { ...s.draft.preds, [id]: v } } }));
export const setAll = (open) => patchS((s) => ({ draft: { ...s.draft, open } }));
export const pickType = (id) => {
  const d = S().draft; const p = { type: id };
  if (id === 'general') p.format = 'general'; else if (d.type === 'general') p.format = 'rasi';
  patchDraft(p);
};
export const pickEvent = (ev) => { const d = S().draft; const t = eventDraft(ev); patchDraft({ eventId: ev.id, title: d.title || t.title, body: d.body || t.body }); };
export const addEmoji = (ch) => patchS((s) => ({ draft: { ...s.draft, body: (s.draft.body || '') + ch } }));
export const closeEditor = () => navigate(PATH.studio);

function upsert(status) {
  const st = S(); const dd = st.draft;
  const id = dd.id || `p${Date.now()}`;
  const when = status === 'published' ? 'Published just now · 0 views' : status === 'scheduled' ? `Scheduled ${fmtShort(dd.schedDate, dd.schedTime)}` : 'Draft saved just now';
  const post = { ...dd, id, status, created: dd.created || '27 Nov 2026', when };
  const exists = st.posts.some((p) => p.id === id);
  return { post, posts: exists ? st.posts.map((p) => (p.id === id ? post : p)) : [post, ...st.posts] };
}
export function saveDraft() {
  const r = upsert('draft');
  patchS((s) => ({ posts: r.posts, draft: { ...s.draft, id: r.post.id, created: r.post.created }, savedNote: 'Draft saved · just now', err: '' }));
  notify('Draft saved');
}
/** Publish now / Schedule. Needs a title (error shown at the title); on success returns to Content Studio. */
export function publish() {
  const dd = S().draft;
  if (!dd.title || !dd.title.trim()) {
    patchS({ err: 'Add a post title before publishing.' });
    if (!/\/content\/edit\//.test(window.location.hash)) navigate(PATH.edit(dd.id || 'new'));
    try { window.scrollTo(0, 0); } catch { /* no scroll */ }
    return;
  }
  const status = dd.publishMode === 'schedule' ? 'scheduled' : 'published';
  const r = upsert(status);
  const a = AUDM[dd.audience] || AUD[0];
  patchS({ posts: r.posts, draft: null, contentTab: 'posts', postFilter: 'all', highlight: r.post.id, err: '', savedNote: '' });
  navigate(PATH.studio);
  notify(status === 'scheduled' ? `Scheduled for ${fmtShort(dd.schedDate, dd.schedTime)} · ${a.label}` : `Published to ${a.label}`);
}
export function previewEvent(ev) { patchS({ draft: eventDraft(ev), previewFrom: 'studio' }); navigate(PATH.preview); }
export function openPreview(post, from) {
  if (post) patchS({ draft: { ...post } });
  patchS({ previewFrom: from });
  navigate(PATH.preview);
}

// ---------- posts ----------
const setPost = (id, fn) => patchS((s) => ({ posts: s.posts.map((p) => (p.id === id ? fn(p) : p)), highlight: id }));
export function duplicatePost(p) {
  const c = { ...p, id: `p${Date.now()}`, status: 'draft', title: `${p.title} (copy)`, created: '27 Nov 2026', when: 'Duplicated just now' };
  patchS((s) => ({ posts: [c, ...s.posts], highlight: c.id })); notify('Copy saved to drafts');
}
export function unpublishPost(p) { setPost(p.id, (x) => ({ ...x, status: 'draft', when: 'Unpublished just now' })); notify('Post moved to drafts'); }
export function publishPostNow(p) { setPost(p.id, (x) => ({ ...x, status: 'published', publishMode: 'now', when: 'Published just now · 0 views' })); notify('Post published'); }
export function retryDelivery(h) {
  patchS((s) => ({ history: s.history.map((x) => (x.id === h.id ? { ...x, status: 'retrying', detail: 'Retry queued for the failed deliveries' } : x)) }));
  notify('Notification retry queued');
}
export const set = (p) => patchS(p);

// ---------- benefits ----------
const nameOf = (id) => SERVICES.find((x) => x.id === id).name;
export function toggleBenefit(tier, svc) {
  const nb = JSON.parse(JSON.stringify(S().benefits)); const on = !nb[tier][svc].on; nb[tier][svc].on = on;
  const tn = TIERS.find((t) => t.id === tier).name;
  patchS({ benefits: nb }); notify(`${tn} · ${nameOf(svc)} benefit turned ${on ? 'on' : 'off'}`);
}
export function editBenefit(svc) {
  const b = S().benefits[S().tier][svc];
  patchS({ editing: svc, editType: b.type === 'Not set' ? 'Free benefit' : b.type, editDetail: b.detail === '—' ? '' : b.detail });
}
export function saveBenefit() {
  const st = S(); const nb = JSON.parse(JSON.stringify(st.benefits));
  nb[st.tier][st.editing] = { on: true, type: st.editType, detail: st.editDetail.trim() || '—' };
  const tn = TIERS.find((t) => t.id === st.tier).name;
  patchS({ benefits: nb, editing: '' }); notify(`${tn} · ${nameOf(st.editing)} benefit saved`);
}

// ---------- offer transactions ----------
export function filteredTx(s) {
  const q = (s.txQuery || '').trim().toLowerCase();
  return TX.filter((t) => {
    if (q && `${t.customer} ${t.offer}`.toLowerCase().indexOf(q) < 0) return false;
    if (s.txRange === 'today' && t.daysAgo !== 0) return false;
    if (s.txRange === '7d' && t.daysAgo >= 7) return false;
    if (s.txRange === '30d' && t.daysAgo >= 30) return false;
    if (s.txOffer !== 'all' && t.offerId !== s.txOffer) return false;
    if (s.txService !== 'all' && t.service !== s.txService) return false;
    if (s.txStatus !== 'all' && t.status !== s.txStatus) return false;
    return true;
  });
}
export { RANGE, TYPE, EVM };

export default function useStudio() {
  return useStore(studioStore);
}
