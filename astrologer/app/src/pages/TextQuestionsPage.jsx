import { useRef } from 'react';
import { activeFilterCount, filterQuestions, isOpen } from '../lib/textQuestions.js';
import { navigate, routes } from '../lib/router.js';
import QuestionStats from '../components/work/QuestionStats.jsx';
import QuestionTabs from '../components/work/QuestionTabs.jsx';
import QuestionToolbar from '../components/work/QuestionToolbar.jsx';
import QuestionList from '../components/work/QuestionList.jsx';
import QuestionDetails from '../components/work/QuestionDetails.jsx';
import AnswerEditor from '../components/work/AnswerEditor.jsx';

// Text Questions (My Work → Text Questions).
// Desktop/tablet: stats, tabs, then list + detail/editor side by side (stacked below 1180px).
// Mobile: one screen at a time — list, question details, write answer.
export default function TextQuestionsPage({ tq, route, mobile, openDialog, toast }) {
  const paneRef = useRef(null);
  const items = filterQuestions(tq.questions, tq.tab, tq.filters);
  const campaignName = (id) => tq.campaign(id).name;

  const select = (id) => {
    navigate(routes.detail(id));
    // When list and details are stacked, bring the details into view.
    if (!mobile && window.matchMedia('(max-width: 1180px)').matches) {
      requestAnimationFrame(() => paneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  };

  const detailHandlers = {
    onAnswer: (id) => navigate(routes.editor(id)),
    onTimeline: (id) => openDialog('timeline', id),
    onCorrection: (id) => openDialog('correction', id),
    onDisputeSubmit: (id, text) => {
      if (!text) return toast('Write your dispute answer first.');
      tq.submitDispute(id, text);
      toast('Dispute answer sent.');
    },
  };

  const editor = (q) => (
    <AnswerEditor
      key={q.id}
      q={q}
      templates={tq.templates}
      tq={tq}
      autoFocus={!mobile}
      toast={toast}
      onPreview={() => openDialog('preview', q.id)}
      onAddLink={() => openDialog('link', q.id)}
    />
  );

  const listColumn = (
    <>
      <QuestionToolbar filters={tq.filters} onSearch={tq.setSearch} onOpenFilters={() => openDialog('filters')} />
      <QuestionList
        items={items}
        selectedId={null}
        campaignName={campaignName}
        onSelect={select}
        hasFilters={activeFilterCount(tq.filters) > 0}
        onClearFilters={tq.resetFilters}
      />
    </>
  );

  if (mobile) {
    const q = route.id ? tq.byId(route.id) : null;
    if (q && route.editor && isOpen(q)) return editor(q);
    if (q) return <QuestionDetails q={q} campaignName={campaignName(q.camp)} {...detailHandlers} />;
    return (
      <>
        <QuestionTabs questions={tq.questions} tab={tq.tab} onChange={tq.setTab} />
        {listColumn}
      </>
    );
  }

  // Desktop: keep the routed question if it is in the current list, otherwise show the first one.
  const routed = route.id && tq.byId(route.id);
  const editing = routed && route.editor && isOpen(routed);
  const selected = editing ? routed : items.find((q) => q.id === route.id) || items[0] || null;

  return (
    <>
      <QuestionStats tq={tq} onCreateCampaign={() => openDialog('newCamp')} onManageCampaigns={() => navigate(routes.view('campaigns'))} />
      <QuestionTabs questions={tq.questions} tab={tq.tab} onChange={tq.setTab} />
      <div className="split">
        <div className="lbox list">
          <QuestionToolbar filters={tq.filters} onSearch={tq.setSearch} onOpenFilters={() => openDialog('filters')} />
          <QuestionList
            items={items}
            selectedId={selected?.id}
            campaignName={campaignName}
            onSelect={select}
            hasFilters={activeFilterCount(tq.filters) > 0}
            onClearFilters={tq.resetFilters}
          />
        </div>
        <div className="pane" ref={paneRef}>
          {editing ? (
            <>
              <div className="row">
                <h2 className="grow">Write Answer</h2>
                <button type="button" className="btn btn-o sm" onClick={() => navigate(routes.detail(routed.id))}>‹ Back to question</button>
              </div>
              {editor(routed)}
            </>
          ) : (
            <QuestionDetails q={selected} campaignName={selected ? campaignName(selected.camp) : ''} {...detailHandlers} />
          )}
        </div>
      </div>
    </>
  );
}
