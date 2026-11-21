import { Badge } from '../section/kit.jsx';
import { dt, fmtDate } from '@shared/lib/format.js';

// One remedy record (spec 17, AD-163, AD-22): User, status set by the User only, source,
// date, the User's upload (if any) and a link back to the originating record (REM-02, REM-03).
export default function RemedyCard({ r, onViewFile }) {
  return (
    <section className="card rm-card">
      <div className="row">
        <b className="grow">{r.user}</b>
        {r.done ? <Badge kind="ok">Completed by user</Badge> : <Badge kind="warn">Not completed</Badge>}
      </div>
      <p>{r.text}</p>
      <span className="muted sm">{r.src} · {fmtDate(dt(r.date))} · {r.uid}</span>
      {r.file
        ? <button type="button" className="file rm-file" onClick={() => onViewFile(r.file)}>View user upload: {r.file}</button>
        : <span className="muted sm">No upload from user</span>}
      <a className="go" href={`#${r.href}`}>Open original {r.ref} ›</a>
    </section>
  );
}
