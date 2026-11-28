import { useState } from 'react';
import {
  DAY_KEYS, TODAY_ISO, addDays, badRange, conflictsOf, dateOfA, dayHours, dayHoursTotal, dOf, fmtD, fmtDW, fmtStamp,
  freeSlots, hm12, inr, isOpenStatus, minsFromNow, newOvId, rangesText, settingsFromCfg, startOf, stOf, toMin, wdShort,
} from '@/lib/appointments.js';
import { Ico } from './CalendarGrid.jsx';

// Schedule editor (reference "Calendar & Availability"; rules AD-90, AD-92 – AD-94). Read-only for the live schedule;
// editing works on a version (ed) owned by the screen. Weekly hours, named breaks, booking settings (one duration per
// schedule period — AD-90; separate 15 / 30-minute prices; 5 / 10-minute buffer), date overrides and closed dates,
// and a preview of bookable slots. Nothing changes for clients until a version is published.
const DAY_NAME = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
const ST = {
  published: ['b-pub', 'Published · Live'], scheduled: ['b-sched', 'Scheduled'], draft: ['b-draft', 'Draft'],
  failed: ['b-fail', 'Publication failed'], superseded: ['b-hist', 'Previously published'], new: ['b-new', 'New · unsaved'],
};
export const stBadge = (s) => ST[s] || ST.draft;
const plusHour = (hhmm, h) => { const m = Math.min(toMin(hhmm) + h * 60, 23 * 60 + 45); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };

