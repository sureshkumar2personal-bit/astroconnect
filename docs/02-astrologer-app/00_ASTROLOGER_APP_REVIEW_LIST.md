# 00 — Astrologer App Documentation Review List

This file is the single place to track the status of every Astrologer App
specification, every confirmed decision, every `PENDING DISCUSSION` item, and
every cross-app conflict with the User App.

- Agent rules: [`CLAUDE.md`](../../CLAUDE.md)
- Shared context: [`CONTEXT.md`](../../CONTEXT.md)
- User App review list (for cross-app references): [`00_USER_APP_REVIEW_LIST.md`](../01-user-app/00_USER_APP_REVIEW_LIST.md)

---

## 1. Purpose and How to Use This Review List

1. Each module specification is tracked in §2 with a status.
2. §3 is the **official decision log** for the Astrologer App. It records
   each confirmed decision verbatim with an ID. The **owning file** contains
   the detailed rules for that decision; all other files reference the
   decision ID and owning file instead of repeating it.
3. Every open question is listed in §4 with an ID and status **Open**.
   Specification files refer to these IDs instead of guessing.
4. Every conflict or dependency between the Astrologer App and the User App
   is listed in §5. Platform Admin dependencies are listed in §5.2 (`PA-xx`). **No User App document is changed by this list.** Each
   conflict requires a separate product-owner decision.
5. When a product-owner question is answered and finalized (per [`CLAUDE.md`](../../CLAUDE.md) §5):
   keep its **original ID**; change its status to **Resolved**; record the
   finalized decision in the decision register (§3); keep the question and
   its resolution history in §4 — do not remove it; record the resolution
   date in the review log (§9); and do **not** mark it **Retired**.
   **Retired** is used only for questions that are genuinely withdrawn,
   obsolete, duplicate, or invalid, following the existing retirement process
   (remove from the open list, record the reason and date in the review log,
   add the ID to the retired-IDs list). Resolved and Retired IDs are never
   reused. Keep Open, Resolved, and Retired counts accurate.
6. Proposals explicitly rejected by the product owner are recorded in §6.

**Status values:** `Not started` · `Draft` · `In review` · `Approved`

**ID formats**

| Prefix | Meaning | Example |
|--------|---------|---------|
| `AD-xx` | Astrologer App confirmed decision (one sequence for the whole app) | `AD-07` |
| `AP-01-yy` | Open question owned by `01_HOME_SCREEN.md` | `AP-01-03` |
| `AP-02-yy` | Open question owned by `02_TEXT_BASED_QUESTIONS.md` | `AP-02-24` |
| `AP-nn-yy` | Open question owned by module file `nn` (`03` – `17`) | `AP-08-01` |
| `AP-GL-yy` | Open question affecting more than one Astrologer App module | `AP-GL-02` |
| `X-xx` | Cross-app conflict or dependency with the User App | `X-12` |
| `PA-xx` | Dependency on Platform Admin (documentation not started) | `PA-04` |
| `R-xx` | Rejected proposal | `R-01` |

User App IDs (`D-xx`, `P-xx-yy`) are defined in
[`00_USER_APP_REVIEW_LIST.md`](../01-user-app/00_USER_APP_REVIEW_LIST.md)
and are referenced here without modification.

---

## 2. Astrologer App Module Status Tracker

| No. | File | Module | Status | Open questions owned | Approved on |
|-----|------|--------|--------|----------------------|-------------|
| 00 | `00_ASTROLOGER_APP_REVIEW_LIST.md` | Review list | Draft | — | |
| 01 | [`01_HOME_SCREEN.md`](01_HOME_SCREEN.md) | Home Screen | Draft | 1 | |
| 02 | [`02_TEXT_BASED_QUESTIONS.md`](02_TEXT_BASED_QUESTIONS.md) | Text-Based Questions | Draft | 1 | |
| 03 | [`03_GLOBAL_NAVIGATION.md`](03_GLOBAL_NAVIGATION.md) | Global Navigation | Draft | 0 | |
| 04 | [`04_PROFILE_AND_VERIFICATION.md`](04_PROFILE_AND_VERIFICATION.md) | Profile and Verification | Draft | 2 | |
| 05 | [`05_APPOINTMENTS.md`](05_APPOINTMENTS.md) | Appointments | Draft | 1 | |
| 06 | [`06_INSTANT_CALL_AND_CHAT.md`](06_INSTANT_CALL_AND_CHAT.md) | Instant Call and Instant Chat | Draft | 1 | |
| 07 | [`07_LIVE_SESSIONS.md`](07_LIVE_SESSIONS.md) | Live Sessions | Draft | 0 | |
| 08 | [`08_WALLET_AND_EARNINGS.md`](08_WALLET_AND_EARNINGS.md) | Wallet and Earnings | Draft | 3 | |
| 09 | [`09_OFFERS_AND_EARNINGS_CALCULATIONS.md`](09_OFFERS_AND_EARNINGS_CALCULATIONS.md) | Offers and Earnings Calculations | Draft | 0 | |
| 10 | [`10_RATINGS_AND_REVIEWS.md`](10_RATINGS_AND_REVIEWS.md) | Ratings and Reviews | Draft | 1 | |
| 11 | [`11_AUDIENCE.md`](11_AUDIENCE.md) | Audience | Draft | 0 | |
| 12 | [`12_CONTENT_MANAGEMENT.md`](12_CONTENT_MANAGEMENT.md) | Content Management | Draft | 0 | |
| 13 | [`13_ANALYTICS_AND_PERFORMANCE.md`](13_ANALYTICS_AND_PERFORMANCE.md) | Analytics and Performance | Draft | 0 | |
| 14 | [`14_NOTIFICATIONS_AND_REMINDERS.md`](14_NOTIFICATIONS_AND_REMINDERS.md) | Notifications and Reminders | Draft | 0 | |
| 15 | [`15_SETTINGS_AND_PREFERENCES.md`](15_SETTINGS_AND_PREFERENCES.md) | Settings and Preferences | Draft | 1 | |
| 16 | [`16_HELP_AND_SUPPORT.md`](16_HELP_AND_SUPPORT.md) | Help and Support | Draft | 2 | |
| 17 | [`17_REMEDY_TRACKER.md`](17_REMEDY_TRACKER.md) | Remedy Tracker | Draft | 0 | |
| 18 | [`18_PENDING_DECISIONS_REPORT.md`](18_PENDING_DECISIONS_REPORT.md) | Pending decisions report (snapshot 2026-11-20) | Draft / Reference | — | |
| GL | — | Cross-cutting (Astrologer App) | — | 1 | |
| X | — | Cross-app conflicts (§5) | — | 1 open / 24 resolved | |
| PA | — | Platform Admin dependencies (§5.2) | — | 11 recorded | |

Files `01` – `17` exist as **Draft** specifications (`01` and `02` since
2026-11-17; `03` – `17` created 2026-11-20 from the Master Decision Document).
None is approved or implementation-ready; UI implementation has not started
and requires a separate plan and approval.

**Open questions:** 16 open, of which 5 are **missing source information** (decisions reported as finalized but not present in any repository source) and 11 are genuinely unresolved. Resolved: AP-01-03, AP-01-05, AP-01-14, AP-02-25, AP-13-01.

---

## 3. Confirmed Decisions Register (AD-01 to AD-166)

Only decisions confirmed by the product owner appear here. Each decision has
exactly one owning file.

### 3.1 Home Screen (owner: `01_HOME_SCREEN.md`)

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-01 | Home Screen design direction is a **Balanced Dashboard**. Work, earnings, peak demand, and availability must all be prominent. | 01 | — | ✅ |
| AD-02 | Home Screen sections: 1. Welcome & Profile; 2. Availability; 3. Today's Earnings, with weekly/monthly summaries; 4. Peak Demand Hours chart; 5. Today's Work; 6. Recent Activity; 7. Exactly four Quick Actions. Welcome & Profile shows the astrologer's name, profile photo, and notification access. | 01 | 04 | ✅ |
| AD-03 | Bottom navigation has exactly five tabs: **Home, My Work, Live, Earnings, Profile**. | 01 | 02, 03, 04, 07, 08 | ✅ |
| AD-04 | **Online:** services can be available, subject to the individual Instant Call and Instant Chat switches. | 01 | 06 | ✅ |
| AD-05 | **Offline:** Text-Based Questions and Appointments can still arrive. Instant Call and Instant Chat cannot arrive. | 01 | 02, 05, 06 | ✅ |
| AD-06 | Only **Instant Call** and **Instant Chat** have individual ON/OFF switches. Text-Based Questions and Appointments have no individual availability switches. | 01 | 06, 14 | ✅ |
| AD-07 | **DND / Planned Unavailability:** DND and Planned Unavailability are the **same feature**. While it is active, the astrologer is unavailable for **all new** services: no new Text-Based Questions, Appointments, Instant Calls, Instant Chats, online/offline consultations, or other services — including subscription-based requests — can be purchased, booked, submitted, or started. **Existing confirmed appointments remain valid** obligations (AD-09). DND takes priority over the individual Instant Call and Instant Chat switches. *(Amended 2026-11-19. Amended 2026-11-20 (AP-01-14): new-service availability separated from existing confirmed appointments; supersedes "unavailable for **all** services — Text-Based Questions, Appointments, …".)* | 01 | 02, 05, 06 | ✅ |
| AD-08 | Turning DND **OFF** does not automatically make the astrologer Online. The astrologer must independently select Online or Offline. | 01 | — | ✅ |
| AD-09 | **Planned Unavailability:** the astrologer can specify a future unavailable period (for example, 10 days), and can **edit or cancel** it. During the selected period no new services can be purchased, booked, submitted, or started (AD-07, AD-74). **Existing confirmed appointments remain valid** when DND / Planned Unavailability is activated. Closing a date that contains confirmed appointments is a separate appointment workflow (date closure, AD-94). *(Amended 2026-11-19. Amended 2026-11-20: confirmed appointments remain valid; supersedes the earlier rule that booked appointments in the period are cancelled with a full refund and the date blocked.)* | 01 | 02, 05 | ✅ |
| AD-12 | New requests resume when DND is turned OFF or the unavailable period ends, subject to other rules. | 01 | 02 | ✅ |
| AD-13 | Availability Schedule and timings belong to the **Appointment Module**, not to Home or Text-Based Questions. | 01 | 02, 05 | ✅ |
| AD-14 | **Today's Earnings** on Home shows today's **expected Net Earnings after platform commission** — the amount the astrologer can earn by completing today's booked/assigned work — to motivate the astrologer. Home Earnings is kept simple: **no refund deductions, refund adjustments, refund status, or refund calculations** are shown on Home; refund details and refund-related accounting are shown separately in the **Wallet** section only. This Week and This Month keep the completed-service basis. The Earnings/Wallet section can separately display **Gross Revenue, Commission, and Net Earnings**. Settlement timing is handled separately in Earnings/Wallet. *(Amended 2026-11-19.)* | 01 | 03, 08 | ✅ |
| AD-15 | Earnings display: Today's Earnings shown prominently, with This Week and This Month. Comparisons: Today vs Yesterday, This Week vs Last Week, This Month vs Last Month. Positive growth shown in green; decreases shown honestly. No Pending Earnings or Pending Payout figures on Home. Mock figures are illustrative only. | 01 | 08, 13 | ✅ |
| AD-16 | **Peak Demand Hours:** calculated from the **last 7 days** of incoming Text-Based Question and Appointment booking data, identifying the peak-demand hours; no unspecified or unlimited historical period is used. The chart is divided into four IST time ranges: **Morning 5:00 AM–11:00 AM**, **Afternoon 11:00 AM–4:00 PM**, **Evening 4:00 PM–8:00 PM**, and **Night 8:00 PM–5:00 AM**. The highest-demand period is highlighted in gold, with a label such as "Peak Time: Evening". It remains a compact Home widget, not a large analytics dashboard. *(Amended 2026-11-19.)* | 01 | 05, 13 | ✅ |
| AD-17 | **Today's Work** shows Appointments and Text-Based Questions. Instant Calls and Chats do not have a dedicated Today's Work area. The Appointments preview shows today's count and the **next 3 upcoming appointments**; its View All action opens the Appointments section. *(Amended 2026-11-19.)* | 01 | 05, 06 | ✅ |
| AD-18 | Today's Work shows Text-Based Question counts: **Received, Answered, Pending**. Home shows **daily** counts only (AD-64). *(Amended 2026-11-19.)* | 01 | 02 | ✅ |
| AD-19 | **Daily Answer Goal:** the default goal is **10**; the astrologer can select 5, 10, or 15 questions per day and can change it later. It is motivational only and does not impose a cap. Progress is shown (for example, 3/5, 60%, "2 more answers to reach today's goal"). The currently selected goal is shown consistently wherever it is displayed. **Dispute Answers do not count** toward the Daily Answer Goal. *(Amended 2026-11-19.)* | 01 | — | ✅ |
| AD-20 | **Recent Activity** shows the four latest activities and a View All action, which opens the **dedicated Recent Activity tab**. Each item has a small icon, a short description, and a time. Examples: New Follower, New Question Received, Appointment Booked, Consultation Completed. *(Amended 2026-11-19.)* | 01 | 03, 11, 14 | ✅ |
| AD-21 | Exactly four **Quick Actions**: 1. Campaign Questions; 2. Go Live; 3. Content Creation; 4. Remedy Tracker. Vacation and Campaign Management are not added to Home Quick Actions. **Campaign Questions** opens the received Campaign Questions screen. **Content Creation** opens the "Benefits & Content" section, where content creation facilities are available. *(Amended 2026-11-19.)* | 01 | 02, 03, 07, 12, 17 | ✅ |
| AD-22 | **Remedy Tracker (astrologer view):** the astrologer sees only remedies prescribed by them and their completion status. Only the User can mark a remedy Completed. The User may upload a supporting photo/document. The astrologer can view uploaded attachments. The astrologer cannot manually mark a remedy completed. A prescribed remedy must also appear in the User Remedy Tracker. | 01 | 02, 17 | ✅ |
| AD-23 | **Live, Earnings, and Profile** are separate modules to be discussed later. | 01 | 03 | ✅ |
| AD-63 | The app opens to the **Home Dashboard** by default. | 01 | 03 | ✅ |
| AD-64 | Home displays **daily counts only**. Weekly and monthly counts are not added to Home for now. | 01 | 02 | ✅ |
| AD-65 | **Subscription benefit questions** are shown separately from additional normal paid questions asked by subscribers. | 01 | 02, 11 | ✅ |
| AD-66 | **Notifications:** the notification bell opens the Notifications section. Notifications include bookings, Instant Call, Instant Chat, new subscribers, payments, login activity, password changes, and other relevant account/service notifications. | 01 | 03, 14 | ✅ |
| AD-67 | **Campaign Questions Home visual:** a compact chart/progress visual showing today's received question count (green indicator), the astrologer's **currently selected** Daily Answer Goal (yellow indicator; default 10, AD-19 — not a fixed 10), and critical questions (red indicator). *(Amended 2026-11-19.)* | 01 | 02 | ✅ |
| AD-68 | **Disputes on Home** are shown separately. An **immediate notification** is sent when a dispute is raised, and a **reminder** is sent before the 3-day Dispute Answer deadline expires. No generic repeated "within 3 days" warning is shown for every open dispute. If the astrologer does not respond within 3 days, the dispute is escalated to Admin Review (AD-41). *(Amended 2026-11-19.)* | 01 | 02, 14 | ✅ |
| AD-164 | **Offline vs DND:** Offline means the astrologer is not accepting that instant service; DND means the astrologer is unavailable for new services across the platform. Appointments may still arrive when the astrologer is Offline (AD-05), but not while DND is active (AD-74). | 01 | 05, 06 | ✅ |
| AD-165 | **DND confirmation and indicator:** turning DND on first shows a confirmation, and DND takes effect only when the astrologer confirms. The message shown is: "DND Mode is ON. You will not appear online, receive new appointments, or receive any consultation requests." While DND is ON the app clearly indicates DND Mode is ON on Home, and the astrologer can turn DND OFF at any time. Turning DND OFF restores the ability to receive new requests; the astrologer then chooses Online or Offline (AD-08). Existing confirmed appointments remain valid (AD-07, AD-09). Activation restriction during an ongoing Instant Call/Chat stays (AD-74). | 01 | 05, 06 | ✅ |
| AD-166 | **Live Activity ticker:** Home shows a single-line ticker between the greeting and Today's Work. It scrolls continuously from right to left and shows today's activity messages built from live app data (for example "2 New Followers joined today.", "2 New Subscribers joined today."). New Followers, New Subscribers, and Appointments are always shown, including a count of 0; when all counts are 0 it shows "Welcome! Your daily activity updates will appear here." Messages update when the underlying data changes. The ticker may pause while the user hovers or touches it, and shows a static line when the device requests reduced motion. While DND is ON (AD-07, AD-165) the ticker stops scrolling and shows the updates as they were when DND was turned on; no new activity is displayed during DND. When DND is turned OFF the ticker scrolls again and shows the current counts. Flowers are not shown until defined (AP-01-16); the appointments message is not shown as "booked today" until the booking date is confirmed (AP-01-17). | 01 | — | ✅ |

