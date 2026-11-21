import { fmtDate, dt } from '@/lib/format.js';
import { Facts, Grid, Note, Sec } from '@/components/ui/sectionKit.jsx';

// User Profile opened from View Profile (AD-78, AD-137): customer details, interactions,
// subscription status and blocked-user context. Blocking is a request to Platform Admin (AD-161).

const HREF = {
  TQ: (id) => `/work/questions/${id}`,
  APT: (id) => `/work/appointments/${id}`,
  CON: (id) => `/calls/c/${id}`,
};

/** One interaction: "<type> <record ID> <note>", with the ID linked when that page exists. */
function Interaction({ item: [type, id, note] }) {
  const href = id && HREF[id.split('-')[0]]?.(id);
  return (
    <div className="li">
      <span className="ic" aria-hidden="true">•</span>
      <span>
        {type}
        {id && <> {href ? <a href={`#${href}`}>{id}</a> : id}</>}
        {note && <> {note}</>}
      </span>
    </div>
  );
}

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
      <Sec title="Interactions">
        <div className="stack">
          {u.inter.length ? u.inter.map((i) => <Interaction key={i.join(' ')} item={i} />) : <span className="muted">No interactions yet</span>}
        </div>
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
