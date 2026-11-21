// Inline SVG icons, paths taken verbatim from the reference HTML designs.
// `fill` icons are solid; the rest are stroked with currentColor.
const CAL = 'M3 10h18M8 3v4M16 3v4';
const LIVE_PATH = 'M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8';
const CHAT_BUBBLE = 'M4 5h16v11H9l-5 4z';
const MOON = 'M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z';
const COINS = 'M5 6v4c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 10v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4M5 14v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4';

const ICONS = {
  home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  briefcase: (<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></>),
  live: (<><circle cx="12" cy="12" r="2" /><path d={LIVE_PATH} /></>),
  coins: (<><ellipse cx="12" cy="6" rx="7" ry="3" /><path d={COINS} /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>),
  headset: (<><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></>),
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>),
  calendar: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d={CAL} /></>),
  calendarPlus: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d={CAL + 'M8 15h3M9.5 13.5v3'} /></>),
  bell: (<><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 21h4" /></>),
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  chat: (<><path d={CHAT_BUBBLE} /><path d="M8 10.5h.01M12 10.5h.01M16 10.5h.01" /></>),
  moon: <path d={MOON} />,
  bars: <path d="M5 20v-6M12 20V9M19 20V4" />,
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  target: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><path d="M12 12l7-7M16 5h3v3" /></>),
  pulse: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  checkCircle: (<><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>),
  userPlus: (<><circle cx="10" cy="8" r="4" /><path d="M3 21c0-4 3.1-7 7-7 1.5 0 2.9.4 4 1.2M19 14v6M16 17h6" /></>),
  megaphone: (<><path d="M3 10v4h4l9 5V5L7 10z" /><path d="M7 14l1.5 5h3L10 15M19 9a3 3 0 0 1 0 6" /></>),
  edit: (<><rect x="3" y="4" width="15" height="17" rx="2" /><path d="M10 14l9-9 2 2-9 9h-2z" /></>),
  lotus: <path d="M12 4c2 2.5 2 7 0 11-2-4-2-8.5 0-11zM12 15c-3-.5-6-3-7-7 3.5 0 6 2.5 7 7zM12 15c3-.5 6-3 7-7-3.5 0-6 2.5-7 7zM3 15c3 3 6 3.5 9 3.5s6-.5 9-3.5" />,
  morning: <path d="M4 18h16M7 18a5 5 0 0 1 10 0M12 7v3M5 11l1.5 1.5M19 11l-1.5 1.5" />,
  afternoon: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5" /></>),
  evening: <path d={MOON} />,
  night: <path d="M18 14.5A7 7 0 1 1 9.5 6 5.5 5.5 0 0 0 18 14.5zM18 4v3M16.5 5.5h3" />,
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5" /></>),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  users: (<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.1.7 3.5 2.8 3.5 5.7" /></>),
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  book: (<><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5M8 7h7" /></>),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
};

const FILLED = {
  spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  crown: <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
};

export default function Icon({ name, size = 24, stroke = 1.8, className, label, ...rest }) {
  const filled = FILLED[name];
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11y}
      {...rest}
    >
      {filled || ICONS[name]}
    </svg>
  );
}
