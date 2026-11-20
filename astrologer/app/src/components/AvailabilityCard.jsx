import Card from './Card.jsx';
import Icon from './Icon.jsx';
import Toggle from './Toggle.jsx';

function StatusPill({ label, selected, onSelect }) {
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={onSelect} className={`ac-pill ${selected ? 'is-selected' : ''}`}>
      <span className="ac-pill__dot" />
      {label}
    </button>
  );
}

function Row({ icon, iconStroke, label, sub, on, toggleLabel, onToggle, last }) {
  return (
    <div className={`ac-row ${last ? 'ac-row--last' : ''}`}>
      <Icon name={icon} size={24} stroke={iconStroke} className="ac-soft" />
      <div className="ac-row__label">
        <div>{label}</div>
        {sub !== undefined && <div className="ac-row__sub">{sub}</div>}
      </div>
      <Toggle on={on} label={toggleLabel} onToggle={onToggle} />
    </div>
  );
}

// Availability (AD-04 – AD-09). Planned Unavailability is a placeholder: its
// editing/cancelling behaviour is pending (AP-01-10).
export default function AvailabilityCard({ a }) {
  return (
    <Card id="h-avail" icon="live" iconStroke={1.9} title="Availability" info>
      <div role="radiogroup" aria-label="Status" className="ac-pills">
        <StatusPill label="Online" selected={a.mode === 'online'} onSelect={a.setOnline} />
        <StatusPill label="Offline" selected={a.mode === 'offline'} onSelect={a.setOffline} />
      </div>
      <Row icon="phone" iconStroke={1.7} label="Instant Call" sub={a.callSub} on={a.call} toggleLabel="Instant Call" onToggle={a.toggleCall} />
      <Row icon="chat" iconStroke={1.7} label="Instant Chat" sub={a.chatSub} on={a.chat} toggleLabel="Instant Chat" onToggle={a.toggleChat} />
      <Row icon="moon" iconStroke={1.7} label="DND (Do Not Disturb)" on={a.dnd} toggleLabel="Do Not Disturb" onToggle={a.toggleDnd} last />
      <button type="button" className="ac-wide-btn">
        <Icon name="calendarPlus" size={24} className="ac-icon" />
        <span className="ac-wide-btn__label">Planned Unavailability</span>
        <Icon name="chevronRight" size={20} stroke={2} className="ac-icon" />
      </button>
      <p className="ac-note">
        <Icon name="info" size={16} className="ac-note__icon" />
        <span>{a.note}</span>
      </p>
    </Card>
  );
}
