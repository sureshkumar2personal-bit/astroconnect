// Line icons for the Platform Admin shell (drawn for this project).
const PATHS = {
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="8" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="5" rx="1.5" />
      <rect x="13.5" y="11.5" width="7" height="9" rx="1.5" />
      <rect x="3.5" y="14.5" width="7" height="6" rx="1.5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5" />
      <path d="M15.5 4.8a3.3 3.3 0 0 1 0 6.4M17.5 14.8c2.1.6 3.5 2.4 4 5.2" />
    </>
  ),
  services: (
    <>
      <path d="M12 3.5 14 9l5.5 2-5.5 2-2 5.5-2-5.5-5.5-2L10 9Z" />
      <path d="M19 3.5v3M17.5 5h3" />
    </>
  ),
  finance: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M16 14.5h2" />
      <path d="M6 6V4.5h12V6" />
    </>
  ),
  operations: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
    </>
  ),
  activity: <path d="M3 12h4l2.5-6 5 12 2.5-6h4" />,
  document: (
    <>
      <path d="M6 2.5h8l4.5 4.5v14.5H6Z" />
      <path d="M14 2.5V7h4.5M9 12h6M9 16h6" />
    </>
  ),
  menu: <path d="M4 6.5h16M4 12h16M4 17.5h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  signOut: (
    <>
      <path d="M14 4.5H6.5v15H14" />
      <path d="M10.5 12h10M17 8.5l3.5 3.5-3.5 3.5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 21.5 20h-19Z" />
      <path d="M12 10v4.5M12 17.2v.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>
  ),
  question: (
    <>
      <path d="M4 5.5h16v11H9l-5 4Z" />
      <path d="M10 9.2a2 2 0 1 1 2.8 1.8c-.5.3-.8.7-.8 1.3M12 14.2v.2" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
  ),
  cancel: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4.5 16.5v3h15v-3" />
    </>
  ),
  more: (
    <>
      <circle cx="12" cy="5.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18.5" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  userCheck: (
    <>
      <circle cx="9.5" cy="8" r="3.5" />
      <path d="M3 20c.6-3.6 3.2-5.5 6.5-5.5 1.6 0 3 .4 4.1 1.2" />
      <path d="m15 18 2 2 4-4.5" />
    </>
  ),
  userPause: (
    <>
      <circle cx="9.5" cy="8" r="3.5" />
      <path d="M3 20c.6-3.6 3.2-5.5 6.5-5.5 1.6 0 3 .4 4.1 1.2" />
      <path d="M16.5 15v5M20 15v5" />
    </>
  ),
  userBlock: (
    <>
      <circle cx="9.5" cy="8" r="3.5" />
      <path d="M3 20c.6-3.6 3.2-5.5 6.5-5.5 1.3 0 2.4.3 3.4.8" />
      <circle cx="18" cy="17.5" r="3.3" />
      <path d="m15.7 19.8 4.6-4.6" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  sortUp: <path d="m8 10 4-4 4 4" />,
  sortDown: <path d="m8 14 4 4 4-4" />,
  sort: <path d="m8.5 9.5 3.5-3.5 3.5 3.5M8.5 14.5l3.5 3.5 3.5-3.5" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  refresh: (
    <>
      <path d="M20 11.5A8 8 0 1 0 17.7 17" />
      <path d="M20.5 5v6.5H14" />
    </>
  ),
};

export default function Icon({ name, size = 20, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
