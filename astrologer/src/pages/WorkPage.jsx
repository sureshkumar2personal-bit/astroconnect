import Icon from '@/components/ui/Icon.jsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { navigate, routes } from '@/lib/router.js';
import { astrologerProfile } from '@/data/mockTextQuestions.js';
import WorkHeader from '@/layout/WorkHeader.jsx';
import TextQuestionsPage from './TextQuestionsPage.jsx';
import WorkOverview from '@/components/work/WorkOverview.jsx';
import CampaignsPage from '@/components/work/CampaignsPage.jsx';
import CampaignEditor from '@/components/work/CampaignEditor.jsx';
import OpenSettings from '@/components/work/OpenSettings.jsx';
import { CancelBody, DeleteBody, ExtendBody, ReallocBody, SlotsBody } from '@/components/work/CampaignDialogs.jsx';
import TemplatesPage, { DeleteTemplateBody, TemplateFormBody } from '@/components/work/TemplatesPage.jsx';
import HistoryPage from '@/components/work/HistoryPage.jsx';
import { BackBtn, PageActions } from '@/components/work/bits.jsx';
import { Dialog, Toast } from '@/components/ui/primitives.jsx';
import { fmtDate, isOpen } from '@/lib/textQuestions.js';
import AppointmentsPage, { appointmentsSubtitle, appointmentsTitle } from './AppointmentsPage.jsx';
import { CancelAppointment, CloseDate, EditDay } from '@/components/appointments/AppointmentDialogs.jsx';

// My Work (reference "02 Text-Based Questions + Subscription Questions" and "05 Appointments").
// Routes (lib/router.js): #/work overview; #/work/questions | subscriptions [/:id[/answer|/timeline]];
// #/work/campaigns [/new | /open | /:id]; #/work/templates; #/work/history; #/work/appointments….

const SUB_TITLES = {
  text: ['Text-Based Questions', ''], // subtitle removed at the user's request (2026-11-20)
  sub: ['Subscription Questions', 'Questions offered to subscribers as a benefit: Silver 1 · Gold 3 · Platinum 4'],
};

/** Header text, back target and page-level buttons for each My Work screen (reference PH). */
function screenMeta(route, tq, mobile) {
  const v = route.view;
  // Back goes to the Home dashboard.
  if (v === 'hub') return { title: 'My Work', crumb: null, parent: routes.home, back: true };
  if (v === 'questions' || v === 'subscriptions') {
    const q = route.id && tq.byId(route.id);
    const cat = q ? q.cat : route.cat;
    const list = routes.listFor(cat);
    if (q && route.editor && isOpen(q) && q.status !== 'Correction Requested') return { title: 'Write Answer', subtitle: `${q.id} · ${q.name}`, parent: routes.detail(q.id), back: true };
    if (q && route.timeline) return { title: 'Question Timeline', subtitle: q.id, parent: routes.detail(q.id), back: true };
    const [title] = SUB_TITLES[cat];
  const subtitle = '';
    const actions = (
      <>
        <a className="btn btn-o btn-camp" href={`#${routes.campaigns}`}><Icon name="megaphone" size={18} className="btn-camp__icon" />Campaign Management</a>
        <a className="btn btn-navy" href={`#${routes.campNew}`}>+ Create Campaign</a>
      </>
    );
    // Back goes straight to My Work (the question pane has its own Back to the list).
    return { title, subtitle, parent: routes.hub, back: true, actions, crumb: null };
  }
  if (v === 'campaigns') {
    if (route.camp === 'open') return { title: 'Open Questions settings', crumb: null, parent: routes.campaigns, back: true };
    if (route.camp) {
      const edit = route.camp !== 'new';
      return { title: edit ? 'Edit Campaign' : 'Create Campaign', crumb: null, parent: routes.campaigns, back: true };
    }
    return {
      title: 'Campaign Management',
      crumb: null,
      parent: routes.hub, // Back goes straight to My Work
      back: true,
      actions: (
        <>
          <a className="btn btn-o" href={`#${routes.openSettings}`}>Open Questions settings</a>
          <a className="btn btn-p" href={`#${routes.campNew}`}>+ Create Campaign</a>
        </>
      ),
    };
  }
  if (v === 'templates') return { title: 'Answer Templates', crumb: null, parent: routes.hub, back: true, tplAction: true };
  if (v === 'history') return { title: 'History', crumb: null, parent: routes.hub, back: true };
  return { title: 'My Work', subtitle: '' };
}

