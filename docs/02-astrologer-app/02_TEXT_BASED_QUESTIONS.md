# 02 — Text-Based Questions

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-10, AD-11, AD-24 – AD-62, AD-69 – AD-74 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour for
> UI design and mock-data prototypes. It does not define APIs, data
> structures, or backend logic. Items marked **Pending Product Decision**
> must not be implemented as if decided.

---

## 1. Purpose

Defines the astrologer's side of the Text-Based Questions service: the shared
monthly slot quota, minimum answer target, and quota reduction; campaigns
(including specially labelled campaigns) and Open Questions; General and
Personal question types with independent pricing, optional offers/discounts,
and slot allocation; Campaign Management; campaign expiry, extension,
cancellation, and deletion; submission and answer deadlines; priority
classifications; the question status lifecycle and My Work tabs; the
General/Personal correction workflow; the answer editor and templates;
attachments and remedies; rating, dispute, and Platform Complaint rules;
settlement; history; and the question timeline. All calendar-day rules use
IST calendar days (AD-71).

## 2. Scope / Out of scope

**In scope**
- Shared monthly slot quota, monthly reset, pro-rata quota and target, minimum answer target, quota reduction, Text-Based Questions service suspension (AD-24, AD-52, AD-70, AD-73).
- Campaigns, specially labelled campaigns, and Campaign Management (AD-25 – AD-27).
- Open Questions (AD-54).
- General and Personal question types (AD-26, AD-53).
- Independent General/Personal pricing and optional offers/discounts (AD-55, AD-56).
- Slot allocation, reallocation, and reduction (AD-25, AD-27, AD-57).
- Submission deadline, campaign expiry, extension, cancellation, deletion, unused purchased slots (AD-28, AD-29, AD-31, AD-58 – AD-60).
- DND / Planned Unavailability: activation restriction, profile visibility, and effects on Text-Based Questions (AD-10, AD-11, AD-74).
- Answer deadline, auto-cancellation, no manual cancellation, protection of purchased/submitted questions (AD-30, AD-31, AD-62).
- Priority classifications (AD-32, AD-33).
- Question status lifecycle and My Work tabs (AD-46, AD-51).
- Question workspace (AD-34) and General/Personal correction (AD-35).
- User question text limit (AD-69).
- Answer editor, no post-submission editing, templates, remedy prescription (AD-36 – AD-39).
- Rating & Review, Dispute, Platform Complaint, Dispute Answer (AD-40 – AD-42, AD-44).
- Settlement rules (AD-43).
- User and astrologer attachments (AD-45, AD-61).
- Expired records, question cards, filters, history, timeline (AD-47 – AD-50).
- IST calendar-day counting (AD-71).

**Out of scope**
- Home Screen, availability controls, Quick Actions, astrologer Remedy Tracker view, Home Campaign Questions visual, Home dispute display → [`01_HOME_SCREEN.md`](01_HOME_SCREEN.md).
- Appointments part of My Work and Availability Schedule (AD-13 → [01](01_HOME_SCREEN.md)).
- Earnings and wallet screens, payout display (Earnings module).
- Admin Review of escalated disputes (platform side).
- User-side screens (User App). User-side behaviour is aligned in the User App documentation (review list §5.1).
- Audio-only answer submission — not allowed (AD-36).
- "Remember This Question" — removed completely (R-03); no replacement feature.
- Astrologer account suspension — not part of this module; AD-73 suspends only the Text-Based Questions service.
- Subscription prices, validity, renewal, and other plan benefits — not confirmed (X-14).
- The Platform's recovery/refund process if a Platform Complaint establishes inappropriate conduct — Platform side (AD-42).
- Backend, APIs, real payments, refunds, notification delivery, and settlement processing.

## 3. Entry points

