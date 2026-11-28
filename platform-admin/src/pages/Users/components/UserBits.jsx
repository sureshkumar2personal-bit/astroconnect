// Small presentational pieces shared by the Users table, mobile cards and
// profile placeholder.

const AVATAR_TINTS = [
  ['#f6ead0', '#87601a'],
  ['#e8efe9', '#3d6b47'],
  ['#efe6f2', '#6a4a7a'],
  ['#e5eff0', '#3f6f72'],
  ['#f7e7df', '#8a4b2f'],
  ['#ecebe4', '#5d5640'],
];

function hash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

/** Initials avatar — no real photographs are used in the demo. */
export function Avatar({ user, size = 36 }) {
  const [bg, fg] = AVATAR_TINTS[hash(user.id) % AVATAR_TINTS.length];
  return (
    <span
      className="u-avatar"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}
      role="img"
      aria-label={`Profile photo of ${user.name}`}
    >
      {initials(user.name)}
    </span>
  );
}

const STATUS_CLASS = { Active: 'is-active', Suspended: 'is-suspended', Blocked: 'is-blocked' };

export function StatusBadge({ status, showRestriction = false }) {
  return (
    <span className="u-status-wrap">
      <span className={`u-status ${STATUS_CLASS[status]}`}>
        <span className="u-status__dot" aria-hidden="true" />
        {status}
      </span>
      {showRestriction && status !== 'Active' && (
        <span className="u-status__note">Login &amp; services disabled</span>
      )}
    </span>
  );
}

export function TypeBadge({ type }) {
  return <span className={`u-type u-type--${type.toLowerCase()}`}>{type}</span>;
}
