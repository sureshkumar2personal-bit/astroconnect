import { useEffect } from 'react';
import { Ic, Tile } from './rmShared.jsx';
import { DAYLABEL, DAYCLS, WD, pd, fD, fT, plural, TODAY } from '@/lib/remedyModel.js';
import * as R from '@/hooks/useRemedies.js';

const cls = (c) => c.replace('pill ', '');

/** One assignment: header with actions, overall progress, daily timeline, final completion,
 *  assigned instructions (snapshot), private notes and activity history. */
export default function RemAssignmentDetail({ s, d, id }) {
  const cd = d.byId[id];
  useEffect(() => { if (!cd) { R.toast('That assignment is no longer available.', 'err'); R.goTab(R.PATH.assignments); } }, [cd]);
  if (!cd) return null;
  const a = cd.a;
  const steps = a.snapshot.steps; const fin = a.final;
  const notes = a.notes.slice().sort((x, y) => (y.d + y.t).localeCompare(x.d + x.t));
  const facts = [['Assignment ID', a.id], ['User ID', cd.userRef], ['Service', cd.serviceLabel], ['Assigned', cd.assignedF], ['Start date', cd.startF], ['End date', cd.endF],
    ['Duration', cd.durationLabel + (a.duration !== a.snapshot.defaultDuration ? ` (default ${a.snapshot.defaultDuration})` : '')], ['Last user update', cd.lastUserF]];
  const stats = [[a.duration, 'Total days'], [cd.c, 'Completed', 'c-completed'], [cd.sk, 'Skipped', 'c-skipped'], [cd.pe, 'Pending / No Update', 'c-pending'], [cd.up, 'Remaining'], [`${cd.pct}%`, 'Completion']];
  const waitText = cd.cancelled ? 'This assignment was cancelled before it started. No completion will be submitted.'
    : cd.stopped ? `This remedy was stopped on ${fD(a.stopped.d)}. Daily updates and final completion are closed.`
      : cd.overdue ? `The scheduled duration ended on ${cd.endF}. The assignment stays active until the User submits final completion — it is never auto-completed.`
        : `The User submits final completion once, on the final day (${cd.endF}), with optional photos. No approval is needed from you.`;
  const finStatus = fin ? cd.label : (cd.cancelled ? 'Cancelled' : cd.stopped ? 'Stopped' : 'Awaiting submission');
  const finCls = fin ? cls(cd.statusCls) : (cd.active ? 's-upcoming' : 's-cancelled');
  return (
    <section>
      <div className="rm-panel rm-dhead">
        <div className="rm-dh-top">
          <div className="rm-who"><span className="rm-av lg">{cd.initials}</span><div><h1 className="rm-h1 rm-h1s">{cd.userName}</h1><div className="rm-muted">{cd.remedyName}</div></div></div>
          <div className="rm-dh-status"><span className={`rm-pill lg ${cls(cd.statusCls)}`}>{cd.label}</span>{cd.flags.map((f) => <span key={f.label} className={`rm-pill ${cls(f.cls)}`}>{f.label}</span>)}</div>
        </div>
        <div className="rm-facts">{facts.map(([l, v]) => <div className="rm-fact" key={l}><span>{l}</span><b>{v}</b></div>)}</div>
        <div className="rm-dactions">
          {cd.active && <button type="button" className="rm-btn rm-btn--s rm-btn--sm" onClick={R.openEdit}>Edit Assignment</button>}
          <button type="button" className={`rm-btn rm-btn--s rm-btn--sm${a.followUp ? ' rm-btn--gold' : ''}`} onClick={R.toggleFollow}>{a.followUp ? 'Remove follow-up' : 'Mark for follow-up'}</button>
          <button type="button" className="rm-btn rm-btn--s rm-btn--sm" onClick={R.assignAgain}>Assign Again</button>
          {cd.active && cd.started && <button type="button" className="rm-btn rm-btn--dt rm-btn--sm" onClick={R.stopRemedy}>Stop Remedy</button>}
          {cd.active && !cd.started && <button type="button" className="rm-btn rm-btn--dt rm-btn--sm" onClick={R.cancelAssignment}>Cancel Assignment</button>}
        </div>
        {(a.stopped || a.cancelled) && (
          <div className="rm-halt"><b>{a.stopped ? `Stopped on ${fD(a.stopped.d)}` : `Cancelled on ${fD(a.cancelled.d)}`}</b>Reason: {a.stopped ? a.stopped.reason : a.cancelled.reason}</div>
        )}
      </div>

      <div className="rm-panel rm-progp">
        <div className="rm-ptop"><div><p className="rm-ptitle">Overall Progress</p><div className="rm-muted rm-sm">{cd.c} of {a.duration} days completed{cd.sk ? ` · ${plural(cd.sk, 'day')} skipped` : ''}{cd.pe ? ` · ${cd.pe} pending` : ''}</div></div><div className="rm-pct">{cd.pct}%</div></div>
        <div className="rm-segbar">{cd.dots.map((g, i) => <span key={i} className={g.cls.replace('seg', 'rm-seg')} title={g.title} />)}</div>
        <div className="rm-legend">{[['completed', 'Completed'], ['skipped', 'Skipped'], ['pending', 'Pending / No Update'], ['today', 'Today'], ['upcoming', 'Upcoming']].map(([k, l]) => <span key={k}><i className={`sg-${k}`} />{l}</span>)}</div>
        <div className="rm-stats6">{stats.map(([v, l, c]) => <div key={l} className={`rm-st ${c || ''}`}><b>{v}</b><span>{l}</span></div>)}</div>
      </div>

      <div className="rm-dmasonry">
        <div className="rm-panel rm-pad">
          <div className="rm-sech"><p className="rm-ptitle">Final Completion Submission</p><span className={`rm-pill ${finCls}`}>{finStatus}</span></div>
          {fin ? (
            <>
              <div className="rm-kv"><div><span>Completion date</span><b>{fD(fin.d)}</b></div><div><span>Submitted at</span><b>{fD(fin.d)}, {fT(fin.t)}</b></div></div>
              {fin.photos.length > 0 ? (
                <>
                  <div className="rm-lab" style={{ margin: '14px 0 0' }}>Submitted photos · {plural(fin.photos.length, 'photo')}</div>
                  <div className="rm-gal">{fin.photos.map((p, i) => <Tile key={p.id} img={p} caption={p.caption} onClick={() => R.openPhoto(fin.photos, i)} label={`Open photo: ${p.caption}`} />)}</div>
                </>
              ) : <div className="rm-nophotos"><Ic n="image" /><span>No Photos Submitted <small>· photos are optional</small></span></div>}
              {fin.note ? <div className="rm-unote"><span>Note from the User</span>{fin.note}</div> : <div className="rm-hint" style={{ marginTop: 10 }}>The User didn’t add a note.</div>}
            </>
          ) : <div className="rm-await"><Ic n="clock" /><span>{waitText}</span></div>}
        </div>
        <div className="rm-panel rm-pad">
          <div className="rm-sech"><p className="rm-ptitle">Assigned Instructions</p><span className="rm-tag t-grey">Snapshot</span></div>
          <div className="rm-instr">{a.instructions}</div>
          {a.astroNote && <div className="rm-anote"><b>Your note to the User:</b> {a.astroNote}</div>}
          <div className="rm-hint">Snapshot taken {fD(a.snapshot.takenOn)}. Later edits to the Saved Method don’t change this assignment.</div>
          <div className="rm-dsec"><div className="rm-dsec__h">Materials · {a.snapshot.materials.length}</div><div className="rm-mats">{a.snapshot.materials.map((m) => <span className="rm-mat" key={m.name}>{m.name} · {m.qty}</span>)}</div></div>
          <div className="rm-dsec"><div className="rm-dsec__h">Steps · {steps.length}</div><div className="rm-ol">{steps.map((x, i) => <div className="rm-oli" key={i}><i>{i + 1}</i><div><b>{x.title}</b>{x.detail}</div></div>)}</div></div>
        </div>
        <div className="rm-panel rm-pad">
          <div className="rm-sech"><p className="rm-ptitle">Private Notes</p><span className="rm-privlab"><Ic n="lock" size={13} />Only visible to you</span></div>
          <div className="rm-noteadd">
            <label><span className="rm-sr">New private note</span><textarea className="rm-inp" rows={2} style={{ minHeight: 64 }} placeholder="Add a private note — e.g. follow up next week" value={s.noteDraft} onChange={(e) => R.set({ noteDraft: e.target.value })} /></label>
            <div><button type="button" className="rm-btn rm-btn--s rm-btn--sm" onClick={R.addNote}><Ic n="plus" size={14} />Add Note</button></div>
          </div>
          {notes.map((n) => (
            <div className="rm-note" key={n.id}>
              {s.editNoteId !== n.id ? (
                <>
                  <p>{n.text}</p>
                  <div className="rm-nmeta"><span>{fD(n.d)}, {fT(n.t)}{n.ed ? ' · edited' : ''}</span><span>
                    <button type="button" className="rm-lbtn" onClick={() => R.set({ editNoteId: n.id, editNoteText: n.text })}>Edit</button>
                    <button type="button" className="rm-lbtn danger" onClick={() => R.ask({ action: 'delnote', id: a.id, noteId: n.id, title: 'Delete this private note?', body: 'The note will be removed permanently. This doesn’t affect the assignment.', confirmLabel: 'Delete note', danger: true, needReason: false })}>Delete</button></span></div>
                </>
              ) : (
                <>
                  <label><span className="rm-sr">Edit note</span><textarea className="rm-inp" rows={2} value={s.editNoteText} onChange={(e) => R.set({ editNoteText: e.target.value })} /></label>
                  <div className="rm-simrow"><button type="button" className="rm-btn rm-btn--p rm-btn--sm" onClick={R.saveNote}>Save</button><button type="button" className="rm-btn rm-btn--g rm-btn--sm" onClick={() => R.set({ editNoteId: null })}>Cancel</button></div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="rm-panel rm-pad">
          <div className="rm-sech"><div><p className="rm-ptitle">Daily Remedy Timeline</p><div className="rm-muted rm-sm">Statuses are reported by the User — no approval needed. Missing updates stay Pending / No Update and are never auto-skipped.</div></div></div>
          <div className="rm-tl">
            {cd.days.map((x, i) => {
              const f = steps.length ? steps[i % steps.length] : null;
              const meta = x.log ? `Updated by User · ${fD(x.log.d)}, ${fT(x.log.t)}` : x.st === 'pending' ? 'No update received from the User for this day.' : x.st === 'today' ? 'Awaiting today’s update from the User.' : x.st === 'upcoming' ? 'Scheduled' : x.st === 'halted' ? 'Not tracked after the remedy was stopped.' : 'Not tracked · assignment cancelled.';
              return (
                <div className={`rm-tli${i === cd.days.length - 1 ? ' last' : ''}`} key={i}>
                  <div className={`rm-tnode n-${x.st}`}><small>Day</small>{i + 1}</div>
                  <div className={`rm-tcard${x.st === 'today' ? ' today' : ''}`}>
                    <div className="rm-trow1"><div><b>Day {i + 1}</b> <span className="rm-muted rm-sm">· {WD[pd(x.date).getDay()]}, {fD(x.date)}</span> {x.date === TODAY && <span className="rm-tag t-teal">Today</span>}</div><span className={`rm-pill ${DAYCLS[x.st]}`}>{DAYLABEL[x.st]}</span></div>
                    <div className="rm-tmeta">{meta}</div>
                    <div className="rm-tfocus"><span className="rm-muted">Focus:</span> {f ? `${f.title} — ${f.detail}` : 'Follow the assigned instructions.'}</div>
                    {i === a.duration - 1 && <div className="rm-finalhint"><Ic n="info" size={16} /><span>Final day — the User submits final completion here, with optional photos. There are no photo uploads on any other day.</span></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="rm-panel rm-pad">
        <div className="rm-sech"><p className="rm-ptitle">Activity History</p><span className="rm-muted rm-sm">Newest first</span></div>
        <div className="rm-act">{cd.acts.map((x, i) => <div className="rm-ai" key={i}><span className={`rm-adot a-${x.k}`} /><div><div>{x.text}</div><div className="rm-hint" style={{ marginTop: 1 }}>{fD(x.d)}, {fT(x.t)}</div></div></div>)}</div>
      </div>
    </section>
  );
}
