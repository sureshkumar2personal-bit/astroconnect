import Icon from '@/components/ui/Icon.jsx';
import { TODAY, ago, dt, fmtDateTime } from '@/lib/format.js';

// One Recent Activity row: small icon, short description, time (AD-20); links to the related detail page.
export default function ActivityItem({ a }) {
  const when = dt(a.at);
  return (
    <a className="li act-item" href={`#${a.href}`}>
      <span className="ic" aria-hidden="true"><Icon name={a.icon} size={22} stroke={1.8} /></span>
      <div className="grow">
        <b className="li-title">{a.title}</b>
        <div className="muted sm">{a.text}</div>
      </div>
      <span className="act-time">
        <span className="sm">{ago(when, TODAY)}</span>
        <span className="muted sm">{fmtDateTime(when)}</span>
      </span>
    </a>
  );
}
