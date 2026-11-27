import { useState } from 'react';
import Icon from '@/components/ui/Icon.jsx';
import { TODAY } from '@/lib/format.js';
import { availabilitySettings as A } from '@/data/mockAppointments.js';
import { AvailCard, Card, PageHead, SaveBar, Sw, clone, useDraft, validPrice } from './svShared.jsx';

const DAYS = [['Mon', 'Monday'], ['Tue', 'Tuesday'], ['Wed', 'Wednesday'], ['Thu', 'Thursday'], ['Fri', 'Friday'], ['Sat', 'Saturday'], ['Sun', 'Sunday']];
const JS_DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const mins = (t) => { const p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); };
const fmt = (t) => { const m = mins(t); const h = Math.floor(m / 60); const mm = m % 60; return `${h % 12 === 0 ? 12 : h % 12}:${mm < 10 ? '0' : ''}${mm} ${h >= 12 ? 'PM' : 'AM'}`; };

// Starts from the existing Appointments settings (Calendar & Availability): lengths, prices and the weekly ranges.
const INITIAL = {
  durations: { d15: { on: true, price: String(A.p15) }, d30: { on: true, price: String(A.p30) } },
  days: Object.fromEntries(DAYS.map(([k]) => [k, (A.week[k] || []).length > 0])),
  slots: Object.fromEntries(DAYS.map(([k]) => [k, (A.week[k] || []).map(([s, e]) => ({ s, e }))])),
  reminder: '30',
};

const POLICIES = [
  ['Successful payment confirms the appointment automatically.', 'No approval from you is needed after payment.'],
  ['A selected slot is held for 10 minutes while the user pays.'],
  ['Only subscribed users can book appointments.', 'Following you alone does not make a user eligible.'],
  ['Consultations are voice/audio only. There is no video.'],
  ['You start the call from your side at the appointment time.'],
  ['Cancellations and refunds follow existing AstroConnect platform rules.'],
  ['Rescheduling follows existing AstroConnect rules.'],
];

