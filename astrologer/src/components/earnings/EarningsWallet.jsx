import { Component } from 'react';
import EarningsWalletView from './EarningsWalletView.jsx';
import {
  MIN_WITHDRAWAL,
  ASTRO,
  MAX_UPI,
  SERVICES,
  SVC,
  RAW,
  r2,
  money,
  fmtDT,
  fmtD,
  monthKey,
  monthLabel,
  nextRelease,
  addWorkingDays,
  buildPdf,
  PILL,
  ALL_STATUSES,
  SERVICE_FILTERS,
  THIS_M,
  availableFrom,
  maskAcct,
  maskUpi,
  methodLabel,
  loadPayout,
  storePayout,
  BANK_EMPTY,
  UPI_EMPTY,
  validateBank,
  validateUpi,
  txFor,
  isCredit,
  txAmount,
  pieSlicePath,
  ringSlicePath,
  ringMarkPath,
  pct,
  NOW,
  DAY
} from '@/data/earningsWalletModel.js';

// Earnings & Wallet page (reference design). Logic is the reference's, ported to a React class so the
// markup (EarningsWalletView) can render the same values and handlers.
/* eslint-disable */
export default class EarningsWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scope: 'this', sel: 'APT', hover: null, pop: null,
      month: 'All', service: 'All', status: 'All', page: 1,
      modal: false, wdAmount: '', wdMethod: 'Bank', wdError: '', wdDone: null, extra: [],
      banks: [], upis: [], bankSel: null, upiSel: null, editId: null, view: 'withdraw', bf: BANK_EMPTY, uf: UPI_EMPTY, fe: {}, saved: ''
    };
    const st = loadPayout();
    if (st) { this.state.banks = st.banks; this.state.upis = st.upis; this.state.bankSel = st.bankSel; this.state.upiSel = st.upiSel; }
    this._pdfKey = null; this._pdfUrl = '';
  }
  componentDidMount() {
    // Reference fonts, loaded for this page only.
    if (!document.getElementById('ew-fonts')) {
      const l = document.createElement('link');
      l.id = 'ew-fonts'; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
      document.head.appendChild(l);
    }
  }
  setFilter(patch) { this.setState(Object.assign({ page: 1 }, patch)); }

  renderVals() {
    const self = this, s = this.state;
    const pageSize = Number(this.props.pageSize ?? 10);
    const records = s.extra.concat(RAW);
    const earns = records.filter(function (r) { return r.kind === 'earn'; });

    // ---- wallet ----
    const available = availableFrom(records);
    let pendingBal = 0, totalEarn = 0;
    earns.forEach(function (r) { totalEarn += r.net; if (r.status === 'Pending') pendingBal += r.net; });
    const withdrawable = available >= MIN_WITHDRAWAL ? available : 0;

    // ---- service-wise (pie, net after commission) ----
    const scoped = earns.filter(function (r) { return s.scope === 'all' || monthKey(r.t) === THIS_M; });
    const agg = {};
    SERVICES.forEach(function (sv) { agg[sv.key] = { gross: 0, comm: 0, net: 0, count: 0 }; });
    scoped.forEach(function (r) { const a = agg[r.svc]; a.gross += r.gross; a.comm += r.commission; a.net += r.net; a.count++; });
    let netTotal = 0; SERVICES.forEach(function (sv) { netTotal += agg[sv.key].net; }); netTotal = r2(netTotal);

    const CX = 100, CY = 100, R = 88, RI = 51;
    let ang = -Math.PI / 2; const slices = [];
    SERVICES.forEach(function (sv) {
      const v = r2(agg[sv.key].net);
      if (v <= 0 || netTotal <= 0) return;
      const a0 = ang, a1 = ang + (v / netTotal) * Math.PI * 2; ang = a1;
      const isSel = s.sel === sv.key; const isHov = s.hover === sv.key;
      // Donut ring, fixed size: selecting or hovering only changes opacity (and a thin inner mark), never geometry.
      slices.push({
        key: sv.key, d: ringSlicePath(CX, CY, R, RI, a0, a1), color: sv.color,
        mark: isSel ? ringMarkPath(CX, CY, RI - 6, a0, a1) : '',
        opacity: isSel || isHov ? 1 : 0.82, stroke: 'var(--ew-surface)', sw: 1.5,
        enter: function () { self.setState({ hover: sv.key }); },
        leave: function () { if (self.state.hover === sv.key) self.setState({ hover: null }); },
        pick: function () { self.setState({ sel: sv.key, pop: sv.key }); }
      });
    });
    const legend = SERVICES.map(function (sv) {
      const a = agg[sv.key]; const isSel = s.sel === sv.key;
      return {
        key: sv.key, name: sv.name, color: sv.color,
        value: money(r2(a.net)), share: pct(netTotal ? a.net / netTotal : 0),
        aria: isSel ? 'true' : 'false', bg: isSel ? 'var(--ew-chip2)' : 'transparent', border: isSel ? 'var(--ew-line)' : 'transparent',
        pick: function () { self.setState({ sel: sv.key }); },
        enter: function () { self.setState({ hover: sv.key }); },
        leave: function () { if (self.state.hover === sv.key) self.setState({ hover: null }); }
      };
    });
    const ss = SVC[s.sel], sa = agg[s.sel];
    const detail = {
      name: ss.name, color: ss.color,
      count: sa.count + (sa.count === 1 ? ' transaction' : ' transactions'),
      gross: money(r2(sa.gross)),
      commission: money(r2(sa.comm)), commissionPct: typeof ss.commission === 'number' ? ss.commission + '%' : '',
      hasPct: typeof ss.commission === 'number',
      net: money(r2(sa.net)),
      share: pct(netTotal ? sa.net / netTotal : 0),
      settle: ss.settleDays ? 'Tue & Fri · ' + ss.settleDays + ' days after ' + (ss.key === 'TQ' ? 'answer' : 'completion') : 'Released every Tue & Fri',
      scopeLabel: s.scope === 'all' ? 'All time' : monthLabel(THIS_M)
    };
    const scopes = [['this', 'This Month'], ['all', 'All Time']].map(function (x) {
      const on = s.scope === x[0];
      return { label: x[1], aria: on ? 'true' : 'false', bg: on ? 'var(--ew-surface)' : 'transparent', shadow: on ? '0 1px 2px rgba(27,42,74,.14)' : 'none', fg: on ? 'var(--ew-navyText)' : 'var(--ew-mut)',
        go: function () { self.setState({ scope: x[0], hover: null, pop: null }); } };
    });

    // ---- transactions (bank-statement style) ----
    const months = []; records.forEach(function (r) { const k = monthKey(r.t); if (months.indexOf(k) < 0) months.push(k); });
    months.sort().reverse();
    const statusOpts = s.service === 'All' ? ALL_STATUSES : s.service === 'WD' ? ['Completed', 'Processing', 'Failed'] : s.service === 'REF' ? ['Refunded'] : ['Completed', 'Pending'];
    const status = statusOpts.indexOf(s.status) >= 0 ? s.status : 'All';
    const filtered = records.filter(function (r) {
      if (s.month !== 'All' && monthKey(r.t) !== s.month) return false;
      if (s.service === 'WD' && r.kind !== 'wd') return false;
      if (s.service === 'REF' && r.kind !== 'refund') return false;
      if (SVC[s.service] && !(r.kind === 'earn' && r.svc === s.service)) return false;
      if (status !== 'All' && r.status !== status) return false;
      return true;
    });
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(s.page, totalPages);
    const start = (page - 1) * pageSize;
    const rows = filtered.slice(start, start + pageSize).map(function (r) {
      const cr = isCredit(r); const pill = PILL[r.status]; const dim = r.status === 'Failed' || r.status === 'Refunded';
      return {
        id: r.id, forLabel: txFor(r), payId: r.payId, date: fmtDT(r.t),
        dot: r.kind === 'earn' ? SVC[r.svc].color : r.kind === 'wd' ? 'var(--ew-navy)' : 'var(--ew-refund)',
        amount: (cr ? '+' : '−') + money(txAmount(r)),
        amtFg: dim ? 'var(--ew-mut)' : cr ? 'var(--ew-ok)' : 'var(--ew-bad)',
        cd: cr ? 'Credit' : 'Debit', cdBg: cr ? 'var(--ew-okS)' : 'var(--ew-badS)', cdFg: cr ? 'var(--ew-ok)' : 'var(--ew-bad)',
        status: r.status, pillBg: pill.bg, pillFg: pill.fg
      };
    });
    let nums = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) nums.push(i); }
    else {
      nums = [1]; if (page > 3) nums.push(0);
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) nums.push(i);
      if (page < totalPages - 2) nums.push(0); nums.push(totalPages);
    }
    const pages = nums.map(function (n) {
      const c = n === page;
      return { n: n, isGap: n === 0, isNum: n !== 0, aria: c ? 'page' : 'false', bg: c ? 'var(--ew-navy)' : 'var(--ew-surface)', fg: c ? 'var(--ew-onNavy)' : 'var(--ew-navyText)', border: c ? 'var(--ew-navy)' : 'var(--ew-line)',
        go: function () { self.setState({ page: n }); } };
    });

    // ---- PDF statement (reflects the current filters) ----
    const svcLabel = SERVICE_FILTERS.find(function (x) { return x[0] === s.service; })[1];
    const pdfKey = [s.month, s.service, status, s.extra.length].join('|');
    if (pdfKey !== this._pdfKey) {
      this._pdfKey = pdfKey;
      let cr = 0, db = 0;
      filtered.forEach(function (r) { if (r.status === 'Failed' || r.status === 'Refunded') return; if (isCredit(r)) cr += txAmount(r); else db += txAmount(r); });
      const prow = filtered.slice().reverse().map(function (r) {
        return [r.id, txFor(r), r.payId, fmtDT(r.t), (isCredit(r) ? '+' : '-') + money(txAmount(r)), isCredit(r) ? 'Credit' : 'Debit', r.status];
      });
      this._pdfUrl = buildPdf('AstroConnect - Wallet Statement', [
        ASTRO.name + ' (' + ASTRO.id + ')',
        'Period: ' + (s.month === 'All' ? 'All months' : monthLabel(s.month)) + '   Service: ' + svcLabel + '   Status: ' + (status === 'All' ? 'All statuses' : status),
        'Total credits: ' + money(r2(cr)) + '   Total debits: ' + money(r2(db)) + '   Records: ' + total,
        'Generated ' + fmtDT(NOW)
      ], ['Transaction ID', 'Transaction For', 'Payment ID', 'Date & Time', 'Amount', 'Credit/Debit', 'Status'], prow, [
        'Credit amounts are net of platform commission. Earnings are released to Available Balance on Tuesdays and Fridays.',
        'Failed payouts are returned to Available Balance.'
      ]);
    }
    const pdfName = 'AstroConnect-statement-' + (s.month === 'All' ? 'all-months' : s.month) + (s.service !== 'All' ? '-' + s.service.toLowerCase() : '') + '.pdf';

    // ---- withdraw modal (unchanged rules) ----
    const amtNum = Number(String(s.wdAmount).replace(/[^0-9.]/g, ''));
    const selBank = s.banks.find(function (b) { return b.key === s.bankSel; }) || null;
    const selUpi = s.upis.find(function (u) { return u.key === s.upiSel; }) || null;
    const methodDetails = s.wdMethod === 'UPI' ? selUpi : selBank;
    const methodReady = !!(methodDetails && methodDetails.verified);
    const submit = function () {
      if (!methodDetails) return self.setState({ wdError: s.wdMethod === 'UPI' ? 'Add your UPI ID to continue.' : 'Add your bank details to continue.' });
      if (!methodDetails.verified) return self.setState({ wdError: 'Withdrawals can be sent only to verified details.' });
      if (!s.wdAmount || !(amtNum > 0)) return self.setState({ wdError: 'Enter an amount to withdraw.' });
      if (amtNum < MIN_WITHDRAWAL) return self.setState({ wdError: 'The minimum withdrawal is ₹500.' });
      if (amtNum > withdrawable) return self.setState({ wdError: 'You can withdraw up to ' + money(withdrawable) + '.' });
      const t = NOW + (s.extra.length + 1) * 60000;
      const w = { kind: 'wd', rel: 'WD-' + (2306 + s.extra.length), id: 'TXN-' + (40100 + RAW.length + s.extra.length + 1), t: t,
        amount: r2(amtNum), method: s.wdMethod, status: 'Processing', dueBy: addWorkingDays(t, 3), payId: 'pout_NEW' + String(s.extra.length + 1).padStart(6, '0') };
      self.setState({ extra: [w].concat(s.extra), wdDone: { id: w.rel, amount: money(w.amount), method: methodLabel(w.method, selBank, selUpi), due: fmtD(w.dueBy) }, wdError: '', wdAmount: '', page: 1 });
    };

    // ---- payout details (add / edit) ----
    const bankField = function (k, upper) { return function (e) { const v = upper ? e.target.value.toUpperCase() : e.target.value; const fe = Object.assign({}, self.state.fe); delete fe[k]; self.setState({ bf: Object.assign({}, self.state.bf, { [k]: v }), fe: fe }); }; };
    const upiField = function (k) { return function (e) { const fe = Object.assign({}, self.state.fe); delete fe[k]; self.setState({ uf: Object.assign({}, self.state.uf, { [k]: e.target.value }), fe: fe }); }; };
    const fe = s.fe || {};
    const err = function (k) { return fe[k] || ''; };
    const border = function (k) { return fe[k] ? 'var(--ew-bad)' : 'var(--ew-line)'; };
    // ---- saved accounts: separate bank and UPI lists, one selected account in each ----
    const persist = function (patch) {
      const st = self.state;
      return storePayout(Object.assign({ banks: st.banks, upis: st.upis, bankSel: st.bankSel, upiSel: st.upiSel }, patch));
    };
    const newId = function (p, list) { return p + '-' + Date.now().toString(36) + '-' + list.length; };
    const addBank = function () { self.setState({ view: 'bank', editId: null, fe: {}, saved: '', wdError: '', bf: BANK_EMPTY }); };
    const editBankOf = function (id) {
      return function () {
        const b = self.state.banks.find(function (x) { return x.key === id; }); if (!b) return;
        self.setState({ view: 'bank', editId: id, fe: {}, saved: '', wdError: '', bf: { holder: b.holder || '', bankName: b.bankName, acct: '', acct2: '', ifsc: b.ifsc || '', type: b.type || '' } });
      };
    };
    const addUpi = function () {
      if (self.state.upis.length >= MAX_UPI) return self.setState({ wdError: 'You can save up to ' + MAX_UPI + ' UPI IDs. Edit one of them instead.' });
      self.setState({ view: 'upi', editId: null, fe: {}, saved: '', wdError: '', uf: UPI_EMPTY });
    };
    const editUpiOf = function (id) {
      return function () {
        const u = self.state.upis.find(function (x) { return x.key === id; }); if (!u) return;
        self.setState({ view: 'upi', editId: id, fe: {}, saved: '', wdError: '', uf: { id: u.id, id2: u.id } });
      };
    };
    const pickBankAcct = function (id) { return function () { persist({ bankSel: id }); self.setState({ bankSel: id, wdError: '' }); }; };
    const pickUpiAcct = function (id) { return function () { persist({ upiSel: id }); self.setState({ upiSel: id, wdError: '' }); }; };
    const saveBank = function () {
      const st = self.state; const e = validateBank(st.bf);
      const f = st.bf; const acct = f.acct.trim();
      if (!e.acct && st.banks.some(function (b) { return b.key !== st.editId && b.acct === acct; })) e.acct = 'This account number is already saved.';
      if (Object.keys(e).length) return self.setState({ fe: e });
      const nb = { holder: f.holder.trim().replace(/\s+/g, ' '), bankName: f.bankName.trim().replace(/\s+/g, ' '), acct: acct, ifsc: f.ifsc.trim().toUpperCase(), type: f.type };
      let banks, id = st.editId;
      if (id) {
        const prev = st.banks.find(function (b) { return b.key === id; });
        const same = prev && prev.holder === nb.holder && prev.bankName === nb.bankName && prev.acct === nb.acct && prev.ifsc === nb.ifsc && prev.type === nb.type;
        nb.key = id; nb.verified = same ? prev.verified : false;
        banks = st.banks.map(function (b) { return b.key === id ? nb : b; });
      } else {
        id = newId('bank', st.banks); nb.key = id; nb.verified = false; banks = st.banks.concat([nb]);
      }
      const bankSel = st.bankSel && banks.some(function (b) { return b.key === st.bankSel; }) ? st.bankSel : id;
      const kept = persist({ banks: banks, bankSel: bankSel });
      const what = st.editId ? 'Bank details updated.' : 'Bank details saved.';
      self.setState({ banks: banks, bankSel: bankSel, view: 'withdraw', wdMethod: 'Bank', editId: null, fe: {}, saved: kept ? what : what.replace('.', ' for this session.'), wdError: '' });
    };
    const saveUpi = function () {
      const st = self.state; const e = validateUpi(st.uf);
      const uid = st.uf.id.trim();
      if (!e.id && st.upis.some(function (u) { return u.key !== st.editId && u.id.toLowerCase() === uid.toLowerCase(); })) e.id = 'This UPI ID is already saved.';
      if (!st.editId && st.upis.length >= MAX_UPI) e.id = 'You can save up to ' + MAX_UPI + ' UPI IDs.';
      if (Object.keys(e).length) return self.setState({ fe: e });
      let upis, id = st.editId; const nu = { id: uid };
      if (id) {
        const prev = st.upis.find(function (u) { return u.key === id; });
        nu.key = id; nu.verified = prev && prev.id.toLowerCase() === uid.toLowerCase() ? prev.verified : false;
        upis = st.upis.map(function (u) { return u.key === id ? nu : u; });
      } else {
        id = newId('upi', st.upis); nu.key = id; nu.verified = false; upis = st.upis.concat([nu]);
      }
      const upiSel = st.upiSel && upis.some(function (u) { return u.key === st.upiSel; }) ? st.upiSel : id;
      const kept = persist({ upis: upis, upiSel: upiSel });
      const what = st.editId ? 'UPI details updated.' : 'UPI details saved.';
      self.setState({ upis: upis, upiSel: upiSel, view: 'withdraw', wdMethod: 'UPI', editId: null, fe: {}, saved: kept ? what : what.replace('.', ' for this session.'), wdError: '' });
    };
    const editing = s.editId ? (s.view === 'bank' ? s.banks.find(function (b) { return b.key === s.editId; }) : s.upis.find(function (u) { return u.key === s.editId; })) : null;

    return {
      astroName: ASTRO.name, astroId: ASTRO.id, initials: ASTRO.initials,
      available: money(available), pending: money(r2(pendingBal)), totalEarnings: money(r2(totalEarn)),
      nextRelease: fmtD(nextRelease(NOW)),
      slices: slices, hasSlices: slices.length > 0, noSlices: slices.length === 0,
      // Popup: the hovered segment while the pointer is over the chart, otherwise the segment last clicked or tapped.
      pop: (function () {
        const k = s.hover && agg[s.hover] && agg[s.hover].net > 0 ? s.hover : s.pop;
        return k && agg[k] && agg[k].net > 0 ? { name: SVC[k].name, amt: money(r2(agg[k].net)), pct: pct(netTotal ? agg[k].net / netTotal : 0) + ' of net' } : null;
      })(),
      netTotal: money(netTotal), legend: legend, scopes: scopes, d: detail,
      months: [{ v: 'All', l: 'All Months' }].concat(months.map(function (k) { return { v: k, l: monthLabel(k) }; })),
      services: SERVICE_FILTERS.map(function (x) { return { v: x[0], l: x[1] }; }),
      statuses: [{ v: 'All', l: 'All Statuses' }].concat(statusOpts.map(function (x) { return { v: x, l: x }; })),
      month: s.month, service: s.service, status: status,
      onMonth: function (e) { self.setFilter({ month: e.target.value }); },
      onService: function (e) { self.setFilter({ service: e.target.value }); },
      onStatus: function (e) { self.setFilter({ status: e.target.value }); },
      clearFilters: function () { self.setFilter({ month: 'All', service: 'All', status: 'All' }); },
      rows: rows, empty: total === 0,
      pages: pages, page: page, totalPages: totalPages, total: total,
      rangeLabel: total === 0 ? '0' : (start + 1) + '–' + Math.min(start + pageSize, total),
      prevDisabled: page <= 1, nextDisabled: page >= totalPages,
      prev: function () { if (page > 1) self.setState({ page: page - 1 }); },
      next: function () { if (page < totalPages) self.setState({ page: page + 1 }); },
      pdfUrl: this._pdfUrl, pdfName: pdfName,
      modal: s.modal, form: s.modal && !s.wdDone && s.view === 'withdraw', done: s.modal && !!s.wdDone,
      bankView: s.modal && !s.wdDone && s.view === 'bank', upiView: s.modal && !s.wdDone && s.view === 'upi',
      modalTitle: s.view === 'bank' ? (s.editId ? 'Edit bank details' : 'Add bank details') : s.view === 'upi' ? (s.editId ? 'Edit UPI details' : 'Add UPI details') : 'Withdraw earnings',
      wdDone: s.wdDone || {},
      openModal: function () { self.setState({ modal: true, view: 'withdraw', wdDone: null, wdError: '', wdAmount: '', saved: '', fe: {} }); },
      closeModal: function () { self.setState({ modal: false, view: 'withdraw', wdDone: null, wdError: '', saved: '', fe: {} }); },
      backToWithdraw: function () { self.setState({ view: 'withdraw', fe: {} }); },
      stop: function (e) { e.stopPropagation(); },
      withdrawable: money(withdrawable), canWithdraw: withdrawable > 0, cannotWithdraw: withdrawable <= 0,
      wdAmount: s.wdAmount, wdError: s.wdError, hasError: !!s.wdError,
      hasSaved: !!s.saved && s.view === 'withdraw', savedMsg: s.saved,
      onAmount: function (e) { self.setState({ wdAmount: e.target.value, wdError: '' }); },
      fillAll: function () { self.setState({ wdAmount: String(withdrawable), wdError: '' }); },
      // method selector
      bankOn: s.wdMethod === 'Bank', upiOn: s.wdMethod === 'UPI',
      bankTabBg: s.wdMethod === 'Bank' ? 'var(--ew-surface)' : 'transparent', upiTabBg: s.wdMethod === 'UPI' ? 'var(--ew-surface)' : 'transparent',
      bankTabFg: s.wdMethod === 'Bank' ? 'var(--ew-navyText)' : 'var(--ew-mut)', upiTabFg: s.wdMethod === 'UPI' ? 'var(--ew-navyText)' : 'var(--ew-mut)',
      bankTabSh: s.wdMethod === 'Bank' ? '0 1px 2px rgba(27,42,74,.14)' : 'none', upiTabSh: s.wdMethod === 'UPI' ? '0 1px 2px rgba(27,42,74,.14)' : 'none',
      pickBank: function () { self.setState({ wdMethod: 'Bank', wdError: '', saved: '' }); }, pickUpi: function () { self.setState({ wdMethod: 'UPI', wdError: '', saved: '' }); },
      // saved details (masked)
      bankList: s.banks.map(function (b) { return { key: b.key, name: b.bankName, verified: !!b.verified, unverified: !b.verified, selected: b.key === s.bankSel, pick: pickBankAcct(b.key), edit: editBankOf(b.key) }; }),
      upiList: s.upis.map(function (u) { return { key: u.key, masked: maskUpi(u.id), verified: !!u.verified, unverified: !u.verified, selected: u.key === s.upiSel, pick: pickUpiAcct(u.key), edit: editUpiOf(u.key) }; }),
      noBank: s.banks.length === 0, noUpi: s.upis.length === 0, canAddUpi: s.upis.length < MAX_UPI, upiLimit: MAX_UPI,
      addBank: addBank, addUpi: addUpi,
      methodBlocked: !!methodDetails && !methodDetails.verified,
      methodMissing: !methodDetails, missingMsg: s.wdMethod === 'UPI' ? 'Add a UPI ID to withdraw by UPI Transfer.' : 'Add bank details to withdraw by Bank Transfer.',
      reqDisabled: !methodReady, reqBg: methodReady ? 'var(--ew-navy)' : 'var(--ew-disabled)',
      // bank form
      acctPh: editing && s.view === 'bank' && editing.acct ? 'Re-enter full number (ends ' + editing.acct.slice(-4) + ')' : '9–18 digits',
      bf: s.bf, bfHolder: bankField('holder'), bfBank: bankField('bankName'), bfAcct: bankField('acct'), bfAcct2: bankField('acct2'), bfIfsc: bankField('ifsc', true),
      bfSavings: function () { const e = Object.assign({}, self.state.fe); delete e.type; self.setState({ bf: Object.assign({}, self.state.bf, { type: 'Savings' }), fe: e }); },
      bfCurrent: function () { const e = Object.assign({}, self.state.fe); delete e.type; self.setState({ bf: Object.assign({}, self.state.bf, { type: 'Current' }), fe: e }); },
      isSavings: s.bf.type === 'Savings', isCurrent: s.bf.type === 'Current',
      savBorder: s.bf.type === 'Savings' ? 'var(--ew-navy)' : border('type'), curBorder: s.bf.type === 'Current' ? 'var(--ew-navy)' : border('type'),
      savBg: s.bf.type === 'Savings' ? 'var(--ew-soft)' : 'var(--ew-surface)', curBg: s.bf.type === 'Current' ? 'var(--ew-soft)' : 'var(--ew-surface)',
      eHolder: err('holder'), eBank: err('bankName'), eAcct: err('acct'), eAcct2: err('acct2'), eIfsc: err('ifsc'), eType: err('type'),
      hHolder: !!fe.holder, hBank: !!fe.bankName, hAcct: !!fe.acct, hAcct2: !!fe.acct2, hIfsc: !!fe.ifsc, hType: !!fe.type,
      bHolder: border('holder'), bBank: border('bankName'), bAcct: border('acct'), bAcct2: border('acct2'), bIfsc: border('ifsc'),
      saveBank: saveBank,
      // upi form
      uf: s.uf, ufId: upiField('id'), ufId2: upiField('id2'),
      eUpi: err('id'), eUpi2: err('id2'), hUpi: !!fe.id, hUpi2: !!fe.id2, bUpi: border('id'), bUpi2: border('id2'),
      saveUpi: saveUpi,
      submit: submit
    };
  }

  render() { return <EarningsWalletView v={this.renderVals()} />; }
}
