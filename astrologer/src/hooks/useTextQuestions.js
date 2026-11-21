import { useCallback, useMemo, useState } from 'react';
import * as mock from '@/data/mockTextQuestions.js';
import { EMPTY_FILTERS, MAX_CHARS, MAX_FILES, TODAY, allocated, buildQuestion, campaignName, fmtDateTime } from '@/lib/textQuestions.js';

// Client-side state for Text-Based Questions + Subscription Questions (prototype; no backend).
// Owned by App so drafts and changes survive moving between Home, My Work and the other pages.
// Contract read by other pages: `questions` (id, uid, name, status, recv, cat, remedy,
// disputeRemedy, answeredAt …) and `campaigns` ({ id, name, gDisc, pDisc, pg, pp, gSold, pSold … }).
// Count helpers for Home: receivedToday / answeredToday / pendingToday / critical / openDisputes
// in src/lib/textQuestions.js.
const clone = (o) => JSON.parse(JSON.stringify(o));

export default function useTextQuestions() {
  const [questions, setQuestions] = useState(() => mock.questions.map(buildQuestion));
  const [campaigns, setCampaigns] = useState(() => clone(mock.campaigns));
  const [open, setOpenState] = useState(() => clone(mock.openSeed));
  const [templates, setTemplates] = useState(mock.templates);
  // List view state (reference S.tq: tab, prio, f) and History state (hist, hq, month).
  const [view, setView] = useState({ tab: 'received', prio: '', f: EMPTY_FILTERS });
  const [history, setHistoryState] = useState({ month: '2026-11', status: 'all', q: '' });

  const update = useCallback((id, patch) => {
    setQuestions((list) => list.map((q) => (q.id === id ? { ...q, ...(typeof patch === 'function' ? patch(q) : patch) } : q)));
  }, []);
  const updateCamp = useCallback((id, patch) => {
    setCampaigns((list) => list.map((c) => (c.id === id ? { ...c, ...(typeof patch === 'function' ? patch(c) : patch) } : c)));
  }, []);

  const { quota, target, answeredMonth, goal } = mock.quotaSeed;
  const alloc = useMemo(() => allocated(campaigns, open), [campaigns, open]);

  const actions = useMemo(
    () => ({
      // ---- list view ----
      setTab: (tab) => setView((v) => ({ ...v, tab })),
      setPrio: (prio) => setView((v) => ({ ...v, prio })),
      setFilters: (f) => setView((v) => ({ ...v, f })),
      setSearch: (text) => setView((v) => ({ ...v, f: { ...v.f, q: text } })),
      resetFilters: () => setView((v) => ({ ...v, f: EMPTY_FILTERS, prio: '' })),
      setHistory: (patch) => setHistoryState((h) => ({ ...h, ...patch })),

      // ---- questions ----
      /** Opening a New question moves it to Pending (AD-51). */
      openQuestion: (id) =>
        update(id, (q) => (q.status === 'New'
          ? { status: 'Pending', events: [...q.events, ['Opened by astrologer (status Pending)', fmtDateTime(TODAY), 'done']] }
          : {})),
      setDraft: (id, draft) => update(id, { draft: draft.slice(0, MAX_CHARS) }),
      setRemedy: (id, remedy) => update(id, { remedy }),
      /** file: { name, size }. The editor validates type/size first; the limit is enforced here too (AD-45). */
      addAttachment: (id, file) => update(id, (q) => (q.att.length >= MAX_FILES ? {} : { att: [...q.att, file] })),
      removeAttachment: (id, i) => update(id, (q) => ({ att: q.att.filter((_, j) => j !== i) })),
      addLink: (id, url) => update(id, (q) => ({ links: [...q.links, url] })),
      requestCorrection: (id) =>
        update(id, (q) => ({ status: 'Correction Requested', events: [...q.events, ['Correction Requested', fmtDateTime(TODAY), 'accent']] })),
      submitAnswer: (id, text) =>
        update(id, { answer: text.trim(), answeredAt: TODAY.toISOString(), status: 'Completed', draft: '' }),
      submitDispute: (id, text, remedy) =>
        update(id, { disputeAnswer: text, disputeRemedy: remedy, disputeAnsweredAt: TODAY.toISOString(), status: 'Dispute Answered' }),

      // ---- campaigns (AD-25 – AD-27, AD-31, AD-57, AD-58) ----
      /** values: full campaign object; a missing id creates a new campaign. Returns the id. */
      saveCampaign: (values) => {
        if (values.id) { updateCamp(values.id, values); return values.id; }
        const id = `c${Date.now()}`;
        setCampaigns((list) => [...list, { ...values, id, gSold: 0, pSold: 0, status: 'Active' }]);
        return id;
      },
      setSlots: (id, g, p) => updateCamp(id, (c) => ({ ...(c.G ? { gSlots: g } : {}), ...(c.P ? { pSlots: p } : {}) })),
      /** Move n unsold slots from campaign `id` type fk ('G'|'P') to `tid` ('open' or a campaign id) type tk. */
      reallocate: (id, fk, tid, tk, n) => {
        const fromKey = fk === 'G' ? 'gSlots' : 'pSlots';
        const toKey = tk === 'G' ? 'gSlots' : 'pSlots';
        setCampaigns((list) => list.map((c) => {
          let next = c;
          if (c.id === id) next = { ...next, [fromKey]: next[fromKey] - n };
          if (c.id === tid) next = { ...next, [toKey]: next[toKey] + n, [tk]: true };
          return next;
        }));
        if (tid === 'open') setOpenState((o) => ({ ...o, [toKey]: o[toKey] + n }));
      },
      extendCampaign: (id, end) => updateCamp(id, { end }),
      /** Cancel: unsold allocation returns to the quota (slots = sold); purchased unused slots refunded (AD-31). */
      cancelCampaign: (id) => updateCamp(id, (c) => ({ status: 'Cancelled', gSlots: c.gSold, pSlots: c.pSold })),
      deleteCampaign: (id) => updateCamp(id, { status: 'Deleted' }),
      setOpen: (patch) => setOpenState((o) => ({ ...o, ...patch })),

      // ---- templates (AD-38) ----
      saveTemplate: (id, name, text) =>
        setTemplates((list) => (id ? list.map((t) => (t.id === id ? { ...t, name, text } : t)) : [...list, { id: `t${Date.now()}`, name, text }])),
      deleteTemplate: (id) => setTemplates((list) => list.filter((t) => t.id !== id)),
    }),
    [update, updateCamp]
  );

  return {
    questions, campaigns, open, templates, history,
    tab: view.tab, prio: view.prio, filters: view.f,
    quota, target, answeredMonth, goal, alloc, free: quota - alloc,
    byId: (id) => questions.find((q) => q.id === id),
    campaign: (id) => campaigns.find((c) => c.id === id),
    campaignName: (id) => campaignName(campaigns, id),
    ...actions,
  };
}