### 3.2 Text-Based Questions (owner: `02_TEXT_BASED_QUESTIONS.md`)

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-10 | While DND or Planned Unavailability is active, **no new question slot purchases and no new question submissions** are allowed — users are blocked from submitting new Text-Based Questions to that astrologer, and the astrologer's profile is hidden (AD-74). *(Amended 2026-11-19.)* | 02 | 01 | ✅ |
| AD-11 | While DND or Planned Unavailability is active, the expiry of already purchased slots **does not pause**, and the 30-day answer deadline of already submitted questions **does not pause**. **DND days count toward the 30-day answer deadline**; DND does not pause, extend, or reset it. If the astrologer knows in advance that they will activate DND, they should answer pending questions before activating it wherever possible. A question not answered within its 30-day deadline is automatically cancelled and refunded (AD-30). The separate purchased-slot validity rule (AD-28) is unchanged by DND. *(Amended 2026-11-19.)* | 02 | 01 | ✅ |
| AD-24 | The platform allocates a **monthly question slot quota** to each astrologer. Each astrologer has a total monthly capacity of **1,000** Text-Based Question slots. This is **one shared quota** across all Campaign Questions and Open Questions; Campaign Questions and Open Questions do not receive separate additional quotas. Total slots across all campaigns and Open Questions cannot exceed the allocated quota. **Unused monthly slots do not carry forward.** The quota **resets on the 1st day of every calendar month at 12:00 AM IST**. An astrologer who joins mid-month receives a **pro-rata quota based on the remaining days of that month, using whole-number rounding**; from the next calendar month, the normal quota of 1,000 applies, subject to any performance-based reduction (AD-70). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-25 | The astrologer can create multiple campaigns and set their slots/prices, increase/decrease campaign slots, and reallocate unused slots. Purchased/submitted questions must be protected when campaigns are changed or cancelled. | 02 | — | ✅ |
| AD-26 | Astrologers can create campaigns on **any theme or occasion** (for example, Marriage, Career, Education, Business). Regular and Special Campaigns use the **same Campaign Editor**; there is no separate Special Campaign editor, configuration, or workflow. A **Special Campaign** (for example, a limited-time or occasion-based campaign such as a 10-day Navaratri campaign) **must carry a clear Special Campaign label/type; the label is mandatory**. "Open Slots" is **not** a campaign type — questions submitted without a campaign are **Open Questions** (AD-54). Every campaign supports the **General** and **Personal** question types; the astrologer chooses **General only, Personal only, or both General and Personal**; neither type is compulsory. Offers/discounts are optional and decided by the astrologer (AD-56); when none is set, **No Offer** is shown. Campaign fields include Start Date, Expiry Date, slot count, and price. *(Amended 2026-11-19. Amended 2026-11-20 (AP-02-25): Special Campaign label/type mandatory; supersedes "Special Campaign is not a separate campaign type … may give … a special title/label".)* | 02 | 09 | ✅ |
| AD-27 | Campaign Management is located at **My Work → Text Questions → Campaign Management** and includes: Create Campaign, Edit Campaign, Increase/Decrease Slots, Reallocate Slots, Cancel Campaign, **Delete Campaign**. *(Amended 2026-11-19.)* | 02 | 01, 09 | ✅ |
| AD-28 | **Question submission deadline:** two deadlines apply — (1) seven days from slot purchase; (2) the campaign expiry date. The **earlier** of these two dates is the final question submission deadline. Example 1: purchased November 1; seven-day deadline November 8; campaign expires November 10 → deadline November 8. Example 2: purchased November 1; seven-day deadline November 8; campaign expires November 5 → deadline November 5. Days are IST calendar days (AD-71). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-29 | Campaign expiry does not affect questions already submitted. | 02 | — | ✅ |
| AD-30 | The answer deadline starts from **question submission**, not purchase. The astrologer must answer within **30 days** (IST calendar days, AD-71). If unanswered after 30 days, the question is **auto-cancelled** and the User receives a **refund**. *(Amended 2026-11-19.)* | 02 | 01 | ✅ |
| AD-31 | Campaign **cancellation** and campaign **deletion** are allowed. Cancelling, deleting, or expiring a campaign does **not** cancel already purchased/submitted User Questions; the astrologer must still answer them, and the original 30-day deadline continues. **When a campaign is cancelled, Users receive a refund for purchased unused slots.** For campaign **deletion**, the earlier rule is unchanged pending AP-02-24: no refund is issued merely because a campaign was deleted, and a purchased, unused slot remains usable until its **original deadline** — the earlier of purchase + 7 days and the campaign's original expiry date; deletion neither expires it immediately nor extends or resets that deadline. Unsold allocations can be reused/reallocated according to the quota rules. *(Amended 2026-11-19. Amended 2026-11-20: refund of purchased unused slots on cancellation; supersedes "no refund merely because a campaign was cancelled" and slot usability after cancellation.)* | 02 | 09 | ✅ |
| AD-32 | **Priority 2:** 1–19 pending days. **Priority 1:** 20–30 pending days. Day 20 belongs only to Priority 1. At the end of day 30, the deadline expires and auto-cancellation/refund applies. There is no third/normal priority list. Pending days are IST calendar days (AD-71). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-33 | Priority 1 and Priority 2 are **priority classifications (views)**, not question statuses; a question in a Priority classification keeps its own status. A question stays **New / Received** until the astrologer opens it (AD-51). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-34 | The question workspace displays: Question ID and User ID; User name, profile photo, and relevant user details; amount paid and number of slots purchased; previous questions asked; campaign name; General/Personal question type; question received date/time; horoscope attachment and other attachments, if supplied; full question text; Request Correction action when a Personal Question is submitted using a General slot. | 02 | — | ✅ |
| AD-35 | **General/Personal correction:** if a Personal Question is submitted using a General slot, the astrologer can Request Correction. The User can replace it with another General Question, without extra payment, using the same slot. No General-to-Personal upgrade or conversion is available. The corrected question returns to the astrologer. The original 30-day deadline does not restart. If the User does not respond before the original deadline, the question is auto-cancelled and refunded. If the User resubmits an incorrect question again, the astrologer may Request Correction again. The original deadline continues regardless of the number of correction cycles. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-36 | **Answer Editor:** the astrologer answers using a text-based answer editor with a maximum of **1,500** characters; Save Draft; Auto Save; astrologer-created Answer Templates; Preview Answer, so the astrologer can review and correct the answer before final submission; Voice to Text, where the astrologer speaks and the speech is converted into text in the answer editor; answers are text typed manually or produced by voice-to-text, and **no audio-only answer** can be submitted; Attachments (see AD-45) and Add Link to support the answer or recommendations; Remedy prescription action. The astrologer can preview and edit the answer before final submission. "Remember This Question" is removed completely (R-03). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-37 | **No post-submission editing.** The astrologer should use Preview before submitting. Once submitted, the User can immediately view the answer. (Replaces rejected proposal R-01.) | 02 | — | ✅ |
| AD-38 | **Answer Templates:** the astrologer creates and manages their own templates — Save, Edit, Delete, and reuse. Platform-provided common templates are not currently required. | 02 | — | ✅ |
| AD-39 | The astrologer must be able to prescribe a remedy/atonement while answering, including in a **Dispute Answer**. If prescribed or attached in any service, it must appear in the User's Remedy Tracker. This is a cross-service product requirement. *(Amended 2026-11-19.)* | 02 | 01, 17 | ✅ |
| AD-40 | **Rating & Review:** immediately after the answer is delivered, the User gives a **mandatory** rating (1–5 stars); a written review is **optional**. Rating & Review does not block the User from raising a Dispute within 7 days. The enforcement mechanism is not confirmed (AP-10-01). *(Amended 2026-11-20: rating mandatory, written review optional; supersedes "the User can immediately rate and write a review".)* | 02 | 10 | ✅ |
| AD-41 | **Dispute:** the User can raise a Dispute within **7 days after answer submission** (IST calendar days, AD-71). Only one Dispute per question. The astrologer answers the Dispute once, within **3 days**; if the astrologer does not answer within 3 days, the Dispute is **escalated to Admin Review**. The User cannot raise another Dispute after the Dispute Answer. *(Amended 2026-11-19.)* | 02 | 01, 10, 16 | ✅ |
| AD-42 | **Platform Complaint:** the User may raise a separate Platform Complaint within seven days after the Dispute Answer. A Platform Complaint is separate from a Dispute and concerns inappropriate/improper answers. A Platform Complaint does **not** hold or block the astrologer's settlement/payment; the platform handles complaints separately. If inappropriate conduct is established, the Platform may separately decide on recovery/refund according to its own process. *(Amended 2026-11-19.)* | 02 | 16 | ✅ |
| AD-43 | **Settlement:** the astrologer receives payment for completed work under the normal settlement rules. If no Dispute is raised within 7 days after the answer, commission is deducted, the net amount becomes eligible to move to the astrologer's side/settlement, and the question status becomes **Settled**. If a Dispute is raised, settlement follows the Dispute Answer, with commission/net credit after seven days. A Platform Complaint does not hold or block settlement (AD-42). *(Amended 2026-11-19.)* | 02 | 08 | ✅ |
| AD-44 | **Dispute Answer:** maximum 1,500 characters; text reply only; no Answer Templates or Attachments. A Dispute Answer **may include a remedy**, which must also appear in the User's Remedy Tracker (AD-39). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-45 | **Attachments:** **User question attachments** — General Questions allow no attachments; Personal Questions allow up to **two** attachments. **Astrologer answer attachments** — up to **three** attachments per answer, maximum **10 MB per file**, allowed formats **JPEG, PDF, TXT**. The 10 MB limit and formats apply to astrologer answer attachments only. (Replaces rejected proposal R-02.) *(Amended 2026-11-19.)* | 02 | 05, 17 | ✅ |
| AD-46 | **My Work** main page shows: Total Work, Text Questions, Appointments. Text Questions has **four main lifecycle tabs**: Received Questions, Answered Questions, Dispute Questions, and Dispute Solved / Resolved Questions. These must not be collapsed into generic Priority or Completed tabs. **Drafts** and **Expired** remain accessible as secondary tabs or filters. **Priority 1** and **Priority 2** are urgency filters within Received Questions, not lifecycle statuses or replacements for the four main tabs. *(Amended 2026-11-19.)* | 02 | 01, 03, 05 | ✅ |
| AD-47 | **Expired tab:** only questions whose 30-day answer deadline expired and were auto-cancelled/refunded. Old expired records remain available in History. | 02 | — | ✅ |
| AD-48 | **Question cards** include: 1. Question ID; 2. User ID; 3. User Name + Profile Photo; 4. Campaign Name; 5. Question Type; 6. Received Date & Time; 7. Pending Days; 8. Answer Deadline; 9. Priority Status; 10. Horoscope attachment indicator; 11. Other attachments indicator; 12. Question Status; 13. View Question / Answer Now. | 02 | — | ✅ |
| AD-49 | **Filters:** Date Range; Month; Campaign; General/Personal; Priority 1/2; Question Status; Answered/Pending/Disputed/Expired; Search by User ID / Question ID. | 02 | — | ✅ |
| AD-50 | **History:** month-wise history; Received/Answered/Expired summaries; old Answered/Disputed/Expired records; Search and Filters. **Timeline events:** Question Purchased, Question Submitted, Correction Requested, Question Resubmitted, Answer Submitted, Dispute Raised, Dispute Answered, Completed/Expired. | 02 | — | ✅ |
| AD-51 | **Question status lifecycle:** (1) the User purchases/submits a question → **New / Received**; (2) the astrologer opens the question → **Pending** (never before it is opened); (3) the astrologer submits the answer → **Completed**; (4) the 7-day dispute window ends without a Dispute and the amount becomes eligible for settlement → **Settled**. "Answered Questions" is a tab name; the status of questions in it is Completed. Other statuses: Correction Requested, Disputed, Dispute Answered, Expired. *(Amended 2026-11-19.)* | 02 | 13 | ✅ |
| AD-52 | **Minimum answer target:** the monthly minimum answer target is **800** questions out of the 1,000 monthly slots. An astrologer who joins mid-month receives a **pro-rata minimum target based on the remaining days of that month, using whole-number rounding**; from the next month, the full target of 800 applies. Quota reduction for missing the target follows AD-70; the Text-Based Questions service suspension follows AD-73. *(Amended 2026-11-19.)* | 02 | 13 | ✅ |
| AD-53 | **General / Personal definitions:** **General** — answered without using the user's Horoscope/Birth Chart. **Personal** — answered based on the user's Horoscope/Birth Chart. The distinction is based on whether Horoscope/Birth Chart information is used, not on the subject of the question. | 02 | — | ✅ |
| AD-54 | **Open Questions** are questions submitted without selecting a specific campaign. Open Questions support both General Questions and Personal Questions and use the same shared monthly quota (AD-24). Open Questions also support optional offers/discounts (AD-56). Open Questions do not require a Campaign title. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-55 | **Separate pricing:** General and Personal questions always have independent pricing, for every campaign and for Open Questions. The astrologer sets each price independently. One price must not be assumed to apply to both types. (Illustrative example: Marriage – General ₹100; Marriage – Personal ₹200.) | 02 | 09 | ✅ |
| AD-56 | **Separate discounts:** offers/discounts are **optional** and controlled by the astrologer, **not Platform Admin**, for all Campaigns, Special Campaigns, and Open Questions. General and Personal have independent discount settings. The astrologer can independently enable or disable a discount for each type and selects the discount percentage. The maximum discount is **99%**; 100% is not allowed. There is no default discount percentage. The percentage is chosen with a selector that allows increasing/decreasing it, rather than manual typing only. The system calculates the discounted amount automatically and displays the original price, discount percentage, and final payable price. A General discount does not affect Personal pricing, and vice versa. *(Amended 2026-11-19.)* | 02 | 09 | ✅ |
| AD-57 | **Campaign slot allocation:** the astrologer sets a total slot allocation for each campaign and splits it independently between General and Personal; the General and Personal allocations must add up to the campaign's total allocation (illustrative example: Marriage Campaign 500 slots = General 300 + Personal 200). Unsold allocation can be reallocated to other campaigns or question types, subject to the shared monthly quota. The astrologer may reduce a campaign's slots **even below the number already purchased**; this does **not** cancel or invalidate already purchased/submitted User Questions, which the astrologer must still answer; freed capacity can be reallocated within the monthly quota. All campaign and Open Question allocations together must never exceed the astrologer's monthly quota. *(Amended 2026-11-19.)* | 02 | 09 | ✅ |
| AD-58 | **Campaign extension:** if the astrologer extends a campaign, the extension also applies to unused purchased question slots belonging to that campaign. If the astrologer does not extend the campaign, it expires according to its configured expiry date. Reactivating a campaign does not automatically restore already expired purchased slots. | 02 | — | ✅ |
| AD-59 | **Expiry warning and reminders (user side):** if a campaign is **within 3 days of expiry**, the user is warned before purchase. Expiry reminders are sent to users three times: **3 days, 2 days, and 1 day before expiry**. Reminders do not change the expiry or refund rules. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-60 | **Unused purchased slots at campaign expiry:** if the campaign expires and the user has not used all purchased slots despite the notifications, the unused slots expire. No refund is provided for unused slots after campaign expiry; this is treated as the user's responsibility. | 02 | — | ✅ |
| AD-61 | **User-side attachments:** General Questions have no attachment option for the user. Personal Questions have an attachment option for up to **two** attachments; users can attach relevant Horoscope/Birth Chart files or images. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-62 | **No manual cancellation:** after a paid question is submitted, the user has no manual Cancel Question option, and the astrologer has no manual Cancel Question option; once a user submits a question, the astrologer is obligated to answer it. If the astrologer fails to answer within the configured deadline, the system automatically cancels the question and the user receives a refund according to the confirmed refund rules (AD-30). | 02 | — | ✅ |
| AD-69 | **User Question text** has a maximum of **1,000** characters. | 02 | — | ✅ |
| AD-70 | **Quota reduction:** reductions apply to the **following** month, not the already-running month. First consecutive month of missing the 800 minimum target → the following month's quota is reduced by **10%** (900). Second consecutive month of missing the target → the following month's quota is reduced by **20%** (800). If the astrologer completes the reduced quota/target in the reduced month, the full 1,000 quota is restored from the following month. A third consecutive missed month leads to the Text-Based Questions service suspension in AD-73; no further percentage reduction is defined, and after reinstatement the normal 1,000 quota and 800 target apply without carrying forward or restarting any reduction (AD-73). *(Amended 2026-11-19.)* | 02 | 13 | ✅ |
| AD-71 | **IST calendar-day counting** is used consistently for question expiry, answer deadlines, priority calculations, dispute windows, dispute answer deadlines, the monthly quota reset, the Daily Answer Goal, Home daily counts, and other relevant calendar-day calculations. UTC-based date boundaries are not used for user-facing or astrologer-facing calendar-day rules. | 02 | 01, 13, 15 | ✅ |
| AD-72 | **Text-Based Questions and Subscription Questions:** both categories remain available and are displayed **separately**. **Text-Based Questions** are the normal Text-Based Question service; **Subscription Questions** are questions offered to users as part of a subscriber benefit/offer. Subscription Questions do not replace normal Text-Based Questions, and the two are never merged into one count or one indistinguishable section. Benefit questions per subscription: Silver **1**, Gold **3**, Platinum **4**. Subscription prices, validity periods, renewal rules, and other plan benefits are not confirmed. *(Amended 2026-11-19.)* | 02 | 01, 07, 11, 12 | ✅ |
| AD-73 | **Text-Based Questions service suspension:** if the astrologer misses the monthly minimum answer target for **three consecutive months**, only the **Text-Based Questions service** is suspended for **three months**. The astrologer account is not suspended, and other services remain available under their normal rules. During the suspension, **all new Text-Based Question purchases and submissions are blocked**, including new Campaign Questions and Open Questions. **Previously purchased questions and slots remain valid** during the suspension (within their existing validity, AD-28) and are not blocked or cancelled because of the suspension. The astrologer must answer every outstanding previously purchased question during the suspension period; existing questions continue under the normal 30-day answer deadline, and any question not answered within its deadline is automatically cancelled and refunded under the existing rules (AD-30). **Reopening:** after the three-month period, the service reopens **only after all outstanding previously purchased questions have been answered** or resolved through the existing auto-cancellation/refund process; until then it stays unavailable. On reopening, the normal monthly quota of **1,000** and minimum target of **800** apply; any previous 10% or 20% reduced quota is not carried forward, and the reduced-quota progression is not restarted. *(Amended 2026-11-19.)* | 02 | 01, 13 | ✅ |
| AD-74 | **DND / Planned Unavailability — activation and visibility:** DND can be activated only when the astrologer is not engaged in active work; it **cannot be activated during an ongoing Instant Call or Instant Chat**, which must be finished first. While DND is active, the astrologer's **entire profile is invisible to all users** for the complete selected period: users cannot view the profile or book any service, all services are unavailable (Text-Based Questions, Appointments, Instant Call, Instant Chat, and other bookable services), and users are blocked from submitting new Text-Based Questions to the astrologer. Hiding the profile is required; disabling a booking button while the profile stays discoverable is not sufficient. | 02 | 01, 03, 04, 05, 06 | ✅ |

