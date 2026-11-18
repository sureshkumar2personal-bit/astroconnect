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
5. When an open question is resolved (per [`CLAUDE.md`](../../CLAUDE.md) §5):
   remove it from §4, never reuse its ID, add or amend the decision in §3,
   and record the resolution with the date in §9.
6. Proposals explicitly rejected by the product owner are recorded in §6.

**Status values:** `Not started` · `Draft` · `In review` · `Approved`

**ID formats**

| Prefix | Meaning | Example |
|--------|---------|---------|
| `AD-xx` | Astrologer App confirmed decision (one sequence for the whole app) | `AD-07` |
| `AP-01-yy` | Open question owned by `01_HOME_SCREEN.md` | `AP-01-03` |
| `AP-02-yy` | Open question owned by `02_TEXT_BASED_QUESTIONS.md` | `AP-02-05` |
| `AP-GL-yy` | Open question affecting more than one Astrologer App module | `AP-GL-01` |
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
| 01 | [`01_HOME_SCREEN.md`](01_HOME_SCREEN.md) | Home Screen | Draft | 12 | |
| 02 | [`02_TEXT_BASED_QUESTIONS.md`](02_TEXT_BASED_QUESTIONS.md) | Text-Based Questions | Draft | 14 | |
| GL | — | Cross-cutting (Astrologer App) | — | 1 | |
| X | — | Cross-app conflicts (§5) | — | 15 | |

Files `01` and `02` exist as **Draft** specifications and have passed
documentation validation. They are not approved and not implementation-ready;
UI implementation has not started and requires a separate plan and approval.

---

## 3. Confirmed Decisions Register (AD-01 to AD-51)

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
| AD-07 | **DND:** all four services stop completely — Text-Based Questions, Appointments, Instant Call, and Instant Chat — including subscription-based requests. DND takes priority over the individual Instant Call and Instant Chat switches. | 01 | 02 | ✅ |
| AD-08 | Turning DND **OFF** does not automatically make the astrologer Online. The astrologer must independently select Online or Offline. | 01 | — | ✅ |
| AD-09 | **Planned Unavailability:** the astrologer can specify a future unavailable period (for example, 10 days). All services stop during the selected period. | 01 | 02 | ✅ |
| AD-12 | New requests resume when DND is turned OFF or the unavailable period ends, subject to other rules. | 01 | 02 | ✅ |
| AD-13 | Availability Schedule and timings belong to the **Appointment Module**, not to Home or Text-Based Questions. | 01 | 02 | ✅ |
| AD-14 | **Today's Earnings** means earnings from services completed/answers delivered today, not money credited to the wallet today. Weekly and monthly earnings use the same completed-service basis. Commission and settlement timing are handled separately in Earnings/Wallet. | 01 | — | ✅ |
| AD-15 | Earnings display: Today's Earnings shown prominently, with This Week and This Month. Comparisons: Today vs Yesterday, This Week vs Last Week, This Month vs Last Month. Positive growth shown in green; decreases shown honestly. No Pending Earnings or Pending Payout figures on Home. Mock figures are illustrative only. | 01 | — | ✅ |
| AD-16 | **Peak Demand Hours:** counts incoming requests across Text Questions, Appointments, Instant Calls, and Instant Chats. The chart is divided into Morning, Afternoon, Evening, and Night. The highest-demand period is highlighted in gold, with a label such as "Peak Time: Evening". It remains a compact Home widget, not a large analytics dashboard. | 01 | — | ✅ |
| AD-17 | **Today's Work** shows Appointments and Text-Based Questions. Instant Calls and Chats do not have a dedicated Today's Work area. Appointments show today's count, the next appointment (time and user name), and View All. | 01 | — | ✅ |
| AD-18 | Today's Work shows Text-Based Question counts: **Received, Answered, Pending**. The exact time scope is pending (AP-01-02). | 01 | 02 | ✅ |
| AD-19 | **Daily Answer Goal:** the astrologer selects 5, 10, or 15 questions per day and can change it later. It is motivational only and does not impose a cap. Progress is shown (for example, 3/5, 60%, "2 more answers to reach today's goal"). | 01 | — | ✅ |
| AD-20 | **Recent Activity** shows the four latest activities and a View All action. Each item has a small icon, a short description, and a time. Examples: New Follower, New Question Received, Appointment Booked, Consultation Completed. | 01 | — | ✅ |
| AD-21 | Exactly four **Quick Actions**: 1. Campaign Questions; 2. Go Live; 3. Content Creation; 4. Remedy Tracker. Vacation and Campaign Management are not added to Home Quick Actions. | 01 | 02 | ✅ |
| AD-22 | **Remedy Tracker (astrologer view):** the astrologer sees only remedies prescribed by them and their completion status. Only the User can mark a remedy Completed. The User may upload a supporting photo/document. The astrologer can view uploaded attachments. The astrologer cannot manually mark a remedy completed. A prescribed remedy must also appear in the User Remedy Tracker. | 01 | 02 | ✅ |
| AD-23 | **Live, Earnings, and Profile** are separate modules to be discussed later. | 01 | — | ✅ |

