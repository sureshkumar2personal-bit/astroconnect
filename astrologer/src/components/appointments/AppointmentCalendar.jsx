import { useEffect, useState } from 'react';
import { navigate, routes } from '@/lib/router.js';
import { appNow } from '@/hooks/useAppointments.js';
import {
  TODAY_ISO, addDays, cloneCfg, conflictsOf, dateOfA, fmtD, fmtDW, fmtStamp, hm12, isOpenStatus, minsFromNow,
  protectCfg, sameCfg, settingsFromCfg, startOf, stOf, validateCfg,
} from '@/lib/appointments.js';
import CalendarGrid, { Ico } from './CalendarGrid.jsx';
import AvailabilityEditor, { stBadge } from './AvailabilityEditor.jsx';

// My Work → Appointments → Calendar & Availability (reference "AstroConnect – Astrologer Appointments"; AD-90, AD-92 –
// AD-94). Schedule versions (draft → scheduled → published), the schedule editor, Calendar Activity (the appointments
// calendar, previewing the version being edited) and the schedule change history. Publishing makes a version the live
// availability; closing a date that has bookings offers each client a reschedule or a full refund (AD-94).
const GROUPS = [
  ['Current published schedule', (v) => v.status === 'published'],
  ['Scheduled publications', (v) => v.status === 'scheduled'],
  ['Drafts & failed publications', (v) => v.status === 'draft' || v.status === 'failed'],
  ['Previously published', (v) => v.status === 'superseded'],
];

function Modal({ title, children, wide, onClose }) {
  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={'modal' + (wide ? ' wide' : '')} role="dialog" aria-modal="true" aria-label={title}><h3>{title}</h3>{children}</div>
    </div>
  );
}

function ScheduleModal({ v, onClose, onConfirm }) {
  const [date, setDate] = useState(v.publishAt ? new Date(v.publishAt).toISOString().slice(0, 10) : addDays(TODAY_ISO, 1));
  const [time, setTime] = useState(v.publishAt ? new Date(v.publishAt).toTimeString().slice(0, 5) : '09:00');
  const [err, setErr] = useState('');
  const ts = date && time ? new Date(`${date}T${time}`).getTime() : NaN;
  const ok = () => {
    if (!date || !time) return setErr('Choose a date and time.');
    if (!(ts >= appNow() + 5 * 6e4)) return setErr('Choose a time at least 5 minutes from now (IST).');
    onConfirm(ts);
  };
  return (
    <Modal title="Schedule publication" onClose={onClose}>
      <p>{v.status === 'scheduled' ? `Change when ${v.id} goes live. It stays unpublished until then.` : `Pick when “${v.title}” should go live. Until then it has no effect on bookings.`}</p>
      <div className="att-form">
        <label className="fld">Publish on<input className="inp" type="date" value={date} onChange={(e) => { setDate(e.target.value); setErr(''); }} /></label>
        <label className="fld">At<input className="inp" type="time" step="900" value={time} onChange={(e) => { setTime(e.target.value); setErr(''); }} /></label>
      </div>
      <span className="tz">India Standard Time · IST (UTC+05:30)</span>
      {Number.isFinite(ts) && <div className="safe">Goes live automatically on {fmtDW(date)} at {hm12(Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)))} IST. Your live schedule stays active until then.</div>}
      {err && <div className="err">{err}</div>}
      <div className="m-act"><button type="button" className="btn btn-ghost" onClick={onClose}>Back</button><button type="button" className="btn btn-primary" onClick={ok}>{v.status === 'scheduled' ? 'Update schedule' : 'Schedule publication'}</button></div>
    </Modal>
  );
}

