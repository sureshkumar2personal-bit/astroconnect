import { useState } from 'react';
import Icon from '@/components/ui/Icon.jsx';
import { navigate } from '@/lib/router.js';
import { ROLE_CARDS, preset } from '@/data/mockAssistants.js';
import { assistantActions, permState, roleLabel, useAssistants, validateInvite } from '@/hooks/useAssistants.js';
import { PermMatrix } from './PermMatrix.jsx';

const EMPTY = { name: '', email: '', mobile: '', role: '', base: '', perms: {} };

/** Add Assistant: details, role, permissions, summary and "Send Invitation" (email only, valid 7 days). */
export default function AssistantAdd() {
  const { assistants, nextNum } = useAssistants();
  const [f, setF] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const errs = submitted ? validateInvite(f, assistants) : {};
  const keys = Object.keys(errs);
  const upd = (part) => setF((x) => ({ ...x, ...part }));
  const st = f.role ? permState(f.perms, f.base || f.role) : null;
  const send = () => {
    if (Object.keys(validateInvite(f, assistants)).length) { setSubmitted(true); return; }
    const id = assistantActions.invite(f);
    navigate(`/assistants/added/${id}`);
  };
  const inp = (k) => `as-input${errs[k] ? ' bad' : ''}`;

  return (
    <div className="as">
      {keys.length > 0 && <div className="as-errbox" role="alert"><Icon name="alert" size={18} /><div><b>{keys.length === 1 ? '1 issue.' : `${keys.length} issues.`}</b> Fix the highlighted fields before sending the invitation.</div></div>}

      <div className="as-split">
        <div className="as-col">
          <section className="as-card">
            <header className="as-sh"><span className="as-step">A</span><div><h2>Basic details</h2><p>All fields are required</p></div></header>
            <div className="as-form">
              <label className="as-f">Full name<input className={inp('name')} type="text" value={f.name} placeholder="e.g. Anitha Gopal" aria-invalid={!!errs.name} onChange={(e) => upd({ name: e.target.value })} />{errs.name && <span className="as-err">{errs.name}</span>}</label>
              <label className="as-f">Email address<input className={inp('email')} type="email" value={f.email} placeholder="name@example.com" aria-invalid={!!errs.email} onChange={(e) => upd({ email: e.target.value })} />
                {errs.email ? <span className="as-err">{errs.email}</span> : <span className="as-hint">The invitation is sent to this address only. It becomes the assistant’s login.</span>}</label>
              <label className="as-f">Mobile number<span className="as-phone"><i>+91</i><input className={inp('mobile')} type="tel" value={f.mobile} placeholder="98400 12345" aria-invalid={!!errs.mobile} onChange={(e) => upd({ mobile: e.target.value })} /></span>{errs.mobile && <span className="as-err">{errs.mobile}</span>}</label>
            </div>
          </section>
          <section className="as-card">
            <header className="as-sh"><span className="as-step">B</span><div><h2>Role</h2><p>Choose before sending</p></div></header>
            <div className="as-roles2" role="radiogroup" aria-label="Role">
              {ROLE_CARDS.map((r) => <button key={r.v} type="button" role="radio" aria-checked={f.role === r.v} className={`as-rc${f.role === r.v ? ' on' : ''}`} onClick={() => upd(f.role === r.v ? {} : { role: r.v, base: r.v, perms: preset(r.v) })}><b>{r.title}</b><span>{r.desc}</span></button>)}
            </div>
            {errs.role && <span className="as-err">{errs.role}</span>}
          </section>
          <section className="as-card">
            <header className="as-sh"><span className="as-step">C</span><div><h2>Permissions</h2><p>Start from a preset, then customise</p></div></header>
            {f.role && <PermMatrix perms={f.perms} base={f.base} editable state={st} onPerms={(p) => upd({ perms: p })} onPreset={(r, p) => upd({ base: r, perms: p })} />}
            {errs.perms && <span className="as-err">{errs.perms}</span>}
            <p className="as-note"><b>Never grantable to assistants:</b> wallet transfers, withdrawals and Super Admin-only approvals. These stay blocked whatever preset or custom permissions you choose.</p>
          </section>
        </div>
        <aside className="as-card as-sum" aria-label="Invitation summary">
          <h2>Invitation summary</h2>
          <dl>
            <div><dt>Name</dt><dd>{f.name.trim() || '—'}</dd></div><div><dt>Email</dt><dd>{f.email.trim() || '—'}</dd></div>
            <div><dt>Role</dt><dd>{roleLabel(f.role)}</dd></div><div><dt>Permissions</dt><dd>{st ? st.short : '—'}</dd></div>
            <div><dt>Method</dt><dd>Email only</dd></div><div><dt>Valid for</dt><dd>7 days</dd></div>
            <div><dt>Assistant ID</dt><dd>Generated on send <small>(next: AST-AS-{String(nextNum).padStart(4, '0')})</small></dd></div><div><dt>Status</dt><dd>Pending</dd></div>
          </dl>
          <button type="button" className="btn as-btn as-block" onClick={send}>Send Invitation</button>
          <button type="button" className="btn btn-o as-block" onClick={() => navigate('/assistants')}>Cancel</button>
        </aside>
      </div>
    </div>
  );
}