function OverrideForm({ init, cfg, onSave, onCancel }) {
  const [f, setF] = useState(init);
  const [err, setErr] = useState('');
  const set = (p) => { setF((x) => ({ ...x, ...p })); setErr(''); };
  const save = () => {
    if (!f.date) return setErr('Choose a date.');
    if (f.date < TODAY_ISO) return setErr('Choose today or a future date.');
    if (cfg.ovs.some((o) => o.date === f.date && o.id !== f.id)) return setErr(`${fmtD(f.date)} already has an override. Edit that one instead.`);
    if (f.type === 'custom' && toMin(f.e) <= toMin(f.s)) return setErr('End time must be after start time.');
    onSave({ id: f.id || newOvId(), date: f.date, type: f.type, ranges: f.type === 'custom' ? [[f.s, f.e]] : [], note: f.note.trim() });
  };
  return (
    <div className="ovform">
      <label className="fld">Date<input className="inp" type="date" value={f.date} onChange={(e) => set({ date: e.target.value })} /></label>
      <div className="fld">Type
        <div className="seg seg-sm" role="group" aria-label="Override type">
          <button type="button" className={f.type === 'custom' ? 'on' : ''} aria-pressed={f.type === 'custom'} onClick={() => set({ type: 'custom' })}>Custom hours</button>
          <button type="button" className={f.type === 'closed' ? 'on' : ''} aria-pressed={f.type === 'closed'} onClick={() => set({ type: 'closed' })}>Closed all day</button>
        </div>
      </div>
      {f.type === 'custom' && (
        <>
          <label className="fld">From<input className="inp" type="time" step="900" value={f.s} onChange={(e) => set({ s: e.target.value })} /></label>
          <label className="fld">To<input className="inp" type="time" step="900" value={f.e} onChange={(e) => set({ e: e.target.value })} /></label>
        </>
      )}
      <label className="fld full">Private note (optional)<input className="inp" value={f.note} placeholder="e.g. Temple visit" onChange={(e) => set({ note: e.target.value })} /></label>
      {err && <div className="err full">{err}</div>}
      <div className="row full">
        <button type="button" className="btn btn-sm btn-primary" onClick={save}>{f.id ? 'Save override' : f.type === 'closed' ? 'Close date' : 'Add override'}</button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default function AvailabilityEditor({ apt, live, ed, setCfg, setTitle, actions, onOpenAppt, onCloseDateWithBookings }) {
  const ro = !ed;
  const cfg = ro ? live.cfg : ed.cfg;
  const [ovForm, setOvForm] = useState(null);
  const [spDay, setSpDay] = useState(TODAY_ISO);
  const upd = (fn) => { const n = JSON.parse(JSON.stringify(cfg)); fn(n); setCfg(n); };
  const { conflicts } = ed ? conflictsOf(cfg, apt.list) : { conflicts: [] };
  const upcoming = apt.list.filter((a) => isOpenStatus(a) && minsFromNow(a) > 0).length;
  const priceChanged = Number(cfg.p15) !== Number(live.cfg.p15) || Number(cfg.p30) !== Number(live.cfg.p30);
  const [badge, label] = stBadge(ro ? 'published' : ed.status);

  // Slot preview: today + 6 days of the schedule being shown.
  const s = settingsFromCfg(cfg);
  const spDays = Array.from({ length: 7 }, (_, i) => addDays(TODAY_ISO, i));
  const slots = freeSlots(s, apt.list, spDay);
  const dh = dayHours(s, spDay);
  const ovDay = cfg.ovs.find((o) => o.date === spDay);
  const booked = apt.list.filter((a) => dateOfA(a) === spDay && a.status !== 'Cancelled').sort((x, y) => startOf(x) - startOf(y));
  const spSummary = [fmtDW(spDay),
    dh.closed ? 'Closed by override' : ovDay ? `Override: ${rangesText(ovDay.ranges)}` : `Weekly hours: ${rangesText(cfg.week[DAY_KEYS[(dOf(spDay).getDay() + 6) % 7]]) || 'none'}`,
    cfg.breaks.length ? `Breaks: ${cfg.breaks.map((b) => `${b.from}–${b.to}`).join(', ')}` : null].filter(Boolean).join(' · ');
  const noneMsg = dh.closed || !dh.ranges.length ? 'Not available on this date.' : 'No free slots left on this date.';

  const saveOv = (o) => {
    const affected = o.type === 'closed' ? apt.list.filter((a) => dateOfA(a) === o.date && isOpenStatus(a) && minsFromNow(a) > 0) : [];
    const apply = () => { upd((n) => { const i = n.ovs.findIndex((x) => x.id === o.id); if (i >= 0) n.ovs[i] = o; else n.ovs.push(o); n.ovs.sort((p, q) => p.date.localeCompare(q.date)); }); setOvForm(null); };
    if (affected.length) onCloseDateWithBookings(o.date, affected, apply); else apply();
  };
  const ovInit = (type) => ({ id: null, date: addDays(TODAY_ISO, 3), type, s: '16:00', e: '19:00', note: '' });

  return (
    <section className="editor">
      <div className="ed-head">
        <div>
          <div className="eyebrow">{ro ? 'Live schedule' : ed.id ? `Editing ${ed.id}` : `New version · based on ${ed.base}`}</div>
          {ro
            ? <h2>{live.id} · {live.title} <span className={'badge ' + badge}>{label}</span></h2>
            : <div className="ed-name"><label className="sr" htmlFor="apx-vname">Version name</label><input id="apx-vname" className="inp" value={ed.title} onChange={(e) => setTitle(e.target.value)} /><span className={'badge ' + badge}>{label}</span></div>}
        </div>
        {ro && <button type="button" className="btn btn-primary" onClick={actions.startEdit}>Edit as new version</button>}
      </div>
      {ed?.status === 'scheduled' && <div className="ro-note" style={{ color: 'var(--a-gdt)' }}>Scheduled for {fmtStamp(ed.publishAt)}. Editing keeps it scheduled; use Update schedule to save changes, or Save as draft to unschedule.</div>}
      {ed?.status === 'failed' && ed.failReason && <div className="ro-note" style={{ color: 'var(--a-rd)' }}>{ed.failReason}</div>}

      {conflicts.length > 0 && (
        <div className="conflict" role="alert">
          <h4><Ico n="shield" s={15} />{conflicts.length} existing booking{conflicts.length > 1 ? 's conflict' : ' conflicts'} with this version</h4>
          <div style={{ fontSize: 13, color: 'var(--a-ink2)' }}>These bookings stay exactly as they are. Resolve each one before publishing: keep it with a date override, or cancel it through the appointment’s cancellation flow.</div>
          {conflicts.map(({ a, reason }) => (
            <div key={a.id} className="cf-item"><strong>{a.id}</strong><span>{a.user}</span><span className="muted">{fmtDW(dateOfA(a))}, {hm12(startOf(a))} · {a.dur} min</span><span className={'badge ' + stOf(a).b}>{stOf(a).label}</span><span className="cf-r">{reason}</span><span className="sp" /><button type="button" className="btn btn-xs" onClick={() => onOpenAppt(a.id)}>Open appointment</button></div>
          ))}
          <div className="row"><button type="button" className="btn btn-sm" onClick={() => actions.protect(conflicts)}>Keep these bookings: add date overrides</button></div>
        </div>
      )}

      <div className="ed-grid">
        <div className="ed-col">
          <div className="blk">
            <div className="blk-h"><h3>Recurring weekly availability</h3></div>
            <div>
              {DAY_KEYS.map((d) => {
                const r = cfg.week[d], on = r.length > 0, prev = ed?.prevRanges?.[d];
                return (
                  <div key={d} className={'day' + (on ? '' : ' off')}>
                    <div className="day-l">
                      <label className="sw"><input type="checkbox" checked={on} disabled={ro} onChange={() => upd((n) => { if (on) { (ed.prevRanges ||= {})[d] = n.week[d]; n.week[d] = []; } else n.week[d] = prev?.length ? prev : [['09:00', '12:00']]; })} /><span className="sw-ui" /><span className="day-nm">{DAY_NAME[d]}</span></label>
                      <span className="day-hrs">{on ? `${+dayHoursTotal(r).toFixed(2)} h` : 'Off'}</span>
                    </div>
                    <div className="ranges">
                      {r.map(([a, b], i) => (
                        <div key={i} className={'rng' + (badRange(r, i) ? ' bad' : '')}>
                          <input className="inp inp-t" type="time" step="900" aria-label={`${DAY_NAME[d]} range ${i + 1} start`} value={a} disabled={ro} onChange={(e) => upd((n) => { n.week[d][i][0] = e.target.value; })} />
                          <span>–</span>
                          <input className="inp inp-t" type="time" step="900" aria-label={`${DAY_NAME[d]} range ${i + 1} end`} value={b} disabled={ro} onChange={(e) => upd((n) => { n.week[d][i][1] = e.target.value; })} />
                          {!ro && <button type="button" className="icon-btn xs" aria-label={`Remove ${DAY_NAME[d]} ${a}–${b}`} onClick={() => upd((n) => { n.week[d].splice(i, 1); })}><Ico n="x" s={13} /></button>}
                        </div>
                      ))}
                      {!ro && on && r.length < 4 && <button type="button" className="link-btn" onClick={() => upd((n) => { const last = n.week[d][n.week[d].length - 1][1]; const st = plusHour(last, 1); n.week[d].push([st, plusHour(st, 2)]); })}>+ Add hours</button>}
                      {!on && <span className="off-l">Unavailable all day{!ro && <button type="button" className="link-btn" onClick={() => upd((n) => { n.week[d] = prev?.length ? prev : [['09:00', '12:00']]; })}>Restore</button>}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="blk">
            <div className="blk-h"><h3>Breaks</h3></div>
            {cfg.breaks.map((b, i) => (
              <div key={i} className={'brk' + (toMin(b.to) <= toMin(b.from) ? ' bad' : '')}>
                <input className="inp inp-sm inp-lbl" aria-label="Break name" value={b.name} disabled={ro} onChange={(e) => upd((n) => { n.breaks[i].name = e.target.value; })} />
                <input className="inp inp-t" type="time" step="900" aria-label={`${b.name} start`} value={b.from} disabled={ro} onChange={(e) => upd((n) => { n.breaks[i].from = e.target.value; })} />
                <span>–</span>
                <input className="inp inp-t" type="time" step="900" aria-label={`${b.name} end`} value={b.to} disabled={ro} onChange={(e) => upd((n) => { n.breaks[i].to = e.target.value; })} />
                {!ro && <button type="button" className="icon-btn xs" aria-label={`Remove ${b.name}`} onClick={() => upd((n) => { n.breaks.splice(i, 1); })}><Ico n="x" s={13} /></button>}
              </div>
            ))}
            {!cfg.breaks.length && <div className="muted" style={{ fontSize: 13 }}>No breaks set.</div>}
            {!ro && <button type="button" className="link-btn" style={{ alignSelf: 'flex-start' }} onClick={() => upd((n) => { n.breaks.push({ name: 'Short break', from: '11:45', to: '12:00' }); })}>+ Add break</button>}
          </div>
        </div>

        <div className="ed-col">
          <div className="blk">
            <div className="blk-h"><h3>Booking settings</h3></div>
            <div className="set-row"><div className="set-l">Durations offered</div>
              <div className="chips" role="group" aria-label="Duration">{[15, 30].map((m) => <button key={m} type="button" className={'chip' + (cfg.dur === m ? ' on' : '')} aria-pressed={cfg.dur === m} disabled={ro} onClick={() => upd((n) => { n.dur = m; })}>{m} min</button>)}</div>
            </div>
            <div className="set-row"><label className="set-l" htmlFor="apx-p15">15-minute price</label><div className="price"><span>₹</span><input id="apx-p15" className="inp" type="number" min="0" step="10" value={cfg.p15} disabled={ro} onChange={(e) => upd((n) => { n.p15 = e.target.value; })} /></div></div>
            <div className="set-row"><label className="set-l" htmlFor="apx-p30">30-minute price</label><div className="price"><span>₹</span><input id="apx-p30" className="inp" type="number" min="0" step="10" value={cfg.p30} disabled={ro} onChange={(e) => upd((n) => { n.p30 = e.target.value; })} /></div></div>
            <div className="hint"><Ico n="clock" s={14} /><span>{priceChanged && !ro ? `New prices (live: ${inr(live.cfg.p15)} / ${inr(live.cfg.p30)}) apply only to bookings made after this version is published. ${upcoming} upcoming bookings keep the price they were booked at.` : `Price changes apply only to future bookings. ${upcoming} upcoming bookings keep the price they were booked at.`}</span></div>
            <div className="set-row"><div className="set-l">Buffer between calls<span>Kept free after each booking</span></div>
              <div className="seg seg-sm" role="group" aria-label="Buffer">{[5, 10].map((m) => <button key={m} type="button" className={cfg.buffer === m ? 'on' : ''} aria-pressed={cfg.buffer === m} disabled={ro} onClick={() => upd((n) => { n.buffer = m; })}>{m} min</button>)}</div>
            </div>
          </div>

          <div className="blk">
            <div className="blk-h"><h3>Date overrides &amp; closed dates</h3></div>
            <div className="ovl">
              {cfg.ovs.map((o) => {
                const past = o.date < TODAY_ISO;
                return (
                  <div key={o.id} className={'ov' + (past ? ' past' : '')}>
                    <div className="ov-d"><strong>{fmtD(o.date)}</strong><span>{wdShort(o.date)}{past ? ' · past' : ''}</span></div>
                    <div><span className={'badge ' + (o.type === 'closed' ? 'b-cx' : 'b-sched')}>{o.type === 'closed' ? 'Closed' : 'Custom hours'}</span></div>
                    <div className="ov-h">{o.type === 'closed' ? 'No bookings' : `${rangesText(o.ranges)} only`}{o.note ? ` · ${o.note}` : ''}</div>
                    <div className="ov-a">{!ro && (
                      <>
                        <button type="button" className="link-btn" onClick={() => setOvForm({ id: o.id, date: o.date, type: o.type, s: o.ranges[0]?.[0] || '16:00', e: o.ranges[0]?.[1] || '19:00', note: o.note })}>Edit</button>
                        <button type="button" className="link-btn" onClick={() => (o.type === 'closed' ? upd((n) => { const x = n.ovs.find((y) => y.id === o.id); x.type = 'custom'; x.ranges = [['16:00', '19:00']]; }) : saveOv({ ...o, type: 'closed', ranges: [] }))}>{o.type === 'closed' ? 'Reopen' : 'Close date'}</button>
                        <button type="button" className="link-btn dl" onClick={() => upd((n) => { n.ovs = n.ovs.filter((y) => y.id !== o.id); })}>Remove</button>
                      </>
                    )}</div>
                  </div>
                );
              })}
              {!cfg.ovs.length && <div className="muted" style={{ padding: 12, fontSize: 13 }}>No overrides.</div>}
            </div>
            {!ro && ovForm && <OverrideForm key={ovForm.id || ovForm.type} init={ovForm} cfg={cfg} onSave={saveOv} onCancel={() => setOvForm(null)} />}
            {!ro && !ovForm && (
              <div className="row"><button type="button" className="btn btn-sm" onClick={() => setOvForm(ovInit('custom'))}>+ Add date override</button><button type="button" className="btn btn-sm btn-ghost" onClick={() => setOvForm(ovInit('closed'))}>Close a date</button></div>
            )}
          </div>

          <div className="blk">
            <div className="blk-h"><h3>Bookable slots preview</h3></div>
            <div className="spd" role="group" aria-label="Preview day">
              {spDays.map((iso) => {
                const n = freeSlots(s, apt.list, iso).length;
                return <button key={iso} type="button" className={(iso === spDay ? 'on' : '') + (n ? '' : ' none')} aria-pressed={iso === spDay} onClick={() => setSpDay(iso)}><span className="sp-w">{iso === TODAY_ISO ? 'Today' : wdShort(iso)}</span><strong>{dOf(iso).getDate()}</strong><span className="sp-c">{n ? `${n} slots` : 'None'}</span></button>;
              })}
            </div>
            <div className="sp-sum">{spSummary}</div>
            <div className="sp-g"><div className="sp-gl">{cfg.dur} min · {inr(cfg.dur === 15 ? cfg.p15 : cfg.p30)}</div>
              <div className="slots">{slots.map((t) => <span key={t} className="slot">{hm12(t)}</span>)}</div>
              {!slots.length && <span className="muted" style={{ fontSize: 12.5 }}>{noneMsg}</span>}
            </div>
            {booked.length > 0 && <div className="sp-bk">Already booked: {booked.map((a) => `${hm12(startOf(a))} (${a.dur} min, ${a.id})`).join(' · ')}</div>}
          </div>
        </div>
      </div>

      {ed && (
        <div className="pubbar">
          <div className="pub-info">
            <span className={'badge ' + badge}>{label}</span>
            <span>{ed.status === 'scheduled' ? `Goes live ${fmtStamp(ed.publishAt)}. Not visible to clients yet.` : ed.status === 'failed' ? 'Publication failed. Fix the conflicts and publish or reschedule.' : `Not live. Clients keep seeing ${live.id} until you publish.`}</span>
            {ed.dirty && <span className="dirty"><i />Unsaved changes</span>}
          </div>
          <div className="pub-act">
            {(ed.status === 'draft' || ed.status === 'failed') && <button type="button" className="btn btn-ghost btn-dl" onClick={actions.del}>Delete draft</button>}
            {ed.status === 'scheduled' && <button type="button" className="btn btn-ghost btn-dl" onClick={actions.unsched}>Cancel scheduled publication</button>}
            <button type="button" className="btn btn-ghost" onClick={actions.close}>Close</button>
            <button type="button" className="btn" onClick={actions.saveDraft}>Save as draft</button>
            <button type="button" className="btn" onClick={actions.schedule}>{ed.status === 'scheduled' ? 'Update schedule' : 'Schedule publication'}</button>
            <button type="button" className="btn btn-primary" onClick={actions.publish}>Publish now</button>
          </div>
        </div>
      )}
    </section>
  );
}
