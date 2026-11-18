# 02 — Text-Based Questions

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-10, AD-11, AD-24 – AD-51 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour for
> UI design and mock-data prototypes. It does not define APIs, data
> structures, or backend logic. Items marked **Pending Product Decision**
> must not be implemented as if decided.

---

## 1. Purpose

Defines the astrologer's side of the Text-Based Questions service: the
monthly slot quota, campaigns and Campaign Management, submission and answer
deadlines, priority lists, the My Work question workspace, the
General/Personal correction workflow, the answer editor and templates,
attachments and remedies, rating, dispute and Platform Complaint rules,
settlement, history, and the question timeline.

## 2. Scope / Out of scope

**In scope**
- Monthly slot quota (AD-24).
- Campaigns, campaign types, and Campaign Management (AD-25 – AD-27).
- Slot allocation, increase/decrease, and reallocation (AD-25, AD-27).
- Submission deadline and campaign expiry (AD-28, AD-29).
- Text-Based Questions during DND or Planned Unavailability (AD-10, AD-11).
- Answer deadline, auto-cancellation, and protection of submitted questions (AD-30, AD-31).
- Priority lists and New Questions view (AD-32, AD-33).
- Question workspace (AD-34) and General/Personal correction (AD-35).
- Answer editor, no post-submission editing, templates, remedy prescription (AD-36 – AD-39).
- Rating & Review, Dispute, Platform Complaint, Dispute Answer (AD-40 – AD-42, AD-44).
- Settlement rules (AD-43).
- Attachments (AD-45).
- My Work, tabs, Expired, question cards, filters, history, timeline, statuses (AD-46 – AD-51).

**Out of scope**
- Home Screen, availability controls, Quick Actions, astrologer Remedy Tracker view → [`01_HOME_SCREEN.md`](01_HOME_SCREEN.md).
- Appointments part of My Work and Availability Schedule (AD-13 → [01](01_HOME_SCREEN.md)).
- Earnings and wallet screens, payout display (Earnings module).
- User-side screens (User App), including purchase, correction choice, rating, dispute, and complaint screens.
- Backend, APIs, real payments, refunds, and settlement processing.

## 3. Entry points

