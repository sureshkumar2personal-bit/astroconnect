import { TEMPLATES } from '@/data/remedyData.js';
import { TODAY, SERVICE_NAMES, dDiff, fS, fD, mono, plural, inRange } from '@/lib/remedyModel.js';

// Remedy Tracker selectors: the lists, counts and filters of each tab, derived from the store state
// and the derived assignments (see remedyModel.deriveAssignment). Pure functions — no UI.

const STAT_NAME = { started: 'Started', ongoing: 'Ongoing', skipped: 'Skipped', completed: 'Completed', pending: 'Pending / No Update' };
export const OSEGS = [['all', 'All', () => true], ['active', 'Active', (r) => r.anyActive || (r.isNew && r.allCount === 0)], ['popular', 'Popular', (r) => r.popular], ['attention', 'Needs Attention', (r) => r.attention], ['inactive', 'Inactive', (r) => r.inactive]];

export function kpis(all) {
  const active = all.filter((d) => d.active);
  const attn = all.filter((d) => d.reasons.length);
  const nonC = all.filter((d) => d.bucket);
  const bt = { started: 0, ongoing: 0, skipped: 0, completed: 0 }; nonC.forEach((d) => { bt[d.bucket]++; });
  const compNov = all.filter((d) => d.a.final && d.a.final.d.slice(0, 7) === TODAY.slice(0, 7)).length;
  const rate = nonC.length ? Math.round((bt.completed / nonC.length) * 100) : 0;
  return { active, attn, nonC, bt, compNov, rate };
}

/** Overview: remedy rows (per saved method), performance panel. */
export function overview(s, all, K = kpis(all)) {
  const ouq = s.ouq.trim().toLowerCase(); const oq = s.oq.trim().toLowerCase();
  const asgOn = !!(ouq || s.oservice !== 'all' || s.ostatus !== 'all' || s.ofrom || s.oto);
  const mStat = (d, st) => st === 'all' || (st === 'pending' ? d.noUpdate : d.bucket === st);
  const oA = all.filter((d) => d.bucket && (!ouq || d.userName.toLowerCase().includes(ouq)) && (s.oservice === 'all' || d.service === s.oservice) && mStat(d, s.ostatus) && inRange(d.assigned, s.ofrom, s.oto));
  const rem = s.methods.filter((m) => m.status !== 'draft').map((m) => {
    const allFor = all.filter((d) => d.methodId === m.id && d.bucket); const list = oA.filter((d) => d.methodId === m.id);
    const c = { started: 0, ongoing: 0, skipped: 0, completed: 0 }; list.forEach((d) => { c[d.bucket]++; });
    const total = list.length; const act = list.filter((d) => d.active).length;
    const last = allFor.reduce((mx, d) => (d.assigned > mx ? d.assigned : mx), '');
    const comp = allFor.filter((d) => d.bucket === 'completed').length;
    const isNew = dDiff(m.created, TODAY) <= 30; const anyActive = allFor.some((d) => d.active);
    const inactive = !anyActive && dDiff(last || m.created, TODAY) > 60;
    const attention = allFor.some((d) => d.active && d.reasons.length);
    const w = (n) => (total ? Math.round((n / total) * 100) : 0);
    return {
      id: m.id, name: m.name, category: m.category, mono: mono(m.name), tone: m.tone || 'tone-teal',
      c, total, act, last, lastF: last ? fS(last) : 'Not yet assigned', score: allFor.length * 2 + comp, allCount: allFor.length, comp,
      rate: allFor.length ? Math.round((comp / allFor.length) * 100) : 0, isNew, inactive, attention, archived: m.status === 'archived', anyActive,
      w: { started: w(c.started), ongoing: w(c.ongoing), skipped: w(c.skipped), completed: w(c.completed) }, empty: total === 0,
    };
  });
  const popIds = rem.filter((r) => r.allCount >= 2).sort((a, b) => b.score - a.score).slice(0, 3).map((r) => r.id);
  rem.forEach((r) => {
    r.popular = popIds.includes(r.id); const t = [];
    if (r.popular) t.push(['Popular', 't-gold']); if (r.isNew && r.allCount === 0) t.push(['New', 't-teal']);
    if (r.attention) t.push(['Needs attention', 't-amber']); if (r.inactive) t.push(['Inactive', 't-grey']); if (r.archived) t.push(['Archived', 't-grey']);
    r.tags = t;
  });
  const segFn = OSEGS.find((x) => x[0] === s.oseg)[2];
  const shown = rem.filter((r) => (!oq || r.name.toLowerCase().includes(oq)) && (!asgOn || !r.empty) && segFn(r));
  if (s.osort === 'newest') shown.sort((a, b) => (b.last || '0').localeCompare(a.last || '0'));
  else if (s.osort === 'oldest') shown.sort((a, b) => (a.last || '9').localeCompare(b.last || '9'));
  else shown.sort((a, b) => b.total - a.total || b.allCount - a.allCount);
  const chips = [];
  if (s.oq) chips.push(['Remedy: ' + s.oq, { oq: '' }]); if (s.ouq) chips.push(['User: ' + s.ouq, { ouq: '' }]);
  if (s.oservice !== 'all') chips.push([SERVICE_NAMES[s.oservice], { oservice: 'all' }]); if (s.ostatus !== 'all') chips.push([STAT_NAME[s.ostatus], { ostatus: 'all' }]);
  if (s.ofrom || s.oto) chips.push([`Assigned ${s.ofrom ? fS(s.ofrom) : '…'} – ${s.oto ? fS(s.oto) : '…'}`, { ofrom: '', oto: '' }]);
  const perf = rem.filter((r) => r.allCount > 0).sort((a, b) => b.allCount - a.allCount).map((r) => ({ id: r.id, name: r.name, rate: r.rate, total: r.allCount, line: `${r.comp} of ${r.allCount} completed` }));
  return { rem, shown, segs: OSEGS.map((x) => ({ id: x[0], label: x[1], count: rem.filter(x[2]).length })), chips, perf, most: perf.slice(0, 3) };
}

