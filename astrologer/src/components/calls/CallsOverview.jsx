import { Badge, Grid, Note, PendingTag, Sec, Seg, SwitchRow } from '@/components/ui/sectionKit.jsx';
import ExpandTable from '@/components/ui/ExpandTable.jsx';
import { ConsultationInfo } from './ConsultationDetails.jsx';
import { dt, fmtDateTime, inr } from '@/lib/format.js';
import { callsActions, svcName } from '@/hooks/useCalls.js';
import { serviceMessage } from '@/hooks/useAvailability.js';
import LiveStatus from './LiveStatus.jsx';
import PackageCard from './PackageCard.jsx';

// Instant Call & Chat main screen: availability (shared with Home, AD-04 – AD-07, AD-151),
// live status / lock (AD-105), prepaid packages (AD-106), Call / Chat History (AD-110, AD-111).
export default function CallsOverview({ st, av, ui }) {
  const status = av.dnd ? ['DND active', 'bad'] : av.mode === 'online' ? ['Online', 'ok'] : ['Offline', 'warn'];
  const hist = st.hist.filter((x) => x.svc === svcName(st.tab));
  return (
    <>
      <Grid>
        <Sec title="Availability">
          <div className="row"><span className="grow">Status</span><Badge kind={status[1]}>{status[0]}</Badge></div>
          <SwitchRow label="Instant Call" on={av.call} onToggle={() => { av.toggleCall(); ui.toast(serviceMessage('call', !av.call)); }} disabled={av.dnd} />
          <SwitchRow label="Instant Chat" on={av.chat} onToggle={() => { av.toggleChat(); ui.toast(serviceMessage('chat', !av.chat)); }} disabled={av.dnd} />
          <Note>Requests only arrive for a service that is switched on while you're Online. Offline or DND: no requests. Notification settings never change availability.</Note>
          <a className="go" href="#/">Change Online / Offline / DND on Home ›</a>
        </Sec>
        <LiveStatus st={st} av={av} ui={ui} />
      </Grid>

      <Grid size="lg">
        {['call', 'chat'].map((s) => <PackageCard key={s} s={s} list={st.pk[s]} ui={ui} />)}
      </Grid>

      <Sec title="History" right={<Seg label="History" options={[['call', 'Call History'], ['chat', 'Chat History']]} value={st.tab} onChange={callsActions.setTab} />}>
        {/* A history row expands in place to show its consultation details (no separate page). */}
        <ExpandTable key={st.tab} cols={['Consultation', 'User', 'Date & time', 'Actual duration', 'Package · Amount', 'Payment']}
          rows={hist.map((x) => ({
            key: x.id,
            detail: () => <ConsultationInfo x={x} />,
            cells: [<b>{x.id}</b>, x.user, fmtDateTime(dt(x.at)), x.dur, `${x.pk} · ${inr(x.amt)}`, x.pay],
          }))} />
        {st.tab === 'chat' && <p className="muted sm">Chat messages are visible to you and the user for 24 hours only. Records stay.</p>}
      </Sec>

      <Note>
        No refund for early termination by either side. If a user reports that you ended a session early without answering, the Platform investigates; a confirmed fault means a warning notification. Reconnection failing permanently: <PendingTag id="AP-06-01" /> · Settlement eligibility for Call/Chat: <PendingTag id="AP-08-03" />
      </Note>
    </>
  );
}
