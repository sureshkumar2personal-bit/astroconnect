import { useEffect, useRef } from 'react';
import { activeFilterCount, filterQuestions, isOpen } from '@shared/lib/textQuestions.js';
import { navigate, routes } from '@shared/lib/router.js';
import QHeader from '../components/work/QHeader.jsx';
import QuestionToolbar from '../components/work/QuestionToolbar.jsx';
import QCard from '../components/work/QCard.jsx';
import QDetail from '../components/work/QDetail.jsx';
import AnswerPage from '../components/work/AnswerPage.jsx';
import TimelinePage from '../components/work/TimelinePage.jsx';
import AddLinkForm from '../components/work/AddLinkForm.jsx';
import { CorrectionBody, FiltersBody, PreviewBody } from '../components/work/QDialogs.jsx';

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
    if (viewing && !mobile && window.matchMedia('(max-width: 1180px)').matches) {
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

  if (route.editor && isOpen(q) && q.status !== 'Correction Requested') {
    const preview = () => {
      const text = q.draft.trim();
      ui.dialog({
        title: 'Preview Answer',
        body: (close) => (
          <PreviewBody q={q} text={text} onBack={close} onSubmit={() => {
            tq.submitAnswer(q.id, text); close(); ui.toast('Answer submitted. The user can see it now.'); navigate(routes.detail(q.id));
          }} />
        ),
      });
    };
    const addLink = () => ui.dialog({
      title: 'Add Link',
      body: (close) => <AddLinkForm onCancel={close} onAdd={(url) => { tq.addLink(q.id, url); close(); }} />,
    });
    return <AnswerPage key={q.id} q={q} tq={tq} onPreview={preview} onAddLink={addLink} toast={ui.toast} />;
  }

  const detail = q && <QDetail q={q} campaignName={tq.campaignName(q.camp)} {...handlers} />;
  if (mobile && q) return detail;

  const items = filterQuestions(tq.questions, { cat, tab: tq.tab, prio: tq.prio, f: tq.filters });
  const list = (
    <div className="lbox">
      <QuestionToolbar filters={tq.filters} onSearch={tq.setSearch} onOpenFilters={openFilters} />
      <div className="list" id="qlist">
        {items.length
          ? items.map((x) => <QCard key={x.id} q={x} campaignName={tq.campaignName(x.camp)} selected={x.id === q?.id} />)
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
      <QHeader tq={tq} cat={cat} />
      {mobile ? list : (
        <div className="split">
          {list}
          <div className="pane" ref={paneRef}>
            {q ? (
              <>
                <button type="button" className="btn btn-o sm pg-back" onClick={() => navigate(routes.listFor(cat))}>‹ Back</button>
                {detail}
              </>
            ) : (
              <div className="empty"><b>Select a question</b><span className="muted">Its details and actions appear here.</span></div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
