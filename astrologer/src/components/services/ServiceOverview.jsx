import Icon from '@/components/ui/Icon.jsx';
import { navigate } from '@/lib/router.js';
import { Chip } from './svShared.jsx';

const SERVICES = [
  { key: 'text', icon: 'chatQuestion', title: 'Text-Based Questions', mode: 'Editable', desc: 'Answer written questions from users, priced by question type and category.', tags: ['Categories', 'Pricing', 'Guidelines'] },
  { key: 'appointments', icon: 'calendar', title: 'Appointments', mode: 'Editable', desc: 'Scheduled voice consultations that users book and pay for in advance.', tags: ['Durations & prices', 'Weekly schedule', 'Time slots'] },
  { key: 'call', icon: 'phone', title: 'Instant Call', mode: 'Editable', desc: 'On-demand voice calls, billed per minute from prepaid packages.', tags: ['Per-minute rate'] },
  { key: 'chat', icon: 'chat', title: 'Instant Chat', mode: 'Editable', desc: 'On-demand text chat, billed per minute from prepaid packages.', tags: ['Per-minute rate'] },
  { key: 'live', icon: 'live', title: 'Live Sessions', mode: 'View & links', desc: 'Free live sessions for the audience you choose, once a month.', tags: ['Rules', 'Links to Live module'] },
];

/** Service Management overview: one row per service with its chips and a "Manage service" button. */
export default function ServiceOverview() {
  return (
    <div className="sv">
      <ul className="sv-card sv-rows">
        {SERVICES.map((s) => (
          <li key={s.key} className="sv-row">
            <span className="sv-row__ic"><Icon name={s.icon} size={22} /></span>
            <div className="sv-row__main">
              <div className="sv-row__t"><h2>{s.title}</h2><Chip tone={s.mode === 'Editable' ? 'teal' : 'gold'}>{s.mode}</Chip></div>
              <p>{s.desc}</p>
              <div className="sv-tags">{s.tags.map((t) => <span key={t} className="sv-tag">{t}</span>)}</div>
            </div>
            <button type="button" className="btn btn-o sv-row__go" aria-label={`Manage ${s.title}`} onClick={() => navigate(`/services/${s.key}`)}>Manage service<Icon name="chevronRight" size={14} stroke={2.2} /></button>
          </li>
        ))}
      </ul>
      <div className="sv-note sv-note--foot"><Icon name="info" size={16} />
        <span><Chip tone="teal">Editable</Chip> services have settings you can change here. <Chip tone="gold">View &amp; links</Chip> shows rules and takes you to the module where the service is run. Switch any service on or off from your Home Dashboard.</span>
      </div>
      <a className="btn btn-o sv-link" href="#/">Go to Home Dashboard</a>
    </div>
  );
}