- **My Work** tab in the bottom navigation (AD-03 → [01](01_HOME_SCREEN.md)); My Work main page and Text Questions tabs (AD-46).
- **Campaign Questions** Quick Action on Home, which opens the received Campaign Questions screen (AD-21 → [01](01_HOME_SCREEN.md)).
- Campaign Management: My Work → Text Questions → Campaign Management (AD-27).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-10 | While DND or Planned Unavailability is active, **no new question slot purchases and no new question submissions** are allowed — users are blocked from submitting new Text-Based Questions to that astrologer, and the astrologer's profile is hidden (AD-74). *(Amended 2026-11-19.)* |
| AD-11 | While DND or Planned Unavailability is active, the expiry of already purchased slots **does not pause**, and the 30-day answer deadline of already submitted questions **does not pause**. **DND days count toward the 30-day answer deadline**; DND does not pause, extend, or reset it. If the astrologer knows in advance that they will activate DND, they should answer pending questions before activating it wherever possible. A question not answered within its 30-day deadline is automatically cancelled and refunded (AD-30). The separate purchased-slot validity rule (AD-28) is unchanged by DND. *(Amended 2026-11-19.)* |
| AD-24 | The platform allocates a **monthly question slot quota** to each astrologer. Each astrologer has a total monthly capacity of **1,000** Text-Based Question slots. This is **one shared quota** across all Campaign Questions and Open Questions; Campaign Questions and Open Questions do not receive separate additional quotas. Total slots across all campaigns and Open Questions cannot exceed the allocated quota. **Unused monthly slots do not carry forward.** The quota **resets on the 1st day of every calendar month at 12:00 AM IST**. An astrologer who joins mid-month receives a **pro-rata quota based on the remaining days of that month, using whole-number rounding**; from the next calendar month, the normal quota of 1,000 applies, subject to any performance-based reduction (AD-70). *(Amended 2026-11-19.)* |
| AD-25 | The astrologer can create multiple campaigns and set their slots/prices, increase/decrease campaign slots, and reallocate unused slots. Purchased/submitted questions must be protected when campaigns are changed or cancelled. |
| AD-26 | Astrologers can create campaigns on **any theme or occasion** (for example, Marriage, Career, Education, Business). Regular and Special Campaigns use the **same Campaign Editor**; there is no separate Special Campaign editor, configuration, or workflow. A **Special Campaign** (for example, a limited-time or occasion-based campaign such as a 10-day Navaratri campaign) **must carry a clear Special Campaign label/type; the label is mandatory**. "Open Slots" is **not** a campaign type — questions submitted without a campaign are **Open Questions** (AD-54). Every campaign supports the **General** and **Personal** question types; the astrologer chooses **General only, Personal only, or both General and Personal**; neither type is compulsory. Offers/discounts are optional and decided by the astrologer (AD-56); when none is set, **No Offer** is shown. Campaign fields include Start Date, Expiry Date, slot count, and price. *(Amended 2026-11-19. Amended 2026-11-20 (AP-02-25): Special Campaign label/type mandatory; supersedes "Special Campaign is not a separate campaign type … may give … a special title/label".)* |
| AD-27 | Campaign Management is located at **My Work → Text Questions → Campaign Management** and includes: Create Campaign, Edit Campaign, Increase/Decrease Slots, Reallocate Slots, Cancel Campaign, **Delete Campaign**. *(Amended 2026-11-19.)* |
| AD-28 | **Question submission deadline:** two deadlines apply — (1) seven days from slot purchase; (2) the campaign expiry date. The **earlier** of these two dates is the final question submission deadline. Example 1: purchased November 1; seven-day deadline November 8; campaign expires November 10 → deadline November 8. Example 2: purchased November 1; seven-day deadline November 8; campaign expires November 5 → deadline November 5. Days are IST calendar days (AD-71). *(Amended 2026-11-19.)* |
| AD-29 | Campaign expiry does not affect questions already submitted. |
| AD-30 | The answer deadline starts from **question submission**, not purchase. The astrologer must answer within **30 days** (IST calendar days, AD-71). If unanswered after 30 days, the question is **auto-cancelled** and the User receives a **refund**. *(Amended 2026-11-19.)* |
| AD-31 | Campaign **cancellation** and campaign **deletion** are allowed. Cancelling, deleting, or expiring a campaign does **not** cancel already purchased/submitted User Questions; the astrologer must still answer them, and the original 30-day deadline continues. **When a campaign is cancelled, Users receive a refund for purchased unused slots.** For campaign **deletion**, the earlier rule is unchanged pending AP-02-24: no refund is issued merely because a campaign was deleted, and a purchased, unused slot remains usable until its **original deadline** — the earlier of purchase + 7 days and the campaign's original expiry date; deletion neither expires it immediately nor extends or resets that deadline. Unsold allocations can be reused/reallocated according to the quota rules. *(Amended 2026-11-19. Amended 2026-11-20: refund of purchased unused slots on cancellation; supersedes "no refund merely because a campaign was cancelled" and slot usability after cancellation.)* |
| AD-32 | **Priority 2:** 1–19 pending days. **Priority 1:** 20–30 pending days. Day 20 belongs only to Priority 1. At the end of day 30, the deadline expires and auto-cancellation/refund applies. There is no third/normal priority list. Pending days are IST calendar days (AD-71). *(Amended 2026-11-19.)* |
| AD-33 | Priority 1 and Priority 2 are **priority classifications (views)**, not question statuses; a question in a Priority classification keeps its own status. A question stays **New / Received** until the astrologer opens it (AD-51). *(Amended 2026-11-19.)* |
| AD-34 | The question workspace displays: Question ID and User ID; User name, profile photo, and relevant user details; amount paid and number of slots purchased; previous questions asked; campaign name; General/Personal question type; question received date/time; horoscope attachment and other attachments, if supplied; full question text; Request Correction action when a Personal Question is submitted using a General slot. |
| AD-35 | **General/Personal correction:** if a Personal Question is submitted using a General slot, the astrologer can Request Correction. The User can replace it with another General Question, without extra payment, using the same slot. No General-to-Personal upgrade or conversion is available. The corrected question returns to the astrologer. The original 30-day deadline does not restart. If the User does not respond before the original deadline, the question is auto-cancelled and refunded. If the User resubmits an incorrect question again, the astrologer may Request Correction again. The original deadline continues regardless of the number of correction cycles. *(Amended 2026-11-19.)* |
| AD-36 | **Answer Editor:** the astrologer answers using a text-based answer editor with a maximum of **1,500** characters; Save Draft; Auto Save; astrologer-created Answer Templates; Preview Answer, so the astrologer can review and correct the answer before final submission; Voice to Text, where the astrologer speaks and the speech is converted into text in the answer editor; answers are text typed manually or produced by voice-to-text, and **no audio-only answer** can be submitted; Attachments (see AD-45) and Add Link to support the answer or recommendations; Remedy prescription action. The astrologer can preview and edit the answer before final submission. "Remember This Question" is removed completely (R-03). *(Amended 2026-11-19.)* |
| AD-37 | **No post-submission editing.** The astrologer should use Preview before submitting. Once submitted, the User can immediately view the answer. (Replaces rejected proposal R-01.) |
| AD-38 | **Answer Templates:** the astrologer creates and manages their own templates — Save, Edit, Delete, and reuse. Platform-provided common templates are not currently required. |
| AD-39 | The astrologer must be able to prescribe a remedy/atonement while answering, including in a **Dispute Answer**. If prescribed or attached in any service, it must appear in the User's Remedy Tracker. This is a cross-service product requirement. *(Amended 2026-11-19.)* |
| AD-40 | **Rating & Review:** immediately after the answer is delivered, the User gives a **mandatory** rating (1–5 stars); a written review is **optional**. Rating & Review does not block the User from raising a Dispute within 7 days. The enforcement mechanism is not confirmed (AP-10-01). *(Amended 2026-11-20: rating mandatory, written review optional; supersedes "the User can immediately rate and write a review".)* |
| AD-41 | **Dispute:** the User can raise a Dispute within **7 days after answer submission** (IST calendar days, AD-71). Only one Dispute per question. The astrologer answers the Dispute once, within **3 days**; if the astrologer does not answer within 3 days, the Dispute is **escalated to Admin Review**. The User cannot raise another Dispute after the Dispute Answer. *(Amended 2026-11-19.)* |
| AD-42 | **Platform Complaint:** the User may raise a separate Platform Complaint within seven days after the Dispute Answer. A Platform Complaint is separate from a Dispute and concerns inappropriate/improper answers. A Platform Complaint does **not** hold or block the astrologer's settlement/payment; the platform handles complaints separately. If inappropriate conduct is established, the Platform may separately decide on recovery/refund according to its own process. *(Amended 2026-11-19.)* |
| AD-43 | **Settlement:** the astrologer receives payment for completed work under the normal settlement rules. If no Dispute is raised within 7 days after the answer, commission is deducted, the net amount becomes eligible to move to the astrologer's side/settlement, and the question status becomes **Settled**. If a Dispute is raised, settlement follows the Dispute Answer, with commission/net credit after seven days. A Platform Complaint does not hold or block settlement (AD-42). *(Amended 2026-11-19.)* |
| AD-44 | **Dispute Answer:** maximum 1,500 characters; text reply only; no Answer Templates or Attachments. A Dispute Answer **may include a remedy**, which must also appear in the User's Remedy Tracker (AD-39). *(Amended 2026-11-19.)* |
| AD-45 | **Attachments:** **User question attachments** — General Questions allow no attachments; Personal Questions allow up to **two** attachments. **Astrologer answer attachments** — up to **three** attachments per answer, maximum **10 MB per file**, allowed formats **JPEG, PDF, TXT**. The 10 MB limit and formats apply to astrologer answer attachments only. (Replaces rejected proposal R-02.) *(Amended 2026-11-19.)* |
| AD-46 | **My Work** main page shows: Total Work, Text Questions, Appointments. Text Questions has **four main lifecycle tabs**: Received Questions, Answered Questions, Dispute Questions, and Dispute Solved / Resolved Questions. These must not be collapsed into generic Priority or Completed tabs. **Drafts** and **Expired** remain accessible as secondary tabs or filters. **Priority 1** and **Priority 2** are urgency filters within Received Questions, not lifecycle statuses or replacements for the four main tabs. *(Amended 2026-11-19.)* |
| AD-47 | **Expired tab:** only questions whose 30-day answer deadline expired and were auto-cancelled/refunded. Old expired records remain available in History. |
| AD-48 | **Question cards** include: 1. Question ID; 2. User ID; 3. User Name + Profile Photo; 4. Campaign Name; 5. Question Type; 6. Received Date & Time; 7. Pending Days; 8. Answer Deadline; 9. Priority Status; 10. Horoscope attachment indicator; 11. Other attachments indicator; 12. Question Status; 13. View Question / Answer Now. |
| AD-49 | **Filters:** Date Range; Month; Campaign; General/Personal; Priority 1/2; Question Status; Answered/Pending/Disputed/Expired; Search by User ID / Question ID. |
| AD-50 | **History:** month-wise history; Received/Answered/Expired summaries; old Answered/Disputed/Expired records; Search and Filters. **Timeline events:** Question Purchased, Question Submitted, Correction Requested, Question Resubmitted, Answer Submitted, Dispute Raised, Dispute Answered, Completed/Expired. |
| AD-51 | **Question status lifecycle:** (1) the User purchases/submits a question → **New / Received**; (2) the astrologer opens the question → **Pending** (never before it is opened); (3) the astrologer submits the answer → **Completed**; (4) the 7-day dispute window ends without a Dispute and the amount becomes eligible for settlement → **Settled**. "Answered Questions" is a tab name; the status of questions in it is Completed. Other statuses: Correction Requested, Disputed, Dispute Answered, Expired. *(Amended 2026-11-19.)* |
| AD-52 | **Minimum answer target:** the monthly minimum answer target is **800** questions out of the 1,000 monthly slots. An astrologer who joins mid-month receives a **pro-rata minimum target based on the remaining days of that month, using whole-number rounding**; from the next month, the full target of 800 applies. Quota reduction for missing the target follows AD-70; the Text-Based Questions service suspension follows AD-73. *(Amended 2026-11-19.)* |
| AD-53 | **General / Personal definitions:** **General** — answered without using the user's Horoscope/Birth Chart. **Personal** — answered based on the user's Horoscope/Birth Chart. The distinction is based on whether Horoscope/Birth Chart information is used, not on the subject of the question. |
| AD-54 | **Open Questions** are questions submitted without selecting a specific campaign. Open Questions support both General Questions and Personal Questions and use the same shared monthly quota (AD-24). Open Questions also support optional offers/discounts (AD-56). Open Questions do not require a Campaign title. *(Amended 2026-11-19.)* |
| AD-55 | **Separate pricing:** General and Personal questions always have independent pricing, for every campaign and for Open Questions. The astrologer sets each price independently. One price must not be assumed to apply to both types. (Illustrative example: Marriage – General ₹100; Marriage – Personal ₹200.) |
| AD-56 | **Separate discounts:** offers/discounts are **optional** and controlled by the astrologer, **not Platform Admin**, for all Campaigns, Special Campaigns, and Open Questions. General and Personal have independent discount settings. The astrologer can independently enable or disable a discount for each type and selects the discount percentage. The maximum discount is **99%**; 100% is not allowed. There is no default discount percentage. The percentage is chosen with a selector that allows increasing/decreasing it, rather than manual typing only. The system calculates the discounted amount automatically and displays the original price, discount percentage, and final payable price. A General discount does not affect Personal pricing, and vice versa. *(Amended 2026-11-19.)* |
| AD-57 | **Campaign slot allocation:** the astrologer sets a total slot allocation for each campaign and splits it independently between General and Personal; the General and Personal allocations must add up to the campaign's total allocation (illustrative example: Marriage Campaign 500 slots = General 300 + Personal 200). Unsold allocation can be reallocated to other campaigns or question types, subject to the shared monthly quota. The astrologer may reduce a campaign's slots **even below the number already purchased**; this does **not** cancel or invalidate already purchased/submitted User Questions, which the astrologer must still answer; freed capacity can be reallocated within the monthly quota. All campaign and Open Question allocations together must never exceed the astrologer's monthly quota. *(Amended 2026-11-19.)* |
| AD-58 | **Campaign extension:** if the astrologer extends a campaign, the extension also applies to unused purchased question slots belonging to that campaign. If the astrologer does not extend the campaign, it expires according to its configured expiry date. Reactivating a campaign does not automatically restore already expired purchased slots. |
| AD-59 | **Expiry warning and reminders (user side):** if a campaign is **within 3 days of expiry**, the user is warned before purchase. Expiry reminders are sent to users three times: **3 days, 2 days, and 1 day before expiry**. Reminders do not change the expiry or refund rules. *(Amended 2026-11-19.)* |
| AD-60 | **Unused purchased slots at campaign expiry:** if the campaign expires and the user has not used all purchased slots despite the notifications, the unused slots expire. No refund is provided for unused slots after campaign expiry; this is treated as the user's responsibility. |
| AD-61 | **User-side attachments:** General Questions have no attachment option for the user. Personal Questions have an attachment option for up to **two** attachments; users can attach relevant Horoscope/Birth Chart files or images. *(Amended 2026-11-19.)* |
| AD-62 | **No manual cancellation:** after a paid question is submitted, the user has no manual Cancel Question option, and the astrologer has no manual Cancel Question option; once a user submits a question, the astrologer is obligated to answer it. If the astrologer fails to answer within the configured deadline, the system automatically cancels the question and the user receives a refund according to the confirmed refund rules (AD-30). |
| AD-69 | **User Question text** has a maximum of **1,000** characters. |
| AD-70 | **Quota reduction:** reductions apply to the **following** month, not the already-running month. First consecutive month of missing the 800 minimum target → the following month's quota is reduced by **10%** (900). Second consecutive month of missing the target → the following month's quota is reduced by **20%** (800). If the astrologer completes the reduced quota/target in the reduced month, the full 1,000 quota is restored from the following month. A third consecutive missed month leads to the Text-Based Questions service suspension in AD-73; no further percentage reduction is defined, and after reinstatement the normal 1,000 quota and 800 target apply without carrying forward or restarting any reduction (AD-73). *(Amended 2026-11-19.)* |
| AD-71 | **IST calendar-day counting** is used consistently for question expiry, answer deadlines, priority calculations, dispute windows, dispute answer deadlines, the monthly quota reset, the Daily Answer Goal, Home daily counts, and other relevant calendar-day calculations. UTC-based date boundaries are not used for user-facing or astrologer-facing calendar-day rules. |
| AD-72 | **Text-Based Questions and Subscription Questions:** both categories remain available and are displayed **separately**. **Text-Based Questions** are the normal Text-Based Question service; **Subscription Questions** are questions offered to users as part of a subscriber benefit/offer. Subscription Questions do not replace normal Text-Based Questions, and the two are never merged into one count or one indistinguishable section. Benefit questions per subscription: Silver **1**, Gold **3**, Platinum **4**. Subscription prices, validity periods, renewal rules, and other plan benefits are not confirmed. *(Amended 2026-11-19.)* |
| AD-73 | **Text-Based Questions service suspension:** if the astrologer misses the monthly minimum answer target for **three consecutive months**, only the **Text-Based Questions service** is suspended for **three months**. The astrologer account is not suspended, and other services remain available under their normal rules. During the suspension, **all new Text-Based Question purchases and submissions are blocked**, including new Campaign Questions and Open Questions. **Previously purchased questions and slots remain valid** during the suspension (within their existing validity, AD-28) and are not blocked or cancelled because of the suspension. The astrologer must answer every outstanding previously purchased question during the suspension period; existing questions continue under the normal 30-day answer deadline, and any question not answered within its deadline is automatically cancelled and refunded under the existing rules (AD-30). **Reopening:** after the three-month period, the service reopens **only after all outstanding previously purchased questions have been answered** or resolved through the existing auto-cancellation/refund process; until then it stays unavailable. On reopening, the normal monthly quota of **1,000** and minimum target of **800** apply; any previous 10% or 20% reduced quota is not carried forward, and the reduced-quota progression is not restarted. *(Amended 2026-11-19.)* |
| AD-74 | **DND / Planned Unavailability — activation and visibility:** DND can be activated only when the astrologer is not engaged in active work; it **cannot be activated during an ongoing Instant Call or Instant Chat**, which must be finished first. While DND is active, the astrologer's **entire profile is invisible to all users** for the complete selected period: users cannot view the profile or book any service, all services are unavailable (Text-Based Questions, Appointments, Instant Call, Instant Chat, and other bookable services), and users are blocked from submitting new Text-Based Questions to the astrologer. Hiding the profile is required; disabling a booking button while the profile stays discoverable is not sufficient. |