### 3.3 Global Navigation (owner: `03_GLOBAL_NAVIGATION.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-75 | **My Work and notification access:** My Work is the main work-management page. The notification bell must be available. (Five primary tabs: AD-03; app opens on Home: AD-63.) | 03 | 01, 05, 14 | ✅ |
| AD-76 | **Record navigation:** every card, button, list row, history record, and action must open its corresponding detail page or record, using the correct record ID and deep link. No dead-end, broken, generic, or incorrect-record navigation is allowed. This applies throughout the entire app. | 03 | 01, 02, 05, 14 | ✅ |
| AD-77 | **Back navigation:** Back returns to the exact previous page and preserves the applicable filters, search, sorting, and selected tabs. | 03 | 01, 02, 05, 08, 11, 14 | ✅ |
| AD-78 | **Required record targets:** Text Question dispute → that exact question's Dispute Details; Appointment history row → that Appointment's Details; Call/Chat history row → that Consultation's Details; Wallet transaction → that Transaction's Details; Audience user → that exact User Profile; Review → that Review's Details; Content post → that post's Content Details/Edit page. | 03 | 01, 02, 05, 06, 08, 10, 11, 12, 17 | ✅ |

### 3.4 Profile and Verification (owner: `04_PROFILE_AND_VERIFICATION.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-79 | **Profile structure:** the profile is divided into separate sections rather than one giant Edit Profile screen: Personal Information, Professional Information, Astrology Expertise, Profile Media, Service Information, Verification, Profile Preview, and Profile Completion. Each information section is edited separately. | 04 | — | ✅ |
| AD-80 | **Personal Information fields:** Full Name, Profile Photo, Date of Birth, Gender, Mobile, Email, City/State/Country, About Me/Bio. | 04 | — | ✅ |
| AD-81 | **Professional Information fields:** Astrologer ID, Years of Experience, Education, Certifications, Professional Introduction, Languages. | 04 | — | ✅ |
| AD-82 | **Astrology Expertise fields:** astrology types (for example Vedic, KP, Numerology, Vastu); specializations (for example marriage, career, finance, family, health); expertise areas; consultation languages. | 04 | — | ✅ |
| AD-83 | **Profile Media:** Profile Photo; optional Introduction Video; Certificates/Qualification Documents; Supporting Documents. | 04 | — | ✅ |
| AD-84 | **Service Information:** the profile provides shortcuts to Text Questions, Appointments, Instant Call, and Instant Chat. Pricing and availability are managed in their respective modules, not in the profile. | 04 | 05, 06 | ✅ |
| AD-85 | **Verification:** the profile shows KYC status, identity verification status, and certificate verification status, and offers a re-upload documents option. Unconfirmed KYC steps or approval statuses must not be invented. | 04 | 07 | ✅ |
| AD-86 | **Profile Preview and Completion:** Profile Preview shows how the profile appears in the User App. A profile completion indicator is provided. | 04 | — | ✅ |
| AD-87 | **Edit and approval:** selected important profile changes require Platform Admin approval. Until approval, the previously verified details remain visible in the User App. | 04 | — | ✅ |

### 3.5 Appointments (owner: `05_APPOINTMENTS.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-88 | **Appointment type and booking:** Appointments are **voice-only** consultations; there are no video appointments. The User chooses an astrologer, views available slots and prices, books, and pays. Successful payment **immediately confirms** the appointment; there is no astrologer approval or Pending stage after successful payment. | 05 | — | ✅ |
| AD-89 | **Appointment statuses:** **Confirmed**; **Under Review** (when the astrologer opens the booking details / reviews the purpose); **Completed** (when the call ends); **Cancelled**; **Missed / No-show**. Payment settlement status is kept separate from appointment status. | 05 | 13 | ✅ |
| AD-90 | **Duration and pricing:** appointment durations are **15 minutes** or **30 minutes**. The astrologer sets a separate price for each duration. One selected duration applies consistently across the selected schedule period. Price changes apply only to future bookings; existing confirmed bookings keep their original booked price. | 05 | — | ✅ |
| AD-91 | **Astrologer-cancelled appointments:** the astrologer receives **no earnings** for an appointment cancelled by the astrologer. | 05 | 08 | ✅ |
| AD-92 | **Calendar and recurring availability:** calendar views are Daily, Weekly, and Monthly. Recurring weekly availability applies automatically within a **rolling 90-day booking horizon**. Weekly overrides and single-date overrides do not modify the recurring schedule. Controls are simple click/edit controls. | 05 | — | ✅ |
| AD-93 | **Buffers, breaks, and closed dates:** buffer options are **5 or 10 minutes**, inserted automatically after appointments. Multiple breaks may be added or removed. A slot is not displayed if the full appointment duration cannot finish before the next break. The astrologer can block or close a date. | 05 | — | ✅ |
| AD-94 | **Date closure with confirmed appointments:** date closure is a separate appointment workflow, distinct from DND (AD-09). If the astrologer manually closes a date that already has confirmed appointments, each affected User is offered **rescheduling or a full refund to the User Wallet**. The astrologer cannot independently reschedule the User's booking. The User may reschedule once. If the astrologer cannot inform Users in advance, all affected appointments that day are **automatically cancelled** and the Users are refunded. | 05 | 01 | ✅ |
| AD-95 | **Booking lock and double booking:** during payment the selected slot is locked for **10 minutes**. If payment succeeds within 10 minutes, the appointment is confirmed. If payment fails or the lock expires, the slot is released. Booking validation is atomic, so the same slot can never be booked twice by simultaneous bookings. | 05 | — | ✅ |
| AD-96 | **Joining the appointment call:** the User and the astrologer may join **5 minutes before** the scheduled time. A **5-minute grace period** applies after the scheduled time. If a participant still has not joined, the relevant no-show handling applies (AD-98, AD-99). | 05 | — | ✅ |
| AD-97 | **Appointment technical disconnection:** on technical disconnection, automatic reconnection is attempted for **5 minutes**, and the remaining appointment time is preserved. If the appointment cannot continue because of technical failure, the Platform reviews it and the User receives a reschedule option. Neither participant is automatically blamed without evidence. | 05 | — | ✅ |
| AD-98 | **Astrologer cancellation and astrologer no-show:** if the astrologer cancels, the User chooses a reschedule or a full User Wallet refund. The User may reschedule once. The astrologer cannot reschedule on the User's behalf. If the astrologer is a no-show, the User receives a full Wallet refund. Repeated astrologer no-shows are recorded as incidents and warnings are issued; the repeated-incident warning threshold is configurable, not a fixed number. | 05 | — | ✅ |
| AD-99 | **User cancellation and User no-show:** the User cancellation policy is **12 hours before the appointment**. Late cancellation follows the late-cancellation percentage deduction policy of the User App. A User no-show follows the same late-cancellation policy. The percentage is not invented or changed here (its value is tracked in AP-05-01). | 05 | — | ✅ |
| AD-100 | **Appointment reminders:** notifications are sent to **both parties** immediately after booking confirmation; 3 days before; 2 days before; 1 day before; on the appointment day 1 hour before; on the appointment day 15 minutes before; and immediately after a cancellation or rescheduling. Only one reminder is sent for each specified interval. | 05 | 14 | ✅ |
| AD-101 | **Appointment Details:** shows Appointment ID; User name and User ID; booking date/time; duration; voice-only type; payment amount and payment status; consultation purpose; uploaded horoscope; saved horoscope selection; birth details only where User consent permits sharing; the User's private notes, if shared. The astrologer may create **private preparation notes** visible only to the astrologer. | 05 | — | ✅ |
| AD-102 | **Post-consultation attachments:** the astrologer may attach notes, remedies, recommendations, or reports immediately after the call or later through Appointment History. A pending attachment/action has a visible indicator, and reminders are sent until the required attachment/action is completed. Attachments are saved in Appointment History and the Remedy Tracker. Appointment completion and settlement do not depend on attachment submission. Attachments follow the finalized astrologer answer attachment rules (AD-45); User question limits do not apply. | 05 | 14, 17 | ✅ |

