import { useCallback, useMemo, useState } from 'react';
import * as mock from '../data/mockTextQuestions.js';
import { EMPTY_FILTERS, MAX_CHARS, MAX_FILES, TODAY, allocated, buildQuestion, fmtDateTime } from '../lib/textQuestions.js';

// Client-side state for the Text Questions module (prototype; no backend).
// Lives in App so drafts and changes survive moving between Home and My Work.
export default function useTextQuestions() {
  const [questions, setQuestions] = useState(() => mock.questions.map(buildQuestion));
  const [campaigns, setCampaigns] = useState(mock.campaigns);
  const [templates, setTemplates] = useState(mock.templates);
  const [tab, setTab] = useState('p1');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [history, setHistory] = useState({ month: '2026-11', status: 'all', q: '' });

  const update = useCallback((id, patch) => {
    setQuestions((list) => list.map((q) => (q.id === id ? { ...q, ...(typeof patch === 'function' ? patch(q) : patch) } : q)));
  }, []);

  const quota = mock.monthlyQuota;
  const alloc = useMemo(() => allocated(campaigns), [campaigns]);

  const actions = useMemo(
    () => ({
      setTab,
      setFilters,
      setSearch: (q) => setFilters((f) => ({ ...f, q })),
      resetFilters: () => setFilters(EMPTY_FILTERS),
      setHistory: (patch) => setHistory((h) => ({ ...h, ...patch })),
      updateQuestion: update,

      setDraft: (id, draft) => update(id, { draft: draft.slice(0, MAX_CHARS) }),
      requestCorrection: (id) =>
        update(id, (q) => ({ status: 'Correction Requested', events: [...q.events, ['Correction Requested', fmtDateTime(TODAY), 'accent']] })),
      submitAnswer: (id) =>
        update(id, (q) => ({ answer: q.draft.trim(), answeredAt: TODAY.toISOString(), status: 'Answered', draft: '' })),
      submitDispute: (id, text) => update(id, { disputeAnswer: text, status: 'Dispute Answered' }),
      /** Returns false when the attachment limit is reached. */
      addAttachment: (q) => {
        if (q.att.length >= MAX_FILES) return false;
        update(q.id, (cur) => ({ att: [...cur.att, mock.sampleAttachments[cur.att.length]] }));
        return true;
      },
      removeAttachment: (id, i) => update(id, (q) => ({ att: q.att.filter((_, j) => j !== i) })),
      addLink: (id, url) => update(id, (q) => ({ links: [...q.links, url] })),

      saveCampaign: (id, values) =>
        setCampaigns((list) =>
          id
            ? list.map((c) => (c.id === id ? { ...c, ...values } : c))
            : [...list, { id: `c${Date.now()}`, sold: 0, status: 'Active', ...values }]
        ),
      setSlots: (id, slots) => setCampaigns((list) => list.map((c) => (c.id === id ? { ...c, slots } : c))),
      reallocate: (fromId, toId, n) =>
        setCampaigns((list) =>
          list.map((c) => (c.id === fromId ? { ...c, slots: c.slots - n } : c.id === toId ? { ...c, slots: c.slots + n } : c))
        ),
      cancelCampaign: (id) => setCampaigns((list) => list.map((c) => (c.id === id ? { ...c, status: 'Cancelled' } : c))),

      saveTemplate: (id, name, text) =>
        setTemplates((list) =>
          id ? list.map((t) => (t.id === id ? { ...t, name, text } : t)) : [...list, { id: `t${Date.now()}`, name, text }]
        ),
      deleteTemplate: (id) => setTemplates((list) => list.filter((t) => t.id !== id)),
    }),
    [update]
  );

  return {
    questions, campaigns, templates, tab, filters, history,
    quota, alloc, free: quota - alloc,
    byId: (id) => questions.find((q) => q.id === id),
    campaign: (id) => campaigns.find((c) => c.id === id) || { name: '—' },
    ...actions,
  };
}