/** Service Management → Appointments: lengths and prices, weekdays, time ranges, window preview, policies. */
export default function AppointmentService() {
  const f = useDraft(INITIAL);
  const d = f.draft;
  const [addDay, setAddDay] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [err, setErr] = useState('');

  const selected = DAYS.filter(([k]) => d.days[k]);
  const first = selected[0];
  const canCopy = selected.length > 1 && first && (d.slots[first[0]] || []).length > 0;
  const summary = selected.length === 0 ? "No weekdays selected. Users can't book appointments." : `${selected.length} of 7 days selected: ${selected.map((x) => x[1]).join(', ')}.`;
  const week = Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + i);
    const key = JS_DOW[dt.getDay()];
    return { dow: key, date: dt.getDate(), open: d.days[key] && (d.slots[key] || []).length > 0 };
  });

  const confirmAdd = () => {
    if (!from || !to) return setErr('Choose a start and end time.');
    const a = mins(from); const b = mins(to);
    if (b <= a) return setErr('End time must be after the start time.');
    if (b - a < 15) return setErr('A time range must fit at least one 15-minute consultation.');
    if ((d.slots[addDay] || []).some((z) => a < mins(z.e) && b > mins(z.s))) return setErr('This overlaps a time you already added for this day.');
    f.upd((x) => { x.slots[addDay] = (x.slots[addDay] || []).concat([{ s: from, e: to }]); });
    setAddDay(null); setErr('');
  };
  const save = () => {
    const dur = d.durations;
    if (!dur.d15.on && !dur.d30.on) return f.setError('Offer at least one consultation length.');
    if ((dur.d15.on && !validPrice(dur.d15.price)) || (dur.d30.on && !validPrice(dur.d30.price))) return f.fail('Enter a price above ₹0 for each length you offer.');
    f.commit(); setAddDay(null);
  };

  return (
    <div className="sv">
      <PageHead icon="calendar" title="Appointments" />

      <Card title="Consultation length & price" id="sv-dur">
        <div className="sv-two">
          {[['d15', '15 minutes'], ['d30', '30 minutes']].map(([k, label]) => {
            const v = d.durations[k]; const bad = f.tried && v.on && !validPrice(v.price);
            return (
              <div key={k} className={`sv-type${v.on ? '' : ' is-off'}`}>
                <div className="sv-type__top"><div><b>{label}</b><p>{v.on ? 'Offered to users' : 'Not offered'}</p></div><Sw on={v.on} label={`Offer ${label} appointments`} onClick={() => f.upd((x) => { x.durations[k].on = !x.durations[k].on; })} /></div>
                <label className={`sv-money${bad ? ' bad' : ''}`}><i>₹</i><input type="text" inputMode="decimal" value={v.price} disabled={!v.on} aria-invalid={bad} aria-label={`Price for ${label}, in rupees`} onChange={(e) => f.upd((x) => { x.durations[k].price = e.target.value; })} /><em>per session</em></label>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Weekly availability" id="sv-week">
        <div className="sv-days" role="group" aria-label="Weekdays">
          {DAYS.map(([k, full]) => <button key={k} type="button" className={`sv-day${d.days[k] ? ' on' : ''}`} aria-pressed={!!d.days[k]} aria-label={full} onClick={() => f.upd((x) => { x.days[k] = !x.days[k]; })}>{k}</button>)}
        </div>
        <p className="sv-hint">{summary}</p>
      </Card>

      <Card title="Appointment time slots" id="sv-slots"
        right={canCopy && <button type="button" className="btn btn-o sm" onClick={() => f.upd((x) => { selected.forEach(([k]) => { x.slots[k] = clone(x.slots[first[0]]); }); })}>Use {first[1]}'s times for every selected day</button>}>
        {selected.length === 0 ? <p className="sv-empty">Select at least one weekday above to add times.</p> : selected.map(([k, full]) => {
          const list = (d.slots[k] || []).slice().sort((a, b) => mins(a.s) - mins(b.s));
          return (
            <div key={k} className="sv-slotrow">
              <b>{full}</b>
              <div className="sv-slots">
                {list.map((t) => (
                  <span key={`${t.s}-${t.e}`} className="sv-slot">{fmt(t.s)} – {fmt(t.e)}
                    <button type="button" aria-label={`Remove ${fmt(t.s)} to ${fmt(t.e)} on ${full}`} onClick={() => f.upd((x) => { x.slots[k] = x.slots[k].filter((z) => !(z.s === t.s && z.e === t.e)); })}><Icon name="close" size={12} /></button>
                  </span>
                ))}
                {list.length === 0 && <span className="sv-empty sv-empty--in">No times yet, so users won't see slots on this day.</span>}
                {addDay !== k && <button type="button" className="btn btn-o sm" aria-label={`Add time on ${full}`} onClick={() => { setAddDay(k); setFrom(''); setTo(''); setErr(''); }}>+ Add time</button>}
              </div>
              {addDay === k && (
                <div className="sv-addtime">
                  <label className="sv-f">From<input type="time" value={from} onChange={(e) => { setFrom(e.target.value); setErr(''); }} /></label>
                  <label className="sv-f">To<input type="time" value={to} onChange={(e) => { setTo(e.target.value); setErr(''); }} /></label>
                  <div className="sv-li__acts"><button type="button" className="btn btn-o sm" onClick={() => { setAddDay(null); setErr(''); }}>Cancel</button><button type="button" className="btn sv-btn sm" onClick={confirmAdd}>Add time</button></div>
                  {err && <span className="sv-err" role="alert">{err}</span>}
                </div>
              )}
            </div>
          );
        })}
      </Card>

      <Card title="Booking window" id="sv-win">
        <dl className="sv-kv">
          <div><dt>Book up to</dt><dd>90 days ahead</dd></div>
          <div><dt>Dates in the User App</dt><dd>Shown 7 calendar days at a time, rolling forward</dd></div>
          <div><dt>Slots shown to users</dt><dd>Only open slots. Booked, held and past times are hidden.</dd></div>
        </dl>
        <h3 className="sv-h3">Preview: the first 7-day window from today</h3>
        <div className="sv-week">{week.map((w, i) => <div key={i} className={`sv-wk${w.open ? ' open' : ''}`}><span>{w.dow}</span><b>{w.date}</b><em>{w.open ? 'Open' : 'Not offered'}</em></div>)}</div>
      </Card>

      <Card title="Notifications & reminders" id="sv-rem">
        <div className="sv-note"><Icon name="info" size={16} /><span>You and the user are notified when a booking is confirmed, and reminded before it starts, through the existing booking notifications.</span></div>
      </Card>

      <Card title="Booking policies" id="sv-pol">
        <ul className="sv-pol">{POLICIES.map((p) => <li key={p[0]}><Icon name="check" size={16} /><div><b>{p[0]}</b>{p[1] && <span>{p[1]}</span>}</div></li>)}</ul>
      </Card>

      <AvailCard name="Appointment" />
      <SaveBar status={f.status} dirty={f.dirty} onCancel={() => { f.discard(); setAddDay(null); }} onSave={save} />
    </div>
  );
}