### 3.2 Text-Based Questions (owner: `02_TEXT_BASED_QUESTIONS.md`)

| ID | Decision | Owning file | Referenced by | Confirmed |
|----|----------|-------------|---------------|-----------|
| AD-10 | While DND or Planned Unavailability is active, **no new question slot purchases and no new question submissions** are allowed. | 02 | 01 | ✅ |
| AD-11 | While DND or Planned Unavailability is active, the expiry of already purchased slots **does not pause**, and the 30-day answer deadline of already submitted questions **does not pause**. | 02 | 01 | ✅ |
| AD-24 | The platform allocates a **monthly question slot quota** to each astrologer. Total slots across campaigns cannot exceed the allocated quota. | 02 | — | ✅ |
| AD-25 | The astrologer can create multiple campaigns and set their slots/prices, increase/decrease campaign slots, and reallocate unused slots. Purchased/submitted questions must be protected when campaigns are changed or cancelled. | 02 | — | ✅ |
| AD-26 | Campaign types include **Specific** and **Open Slots**. Every campaign has **General** and **Personal** options. Offer selection is available if offers exist; otherwise **No Offer** is shown. **Special Campaign** is supported. Campaign fields include Start Date, Expiry Date, slot count, and price. Exact campaign editor, Offer, and Special Campaign configuration remain pending (AP-02-02). | 02 | — | ✅ |
| AD-27 | Campaign Management is located at **My Work → Text Questions → Campaign Management** and includes: Create Campaign, Edit Campaign, Increase/Decrease Slots, Reallocate Slots, Cancel Campaign. | 02 | 01 | ✅ |
| AD-28 | **Question submission deadline:** two deadlines apply — (1) seven days from slot purchase; (2) the campaign expiry date. The **earlier** of these two dates is the final question submission deadline. Example 1: purchased November 1; seven-day deadline November 8; campaign expires November 10 → deadline November 8. Example 2: purchased November 1; seven-day deadline November 8; campaign expires November 5 → deadline November 5. | 02 | — | ✅ |
| AD-29 | Campaign expiry does not affect questions already submitted. | 02 | — | ✅ |
| AD-30 | The answer deadline starts from **question submission**, not purchase. The astrologer must answer within **30 days**. If unanswered after 30 days, the question is **auto-cancelled** and the User receives a **refund**. | 02 | 01 | ✅ |
| AD-31 | Campaign cancellation, deletion, or expiry does not cancel already submitted questions. The original 30-day deadline continues. | 02 | — | ✅ |
| AD-32 | **Priority 2:** 1–19 pending days. **Priority 1:** 20–30 pending days. Day 20 belongs only to Priority 1. At the end of day 30, the deadline expires and auto-cancellation/refund applies. There is no third/normal priority list. | 02 | — | ✅ |
| AD-33 | **New Questions:** newly received, unanswered questions. The same question may appear in New Questions and a Priority tab. These are different filtered views, not separate question statuses. | 02 | — | ✅ |
| AD-34 | The question workspace displays: Question ID and User ID; User name, profile photo, and relevant user details; amount paid and number of slots purchased; previous questions asked; campaign name; General/Personal question type; question received date/time; horoscope attachment and other attachments, if supplied; full question text; Request Correction action when a Personal Question is submitted using a General slot. | 02 | — | ✅ |
| AD-35 | **General/Personal correction:** if a Personal Question is submitted using a General slot, the astrologer can Request Correction. User choices: (1) replace it with another General Question, without extra payment, using the same slot; (2) upgrade to Personal by paying only the price difference and resubmitting. The corrected question returns to the astrologer. The original 30-day deadline does not restart. If the User does not respond before the original deadline, the question is auto-cancelled and refunded. If the User resubmits an incorrect question again, the astrologer may Request Correction again. The original deadline continues regardless of the number of correction cycles. | 02 | — | ✅ |
| AD-36 | **Answer Editor:** maximum 1,500 characters; Save Draft; Auto Save; Remember This Question (purpose pending, AP-02-05); astrologer-created Answer Templates; Preview Answer; Voice to Text; Attachments and Add Link; Remedy prescription action. | 02 | — | ✅ |
| AD-37 | **No post-submission editing.** The astrologer should use Preview before submitting. Once submitted, the User can immediately view the answer. (Replaces rejected proposal R-01.) | 02 | — | ✅ |
| AD-38 | **Answer Templates:** the astrologer creates and manages their own templates — Save, Edit, Delete, and reuse. Platform-provided common templates are not currently required. | 02 | — | ✅ |
| AD-39 | The astrologer must be able to prescribe a remedy/atonement while answering. If prescribed, it must appear in the User's Remedy Tracker. This is a cross-service product requirement. | 02 | 01 | ✅ |
| AD-40 | **Rating & Review:** the User can immediately rate (1–5 stars) and write a review after the answer is delivered. Rating & Review does not block the User from raising a Dispute within 7 days. | 02 | — | ✅ |
| AD-41 | **Dispute:** the User can raise a Dispute within seven days of original answer delivery. Only one Dispute per question. The astrologer answers the Dispute once. The User cannot raise another Dispute after the Dispute Answer. | 02 | — | ✅ |
| AD-42 | **Platform Complaint:** the User may raise a separate Platform Complaint within seven days after the Dispute Answer. A Platform Complaint is separate from a Dispute and concerns inappropriate/improper answers. | 02 | — | ✅ |
| AD-43 | **Settlement:** if no Dispute is raised, commission is deducted and net earnings are credited after seven days. If a Dispute is raised, settlement follows the Dispute Answer, with commission/net credit after seven days, subject to unresolved Platform Complaint rules (AP-02-04). | 02 | — | ✅ |
| AD-44 | **Dispute Answer:** maximum 1,500 characters; text reply only; no Answer Templates or Attachments. | 02 | — | ✅ |
| AD-45 | **Attachments:** maximum **two** attachments per question. Exact accepted file types and maximum file size remain pending (AP-02-06). (Replaces rejected proposal R-02.) | 02 | — | ✅ |
| AD-46 | **My Work** main page shows: Total Work, Text Questions, Appointments. Text Questions tabs: Priority 1, Priority 2, New Questions, Answered, Disputed, Drafts, Expired. | 02 | 01 | ✅ |
| AD-47 | **Expired tab:** only questions whose 30-day answer deadline expired and were auto-cancelled/refunded. Old expired records remain available in History. | 02 | — | ✅ |
| AD-48 | **Question cards** include: 1. Question ID; 2. User ID; 3. User Name + Profile Photo; 4. Campaign Name; 5. Question Type; 6. Received Date & Time; 7. Pending Days; 8. Answer Deadline; 9. Priority Status; 10. Horoscope attachment indicator; 11. Other attachments indicator; 12. Question Status; 13. View Question / Answer Now. | 02 | — | ✅ |
| AD-49 | **Filters:** Date Range; Month; Campaign; General/Personal; Priority 1/2; Question Status; Answered/Pending/Disputed/Expired; Search by User ID / Question ID. | 02 | — | ✅ |
| AD-50 | **History:** month-wise history; Received/Answered/Expired summaries; old Answered/Disputed/Expired records; Search and Filters. **Timeline events:** Question Purchased, Question Submitted, Correction Requested, Question Resubmitted, Answer Submitted, Dispute Raised, Dispute Answered, Completed/Expired. | 02 | — | ✅ |
| AD-51 | **Question status names:** 1. New; 2. Pending; 3. Correction Requested; 4. Answered; 5. Disputed; 6. Dispute Answered; 7. Completed; 8. Expired. | 02 | — | ✅ |

