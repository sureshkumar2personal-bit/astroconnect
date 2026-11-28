import * as C from '@/hooks/useStudio.js';
import { Ic } from './csShared.jsx';
import PostsList from './PostsList.jsx';
import TemplatesView from './TemplatesView.jsx';
import HistoryView from './HistoryView.jsx';

const SUBTABS = [['posts', 'Your content'], ['templates', 'Templates'], ['history', 'Delivery history']];

/** Content Studio: the Create a post card (with start options) and Your content / Templates / Delivery history. */
export default function StudioContent({ s }) {
  const starts = [
    ['Text post', 'text', () => C.startNew('general', { mode: 'text' })],
    ['Image post', 'image', () => C.startNew('general', { mode: 'both' })],
    ['Daily prediction', 'calendar', () => C.startPrediction('daily')],
    ['Weekly', 'calendar', () => C.startPrediction('weekly')],
    ['Monthly', 'calendar', () => C.startPrediction('monthly')],
    ['Special', 'sparkle', () => C.startPrediction('special')],
  ];
  return (
    <div className="cs-stack cs-stack--lg">
      <section className="cs-card cs-composer" aria-label="Create a post">
        <div className="cs-composer__top">
          <button type="button" className="cs-composer__plus" aria-label="Create a new post" onClick={() => C.startNew('general')}><Ic n="plus" size={24} /></button>
          <button type="button" className="cs-composer__prompt" onClick={() => C.startNew('general')}>Create a post — share a prediction, an update or an image…</button>
          <button type="button" className="cs-btn cs-btn--p" onClick={() => C.startNew('general')}><Ic n="plus" size={17} />Create Post</button>
        </div>
        <div className="cs-composer__start">
          <span className="cs-composer__lbl">Start with</span>
          {starts.map(([label, ic, go]) => <button type="button" key={label} className="cs-btn cs-btn--sm cs-btn--soft" onClick={go}><Ic n={ic} size={15} />{label}</button>)}
          <button type="button" className="cs-btn cs-btn--sm cs-btn--soft" onClick={() => C.set({ contentTab: 'templates' })}><Ic n="template" size={15} />Use a template</button>
        </div>
      </section>

      <div className="cs-stack">
        <div className="cs-subtabs" role="tablist" aria-label="Content Studio views">
          {SUBTABS.map(([id, label]) => (
            <button type="button" role="tab" key={id} className="cs-subtab" aria-selected={s.contentTab === id} onClick={() => C.set({ contentTab: id })}>
              {label}{id === 'posts' && <span className="cs-chip__n">{s.posts.length}</span>}
            </button>
          ))}
        </div>
        {s.contentTab === 'posts' && <PostsList s={s} />}
        {s.contentTab === 'templates' && <TemplatesView />}
        {s.contentTab === 'history' && <HistoryView s={s} />}
      </div>
    </div>
  );
}
