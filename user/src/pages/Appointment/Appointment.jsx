import React, { Component, Fragment } from "react";
import { useParams } from "react-router-dom";
import { apptHelpers } from "./appointmentData";
import "./Appointment.css";

class Appointment extends Component {
  constructor(props) {
    super(props);
    const T = this.todayIso();
    this.state = {
      screen: props.initialScreen || 'history', view: 'list', mode: 'month', anchor: T, selDate: null, filter: 'all', expanded: {},
      astroId: null, dur: null, winIdx: 0, bDate: null, bTime: null, bTimes: [], lastBatch: [], wallet: 700,
      subs: { a1: true, a2: false, a3: true, a4: false },
      newAppts: [], newId: null, error: '', dlg: null, reason: '', overrides: {}, rsId: null, preview: null, toast: '', more: false, form: { name: '', dob: '', tob: '', tobUnknown: false, pob: '', horo: '', purpose: '', notes: '' }
    };
  }

  /* Layout preview only (off by default, toggled in Tweaks): fills the completed-details areas so the layout can be reviewed. */
  previewFill(list) {
    if (!this.props.previewData) return list;
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="#F6F0DF"/><text x="160" y="105" font-size="16" text-anchor="middle" fill="#12303F" font-family="sans-serif">Layout preview image</text></svg>';
    const img = { name: 'Layout-preview.svg', type: 'Image', url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) };
    const pdf = { name: 'Layout-preview.pdf', type: 'PDF document', url: null };
    let n = 0;
    return list.map((a) => { if (a.status !== 'completed') return a; n++; return Object.assign({}, a, { notes: '[Layout preview] Astrologer notes appear here.', remedies: '[Layout preview] Remedies and guidance appear here.', attach: n === 1 ? [img, pdf] : [] }); });
  }
  allAppts() {
    const ov = this.state.overrides;
    return this.previewFill(this.baseAppts().concat(this.state.newAppts)).map((a) => ov[a.id] ? Object.assign({}, a, ov[a.id]) : a);
  }

  /* ---------- availability (prototype-generated) ---------- */
  bookedKeys() {
    const k = {}; this.allAppts().forEach((a) => { if (a.status === 'booked') k[a.astro + a.dateIso + a.time] = true; });
    return k;
  }
  slotsFor(astro, iso, dur, keys) {
    const T = this.todayIso(); const off = this.diff(iso, T);
    if (off < 0 || off > 90 || off < astro.leave) return [];
    if (astro.days.indexOf(this.parse(iso).getDay()) < 0) return [];
    const out = []; const now = this.nowMin();
    for (let t = astro.start; t + dur <= astro.end; t += dur) {
      if (off === 0 && t <= now + 30) continue;
      const taken = this.hash(astro.id + iso + t) % 100 < 32 || !!keys[astro.id + iso + t];
      out.push({ t: t, taken: taken });
    }
    return out;
  }
  firstAvail(astro) {
    const T = this.todayIso(); const keys = this.bookedKeys();
    for (let off = 0; off <= 90; off++) {
      const iso = this.add(T, off);
      for (let i = 0; i < astro.durations.length; i++) {
        if (this.slotsFor(astro, iso, astro.durations[i].min, keys).some((s) => !s.taken)) return iso;
      }
    }
    return null;
  }

  /* ---------- actions ---------- */
  matches(a, f) {
    if (f === 'all') return true;
    if (f === 'booked') return a.status === 'booked';
    if (f === 'completed') return a.status === 'completed';
    if (f === 'cancelled') return a.status === 'cancelled' || a.status === 'noshow';
    if (f === 'rescheduled') return a.resched.length > 0;
    if (f === 'refund') return !!a.refund;
    return true;
  }
  badgesFor(a) {
    const b = [];
    if (a.status === 'booked') b.push({ label: 'Booked', cls: 'badge b-booked' });
    if (a.status === 'completed') b.push({ label: 'Completed', cls: 'badge b-done' });
    if (a.status === 'cancelled') b.push({ label: 'Cancelled', cls: 'badge b-cancel' });
    if (a.status === 'noshow') b.push({ label: 'Astrologer No-show', cls: 'badge b-cancel' });
    if (a.resched.length) b.push({ label: 'Rescheduled', cls: 'badge b-resched' });
    if (a.refund) b.push({ label: a.refund.status === 'Initiated' ? 'Refund initiated' : 'Refunded', cls: 'badge b-refund' });
    return b;
  }
  firstSlotT(astro, iso, dur) {
    if (!iso) return null;
    const s = this.slotsFor(astro, iso, dur, this.bookedKeys()).find((x) => !x.taken);
    return s ? s.t : null;
  }
  enterB2(id) {
    const astro = this.astroBase().find((x) => x.id === id);
    this.setState({ screen: 'b1', rsId: null, astroId: id, dur: astro.durations[0].min, winIdx: 0, bDate: this.firstAvail(astro), bTime: null, bTimes: [], error: '' });
  }

  renderVals() {
    const st = this.state; const T = this.todayIso(); const set = (o) => this.setState(o);
    const all = this.allAppts(); const astros = this.astroBase();
    const astroOf = (id) => astros.find((x) => x.id === id);
    const filtered = all.filter((a) => this.matches(a, st.filter));
    const key = (a) => a.dateIso + String(a.time).padStart(5, '0');
    const sc = st.screen;

    /* ===== HISTORY ===== */
    const fl = [['all', 'All'], ['booked', 'Booked'], ['completed', 'Completed'], ['cancelled', 'Cancelled'], ['rescheduled', 'Rescheduled'], ['refund', 'Refund']];
    const filters = fl.map((f) => ({ label: f[1], count: all.filter((a) => this.matches(a, f[0])).length, on: st.filter === f[0], pick: () => set({ filter: f[0] }) }));
    const mode = st.mode; const anchor = st.anchor;
    const modes = [['month', 'Month'], ['week', 'Week'], ['day', 'Day']].map((m) => ({
      label: m[1], on: mode === m[0],
      pick: () => { const na = m[0] === 'day' ? (st.selDate || anchor) : anchor; set({ mode: m[0], anchor: na, selDate: m[0] === 'day' ? na : st.selDate }); }
    }));
    const nav = (dir) => {
      let a = anchor;
      if (mode === 'month') { const d = this.parse(anchor); d.setDate(1); d.setMonth(d.getMonth() + dir); a = this.iso(d); }
      else if (mode === 'week') { a = this.add(anchor, 7 * dir); } else { a = this.add(anchor, dir); }
      set({ anchor: a, selDate: mode === 'day' ? a : null });
    };
    const ad = this.parse(anchor);
    let pStart, pEnd, periodLabel;
    if (mode === 'month') { pStart = this.iso(new Date(ad.getFullYear(), ad.getMonth(), 1)); pEnd = this.iso(new Date(ad.getFullYear(), ad.getMonth() + 1, 0)); periodLabel = this.monFull()[ad.getMonth()] + ' ' + ad.getFullYear(); }
    else if (mode === 'week') { pStart = this.add(anchor, -ad.getDay()); pEnd = this.add(pStart, 6); periodLabel = this.fShort(pStart) + ' – ' + this.fShort(pEnd) + ' ' + this.parse(pEnd).getFullYear(); }
    else { pStart = anchor; pEnd = anchor; periodLabel = this.fLong(anchor); }
    const inPeriod = filtered.filter((a) => a.dateIso >= pStart && a.dateIso <= pEnd).length;
    const countLabel = inPeriod + ' appointment' + (inPeriod === 1 ? '' : 's') + ' this ' + mode;

    const byDate = {}; filtered.forEach((a) => { (byDate[a.dateIso] = byDate[a.dateIso] || []).push(a); });
    const agDate = mode === 'day' && st.view === 'cal' ? anchor : st.selDate;

    const monthCells = [];
    if (mode === 'month') {
      const first = new Date(ad.getFullYear(), ad.getMonth(), 1); const sd = first.getDay();
      const dim = new Date(ad.getFullYear(), ad.getMonth() + 1, 0).getDate(); const weeks = Math.ceil((sd + dim) / 7);
      const gs = this.add(this.iso(first), -sd);
      for (let i = 0; i < weeks * 7; i++) {
        const iso = this.add(gs, i); const d = this.parse(iso); const list = byDate[iso] || []; const out = d.getMonth() !== ad.getMonth();
        monthCells.push({
          num: d.getDate(), count: list.length, hasAppt: list.length > 0,
          sel: agDate === iso,
          cls: 'mc' + (out ? ' out' : '') + (iso === T ? ' today' : '') + (agDate === iso ? ' sel' : ''),
          aria: this.fLong(iso) + ', ' + (list.length ? list.length + ' appointment' + (list.length === 1 ? '' : 's') : 'no appointments'),
          pick: () => set(out ? { selDate: iso, anchor: iso } : { selDate: iso })
        });
      }
    }
    const weekRows = [];
    if (mode === 'week') {
      for (let i = 0; i < 7; i++) {
        const iso = this.add(pStart, i); const list = (byDate[iso] || []).slice().sort((x, y) => x.time - y.time);
        weekRows.push({
          dow: this.dow()[this.parse(iso).getDay()], date: this.fShort(iso), sel: agDate === iso,
          cls: 'wr' + (list.length ? ' has' : '') + (iso === T ? ' today' : '') + (agDate === iso ? ' sel' : ''),
          none: list.length === 0,
          chips: list.map((a) => { const c = a.status === 'booked' ? ['rgba(var(--gl),.2)', 'var(--em)'] : a.status === 'completed' ? ['rgba(var(--gn),.2)', 'var(--green)'] : ['rgba(240,120,120,.18)', 'var(--red)']; return { label: this.fTime(a.time) + ' · ' + astroOf(a.astro).name.split(' ').slice(-1)[0], bg: c[0], fg: c[1] }; }),
          aria: this.fLong(iso) + ', ' + list.length + ' appointment' + (list.length === 1 ? '' : 's'),
          pick: () => set({ selDate: iso })
        });
      }
    }

    const startResched = (a) => { const as = astroOf(a.astro); set({ screen: 'b2', rsId: a.id, astroId: a.astro, dur: a.dur, winIdx: 0, bDate: this.firstAvail(as), bTime: this.firstSlotT(as, this.firstAvail(as), a.dur), error: '' }); };
    const cardFor = (a) => {
      const as = astroOf(a.astro); const off = this.diff(a.dateIso, T); const exp = !!st.expanded[a.id];
      const upcoming = a.status === 'booked' && off >= 0;
      const rel = upcoming ? (off === 0 ? 'Today' : off === 1 ? 'Tomorrow' : 'In ' + off + ' days') : '';
      const R = a.resched; const last = R.length ? R[R.length - 1] : null;
      const isCancel = a.status === 'cancelled' || a.status === 'noshow';
      const pv = st.preview && st.preview.id === a.id ? a.attach[st.preview.idx] : null;
      const cn = a.cancel;
      return {
        id: a.id, name: as.name, init: as.init, spec: as.spec, badges: this.badgesFor(a),
        when: this.fDate(a.dateIso) + ' · ' + this.fTime(a.time), whenLabel: isCancel ? 'Original date & time' : 'Date & time',
        dur: a.dur + ' min', amount: this.money(a.amount),
        cls: 'acard' + (upcoming ? ' up' : '') + (st.newId === a.id ? ' new' : ''),
        showResched: !!last,
        reschedLine: last ? 'Rescheduled by ' + last.by + ' · was ' + this.fDate(last.from) + ', ' + this.fTime(last.fromTime) : '',
        reschedHist: R.map((r, i) => ({ by: r.by, prev: this.fDate(r.from) + ', ' + this.fTime(r.fromTime), next: i + 1 < R.length ? this.fDate(R[i + 1].from) + ', ' + this.fTime(R[i + 1].fromTime) : this.fDate(a.dateIso) + ', ' + this.fTime(a.time), hasReason: !!r.reason, reason: r.reason || '' })),
        showRel: !!rel, rel: rel, canAct: upcoming,
        reschedule: () => startResched(a),
        cancel: () => set({ dlg: { type: 'cancel', id: a.id }, reason: '' }),
        expanded: exp, btnCls: 'link' + (exp ? ' open' : ''), toggleLabel: exp ? 'Hide details' : 'View details',
        toggle: () => set({ expanded: Object.assign({}, st.expanded, { [a.id]: !st.expanded[a.id] }) }),
        bookedOn: this.fDate(a.bookedOn) + ', ' + this.fTime(a.bookedAt), payMode: a.payMode, hasPayRef: !!a.payRef, payRef: a.payRef || '',
        hasForm: !!a.form, formName: a.form ? a.form.name.trim() : '', formDob: a.form && a.form.dob ? this.fLong(a.form.dob) : '', formPurpose: a.form ? a.form.purpose : '',
        isBooked: upcoming, isDone: a.status === 'completed', isCancel: isCancel,
        cancelStatus: a.status === 'noshow' ? 'Astrologer no-show' : 'Cancelled',
        hasCancelBy: !!(cn && cn.by), cancelBy: cn ? cn.by : '', hasCancelOn: !!cn, cancelOn: cn ? this.fDate(cn.atIso) + ', ' + this.fTime(cn.atTime) : '',
        hasCancelReason: !!(cn && cn.reason), cancelReason: cn && cn.reason ? cn.reason : '',
        hasRefund: !!a.refund, refundStatus: a.refund ? (a.refund.status === 'Initiated' ? 'Refund initiated' : 'Refunded') : '', refundAmount: a.refund ? this.money(a.refund.amount) : '', hasRefundRef: !!(a.refund && a.refund.ref), refundRef: a.refund && a.refund.ref ? a.refund.ref : '',
        hasNotes: !!a.notes, noNotes: !a.notes, notes: a.notes || '',
        hasRemedies: !!a.remedies, noRemedies: !a.remedies, remedies: a.remedies || '',
        noAttach: a.attach.length === 0,
        attach: a.attach.map((x, i) => { const open = !!(st.preview && st.preview.id === a.id && st.preview.idx === i); return { name: x.name, type: x.type, url: x.url || '', hasUrl: !!x.url, noUrl: !x.url, open: open, viewLabel: open ? 'Close preview' : 'View', view: () => set({ preview: open ? null : { id: a.id, idx: i } }) }; }),
        hasPreview: !!pv, prevName: pv ? pv.name : '', prevUrl: pv && pv.url ? pv.url : '', prevImage: !!(pv && pv.url && pv.type === 'Image'), prevOther: !!(pv && !(pv.url && pv.type === 'Image'))
      };
    };

    const sections = []; let noResults = false;
    if (st.view === 'list') {
      let list = filtered; if (st.selDate) list = list.filter((a) => a.dateIso === st.selDate);
      const up = list.filter((a) => a.status === 'booked').sort((x, y) => key(x).localeCompare(key(y)));
      const past = list.filter((a) => a.status !== 'booked').sort((x, y) => key(y).localeCompare(key(x)));
      if (up.length) sections.push({ title: 'Upcoming', count: up.length, cards: up.map(cardFor), isEmpty: false, emptyMsg: '' });
      if (past.length) sections.push({ title: 'Past', count: past.length, cards: past.map(cardFor), isEmpty: false, emptyMsg: '' });
      noResults = list.length === 0;
    } else if (agDate) {
      const list = (byDate[agDate] || []).slice().sort((x, y) => x.time - y.time);
      sections.push({ title: this.fLong(agDate), count: list.length, cards: list.map(cardFor), isEmpty: list.length === 0, emptyMsg: 'No appointments on this date' + (st.filter === 'all' ? '.' : ' for this status.') });
    }
    const listN = (st.selDate ? filtered.filter((a) => a.dateIso === st.selDate) : filtered).length;

    /* ===== BOOKING ===== */
    const selA = astroOf(st.astroId) || astros[0];
    const curDur = selA.durations.find((d) => d.min === st.dur) || selA.durations[0];
    const keys = this.bookedKeys();
    const first = this.firstAvail(selA) || T;
    const maxDate = this.add(T, 90);
    const winStart = this.add(first, 7 * st.winIdx);
    const availCount = (iso) => this.slotsFor(selA, iso, curDur.min, keys).filter((s) => !s.taken).length;
    const firstWithSlots = (from) => { for (let i = 0; i < 7; i++) { const iso = this.add(from, i); if (iso > maxDate) break; if (availCount(iso) > 0) return iso; } return null; };
    const moveWin = (dir) => {
      const ni = st.winIdx + dir; const ws = this.add(first, 7 * ni);
      const nd = firstWithSlots(ws); set({ winIdx: ni, bDate: nd, bTime: st.rsId ? this.firstSlotT(selA, nd, curDur.min) : null, bTimes: [] });
    };
    const days = [];
    for (let i = 0; i < 7; i++) {
      const iso = this.add(winStart, i); if (iso > maxDate) break;
      const c = availCount(iso); const d = this.parse(iso);
      days.push({
        dow: this.dow()[d.getDay()], num: d.getDate(), count: c ? c + ' slots' : 'None', disabled: c === 0, sel: st.bDate === iso,
        cls: 'day' + (st.bDate === iso ? ' sel' : ''),
        aria: this.fLong(iso) + ', ' + (c ? c + ' slots available' : 'no slots'),
        pick: () => set({ bDate: iso, bTime: st.rsId ? this.firstSlotT(selA, iso, curDur.min) : null, bTimes: [] })
      });
    }
    const winEnd = days.length ? this.add(winStart, days.length - 1) : winStart;
    const MAXD = 4;
    const exN = st.rsId || !st.bDate ? 0 : this.allAppts().filter((a) => a.status === 'booked' && a.dateIso === st.bDate).length;
    const selTimes = st.rsId ? (st.bTime !== null ? [st.bTime] : []) : st.bTimes.slice().sort((x, y) => x - y);
    const hasSel = !!st.bDate && selTimes.length > 0;
    const limitReached = !st.rsId && exN + selTimes.length >= MAXD;
    const toggleSlot = (t) => {
      if (st.rsId) { set({ bTime: t }); return; }
      if (st.bTimes.indexOf(t) >= 0) { set({ bTimes: st.bTimes.filter((x) => x !== t) }); return; }
      if (exN + st.bTimes.length >= MAXD) return;
      set({ bTimes: st.bTimes.concat([t]) });
    };
    const quotaBoxes = [0, 1, 2, 3].map((i) => ({ cls: 'qb' + (i < exN + selTimes.length ? ' on' : '') }));
    const quotaText = (exN + selTimes.length) + ' of ' + MAXD + ' slots used on ' + (st.bDate ? this.fShort(st.bDate) : 'this day') + (exN ? ' (' + exN + ' already booked)' : '') + (limitReached ? ' · Daily limit reached' : '');
    const slotList = st.bDate ? this.slotsFor(selA, st.bDate, curDur.min, keys) : [];
    const slots = slotList.map((s) => ({
      label: this.fTime(s.t), disabled: s.taken || (limitReached && selTimes.indexOf(s.t) < 0), sel: selTimes.indexOf(s.t) >= 0,
      cls: 'slot' + (selTimes.indexOf(s.t) >= 0 ? ' sel' : ''),
      aria: this.fTime(s.t) + (s.taken ? ', unavailable' : selTimes.indexOf(s.t) >= 0 ? ', selected' : limitReached ? ', daily limit reached' : ', available'),
      pick: () => toggleSlot(s.t)
    }));
    const durOpts = selA.durations.map((d) => ({
      min: d.min + ' min', price: this.money(d.price), on: d.min === curDur.min,
      pick: () => { const ok = st.bDate && this.slotsFor(selA, st.bDate, d.min, keys).some((s) => !s.taken); const nd = ok ? st.bDate : firstWithSlotsFor(d.min); set({ dur: d.min, bDate: nd, bTime: st.rsId ? this.firstSlotT(selA, nd, d.min) : null, bTimes: [] }); }
    }));
    const firstWithSlotsFor = (m) => { for (let i = 0; i < 7; i++) { const iso = this.add(winStart, i); if (iso > maxDate) break; if (this.slotsFor(selA, iso, m, keys).some((s) => !s.taken)) return iso; } return null; };

    const mkSteps = (cur) => ['Astrologer', 'Date & time', 'Your details', 'Review & pay'].map((l, i) => ({ n: i + 1, label: l, cls: 'step' + (i === cur ? ' on' : i < cur ? ' done' : '') }));

    const astroCards = astros.map((a) => {
      const sub = !!st.subs[a.id]; const f = this.firstAvail(a); const d0 = a.durations[0].min; let txt = 'No slots in the next 90 days';
      if (f) { let n = 0; for (let i = 0; i < 7; i++) { n += this.slotsFor(a, this.add(f, i), d0, keys).filter((s) => !s.taken).length; } txt = 'Next available ' + this.fDate(f) + ' · ' + n + ' slots that week'; }
      return {
        id: a.id, name: a.name, init: a.init, spec: a.spec, rating: a.rating, following: a.following,
        cardCls: 'apcard acc' + (sub && st.astroId === a.id ? ' selpick' : ''),
        subLabel: sub ? 'Subscribed' : 'Not subscribed', subCls: sub ? 'badge b-sub' : 'badge b-nosub',
        durs: a.durations.map((d) => ({ label: d.min + ' min · ' + this.money(d.price) })), availText: txt,
        btnLabel: sub ? (st.astroId === a.id ? 'Selected' : 'Select astrologer') : 'Subscribe to book', btnCls: sub ? 'btn btn-primary' : 'btn btn-gold',
        pick: () => { if (sub) { this.enterB2(a.id); } else { set({ screen: 'sub', astroId: a.id }); } }
      };
    });

    const unit = curDur.price; const price = unit * Math.max(1, selTimes.length); const short = Math.max(0, price - st.wallet);
    const confirm = () => {
      const keysNow = this.bookedKeys();
      const ok = st.bDate && selTimes.length > 0 && selTimes.every((t) => this.slotsFor(selA, st.bDate, curDur.min, keysNow).some((x) => x.t === t && !x.taken));
      if (!ok) { set({ error: 'A selected slot is no longer available.' }); return; }
      if (exN + selTimes.length > MAXD) { set({ error: 'You can book a maximum of 4 slots per day.' }); return; }
      const made = selTimes.map((t, i) => ({ id: 'AC-APT-' + (2100 + st.newAppts.length + i + 1), astro: selA.id, dateIso: st.bDate, time: t, dur: curDur.min, status: 'booked', resched: [], cancel: null, refund: null, amount: unit, bookedOn: T, bookedAt: this.nowMin(), payMode: 'Wallet', payRef: null, notes: null, remedies: null, attach: [], form: Object.assign({}, st.form) }));
      set({ screen: 'success', newAppts: st.newAppts.concat(made), wallet: st.wallet - price, newId: made[0].id, lastBatch: made.map((m) => m.id), error: '' });
    };
    const dlgA = st.dlg ? (st.dlg.type === 'cancel' ? all.find((x) => x.id === st.dlg.id) : all.find((x) => x.id === st.rsId)) : null;
    const dlgIsCancel = !!(st.dlg && st.dlg.type === 'cancel');
    const dlgRows = dlgA ? (dlgIsCancel
      ? [{ k: 'Astrologer', v: astroOf(dlgA.astro).name }, { k: 'Date & time', v: this.fDate(dlgA.dateIso) + ', ' + this.fTime(dlgA.time) }, { k: 'Duration', v: dlgA.dur + ' min' }]
      : [{ k: 'Astrologer', v: astroOf(dlgA.astro).name }, { k: 'Previous', v: this.fDate(dlgA.dateIso) + ', ' + this.fTime(dlgA.time) }, { k: 'New', v: st.bDate && st.bTime !== null ? this.fDate(st.bDate) + ', ' + this.fTime(st.bTime) : '' }, { k: 'Duration', v: dlgA.dur + ' min' }]) : [];
    const patch = (id, p) => Object.assign({}, st.overrides, { [id]: Object.assign({}, st.overrides[id] || {}, p) });
    const dlgConfirm = () => {
      if (!dlgA) return; const reason = st.reason.trim() || null;
      if (dlgIsCancel) {
        set({ overrides: patch(dlgA.id, { status: 'cancelled', cancel: { by: 'You', atIso: T, atTime: this.nowMin(), reason: reason } }), dlg: null, reason: '', toast: 'Appointment cancelled.', expanded: Object.assign({}, st.expanded, { [dlgA.id]: true }) });
      } else {
        set({ overrides: patch(dlgA.id, { dateIso: st.bDate, time: st.bTime, resched: dlgA.resched.concat([{ by: 'You', from: dlgA.dateIso, fromTime: dlgA.time, reason: reason }]) }), dlg: null, reason: '', screen: 'history', rsId: null, newId: dlgA.id, toast: 'Appointment rescheduled.', expanded: Object.assign({}, st.expanded, { [dlgA.id]: true }) });
      }
    };
    const F = st.form; const setF = (o) => set({ form: Object.assign({}, F, o) });
    const detOk = F.name.trim() && F.dob && F.purpose;
    const more = st.more || !!(F.tob || F.tobUnknown || F.pob || F.horo);
    const purposes = ['Career', 'Marriage & relationships', 'Finance', 'Health', 'Education', 'Family', 'Other'].map((l) => ({ label: l, on: F.purpose === l, pick: () => setF({ purpose: l }) }));
    const fmtDob = F.dob ? this.fLong(F.dob) : '';
    const batch = st.newAppts.filter((a) => st.lastBatch.indexOf(a.id) >= 0);
    const lastNew = batch.length ? batch[0] : null;
    const lastAs = lastNew ? astroOf(lastNew.astro) : selA;

    return {
      isHistory: sc === 'history', wrapCls: (sc === 'b1' || sc === 'b2' || sc === 'bd' || sc === 'b3') ? 'wrap wide' : 'wrap', twoCls: '', expCls: st.rsId ? '' : 'apcard exp', chooseAnother: () => set({ astroId: null, bDate: null, bTime: null, bTimes: [], error: '' }), noAstro: !(!!st.astroId && (!!st.rsId || !!st.subs[st.astroId])), isBook: sc === 'b1' || sc === 'b2', isDet: sc === 'bd', isReview: sc === 'b3', isFlow: sc === 'bd' || sc === 'b3',
      flipCls: sc === 'b3' ? 'flip on' : 'flip', frontCls: sc === 'b3' ? 'face front off' : 'face front', backCls: sc === 'b3' ? 'face back' : 'face back off',
      flowTitle: sc === 'b3' ? 'Review & pay' : 'Your details', flowSteps: mkSteps(sc === 'b3' ? 3 : 2), stepsA: mkSteps(!!st.astroId && (!!st.rsId || !!st.subs[st.astroId]) ? 1 : 0),
      backFlow: () => set(sc === 'b3' ? { screen: 'bd', error: '' } : { screen: 'b1' }), backFlowLabel: sc === 'b3' ? 'Back to your details' : 'Back to astrologer, date and time', isResched: !!st.rsId, hasAstro: !!st.astroId && (!!st.rsId || !!st.subs[st.astroId]), isSuccess: sc === 'success', isSub: sc === 'sub',
      filters: filters, modes: modes,
      calOn: st.view === 'cal', listOn: st.view === 'list', showCal: st.view === 'cal', showList: st.view === 'list',
      setCal: () => set({ view: 'cal', selDate: st.mode === 'day' ? anchor : st.selDate }),
      setList: () => set({ view: 'list' }),
      showMonth: mode === 'month', showWeek: mode === 'week',
      prevPeriod: () => nav(-1), nextPeriod: () => nav(1),
      goToday: () => set({ anchor: T, selDate: T }),
      periodLabel: periodLabel, countLabel: countLabel, listCount: listN + ' appointment' + (listN === 1 ? '' : 's'),
      dowNames: this.dow().map((n) => ({ n: n })), monthCells: monthCells, weekRows: weekRows,
      showDateChip: st.view === 'list' && !!st.selDate, dateChipLabel: st.selDate ? this.fLong(st.selDate) : '', clearDate: () => set({ selDate: null }),
      calHint: st.view === 'cal' && !agDate, sections: sections, noResults: noResults,
      resetFilters: () => set({ filter: 'all', selDate: null }),

      toHistory: () => set({ screen: 'history' }),
      toB1: () => set({ screen: 'b1' }),
      toB2: () => set({ screen: 'b2', error: '' }),
      toB3: () => set({ screen: 'b3', error: '' }), toDet: () => set({ screen: 'bd', error: '' }),
      steps1: mkSteps(0), steps2: mkSteps(1), stepsD: mkSteps(2), steps3: mkSteps(3),
      astroCards: astroCards,
      selName: selA.name, selInit: selA.init, selSpec: selA.spec,
      durOpts: durOpts, days: days,
      winLabel: this.fDate(winStart) + ' – ' + this.fDate(winEnd),
      prevDisabled: st.winIdx === 0, nextDisabled: this.add(winStart, 7) > maxDate,
      prevWin: () => moveWin(-1), nextWin: () => moveWin(1),
      rangeNote: '7-day window · bookable up to ' + this.fLong(maxDate) + ' (90 days)',
      hasSlots: slots.length > 0, noSlots: !!st.bDate && slots.length === 0 || !st.bDate,
      slots: slots,
      slotNote: st.bDate ? 'Slots for ' + selA.name + ' · ' + curDur.min + ' min · ' + this.fLong(st.bDate) : 'Select an available date.',
      pickSummary: hasSel ? this.fDate(st.bDate) + ' · ' + selTimes.map((t) => this.fTime(t)).join(', ') + ' · ' + curDur.min + ' min' + (st.rsId ? '' : ' · ' + this.money(price)) : 'Select a date and time slot',
      contDisabled: !hasSel,

      rvDate: st.bDate ? this.fLong(st.bDate) : '', rvTime: selTimes.map((t) => this.fTime(t)).join(', '), rvDur: curDur.min + ' min', rvPrice: this.money(price),
      walletText: this.money(st.wallet), insufficient: st.wallet < price, shortText: this.money(short),
      topup: () => set({ wallet: st.wallet + short }),
      hasError: !!st.error, errorText: st.error, confirm: confirm,

      okName: lastAs.name, okWhen: lastNew ? this.fDate(lastNew.dateIso) + ' · ' + batch.map((a) => this.fTime(a.time)).join(', ') : '', okDur: lastNew ? lastNew.dur + ' min' + (batch.length > 1 ? ' × ' + batch.length : '') : '', okAmount: lastNew ? this.money(batch.reduce((n, a) => n + a.amount, 0)) : '', okId: lastNew ? batch.map((a) => a.id).join(', ') : '',
      viewAppointments: () => set({ screen: 'history', view: 'list', filter: 'all', selDate: null, expanded: Object.assign({}, st.expanded, { [st.newId]: true }) }),
      completeSub: () => { set({ subs: Object.assign({}, st.subs, { [st.astroId]: true }) }); this.enterB2(st.astroId); },

      todayIso: T, fName: F.name, fDob: F.dob, fTob: F.tob, fPob: F.pob, fNotes: F.notes, fTobUnknown: F.tobUnknown, fHoroName: F.horo, hasHoro: !!F.horo,
      onName: (e) => setF({ name: e.target.value }), onDob: (e) => setF({ dob: e.target.value }), onTob: (e) => setF({ tob: e.target.value }),
      onPob: (e) => setF({ pob: e.target.value }), onNotes: (e) => setF({ notes: e.target.value }),
      onTobUnknown: (e) => setF({ tobUnknown: e.target.checked, tob: e.target.checked ? '' : F.tob }),
      onHoro: (e) => { const f = e.target.files && e.target.files[0]; setF({ horo: f ? f.name : '' }); }, clearHoro: () => setF({ horo: '' }),
      showMore: more, toggleMore: () => set({ more: !more }), moreLabel: more ? 'Hide birth time, place and horoscope' : '+ Add birth time, place or horoscope (optional)',
      hasRvTob: !!(F.tob || F.tobUnknown), hasRvPob: !!F.pob.trim(),
      purposes: purposes, detDisabled: !detOk, detHint: detOk ? 'Details look good.' : 'Add your name, date of birth and purpose.',
      rvName: F.name.trim(), rvDob: fmtDob, rvTob: F.tobUnknown ? 'Not known' : F.tob ? F.tob : 'Not provided', rvPob: F.pob.trim(), rvHoro: F.horo || 'Not attached', rvPurpose: F.purpose,
      showTabs: sc === 'history' || ((sc === 'b1' || sc === 'bd' || sc === 'b3' || sc === 'success' || sc === 'sub') && !st.rsId),
      tabHist: sc === 'history', tabBook: sc !== 'history',
      tabToBook: () => { if (st.screen === 'history') set({ screen: 'b1', rsId: null, astroId: null, dur: null, winIdx: 0, bDate: null, bTime: null, bTimes: [], error: '' }); },
      hasToast: !!st.toast, toast: st.toast, clearToast: () => set({ toast: '' }),
      notResched: !st.rsId, b2Title: st.rsId ? 'Reschedule appointment' : 'Book an Appointment',
      backB2: () => { if (st.rsId) { set({ screen: 'history', rsId: null }); } else { set({ screen: 'b1' }); } },
      footLabel: st.rsId ? 'Review reschedule' : 'Continue',
      footDisabled: !hasSel,
      footAction: () => { if (st.rsId) { set({ dlg: { type: 'resched' }, reason: '' }); } else { set({ screen: 'bd', error: '' }); } },
      footHint: hasSel ? this.fDate(st.bDate) + ' · ' + selTimes.map((t) => this.fTime(t)).join(', ') + ' · ' + curDur.min + ' min' + (st.rsId ? '' : ' · ' + this.money(price)) : 'Select a date and time slot',
      payLabel: 'Confirm & Pay ' + this.money(price), payDisabled: !detOk || st.wallet < price,
      payHint: st.error ? st.error : st.wallet < price ? 'Add money to your wallet to pay.' : 'Slot availability is re-checked when you confirm.',
      quotaBoxes: quotaBoxes, quotaText: quotaText,
      contLabel: st.rsId ? 'Review reschedule' : 'Continue to Your Details',
      contAction: () => { if (st.rsId) { set({ dlg: { type: 'resched' }, reason: '' }); } else { set({ screen: 'bd', error: '' }); } },
      showDlg: !!st.dlg, reason: st.reason, onReason: (e) => set({ reason: e.target.value }),
      dlgClose: () => set({ dlg: null }),
      dlgTitle: dlgIsCancel ? 'Cancel this appointment?' : 'Confirm reschedule',
      dlgRows: dlgRows, dlgNote: dlgIsCancel ? 'Refund, if applicable, follows the existing cancellation policy.' : 'Your astrologer is notified of the new time.',
      dlgReasonLabel: dlgIsCancel ? 'Reason for cancelling (optional)' : 'Reason for rescheduling (optional)',
      dlgKeep: dlgIsCancel ? 'Keep appointment' : 'Go back',
      dlgBtnCls: dlgIsCancel ? 'btn btn-danger' : 'btn btn-gold',
      dlgConfirmLabel: dlgIsCancel ? 'Yes, cancel appointment' : 'Confirm reschedule',
      dlgConfirm: dlgConfirm
    };
  }
}

