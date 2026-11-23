import Icon from '@/components/ui/Icon.jsx';
import { fmtDate } from '@/lib/format.js';
import { hasActiveSession } from '@/hooks/useCalls.js';
import PlannedUnavailability from './PlannedUnavailability.jsx';

// One compact pill switch (ON = green, as the Online button; DND ON = gold).
function PillSwitch({ label, short, icon, on, onClick, disabled, title, dnd }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} title={title || label}
      onClick={onClick} aria-disabled={disabled || undefined}
      className={`ac-tpill${on ? ' is-on' : ''}${dnd ? ' ac-tpill--dnd' : ''}${disabled ? ' is-disabled' : ''}`}>
      <span className="ac-tpill__dot" aria-hidden="true" />
      {icon && <Icon name={icon} size={16} stroke={1.9} className="ac-tpill__icon" />}
      {short ? (<><span className="ac-tpill__long">{label}</span><span className="ac-tpill__short">{short}</span></>) : <span>{label}</span>}
    </button>
  );
}

// Availability controls in the Home sticky header (AD-04 – AD-09, AD-74):
// Online/Offline, Instant Call, Instant Chat, DND, and Planned Unavailability.
// Same state (useAvailability) and the same rules as the former Availability card.
export default function AvailabilityControls({ a, ui }) {
  const online = a.mode === 'online';
  // Status is locked while DND is on (AD-07); after DND is turned off no status is chosen (AD-08).
  const toggleStatus = () => {
    if (a.dnd) return ui.toast('Turn DND off first.');
    online ? a.setOffline() : a.setOnline();
  };
  const toggleService = (fn) => () => (a.dnd ? ui.toast('Turn DND off first.') : fn());
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
  const statusLabel = online ? 'Online' : 'Offline';
  const plannedTitle = a.pu
    ? `Planned Unavailability · ${fmtDate(new Date(`${a.pu.start}T00:00`))} – ${fmtDate(new Date(`${a.pu.end}T00:00`))}`
    : 'Planned Unavailability';
  const tip = (base, sub) => (sub ? `${base} — ${sub}` : base);

  return (
    <div className="ac-topbar__controls" role="group" aria-label="Availability" title={a.note}>
      <PillSwitch label={statusLabel} on={online} onClick={toggleStatus} disabled={a.dnd}
        title={a.mode === null ? 'Choose Online or Offline' : `${statusLabel} — click to go ${online ? 'Offline' : 'Online'}`} />
      <PillSwitch label="Instant Call" short="Call" icon="phone" on={a.call} onClick={toggleService(a.toggleCall)} disabled={a.dnd} title={tip('Instant Call', a.callSub)} />
      <PillSwitch label="Instant Chat" short="Chat" icon="chat" on={a.chat} onClick={toggleService(a.toggleChat)} disabled={a.dnd} title={tip('Instant Chat', a.chatSub)} />
      <PillSwitch label="DND" icon="moon" on={a.dnd} onClick={toggleDnd} dnd title="DND (Do Not Disturb)" />
      <button type="button" className={`ac-iconbtn ac-topbar__planned${a.pu ? ' is-set' : ''}`} onClick={openPlanned}
        aria-label={plannedTitle} title={plannedTitle}>
        <Icon name="calendarPlus" size={20} />
      </button>
    </div>
  );
}
