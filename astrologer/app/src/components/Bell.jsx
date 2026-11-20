import Icon from './Icon.jsx';

// Notification bell, shared by the Home header and the My Work header.
export default function Bell({ unread }) {
  return (
    <button type="button" aria-label={`Notifications, ${unread} unread`} className="ac-iconbtn ac-bell">
      <Icon name="bell" size={24} />
      <span className="ac-bell__badge">{unread}</span>
    </button>
  );
}
