import { navigate } from '@/lib/router.js';
import { FEE, OFFERS, RANGE, SERVICES, TIERS, inr } from '@/data/mockStudio.js';
import * as C from '@/hooks/useStudio.js';
import { Ic, Pill } from './csShared.jsx';

const BKEY = { 'Free benefit': 'free', Discount: 'discount', 'Exclusive access': 'exclusive', 'Subscriber access': 'subscriber', 'Special benefit': 'special', 'Not set': 'notset' };
const RANGES = [['today', 'Today'], ['7d', 'Last 7 days'], ['30d', 'Last 30 days'], ['custom', 'Custom']];
const ViewEarnings = () => <button type="button" className="cs-btn cs-btn--sm" onClick={() => navigate('/earnings')}>View Earnings<Ic n="arrowUp" size={15} /></button>;

/** Benefits & Offers: subscriber benefits per audience, offer performance and offer transactions (AD-179 – AD-183).
 *  Figures are illustrative samples; final commission and payouts follow the Earnings rules. */
export default function BenefitsOffers({ s }) {
  const tb = s.benefits[s.tier];
  const tierName = TIERS.find((t) => t.id === s.tier).name;
  const groups = ['Consultations', 'Predictions'].map((g) => ({ name: g, rows: SERVICES.filter((x) => x.group === g) }));

  // performance
  // Preset ranges use the reference's sample multipliers; Custom scales with the number of days chosen (30 days = full).
  const days = Math.max(1, Math.round((new Date(s.customTo) - new Date(s.customFrom)) / 86400000) + 1);
  const m = s.range === 'custom' ? Math.min(1, (Number.isFinite(days) ? days : 1) / 30) : RANGE[s.range].m;
  const rows = OFFERS.map((o) => {
    const uses = Math.round(o.uses * m); const users = Math.min(uses, Math.round(o.users * m));
    const original = uses * o.unit; const discount = Math.round((original * o.pct) / 100); const paid = original - discount; const fee = Math.round(paid * FEE);
    return { o, uses, users, original, discount, paid, fee, net: paid - fee, acq: Math.round(o.acq * m) };
  });
  const maxUses = Math.max(1, ...rows.map((r) => r.uses));
  const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
  const uniqueUsers = Math.round(sum('users') * 0.88);
  const freeUsed = rows.filter((r) => r.o.pct === 100).reduce((a, r) => a + r.uses, 0);
  const metrics = [
    ['New subscribers via offers', String(sum('acq')), 'First subscription started with an offer'],
    ['Unique offer users', String(uniqueUsers), 'Each person counted once'],
    ['Total redemptions', String(sum('uses')), 'Every use, including repeats'],
    ['Offer income', inr(sum('paid')), `Your net after fee: ${inr(sum('net'))}`],
    ['Free benefits used', String(freeUsed), 'Free questions and access redeemed'],
  ];

  // transactions
  const tx = C.filteredTx(s);
  const per = 6; const pages = Math.max(1, Math.ceil(tx.length / per)); const page = Math.min(s.txPage, pages);
  const txRows = tx.slice((page - 1) * per, page * per);
  const start = tx.length ? (page - 1) * per + 1 : 0;
  const txSel = (key) => (e) => C.set({ [key]: e.target.value, txPage: 1 });

  return (
    <div className="cs-stack cs-stack--xl">
      {/* ---------- Subscriber benefits ---------- */}
      <section className="cs-stack" aria-labelledby="cs-sb-h">
        <div className="cs-sechead"><h2 className="cs-h2" id="cs-sb-h">Subscriber benefits</h2><ViewEarnings /></div>
        <div className="cs-tiers" role="radiogroup" aria-label="Audience">
          {TIERS.map((t) => {
            const sel = s.tier === t.id; const on = SERVICES.filter((x) => s.benefits[t.id][x.id].on).length;
            return (
              <button type="button" key={t.id} role="radio" aria-checked={sel} className="cs-card cs-tier" onClick={() => C.set({ tier: t.id, editing: '' })}>
                <span className="cs-tier__top"><span className="cs-tier__name"><i className="cs-medal" style={{ background: t.medal }} />{t.name}</span>{sel && <Ic n="check" size={18} />}</span>
                <span className="cs-tier__m">{t.members}</span>
                <span className="cs-tier__on">{on} of 9 benefits on</span>
              </button>
            );
          })}
        </div>
        <div className="cs-card cs-benefits">
          <div className="cs-benefits__head"><h3 className="cs-h3">{tierName} benefits</h3><span className="cs-note cs-note--sm">Visual configuration only — existing service and eligibility rules are unchanged.</span></div>
          {groups.map((g) => (
            <div key={g.name}>
              <div className="cs-group">{g.name}</div>
              {g.rows.map((sv) => {
                const b = tb[sv.id]; const editing = s.editing === sv.id;
                return (
                  <div className={`cs-brow${b.on ? '' : ' is-off'}`} key={sv.id}>
                    <div className="cs-brow__line">
                      <span className="cs-brow__n">{sv.name}</span>
                      <span className="cs-brow__t"><Pill cls={`b-${BKEY[b.type] || 'notset'}`}>{b.type}</Pill></span>
                      <span className="cs-brow__d">{b.detail}</span>
                      <span className="cs-brow__ctl">
                        <span className="cs-brow__st">{b.on ? 'On' : 'Off'}</span>
                        <button type="button" role="switch" aria-checked={b.on} aria-label={`${sv.name} benefit for ${tierName}`} className="cs-switch" onClick={() => C.toggleBenefit(s.tier, sv.id)}><i /></button>
                        <button type="button" className="cs-btn cs-btn--sm" aria-label={`Edit ${sv.name} benefit`} onClick={() => C.editBenefit(sv.id)}><Ic n="edit" size={15} />Edit</button>
                      </span>
                    </div>
                    {editing && (
                      <div className="cs-bedit">
                        <label className="cs-field"><span>Benefit type</span>
                          <select value={s.editType} onChange={(e) => C.set({ editType: e.target.value })}>{['Free benefit', 'Discount', 'Exclusive access', 'Subscriber access', 'Special benefit'].map((x) => <option key={x}>{x}</option>)}</select></label>
                        <label className="cs-field cs-field--grow"><span>Offer details</span>
                          <input type="text" value={s.editDetail} onChange={(e) => C.set({ editDetail: e.target.value })} placeholder="e.g. 1 free question every month" /></label>
                        <div className="cs-bedit__act"><button type="button" className="cs-btn cs-btn--ghost" onClick={() => C.set({ editing: '' })}>Cancel</button><button type="button" className="cs-btn cs-btn--p" onClick={C.saveBenefit}>Save benefit</button></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Offer performance ---------- */}
      <section className="cs-stack" aria-labelledby="cs-op-h">
        <div className="cs-sechead">
          <h2 className="cs-h2" id="cs-op-h">Offer performance</h2>
          <div className="cs-seg" role="group" aria-label="Date range">
            {RANGES.map(([id, label]) => <button type="button" key={id} aria-pressed={s.range === id} onClick={() => C.set({ range: id })}>{label}</button>)}
          </div>
        </div>
        {s.range === 'custom' && (
          <div className="cs-dates">
            <label className="cs-field"><span>From</span><input type="date" value={s.customFrom} onChange={(e) => C.set({ customFrom: e.target.value })} /></label>
            <label className="cs-field"><span>To</span><input type="date" value={s.customTo} onChange={(e) => C.set({ customTo: e.target.value })} /></label>
          </div>
        )}
        <div className="cs-card cs-metrics">
          {metrics.map(([l, v, h]) => <div className="cs-metric" key={l}><span className="cs-metric__l">{l}</span><span className="cs-metric__v">{v}</span><span className="cs-metric__h">{h}</span></div>)}
        </div>
        <div className="cs-two">
          <div className="cs-card cs-pad cs-stack">
            <h3 className="cs-h3">Offer-wise redemptions</h3>
            {rows.map((r) => (
              <div className="cs-bar" key={r.o.id}>
                <div className="cs-bar__top"><span className="cs-bar__n">{r.o.name}</span><span className="cs-bar__v">{r.uses} uses · {inr(r.paid)}</span></div>
                <div className="cs-bar__track"><i className={r.o.pct === 100 ? 'is-gold' : ''} style={{ width: `${Math.round((r.uses / maxUses) * 100)}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="cs-card cs-pad cs-stack">
            <h3 className="cs-h3">How these numbers are counted</h3>
            <p className="cs-def"><strong>New subscribers via offers</strong> — people whose first paid subscription started with an offer. Counted once.</p>
            <p className="cs-def"><strong>Unique offer users</strong> — existing and new subscribers who used any offer. A person who used two offers is counted once.</p>
            <p className="cs-def"><strong>Redemptions</strong> — every individual use, including repeat uses by the same person.</p>
            <p className="cs-def"><strong>Offer income</strong> — the amount customers paid on offer transactions, before the platform fee.</p>
          </div>
        </div>
        <div className="cs-card">
          <div className="cs-benefits__head"><h3 className="cs-h3">Offer calculation</h3></div>
          <div className="cs-table-wrap" data-noswipe>
            <div className="cs-table cs-table--calc">
              <div className="cs-tr cs-tr--head cs-calc"><span>Offer</span><span>Service · Tier</span><span className="r">Users</span><span className="r">Uses</span><span className="r">Original</span><span className="r">Offer amount</span><span className="r">Amount paid</span><span className="r">Platform fee</span><span className="r">Your net</span></div>
              {rows.map((r) => (
                <div className="cs-tr cs-calc" key={r.o.id}>
                  <span className="cs-td cs-td--strong" data-label="Offer">{r.o.name}</span><span className="cs-td" data-label="Service · Tier">{r.o.service} · {r.o.tier}</span>
                  <span className="cs-td r" data-label="Users">{r.users}</span><span className="cs-td r" data-label="Uses">{r.uses}</span><span className="cs-td r" data-label="Original">{inr(r.original)}</span>
                  <span className="cs-td r" data-label="Offer amount">{r.o.pct === 100 ? `Free (−${inr(r.discount)})` : `−${inr(r.discount)}`}</span>
                  <span className="cs-td r" data-label="Amount paid">{inr(r.paid)}</span><span className="cs-td r" data-label="Platform fee">{inr(r.fee)}</span><span className="cs-td r cs-td--strong" data-label="Your net">{inr(r.net)}</span>
                </div>
              ))}
              <div className="cs-tr cs-tr--total cs-calc"><span className="cs-td cs-td--strong">Total</span><span className="cs-td" />
                <span className="cs-td r" data-label="Users">{uniqueUsers}</span><span className="cs-td r" data-label="Uses">{sum('uses')}</span><span className="cs-td r" data-label="Original">{inr(sum('original'))}</span>
                <span className="cs-td r" data-label="Offer amount">−{inr(sum('discount'))}</span><span className="cs-td r" data-label="Amount paid">{inr(sum('paid'))}</span><span className="cs-td r" data-label="Platform fee">{inr(sum('fee'))}</span><span className="cs-td r cs-td--strong" data-label="Your net">{inr(sum('net'))}</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Offer transactions ---------- */}
      <section className="cs-stack" aria-labelledby="cs-ot-h">
        <div className="cs-sechead"><h2 className="cs-h2" id="cs-ot-h">Offer transactions</h2><ViewEarnings /></div>
        <div className="cs-toolbar">
          <label className="cs-search"><span className="cs-sr">Search transactions</span><Ic n="search" size={16} /><input type="search" value={s.txQuery} onChange={txSel('txQuery')} placeholder="Search customer or offer" /></label>
          <select aria-label="Date" value={s.txRange} onChange={txSel('txRange')}><option value="all">All dates</option><option value="today">Today</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option></select>
          <select aria-label="Offer" value={s.txOffer} onChange={txSel('txOffer')}><option value="all">All offers</option>{OFFERS.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
          <select aria-label="Service" value={s.txService} onChange={txSel('txService')}><option value="all">All services</option>{['Text Questions', 'Appointments', 'Instant Call', 'Instant Chat'].map((x) => <option key={x}>{x}</option>)}</select>
          <select aria-label="Status" value={s.txStatus} onChange={txSel('txStatus')}><option value="all">All statuses</option>{['Completed', 'Pending', 'Refunded'].map((x) => <option key={x}>{x}</option>)}</select>
        </div>
        <div className="cs-card">
          <div className="cs-table-wrap" data-noswipe>
            <div className="cs-table cs-table--tx">
              <div className="cs-tr cs-tr--head cs-txr"><span>Date</span><span>Offer</span><span>Customer</span><span>Service</span><span>Tier</span><span className="r">Offer amount</span><span className="r">Paid</span><span className="r">Net</span><span>Status</span></div>
              {txRows.map((t) => (
                <div className="cs-tr cs-txr" key={t.id}>
                  <span className="cs-td" data-label="Date"><b>{t.date}</b><small>{t.time}</small></span>
                  <span className="cs-td cs-td--strong" data-label="Offer">{t.offer}</span><span className="cs-td" data-label="Customer">{t.customer}</span><span className="cs-td" data-label="Service">{t.service}</span><span className="cs-td" data-label="Tier">{t.tier}</span>
                  <span className="cs-td r" data-label="Offer amount">{t.offerAmt}</span><span className="cs-td r" data-label="Paid">{inr(t.paid)}</span><span className="cs-td r" data-label="Net">{inr(t.net)}</span>
                  <span className="cs-td" data-label="Status"><Pill cls={`x-${t.status.toLowerCase()}`}>{t.status}</Pill></span>
                </div>
              ))}
              {txRows.length === 0 && <div className="cs-empty">No offer transactions match these filters.</div>}
            </div>
          </div>
          <div className="cs-pager">
            <span className="cs-note cs-note--sm">{tx.length ? `Showing ${start}–${Math.min(page * per, tx.length)} of ${tx.length} offer transactions` : '0 offer transactions'}</span>
            <nav className="cs-pages" aria-label="Pagination">
              <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => C.set({ txPage: Math.max(1, page - 1) })}>‹</button>
              {Array.from({ length: pages }, (_, i) => <button type="button" key={i} aria-current={i + 1 === page ? 'page' : 'false'} onClick={() => C.set({ txPage: i + 1 })}>{i + 1}</button>)}
              <button type="button" aria-label="Next page" disabled={page >= pages} onClick={() => C.set({ txPage: Math.min(pages, page + 1) })}>›</button>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
