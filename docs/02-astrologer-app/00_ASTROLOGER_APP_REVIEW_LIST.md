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
   is listed in §5. **No User App document is changed by this list.** Each
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
| `AP-02-yy` | Open question owned by `02_TEXT_BASED_QUESTIONS.md` | `AP-02-24` (format example) |
| `AP-GL-yy` | Open question affecting more than one Astrologer App module | `AP-GL-02` |
| `X-xx` | Cross-app conflict or dependency with the User App | `X-12` |
| `R-xx` | Rejected proposal | `R-01` |

User App IDs (`D-xx`, `P-xx-yy`) are defined in
[`00_USER_APP_REVIEW_LIST.md`](../01-user-app/00_USER_APP_REVIEW_LIST.md)
and are referenced here without modification.

---

## 2. Astrologer App Module Status Tracker

| No. | File | Module | Status | Open questions owned | Approved on |
|-----|------|--------|--------|----------------------|-------------|
| 00 | `00_ASTROLOGER_APP_REVIEW_LIST.md` | Review list | Draft | — | |
| 01 | [`01_HOME_SCREEN.md`](01_HOME_SCREEN.md) | Home Screen | Draft | 0 | |
| 02 | [`02_TEXT_BASED_QUESTIONS.md`](02_TEXT_BASED_QUESTIONS.md) | Text-Based Questions | Draft | 0 | |
| GL | — | Cross-cutting (Astrologer App) | — | 0 | |
| X | — | Cross-app conflicts (§5) | — | 1 open / 14 resolved | |

Files `01` and `02` exist as **Draft** specifications and have passed
documentation validation. They are not approved and not implementation-ready;
UI implementation has not started and requires a separate plan and approval.

---

## 3. Confirmed Decisions Register (AD-01 to AD-74)

Only decisions confirmed by the product owner appear here. Each decision has
exactly one owning file.

