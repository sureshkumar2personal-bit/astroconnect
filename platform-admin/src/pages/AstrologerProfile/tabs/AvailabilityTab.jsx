import { DataTable, Empty, Pill, Section, Stats, Timeline, d, dt, usePaged } from '../../UserProfile/components/ui.jsx';
import { AvailabilityBadge } from '../../Astrologers/components/AstroBits.jsx';
import ExportButtons from '../components/ExportButtons.jsx';

const time = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

// Tab 11 — Availability & Schedule (§14, 11-availability-schedule.md).
// View only. DND cannot be activated during an active Call / Chat (AD-74).
export default function AvailabilityTab({ profile, notify }) {
  const { availability: av, astrologer } = profile;
  const history = usePaged(av.history, 10);
  const historyColumns = [
    { header: 'State', value: (h) => h.state, width: 10 },
    { header: 'From', value: (h) => dt(h.from), width: 20 },
    { header: 'To', value: (h) => (h.to ? dt(h.to) : 'Ongoing'), width: 20 },
    { header: 'Details', value: (h) => h.note, width: 30 },
  ];
  return (
    <div className="p-stack">
      <section className="p-section a-avail-now" aria-label="Current availability">
        <div>
          <p className="p-small">Current availability</p>
          <AvailabilityBadge value={av.current} />
        </div>
        <ul className="a-avail-legend">
          {['Available', 'Busy', 'Offline', 'DND'].map((s) => (
            <li key={s} className={s === av.current ? 'is-current' : undefined}>
              <AvailabilityBadge value={s} />
            </li>
          ))}
        </ul>
        <p className="p-small a-avail-rule">DND cannot be turned on during an active Instant Call or Chat. Existing confirmed appointments stay valid during DND.</p>
      </section>

      <Stats
        label="Last 30 days"
        items={[
          ['Busy sessions (30 days)', av.history.filter((h) => h.state === 'Busy').length],
          ['DND periods (30 days)', av.history.filter((h) => h.state === 'DND').length],
          ['Appointment duration', `${av.duration} min`],
          ['Buffer between appointments', `${av.buffer} min`],
        ]}
      />

      <div className="p-grid-2">
        <Section id="aa-weekly" title="Weekly Schedule" description="Recurring weekly availability within the rolling 90-day booking horizon.">
          <DataTable
            caption="Weekly schedule"
            rows={av.weekly}
            rowKey={(w) => w.day}
            columns={[
              { key: 'day', header: 'Day', primary: true, render: (w) => w.day },
              { key: 'hours', header: 'Hours', render: (w) => (w.working ? w.sessions.map((s) => s.join('–')).join(', ') : 'Weekly off') },
              { key: 'breaks', header: 'Breaks', render: (w) => (w.breaks.length ? w.breaks.map((b) => b.join('–')).join(', ') : '—') },
            ]}
          />
        </Section>
        <Section id="aa-days" title="Daily Availability and Appointment Slots" description="Next 7 days. Booked slots are confirmed appointments.">
          <DataTable
            caption="Next 7 days"
            rows={av.upcoming}
            rowKey={(u) => u.date}
            columns={[
              { key: 'date', header: 'Date', primary: true, render: (u) => `${u.day.slice(0, 3)}, ${d(u.date)}` },
              { key: 'state', header: 'Day Status', render: (u) => (u.closed ? <Pill value="Blocked" /> : u.working ? 'Working' : 'Weekly off') },
              { key: 'booked', header: 'Booked', render: (u) => (u.booked.length ? u.booked.map((b) => `${time(b.serviceAt)} (${b.id})`).join(', ') : '—'), className: 'p-wrap' },
              { key: 'available', header: 'Available', className: 'is-num', render: (u) => u.available },
              { key: 'blocked', header: 'Blocked', className: 'is-num', render: (u) => u.blocked },
            ]}
          />
        </Section>
      </div>

      <Section id="aa-history" title="DND / Busy History" description="Busy periods are the astrologer’s Instant Call and Chat sessions." actions={<ExportButtons title="Availability History" astrologer={astrologer} columns={historyColumns} rows={av.history} fileBase="astrologer-availability" notify={notify} label="entries" />}>
        <DataTable
          caption="DND and Busy history"
          rows={history.rows}
          rowKey={(h) => `${h.state}-${h.from}`}
          empty={<Empty icon="clock" title="No DND or Busy periods in the last 30 days" />}
          columns={[
            { key: 'state', header: 'State', primary: true, render: (h) => <AvailabilityBadge value={h.state} /> },
            { key: 'from', header: 'From', render: (h) => dt(h.from) },
            { key: 'to', header: 'To', render: (h) => (h.to ? dt(h.to) : 'Ongoing') },
            { key: 'note', header: 'Details', render: (h) => h.note },
          ]}
        />
        {history.pager('entries')}
      </Section>

      <div className="p-grid-2">
        <Section id="aa-closures" title="Manual Date Closures">
          <DataTable
            caption="Manual date closures"
            rows={av.closures}
            rowKey={(c) => c.date}
            empty={<Empty icon="calendar" title="No closed dates" />}
            columns={[
              { key: 'date', header: 'Closed Date', primary: true, render: (c) => d(c.date) },
              { key: 'reason', header: 'Reason', render: (c) => c.reason },
              { key: 'at', header: 'Closed On', render: (c) => dt(c.at) },
              { key: 'aff', header: 'Affected Appointments', className: 'is-num', render: (c) => c.affected },
            ]}
          />
        </Section>
        <Section id="aa-changes" title="Schedule Change History">
          <Timeline items={av.changes} />
        </Section>
      </div>
    </div>
  );
}
