import { useState } from 'react';
import Toggle from '@/components/ui/Toggle.jsx';
import { liveActions } from '@/hooks/useLive.js';
import { AUDIENCES, AUDIENCE_LABEL, COMMENT_OPTIONS, PRIORITY_OPTIONS } from '@/data/mockLive.js';

const SUMMARY = {
  everyone: 'Anyone who can watch can comment.',
  followers: 'Only followers who can watch can comment.',
  subscribers: 'Only subscribers who can watch can comment.',
  tiers: 'Only selected tiers can comment. Choose tiers when you create each live.',
  off: 'Comments are turned off for your lives.',
};
const TOGGLES = [
  ['slow', 'Slow mode', 'Viewers can comment once every 10 seconds.'],
  ['pin', 'Pin comment', 'Pin one comment to the top of the feed.'],
  ['mute', 'Mute commenter', 'Hide a viewer’s comments for the rest of the live.'],
  ['block', 'Block commenter', 'Remove a viewer from your lives.'],
];

const Chips = ({ label, options, value, onPick }) => (
  <div className="lv-chips" role="radiogroup" aria-label={label}>
    {options.map(([k, l]) => <button key={k} type="button" role="radio" aria-checked={value === k} className={`lv-chip${value === k ? ' on' : ''}`} onClick={() => onPick(k)}>{l}</button>)}
  </div>
);

/** Live Settings tab (reference "Live Settings", AD-170): defaults and the comment tools for your lives. */
export default function LiveSettings({ s }) {
  const [draft, setDraft] = useState(s.settings);
  const [saved, setSaved] = useState(false);
  const set = (part) => { setSaved(false); setDraft((d) => ({ ...d, ...part })); };
  const save = () => { liveActions.saveSettings(draft); setSaved(true); };
  const watchOpts = AUDIENCES.map((a) => [a, AUDIENCE_LABEL[a]]);

  return (
    <section className="lv-card lv-set" aria-label="Live Settings">
      <div className="lv-srow">
        <div className="lv-srow__l"><b>Who can watch?</b><span>Default audience for new lives. You can change it per live.</span></div>
        <div className="lv-srow__r">
          <Chips label="Who can watch" options={watchOpts} value={draft.watch} onPick={(watch) => set({ watch })} />
          {draft.watch === 'Specific tiers' && <span className="lv-hint">Choose tiers when you create each live.</span>}
        </div>
      </div>
      <div className="lv-srow">
        <div className="lv-srow__l"><b>Who can comment?</b><span>Set separately from who can watch.</span></div>
        <div className="lv-srow__r">
          <Chips label="Who can comment" options={COMMENT_OPTIONS} value={draft.comment} onPick={(comment) => set({ comment })} />
          <span className="lv-hint">{SUMMARY[draft.comment]}</span>
        </div>
      </div>
      <div className="lv-srow">
        <div className="lv-srow__l"><b>Comment priority</b><span>Order of comments in your live feed.</span></div>
        <div className="lv-srow__r"><Chips label="Comment priority" options={PRIORITY_OPTIONS} value={draft.priority} onPick={(priority) => set({ priority })} /></div>
      </div>
      <div className="lv-srow">
        <div className="lv-srow__l"><b>Comment controls</b><span>Tools available to you during a live.</span></div>
        <div className="lv-srow__r lv-toggles">
          {TOGGLES.map(([k, l, h]) => (
            <div key={k} className="lv-tg"><div><b>{l}</b><span>{h}</span></div><Toggle on={!!draft[k]} label={l} onToggle={() => set({ [k]: !draft[k] })} /></div>
          ))}
        </div>
      </div>
      <div className="lv-sfoot">
        {saved && <span className="lv-saved" role="status">Settings saved. They apply to your next live.</span>}
        <button type="button" className="btn lv-btn" onClick={save}>Save settings</button>
      </div>
    </section>
  );
}
