// Dialog bodies for Live Sessions (shown in SectionPage's shared dialog).

/** Preview / Test before starting (AD-115). Prototype: no camera or microphone is accessed. */
export function PreviewTest({ topic, onDone }) {
  return (
    <>
      <div className="preview">
        <div className="ring2 ring2--lg" aria-hidden="true">Cam</div>
        <p className="sm">Camera and microphone look good. Topic: <b>{topic || '—'}</b></p>
        <span className="muted sm">Prototype preview — the camera and microphone are not accessed.</span>
      </div>
      <div className="actions"><button type="button" className="btn btn-p" onClick={onDone}>Done</button></div>
    </>
  );
}

/** Confirm cancelling a scheduled Live (AD-112, AD-118). */
export function ConfirmCancel({ onKeep, onConfirm }) {
  return (
    <>
      <ul className="cons">
        <li>Your selected audience is notified that the Live is cancelled.</li>
        <li>Cancelling frees this month's Live — you can schedule another in the same month.</li>
      </ul>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onKeep}>Keep Live</button>
        <button type="button" className="btn danger-f" onClick={onConfirm}>Cancel Live</button>
      </div>
    </>
  );
}

/** Confirm ending the Live (AD-117, AD-119). */
export function ConfirmEnd({ onKeep, onConfirm }) {
  return (
    <>
      <ul className="cons">
        <li>The Live ends for everyone watching.</li>
        <li>There is no recording or replay.</li>
        <li>You'll see the post-Live summary: duration, participants and comments.</li>
      </ul>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onKeep}>Stay live</button>
        <button type="button" className="btn danger-f" onClick={onConfirm}>End Live</button>
      </div>
    </>
  );
}
