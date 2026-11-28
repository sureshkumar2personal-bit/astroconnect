import { useEffect, useMemo, useState } from 'react';
import { loadServiceIndex, serviceDetails } from '../../data/serviceIndex.js';
import { ADMIN_RETENTION_MONTHS, APP_RETENTION_HOURS, adminCanView, adminRetentionStart, appCanView, conversationFor, logView, viewLog } from '../../data/chatTranscripts.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import {
  DataTable,
  DateFilter,
  DetailPanel,
  Empty,
  Fields,
  FilterBar,
  Pill,
  SearchFilter,
  Section,
  SelectFilter,
  Stats,
  SubHeading,
  ViewButton,
  d,
  dt,
  money,
  usePaged,
} from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, NOT_FINALISED, PageHead, UnavailableAction, UserLink, startOfDay, useToast } from './components/ServiceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import './ServicesPage.css';

// Service Management → Instant Call / Instant Chat (instant-call-management.md,
// instant-chat-management.md). Prepaid packages (minimum 5 minutes), no
// per-minute billing; 30-second acceptance; waiting list of up to 3
// (excluding the active session); no automatic retry with the same
// astrologer; no refund for early termination; DND cannot start during an
// active session. Admin termination is unavailable until its refund effect
// is decided (PP-13). Chat conversations: Admin 3 months, apps 24 hours.

export const SESSION_STATES = ['Pending', 'Busy', 'Declined', 'Expired', 'Cancelled', 'Active', 'Completed'];
const iso = (t) => new Date(t).toISOString();
const SORTS = [
  ['requested:desc', 'Newest requested'],
  ['requested:asc', 'Oldest requested'],
  ['duration:desc', 'Duration (longest)'],
  ['amount:desc', 'Amount (highest)'],
];