/** Assignment list (all assignments, or the assignments of one saved method). */
const LSORTS = {
  newest: (a, b) => b.assigned.localeCompare(a.assigned) || b.id.localeCompare(a.id), oldest: (a, b) => a.assigned.localeCompare(b.assigned),
  progress: (a, b) => b.pct - a.pct, updated: (a, b) => b.lastUpd.localeCompare(a.lastUpd), name: (a, b) => a.userName.localeCompare(b.userName),
};
export function assignmentList(s, all, remedyId) {
  const lq = s.lq.trim().toLowerCase();
  const mL = (d, st) => st === 'all' || (st === 'pending' ? d.noUpdate : st === 'overdue' ? d.overdue : st === 'cancelled' ? d.cancelled : d.bucket === st);
  const base = remedyId ? all.filter((d) => d.methodId === remedyId) : all;
  const items = base.filter((d) => (!lq || d.userName.toLowerCase().includes(lq) || d.remedyName.toLowerCase().includes(lq) || d.id.toLowerCase().includes(lq)) && (s.lservice === 'all' || d.service === s.lservice) && mL(d, s.lstatus) && inRange(d.assigned, s.lfrom, s.lto));
  items.sort(LSORTS[s.lsort] || LSORTS.newest);
  const PS = 8; const pages = Math.max(1, Math.ceil(items.length / PS)); const page = Math.min(s.lpage, pages);
  const lc = { started: 0, ongoing: 0, skipped: 0, completed: 0 }; base.forEach((d) => { if (d.bucket) lc[d.bucket]++; });
  return {
    items: items.slice((page - 1) * PS, page * PS), total: items.length, page, pages, lc,
    totalLine: plural(base.filter((d) => d.bucket).length, 'assignment') + (base.some((d) => d.cancelled) ? ` · ${base.filter((d) => d.cancelled).length} cancelled` : ''),
    showing: items.length ? `Showing ${(page - 1) * PS + 1}–${Math.min(page * PS, items.length)} of ${items.length}` : 'No results',
    filtersOn: !!(s.lq || s.lservice !== 'all' || s.lstatus !== 'all' || s.lfrom || s.lto),
  };
}

