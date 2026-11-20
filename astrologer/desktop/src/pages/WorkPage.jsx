import { useCallback, useEffect, useRef, useState } from 'react';
import { navigate, routes } from '@shared/lib/router.js';
import { astrologerProfile } from '@shared/data/mockTextQuestions.js';
import WorkHeader from '../layout/WorkHeader.jsx';
import TextQuestionsPage from './TextQuestionsPage.jsx';
import MyWorkHub from '../components/work/MyWorkHub.jsx';
import CampaignManagement, { CampaignForm, CancelCampaign, ReallocForm, SlotsForm } from '../components/work/CampaignManagement.jsx';
import AnswerTemplates, { DeleteTemplate, TemplateForm } from '../components/work/AnswerTemplates.jsx';
import History from '../components/work/History.jsx';
import QuestionTimeline from '../components/work/QuestionTimeline.jsx';
import QuestionFilters from '../components/work/QuestionFilters.jsx';
import RequestCorrection from '../components/work/RequestCorrection.jsx';
import AnswerPreview from '../components/work/AnswerPreview.jsx';
import AddLinkForm from '../components/work/AddLinkForm.jsx';
import { Dialog, Toast } from '@shared/components/ui.jsx';

const TITLES = {
  questions: ['Text Questions', ''],
  campaigns: ['Campaign Management', ''],
  templates: ['Answer Templates', ''],
  history: ['History', ''],
};

const DIALOG_TITLES = {
  timeline: 'Question Timeline',
  correction: 'Request Correction',
  preview: 'Preview Answer',
  link: 'Add Link',
  filters: 'Filters',
  newCamp: 'Create Campaign',
  editCamp: 'Edit Campaign',
  slots: 'Increase / Decrease Slots',
  realloc: 'Reallocate Slots',
  cancelCamp: 'Cancel Campaign',
  newTpl: 'Create Template',
  editTpl: 'Edit Template',
  delTpl: 'Delete Template',
};

function mobileTitle(route) {
  if (route.view === 'hub') return 'My Work';
  if (route.view !== 'questions') return TITLES[route.view][0];
  if (route.editor) return 'Write Answer';
  return route.id ? 'Question Details' : 'Text Questions';
}

function parentRoute(route) {
  if (route.view === 'questions' && route.editor) return routes.detail(route.id);
  if (route.view === 'questions' && route.id) return routes.list;
  if (route.view === 'hub') return null;
  return routes.hub;
}

