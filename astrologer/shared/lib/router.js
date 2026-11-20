import { useEffect, useState } from 'react';

// Minimal hash router (no dependency). Routes:
//   #/                               Home
//   #/work                           My Work (mobile hub; Text Questions on desktop)
//   #/work/questions[/:id[/answer]]  Text Questions list, question details, answer editor
//   #/work/campaigns | templates | history
const read = () => window.location.hash.replace(/^#/, '') || '/';

export function useHashPath() {
  const [path, setPath] = useState(read);
  useEffect(() => {
    const onChange = () => setPath(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return path;
}

export const navigate = (path) => {
  window.location.hash = path;
};

const WORK_VIEWS = ['questions', 'campaigns', 'templates', 'history'];

export function parseRoute(path) {
  const parts = path.split('/').filter(Boolean);
  if (parts[0] !== 'work') return { page: 'home' };
  const view = WORK_VIEWS.includes(parts[1]) ? parts[1] : 'hub';
  return {
    page: 'work',
    view,
    id: view === 'questions' && parts[2] ? decodeURIComponent(parts[2]) : null,
    editor: view === 'questions' && parts[3] === 'answer',
  };
}

export const routes = {
  home: '/',
  hub: '/work',
  list: '/work/questions',
  detail: (id) => `/work/questions/${encodeURIComponent(id)}`,
  editor: (id) => `/work/questions/${encodeURIComponent(id)}/answer`,
  view: (v) => `/work/${v}`,
};
