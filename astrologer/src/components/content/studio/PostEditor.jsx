import { useEffect } from 'react';
import { AUD, BG_COLORS, EMOJIS, EVENTS, RASIS, SAMPLES, TEXT_COLORS, TYPES } from '@/data/mockStudio.js';
import * as C from '@/hooks/useStudio.js';
import { Ic, artStyle } from './csShared.jsx';
import PhonePost, { previewFacts } from './PhonePost.jsx';

const SPECIAL_TOPICS = ['Festival prediction', 'Important planetary event', 'Special astrology guidance', 'Transit-related prediction'];

/** Create / Edit post (AD-139 – AD-144): content type, title, format, text styling, image, 12-Rasi sections, audience,
 *  publishing, with a live User App preview. Save draft and Publish / Schedule keep the existing workflow. */
export default function PostEditor({ s, id }) {
  useEffect(() => { C.ensureEditor(id); }, [id]);
  const d = s.draft;
  if (!d) return null;
  const f = previewFacts(d, 'editor');
  const { a, sched, isPrediction, showRasi, img } = f;
  const patch = C.patchDraft;
  const val = (k) => (e) => patch({ [k]: e.target.value });
  const filled = RASIS.filter((r) => (d.preds?.[r.id] || '').trim()).length;
  const cdLabel = { general: 'Date & time', daily: 'Prediction date', weekly: 'Week starting', monthly: 'Month starting', special: 'Occasion date & time', event: 'Transit date & time' }[d.type];
  const bodyHeading = showRasi ? 'Introduction' : isPrediction ? 'Prediction' : 'Post content';
  const bodyPh = showRasi ? 'A short introduction shown above the Rasi sections (optional)…' : isPrediction ? 'Write your prediction…' : 'Share something with your audience…';
  const bodyStyle = { color: d.textColor, background: d.bgColor, fontWeight: d.bold ? 700 : 400, fontStyle: d.italic ? 'italic' : 'normal', textDecoration: d.underline ? 'underline' : 'none' };
  const swatch = (list, key) => list.map(([c, label]) => (
    <button type="button" key={c} className={`cs-swatch${d[key] === c ? ' is-on' : ''}`} aria-label={label} aria-pressed={d[key] === c} style={{ background: c }} onClick={() => patch({ [key]: c })} />
  ));
  const onFile = (e) => { const file = e.target.files?.[0]; if (file) patch({ image: { kind: 'file', url: URL.createObjectURL(file), name: file.name } }); e.target.value = ''; };
  return (
    <div className="cs-stack cs-stack--lg cs-ed">
      <div className="cs-edbar">
        <div className="cs-edbar__who">
          <h2 className="cs-h2">{d.id ? 'Edit post' : 'Create post'}</h2>
          {s.savedNote && <span className="cs-saved"><Ic n="check" size={14} />{s.savedNote}</span>}
        </div>
        <div className="cs-edbar__act">
          <button type="button" className="cs-btn" onClick={() => C.openPreview(null, 'editor')}><Ic n="eye" size={16} />Preview in User App</button>
          <button type="button" className="cs-btn" onClick={C.saveDraft}>Save draft</button>
          <button type="button" className="cs-btn cs-btn--p" onClick={C.publish}>{sched ? 'Schedule post' : 'Publish now'}</button>
        </div>
      </div>

      <div className="cs-edgrid">
        <div className="cs-edmain">
          <section className="cs-card cs-pad cs-stack cs-edtop" aria-labelledby="cs-ct-h">
            <h3 className="cs-h3" id="cs-ct-h">What are you creating?</h3>
            <div className="cs-types" role="radiogroup" aria-label="Content type">
              {TYPES.map((t) => (
                <button type="button" key={t.id} role="radio" aria-checked={d.type === t.id} className="cs-typeopt" onClick={() => C.pickType(t.id)}>
                  <span className="cs-typeopt__l"><i className={`cs-dot t-${t.id}`} />{t.label}</span><span className="cs-typeopt__s">{t.sub}</span>
                </button>
              ))}
            </div>
            {d.type === 'special' && (
              <div className="cs-stack cs-stack--sm">
                <label className="cs-field" htmlFor="cs-sp"><span>Special prediction topic</span></label>
                <input id="cs-sp" className="cs-input" type="text" value={d.specialTopic} onChange={val('specialTopic')} placeholder="e.g. Festival prediction, transit guidance…" />
                <div className="cs-chips">{SPECIAL_TOPICS.map((x) => <button type="button" key={x} className="cs-chip" aria-pressed={d.specialTopic === x} onClick={() => patch({ specialTopic: x })}>{x}</button>)}</div>
              </div>
            )}
            {d.type === 'event' && (
              <div className="cs-stack cs-stack--sm">
                <span className="cs-lbl">Astrology event</span>
                <div className="cs-chips">{EVENTS.map((ev) => <button type="button" key={ev.id} className="cs-chip" aria-pressed={d.eventId === ev.id} onClick={() => C.pickEvent(ev)}><span lang="ta">{ev.ta}</span></button>)}</div>
                <span className="cs-note cs-note--sm">Picking an event fills an empty title and introduction. You can change everything.</span>
              </div>
            )}
            <div className="cs-stack cs-stack--sm">
              <label className="cs-lbl" htmlFor="cs-title">Post title</label>
              <input id="cs-title" className={`cs-input cs-input--lg${s.err ? ' is-err' : ''}`} type="text" value={d.title} onChange={val('title')} placeholder="Give your post a clear title" />
              {s.err && <span className="cs-err" role="alert">{s.err}</span>}
            </div>
            {isPrediction && (
              <div className="cs-stack cs-stack--sm">
                <span className="cs-lbl">Prediction format</span>
                <div className="cs-seg" role="radiogroup" aria-label="Prediction format">
                  <button type="button" role="radio" aria-checked={d.format === 'rasi'} aria-pressed={d.format === 'rasi'} onClick={() => patch({ format: 'rasi' })}>Rasi &amp; Nakshatra</button>
                  <button type="button" role="radio" aria-checked={d.format === 'general'} aria-pressed={d.format === 'general'} onClick={() => patch({ format: 'general' })}>General prediction</button>
                </div>
                <span className="cs-note cs-note--sm">{d.format === 'rasi' ? "Write a separate prediction for each of the 12 Rasis. Leave any you don't need empty." : 'One prediction for everyone — no Rasi sections required.'}</span>
              </div>
            )}
          </section>

          <section className="cs-card cs-pad cs-stack cs-pc" aria-labelledby="cs-body-h">
            <div className="cs-sechead">
              <h3 className="cs-h3" id="cs-body-h">{bodyHeading}</h3>
              <div className="cs-seg" role="radiogroup" aria-label="Post format">
                {[['text', 'Text'], ['image', 'Image'], ['both', 'Text + Image']].map(([id2, label]) => <button type="button" key={id2} role="radio" aria-checked={d.mode === id2} aria-pressed={d.mode === id2} onClick={() => patch({ mode: id2 })}>{label}</button>)}
              </div>
            </div>
            {d.mode !== 'image' && (
              <div className="cs-stack cs-stack--sm cs-pc__text">
                <div className="cs-tools" role="toolbar" aria-label="Text styling">
                  <span className="cs-tools__g">
                    <button type="button" className="cs-tb" aria-pressed={d.bold} aria-label="Bold" onClick={() => patch({ bold: !d.bold })}><b>B</b></button>
                    <button type="button" className="cs-tb" aria-pressed={d.italic} aria-label="Italic" onClick={() => patch({ italic: !d.italic })}><i>I</i></button>
                    <button type="button" className="cs-tb" aria-pressed={d.underline} aria-label="Underline" onClick={() => patch({ underline: !d.underline })}><u>U</u></button>
                  </span>
                  <span className="cs-tools__g"><span className="cs-lbl">Text</span>{swatch(TEXT_COLORS, 'textColor')}</span>
                  <span className="cs-tools__g"><span className="cs-lbl">Background</span>{swatch(BG_COLORS, 'bgColor')}</span>
                  <button type="button" className="cs-btn cs-btn--sm" aria-expanded={s.emojiOpen} onClick={() => C.set({ emojiOpen: !s.emojiOpen })}><Ic n="smile" size={15} />Emoji</button>
                </div>
                {s.emojiOpen && <div className="cs-emojis" role="group" aria-label="Insert emoji">{EMOJIS.map(([ch, label]) => <button type="button" key={ch} aria-label={`Insert ${label}`} onClick={() => C.addEmoji(ch)}>{ch}</button>)}</div>}
                <label className="cs-sr" htmlFor="cs-body">{bodyHeading}</label>
                <textarea id="cs-body" className="cs-textarea" style={bodyStyle} rows={6} value={d.body} onChange={val('body')} placeholder={bodyPh} />
              </div>
            )}
            {d.mode !== 'text' && (
              <div className="cs-stack cs-stack--sm cs-pc__media">
                {img ? (
                  <div className="cs-imgprev">
                    {img.kind === 'sample' ? <div className="cs-imgprev__art" style={artStyle(SAMPLES[img.id].css)} /> : <img src={img.url} alt="Uploaded post" />}
                    <div className="cs-imgprev__bar">
                      <span className="cs-imgprev__name"><Ic n="image" size={14} />{img.kind === 'sample' ? SAMPLES[img.id].label : img.name || 'Uploaded image'}</span>
                      <span className="cs-imgprev__act">
                        <label className="cs-btn cs-btn--sm">Replace<input className="cs-sr" type="file" accept="image/*" onChange={onFile} /></label>
                        <button type="button" className="cs-btn cs-btn--sm" onClick={() => patch({ image: null })}><Ic n="x" size={14} />Remove</button>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="cs-drop">
                    <span className="cs-drop__ic"><Ic n="share" size={22} /></span>
                    <label className="cs-btn cs-btn--p">Upload image<input className="cs-sr" type="file" accept="image/*" onChange={onFile} /></label>
                    <span className="cs-note cs-note--sm">JPG or PNG. Or use a sample artwork:</span>
                    <div className="cs-samples">{Object.keys(SAMPLES).map((k) => <button type="button" key={k} className="cs-sample" aria-label={`Use ${SAMPLES[k].label}`} title={SAMPLES[k].label} style={artStyle(SAMPLES[k].css)} onClick={() => patch({ image: { kind: 'sample', id: k } })} />)}</div>
                  </div>
                )}
              </div>
            )}
            {d.type === 'general' && (
              <div className="cs-toggle">
                <div><b>Add Rasi &amp; Nakshatra sections</b><span className="cs-note cs-note--sm">Optional. Adds a section for each of the 12 Rasis below your text.</span></div>
                <button type="button" role="switch" aria-checked={!!d.useRasi} aria-label="Add Rasi and Nakshatra sections" className="cs-switch" onClick={() => patch({ useRasi: !d.useRasi })}><i /></button>
              </div>
            )}
          </section>

          {showRasi && (
            <section className="cs-card cs-pad cs-stack" aria-labelledby="cs-rasi-h">
              <div className="cs-sechead">
                <div><h3 className="cs-h3" id="cs-rasi-h">Rasi &amp; Nakshatra predictions</h3><span className="cs-note cs-note--sm">{filled} of 12 Rasis written · Nakshatras are listed with their pada (quarter) where a Nakshatra spans two Rasis</span></div>
                <div className="cs-chips"><button type="button" className="cs-btn cs-btn--sm" onClick={() => C.setAll(Object.fromEntries(RASIS.map((r) => [r.id, true])))}>Expand all</button><button type="button" className="cs-btn cs-btn--sm" onClick={() => C.setAll({})}>Collapse all</button></div>
              </div>
              <div className="cs-progress"><i style={{ width: `${Math.round((filled / 12) * 100)}%` }} /></div>
              <div className="cs-rasis">
                {RASIS.map((r) => {
                  const open = !!d.open?.[r.id]; const text = d.preds?.[r.id] || '';
                  return (
                    <div className={`cs-rasi${open ? ' is-open' : ''}`} key={r.id}>
                      <button type="button" className="cs-rasi__h" aria-expanded={open} onClick={() => C.setOpen(r.id)}>
                        <span className="cs-rasi__t"><span className="cs-rasi__n"><b lang="ta">{r.ta}</b><span>– {r.en}</span>{text.trim() && <span className="cs-pill sm s-published"><Ic n="check" size={11} />Written</span>}</span>
                          <span className="cs-rasi__s" lang="ta"><Ic n="star" size={12} />{r.nta}</span><span className="cs-rasi__e">{r.nen}</span></span>
                        <Ic n="chevronDown" size={18} className="cs-rasi__chev" />
                      </button>
                      {open && <div className="cs-rasi__b"><label className="cs-sr" htmlFor={`cs-pred-${r.id}`}>Prediction for {r.en}</label><textarea id={`cs-pred-${r.id}`} className="cs-textarea" rows={4} value={text} onChange={(e) => C.setPred(r.id, e.target.value)} placeholder={`Write the prediction for ${r.ta} (${r.en})…`} /></div>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <aside className="cs-aside" aria-label="Audience, publishing and live preview">
          <section className="cs-card cs-pad cs-stack" aria-labelledby="cs-aud-h">
            <div><h3 className="cs-h3" id="cs-aud-h">Who can see this?</h3><span className="cs-note cs-note--sm">Choose the audience for this post.</span></div>
            <div className="cs-auds" role="radiogroup" aria-labelledby="cs-aud-h">
              {AUD.map((o) => (
                <button type="button" key={o.id} role="radio" aria-checked={d.audience === o.id} className="cs-aud" onClick={() => patch({ audience: o.id })}>
                  <span className="cs-radio"><i /></span><span className="cs-aud__t"><b>{o.label}</b><small>{o.sub}</small></span>
                </button>
              ))}
            </div>
          </section>
          <section className="cs-card cs-pad cs-stack" aria-labelledby="cs-pub-h">
            <h3 className="cs-h3" id="cs-pub-h">Publishing</h3>
            <div className="cs-seg cs-seg--2" role="radiogroup" aria-labelledby="cs-pub-h">
              <button type="button" role="radio" aria-checked={!sched} aria-pressed={!sched} onClick={() => patch({ publishMode: 'now' })}>Publish now</button>
              <button type="button" role="radio" aria-checked={sched} aria-pressed={sched} onClick={() => patch({ publishMode: 'schedule' })}>Schedule</button>
            </div>
            {sched && <div className="cs-two2"><label className="cs-field"><span>Date</span><input type="date" value={d.schedDate} onChange={val('schedDate')} /></label><label className="cs-field"><span>Time</span><input type="time" value={d.schedTime} onChange={val('schedTime')} /></label></div>}
            <div className="cs-info"><Ic n="info" size={16} /><span>{sched ? `Goes live on ${f.schedLabel} for ${a.label}.` : `Goes live immediately for ${a.label}.`}</span></div>
            <div className="cs-stack cs-stack--sm"><span className="cs-lbl">{cdLabel} <span className="cs-opt">(optional)</span></span>
              <div className="cs-two2"><input type="date" aria-label="Content date" className="cs-input" value={d.contentDate} onChange={val('contentDate')} /><input type="time" aria-label="Content time" className="cs-input" value={d.contentTime} onChange={val('contentTime')} /></div>
              <span className="cs-note cs-note--sm">Shown on the post, e.g. the day a prediction applies to.</span></div>
            <div className="cs-stack cs-stack--sm">
              <button type="button" className="cs-btn cs-btn--p cs-btn--block" onClick={C.publish}>{sched ? 'Schedule post' : 'Publish now'}</button>
              <div className="cs-two2"><button type="button" className="cs-btn" onClick={C.saveDraft}>Save draft</button><button type="button" className="cs-btn" onClick={() => C.openPreview(null, 'editor')}>Preview</button></div>
            </div>
          </section>
          <section className="cs-card cs-pad cs-livepv" aria-labelledby="cs-lp-h">
            <div className="cs-livepv__head"><h3 className="cs-h3" id="cs-lp-h">Live preview</h3><span className="cs-note cs-note--sm">Updates as you type</span></div>
            <PhonePost d={d} from="editor" compact />
          </section>
        </aside>
      </div>
    </div>
  );
}
