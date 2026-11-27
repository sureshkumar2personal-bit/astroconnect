import { useState } from 'react';
import { Badge, BtnRow, Note, PendingTag } from '@/components/ui/sectionKit.jsx';
import { navigate } from '@/lib/router.js';
import { dt, fmtDateTime, isoDay, TODAY } from '@/lib/format.js';
import { canCreate, liveActions, usedThisMonth, validate, whenOf } from '@/hooks/useLive.js';
import { AUDIENCES, AUDIENCE_LABEL, TIERS } from '@/data/mockLive.js';
import { ConfirmCancel, PreviewTest } from './LiveDialogs.jsx';
import { fmtLong, nextMonthStart, thisMonthName } from './liveFormat.js';

const NOTIFY = {
  Public: 'Your followers will be notified. Anyone can watch.',
  Followers: 'Only your followers will be notified.',
  Subscribers: 'Only active subscribers will be notified.',
};
const notifyText = (f) => (f.aud === 'Specific tiers'
  ? `Only subscribers in ${f.tiers.length ? f.tiers.join(', ') : 'the selected tiers'} will be notified.`
  : NOTIFY[f.aud]);
const audienceText = (f) => (f.aud === 'Specific tiers' ? `Subscribers – ${f.tiers.length ? f.tiers.join(', ') : 'the selected tiers'}` : AUDIENCE_LABEL[f.aud]);

/** Preview before scheduling / going live (reference modal): summary, Edit and Confirm. */
function LivePreview({ f, verified, onEdit, onConfirm }) {
  const sched = f.mode === 'schedule';
  const when = sched ? fmtLong(whenOf(f)) : 'Now – right after you confirm';
  const month = sched ? dt(whenOf(f)).toLocaleString('en-IN', { month: 'long', year: 'numeric' }) : thisMonthName();
  return (
    <div className="lv-prev">
      <div className="lv-prev__thumb">{f.thumbUrl ? <img src={f.thumbUrl} alt="Thumbnail preview" /> : <span>Thumbnail preview</span>}</div>
      <h3 className="lv-prev__t">{f.topic.trim()}</h3>
      {f.desc.trim() && <p className="lv-prev__d">{f.desc.trim()}</p>}
      <dl className="lv-prev__dl">
        <div><dt>When</dt><dd>{when}</dd></div>
        <div><dt>Audience</dt><dd>{audienceText(f)}</dd></div>
        <div><dt>Notifications</dt><dd>{notifyText(f)}</dd></div>
        <div><dt>Monthly limit</dt><dd>Uses your 1 live for {month}</dd></div>
      </dl>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onEdit}>Edit</button>
        <button type="button" className="btn lv-btn" onClick={onConfirm}>{!verified ? 'Submit for approval' : sched ? 'Confirm & schedule' : 'Go live now'}</button>
      </div>
    </div>
  );
}