### 3.1 Home Screen (owner: `01_HOME_SCREEN.md`)

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-01 | Home Screen design direction is a **Balanced Dashboard**. Work, earnings, peak demand, and availability must all be prominent. | 01 | — | ✅ |
| AD-02 | Home Screen sections: 1. Welcome & Profile; 2. Availability; 3. Today's Earnings, with weekly/monthly summaries; 4. Peak Demand Hours chart; 5. Today's Work; 6. Recent Activity; 7. Exactly four Quick Actions. Welcome & Profile shows the astrologer's name, profile photo, and notification access. | 01 | — | ✅ |
| AD-03 | Bottom navigation has exactly five tabs: **Home, My Work, Live, Earnings, Profile**. | 01 | 02 | ✅ |
| AD-04 | **Online:** services can be available, subject to the individual Instant Call and Instant Chat switches. | 01 | — | ✅ |
| AD-05 | **Offline:** Text-Based Questions and Appointments can still arrive. Instant Call and Instant Chat cannot arrive. | 01 | 02 | ✅ |
| AD-06 | Only **Instant Call** and **Instant Chat** have individual ON/OFF switches. Text-Based Questions and Appointments have no individual availability switches. | 01 | — | ✅ |
| AD-07 | **DND / Planned Unavailability:** DND and Planned Unavailability are the **same feature**. While it is active, the astrologer is unavailable for **all** services — Text-Based Questions, Appointments, Instant Call, Instant Chat, online/offline consultations, and other services — including subscription-based requests. DND takes priority over the individual Instant Call and Instant Chat switches. *(Amended 2026-11-19.)* | 01 | 02 | ✅ |
| AD-08 | Turning DND **OFF** does not automatically make the astrologer Online. The astrologer must independently select Online or Offline. | 01 | — | ✅ |
| AD-09 | **Planned Unavailability:** the astrologer can specify a future unavailable period (for example, 10 days), and can **edit or cancel** it. All services stop during the selected period. If an already-booked appointment falls within the period: the appointment is **cancelled**, the User receives a **full refund**, and that date is **blocked** from new appointment bookings. *(Amended 2026-11-19.)* | 01 | 02 | ✅ |
| AD-12 | New requests resume when DND is turned OFF or the unavailable period ends, subject to other rules. | 01 | 02 | ✅ |
| AD-13 | Availability Schedule and timings belong to the **Appointment Module**, not to Home or Text-Based Questions. | 01 | 02 | ✅ |
| AD-14 | **Today's Earnings** on Home shows today's **expected Net Earnings after platform commission** — the amount the astrologer can earn by completing today's booked/assigned work — to motivate the astrologer. Home Earnings is kept simple: **no refund deductions, refund adjustments, refund status, or refund calculations** are shown on Home; refund details and refund-related accounting are shown separately in the **Wallet** section only. This Week and This Month keep the completed-service basis. The Earnings/Wallet section can separately display **Gross Revenue, Commission, and Net Earnings**. Settlement timing is handled separately in Earnings/Wallet. *(Amended 2026-11-19.)* | 01 | — | ✅ |
| AD-15 | Earnings display: Today's Earnings shown prominently, with This Week and This Month. Comparisons: Today vs Yesterday, This Week vs Last Week, This Month vs Last Month. Positive growth shown in green; decreases shown honestly. No Pending Earnings or Pending Payout figures on Home. Mock figures are illustrative only. | 01 | — | ✅ |
| AD-16 | **Peak Demand Hours:** calculated from the **last 7 days** of incoming Text-Based Question and Appointment booking data, identifying the peak-demand hours; no unspecified or unlimited historical period is used. The chart is divided into four IST time ranges: **Morning 5:00 AM–11:00 AM**, **Afternoon 11:00 AM–4:00 PM**, **Evening 4:00 PM–8:00 PM**, and **Night 8:00 PM–5:00 AM**. The highest-demand period is highlighted in gold, with a label such as "Peak Time: Evening". It remains a compact Home widget, not a large analytics dashboard. *(Amended 2026-11-19.)* | 01 | — | ✅ |
| AD-17 | **Today's Work** shows Appointments and Text-Based Questions. Instant Calls and Chats do not have a dedicated Today's Work area. The Appointments preview shows today's count and the **next 3 upcoming appointments**; its View All action opens the Appointments section. *(Amended 2026-11-19.)* | 01 | — | ✅ |
| AD-18 | Today's Work shows Text-Based Question counts: **Received, Answered, Pending**. Home shows **daily** counts only (AD-64). *(Amended 2026-11-19.)* | 01 | 02 | ✅ |
| AD-19 | **Daily Answer Goal:** the default goal is **10**; the astrologer can select 5, 10, or 15 questions per day and can change it later. It is motivational only and does not impose a cap. Progress is shown (for example, 3/5, 60%, "2 more answers to reach today's goal"). The currently selected goal is shown consistently wherever it is displayed. **Dispute Answers do not count** toward the Daily Answer Goal. *(Amended 2026-11-19.)* | 01 | — | ✅ |
| AD-20 | **Recent Activity** shows the four latest activities and a View All action, which opens the **dedicated Recent Activity tab**. Each item has a small icon, a short description, and a time. Examples: New Follower, New Question Received, Appointment Booked, Consultation Completed. *(Amended 2026-11-19.)* | 01 | — | ✅ |
| AD-21 | Exactly four **Quick Actions**: 1. Campaign Questions; 2. Go Live; 3. Content Creation; 4. Remedy Tracker. Vacation and Campaign Management are not added to Home Quick Actions. **Campaign Questions** opens the received Campaign Questions screen. **Content Creation** opens the "Benefits & Content" section, where content creation facilities are available. *(Amended 2026-11-19.)* | 01 | 02 | ✅ |
| AD-22 | **Remedy Tracker (astrologer view):** the astrologer sees only remedies prescribed by them and their completion status. Only the User can mark a remedy Completed. The User may upload a supporting photo/document. The astrologer can view uploaded attachments. The astrologer cannot manually mark a remedy completed. A prescribed remedy must also appear in the User Remedy Tracker. | 01 | 02 | ✅ |
| AD-23 | **Live, Earnings, and Profile** are separate modules to be discussed later. | 01 | — | ✅ |
| AD-63 | The app opens to the **Home Dashboard** by default. | 01 | — | ✅ |
| AD-64 | Home displays **daily counts only**. Weekly and monthly counts are not added to Home for now. | 01 | 02 | ✅ |
| AD-65 | **Subscription benefit questions** are shown separately from additional normal paid questions asked by subscribers. | 01 | 02 | ✅ |
| AD-66 | **Notifications:** the notification bell opens the Notifications section. Notifications include bookings, Instant Call, Instant Chat, new subscribers, payments, login activity, password changes, and other relevant account/service notifications. | 01 | — | ✅ |
| AD-67 | **Campaign Questions Home visual:** a compact chart/progress visual showing today's received question count (green indicator), the astrologer's **currently selected** Daily Answer Goal (yellow indicator; default 10, AD-19 — not a fixed 10), and critical questions (red indicator). *(Amended 2026-11-19.)* | 01 | 02 | ✅ |
| AD-68 | **Disputes on Home** are shown separately. An **immediate notification** is sent when a dispute is raised, and a **reminder** is sent before the 3-day Dispute Answer deadline expires. No generic repeated "within 3 days" warning is shown for every open dispute. If the astrologer does not respond within 3 days, the dispute is escalated to Admin Review (AD-41). *(Amended 2026-11-19.)* | 01 | 02 | ✅ |

