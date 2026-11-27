import { MODULES, LOCKED_MODULES, preset } from '@/data/mockAssistants.js';

const cap = (a) => a.charAt(0).toUpperCase() + a.slice(1);

/** Preset buttons, state label and the module / access / actions matrix (shared by Add and Permissions tab). */
export function PermMatrix({ perms, base, editable, onPerms, onPreset, state }) {
  const setMod = (id, on) => { const np = { ...perms }; if (on) delete np[id]; else np[id] = ['view']; onPerms(np); };
  const setAct = (id, a) => { const arr = (perms[id] || []).slice(); const i = arr.indexOf(a); if (i >= 0) arr.splice(i, 1); else arr.push(a); onPerms({ ...perms, [id]: arr }); };
  return (
    <>
      <div className="as-ptool">
        <span className="as-lbl">Preset</span>
        <div className="as-seg" role="group" aria-label="Apply preset">
          {['assistant', 'editor'].map((r) => <button key={r} type="button" className={base === r ? 'on' : ''} aria-pressed={base === r} disabled={!editable} onClick={() => onPreset(r, preset(r))}>{r === 'editor' ? 'Editor' : 'Assistant'}</button>)}
        </div>
        <span className={`as-pstate${state.isPreset ? ' is-preset' : ''}`}>{state.label}</span>
        <span className="as-muted">{state.count}</span>
      </div>
      <div className="as-matrix" role="table" aria-label="Permissions">
        <div className="as-mrow as-mrow--h" role="row"><span>Module</span><span>Access</span><span>Allowed actions</span></div>
        {MODULES.map((m) => {
          const g = perms[m.id] || []; const on = g.includes('view');
          return (
            <div key={m.id} className="as-mrow" role="row">
              <span className="as-mrow__n"><b>{m.label}</b>{m.note && <small>{m.note}</small>}</span>
              <button type="button" role="switch" aria-checked={on} aria-label={`Access to ${m.label}`} disabled={!editable} className={`as-sw${on ? ' on' : ''}`} onClick={() => setMod(m.id, on)}><span /></button>
              <span className="as-acts">
                {m.actions.map((a) => {
                  const c = g.includes(a); const locked = !editable || !on || a === 'view';
                  return <label key={a} className={`as-act${c ? ' on' : ''}${!on ? ' off' : ''}`}><input type="checkbox" checked={c} disabled={locked} onChange={() => setAct(m.id, a)} />{cap(a)}</label>;
                })}
              </span>
            </div>
          );
        })}
        {LOCKED_MODULES.map((l) => (
          <div key={l.label} className="as-mrow as-mrow--lock" role="row"><span className="as-mrow__n"><b>{l.label}</b></span><span className="as-lockmsg">{l.why}</span></div>
        ))}
      </div>
    </>
  );
}
