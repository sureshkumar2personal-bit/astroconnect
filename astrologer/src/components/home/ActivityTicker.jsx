import { useRef } from 'react';
import useDailyActivity from '@/hooks/useDailyActivity.js';

const WELCOME = 'Welcome! Your daily activity updates will appear here.';

// Live Activity ticker (AD-166): plain scrolling text (no card, box or badge) that runs right to left and loops.
// Counts come from live app state; all three updates are always shown, and when every count is 0
// the welcome message is shown. DND stops it (AD-166). Hover or touch pauses it; reduced-motion users get a static line.
export default function ActivityTicker({ apt, paused = false }) {
  const live = useDailyActivity(apt);
  // While DND is on the ticker stands still and shows the updates as they were when DND started;
  // when DND is turned off it scrolls again with the current counts.
  const frozen = useRef(null);
  if (paused) frozen.current = frozen.current || live;
  else frozen.current = null;
  const items = paused ? frozen.current : live;
  const active = items.some((m) => m.n > 0);
  const messages = active
    ? items.map((m) => (
        <span key={m.key} className="ac-ticker__msg">
          <b className="ac-ticker__num">{m.n}</b>{m.post}
        </span>
      ))
    : [<span key="welcome" className="ac-ticker__msg">{WELCOME}</span>];
  const text = active ? items.map((m) => `${m.n}${m.post}`).join(' ') : WELCOME;
  // The message set is repeated so the loop has no gap; the duration scales with the amount of text.
  const secs = Math.max(18, Math.round(text.length * 0.32));
  return (
    <section className={`ac-ticker${paused ? ' is-paused' : ''}`} aria-label="Live activity">
      <div className="ac-ticker__view" role="status" aria-live="off">
        <span className="ac-sr">{text}</span>
        <div className="ac-ticker__track" aria-hidden="true" style={{ '--ticker-secs': `${secs}s` }}>
          <div className="ac-ticker__set">{messages}</div>
          <div className="ac-ticker__set">{messages}</div>
        </div>
      </div>
    </section>
  );
}