export const AGROUPS = [['all', 'All'], ['consecutive', 'Consecutive No Updates'], ['overdue', 'Overdue'], ['pending', 'Pending / No Update'], ['skipped', 'Skipped'], ['followup', 'Follow-up Needed']];
export function attention(s, all) {
  const base = all.filter((d) => d.reasons.length).filter((d) => s.aservice === 'all' || d.service === s.aservice);
  const sc = (d) => (d.reasons.some((r) => r.g === 'consecutive') ? 4 : 0) + (d.reasons.some((r) => r.g === 'overdue') ? 3 : 0) + (d.reasons.some((r) => r.g === 'pending') ? 1 : 0);
  const items = base.filter((d) => s.agroup === 'all' || d.reasons.some((r) => r.g === s.agroup)).sort((a, b) => sc(b) - sc(a));
  return { items, groups: AGROUPS.map(([id, label]) => ({ id, label, count: id === 'all' ? base.length : base.filter((d) => d.reasons.some((r) => r.g === id)).length })) };
}

export const HDEFS = [['all', 'All'], ['completed', 'Completed'], ['completed_skipped', 'Completed with Skipped Days'], ['cancelled', 'Cancelled'], ['stopped', 'Stopped'], ['archived', 'Archived Methods']];
export function history(s, all) {
  const hq = s.hq.trim().toLowerCase();
  const hAll = all.filter((d) => d.outcome);
  const archived = s.methods.filter((m) => m.status === 'archived');
  const items = hAll.filter((d) => (s.hfilter === 'all' || d.outcome === s.hfilter) && (!hq || d.userName.toLowerCase().includes(hq) || d.remedyName.toLowerCase().includes(hq)) && (s.hservice === 'all' || d.service === s.hservice) && inRange(d.closed, s.hfrom, s.hto))
    .sort((a, b) => b.closed.localeCompare(a.closed))
    .map((d) => ({ ...d, reason: d.a.stopped ? d.a.stopped.reason : d.a.cancelled ? d.a.cancelled.reason : '', photoLine: d.a.final ? (d.photosCount ? plural(d.photosCount, 'photo') : 'No photos') : '—', closedLabel: d.cancelled ? 'Cancelled' : d.stopped ? 'Stopped' : 'Completed' }));
  return {
    items, chips: HDEFS.map(([id, label]) => ({ id, label, count: id === 'all' ? hAll.length : id === 'archived' ? archived.length : hAll.filter((d) => d.outcome === id).length })),
    archived: archived.filter((m) => !hq || m.name.toLowerCase().includes(hq)).map((m) => ({ m, line: `Archived ${fD(m.edited)} · ${plural(all.filter((d) => d.methodId === m.id).length, 'assignment')} preserved` })),
  };
}

export function methodsView(s, all) {
  const tq = s.tq.trim().toLowerCase();
  const tpls = TEMPLATES.filter((t) => (!tq || t.name.toLowerCase().includes(tq)) && (s.tcat === 'all' || t.category === s.tcat));
  const mq = s.mq.trim().toLowerCase();
  const mine = s.methods.filter((m) => (!mq || m.name.toLowerCase().includes(mq)) && (s.mcat === 'all' || m.category === s.mcat) && (s.mstatus === 'all' || m.status === s.mstatus)).map((m) => {
    const mine2 = all.filter((d) => d.methodId === m.id); const n = mine2.length; const last = mine2.reduce((mx, d) => (d.assigned > mx ? d.assigned : mx), '');
    return { m, n, last, recent: !!last && dDiff(last, TODAY) <= 14, freq: n >= 3 };
  }).filter((x) => s.mflag === 'all' || (s.mflag === 'recent' ? x.recent : x.freq));
  return { tpls, mine };
}