**Referenced decisions** (owned by [`01_HOME_SCREEN.md`](01_HOME_SCREEN.md))

| ID | Topic |
|----|-------|
| AD-03 | Bottom navigation (My Work tab) |
| AD-05 | Offline: Text-Based Questions can still arrive |
| AD-07 | DND / Planned Unavailability stops all services |
| AD-09 | Planned Unavailability: edit/cancel; booked appointments cancelled with full refund |
| AD-12 | New requests resume after DND or Planned Unavailability |
| AD-13 | Availability Schedule and timings belong to the Appointment Module |
| AD-18 | Home Text Question counts |
| AD-21 | Campaign Questions Quick Action |
| AD-22 | Astrologer Remedy Tracker view |
| AD-64 | Home shows daily counts only |
| AD-65 | Subscription benefit questions shown separately from additional paid questions (two categories, AD-72) |
| AD-67 | Campaign Questions Home visual |
| AD-68 | Disputes shown separately on Home; dispute notifications |

## 5. User flows

### 5.1 Create a campaign
1. The astrologer opens My Work → Text Questions → Campaign Management → Create Campaign (AD-27).
2. The astrologer creates a subject-based campaign and sets Start Date and Expiry Date (AD-26). The same Campaign Editor is used for a Special Campaign (for example, a limited-time or occasion-based campaign such as a 10-day Navaratri campaign), which must carry a clear Special Campaign label/type; there is no separate Special Campaign editor or workflow (AD-26).
3. The astrologer chooses the question types: **General only, Personal only, or both**; neither is compulsory (AD-26). General and Personal are defined by whether Horoscope/Birth Chart information is used (AD-53).
4. For each selected type, the astrologer sets an **independent price** (AD-55).
5. Optionally, for each selected type, the astrologer enables a **discount** and chooses its percentage with an increase/decrease selector (maximum 99%; no default). The original price, discount percentage, and final payable price are shown; the discounted amount is calculated automatically. When no offer/discount is set, "No Offer" is shown (AD-26, AD-56).
6. The astrologer sets the campaign's **total slot allocation** and splits it between the selected types; the split must add up to the total (AD-57).
7. Total allocations across all campaigns and Open Questions cannot exceed the monthly quota (AD-24, AD-57).

> Illustrative example (not product values): Marriage — General ₹100, Personal ₹200; total 500 slots = General 300 + Personal 200.

### 5.2 Configure Open Questions
1. Open Questions are questions submitted without selecting a specific campaign (AD-54).
2. Open Questions support General and Personal (AD-54), each with an independent price (AD-55) and optional, independent offers/discounts (AD-54, AD-56).
3. The astrologer allocates and splits Open Question slots between General and Personal within the same shared monthly quota as campaigns (AD-24, AD-54, AD-57).

### 5.3 Edit, resize, or reallocate slots
1. The astrologer uses Edit Campaign, Increase/Decrease Slots, or Reallocate Slots (AD-27).
2. Unsold allocation can be reallocated to other campaigns or question types, subject to the shared monthly quota (AD-57).
3. The astrologer may reduce a campaign's slots even **below the number already purchased**; already purchased/submitted questions are not cancelled or invalidated, and the astrologer must still answer them. Freed capacity can be reallocated within the monthly quota (AD-57).
4. All campaign and Open Question allocations together must never exceed the monthly quota (AD-24, AD-57).

> Illustrative example (from the product brief; not product values): Marriage campaign — 100 slots, sold out. Career campaign — 100 slots, 50 sold, 50 unused. The astrologer reduces Career by 50 and adds those 50 slots to Marriage.

### 5.4 Extend, let expire, or reactivate a campaign
1. If the astrologer **extends** a campaign, the extension also applies to unused purchased slots of that campaign (AD-58).
2. If the astrologer does **not** extend it, the campaign expires on its configured expiry date (AD-58).
3. At expiry, purchased slots the user has not used expire, with **no refund**, even if reminders were sent (AD-60).
4. **Reactivating** a campaign does not restore already expired purchased slots (AD-58).
5. The submission deadline remains the earlier of purchase + 7 days and the campaign expiry date (AD-28).

