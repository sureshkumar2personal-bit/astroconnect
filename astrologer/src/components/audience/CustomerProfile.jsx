import { fmtDate, dt } from '@/lib/format.js';
import { Facts, Grid, Note, Sec } from '@/components/ui/sectionKit.jsx';

// User Profile opened from View Profile (AD-78, AD-137): customer details, subscription status
// and blocked-user context. Blocking is a request to Platform Admin (AD-161).
// The Interactions card was removed on request; AD-137 still lists interactions (flagged).

export default function CustomerProfile({ u }) {
  return (
    <Grid>
      <Sec title="Customer details">
        <Facts items={[
          ['User ID', u.uid],
          ['Follow status', u.follow ? 'Following' : 'Not following'],
          ['Subscription', u.sub || 'None'],
          ['Customer since', fmtDate(dt(u.since))],
        ]} />
        <p className="muted sm">Birth details only where the user has given consent.</p>
      </Sec>
      <Sec title="Blocked-user context">
        {u.blocked ? <Note>{u.blocked}</Note> : (
          <>
            <p className="sm">You can't block a user directly. Send a request and Platform Admin will review it.</p>
            <a className="btn btn-o danger" href={`#/support/new/Audience%2FCustomers/${encodeURIComponent(u.uid)}`}>Request to block this user</a>
          </>
        )}
      </Sec>
    </Grid>
  );
}