export default function AppointmentCalendar({ apt, toast }) {
  const live = apt.versions.find((v) => v.status === 'published');
  const [ed, setEd] = useState(null); // version being edited: { id|null, base, title, cfg, status, publishAt, failReason, saved }
  const [modal, setModal] = useState(null);
  const [showAllHist, setShowAllHist] = useState(false);
  const nextNum = apt.nextVersionNum();
  const dirty = ed ? !ed.saved || !sameCfg(ed.cfg, ed.saved.cfg) || ed.title !== ed.saved.title : false;
  const edV = ed ? { id: ed.id, title: ed.title.trim() || `Version ${nextNum}`, cfg: ed.cfg } : null;

  // Scheduled versions go live automatically when their time comes (checked every 30 s on the app clock).
  useEffect(() => {
    const t = setInterval(() => {
      apt.runScheduled().forEach((r) => toast(r.ok ? `${r.id} was published automatically.` : `${r.id} could not be published: booking conflict. Your live schedule is unchanged.`));
    }, 30000);
    return () => clearInterval(t);
  }, [apt, toast]);
  useEffect(() => {
    if (!modal) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setModal(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modal]);

  const openEditor = (v) => setEd({ id: v.id, title: v.title, cfg: cloneCfg(v.cfg), status: v.status, publishAt: v.publishAt, failReason: v.failReason, saved: { cfg: cloneCfg(v.cfg), title: v.title } });
  const startNew = (from) => { setEd({ id: null, base: from.id, title: `Version ${nextNum}`, cfg: cloneCfg(from.cfg), status: 'new', saved: null }); toast(`New version started from ${from.id}. Your live schedule is unchanged until you publish.`); };
  const guard = (fn) => { const err = validateCfg(ed.cfg); if (err) { toast(err); return; } fn(); };
  const conflictModal = (mode) => {
    const { conflicts } = conflictsOf(ed.cfg, apt.list);
    if (!conflicts.length) return false;
    setModal({ kind: 'conflict', mode, conflicts }); return true;
  };
  const doPublish = () => {
    const id = apt.publishVersion(edV); setEd(null); setModal(null);
    toast(`Published. ${id} is now your live schedule.`);
  };
  const actions = {
    startEdit: () => startNew(live),
    protect: (conflicts) => { const n = new Set(conflicts.map((c) => dateOfA(c.a))).size; setEd((e) => ({ ...e, cfg: protectCfg(e.cfg, conflicts) })); setModal(null); toast(`Added ${n} date override${n > 1 ? 's' : ''} so existing bookings stay valid. Weekly hours unchanged.`); },
    saveDraft: () => guard(() => { const id = apt.saveDraft(edV); setEd((e) => ({ ...e, id, status: 'draft', publishAt: null, saved: { cfg: cloneCfg(e.cfg), title: edV.title }, title: edV.title })); toast(`Saved as draft ${id}. Clients still see your live schedule.`); }),
    publish: () => guard(() => { if (!conflictModal('publish')) setModal({ kind: 'confirm', type: 'publish' }); }),
    schedule: () => guard(() => { if (!conflictModal('schedule')) setModal({ kind: 'schedule' }); }),
    unsched: () => setModal({ kind: 'confirm', type: 'unsched', id: ed.id }),
    del: () => setModal({ kind: 'confirm', type: 'delete', id: ed.id, title: ed.title }),
    close: () => (dirty ? setModal({ kind: 'confirm', type: 'discard' }) : setEd(null)),
  };
  const versionActions = (v) => {
    if (v.status === 'published') return [['View', () => setEd(null)], ['Edit as new version', () => startNew(v)]];
    if (v.status === 'scheduled') return [['Edit', () => openEditor(v)], ['Cancel schedule', () => setModal({ kind: 'confirm', type: 'unsched', id: v.id })]];
    if (v.status === 'draft') return [['Edit', () => openEditor(v)], ['Delete', () => setModal({ kind: 'confirm', type: 'delete', id: v.id, title: v.title }), 'btn-dl']];
    if (v.status === 'failed') return [['Fix & edit', () => openEditor(v)], ['Delete', () => setModal({ kind: 'confirm', type: 'delete', id: v.id, title: v.title }), 'btn-dl']];
    return [['Copy to new draft', () => startNew(v)]];
  };
  const whenOf = (v) => ({
    published: v.publishedAt ? `Live since ${fmtStamp(v.publishedAt)}` : 'Live now',
    scheduled: `Goes live ${fmtStamp(v.publishAt)}`,
    draft: v.updatedAt ? `Last saved ${fmtStamp(v.updatedAt)}` : 'Draft',
    failed: v.publishAt ? `Was due ${fmtStamp(v.publishAt)}` : 'Not published',
    superseded: v.endedAt ? `Live ${v.publishedAt ? fmtD(new Date(v.publishedAt).toISOString().slice(0, 10)) : ''} – ${fmtD(new Date(v.endedAt).toISOString().slice(0, 10))}` : 'Previously published',
  }[v.status]);

  const confirmContent = () => {
    const m = modal;
    const upcoming = apt.list.filter((a) => isOpenStatus(a) && minsFromNow(a) > 0).length;
    if (m.type === 'publish') {
      const { closing } = conflictsOf(ed.cfg, apt.list, apt.settings.closed);
      return { title: 'Publish this schedule now?', body: `“${edV.title}” becomes your live availability immediately and clients can book the new slots right away. The current live version (${live.id}) moves to history.`,
        safe: closing.length ? `${closing.length} booking(s) fall on dates this version closes: each client is offered a reschedule (once) or a full refund to their User Wallet. All other upcoming bookings keep their time and price.` : `No existing bookings are affected. All ${upcoming} upcoming bookings keep their time and price.`,
        no: 'Cancel', ok: 'Publish now', okCls: 'btn-primary', run: doPublish };
    }
    if (m.type === 'discard') return { title: 'Discard unsaved changes?', body: `Your edits to “${edV.title}” haven’t been saved. The live schedule is unaffected either way.`, no: 'Keep editing', ok: 'Discard changes', okCls: 'btn-danger', run: () => { setEd(null); setModal(null); } };
    if (m.type === 'unsched') return { title: 'Cancel scheduled publication?', body: `${m.id} will not go live as scheduled. It stays saved as a draft so you can publish it later.`, no: 'Keep schedule', ok: 'Cancel publication', okCls: 'btn-danger',
      run: () => { apt.unscheduleVersion(m.id); if (ed?.id === m.id) setEd((e) => ({ ...e, status: 'draft', publishAt: null })); setModal(null); toast(`Scheduled publication cancelled. ${m.id} is now a draft.`); } };
    return { title: `Delete draft ${m.id}?`, body: `“${m.title}” was never published. Deleting it can’t be undone. Your live schedule is not affected.`, no: 'Keep draft', ok: 'Delete draft', okCls: 'btn-danger',
      run: () => { apt.deleteVersion(m.id); if (ed?.id === m.id) setEd(null); setModal(null); toast(`Draft ${m.id} deleted.`); } };
  };

  const hist = apt.schedHistory;
  const shownHist = showAllHist ? hist : hist.slice(0, 8);
  return (
    <div className="aps">
      <div className="wrap">
        <div className="pagehead">
          <div><button type="button" className="crumb" onClick={() => navigate(routes.appointments)}><Ico n="left" s={14} />Appointments</button></div>
          <div className="live-pill"><i />Live now: {live.id} {live.title}{live.publishedAt ? ` · since ${fmtStamp(live.publishedAt)}` : ''}</div>
        </div>

        <section className="panel vers">
          <div className="sec-h"><h2>Schedule versions</h2>
            <div className="row"><div className="st-legend"><span className="badge b-pub">Published</span><span className="badge b-sched">Scheduled</span><span className="badge b-draft">Draft</span><span className="badge b-fail">Publication failed</span></div>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => startNew(live)}>+ New version</button></div>
          </div>
          <div className="ver-list">
            {GROUPS.map(([label, f], gi) => {
              const items = apt.versions.filter(f).sort((a, b) => b.num - a.num);
              const inProgress = gi === 1 && ed && !ed.id;
              return (
                <div key={label} style={{ display: 'contents' }}>
                  {inProgress && (<><div className="ver-grp">In progress</div><div className="ver v-editing"><div className="ver-name"><strong>New</strong><span>{edV.title} · from {ed.base}</span></div><div><span className="badge b-new">Unsaved</span></div><div className="ver-when">Save as draft, schedule or publish below</div><div className="ver-act" /></div></>)}
                  {items.length > 0 && <div className="ver-grp">{label}</div>}
                  {items.map((v) => {
                    const [b, l] = stBadge(v.status);
                    return (
                      <div key={v.id} className={'ver' + (v.status === 'published' ? ' v-active' : '') + (ed?.id === v.id ? ' v-editing' : '') + (v.status === 'superseded' ? ' v-old' : '')}>
                        <div className="ver-name"><strong>{v.id}</strong><span>{v.title}</span></div>
                        <div><span className={'badge ' + b}>{l}</span></div>
                        <div className="ver-when">{whenOf(v)}</div>
                        <div className="ver-act">{versionActions(v).map(([t, run, cls]) => <button key={t} type="button" className={'btn btn-xs ' + (cls || '')} onClick={run}>{t}</button>)}</div>
                        {v.status === 'failed' && v.failReason && <div className="ver-note">{v.failReason}</div>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>

        <AvailabilityEditor apt={apt} live={live} ed={ed && { ...ed, dirty }} actions={actions}
          setCfg={(cfg) => setEd((e) => ({ ...e, cfg }))} setTitle={(title) => setEd((e) => ({ ...e, title }))}
          onOpenAppt={(id) => navigate(routes.aptDetail(id))}
          onCloseDateWithBookings={(date, affected, apply) => setModal({ kind: 'close', date, affected, apply })} />

        <section className="panel" aria-labelledby="apx-cal-act">
          <div className="sec-h"><h2 id="apx-cal-act">Calendar Activity</h2></div>
          <CalendarGrid apt={apt} settings={ed ? settingsFromCfg(ed.cfg) : apt.settings} onOpen={(id) => navigate(routes.aptDetail(id))}
            srcLabel={ed ? `Previewing availability of ${ed.id || 'the new version'} (not live)` : `Showing live availability · ${live.id}`} />
        </section>

        <section className="panel hist-w">
          <div className="sec-h"><h2>Schedule change history</h2></div>
          {hist.length ? (
            <ol className="hist">{shownHist.map((h, i) => <li key={i}><span className={'h-ic ' + h.cls} /><div><div className="h-a">{h.action}</div><div className="h-d">{h.detail}</div></div><time>{fmtStamp(h.at)}</time></li>)}</ol>
          ) : <div className="muted" style={{ fontSize: 13 }}>No schedule changes yet.</div>}
          {hist.length > 8 && <button type="button" className="link-btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowAllHist((x) => !x)}>{showAllHist ? 'Show fewer' : `Show all ${hist.length} changes`}</button>}
        </section>
      </div>

      {modal?.kind === 'confirm' && (() => { const c = confirmContent(); return (
        <Modal title={c.title} onClose={() => setModal(null)}>
          <p>{c.body}</p>{c.safe && <div className="safe">{c.safe}</div>}
          <div className="m-act"><button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>{c.no}</button><button type="button" className={'btn ' + c.okCls} onClick={c.run}>{c.ok}</button></div>
        </Modal>); })()}
      {modal?.kind === 'schedule' && (
        <ScheduleModal v={{ ...edV, status: ed.status, publishAt: ed.publishAt }} onClose={() => setModal(null)}
          onConfirm={(ts) => { const id = apt.scheduleVersion(edV, ts); setEd((e) => ({ ...e, id, status: 'scheduled', publishAt: ts, saved: { cfg: cloneCfg(e.cfg), title: edV.title }, title: edV.title })); setModal(null); toast(`Scheduled. ${id} goes live ${fmtStamp(ts)}. Until then nothing changes for clients.`); }} />
      )}
      {modal?.kind === 'conflict' && (
        <Modal wide title={`${modal.conflicts.length} existing booking${modal.conflicts.length > 1 ? 's' : ''} would fall outside this schedule`} onClose={() => setModal(null)}>
          <p>{modal.mode === 'publish' ? 'This version can’t be published as it is. Resolve the conflicts below, then publish again.' : 'This version can’t be scheduled yet. Resolve the conflicts below, then schedule it again.'}</p>
          {modal.conflicts.map(({ a, reason }) => (
            <div key={a.id} className="cf-item"><strong>{a.id}</strong><span>{a.user}</span><span className="muted">{fmtDW(dateOfA(a))}, {hm12(startOf(a))} · {a.dur} min</span><span className={'badge ' + stOf(a).b}>{stOf(a).label}</span><span className="cf-r">{reason}</span><span className="sp" /><button type="button" className="btn btn-xs" onClick={() => navigate(routes.aptDetail(a.id))}>Open appointment</button></div>
          ))}
          <div className="safe"><Ico n="shield" s={15} /><span>Existing bookings are never moved, changed or cancelled by an availability edit. To free this time, cancel the appointment from its details.</span></div>
          <div className="m-act"><button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Back to editing</button><button type="button" className="btn btn-primary" onClick={() => actions.protect(modal.conflicts)}>Keep bookings: add date overrides</button></div>
        </Modal>
      )}
      {modal?.kind === 'close' && (
        <Modal title={`Close ${fmtD(modal.date)}?`} onClose={() => setModal(null)}>
          <p>This date has <b>{modal.affected.length}</b> confirmed appointment(s): {modal.affected.map((a) => a.user).join(', ')}.</p>
          <div className="warn">When this version is published, each user is offered a reschedule (once) or a full refund to their User Wallet. You can’t reschedule their booking yourself. This is separate from DND — DND never cancels confirmed appointments.</div>
          <div className="m-act"><button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Keep open</button><button type="button" className="btn btn-danger" onClick={() => { modal.apply(); setModal(null); }}>Close date</button></div>
        </Modal>
      )}
    </div>
  );
}
