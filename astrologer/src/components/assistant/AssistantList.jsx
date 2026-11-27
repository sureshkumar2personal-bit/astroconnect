import { useState } from 'react';
import Icon from '@/components/ui/Icon.jsx';
import { navigate } from '@/lib/router.js';
import { STATUS_INFO } from '@/data/mockAssistants.js';
import { initials, roleLabel, useAssistants } from '@/hooks/useAssistants.js';

const PAGE = 6;
const STATUSES = [['all', 'All'], ['active', 'Active'], ['pending', 'Pending'], ['expired', 'Expired'], ['suspended', 'Suspended'], ['removed', 'Removed']];
const subOf = (a) => (a.status === 'pending' ? `Expires ${a.expires}` : a.status === 'expired' ? `Expired ${a.expires}` : a.status === 'suspended' ? `Since ${a.statusSince}` : a.status === 'removed' ? `${a.revoked ? 'Invite revoked ' : 'Removed '}${a.removedOn}` : `Joined ${a.joined}`);

/** Round avatar: the photo when the record has one (a.photo), otherwise gradient initials. `lg` adds a status dot. */
export const Avatar = ({ a, lg }) => (
  <span className={`as-av as-av${a.av}${lg ? ' as-av--lg' : ''}`} aria-hidden="true">
    {a.photo ? <img src={a.photo} alt="" /> : initials(a.name)}
    {lg && <i className={`as-av__dot as-av__dot--${a.status}`} />}
  </span>
);
/** Larger framed photo for the Profile tab: photo when available, otherwise a person icon on a soft gradient. */
export const PhotoFrame = ({ a }) => (
  <div className={`as-frame as-av${a.av}`} role="img" aria-label={a.photo ? `${a.name} profile photo` : `${a.name} has no profile photo`}>
    {a.photo ? <img src={a.photo} alt="" /> : (
      <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20.5c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5" /></svg>
    )}
    {!a.photo && <span className="as-frame__initials" aria-hidden="true">{initials(a.name)}</span>}
  </div>
);
export const Badge = ({ status }) => <span className={`as-b as-b--${status}`}>{STATUS_INFO[status].label}</span>;

/** My Assistants list: search, role and status filters, table (cards on phones) and paging. */
export default function AssistantList() {
  const { assistants } = useAssistants();
  const [q, setQ] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);
  const counts = { all: 0, active: 0, pending: 0, expired: 0, suspended: 0, removed: 0 };
  assistants.forEach((a) => { counts[a.status] += 1; if (a.status !== 'removed') counts.all += 1; });
  const term = q.trim().toLowerCase();
  let rows = assistants.filter((a) => (status === 'all' ? a.status !== 'removed' : a.status === status));
  if (role !== 'all') rows = rows.filter((a) => a.role === role);
  if (term) rows = rows.filter((a) => `${a.name} ${a.email} ${a.id}`.toLowerCase().includes(term));
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const pg = Math.min(page, pages - 1);
  const slice = rows.slice(pg * PAGE, pg * PAGE + PAGE);
  const open = (id) => navigate(`/assistants/${id}`);
  const clear = () => { setQ(''); setStatus('all'); setRole('all'); setPage(0); };

  return (
    <div className="as">
      <div className="as-top">
        <button type="button" className="btn as-btn" onClick={() => navigate('/assistants/add')}><Icon name="userplus" size={18} />Add Assistant</button>
      </div>
      <section className="as-card">
        <div className="as-tools">
          <label className="as-search"><span className="sr">Search assistants</span>
            <input type="search" value={q} placeholder="Search by name, email or Assistant ID" aria-label="Search assistants" onChange={(e) => { setQ(e.target.value); setPage(0); }} /></label>
          <div className="as-roles"><span className="as-lbl">Role</span>
            <div className="as-seg" role="group" aria-label="Filter by role">
              {[['all', 'All'], ['assistant', 'Assistant'], ['editor', 'Editor']].map(([v, l]) => <button key={v} type="button" className={role === v ? 'on' : ''} aria-pressed={role === v} onClick={() => { setRole(v); setPage(0); }}>{l}</button>)}
            </div>
          </div>
        </div>
        <div className="as-chips" role="group" aria-label="Filter by status">
          {STATUSES.map(([v, l]) => <button key={v} type="button" className={`as-chip${status === v ? ' on' : ''}`} aria-pressed={status === v} onClick={() => { setStatus(v); setPage(0); }}>{l} <b>{counts[v]}</b></button>)}
        </div>
        {status === 'removed' && <p className="as-note">Removed assistants are kept as read-only history. Their access is permanently revoked and their email addresses can’t be reused.</p>}

        {rows.length === 0 ? (
          <div className="as-empty"><b>No assistants match</b><p>Try another name, email or ID, or change the filters.</p><button type="button" className="btn btn-o" onClick={clear}>Clear search and filters</button></div>
        ) : (
          <>
            <div className="as-table" role="table" aria-label="Assistants">
              <div className="as-trow as-trow--h" role="row"><span>Assistant</span><span>Email</span><span>Assistant ID</span><span>Role</span><span>Status</span><span>Actions</span></div>
              {slice.map((a) => (
                <div key={a.id} className="as-trow" role="row">
                  <span className="as-who"><Avatar a={a} /><b>{a.name}</b></span>
                  <span className="as-em">{a.email}</span><span className="as-id">{a.id}</span><span>{roleLabel(a.role)}</span>
                  <span className="as-st"><Badge status={a.status} /><small>{subOf(a)}</small></span>
                  <span><button type="button" className="btn btn-o sm" aria-label={`View details for ${a.name}`} onClick={() => open(a.id)}>View details</button></span>
                </div>
              ))}
            </div>
            <div className="as-cards">
              {slice.map((a) => (
                <button key={a.id} type="button" className="as-mc" onClick={() => open(a.id)} aria-label={`View details for ${a.name}`}>
                  <div className="as-mc__top"><Avatar a={a} /><div><b>{a.name}</b><small>{a.email}</small></div></div>
                  <div className="as-mc__row"><span>{a.id}</span><span>{roleLabel(a.role)}</span></div>
                  <div className="as-mc__row"><Badge status={a.status} /><small>{subOf(a)}</small></div>
                </button>
              ))}
            </div>
            <div className="as-pager">
              <span>Showing {pg * PAGE + 1}–{pg * PAGE + slice.length} of {rows.length}</span>
              <div><button type="button" className="btn btn-o sm" disabled={pg === 0} onClick={() => setPage(pg - 1)}>Previous</button><span className="as-pg">Page {pg + 1} of {pages}</span><button type="button" className="btn btn-o sm" disabled={pg >= pages - 1} onClick={() => setPage(pg + 1)}>Next</button></div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
