import { Empty, Facts, Note, Sec } from '@/components/ui/sectionKit.jsx';
import { TODAY, dt, fmtDateTime, inr2 } from '@/lib/format.js';
import { CHAT_VISIBLE_HOURS, COMMISSION } from '@/hooks/useCalls.js';
import { ME } from '@/data/mockCalls.js';

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

const factsOf = (x) => [
  ['Consultation ID', x.id],
  ['Astrologer', `${ME.name} · ${ME.id}`],
  ['User', `${x.user} · ${x.uid}`],
  ['Date/time', fmtDateTime(dt(x.at))],
  ['Actual duration', x.dur],
  ['Package & amount', `${x.pk} · ${inr2(x.amt)}`],
  ['Payment', x.pay],
  ['Commission 2% · Net', `${inr2(x.amt * COMMISSION)} · ${inr2(x.amt * (1 - COMMISSION))}`],
];

/** Chat messages, visible for 24 hours only, with Save / Download as text (AD-111). */
function ChatMessages({ x }) {
  const age = (TODAY - dt(x.at)) / 36e5;
  return age < CHAT_VISIBLE_HOURS ? (
    <>
      <div className="chat">
        {(x.msgs || []).map((m, i) => <div key={i} className={`msg${m[0] === 'me' ? ' me' : ''}`}>{m[1]}</div>)}
      </div>
      <p className="muted sm">Available for {Math.ceil(CHAT_VISIBLE_HOURS - age)} more hour(s), then hidden for both you and the user.</p>
      <div><button type="button" className="btn btn-o" onClick={(e) => { e.stopPropagation(); download(x); }}>Save / Download as text</button></div>
    </>
  ) : (
    <Note>Messages are no longer available (more than 24 hours old). Booking, date/time and payment records remain.</Note>
  );
}

/** The consultation's details, shown inside its expanded History row. */
export function ConsultationInfo({ x }) {
  return (
    <>
      <Facts items={factsOf(x)} />
      {x.att && <div className="remedy"><b>Recommended attachment</b>{x.att}</div>}
      {x.svc === 'Instant Chat' && (
        <div className="cc-msgs">
          <b className="cc-msgs__h">Chat messages</b>
          <ChatMessages x={x} />
        </div>
      )}
    </>
  );
}

// Full page (#/calls/c/<id>), kept for direct links.
export default function ConsultationDetails({ x }) {
  if (!x) return <Empty title="Not found">This consultation isn't in your history.</Empty>;
  return (
    <>
      <section className="card sec">
        <Facts items={factsOf(x)} />
        {x.att && <div className="remedy"><b>Recommended attachment</b>{x.att}</div>}
      </section>
      {x.svc === 'Instant Chat' && <Sec title="Chat messages"><ChatMessages x={x} /></Sec>}
    </>
  );
}
