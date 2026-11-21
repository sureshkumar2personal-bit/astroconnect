import { Badge } from '@/components/ui/sectionKit.jsx';
import { NCAT } from '@/data/mockNotifications.js';
import { dt, fmtDateTime } from '@/lib/format.js';

// One notification: category, title, text, date and time, Read/Unread, security alert flag (AD-149).
// The row links to the exact related detail page; opening it marks it Read.
export default function NotificationItem({ n, onOpen }) {
  return (
    <a className={`li nt-item${n.read ? '' : ' is-unread'}`} href={`#${n.href}`} onClick={() => onOpen(n.id)}>
      <span className="ic" aria-hidden="true">{n.cat}</span>
      <div className="grow">
        <div className="nt-head">
          <b>{n.title}</b>
          {n.security && <Badge kind="bad">Security alert</Badge>}
          {!n.read && <Badge kind="warn">Unread</Badge>}
        </div>
        <div className="sm">{n.text}</div>
        <span className="muted sm">{NCAT[n.cat]} · {fmtDateTime(dt(n.at))}</span>
      </div>
      <span className="go" aria-hidden="true">›</span>
    </a>
  );
}
