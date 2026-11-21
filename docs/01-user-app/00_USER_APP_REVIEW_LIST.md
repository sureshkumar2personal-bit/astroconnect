# 00 — User App Documentation Review List

This file is the single place to track the status of every User App
specification, every confirmed decision, and every `PENDING DISCUSSION` item.

- Shared context: [`CONTEXT.md`](../../CONTEXT.md)
- Agent rules: [`CLAUDE.md`](../../CLAUDE.md)

---

## 1. How to use this file

1. Each module specification is tracked in §2 with a status.
2. A decision is added to §3 only when the product owner confirms it.
3. Every open question is listed in §4 with an ID. Specification files refer
   to these IDs instead of guessing.
4. When a product-owner question is answered and finalized (per [`CLAUDE.md`](../../CLAUDE.md) §5):
   keep its **original ID**; change its status to **Resolved**; record the
   finalized decision in the decision register (§3); keep the question and
   its resolution history in §4 — do not remove it; record the resolution
   date in the review log (§7); and do **not** mark it **Retired**.
   **Retired** is used only for questions that are genuinely withdrawn,
   obsolete, duplicate, or invalid, following the existing retirement process
   (remove from the open list, record the reason and date in the review log,
   add the ID to the retired-IDs list). Resolved and Retired IDs are never
   reused. Keep Open, Resolved, and Retired counts accurate.
   Update the owning specification.
5. Before a specification is marked **Approved**, run the checklists in §5
   and §6 and record the approval in §7.

**Status values:** `Not started` · `Draft` · `In review` · `Approved`

**Pending ID format:** `P-<file no.>-<nn>` (e.g. `P-06-03`); cross-cutting
items use `P-GL-<nn>`.

---

## 2. Module status tracker

| No. | File | Module | Status | Open pending items | Approved on |
|-----|------|--------|--------|--------------------|-------------|
| 00 | `00_USER_APP_REVIEW_LIST.md` | Review list | Draft | — | |
| 01 | `01_NAVIGATION_AND_STRUCTURE.md` | Navigation and structure | Draft | 13 | |
| 02 | `02_AUTHENTICATION_AND_ONBOARDING.md` | Authentication and onboarding | Draft | 7 | |
| 03 | `03_HOME.md` | Home | Draft | 3 | |
| 04 | `04_EXPLORE_AND_ASTROLOGER_DISCOVERY.md` | Explore and astrologer discovery | Draft | 4 | |
| 05 | `05_ASTROLOGER_PROFILE.md` | Astrologer profile | Draft | 6 | |
| 06 | `06_TEXT_QUESTION_SERVICE.md` | Text-based Question service | Draft | 6 | |
| 07 | `07_APPOINTMENT_SERVICE.md` | Appointment service | Draft | 5 | |
| 08 | `08_INSTANT_CALL.md` | Instant Call | Draft | 4 | |
| 09 | `09_INSTANT_CHAT.md` | Instant Chat | Draft | 2 | |
| 10 | `10_WALLET_AND_PAYMENTS.md` | Wallet and payments | Draft | 6 | |
| 11 | `11_ACTIVITY_AND_SERVICE_HISTORY.md` | Activity and service history | Draft | 5 | |
| 12 | `12_USER_PROFILE_AND_SETTINGS.md` | User profile and settings | Draft | 4 | |
| 13 | `13_BIRTH_PROFILES_AND_KUNDLI.md` | Birth profiles and Kundli | Draft | 9 | |
| 14 | `14_FOLLOWING_AND_SUBSCRIPTIONS.md` | Following and subscriptions | Draft | 5 | |
| 15 | `15_NOTIFICATIONS.md` | Notifications | Draft | 8 | |
| 16 | `16_REMEDY_TRACKER.md` | Remedy tracker | Draft | 4 | |
| 17 | `17_HELP_AND_SUPPORT.md` | Help and support | Draft | 5 | |
| 18 | [`18_PENDING_DECISIONS_REPORT.md`](18_PENDING_DECISIONS_REPORT.md) | Pending decisions report (snapshot as of 2026-11-17: 131 pending questions in 27 decision groups) | Draft / Reference | — | |
| GL | — | Cross-cutting | — | 5 | |

---

## 3. Confirmed decisions register