export default function InstantSessionsPage({ type, session: admin }) {
  const isChat = type === 'Instant Chat';
  const noun = isChat ? 'Chat' : 'Call';
  const [state, setState] = useState({ status: 'loading', index: null, message: '' });
  const [f, setF] = useState({ query: '', status: 'all', astro: 'all', termination: 'all', pkg: 'all', from: '', to: '' });
  const [sort, setSort] = useState('requested:desc');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();
  useEffect(() => {
    let live = true;
    loadServiceIndex().then((index) => live && setState({ status: 'ready', index, message: '' }), (e) => live && setState({ status: 'error', index: null, message: e.message }));
    return () => {
      live = false;
    };
  }, []);
  const set = (patch) => setF((s) => ({ ...s, ...patch }));
  const all = useMemo(() => (state.index?.sessions ?? []).filter((s) => s.type === type), [state.index, type]);
  const snapshot = state.index?.snapshot ?? Date.now();
  const astrologers = useMemo(() => [...new Map(all.map((s) => [s.astroId, s.astroName])).entries()].sort((a, b) => a[1].localeCompare(b[1])), [all]);
  const terminations = useMemo(() => [...new Set(all.map((s) => s.termination))].sort(), [all]);
  const packages = useMemo(() => [...new Set(all.map((s) => s.packageMinutes))].sort((a, b) => a - b), [all]);

  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const from = f.from ? new Date(`${f.from}T00:00:00`).getTime() : null;
    const to = f.to ? new Date(`${f.to}T23:59:59`).getTime() : null;
    const list = all.filter(
      (s) =>
        (f.status === 'all' || s.status === f.status) &&
        (f.astro === 'all' || s.astroId === f.astro) &&
        (f.termination === 'all' || s.termination === f.termination) &&
        (f.pkg === 'all' || s.packageMinutes === Number(f.pkg)) &&
        (from === null || s.createdAt >= from) &&
        (to === null || s.createdAt <= to) &&
        (!q || s.id.toLowerCase().includes(q) || s.userId.toLowerCase().includes(q) || s.astroId.toLowerCase().includes(q) || s.userName.toLowerCase().includes(q) || s.astroName.toLowerCase().includes(q))
    );
    const [key, dir] = sort.split(':');
    const val = { requested: (s) => s.createdAt, duration: (s) => s.usedMinutes, amount: (s) => s.amount }[key];
    return list.sort((a, b) => (dir === 'asc' ? val(a) - val(b) : val(b) - val(a)) || a.id.localeCompare(b.id));
  }, [all, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);

  const report = useMemo(() => {
    const today = startOfDay(snapshot);
    const complaintIds = new Set((state.index?.complaints ?? []).filter((c) => c.category === noun).map((c) => c.serviceId));
    const astro = new Map();
    for (const s of all) {
      const r = astro.get(s.astroId) ?? { id: s.astroId, name: s.astroName, count: 0, minutes: 0 };
      r.count += 1;
      r.minutes += s.usedMinutes;
      astro.set(s.astroId, r);
    }
    const withinRetention = all.filter((s) => adminCanView(s.endedAt, snapshot)).length;
    return {
      total: all.length,
      today: all.filter((s) => s.createdAt >= today && s.createdAt <= snapshot).length,
      active: all.filter((s) => s.status === 'Active').length,
      completed: all.filter((s) => s.status === 'Completed').length,
      unsuccessful: all.filter((s) => ['Expired', 'Declined', 'Cancelled'].includes(s.status)).length,
      avg: all.length ? (all.reduce((t, s) => t + s.usedMinutes, 0) / all.length).toFixed(1) : '0',
      charges: all.reduce((t, s) => t + s.amount, 0),
      failureRate: all.length ? `${((all.filter((s) => complaintIds.has(s.id)).length / all.length) * 100).toFixed(2)}%` : '—',
      astro: [...astro.values()].sort((a, b) => b.count - a.count).slice(0, 10),
      withinRetention,
    };
  }, [all, snapshot, state.index, noun]);

  const columns = [
    { header: `${noun} Session ID`, value: (s) => s.id, width: 16 },
    { header: 'User', value: (s) => `${s.userName} (${s.userId})`, width: 28 },
    { header: 'Astrologer', value: (s) => `${s.astroName} (${s.astroId})`, width: 30 },
    { header: 'Requested', value: (s) => dt(iso(s.createdAt)), width: 20 },
    { header: isChat ? 'Started' : 'Connected', value: (s) => dt(iso(s.connectedAt)), width: 20 },
    { header: 'Ended', value: (s) => dt(iso(s.endedAt)), width: 20 },
    { header: 'Duration (min)', value: (s) => s.usedMinutes, width: 10 },
    { header: 'Package', value: (s) => `${s.packageMinutes} min · ${s.packagePrice}`, width: 16 },
    { header: 'Extensions', value: (s) => s.extensions, width: 10 },
    { header: 'User Charged Amount', value: (s) => s.amount, width: 12 },
    { header: 'Payment Status', value: (s) => s.paymentStatus, width: 12 },
    { header: `${noun} Status`, value: (s) => s.status, width: 12 },
  ];

  return (
    <div className="users services">
      <PageHead title={type} subtitle={`Prepaid ${noun.toLowerCase()} sessions with astrologers. Packages start at 5 minutes; there is no per-minute billing.`} />
      {state.status === 'loading' && <LoadingState label={`Loading ${noun.toLowerCase()} sessions`} />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <>
          <Stats
            label={`${noun} report`}
            items={[
              [`Total ${noun}s`, formatNumber(report.total), 'gold'],
              ['Today', report.today],
              [`Active ${noun}s`, report.active],
              ['Completed', formatNumber(report.completed), 'green'],
              ['Expired / Declined / Cancelled', report.unsuccessful],
              ['Average Duration', `${report.avg} min`],
              ['Total User Charges', money(report.charges)],
              ['Technical Failure Rate', report.failureRate],
            ]}
          />
          <Section
            id="is-rules"
            title="Session Rules"
            description={`Astrologers accept within 30 seconds; a waiting list holds up to 3 users besides the active session; there is no automatic retry with the same astrologer; ending early does not create a refund; DND cannot be turned on during an active Call or Chat.${isChat ? ` Chat conversations: users and astrologers see them for ${APP_RETENTION_HOURS} hours; Platform Admin can view them for ${ADMIN_RETENTION_MONTHS} months (from ${d(iso(adminRetentionStart(snapshot)))}; ${formatNumber(report.withinRetention)} sessions).` : ' Calls are not recorded.'}`}
          >
            {report.active === 0 && <p className="p-small p-muted">No {noun.toLowerCase()} sessions are active in the current records.</p>}
          </Section>
          <Section id="is-list" title={`${noun} Sessions`} actions={<ExportPair title={type} columns={columns} rows={rows} fileBase={`astroconnect-${isChat ? 'instant-chat' : 'instant-call'}`} notify={notify} />}>
            <FilterBar canClear={JSON.stringify(f) !== JSON.stringify({ query: '', status: 'all', astro: 'all', termination: 'all', pkg: 'all', from: '', to: '' })} onClear={() => set({ query: '', status: 'all', astro: 'all', termination: 'all', pkg: 'all', from: '', to: '' })}>
              <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Session, User or Astrologer ID / name" />
              <SelectFilter label={`${noun} Status`} value={f.status} onChange={(v) => set({ status: v })} options={[['all', 'All statuses'], ...SESSION_STATES]} />
              <SelectFilter label="Astrologer" value={f.astro} onChange={(v) => set({ astro: v })} options={[['all', 'All astrologers'], ...astrologers]} />
              <SelectFilter label="Package" value={f.pkg} onChange={(v) => set({ pkg: v })} options={[['all', 'All packages'], ...packages.map((m) => [String(m), `${m} minutes`])]} />
              <SelectFilter label="Termination" value={f.termination} onChange={(v) => set({ termination: v })} options={[['all', 'All'], ...terminations]} />
              <DateFilter label="Requested from" value={f.from} onChange={(v) => set({ from: v })} />
              <DateFilter label="Requested to" value={f.to} onChange={(v) => set({ to: v })} />
              <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
            </FilterBar>
            <p className="p-small p-muted">{formatNumber(rows.length)} sessions match.</p>
            <DataTable
              caption={`${noun} sessions`}
              rows={paged.rows}
              onRowClick={setOpen}
              empty={<Empty title="No matching sessions" text="Change or clear the filters." />}
              columns={[
                { key: 'id', header: `${noun} Session ID`, primary: true, render: (s) => <span className="p-mono">{s.id}</span> },
                { key: 'u', header: 'User', render: (s) => <UserLink id={s.userId} name={s.userName} /> },
                { key: 'a', header: 'Astrologer', render: (s) => <AstroLink id={s.astroId} name={s.astroName} /> },
                { key: 'r', header: 'Requested', render: (s) => dt(iso(s.createdAt)) },
                { key: 'c', header: isChat ? 'Started / Ended' : 'Connected', render: (s) => (isChat ? <span className="p-desc"><span>{dt(iso(s.connectedAt))}</span><span className="p-small">to {dt(iso(s.endedAt))}</span></span> : dt(iso(s.connectedAt))) },
                { key: 'dur', header: 'Duration', className: 'is-num', render: (s) => `${s.usedMinutes} min` },
                { key: 'pkg', header: 'Package / Extensions', render: (s) => <span className="p-desc"><span>{s.packageMinutes} min · {money(s.packagePrice)}</span><span className="p-small">{s.extensions ? `${s.extensions} extension${s.extensions > 1 ? 's' : ''}` : 'No extension'}</span></span> },
                { key: 'amt', header: 'User Charged', className: 'is-num', render: (s) => money(s.amount) },
                { key: 'pay', header: 'Payment Status', render: (s) => <Pill value={s.paymentStatus} /> },
                { key: 'st', header: `${noun} Status`, render: (s) => <Pill value={s.status} /> },
                { key: 'v', header: 'View Details', render: (s) => <ViewButton onClick={() => setOpen(s)} /> },
              ]}
            />
            {paged.pager('sessions')}
          </Section>
          <Section id="is-astro" title={`Astrologer-wise ${noun} Count`}>
            <DataTable
              caption={`Astrologer-wise ${noun.toLowerCase()} count`}
              rows={report.astro}
              columns={[
                { key: 'a', header: 'Astrologer', primary: true, render: (r) => <AstroLink id={r.id} name={r.name} tab="services" /> },
                { key: 'c', header: `${noun}s`, className: 'is-num', render: (r) => r.count },
                { key: 'm', header: 'Minutes', className: 'is-num', render: (r) => formatNumber(r.minutes) },
              ]}
            />
          </Section>
        </>
      )}
      {open && <SessionDetails row={open} isChat={isChat} admin={admin} snapshot={snapshot} onClose={() => setOpen(null)} />}
      {toastNode}
    </div>
  );
}

