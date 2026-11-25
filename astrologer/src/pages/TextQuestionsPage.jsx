import { useEffect, useRef } from 'react';
import { TABS, activeFilterCount, filterQuestions, isOpen } from '@/lib/textQuestions.js';
import { navigate, routes } from '@/lib/router.js';
import QHeader from '@/components/work/QHeader.jsx';
import QuestionToolbar from '@/components/work/QuestionToolbar.jsx';
import QCard from '@/components/work/QCard.jsx';
import QDetail from '@/components/work/QDetail.jsx';
import AnswerPage from '@/components/work/AnswerPage.jsx';
import TimelinePage from '@/components/work/TimelinePage.jsx';
import AddLinkForm from '@/components/work/AddLinkForm.jsx';
import { AttachmentBody, CorrectionBody, FiltersBody, PreviewBody } from '@/components/work/QDialogs.jsx';

// Detail-pane empty state art: a glowing magnifier over a question mark, with a few stars.
const PaneArt = () => (
  <svg className="qx-art" width="132" height="132" viewBox="0 0 132 132" fill="none" aria-hidden="true">
    <circle className="qx-art__halo" cx="60" cy="58" r="50" />
    <circle className="qx-art__lens" cx="58" cy="56" r="32" strokeWidth="5" />
    <path className="qx-art__handle" d="M81 80l22 22" strokeWidth="9" strokeLinecap="round" />
    <path className="qx-art__q" d="M50 47a9 9 0 1 1 13 8c-3 1.6-5 3.6-5 7.5" strokeWidth="5" strokeLinecap="round" />
    <circle className="qx-art__dot" cx="58" cy="71" r="3.2" />
    <path className="qx-art__star" d="M108 18l2.2 6.3 6.3 2.2-6.3 2.2-2.2 6.3-2.2-6.3-6.3-2.2 6.3-2.2z" />
    <path className="qx-art__star qx-art__star--sm" d="M20 96l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" />
    <circle className="qx-art__spark" cx="112" cy="64" r="2.2" />
    <circle className="qx-art__spark" cx="16" cy="40" r="1.8" />
  </svg>
);

// My Work → Text-Based Questions / Subscription Questions (reference R.tq, TQSUB.q/answer/timeline).
// Desktop/tablet: header, tabs, then list + detail pane side by side (stacked below 1180px).
// Phone: one screen at a time — list, question details, write answer, timeline.
// Routes: #/work/questions | #/work/subscriptions [/:id [/answer | /timeline]] (lib/router.js).
export default function TextQuestionsPage({ tq, route, mobile, ui }) {
  const paneRef = useRef(null);
  const q = route.id ? tq.byId(route.id) : null;
  const cat = q ? q.cat : route.cat;

  // Opening a question moves it from New / Received to Pending (AD-51).
  const viewing = q && !route.editor && !route.timeline ? q.id : null;
  useEffect(() => {
    if (viewing) tq.openQuestion(viewing);
    if (viewing && window.matchMedia('(max-width: 1180px)').matches) {
      requestAnimationFrame(() => paneRef.current?.scrollIntoView({ block: 'start' }));
    }
  }, [viewing]); // eslint-disable-line react-hooks/exhaustive-deps

  if (route.id && !q) return <div className="empty"><b>Question not found</b><a className="go" href={`#${routes.listFor(route.cat)}`}>Back to the list ›</a></div>;

  const openFilters = () => ui.dialog({
    title: 'Filters',
    body: (close) => (
      <FiltersBody filters={tq.filters} campaigns={tq.campaigns}
        onApply={(f) => { tq.setFilters(f); close(); }}
        onReset={() => { tq.resetFilters(); close(); }} />
    ),
  });
  const handlers = {
    onCorrection: (id) => ui.dialog({
      title: 'Request Correction',
      body: (close) => (
        <CorrectionBody q={tq.byId(id)} onCancel={close} onSend={() => { tq.requestCorrection(id); close(); ui.toast(`Correction request sent to ${q.name}`); }} />
      ),
    }),
    onDisputeSubmit: (id, text, remedy) => {
      if (!text) return ui.toast('Write your dispute answer first.');
      tq.submitDispute(id, text, remedy);
      ui.toast('Dispute answer sent.');
    },
  };

  if (route.timeline) return <TimelinePage q={q} campaignName={tq.campaignName(q.camp)} />;

  const items = filterQuestions(tq.questions, { cat, tab: tq.tab, prio: tq.prio, f: tq.filters });
  // Desktop opens with the first (oldest) question shown, without marking it opened (AD-51);
  // clicking a row opens it.
  const shown = q || items[0] || null;
  const preview = () => {
    const text = shown.draft.trim();
    ui.dialog({
      title: 'Preview Answer',
      body: (close) => (
        <PreviewBody q={shown} text={text} onBack={close} onSubmit={() => {
          tq.submitAnswer(shown.id, text); close(); ui.toast('Answer submitted. The user can see it now.'); navigate(routes.detail(shown.id));
        }} />
      ),
    });
  };
  const addLink = () => ui.dialog({
    title: 'Add Link',
    body: (close) => <AddLinkForm onCancel={close} onAdd={(url) => { tq.addLink(shown.id, url); close(); }} />,
  });

  if (route.editor && isOpen(q) && q.status !== 'Correction Requested') {
    return <AnswerPage key={q.id} q={q} tq={tq} onPreview={preview} onAddLink={addLink} toast={ui.toast} />;
  }

  const openFile = (name) => ui.dialog({
    title: 'Attachment',
    body: (close) => <AttachmentBody q={shown} name={name} onClose={close} />,
  });
  const detail = shown && <QDetail key={shown.id} q={shown} campaignName={tq.campaignName(shown.camp)} tq={tq} onPreview={preview} onAddLink={addLink} onOpenFile={openFile} toast={ui.toast} {...handlers} />;
  const list = (
    <div className="lbox">
      <div className="lhead">
        <h2>{tq.tab === 'received' ? 'Pending questions' : (TABS.find((t) => t.key === tq.tab) || TABS[0]).label}</h2>
        <span className="muted sm">{items.length} shown · oldest first</span>
      </div>
      <div className="list" id="qlist">
        {items.length
          ? items.map((x) => <QCard key={x.id} q={x} campaignName={tq.campaignName(x.camp)} selected={x.id === shown?.id} mobile={mobile} />)
          : (
            <div className="empty">
              <b>No questions here</b>
              <span className="muted">Try another tab or clear filters.</span>
              {activeFilterCount(tq.filters) > 0 && <button type="button" className="btn btn-o" onClick={tq.resetFilters}>Clear filters</button>}
            </div>
          )}
      </div>
    </div>
  );

  return (
    <>
      <QHeader tq={tq} cat={cat} toolbar={<QuestionToolbar filters={tq.filters} onSearch={tq.setSearch} onOpenFilters={openFilters} />} />
      {(
        <div className="split">
          {list}
          <div className="pane" ref={paneRef}>
            {shown ? (
              <>
                {detail}
              </>
            ) : (
              <div className="empty qx-empty">
                <PaneArt />
                <b>Select a question</b>
                <span className="muted">Its details and actions appear here.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
