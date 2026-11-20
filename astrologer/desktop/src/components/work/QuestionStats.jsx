import { countTab, isOpen } from '@shared/lib/textQuestions.js';

export default function QuestionStats({ tq, onCreateCampaign, onManageCampaigns }) {
  const open = tq.questions.filter(isOpen).length;
  const active = tq.campaigns.filter((c) => c.status === 'Active').length;
  return (
    <div className="stats">
      <div className="stat q">
        <div className="row"><span className="grow stat-quota__label">Monthly Slot Quota</span><b className="stat-quota__total">{tq.quota}</b><span>slots</span></div>
        <div className="bar"><span style={{ '--pct': `${(tq.alloc / tq.quota) * 100}%` }} /></div>
        <div className="row sm"><span className="grow">{tq.alloc} allocated</span><span className="ok-t">{tq.free} available</span></div>
      </div>
      <div className="stat"><span className="sm">Active Campaigns</span><b>{active}</b></div>
      <div className="stat"><span className="sm">Pending Answers</span><b>{open}</b></div>
      <div className="stat"><span className="sm">Due in Priority 1</span><b className="p1">{countTab(tq.questions, 'p1')}</b><span className="muted sm">20–30 days</span></div>
      <div className="stat"><span className="sm">Due in Priority 2</span><b>{countTab(tq.questions, 'p2')}</b><span className="muted sm">1–19 days</span></div>
      <div className="sbtns">
        <button type="button" className="btn btn-p" onClick={onCreateCampaign}>+ Create Campaign</button>
        <button type="button" className="btn btn-o" onClick={onManageCampaigns}>Campaign Management</button>
      </div>
    </div>
  );
}
