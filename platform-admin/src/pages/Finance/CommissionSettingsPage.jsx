import { COMMISSION_RULES } from '../../data/revenueData.js';
import { DataTable, Pill, Section } from '../UserProfile/components/ui.jsx';
import { NOT_FINALISED, UnavailableAction } from '../Services/components/ServiceBits.jsx';
import { FinanceHead } from './components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const rateText = (r) => (r.free ? 'Free' : r.rate === null ? NOT_FINALISED : `${Math.round(r.rate * 100)}%`);
const statusOf = (r) => (r.free ? 'Free — no earnings' : r.rate === null ? NOT_FINALISED : 'Approved');

// Finance → Commission Settings (06-payments-finance.md §2). Shows the approved
// configuration — the same rules Platform Commission, Service Revenue and
// Astrologer Earnings calculate with (revenueData.COMMISSION_RULES). No
// effective dates are documented, and the Super Admin change steps are not
// documented, so rates cannot be changed here.
export default function CommissionSettingsPage() {
  return (
    <div className="users services">
      <FinanceHead title="Commission Settings" subtitle="Approved platform commission rates per service. Commission is calculated on the amount the user actually paid, after any offer discount." />
      <Section id="cs-rates" title="Commission Rates" description="No single rate is applied to all services. Different services may have different rates.">
        <DataTable
          caption="Commission rates"
          rows={COMMISSION_RULES}
          rowKey={(r) => r.service}
          columns={[
            { key: 's', header: 'Service Type', primary: true, render: (r) => r.service },
            { key: 'r', header: 'Commission Rate', render: (r) => (r.rate === null && !r.free ? <span className="p-muted">{NOT_FINALISED}</span> : rateText(r)) },
            { key: 'e', header: 'Effective Date', render: () => <span className="p-small p-muted">Not documented</span> },
            { key: 'src', header: 'Source / Reference', render: (r) => <span className="p-small">{r.source}</span> },
            { key: 'st', header: 'Status', render: (r) => <Pill value={statusOf(r)} /> },
          ]}
        />
      </Section>
      <Section id="cs-rules" title="Rules">
        <ul className="p-small">
          <li>Commission is calculated on the amount the user paid after any offer discount; the astrologer bears the discount (Astrologer AD-127).</li>
          <li>Old transactions keep their historical commission. A change applies to future eligible transactions from its approved effective date.</li>
          <li>Super Admin controls commission settings. Assistants cannot change them.</li>
          <li>Text Question and Subscription rates are not finalised (PP-09); no commission is calculated for them.</li>
          <li>Live Sessions are free and earn nothing (Astrologer AD-113).</li>
        </ul>
        <UnavailableAction label="Change Commission Rate" reason={`Super Admin change steps and effective-date scheduling: ${NOT_FINALISED}.`} />
      </Section>
    </div>
  );
}
