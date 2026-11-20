// Illustrative mock data only, copied from the Text Questions reference prototypes.
// Nothing here is connected to a backend; replace with API responses later.

export const astrologerProfile = { name: 'Ananya R.', role: 'Astrologer', initial: 'A' };

export const monthlyQuota = 300;

export const campaigns = [
  { id: 'c1', name: 'Career Guidance', type: 'Specific', special: false, start: '2026-11-01', end: '2026-11-30', slots: 80, sold: 50, pg: 499, pp: 799, offer: 'No Offer', status: 'Active' },
  { id: 'c2', name: 'Relationship Insights', type: 'Open Slots', special: false, start: '2026-11-05', end: '2026-11-30', slots: 60, sold: 35, pg: 299, pp: 499, offer: 'No Offer', status: 'Active' },
  { id: 'c3', name: 'Career & Finance', type: 'Specific', special: true, start: '2026-11-01', end: '2026-11-30', slots: 40, sold: 20, pg: 799, pp: 1199, offer: 'No Offer', status: 'Active' },
];

export const templates = [
  { id: 't1', name: 'Career – General', text: 'Based on your chart, your 10th house shows ' },
  { id: 't2', name: 'Marriage – General', text: 'Looking at your 7th house and Venus, ' },
  { id: 't3', name: 'Business – General', text: 'For business, the key periods in your chart are ' },
];

// type = question type, slot = slot type the user paid for, camp = campaign id,
// horo = horoscope attached, prev = [questionId, topic, status] of earlier questions.
export const questions = [
  { id: 'TQ-98241', uid: 'U-44821', name: 'Divya S.', color: '#F4C7D9', type: 'General', slot: 'General', camp: 'c1', recv: '2026-10-26T10:20', status: 'Pending', horo: true, files: ['Photo.jpg'], text: 'Will I be able to start my own business in the next year? If yes, what is the right time and what should I be careful about?', age: 28, gender: 'Female', loc: 'Chennai, TN', paid: 499, slots: 1, prev: [['TQ-96410', 'Career', 'Completed']] },
  { id: 'TQ-98240', uid: 'U-39017', name: 'Rahul K.', color: '#C9E6EE', type: 'Personal', slot: 'Personal', camp: 'c2', recv: '2026-10-28T16:15', status: 'Pending', horo: true, files: [], text: 'My marriage prospects and the best timeline for marriage.', age: 31, gender: 'Male', loc: 'Coimbatore, TN', paid: 499, slots: 1, prev: [] },
  { id: 'TQ-98237', uid: 'U-40562', name: 'Meera P.', color: '#F3DEC0', type: 'General', slot: 'General', camp: 'c1', recv: '2026-10-30T09:48', status: 'Pending', horo: false, files: ['Resume.pdf', 'Offer.pdf'], text: 'Will there be a job change or promotion in the coming months?', age: 26, gender: 'Female', loc: 'Madurai, TN', paid: 499, slots: 2, prev: [['TQ-97002', 'Health', 'Completed']] },
  { id: 'TQ-98250', uid: 'U-41233', name: 'Arjun V.', color: '#D9E4FB', type: 'General', slot: 'General', camp: 'c3', recv: '2026-11-05T11:05', status: 'Pending', horo: true, files: [], text: 'Is 2027 a good year to invest in property?', age: 35, gender: 'Male', loc: 'Bengaluru, KA', paid: 799, slots: 1, prev: [], draft: 'Your 4th house lord is ' },
  { id: 'TQ-98262', uid: 'U-42118', name: 'Lakshmi N.', color: '#E3D9F7', type: 'Personal', slot: 'General', camp: 'c2', recv: '2026-11-10T18:30', status: 'Correction Requested', horo: true, files: [], text: 'Based on my chart, will my husband get a transfer to Chennai?', age: 33, gender: 'Female', loc: 'Trichy, TN', paid: 299, slots: 1, prev: [] },
  { id: 'TQ-98270', uid: 'U-43007', name: 'Karthik M.', color: '#C9E6EE', type: 'General', slot: 'General', camp: 'c1', recv: '2026-11-18T08:10', status: 'New', horo: true, files: [], text: 'Should I accept the offer from my current company or move abroad next year? My birth details are attached.', age: 29, gender: 'Male', loc: 'Salem, TN', paid: 499, slots: 1, prev: [] },
  { id: 'TQ-98275', uid: 'U-43350', name: 'Priya S.', color: '#F4C7D9', type: 'Personal', slot: 'Personal', camp: 'c2', recv: '2026-11-19T20:40', status: 'New', horo: false, files: [], text: 'When is a good time for my sister’s engagement?', age: 27, gender: 'Female', loc: 'Chennai, TN', paid: 499, slots: 1, prev: [] },
  { id: 'TQ-98278', uid: 'U-43402', name: 'Sanjay R.', color: '#F3DEC0', type: 'General', slot: 'General', camp: 'c3', recv: '2026-11-20T09:15', status: 'New', horo: true, files: ['Chart.png'], text: 'Which months in 2027 are best to start a new venture?', age: 38, gender: 'Male', loc: 'Erode, TN', paid: 799, slots: 1, prev: [] },
  { id: 'TQ-97821', uid: 'U-38877', name: 'Arun R.', color: '#D9E4FB', type: 'General', slot: 'General', camp: 'c1', recv: '2026-10-20T10:00', status: 'Completed', horo: true, files: [], text: 'Will I clear my government exam this year?', age: 24, gender: 'Male', loc: 'Vellore, TN', paid: 499, slots: 1, prev: [], answer: 'Jupiter supports your studies from February. Focus on revision in March.', answeredAt: '2026-11-04T12:00' },
  { id: 'TQ-97790', uid: 'U-39017', name: 'Rahul K.', color: '#C9E6EE', type: 'Personal', slot: 'Personal', camp: 'c2', recv: '2026-10-18T09:30', status: 'Disputed', horo: true, files: [], text: 'When will I get married? Please give dates for 2026.', age: 31, gender: 'Male', loc: 'Coimbatore, TN', paid: 499, slots: 1, prev: [], answer: 'Venus moves into your 7th house from mid-2027. June to September 2027 looks favourable for a proposal.', answeredAt: '2026-11-01T15:00', dispute: 'The answer does not mention the dates I asked about for 2026. Please clarify.', disputeAt: '2026-11-03T10:00' },
  { id: 'TQ-97654', uid: 'U-38120', name: 'Sneha V.', color: '#F3DEC0', type: 'General', slot: 'General', camp: 'c1', recv: '2026-10-03T14:00', status: 'Expired', horo: false, files: [], text: 'Which gemstone suits me for health?', age: 30, gender: 'Female', loc: 'Chennai, TN', paid: 499, slots: 1, prev: [] },
];

// Prototype stand-ins for picking a real file (Attach File).
export const sampleAttachments = ['Remedy-guide.pdf', 'Muhurtham-chart.png'];
