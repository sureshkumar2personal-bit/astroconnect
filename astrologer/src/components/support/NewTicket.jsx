import { useEffect, useRef, useState } from 'react';
import { CAT_HINT, CAT_NOTE, SUBCATEGORIES, SUPPORT_CATEGORIES } from '@/data/mockSupport.js';
import { newDraft, supportActions } from '@/hooks/useSupport.js';
import { Files, Ic, fmtDate } from './TicketDetail.jsx';

// New Ticket popup (AD-160; reference "Help & Support"): Category*, Subcategory (only "General" — not defined
// yet), Subject*, Issue description*, Related ID and Screenshots/documents. Opened from Audience with a user ID
// it pre-fills a user-block request, which Platform Admin reviews (AD-161). Prototype: files are not uploaded.
// Related ID suggestions are the astrologer's own recent records from each module (no invented IDs).
const by = (k) => (a, b) => String(b[k]).localeCompare(String(a[k]));
const short = (s, n = 34) => (s && s.length > n ? s.slice(0, n - 1) + '…' : s || '');

/** Up to 3 recent references for a category from the module data: { label, items: [[id, meta]] } or null. */
export function refsFor(cat, R) {
  const top = (list, k) => list.slice().sort(by(k)).slice(0, 3);
  switch (cat) {
    case 'Text Questions': return { label: 'Question ID', items: top(R.questions, 'recv').map((q) => [q.id, `${q.type} question, ${fmtDate(q.recv).slice(0, 6)}`]) };
    case 'Text Question Disputes/Clarifications': {
      const d = R.questions.filter((q) => q.dispute);
      return d.length ? { label: 'Question ID', items: top(d, 'disputeAt').map((q) => [q.id, `Disputed, ${fmtDate(q.disputeAt).slice(0, 6)}`]) } : null;
    }
    case 'Campaigns/Quota': return R.campaigns.length ? { label: 'Campaign', items: R.campaigns.slice(0, 3).map((c) => [c.id, short(c.name)]) } : null;
    case 'Appointments': return { label: 'Appointment ID', items: top(R.apts, 'at').map((a) => [a.id, fmtDate(a.at).slice(0, 6) + ', ' + new Date(a.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })]) };
    case 'Instant Call/Chat': return { label: 'Consultation ID', items: top(R.hist, 'at').map((h) => [h.id, `${h.svc.replace('Instant ', '')}, ${fmtDate(h.at).slice(0, 6)}`]) };
    case 'Wallet/Earnings/Commission/Settlement/Withdrawal':
      return { label: 'Withdrawal ID or Transaction ID', items: [...top(R.wd, 'at').map((w) => [w.id, `₹${w.amt.toLocaleString('en-IN')}, ${fmtDate(w.at).slice(0, 6)}`]), ...top(R.tx, 'at').slice(0, 1).map((x) => [x.id, `${x.svc}, ${fmtDate(x.at).slice(0, 6)}`])] };
    case 'Ratings & Reviews': return { label: 'Review ID', items: top(R.reviews, 'at').map((v) => [v.id, `${v.stars}★, ${fmtDate(v.at).slice(0, 6)}`]) };
    case 'Audience/Customers': return { label: 'User ID', items: top(R.customers, 'last').map((c) => [c.uid, c.name]) };
    case 'Live Sessions': return { label: 'Live session ID', items: top(R.past, 'date').map((l) => [l.id, short(l.topic, 28)]) };
    case 'Content/Posts': return { label: 'Post ID', items: top(R.posts, 'at').map((p) => [p.id, short(p.title, 28)]) };
    default: return null;
  }
}