---

## 4. Open Questions Register

All items below are **Open**. None may be treated as a decision until
confirmed by the product owner.

### AP-GL — Cross-cutting (Astrologer App)

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-GL-01 | How are days counted, and in which time zone, for pending days, the 7-day submission deadline, the 30-day answer deadline, and "today" for the Daily Answer Goal, Home counts, and earnings? | AD-19, AD-28, AD-30, AD-32; X-15 | Open |

### AP-01 — Home Screen (owner: `01_HOME_SCREEN.md`)

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-01-01 | What happens to existing appointments and ongoing consultations when DND or Planned Unavailability is activated? (To be decided in the Appointment/Consultation modules.) | AD-07, AD-09 | Open |
| AP-01-02 | What is the exact time scope of the Home Text Question counts (Received, Answered, Pending)? | AD-18 | Open |
| AP-01-03 | What are the exact Peak Demand time ranges for Morning, Afternoon, Evening, and Night, and over what calculation period is demand measured? | AD-16 | Open |
| AP-01-04 | Are Home earnings shown gross or net of commission? How do refunds or Platform Complaint outcomes affect earnings already shown? | AD-14, AD-15 | Open |
| AP-01-05 | What are "subscription-based requests" in the DND rule? | AD-07; X-14 | Open |
| AP-01-06 | Does the Campaign Questions Quick Action show a compact count or chart of questions received that day? | AD-21 | Open |
| AP-01-07 | Where do the notification access point, the Recent Activity "View All" action, and the Appointments "View All" action lead? | AD-02, AD-17, AD-20 | Open |
| AP-01-08 | Which screen does the Campaign Questions Quick Action open? | AD-21 | Open |
| AP-01-09 | Do Dispute Answers count towards the Daily Answer Goal? | AD-19 | Open |
| AP-01-10 | Can a Planned Unavailability period be edited or cancelled after it is set, and how does Planned Unavailability interact with DND? | AD-07, AD-09 | Open |
| AP-01-11 | What is the scope of the Content Creation Quick Action and its module, and which screen does it open? | AD-21, AD-23 | Open |
| AP-01-12 | Which tab or screen is shown by default when the astrologer launches the app? | AD-03 | Open |