### 5.5 Cancel or delete a campaign
1. The astrologer selects Cancel Campaign or Delete Campaign (AD-27).
2. Already purchased/submitted User Questions are **not** cancelled; the astrologer must still answer them, and submitted questions keep their original 30-day deadline (AD-31).
3. **Cancellation:** Users receive a refund for purchased unused slots (AD-31). Refunds go to the User Wallet (User App D-32).
4. **Deletion:** no refund is issued merely because the campaign was deleted; a purchased, unused slot remains usable until its original deadline — the earlier of purchase + 7 days and the campaign's original expiry date — and deletion neither expires it immediately nor extends or resets that deadline (AD-31). Whether the cancellation refund also applies to deletion: `PENDING DISCUSSION` (AP-02-24).
5. Unsold allocations can be reused/reallocated under the quota rules (AD-31).

### 5.6 User purchase and submission (context for the astrologer)
1. Users purchase General or Personal slots from a campaign or Open Questions at the price set for that type, seeing the original price, discount percentage, and final payable price (AD-55, AD-56).
2. If a campaign is within 3 days of expiry, the user is warned before purchase; expiry reminders are sent 3 days, 2 days, and 1 day before expiry (AD-59).
3. The question text is at most **1,000** characters (AD-69). General Questions have no user attachment option; Personal Questions allow up to two Horoscope/Birth Chart files or images (AD-45, AD-61).
4. The question must be submitted by the earlier of purchase + 7 days and the campaign expiry date (AD-28).
5. While DND or Planned Unavailability is active, no new slot purchases and no new submissions are allowed (AD-10); slot expiry does not pause (AD-11).
6. During DND the astrologer's profile is hidden and users cannot submit new questions (AD-74). Purchased slots keep their existing validity — the earlier of purchase + 7 days or campaign expiry (AD-28); DND does not pause, extend, or reset it, and no refund is introduced for slots that expire unused (X-12, final).
7. Once submitted, the question cannot be cancelled manually by the user or the astrologer (AD-62). Its status is **New / Received** (AD-51).

### 5.7 Work through questions in My Work
1. The astrologer opens My Work and sees Total Work, Text Questions, and Appointments (AD-46).
2. In Text Questions, the astrologer uses four separate tabs: Received Questions, Answered Questions, Dispute Questions, and Dispute Solved / Resolved Questions (AD-46).
3. Questions are classified Priority 2 (1–19 pending days) or Priority 1 (20–30 pending days); these are classifications, not statuses (AD-32, AD-33).
4. Drafts and Expired are available as secondary tabs or filters; Priority 1 and Priority 2 are urgency filters within Received Questions (AD-46).
5. The astrologer applies filters and search (AD-49).

### 5.8 Answer a question
1. The astrologer opens a question card (View Question / Answer Now, AD-48) to see the workspace (AD-34). Opening the question moves it from New / Received to **Pending** (AD-51).
2. The astrologer writes the answer as text typed manually or by Voice to Text (speech converted into text), maximum **1,500** characters, using Save Draft, Auto Save, and Answer Templates as needed (AD-36). Audio-only answers cannot be submitted (AD-36).
3. The astrologer can add up to **three** attachments (JPEG, PDF, TXT; maximum 10 MB each) and links to support the answer or recommendations (AD-36, AD-45).
4. If appropriate, the astrologer prescribes a remedy/atonement; it must appear in the User's Remedy Tracker (AD-39).
5. The astrologer previews the answer and can edit it before final submission (AD-36, AD-37).
6. The astrologer submits. There is no Edit Answer option after submission; the User can view the answer immediately. The status becomes **Completed** (AD-37, AD-51).
7. The astrologer has no Cancel Question option and is obligated to answer (AD-62).

### 5.9 Request Correction (General slot used for a Personal Question)
1. In the workspace, the astrologer selects Request Correction (AD-34, AD-35).
2. The User replaces it with another General Question, without extra payment, using the same slot. No General-to-Personal upgrade or conversion is available (AD-35).
3. The corrected question returns to the astrologer (AD-35).
4. The original 30-day deadline continues and does not restart (AD-35).
5. If the User does not respond before the original deadline, the question is auto-cancelled and refunded (AD-35).
6. If the resubmitted question is incorrect again, the astrologer may Request Correction again; the original deadline continues (AD-35).

### 5.10 After the answer: rating, dispute, complaint
1. Immediately after delivery, the User gives a mandatory rating (1–5 stars); a written review is optional; this does not block a Dispute (AD-40). Enforcement: `PENDING DISCUSSION` (AP-10-01). Review management → [10](10_RATINGS_AND_REVIEWS.md).
2. The User can raise one Dispute within 7 days after answer submission (AD-41).
3. The astrologer answers the Dispute once, within **3 days**: maximum 1,500 characters, text only, no templates or attachments; a remedy may be included and must appear in the User's Remedy Tracker (AD-39, AD-41, AD-44).
4. If the astrologer does not answer within 3 days, the Dispute is escalated to **Admin Review** (AD-41).
5. No further Dispute is allowed after the Dispute Answer (AD-41).
6. The User may raise a separate Platform Complaint within seven days after the Dispute Answer. It does not hold or block the astrologer's settlement (AD-42).

### 5.11 Settlement (rules only; no wallet screens here)
1. No Dispute within 7 days after the answer: commission is deducted, the net amount becomes eligible to move to the astrologer's side, and the status becomes **Settled** (AD-43, AD-51).
2. Dispute: settlement follows the Dispute Answer, with commission/net credit after seven days (AD-43).
3. A Platform Complaint does not hold or block settlement; if inappropriate conduct is established, the Platform decides recovery/refund separately under its own process (AD-42).

### 5.12 Unanswered question reaches the deadline
1. At the end of day 30 from submission (IST calendar days), an unanswered question is automatically cancelled by the system and the User is refunded (AD-30, AD-32, AD-62, AD-71).
2. Expired records remain available in History (AD-47).

### 5.13 Manage Answer Templates
The astrologer saves, edits, deletes, and reuses their own templates (AD-38).

### 5.14 Review History and Timeline
1. The astrologer selects a month to see Received/Answered/Expired summaries and old Answered/Disputed/Expired records, with Search and Filters (AD-50).
2. The astrologer opens a question's timeline of events (AD-50).

### 5.15 Monthly quota cycle
1. On the 1st day of every calendar month at 12:00 AM IST, the quota resets; unused slots do not carry forward (AD-24).
2. An astrologer who joins mid-month receives a pro-rata quota and pro-rata minimum target, based on the remaining days of that month, using whole-number rounding; from the next month, the full quota of 1,000 and target of 800 apply (AD-24, AD-52).
3. Reductions apply to the following month, not the running month: first consecutive missed month → next month's quota 900 (−10%); second consecutive missed month → next month's quota 800 (−20%). Completing the reduced quota/target in the reduced month restores 1,000 from the following month (AD-70).
4. A third consecutive missed month suspends only the Text-Based Questions service for three months (AD-73; §5.17).

### 5.16 Text-Based Questions and Subscription Questions
1. Two categories are available and always displayed separately (AD-72):
   - **Text-Based Questions** — the normal Text-Based Question service.
   - **Subscription Questions** — questions offered to users as part of a subscriber benefit/offer.
2. Subscription Questions do not replace normal Text-Based Questions; the two are never merged into one count or one indistinguishable section (AD-65, AD-72).
3. Benefit questions per subscription: Silver 1, Gold 3, Platinum 4 (AD-72).
4. Subscription prices, validity periods, renewal rules, and other plan benefits are not confirmed (X-14; User App P-14-02 – P-14-06).
### 5.17 Text-Based Questions service suspension
1. After three consecutive months of missing the monthly minimum answer target, only the Text-Based Questions service is suspended, for three months (AD-73).
2. The astrologer account is not suspended; other services remain available under their normal rules (AD-73).
3. During the suspension, all new Text-Based Question purchases and submissions are blocked, including new Campaign Questions and Open Questions (AD-73).
4. Previously purchased questions and slots remain valid within their existing validity (AD-28) and are not blocked or cancelled because of the suspension (AD-73).
5. The astrologer must answer every outstanding previously purchased question during the suspension. Each continues under its normal 30-day deadline; a question not answered in time is automatically cancelled and refunded (AD-30, AD-73).

**Reopening (AD-73)**
6. After the three-month period, the service reopens only when no outstanding previously purchased question remains — each must be answered or resolved through the existing auto-cancellation/refund process. Until then, the service stays unavailable.
7. On reopening, the normal monthly quota of 1,000 and minimum target of 800 apply. Any previous 10% or 20% reduced quota is not carried forward, and the reduced-quota progression is not restarted (AD-70, AD-73).
### 5.18 DND / Planned Unavailability (Text-Based Questions view)
1. DND can be activated only when no Instant Call or Instant Chat is in progress; the astrologer must finish the active Call/Chat first (AD-74).
2. While DND is active, the astrologer's entire profile is hidden from all users for the selected period; no service can be booked and no new Text-Based Questions can be submitted (AD-10, AD-74).
3. Already submitted questions keep their 30-day answer deadline; DND days count toward it (AD-11). The astrologer should answer pending questions before a planned DND wherever possible (AD-11).
4. A question still unanswered at its 30-day deadline is automatically cancelled and refunded (AD-30).
5. The purchased-slot validity rule (AD-28) is unchanged by DND (AD-11; X-12, final).
6. Booked appointments within the DND period are cancelled with a full refund and the dates are blocked; the astrologer can edit or cancel the DND period (AD-09 → [01](01_HOME_SCREEN.md)).

