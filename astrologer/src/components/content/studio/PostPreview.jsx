import * as C from '@/hooks/useStudio.js';
import { Ic, AUD_ICON } from './csShared.jsx';
import PhonePost, { previewFacts } from './PhonePost.jsx';

/** User App preview of the post being edited, or of a post chosen from the list. The page's Back button returns to
 *  the editor (opened from the editor) or to Content Studio (opened from the list); see ContentPage meta. */
export default function PostPreview({ s }) {
  const d = s.draft;
  const from = s.previewFrom;
  const f = previewFacts(d, from);
  const fmt = f.isPrediction ? (d.format === 'rasi' ? 'Rasi & Nakshatra' : 'General prediction') : `${d.mode === 'text' ? 'Text' : d.mode === 'image' ? 'Image' : 'Text + image'}${d.useRasi ? ' + Rasi sections' : ''}`;
  const facts = [
    ['template', 'Type', C.TYPE[d.type].label],
    [d.mode === 'text' ? 'text' : 'image', 'Format', fmt],
    [AUD_ICON[d.audience] || 'users', 'Audience', f.a.label],
    [f.sched ? 'calendar' : 'send', 'Delivery', f.sched ? `Scheduled · ${f.schedLabel}` : 'Publish immediately'],
  ];
  return (
    <div className="cs-stack cs-stack--lg cs-pv">
      <h2 className="cs-h2">User App preview</h2>
      <div className="cs-pvgrid">
        <section className="cs-card cs-pvshow" aria-label="Post as shown in the User App">
          <div className="cs-device"><PhonePost d={d} from={from} /></div>
        </section>
        <aside className="cs-stack cs-pvside" aria-label="Post summary">
          <div className="cs-card cs-pvside__card">
            <div className="cs-pvside__head"><h3 className="cs-h3">Post summary</h3><span className={`cs-type t-${d.type}`}>{C.TYPE[d.type].label}</span></div>
            <div className="cs-pvside__body cs-stack">
              <p className="cs-pvside__title">{d.title || 'Untitled post'}</p>
              <ul className="cs-pvfacts">
                {facts.map(([ic, label, value]) => (
                  <li key={label}><span className="cs-pvfacts__ic"><Ic n={ic} size={16} /></span><span className="cs-pvfacts__t"><small>{label}</small><b>{value}</b></span></li>
                ))}
              </ul>
              <div className="cs-info"><Ic n={d.audience === 'public' ? 'globe' : 'lock'} size={16} /><span>{d.audience === 'public' ? 'Visible to everyone in the User App feed.' : `People outside ${f.a.label} see the title with a lock and an option to follow or subscribe.`}</span></div>
            </div>
          </div>
          {from === 'editor'
            ? <button type="button" className="cs-btn cs-btn--p cs-btn--block" onClick={C.publish}>{f.sched ? 'Schedule post' : 'Publish now'}</button>
            : <button type="button" className="cs-btn cs-btn--block" onClick={() => C.editPost(d)}>Edit this post</button>}
        </aside>
      </div>
    </div>
  );
}
