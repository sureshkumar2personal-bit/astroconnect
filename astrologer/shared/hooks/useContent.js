import { createStore, useStore } from '../lib/store.js';
import { TODAY, fmtDate } from '../lib/format.js';
import { RASI, SPECIAL, contentSeed } from '../data/mockContent.js';

// Benefits & Content state and rules (spec 12_CONTENT_MANAGEMENT.md, AD-138 – AD-144).
// Prototype only: nothing is published, scheduled or uploaded; state resets on reload.

export const contentStore = createStore(contentSeed);

const isRasiKind = (kind) => /Daily|Weekly|Monthly/.test(kind); // 12-Rasi template (AD-141)
export const isBenefit = (kind) => /Prediction/.test(kind); // Subscriber Benefit Content (AD-140)

const setEd = (part) => contentStore.patch((s) => ({ ed: { ...s.ed, ...part } }));
const nextId = (posts) => `PST-${Math.max(121, ...posts.map((p) => Number(p.id.slice(4)) || 0)) + 1}`;

/** Validate the editor for a save action; returns an error message or ''. */
export function validate(e, action) {
  if (!e.title.trim()) return 'Add a title.';
  if (!e.aud.length) return 'Choose an audience.';
  if (action !== 'Draft' && !e.rasi && !e.text.trim() && !e.img) return 'Add text or an image.';
  return '';
}

export const contentActions = {
  setTab: (tab) => contentStore.patch({ tab }),
  setPv: (pv) => contentStore.patch({ pv }),
  toggleRecur: (k) => contentStore.patch((s) => ({ recur: { ...s.recur, [k]: !s.recur[k] } })),

  /** Open a blank editor for a General Post, a prediction, a special template or custom content. */
  startNew(kind) {
    const r = isRasiKind(kind);
    contentStore.patch({
      pv: 'editor',
      ed: {
        id: null, kind, fmt: 'Text', text: '', img: '', when: '2026-11-21T07:00',
        title: r ? `${kind} · ${fmtDate(TODAY)}` : SPECIAL.includes(kind) ? `${kind} 2026` : '',
        aud: r ? ['Gold'] : ['Public'],
        rasi: r ? RASI.map(() => '') : null,
      },
    });
  },
  /** Open an existing post in the editor (AD-139 Edit). */
  startEdit(id) {
    const p = contentStore.get().posts.find((x) => x.id === id);
    if (!p) return;
    contentStore.patch({
      pv: 'editor',
      ed: {
        id: p.id, kind: p.kind, title: p.title, text: p.text, img: p.img || '', aud: p.aud.split(', ').filter(Boolean),
        when: p.at.slice(0, 16), rasi: p.rasi ? [...p.rasi] : null, fmt: p.fmt === 'Image' ? 'Image' : 'Text',
      },
    });
  },
  set: setEd,
  setRasi: (i, v) => contentStore.patch((s) => ({ ed: { ...s.ed, rasi: s.ed.rasi.map((x, j) => (j === i ? v : x)) } })),
  toggleAud: (a) => contentStore.patch((s) => ({ ed: { ...s.ed, aud: s.ed.aud.includes(a) ? s.ed.aud.filter((x) => x !== a) : [...s.ed.aud, a] } })),

  /** Save Draft / Schedule / Publish Now. Returns an error message, or '' on success. */
  save(action) {
    const s = contentStore.get();
    const e = s.ed;
    const err = validate(e, action);
    if (err) return err;
    const old = e.id ? s.posts.find((p) => p.id === e.id) : null;
    const post = {
      id: old ? old.id : nextId(s.posts), kind: e.kind, fmt: e.rasi ? 'Text + Image' : e.fmt, title: e.title.trim(), text: e.text,
      img: e.img, rasi: e.rasi, aud: e.aud.join(', '), st: action, at: action === 'Scheduled' ? e.when : TODAY.toISOString(),
      views: old?.views || 0, likes: old?.likes || 0, comments: old?.comments || 0,
    };
    const posts = old ? s.posts.map((p) => (p.id === old.id ? post : p)) : [post, ...s.posts];
    const delivery = action === 'Scheduled' && e.rasi
      ? [{ content: post.title, tier: post.aud, st: 'Pending', at: e.when }, ...s.delivery] : s.delivery;
    contentStore.patch({ posts, delivery, ed: null, tab: 'posts' });
    return '';
  },
  remove: (id) => contentStore.patch((s) => ({ posts: s.posts.filter((p) => p.id !== id) })),
};

export default function useContent() {
  return useStore(contentStore);
}
