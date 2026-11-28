import { EVENTS, PRED_TPL, TYPE } from '@/data/mockStudio.js';
import * as C from '@/hooks/useStudio.js';
import { Ic } from './csShared.jsx';

/** Templates: optional shortcuts (AD-141, AD-142) — each opens the same Create Post editor, pre-filled. */
export default function TemplatesView() {
  return (
    <div className="cs-stack cs-stack--lg">
      <section className="cs-stack" aria-labelledby="cs-pt-h">
        <h2 className="cs-h2" id="cs-pt-h">Prediction templates</h2>
        <div className="cs-grid cs-grid--tpl">
          {['daily', 'weekly', 'monthly', 'special'].map((id) => (
            <button type="button" key={id} className="cs-card cs-tpl" onClick={() => C.startPrediction(id)}>
              <span className={`cs-tpl__ic t-${id}`}><Ic n={id === 'special' ? 'sparkle' : 'calendar'} size={20} /></span>
              <span className="cs-tpl__t">{TYPE[id].label}</span>
              <span className="cs-tpl__d">{PRED_TPL[id].desc}</span>
              <span className="cs-tpl__go">Use template <Ic n="chevronRight" size={15} /></span>
            </button>
          ))}
        </div>
      </section>
      <section className="cs-stack" aria-labelledby="cs-et-h">
        <h2 className="cs-h2" id="cs-et-h">Astrology event templates</h2>
        <div className="cs-grid cs-grid--ev">
          {EVENTS.map((ev) => (
            <div className="cs-card cs-ev" key={ev.id}>
              <div className="cs-ev__banner" style={{ background: ev.bg }}>
                <i className="cs-ev__orbit" style={{ borderColor: ev.color }} />
                <i className="cs-ev__planet" style={{ background: ev.color, width: ev.size, height: ev.size, right: 60 - ev.size / 2, top: 55 - ev.size / 2 }} />
                <span className="cs-ev__tag" style={{ '--ev': ev.color }}>{ev.tag}</span>
              </div>
              <div className="cs-ev__body">
                <span className="cs-ev__ta" lang="ta">{ev.ta}</span>
                <span className="cs-ev__en">{ev.en}</span>
                <span className="cs-ev__d">Intro + 12 Rasi sections · Nakshatra listed</span>
                <div className="cs-ev__act">
                  <button type="button" className="cs-btn cs-btn--p cs-btn--sm" onClick={() => C.startEvent(ev)}>Use template</button>
                  <button type="button" className="cs-btn cs-btn--sm" onClick={() => C.previewEvent(ev)}>Preview</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
