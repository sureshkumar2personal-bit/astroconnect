// Illustrative mock data only: what the astrologer sees about the User during an Instant Call / Chat
// (session workspace details panel). Sample values, never real people (AD-137).
// NOTE: whether a birth profile is shared in Instant Call / Instant Chat is still PENDING DISCUSSION
// (User App P-13-09); flagged for the product owner. Shown here as prototype sample data.

// South-Indian Rasi chart: the 12 Rasis sit in a fixed outer ring of a 4×4 grid.
// [row, column] of each Rasi in that grid (Meenam top-left, then clockwise).
export const RASI_CELLS = {
  Meenam: [0, 0], Mesham: [0, 1], Rishabam: [0, 2], Mithunam: [0, 3],
  Kadagam: [1, 3], Simmam: [2, 3],
  Kanni: [3, 3], Thulam: [3, 2], Viruchigam: [3, 1], Dhanusu: [3, 0],
  Magaram: [2, 0], Kumbam: [1, 0],
};

const profile = (topic, question, birth, chart, prev = []) => ({
  topic, question, birth, chart, prev,
  files: [{ name: 'Horoscope.pdf', kind: 'PDF', size: '1.0 MB', pages: 4 }],
});

// chart: planets per Rasi. Mo sits in the birth Rasi and La (Lagnam) in the Lagnam Rasi.
// prev: earlier questions / consultations with this astrologer [type, record ID].
export const sessionProfiles = {
  'U-44821': profile('Career', 'Is this a good year to change my job, or should I wait until 2027?',
    { dob: '12 Mar 1998', time: '6:40 AM', place: 'Chennai, Tamil Nadu', rasi: 'Kanni', nakshatra: 'Hastham', lagnam: 'Meenam' },
    { Meenam: ['La', 'Sa', 'Ra'], Mesham: ['Ju'], Kumbam: ['Su', 'Me'], Magaram: ['Ve'], Kanni: ['Mo', 'Ke'], Viruchigam: ['Ma'] },
    [['Text Question', 'TQ-98241'], ['Instant Call', 'CON-7781']]),
  'U-39017': profile('Marriage', 'When are my marriage prospects strongest in the next two years?',
    { dob: '21 Aug 1994', time: '11:05 PM', place: 'Coimbatore, Tamil Nadu', rasi: 'Mesham', nakshatra: 'Bharani', lagnam: 'Rishabam' },
    { Rishabam: ['La'], Mesham: ['Mo', 'Ra'], Simmam: ['Su', 'Me'], Kadagam: ['Ve'], Thulam: ['Ju', 'Ke'], Dhanusu: ['Sa'], Magaram: ['Ma'] },
    [['Text Question', 'TQ-97790']]),
  'U-41870': profile('Health', 'My father has been unwell. Which months need extra care this year?',
    { dob: '3 Jan 1990', time: '4:15 AM', place: 'Tiruchirappalli, Tamil Nadu', rasi: 'Thulam', nakshatra: 'Swathi', lagnam: 'Viruchigam' },
    { Viruchigam: ['La', 'Ma'], Thulam: ['Mo'], Dhanusu: ['Su', 'Me'], Magaram: ['Ve', 'Ke'], Rishabam: ['Ju'], Kumbam: ['Sa'], Kadagam: ['Ra'] },
    [['Subscription Question', 'SQ-3011']]),
  'U-40011': profile('Education', 'Should I go abroad for my master’s next year?',
    { dob: '5 May 1999', time: '9:20 PM', place: 'Salem, Tamil Nadu', rasi: 'Rishabam', nakshatra: 'Rohini', lagnam: 'Dhanusu' },
    { Meenam: ['Sa'], Mithunam: ['Ju'], Rishabam: ['Mo'], Kadagam: ['Ma', 'Ke'], Dhanusu: ['La', 'Me'], Thulam: ['Ve'], Kanni: ['Su'], Magaram: ['Ra'] }),
  'U-39550': profile('Finance', 'Is it a good time to buy a house, or should I wait?',
    { dob: '17 Nov 1987', time: '7:50 AM', place: 'Madurai, Tamil Nadu', rasi: 'Simmam', nakshatra: 'Magam', lagnam: 'Viruchigam' },
    { Viruchigam: ['La', 'Su'], Simmam: ['Mo', 'Ke'], Thulam: ['Me', 'Ve'], Meenam: ['Ju'], Dhanusu: ['Sa'], Kumbam: ['Ra'], Kadagam: ['Ma'] },
    [['Subscription Question', 'SQ-2999']]),
  'U-38877': profile('Business', 'Will a partnership business work for me this year?',
    { dob: '29 Jul 1992', time: '2:30 PM', place: 'Erode, Tamil Nadu', rasi: 'Dhanusu', nakshatra: 'Moolam', lagnam: 'Thulam' },
    { Thulam: ['La'], Dhanusu: ['Mo'], Kadagam: ['Su', 'Me'], Simmam: ['Ve'], Rishabam: ['Ju', 'Ma'], Magaram: ['Sa'], Meenam: ['Ra'], Kanni: ['Ke'] },
    [['Appointment', 'APT-5009'], ['Text Question', 'TQ-97821']]),
};

const FALLBACK = profile('General', 'No question was added with this request.',
  { dob: 'Not shared', time: 'Not shared', place: 'Not shared', rasi: '—', nakshatra: '—', lagnam: '—' }, {});

export const profileFor = (uid) => sessionProfiles[uid] || FALLBACK;
