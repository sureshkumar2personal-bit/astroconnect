import Icon from '@/components/ui/Icon.jsx';

// Message shown when DND is turned on (AD-165; availability rules AD-07, AD-74).
export const DND_MESSAGE = 'DND Mode is ON. You will not appear online, receive new appointments, or receive any consultation requests.';

// Persistent "DND is ON" indicator under the Home header, with a way to turn it off at any time.
export default function DndBanner({ a, ui }) {
  if (!a.dnd) return null;
  const turnOff = () => {
    a.toggleDnd();
    ui.toast('DND off — choose Online or Offline to resume.');
  };
  return (
    <div className="ac-dndbar" role="status">
      <Icon name="moon" size={20} className="ac-dndbar__icon" />
      <p className="ac-dndbar__text"><strong>DND Mode is ON.</strong> You will not appear online, receive new appointments, or receive any consultation requests.</p>
      <button type="button" className="ac-dndbar__off" onClick={turnOff}>Turn off DND</button>
    </div>
  );
}
