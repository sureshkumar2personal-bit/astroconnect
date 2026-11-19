# 18 — Pending Decisions Report (User App)

| Field | Value |
|-------|-------|
| Application | User App |
| Type | Consolidated report (not a module specification) |
| Prepared | 2026-11-17 |
| Source | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) §3 and §4, module files 01–17 |
| Questions reviewed | 131 |
| Decision groups | 27 |

This report groups the 131 open questions into 27 decisions so that related
questions can be answered together. **It does not answer or resolve any
question.** The official wording of every question remains in
[`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register);
when a decision is made, it is recorded there following the process in
[`CLAUDE.md`](../../CLAUDE.md) §5.

> **Snapshot:** this report reflects the open questions as of 2026-11-17. On
> 2026-11-19, P-06-04, P-06-05, P-06-08, P-06-09, P-06-10, P-06-11, P-06-17,
> P-16-02, and P-06-01 were resolved; later on 2026-11-19, P-06-06, P-06-14,
> P-10-04, P-10-05, P-10-06, P-14-01, and P-14-06 were resolved and
> P-14-02 – P-14-05 were put on hold (see the review list §7). The review list is the
> current source for open questions.

Options listed below are possibilities to help discussion. They are **not**
recommendations and **not** requirements.

---

## 1. How to read this report

- **Tier 1 — Blocking:** many modules cannot be completed until these are decided.
- **Tier 2 — High impact:** affect several modules or core behaviour.
- **Tier 3 — Module detail:** mostly affect one module.

Each group shows:
- **P-IDs** — the open questions it covers.
- **Decision needed** — the actual choice to make.
- **Explanation** — what it means in practice, with examples.
- **Options** — possible answers, where applicable.
- **Already confirmed** — related confirmed decisions (by ID only).
- **Depends on** — other groups that should be decided first or together.

---

## 2. Confirmed vs unresolved

### 2.1 Confirmed (do not re-decide)

These are recorded verbatim in the
[decision register](00_USER_APP_REVIEW_LIST.md#3-confirmed-decisions-register).
Only topic titles are shown here.

| ID | Topic | Owning file |
|----|-------|-------------|
| D-01 | Bottom navigation tabs | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-02 | Purpose of the Services tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-03 | Purpose of the Activity tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-04 | Subscription prerequisite for Text Questions | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-05 | Purchasing question slots from campaigns | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-06 | Using or holding a question slot | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-07 | Question slot expiry | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-08 | Text Question dispute | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-09 | Services without a dispute option | [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md) |
| D-10 | Reviews after consultations | [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md) |
| D-11 | Remedies in the Remedy Tracker | [16](16_REMEDY_TRACKER.md) |
| D-12 | Number of birth profiles | [13](13_BIRTH_PROFILES_AND_KUNDLI.md) |
| D-13 | Birth-chart upload formats | [13](13_BIRTH_PROFILES_AND_KUNDLI.md) |
| D-14 | Kundli update when birth details change | [13](13_BIRTH_PROFILES_AND_KUNDLI.md) |
| D-15 | Critical notifications | [15](15_NOTIFICATIONS.md) |
| D-16 | Notification channels | [15](15_NOTIFICATIONS.md) |

Approved interpretations (recorded in the review log, 2026-11-17): the
dispute must be raised within 7 days (calculation pending, P-06-17); email,
WhatsApp and SMS are not confirmed channels; security/account → modules 02
and 12 is a cross-reference only; critical notifications cannot be disabled
in app settings, while phone-level push permission behaviour is pending
(P-15-06).

### 2.2 Unresolved

Everything in sections 4–6 below. 131 open questions in 27 groups.

---

## 3. Decision groups at a glance

| Group | Title | Tier | P-IDs | Depends on |
|-------|-------|------|-------|------------|
| DG-01 | Subscription and Follow model | 1 | 10 | — |
| DG-02 | Campaigns and question slots | 1 | 4 | DG-01 |
| DG-03 | Service definitions and consultation modes | 1 | 5 | — |
| DG-04 | Services tab, Explore boundary, service entry points | 1 | 5 | DG-01, DG-03 |
| DG-05 | Payment model and wallet | 1 | 10 | DG-07 |
| DG-06 | Account access and onboarding | 1 | 7 | DG-07 |
| DG-07 | Platforms, languages, accessibility, offline | 1 | 4 | — |
| DG-08 | How 7-day periods are calculated | 2 | 1 | — |
| DG-09 | Consultation pricing and billing | 2 | 4 | DG-03, DG-05 |
| DG-10 | Failures, non-delivery, and refunds | 2 | 6 | DG-03, DG-05 |
| DG-11 | Critical notifications and channels | 2 | 4 | DG-03, DG-07 |
| DG-12 | Birth profile use in services | 2 | 4 | DG-03, DG-13 |
| DG-13 | Privacy, consent, and data retention | 2 | 2 | — |
| DG-14 | Placement of secondary modules | 2 | 8 | DG-04 |
| DG-15 | Appointment booking rules | 3 | 4 | DG-03, DG-10 |
| DG-16 | Question and consultation content | 3 | 4 | DG-02, DG-03 |
| DG-17 | Disputes | 3 | 4 | DG-08 |
| DG-18 | Reviews | 3 | 3 | DG-03 |
| DG-19 | Birth profile data and Kundli | 3 | 6 | DG-12, DG-13 |
| DG-20 | Activity and history | 3 | 7 | DG-04, DG-05, DG-13 |
| DG-21 | Remedy Tracker | 3 | 6 | DG-11 |
| DG-22 | Non-critical notifications and notification list | 3 | 4 | DG-11 |
| DG-23 | Astrologer discovery | 3 | 5 | DG-04 |
| DG-24 | Astrologer profile content | 3 | 4 | DG-01, DG-02, DG-04 |
| DG-25 | Home | 3 | 3 | DG-04 |
| DG-26 | Profile and settings | 3 | 4 | DG-07, DG-14 |
| DG-27 | Help and support | 3 | 3 | DG-17 |

---

## 4. Tier 1 — Blocking decisions

### DG-01 — Subscription and Follow model

**P-IDs:** P-14-01, P-14-02, P-14-03, P-14-04, P-14-05, P-06-01, P-06-03, P-07-08, P-08-06, P-09-06

**Decision needed:** What exactly is a subscription to an astrologer, is
"Follow" something different, and which services require a subscription?

**Explanation:** It is confirmed that a user must subscribe before asking a
Text Question (D-04), but nothing else about subscriptions is defined.
Examples of what is unclear:
- A user taps "Subscribe" on an astrologer. Do they pay? For how long does it last?
- After subscribing, does the user still need to buy question slots, or does the subscription include some?
- If the subscription ends while the user still holds an unused slot, can they still use it?
- Does the user need to subscribe before booking an Appointment or starting an Instant Call/Chat with that astrologer?

**Options:**
- Follow vs Subscribe (P-14-01): (a) one action; (b) Follow is free and only for updates, Subscribe is separate.
- Subscription nature (P-14-02, P-14-03): (a) free; (b) paid one-time; (c) paid for a period (e.g. monthly).
- Subscription and slots (P-06-01): (a) subscription only unlocks the right to buy slots; (b) subscription includes some slots.
- Renewal (P-14-04): (a) manual; (b) automatic with opt-out; (c) not applicable if free.
- Cancellation (P-14-05): (a) no refund; (b) partial; (c) full within a period.
- Effect of ending (P-06-03): (a) held slots stay usable until their own expiry; (b) held slots become unusable.
- Other services (P-07-08, P-08-06, P-09-06): (a) subscription required; (b) not required — decided per service.

**Already confirmed:** D-04, D-05, D-06, D-07.

**Depends on:** none. Decide first.

**Blocks:** DG-02, DG-04, DG-05, DG-24; files 05, 06, 07, 08, 09, 10, 14.

---

### DG-02 — Campaigns and question slots

**P-IDs:** P-06-13, P-06-12, P-06-15, P-06-04

**Decision needed:** What a campaign contains, and the exact limits on how
slots from a campaign can be used.

**Explanation:** Users buy question slots from an astrologer's active
campaigns (D-05). Examples of what is unclear:
- A campaign could say "price X per question, 20 slots available, until 30 June" — which of these fields exist?
- Can one user buy 10 slots from the same campaign?
- Does one slot always equal one question?
- Can a slot bought from Astrologer A be used to ask Astrologer B?
- The astrologer ends a campaign early. What happens to slots users already bought?

**Options:**
- Campaign fields (P-06-13): any combination of price per slot, slots offered, start/end dates, description.
- Per-user limit (P-06-13): (a) no limit; (b) fixed limit per campaign.
- One slot = one question (P-06-12): (a) yes; (b) other ratio.
- Same astrologer only (P-06-15): (a) yes; (b) no.
- Campaign ends or changes (P-06-04): (a) bought slots unaffected until their 7-day expiry; (b) other behaviour.

**Already confirmed:** D-05, D-06, D-07.

**Depends on:** DG-01 (whether subscription includes slots).

**Blocks:** DG-16, DG-24; files 05, 06, 10.

---

### DG-03 — Service definitions and consultation modes

**P-IDs:** P-07-09, P-08-07, P-09-07, P-07-03, P-08-05

**Decision needed:** Confirm what each consultation service is and how it
is delivered.

**Explanation:** The names "Appointment", "Instant Call", and "Instant Chat"
suggest scheduled vs on-demand, but this was never confirmed. Examples:
- Is an Appointment always booked for a future date and time, or can it be "as soon as possible"?
- Is an Appointment conducted by voice call, video, chat, or user's choice?
- Is an Instant Call voice only, or can it be video?

**Options:**
- Appointment (P-07-09, P-07-03): (a) booked in advance for a date/time; mode: voice / video / chat / user's choice.
- Instant Call (P-08-07, P-08-05): (a) starts immediately without booking; voice only / voice and video.
- Instant Chat (P-09-07): (a) starts immediately without booking; (b) other.

**Already confirmed:** D-09, D-10, D-11 apply to these services regardless of definition.

**Depends on:** none.

**Blocks:** DG-04, DG-09, DG-10, DG-11, DG-12, DG-15, DG-16, DG-18; files 07, 08, 09.

---

### DG-04 — Services tab, Explore boundary, and service entry points

**P-IDs:** P-01-07, P-01-08, P-01-13, P-05-06, P-01-09

**Decision needed:** What appears in the Services tab, how it differs from
Explore, where a service can be started from, and where held slots are
shown.

**Explanation:** Services is for new services (D-02) and Activity for
purchased/used ones (D-03), but the details are open. Examples:
- A user wants a Text Question. Do they start in Services ("Text Question" card) and then pick an astrologer, or in Explore by picking an astrologer first?
- On an astrologer's profile, are there buttons like "Subscribe", "Ask", "Book", "Call", "Chat"?
- A user bought 3 slots and used 1. Are the 2 remaining slots shown in Activity, in Services, or in both?

**Options:**
- Services tab content (P-01-07): (a) one card per service type; (b) other layout.
- Explore vs Services (P-01-08): (a) Explore = astrologers, Services = service types; (b) overlap allowed.
- Profile actions (P-05-06, P-01-13): any combination of follow/subscribe, ask, book, call, chat.
- Held slots (P-01-09): (a) Activity; (b) Services; (c) both.

**Already confirmed:** D-01, D-02, D-03.

**Depends on:** DG-01, DG-03.

**Blocks:** DG-14, DG-20, DG-23, DG-24, DG-25; files 01, 04, 05, 06–09, 11.

---

### DG-05 — Payment model and wallet

**P-IDs:** P-10-01, P-10-02, P-10-03, P-10-04, P-10-05, P-10-06, P-10-07, P-10-08, P-08-02, P-09-02

**Decision needed:** How users pay, what the wallet does, and where money
goes back to.

**Explanation:** A wallet exists, but none of its rules are defined.
Examples:
- Which currency is shown?
- A user buys 2 question slots. Must they top up the wallet first, or can they pay directly with another payment method?
- An appointment is refunded. Does the money go back to the wallet or to the original payment method?
- Can a user withdraw remaining wallet balance to their bank?
- Must a user have a minimum balance before starting an Instant Call or Chat?

**Options:**
- Currency (P-10-01): (a) single currency; (b) multiple.
- Payment route (P-10-04): (a) wallet only; (b) direct payment only; (c) both.
- Top-up methods and limits (P-10-02, P-10-03): to be listed.
- Refund destination (P-10-05): (a) wallet; (b) original method; (c) depends on case.
- Withdrawal (P-10-06): (a) allowed; (b) not allowed.
- Minimum balance (P-08-02, P-09-02): (a) none; (b) fixed amount; (c) enough for a minimum duration.
- Invoices/receipts and tax (P-10-07, P-10-08): what is issued and shown.

**Already confirmed:** D-05; D-07 (no refund for expired unused slots); D-15 (payment/wallet alerts are critical).

**Depends on:** DG-07 (region/platform affects currency and payment methods).

**Blocks:** DG-09, DG-10, DG-20; files 06–10, 14.

---

### DG-06 — Account access and onboarding

**P-IDs:** P-02-01, P-02-02, P-01-10, P-02-03, P-02-04, P-02-05, P-02-07

**Decision needed:** How users sign up and log in, what they can do without
logging in, and what onboarding contains.

**Explanation:** Examples:
- Does a user log in with a phone number and OTP, email and password, or Google/Apple?
- Can someone browse astrologers before creating an account?
- Must a new user enter their birth details during sign-up, or can they skip?
- Is there a minimum age?
- Are there welcome screens explaining the app?

**Options:**
- Login (P-02-01): phone OTP / email / social / combination.
- Guest browsing (P-02-02, P-01-10): (a) allowed with limited tabs; (b) login required first.
- Birth profile at onboarding (P-02-03): (a) required; (b) optional; (c) not part of onboarding.
- Minimum age (P-02-04): age and how it is checked.
- Language step (P-02-05): (a) yes; (b) no.
- Welcome screens (P-02-07): (a) yes, content to define; (b) none.

**Already confirmed:** D-12 (if birth profiles are created here); D-15 (security and account alerts are critical).

**Depends on:** DG-07 (languages).

**Blocks:** files 01, 02, 12, 13.

---

### DG-07 — Platforms, languages, accessibility, offline

**P-IDs:** P-GL-01, P-GL-02, P-GL-04, P-GL-05

**Decision needed:** Where the app runs, which languages it supports, and
general quality targets.

**Explanation:** Examples:
- Is the User App built for Android, iOS, web, or all three?
- Is the app in English only at launch, or also other languages?
- What happens if the user opens the app without internet?

**Options:**
- Platforms (P-GL-02): Android / iOS / web / combination.
- Languages (P-GL-01): list; launch vs later.
- Accessibility (P-GL-04): target level to define.
- Offline (P-GL-05): (a) show an offline message only; (b) show cached content.

**Already confirmed:** none directly.

**Depends on:** none.

**Blocks:** DG-05, DG-06, DG-11, DG-26.

---

## 5. Tier 2 — High-impact decisions

### DG-08 — How 7-day periods are calculated

**P-IDs:** P-06-17

**Decision needed:** The exact way "7 days" is counted for slot expiry and
the dispute window.

**Explanation:** The 7-day rules are confirmed (D-07, D-08), but the
calculation is not. Example: a slot bought on Monday at 10:00 PM —
(a) expires next Monday at 10:00 PM, or (b) at the end of next Monday,
11:59 PM? In which time zone?

**Options:** (a) exactly 7 × 24 hours from the event time; (b) until the end
of the 7th calendar day; plus the time zone used.

**Already confirmed:** D-07, D-08.

**Depends on:** none.

**Blocks:** DG-17; file 06.

---

### DG-09 — Consultation pricing and billing

**P-IDs:** P-08-01, P-08-03, P-09-01, P-09-03

**Decision needed:** How Instant Calls and Instant Chats are priced and
billed, including limits and disconnections.

**Explanation:** Examples:
- Is an Instant Call charged per minute, or a fixed price per session?
- A call drops after 4 minutes. Is the user charged for 4 minutes?
- Is there a maximum chat session length?

**Options:**
- Pricing (P-08-01, P-09-01): (a) per minute; (b) fixed per session; (c) packages.
- Disconnection billing (P-08-03): (a) charged for time used; (b) other rule.
- Chat session limits (P-09-03): (a) none; (b) fixed limit; (c) limited by balance.

**Already confirmed:** none directly.

**Depends on:** DG-03, DG-05.

**Blocks:** files 08, 09, 10.

---

### DG-10 — Failures, non-delivery, and refunds

**P-IDs:** P-06-08, P-07-05, P-07-06, P-08-04, P-08-08, P-09-08

**Decision needed:** What happens when a service is not delivered, and when
a user gets money back.

**Explanation:** Examples:
- An astrologer never answers a Text Question. Is there a deadline? Does the user get the slot or money back?
- The user or astrologer does not join an appointment.
- An Instant Call fails to connect.
- The astrologer does not accept an Instant Chat request.

**Options (per case):** (a) full refund; (b) partial refund; (c) slot or
credit returned; (d) no refund — plus deadlines where relevant.

**Already confirmed:** D-07 (expired unused slots are not refunded; that
is a different case from non-delivery).

**Depends on:** DG-03, DG-05.

**Blocks:** DG-15; files 06–10.

---

### DG-11 — Critical notifications and channels

**P-IDs:** P-15-01, P-15-03, P-15-06, P-15-08

**Decision needed:** Which events produce critical notifications, how
always-ON works with phone settings, which categories apply to calls,
chats, and remedies, and whether more channels will be added.

**Explanation:** Critical categories and the push/in-app channels are
confirmed (D-15, D-16). Examples of what is open:
- Which question events are critical: answer received, dispute update, slot about to expire?
- A user turns off push notifications for the app in phone settings. Should the app show a warning, rely on in-app only, or do nothing?
- An astrologer accepts an Instant Chat request. Is that notification critical?
- Will email, WhatsApp, or SMS be added later?

**Options:**
- Events per category (P-15-03): list to define.
- Phone-level push off (P-15-06): (a) in-app only; (b) in-app plus a reminder to re-enable; (c) other.
- Call/chat/remedy (P-15-08): critical or non-critical, per type.
- Extra channels (P-15-01): (a) none; (b) add email / WhatsApp / SMS for selected notifications.

**Already confirmed:** D-15, D-16.

**Depends on:** DG-03, DG-07.

**Blocks:** DG-21, DG-22; files 02, 06–10, 12, 14, 15, 16.

---

### DG-12 — Birth profile use in services

**P-IDs:** P-06-07, P-13-09, P-13-04, P-13-05

**Decision needed:** How birth profiles are shared with astrologers in each
service, and what happens to past consultations when a profile changes or
is deleted.

**Explanation:** Examples:
- A user has profiles for self and spouse. When asking a question, how do they choose which one to share?
- Is a birth profile shared for appointments, calls, and chats too?
- The user edits a birth date after a past consultation. Should the past consultation still show the old details?
- Can the user delete a profile already used in a consultation?

**Options:**
- Sharing (P-06-07, P-13-09): (a) user picks one per service; (b) default profile; (c) not shared for some services.
- Past consultations (P-13-05): (a) keep a snapshot of details used; (b) always show current details.
- Delete used profile (P-13-04): (a) allowed; (b) blocked; (c) allowed but kept in history.

**Already confirmed:** D-12, D-13, D-14.

**Depends on:** DG-03, DG-13.

**Blocks:** DG-19; files 06–09, 13.

---

### DG-13 — Privacy, consent, and data retention

**P-IDs:** P-GL-03, P-02-06

**Decision needed:** How personal and birth data is handled, and what
happens when a user deletes their account.

**Explanation:** Birth details and uploaded charts are personal data.
Examples: Does the user consent before sharing birth data with an
astrologer? After account deletion, are consultations, uploads, and
transactions erased, anonymised, or retained?

**Options:** retention period per data type; consent points; deletion
behaviour per data type.

**Already confirmed:** none directly.

**Depends on:** none.

**Blocks:** DG-12, DG-19, DG-20; files 02, 12, 13.

---

### DG-14 — Placement of secondary modules

**P-IDs:** P-01-01, P-01-02, P-01-03, P-01-04, P-01-05, P-01-06, P-01-11, P-01-12

**Decision needed:** Where modules that are not bottom-navigation tabs are
reached from, which tab opens first, and how tabs look.

**Explanation:** Five tabs are confirmed (D-01). Wallet, Following and
Subscriptions, Remedy Tracker, Notifications, Help, and Birth Profiles need
a home. Example: Wallet could be inside Profile, shown as a header icon, or
both.

**Options (per module):** (a) inside Profile; (b) inside Activity;
(c) header icon; (d) Home shortcut. Default tab (P-01-11): Home or another.
Badges (P-01-12): yes/no per tab.

**Already confirmed:** D-01, D-02, D-03.

**Depends on:** DG-04.

**Blocks:** DG-26; files 01, 10, 12–17.

---

## 6. Tier 3 — Module detail decisions

### DG-15 — Appointment booking rules

**P-IDs:** P-07-01, P-07-02, P-07-04, P-07-07

**Decision needed:** Booking window, durations, rescheduling/cancellation,
and reminder timing.

**Explanation:** Examples: Can a user book 2 months ahead? Are sessions
15/30/60 minutes? Can a user cancel 1 hour before? When is the reminder sent?

**Options:** values for each; cancellation tiers (e.g. free until X hours before).

**Already confirmed:** D-09, D-10; D-15 (appointment alerts are critical).

**Depends on:** DG-03, DG-10.

---

### DG-16 — Question and consultation content

**P-IDs:** P-06-06, P-06-11, P-06-14, P-09-04

**Decision needed:** What users and astrologers can send in questions,
answers, and chats.

**Explanation:** Examples: Maximum question length? Can a user attach a
photo? Can an astrologer answer by voice note? Can a user edit a question
after sending, and if they cancel, do they get the slot back? Can files be
sent in Instant Chat?

**Options:** text only / text plus attachments / voice; edit allowed until
answered or never; cancel returns slot or not.

**Already confirmed:** D-06, D-11.

**Depends on:** DG-02, DG-03.

---

### DG-17 — Disputes

**P-IDs:** P-06-09, P-06-10, P-06-16, P-17-04

**Decision needed:** How a Text Question dispute works after it is raised.

**Explanation:** A dispute requests an additional answer within 7 days of
the answer (D-08). Examples: Can the user dispute the additional answer
again? Who reviews the dispute — the same astrologer or the platform? How
long does the astrologer have to reply? Must the user write a reason? Is a
dispute raised through Help and Support or directly on the question?

**Options:** number of disputes (one / more); handler (astrologer /
platform / both); deadline value; required input (reason / details / none);
route (on the question / via support).

**Already confirmed:** D-08, D-09.

**Depends on:** DG-08.

---

### DG-18 — Reviews

**P-IDs:** P-06-05, P-07-10, P-05-03

**Decision needed:** What a review contains, whether Text Questions can be
reviewed, and how reviews are shown.

**Explanation:** Reviews after Appointment, Instant Call, and Instant Chat
are confirmed (D-10). Examples: 1–5 stars plus a comment? Is there a time
limit to submit? Can a user edit or delete a review? Can a user review a
Text Question? On the astrologer profile, are reviews shown newest first or
highest rated first?

**Options:** rating scale; comment optional/required; time limit; edit/delete
rules; Text Question review yes/no; display order.

**Already confirmed:** D-10.

**Depends on:** DG-03.

---

### DG-19 — Birth profile data and Kundli

**P-IDs:** P-13-01, P-13-02, P-13-03, P-13-06, P-13-07, P-13-08

**Decision needed:** Birth profile fields, how the Kundli is generated,
upload limits, and future profile limits.

**Explanation:** Examples: Is "relation" (self, spouse, child) a field?
North or South Indian chart style? Which language? Maximum file size? Should
the app warn that an uploaded chart may no longer match edited details? Can
the user replace an uploaded file? Will a free plan limit profiles in future?

**Options:** field list; chart style(s); language(s); size/count limits;
warning yes/no; replace allowed yes/no; future limits to decide later.

**Already confirmed:** D-12, D-13, D-14.

**Depends on:** DG-12, DG-13.

---

### DG-20 — Activity and history

**P-IDs:** P-11-01, P-11-02, P-11-03, P-11-04, P-11-05, P-10-09, P-09-05

**Decision needed:** How Activity is organised, what statuses and history
are shown, and how long history is kept.

**Explanation:** Examples: Tabs per service type, or one combined list?
Statuses like "Waiting for answer", "Answered", "Disputed", "Expired"? Is
wallet history inside Activity or separate? Are chat transcripts kept
forever? Where does the user tap to raise a dispute or write a review?

**Options:** tab structure; filter list; status list per service; retention
period; wallet history placement; dispute/review entry points.

**Already confirmed:** D-03, D-06, D-07, D-08, D-09, D-10.

**Depends on:** DG-04, DG-05, DG-13.

---

### DG-21 — Remedy Tracker

**P-IDs:** P-16-01, P-16-02, P-16-03, P-16-04, P-16-05, P-16-06

**Decision needed:** What a remedy record contains and what the user can do
with it.

**Explanation:** Every prescribed or attached remedy appears in the tracker
(D-11). Examples: Does a remedy show a title, instructions, duration? Can
the user tick "done" each day? Are daily reminders sent? Can users add their
own remedies? Does each remedy link back to the consultation? If the
astrologer edits a remedy later, does the tracker update?

**Options:** field list; progress tracking yes/no; reminders yes/no;
user-added yes/no; link back yes/no; astrologer edits update / keep original.

**Already confirmed:** D-11.

**Depends on:** DG-11 (whether remedy reminders are notifications, and their category).

---

### DG-22 — Non-critical notifications and notification list

**P-IDs:** P-15-02, P-15-04, P-15-05, P-15-07

**Decision needed:** Which notifications users can switch off, and how
notifications are listed.

**Explanation:** Examples: promotional offers, new campaign from a followed
astrologer, tips. Are there quiet hours (no notifications at night)? Must
users opt in to marketing? Is there an in-app notification list, and how
long are items kept?

**Options:** non-critical list; quiet hours yes/no; marketing opt-in
yes/no; notification list yes/no with retention period.

**Already confirmed:** D-15, D-16.

**Depends on:** DG-11.

---

### DG-23 — Astrologer discovery

**P-IDs:** P-04-01, P-04-02, P-04-03, P-04-04, P-05-04

**Decision needed:** How users search, filter, and sort astrologers, and how
availability is shown.

**Explanation:** Examples: search by name or specialty; filter by language,
price, rating, "online now"; sort by rating or price; default order; show
a green "online" badge.

**Options:** lists of search fields, filters, sort options; default ranking
rule; availability indicator style.

**Already confirmed:** D-01.

**Depends on:** DG-04.

---

### DG-24 — Astrologer profile content

**P-IDs:** P-05-01, P-05-02, P-05-05, P-17-05

**Decision needed:** What the profile shows and whether users can share or
report it.

**Explanation:** Examples: photo, bio, experience, languages, specialties,
prices. How active campaigns appear (a list of cards?). Can users share a
profile link or report an astrologer, and is reporting done from the
profile or through support?

**Options:** field list; campaign display style; share yes/no; report
yes/no and route.

**Already confirmed:** D-04, D-05, D-10.

**Depends on:** DG-01, DG-02, DG-04.

---

### DG-25 — Home

**P-IDs:** P-03-01, P-03-02, P-03-03

**Decision needed:** What the Home tab shows.

**Explanation:** Examples: shortcuts to services, featured astrologers,
upcoming appointment, active slots, banners. Is it personalised (e.g. based
on followed astrologers)?

**Options:** section list; personalisation basis; banners yes/no.

**Already confirmed:** D-01.

**Depends on:** DG-04.

---

### DG-26 — Profile and settings

**P-IDs:** P-12-01, P-12-02, P-12-03, P-12-04

**Decision needed:** User profile fields and the list of settings.

**Explanation:** Examples: name, phone, email, photo; theme (light/dark);
app language; privacy options (e.g. hide profile from astrologers).

**Options:** field list; settings list.

**Already confirmed:** D-01; D-15 (critical notifications cannot be
switched off in app settings).

**Depends on:** DG-07, DG-14.

---

### DG-27 — Help and support

**P-IDs:** P-17-01, P-17-02, P-17-03

**Decision needed:** How users get help.

**Explanation:** Examples: FAQ page, ticket form, live chat, phone/email
contact; ticket categories like "Payment", "Technical issue", "Astrologer
behaviour"; expected reply within 24 hours.

**Options:** channel list; category list; response-time targets.

**Already confirmed:** none directly (disputes are handled under D-08; see DG-17).

**Depends on:** DG-17.

---

## 7. Suggested decision order

1. DG-01, DG-03, DG-07 (no dependencies; unblock the most).
2. DG-02, DG-04, DG-05, DG-06, DG-08, DG-13.
3. DG-09, DG-10, DG-11, DG-12, DG-14.
4. DG-15 to DG-27.

This order is a sequencing aid only; it does not prioritise any answer.

---

## 8. Coverage

| Tier | Groups | P-IDs |
|------|--------|-------|
| 1 — Blocking | 7 | 45 |
| 2 — High impact | 7 | 29 |
| 3 — Module detail | 13 | 57 |
| **Total** | **27** | **131** |

Every open question in
[`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register)
appears in exactly one group. Retired ID P-06-02 is not included.

