import { navigate } from '@/lib/router.js';
import { Badge, BtnRow, Empty, Kpi, KpiGrid, Note, PendingTag, Sec, Table } from '@/components/ui/sectionKit.jsx';
import { fmtDateTime, dt } from '@/lib/format.js';
import { canCreate, liveActions, usedThisMonth } from '@/hooks/useLive.js';
import LiveCreateForm from './LiveCreateForm.jsx';
import { ConfirmCancel, PreviewTest } from './LiveDialogs.jsx';

// Live Sessions main screen: eligibility tiles, Scheduled Live, Create Live, Past Lives.
export default function LiveOverview({ s, ui }) {
  const preview = (topic) => ui.dialog({ title: 'Preview / Test', body: (close) => <PreviewTest topic={topic} onDone={close} /> });
  const monthState = usedThisMonth(s) ? 'Used' : s.scheduled ? 'Scheduled' : 'Available';
  const startNow = () => { liveActions.start(); ui.toast('Live Started sent to your audience'); navigate('/live'); };

  return (
    <>
      <KpiGrid>
        <Kpi label="Verification" value={s.verified ? 'Verified' : 'Not verified'}
          sub={s.verified ? <span className="up">Can go live without Admin approval</span> : <PendingTag id="AP-04-01" />} />
        <Kpi label="This month (Nov 2026)" value={monthState} sub={<span className="sm">1 Live per calendar month</span>} />
        <Kpi label="Paid Live" value="Not available" sub={<span className="sm">Future requirement</span>} />
      </KpiGrid>

      {s.scheduled && (
        <Sec title="Scheduled Live">
          <div className="row wrap">
            <div className="grow">
              <b className="lg">{s.scheduled.topic}</b>
              <div className="muted sm">{fmtDateTime(dt(s.scheduled.when))} · Audience: {s.scheduled.aud}</div>
            </div>
            <Badge kind="info">Scheduled</Badge>
          </div>
          <p className="sm">{s.scheduled.desc}</p>
          <Note>Audience reminders: 1 day, 1 hour and 15 minutes before, then “Live Started”. If you cancel or don't show, they are notified.</Note>
          <BtnRow>
            <button type="button" className="btn btn-o" onClick={() => preview(s.scheduled.topic)}>Preview / Test</button>
            <button type="button" className="btn btn-p" onClick={startNow}>Start now</button>
            <button type="button" className="btn btn-o danger" onClick={() => ui.dialog({
              title: 'Cancel Live',
              body: (close) => <ConfirmCancel onKeep={close} onConfirm={() => { liveActions.cancel(); close(); ui.toast('Live cancelled. Audience notified. You can schedule another this month.'); }} />,
            })}>Cancel Live</button>
          </BtnRow>
        </Sec>
      )}

      <Sec title="Create Live">
        {canCreate(s) ? (
          <LiveCreateForm form={s.form} onPreview={() => preview(s.form.topic)} onDone={(mode) => {
            if (mode === 'schedule') ui.toast('Live scheduled. Your audience has been notified.');
            else ui.toast('Live Started sent to your audience');
          }} />
        ) : (
          <Empty title={s.scheduled ? 'A Live is already scheduled this month' : !s.verified ? 'Only Verified Astrologers can go live' : "You have used this month's Live"}>
            You can go live again from 1 Dec 2026. Cancelling a scheduled Live lets you schedule another in the same month.
          </Empty>
        )}
      </Sec>

      <Sec title="Past Lives">
        <Table cols={['Live', 'Date', 'Duration', 'Participants', 'Comments']}
          rows={s.past.map((p) => ({ key: p.id, cells: [p.topic, fmtDateTime(dt(p.date)), p.dur, p.parts, p.comments] }))}
          empty="No past Lives yet." bare />
      </Sec>
    </>
  );
}
