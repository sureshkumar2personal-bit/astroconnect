# 04.2 — Astrologer Management

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`../15-platform-review-list.md`](../15-platform-review-list.md) |

---

## 1. Purpose and scope

Astrologer List, Individual Astrologer Profile (13 tabs), and Astrologer
account management. Profile tabs are view-only except where stated;
operational actions are performed in the standalone modules.

## 2. Astrologer List

Columns:
- Astrologer Photo
- Name
- Astrologer ID
- Full Mobile
- Email
- Specialization
- Years of Experience
- Services: Text, Appointment, Call, Chat
- Availability: Available / Busy / Offline / DND (§14)
- Account Status: Active / Suspended / Blocked
- Verification Status
- Rating
- Total Services Completed
- Joined Date
- Actions

Search / filters: Name · ID · Mobile · Email · Account Status · Availability ·
Specialization · Service Type · Experience · Registration Date ·
Verification Status · Rating.

Sorting: Newest / Oldest registration · Name A–Z / Z–A · Experience.

Pagination: 10 / 25 / 50 / 100 per page. **PDF / Excel export** of the
filtered list.

Suspend / Block / Reactivate is available from the list or the profile, with
mandatory Reason, Admin ID, and Date / Time.

**Verification Status** is displayed. No verification workflow is defined
here (the Astrologer App shows KYC, identity, and certificate verification
statuses — Astrologer `AD-85`; KYC steps open as `AP-04-01`).

## 3. Astrologer Profile — 13 tabs

1. Profile
2. Documents & Verification
3. Wallet & Earnings
4. Services
5. Followers
6. Subscriptions & Subscribers
7. Remedies
8. Disputes & Complaints
9. Content Management
10. Ratings & Reviews
11. Availability & Schedule
12. Activity
13. Account

## 4. Profile tab

Personal details: Astrologer ID · Profile Photo (optional) · Full Name ·
Gender · DOB · Mobile · Email · Location / Address · Preferred Language ·
Registration Date / Method.

Professional details: Display Name · Bio · Specializations · Experience ·
Languages · Qualifications · Professional Introduction · Services Offered ·
Individual Service Charges.

Account / platform: Account Type · Account Status · Verification Status ·
Last Login · Last Active · Profile Created / Updated.

Internal Admin Notes.

- **Admin may edit Profile Details.**
- Birth Time / Birth Place are not required for Astrologers unless the
  Astrologer App explicitly collects them.
- Documents & Verification is a separate tab.
- In the Astrologer App, selected important profile changes made by the
  Astrologer require Platform Admin approval, and previously verified details
  stay visible until approval (Astrologer `AD-87`; which changes is open as
  `AP-04-02`). The Platform Admin approval screen for these changes is not
  defined — `PP-17`.

## 5. Documents & Verification tab

Documents are secondary. For now:
- Collect / store
- View / preview
- Download

Document verification is **not** a prerequisite for providing services. No
required-document list, approval / rejection workflow, or service restriction
is defined. Astrologer registration and document requirements are
**Pending Discussion** — `PP-07`, `PP-08`. See also
[Document Management](../13-document-management.md).

## 6. Wallet & Earnings tab

Overview: Available Balance · Pending Balance · Held Balance · Total
Earnings · Total Withdrawn · Total Refunded.

Recent transactions: Transaction ID · Date / Time · Service Type ·
Description · Credit · Debit · Refund Amount · Balance After Transaction ·
Status.

Also: month-wise earnings history · service-wise earnings and commission ·
net earnings · settlement history · monthly PDF Earnings Statement. Refund
details link to the Service ID and Transaction ID.

Approved rules used (Astrologer `AD-120` – `AD-127`; details in
[Payments & Finance](../06-payments-finance.md)):
- Commission: Instant Call 2%, Instant Chat 2%, Appointment 3%; commission is
  calculated on the amount the User actually paid after any discount.
- Held Balance holds only earnings for services not yet completed.
- Settlement release: Tuesday and Friday, after the service's eligibility
  period (Text Questions 7 days, Appointments 3 days after completion).
- Withdrawal: minimum ₹500; Bank Account or UPI; processing within 3 working
  days; statuses Pending, Processing, Paid, Failed.
- Pending Balance definition is open — `PP-11`; Text Questions commission
  rate — `PP-09`; Call/Chat eligibility period — `PP-10`.

## 7. Services tab

Four services, each with Total · Pending · In Progress · Completed · Cancelled.

Common history table: Service ID · Type · User Name / ID · Created Date ·
Service Date · User Paid Amount · **Astrologer Earnings** · Service Status ·
Payment Status · View Details.

Service details include complete service-specific information: attachments,
answer, booking, attendance, session duration, earnings, termination reason,
wallet / payment details. Instant Call and Chat are shown as **prepaid
packages** (package duration and price, extensions) — no per-minute rate
(Astrologer `AD-106`, `AD-107`; ruling C1). Text Question and Appointment
statuses follow the approved Astrologer App definitions (`AD-51`, `AD-89`).

Admin view-only; operational actions belong in
[Service Management](../05-service-management/service-overview.md).

Call audio / chat transcripts: no routine access; Admin transcript retention
and access are pending (`PP-04`); recording is not default and requires prior
notice and consent if introduced.

Filters, search, PDF / Excel export.

## 8. Followers tab

Overview: Total Followers · New Today · New This Month · Unfollowed Count.

