// Illustrative mock data only, ported from the reference prototype
// ("02 Text-Based Questions + Subscription Questions"). Nothing here is connected to a backend.
// User IDs/names match Appointments, Audience, Reviews and Remedy Tracker sample data.

export const astrologerProfile = { name: 'Ananya R.', role: 'Astrologer', initial: 'A' };

// Monthly quota 1,000 and minimum answer target 800 (AD-24, AD-52). `answeredMonth` is sample progress.
export const quotaSeed = { quota: 1000, target: 800, answeredMonth: 512, goal: 10 };

// Open Questions: submitted without choosing a campaign (AD-54). Discounts: { on, pct } (AD-56).
export const openSeed = { gSlots: 120, pSlots: 80, gSold: 70, pSold: 35, pg: 149, pp: 349, gDisc: { on: false, pct: 0 }, pDisc: { on: false, pct: 0 } };

// G / P = General / Personal offered (AD-26); special campaigns carry a mandatory label (AD-26).
export const campaigns = [
  { id: 'c1', name: 'Marriage', special: false, label: '', G: true, P: true, start: '2026-11-01', end: '2026-11-30', gSlots: 180, pSlots: 120, gSold: 140, pSold: 90, pg: 199, pp: 399, gDisc: { on: true, pct: 10 }, pDisc: { on: false, pct: 0 }, status: 'Active' },
  { id: 'c2', name: 'Career', special: false, label: '', G: true, P: true, start: '2026-11-01', end: '2026-12-15', gSlots: 150, pSlots: 100, gSold: 90, pSold: 60, pg: 249, pp: 449, gDisc: { on: false, pct: 0 }, pDisc: { on: false, pct: 0 }, status: 'Active' },
  { id: 'c3', name: 'Navaratri Blessings', special: true, label: 'Navaratri Special', G: true, P: true, start: '2026-11-12', end: '2026-11-22', gSlots: 100, pSlots: 50, gSold: 40, pSold: 20, pg: 299, pp: 599, gDisc: { on: false, pct: 0 }, pDisc: { on: true, pct: 20 }, status: 'Active' },
];

export const templates = [
  { id: 't1', name: 'Career – General', text: 'Based on your question, the coming months show ' },
  { id: 't2', name: 'Marriage – Personal', text: 'Looking at your 7th house and Venus in your chart, ' },
];

// cat: 'text' (Text-Based Questions) or 'sub' (Subscription Questions, AD-72).
// camp: campaign id, 'open' (Open Questions) or 'tier:<Tier>' (subscription benefit).
// files: user attachments (Personal only, AD-45/AD-61); prev: [questionId, topic, status].
const q = (id, cat, uid, name, color, type, slot, camp, recv, status, files, text, x = {}) =>
  ({ id, cat, uid, name, color, type, slot, camp, recv, status, files, text, ...x });

