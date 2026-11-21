import Card from '@/components/ui/Card.jsx';
import Icon from '@/components/ui/Icon.jsx';
import Toggle from '@/components/ui/Toggle.jsx';
import { fmtDate } from '@/lib/format.js';
import { hasActiveSession } from '@/hooks/useCalls.js';
import PlannedUnavailability from './PlannedUnavailability.jsx';

function StatusPill({ label, selected, onSelect }) {
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={onSelect} className={`ac-pill ${selected ? 'is-selected' : ''}`}>
      <span className="ac-pill__dot" />
      {label}
    </button>
  );
}

function Row({ icon, iconStroke, label, sub, on, toggleLabel, onToggle, last, disabled }) {
  return (
    <div className={`ac-row ${last ? 'ac-row--last' : ''}`}>
      <Icon name={icon} size={24} stroke={iconStroke} className="ac-soft" />
      <div className="ac-row__label">
        <div>{label}</div>
        {sub !== undefined && <div className="ac-row__sub">{sub}</div>}
      </div>
      <Toggle on={on} label={toggleLabel} onToggle={onToggle} disabled={disabled} />
    </div>
  );
}

// Availability (AD-04 – AD-09, AD-74): Online/Offline, Instant Call/Chat, DND and Planned Unavailability.
export default function AvailabilityCard({ a, ui }) {
  const pick = (fn) => () => (a.dnd ? ui.toast('Turn DND off first.') : fn());
  const toggleDnd = () => {
    if (!a.dnd && hasActiveSession()) return ui.toast('Finish your ongoing Instant Call or Chat before turning on DND.');
    ui.toast(a.dnd ? 'DND off — choose Online or Offline.' : 'DND on — your profile is hidden from all users.');
    a.toggleDnd();
  };
  const openPlanned = () => ui.dialog({
    title: 'Planned Unavailability',
    body: (close) => (
      <PlannedUnavailability pu={a.pu} onClose={close}
        onSave={(pu) => { a.setPlanned(pu); close(); ui.toast('Planned Unavailability saved'); }}
        onCancelPeriod={() => { a.setPlanned(null); close(); ui.toast('Planned Unavailability cancelled'); }} />
    ),
  });
  return (
    <Card id="h-avail" icon="live" iconStroke={1.9} title="Availability" info>
      <div role="radiogroup" aria-label="Status" className="ac-pills">
        <StatusPill label="Online" selected={a.mode === 'online'} onSelect={pick(a.setOnline)} />
        <StatusPill label="Offline" selected={a.mode === 'offline'} onSelect={pick(a.setOffline)} />
      </div>
      <Row icon="phone" iconStroke={1.7} label="Instant Call" sub={a.callSub} on={a.call} toggleLabel="Instant Call" onToggle={a.toggleCall} disabled={a.dnd} />
      <Row icon="chat" iconStroke={1.7} label="Instant Chat" sub={a.chatSub} on={a.chat} toggleLabel="Instant Chat" onToggle={a.toggleChat} disabled={a.dnd} />
      <Row icon="moon" iconStroke={1.7} label="DND (Do Not Disturb)" on={a.dnd} toggleLabel="Do Not Disturb" onToggle={toggleDnd} last />
      <button type="button" className="ac-wide-btn" onClick={openPlanned}>
        <Icon name="calendarPlus" size={24} className="ac-icon" />
        <span className="ac-wide-btn__label">Planned Unavailability{a.pu ? ` · ${fmtDate(new Date(`${a.pu.start}T00:00`))} – ${fmtDate(new Date(`${a.pu.end}T00:00`))}` : ''}</span>
        <Icon name="chevronRight" size={20} stroke={2} className="ac-icon" />
      </button>
      <p className="ac-note">
        <Icon name="info" size={16} className="ac-note__icon" />
        <span>{a.note}</span>
      </p>
    </Card>
  );
}