Current Followers list: Photo · Name · User ID · Follow Date / Time ·
Subscription Status · Account Status · View User Profile.

Unfollowed Users appear only in Follow History. View-only. PDF / Excel export.

## 9. Subscriptions & Subscribers tab

Overview: Active · Expired · Cancelled · Total Purchases · New Subscribers
Today · New This Month.

Includes: subscription plans · subscribers list · User / ID · Plan ·
Purchase / Start / Expiry dates · Amount · Status · Auto-Renewal · renewal,
cancellation, refund, and subscriber content-access history. Payment details
link to Payments & Finance. Failed payments are not subscriptions.

Approved Astrologer App rules used: tiers Silver / Gold / Platinum with 1 / 3
/ 4 benefit questions, shown separately from normal paid questions
(`AD-65`, `AD-72`); price, duration, renewal, and cancellation / refund are
on hold (`X-14`) — `PP-16`. View-only. PDF / Excel export.

## 10. Remedies tab

Uses all rules in [Remedy Management](../08-remedy-management.md): overview,
list and details, daily progress, completion proof, reminder history, edit /
cancel history, moderation / hide, full timeline. View-only except flag /
review / hide of an inappropriate Remedy. PDF / Excel export.

## 11. Disputes & Complaints tab

Astrologer-specific view of the standalone
[Dispute & Complaint Management](../07-dispute-complaint-management.md)
records:
- Service Disputes: Text-Based Question answer disputes only; the Astrologer
  answers once within 3 days, otherwise Admin Review (Astrologer `AD-41`).
- Technical Complaints: other service / platform issues.

Shows details, responses, deadlines, investigation, internal notes, public
replies, refund resolution, and timeline. View-only. PDF / Excel export.

## 12. Content Management tab

Overview: Total Posts · Published · Scheduled · Drafts · Hidden.

Content types: Text posts and Image posts — no video. Audience: Public ·
Followers · Subscribers · subscription tiers (e.g. Silver, Gold). Publishing:
Publish Now · Schedule · Draft. Includes details, likes / comments, Daily /
Weekly Predictions as subscriber benefits, and edit / publish / schedule
history (Astrologer `AD-138` – `AD-144`).

Admin moderation: flag, hide. View-only; full actions in
[Content Management](../09-content-management.md). PDF / Excel export.

## 13. Ratings & Reviews tab

Overview: Total · Published · Pending Publication · Hidden · Replied · Not
Replied. Average rating and rating distribution.

Review list / details: User · Service · Rating · Review Date · Text · Status ·
Reply history.

Astrologer may optionally reply, publish selected reviews, hide reviews, and
edit / delete their own reply; no penalty for not replying; one current reply
per review. Hidden reviews are not visible in the User App but are visible to
Admin (Astrologer `AD-130` – `AD-132`).

View-only; Admin moderation in [Ratings & Reviews](../10-ratings-reviews.md).
PDF / Excel export.

## 14. Availability & Schedule tab

Overview: **Available · Busy · Offline · DND.**

Includes: weekly schedule · daily availability · appointment slots (booked /
available / blocked) · manual date-closure history · DND / Busy history ·
schedule change history.

**DND cannot be activated during an active Call / Chat** (Astrologer `AD-74`).
View-only. Details: [Availability & Schedule](../11-availability-schedule.md).
PDF / Excel export.

## 15. Activity tab

Unified timeline with links to related records, covering: account,
professional profile, services, wallet, subscriptions, content, reviews,
remedies, disputes, availability, documents, Admin actions, login / device
history. Search, filter, PDF / Excel export. Full details stay in the
relevant tabs.

## 16. Account tab

Status: Active · Suspended · Blocked.

Admin actions: Suspend · Block · Unblock · Reactivate — mandatory Reason,
Admin ID, Date / Time, Previous / New Status, history.

Includes: registration / login information · privacy / consent · internal
notes · account deletion request / history. **Password and OTP are never
visible.**

Preserved history: services, wallet, earnings, settlements, disputes.

In the Astrologer App, deactivation and deletion are requests that require
Platform Admin approval (Astrologer `AD-157`); the Platform Admin approval
screen for them is not defined — `PP-18`.

## 17. Pending Discussion – Not Finalized

| ID | Item |
|----|------|
| PP-04 | Admin chat-transcript retention and access |
| PP-07 | Astrologer registration and document requirements |
| PP-08 | Document verification workflow / required documents |
| PP-09 | Text Questions commission rate (and other unfinalized rates) |
| PP-10 | Instant Call / Chat settlement eligibility period |
| PP-11 | Pending Balance definition |
| PP-16 | Subscription price, duration, renewal, cancellation / refund (X-14) |
| PP-17 | Platform Admin approval of selected important profile changes (AD-87) |
| PP-18 | Platform Admin approval of astrologer deactivation / deletion requests (AD-157) |

## 18. Acceptance criteria

- [ ] List columns, filters, sorting, pagination sizes, and filtered export as §2.
- [ ] Exactly 13 profile tabs in order.
- [ ] Admin can edit profile details; documents are not a service prerequisite.
- [ ] Wallet & Earnings uses the approved commission, settlement, and withdrawal rules.
- [ ] Services tab shows astrologer earnings and prepaid packages; view-only.
- [ ] Remaining tabs follow §8 – §16.

## 19. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft from owner-finalized Astrologer Management requirements, with rulings C1, C2, C3, C4, C5, C6 applied. |