## 6. Screens and content

### 6.1 My Work main page (AD-46)
- Total Work
- Text Questions
- Appointments (out of scope for this file)

### 6.2 Text Questions tabs (AD-46, AD-49)

| Tab | Contents |
|-----|----------|
| Received Questions | Questions received and not yet answered |
| Answered Questions | Questions with a submitted answer (status Completed, AD-51) |
| Dispute Questions | Questions with an open Dispute |
| Dispute Solved / Resolved Questions | Questions whose Dispute has been answered or resolved |

- The four tabs are separate and must not be collapsed into generic Priority or Completed tabs (AD-46).
- Secondary tabs or filters: Drafts and Expired (AD-46, AD-47).
- Urgency filters within Received Questions: Priority 1 and Priority 2 (AD-32, AD-33, AD-46).

Filters and search (AD-49): Date Range; Month; Campaign; General/Personal;
Priority 1/2; Question Status; Answered/Pending/Disputed/Expired; Search by
User ID / Question ID.

### 6.3 Question status lifecycle (AD-51)

| Step | Trigger | Status |
|------|---------|--------|
| 1 | User purchases/submits the question | New / Received |
| 2 | Astrologer opens the question | Pending |
| 3 | Astrologer submits the answer | Completed |
| 4 | No Dispute raised within 7 days after the answer | Settled |

Other statuses: Correction Requested, Disputed, Dispute Answered, Expired (AD-51).

### 6.4 Question card (AD-48)
1. Question ID
2. User ID
3. User Name + Profile Photo
4. Campaign Name
5. Question Type
6. Received Date & Time
7. Pending Days
8. Answer Deadline
9. Priority Status
10. Horoscope attachment indicator
11. Other attachments indicator
12. Question Status
13. View Question / Answer Now

No Cancel Question action (AD-62).

### 6.5 Question workspace (AD-34)
- Question ID and User ID
- User name, profile photo, and relevant user details
- Amount paid and number of slots purchased
- Previous questions asked
- Campaign name
- General/Personal question type
- Question received date/time
- Horoscope attachment and other attachments, if supplied (user attachments exist only for Personal Questions, up to two; AD-45, AD-61)
- Full question text (up to 1,000 characters, AD-69)
- Request Correction action (when a Personal Question is submitted using a General slot)
- No Cancel Question action (AD-62)

Visibility of User details: X-11 resolved (User App D-37, consent); data retention remains open (User App P-GL-03).

