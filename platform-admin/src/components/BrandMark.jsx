// AstroConnect brand mark: a simple gold star emblem with the "AstroConnect" wordmark.
// Created for this project; no assets are taken from other projects.
export default function BrandMark() {
  return (
    <div className="brand">
      <svg
        className="brand__emblem"
        viewBox="0 0 48 48"
        width="44"
        height="44"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="ac-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e3bb5e" />
            <stop offset="1" stopColor="#a8781c" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="none" stroke="url(#ac-gold)" strokeWidth="1.5" />
        <path
          d="M24 7 L27.4 20.6 L41 24 L27.4 27.4 L24 41 L20.6 27.4 L7 24 L20.6 20.6 Z"
          fill="url(#ac-gold)"
        />
        <circle cx="35.5" cy="12.5" r="1.6" fill="#c9962e" />
        <circle cx="12.5" cy="35.5" r="1.2" fill="#c9962e" />
      </svg>
      <span className="brand__name">AstroConnect</span>
    </div>
  );
}