/** Create Live tab (AD-114, reference "Create Live"): Schedule Live / Start Now, preview, monthly limit. */
export default function LiveCreate({ s, ui }) {
  const f = s.form;
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState('');
  const open = canCreate(s);
  const sched = f.mode === 'schedule';
  const set = (part) => { setTried(false); setDone(''); liveActions.setForm(part); };
  const w = whenOf(f);
  const past = w && dt(w) <= TODAY;
  const errTopic = tried && !f.topic.trim();
  const errWhen = tried && sched && (!w || past);
  const errTier = tried && f.aud === 'Specific tiers' && !f.tiers.length;
  const hasErr = errTopic || errWhen || errTier;
  const todayIso = isoDay(TODAY);

  const onThumb = (e) => {
    const file = e.target.files?.[0];
    if (f.thumbUrl) URL.revokeObjectURL(f.thumbUrl);
    set({ thumb: file ? file.name : '', thumbUrl: file ? URL.createObjectURL(file) : '' });
  };

  const confirm = (close) => {
    const label = fmtLong(whenOf(f) || TODAY.toISOString());
    const mode = f.mode;
    const err = liveActions.create();
    if (err) { close(); setTried(true); return; }
    close();
    setTried(false);
    if (mode === 'schedule') { setDone(`Live scheduled for ${label}. Your audience has been notified.`); ui.toast('Live scheduled. Your audience has been notified.'); }
    else { ui.toast('Live Started sent to your audience'); navigate('/live'); }
  };
  const openPreview = () => {
    if (validate(f)) { setTried(true); return; }
    ui.dialog({ title: sched ? 'Preview scheduled live' : 'Preview – go live now', body: (close) => <LivePreview f={f} verified={s.verified} onEdit={close} onConfirm={() => confirm(close)} /> });
  };
  const testPreview = (topic) => ui.dialog({ title: 'Preview / Test', body: (close) => <PreviewTest topic={topic} onDone={close} /> });
  const startNow = () => { liveActions.start(); ui.toast('Live Started sent to your audience'); navigate('/live'); };

  return (
    <>
      {done && <div className="lv-done" role="status"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" /></svg>{done}</div>}

      {s.scheduled && (
        <section className="lv-card lv-sched" aria-label="Scheduled Live">
          <div className="row wrap">
            <div className="grow">
              <b className="lg">{s.scheduled.topic}</b>
              <div className="muted sm">{fmtDateTime(dt(s.scheduled.when))} · Audience: {s.scheduled.aud}</div>
            </div>
            <Badge kind="info">Scheduled</Badge>
          </div>
          {s.scheduled.desc && <p className="sm">{s.scheduled.desc}</p>}
          <Note>Audience reminders: 1 day, 1 hour and 15 minutes before, then “Live Started”. If you cancel or don't show, they are notified.</Note>
          <BtnRow>
            <button type="button" className="btn btn-o" onClick={() => testPreview(s.scheduled.topic)}>Preview / Test</button>
            <button type="button" className="btn lv-btn" onClick={startNow}>Start now</button>
            <button type="button" className="btn btn-o danger" onClick={() => ui.dialog({
              title: 'Cancel Live',
              body: (close) => <ConfirmCancel onKeep={close} onConfirm={() => { liveActions.cancel(); close(); ui.toast('Live cancelled. Audience notified. You can schedule another this month.'); }} />,
            })}>Cancel Live</button>
          </BtnRow>
        </section>
      )}

      <section className={`lv-card lv-form${open ? '' : ' is-off'}`} aria-label="Create Live" aria-disabled={!open}>
        {!open && (
          <div className="lv-lock" role="note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
            <span>
              {!s.verified ? <><b>Only Verified Astrologers can go live.</b> <PendingTag id="AP-04-01" /></>
                : s.scheduled ? <><b>A live is already scheduled this month.</b> Cancel it to schedule another in the same month.</>
                : <><b>This month's live has been used.</b> You can schedule or start your next live from {nextMonthStart()}. Your past sessions are in Live History.</>}
            </span>
          </div>
        )}
        <fieldset disabled={!open} className="lv-fs">
          <div className="lv-moderow">
          <div className="lv-modes" role="tablist" aria-label="Live type">
            {[['schedule', 'Schedule Live'], ['now', 'Start Now']].map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={f.mode === k} className={`lv-mode${f.mode === k ? ' on' : ''}`} onClick={() => set({ mode: k })}>{l}</button>
            ))}
          </div>
          <span className="lv-hint">{sched ? 'Pick a date and time this month or later.' : 'Go live right after the preview.'}</span>
          </div>

          <div className="lv-grid">
            <div className="lv-col">
            <label className="lv-f lv-f--wide"><span className="lv-fl">Topic <i>*</i></span>
              <input type="text" value={f.topic} placeholder="e.g. Mercury retrograde Q&A" aria-invalid={errTopic} onChange={(e) => set({ topic: e.target.value })} />
              {errTopic && <span className="lv-err" role="alert">Add a topic for your live.</span>}
            </label>
            <label className="lv-f lv-f--wide"><span className="lv-fl">Description <em>(optional)</em></span>
              <textarea rows={3} value={f.desc} placeholder="What will you cover?" onChange={(e) => set({ desc: e.target.value })} />
            </label>
            <div className="lv-f lv-f--wide">
              <span className="lv-fl">Thumbnail <em>(optional)</em></span>
              <div className="lv-thumb">
                <span className="lv-thumb__box" aria-hidden="true">{f.thumbUrl ? <img src={f.thumbUrl} alt="" /> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="M5 17l4.5-4.5 3 3L15 13l4 4" /></svg>}</span>
                <label className="btn btn-o lv-upload">Upload image<input type="file" accept="image/jpeg,image/png" onChange={onThumb} /></label>
                <span className="lv-hint">{f.thumb || '16:9 · JPG or PNG'}</span>
              </div>
            </div>
            </div>
            <div className="lv-col">
            {sched && (
              <div className="lv-dt">
                <label className="lv-f"><span className="lv-fl">Date <i>*</i></span>
                  <input type="date" value={f.date} min={todayIso} aria-invalid={errWhen} onChange={(e) => set({ date: e.target.value })} />
                </label>
                <label className="lv-f"><span className="lv-fl">Time <i>*</i></span>
                  <input type="time" value={f.time} aria-invalid={errWhen} onChange={(e) => set({ time: e.target.value })} />
                </label>
                {errWhen && <span className="lv-err lv-dt__err" role="alert">{!w ? 'Choose a date and time.' : 'Choose a time later than now.'}</span>}
              </div>
            )}
            <div className="lv-f lv-f--wide">
              <span className="lv-fl">Audience <i>*</i></span>
              <div className="lv-chips" role="radiogroup" aria-label="Audience">
                {AUDIENCES.map((a) => (
                  <button key={a} type="button" role="radio" aria-checked={f.aud === a} className={`lv-chip${f.aud === a ? ' on' : ''}`} onClick={() => set({ aud: a })}>{AUDIENCE_LABEL[a]}</button>
                ))}
              </div>
              {f.aud === 'Specific tiers' && (
                <div className="lv-tiers">
                  <span className="lv-hint">From your subscription plans</span>
                  {TIERS.map((t) => (
                    <label key={t} className="lv-check"><input type="checkbox" checked={f.tiers.includes(t)} onChange={() => { setTried(false); liveActions.toggleTier(t); }} />{t}</label>
                  ))}
                  {errTier && <span className="lv-err" role="alert">Choose at least one tier.</span>}
                </div>
              )}
              <span className="lv-hint lv-hint--ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8M10 20a2 2 0 004 0" /></svg>{notifyText(f)}</span>
            </div>
            <div className="lv-paid" aria-disabled="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
              <span>Paid Live</span><b>Not available yet</b>
            </div>
            </div>
          </div>

          <div className="lv-cta">
            {hasErr && <span className="lv-err" role="alert">Fill in the required fields to continue.</span>}
            <button type="button" className="btn lv-btn" onClick={openPreview} disabled={!open}>{sched ? 'Preview & schedule' : 'Preview & go live'}</button>
          </div>
        </fieldset>
      </section>
    </>
  );
}