### 3.2 Text-Based Questions (owner: `02_TEXT_BASED_QUESTIONS.md`)

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-10 | While DND or Planned Unavailability is active, **no new question slot purchases and no new question submissions** are allowed — users are blocked from submitting new Text-Based Questions to that astrologer, and the astrologer's profile is hidden (AD-74). *(Amended 2026-11-19.)* | 02 | 01 | ✅ |
| AD-11 | While DND or Planned Unavailability is active, the expiry of already purchased slots **does not pause**, and the 30-day answer deadline of already submitted questions **does not pause**. **DND days count toward the 30-day answer deadline**; DND does not pause, extend, or reset it. If the astrologer knows in advance that they will activate DND, they should answer pending questions before activating it wherever possible. A question not answered within its 30-day deadline is automatically cancelled and refunded (AD-30). The separate purchased-slot validity rule (AD-28) is unchanged by DND. *(Amended 2026-11-19.)* | 02 | 01 | ✅ |
| AD-24 | The platform allocates a **monthly question slot quota** to each astrologer. Each astrologer has a total monthly capacity of **1,000** Text-Based Question slots. This is **one shared quota** across all Campaign Questions and Open Questions; Campaign Questions and Open Questions do not receive separate additional quotas. Total slots across all campaigns and Open Questions cannot exceed the allocated quota. **Unused monthly slots do not carry forward.** The quota **resets on the 1st day of every calendar month at 12:00 AM IST**. An astrologer who joins mid-month receives a **pro-rata quota based on the remaining days of that month, using whole-number rounding**; from the next calendar month, the normal quota of 1,000 applies, subject to any performance-based reduction (AD-70). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-25 | The astrologer can create multiple campaigns and set their slots/prices, increase/decrease campaign slots, and reallocate unused slots. Purchased/submitted questions must be protected when campaigns are changed or cancelled. | 02 | — | ✅ |
| AD-26 | Astrologers can create campaigns on **any theme or occasion** (for example, Marriage, Career, Education, Business). **Special Campaign is not a separate campaign type**: the same Campaign Editor is used for regular and special campaigns, and the astrologer may give a limited-time or occasion-based campaign a special title/label (for example, a 10-day Navaratri campaign). There is no separate Special Campaign editor, configuration, or workflow. "Open Slots" is **not** a campaign type — questions submitted without a campaign are **Open Questions** (AD-54). Every campaign supports the **General** and **Personal** question types; the astrologer chooses **General only, Personal only, or both General and Personal**; neither type is compulsory. Offers/discounts are optional and decided by the astrologer (AD-56); when none is set, **No Offer** is shown. Campaign fields include Start Date, Expiry Date, slot count, and price. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-27 | Campaign Management is located at **My Work → Text Questions → Campaign Management** and includes: Create Campaign, Edit Campaign, Increase/Decrease Slots, Reallocate Slots, Cancel Campaign, **Delete Campaign**. *(Amended 2026-11-19.)* | 02 | 01 | ✅ |
| AD-28 | **Question submission deadline:** two deadlines apply — (1) seven days from slot purchase; (2) the campaign expiry date. The **earlier** of these two dates is the final question submission deadline. Example 1: purchased November 1; seven-day deadline November 8; campaign expires November 10 → deadline November 8. Example 2: purchased November 1; seven-day deadline November 8; campaign expires November 5 → deadline November 5. Days are IST calendar days (AD-71). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-29 | Campaign expiry does not affect questions already submitted. | 02 | — | ✅ |
| AD-30 | The answer deadline starts from **question submission**, not purchase. The astrologer must answer within **30 days** (IST calendar days, AD-71). If unanswered after 30 days, the question is **auto-cancelled** and the User receives a **refund**. *(Amended 2026-11-19.)* | 02 | 01 | ✅ |
| AD-31 | Campaign **cancellation** and campaign **deletion** are allowed. Cancelling, deleting, or expiring a campaign does **not** cancel already purchased/submitted User Questions; the astrologer must still answer them, and the original 30-day deadline continues. No refund is issued merely because a campaign was cancelled or deleted. Unsold allocations can be reused/reallocated according to the quota rules. After a campaign is cancelled or deleted, a purchased, unused slot remains usable until its **original deadline** — the earlier of purchase + 7 days and the campaign's original expiry date; cancellation or deletion neither expires it immediately nor extends or resets that deadline. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-32 | **Priority 2:** 1–19 pending days. **Priority 1:** 20–30 pending days. Day 20 belongs only to Priority 1. At the end of day 30, the deadline expires and auto-cancellation/refund applies. There is no third/normal priority list. Pending days are IST calendar days (AD-71). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-33 | Priority 1 and Priority 2 are **priority classifications (views)**, not question statuses; a question in a Priority classification keeps its own status. A question stays **New / Received** until the astrologer opens it (AD-51). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-34 | The question workspace displays: Question ID and User ID; User name, profile photo, and relevant user details; amount paid and number of slots purchased; previous questions asked; campaign name; General/Personal question type; question received date/time; horoscope attachment and other attachments, if supplied; full question text; Request Correction action when a Personal Question is submitted using a General slot. | 02 | — | ✅ |
| AD-35 | **General/Personal correction:** if a Personal Question is submitted using a General slot, the astrologer can Request Correction. The User can replace it with another General Question, without extra payment, using the same slot. No General-to-Personal upgrade or conversion is available. The corrected question returns to the astrologer. The original 30-day deadline does not restart. If the User does not respond before the original deadline, the question is auto-cancelled and refunded. If the User resubmits an incorrect question again, the astrologer may Request Correction again. The original deadline continues regardless of the number of correction cycles. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-36 | **Answer Editor:** the astrologer answers using a text-based answer editor with a maximum of **1,500** characters; Save Draft; Auto Save; astrologer-created Answer Templates; Preview Answer, so the astrologer can review and correct the answer before final submission; Voice to Text, where the astrologer speaks and the speech is converted into text in the answer editor; answers are text typed manually or produced by voice-to-text, and **no audio-only answer** can be submitted; Attachments (see AD-45) and Add Link to support the answer or recommendations; Remedy prescription action. The astrologer can preview and edit the answer before final submission. "Remember This Question" is removed completely (R-03). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-37 | **No post-submission editing.** The astrologer should use Preview before submitting. Once submitted, the User can immediately view the answer. (Replaces rejected proposal R-01.) | 02 | — | ✅ |
| AD-38 | **Answer Templates:** the astrologer creates and manages their own templates — Save, Edit, Delete, and reuse. Platform-provided common templates are not currently required. | 02 | — | ✅ |
| AD-39 | The astrologer must be able to prescribe a remedy/atonement while answering, including in a **Dispute Answer**. If prescribed or attached in any service, it must appear in the User's Remedy Tracker. This is a cross-service product requirement. *(Amended 2026-11-19.)* | 02 | 01 | ✅ |
| AD-40 | **Rating & Review:** the User can immediately rate (1–5 stars) and write a review after the answer is delivered. Rating & Review does not block the User from raising a Dispute within 7 days. | 02 | — | ✅ |
| AD-41 | **Dispute:** the User can raise a Dispute within **7 days after answer submission** (IST calendar days, AD-71). Only one Dispute per question. The astrologer answers the Dispute once, within **3 days**; if the astrologer does not answer within 3 days, the Dispute is **escalated to Admin Review**. The User cannot raise another Dispute after the Dispute Answer. *(Amended 2026-11-19.)* | 02 | 01 | ✅ |
| AD-42 | **Platform Complaint:** the User may raise a separate Platform Complaint within seven days after the Dispute Answer. A Platform Complaint is separate from a Dispute and concerns inappropriate/improper answers. A Platform Complaint does **not** hold or block the astrologer's settlement/payment; the platform handles complaints separately. If inappropriate conduct is established, the Platform may separately decide on recovery/refund according to its own process. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-43 | **Settlement:** the astrologer receives payment for completed work under the normal settlement rules. If no Dispute is raised within 7 days after the answer, commission is deducted, the net amount becomes eligible to move to the astrologer's side/settlement, and the question status becomes **Settled**. If a Dispute is raised, settlement follows the Dispute Answer, with commission/net credit after seven days. A Platform Complaint does not hold or block settlement (AD-42). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-44 | **Dispute Answer:** maximum 1,500 characters; text reply only; no Answer Templates or Attachments. A Dispute Answer **may include a remedy**, which must also appear in the User's Remedy Tracker (AD-39). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-45 | **Attachments:** **User question attachments** — General Questions allow no attachments; Personal Questions allow up to **two** attachments. **Astrologer answer attachments** — up to **three** attachments per answer, maximum **10 MB per file**, allowed formats **JPEG, PDF, TXT**. The 10 MB limit and formats apply to astrologer answer attachments only. (Replaces rejected proposal R-02.) *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-46 | **My Work** main page shows: Total Work, Text Questions, Appointments. Text Questions has **four main lifecycle tabs**: Received Questions, Answered Questions, Dispute Questions, and Dispute Solved / Resolved Questions. These must not be collapsed into generic Priority or Completed tabs. **Drafts** and **Expired** remain accessible as secondary tabs or filters. **Priority 1** and **Priority 2** are urgency filters within Received Questions, not lifecycle statuses or replacements for the four main tabs. *(Amended 2026-11-19.)* | 02 | 01 | ✅ |
| AD-47 | **Expired tab:** only questions whose 30-day answer deadline expired and were auto-cancelled/refunded. Old expired records remain available in History. | 02 | — | ✅ |
| AD-48 | **Question cards** include: 1. Question ID; 2. User ID; 3. User Name + Profile Photo; 4. Campaign Name; 5. Question Type; 6. Received Date & Time; 7. Pending Days; 8. Answer Deadline; 9. Priority Status; 10. Horoscope attachment indicator; 11. Other attachments indicator; 12. Question Status; 13. View Question / Answer Now. | 02 | — | ✅ |
| AD-49 | **Filters:** Date Range; Month; Campaign; General/Personal; Priority 1/2; Question Status; Answered/Pending/Disputed/Expired; Search by User ID / Question ID. | 02 | — | ✅ |
| AD-50 | **History:** month-wise history; Received/Answered/Expired summaries; old Answered/Disputed/Expired records; Search and Filters. **Timeline events:** Question Purchased, Question Submitted, Correction Requested, Question Resubmitted, Answer Submitted, Dispute Raised, Dispute Answered, Completed/Expired. | 02 | — | ✅ |
| AD-51 | **Question status lifecycle:** (1) the User purchases/submits a question → **New / Received**; (2) the astrologer opens the question → **Pending** (never before it is opened); (3) the astrologer submits the answer → **Completed**; (4) the 7-day dispute window ends without a Dispute and the amount becomes eligible for settlement → **Settled**. "Answered Questions" is a tab name; the status of questions in it is Completed. Other statuses: Correction Requested, Disputed, Dispute Answered, Expired. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-52 | **Minimum answer target:** the monthly minimum answer target is **800** questions out of the 1,000 monthly slots. An astrologer who joins mid-month receives a **pro-rata minimum target based on the remaining days of that month, using whole-number rounding**; from the next month, the full target of 800 applies. Quota reduction for missing the target follows AD-70; the Text-Based Questions service suspension follows AD-73. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-53 | **General / Personal definitions:** **General** — answered without using the user's Horoscope/Birth Chart. **Personal** — answered based on the user's Horoscope/Birth Chart. The distinction is based on whether Horoscope/Birth Chart information is used, not on the subject of the question. | 02 | — | ✅ |
| AD-54 | **Open Questions** are questions submitted without selecting a specific campaign. Open Questions support both General Questions and Personal Questions and use the same shared monthly quota (AD-24). Open Questions also support optional offers/discounts (AD-56). Open Questions do not require a Campaign title. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-55 | **Separate pricing:** General and Personal questions always have independent pricing, for every campaign and for Open Questions. The astrologer sets each price independently. One price must not be assumed to apply to both types. (Illustrative example: Marriage – General ₹100; Marriage – Personal ₹200.) | 02 | — | ✅ |
| AD-56 | **Separate discounts:** offers/discounts are **optional** and controlled by the astrologer, **not Platform Admin**, for all Campaigns, Special Campaigns, and Open Questions. General and Personal have independent discount settings. The astrologer can independently enable or disable a discount for each type and selects the discount percentage. The maximum discount is **99%**; 100% is not allowed. There is no default discount percentage. The percentage is chosen with a selector that allows increasing/decreasing it, rather than manual typing only. The system calculates the discounted amount automatically and displays the original price, discount percentage, and final payable price. A General discount does not affect Personal pricing, and vice versa. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-57 | **Campaign slot allocation:** the astrologer sets a total slot allocation for each campaign and splits it independently between General and Personal; the General and Personal allocations must add up to the campaign's total allocation (illustrative example: Marriage Campaign 500 slots = General 300 + Personal 200). Unsold allocation can be reallocated to other campaigns or question types, subject to the shared monthly quota. The astrologer may reduce a campaign's slots **even below the number already purchased**; this does **not** cancel or invalidate already purchased/submitted User Questions, which the astrologer must still answer; freed capacity can be reallocated within the monthly quota. All campaign and Open Question allocations together must never exceed the astrologer's monthly quota. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-58 | **Campaign extension:** if the astrologer extends a campaign, the extension also applies to unused purchased question slots belonging to that campaign. If the astrologer does not extend the campaign, it expires according to its configured expiry date. Reactivating a campaign does not automatically restore already expired purchased slots. | 02 | — | ✅ |
| AD-59 | **Expiry warning and reminders (user side):** if a campaign is **within 3 days of expiry**, the user is warned before purchase. Expiry reminders are sent to users three times: **3 days, 2 days, and 1 day before expiry**. Reminders do not change the expiry or refund rules. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-60 | **Unused purchased slots at campaign expiry:** if the campaign expires and the user has not used all purchased slots despite the notifications, the unused slots expire. No refund is provided for unused slots after campaign expiry; this is treated as the user's responsibility. | 02 | — | ✅ |
| AD-61 | **User-side attachments:** General Questions have no attachment option for the user. Personal Questions have an attachment option for up to **two** attachments; users can attach relevant Horoscope/Birth Chart files or images. *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-62 | **No manual cancellation:** after a paid question is submitted, the user has no manual Cancel Question option, and the astrologer has no manual Cancel Question option; once a user submits a question, the astrologer is obligated to answer it. If the astrologer fails to answer within the configured deadline, the system automatically cancels the question and the user receives a refund according to the confirmed refund rules (AD-30). | 02 | — | ✅ |
| AD-69 | **User Question text** has a maximum of **1,000** characters. | 02 | — | ✅ |
| AD-70 | **Quota reduction:** reductions apply to the **following** month, not the already-running month. First consecutive month of missing the 800 minimum target → the following month's quota is reduced by **10%** (900). Second consecutive month of missing the target → the following month's quota is reduced by **20%** (800). If the astrologer completes the reduced quota/target in the reduced month, the full 1,000 quota is restored from the following month. A third consecutive missed month leads to the Text-Based Questions service suspension in AD-73; no further percentage reduction is defined, and after reinstatement the normal 1,000 quota and 800 target apply without carrying forward or restarting any reduction (AD-73). *(Amended 2026-11-19.)* | 02 | — | ✅ |
| AD-71 | **IST calendar-day counting** is used consistently for question expiry, answer deadlines, priority calculations, dispute windows, dispute answer deadlines, the monthly quota reset, the Daily Answer Goal, Home daily counts, and other relevant calendar-day calculations. UTC-based date boundaries are not used for user-facing or astrologer-facing calendar-day rules. | 02 | 01 | ✅ |
| AD-72 | **Text-Based Questions and Subscription Questions:** both categories remain available and are displayed **separately**. **Text-Based Questions** are the normal Text-Based Question service; **Subscription Questions** are questions offered to users as part of a subscriber benefit/offer. Subscription Questions do not replace normal Text-Based Questions, and the two are never merged into one count or one indistinguishable section. Benefit questions per subscription: Silver **1**, Gold **3**, Platinum **4**. Subscription prices, validity periods, renewal rules, and other plan benefits are not confirmed. *(Amended 2026-11-19.)* | 02 | 01 | ✅ |
| AD-73 | **Text-Based Questions service suspension:** if the astrologer misses the monthly minimum answer target for **three consecutive months**, only the **Text-Based Questions service** is suspended for **three months**. The astrologer account is not suspended, and other services remain available under their normal rules. During the suspension, **all new Text-Based Question purchases and submissions are blocked**, including new Campaign Questions and Open Questions. **Previously purchased questions and slots remain valid** during the suspension (within their existing validity, AD-28) and are not blocked or cancelled because of the suspension. The astrologer must answer every outstanding previously purchased question during the suspension period; existing questions continue under the normal 30-day answer deadline, and any question not answered within its deadline is automatically cancelled and refunded under the existing rules (AD-30). **Reopening:** after the three-month period, the service reopens **only after all outstanding previously purchased questions have been answered** or resolved through the existing auto-cancellation/refund process; until then it stays unavailable. On reopening, the normal monthly quota of **1,000** and minimum target of **800** apply; any previous 10% or 20% reduced quota is not carried forward, and the reduced-quota progression is not restarted. *(Amended 2026-11-19.)* | 02 | 01 | ✅ |
| AD-74 | **DND / Planned Unavailability — activation and visibility:** DND can be activated only when the astrologer is not engaged in active work; it **cannot be activated during an ongoing Instant Call or Instant Chat**, which must be finished first. While DND is active, the astrologer's **entire profile is invisible to all users** for the complete selected period: users cannot view the profile or book any service, all services are unavailable (Text-Based Questions, Appointments, Instant Call, Instant Chat, and other bookable services), and users are blocked from submitting new Text-Based Questions to the astrologer. Hiding the profile is required; disabling a booking button while the profile stays discoverable is not sufficient. | 02 | 01 | ✅ |

