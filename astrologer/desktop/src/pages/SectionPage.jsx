import { Component, useCallback, useEffect, useRef, useState } from 'react';
import { navigate } from '@shared/lib/router.js';
import { astrologerProfile } from '@shared/data/mockTextQuestions.js';
import { Dialog, Toast } from '@shared/components/ui.jsx';
import WorkHeader from '../layout/WorkHeader.jsx';
import { SECTIONS } from './sections.js';

// Shell for the section pages (Live, Earnings, Profile and the "More" pages).
// It reuses the My Work header, provides a dialog + toast to the page, and loads
// each page module lazily so one page can never break another.
//
// Page module contract (desktop/src/pages/<Name>Page.jsx):
//   export function meta(route, ctx, mobile) → { title, subtitle?, crumb?, parent? }
//       parent: hash path for the back button (desktop "‹ Back" and the phone header back).
//   export default function Page({ route, mobile, ui, ctx })
//       ui:  { toast(msg), dialog({ title, body: (close) => node }), close() }
//       ctx: { theme, availability, tq, apt, unread }

const cache = {};

class Boundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidUpdate(prev) { if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null }); }
  render() {
    if (this.state.error) {
      return <div className="empty"><b>This page couldn't be shown.</b><span className="muted">{String(this.state.error.message || this.state.error)}</span></div>;
    }
    return this.props.children;
  }
}

export default function SectionPage({ route, path, mobile, ctx, theme, onToggleTheme, unread, availability }) {
  const key = route.page;
  const [mod, setMod] = useState(() => cache[key] || null);
  const [loadError, setLoadError] = useState(null);
  const [dialog, setDialog] = useState(null); // { title, body }
  const [toastMsg, setToastMsg] = useState('');
  const timer = useRef();

  useEffect(() => {
    let alive = true;
    setLoadError(null);
    if (cache[key]) { setMod(cache[key]); return undefined; }
    setMod(null);
    SECTIONS[key].load().then(
      (m) => { cache[key] = m; if (alive) setMod(m); },
      (e) => { if (alive) setLoadError(e); },
    );
    return () => { alive = false; };
  }, [key]);

  const toast = useCallback((m) => {
    clearTimeout(timer.current);
    setToastMsg(m);
    timer.current = setTimeout(() => setToastMsg(''), 2600);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const close = useCallback(() => setDialog(null), []);
  const [ui] = useState(() => ({}));
  ui.toast = toast;
  ui.dialog = setDialog;
  ui.close = close;

  // New screen: start at the top; close any open dialog.
  useEffect(() => { window.scrollTo(0, 0); setDialog(null); }, [path]);

  let m = { title: SECTIONS[key].title };
  try { if (mod?.meta) m = { ...m, ...mod.meta(route, ctx, mobile) }; } catch { /* page shows its own error */ }
  const Page = mod?.default;

  return (
    <>
      <WorkHeader
        mobile={mobile}
        title={m.title}
        subtitle={m.subtitle}
        crumb={m.crumb || null}
        onBack={mobile && m.parent ? () => navigate(m.parent) : null}
        theme={theme}
        onToggleTheme={onToggleTheme}
        unread={unread}
        availability={availability}
        profile={astrologerProfile}
      />
      <div className={`pg pg--${key}${mobile ? ' screen' : ''}`}>
        {!mobile && m.parent && (
          <button type="button" className="btn btn-o sm pg-back" onClick={() => navigate(m.parent)}>‹ Back</button>
        )}
        {mobile && m.subtitle && <p className="muted">{m.subtitle}</p>}
        {loadError ? (
          <div className="empty"><b>This page couldn't be loaded.</b><span className="muted">{String(loadError.message || loadError)}</span></div>
        ) : Page ? (
          <Boundary resetKey={path}>
            <Page route={route} mobile={mobile} ui={ui} ctx={ctx} />
          </Boundary>
        ) : (
          <p className="muted" aria-busy="true">Loading…</p>
        )}
      </div>
      <Dialog open={!!dialog} title={dialog?.title || ''} onClose={close} sheet={mobile}>
        {dialog ? (typeof dialog.body === 'function' ? dialog.body(close) : dialog.body) : null}
      </Dialog>
      {toastMsg && <Toast message={toastMsg} />}
    </>
  );
}
