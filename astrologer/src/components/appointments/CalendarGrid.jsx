import { useMemo, useState } from 'react';
import {
  NOW_MIN, STATUS, TODAY_ISO, addDays, dOf, dateOfA, dayHours, fmtDShort, fmtDW, freeSlots, hm12, isoOf,
  stOf, startOf, toMin, wdFull, wdShort, whenShort,
} from '@/lib/appointments.js';

// Appointments calendar (reference "AstroConnect – Astrologer Appointments"): Day / Week / Month views of the real
// appointments over the astrologer's availability (weekly hours, breaks, closed dates). Shared by the Appointments
// screen and Calendar & Availability. Clicking a booking opens its details; clicking a day header or month cell
// opens that day.
const H0 = 8, H1 = 21, PX = 72;
const P = {
  left: 'M15 6l-6 6 6 6', right: 'M9 6l6 6-6 6', search: 'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM20 20l-3.5-3.5',
  clock: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 7v5l3 2', phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  cal: 'M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2zM3 10h18M8 3v4M16 3v4', list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  x: 'M6 6l12 12M18 6L6 18', lock: 'M7 11h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2zM8 11V8a4 4 0 018 0v3',
  chev: 'M6 9l6 6 6-6', file: 'M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5', shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
};
export const Ico = ({ n, s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>
);

// The calendar's view, date and find text are shared by both screens (kept while navigating).
const mem = { view: 'week', anchor: TODAY_ISO };
const mondayOf = (iso) => addDays(iso, -((dOf(iso).getDay() + 6) % 7));
const y = (min) => (min - H0 * 60) / 60 * PX;
const clampBand = (a, b) => [Math.max(a, H0 * 60), Math.min(b, H1 * 60)];

function rangeLabel(view, anchor) {
  if (view === 'day') return fmtDW(anchor);
  if (view === 'month') { const d = dOf(anchor); return d.toLocaleString('en-US', { month: 'long' }) + ' ' + d.getFullYear(); }
  const s = mondayOf(anchor), e = addDays(s, 6), sd = dOf(s), ed = dOf(e);
  return sd.getMonth() === ed.getMonth() ? `${sd.getDate()} – ${fmtDShort(e)} ${ed.getFullYear()}` : `${fmtDShort(s)} – ${fmtDShort(e)} ${ed.getFullYear()}`;
}

function Column({ iso, list, settings, selId, onOpen, dayView }) {
  const { closed, ranges, override } = dayHours(settings, iso);
  const bands = [];
  if (closed) bands.push({ cls: 'bg-closed', a: H0 * 60, b: H1 * 60, label: (settings.closedNotes || {})[iso] ? `Closed · ${settings.closedNotes[iso]}` : 'Closed' });
  else if (!ranges.length) bands.push({ cls: 'bg-closed', a: H0 * 60, b: H1 * 60, label: 'Unavailable' });
  else {
    ranges.forEach(([a, b]) => bands.push({ cls: 'bg-av', a, b, label: '' }));
    settings.breaks.map(([a, b], i) => [toMin(a), toMin(b), (settings.breakNames || [])[i] || 'Break']).forEach(([b0, b1, name]) => {
      ranges.forEach(([a, b]) => { const s = Math.max(a, b0), e = Math.min(b, b1); if (s < e) bands.push({ cls: 'bg-brk', a: s, b: e, label: e - s >= 30 ? name : '' }); });
    });
  }
  if (iso < TODAY_ISO) bands.push({ cls: 'bg-past', a: H0 * 60, b: H1 * 60, label: '' });
  else if (iso === TODAY_ISO && NOW_MIN > H0 * 60) bands.push({ cls: 'bg-past', a: H0 * 60, b: Math.min(NOW_MIN, H1 * 60), label: '' });
  const evs = list.filter((a) => dateOfA(a) === iso).sort((p, q) => startOf(p) - startOf(q));
  return (
    <div className="tg-col" style={{ height: (H1 - H0) * PX }} title={override ? override.note : undefined}>
      {bands.map((b, i) => { const [a, e] = clampBand(b.a, b.b); return e > a ? <div key={i} className={'bg ' + b.cls} style={{ top: y(a), height: y(e) - y(a) }}>{b.label && <span className="bg-l">{b.label}</span>}</div> : null; })}
      {evs.map((a) => {
        const s = startOf(a), st = stOf(a);
        return (
          <button key={a.id} type="button" className={`ev ${st.e}${a.dur <= 15 ? ' ev-15' : ''}${selId === a.id ? ' sel' : ''}`} style={{ top: y(s), height: Math.max(18, y(s + a.dur) - y(s)) }}
            aria-label={`${a.id} · ${a.user} · ${whenShort(a)} · ${st.label}`} onClick={() => onOpen(a.id)}>
            <span className="ev-t">{dayView ? `${hm12(s)} – ${hm12(s + a.dur)}` : hm12(s)}</span>
            <span className="ev-n">{a.user}</span>
            <span className="ev-m"><Ico n="phone" s={11} />{a.id} · {a.dur} min · Voice</span>
            <span className="ev-st">{st.label}</span>
          </button>
        );
      })}
      {iso === TODAY_ISO && NOW_MIN >= H0 * 60 && NOW_MIN <= H1 * 60 && <div className="nowline" style={{ top: y(NOW_MIN) }} />}
    </div>
  );
}

export default function CalendarGrid({ apt, onOpen, selId, srcLabel, settings: settingsProp }) {
  const settings = settingsProp || apt.settings;
  const [view, setViewS] = useState(mem.view);
  const [anchor, setAnchorS] = useState(mem.anchor);
  const [findQ, setFindQ] = useState('');
  const setView = (v) => { mem.view = v; setViewS(v); };
  const setAnchor = (d) => { mem.anchor = d; setAnchorS(d); };
  const openDay = (iso) => { setAnchor(iso); setView('day'); };
  const list = apt.list;

  const step = (dir) => {
    if (view === 'day') setAnchor(addDays(anchor, dir));
    else if (view === 'week') setAnchor(addDays(anchor, 7 * dir));
    else { const d = dOf(anchor); setAnchor(isoOf(new Date(d.getFullYear(), d.getMonth() + dir, 1))); }
  };
  const q = findQ.trim().toLowerCase();
  const found = q ? list.filter((a) => `${a.id} ${a.user}`.toLowerCase().includes(q)).slice(0, 6) : [];
  const days = view === 'day' ? [anchor] : Array.from({ length: 7 }, (_, i) => addDays(mondayOf(anchor), i));

  const cells = useMemo(() => {
    if (view !== 'month') return [];
    const d = dOf(anchor), first = isoOf(new Date(d.getFullYear(), d.getMonth(), 1));
    const start = mondayOf(first), mKey = first.slice(0, 7);
    const lastDay = isoOf(new Date(d.getFullYear(), d.getMonth() + 1, 0));
    const weeks = Math.ceil((((dOf(first).getDay() + 6) % 7) + Number(lastDay.slice(8))) / 7);
    return Array.from({ length: weeks * 7 }, (_, i) => {
      const iso = addDays(start, i);
      const items = list.filter((a) => dateOfA(a) === iso);
      const live = items.filter((a) => a.status !== 'Cancelled');
      const cx = items.length - live.length;
      const { closed, ranges, override } = dayHours(settings, iso);
      const tags = [];
      if (closed) tags.push(['t-closed', 'Closed']);
      else if (iso >= TODAY_ISO) {
        const n = freeSlots(settings, list, iso).length;
        if (n) tags.push(['t-open', `${n} slot${n > 1 ? 's' : ''} open`]);
        else if (override) tags.push(['', 'Special hours']);
      }
      if (cx) tags.push(['t-cx', `${cx} cancelled`]);
      const cls = [iso.slice(0, 7) !== mKey && 'out', iso === TODAY_ISO && 'today', iso < TODAY_ISO && 'past', (closed || (!ranges.length && !items.length)) && 'closed'].filter(Boolean).join(' ');
      return { iso, items, count: live.length, tags, cls };
    });
  }, [view, anchor, list, settings]);

  return (
    <section className="cal">
      <div className="cal-bar">
        <div className="cal-nav">
          <button type="button" className="icon-btn" aria-label="Previous period" onClick={() => step(-1)}><Ico n="left" /></button>
          <button type="button" className="icon-btn" aria-label="Next period" onClick={() => step(1)}><Ico n="right" /></button>
          <button type="button" className="btn btn-sm" onClick={() => setAnchor(TODAY_ISO)}>Today</button>
          <div className="cal-range">{rangeLabel(view, anchor)}</div>
        </div>
        <div className="cal-tools">
          <div className="find">
            <div className="srch"><Ico n="search" /><input className="inp inp-sm" type="search" placeholder="Find ID or client" aria-label="Find appointment by ID or client name" value={findQ} onChange={(e) => setFindQ(e.target.value)} /></div>
            {q && (
              <div className="find-res">
                {found.map((a) => (
                  <button key={a.id} type="button" onClick={() => { setAnchor(dateOfA(a)); setFindQ(''); onOpen(a.id); }}>
                    <strong>{a.id} · {a.user}</strong><span>{fmtDShort(dateOfA(a))}, {hm12(startOf(a))}</span>
                  </button>
                ))}
                {!found.length && <div className="muted" style={{ padding: '8px 10px', fontSize: 13 }}>No matching appointments</div>}
              </div>
            )}
          </div>
          <label className="sr" htmlFor="apx-go-date">Go to date</label>
          <input id="apx-go-date" className="inp inp-sm date-in" type="date" value={anchor} onChange={(e) => e.target.value && setAnchor(e.target.value)} />
          <div className="seg seg-sm" role="group" aria-label="Calendar view">
            {[['day', 'Day'], ['week', 'Week'], ['month', 'Month']].map(([k, l]) => (
              <button key={k} type="button" className={view === k ? 'on' : ''} aria-pressed={view === k} onClick={() => setView(k)}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="cal-sub">
        <span className="src-tag"><Ico n="clock" s={14} />{srcLabel}</span>
        <div className="legend">
          {Object.values(STATUS).map((s) => <span key={s.label} className="lg"><i className={'l-' + s.e.slice(2)} />{s.label}</span>)}
          <span className="lg"><i className="l-av" />Available</span>
          <span className="lg"><i className="l-brk" />Break</span>
          <span className="lg"><i className="l-off" />Closed / unavailable</span>
        </div>
      </div>
      {view !== 'month' ? (
        <div className="tg-scroll">
          <div className={'tg ' + (view === 'day' ? 'tg-1' : 'tg-7')}>
            <div className="tg-head">
              <div />
              {days.map((iso) => {
                const { closed, ranges } = dayHours(settings, iso);
                const items = list.filter((a) => dateOfA(a) === iso), live = items.filter((a) => a.status !== 'Cancelled').length, cx = items.length - live;
                const count = closed ? 'Closed' : live || cx ? `${live} booked${cx ? ` · ${cx} cxl` : ''}` : ranges.length ? 'Open' : 'Off';
                return (
                  <button key={iso} type="button" className={'tg-dh' + (iso === TODAY_ISO ? ' today' : iso < TODAY_ISO ? ' past' : '')} onClick={() => openDay(iso)} aria-label={`Open ${fmtDW(iso)}`}>
                    <span className="tg-dw">{view === 'day' ? wdFull(iso) : wdShort(iso)}</span><span className="tg-dn">{dOf(iso).getDate()}</span><span className="tg-dc">{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="tg-body">
              <div className="tg-gut">{Array.from({ length: H1 - H0 }, (_, i) => { const h = H0 + i; return <div key={h} className="tg-hr">{String(h % 12 || 12).padStart(2, '0')} {h >= 12 ? 'PM' : 'AM'}</div>; })}</div>
              {days.map((iso) => <Column key={iso} iso={iso} list={list} settings={settings} selId={selId} onOpen={onOpen} dayView={view === 'day'} />)}
            </div>
          </div>
        </div>
      ) : (
        <div className="mo">
          <div className="mo-h">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d}>{d}</div>)}</div>
          <div className="mo-g">
            {cells.map((m) => (
              <button key={m.iso} type="button" className={'mo-c ' + m.cls} onClick={() => openDay(m.iso)} aria-label={`Open ${fmtDW(m.iso)}`}>
                <span className="mo-top"><span className="mo-n">{dOf(m.iso).getDate()}</span><span className="mo-cnt">{m.count ? `${m.count} appt${m.count > 1 ? 's' : ''}` : ''}</span></span>
                <span className="mo-bar">{m.items.map((a) => <i key={a.id} className={stOf(a).d} />)}</span>
                <span className="mo-tags">{m.tags.map(([c, l]) => <span key={l} className={'mo-tag ' + c}>{l}</span>)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