Object.assign(Appointment.prototype, apptHelpers);

Appointment.prototype.render = function render() {
  const v = this.renderVals();
  return (
<>


<div className="apx">

<main className={v.wrapCls}>

{v.showTabs ? (<>
  <div className="tabs" role="tablist" aria-label="Appointment sections">
    <button className="tab" role="tab" aria-selected={v.tabHist} onClick={v.toHistory}>Appointment History</button>
    <button className="tab" role="tab" aria-selected={v.tabBook} onClick={v.tabToBook}>Book an Appointment</button>
  </div>
</>) : null}


{v.isHistory ? (<>
<section aria-label="Appointment History">
  <h1 className="vh">Appointment History</h1>
  {v.hasToast ? (<><div className="toast" role="status"><span>{v.toast}</span><button className="clr" aria-label="Dismiss" onClick={v.clearToast}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div></>) : null}

  <div className="filters" role="group" aria-label="Filter by status">
    {v.filters.map((f, f_i) => (<Fragment key={f_i}>
      <button className="apchip" aria-pressed={f.on} onClick={f.pick}>{f.label}<span className="cnt">{f.count}</span></button>
    </Fragment>))}
  </div>

  <div className="toolbar">
    <div className="seg" role="group" aria-label="Calendar or list view">
      <button aria-pressed={v.calOn} onClick={v.setCal}>Calendar</button>
      <button aria-pressed={v.listOn} onClick={v.setList}>List</button>
    </div>
    {v.showCal ? (<>
      <div className="seg" role="group" aria-label="Calendar range">
        {v.modes.map((m, m_i) => (<Fragment key={m_i}>
          <button aria-pressed={m.on} onClick={m.pick}>{m.label}</button>
        </Fragment>))}
      </div>
    </>) : null}
    {v.showList ? (<>
      <span className="muted sm">{v.listCount}</span>
    </>) : null}
  </div>

  {v.showCal ? (<>
    <div className="calnav">
      <button className="iconbtn" aria-label="Previous" onClick={v.prevPeriod}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg></button>
      <div className="calnav-label"><strong>{v.periodLabel}</strong><span className="muted sm">{v.countLabel}</span></div>
      <button className="iconbtn" aria-label="Next" onClick={v.nextPeriod}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"></path></svg></button>
      <button className="btn btn-ghost" onClick={v.goToday}>Today</button>
    </div>

    {v.showMonth ? (<>
      <div className="apcard">
        <div className="mgrid mhead">{v.dowNames.map((d, d_i) => (<Fragment key={d_i}><div>{d.n}</div></Fragment>))}</div>
        <div className="mgrid">
          {v.monthCells.map((cell, cell_i) => (<Fragment key={cell_i}>
            <button className={cell.cls} aria-label={cell.aria} aria-pressed={cell.sel} onClick={cell.pick}><span>{cell.num}</span>{cell.hasAppt ? (<><span className="appill">{cell.count}</span></>) : null}</button>
          </Fragment>))}
        </div>
        <div className="legend"><span className="appill">2</span> Appointments on that date<span>Gold outline: today</span></div>
      </div>
    </>) : null}

    {v.showWeek ? (<>
      <div className="week">
        {v.weekRows.map((w, w_i) => (<Fragment key={w_i}>
          <button className={w.cls} aria-label={w.aria} aria-pressed={w.sel} onClick={w.pick}>
            <span className="wday"><b>{w.dow}</b><span>{w.date}</span></span>
            <span className="wchips">
              {w.chips.map((ch, ch_i) => (<Fragment key={ch_i}><span className="wchip" style={{ background: ch.bg, color: ch.fg }}>{ch.label}</span></Fragment>))}
              {w.none ? (<><span className="muted">No appointments</span></>) : null}
            </span>
          </button>
        </Fragment>))}
      </div>
    </>) : null}
    <div className="sticky-gap"></div>
  </>) : null}

  {v.showDateChip ? (<>
    <div className="datechip"><span>Date: {v.dateChipLabel}</span><button className="clr" aria-label="Clear date filter" onClick={v.clearDate}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div>
  </>) : null}
  {v.calHint ? (<><p className="hint">Select a date to see its appointments.</p></>) : null}

  {v.sections.map((sec, sec_i) => (<Fragment key={sec_i}>
    <div className="sec">
      <h2 className="sec-title">{sec.title}<span className="cnt">{sec.count}</span></h2>
      {sec.isEmpty ? (<><p className="hint">{sec.emptyMsg}</p></>) : null}
      <div className="cards">
        {sec.cards.map((c, c_i) => (<Fragment key={c_i}>
          <article className={c.cls}>
            <div className="c-top">
              <div className="avatar" aria-hidden="true">{c.init}</div>
              <div className="c-id"><div className="c-name">{c.name}</div><div className="muted sm">{c.spec}</div></div>
              <div className="c-badges">{c.badges.map((b, b_i) => (<Fragment key={b_i}><span className={b.cls}>{b.label}</span></Fragment>))}</div>
            </div>
            <div className="meta">
              <span><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 10h18M8 3v4M16 3v4"></path></svg>{c.when}</span>
              <span><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>{c.dur}</span>
              <span><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"></path></svg>Audio Call</span>
              <span>ID {c.id}</span>
              <span><b>Paid {c.amount}</b></span>
            </div>
            {c.showResched ? (<><div className="resched">{c.reschedLine}</div></>) : null}
            <div className="c-foot">
              {c.showRel ? (<><span className="rel">{c.rel}</span></>) : null}
              <div className="cacts">
                {c.canAct ? (<>
                  <button className="btn btn-ghost sm" onClick={c.reschedule}>Reschedule</button>
                  <button className="btn btn-danger sm" onClick={c.cancel}>Cancel</button>
                </>) : null}
                <button className={c.btnCls} aria-expanded={c.expanded} onClick={c.toggle}>{c.toggleLabel}<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg></button>
              </div>
            </div>
            {c.expanded ? (<>
              <div className="detail">
                <dl className="dl">
                  <div><dt>Appointment ID</dt><dd>{c.id}</dd></div>
                  <div><dt>Astrologer</dt><dd>{c.name} · {c.spec}</dd></div>
                  <div><dt>{c.whenLabel}</dt><dd>{c.when}</dd></div>
                  <div><dt>Duration</dt><dd>{c.dur}</dd></div>
                  <div><dt>Consultation mode</dt><dd>Audio / Voice Call</dd></div>
                  <div><dt>Booked on</dt><dd>{c.bookedOn}</dd></div>
                  <div><dt>Payment mode</dt><dd>{c.payMode}</dd></div>
                  {c.hasPayRef ? (<><div><dt>Payment reference ID</dt><dd>{c.payRef}</dd></div></>) : null}
                  {c.hasForm ? (<><div><dt>Booked for</dt><dd>{c.formName}</dd></div><div><dt>Date of birth</dt><dd>{c.formDob}</dd></div><div><dt>Purpose</dt><dd>{c.formPurpose}</dd></div></>) : null}
                </dl>

                {c.isBooked ? (<>
                  <div className="infobox"><div className="notes-h">Call status</div><div className="sm">Scheduled. Your astrologer starts the call at the appointment time.</div></div>
                </>) : null}

                {c.showResched ? (<>
                  <div className="infobox">
                    <div className="notes-h">Reschedule</div>
                    {c.reschedHist.map((h, h_i) => (<Fragment key={h_i}>
                      <dl className="dl">
                        <div><dt>Rescheduled by</dt><dd>{h.by}</dd></div>
                        <div><dt>Previous date &amp; time</dt><dd>{h.prev}</dd></div>
                        <div><dt>Updated date &amp; time</dt><dd>{h.next}</dd></div>
                        {h.hasReason ? (<><div><dt>Reason</dt><dd>{h.reason}</dd></div></>) : null}
                      </dl>
                    </Fragment>))}
                  </div>
                </>) : null}

                {c.isCancel ? (<>
                  <div className="infobox">
                    <div className="notes-h">Cancellation</div>
                    <dl className="dl">
                      <div><dt>Status</dt><dd>{c.cancelStatus}</dd></div>
                      {c.hasCancelBy ? (<><div><dt>Cancelled by</dt><dd>{c.cancelBy}</dd></div></>) : null}
                      {c.hasCancelOn ? (<><div><dt>Cancelled on</dt><dd>{c.cancelOn}</dd></div></>) : null}
                      {c.hasCancelReason ? (<><div><dt>Reason</dt><dd>{c.cancelReason}</dd></div></>) : null}
                    </dl>
                    {c.hasRefund ? (<>
                      <dl className="dl">
                        <div><dt>Refund status</dt><dd>{c.refundStatus}</dd></div>
                        <div><dt>Refund amount</dt><dd>{c.refundAmount}</dd></div>
                        {c.hasRefundRef ? (<><div><dt>Refund reference</dt><dd>{c.refundRef}</dd></div></>) : null}
                      </dl>
                    </>) : null}
                  </div>
                </>) : null}

                {c.isDone ? (<>
                  <div className="notes">
                    <div className="notes-h"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 018 0v3"></path></svg>Astrologer Consultation Notes</div>
                    <div className="muted sm">Notes, remedies and guidance shared by your astrologer. Only you can see them.</div>
                    {c.hasNotes ? (<><p className="notes-body">{c.notes}</p></>) : null}
                    {c.noNotes ? (<><p className="empty">No consultation notes were shared for this appointment.</p></>) : null}
                  </div>
                  <div className="notes">
                    <div className="notes-h">Remedies / Guidance</div>
                    {c.hasRemedies ? (<><p className="notes-body">{c.remedies}</p></>) : null}
                    {c.noRemedies ? (<><p className="empty">No remedies or guidance were shared for this appointment.</p></>) : null}
                  </div>
                  <div className="notes">
                    <div className="notes-h"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.5l-8.5 8.5a5.5 5.5 0 01-8-7.5L13 5a3.7 3.7 0 015.3 5.2L9.8 18.7a1.8 1.8 0 01-2.6-2.5L15 8.4"></path></svg>Attachments</div>
                    {c.noAttach ? (<><p className="empty">No attachments were shared for this appointment.</p></>) : null}
                    {c.attach.map((at, at_i) => (<Fragment key={at_i}>
                      <div className="att2">
                        <span className="t"><b>{at.name}</b><i>{at.type}</i></span>
                        <button className="btn btn-ghost sm" aria-expanded={at.open} onClick={at.view}>{at.viewLabel}</button>
                        {at.hasUrl ? (<><a className="btn btn-primary sm" href={at.url} download={at.name}>Download</a></>) : null}
                        {at.noUrl ? (<><button className="btn btn-primary sm" disabled={true}>Download unavailable</button></>) : null}
                      </div>
                    </Fragment>))}
                    {c.hasPreview ? (<>
                      <div className="prev">
                        {c.prevImage ? (<><img src={c.prevUrl} alt={c.prevName} /></>) : null}
                        {c.prevOther ? (<><div className="placeholder" style={{ minHeight: "200px" }}>{c.prevName}: the existing viewer renders this file here.</div></>) : null}
                      </div>
                    </>) : null}
                  </div>
                </>) : null}
              </div>
            </>) : null}
          </article>
        </Fragment>))}
      </div>
    </div>
  </Fragment>))}

  {v.noResults ? (<>
    <div className="apcard center"><p style={{ margin: "0 0 10px" }}><b>No appointments match.</b></p><p className="muted" style={{ margin: "0 0 12px" }}>Try another status or clear the date.</p><button className="btn btn-ghost" onClick={v.resetFilters}>Show all appointments</button></div>
  </>) : null}
</section>
</>) : null}


{v.isBook ? (<>
<section aria-label="Book an appointment">
  <h1 className="vh">Book an Appointment</h1>
  {v.isResched ? (<>
  <div className="pagehead">
    <button className="iconbtn" aria-label="Back" onClick={v.backB2}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg></button>
    <h2 className="pt">Reschedule appointment</h2>
  </div>
    <div className="apcard block">
    <div className="c-top">
      <div className="avatar" aria-hidden="true">{v.selInit}</div>
      <div className="c-id"><div className="c-name">{v.selName}</div><div className="muted sm">{v.selSpec}</div></div>
      <span className="badge b-sub">Subscribed</span>
      {v.notResched ? (<><button className="btn btn-ghost sm" onClick={v.toB1}>Change</button></>) : null}
    </div>
  </div>

  </>) : null}

  {v.notResched ? (<><ol className="steps" aria-label="Booking steps">
    {v.stepsA.map((s, s_i) => (<Fragment key={s_i}><li className={s.cls}><i>{s.n}</i>{s.label}</li></Fragment>))}
  </ol></>) : null}
  <div className={v.twoCls}>
  {v.noAstro ? (<>
  <div className="block">
    <h2 className="h2"><span className="num">1</span>Choose astrologer</h2>
  <div className="note"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: "1px" }}><circle cx="12" cy="12" r="9"></circle><path d="M12 8h.01M11 12h1v5h1"></path></svg><span>Appointments can be booked only with astrologers you have subscribed to. Following an astrologer does not unlock booking.</span></div>
  <div className="agrid">
    {v.astroCards.map((a, a_i) => (<Fragment key={a_i}>
      <article className={a.cardCls}>
        <div className="c-top">
          <div className="avatar" aria-hidden="true">{a.init}</div>
          <div className="c-id"><div className="c-name">{a.name}</div><div className="muted sm">{a.spec}</div></div>
          <span className="avail"><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="#f6c244"><path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z"></path></svg><b>{a.rating}</b></span>
        </div>
        <div className="rowflex">
          {a.following ? (<><span className="badge b-follow"><svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.8-8 11-8 11z"></path></svg>Following</span></>) : null}
          <span className={a.subCls}>{a.subLabel}</span>
        </div>
        <div className="rowflex" aria-label="Appointment durations and prices">
          {a.durs.map((d, d_i) => (<Fragment key={d_i}><span className="dur-chip">{d.label}</span></Fragment>))}
        </div>
        <div className="avail"><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 10h18M8 3v4M16 3v4"></path></svg>{a.availText}</div>
        <button className={a.btnCls} onClick={a.pick}>{a.btnLabel}</button>
      </article>
    </Fragment>))}
  </div>
  <div className="legend"><span>Following and subscription are separate. Prices and durations shown are each astrologer's own.</span></div>
  </div>
  </>) : null}

  {v.hasAstro ? (<>
  <div className={v.expCls}>
  {v.notResched ? (<>
  <div className="c-top" style={{ marginBottom: "14px" }}>
    <div className="avatar" aria-hidden="true">{v.selInit}</div>
    <div className="c-id"><div className="c-name">{v.selName}</div><div className="muted sm">{v.selSpec}</div></div>
    <span className="badge b-sub">Subscribed</span>
    <button className="btn btn-ghost sm" onClick={v.chooseAnother}>Choose another astrologer</button>
  </div>
  </>) : null}
  <div className="block">
    <h2 className="h2">Date &amp; time</h2>
  {v.notResched ? (<>
  <div className="block">
    <h3 className="h3">Duration</h3>
    <div className="opts" role="group" aria-label="Appointment duration">
      {v.durOpts.map((o, o_i) => (<Fragment key={o_i}><button className="opt" aria-pressed={o.on} onClick={o.pick}>{o.min}<span>{o.price}</span></button></Fragment>))}
    </div>
  </div>
  </>) : null}

  <div className="block">
    <h3 className="h3">Date</h3>
    <div className="winnav">
      <button className="iconbtn" aria-label="Previous 7 days" disabled={v.prevDisabled} onClick={v.prevWin}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg></button>
      <div className="winlabel">{v.winLabel}</div>
      <button className="iconbtn" aria-label="Next 7 days" disabled={v.nextDisabled} onClick={v.nextWin}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"></path></svg></button>
    </div>
    <div className="days" role="group" aria-label="Dates in this 7-day window">
      {v.days.map((d, d_i) => (<Fragment key={d_i}>
        <button className={d.cls} aria-label={d.aria} aria-pressed={d.sel} disabled={d.disabled} onClick={d.pick}><small>{d.dow}</small><b>{d.num}</b><em>{d.count}</em></button>
      </Fragment>))}
    </div>
    <div className="legend"><span>{v.rangeNote}</span></div>
  </div>

  <div className="block">
    <h3 className="h3">Time</h3>
    <p className="muted sm" style={{ margin: "0 0 8px" }}>{v.slotNote}</p>
    {v.notResched ? (<>
    <div className="quota">
      <div className="qwarn"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M12 3l10 18H2z"></path><path d="M12 10v4M12 17.5h.01"></path></svg><span>You can book a maximum of 4 slots per day.</span>
        <span className="qrow" role="img" aria-label={v.quotaText}>{v.quotaBoxes.map((q, q_i) => (<Fragment key={q_i}><span className={q.cls}><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></span></Fragment>))}</span>
      </div>
    </div>
    </>) : null}
    {v.hasSlots ? (<>
      <div className="slots" role="group" aria-label="Available time slots">
        {v.slots.map((s, s_i) => (<Fragment key={s_i}><button className={s.cls} aria-label={s.aria} aria-pressed={s.sel} disabled={s.disabled} onClick={s.pick}>{s.label}</button></Fragment>))}
      </div>
      <div className="legend">
        <span><i className="sw sw-av"></i> Available</span>
        <span><i className="sw sw-sel"></i> Selected</span>
        <span><i className="sw sw-un"></i> Unavailable</span>
      </div>
    </>) : null}
    {v.noSlots ? (<><div className="apcard"><p className="muted" style={{ margin: "0" }}>No time slots on this date for this duration. Pick another date or duration.</p></div></>) : null}
  </div>

  </div>
  </div>
  </>) : null}
  </div>

  {v.hasAstro ? (<>
  <div className="footbar">
    <span>{v.footHint}</span>
    <button className="btn btn-gold" disabled={v.footDisabled} onClick={v.footAction}>{v.footLabel}</button>
  </div>
  </>) : null}
</section>
</>) : null}


{v.isFlow ? (<>
<section aria-label="Your details and payment">
  <div className="pagehead">
    <button className="iconbtn" aria-label={v.backFlowLabel} onClick={v.backFlow}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg></button>
    <h1 className="pt">{v.flowTitle}</h1>
  </div>
  <ol className="steps" aria-label="Booking steps">
    {v.flowSteps.map((s, s_i) => (<Fragment key={s_i}><li className={s.cls}><i>{s.n}</i>{s.label}</li></Fragment>))}
  </ol>
  <div className={v.flipCls}>
    <div className="flip-inner">
      <div className={v.frontCls}>
  <div style={{ maxWidth: "760px", margin: "0 auto" }}>
  <div className="block">
    <h2 className="h2"><span className="num">2</span>Your details</h2>
  <div className="note"><span>Share these so {v.selName} can prepare for your consultation. Fields marked <b className="req">*</b> are required.</span></div>
  <div className="apcard block">
    <h2 className="h2">About you</h2>
    <div className="fgrid">
      <div className="f"><label htmlFor="f-name">Full name <span className="req">*</span></label><input id="f-name" className="ta" type="text" autoComplete="name" value={v.fName} onChange={v.onName} /></div>
      <div className="f"><label htmlFor="f-dob">Date of birth <span className="req">*</span></label><input id="f-dob" className="ta" type="date" max={v.todayIso} value={v.fDob} onChange={v.onDob} /></div>
    </div>
    <button className="link" style={{ marginLeft: "0" }} aria-expanded={v.showMore} onClick={v.toggleMore}>{v.moreLabel}</button>
    {v.showMore ? (<>
      <div className="fgrid" style={{ marginTop: "8px" }}>
        <div className="f"><label htmlFor="f-tob">Time of birth</label><input id="f-tob" className="ta" type="time" disabled={v.fTobUnknown} value={v.fTob} onChange={v.onTob} /><label className="chk"><input type="checkbox" checked={v.fTobUnknown} onChange={v.onTobUnknown} />I don't know my exact birth time</label></div>
        <div className="f"><label htmlFor="f-pob">Place of birth</label><input id="f-pob" className="ta" type="text" placeholder="City, state, country" value={v.fPob} onChange={v.onPob} /></div>
      </div>
      <div className="f">
        <span className="lbl">Horoscope</span>
        <input id="f-horo" className="ta" type="file" accept="image/*,.pdf" aria-label="Upload horoscope" onChange={v.onHoro} />
        {v.hasHoro ? (<><div className="fhint">Attached: {v.fHoroName} <button className="link" style={{ minHeight: "44px" }} onClick={v.clearHoro}>Remove</button></div></>) : null}
      </div>
    </>) : null}
  </div>
  <div className="apcard block">
    <h2 className="h2">Purpose of consultation <span className="req">*</span></h2>
    <div className="opts" role="group" aria-label="Purpose of consultation">
      {v.purposes.map((pu, pu_i) => (<Fragment key={pu_i}><button className="apchip" aria-pressed={pu.on} onClick={pu.pick}>{pu.label}</button></Fragment>))}
    </div>
    <div className="f" style={{ marginTop: "14px" }}><label htmlFor="f-notes">What would you like to discuss? (optional)</label><textarea id="f-notes" className="ta" rows="3" value={v.fNotes} onChange={v.onNotes}></textarea></div>
  </div>
  </div>
  </div>
      </div>
      <div className={v.backCls}>
  <div className="block">
    <div className="grid">
      <div className="apcard">
        <div className="c-top" style={{ marginBottom: "8px" }}>
          <div className="avatar" aria-hidden="true">{v.selInit}</div>
          <div className="c-id"><div className="c-name">{v.selName}</div><div className="muted sm">{v.selSpec}</div></div>
        </div>
        <dl className="rows">
          <div><dt>Appointment date</dt><dd>{v.rvDate}</dd></div>
          <div><dt>Appointment time</dt><dd>{v.rvTime}</dd></div>
          <div><dt>Duration</dt><dd>{v.rvDur}</dd></div>
          <div><dt>Consultation mode</dt><dd>Audio / Voice Call</dd></div>
          <div><dt>Appointment price</dt><dd>{v.rvPrice}</dd></div>
        </dl>
      </div>
      <div className="apcard">
        <h2 className="h2">Your details</h2>
        <dl className="rows">
          <div><dt>Name</dt><dd>{v.rvName}</dd></div>
          <div><dt>Date of birth</dt><dd>{v.rvDob}</dd></div>
          {v.hasRvTob ? (<><div><dt>Time of birth</dt><dd>{v.rvTob}</dd></div></>) : null}
          {v.hasRvPob ? (<><div><dt>Place of birth</dt><dd>{v.rvPob}</dd></div></>) : null}
          {v.hasHoro ? (<><div><dt>Horoscope</dt><dd>{v.rvHoro}</dd></div></>) : null}
          <div><dt>Purpose</dt><dd>{v.rvPurpose}</dd></div>
        </dl>
        <button className="link" style={{ marginLeft: "0" }} onClick={v.toDet}>Edit details</button>
      </div>
      <div className="apcard">
        <h2 className="h2">Payment</h2>
        <dl className="rows">
          <div><dt>Pay with</dt><dd>Wallet</dd></div>
          <div><dt>Wallet balance</dt><dd>{v.walletText}</dd></div>
          <div className="tot"><dt>Amount payable</dt><dd>{v.rvPrice}</dd></div>
        </dl>
        {v.insufficient ? (<>
          <div className="warn" role="alert"><span>Your wallet balance is short by {v.shortText}.</span><button className="btn btn-gold sm" onClick={v.topup}>Add {v.shortText} to wallet</button><span className="sm">Uses the existing wallet top-up, then returns here.</span></div>
        </>) : null}
        {v.hasError ? (<>
          <div className="warn" role="alert"><span>{v.errorText}</span></div>
        </>) : null}
      </div>
    </div>
  </div>
      </div>
    </div>
  </div>
  {v.isDet ? (<>
  <div className="footbar">
    <span>{v.detHint}</span>
    <button className="btn btn-gold" disabled={v.detDisabled} onClick={v.toB3}>Continue to Review &amp; Pay</button>
  </div>
  </>) : null}
  {v.isReview ? (<>
  <div className="footbar">
    <span>{v.payHint}</span>
    <button className="btn btn-gold" disabled={v.payDisabled} onClick={v.confirm}>{v.payLabel}</button>
  </div>
  </>) : null}
</section>
</>) : null}


{v.isSuccess ? (<>
<section aria-label="Booking confirmed" className="narrow">
  <div className="apcard center">
    <div className="okmark"><svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></div>
    <h1 style={{ fontFamily: "var(--font-head)", fontSize: "24px", margin: "0 0 4px", color: "var(--em)" }}>Booking confirmed</h1>
    <p className="muted" style={{ margin: "0 0 12px" }}>Your audio consultation is booked.</p>
    <dl className="rows" style={{ textAlign: "left" }}>
      <div><dt>Astrologer</dt><dd>{v.okName}</dd></div>
      <div><dt>Date &amp; time</dt><dd>{v.okWhen}</dd></div>
      <div><dt>Duration</dt><dd>{v.okDur}</dd></div>
      <div><dt>Consultation mode</dt><dd>Audio / Voice Call</dd></div>
      <div><dt>Paid amount</dt><dd>{v.okAmount}</dd></div>
      <div><dt>Booking ID</dt><dd>{v.okId}</dd></div>
      <div><dt>Status</dt><dd><span className="badge b-booked">Booked</span></dd></div>
    </dl>
    <div style={{ marginTop: "16px" }}><button className="btn btn-primary" style={{ width: "100%" }} onClick={v.viewAppointments}>View My Appointments</button></div>
  </div>
</section>
</>) : null}


{v.isSub ? (<>
<section aria-label="Subscription" className="narrow">
  <div className="pagehead">
    <button className="iconbtn" aria-label="Back to astrologers" onClick={v.toB1}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg></button>
    <h1>Subscribe to {v.selName}</h1>
  </div>
  <div className="ribbon">Existing subscription page · reused as is</div>
  <div className="apcard stack">
    <div className="c-top">
      <div className="avatar" aria-hidden="true">{v.selInit}</div>
      <div className="c-id"><div className="c-name">{v.selName}</div><div className="muted sm">{v.selSpec}</div></div>
    </div>
    <div className="placeholder">The existing subscription plans, pricing and payment appear here.</div>
    <p className="muted sm" style={{ margin: "0" }}>After subscribing you return to your booking with {v.selName} still selected.</p>
    <button className="btn btn-gold" onClick={v.completeSub}>Complete subscription</button>
    <button className="btn btn-ghost" onClick={v.toB1}>Not now</button>
  </div>
</section>
</>) : null}

</main>
{v.showDlg ? (<>
  <div className="overlay">
    <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dlgt">
      <h2 className="h2" id="dlgt">{v.dlgTitle}</h2>
      <dl className="rows">
        {v.dlgRows.map((r, r_i) => (<Fragment key={r_i}><div><dt>{r.k}</dt><dd>{r.v}</dd></div></Fragment>))}
      </dl>
      <p className="muted sm">{v.dlgNote}</p>
      <label className="sm" htmlFor="reason">{v.dlgReasonLabel}</label>
      <textarea id="reason" className="ta" rows="2" value={v.reason} onChange={v.onReason}></textarea>
      <div className="actions" style={{ justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" onClick={v.dlgClose}>{v.dlgKeep}</button>
        <button className={v.dlgBtnCls} onClick={v.dlgConfirm}>{v.dlgConfirmLabel}</button>
      </div>
    </div>
  </div>
</>) : null}
</div>
</>
  );
};

export default function AppointmentPage() {
  const { tab } = useParams();
  return <Appointment key={tab || "my"} initialScreen={tab === "book" ? "b1" : "history"} />;
}
