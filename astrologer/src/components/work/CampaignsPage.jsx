import { Badge, Grid, Kpi, KpiGrid, Note, Prog, Sec, BtnRow } from '@/components/ui/sectionKit.jsx';
import { campSold, campTotal, fmtDate } from '@/lib/textQuestions.js';
import { routes } from '@/lib/router.js';
import { PriceText } from './bits.jsx';

// Campaign Management (reference TQSUB.campaigns; AD-24 – AD-27, AD-52, AD-54 – AD-58, AD-70, AD-73):
// shared monthly slot quota, monthly answer target, Open Questions and the campaign cards.
function CampaignCard({ c, onAction }) {
  const cancelled = c.status === 'Cancelled';
  const t = campTotal(c);
  const s = campSold(c);
  return (
    <Sec className={`camp${cancelled ? ' dim' : ''}`} title={c.name}
      right={<>{c.special ? <Badge kind="accent">Special Campaign · {c.label}</Badge> : <Badge kind="info">Regular</Badge>}<Badge kind={cancelled ? 'bad' : 'ok'}>{c.status}</Badge></>}>
      <div className="muted sm">{fmtDate(c.start)} – {fmtDate(c.end)} · {[c.G && 'General', c.P && 'Personal'].filter(Boolean).join(' & ')}</div>
      <Prog pct={t ? (s / t) * 100 : 0} />
      <div className="row wrap sm camp-nums">
        <span className="grow">{s} / {t} sold · {Math.max(0, t - s)} unsold</span>
        {c.G && <span>General {c.gSold}/{c.gSlots} · <PriceText price={c.pg} disc={c.gDisc} /></span>}
        {c.P && <span>Personal {c.pSold}/{c.pSlots} · <PriceText price={c.pp} disc={c.pDisc} /></span>}
      </div>
      {cancelled ? (
        <p className="muted sm">Cancelled: users were refunded for purchased unused slots; submitted questions keep their deadlines.</p>
      ) : (
        <BtnRow>
          <a className="btn btn-o sm" href={`#${routes.campEdit(c.id)}`}>Edit</a>
          <button type="button" className="btn btn-o sm" onClick={() => onAction('slots', c.id)}>Increase / Decrease</button>
          <button type="button" className="btn btn-o sm" onClick={() => onAction('realloc', c.id)}>Reallocate</button>
          <button type="button" className="btn btn-o sm" onClick={() => onAction('extend', c.id)}>Extend</button>
          <button type="button" className="btn btn-o sm danger" onClick={() => onAction('cancel', c.id)}>Cancel</button>
          <button type="button" className="btn btn-o sm danger" onClick={() => onAction('delete', c.id)}>Delete</button>
        </BtnRow>
      )}
    </Sec>
  );
}

export default function CampaignsPage({ tq, onAction }) {
  const p = Math.round((tq.alloc / tq.quota) * 100);
  const o = tq.open;
  const list = tq.campaigns.filter((c) => c.status !== 'Deleted');
  return (
    <>
      <Grid size="lg">
        <Sec title="Monthly Slot Quota">
          <div className="quota">
            <div className="ring" style={{ '--pct': `${p}%` }} role="img" aria-label={`${p}% allocated`}>
              <span><b>{p}%</b><small>allocated</small></span>
            </div>
            <div className="grow stack quota-text">
              <div><b className="xl">{tq.quota.toLocaleString('en-IN')}</b> slots · one shared quota for campaigns and Open Questions</div>
              <div className="sm">{tq.alloc} allocated · <span className="ok-t">{tq.free} available</span></div>
              <div className="muted sm">Resets on the 1st of every month at 12:00 AM IST. Unused slots don't carry forward. Mid-month joiners get a pro-rata quota.</div>
            </div>
          </div>
        </Sec>
        <Sec title="Monthly Answer Target">
          <div><b className="xl">{tq.answeredMonth}</b> / {tq.target} answered this month</div>
          <Prog pct={(tq.answeredMonth / tq.target) * 100} />
          <Note>
            Missing 800 in a month reduces the <b>following</b> month's quota: 1st month → 900 (−10%), 2nd consecutive → 800 (−20%).
            Meeting the reduced target restores 1,000. A 3rd consecutive miss suspends only the Text-Based Questions service for 3 months.
            <br /><b>Current status: Normal quota (1,000)</b>
          </Note>
        </Sec>
      </Grid>
      <Sec title="Open Questions" right={<a className="btn btn-o sm" href={`#${routes.openSettings}`}>Edit</a>}>
        <KpiGrid>
          <Kpi label="General slots" value={`${o.gSold} / ${o.gSlots} sold`} />
          <Kpi label="Personal slots" value={`${o.pSold} / ${o.pSlots} sold`} />
          <div className="kpi"><span className="sm">General price</span><PriceText price={o.pg} disc={o.gDisc} /></div>
          <div className="kpi"><span className="sm">Personal price</span><PriceText price={o.pp} disc={o.pDisc} /></div>
        </KpiGrid>
        <p className="muted sm">Questions sent without choosing a campaign. No campaign title needed.</p>
      </Sec>
      <h2 className="h camp-h">Your Campaigns ({list.length})</h2>
      {list.map((c) => <CampaignCard key={c.id} c={c} onAction={onAction} />)}
    </>
  );
}