---

## 4. Open Questions Register

Each item shows its status: **Open** items may not be treated as decisions
until confirmed by the product owner; **Resolved** items keep their original
ID and record the finalized decision (§1, step 5). Earlier questions retired
under the previous process are listed in §9 and are not restored.

### AP-GL — Cross-cutting (Astrologer App)

No open cross-cutting questions. AP-GL-01 was resolved by AD-71.

| ID | Question | Related | Status |
|----|----------|---------|--------|

### AP-01 — Home Screen (owner: `01_HOME_SCREEN.md`)

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-01-03 | What are the exact Peak Demand time ranges for Morning, Afternoon, Evening, and Night, and over what calculation period is demand measured? | AD-16 | Resolved — Peak Demand uses the last 7 days of incoming Text-Based Question and Appointment booking data, with IST ranges Morning 5:00 AM–11:00 AM, Afternoon 11:00 AM–4:00 PM, Evening 4:00 PM–8:00 PM, Night 8:00 PM–5:00 AM (AD-16) |
| AP-01-05 | What are "subscription-based requests" in the DND rule? | AD-07; X-14 | Resolved — during DND the astrologer's entire profile is hidden, so every service, including Subscription Questions, is unavailable (AD-07, AD-74) |

### AP-02 — Text-Based Questions (owner: `02_TEXT_BASED_QUESTIONS.md`)

No open Text-Based Questions questions. AP-02-22 and AP-02-23 were resolved by AD-73.

| ID | Question | Related | Status |
|----|----------|---------|--------|

---

## 5. Cross-App Conflicts Register (X-01 to X-15)

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

### 5.1 User App alignment status (2026-11-19)

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
- [ ] No User App or Platform Admin content changed.

## 8. Cross-Module and Cross-App Consistency Checklist

- [ ] Every AD in §3 has exactly one owning file.
- [ ] AD-10 and AD-11 are stated in full only in §3 and file 02; file 01 references them.
- [ ] Availability rules (AD-04 to AD-09, AD-12) are stated in full only in §3 and file 01; file 02 references them.
- [ ] Priority, deadline, and status rules (AD-28 to AD-33, AD-51) are stated in full only in §3 and file 02.
- [ ] Every AP ID used in a file exists in §4, and vice versa.
- [ ] Every X ID used in a file exists in §5, and each X row names valid User App IDs.
- [ ] Open-question counts in §2 match §4.
- [ ] X-12 remains Open until the product owner rules on it.
- [ ] No retired ID is reused.
- [ ] User App documentation is unchanged by any Astrologer App work.

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