- **My Work** tab in the bottom navigation (AD-03 → [01](01_HOME_SCREEN.md)); My Work main page and Text Questions tabs (AD-46).
- **Campaign Questions** Quick Action on Home (AD-21 → [01](01_HOME_SCREEN.md)). Destination screen: **Pending Product Decision** (AP-01-08).
- Campaign Management: My Work → Text Questions → Campaign Management (AD-27).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-10 | While DND or Planned Unavailability is active, **no new question slot purchases and no new question submissions** are allowed. |
| AD-11 | While DND or Planned Unavailability is active, the expiry of already purchased slots **does not pause**, and the 30-day answer deadline of already submitted questions **does not pause**. |
| AD-24 | The platform allocates a **monthly question slot quota** to each astrologer. Total slots across campaigns cannot exceed the allocated quota. |
| AD-25 | The astrologer can create multiple campaigns and set their slots/prices, increase/decrease campaign slots, and reallocate unused slots. Purchased/submitted questions must be protected when campaigns are changed or cancelled. |
| AD-26 | Campaign types include **Specific** and **Open Slots**. Every campaign has **General** and **Personal** options. Offer selection is available if offers exist; otherwise **No Offer** is shown. **Special Campaign** is supported. Campaign fields include Start Date, Expiry Date, slot count, and price. Exact campaign editor, Offer, and Special Campaign configuration remain pending (AP-02-02). |
| AD-27 | Campaign Management is located at **My Work → Text Questions → Campaign Management** and includes: Create Campaign, Edit Campaign, Increase/Decrease Slots, Reallocate Slots, Cancel Campaign. |
| AD-28 | **Question submission deadline:** two deadlines apply — (1) seven days from slot purchase; (2) the campaign expiry date. The **earlier** of these two dates is the final question submission deadline. Example 1: purchased November 1; seven-day deadline November 8; campaign expires November 10 → deadline November 8. Example 2: purchased November 1; seven-day deadline November 8; campaign expires November 5 → deadline November 5. |
| AD-29 | Campaign expiry does not affect questions already submitted. |
| AD-30 | The answer deadline starts from **question submission**, not purchase. The astrologer must answer within **30 days**. If unanswered after 30 days, the question is **auto-cancelled** and the User receives a **refund**. |
| AD-31 | Campaign cancellation, deletion, or expiry does not cancel already submitted questions. The original 30-day deadline continues. |
| AD-32 | **Priority 2:** 1–19 pending days. **Priority 1:** 20–30 pending days. Day 20 belongs only to Priority 1. At the end of day 30, the deadline expires and auto-cancellation/refund applies. There is no third/normal priority list. |
| AD-33 | **New Questions:** newly received, unanswered questions. The same question may appear in New Questions and a Priority tab. These are different filtered views, not separate question statuses. |
| AD-34 | The question workspace displays: Question ID and User ID; User name, profile photo, and relevant user details; amount paid and number of slots purchased; previous questions asked; campaign name; General/Personal question type; question received date/time; horoscope attachment and other attachments, if supplied; full question text; Request Correction action when a Personal Question is submitted using a General slot. |
| AD-35 | **General/Personal correction:** if a Personal Question is submitted using a General slot, the astrologer can Request Correction. User choices: (1) replace it with another General Question, without extra payment, using the same slot; (2) upgrade to Personal by paying only the price difference and resubmitting. The corrected question returns to the astrologer. The original 30-day deadline does not restart. If the User does not respond before the original deadline, the question is auto-cancelled and refunded. If the User resubmits an incorrect question again, the astrologer may Request Correction again. The original deadline continues regardless of the number of correction cycles. |
| AD-36 | **Answer Editor:** maximum 1,500 characters; Save Draft; Auto Save; Remember This Question (purpose pending, AP-02-05); astrologer-created Answer Templates; Preview Answer; Voice to Text; Attachments and Add Link; Remedy prescription action. |
| AD-37 | **No post-submission editing.** The astrologer should use Preview before submitting. Once submitted, the User can immediately view the answer. (Replaces rejected proposal R-01.) |
| AD-38 | **Answer Templates:** the astrologer creates and manages their own templates — Save, Edit, Delete, and reuse. Platform-provided common templates are not currently required. |
| AD-39 | The astrologer must be able to prescribe a remedy/atonement while answering. If prescribed, it must appear in the User's Remedy Tracker. This is a cross-service product requirement. |
| AD-40 | **Rating & Review:** the User can immediately rate (1–5 stars) and write a review after the answer is delivered. Rating & Review does not block the User from raising a Dispute within 7 days. |
| AD-41 | **Dispute:** the User can raise a Dispute within seven days of original answer delivery. Only one Dispute per question. The astrologer answers the Dispute once. The User cannot raise another Dispute after the Dispute Answer. |
| AD-42 | **Platform Complaint:** the User may raise a separate Platform Complaint within seven days after the Dispute Answer. A Platform Complaint is separate from a Dispute and concerns inappropriate/improper answers. |
| AD-43 | **Settlement:** if no Dispute is raised, commission is deducted and net earnings are credited after seven days. If a Dispute is raised, settlement follows the Dispute Answer, with commission/net credit after seven days, subject to unresolved Platform Complaint rules (AP-02-04). |
| AD-44 | **Dispute Answer:** maximum 1,500 characters; text reply only; no Answer Templates or Attachments. |
| AD-45 | **Attachments:** maximum **two** attachments per question. Exact accepted file types and maximum file size remain pending (AP-02-06). (Replaces rejected proposal R-02.) |
| AD-46 | **My Work** main page shows: Total Work, Text Questions, Appointments. Text Questions tabs: Priority 1, Priority 2, New Questions, Answered, Disputed, Drafts, Expired. |
| AD-47 | **Expired tab:** only questions whose 30-day answer deadline expired and were auto-cancelled/refunded. Old expired records remain available in History. |
| AD-48 | **Question cards** include: 1. Question ID; 2. User ID; 3. User Name + Profile Photo; 4. Campaign Name; 5. Question Type; 6. Received Date & Time; 7. Pending Days; 8. Answer Deadline; 9. Priority Status; 10. Horoscope attachment indicator; 11. Other attachments indicator; 12. Question Status; 13. View Question / Answer Now. |
| AD-49 | **Filters:** Date Range; Month; Campaign; General/Personal; Priority 1/2; Question Status; Answered/Pending/Disputed/Expired; Search by User ID / Question ID. |
| AD-50 | **History:** month-wise history; Received/Answered/Expired summaries; old Answered/Disputed/Expired records; Search and Filters. **Timeline events:** Question Purchased, Question Submitted, Correction Requested, Question Resubmitted, Answer Submitted, Dispute Raised, Dispute Answered, Completed/Expired. |
| AD-51 | **Question status names:** 1. New; 2. Pending; 3. Correction Requested; 4. Answered; 5. Disputed; 6. Dispute Answered; 7. Completed; 8. Expired. |