### 3.6 Instant Call and Instant Chat (owner: `06_INSTANT_CALL_AND_CHAT.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-103 | **User selection:** the User sees two separate choices, Instant Call and Instant Chat. When the User selects one service, the astrologers currently available for that specific service are shown. The User selects an astrologer and sends a request. The User is never automatically routed to another astrologer. | 06 | — | ✅ |
| AD-104 | **Request lifecycle:** the astrologer receives a request popup only if the corresponding service is enabled — a Call request only when Call is active, a Chat request only when Chat is active. The astrologer must accept within **30 seconds**; otherwise the request **expires**. A rejected request becomes **Declined**. The User is then offered **Try Again** and **Try Some Other Astrologer**. The same rejected astrologer must not automatically receive the same request again. The User may cancel a request before the astrologer accepts. | 06 | 13 | ✅ |
| AD-105 | **Single active consultation lock:** Call and Chat may both be Online at the same time, but only **one pending request or active consultation** is allowed across both services, using **one atomic availability lock**. The first request obtains the lock; a simultaneous second request receives **Busy**/rejection. Once a request is accepted, the other service remains unavailable until the session ends. A rejected, expired, or cancelled request releases the lock and restores availability. | 06 | 01 | ✅ |
| AD-106 | **Prepaid packages:** Instant Call and Instant Chat use **prepaid packages**, not postpaid per-minute billing. The astrologer configures package durations and prices; the minimum package duration is **5 minutes**. The User sees the packages on the astrologer's profile and pays the entire package amount before the session starts. (Example: ₹75 for 5 minutes — illustrative only.) | 06 | 04 | ✅ |
| AD-107 | **Session duration and extension:** there is **no refund for early termination** by either the User or the astrologer. The purchased package duration is the paid time, but neither party is required to remain for the entire duration; either party may end the session early. The extension option appears **1 minute before** package expiry; the User pays for the next package to extend. If payment succeeds before expiry, the same session continues; if payment is not completed before expiry, the session ends automatically. The billing timer stops when the session ends. | 06 | — | ✅ |
| AD-108 | **Early termination complaint:** if an astrologer deliberately ends a session early without answering the User's question, the User may submit a Platform complaint/review identifying the astrologer and the incident. The Platform investigates. If astrologer fault is confirmed, a warning notification is issued, and repeated incidents are monitored for possible further action. No automatic refund is issued. | 06 | 10, 16 | ✅ |
| AD-109 | **Technical failure:** for a Call, automatic reconnection is attempted for **5 minutes**, and the remaining paid time is preserved during reconnection. Chat messages are saved and available after reconnection. The session ends automatically when the package time expires. | 06 | — | ✅ |
| AD-110 | **Call History:** shows Consultation ID; astrologer details; date/time; actual duration; package and amount; payment details; recommended attachments, if any. | 06 | — | ✅ |
| AD-111 | **Chat History (24-hour rule):** full chat messages remain accessible to both the User and the astrologer for **24 hours only**. During those 24 hours the astrologer can save/download the chat as text. After 24 hours the messages become inaccessible to both parties. Booking details, consultation date/time, astrologer details, and payment records remain visible in history. The same 24-hour rule applies in the User App and the Astrologer App. | 06 | 03, 14 | ✅ |

### 3.7 Live Sessions (owner: `07_LIVE_SESSIONS.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-112 | **Live eligibility and frequency:** every Verified Astrologer can start a Live Session without Admin approval. One Live Session is allowed per calendar month. If the astrologer cancels a scheduled Live, they may schedule another Live in the same month. | 07 | 04 | ✅ |
| AD-113 | **Live is free:** Live is free for now; there is no current paid Live payment or earnings workflow. Paid Live is a separate future requirement; if it is introduced later, Live earnings are shown separately in Wallet. | 07 | 08 | ✅ |
| AD-114 | **Scheduling and audience:** both **Schedule Live** and **Start Now** are available. Topic and Description are required; Thumbnail is optional. The astrologer chooses the audience: Public, Followers, Subscribers, or specific subscription tiers (for example Silver or Gold). Only the selected audience receives Live notifications. | 07 | — | ✅ |
| AD-115 | **Preview and interaction:** a Preview/Test is available before starting. Comments are available only to the audience selected by the astrologer. The astrologer may answer questions/comments at their discretion and has no obligation to answer every comment. The astrologer may **Mute** or **Remove** users during a Live. | 07 | — | ✅ |
| AD-116 | **Pause and resume:** the astrologer may Pause and Resume a Live. The Live must resume within **5 minutes**; otherwise it ends automatically. | 07 | — | ✅ |
| AD-117 | **No recording:** there is no Live recording or replay for now. | 07 | — | ✅ |
| AD-118 | **Live notifications:** the selected audience is notified when a Live is scheduled, with reminders **1 day**, **1 hour**, and **15 minutes** before, and a **Live Started** notification. Users are notified if a scheduled Live is cancelled or the astrologer does not show. On technical interruption, resuming is attempted; if the Live cannot continue, the interruption is recorded and users are notified. | 07 | 14 | ✅ |
| AD-119 | **Post-Live summary:** shows Live duration, participant count, and comment count. No participant capacity limits or account-based participant tiers apply. | 07 | 13 | ✅ |

### 3.8 Wallet and Earnings (owner: `08_WALLET_AND_EARNINGS.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-120 | **Wallet overview:** one screen shows Available Balance, Pending Balance, Held Balance, Total Earnings, Total Withdrawn, and Recent Transactions. Each recent transaction shows Transaction ID, service/type, date/time, amount, and status. | 08 | — | ✅ |
| AD-121 | **Service-wise earnings:** earnings are shown separately for Text Questions, Appointments, Instant Call, and Instant Chat. For each service, the applicable Gross Revenue, Commission, Net Earnings, and Pending/Available amount are shown. | 08 | 09, 13 | ✅ |
| AD-122 | **Transaction history:** a unified transaction history shows Transaction ID; service/type; related User/Appointment/Consultation ID; date/time; gross amount; commission; net amount; status; with relevant filters. | 08 | — | ✅ |
| AD-123 | **Month-wise history:** a month/year selector shows that month's summary and full transaction history. A monthly **PDF Earnings Statement** can be downloaded. | 08 | — | ✅ |
| AD-124 | **Commission rates:** Instant Call **2%**; Instant Chat **2%**; Appointment **3%** (astrologer net 97%). Other services follow their separately finalized commission rules. No single rate (such as 10%) is applied universally. Wallet top-up rules for Users are not part of Astrologer service earnings. | 08 | 02, 05, 06, 09 | ✅ |
| AD-125 | **Withdrawal:** minimum astrologer withdrawal is **₹500**. Withdrawal requests may be made at any time, subject to the Available Balance. Payout methods: Bank Account and UPI. Account verification is required, and Platform verification is completed before payout processing. Payout processing target: within **3 working days**. Withdrawal statuses: **Pending**, **Processing**, **Paid**, **Failed**. A failed payout returns the amount to the Available Balance. Duplicate withdrawal requests/payments are prevented. The User App's ₹500 minimum retained balance (User App D-32) is not an Astrologer Wallet rule. | 08 | 04 | ✅ |
| AD-126 | **Settlement release:** eligible earnings are released **twice weekly, on Tuesday and Friday**. Withdrawal request frequency and settlement release frequency are separate. Held Balance includes only earnings for services not yet completed. After service completion and the applicable eligibility period, eligible earnings are released in the next Tuesday/Friday settlement run. Eligibility periods: Text Questions **7 days** (AD-43); Appointments **3 days** after completion; Instant Call and Instant Chat — not confirmed (AP-08-03). A complaint or review does not automatically move earnings to Held Balance. Service completion, settlement release, and withdrawal status are distinct and must not be confused. | 08 | 02, 05, 06, 10 | ✅ |

### 3.9 Offers and Earnings Calculations (owner: `09_OFFERS_AND_EARNINGS_CALCULATIONS.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-127 | **Offer discount and commission calculation:** the **astrologer bears the discount**. Commission is calculated on the amount the User actually pays after the discount, using the actual commission rate finalized for that service. Illustrative example (rate illustrative only): original price ₹100, discount ₹20, User pays ₹80; with a 10% rate, commission is ₹8 (on ₹80, not ₹100) and astrologer net earnings are ₹72. | 09 | 02, 06, 08 | ✅ |
| AD-128 | **Offer performance:** tracks original price/revenue, discount amount, actual amount collected, commission, net astrologer earnings, number of purchased questions/slots/bookings, offer usage, and month-wise offer performance. Offer financial data must be consistent with Wallet & Earnings; revenue and discounts are never double-counted. | 09 | 02, 08 | ✅ |

### 3.10 Ratings and Reviews (owner: `10_RATINGS_AND_REVIEWS.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-129 | **Mandatory rating:** after completion of a Text Question, Appointment, Instant Call, or Instant Chat, a **1–5 star rating is mandatory**; written feedback is optional. The User cannot directly edit or delete a submitted review but may request changes through Platform Support. The enforcement mechanism is not confirmed (AP-10-01). | 10 | 02, 05, 06, 16 | ✅ |
| AD-130 | **Astrologer review management:** the astrologer can view all incoming reviews. Replying is optional, with no penalty for not replying. The astrologer may publish positive/selected reviews and may hide reviews. Hidden reviews are not shown in the User App and remain fully visible to Platform Admin. The astrologer may edit or delete their own reply. Only one current reply exists per review. | 10 | 02 | ✅ |
| AD-131 | **Review statuses:** **Pending Publication**, **Published**, **Hidden**; and **Replied / Not Replied**, as applicable. | 10 | 02 | ✅ |
| AD-132 | **Rating calculation:** the public overall rating uses **Published** reviews only. Platform internal monitoring may consider all reviews, including Hidden reviews. | 10 | 02 | ✅ |
| AD-133 | **Platform Admin review permissions:** Platform Admin can view all reviews and replies; publish or hide reviews; remove reviews for policy violations; hide or remove replies; flag and investigate reviews; and monitor negative review patterns. When Admin hides/removes a review or reply, the astrologer is notified with the reason. | 10 | 02, 14 | ✅ |
| AD-134 | **Service-wise ratings:** ratings and reviews are shown service-wise for Text Questions, Appointments, Instant Call, and Instant Chat. | 10 | 02 | ✅ |

### 3.11 Audience (owner: `11_AUDIENCE.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-135 | **One Audience page:** Audience is one page with one customer list, filtered by **All Users**, **Followers**, and **Subscribers**. There are no duplicate separate pages or lists for Followers and Subscribers. | 11 | — | ✅ |
| AD-136 | **Customer card:** each customer card may show User Name, User ID, Follow status, Subscription status, relevant dates, and a View Profile action. | 11 | — | ✅ |
| AD-137 | **Audience features:** search; sort; date filters where relevant; customer details; interactions; subscription status; blocked-user context; correct User Profile navigation; previous filters/search preserved when returning. Illustrative counts are never presented as real data. | 11 | — | ✅ |

