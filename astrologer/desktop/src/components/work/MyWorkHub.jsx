import { countTab, isOpen } from '@shared/lib/textQuestions.js';

// Mobile "My Work" landing screen from the mobile reference.
// Appointments are a separate module; the count is the reference's sample value.
const APPOINTMENTS = 3;

export default function MyWorkHub({ questions, onOpen }) {
  const open = questions.filter(isOpen).length;
  return (
    <>
      <p className="muted">Manage your questions, responses and consultations</p>
      <div className="seg" role="group" aria-label="Work type">
        <span className="on">Text Questions</span>
        <span>Appointments</span>
      </div>
      <section className="card over">
        <div><span className="sm">Total Work</span><b className="y">{open + APPOINTMENTS}</b></div>
        <div><span className="sm">Text Questions</span><b>{open}</b></div>
        <div><span className="sm">Appointments</span><b>{APPOINTMENTS}</b></div>
      </section>
      <button type="button" className="ovc" onClick={() => onOpen('questions')}>
        <div className="row"><b className="grow" style={{ fontSize: 16 }}>Text Questions Overview</b><span className="go" style={{ fontSize: 20 }}>›</span></div>
        <div className="over">
          <div><b className="y">{countTab(questions, 'new')}</b><span className="sm">New</span></div>
          <div><b>{countTab(questions, 'p2')}</b><span className="sm">Priority 2</span><div className="muted sm">1–19 days</div></div>
          <div><b className="dl">{countTab(questions, 'p1')}</b><span className="sm">Priority 1</span><div className="muted sm">20–30 days</div></div>
        </div>
      </button>
      <button type="button" className="lnk" onClick={() => onOpen('campaigns')}>Campaign Management</button>
      <button type="button" className="lnk" onClick={() => onOpen('templates')}>Answer Templates</button>
      <button type="button" className="lnk" onClick={() => onOpen('history')}>History</button>
    </>
  );
}
