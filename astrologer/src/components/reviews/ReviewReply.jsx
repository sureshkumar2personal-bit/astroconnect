import { useState } from 'react';
import { reviewsActions } from '@/hooks/useReviews.js';
import { Sec } from '@/components/ui/sectionKit.jsx';

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
    <Sec title="Your reply (optional · one reply per review)">
      <label className="rv-reply">
        <span className="sr">Your reply</span>
        <textarea className="short" placeholder="Write a reply…" value={text}
          onChange={(e) => { setText(e.target.value); if (err) setErr(''); }}
          aria-invalid={!!err} aria-describedby={err ? 'rv-reply-err' : undefined} />
      </label>
      {err && <span id="rv-reply-err" className="rv-err sm" role="alert">{err}</span>}
      <div className="btn-row">
        <button type="button" className="btn btn-p" onClick={save}>{r.reply ? 'Update reply' : 'Post reply'}</button>
        {r.reply && <button type="button" className="btn btn-o danger" onClick={remove}>Delete reply</button>}
      </div>
      <span className="muted sm">No penalty for not replying.</span>
    </Sec>
  );
}