Only decisions confirmed by the product owner appear here. This register is
the **official decision log**: it records each decision verbatim. The
**owning file** contains the detailed rules and implementation requirements
for the decision. All other files reference the decision ID and owning file
instead of repeating the full rule.

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| D-01 | The User App bottom navigation is finalized as five tabs: **Home, Explore, Services, Activity, Profile**. | 01 | All | ✅ |
| D-02 | **Services** is used to discover, start, and purchase **new** services. | 01 | 06–09 | ✅ |
| D-03 | **Activity** is used to manage services **already purchased or used**. | 01 | 11 | ✅ |
| D-04 | A user must **subscribe** to an astrologer before asking that astrologer a question. | 06 | 05, 14 | ✅ |
| D-05 | Users can purchase **multiple question slots** from an astrologer's **active campaigns**. | 06 | 05, 10 | ✅ |
| D-06 | A purchased slot can be **used immediately or held** for later. There is **no waiting period**: the user can submit a question immediately after purchase. **Holding a slot does not pause or extend** its expiry period. | 06 | 11 | ✅ |
| D-07 | A purchased question slot must be used by the **earlier of (1) 7 days from its purchase date and (2) the campaign expiry date**. An unused slot **expires automatically** at that point. **No refund** is given for an expired unused slot, even if expiry reminders were sent. *(Amended 2026-11-19.)* | 06 | 10, 11, 15 | ✅ |
| D-08 | Text Questions have a **dispute** option. A dispute can be raised **within 7 days after receiving the astrologer's answer**; its purpose is to **request an additional answer**. | 06 | 11, 17 | ✅ |
| D-09 | Appointments, Instant Calls, and Instant Chats **do not** have a dispute option. | 07, 08, 09 | 11 | ✅ |
| D-10 | **Reviews after consultations:** after an Appointment, Instant Call, or Instant Chat consultation, the user gives a **mandatory** 1–5 star rating; written feedback is **optional**. A submitted review cannot be edited or deleted by the user; changes are requested through Platform Support. *(Amended 2026-11-20: rating mandatory, written feedback optional, no user edit/delete — Astrologer AD-129, X-18; supersedes "Users can submit a review after an Appointment, Instant Call, or Instant Chat consultation". Enforcement mechanism not confirmed — Astrologer AP-10-01.)* | 07, 08, 09 | 05, 11 | ✅ |
| D-11 | If an astrologer prescribes or attaches a **remedy in any service** — including a Text Question answer and a Dispute Answer — it must also appear in the user's **Remedy Tracker**. *(Amended 2026-11-19.)* | 16 | 06–09 | ✅ |
| D-12 | Users can initially save **unlimited birth profiles**. Future free/paid limits are **not finalized** (see P-13-07). | 13 | 02 | ✅ |
| D-13 | Users can upload birth-chart files/images in **JPG, PNG, or PDF** format. | 13 | — | ✅ |
| D-14 | If **DOB, birth time, or birth place** is changed, the generated **Kundli updates automatically**. Uploaded JPG/PNG/PDF files **remain unchanged**. | 13 | — | ✅ |
| D-15 | **Critical notifications are always ON** and cannot be disabled. These include **appointment, question, payment/wallet, subscription, security, and account** alerts. | 15 | 12 | ✅ |
| D-16 | Confirmed notification channels: **push** and **in-app**. **Email, WhatsApp, and SMS are not confirmed** (see P-15-01). | 15 | — | ✅ |
| D-17 | Immediately after a Text Question answer is delivered, the user gives a **mandatory** rating (1–5 stars); a written review is **optional**. Rating and review do not block or prevent a dispute. A submitted review cannot be edited or deleted by the user; changes are requested through Platform Support. *(Amended 2026-11-20: rating mandatory — Astrologer AD-40, X-18; supersedes "Users can rate (1–5 stars) and review a Text Question answer immediately after it is delivered".)* | 06 | 05, 11 | ✅ |
| D-18 | The astrologer must answer a submitted Text Question within **30 days** (IST calendar days, D-28). If it is not answered within the deadline, the system automatically cancels the question and the user is refunded. | 06 | 10, 11 | ✅ |
| D-19 | **Disputes:** one dispute per question, raised within 7 days after the answer (D-08). The astrologer answers the dispute once, within **3 days**; if it is not answered within 3 days, the dispute moves to **Admin Review**. No further dispute can be raised after the dispute answer. | 06 | 11, 17 | ✅ |
| D-20 | **Campaigns and pricing (user view):** a campaign offers General only, Personal only, or both. General Questions are answered without the user's Horoscope/Birth Chart; Personal Questions are answered based on it. General and Personal have separate prices and optional, separate discounts (maximum 99%). The user sees the **original price, discount percentage, and final payable price**. A special or occasion-based campaign uses the same campaign workflow and always carries a clear **Special Campaign label/type**; the label is **mandatory**. Open Questions (asked without a campaign) also offer General and Personal. *(Amended 2026-11-20: Special Campaign label mandatory — Astrologer AD-26, X-25; supersedes "shown as a normal campaign with an optional special title/label, not as a separate workflow".)* | 06 | 05, 10 | ✅ |
| D-21 | **Campaign changes protect purchases:** cancellation, deletion, or slot reduction of a campaign by the astrologer does not cancel or invalidate already submitted paid questions; the astrologer must still answer them. When a campaign is **cancelled**, the user receives a **refund for purchased unused slots** (to the Wallet, D-32). When a campaign is **deleted**, no refund is issued merely because of the deletion, and a purchased, unused slot remains usable until its original deadline (D-07: the earlier of purchase + 7 days and the campaign's original expiry date); deletion neither expires it immediately nor extends or resets that deadline (whether the cancellation refund also applies to deletion is open — Astrologer AP-02-24). Slot reduction does not cancel purchased slots or submitted questions. If the astrologer extends a campaign, the extension also applies to unused purchased slots; reactivating a campaign does not restore already expired slots. *(Amended 2026-11-19. Amended 2026-11-20: refund of purchased unused slots on cancellation — Astrologer AD-31, X-16; supersedes "No refund is issued merely because a campaign was cancelled" and slot usability after cancellation.)* | 06 | 10, 11 | ✅ |
| D-22 | **User question:** question text has a maximum of **1,000** characters. General Questions allow no attachments. Personal Questions allow up to **2** attachments (Horoscope/Birth Chart files or images). | 06 | — | ✅ |
| D-23 | **Answers:** the astrologer's answer is text (typed, or converted from voice), with a maximum of **1,500** characters, up to 3 attachments (JPEG, PDF, TXT), and links. Audio-only answers are not provided. An answer cannot be edited after it is delivered. | 06 | — | ✅ |
| D-24 | Users **cannot manually cancel** a paid, submitted Text Question. | 06 | 11 | ✅ |
| D-25 | **Text Question statuses shown to users:** New / Received (question submitted), Pending (the astrologer has opened the question), Completed (answer delivered). The astrologer-side "Settled" status and settlement details are internal and are not shown in the User App. | 06 | 11 | ✅ |
| D-26 | **Expiry warning and reminders:** if a campaign is within 3 days of expiry, the user is warned before purchase. Expiry reminders are sent **3 days, 2 days, and 1 day** before expiry. Reminders do not change the expiry or refund rules. | 06 | 15 | ✅ |
| D-27 | **Platform Complaint:** after a dispute answer, the user may raise a separate Platform Complaint within 7 days about an inappropriate or improper answer. The platform handles complaints separately from disputes. | 06 | 17 | ✅ |
| D-28 | **IST calendar days:** slot expiry, answer deadlines, dispute windows, dispute answer deadlines, and reminder timing use IST calendar-day counting. | 06 | 07, 10, 15 | ✅ |
| D-29 | **Remedy completion:** only the user can mark a remedy Completed. The user may upload a supporting photo or document, which the prescribing astrologer can view. | 16 | 06 | ✅ |
| D-30 | **Astrologer DND / Planned Unavailability:** during this period no new service with the astrologer can be purchased, booked, submitted, or started, and the astrologer's profile is hidden (D-38). **Existing confirmed appointments remain valid.** If the astrologer closes a date that already has confirmed appointments, D-41 applies. *(Amended 2026-11-20: confirmed appointments remain valid — Astrologer AD-07, AD-09, X-17; supersedes "Already-booked appointments falling within the period are cancelled and the user receives a full refund; new appointment bookings are blocked for the unavailable dates".)* | 07 | 06, 10, 15 | ✅ |
| D-31 | **Subscription benefit questions:** a Silver subscription includes **1** benefit question, Gold includes **3**, and Platinum includes **4**. Benefit questions are shown separately from additional normal paid questions purchased by subscribers. Subscription benefit questions follow the existing **7-day purchased-slot validity** rule (D-07). *(Amended 2026-11-19.)* | 14 | 06 | ✅ |
| D-32 | **Refunds and withdrawals:** all user refunds go to the user's in-app **Wallet**. Users may withdraw wallet funds to their bank account, but the wallet must keep a minimum balance of **₹500** after withdrawal: only the amount above ₹500 can be withdrawn, and a withdrawal that would leave less than ₹500 is not allowed. | 10 | 06, 07 | ✅ |
| D-33 | **Payment methods:** users can pay with their existing **Wallet** balance or by **direct payment** using UPI or bank/payment methods. Using the Wallet is not mandatory for every payment. | 10 | 06 | ✅ |
| D-34 | **Question submission:** a **Preview** step is shown before final submission, following the same preview-before-final-submission principle as the astrologer answer workflow. After final submission, a question **cannot be edited**. General-to-Personal question conversion or upgrade is **not offered** in the User App. | 06 | — | ✅ |
| D-35 | **Question attachments:** for Personal Questions (D-22), users may attach horoscope files in **PDF or JPEG** format — at most **2 files** per question and at most **10 MB** per file. Alternatively, users may use the birth details already saved in their User Profile. These rules are separate from astrologer answer attachment rules. | 06 | 13 | ✅ |
| D-36 | **Follow and Subscribe:** Follow is **free**, and following an astrologer never subscribes automatically. Subscribe is **paid**, and a successful subscription automatically follows that astrologer. Auto-renewal is optional and is **not enabled by default**. Subscription price, duration/term options, detailed renewal rules, and cancellation/refund rules are on hold (P-14-02 – P-14-05). | 14 | 05 | ✅ |
| D-37 | **Consent for sharing birth data:** birth details and horoscope information are shared with an astrologer only with the user's **consent** for the relevant paid service. The User App follows normal privacy and consent practices commonly used in astrology applications; no additional privacy rules, retention periods, or legal claims are defined. | 13 | 06 | ✅ |
| D-38 | **Astrologer DND / Planned Unavailability (user view):** while an astrologer's DND is active, the astrologer's profile is **hidden** — users cannot discover or view it, cannot purchase or submit new Text-Based Questions (including Campaign Questions, Open Questions, and Subscription Questions), cannot book Appointments, and cannot start Instant Calls or Instant Chats. Existing purchased question slots keep their established validity and expiry rules (D-07). | 05 | 04, 06, 07, 08, 09 | ✅ |
| D-39 | **Astrologer Text-Based Questions service suspension (user view):** while an astrologer's Text-Based Questions service is suspended, users cannot buy new question slots from that astrologer or submit questions using newly purchased capacity. Previously purchased valid slots remain usable under the existing validity rules (D-07), and already submitted questions continue under their normal answer deadline and resolution rules (D-18, D-19). The astrologer's other services remain available unless independently unavailable; the astrologer account is not suspended. | 06 | 05 | ✅ |
| D-40 | **Appointment definition and booking:** an Appointment is a **voice-only** consultation booked in advance for a specific date and time; there are no video appointments. The user chooses an astrologer, views available slots and prices, books, and pays. Successful payment **immediately confirms** the appointment, without astrologer approval. Durations are **15 or 30 minutes**, each with its own price. Slots can be booked within a **rolling 90-day** booking horizon. Price changes apply only to future bookings; a confirmed booking keeps its booked price. During payment the selected slot is held for **10 minutes**; if payment fails or the hold expires, the slot is released. The same slot can never be booked twice. | 07 | — | ✅ |
| D-41 | **Appointment cancellation, rescheduling, and no-shows:** the user cancellation policy is **12 hours before the appointment**; late cancellation follows the late-cancellation percentage deduction, whose value is not yet recorded (Astrologer AP-05-01); a user no-show follows the same policy. If the astrologer cancels, the user chooses a reschedule or a **full refund to the Wallet**. If the astrologer closes a date that has the user's confirmed appointment, the user is offered a reschedule or a full Wallet refund; if the user cannot be informed in advance, the appointment is cancelled automatically and refunded. The astrologer cannot reschedule the user's booking; the user may reschedule **once**. If the astrologer does not show, the user receives a full Wallet refund. | 07 | 10 | ✅ |
| D-42 | **Joining an appointment and technical problems:** the user and the astrologer may join **5 minutes before** the scheduled time; a **5-minute grace period** applies after it, after which no-show handling applies (D-41). On technical disconnection, automatic reconnection is attempted for **5 minutes** and the remaining appointment time is preserved. If the appointment cannot continue because of technical failure, the Platform reviews it and the user receives a reschedule option; neither participant is blamed automatically. | 07 | — | ✅ |
| D-43 | **Appointment reminders:** the user receives a notification immediately after booking confirmation; 3 days, 2 days, and 1 day before; on the appointment day 1 hour and 15 minutes before; and immediately after a cancellation or rescheduling. Only one reminder is sent for each interval. | 07 | 15 | ✅ |
| D-44 | **Instant Call and Instant Chat requests:** Instant Call and Instant Chat are separate choices for a consultation started immediately, without prior booking. After choosing one, the user sees the astrologers currently available for that service, selects one, and sends a request; the user is never routed automatically to another astrologer. The astrologer must accept within **30 seconds**; otherwise the request **expires**. A rejected request is **Declined**, and the user is offered **Try Again** or **Try Some Other Astrologer**; the same request is not re-sent automatically to the same astrologer. The user may cancel a request before it is accepted. A request sent while the astrologer already has a pending request or active consultation receives a **Busy** response. | 08, 09 | — | ✅ |
| D-45 | **Prepaid packages and sessions:** Instant Call and Instant Chat use **prepaid packages**, not per-minute billing. Packages (minimum **5 minutes**) are shown on the astrologer's profile, and the user pays the whole package before the session starts. Either party may end the session early; there is **no refund for early termination**. The extension option appears **1 minute before** the package ends; paying for the next package before expiry continues the same session, otherwise the session ends automatically. If an astrologer deliberately ends a session early without answering, the user may submit a Platform complaint/review; the Platform investigates; no automatic refund is issued. | 08, 09 | 05, 10 | ✅ |
| D-46 | **Instant Call and Chat technical failure:** for an Instant Call, automatic reconnection is attempted for **5 minutes** and the remaining paid time is preserved. Instant Chat messages are saved and available after reconnection. The session ends automatically when the package time expires. Handling when reconnection permanently fails is not confirmed (Astrologer AP-06-01). | 08, 09 | — | ✅ |
| D-47 | **Chat history (24-hour rule):** full chat messages are accessible to the user and the astrologer for **24 hours only**; after 24 hours they are inaccessible to both. Booking details, consultation date/time, astrologer details, and payment records remain visible in history. The same rule applies in the Astrologer App. | 09 | — | ✅ |
| D-48 | **Astrologer profile content (user view):** the astrologer's Instant Call and Instant Chat packages are shown on the profile. When an astrologer's selected important profile changes are awaiting Platform Admin approval, the user continues to see the previously verified details. | 05 | 08, 09 | ✅ |
| D-49 | **Review visibility:** reviews hidden by the astrologer or Platform Admin are not shown in the User App. The public overall rating uses **Published** reviews only. | 05 | — | ✅ |
| D-50 | **Live Sessions and posts (user view):** Live Sessions are free; only the audience selected by the astrologer (Public, Followers, Subscribers, or specific subscription tiers) receives Live notifications and can comment; there is no recording or replay. Users can Like and Comment on astrologers' General Posts. Subscriber-only content is available only to users with an active subscription of the selected tier; users with an expired subscription cannot access it. | 14 | — | ✅ |
| D-51 | **Remedy Tracker links:** notes, remedies, recommendations, and reports that an astrologer attaches after an Appointment also appear in the user's Remedy Tracker, and each item links back to its originating Appointment/Consultation. | 16 | 07 | ✅ |

### Documentation process decisions

| ID | Decision | Confirmed |
|----|----------|-----------|
| DOC-01 | Each User App module has its own Markdown specification file. | ✅ |
| DOC-02 | Navigation and structure has its own file: `01_NAVIGATION_AND_STRUCTURE.md`. | ✅ |
| DOC-03 | Birth Profiles and Kundli has its own file: `13_BIRTH_PROFILES_AND_KUNDLI.md`. | ✅ |
| DOC-04 | All documentation work happens on the `main` branch. | ✅ |
| DOC-05 | Documentation is based only on confirmed requirements; all unresolved items are marked `PENDING DISCUSSION`. | ✅ |

---

## 4. PENDING DISCUSSION register

**Open** items may not be treated as decisions until confirmed by the
product owner. When a question is answered, it stays in this list with its
original ID and status **Resolved**, and the decision is recorded in §3 and
the review log §7 (§1, step 4). **Retired** applies only to withdrawn,
obsolete, duplicate, or invalid questions. Resolved and Retired IDs are never
reused. Questions retired under the previous process are listed in §7 and
are not restored.

### GL — Cross-cutting

| ID | Question | Status |
|----|----------|--------|
| P-GL-01 | Which languages does the User App support? Is localisation required at launch? | Open |
| P-GL-02 | Target platforms: Android, iOS, web, or a combination? | Open |
| P-GL-03 | Privacy, consent, and data-retention rules for birth data and uploaded files. | Open — consent for sharing birth data is confirmed (D-37); retention and other rules are not confirmed |
| P-GL-04 | Accessibility targets. | Open |
| P-GL-05 | Expected behaviour when the device is offline. | Open |

### 01 — Navigation and structure

| ID | Question | Status |
|----|----------|--------|
| P-01-01 | Where is the **Wallet** accessed from (Profile, Activity, header, other)? | Open |
| P-01-02 | Where are **Following and Subscriptions** accessed from? | Open |
| P-01-03 | Where is the **Remedy Tracker** accessed from? | Open |
| P-01-04 | Where are **Notifications** accessed from (e.g. header icon, Profile)? | Open |
| P-01-05 | Where is **Help and Support** accessed from? | Open |
| P-01-06 | Where are **Birth Profiles and Kundli** accessed from? | Open |
| P-01-07 | Exactly which services are listed under the **Services** tab, and how are they laid out? | Open |
| P-01-08 | What is the boundary between **Explore** (astrologer discovery) and **Services** (service discovery)? | Open |
| P-01-09 | Do purchased-but-unused (held) question slots appear in **Activity**, **Services**, or both? | Open |
| P-01-10 | What navigation is available to a user who is not logged in (depends on P-02-02)? | Open |
| P-01-11 | Which tab opens by default after login and app launch? | Open |
| P-01-12 | Tab icons, labels, and whether tabs show badges/counters. | Open |
| P-01-13 | From which screens is an Astrologer Profile opened? | Open |

### 02 — Authentication and onboarding

| ID | Question | Status |
|----|----------|--------|
| P-02-01 | Login method(s): phone OTP, email, social login, other? | Open |
| P-02-02 | Can users browse without logging in (guest mode)? | Open |
| P-02-03 | Is creating a birth profile required during onboarding? | Open |
| P-02-04 | Minimum user age and how it is checked. | Open |
| P-02-05 | Is language selection part of onboarding? | Open |
| P-02-06 | Account deletion flow and what happens to the user's data. | Open |
| P-02-07 | Does onboarding include introductory or welcome screens, and what do they contain? | Open |

### 03 — Home

| ID | Question | Status |
|----|----------|--------|
| P-03-01 | Which sections and content appear on Home? | Open |
| P-03-02 | Is Home personalised, and on what basis? | Open |
| P-03-03 | Are promotions or banners shown on Home? | Open |

### 04 — Explore and astrologer discovery

| ID | Question | Status |
|----|----------|--------|
| P-04-01 | Which fields can users search by? | Open |
| P-04-02 | Which filters are available (e.g. language, expertise, price, rating, online status)? | Open |
| P-04-03 | Which sort options are available? | Open |
| P-04-04 | How are results ranked by default? | Open |

### 05 — Astrologer profile

| ID | Question | Status |
|----|----------|--------|
| P-05-01 | Which fields are shown on an astrologer's profile? | Open — confirmed so far: Instant Call/Chat packages shown; previously verified details stay visible while changes await approval (D-48); full field list not confirmed |
| P-05-02 | How are an astrologer's active campaigns displayed? | Open |
| P-05-03 | How are reviews displayed and sorted? | Open — confirmed so far: hidden reviews are not shown; public rating from Published reviews only (D-49); display and sorting not confirmed |
| P-05-04 | How is astrologer availability displayed? | Open |
| P-05-05 | Can users share or report an astrologer profile? | Open |
| P-05-06 | Which actions are available on an astrologer profile (e.g. follow/subscribe, ask a question, book an appointment, start an Instant Call or Instant Chat)? | Open — confirmed so far: Instant Call/Chat packages shown on the profile (D-48); full list of actions not confirmed |

### 06 — Text-based Question service

| ID | Question | Status |
|----|----------|--------|
| P-06-03 | What happens to held slots and already-asked questions if the subscription ends or is cancelled? | Open |
| P-06-06 | Question length, format, and allowed attachments. | Resolved — question text up to 1,000 characters; horoscope attachments in PDF or JPEG, up to 2 files of 10 MB each, or saved birth details (D-22, D-35) |
| P-06-07 | Which birth profile is attached to a question, and how is it chosen? | Open |
| P-06-12 | Confirm that one slot equals one question. | Open |
| P-06-13 | Define a campaign from the user's point of view: what does it specify (e.g. price per slot, number of slots offered, start and end dates), and is there a limit on how many slots a user can buy from one campaign? | Open |
| P-06-14 | Can a user edit or cancel a question after submitting it? If cancelled, is the slot returned? | Resolved — no editing after final submission; Preview before submission; no manual cancellation (D-24, D-34) |
| P-06-15 | Confirm that a slot purchased from an astrologer's campaign can be used only for questions to that same astrologer. | Open |
| P-06-16 | What must the user provide when raising a dispute (e.g. reason, details)? | Open |

### 07 — Appointment service

| ID | Question | Status |
|----|----------|--------|
| P-07-01 | How far in advance can appointments be booked? | Resolved — rolling 90-day booking horizon (D-40) |
| P-07-02 | Available appointment durations. | Resolved — 15 or 30 minutes, each with its own price (D-40) |
| P-07-03 | Consultation mode (call, video, chat, other). | Resolved — voice only; no video (D-40) |
| P-07-04 | Rescheduling and cancellation rules. | Open — confirmed so far: 12-hour user cancellation policy; user may reschedule once; astrologer cancellation and date-closure handling (D-41); late-cancellation percentage not recorded (Astrologer AP-05-01) |
| P-07-05 | Refund rules. | Open — confirmed so far: full Wallet refund on astrologer cancellation, astrologer no-show, and date closure (D-41); late-cancellation percentage not recorded (Astrologer AP-05-01) |
| P-07-06 | Handling of no-shows by the user or the astrologer. | Open — confirmed so far: astrologer no-show → full Wallet refund; user no-show follows the late-cancellation policy (D-41); percentage not recorded (Astrologer AP-05-01) |
| P-07-07 | Reminder timing. | Resolved — immediately after booking; 3, 2, and 1 day before; 1 hour and 15 minutes before on the day; immediately after cancellation or rescheduling (D-43) |
| P-07-08 | Is a subscription required to book an appointment? | Open |
| P-07-09 | Confirm the definition of an Appointment (e.g. a consultation booked in advance for a specific date and time). | Resolved — a voice-only consultation booked in advance for a specific date and time (D-40) |
| P-07-10 | What does a review contain (e.g. rating scale, written comment), is there a time limit to submit it, and can it be edited or deleted? Applies to Appointment, Instant Call and Instant Chat (D-10). | Open — confirmed so far: mandatory 1–5 rating, optional written feedback, no user edit/delete (D-10); time limit and enforcement not confirmed (Astrologer AP-10-01) |

### 08 — Instant Call

| ID | Question | Status |
|----|----------|--------|
| P-08-01 | Pricing model (per minute, fixed, other). | Resolved — prepaid packages, not per-minute billing (D-45) |
| P-08-02 | Minimum wallet balance required to start. | Resolved — the whole prepaid package is paid before the session starts (D-45) |
| P-08-03 | Handling of dropped calls and billing on disconnect. | Open — confirmed so far: 5-minute reconnection with remaining paid time preserved (D-46); handling when reconnection permanently fails not confirmed (Astrologer AP-06-01) |
| P-08-04 | Refund rules when a call fails. | Open — confirmed so far: no refund for early termination (D-45); handling when reconnection permanently fails not confirmed (Astrologer AP-06-01) |
| P-08-05 | Voice only, or also video? | Open |
| P-08-06 | Is a subscription required to start an Instant Call? | Open |
| P-08-07 | Confirm the definition of an Instant Call (e.g. a call started immediately, without prior booking). | Resolved — a call started immediately with an available astrologer, without prior booking (D-44) |
| P-08-08 | What happens if the astrologer does not accept or respond to an Instant Call request? | Resolved — the request expires after 30 seconds; Declined requests offer Try Again or Try Some Other Astrologer (D-44) |

### 09 — Instant Chat

| ID | Question | Status |
|----|----------|--------|
| P-09-01 | Pricing model. | Resolved — prepaid packages, not per-minute billing (D-45) |
| P-09-02 | Minimum wallet balance required to start. | Resolved — the whole prepaid package is paid before the session starts (D-45) |
| P-09-03 | Session time limits. | Resolved — the session lasts for the purchased package (minimum 5 minutes) and can be extended by paying for the next package (D-45) |
| P-09-04 | Are attachments allowed in chat? | Open |
| P-09-05 | How long is chat history kept and visible to the user? | Resolved — messages visible to both parties for 24 hours only; records remain (D-47) |
| P-09-06 | Is a subscription required to start an Instant Chat? | Open |
| P-09-07 | Confirm the definition of an Instant Chat (e.g. a chat started immediately, without prior booking). | Resolved — a chat started immediately with an available astrologer, without prior booking (D-44) |
| P-09-08 | What happens if the astrologer does not accept or respond to an Instant Chat request? | Resolved — the request expires after 30 seconds; Declined requests offer Try Again or Try Some Other Astrologer (D-44) |

### 10 — Wallet and payments

| ID | Question | Status |
|----|----------|--------|
| P-10-01 | Currency (or currencies). | Open |
| P-10-02 | Top-up methods and payment gateway. | Open |
| P-10-03 | Minimum and maximum top-up amounts. | Open |
| P-10-04 | Can users pay directly without using the wallet? | Resolved — Wallet balance or direct UPI/bank payment; the Wallet is not mandatory (D-33) |
| P-10-05 | Where do refunds go (wallet or original payment method)? | Resolved — all refunds go to the in-app Wallet (D-32) |
| P-10-06 | Can users withdraw wallet balance? | Resolved — withdrawal to a bank account is allowed for the amount above a ₹500 minimum balance (D-32) |
| P-10-07 | Invoices and receipts. | Open |
| P-10-08 | Tax (e.g. GST) handling and display. | Open |
| P-10-09 | What does the wallet transaction history show, and how does it relate to Activity? | Open |

### 11 — Activity and service history

| ID | Question | Status |
|----|----------|--------|
| P-11-01 | Tabs or categories inside Activity. | Open |
| P-11-02 | Available filters. | Open |
| P-11-03 | Statuses shown for each service type. | Open — confirmed so far: Text Question statuses (D-25); Astrologer App appointment statuses (Astrologer AD-89); statuses shown to the user for Appointments, Instant Call, and Instant Chat not confirmed |
| P-11-04 | How long history is kept. | Open |
| P-11-05 | How disputes and reviews are reached from Activity. | Open |

### 12 — User profile and settings

| ID | Question | Status |
|----|----------|--------|
| P-12-01 | User profile fields. | Open |
| P-12-02 | Theme and language settings. | Open |
| P-12-03 | Privacy settings. | Open |
| P-12-04 | Full list of settings available to the user. | Open |

### 13 — Birth profiles and Kundli

| ID | Question | Status |
|----|----------|--------|
| P-13-01 | Birth profile fields (e.g. name, gender, relation to user). | Open |
| P-13-02 | How the Kundli is generated (chart style, language). | Open |
| P-13-03 | File size limits and number of uploads per birth profile. | Open |
| P-13-04 | Can a birth profile be deleted if it was used in a past consultation? | Open |
| P-13-05 | When birth details change, do past consultations keep the details used at that time? | Open |
| P-13-06 | Should the user be warned that uploaded files may no longer match changed birth details? | Open |
| P-13-07 | Future free/paid limits on the number of birth profiles. | Open |
| P-13-08 | Can a user edit or replace an uploaded birth-chart file? | Open |
| P-13-09 | Is a birth profile shared with the astrologer for an Appointment, Instant Call or Instant Chat, and how is it chosen? (P-06-07 covers Text Questions.) | Open |

### 14 — Following and subscriptions

| ID | Question | Status |
|----|----------|--------|
| P-14-01 | Is "Follow" a separate action from "Subscribe"? What does each do? | Resolved — Follow is free and never subscribes; Subscribe is paid and automatically follows (D-36) |
| P-14-02 | Is a subscription free, paid, or time-limited? | Open — On Hold (X-14). Confirmed so far: a subscription is paid (D-36) |
| P-14-03 | Subscription price and duration. | Open — On Hold (X-14) |
| P-14-04 | Renewal and auto-renewal rules. | Open — On Hold (X-14). Confirmed so far: auto-renewal is optional and not enabled by default (D-36) |
| P-14-05 | Cancellation and refund rules. | Open — On Hold (X-14) |
| P-14-06 | What validity or expiry applies to subscription benefit questions, and do the question-slot rules (for example, D-07 expiry) apply to them? | Resolved — benefit questions follow the 7-day purchased-slot validity rule (D-31) |
| P-14-07 | Where in the User App do users see astrologers' Live Sessions and posts (General Posts and subscriber content)? | Open |

### 15 — Notifications

| ID | Question | Status |
|----|----------|--------|
| P-15-01 | Will email, WhatsApp, or SMS notifications be supported? If yes, which notification types use each channel? (Push and in-app are confirmed — D-16.) | Open |
| P-15-02 | Full list of non-critical notifications. | Open |
| P-15-03 | Exact events covered by each critical category (appointment, question, payment/wallet, subscription, security, account). | Open |
| P-15-04 | Quiet hours. | Open |
| P-15-05 | Is opt-in required for marketing notifications? | Open |
| P-15-06 | How does the critical always-ON rule (D-15) apply to the confirmed channels, push and in-app (D-16)? In particular, what happens if the user disables push permission at the device/OS level, which the app cannot override? | Open |
| P-15-07 | Is there an in-app notification list (history), and how long are notifications kept? | Open |
| P-15-08 | Are Instant Call, Instant Chat and Remedy Tracker notifications critical or non-critical? They are not named in D-15. | Open |

### 16 — Remedy tracker

| ID | Question | Status |
|----|----------|--------|
| P-16-01 | Remedy fields shown. | Open |
| P-16-03 | Are remedy reminders supported? | Open |
| P-16-04 | Can users add their own remedies? | Open |
| P-16-05 | Does each remedy link back to its original consultation? | Resolved — yes; each item links back to its originating Appointment/Consultation (D-51) |
| P-16-06 | Can an astrologer edit or remove a remedy after it is prescribed? | Open |

### 17 — Help and support

| ID | Question | Status |
|----|----------|--------|
| P-17-01 | Support channels (FAQ, tickets, chat, contact). | Open |
| P-17-02 | Ticket categories. | Open |
| P-17-03 | Expected response times. | Open |
| P-17-04 | How support relates to Text Question disputes. | Open |
| P-17-05 | Can users report an astrologer through support? | Open |

---

## 5. Per-file review checklist

Run this checklist on each specification file before marking it **Approved**.

- [ ] Uses the standard template (see §8). Exception: file 01 is a structural file and may use an adapted layout.
- [ ] Contains only confirmed decisions; nothing is invented.
- [ ] Every unknown is marked `PENDING DISCUSSION` with an ID from §4.
- [ ] No rule is stated in full in more than one file; non-owners link to the owner.
- [ ] Entry points match the five-tab navigation in file 01.
- [ ] The Services (new) vs Activity (purchased/used) split is respected.
- [ ] Remedy hand-off to the Remedy Tracker is covered (service files 06–09).
- [ ] Notifications triggered are listed and marked critical or non-critical, linked to file 15.
- [ ] Edge cases are covered: empty, loading, error, expired, cancelled, failed payment.
- [ ] No implementation detail and no code.
- [ ] No reference to the old `astro-textbased` or `astro-platform-admin` projects.
- [ ] No Platform Admin content.

## 6. Cross-module consistency checklist

Run this across the whole document set.

- [ ] Glossary terms in `CONTEXT.md` are used consistently in every file.
- [ ] The slot rules (D-05–D-07) and dispute window (D-08) are stated in full only in the decision register (§3) and file 06.
- [ ] The critical notification list (D-15) and notification channels (D-16) are stated in full only in the decision register (§3) and file 15.
- [ ] The dispute/review split (D-08, D-09, D-10) is consistent across files 06–09 and 11.
- [ ] Every remedy-producing service (06–09) links to file 16.
- [ ] Birth-profile rules (D-12–D-14) are stated in full only in the decision register (§3) and file 13.
- [ ] `CONTEXT.md` contains only short definitions and topic titles, referencing decision IDs and owning files.
- [ ] Every module is reachable from the navigation map in file 01.
- [ ] Every `PENDING DISCUSSION` ID used in a file exists in §4, and vice versa.
- [ ] No retired ID (see §7) is reused or still referenced as open.
- [ ] Module status and pending counts in §2 match the files.
- [ ] `CONTEXT.md` documentation map matches the files that exist.

---

## 7. Review and approval log

| Date | File | Change / Decision | Reviewer | Result |
|------|------|-------------------|----------|--------|
| 2026-11-17 | Documentation plan | Plan approved; DOC-01 to DOC-05 confirmed | Product owner | Approved |
| 2026-11-17 | `CLAUDE.md`, `CONTEXT.md`, `00`, `01` | Initial drafts created | — | Awaiting review |
| 2026-11-17 | `00` | **P-06-02 resolved and retired.** Slot expiry runs from the purchase date; holding does not pause or extend it; no waiting period after purchase. D-06 and D-07 amended in place. | Product owner | Approved |
| 2026-11-17 | `00` | D-16 added (push and in-app confirmed; email, WhatsApp, SMS not confirmed). P-15-01 reworded; P-15-06 added. | Product owner | Approved |
| 2026-11-17 | `00` | P-07-09, P-08-07, P-09-07 added: service definitions for Appointment, Instant Call, Instant Chat kept pending. | Product owner | Approved |
| 2026-11-17 | `CLAUDE.md`, `CONTEXT.md`, `00` | Single-owner rule clarified: the decision register is the official decision log; `CONTEXT.md` reduced to short definitions and topic titles with ID/owner references. | Product owner | Approved |
| 2026-11-17 | `00` | P-06-13 added — Campaign definition and scope clarification added to Module 06 Open Questions. | Product owner | Approved |
| 2026-11-17 | `02`–`17` | Module specification files 02–17 created as Draft from confirmed decisions D-01 to D-16. No decisions added or changed. | — | Awaiting review |
| 2026-11-17 | `00` | Gaps found while drafting 02–17 added as open questions: P-02-07, P-05-06, P-06-14, P-06-15, P-06-16, P-06-17, P-07-10, P-08-08, P-09-08, P-10-09, P-13-09, P-15-07, P-15-08. Module statuses for 02–17 set to Draft. | — | Awaiting review |
| 2026-11-17 | `00` | The 13 open questions added while drafting 02–17 approved as `PENDING DISCUSSION`. | Product owner | Approved |
| 2026-11-17 | `01`, `06`, `12`, `15` | Approved interpretations applied (no decision wording changed, no question resolved): dispute window wording linked to P-06-17; email/WhatsApp/SMS recorded as unconfirmed (P-15-01); security/account → modules 02/12 is a cross-reference only, not a new category; critical notifications cannot be disabled in app settings, phone-level push permission behaviour pending (P-15-06). `01` "planned" labels replaced with links. | Product owner | Approved |
| 2026-11-19 | `00`, `05`, `06`, `07`, `10`, `11`, `14`, `15`, `16`, `17` | Cross-app alignment with Astrologer App decisions. **Amended:** D-07 (earlier of 7 days from purchase or campaign expiry; no refund even after reminders), D-11 (remedies in Dispute Answers included). **Added:** D-17 – D-30. **Resolved and retired:** P-06-04 → D-21; P-06-05 → D-17; P-06-08 → D-18; P-06-09, P-06-10 → D-19; P-06-11 → D-23; P-06-17 → D-28; P-16-02 → D-29. | Product owner | Approved |
| 2026-11-19 | `00` | Partially answered but kept **Open**: P-06-06 (length and attachment count confirmed in D-22; user attachment file types and size not confirmed — no 10 MB limit assumed), P-06-13 (campaign contents confirmed in D-20; per-user purchase limit not confirmed), P-06-14 (manual cancellation not allowed, D-24; editing a submitted question not confirmed), P-07-05 (full refund for DND cancellations, D-30; other appointment refunds not confirmed), P-11-03 (Text Question statuses in D-25; other services not confirmed), P-15-03 (expiry reminders in D-26; full event list not confirmed), P-17-04, P-17-05 (Platform Complaint in D-27; support relationship not confirmed). | — | Recorded |
| 2026-11-19 | `00`, `06`, `14` | **Fourth pass:** D-21 amended (purchased unused slots stay usable until their original deadline after cancellation/deletion). D-31 added (subscription benefit questions: Silver 1, Gold 3, Platinum 4; shown separately). **P-06-01 resolved and retired** → D-31. **P-14-06 added** (validity of benefit questions). Text Question statuses (D-25) unchanged: Settled remains internal. | Product owner | Approved |
| 2026-11-19 | `00`, `04` – `07`, `08` – `10`, `13`, `14`, `18`, `CONTEXT.md` | **User App decisions finalized:** D-31 amended (benefit questions follow the 7-day slot validity). **Added:** D-32 (refunds to Wallet; withdrawal above ₹500 minimum balance), D-33 (Wallet or direct UPI/bank payment), D-34 (Preview; no editing after submission; no General-to-Personal conversion), D-35 (PDF/JPEG horoscope attachments, 2 × 10 MB, or saved birth details), D-36 (Follow free; Subscribe paid and auto-follows; auto-renewal optional, off by default), D-37 (consent for sharing birth data), D-38 (DND: astrologer profile hidden; no purchases, submissions, bookings, or calls/chats), D-39 (Text-Based Questions service suspension, user view). **Resolved (IDs kept):** P-06-06, P-06-14, P-10-04, P-10-05, P-10-06, P-14-01, P-14-06. **On hold:** P-14-02 – P-14-05 (X-14). P-GL-03 stays Open for retention. Reference corrections: D-08 → 11, 17 (was 11, 15); D-12 → 02 (was 02, 12), verified against citing files. | Product owner | Approved |
| 2026-11-19 | `00`, `06` | **X-05 resolved** (Astrologer review list §5): product owner confirmed that General-to-Personal conversion or upgrade is not supported, consistent with D-34. Astrologer AD-35 amended (option (2) removed). User-side correction flow documented in `06` §5.11 and R-06-34, referencing AD-35; no new User App decision, correction workflow, or payment flow added. X-14 (P-14-02 – P-14-05), P-GL-03 retention, and P-10-01 remain Open. | Product owner | Approved |
| 2026-11-20 | `00`, `05` – `09`, `10`, `14` – `16`, `CONTEXT.md` | **User App alignment with the Astrologer App** (Astrologer X-16 – X-20, X-22 – X-25; product-owner rulings of 2026-11-20). **Amended (dated, history in the decision text):** D-10 (mandatory 1–5 rating, optional written feedback, no user edit/delete), D-17 (same for Text Questions), D-20 (Special Campaign label/type mandatory), D-21 (refund of purchased unused slots on campaign cancellation; deletion rule unchanged pending Astrologer AP-02-24), D-30 (confirmed appointments remain valid during DND). **Added:** D-40 – D-43 (Appointments), D-44 – D-46 (Instant Call and Chat), D-47 (24-hour chat history), D-48, D-49 (astrologer profile content; review visibility), D-50 (Live Sessions and posts, user view), D-51 (Remedy Tracker links). | Product owner | Approved |
| 2026-11-20 | `00` | **Resolved (IDs kept):** P-07-01, P-07-02, P-07-03, P-07-07, P-07-09, P-08-01, P-08-02, P-08-07, P-08-08, P-09-01, P-09-02, P-09-03, P-09-05, P-09-07, P-09-08, P-16-05. **Partially answered, kept Open:** P-05-01, P-05-03, P-05-06, P-07-04, P-07-05, P-07-06, P-07-10, P-08-03, P-08-04, P-11-03. **Added:** P-14-07 (where users see Live Sessions and posts). Not covered and still Open: P-07-08, P-08-05, P-08-06, P-09-04, P-09-06. On hold: P-14-02 – P-14-05 (X-14). P-GL-03 (retention) and P-10-01 (currency) unchanged. | — | Recorded |

**Retired IDs (never reuse):** P-06-02, P-06-04, P-06-05, P-06-08, P-06-09, P-06-10, P-06-11, P-06-17, P-16-02, P-06-01

---

## 8. Standard template for module specifications

Every module file (02–17) uses these sections. File 01 is a structural file
and may use an adapted layout where that is clearer.

1. Purpose
2. Scope / Out of scope
3. Entry points
4. Confirmed decisions (by ID from §3)
5. User flows
6. Screens and content
7. Business rules and validations
8. States and edge cases
9. Notifications triggered (linked to file 15)
10. Dependencies on other modules
11. `PENDING DISCUSSION` (by ID from §4)
12. Acceptance criteria (confirmed rules only)
13. Change log

Sections with no confirmed content contain only `PENDING DISCUSSION` and the
relevant IDs.