**P-IDs by module**

| Module | P-IDs | Group(s) |
|--------|-------|----------|
| GL | P-GL-01 – P-GL-05 | DG-07, DG-13 |
| 01 | P-01-01 – P-01-13 | DG-04, DG-06, DG-14 |
| 02 | P-02-01 – P-02-07 | DG-06, DG-13 |
| 03 | P-03-01 – P-03-03 | DG-25 |
| 04 | P-04-01 – P-04-04 | DG-23 |
| 05 | P-05-01 – P-05-06 | DG-04, DG-18, DG-23, DG-24 |
| 06 | P-06-01, P-06-03 – P-06-17 | DG-01, DG-02, DG-08, DG-10, DG-12, DG-16, DG-17, DG-18 |
| 07 | P-07-01 – P-07-10 | DG-01, DG-03, DG-10, DG-15, DG-18 |
| 08 | P-08-01 – P-08-08 | DG-01, DG-03, DG-05, DG-09, DG-10 |
| 09 | P-09-01 – P-09-08 | DG-01, DG-03, DG-05, DG-09, DG-10, DG-16, DG-20 |
| 10 | P-10-01 – P-10-09 | DG-05, DG-20 |
| 11 | P-11-01 – P-11-05 | DG-20 |
| 12 | P-12-01 – P-12-04 | DG-26 |
| 13 | P-13-01 – P-13-09 | DG-12, DG-19 |
| 14 | P-14-01 – P-14-05 | DG-01 |
| 15 | P-15-01 – P-15-08 | DG-11, DG-22 |
| 16 | P-16-01 – P-16-06 | DG-21 |
| 17 | P-17-01 – P-17-05 | DG-17, DG-24, DG-27 |
