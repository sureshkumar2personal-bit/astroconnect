// Previous-period change chip (spec 13, AD-146 — reference `chg`): ↑/↓ % with the calculation as a tooltip.
// c: { txt, cls, calc } from chg() in lib/analytics.js.
export default function Chg({ c }) {
  if (!c || !c.txt) return null;
  return <span className={c.cls} title={c.calc}>{c.txt}</span>;
}

/**
 * Stat card (reference `.stat`): label with an optional colour swatch, big value, change chip and a short
 * "Previous …" line. With onClick it is a toggle button (on = picked, off = hidden series); hero = dark card.
 */
export function Stat({ name, val, chg, sub, c, on, off, hero, onClick }) {
  const cls = 'stat' + (on ? ' on' : '') + (off ? ' off' : '') + (hero ? ' hero' : '');
  const body = (
    <>
      <span className="lbl">{c && <i className="sw" style={{ background: c }} />}{name}</span>
      <span className="val num">{val}</span>
      <span className="srow"><Chg c={chg} />{sub && <span className="ss">{sub}</span>}</span>
    </>
  );
  return onClick
    ? <button type="button" className={cls} aria-pressed={!!on || (off === undefined ? undefined : !off)} onClick={onClick}>{body}</button>
    : <div className={cls}>{body}</div>;
}

/** "Previous 3,109" line under a stat value. */
export const prevTxt = (v, f) => (v == null ? 'No earlier data' : 'Previous ' + (f ? f(v) : Math.round(v).toLocaleString('en-IN')));
