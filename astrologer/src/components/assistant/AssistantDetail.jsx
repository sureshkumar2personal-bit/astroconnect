import { useState } from 'react';
import Icon from '@/components/ui/Icon.jsx';
import { navigate } from '@/lib/router.js';
import { EXPIRY_LABEL, STATUS_INFO } from '@/data/mockAssistants.js';
import { assistantActions, permState, roleLabel, samePerms, useAssistants } from '@/hooks/useAssistants.js';
import { PermMatrix } from './PermMatrix.jsx';
import { Avatar, Badge, PhotoFrame } from './AssistantList.jsx';

export const TABS = [['profile', 'Profile'], ['permissions', 'Permissions'], ['activity', 'Activity']];

/** Confirmation dialog body for suspend / reactivate / remove / revoke / resend. */
function Confirm({ lead, bullets, ack, okLabel, okCls, onCancel, onOk }) {
  const [on, setOn] = useState(false);
  return (
    <div className="as-dlg">
      <p className="as-dlg__lead">{lead}</p>
      <ul>{bullets.map((b) => <li key={b}>{b}</li>)}</ul>
      {ack && <label className="as-ack"><input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />{ack}</label>}
      <div className="actions"><button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button><button type="button" className={`btn ${okCls}`} disabled={!!ack && !on} onClick={onOk}>{okLabel}</button></div>
    </div>
  );
}

/** Edit details dialog body (name and mobile only; the email is the login). */
function EditForm({ a, onCancel, onSave }) {
  const [name, setName] = useState(a.name);
  const [mobile, setMobile] = useState(a.mobile);
  const [err, setErr] = useState({});
  const ok = () => {
    const e = {};
    if (name.trim().length < 2) e.name = 'Enter the full name.';
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, ''))) e.mobile = 'Enter a valid 10-digit Indian mobile number.';
    if (Object.keys(e).length) return setErr(e);
    onSave(name.trim(), mobile.trim());
  };
  return (
    <div className="as-dlg">
      <p className="as-dlg__lead">Update {a.name.split(' ')[0]}’s name or mobile number.</p>
      <label className="as-f">Full name<input className={`as-input${err.name ? ' bad' : ''}`} value={name} onChange={(e) => { setName(e.target.value); setErr({}); }} />{err.name && <span className="as-err">{err.name}</span>}</label>
      <label className="as-f">Mobile number<input className={`as-input${err.mobile ? ' bad' : ''}`} value={mobile} onChange={(e) => { setMobile(e.target.value); setErr({}); }} />{err.mobile && <span className="as-err">{err.mobile}</span>}</label>
      <label className="as-f">Email address<input className="as-input" value={a.email} disabled /><span className="as-hint">{a.status === 'pending' || a.status === 'expired' ? 'To change the email, revoke this invitation and send a new one.' : 'The email is the login and can’t be changed.'}</span></label>
      <div className="actions"><button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button><button type="button" className="btn as-btn" onClick={ok}>Save details</button></div>
    </div>
  );
}