function SessionDetails({ row, isChat, admin, snapshot, onClose }) {
  const detail = serviceDetails(row.userId, row.id);
  const [showChat, setShowChat] = useState(false);
  const [views, setViews] = useState(() => viewLog(row.id));
  if (!detail) return null;
  const { service: s, user, transactions, complaint } = detail;
  const acceptSeconds = Math.round((new Date(s.connectedAt) - new Date(s.requestedAt)) / 1000);
  const adminOk = adminCanView(s.endedAt, snapshot);
  const appOk = appCanView(s.endedAt, snapshot);
  const total = s.package.minutes * (1 + s.extensions);
  return (
    <DetailPanel title={s.id} subtitle={`${s.type} · ${user.name} (${user.id}) with ${s.astrologer.name} (${s.astrologer.id})`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Status', <Pill key="s" value={s.status} />],
          ['User', <UserLink key="u" id={user.id} name={user.name} />],
          ['Astrologer', <AstroLink key="a" id={s.astrologer.id} name={s.astrologer.name} />],
          ['Requested', dt(s.requestedAt)],
          [isChat ? 'Started' : 'Connected', `${dt(s.connectedAt)} (accepted in ${acceptSeconds} s)`],
          ['Ended', dt(s.endedAt)],
          ['Total Duration', `${s.usedMinutes} min of ${total} min purchased`],
          ['Termination Reason', s.termination],
        ]}
      />
      <SubHeading>Prepaid Package and Payment</SubHeading>
      <Fields
        columns={2}
        items={[
          ['Package', `${s.package.minutes} minutes · ${money(s.package.price)}`],
          ['Extensions', s.extensions ? `${s.extensions} × ${s.package.minutes}-minute package` : 'None'],
          ['User Charged Amount', money(s.amount)],
          ['Payment Status', <Pill key="p" value={s.paymentStatus} />],
          ['Payment Method', s.payments?.[0]?.method ?? s.method],
          ['Payment / Wallet Transaction IDs', (s.payments ?? []).map((p) => p.id).join(', ') || '—', { wide: true }],
          ['Wallet Records', transactions.map((t) => `${t.id} ${money(t.debit ?? t.credit)} (${t.status})`).join(', ') || 'Paid directly', { wide: true }],
          ['Refund', s.termination === 'Package time completed' ? '—' : 'No refund for early termination'],
        ]}
      />
      <SubHeading>Related Complaint</SubHeading>
      {complaint ? <Fields columns={2} items={[['Complaint ID', complaint.id], ['Status', <Pill key="c" value={complaint.status} />]]} /> : <p className="p-muted">No related complaint.</p>}

      <SubHeading>{isChat ? 'Conversation' : 'Call Audio'}</SubHeading>
      {!isChat ? (
        <p className="p-restricted">Calls are not recorded, so there is no audio or conversation to view.</p>
      ) : !adminOk ? (
        <p className="p-restricted">This conversation is older than the {ADMIN_RETENTION_MONTHS}-month Platform Admin retention period and is no longer available.</p>
      ) : (
        <>
          <p className="p-small p-muted">
            Available to Platform Admin for {ADMIN_RETENTION_MONTHS} months (until {d(new Date(new Date(s.endedAt).setMonth(new Date(s.endedAt).getMonth() + ADMIN_RETENTION_MONTHS)).toISOString())}). In the User and Astrologer apps it {appOk ? `is visible for ${APP_RETENTION_HOURS} hours after the chat` : `is no longer visible (${APP_RETENTION_HOURS}-hour limit passed)`}. Views are logged.
          </p>
          {!showChat ? (
            <button
              type="button"
              className="u-btn"
              onClick={() => {
                logView(s.id, admin);
                setViews(viewLog(s.id));
                setShowChat(true);
              }}
            >
              View conversation
            </button>
          ) : (
            <ol className="is-chat">
              {conversationFor({ id: s.id, connectedAt: new Date(s.connectedAt).getTime(), endedAt: new Date(s.endedAt).getTime(), usedMinutes: s.usedMinutes, packageMinutes: s.package.minutes, extensions: s.extensions, termination: s.termination }).map((m, i) => (
                <li key={i} className={`is-msg is-${m.from}`}>
                  <span className="is-msg__meta">
                    {m.from === 'user' ? user.name : m.from === 'astrologer' ? s.astrologer.name : 'AstroConnect'} · {new Date(m.at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                  <span className="is-msg__text">{m.text}</span>
                </li>
              ))}
            </ol>
          )}
          {views.length > 0 && (
            <p className="p-small p-muted">
              Viewed by {views.slice(0, 3).map((v) => `${v.by.name} (${v.by.id}) · ${dt(v.at)}`).join('; ')}
              {views.length > 3 ? ` and ${views.length - 3} more` : ''}
            </p>
          )}
        </>
      )}

      <SubHeading>Actions</SubHeading>
      {s.status === 'Active' ? (
        <UnavailableAction label={`Terminate ${isChat ? 'Chat' : 'Call'}`} reason={`${NOT_FINALISED}: the refund effect of Admin termination is not yet decided.`} />
      ) : (
        <p className="p-muted">No actions apply to a finished session. Admin never sends messages on behalf of the user or astrologer.</p>
      )}
    </DetailPanel>
  );
}