export const questions = [
  q('TQ-98241', 'text', 'U-44821', 'Divya S.', '#F4C7D9', 'General', 'General', 'c2', '2026-10-26T10:20', 'Pending', [], 'Will I be able to start my own business in the next year? If yes, what is the right time and what should I be careful about?', { paid: 249, prev: [['TQ-96410', 'Career', 'Settled']] }),
  q('TQ-98240', 'text', 'U-39017', 'Rahul K.', '#C9E6EE', 'Personal', 'Personal', 'c1', '2026-10-28T16:15', 'Pending', ['Birth-chart.jpg'], 'My marriage prospects and the best timeline for marriage based on my chart.', { paid: 399, gender: 'Male', loc: 'Coimbatore, TN' }),
  q('TQ-98237', 'text', 'U-40562', 'Meera P.', '#F3DEC0', 'General', 'General', 'c2', '2026-10-31T09:48', 'New', [], 'Will there be a job change or promotion in the coming months?', { paid: 249 }),
  q('TQ-98250', 'text', 'U-41233', 'Arjun V.', '#D9E4FB', 'Personal', 'Personal', 'open', '2026-11-06T11:05', 'Pending', ['Horoscope.pdf', 'Palm.jpg'], 'Is 2027 a good year to invest in property, based on my horoscope?', { paid: 349, gender: 'Male', loc: 'Bengaluru, KA', draft: 'Your 4th house lord is ' }),
  q('TQ-98262', 'text', 'U-42118', 'Lakshmi N.', '#E3D9F7', 'Personal', 'General', 'c1', '2026-11-10T18:30', 'Correction Requested', [], 'Based on my chart, will my husband get a transfer to Chennai?', { paid: 179 }),
  q('TQ-98270', 'text', 'U-43007', 'Karthik M.', '#C9E6EE', 'Personal', 'General', 'c2', '2026-11-20T09:10', 'New', [], 'Looking at my birth chart, should I accept the offer from my company or move abroad next year?', { paid: 249, gender: 'Male', loc: 'Salem, TN' }),
  q('TQ-98275', 'text', 'U-43350', 'Priya S.', '#F4C7D9', 'Personal', 'Personal', 'c3', '2026-11-20T11:40', 'New', ['Chart.png'], 'When is a good time for my engagement, based on my horoscope?', { paid: 479 }),
  q('TQ-98276', 'text', 'U-43402', 'Sanjay R.', '#F3DEC0', 'General', 'General', 'open', '2026-11-20T08:15', 'Completed', [], 'Which months in 2027 are best to start a new venture?', { paid: 149, gender: 'Male', answer: 'March to July 2027 look strongest for new ventures.', answeredAt: '2026-11-20T10:30' }),
  q('TQ-98271', 'text', 'U-43120', 'Nila V.', '#E3D9F7', 'Personal', 'Personal', 'c1', '2026-11-19T19:00', 'Completed', ['Chart.jpg'], 'Will my marriage happen this year?', { paid: 399, answer: 'Your Venus period begins in 2027; marriage is likely in mid-2027.', answeredAt: '2026-11-20T12:05' }),
  q('TQ-98266', 'text', 'U-42901', 'Gokul P.', '#D9E4FB', 'General', 'General', 'c2', '2026-11-15T09:00', 'Completed', [], 'Is this a good time to change my job?', { paid: 249, gender: 'Male', answer: 'Yes, January to April 2027 is supportive.', answeredAt: '2026-11-20T09:20' }),
  q('TQ-97821', 'text', 'U-38877', 'Arun R.', '#D9E4FB', 'General', 'General', 'c2', '2026-10-20T10:00', 'Settled', [], 'Will I clear my government exam this year?', { paid: 249, gender: 'Male', answer: 'Jupiter supports your studies from February. Focus on revision in March.', answeredAt: '2026-11-04T12:00' }),
  q('TQ-97790', 'text', 'U-39017', 'Rahul K.', '#C9E6EE', 'Personal', 'Personal', 'c1', '2026-10-30T09:30', 'Disputed', ['Birth-chart.jpg'], 'When will I get married? Please give dates for 2026.', { paid: 399, gender: 'Male', answer: 'Venus moves into your 7th house from mid-2027. June to September 2027 looks favourable.', answeredAt: '2026-11-17T15:00', dispute: 'The answer does not mention the 2026 dates I asked about. Please clarify.', disputeAt: '2026-11-19T10:00' }),
  q('TQ-97702', 'text', 'U-37710', 'Kavya M.', '#F4C7D9', 'General', 'General', 'c2', '2026-10-10T10:00', 'Dispute Answered', [], 'Will I get a promotion this year?', { paid: 249, answer: 'Promotion is indicated after March 2027.', answeredAt: '2026-10-20T10:00', dispute: 'I asked about this year, not next year.', disputeAt: '2026-10-22T10:00', disputeAnswer: 'In 2026 Saturn delays recognition; the promotion is more likely after March 2027.', disputeAnsweredAt: '2026-10-24T09:00' }),
  q('TQ-97654', 'text', 'U-38120', 'Sneha V.', '#F3DEC0', 'General', 'General', 'c1', '2026-10-03T14:00', 'Expired', [], 'Which gemstone suits me for health?', { paid: 199 }),
  // Further pending Subscription Questions (illustrative, so both question lists show seven rows).
  q('SQ-2981', 'sub', 'U-44821', 'Divya S.', '#F4C7D9', 'General', 'General', 'tier:Gold', '2026-11-02T09:15', 'Pending', [], 'Which days this month are good for signing a business lease?'),
  q('SQ-2986', 'sub', 'U-40011', 'Maya J.', '#F4C7D9', 'General', 'General', 'tier:Silver', '2026-11-05T18:40', 'Pending', [], 'Is this a good month to start learning music?'),
  q('SQ-2990', 'sub', 'U-41870', 'Hari K.', '#C9E6EE', 'Personal', 'Personal', 'tier:Gold', '2026-11-08T11:20', 'Pending', ['Chart.jpg'], 'Will my transfer request be approved before the new year?', { gender: 'Male' }),
  q('SQ-2994', 'sub', 'U-44821', 'Divya S.', '#F4C7D9', 'Personal', 'Personal', 'tier:Gold', '2026-11-12T08:05', 'Pending', ['Chart.jpg'], 'Which remedy helps with sleep and stress during this transit?'),
  q('SQ-3002', 'sub', 'U-40011', 'Maya J.', '#F4C7D9', 'General', 'General', 'tier:Silver', '2026-11-15T16:30', 'New', [], 'Is next week a good time to buy a two-wheeler?'),
  q('SQ-3011', 'sub', 'U-41870', 'Hari K.', '#C9E6EE', 'Personal', 'Personal', 'tier:Gold', '2026-11-20T10:00', 'New', ['Chart.jpg'], 'As a Gold subscriber, which remedy helps my career this month?', { gender: 'Male' }),
  q('SQ-3007', 'sub', 'U-40011', 'Maya J.', '#F4C7D9', 'General', 'General', 'tier:Silver', '2026-11-18T12:00', 'Pending', [], 'Is this week good for travel?'),
  q('SQ-2999', 'sub', 'U-39550', 'Deepa L.', '#E3D9F7', 'Personal', 'Personal', 'tier:Platinum', '2026-11-20T07:30', 'Completed', [], 'What should I focus on for health next month?', { answer: 'Focus on rest and routine; avoid travel after the 15th.', answeredAt: '2026-11-20T11:00' }),
];