### 3.12 Content Management (owner: `12_CONTENT_MANAGEMENT.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-138 | **Content Management module:** Content Management is a dedicated module that manages both **General Posts** and **Subscriber Benefit Content**. Content creation, scheduling, and delivery belong only to this module; no separate Perks & Benefits module duplicates them (benefit eligibility/rules may be documented separately). The Home Quick Action "Benefits & Content" (AD-21) opens this module. | 12 | 01 | ✅ |
| AD-139 | **General Posts:** formats are Text Posts and Image Posts; there are no Video Posts. Audience: Public, Followers, Subscribers, or individual subscription tiers (for example Silver and Gold). Features: Publish Now, Schedule, Save Draft, Edit, Delete; Published and Scheduled status; engagement/performance history. Users can Like and Comment. | 12 | 13 | ✅ |
| AD-140 | **Subscriber Benefit Content:** manages Daily, Weekly, Monthly, and Special Predictions in Text and Image formats. Each subscription tier may have separate content (for example, Silver and Gold content can differ). Daily and Weekly recurring schedules are supported. Delivery history shows Delivered, Missed, and Pending where applicable; missed scheduled content is recorded as **Missed**. Users with expired subscriptions cannot access subscriber-only content. | 12 | — | ✅ |
| AD-141 | **Prediction template (12 Rasis):** Daily, Weekly, and Monthly predictions use one default template containing all 12 zodiac signs (Rasis): the 12 Rasis in the left column and a prediction input field for each Rasi in the right column. The template provides the 12 signs automatically; the astrologer only fills the prediction fields. New content is created for the relevant date, week, or month. Content format is Text + Image. | 12 | — | ✅ |
| AD-142 | **Special astrology templates:** ten optional prebuilt templates: Guru Peyarchi, Sani Peyarchi, Rahu Peyarchi, Ketu Peyarchi, Sevvai Peyarchi, Surya Peyarchi, Sukra Peyarchi, Budha Peyarchi, Surya Grahanam, Chandra Grahanam. Annual or recurring use is not forced. All astrologers can access and use all available templates. For every template the astrologer selects the audience: Public, Followers, Subscribers, or specific tiers. | 12 | — | ✅ |
| AD-143 | **Custom content:** the astrologer can create original content without a template. The custom editor includes Custom Title, Text/Description, Image Upload, Audience Selection, Publish Now, Schedule, and Save Draft. | 12 | — | ✅ |
| AD-144 | **Editor and preview:** before submission a split-screen layout is used — left: full content editor, content fields, formatting, template fields, image upload, audience selection, scheduling controls; right: live User App preview that updates immediately as the astrologer edits. Preview works before Publish Now, Schedule, and Save Draft. On mobile, Editor/Preview tabs are used when split-screen is not practical. | 12 | — | ✅ |

### 3.13 Analytics and Performance (owner: `13_ANALYTICS_AND_PERFORMANCE.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-145 | **Analytics metrics (kept simple):** Profile Performance — Profile Views, Followers Growth, Subscribers Growth. Text Questions — Received, Answered/Completed, Pending ("Answered" and "Completed" are one metric for the same completed question, AD-51, and are never counted twice). Appointments — Bookings, Completed, Cancelled, Missed. Instant Call and Chat — Requests, Accepted, Declined, Completed Sessions, Usage. Live — Live Sessions, Participants, Comments. Content — post-wise Views, Likes, Comments, Audience Type, Engagement. Growth and Trends — daily, weekly, and monthly graphs. Earnings Summary — service-wise earnings overview only; detailed financial transactions remain in Wallet. No unnecessary features are added. *(Amended 2026-11-20 (AP-13-01): supersedes "Received, Answered, Pending, Completed".)* | 13 | 07, 08, 12 | ✅ |
| AD-146 | **Analytics display and filters:** an overall dashboard with KPI cards and graphs; Daily/Weekly/Monthly/Custom Date Range filters; clicking a service opens its details; Previous Period Comparison. | 13 | — | ✅ |
| AD-147 | **Analytics data correctness:** analytics use the correct source data, do not conflate statuses, never count the same event twice, and keep calculations consistent with the relevant module and Wallet. | 13 | 09 | ✅ |

### 3.14 Notifications and Reminders (owner: `14_NOTIFICATIONS_AND_REMINDERS.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-148 | **Activity & Notification Centre categories:** a complete Activity & Notification Centre (not just a reminder page) with these categories and events — **A. New Activity and Customer Updates:** New Follower; New Subscriber; New Subscription/Renewal; Subscription Expired/Cancelled; New user interaction. **B. Text Questions:** New Question Received; Question Accepted/Opened; Answer Pending Reminder; Answer Submitted/Completed; New Dispute/Clarification Request; Dispute Response Required. **C. Appointments:** New Booking; Confirmed; Upcoming Reminder; Cancelled/Rescheduled; Completed; Missed. **D. Instant Call and Chat:** New Call/Chat Request; Accepted; Declined; Expired; Consultation Started/Completed; Package Expiry/Extension Reminder; Technical Disconnection/Reconnection. **E. Content:** Post Published; Scheduled Post Reminder; Content Delivery Success/Missed; New Likes/Comments; Subscriber Content Updates. **F. Live:** Live Scheduled; Live Reminders; Live Started; Live Ended/Interrupted. **G. Wallet and Earnings:** New Earnings; Commission/Offer Discount Details; Settlement Released; Withdrawal Requested; Withdrawal Processing; Withdrawal Paid; Withdrawal Failed; Monthly Statement Available. **H. Account and Security:** New Login; New Device Login; Password Changed; Email/Mobile Changed; Profile Updated; KYC Submitted/Approved/Rejected; Bank Account/UPI Added/Changed; Important Security Alerts. **I. Platform and Support:** Admin Announcements; Support Ticket Updates; Platform Replies; Ticket Resolved/Closed; Policy/App Updates. | 14 | 01, 02, 04, 05, 06, 07, 08, 09, 10, 11, 12, 15, 16 | ✅ |
| AD-149 | **Notification Centre features:** Read/Unread; date and time; category filters; notification history; unread count; navigation to the exact related detail page; push notifications for important alerts; security alerts clearly identified. Duplicate notifications for the same event are avoided. | 14 | 01, 03, 05 | ✅ |
| AD-150 | **Notification preferences rule:** Settings provides category-wise and event-specific On/Off preferences. Important security alerts are mandatory and cannot be disabled. | 14 | 01, 15 | ✅ |
| AD-151 | **Availability vs notifications:** Service Availability determines whether the astrologer accepts new work; Notification Preferences determine whether the astrologer receives optional notifications. Turning off notifications never changes service availability, and turning a service Offline never automatically changes notification preferences. | 14 | 01, 06, 15 | ✅ |

### 3.15 Settings and Preferences (owner: `15_SETTINGS_AND_PREFERENCES.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-152 | **Account Settings:** account details; registered mobile/email; Change Password; Login/Security Activity. | 15 | — | ✅ |
| AD-153 | **Notification Preferences (Settings):** push notifications On/Off; Sound/Vibration; category-specific preferences; event-specific preferences; important security alerts mandatory (AD-150). | 15 | 14 | ✅ |
| AD-154 | **Language and Regional Settings:** app language — English, Tamil, and other supported languages; date format; time zone, IST by default. | 15 | — | ✅ |
| AD-155 | **App Preferences:** Light Mode; Dark Mode; camera permissions; microphone permissions; Photos/Files access. | 15 | — | ✅ |
| AD-156 | **Privacy and Security:** Privacy Policy; Terms and Conditions; Data/Privacy Information; Active Login Sessions; Logout from other devices. | 15 | — | ✅ |
| AD-157 | **About and Account Actions:** App Version; About AstroConnect; Logout; Request Account Deactivation; Request Account Deletion. Deactivation and deletion requests are routed to Platform Admin for approval; an account is never deactivated or deleted instantly without the approval workflow. | 15 | — | ✅ |

### 3.16 Help and Support (owner: `16_HELP_AND_SUPPORT.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-158 | **Help & Support scope:** Help & Support is the dedicated support centre for issues raised by the astrologer. There is no general Astrologer "Disputes & Complaints" module for User-raised disputes. | 16 | — | ✅ |
| AD-159 | **Support categories:** Account/Profile/KYC; Text Questions; Text Question Disputes/Clarifications; Campaigns/Quota; Appointments; Instant Call/Chat; Wallet/Earnings/Commission/Settlement/Withdrawal; Subscription/Offers; Ratings & Reviews; Audience/Customers; Live Sessions; Content/Posts; Remedies/Reports; Rewards/Notifications; App/Technical; Other/General Support. Other/General Support is always available. | 16 | — | ✅ |
| AD-160 | **Support ticket:** a ticket has Category/Subcategory; Issue Description; Related ID; Screenshots/Documents; Ticket ID; Ticket Status; Platform Replies; Ticket History; and a Reopen option where allowed. Ticket statuses as listed in the Master Decision Document (described there as suggested): Open, Under Review, Awaiting Astrologer Response, Resolved, Closed. | 16 | — | ✅ |
| AD-161 | **User blocking:** if an astrologer wants a User blocked, the request goes to Platform Admin for review. The astrologer cannot block a User unilaterally. | 16 | 11 | ✅ |
| AD-162 | **Dispute separation:** Text Question disputes are answered by the astrologer within the Text Questions workflow (AD-41). For Appointments, Instant Call, and Instant Chat, User feedback is handled through Ratings & Reviews; there is no separate User-dispute section for these services. Platform Admin handles User-raised disputes. Astrologer-raised platform issues use Help & Support. | 16 | 02, 05, 06, 10 | ✅ |

### 3.17 Remedy Tracker (owner: `17_REMEDY_TRACKER.md`)

Source: Master Decision Document (2026-11-20).

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-163 | **Remedy Tracker — appointment records:** notes, remedies, recommendations, and reports attached after an Appointment (immediately or later through Appointment History, AD-102) are also available in the Remedy Tracker. The relationship between each remedy/report, the relevant User, and the originating Appointment/Consultation is preserved, with correct navigation to the original record. No additional remedy subscription, payment, or delivery workflows are added. | 17 | 01, 02, 03, 05 | ✅ |

---

## 4. Open Questions Register

Each item shows its status: **Open** items may not be treated as decisions
until confirmed by the product owner; **Resolved** items keep their original
ID and record the finalized decision (§1, step 5). Earlier questions retired
under the previous process are listed in §9 and are not restored.

### AP-GL — Cross-cutting (Astrologer App)

AP-GL-01 was resolved by AD-71.

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-GL-02 | Under which of the five main tabs (AD-03) are Audience, Ratings & Reviews, Analytics, Content Management, Settings, Help & Support, and the Remedy Tracker placed? Finalized per the product owner but not present in the repository. Wallet is associated with Earnings only through the existing "Earnings/Wallet section" wording of AD-14; its exact placement inside the Earnings tab is not documented. | AD-03, AD-14, AD-23; files 08, 10–17 | Open — missing source information |

