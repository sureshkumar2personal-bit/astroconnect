import Icon from '@/components/ui/Icon.jsx';
import { TODAY, isoDay } from '@/lib/format.js';

// Toolbar controls of the Notification & Activity page: search, category / date selects, the custom date
// range, the All / Unread / Read toggle and the pager (AD-148, AD-149 category filters, notification history).
export const PER = 10;
export const DATE_OPTS = [['any', 'Any date'], ['today', 'Today'], ['yesterday', 'Yesterday'], ['7d', 'Last 7 Days'], ['30d', 'Last 30 Days'], ['custom', 'Custom Date Range']];

const sod = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const dayDiff = (d) => Math.round((sod(TODAY) - sod(d)) / 864e5);
const pday = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };

/** Does a date fall inside the chosen date filter (Today / Yesterday / 7 / 30 days / custom range)? */
export function inDate(d, f) {
  const n = dayDiff(d);
  if (f.date === 'today') return n === 0;
  if (f.date === 'yesterday') return n === 1;
  if (f.date === '7d') return n >= 0 && n <= 6;
  if (f.date === '30d') return n >= 0 && n <= 29;
  if (f.date === 'custom') {
    const day = sod(d);
    if (f.from && day < pday(f.from)) return false;
    if (f.to && day > pday(f.to)) return false;
  }
  return true;
}

const Svg = ({ d, size = 16, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const ICON_PATHS = {
  search: 'M4 11a7 7 0 1 0 14 0a7 7 0 1 0-14 0M20 20l-3.5-3.5',
  chevDown: 'M6 9l6 6 6-6',
  chevLeft: 'M15 6l-6 6 6 6',
  chevRight: 'M9 6l6 6-6 6',
  x: 'M6 6l12 12M18 6L6 18',
  checks: 'M2 12.5l4.5 4.5L14 8M10 16l1 1 9-10',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  mailOpen: 'M3 10l9-6 9 6v9H3zM3 10l9 6 9-6',
};
export const Ic = ({ n, size, sw }) => <Svg d={ICON_PATHS[n]} size={size} sw={sw} />;

export function Select({ label, value, onChange, options, active }) {
  return (
    <label className="nc-sel">
      <span className="sr">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={active ? 'on' : ''}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <Ic n="chevDown" />
    </label>
  );
}

export function Search({ value, onChange, placeholder, label }) {
  return (
    <label className="nc-search">
      <span className="sr">{label}</span>
      <Ic n="search" size={17} />
      <input type="search" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {value && <button type="button" className="nc-clr" aria-label="Clear search" onClick={() => onChange('')}><Ic n="x" size={15} /></button>}
    </label>
  );
}

export function DateRange({ f, set }) {
  if (f.date !== 'custom') return null;
  const today = isoDay(TODAY);
  return (
    <div className="nc-range">
      <label>From <input type="date" value={f.from} max={f.to || today} onChange={(e) => set({ from: e.target.value })} /></label>
      <label>To <input type="date" value={f.to} min={f.from} max={today} onChange={(e) => set({ to: e.target.value })} /></label>
    </div>
  );
}

export function Pager({ page, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / PER));
  if (total <= PER) return null;
  return (
    <nav className="nc-pager" aria-label="Pagination">
      <div className="nc-pages">
        <button type="button" className="nc-pg" onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="Previous page"><Ic n="chevLeft" size={17} /></button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button key={p} type="button" className="nc-pg" aria-current={p === page ? 'page' : undefined} onClick={() => onPage(p)}>{p}</button>
        ))}
        <button type="button" className="nc-pg" onClick={() => onPage(page + 1)} disabled={page === pages} aria-label="Next page"><Ic n="chevRight" size={17} /></button>
      </div>
    </nav>
  );
}

export function Empty({ icon, title, text, action }) {
  return (
    <div className="nc-empty" role="status">
      <div className="nc-empty__art">{icon === 'inbox' || icon === 'history' ? <Icon name={icon} size={28} stroke={1.6} /> : <Ic n={icon} size={28} sw={1.6} />}</div>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}

/** Read-status toggle: All / Unread / Read. */
export function ReadToggle({ value, onChange }) {
  return (
    <div className="nc-seg" role="group" aria-label="Read status">
      {[['all', 'All'], ['unread', 'Unread'], ['read', 'Read']].map(([k, l]) => (
        <button key={k} type="button" aria-pressed={value === k} onClick={() => onChange(k)}>{l}</button>
      ))}
    </div>
  );
}

export default function NotificationFilters({ f, set, cats, allLabel, searchLabel, placeholder, children }) {
  return (
    <>
      <div className="nc-tools">
        <Search label={searchLabel} placeholder={placeholder} value={f.q} onChange={(q) => set({ q })} />
        <Select label="Category" value={f.cat} active={!!f.cat} onChange={(cat) => set({ cat })} options={[['', allLabel], ...cats.map((c) => [c.k, c.label])]} />
        <Select label="Date" value={f.date} active={f.date !== 'any'} onChange={(date) => set({ date })} options={DATE_OPTS} />
        {children}
      </div>
      <DateRange f={f} set={set} />
    </>
  );
}
