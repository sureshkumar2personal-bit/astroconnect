import { AUD, AUDM, EVM, RASIS, SAMPLES, TYPE, fmtDate, fmtShort, fmtTime } from '@/data/mockStudio.js';
import { Ic, artStyle, AUD_ICON } from './csShared.jsx';

/** How a post appears in the AstroConnect User App feed (AD-144 live preview). */
export function previewFacts(d, from = 'editor') {
  const a = AUDM[d.audience] || AUD[0];
  const sched = d.publishMode === 'schedule';
  const isPrediction = d.type !== 'general';
  const showRasi = isPrediction ? d.format === 'rasi' : !!d.useRasi;
  const img = d.image;
  const schedLabel = `${fmtDate(d.schedDate)}${d.schedTime ? `, ${fmtTime(d.schedTime)}` : ''}`;
  return { a, sched, isPrediction, showRasi, img, schedLabel,
    when: from === 'editor' ? (sched ? `Scheduled · ${fmtShort(d.schedDate, d.schedTime)}` : 'Just now') : (d.when || 'Just now').split(' · ')[0],
    topic: d.type === 'special' ? d.specialTopic : d.type === 'event' && d.eventId ? EVM[d.eventId].ta : '' };
}

export default function PhonePost({ d, from = 'editor', compact }) {
  const f = previewFacts(d, from);
  const all = RASIS.map((r) => { const t = ((d.preds && d.preds[r.id]) || '').trim(); return { ...r, shown: t || 'Prediction not written yet', has: !!t }; });
  const written = all.filter((r) => r.has);
  const rasi = written.length ? written.slice(0, 4) : all.slice(0, 3);
  const more = 12 - rasi.length;
  const bodyStyle = { color: d.textColor, fontWeight: d.bold ? 700 : 400, fontStyle: d.italic ? 'italic' : 'normal', textDecoration: d.underline ? 'underline' : 'none',
    ...(d.bgColor !== '#FFFFFF' ? { background: d.bgColor, padding: 14, borderRadius: 12 } : {}) };
  return (
    <div className={`cs-phone${compact ? ' is-compact' : ''}`}>
      <div className="cs-phone__bar"><span className="cs-phone__brand"><Ic n="sparkle" size={16} />AstroConnect</span><Ic n="bell" size={18} /></div>
      <div className="cs-phone__tabs"><span className="is-on">For you</span><span>Following</span><span>Predictions</span></div>
      <article className="cs-post">
        <div className="cs-post__head">
          <span className="cs-post__av">AJ</span>
          <div className="cs-post__who"><b>[Your display name]</b><small>{f.when}</small></div>
          <span className={`cs-pill sm a-${d.audience}`}><Ic n={AUD_ICON[d.audience] || 'users'} size={12} />{f.a.short}</span>
        </div>
        <div className="cs-post__body">
          <div className="cs-post__tags"><span className={`cs-type t-${d.type}`}>{TYPE[d.type].label}</span>{f.topic && <span className="cs-type t-special" lang="ta">{f.topic}</span>}</div>
          <h2 className="cs-post__title">{d.title || 'Untitled post'}</h2>
          {d.contentDate && <span className="cs-post__date"><Ic n="calendar" size={14} />{fmtDate(d.contentDate)}{d.contentTime ? ` · ${fmtTime(d.contentTime)}` : ''}</span>}
          {d.body && d.body.trim() && d.mode !== 'image' && <p className="cs-post__text" style={bodyStyle}>{d.body}</p>}
        </div>
        {f.img && d.mode !== 'text' && (f.img.kind === 'sample' ? <div className="cs-post__img" style={artStyle(SAMPLES[f.img.id].css)} /> : <img className="cs-post__img" src={f.img.url} alt="Post" />)}
        {f.showRasi && (
          <div className="cs-post__rasi">
            <div className="cs-post__rtabs"><span className="is-on">All Rasis</span><span lang="ta">My Rasi: மேஷம்</span></div>
            {rasi.map((r) => (
              <div className="cs-post__r" key={r.id}>
                <div><b lang="ta">{r.ta}</b> <span>{r.en}</span></div>
                <small lang="ta">{r.nta}</small>
                <p className={r.has ? '' : 'is-empty'}>{r.shown}</p>
              </div>
            ))}
            {more > 0 && <span className="cs-post__more">See all 12 Rasis ({more} more)</span>}
          </div>
        )}
        <div className="cs-post__acts"><span><Ic n="heart" size={16} />Like</span><span><Ic n="chat" size={16} />Comment</span><span><Ic n="save" size={16} />Save</span><span><Ic n="share" size={16} />Share</span></div>
      </article>
    </div>
  );
}