### AP-01 — Home Screen (owner: `01_HOME_SCREEN.md`)

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-01-03 | What are the exact Peak Demand time ranges for Morning, Afternoon, Evening, and Night, and over what calculation period is demand measured? | AD-16 | Resolved — Peak Demand uses the last 7 days of incoming Text-Based Question and Appointment booking data, with IST ranges Morning 5:00 AM–11:00 AM, Afternoon 11:00 AM–4:00 PM, Evening 4:00 PM–8:00 PM, Night 8:00 PM–5:00 AM (AD-16) |
| AP-01-05 | What are "subscription-based requests" in the DND rule? | AD-07; X-14 | Resolved — during DND the astrologer's entire profile is hidden, so every service, including Subscription Questions, is unavailable (AD-07, AD-74) |
| AP-01-14 | AD-07 states that during DND / Planned Unavailability the astrologer is unavailable for all services, including Appointments. Amended AD-09 (2026-11-20) keeps existing confirmed appointments valid. Confirm that AD-07 applies to new requests only, so that confirmed appointments are still conducted during DND. | AD-07, AD-09, AD-74, AD-164; X-17 | Resolved — DND blocks all new services; existing confirmed appointments remain valid (AD-07 amended 2026-11-20, AD-09) |
| AP-01-15 | Planned Unavailability limits: maximum duration, minimum notice period, or any other limit. Not confirmed; none may be invented. | AD-09 | Open |
| AP-01-16 | **Flowers received today** was requested for the Home Live Activity ticker (AD-166), but "Flowers" is not defined in any repository source: what a Flower is, who sends it, where it is received, and whether it affects earnings. PENDING DISCUSSION. | AD-166 | Open |
| AP-01-17 | The ticker was requested to show "Appointments booked today". Appointment records have no booking date in the current data, so the prototype counts appointments **scheduled** for today (same rule as Today's Work). Confirm whether the message means booked today or scheduled today. PENDING DISCUSSION. | AD-166, AD-17 | Open |

### AP-02 — Text-Based Questions (owner: `02_TEXT_BASED_QUESTIONS.md`)

AP-02-22 and AP-02-23 were resolved by AD-73.

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-02-24 | Ruling C1 (2026-11-20) refunds purchased unused slots when a campaign is **cancelled**. Does the same refund apply when a campaign is **deleted**? Until confirmed, AD-31 keeps the earlier deletion rule (no refund; slot usable until its original deadline). | AD-31; X-16 | Open |
| AP-02-25 | The Master Decision Document states that a Special Campaign "must have a clear label/type". AD-26 (and User App D-20) state that Special is not a separate campaign type and that the special title/label is optional. Confirm whether a label is mandatory for special/occasion campaigns. AD-26 is unchanged until confirmed. | AD-26; User App D-20 | Resolved — a Special Campaign must carry a clear Special Campaign label/type; mandatory (AD-26 amended 2026-11-20; User App D-20 aligned, X-25) |

### AP-03 — Global Navigation (owner: `03_GLOBAL_NAVIGATION.md`)

No open questions.

### AP-04 — Profile and Verification (owner: `04_PROFILE_AND_VERIFICATION.md`)

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-04-01 | KYC and verification steps, and the approval statuses shown for KYC, identity, and certificate verification. Not confirmed; none may be invented. | AD-85, AD-112; PA-04 | Open |
| AP-04-02 | Which profile changes are "selected important changes" that require Platform Admin approval? | AD-87; PA-04 | Open |

### AP-05 — Appointments (owner: `05_APPOINTMENTS.md`)

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-05-01 | The User late-cancellation percentage deduction and its exact calculation (also used for User no-shows). Finalized per the product owner as already documented in the User App, but it is not present in any User App document (User App P-07-04 – P-07-06 remain Open). | AD-99; X-19; User App P-07-04 – P-07-06 | Open — missing source information |

### AP-06 — Instant Call and Instant Chat (owner: `06_INSTANT_CALL_AND_CHAT.md`)

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-06-01 | Instant Call / Instant Chat: refund or remaining-balance handling when reconnection permanently fails after the 5-minute window. Not confirmed. | AD-107, AD-109; X-20 | Open |

### AP-07 — Live Sessions (owner: `07_LIVE_SESSIONS.md`)

No open questions.

### AP-08 — Wallet and Earnings (owner: `08_WALLET_AND_EARNINGS.md`)

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-08-01 | Definition of **Pending Balance** (Held Balance is defined in AD-126). Not present in the repository. | AD-120, AD-126 | Open — missing source information |
| AP-08-02 | Commission rate for Text Questions. Not present in the repository; no rate (including 10%) may be assumed. | AD-43, AD-124, AD-127 | Open — missing source information |
| AP-08-03 | Settlement eligibility period for Instant Call and Instant Chat. Not present in the available source; it must not be assumed to be 3 or 7 days. | AD-126 | Open — missing source information |

### AP-09 — Offers and Earnings Calculations (owner: `09_OFFERS_AND_EARNINGS_CALCULATIONS.md`)

No open questions.

### AP-10 — Ratings and Reviews (owner: `10_RATINGS_AND_REVIEWS.md`)

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-10-01 | Mandatory rating enforcement: does the app block the User's next action, prompt repeatedly, or use another mechanism? Not confirmed. | AD-40, AD-129; X-18 | Open |

### AP-11 — Audience (owner: `11_AUDIENCE.md`)

No open questions.

### AP-12 — Content Management (owner: `12_CONTENT_MANAGEMENT.md`)

No open questions.

### AP-13 — Analytics and Performance (owner: `13_ANALYTICS_AND_PERFORMANCE.md`)

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-13-01 | Text Questions analytics list both **Answered** and **Completed** (AD-145), while AD-51 states that "Answered" is a tab name whose questions have status Completed. Define the two metrics so that statuses are not conflated (AD-147). | AD-51, AD-145, AD-147 | Resolved — one metric "Answered/Completed"; metrics are Received, Answered/Completed, Pending (AD-145 amended 2026-11-20) |

### AP-14 — Notifications and Reminders (owner: `14_NOTIFICATIONS_AND_REMINDERS.md`)

No open questions.

### AP-15 — Settings and Preferences (owner: `15_SETTINGS_AND_PREFERENCES.md`)

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-15-01 | Time zone setting (IST by default, AD-154): if the astrologer changes it, does it affect display only? All calendar-day business rules use IST (AD-71). | AD-71, AD-154 | Open |

### AP-16 — Help and Support (owner: `16_HELP_AND_SUPPORT.md`)

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-16-01 | The ticket statuses Open, Under Review, Awaiting Astrologer Response, Resolved, Closed are described as "suggested" in the Master Decision Document. Confirm them as final. | AD-160 | Open |
| AP-16-02 | Conditions under which a ticket may be reopened ("Reopen option where allowed"). | AD-160 | Open |

### AP-17 — Remedy Tracker (owner: `17_REMEDY_TRACKER.md`)

No open questions.

---

## 5. Cross-App Conflicts Register (X-01 to X-25)

Each item requires a **separate product-owner decision**. No User App
document is changed by this register, and no Astrologer App decision
automatically changes the User App specification. User App IDs refer to
[`00_USER_APP_REVIEW_LIST.md`](../01-user-app/00_USER_APP_REVIEW_LIST.md).

| ID | Astrologer App ID(s) | User App ID(s) | Conflict or dependency | Decision required | Status |
|----|----------------------|----------------|------------------------|-------------------|--------|
| X-01 | AD-28, AD-31, AD-57, AD-58, AD-60; AP-02-18 | D-07, D-21, D-26 | Submission deadline is the earlier of purchase + 7 days and campaign expiry; extension applies to unused purchased slots; unused slots expire without refund; campaign cancellation, deletion, or slot reduction does not cancel purchased questions. **Aligned 2026-11-19:** User App D-07 amended; D-21 and D-26 added. Residual Astrologer question: submission window after cancellation or deletion (AP-02-18). | None — aligned. | Resolved |
| X-02 | AD-30, AD-35, AD-62 | D-18, D-24, D-32 | 30-day deadline with automatic cancellation and refund, and no manual cancellation, are aligned (User App D-18, D-24). **Aligned 2026-11-19:** all user refunds go to the in-app Wallet (User App D-32; P-10-05 resolved). | None — aligned. | Resolved |
| X-03 | AD-41, AD-44 | D-08, D-19 | One Dispute per question within 7 days; astrologer answers once within 3 days, otherwise Admin Review. **Aligned 2026-11-19:** User App D-19 added; P-06-09 and P-06-10 retired. | None — aligned. | Resolved |
| X-04 | AD-40 | D-10, D-17 | Users can rate and review Text Question answers immediately, without blocking a Dispute. **Aligned 2026-11-19:** User App D-17 added; P-06-05 retired. | None — aligned. | Resolved |
| X-05 | AD-26, AD-34, AD-35 | D-33, D-34; P-06-06, P-06-14, P-10-04 | User App decisions (2026-11-19): Preview before final submission, no editing after submission (D-34; P-06-14 resolved); Wallet or direct UPI/bank payment (D-33; P-10-04 resolved); **no General-to-Personal conversion or upgrade** in the User App (D-34). **Resolved 2026-11-19:** product owner confirmed that General-to-Personal conversion or upgrade is not supported; AD-35 amended (option (2) removed; replacement with another General Question retained). | None — aligned. | Resolved |
| X-06 | AD-42, AD-43 | D-27; P-17-04, P-17-05 | Platform Complaint after the Dispute Answer, separate from disputes and not a payment hold. **Aligned 2026-11-19:** User App D-27 added. How support relates to disputes and complaints stays open in the User App (P-17-04, P-17-05). | None — aligned. | Resolved |
| X-07 | AD-26, AD-28, AD-53 – AD-57 | D-20, D-21; P-06-13 | General/Personal types, separate prices, optional discounts, original price / discount percentage / final payable price, special label on a normal campaign, protection of purchases on campaign changes. **Aligned 2026-11-19:** User App D-20, D-21 added; P-06-04 retired. Per-user purchase limit stays open in the User App (P-06-13). | None — aligned. | Resolved |
| X-08 | AD-22, AD-39, AD-44 | D-11, D-29; P-16-01 | Only the User marks a remedy Completed and may upload a file; remedies from Dispute Answers appear in the User Remedy Tracker. **Aligned 2026-11-19:** User App D-11 amended, D-29 added; P-16-02 retired. Remedy fields stay open in the User App (P-16-01). | None — aligned. | Resolved |
| X-09 | AD-20 | D-36 | "New Follower" activity. **Aligned 2026-11-19:** Follow is free and never subscribes; Subscribe is paid and automatically follows (User App D-36; P-14-01 resolved). | None — aligned. | Resolved |
| X-10 | AD-59 | D-26; P-15-03 | Pre-purchase warning within 3 days of expiry; reminders 3, 2, and 1 day before expiry. **Aligned 2026-11-19:** User App D-26 added. Full notification event list stays open in the User App (P-15-03). | None — aligned. | Resolved |
| X-11 | AD-34 | D-37; P-GL-03 | The astrologer sees User ID, name, photo, user details, and previous questions. **Aligned 2026-11-19:** birth details and horoscope information are shared only with the user's consent for the relevant paid service (User App D-37). Data retention remains open in the User App (P-GL-03). | None — aligned. | Resolved |
| X-12 | AD-10, AD-11, AD-28, AD-74 | D-06, D-07 | **Final (2026-11-19):** during DND / Planned Unavailability the astrologer's profile is hidden and users cannot purchase or submit Text-Based Questions (AD-10, AD-74). The purchased-slot validity rule — the earlier of purchase + 7 days or campaign expiry (AD-28) — is unchanged: it is not paused, extended, or reset by DND, and no refund is introduced for slots that expire unused. The 30-day answer deadline also continues during DND (AD-11). **User App aligned 2026-11-19** (User App D-38: profile hidden; no purchases, submissions, bookings, or calls/chats; slots keep their validity). | None — aligned. | Resolved |
| X-13 | AD-45, AD-61, AD-69 | D-22, D-35 | User question limit (1,000 characters) and attachment counts are aligned (User App D-22). **Aligned 2026-11-19:** user horoscope attachments are PDF or JPEG, at most 2 files of 10 MB each, or saved birth details (User App D-35; P-06-06 resolved). Astrologer answer attachment rules (AD-45) are separate. | None — aligned. | Resolved |
| X-14 | AD-07, AD-65, AD-72 | D-31, D-36; P-14-02 – P-14-05 | Aligned so far: benefit questions Silver 1, Gold 3, Platinum 4, shown separately and following the 7-day slot validity (User App D-31; P-14-06 resolved); Follow free / Subscribe paid and auto-follows; auto-renewal optional and off by default (D-36; P-14-01 resolved). **On hold:** subscription price, duration/term options, detailed renewal rules, and cancellation/refund rules (User App P-14-02 – P-14-05). | On hold until the product owner confirms the remaining subscription terms. | Open |
| X-15 | AD-71 | D-28 | IST calendar-day counting for all calendar-day rules. **Aligned 2026-11-19:** User App D-28 added; P-06-17 retired; Astrologer AP-GL-01 retired. | None — aligned. | Resolved |
| X-16 | AD-31 | D-21 | Campaign cancellation (ruling C1): purchased unused slots refunded on cancellation; submitted paid questions still answered. **Aligned 2026-11-20:** User App D-21 amended. Deletion question open (AP-02-24). | None — aligned. | Resolved |
| X-17 | AD-07, AD-09, AD-94, AD-164 | D-30, D-41 | DND and confirmed appointments (ruling C2; AP-01-14): DND blocks new services; confirmed appointments remain valid; date closure offers reschedule or full Wallet refund. **Aligned 2026-11-20:** User App D-30 amended; D-41 added. | None — aligned. | Resolved |
| X-18 | AD-40, AD-129 – AD-134 | D-10, D-17, D-49; P-05-03, P-07-10 | Mandatory rating (ruling C4); optional written feedback; no user edit/delete; hidden reviews not shown; public rating from Published reviews. **Aligned 2026-11-20:** User App D-10, D-17 amended; D-49 added. Enforcement open (AP-10-01). | None — aligned. | Resolved |
| X-19 | AD-88 – AD-102 | D-40 – D-43; P-07-01 – P-07-07, P-07-09, P-11-03 | Appointment rules. **Aligned 2026-11-20:** User App D-40 – D-43 added; P-07-01 – P-07-03, P-07-07, P-07-09 resolved; P-07-04 – P-07-06 and P-11-03 stay Open with confirmed parts noted. Late-cancellation percentage missing (AP-05-01). | None — aligned. | Resolved |
| X-20 | AD-103 – AD-111, AD-124 | D-44 – D-47; P-08-01 – P-08-04, P-08-07, P-08-08, P-09-01 – P-09-03, P-09-05, P-09-07, P-09-08 | Instant Call and Instant Chat rules; 24-hour chat history. **Aligned 2026-11-20:** User App D-44 – D-47 added; listed P-items resolved except P-08-03, P-08-04 (Open; AP-06-01). Not covered by the Master Decision Document: P-08-05, P-08-06, P-09-04, P-09-06 (still Open). | None — aligned. | Resolved |
| X-21 | AD-125 | D-32 | Astrologer minimum withdrawal ₹500 (AD-125) and User Wallet ₹500 minimum retained balance (D-32) are distinct rules for different wallets. | None — distinct rules; neither applies to the other app. | Resolved |
| X-22 | AD-112 – AD-119, AD-135 – AD-144 | D-36, D-50; P-14-07 | User-side Live Sessions and posts. **Aligned 2026-11-20:** User App D-50 added. Where users see Live and posts is open (User App P-14-07). | None — aligned. | Resolved |
| X-23 | AD-22, AD-102, AD-163 | D-11, D-29, D-51; P-16-01, P-16-05 | Appointment records in the Remedy Tracker with a link to the originating consultation. **Aligned 2026-11-20:** User App D-51 added; P-16-05 resolved. Remedy fields (P-16-01) still open. | None — aligned. | Resolved |
| X-24 | AD-79 – AD-87, AD-106 | D-38, D-48; P-05-01, P-05-06 | Astrologer profile in the User App. **Aligned 2026-11-20:** User App D-48 added (packages on the profile; previously verified details shown while changes await approval). P-05-01 and P-05-06 stay Open with confirmed parts noted. | None — aligned. | Resolved |
| X-25 | AD-26 | D-20 | Special Campaign label (AP-02-25): mandatory Special Campaign label/type. **Aligned 2026-11-20:** User App D-20 amended. | None — aligned. | Resolved |

### 5.1 User App alignment status (2026-11-19; updated 2026-11-20)

The User App documentation was reviewed and aligned on 2026-11-19. Items still
needing a User App decision are listed as Remaining.

| X-ID | User App change | Status |
|------|-----------------|--------|
| X-13 | General: no attachments; Personal: up to 2 PDF/JPEG horoscope files of 10 MB each, or saved birth details; question text up to 1,000 characters (D-22, D-35) | Done |
| X-10 | Expiry reminders 3, 2, and 1 day before expiry; warning before purchase within 3 days of expiry (D-26) | Done |
| X-01 | Unused purchased slots expire without refund at the earlier-of deadline; extension and reactivation rules (D-07, D-21) | Done |
| X-01 | Campaign cancellation, deletion, or slot reduction does not cancel purchased questions (D-21) | Done |
| X-07 | Original price, discount percentage, and final payable price; separate General/Personal prices; special label on a normal campaign (D-20) | Done |
| X-02 | No manual cancellation; automatic cancellation and refund after 30 days; refunds to the Wallet (D-18, D-24, D-32) | Done |
| X-03 | One dispute; 3-day dispute answer; Admin Review (D-19) | Done |
| X-08 | Remedies from Dispute Answers in the Remedy Tracker; user-only completion (D-11, D-29) | Done |
| — | Astrologer Answer limit 1,500 characters (D-23); statuses New / Received, Pending, Completed, without settlement details (D-25); IST calendar days (D-28) | Done |
| — | DND / Planned Unavailability: booked appointments cancelled with full refund; dates blocked (D-30, from AD-09) | Done |
| X-14 | Benefit questions per tier, 7-day validity; Follow free / Subscribe paid and auto-follows; auto-renewal off by default (D-31, D-36) | Done — price, duration, renewal, cancellation/refund **on hold** (P-14-02 – P-14-05) |
| X-09 | Follow free; Subscribe paid and auto-follows (D-36) | Done |
| X-11 | Consent for sharing birth data with astrologers (D-37) | Done — data retention open (P-GL-03) |
| X-05 | Preview before submission; no editing after submission; Wallet or direct payment; no General-to-Personal conversion (D-33, D-34) | Done — AD-35 amended (no General-to-Personal upgrade) |
| — | AD-73 Text-Based Questions service suspension (user view): no new slots; valid purchased slots usable; other services available (D-39) | Done |
| X-12 | DND: astrologer profile hidden; no purchases, submissions, bookings, or calls/chats; purchased-slot validity unchanged (D-38) | Done |
| X-16 | Refund of purchased unused slots on campaign cancellation; amend D-21 | Done (2026-11-20) |
| X-17 | Confirmed appointments valid during DND; date-closure handling; amend D-30 | Done (2026-11-20) |
| X-18 | Mandatory rating; review visibility; amend D-10, D-17 | Done (2026-11-20) |
| X-19 | Appointment rules (P-07-xx) | Done (2026-11-20) |
| X-20 | Instant Call / Chat rules; 24-hour chat history (P-08-xx, P-09-xx) | Done (2026-11-20) |
| X-22 | Live Sessions and posts on the user side | Done (2026-11-20) |
| X-23 | Remedy Tracker link to original consultation (P-16-05) | Done (2026-11-20) |
| X-24 | Astrologer profile fields and packages on the profile (P-05-01, P-05-06) | Done (2026-11-20) |
| X-25 | Special Campaign label mandatory; amend D-20 | Done (2026-11-20) |

### 5.2 Platform Admin dependencies

Platform Admin documentation has not started. These items record what the
Astrologer App requires from Platform Admin; they become Platform Admin
requirements when its documentation is created. No Platform Admin content is
changed by this list.

| ID | Astrologer App ID(s) | Dependency | Status |
|----|----------------------|------------|--------|
| PA-01 | AD-41, AD-162 | Text Question Dispute escalation to Admin Review; Platform Admin handles User-raised disputes. | Pending — Platform Admin documentation not started |
| PA-02 | AD-42, AD-108 | Platform Complaints, including Instant Call/Chat early-termination complaints: investigation, warning notification, monitoring of repeated incidents. | Pending — Platform Admin documentation not started |
| PA-03 | AD-130, AD-133 | Review moderation: view, publish, hide, remove reviews and replies; flag and investigate; monitor negative patterns; notify the astrologer with a reason. | Pending — Platform Admin documentation not started |
| PA-04 | AD-85, AD-87, AD-112 | KYC, identity, and certificate verification; approval of selected important profile changes; Verified status used for Live eligibility. | Pending — Platform Admin documentation not started |
| PA-05 | AD-125, AD-126 | Payout account verification; withdrawal processing (target 3 working days); Tuesday/Friday settlement release runs. | Pending — Platform Admin documentation not started |
| PA-06 | AD-97, AD-98 | Appointment technical-failure review; recording of astrologer no-show incidents, warnings, and the configurable repeated-incident threshold. | Pending — Platform Admin documentation not started |
| PA-07 | AD-24, AD-70, AD-73 | Monthly question quota allocation, quota reduction, and Text-Based Questions service suspension. | Pending — Platform Admin documentation not started |
| PA-08 | AD-157 | Approval of account deactivation and deletion requests. | Pending — Platform Admin documentation not started |
| PA-09 | AD-161 | Review of astrologer requests to block a User. | Pending — Platform Admin documentation not started |
| PA-10 | AD-148, AD-160 | Support tickets and Platform Replies; Admin Announcements; Policy/App Updates. | Pending — Platform Admin documentation not started |
| PA-11 | AD-124 | Commission rates per service applied consistently (Instant Call 2%, Instant Chat 2%, Appointment 3%; Text Questions rate missing, AP-08-02). | Pending — Platform Admin documentation not started |

---

## 6. Rejected Proposals

| ID | Rejected proposal | Approved alternative | Rejected on |
|----|-------------------|----------------------|-------------|
| R-01 | 30-minute post-submission editing facility for answers | AD-37 — no post-submission editing; use Preview before submitting | 2026-11-17 |
| R-02 | Five-file attachment limit | AD-45 — maximum two attachments per question | 2026-11-17 |
| R-03 | "Remember This Question" feature in the Answer Editor | None — the feature is removed (AD-36). It must not be replaced by a Follow-up Reminder, a saved-question workflow, or a favourite-question workflow. | 2026-11-19 |

Rejected proposals must not be reintroduced without a new product-owner decision.

---

## 7. Per-File Review Checklist

Run this checklist on each Astrologer App specification file before marking it **Approved**.

- [ ] Uses the standard 13-section template (§10).
- [ ] Contains only confirmed decisions; nothing is invented.
- [ ] Every owned decision is quoted verbatim from §3.
- [ ] Every unknown is marked `PENDING DISCUSSION` with an ID from §4.
- [ ] No rule is stated in full in a non-owning file; non-owners reference the AD ID and owning file.
- [ ] Every cross-app dependency is referenced by its X-ID; no User App rule is restated or changed.
- [ ] Bottom navigation matches AD-03.
- [ ] No rejected proposal from §6 is reintroduced.
- [ ] Edge cases covered: empty, loading, error, boundary days, expired, cancelled.
- [ ] Mock data is labelled illustrative and not presented as product defaults.
- [ ] No implementation detail and no code.
- [ ] No reference to the old `astro-textbased` or `astro-platform-admin` projects.
- [ ] No User App or Platform Admin content changed, except through an approved alignment task.

## 8. Cross-Module and Cross-App Consistency Checklist

- [ ] Every AD in §3 has exactly one owning file.
- [ ] AD-10 and AD-11 are stated in full only in §3 and file 02; file 01 references them.
- [ ] Availability rules (AD-04 to AD-09, AD-12) are stated in full only in §3 and file 01; file 02 references them.
- [ ] Priority, deadline, and status rules (AD-28 to AD-33, AD-51) are stated in full only in §3 and file 02.
- [ ] Every AP ID used in a file exists in §4, and vice versa.
- [ ] Every X ID used in a file exists in §5, and each X row names valid User App IDs.
- [ ] Open-question counts in §2 match §4.
- [ ] Every Open X item has a matching row in §5.1; every Resolved X item names its aligning User App decision.
- [ ] Every PA ID used in a file exists in §5.2.
- [ ] No retired ID is reused.
- [ ] User App documentation changes only through approved alignment tasks recorded in §5 / §5.1 and the User App review log.

---

## 9. Review and Approval Log

| Date | File | Change / Decision | Reviewer | Result |
|------|------|-------------------|----------|--------|
| 2026-11-17 | Planning | Astrologer App documentation plan for Home Screen and Text-Based Questions approved; ID scheme AD / AP / X confirmed | Product owner | Approved |
| 2026-11-17 | `00` | Review list created: AD-01 to AD-51, 21 open questions, 15 cross-app conflicts, 2 rejected proposals | — | Awaiting review |
| 2026-11-17 | `00` | Rejected: R-01 (30-minute post-submission editing), R-02 (five-file attachment limit) | Product owner | Recorded |
| 2026-11-17 | `00` | Offline rule from the initial brief ("no new work for any service") superseded by AD-05 (Text-Based Questions and Appointments can still arrive while Offline) | Product owner | Recorded |
| 2026-11-17 | `00` | "User notified before campaign expiry" (initial brief) not restated in the confirmed list; tracked under X-10 pending confirmation | — | Open |
| 2026-11-17 | `00` | Product owner confirmed the existing wording of AD-02 (Welcome & Profile contents), AD-07 (DND priority over Instant Call/Chat switches), AD-16 ("Peak Time" label and compact widget), AD-19 (goal progress examples), AD-39 (cross-service remedy rule), and AD-40 (Rating & Review does not block a Dispute). No decision wording needed changing. | Product owner | Approved |
| 2026-11-17 | `01`, `02` | `01_HOME_SCREEN.md` and `02_TEXT_BASED_QUESTIONS.md` created and validated (13-section template; ownership matches §3; owned decisions verbatim; all IDs valid; links valid). Status set to Draft. Not approved; implementation not started. | — | Draft |
| 2026-11-17 | `00` | All 51 confirmed decisions (AD-01 – AD-51) retain their existing wording and ownership. All existing open questions and all cross-app conflicts X-01 – X-15 (including X-12) remain unresolved. No User App documentation or rules changed. | — | Recorded |
| 2026-11-17 | `00` | Gaps found while drafting 01 and 02 added as open questions: AP-01-08, AP-01-09, AP-01-10, AP-01-11, AP-01-12, AP-02-14. Module counts updated (01: 12, 02: 14). | Product owner | Approved |
| 2026-11-19 | `00`, `02` | Product owner confirmed Text-Based Questions decisions. **Amended in place:** AD-24 (1,000-slot shared monthly quota across Campaign Questions and Open Questions; no separate quotas; no carry-forward); AD-26 (General only / Personal only / both — neither compulsory; corrects the earlier "every campaign has General and Personal options"); AD-36 (answer limit **1,000** characters, correcting the earlier 1,500; Remember This Question removed; voice-to-text, preview, and answer attachments clarified). **Added:** AD-52 – AD-62. **Rejected:** R-03 (Remember This Question). Existing AD-28, AD-30, AD-32, AD-41, AD-44, and all other decisions unchanged. | Product owner | Approved |
| 2026-11-19 | `00` | **AP-02-03 resolved and retired** → AD-58 (campaign extension applies to unused purchased slots). **AP-02-05 resolved and retired** → AD-36 / R-03 (Remember This Question removed). | Product owner | Approved |
| 2026-11-19 | `00` | Partially answered but kept **Open**: AP-02-01 (no carry-forward confirmed in AD-24; reset timing not confirmed), AP-02-02 (General/Personal discounts confirmed in AD-56; Offer vs discount relationship and Special Campaign configuration not confirmed), AP-02-06 (answer attachment kinds in AD-36 and user file kinds in AD-61; file types, sizes, restrictions not confirmed), AP-02-07 (no refund at campaign expiry in AD-60; refund on campaign cancellation not confirmed), AP-02-08 (General questions have no user attachments, AD-61; scope of the two-attachment limit not confirmed). | — | Recorded |
| 2026-11-19 | `00` | Cross-app rows updated with new Astrologer IDs (X-01, X-02, X-07, X-10, X-13); all remain **Open**. No User App document changed. | — | Recorded |
| 2026-11-19 | `00` | **Missing information:** the "existing monthly quota reduction and suspension rules" referred to in the product brief are not present in any AstroConnect document, and were not invented. They need to be supplied before they can be recorded. | — | Open |
| 2026-11-19 | `00`, `02` | Product owner decisions applied (second pass). **Amended:** AD-24 (reset 1st of month 12:00 AM IST; pro-rata quota for mid-month joiners), AD-26 ("Open Slots" removed as a campaign type — the concept is Open Questions; offers optional), AD-31 (campaign cancellation: purchased questions still answered; unsold allocations reusable; no refund for unsold allocations), AD-36 (no audio-only answers; preview and edit before submission), AD-45 (user attachments: none for General, up to 2 for Personal; answer attachments: up to 3, 10 MB each, JPEG/PDF/TXT), AD-52 (monthly target; pro-rata target), AD-54 (Open Questions use shared quota; optional offers/discounts), AD-56 (offers/discounts optional for all Campaigns, Special Campaigns, Open Questions), AD-59 (reminders 3, 2, 1 days before expiry), AD-61 (up to 2 Personal attachments). Dispute answer limit 1,500 (AD-44) and answer limit 1,000 (AD-36) confirmed unchanged. | Product owner | Approved |
| 2026-11-19 | `00` | **Resolved and retired:** AP-02-01 → AD-24 (reset timing and no carry-forward); AP-02-06 → AD-45 (astrologer answer attachment types and size; user attachment types/size are a User App matter, X-13); AP-02-08 → AD-45, AD-61 (scope of attachment limits). | Product owner | Approved |
| 2026-11-19 | `00` | **Added open questions:** AP-02-15 (quota reduction rules — stepwise reductions were discussed but no confirmed rules exist in any document; none invented), AP-02-16 (suspension — **on hold**), AP-02-17 (pro-rata calculation method). | — | Open |
| 2026-11-19 | `00` | Still open with partial answers: AP-02-02 (offers/discounts now confirmed; campaign editor and Special Campaign configuration remain), AP-02-07 (expiry no-refund and cancellation of submitted/unsold confirmed; purchased-but-not-yet-submitted slots on cancellation remain). §5.1 User App alignment table added; X-01, X-07, X-10, X-13 updated; all X items remain Open; X-12 unchanged. | — | Recorded |
| 2026-11-19 | `00`, `01`, `02` | **Third pass — Home:** AD-07, AD-09 (DND = Planned Unavailability; all services; booked appointments cancelled with full refund, dates blocked; edit/cancel), AD-14 (Net Earnings; Gross/Commission/Net in Earnings/Wallet), AD-16 (basis corrected to incoming questions and appointment bookings), AD-17 (next 3 appointments), AD-18, AD-19 (Dispute Answers excluded), AD-20, AD-21 (Quick Action destinations) amended; AD-63 – AD-68 added. | Product owner | Approved |
| 2026-11-19 | `00`, `02` | **Third pass — Text-Based Questions:** AD-24, AD-52 (pro-rata by remaining days, whole-number rounding), AD-26 (Special Campaign uses the same editor with an optional label), AD-27 (Delete Campaign), AD-28, AD-30, AD-32 (IST), AD-31 (cancellation/deletion protect purchases; no refund), AD-33, AD-46, AD-51 (status lifecycle New / Received → Pending → Completed → Settled; four tabs), AD-36 (**Answer limit corrected from 1,000 to 1,500 characters**), AD-39, AD-44 (remedy in Dispute Answers), AD-41 (3-day Dispute Answer deadline; Admin Review), AD-42, AD-43 (Platform Complaint does not block settlement), AD-57 (slots may be reduced below purchased), AD-59 (warning within 3 days) amended; AD-69 – AD-71 added (User Question 1,000 characters; quota reduction; IST). | Product owner | Approved |
| 2026-11-19 | `00` | **Resolved and retired:** AP-GL-01 → AD-71; AP-01-02 → AD-64; AP-01-06 → AD-67; AP-01-07 → AD-17, AD-20, AD-66; AP-01-08, AP-01-11 → AD-21; AP-01-09 → AD-19; AP-01-10 → AD-07, AD-09; AP-01-12 → AD-63; AP-02-02 → AD-26; AP-02-04 → AD-42, AD-43; AP-02-07 → AD-31; AP-02-09 → AD-51; AP-02-10 → AD-46, AD-51; AP-02-11 → AD-41; AP-02-12 → AD-39, AD-44; AP-02-13 → AD-27, AD-31; AP-02-14 → AD-57; AP-02-15 → AD-70; AP-02-17 → AD-24, AD-52. **Kept open with partial answers:** AP-01-01 (ongoing consultations), AP-01-03 (time ranges and period), AP-01-04 (effect of later refunds), AP-01-05. **Added:** AP-01-13 (daily goal 10 vs 5/10/15), AP-02-18 (submission window after cancellation/deletion), AP-02-19 (complaint recovery — deferred), AP-02-20 (Drafts, Expired, Priority alongside the four tabs). **Still on hold:** AP-02-16 (suspension), X-12. | Product owner | Approved |
| 2026-11-19 | `00` | Cross-app conflicts after User App alignment: **Resolved** X-01, X-03, X-04, X-06, X-07, X-08, X-10, X-15; **Open** X-02, X-05, X-09, X-11, X-12 (HOLD), X-13, X-14. §5.1 rewritten as alignment status. | — | Recorded |
| 2026-11-19 | `00`, `01`, `02` | **Fourth pass:** AD-19 (default goal 10; selectable 5/10/15; shown consistently), AD-21 ("Benefits & Benefits" corrected to "Benefits & Content"), AD-31 (unused purchased slots usable until their original deadline after cancellation/deletion), AD-46 (four main tabs; Drafts and Expired as secondary tabs or filters; Priority 1/2 as urgency filters within Received), AD-51 (Answered Questions tab holds Completed questions; Settled when eligible for settlement), AD-67 (visual shows the selected goal), AD-68 (immediate dispute notification and reminder before the 3-day deadline; no generic repeated warning), AD-70 (no automatic third reduction or suspension) amended. AD-72 added (benefit questions: Silver 1, Gold 3, Platinum 4). **Resolved and retired:** AP-01-13 → AD-19, AD-67; AP-02-18 → AD-31; AP-02-20 → AD-46. **Added on hold:** AP-02-21 (third consecutive miss). X-14 partly aligned; stays Open. | Product owner | Approved |
| 2026-11-19 | `00`, `02` | **Final Astrologer pass:** AD-10, AD-11 (DND days count toward the 30-day deadline; slot validity unchanged), AD-24 (normal quota from the next month, subject to reduction), AD-26 (campaigns on any theme or occasion), AD-42 (Platform decides recovery/refund under its own process), AD-52, AD-54 (Open Questions need no Campaign title), AD-56 (offers controlled by the astrologer, not Platform Admin), AD-70 (reductions apply to the following month; third consecutive miss → AD-73) amended. **Added:** AD-73 (Text-Based Questions service suspension for three months after three consecutive missed targets — service-level only), AD-74 (DND activation only when no Call/Chat is in progress; whole profile hidden; all services blocked). | Product owner | Approved |
| 2026-11-19 | `00` | **Resolved and retired:** AP-01-01 → AD-74 (DND cannot be activated during an ongoing Call/Chat; booked appointments already covered by AD-09); AP-02-16, AP-02-21 → AD-73; AP-02-19 → AD-42. **X-12 resolved** (final Astrologer decision; User App alignment pending). **Added:** AP-02-22 (quota and target after suspension), AP-02-23 (purchased unused slots when suspension begins). Home specification `01_HOME_SCREEN.md` was out of scope for this pass and still needs to be synchronized (AP-01-01 retired; AD-74 to be referenced). | Product owner | Approved |
| 2026-11-19 | `00` | Content Creation destination kept as confirmed in AD-21 ("Benefits & Content"); the final brief's "Benefits & Benefits" was not applied because it reverses the confirmed correction. Brief item "Recent Activity must have its own dedicated tab" not applied in this pass (Home-owned AD-20; `01_HOME_SCREEN.md` out of scope). | — | Recorded |
| 2026-11-19 | `00`, `02` | **Product-owner corrections:** AD-14 (Home Earnings = today's expected net earnings after commission for today's booked/assigned work; no refund figures on Home; refunds in Wallet only), AD-16 (Peak Demand from the last 7 days), AD-72 (Text-Based Questions and Subscription Questions as two separate categories), AD-73 (new purchases/submissions blocked; previously purchased questions and slots stay valid; service reopens only after all outstanding purchased questions are answered or auto-cancelled/refunded; normal 1,000/800 on reopening, no reduction carried forward or restarted), AD-70 (cross-reference to reinstatement) amended. **Resolved and retired:** AP-01-04 → AD-14; AP-02-22, AP-02-23 → AD-73. AP-01-03 stays open for the hour ranges only (period now 7 days, AD-16). `01_HOME_SCREEN.md` (out of scope) still quotes the earlier AD-14 and AD-16 wording and needs synchronizing. | Product owner | Approved |
| 2026-11-19 | `00` | **Final synchronization:** AD-16 amended (IST ranges Morning 5:00 AM–11:00 AM, Afternoon 11:00 AM–4:00 PM, Evening 4:00 PM–8:00 PM, Night 8:00 PM–5:00 AM; last 7 days of Text-Based Question and Appointment booking data). AD-20 amended (View All opens the dedicated Recent Activity tab). AD-73 and AD-74 now referenced by `01_HOME_SCREEN.md`. AP-01-03 and AP-01-05 set to **Resolved** (kept in §4 with their resolutions, not retired, per product-owner instruction). AD-21 destination confirmed as "Benefits & Content" ("Benefits & Benefits" is not used). | Product owner | Approved |
| 2026-11-19 | `00` | Cross-app sync with User App decisions: **X-02, X-09, X-11, X-13 Resolved**; X-12 User App alignment completed (User App D-38); AD-73 User App alignment completed (User App D-39). **X-14 stays Open (On Hold)** for price, duration, renewal, and cancellation/refund. **X-05 stays Open:** the User App has no General-to-Personal conversion (D-34), which conflicts with AD-35 option (2); a product-owner decision is needed to amend AD-35. No Astrologer decision changed. | — | Recorded |
| 2026-11-19 | `00`, `01`, `02` | **X-05 resolved:** product owner confirmed that General-to-Personal conversion or upgrade is not supported. **AD-35 amended:** option (2) (upgrade to Personal by paying the price difference) removed; replacement with another General Question using the same slot, without extra payment, retained; the rest of the correction flow is unchanged. No new correction or payment flow added. Outdated cross-app statuses in `01_HOME_SCREEN.md` and `02_TEXT_BASED_QUESTIONS.md` synchronized with §5 (X-02, X-05, X-09, X-11, X-12, X-13 Resolved). **X-14 stays Open (On Hold).** | Product owner | Approved |
| 2026-11-20 | `00` – `17`, `CONTEXT.md` | **Master Decision Document applied** (Astrologer App complete documentation). Added AD-75 – AD-164 (§3.1 AD-164; §3.3 – §3.17). Files `03` – `17` created; `01` and `02` cross-linked. AD-01 – AD-74, AP, X, and R history preserved; no ID renumbered. | Product owner | Approved |
| 2026-11-20 | `00`, `01`, `05` | **Ruling C2 — AD-09 amended:** existing confirmed appointments remain valid when DND / Planned Unavailability is activated; date closure is a separate workflow (AD-94). **Superseded wording:** "If an already-booked appointment falls within the period: the appointment is cancelled, the User receives a full refund, and that date is blocked from new appointment bookings." User App D-30 alignment recorded as X-17. | Product owner | Approved |
| 2026-11-20 | `00`, `02` | **Ruling C1 — AD-31 amended:** purchased unused slots are refunded when a campaign is cancelled; submitted paid questions are still answered. **Superseded wording:** "No refund is issued merely because a campaign was cancelled or deleted" and, for cancellation, "a purchased, unused slot remains usable until its original deadline". Deletion keeps the earlier rule pending AP-02-24. User App D-21 alignment recorded as X-16. | Product owner | Approved |
| 2026-11-20 | `00`, `02`, `10` | **Ruling C4 — AD-40 amended:** rating mandatory, written review optional. **Superseded wording:** "the User can immediately rate (1–5 stars) and write a review after the answer is delivered". Enforcement recorded as AP-10-01. User App D-10, D-17 alignment recorded as X-18. | Product owner | Approved |
| 2026-11-20 | `00` | **Rulings C3, C5, C6:** AD-74 unchanged (profile invisible to **all** users during DND; the Master Decision Document's "new users" wording is not applied). AD-17 unchanged (Home work summaries cover Text Questions and Appointments only). AD-21 unchanged ("Benefits & Content" opens Content Management, AD-138). | Product owner | Approved |
| 2026-11-20 | `00` | **Added open questions** (none invents a rule): AP-GL-02, AP-01-14, AP-01-15, AP-02-24, AP-02-25, AP-04-01, AP-04-02, AP-05-01, AP-06-01, AP-08-01 – AP-08-03, AP-10-01, AP-13-01, AP-15-01, AP-16-01, AP-16-02. **Missing source information** (reported as finalized but absent from the repository): AP-GL-02 (M5), AP-05-01 (M1, late-cancellation percentage), AP-08-01 (M4), AP-08-02 (M2), AP-08-03 (M3, Call/Chat values). **Recorded contradictions:** AP-02-25 (AD-26 optional label vs Master "must have a clear label/type"), AP-13-01 (AD-51 "Answered" tab vs separate Answered/Completed metrics), AP-01-14 (AD-07 vs amended AD-09). | — | Recorded |
| 2026-11-20 | `00` | **Cross-app:** X-16 – X-24 added (X-21 Resolved as distinct rules; others Open — User App alignment pending; no User App file changed in this task). §5.2 Platform Admin dependencies PA-01 – PA-11 added. §8 checklist line about X-12 updated (X-12 was resolved 2026-11-19). | — | Recorded |
| 2026-11-20 | `00`, `01`, `05` | **AP-01-14 resolved** (ID kept): DND blocks all new services; existing confirmed appointments remain valid. **AD-07 amended.** Superseded wording: "unavailable for **all** services — Text-Based Questions, Appointments, Instant Call, Instant Chat, online/offline consultations, and other services". | Product owner | Approved |
| 2026-11-20 | `00`, `02`, `09` | **AP-02-25 resolved** (ID kept): a Special Campaign must carry a clear, mandatory Special Campaign label/type. **AD-26 amended.** Superseded wording: "Special Campaign is not a separate campaign type … the astrologer may give a limited-time or occasion-based campaign a special title/label". User App D-20 aligned (X-25). | Product owner | Approved |
| 2026-11-20 | `00`, `13` | **AP-13-01 resolved** (ID kept): Text Question analytics use Received, Answered/Completed, Pending; no double counting. **AD-145 amended.** Superseded wording: "Received, Answered, Pending, Completed". | Product owner | Approved |
| 2026-11-20 | `00` | **User App alignment completed** for X-16 – X-20, X-22 – X-24; X-25 added and resolved. User App D-10, D-17, D-20, D-21, D-30 amended; D-40 – D-51 added (User App review list §7). X-14 stays Open (On Hold). Missing source items AP-GL-02, AP-05-01, AP-08-01 – AP-08-03 stay Open. | Product owner | Approved |
| 2026-11-23 | `00`, `01` | **AD-165 added (DND confirmation and indicator):** product owner approved the DND-ON confirmation message, a persistent DND indicator on Home, and turning DND OFF at any time. AD-07, AD-08, AD-74, AD-164 unchanged (after DND off the astrologer still chooses Online/Offline; confirmed appointments stay valid). | Product owner | Approved |
| 2026-11-23 | `00`, `01` | **AD-166 added (Live Activity ticker)** with the product-owner defaults: zero-count types hidden, welcome message when idle, pause on hover/touch (amended 2026-11-23: all three shown even at 0). **Added open questions** (no rule invented): AP-01-16 (Flowers undefined), AP-01-17 (booked vs scheduled today). | Product owner | Approved |
| 2026-11-23 | `00`, `01` | **AD-166 amended:** the ticker always shows New Followers, New Subscribers, and Appointments (a count of 0 is shown); the welcome message appears only when all counts are 0. Supersedes "a type with no activity is not shown". | Product owner | Approved |
| 2026-11-23 | `00`, `01` | **AD-166 amended:** the Live Activity ticker stops while DND is ON (showing the updates as they were when DND started, with no new activity displayed) and resumes with current counts when DND is turned OFF. | Product owner | Approved |

**Retired IDs (never reuse):** AP-GL-01, AP-01-02, AP-01-06, AP-01-07, AP-01-08, AP-01-09, AP-01-10, AP-01-11, AP-01-12, AP-02-01, AP-02-02, AP-02-03, AP-02-04, AP-02-05, AP-02-06, AP-02-07, AP-02-08, AP-02-09, AP-02-10, AP-02-11, AP-02-12, AP-02-13, AP-02-14, AP-02-15, AP-02-17, AP-01-13, AP-02-18, AP-02-20, AP-01-01, AP-02-16, AP-02-19, AP-02-21, AP-01-04, AP-02-22, AP-02-23.

---

## 10. Standard Module Documentation Template (13 sections)

Every Astrologer App module file uses these sections:

1. Purpose
2. Scope / Out of scope
3. Entry points
4. Confirmed decisions (by AD ID from §3; owned decisions quoted verbatim)
5. User flows
6. Screens and content
7. Business rules and validations
8. States and edge cases
9. Notifications triggered
10. Dependencies on other modules (including X-IDs for User App dependencies)
11. `PENDING DISCUSSION` (by AP ID from §4)
12. Acceptance criteria (confirmed rules only)
13. Change log

Sections with no confirmed content contain only `PENDING DISCUSSION` and the
relevant IDs.
