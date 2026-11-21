import { Empty, Facts, Note, Sec } from '../section/kit.jsx';
import { TODAY, dt, fmtDateTime, inr2 } from '@shared/lib/format.js';
import { CHAT_VISIBLE_HOURS, COMMISSION } from '@shared/hooks/useCalls.js';
import { ME } from '@shared/data/mockCalls.js';

// Consultation Details (AD-78 → 03): Call History fields (AD-110) and, for a chat,
// the messages for 24 hours only with Save / Download as text (AD-111).
function download(x) {
  const text = (x.msgs || []).map((m) => `${m[0] === 'me' ? 'Astrologer' : 'User'}: ${m[1]}`).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  a.download = `${x.id}-chat.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function ConsultationDetails({ x }) {
  if (!x) return <Empty title="Not found">This consultation isn't in your history.</Empty>;
  const age = (TODAY - dt(x.at)) / 36e5;
  return (
    <>
      <section className="card sec">
        <Facts items={[
          ['Consultation ID', x.id],
          ['Astrologer', `${ME.name} · ${ME.id}`],
          ['User', `${x.user} · ${x.uid}`],
          ['Date/time', fmtDateTime(dt(x.at))],
          ['Actual duration', x.dur],
          ['Package & amount', `${x.pk} · ${inr2(x.amt)}`],
          ['Payment', x.pay],
          ['Commission 2% · Net', `${inr2(x.amt * COMMISSION)} · ${inr2(x.amt * (1 - COMMISSION))}`],
        ]} />
        {x.att && <div className="remedy"><b>Recommended attachment</b>{x.att}</div>}
      </section>
      {x.svc === 'Instant Chat' && (
        <Sec title="Chat messages">
          {age < CHAT_VISIBLE_HOURS ? (
            <>
              <div className="chat">
                {(x.msgs || []).map((m, i) => <div key={i} className={`msg${m[0] === 'me' ? ' me' : ''}`}>{m[1]}</div>)}
              </div>
              <p className="muted sm">Available for {Math.ceil(CHAT_VISIBLE_HOURS - age)} more hour(s), then hidden for both you and the user.</p>
              <div><button type="button" className="btn btn-o" onClick={() => download(x)}>Save / Download as text</button></div>
            </>
          ) : (
            <Note>Messages are no longer available (more than 24 hours old). Booking, date/time and payment records remain.</Note>
          )}
        </Sec>
      )}
    </>
  );
}