**Referenced decisions** (owned by [`01_HOME_SCREEN.md`](01_HOME_SCREEN.md))

| ID | Topic |
|----|-------|
| AD-03 | Bottom navigation (My Work tab) |
| AD-05 | Offline: Text-Based Questions can still arrive |
| AD-07 | DND stops all four services |
| AD-09 | Planned Unavailability stops all services |
| AD-12 | New requests resume after DND or Planned Unavailability |
| AD-13 | Availability Schedule and timings belong to the Appointment Module |
| AD-18 | Home Text Question counts |
| AD-21 | Campaign Questions Quick Action |
| AD-22 | Astrologer Remedy Tracker view |

## 5. User flows

### 5.1 Create a campaign
1. The astrologer opens My Work → Text Questions → Campaign Management → Create Campaign (AD-27).
2. The astrologer chooses the campaign type (Specific or Open Slots), and sets Start Date, Expiry Date, slot count, and price (AD-26). Every campaign has General and Personal options (AD-26).
3. If offers exist, the astrologer selects one; otherwise "No Offer" is shown (AD-26). Special Campaign is supported (AD-26).
4. Total slots across all campaigns cannot exceed the monthly quota (AD-24).
5. Exact editor fields, Offer, and Special Campaign configuration: **Pending Product Decision** (AP-02-02).

### 5.2 Edit, resize, or reallocate slots
1. The astrologer uses Edit Campaign, Increase/Decrease Slots, or Reallocate Slots (AD-27).
2. Unused slots can be reallocated between campaigns (AD-25).
3. Purchased/submitted questions must be protected (AD-25).
4. The quota limit applies (AD-24).
5. Whether a campaign's slot count can be reduced below the number of slots already purchased: **Pending Product Decision** (AP-02-14).

> Illustrative example (from the product brief; not product values): Marriage campaign — 100 slots, sold out. Career campaign — 100 slots, 50 sold, 50 unused. The astrologer reduces Career by 50 and adds those 50 slots to Marriage.

### 5.3 Cancel a campaign
1. The astrologer selects Cancel Campaign (AD-27).
2. Already submitted questions are not cancelled; their original 30-day deadline continues (AD-31).
3. Purchased but unused slots: refund **Pending Product Decision** (AP-02-07, X-01).
4. Whether a campaign can also be deleted: **Pending Product Decision** (AP-02-13).

### 5.4 User purchase and submission (context for the astrologer)
1. Users purchase slots from the astrologer's campaigns (user-side flow; User App).
2. The question must be submitted by the earlier of purchase + 7 days and the campaign expiry date (AD-28).
3. While DND or Planned Unavailability is active, no new slot purchases and no new submissions are allowed (AD-10); slot expiry does not pause (AD-11).
4. Effect on users holding purchased slots during DND or Planned Unavailability: **Pending Product Decision** (X-12).
5. Effect of a campaign extension on purchased unused slots: **Pending Product Decision** (AP-02-03).

