import { useState } from 'react';
import { reviewsActions } from '@/hooks/useReviews.js';

// The astrologer's single optional reply to a review: add, edit or delete (AD-130, REV-03).
export default function ReviewReply({ r, ui }) {
  const [text, setText] = useState(r.reply);
  const [err, setErr] = useState('');
  const save = () => {
    const v = text.trim();
    if (!v) { setErr('Write a reply first.'); return; }
    reviewsActions.saveReply(r.id, v);
    setText(v);
    setErr('');
    ui.toast('Reply saved');
  };
  const remove = () => {
    reviewsActions.deleteReply(r.id);
    setText('');
    setErr('');
    ui.toast('Reply deleted');
  };

  return (
    <div className="rr-x__sec rr-reply">
      <label className="rr-x__lbl" htmlFor={`rv-reply-${r.id}`}>Your reply (optional · one reply per review)</label>
      <textarea id={`rv-reply-${r.id}`} className="rr-reply__ta" rows={2} placeholder="Write a reply…" value={text}
        onChange={(e) => { setText(e.target.value); if (err) setErr(''); }}
        aria-invalid={!!err} aria-describedby={err ? `rv-reply-err-${r.id}` : undefined} />
      {err && <span id={`rv-reply-err-${r.id}`} className="rv-err sm" role="alert">{err}</span>}
      <div className="rr-reply__foot">
        <div className="rr-reply__btns">
          <button type="button" className="btn btn-p sm" onClick={save}>{r.reply ? 'Update reply' : 'Post reply'}</button>
          {r.reply && <button type="button" className="btn btn-o sm danger" onClick={remove}>Delete reply</button>}
        </div>
        <span className="muted sm">No penalty for not replying.</span>
      </div>
    </div>
  );
}