### AP-02 — Text-Based Questions (owner: `02_TEXT_BASED_QUESTIONS.md`)

| ID | Question | Related | Status |
|----|----------|---------|--------|
| AP-02-01 | How does the monthly slot quota reset? Is unused quota carried forward, and how is unused quota treated? | AD-24 | Open |
| AP-02-02 | What is the exact configuration of the campaign editor, Offers, and Special Campaigns? | AD-26 | Open |
| AP-02-03 | What is the effect of extending a campaign on previously purchased unused slots? | AD-28; X-01 | Open |
| AP-02-04 | Does a Platform Complaint block settlement, and how does complaint resolution affect settlement? | AD-42, AD-43 | Open |
| AP-02-05 | What is the purpose of "Remember This Question"? | AD-36 | Open |
| AP-02-06 | What file types are accepted for attachments, what is the maximum file size, and are there other restrictions? | AD-45 | Open |
| AP-02-07 | Is a refund given for purchased but unused slots when a campaign expires or is cancelled before the user's seven-day deadline? | AD-25, AD-28; X-01 | Open |
| AP-02-08 | Does the two-attachment limit apply to the User's question, the astrologer's answer, or both? Does the horoscope attachment count towards the limit? | AD-45; X-13 | Open |
| AP-02-09 | When does a question move from New to Pending status, and when does it become Completed? | AD-51 | Open |
| AP-02-10 | Which statuses does each tab include (e.g. do Correction Requested questions appear in Priority tabs; does Disputed include Dispute Answered; does Answered include Completed), and how long is a question considered "new"? | AD-33, AD-46, AD-51 | Open |
| AP-02-11 | What is the astrologer's deadline to answer a Dispute, and what happens if it is not answered? | AD-41, AD-44 | Open |
| AP-02-12 | Can a remedy be prescribed in a Dispute Answer, given that the Dispute Answer is text only? | AD-39, AD-44 | Open |
| AP-02-13 | Can a campaign be deleted? AD-31 refers to campaign deletion, but the Campaign Management actions in AD-27 list Cancel only. | AD-27, AD-31 | Open |
| AP-02-14 | Can a campaign's slot count be reduced below the number of slots already purchased? | AD-25, AD-27 | Open |

---

## 5. Cross-App Conflicts Register (X-01 to X-15)

Each item requires a **separate product-owner decision**. No User App
document is changed by this register, and no Astrologer App decision
automatically changes the User App specification. User App IDs refer to
[`00_USER_APP_REVIEW_LIST.md`](../01-user-app/00_USER_APP_REVIEW_LIST.md).

