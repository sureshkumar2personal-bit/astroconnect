import { useEffect, useRef, useState } from 'react';
import { DATE_FORMATS, DATE_SAMPLES, LANGUAGES, TODAY } from '@/data/mockSettings.js';
import { fmtDate, settingsActions } from '@/hooks/useSettings.js';
import Ic from './stIcons.jsx';

// Language & Region (AD-154): app language, date format, time zone. The time zone is fixed to IST:
// the effect of changing it is undecided (AP-15-01), so no change control is offered (SET-03).
export default function LanguageRegion({ s, ui }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const lang = LANGUAGES.find((l) => l.id === s.lang) || LANGUAGES[0];
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);
  const pick = (l) => {
    setOpen(false);
    if (l.id === s.lang) return;
    settingsActions.setValue('lang', l.id);
    ui.toast(`App language set to ${l.label}`);
  };
  return (
    <>
      <div className="st-card">
        <section className="st-card__sec">
          <div className="st-card__h"><span className="st-gt">App language</span></div>
          <div className="st-card__body">
            <div><div className="st-rt-t" id="st-lang-label">Display language</div><div className="st-rt-d">Used for menus, labels and notifications in the app.</div></div>
            <div className="st-selwrap" ref={wrap}>
              <button type="button" className="st-select" aria-haspopup="listbox" aria-expanded={open} aria-labelledby="st-lang-label" data-open={open} onClick={() => setOpen(!open)}>
                <Ic n="globe" size={18} />
                <span className="st-select__v"><b>{lang.label}</b>{lang.native && <span>{lang.native}</span>}</span>
                <Ic n="chevronDown" size={16} />
              </button>
              {open && (
                <div className="st-menu" role="listbox" aria-labelledby="st-lang-label">
                  {LANGUAGES.map((l) => (
                    <button type="button" key={l.id} className="st-opt" role="option" aria-selected={l.id === s.lang} data-sel={l.id === s.lang} onClick={() => pick(l)}>
                      <span className="st-opt__v"><b>{l.label}</b>{l.native && <span>{l.native}</span>}</span>
                      {l.id === s.lang && <Ic n="check" size={16} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="st-rt-d">English and Tamil are the languages available.</div>
          </div>
        </section>
        <section className="st-card__sec">
          <div className="st-card__h"><span className="st-gt">Time zone</span></div>
          <div className="st-row st-row--wrap">
            <span className="st-tile st-tone-neutral"><Ic n="clock" /></span>
            <div className="st-rt">
              <div className="st-rt-line"><span className="st-rt-t">Asia/Kolkata (IST)</span><span className="st-chip st-tone-ok">Default</span></div>
              <div className="st-rt-d">India Standard Time · UTC+05:30</div>
            </div>
          </div>
        </section>
      </div>

      <div className="st-card">
        <section className="st-card__sec">
          <div className="st-card__h"><span className="st-gt">Date format</span></div>
          <div className="st-card__body">
            <div className="st-grid2" role="radiogroup" aria-label="Date format">
              {DATE_FORMATS.map((d) => (
                <button type="button" key={d.id} className="st-choice" role="radio" aria-checked={s.fmt === d.id} data-on={s.fmt === d.id} onClick={() => settingsActions.setValue('fmt', d.id)}>
                  <span className="st-radio" data-on={s.fmt === d.id} />
                  <span className="st-choice__t"><b>{d.label}</b><small>e.g. {fmtDate(TODAY, d.id)}</small></span>
                </button>
              ))}
            </div>
            <div className="st-preview" aria-live="polite">
              <div className="st-gt">Live preview</div>
              {DATE_SAMPLES.map((p) => <div className="st-pv" key={p.label}><span>{p.label}</span><b>{fmtDate(p.d, s.fmt)}</b></div>)}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