### 5.5 Triage questions in My Work
1. The astrologer opens My Work and sees Total Work, Text Questions, and Appointments (AD-46).
2. In Text Questions, the astrologer uses the tabs: Priority 1, Priority 2, New Questions, Answered, Disputed, Drafts, Expired (AD-46).
3. Priority 1 holds questions pending 20–30 days; Priority 2 holds 1–19 days (AD-32).
4. A question may appear in New Questions and in a Priority tab (AD-33).
5. The astrologer applies filters and search (AD-49).
6. Which statuses each tab contains: **Pending Product Decision** (AP-02-10).

### 5.6 Answer a question
1. The astrologer opens a question card (View Question / Answer Now, AD-48) to see the workspace (AD-34).
2. The astrologer writes the answer (maximum 1,500 characters), using Save Draft, Auto Save, Answer Templates, Voice to Text, Attachments, Add Link, and Remember This Question as needed (AD-36).
   - Purpose of Remember This Question: **Pending Product Decision** (AP-02-05).
   - Attachments: maximum two per question (AD-45); file types, size, and scope: **Pending Product Decision** (AP-02-06, AP-02-08).
3. If appropriate, the astrologer prescribes a remedy/atonement; it must appear in the User's Remedy Tracker (AD-39).
4. The astrologer previews the answer (AD-37).
5. The astrologer submits. The answer cannot be edited afterwards; the User can view it immediately (AD-37).

### 5.7 Request Correction (General slot used for a Personal Question)
1. In the workspace, the astrologer selects Request Correction (AD-34, AD-35).
2. The User chooses: (1) replace with another General Question, no extra payment, same slot; or (2) upgrade to Personal, paying only the price difference, and resubmit (AD-35).
3. The corrected question returns to the astrologer (AD-35).
4. The original 30-day deadline continues and does not restart (AD-35).
5. If the User does not respond before the original deadline, the question is auto-cancelled and refunded (AD-35).
6. If the resubmitted question is incorrect again, the astrologer may Request Correction again; the original deadline continues (AD-35).

### 5.8 After the answer: rating, dispute, complaint
1. The User can immediately rate (1–5 stars) and review; this does not block a Dispute (AD-40).
2. The User can raise one Dispute within seven days of original answer delivery (AD-41).
3. The astrologer answers the Dispute once: maximum 1,500 characters, text only, no templates or attachments (AD-44).
   - Astrologer's deadline to answer a Dispute: **Pending Product Decision** (AP-02-11).
   - Remedy prescription in a Dispute Answer: **Pending Product Decision** (AP-02-12).
4. No further Dispute is allowed after the Dispute Answer (AD-41).
5. The User may raise a separate Platform Complaint within seven days after the Dispute Answer (AD-42).

### 5.9 Settlement (rules only; no wallet screens here)
1. No Dispute: after seven days, commission is deducted and net earnings are credited (AD-43).
2. Dispute: settlement follows the Dispute Answer, with commission/net credit after seven days, subject to Platform Complaint rules (AD-43).
3. Whether a Platform Complaint blocks settlement and how resolution affects it: **Pending Product Decision** (AP-02-04).

### 5.10 Unanswered question reaches the deadline
1. At the end of day 30 from submission, an unanswered question is auto-cancelled and the User is refunded (AD-30, AD-32).
2. It appears in the Expired tab; older expired records remain in History (AD-47).

### 5.11 Manage Answer Templates
The astrologer saves, edits, deletes, and reuses their own templates (AD-38).

### 5.12 Review History and Timeline
1. The astrologer selects a month to see Received/Answered/Expired summaries and old Answered/Disputed/Expired records, with Search and Filters (AD-50).
2. The astrologer opens a question's timeline of events (AD-50).

## 6. Screens and content

### 6.1 My Work main page (AD-46)
- Total Work
- Text Questions
- Appointments (out of scope for this file)

### 6.2 Text Questions workspace (AD-46, AD-49)

| Tab | Definition | Pending |
|-----|-----------|---------|
| Priority 1 | Pending 20–30 days (AD-32) | Status mapping (AP-02-10) |
| Priority 2 | Pending 1–19 days (AD-32) | Status mapping (AP-02-10) |
| New Questions | Newly received, unanswered (AD-33) | How long "new" lasts (AP-02-10) |
| Answered | — | Status mapping (AP-02-10) |
| Disputed | — | Status mapping (AP-02-10) |
| Drafts | — | Status mapping (AP-02-10) |
| Expired | Auto-cancelled/refunded after the 30-day deadline (AD-47) | — |