| ID | Astrologer App ID(s) | User App ID(s) | Conflict or dependency | Decision required | Status |
|----|----------------------|----------------|------------------------|-------------------|--------|
| X-01 | AD-28; AP-02-03, AP-02-07 | D-07 | Astrologer App: the submission deadline is the earlier of purchase + 7 days and campaign expiry. User App D-07: a slot must be used within 7 days from purchase and is not refunded if unused. Refund for slots left unused at campaign expiry is not decided. | Whether to amend User App D-07 to include campaign expiry, and whether refund treatment differs between 7-day expiry and campaign expiry. | Open |
| X-02 | AD-30, AD-35 | P-06-08, P-10-05 | Astrologer App: 30-day answer deadline from submission; auto-cancel and refund if unanswered. User App: answer deadline and refund (P-06-08) and refund destination (P-10-05) are open. | Whether AD-30 resolves P-06-08, and where refunds go. | Open |
| X-03 | AD-41, AD-44 | P-06-09, P-06-10, D-08 | Astrologer App: one Dispute per question, answered once by the astrologer, text only. User App: number of disputes and dispute handling are open. | Whether AD-41/AD-44 resolve P-06-09 and P-06-10. | Open |
| X-04 | AD-40 | P-06-05, D-10 | Astrologer App: Users can rate and review Text Questions. User App: whether Text Questions can be reviewed is open; D-10 covers Appointment, Instant Call, and Instant Chat only. | Whether to resolve P-06-05 and/or amend D-10. | Open |
| X-05 | AD-26, AD-34, AD-35 | P-06-06, P-06-14, P-10-04 | Astrologer App: General/Personal question types, Request Correction, and paying the price difference to upgrade. Not documented in the User App. | Whether to add the user-side correction and upgrade flow to the User App. | Open |
| X-06 | AD-42, AD-43 | P-17-04, P-17-05 | Astrologer App: separate Platform Complaint after the Dispute Answer. Not documented in the User App. | Where the Platform Complaint belongs on the user side. | Open |
| X-07 | AD-26, AD-28 | P-06-13, P-06-04 | Astrologer App: campaign fields (dates, slot count, price, offers). User App: campaign definition and effect of campaign changes are open. | Whether AD-26/AD-28 partially resolve P-06-13 and P-06-04. | Open |
| X-08 | AD-22 | P-16-01, P-16-02, D-11 | Astrologer App: only the User marks a remedy Completed and may upload a supporting file. User App: remedy fields and progress/completion are open. | Whether AD-22 resolves P-16-01 and P-16-02. | Open |
| X-09 | AD-20 | P-14-01 | Astrologer App: "New Follower" activity. User App: whether Follow is separate from Subscribe is open. | Dependency only; follows P-14-01. | Open |
| X-10 | — (stated in the initial Astrologer brief; not restated in the confirmed decision list) | P-15-03 | The User should receive a notification before campaign expiry. User App: exact critical notification events are open. | Confirm whether this is an Astrologer App decision, and whether it becomes a User App notification event. | Open |
| X-11 | AD-34 | P-GL-03 | Astrologer App: the astrologer sees User ID, name, photo, user details, and previous questions. User App: privacy, consent, and data retention are open. | Dependency only; follows P-GL-03. | Open |
| X-12 | AD-10, AD-11 | D-06, D-07 | Astrologer App: no new question submissions during DND or Planned Unavailability, while purchased-slot expiry does not pause. User App: a slot expires 7 days after purchase with no refund. A user who purchased a slot before DND or Planned Unavailability may be unable to submit before the slot expires. **No decision has been made about blocking purchases, extending deadlines, or issuing refunds.** | A product-owner ruling on how users with purchased slots are treated during DND or Planned Unavailability. | Open |
| X-13 | AD-45; AP-02-08 | P-06-06 | Astrologer App: maximum two attachments per question. User App: question attachments are open. | Whether the limit applies to the user's question; depends on AP-02-08. | Open |
| X-14 | AD-07; AP-01-05 | P-14-01 – P-14-05, P-06-01 | Astrologer App: DND stops "subscription-based requests". User App: the subscription model is open. | Dependency only; follows the User App subscription decisions. | Open |
| X-15 | AD-28, AD-30, AD-32; AP-GL-01 | P-06-17 | Both apps need the same rule for counting days (7-day and 30-day windows, pending days) and the time zone used. | One shared decision for both apps. | Open |

---

## 6. Rejected Proposals

| ID | Rejected proposal | Approved alternative | Rejected on |
|----|-------------------|----------------------|-------------|
| R-01 | 30-minute post-submission editing facility for answers | AD-37 — no post-submission editing; use Preview before submitting | 2026-11-17 |
| R-02 | Five-file attachment limit | AD-45 — maximum two attachments per question | 2026-11-17 |

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

**Retired IDs (never reuse):** none.

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