/** Assistant details: header, six tabs (Profile, Permissions, Tasks, Activity, Wallet, Account). */
export default function AssistantDetail({ id, tab, ui }) {
  const { assistants } = useAssistants();
  const a = assistants.find((x) => x.id === id);
  const [draft, setDraft] = useState(null);
  const [actF, setActF] = useState('all');
  if (!a) return <div className="as"><div className="as-empty"><b>Assistant not found</b><button type="button" className="btn btn-o" onClick={() => navigate('/assistants')}>Back to My Assistants</button></div></div>;
  const removed = a.status === 'removed';
  const cur = TABS.some(([k]) => k === tab) ? tab : 'profile';
  const first = a.name.split(' ')[0];
  const go = (k) => { setDraft(null); navigate(`/assistants/${a.id}${k === 'profile' ? '' : `/${k}`}`); };
  const dlg = (title, body) => ui.dialog({ title, body });
  const note = { active: `Joined ${a.joined}`, pending: `Invitation expires ${a.expires}`, expired: `Invitation expired ${a.expires} · resend from Account`, suspended: `Suspended since ${a.statusSince}`, removed: `${a.revoked ? 'Invitation revoked ' : 'Removed '}${a.removedOn} · read-only record` }[a.status];

  const openEdit = () => dlg('Edit details', (close) => <EditForm a={a} onCancel={close} onSave={(n, m) => { assistantActions.editDetails(a.id, n, m); close(); ui.toast('Details saved.'); }} />);
  const confirm = (title, props) => dlg(title, (close) => <Confirm {...props} onCancel={close} onOk={() => { props.run(); close(); ui.toast(props.done); }} />);
  const ACTIONS = {
    resend: { title: 'Resend invitation', desc: 'Email a new invitation link. Starts a new 7-day validity period and the previous link stops working.', btn: 'Resend invitation', cls: 'as-btn', run: () => confirm('Resend invitation?', { lead: `A new invitation link goes to ${a.email}.`, bullets: [`A new 7-day validity period starts today (until ${EXPIRY_LABEL}).`, 'The previous link stops working.', 'The status stays Pending until the assistant accepts.'], okLabel: 'Resend invitation', okCls: 'as-btn', run: () => assistantActions.resend(a.id, a.email), done: `Invitation resent · valid until ${EXPIRY_LABEL}.` }) },
    edit: { title: 'Edit details', desc: 'Correct the name or mobile number. To use a different email, revoke this invitation and send a new one.', btn: 'Edit details', cls: 'btn-o', run: openEdit },
    revoke: { title: 'Revoke invitation', desc: 'Cancel the invitation now. The link stops working and the record is kept.', btn: 'Revoke invitation', cls: 'danger', run: () => confirm(`Revoke invitation for ${a.name}?`, { lead: 'The invitation link stops working immediately.', bullets: ['The record moves to Removed and stays in history.', `${a.email} can’t be invited again.`, 'To use a different email, send a new invitation to that address.'], ack: 'I understand this email can’t be invited again.', okLabel: 'Revoke invitation', okCls: 'danger-f', run: () => assistantActions.revoke(a.id), done: 'Invitation revoked.' }) },
    suspend: { title: 'Suspend access', desc: 'Block access immediately. Permissions and activity are kept, and you can reactivate at any time.', btn: 'Suspend', cls: 'btn-o', run: () => confirm(`Suspend ${a.name}?`, { lead: `${first} loses access straight away.`, bullets: ['Access to the portal is revoked immediately.', 'Profile, permissions and activity are kept.', 'You can reactivate at any time with the same permissions.'], okLabel: 'Suspend access', okCls: 'as-btn', run: () => assistantActions.suspend(a.id), done: `${a.name} is suspended.` }) },
    reactivate: { title: 'Reactivate access', desc: 'Restore access with the existing permissions.', btn: 'Reactivate', cls: 'as-btn', run: () => confirm(`Reactivate ${a.name}?`, { lead: 'Access is restored immediately.', bullets: ['Existing permissions are kept unchanged.', 'You can adjust permissions any time in the Permissions tab.'], okLabel: 'Reactivate', okCls: 'as-btn', run: () => assistantActions.reactivate(a.id), done: `${a.name} is active again.` }) },
    remove: { title: 'Remove assistant', desc: 'Permanently revoke access. Profile, permissions and activity are kept as a read-only record. The email can never be reused.', btn: 'Remove', cls: 'danger', run: () => confirm(`Remove ${a.name}?`, { lead: 'This is not data deletion. It permanently ends this assistant’s access.', bullets: ['Access is revoked immediately and can’t be restored.', 'Profile, permissions and activity stay as a read-only record.', `${a.email} can never be used for another assistant account.`], ack: 'I understand this can’t be undone and the email can’t be reused.', okLabel: 'Remove assistant', okCls: 'danger-f', run: () => assistantActions.remove(a.id), done: `${a.name} was removed. History is kept.` }) },
  };
  const BY = { active: ['suspend', 'remove'], suspended: ['reactivate', 'remove'], pending: ['resend', 'edit', 'revoke'], expired: ['resend', 'revoke'], removed: [] };

  const perms = draft ? draft.perms : a.perms;
  const base = draft ? draft.base : a.base;
  const ps = permState(perms, base);
  const dirty = !!draft && (!samePerms(draft.perms, a.perms) || draft.base !== a.base);
  const savePerms = () => {
    if (!Object.keys(draft.perms).length) { ui.toast('Keep at least one module enabled, or suspend the account instead.'); return; }
    assistantActions.savePerms(a.id, draft.perms, draft.base); setDraft(null); ui.toast('Permissions saved. Changes are effective immediately.');
  };
  const acts = a.activity.filter((ev) => actF === 'all' || (actF === '7' ? ev.age <= 7 : ev.age <= 30));
  const prof = [['Full name', a.name], ['Email address', a.email], ['Mobile number', a.mobile ? `+91 ${a.mobile}` : '—'], ['Assistant ID', a.id], ['Role', roleLabel(a.role)], ['Account status', STATUS_INFO[a.status].label], ['Joined date', a.joined || 'Not yet · awaiting acceptance'], ['Invited on', a.invited]];
  if (a.status === 'pending') prof.push(['Invitation expires', a.expires]);
  if (a.status === 'expired') prof.push(['Invitation expired', a.expires]);
  if (a.status === 'suspended') prof.push(['Suspended since', a.statusSince]);
  if (removed) prof.push([a.revoked ? 'Invitation revoked' : 'Removed on', a.removedOn]);

  return (
    <div className="as">
      <header className="as-card as-hd">
        <Avatar a={a} lg />
        <div className="as-hd__main"><h2 className="as-h1">{a.name}</h2><div className="as-hd__meta"><span className="as-id">{a.id}</span><span>{roleLabel(a.role)}</span><Badge status={a.status} /><span className="as-muted">{note}</span></div></div>
      </header>
      {removed && <div className="as-note as-note--bad">{a.revoked ? 'Invitation revoked on ' : 'Removed on '}{a.removedOn}. Access is permanently revoked and {a.email} can’t be used for another assistant account. Everything below is a read-only historical record.</div>}
      <div className="as-tabs" role="tablist" aria-label="Assistant sections">
        {TABS.map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={cur === k} className={`as-tab${cur === k ? ' on' : ''}`} onClick={() => go(k)}>{l}</button>)}
      </div>

      <section className="as-card as-pane" role="tabpanel" aria-label={TABS.find(([k]) => k === cur)[1]}>
        {cur === 'profile' && (
          <>
            <div className="as-ph"><h2>Profile</h2>{!removed && <button type="button" className="btn btn-o sm" onClick={openEdit}>Edit details</button>}</div>
            <div className="as-prof"><div className="as-photo"><PhotoFrame a={a} /></div>
              <dl className="as-facts">{prof.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div>
            {(removed || a.status === 'pending' || a.status === 'expired') && <p className="as-hint">{removed ? 'Profile preserved for history. Editing is disabled.' : a.status === 'pending' || a.status === 'expired' ? 'To change the email address, revoke this invitation and send a new one to the correct address.' : ''}</p>}
            {BY[a.status].length > 0 && (
              <ul className="as-actions" aria-label="Account actions">{BY[a.status].map((k) => { const x = ACTIONS[k]; return <li key={k}><div><b>{x.title}</b><p>{x.desc}</p></div><button type="button" className={`btn ${x.cls} sm`} onClick={x.run}>{x.btn}</button></li>; })}</ul>
            )}
          </>
        )}
        {cur === 'permissions' && (
          <>
            <div className="as-ph"><h2>Permissions</h2>
              {!removed && <div className="as-ph__btns"><button type="button" className="btn btn-o sm" disabled={!dirty} onClick={() => setDraft(null)}>Discard</button><button type="button" className="btn as-btn sm" disabled={!dirty} onClick={savePerms}>Save changes</button></div>}</div>
            {dirty && <div className="as-note">Unsaved changes. The assistant keeps their current access until you save.</div>}
            {a.status !== 'active' && !removed && <div className="as-note">{a.status === 'suspended' ? 'Access is suspended. These permissions are kept and apply again if you reactivate.' : 'These permissions apply once the invitation is accepted and the account is Active.'}</div>}
            <PermMatrix perms={perms} base={base} editable={!removed} state={ps} onPerms={(p) => setDraft({ perms: p, base })} onPreset={(r, p) => setDraft({ perms: p, base: r })} />
          </>
        )}
        {cur === 'activity' && (
          <>
            <div className="as-ph"><h2>Activity</h2>
              <div className="as-seg" role="group" aria-label="Filter by date">{[['7', 'Last 7 days'], ['30', 'Last 30 days'], ['all', 'All time']].map(([v, l]) => <button key={v} type="button" className={actF === v ? 'on' : ''} aria-pressed={actF === v} onClick={() => setActF(v)}>{l}</button>)}</div></div>
            {acts.length === 0 ? <div className="as-empty"><b>No activity in this period</b><p>Choose a wider date range.</p></div> : (
              <div className="as-ttable as-atable" role="table" aria-label="Activity">
                <div className="as-tr as-tr--h" role="row"><span>Date</span><span>Time</span><span>Action</span><span>Module</span><span>Description</span></div>
                {acts.map((ev, i) => <div key={i} className="as-tr" role="row"><span>{ev.d}</span><span>{ev.t}</span><b>{ev.action}</b><span>{ev.module}</span><span>{ev.desc}</span></div>)}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