Filters and search (AD-49): Date Range; Month; Campaign; General/Personal;
Priority 1/2; Question Status; Answered/Pending/Disputed/Expired; Search by
User ID / Question ID.

### 6.3 Question card (AD-48)
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

### 6.4 Question workspace (AD-34)
- Question ID and User ID
- User name, profile photo, and relevant user details
- Amount paid and number of slots purchased
- Previous questions asked
- Campaign name
- General/Personal question type
- Question received date/time
- Horoscope attachment and other attachments, if supplied
- Full question text
- Request Correction action (when a Personal Question is submitted using a General slot)

Visibility of User details depends on X-11 (User App P-GL-03).

### 6.5 Answer editor (AD-36 – AD-39, AD-45)
- Answer text, maximum 1,500 characters
- Save Draft; Auto Save
- Remember This Question (purpose: AP-02-05)
- Answer Templates (astrologer's own)
- Preview Answer
- Voice to Text
- Attachments (maximum two per question; AP-02-06, AP-02-08) and Add Link
- Remedy prescription action
- Submit (no editing after submission)

### 6.6 Dispute Answer editor (AD-44)
- Text reply only, maximum 1,500 characters
- No Answer Templates; no Attachments

### 6.7 Campaign Management (AD-24 – AD-27)
- Monthly quota and slots allocated across campaigns (AD-24)
- Campaign list
- Create Campaign; Edit Campaign; Increase/Decrease Slots; Reallocate Slots; Cancel Campaign (AD-27)
- Campaign fields: type (Specific / Open Slots), General and Personal options, Offer or No Offer, Special Campaign, Start Date, Expiry Date, slot count, price (AD-26)
- Editor details, Offer and Special Campaign configuration: AP-02-02
- Quota reset and carry-forward: AP-02-01
- Delete action: AP-02-13
- Reducing slots below the number already purchased: AP-02-14

### 6.8 Answer Templates manager (AD-38)
- Save, Edit, Delete, reuse

### 6.9 History (AD-50)
- Month selector; Received/Answered/Expired summary
- Old Answered/Disputed/Expired records
- Search and Filters

### 6.10 Timeline (AD-50)
Question Purchased → Question Submitted → Correction Requested* →
Question Resubmitted* → Answer Submitted → Dispute Raised* → Dispute
Answered* → Completed/Expired. (*if applicable)

## 7. Business rules and validations

### 7.1 Quota and campaigns
| # | Rule | Source |
|---|------|--------|
| BR-02-01 | Total slots across campaigns cannot exceed the monthly quota. | AD-24 |
| BR-02-02 | The astrologer can create multiple campaigns and set slots and prices. | AD-25 |
| BR-02-03 | Campaign slots can be increased or decreased; unused slots can be reallocated. | AD-25 |
| BR-02-04 | Purchased/submitted questions must be protected when campaigns are changed or cancelled. | AD-25 |
| BR-02-05 | Campaign types: Specific, Open Slots; every campaign has General and Personal options; Offer or No Offer; Special Campaign supported. | AD-26 |
| BR-02-06 | Campaign fields include Start Date, Expiry Date, slot count, price. | AD-26 |
| BR-02-07 | Campaign Management actions: Create, Edit, Increase/Decrease Slots, Reallocate Slots, Cancel. | AD-27 |

Reducing a campaign's slot count below the number of slots already
purchased: **Pending Product Decision** (AP-02-14).

### 7.2 Deadlines
| # | Rule | Source |
|---|------|--------|
| BR-02-08 | Submission deadline = the earlier of purchase + 7 days and campaign expiry. | AD-28 |
| BR-02-09 | Campaign expiry does not affect submitted questions. | AD-29 |
| BR-02-10 | Answer deadline: 30 days from submission; unanswered questions are auto-cancelled and refunded. | AD-30 |
| BR-02-11 | Campaign cancellation, deletion, or expiry does not cancel submitted questions; the original deadline continues. | AD-31 |
| BR-02-12 | During DND or Planned Unavailability: no new slot purchases or submissions; slot expiry and the 30-day deadline do not pause. | AD-10, AD-11 |

Day counting and time zone: **Pending Product Decision** (AP-GL-01, X-15).

### 7.3 Priority, views, and statuses
| # | Rule | Source |
|---|------|--------|
| BR-02-13 | Priority 2 = 1–19 pending days; Priority 1 = 20–30 pending days; day 20 is Priority 1 only; no third list. | AD-32 |
| BR-02-14 | New Questions, Priority 1, and Priority 2 are filtered views, not statuses; a question may appear in more than one. | AD-33 |
| BR-02-15 | Status names: New, Pending, Correction Requested, Answered, Disputed, Dispute Answered, Completed, Expired. | AD-51 |
| BR-02-16 | The Expired tab holds only questions auto-cancelled/refunded after the 30-day deadline. | AD-47 |

Status transitions (New → Pending; when Completed applies) and tab-to-status
mapping: **Pending Product Decision** (AP-02-09, AP-02-10).

### 7.4 Correction
| # | Rule | Source |
|---|------|--------|
| BR-02-17 | Request Correction is available when a Personal Question is submitted using a General slot. | AD-34, AD-35 |
| BR-02-18 | User options: replace with a General Question (no payment, same slot) or upgrade to Personal (pay difference, resubmit). | AD-35 |
| BR-02-19 | The original 30-day deadline continues through all correction cycles; no response before it → auto-cancel and refund. | AD-35 |
| BR-02-20 | Correction can be requested again if the resubmitted question is still incorrect. | AD-35 |

### 7.5 Answering
| # | Rule | Source |
|---|------|--------|
| BR-02-21 | Answer maximum 1,500 characters. | AD-36 |
| BR-02-22 | No editing after submission; the User sees the answer immediately. | AD-37 |
| BR-02-23 | Templates are created and managed by the astrologer; no platform templates are required. | AD-38 |
| BR-02-24 | A remedy prescribed while answering must appear in the User's Remedy Tracker. | AD-39 |
| BR-02-25 | Maximum two attachments per question. | AD-45 |

### 7.6 Rating, dispute, complaint, settlement
| # | Rule | Source |
|---|------|--------|
| BR-02-26 | Rating (1–5) and review are available immediately and do not block a Dispute. | AD-40 |
| BR-02-27 | One Dispute per question, within seven days of original answer delivery; answered once; no further Dispute. | AD-41 |
| BR-02-28 | Dispute Answer: maximum 1,500 characters, text only, no templates or attachments. | AD-44 |
| BR-02-29 | Platform Complaint: separate from Dispute; within seven days after the Dispute Answer; concerns inappropriate/improper answers. | AD-42 |
| BR-02-30 | Settlement: no Dispute → commission deducted, net credited after seven days; Dispute → after the Dispute Answer plus seven days, subject to complaint rules. | AD-43 |

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| Purchase + 7 days is earlier than campaign expiry | Submission deadline = purchase + 7 days (AD-28) |
| Campaign expiry is earlier than purchase + 7 days | Submission deadline = campaign expiry (AD-28) |
| Slot purchased but unused when the campaign expires or is cancelled | Refund **Pending Product Decision** (AP-02-07, X-01) |
| Campaign extended with purchased unused slots | **Pending Product Decision** (AP-02-03) |
| Campaign cancelled with submitted questions | Questions remain; original deadline continues (AD-31) |
| Campaign deletion | Submitted questions remain (AD-31); whether Delete is an action: **Pending Product Decision** (AP-02-13) |
| Quota fully allocated | Total campaign slots cannot exceed the quota (AD-24) |
| Astrologer tries to reduce a campaign below the number of slots already purchased | **Pending Product Decision** (AP-02-14) |
| DND or Planned Unavailability active | No new purchases or submissions; deadlines do not pause (AD-10, AD-11) |
| User holding a purchased slot during DND or Planned Unavailability | **Pending Product Decision** (X-12) |
| Question at pending day 19 | Priority 2 (AD-32) |
| Question at pending day 20 | Priority 1 only (AD-32) |
| End of day 30, unanswered | Auto-cancelled and refunded; appears in Expired (AD-30, AD-32, AD-47) |
| Question both new and within a Priority range | Appears in New Questions and the Priority tab (AD-33) |
| Correction requested; User does not respond before the deadline | Auto-cancelled and refunded (AD-35) |
| Resubmitted question still incorrect | Correction may be requested again (AD-35) |
| Answer reaches 1,500 characters | Limit reached (AD-36) |
| Answer submitted | No editing (AD-37) |
| Dispute raised after seven days from answer delivery | Not available (AD-41) |
| Second Dispute after the Dispute Answer | Not allowed (AD-41) |
| Dispute not answered by the astrologer | **Pending Product Decision** (AP-02-11) |
| Platform Complaint open during settlement | **Pending Product Decision** (AP-02-04) |
| Third attachment added | Not allowed; maximum two (AD-45); scope **Pending** (AP-02-08) |

## 9. Notifications triggered

No astrologer notification events are confirmed for this module.

- User notification before campaign expiry: **Pending Product Decision** (X-10; User App P-15-03).

## 10. Dependencies on other modules

| Dependency | Reference |
|------------|-----------|
| Home Screen | AD-03, AD-05, AD-07, AD-09, AD-12, AD-13, AD-18, AD-21, AD-22 → [01](01_HOME_SCREEN.md) |
| Earnings/Wallet (commission, settlement display) | AD-43; AP-02-04 |
| Appointment Module | AD-13 → [01](01_HOME_SCREEN.md) |
| User App — slot expiry and refunds | X-01 (User App D-07) |
| User App — answer deadline and refunds | X-02 (User App P-06-08, P-10-05) |
| User App — disputes | X-03 (User App D-08, P-06-09, P-06-10) |
| User App — Text Question reviews | X-04 (User App D-10, P-06-05) |
| User App — General/Personal correction and upgrade | X-05 (User App P-06-06, P-06-14, P-10-04) |
| User App — Platform Complaint | X-06 (User App P-17-04, P-17-05) |
| User App — campaign definition | X-07 (User App P-06-13, P-06-04) |
| User App — Remedy Tracker | X-08 (User App D-11, P-16-01, P-16-02) |
| User App — notification before campaign expiry | X-10 (User App P-15-03) |
| User App — privacy of User details | X-11 (User App P-GL-03) |
| User App — DND / Planned Unavailability vs slot expiry | X-12 (User App D-06, D-07) |
| User App — attachment limit | X-13 (User App P-06-06) |
| Day counting and time zone | AP-GL-01; X-15 (User App P-06-17) |

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module**

| ID | Topic | Status |
|----|-------|--------|
| AP-02-01 | Monthly quota reset, carry-forward, unused quota | Open |
| AP-02-02 | Campaign editor, Offer, and Special Campaign configuration | Open |
| AP-02-03 | Campaign extension and purchased unused slots | Open |
| AP-02-04 | Platform Complaint and settlement | Open |
| AP-02-05 | Purpose of Remember This Question | Open |
| AP-02-06 | Attachment file types, size, restrictions | Open |
| AP-02-07 | Refund for unused slots at campaign expiry or cancellation | Open |
| AP-02-08 | Scope of the two-attachment limit | Open |
| AP-02-09 | New → Pending and Completed transitions | Open |
| AP-02-10 | Tab-to-status mapping; how long "new" lasts | Open |
| AP-02-11 | Astrologer deadline to answer a Dispute | Open |
| AP-02-12 | Remedy in a Dispute Answer | Open |
| AP-02-13 | Campaign Delete vs Cancel | Open |
| AP-02-14 | Reducing slots below the number already purchased | Open |

**Related (owned elsewhere)**

| ID | Topic | Status |
|----|-------|--------|
| AP-GL-01 | Day counting and time zone | Open |
| AP-01-08 | Campaign Questions Quick Action destination screen | Open |

**Cross-app conflicts referenced** (full detail in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §5](00_ASTROLOGER_APP_REVIEW_LIST.md#5-cross-app-conflicts-register-x-01-to-x-15))

| ID | Topic | Status |
|----|-------|--------|
| X-01 | Submission deadline and refund vs User App D-07 | Open |
| X-02 | 30-day deadline and refund | Open |
| X-03 | Dispute rules | Open |
| X-04 | Text Question rating and review | Open |
| X-05 | General/Personal correction and upgrade | Open |
| X-06 | Platform Complaint | Open |
| X-07 | Campaign fields | Open |
| X-08 | Remedy completion and upload | Open |
| X-10 | Notification before campaign expiry | Open |
| X-11 | Visibility of User details | Open |
| X-12 | DND / Planned Unavailability vs purchased-slot expiry | Open |
| X-13 | Two-attachment limit | Open |
| X-15 | Shared day-counting rule | Open |

## 12. Acceptance criteria

Confirmed rules only.

- [ ] During DND or Planned Unavailability, no new slot purchases or question submissions are accepted (AD-10).
- [ ] During DND or Planned Unavailability, slot expiry and the 30-day answer deadline continue (AD-11).
- [ ] Total campaign slots cannot exceed the monthly quota (AD-24).
- [ ] The astrologer can create multiple campaigns, set slots and prices, increase/decrease slots, and reallocate unused slots, with purchased/submitted questions protected (AD-25).
- [ ] Campaigns support Specific and Open Slots types, General and Personal options, Offer or No Offer, Special Campaign, Start Date, Expiry Date, slot count, and price (AD-26).
- [ ] Campaign Management is at My Work → Text Questions → Campaign Management with Create, Edit, Increase/Decrease Slots, Reallocate Slots, Cancel (AD-27).
- [ ] The submission deadline is the earlier of purchase + 7 days and campaign expiry, matching both examples (AD-28).
- [ ] Campaign expiry does not affect submitted questions (AD-29).
- [ ] The answer deadline is 30 days from submission; unanswered questions are auto-cancelled and refunded (AD-30).
- [ ] Campaign cancellation, deletion, or expiry does not cancel submitted questions (AD-31).
- [ ] Priority 2 shows 1–19 pending days; Priority 1 shows 20–30; day 20 is only in Priority 1; there is no third list (AD-32).
- [ ] A question can appear in both New Questions and a Priority tab (AD-33).
- [ ] The question workspace shows every field listed in AD-34.
- [ ] Request Correction offers both User options, keeps the original deadline, auto-cancels and refunds on no response, and can be repeated (AD-35).
- [ ] The answer editor enforces 1,500 characters and provides every tool in AD-36.
- [ ] Submitted answers cannot be edited, and the User can view them immediately (AD-37).
- [ ] The astrologer can save, edit, delete, and reuse their own templates (AD-38).
- [ ] A remedy prescribed while answering appears in the User's Remedy Tracker (AD-39).
- [ ] Rating (1–5) and review are available immediately and do not block a Dispute (AD-40).
- [ ] Only one Dispute per question, within seven days of original answer delivery, answered once (AD-41).
- [ ] A Platform Complaint can be raised within seven days after the Dispute Answer, separately from a Dispute (AD-42).
- [ ] Settlement follows AD-43 for the no-Dispute and Dispute cases.
- [ ] The Dispute Answer allows text only, up to 1,500 characters, with no templates or attachments (AD-44).
- [ ] No more than two attachments can be added per question (AD-45).
- [ ] My Work shows Total Work, Text Questions, Appointments, and the seven Text Questions tabs (AD-46).
- [ ] The Expired tab contains only auto-cancelled/refunded questions; older records remain in History (AD-47).
- [ ] Question cards show all 13 fields of AD-48.
- [ ] All filters and searches of AD-49 are available.
- [ ] History and Timeline follow AD-50.
- [ ] Only the eight status names of AD-51 are used.

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from AD-10, AD-11, and AD-24 – AD-51. |
| 2026-11-17 | Synchronized with review list: AP-02-14 added to §11 and referenced in §5.2, §6.7, §7.1, §8; AP-01-08 referenced for the Campaign Questions entry point. No decision changed. |