export default function WorkPage({ route, path, mobile, tq, apt, theme, onToggleTheme, unread, availability }) {
  const [dialog, setDialog] = useState(null); // { title, body } or appointments { kind, id }
  const [toastMsg, setToastMsg] = useState('');
  const timer = useRef();

  const toast = useCallback((m) => {
    clearTimeout(timer.current);
    setToastMsg(m);
    timer.current = setTimeout(() => setToastMsg(''), 2600);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const close = useCallback(() => setDialog(null), []);
  const openDialog = useCallback((kind, id) => setDialog({ kind, id }), []); // Appointments dialogs
  const [ui] = useState(() => ({}));
  ui.toast = toast;
  ui.dialog = setDialog;
  ui.close = close;

  // New screen: start at the top and close any open dialog.
  useEffect(() => { window.scrollTo(0, 0); setDialog(null); }, [path]);

  const view = route.view;

  // ---- Campaign and template dialogs ----
  const camp = (id) => tq.campaign(id);
  const campaignAction = (kind, id) => {
    const c = camp(id);
    const map = {
      slots: ['Increase / Decrease Slots', (cl) => <SlotsBody c={c} free={tq.free} onCancel={cl} onSave={(g, p) => { tq.setSlots(id, g, p); cl(); toast('Slots updated'); }} />],
      realloc: ['Reallocate Slots', (cl) => <ReallocBody c={c} campaigns={tq.campaigns} onCancel={cl} onMove={(fk, tid, tk, n) => { tq.reallocate(id, fk, tid, tk, n); cl(); toast(`${n} slots moved`); }} />],
      extend: ['Extend Campaign', (cl) => <ExtendBody c={c} toast={toast} onCancel={cl} onExtend={(d) => { tq.extendCampaign(id, d); cl(); toast(`Campaign extended to ${fmtDate(d)}`); }} />],
      cancel: ['Cancel Campaign', (cl) => <CancelBody c={c} questions={tq.questions} onKeep={cl} onConfirm={() => { tq.cancelCampaign(id); cl(); toast('Campaign cancelled'); }} />],
      delete: ['Delete Campaign', (cl) => <DeleteBody c={c} onKeep={cl} onConfirm={() => { tq.deleteCampaign(id); cl(); toast('Campaign deleted'); }} />],
    };
    setDialog({ title: map[kind][0], body: map[kind][1] });
  };
  const editTemplate = (id) => {
    const t = id ? tq.templates.find((x) => x.id === id) : null;
    setDialog({
      title: t ? 'Edit Template' : 'Create Template',
      body: (cl) => <TemplateFormBody template={t} onCancel={cl} onSave={(n, x) => { tq.saveTemplate(id, n, x); cl(); toast('Template saved'); }} />,
    });
  };
  const deleteTemplate = (id) => setDialog({
    title: 'Delete Template',
    body: (cl) => <DeleteTemplateBody template={tq.templates.find((x) => x.id === id)} onCancel={cl} onConfirm={() => { tq.deleteTemplate(id); cl(); toast('Template deleted'); }} />,
  });

  // ---- Appointments dialogs (kind, id) ----
  function aptDialog() {
    const { kind, id } = dialog;
    if (kind === 'aptCancel') return ['Cancel appointment', <CancelAppointment onKeep={close} onConfirm={() => { apt.cancel(id); close(); toast('Appointment cancelled'); }} />];
    if (kind === 'aptDay') return [`Edit ${id}`, <EditDay ranges={apt.settings.week[id]} onCancel={close} onSave={(r) => { apt.editDay(id, r); close(); toast(`${id} availability saved`); }} />];
    if (kind === 'aptClose') return [`Close ${fmtDate(new Date(`${id}T00:00`))}`, <CloseDate booked={apt.confirmedOn(id)} onCancel={close} onConfirm={() => { apt.closeDate(id); close(); toast('Date closed'); }} />];
    return ['', null];
  }
  const [dTitle, dBody] = !dialog ? ['', null]
    : dialog.kind ? aptDialog()
      : [dialog.title, typeof dialog.body === 'function' ? dialog.body(close) : dialog.body];

  // ---- Screen ----
  if (view === 'appointments') {
    return (
      <>
        <WorkHeader mobile={mobile} title={appointmentsTitle(route, mobile)} crumb={null}
          onBack={mobile && (route.id || route.calendar) ? () => navigate(routes.appointments) : mobile ? () => navigate(routes.hub) : null}
          theme={theme} onToggleTheme={onToggleTheme} unread={unread} availability={availability} profile={astrologerProfile} />
        <div className={mobile ? 'screen apt' : 'apt'}>
          {/* Appointments list: Back goes to My Work (phones use the ‹ in the header). */}
          {!route.id && !route.calendar && <BackBtn mobile={mobile} onClick={() => navigate(routes.hub)} />}
          <AppointmentsPage apt={apt} route={route} mobile={mobile} openDialog={openDialog} toast={toast} />
        </div>
        <Dialog open={!!dialog} title={dTitle} onClose={close} sheet={mobile}>{dBody}</Dialog>
        {toastMsg && <Toast message={toastMsg} />}
      </>
    );
  }

  const m = screenMeta(route, tq, mobile);
  let content;
  if (view === 'hub') content = <WorkOverview questions={tq.questions} appointments={apt.list} />;
  else if (view === 'questions' || view === 'subscriptions') content = <TextQuestionsPage tq={tq} route={route} mobile={mobile} ui={ui} />;
  else if (view === 'campaigns' && route.camp === 'open') content = <OpenSettings tq={tq} toast={toast} />;
  else if (view === 'campaigns' && route.camp) {
    const c = route.camp === 'new' ? null : camp(route.camp);
    content = route.camp !== 'new' && !c
      ? <div className="empty"><b>Campaign not found</b></div>
      : (
        <CampaignEditor key={route.camp} campaign={c} free={tq.free} onCancel={() => navigate(routes.campaigns)}
          onSave={(v) => { tq.saveCampaign(v); toast(c ? 'Campaign updated' : 'Campaign created'); navigate(routes.campaigns); }} />
      );
  } else if (view === 'campaigns') content = <CampaignsPage tq={tq} onAction={campaignAction} />;
  else if (view === 'templates') content = <TemplatesPage templates={tq.templates} onEdit={editTemplate} onDelete={deleteTemplate} />;
  else content = <HistoryPage tq={tq} />;

  const actions = m.tplAction
    ? <button type="button" className="btn btn-p" onClick={() => editTemplate(null)}>+ Create Template</button>
    : m.actions;

  return (
    <>
      <WorkHeader
        mobile={mobile}
        title={m.title}
        subtitle={m.subtitle}
        crumb={m.crumb === undefined ? 'My Work' : m.crumb}
        onBack={mobile && m.parent ? () => navigate(m.parent) : null}
        theme={theme}
        onToggleTheme={onToggleTheme}
        unread={unread}
        availability={availability}
        profile={astrologerProfile}
      />
      <div className={`pg pg--work${mobile ? ' screen' : ''}`}>
        <div className="pg-top">
          {m.back && <BackBtn mobile={mobile} onClick={() => navigate(m.parent)} />}
          <PageActions mobile={mobile} subtitle={m.subtitle}>{actions}</PageActions>
        </div>
        {content}
      </div>
      <Dialog open={!!dialog} title={dTitle} onClose={close} sheet={mobile}>{dBody}</Dialog>
      {toastMsg && <Toast message={toastMsg} />}
    </>
  );
}