### 6.6 Answer editor (AD-36 – AD-39, AD-45)
- Text-based answer field, maximum **1,500** characters
- Voice to Text (speech converted into text in the editor)
- Save Draft; Auto Save
- Answer Templates (astrologer's own)
- Attachments: up to three, JPEG / PDF / TXT, maximum 10 MB each
- Add Link
- Remedy prescription action
- Preview Answer, with editing allowed before final submission
- Submit (no Edit Answer option after submission)

Not included: "Remember This Question" (removed, R-03); audio-only answer submission (not allowed, AD-36).

### 6.7 Dispute Answer editor (AD-39, AD-41, AD-44)
- Text reply only, maximum 1,500 characters
- Remedy prescription allowed
- No Answer Templates; no Attachments
- Deadline: 3 days; otherwise escalated to Admin Review

### 6.8 Campaign Management (AD-24 – AD-27, AD-55 – AD-58)
- Monthly quota shared by all campaigns and Open Questions; allocated and remaining capacity; resets on the 1st at 12:00 AM IST (AD-24, AD-57)
- Campaign list, including the Special Campaign label/type of Special Campaigns (AD-26)
- Create Campaign; Edit Campaign; Increase/Decrease Slots; Reallocate Slots; Cancel Campaign; Delete Campaign (AD-27)
- Campaign fields: Special Campaign label/type (mandatory for Special Campaigns), question types (General only / Personal only / both), Start Date, Expiry Date (AD-26)
- Per selected question type: price (AD-55); optional discount on/off, percentage selector (increase/decrease, maximum 99%, no default), original price, discount percentage, final payable price; "No Offer" when none is set (AD-26, AD-56)
- Total slot allocation and General/Personal split that adds up to the total; reduction allowed below purchased slots without affecting purchased questions (AD-57)
- Extension of the campaign (AD-58)

### 6.9 Open Questions settings (AD-24, AD-54 – AD-57)
- General price and Personal price, set independently (AD-55)
- Optional General and Personal discounts, set independently (AD-54, AD-56)
- General/Personal slot allocation within the shared monthly quota (AD-24, AD-57)

### 6.10 Answer Templates manager (AD-38)
- Save, Edit, Delete, reuse

### 6.11 History (AD-50)
- Month selector; Received/Answered/Expired summary
- Old Answered/Disputed/Expired records
- Search and Filters

### 6.12 Timeline (AD-50)
Question Purchased → Question Submitted → Correction Requested* →
Question Resubmitted* → Answer Submitted → Dispute Raised* → Dispute
Answered* → Completed/Expired. (*if applicable)

## 7. Business rules and validations

### 7.1 Quota, target, and allocation
| # | Rule | Source |
|---|------|--------|
| BR-02-01 | Each astrologer has one shared monthly quota of 1,000 slots across all Campaign Questions and Open Questions; no separate additional quotas. Total allocations cannot exceed it. | AD-24, AD-57 |
| BR-02-31 | Unused monthly slots do not carry forward. | AD-24 |
| BR-02-32 | The monthly minimum answer target is 800 questions out of 1,000. | AD-52 |
| BR-02-33 | Each campaign has a total slot allocation split between General and Personal; the split must add up to the campaign total. | AD-57 |
| BR-02-34 | Unsold allocation can be reallocated to other campaigns or question types, within the shared quota. | AD-57 |
| BR-02-47 | The quota resets on the 1st day of every calendar month at 12:00 AM IST. | AD-24 |
| BR-02-48 | An astrologer joining mid-month receives a pro-rata quota and pro-rata minimum target based on the remaining days of that month, using whole-number rounding; the full quota of 1,000 and target of 800 apply from the next month. | AD-24, AD-52 |
| BR-02-52 | Missing the 800 target reduces the following month's quota by 10% (first step); missing it again applies a 20% reduction (next step). Example: 1,000 → 900 → 800. | AD-70 |
| BR-02-53 | Completing the target in a reduced-quota month restores the full 1,000 quota from the following month. | AD-70 |
| BR-02-62 | A third consecutive missed target suspends only the Text-Based Questions service for three months; no further percentage reduction is defined. | AD-70, AD-73 |
| BR-02-64 | Quota reductions apply to the following month, not the already-running month. | AD-70 |
| BR-02-65 | The Text-Based Questions service suspension is service-level only: the account stays active, other services remain available under their normal rules, and all new Text-Based Question purchases and submissions (Campaign Questions and Open Questions) are blocked for the three months. | AD-73 |
| BR-02-66 | During the suspension, already purchased/submitted questions remain the astrologer's responsibility under the 30-day deadline and auto-cancellation/refund rules. | AD-73 |
| BR-02-54 | A campaign's slots may be reduced below the number already purchased; purchased/submitted questions are not cancelled or invalidated; freed capacity can be reallocated within the monthly quota. | AD-57 |

| # | Rule | Source |
|---|------|--------|
| BR-02-70 | During the suspension, all new Text-Based Question purchases and submissions are blocked; previously purchased questions and slots remain valid within their existing validity and are not blocked or cancelled. | AD-73 |
| BR-02-71 | After three months, the service reopens only when every outstanding previously purchased question has been answered or auto-cancelled/refunded. | AD-73 |
| BR-02-72 | On reopening, the normal 1,000 quota and 800 target apply; no 10% or 20% reduction is carried forward or restarted. | AD-70, AD-73 |

### 7.2 Campaigns, question types, pricing, and discounts
| # | Rule | Source |
|---|------|--------|
| BR-02-02 | The astrologer can create multiple campaigns and set slots and prices. | AD-25 |
| BR-02-03 | Campaign slots can be increased or decreased; unused slots can be reallocated. | AD-25 |
| BR-02-04 | Purchased/submitted questions must be protected when campaigns are changed or cancelled. | AD-25 |
| BR-02-05 | Campaigns are subject-based; Regular and Special Campaigns use the same Campaign Editor; a Special Campaign must carry a clear Special Campaign label/type (mandatory) *(rule text updated 2026-11-20 with the AD-26 amendment)*; "Open Slots" is not a campaign type. Every campaign supports General and Personal; the astrologer chooses General only, Personal only, or both. "No Offer" is shown when no offer/discount is set. | AD-26 |
| BR-02-06 | Campaign fields include Start Date, Expiry Date, slot count, price. | AD-26 |
| BR-02-07 | Campaign Management actions: Create, Edit, Increase/Decrease Slots, Reallocate Slots, Cancel, Delete. | AD-27 |
| BR-02-35 | General = answered without the user's Horoscope/Birth Chart; Personal = answered based on it. The distinction is not based on subject. | AD-53 |
| BR-02-36 | Open Questions are submitted without selecting a campaign, support General and Personal, use the shared quota, and support optional offers/discounts. | AD-54 |
| BR-02-37 | General and Personal have independent prices, for every campaign and for Open Questions. | AD-55 |
| BR-02-38 | Offers/discounts are optional and set by the astrologer for all Campaigns, specially labelled campaigns, and Open Questions. General and Personal discounts are independent; each can be enabled or disabled; percentage chosen with an increase/decrease selector; maximum 99%; 100% not allowed; no default. | AD-56 |
| BR-02-39 | The discounted amount is calculated automatically; original price, discount percentage, and final payable price are displayed. A discount on one type never changes the other type's price. | AD-56 |
| BR-02-63 | Text-Based Questions and Subscription Questions are two separate categories, never merged into one count or section; benefit questions per subscription: Silver 1, Gold 3, Platinum 4. | AD-72 |

### 7.3 Deadlines, expiry, cancellation, and deletion
| # | Rule | Source |
|---|------|--------|
| BR-02-08 | Submission deadline = the earlier of purchase + 7 days and campaign expiry. | AD-28 |
| BR-02-09 | Campaign expiry does not affect submitted questions. | AD-29 |
| BR-02-10 | Answer deadline: 30 days from submission; unanswered questions are auto-cancelled and refunded. | AD-30 |
| BR-02-11 | Campaign cancellation, deletion, or expiry does not cancel already purchased/submitted questions; the original deadline continues. | AD-31 |
| BR-02-49 | Campaign cancellation and deletion are allowed; the astrologer must still answer purchased/submitted questions; on cancellation, purchased unused slots are refunded; on deletion, no refund is issued merely because of the deletion (AP-02-24); unsold allocations can be reused/reallocated. | AD-31 |
| BR-02-59 | After deletion, a purchased unused slot remains usable until its original deadline (earlier of purchase + 7 days and the campaign's original expiry date); the deadline is not shortened, extended, or reset. After cancellation, purchased unused slots are refunded. | AD-31 |
| BR-02-12 | During DND or Planned Unavailability: no new slot purchases or submissions; slot expiry and the 30-day deadline do not pause. | AD-10, AD-11 |
| BR-02-67 | DND cannot be activated during an ongoing Instant Call or Instant Chat. | AD-74 |
| BR-02-68 | While DND is active, the astrologer's entire profile is hidden from all users; no service can be booked and no new Text-Based Questions can be submitted. | AD-10, AD-74 |
| BR-02-69 | DND days count toward the 30-day answer deadline; DND does not pause, extend, or reset it, and the purchased-slot validity rule is unchanged. | AD-11 |
| BR-02-40 | Extending a campaign also extends unused purchased slots of that campaign; without extension the campaign expires on its configured date. | AD-58 |
| BR-02-41 | Reactivating a campaign does not restore already expired purchased slots. | AD-58 |
| BR-02-42 | Users are warned before purchase when a campaign is within 3 days of expiry, and receive expiry reminders 3 days, 2 days, and 1 day before expiry. Reminders do not change expiry or refund rules. | AD-59 |
| BR-02-43 | Unused purchased slots expire at campaign expiry with no refund, even if reminders were sent. | AD-60 |
| BR-02-44 | Neither the user nor the astrologer can manually cancel a submitted question; only the system auto-cancels at the deadline. | AD-62 |
| BR-02-55 | All calendar-day rules (expiry, answer deadlines, priority, dispute windows, dispute answer deadlines, quota reset, daily goal, Home daily counts) use IST calendar days; no UTC date boundaries. | AD-71 |


### 7.4 Priority, tabs, and statuses
| # | Rule | Source |
|---|------|--------|
| BR-02-13 | Priority 2 = 1–19 pending days; Priority 1 = 20–30 pending days; day 20 is Priority 1 only; no third list. | AD-32 |
| BR-02-14 | Priority 1 and Priority 2 are classifications (views), not statuses. | AD-33 |
| BR-02-15 | Status lifecycle: New / Received → Pending (only after the astrologer opens the question) → Completed (answer submitted) → Settled (no Dispute within 7 days). Other statuses: Correction Requested, Disputed, Dispute Answered, Expired. | AD-51 |
| BR-02-16 | Expired records are questions auto-cancelled/refunded after the 30-day deadline; old expired records remain in History. | AD-47 |
| BR-02-56 | Text Questions has four separate tabs: Received Questions, Answered Questions, Dispute Questions, Dispute Solved / Resolved Questions; they are not collapsed into generic Priority or Completed tabs. | AD-46 |
| BR-02-60 | Drafts and Expired remain accessible as secondary tabs or filters; Priority 1 and Priority 2 are urgency filters within Received Questions. | AD-46 |
| BR-02-61 | "Answered Questions" is a tab name; the status of questions in it is Completed. | AD-51 |

Drafts and Expired are secondary tabs or filters; Priority 1 and Priority 2 are urgency filters within Received Questions (AD-46).

### 7.5 Correction
| # | Rule | Source |
|---|------|--------|
| BR-02-17 | Request Correction is available when a Personal Question is submitted using a General slot. | AD-34, AD-35 |
| BR-02-18 | The User can replace the question with another General Question (no payment, same slot); no General-to-Personal upgrade or conversion is available. | AD-35 |
| BR-02-19 | The original 30-day deadline continues through all correction cycles; no response before it → auto-cancel and refund. | AD-35 |
| BR-02-20 | Correction can be requested again if the resubmitted question is still incorrect. | AD-35 |

### 7.6 Questions, answers, and attachments
| # | Rule | Source |
|---|------|--------|
| BR-02-57 | User Question text: maximum 1,000 characters. | AD-69 |
| BR-02-21 | Astrologer Answer text: maximum 1,500 characters, typed manually or by Voice to Text. | AD-36 |
| BR-02-51 | Audio-only answers cannot be submitted; voice is always converted into text. | AD-36 |
| BR-02-22 | Preview and edit before submission; no Edit Answer option after submission; the User sees the answer immediately. | AD-36, AD-37 |
| BR-02-23 | Templates are created and managed by the astrologer; no platform templates are required. | AD-38 |
| BR-02-24 | A remedy prescribed in an answer or a Dispute Answer must appear in the User's Remedy Tracker. | AD-39 |
| BR-02-25 | General Questions allow no user attachments; Personal Questions allow up to two user attachments. | AD-45 |
| BR-02-45 | Astrologer answers allow up to three attachments plus links. | AD-36, AD-45 |
| BR-02-50 | Astrologer answer attachments: JPEG, PDF, or TXT only; maximum 10 MB per file. | AD-45 |
| BR-02-46 | User attachments on Personal Questions are Horoscope/Birth Chart files or images. | AD-61 |

### 7.7 Rating, dispute, complaint, settlement
| # | Rule | Source |
|---|------|--------|
| BR-02-26 | A rating (1–5) is mandatory immediately after delivery; a written review is optional; neither blocks a Dispute. | AD-40 |
| BR-02-27 | One Dispute per question, within 7 days after answer submission; answered once; no further Dispute. | AD-41 |
| BR-02-58 | The astrologer must answer a Dispute within 3 days; otherwise it is escalated to Admin Review. | AD-41 |
| BR-02-28 | Dispute Answer: maximum 1,500 characters, text only, no templates or attachments; may include a remedy. | AD-44 |
| BR-02-29 | Platform Complaint: separate from Dispute; within seven days after the Dispute Answer; concerns inappropriate/improper answers; does not hold or block settlement. | AD-42 |
| BR-02-30 | Settlement: no Dispute within 7 days → commission deducted, net eligible for settlement, status Settled; Dispute → after the Dispute Answer plus seven days. | AD-43 |

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| Allocations would exceed the monthly quota across campaigns and Open Questions | Not allowed (AD-24, AD-57) |
| General + Personal split does not add up to the campaign total | Not allowed (AD-57) |
| Campaign created with only General or only Personal | Allowed; neither type is compulsory (AD-26) |
| Occasion-based campaign (e.g. 10-day Navaratri) | Same Campaign Editor; mandatory Special Campaign label/type (AD-26) |
| Discount set to 100% | Not allowed; maximum 99% (AD-56) |
| Discount enabled but no percentage chosen | No default percentage is provided (AD-56) |
| No offer/discount set | "No Offer" shown (AD-26, AD-56) |
| Discount on General only | Personal price unchanged (AD-56) |
| 1st of the month, 12:00 AM IST | Quota resets; unused slots do not carry forward (AD-24) |
| Astrologer joins mid-month | Pro-rata quota and target by remaining days, whole-number rounding (AD-24, AD-52) |
| Astrologer misses the 800 target | Next month's quota reduced by 10% (AD-70) |
| Astrologer misses the target again | 20% reduction applies (AD-70) |
| Astrologer meets the target in a reduced month | Full 1,000 restored from the following month (AD-70) |
| Astrologer misses the target a third consecutive time | Text-Based Questions service suspended for three months; account and other eligible services unaffected (AD-73) |
| Text-Based Questions service suspended | All new purchases and submissions blocked, including Campaign Questions and Open Questions (AD-73) |
| User holds a slot purchased before the suspension | Slot stays valid within its existing validity; not blocked or cancelled (AD-28, AD-73) |
| Outstanding purchased question during the suspension | Astrologer must answer it within its 30-day deadline; otherwise auto-cancelled and refunded (AD-30, AD-73) |
| Three months have passed but outstanding purchased questions remain | Service stays unavailable until each is answered or auto-cancelled/refunded (AD-73) |
| Service reopens | Normal 1,000 quota and 800 target; no reduced quota carried forward or restarted (AD-70, AD-73) |
| Purchase + 7 days is earlier than campaign expiry | Submission deadline = purchase + 7 days (AD-28) |
| Campaign expiry is earlier than purchase + 7 days | Submission deadline = campaign expiry (AD-28) |
| Campaign within 3 days of expiry | User warned before purchase (AD-59) |
| Campaign extended with purchased unused slots | Extension also applies to those slots (AD-58) |
| Campaign expires with purchased unused slots | Unused slots expire; no refund, even after reminders (AD-60) |
| Campaign reactivated after expiry | Expired purchased slots are not restored (AD-58) |
| Campaign cancelled or deleted with purchased/submitted questions | Submitted questions must still be answered (AD-31) |
| Campaign cancelled or deleted with unsold allocation | Unsold allocation can be reused/reallocated (AD-31) |
| Purchased slot not yet used when the campaign is **cancelled** | Refunded to the User (AD-31) |
| Purchased slot not yet used when the campaign is **deleted** | Usable until its original deadline (earlier of purchase + 7 days and the campaign's original expiry date); not shortened, extended, or reset (AD-31; AP-02-24) |
| Campaign slots reduced below purchased count | Allowed; purchased questions remain valid and must be answered (AD-57) |
| DND or Planned Unavailability active | No new purchases or submissions; deadlines do not pause (AD-10, AD-11) |
| User holding a purchased slot during DND or Planned Unavailability | Slot validity unchanged (AD-28); new submissions blocked while DND is active (AD-74); no refund introduced for slots that expire unused (X-12, final) |
| Astrologer tries to activate DND during an Instant Call or Instant Chat | Not allowed; the Call/Chat must be finished first (AD-74) |
| DND active | Entire profile hidden from all users; no bookings or submissions (AD-74) |
| DND active with submitted questions pending | 30-day deadline continues; unanswered questions auto-cancelled and refunded at the deadline (AD-11, AD-30) |
| User or astrologer wants to cancel a submitted question | No manual cancel option (AD-62) |
| Question submitted but not yet opened | Status New / Received; not Pending (AD-51) |
| Question opened by the astrologer | Status Pending (AD-51) |
| Question at pending day 19 | Priority 2 (AD-32) |
| Question at pending day 20 | Priority 1 only (AD-32) |
| End of day 30 (IST), unanswered | Automatically cancelled by the system and refunded (AD-30, AD-32, AD-62, AD-71) |
| Correction requested; User does not respond before the deadline | Auto-cancelled and refunded (AD-35) |
| Resubmitted question still incorrect | Correction may be requested again (AD-35) |
| User question exceeds 1,000 characters | Not allowed (AD-69) |
| Answer reaches 1,500 characters | Limit reached (AD-36) |
| Astrologer tries to submit an audio-only answer | Not allowed (AD-36) |
| Answer submitted | No Edit Answer option; status Completed (AD-37, AD-51) |
| Fourth answer attachment added | Not allowed; maximum three (AD-45) |
| Answer attachment over 10 MB or not JPEG/PDF/TXT | Not allowed (AD-45) |
| General Question received | No user attachments (AD-45, AD-61) |
| Personal Question with a third user attachment | Not allowed; maximum two (AD-45, AD-61) |
| No Dispute within 7 days after the answer | Status Settled; net amount eligible for settlement (AD-43, AD-51) |
| Dispute raised after 7 days from answer submission | Not available (AD-41) |
| Second Dispute after the Dispute Answer | Not allowed (AD-41) |
| Dispute raised | Astrologer notified immediately; reminder before the 3-day deadline expires (AD-68) |
| Dispute not answered within 3 days | Escalated to Admin Review (AD-41) |
| Remedy prescribed in a Dispute Answer | Appears in the User's Remedy Tracker (AD-39, AD-44) |
| Platform Complaint raised | Does not hold or block settlement (AD-42) |
| Inappropriate conduct established | Platform decides recovery/refund separately under its own process (AD-42) |

## 9. Notifications triggered

| Notification | Recipient | Rule |
|--------------|-----------|------|
| Warning before purchase when the campaign is within 3 days of expiry | User | AD-59 |
| Campaign expiry reminders — 3 days, 2 days, and 1 day before expiry | User | AD-59 |
| Dispute raised (immediate) | Astrologer | AD-68 → [01](01_HOME_SCREEN.md) |
| Reminder before the 3-day Dispute Answer deadline expires | Astrologer | AD-68 → [01](01_HOME_SCREEN.md) |

User App alignment: User App D-26 (06), event list in User App P-15-03.

## 10. Dependencies on other modules

| Dependency | Reference |
|------------|-----------|
| Home Screen | AD-03, AD-05, AD-07, AD-09, AD-12, AD-13, AD-18, AD-21, AD-22, AD-64, AD-65, AD-67, AD-68 → [01](01_HOME_SCREEN.md) |
| Earnings/Wallet (commission, settlement display) | AD-43 → [08](08_WALLET_AND_EARNINGS.md) (AD-124, AD-126); Text Questions commission rate missing (AP-08-02) |
| Offers and earnings calculations | AD-127, AD-128 → [09](09_OFFERS_AND_EARNINGS_CALCULATIONS.md) |
| Ratings and reviews | AD-129 – AD-134 → [10](10_RATINGS_AND_REVIEWS.md) |
| Global navigation (Dispute Details) | AD-76 – AD-78 → [03](03_GLOBAL_NAVIGATION.md) |
| Notifications (category B) | AD-148 → [14](14_NOTIFICATIONS_AND_REMINDERS.md) |
| Help & Support (dispute separation) | AD-162 → [16](16_HELP_AND_SUPPORT.md) |
| Remedy Tracker | AD-163 → [17](17_REMEDY_TRACKER.md) |
| Appointment Module | AD-13 → [01](01_HOME_SCREEN.md); [05](05_APPOINTMENTS.md) |
| Admin Review (escalated disputes) | AD-41 |
| User App — Text-based Question service | User App 06 (D-07, D-17 – D-28) |
| User App — Remedy Tracker | User App 16 (D-11, D-29) |
| User App — open dependencies | X-14, X-16, X-18 (review list §5) |
| Platform Admin | PA-01 (disputes), PA-07 (quota and suspension) — review list §5.2 |

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).
Retired: AP-02-01 – AP-02-23 (resolved into AD decisions; see review list §9).
Resolved (kept in the review list): AP-02-25 — Special Campaign label/type mandatory (AD-26 amended 2026-11-20).

**Owned by this module**

| ID | Topic | Status |
|----|-------|--------|
| AP-02-24 | Does the cancellation refund also apply to campaign deletion? | Open |

**Cross-app conflicts referenced** (full detail in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §5](00_ASTROLOGER_APP_REVIEW_LIST.md#5-cross-app-conflicts-register-x-01-to-x-24))

| ID | Topic | Status |
|----|-------|--------|
| X-02 | Refund destination | Resolved |
| X-05 | General/Personal correction; no General-to-Personal upgrade (AD-35) | Resolved |
| X-11 | Visibility of User details | Resolved (data retention open, User App P-GL-03) |
| X-12 | DND / Planned Unavailability vs purchased-slot validity | Resolved |
| X-13 | User attachment file types and size | Resolved |
| X-16 | Campaign cancellation refund (User App D-21 amended) | Resolved |
| X-18 | Mandatory rating (User App D-10, D-17 amended) | Resolved |
| X-25 | Special Campaign label mandatory (User App D-20 amended) | Resolved |

## 12. Acceptance criteria

Confirmed rules only.

- [ ] During DND or Planned Unavailability, no new slot purchases or question submissions are accepted (AD-10).
- [ ] During DND or Planned Unavailability, slot expiry and the 30-day answer deadline continue (AD-11).
- [ ] The monthly quota is 1,000 slots shared by campaigns and Open Questions; no carry-forward; resets on the 1st at 12:00 AM IST; pro-rata by remaining days with whole-number rounding for mid-month joiners (AD-24).
- [ ] The astrologer can create multiple campaigns, set slots and prices, increase/decrease slots, and reallocate unused slots, with purchased/submitted questions protected (AD-25).
- [ ] Campaigns use one Campaign Editor; every Special Campaign carries a clear, mandatory Special Campaign label/type; no "Open Slots" and no separate Special Campaign editor; General only / Personal only / both; "No Offer" when none is set (AD-26).
- [ ] Campaign Management offers Create, Edit, Increase/Decrease Slots, Reallocate Slots, Cancel, and Delete (AD-27).
- [ ] The submission deadline is the earlier of purchase + 7 days and campaign expiry, matching both examples (AD-28).
- [ ] Campaign expiry does not affect submitted questions (AD-29).
- [ ] The answer deadline is 30 IST calendar days from submission; unanswered questions are auto-cancelled and refunded (AD-30).
- [ ] Cancelling or deleting a campaign does not cancel submitted questions and frees unsold allocation; cancellation refunds purchased unused slots; deletion leaves them usable until their original deadline (AD-31).
- [ ] Priority 2 is 1–19 pending days; Priority 1 is 20–30; day 20 is only Priority 1; no third list (AD-32).
- [ ] Priority 1/2 are classifications, not statuses; a question stays New / Received until opened (AD-33).
- [ ] The question workspace shows every field listed in AD-34.
- [ ] Request Correction lets the User replace the question with another General Question (no upgrade to Personal), keeps the original deadline, auto-cancels and refunds on no response, and can be repeated (AD-35).
- [ ] The answer editor enforces 1,500 characters, supports typed text and Voice to Text, does not allow audio-only answers, allows preview and editing before submission, and has no Remember This Question (AD-36).
- [ ] Submitted answers cannot be edited, and the User can view them immediately (AD-37).
- [ ] The astrologer can save, edit, delete, and reuse their own templates (AD-38).
- [ ] A remedy prescribed in an answer or Dispute Answer appears in the User's Remedy Tracker (AD-39).
- [ ] A rating (1–5) is required immediately after delivery, a written review is optional, and neither blocks a Dispute (AD-40).
- [ ] One Dispute per question within 7 days after the answer; answered once within 3 days or escalated to Admin Review (AD-41).
- [ ] A Platform Complaint can be raised within seven days after the Dispute Answer and does not hold or block settlement (AD-42).
- [ ] Settlement follows AD-43, including the Settled status after 7 days without a Dispute.
- [ ] The Dispute Answer allows text only, up to 1,500 characters, no templates or attachments, and may include a remedy (AD-44).
- [ ] General Questions allow no user attachments; Personal allow up to two; answers allow up to three JPEG/PDF/TXT attachments of at most 10 MB each (AD-45).
- [ ] My Work shows Total Work, Text Questions, Appointments; Text Questions has the four main tabs, Drafts and Expired as secondary tabs or filters, and Priority 1/2 as urgency filters within Received Questions (AD-46).
- [ ] Expired records are auto-cancelled/refunded questions and remain available in History (AD-47).
- [ ] Question cards show all 13 fields of AD-48.
- [ ] All filters and searches of AD-49 are available.
- [ ] History and Timeline follow AD-50.
- [ ] The status lifecycle follows AD-51: New / Received → Pending → Completed → Settled.
- [ ] The monthly minimum target is 800, pro-rata for mid-month joiners (AD-52).
- [ ] General and Personal are distinguished by use of the Horoscope/Birth Chart, not by subject (AD-53).
- [ ] Open Questions support General and Personal, use the shared quota, and support optional offers/discounts (AD-54).
- [ ] General and Personal prices are set independently for every campaign and Open Questions (AD-55).
- [ ] Offers/discounts are optional; General and Personal discounts are independent, use an increase/decrease selector, allow at most 99%, have no default, and show original price, discount percentage, and final payable price (AD-56).
- [ ] General/Personal allocations add up to the campaign total; slots can be reduced below purchased without invalidating purchased questions; all allocations stay within the quota (AD-57).
- [ ] Extending a campaign extends its unused purchased slots; reactivation does not restore expired slots (AD-58).
- [ ] Users are warned before purchase within 3 days of expiry and receive reminders 3, 2, and 1 day before expiry (AD-59).
- [ ] Unused purchased slots expire at campaign expiry with no refund, even after reminders (AD-60).
- [ ] General Questions offer no user attachments; Personal Questions allow up to two Horoscope/Birth Chart files or images (AD-61).
- [ ] No manual Cancel Question option exists for the user or the astrologer (AD-62).
- [ ] User Question text is limited to 1,000 characters (AD-69).
- [ ] Quota reduction follows AD-70: 900 after the first consecutive miss, 800 after the second, applied to the following month; 1,000 restored after completing the reduced target.
- [ ] Three consecutive missed months suspend only the Text-Based Questions service for three months; the account and other services stay active; new purchases and submissions are blocked; previously purchased questions and slots stay valid and must be answered (AD-73).
- [ ] The service reopens only after all outstanding purchased questions are answered or auto-cancelled/refunded, with the normal 1,000 quota and 800 target and no reduction carried forward (AD-73).
- [ ] DND cannot be activated during an ongoing Instant Call or Instant Chat; while active, the whole profile is hidden and no services or new questions are accepted (AD-74).
- [ ] All calendar-day rules use IST calendar days (AD-71).
- [ ] Text-Based Questions and Subscription Questions are shown as two separate categories, never merged; benefit questions per subscription are Silver 1, Gold 3, Platinum 4 (AD-72).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from AD-10, AD-11, and AD-24 – AD-51. |
| 2026-11-17 | Synchronized with review list: AP-02-14 added to §11 and referenced. No decision changed. |
| 2026-11-19 | First pass: AD-24, AD-26, AD-36 amended; AD-52 – AD-62 added; AP-02-03 and AP-02-05 retired; BR-02-31 – BR-02-46 added. |
| 2026-11-19 | Second pass: "Open Slots" removed; reset, pro-rata, cancellation, optional offers, reminders, attachment limits, no audio-only answers; AP-02-01, AP-02-06, AP-02-08 retired; AP-02-15 – AP-02-17 added; BR-02-47 – BR-02-51 added. |
| 2026-11-19 | Third pass: Answer limit **1,500** (corrects 1,000); User Question limit 1,000 (AD-69); quota reduction (AD-70); IST calendar days (AD-71); Special Campaign uses the same editor; Delete Campaign allowed; slot reduction below purchased allowed; status lifecycle (New / Received → Pending → Completed → Settled); four tabs; dispute 3-day deadline and Admin Review; remedy in Dispute Answer; Platform Complaint does not block settlement. AP-02-02, 04, 07, 09 – 15, 17 retired; AP-02-18 – AP-02-20 added. BR-02-52 – BR-02-58 added; existing BR IDs preserved. |
| 2026-11-19 | Fourth pass: AD-31 (unused slots usable until their original deadline after cancellation/deletion), AD-46 (secondary tabs/filters), AD-51 (tab name vs status), AD-70 (no automatic third reduction or suspension) amended; AD-72 added (benefit questions per tier). AP-02-18, AP-02-20 retired; AP-02-21 added (on hold). New §5.16. BR-02-59 – BR-02-63 added. |
| 2026-11-19 | Final Astrologer pass: AD-10, AD-11, AD-24, AD-26, AD-42, AD-52, AD-54, AD-56, AD-70 amended; AD-73 (service suspension) and AD-74 (DND activation and visibility) added. AP-02-16, AP-02-19, AP-02-21 retired; AP-02-22, AP-02-23 added. X-12 final. New §5.17, §5.18. BR-02-62 updated; BR-02-64 – BR-02-69 added. |
| 2026-11-19 | Product-owner corrections: AD-70, AD-72, AD-73 amended (two question categories; suspension blocks new purchases/submissions while previously purchased questions and slots stay valid; reopening only after outstanding questions are resolved; normal 1,000/800 after reopening). §5.16 and §5.17 rewritten. AP-02-22, AP-02-23 retired. BR-02-63, BR-02-65 updated; BR-02-70 – BR-02-72 added. |
| 2026-11-19 | AD-35 re-quoted (General-to-Personal upgrade removed; X-05 resolved); §5.9 step 2, BR-02-18 and acceptance criterion updated. Cross-app statuses synchronized with the review list: X-02, X-05, X-11, X-12, X-13 Resolved; §10 open dependencies reduced to X-14. |
| 2026-11-20 | Master Decision Document applied: AD-31 re-quoted (amended — refund of purchased unused slots on cancellation; ruling C1) and AD-40 re-quoted (amended — mandatory rating, optional written review; ruling C4); §5.5, BR-02-26, BR-02-49, BR-02-59, edge cases, and acceptance criteria updated. AD-26 unchanged (label question AP-02-25). AP-02-24, AP-02-25, X-16, X-18 added; links to modules 03 – 17. |
| 2026-11-20 | AD-26 re-quoted (amended — mandatory Special Campaign label/type); §5 flow, screens, BR-02-05, edge case, acceptance updated; AP-02-25 Resolved; X-16, X-18 Resolved and X-25 added (User App aligned). |