export default function WorkPage({ route, path, mobile, tq, theme, onToggleTheme, unread, availability }) {
  const [dialog, setDialog] = useState(null); // { kind, id }
  const [toastMsg, setToastMsg] = useState('');
  const timer = useRef();

  const toast = useCallback((m) => {
    clearTimeout(timer.current);
    setToastMsg(m);
    timer.current = setTimeout(() => setToastMsg(''), 2600);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const openDialog = useCallback((kind, id) => setDialog({ kind, id }), []);
  const close = useCallback(() => setDialog(null), []);

  // Desktop shows Text Questions for the bare My Work route.
  const view = !mobile && route.view === 'hub' ? 'questions' : route.view;

  // New screen: start at the top (mobile changes screen on every route).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, mobile ? path : null]); // eslint-disable-line react-hooks/exhaustive-deps

  const campaign = (id) => tq.campaigns.find((c) => c.id === id);
  const q = dialog?.id ? tq.byId(dialog.id) : null;

  function dialogBody() {
    if (!dialog) return null;
    const { kind, id } = dialog;
    switch (kind) {
      case 'timeline':
        return <QuestionTimeline q={q} campaignName={tq.campaign(q.camp).name} />;
      case 'correction':
        return (
          <RequestCorrection q={q} campaign={tq.campaign(q.camp)} onCancel={close} onSend={() => {
            tq.requestCorrection(id); close(); toast(`Correction request sent to ${q.name}`);
          }} />
        );
      case 'preview':
        return (
          <AnswerPreview q={q} onBack={close} onSubmit={() => {
            tq.submitAnswer(id); close(); toast('Answer submitted. The user can see it now.'); navigate(routes.list);
          }} />
        );
      case 'link':
        return <AddLinkForm onCancel={close} onAdd={(url) => { tq.addLink(id, url); close(); }} />;
      case 'filters':
        return (
          <QuestionFilters filters={tq.filters} campaigns={tq.campaigns}
            onApply={(f) => { tq.setFilters(f); close(); if (mobile) navigate(routes.list); }}
            onReset={() => { tq.resetFilters(); close(); if (mobile) navigate(routes.list); }} />
        );
      case 'newCamp':
      case 'editCamp':
        return (
          <CampaignForm campaign={kind === 'editCamp' ? campaign(id) : null} free={tq.free} onCancel={close} onSave={(v) => {
            tq.saveCampaign(kind === 'editCamp' ? id : null, v); close(); toast(kind === 'editCamp' ? 'Campaign updated' : 'Campaign created');
          }} />
        );
      case 'slots':
        return <SlotsForm campaign={campaign(id)} free={tq.free} onCancel={close} onSave={(n) => { tq.setSlots(id, n); close(); toast('Slots updated'); }} />;
      case 'realloc':
        return (
          <ReallocForm campaign={campaign(id)} campaigns={tq.campaigns} onCancel={close} onMove={(target, n) => {
            tq.reallocate(id, target.id, n); close(); toast(`${n} slots moved to ${target.name}`);
          }} />
        );
      case 'cancelCamp':
        return <CancelCampaign campaign={campaign(id)} questions={tq.questions} onKeep={close} onConfirm={() => { tq.cancelCampaign(id); close(); toast('Campaign cancelled'); }} />;
      case 'newTpl':
      case 'editTpl':
        return (
          <TemplateForm template={kind === 'editTpl' ? tq.templates.find((t) => t.id === id) : null} onCancel={close} onSave={(name, text) => {
            tq.saveTemplate(kind === 'editTpl' ? id : null, name, text); close(); toast('Template saved');
          }} />
        );
      case 'delTpl':
        return <DeleteTemplate template={tq.templates.find((t) => t.id === id)} onCancel={close} onConfirm={() => { tq.deleteTemplate(id); close(); toast('Template deleted'); }} />;
      default:
        return null;
    }
  }

  let content;
  if (view === 'hub') content = <MyWorkHub questions={tq.questions} onOpen={(v) => navigate(routes.view(v))} />;
  else if (view === 'questions') content = <TextQuestionsPage tq={tq} route={route} mobile={mobile} openDialog={openDialog} toast={toast} />;
  else if (view === 'campaigns') content = <CampaignManagement tq={tq} onAction={openDialog} />;
  else if (view === 'templates') content = <AnswerTemplates templates={tq.templates} onAction={openDialog} />;
  else content = <History questions={tq.questions} history={tq.history} setHistory={tq.setHistory} onOpen={(id) => openDialog('timeline', id)} />;

  const parent = parentRoute(route);
  const [title, subtitle] = TITLES[view] || ['My Work', ''];

  return (
    <>
      <WorkHeader
        mobile={mobile}
        title={mobile ? mobileTitle(route) : title}
        subtitle={subtitle}
        onBack={mobile && parent ? () => navigate(parent) : null}
        theme={theme}
        onToggleTheme={onToggleTheme}
        unread={unread}
        availability={availability}
        profile={astrologerProfile}
      />
      {view === 'questions' && !mobile ? content : <div className={mobile ? 'screen' : 'narrow'}>{content}</div>}
      <Dialog open={!!dialog} title={dialog ? DIALOG_TITLES[dialog.kind] : ''} onClose={close} sheet={mobile}>
        {dialogBody()}
      </Dialog>
      {toastMsg && <Toast message={toastMsg} />}
    </>
  );
}
