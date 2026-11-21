// Illustrative mock data only — Profile & Verification (spec 04_PROFILE_AND_VERIFICATION.md, AD-79 – AD-87).
// Sample values come from the reference prototype ("04 Profile & Verification").
// Same astrologer as astrologerProfile in mockTextQuestions.js ("Ananya R." / "A").

// Field kinds: 'text' (input), 'long' (textarea), 'file' (prototype file picker — nothing is uploaded),
// 'locked' (shown but not editable).
const f = (label, value, kind = 'text') => ({ label, value, kind });

export const profileSeed = {
  id: 'AST-1042',
  verified: true, // Verified Astrologer (AD-112); verification steps are AP-04-01
  sections: {
    // AD-80
    personal: {
      title: 'Personal Information',
      fields: [
        f('Full Name', 'Ananya Ramesh'),
        f('Profile Photo', 'ananya.jpg', 'file'),
        f('Date of Birth', '14 Jun 1988'),
        f('Gender', 'Female'),
        f('Mobile', '+91 98400 12345'),
        f('Email', 'ananya@astroconverse.in'),
        f('City / State / Country', 'Chennai, Tamil Nadu, India'),
        f('About Me / Bio', 'Vedic astrologer helping families with career and marriage guidance for 12 years.', 'long'),
      ],
    },
    // AD-81
    professional: {
      title: 'Professional Information',
      fields: [
        f('Astrologer ID', 'AST-1042', 'locked'),
        f('Years of Experience', '12'),
        f('Education', 'M.A. Jyotish Shastra'),
        f('Certifications', 'Jyotish Visharad'),
        f('Professional Introduction', 'Specialised in marriage matching and career timing.', 'long'),
        f('Languages', 'Tamil, English'),
      ],
    },
    // AD-82
    expertise: {
      title: 'Astrology Expertise',
      fields: [
        f('Astrology types', 'Vedic, KP, Numerology'),
        f('Specializations', 'Marriage, Career, Finance'),
        f('Expertise areas', 'Muhurtham, Horoscope matching'),
        f('Consultation languages', 'Tamil, English'),
      ],
    },
    // AD-83 (Introduction Video is optional — PRF-05)
    media: {
      title: 'Profile Media',
      fields: [
        f('Profile Photo', 'ananya.jpg', 'file'),
        f('Introduction Video (optional)', '—', 'file'),
        f('Certificates / Qualification Documents', 'jyotish-visharad.pdf', 'file'),
        f('Supporting Documents', '—', 'file'),
      ],
    },
  },
  // AD-85. Status values are illustrative — AP-04-01 is still open.
  verification: [
    { label: 'KYC status', status: 'Approved' },
    { label: 'Identity verification', status: 'Approved' },
    { label: 'Certificate verification', status: 'Under review' },
  ],
  // Changes waiting for Platform Admin approval: { 'Full Name': previously verified value } (AD-87).
  pending: {},
};

// Sample of "selected important changes" taken from the reference. Which changes really need
// approval is PENDING DISCUSSION (AP-04-02); the UI shows that tag wherever this is used.
export const APPROVAL_FIELDS = ['Full Name', 'Years of Experience', 'Certifications', 'Astrology types'];

// Service prices shown in the User App preview (managed in their own modules — AD-84, AD-106).
// Reference sample values; Appointment price comes from the Appointments settings.
export const TQ_FROM_PRICE = 149;
export const CALL_CHAT_PACKAGES = {
  call: [{ m: 5, p: 75 }, { m: 10, p: 140 }, { m: 20, p: 260 }],
  chat: [{ m: 5, p: 60 }, { m: 15, p: 160 }],
};