export default function NewTicket({ init, refs, ui, onClose, onView }) {
  const [d, setD] = useState(() => newDraft(SUPPORT_CATEGORIES.includes(init.cat) ? init.cat : '', init.ref || ''));
  const [bad, setBad] = useState({});
  const [done, setDone] = useState(null);
  const fileIn = useRef(null), catEl = useRef(null), subjEl = useRef(null), descEl = useRef(null), viewBtn = useRef(null);
  useEffect(() => { catEl.current?.focus(); }, []);
  useEffect(() => { if (done) viewBtn.current?.focus(); }, [done]);
  const set = (part, field) => { setD((x) => ({ ...x, ...part })); if (field) setBad((b) => ({ ...b, [field]: false })); };

  const submit = (e) => {
    e.preventDefault();
    const miss = { cat: !d.cat, subject: !d.subject.trim(), desc: !d.desc.trim() };
    setBad(miss);
    const first = miss.cat ? catEl : miss.subject ? subjEl : miss.desc ? descEl : null;
    if (first) { first.current?.focus(); return; }
    const r = supportActions.create(d);
    if (r.error) return;
    ui.toast('Ticket submitted successfully');
    setDone(r.id);
  };

  const ref = d.cat ? refsFor(d.cat, refs) : null;
  const relPh = !d.cat ? 'Choose a category to see suggestions' : ref ? `Enter a ${ref.label}, or pick one below` : 'Any reference you have';

  return (
    <div className="modal-wrap">
      <div className="overlay" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-label="New ticket">
        {done ? (
          <>
            <div className="success">
              <div className="ok"><Ic n="check" /></div>
              <h2>Ticket submitted</h2>
              <p>Platform Admin will reply in the conversation. You’ll find it at the top of Your Tickets.</p>
              <div className="tid">{done}</div>
            </div>
            <div className="m-foot m-foot--center">
              <button type="button" className="btn btn-quiet" onClick={onClose}>Done</button>
              <button ref={viewBtn} type="button" className="btn btn-primary" onClick={() => onView(done)}><Ic n="open" />View ticket</button>
            </div>
          </>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="m-head">
              <div><h2>New ticket</h2></div>
              <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><Ic n="x" /></button>
            </div>
            <div className="m-body">
              <div className={'fld' + (bad.cat ? ' invalid' : '')}>
                <label className="lbl" htmlFor="nt-cat">Category <span className="req" aria-hidden="true">*</span></label>
                <select ref={catEl} className="select" id="nt-cat" value={d.cat} aria-invalid={!!bad.cat} onChange={(e) => set({ cat: e.target.value }, 'cat')}>
                  <option value="">Select a category</option>
                  {SUPPORT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <div className="err">Choose a category.</div>
                {CAT_NOTE[d.cat] && <div className="notice n-gold nt-note"><Ic n="info" /><div><span>{CAT_NOTE[d.cat]}</span></div></div>}
              </div>
              <div className="fld">
                <label className="lbl" htmlFor="nt-sub">Subcategory</label>
                <select className="select" id="nt-sub" value={d.sub} onChange={(e) => set({ sub: e.target.value })}>
                  {SUBCATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <div className="help"><span>Subcategories aren't defined yet.</span></div>
              </div>
              <div className={'fld' + (bad.subject ? ' invalid' : '')}>
                <label className="lbl" htmlFor="nt-subj">Subject <span className="req" aria-hidden="true">*</span></label>
                <input ref={subjEl} className="input" id="nt-subj" maxLength={120} value={d.subject} aria-invalid={!!bad.subject} placeholder="e.g. Withdrawal not received in bank account" onChange={(e) => set({ subject: e.target.value }, 'subject')} />
                <div className="err">Add a short subject.</div>
              </div>
              <div className={'fld' + (bad.desc ? ' invalid' : '')}>
                <label className="lbl" htmlFor="nt-desc">Description <span className="req" aria-hidden="true">*</span></label>
                <textarea ref={descEl} className="textarea" id="nt-desc" rows={5} maxLength={1000} value={d.desc} aria-invalid={!!bad.desc} placeholder="What happened, when it happened, and what you expected instead." onChange={(e) => set({ desc: e.target.value }, 'desc')} />
                <div className="err">Describe the issue.</div>
                <div className="help"><span>Include dates, amounts or screens involved.</span><span>{d.desc.length} / 1000</span></div>
              </div>
              <div className="fld">
                <label className="lbl" htmlFor="nt-rel">Related ID <span className="opt">Optional</span></label>
                <input className="input" id="nt-rel" maxLength={40} value={d.ref} placeholder={relPh} onChange={(e) => set({ ref: e.target.value })} />
                {d.cat && (
                  <div className="refs">
                    {ref && ref.items.length > 0 ? (
                      <>
                        <div className="refs-label">Recent {ref.label.toLowerCase()}s</div>
                        <div className="ref-chips">
                          {ref.items.map(([id, meta]) => (
                            <button key={id} type="button" className="ref" aria-pressed={d.ref.trim() === id} onClick={() => set({ ref: id })}><b>{id}</b><span>{meta}</span></button>
                          ))}
                        </div>
                        <div className="help"><span>Not listed? Type the reference above, or leave it blank.</span></div>
                      </>
                    ) : <div className="help help--0"><span>{CAT_HINT[d.cat] || 'Add a reference if you have one.'}</span></div>}
                  </div>
                )}
              </div>
              <div className="fld">
                <span className="lbl lbl--span">Attachments <span className="opt">Optional</span></span>
                <div className="drop">
                  <Ic n="clip" /><p>Screenshots, PDFs or recordings, up to 10 MB each.</p>
                  <button type="button" className="btn btn-quiet btn-sm" onClick={() => fileIn.current?.click()}>Choose files</button>
                  <input ref={fileIn} type="file" multiple hidden onChange={(e) => { const n = [...(e.target.files || [])].map((f) => f.name); set({ files: [...d.files, ...n] }); e.target.value = ''; }} />
                </div>
                {d.files.length > 0 && <div className="comp-files"><Files list={d.files} onRemove={(i) => set({ files: d.files.filter((_, k) => k !== i) })} /></div>}
              </div>
            </div>
            <div className="m-foot">
              <button type="button" className="btn btn-quiet" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit Ticket</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
