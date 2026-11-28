import { useEffect, useState } from 'react';
import { DEFAULT_PATH } from './navigation.js';

// Minimal hash router (no dependency): "#/finance/refunds?ref=RF-40562".
// Links are plain <a href="#/..."> elements, so back/forward and refresh work.

function parse() {
  const raw = window.location.hash.replace(/^#/, '');
  const [path, query = ''] = raw.split('?');
  return {
    path: path && path.startsWith('/') ? path : DEFAULT_PATH,
    params: new URLSearchParams(query),
  };
}

export function useHashRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

/** Build an href for a route, with an optional record reference. */
export function href(path, ref) {
  return ref ? `#${path}?ref=${encodeURIComponent(ref)}` : `#${path}`;
}

/** Remove the hash without adding a history entry (used on Sign Out). */
export function clearRoute() {
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}
