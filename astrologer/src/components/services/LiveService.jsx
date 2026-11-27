import Icon from '@/components/ui/Icon.jsx';
import useLive, { usedThisMonth } from '@/hooks/useLive.js';
import { TODAY } from '@/lib/format.js';
import { Card, PageHead } from './svShared.jsx';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Service Management → Live Sessions: read-only rules and links to the Live module. */
export default function LiveService() {
  const s = useLive();
  const used = usedThisMonth(s) || !!s.scheduled;
  const next = MONTHS[(TODAY.getMonth() + 1) % 12];
  return (
    <div className="sv">
      <PageHead icon="live" title="Live Sessions" />
      <div className="sv-card sv-links">
        <div className="sv-links__t"><Icon name="info" size={18} /><div><b>Create Live, Live History and Live Settings stay in the Live Sessions module</b><p>This page only shows the rules. Nothing is duplicated here.</p></div></div>
        <div className="sv-links__b">
          <a className="btn sv-btn" href="#/live">Create Live</a>
          <a className="btn btn-o" href="#/live/history">Live History</a>
          <a className="btn btn-o" href="#/live/settings">Live Settings</a>
        </div>
      </div>
      <Card title="Monthly limit" id="sv-lm">
        <div className={`sv-quota${used ? ' is-used' : ''}`}>
          <b>{used ? "This month's Live is used" : `Your Live for ${MONTHS[TODAY.getMonth()]} is available`}</b>
          <span>{used ? `Your next Live can be scheduled or started from 1 ${next}.` : 'Schedule it or start now from the Live Sessions module.'}</span>
        </div>
        <ul className="sv-pol"><li><Icon name="check" size={16} /><div><b>1 Live session per calendar month.</b><span>Schedule Live and Start Now share the same monthly quota. There are no separate quotas.</span></div></li></ul>
      </Card>
      <Card title="Audience" id="sv-au">
        <div className="sv-tags">{['Public', 'Followers', 'Subscribers', 'Specific subscription tiers'].map((t) => <span key={t} className="sv-tag">{t}</span>)}</div>
      </Card>
      <Card title="Access, eligibility & pricing" id="sv-ac">
        <dl className="sv-kv">
          <div><dt>Live access</dt><dd>Follows the existing Live access and enablement rules</dd></div>
          <div><dt>Subscription eligibility</dt><dd>Follows the existing subscription eligibility rules</dd></div>
          <div><dt>Price for users</dt><dd>Free <span className="sv-hint">Paid Live isn't available</span></dd></div>
        </dl>
      </Card>
      <Card title="Notifications" id="sv-ln">
        <div className="sv-note"><Icon name="info" size={16} /><span>When you schedule or start a Live, the existing notifications go only to the eligible audience you selected.</span></div>
      </Card>
    </div>
  );
}
