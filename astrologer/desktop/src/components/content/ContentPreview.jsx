import { astrologerProfile } from '@shared/data/mockTextQuestions.js';
import { RASI } from '@shared/data/mockContent.js';

// Live User App preview (AD-144): updates immediately as the astrologer edits. Users can Like and
// Comment on posts (AD-139); here those are shown as labels only.
export default function ContentPreview({ e }) {
  const filled = e.rasi ? RASI.map((r, i) => [r.split(' ')[0], e.rasi[i]]).filter(([, v]) => v) : [];
  return (
    <div className="preview" aria-live="polite">
      <div className="row">
        <span className="av av-me" aria-hidden="true">{astrologerProfile.initial}</span>
        <div className="grow">
          <b>{astrologerProfile.name}</b>
          <div className="muted sm">{e.aud.join(', ') || 'No audience'} · {e.kind}</div>
        </div>
      </div>
      <b className="lg cm-pv-title">{e.title || 'Title'}</b>
      {e.img && <div className="file cm-pv-img">Image: {e.img}</div>}
      {e.rasi ? (
        <div className="stack sm">
          {filled.length ? filled.map(([r, v]) => <div key={r} className="cm-pv-text"><b>{r}:</b> {v}</div>) : <span className="muted">Predictions appear here</span>}
        </div>
      ) : (
        <p className="cm-pv-text">{e.text || <span className="muted">Your text appears here</span>}</p>
      )}
      <div className="row sm muted"><span>♡ Like</span><span>Comment</span></div>
    </div>
  );
}
