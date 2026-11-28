# 15 — Platform Admin Review List

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Governance | [`00-platform-governance.md`](00-platform-governance.md) |

---

## 1. How to use this list

- **§2** lists the requirement groups already finalized by the product owner
  for Platform Admin and where they are documented.
- **§3** lists pending items (`PP-xx`), awaiting a product-owner decision.
- **§4** is the conflict register (`PC-xx`) between the original Platform
  prompt and decisions already approved in the User App / Astrologer App
  decision logs, with the product-owner rulings of 2026-11-25 (C1 – C10).
- **§5** lists cross-app alignment dependencies (`PX-xx`) — work the User
  App, Astrologer App, or shared files need; none of those files is changed
  by this documentation.
- When a pending item is answered, it keeps its ID, becomes **Resolved**, and
  the decision is recorded (root `CLAUDE.md` §5). IDs are never reused.

Counts: **24 pending** (PP-01 – PP-24) · **15 conflicts** (PC-01 – PC-15:
10 ruled, 4 open, 1 preserved by rule) · **12 dependencies** (PX-01 – PX-12).

## 2. Finalized requirement groups (owner-approved for Platform Admin)

| ID | Requirement group | Document | Status |
|----|-------------------|----------|--------|
| PF-01 | Documentation governance (current `CLAUDE.md` hierarchy — ruling C10) | [00](00-platform-governance.md) | Finalized |
| PF-02 | Platform-wide rules: IDs, roles, Super Admin, account statuses, audit, privacy, finance separation, dispute classification | [01](01-platform-rules.md) | Finalized (ID formats PP-15) |
| PF-03 | Common login page, role-based navigation, demo scope, no admin approval for astrologer registration | [02](02-platform-login.md) | Finalized |
| PF-04 | Dashboard: header, KPIs, Today's Services, Today's Operations, two alert cards, three charts, activity preview, exclusions | [03](03-dashboard.md) | Finalized (PP-21) |
| PF-05 | User Management: list and 9 profile tabs | [04.1](04-people-management/user-management.md) | Finalized (rulings C1, C3 – C6, C9 applied) |
| PF-06 | Astrologer Management: list and 13 profile tabs | [04.2](04-people-management/astrologer-management.md) | Finalized (rulings C1 – C6 applied) |
| PF-07 | Assistant Management: types, access, permissions, financial restrictions, audit, invitation, permanent email non-reuse, removal | [04.3](04-people-management/assistant-management.md) | Finalized (ruling C8) |
| PF-08 | Service Management overview and common rules | [05.0](05-service-management/service-overview.md) | Finalized (rulings C3, C4) |
| PF-09 | Text-Based Question Management (approved workflow) | [05.1](05-service-management/text-based-question-management.md) | Finalized (ruling C3; PP-05, PP-06) |
| PF-10 | Appointment Management (approved statuses and rescheduling) | [05.2](05-service-management/appointment-management.md) | Finalized (ruling C4) |
| PF-11 | Instant Call Management (prepaid packages) | [05.3](05-service-management/instant-call-management.md) | Finalized (ruling C1; PC-13) |
| PF-12 | Instant Chat Management (prepaid packages; 24-hour rule) | [05.4](05-service-management/instant-chat-management.md) | Finalized (rulings C1, C6; PC-13) |
| PF-13 | Payments & Finance: scope, approved commission rates, Wallet top-up 0%, settlement and withdrawal rules | [06](06-payments-finance.md) | Finalized (ruling C2; PP-09 – PP-12) |
| PF-14 | Dispute & Complaint Management: classification, approved dispute flow, record contents, actions, withdrawal, evidence access, reports | [07](07-dispute-complaint-management.md) | Finalized (ruling C5; PP-02, PP-03) |
| PF-15 | Remedy / Atonement rules | [08](08-remedy-management.md) | Finalized (ruling C7) |
| PF-16 | Content Management | [09](09-content-management.md) | Finalized |
| PF-17 | Ratings & Reviews | [10](10-ratings-reviews.md) | Finalized |
| PF-18 | Availability & Schedule (view-only) | [11](11-availability-schedule.md) | Finalized |
| PF-19 | Recent Activity / History Management | [12](12-recent-activity-history.md) | Finalized (PP-14) |
| PF-20 | Document Management basic scope | [13](13-document-management.md) | Finalized (PP-07, PP-08) |

## 3. Pending Discussion – Not Finalized

| ID | Question | Related | Status |
|----|----------|---------|--------|
| PP-01 | Live Sessions module for Platform Admin (future; excluded from Dashboard) | 03; Astrologer `AD-112` – `AD-119` | Open |
| PP-02 | Exact Admin response / resolution deadlines for disputes and complaints (beyond the approved 3-day Astrologer dispute answer) | 07 | Open |
| PP-03 | Refund approval and full / partial refund resolutions for disputes and complaints | 06, 07; ruling C5 | Open |
| PP-04 | Admin chat-transcript retention and access (including authorized access for investigations and access logging) | 04.1, 04.2, 05.4, 07; ruling C6 | Open |
| PP-05 | Text Question "Category" | 04.1, 05.1; ruling C9 | Open |
| PP-06 | Text Question "Follow-up / Revision" | 04.1, 05.1; ruling C9 | Open |
| PP-07 | Astrologer registration and document requirements (final registration stage) | 02, 04.2, 13 | Open |
| PP-08 | Document verification workflow / required document list | 04.2, 13 | Open |
| PP-09 | Commission rate for Text Questions, Subscriptions, and any other service not covered by `AD-124` | 06; Astrologer `AP-08-02` | Open |
| PP-10 | Settlement eligibility period for Instant Call / Instant Chat | 06; Astrologer `AP-08-03` | Open |
| PP-11 | Definition of Pending Balance | 04.2, 06; Astrologer `AP-08-01` | Open |
| PP-12 | Meaning and content of "User Settlement" | 06 | Open |
| PP-13 | Status and refund / earnings effects of Admin cancellation, Admin session termination, Admin attendance correction, and permanent reconnection failure (Astrologer `AP-06-01`) | 05.0 – 05.4 | Open |
| PP-14 | Retention periods for technical logs | 01, 12 | Open |
| PP-15 | ID formats | 01 | Open |
| PP-16 | Subscription price, duration, renewal, cancellation / refund | 04.1, 04.2; `X-14`, User `P-14-02` – `P-14-05` | Open — On Hold |
| PP-17 | Platform Admin approval screen for selected important astrologer profile changes | 04.2; Astrologer `AD-87`, `AP-04-02`, `PA-04` | Open |
| PP-18 | Platform Admin approval of astrologer deactivation / deletion requests | 04.2; Astrologer `AD-157`, `PA-08` | Open |
| PP-19 | Platform Admin handling of astrologer requests to block a User | Astrologer `AD-161`, `PA-09` | Open |
| PP-20 | Platform Admin support-ticket handling (tickets, platform replies, announcements) | Astrologer `AD-160`, `PA-10` | Open |
| PP-21 | Meaning of "Due today" / "Overdue" for Text Questions given the approved 30-day automatic cancellation and refund | 03, 05.1; `AD-30`, `D-18` | Open |
| PP-22 | Mapping of each service's approved statuses to the overview groupings (Pending, In Progress, Completed, Cancelled, Overdue) | 05.0 | Open |
| PP-23 | Where the Platform Complaint (`AD-42`, `D-27`) sits in Dispute & Complaint Management | 07 | Open |
| PP-24 | Social login providers beyond the Google UI and a generic social-media UI; real OAuth | 02 | Open |

## 4. Conflict register

| ID | Topic | Original Platform prompt | Approved application decision | Ruling / status |
|----|-------|--------------------------|-------------------------------|-----------------|
| PC-01 | Instant Call / Chat billing (C1) | Per-minute rate, billable duration | Prepaid packages, minimum 5 minutes, no per-minute billing (Astrologer `AD-106`; User `D-45`) | **Ruled 2026-11-25:** approved rule used; per-minute billing removed |
| PC-02 | Commission and payouts (C2) | Rates and payout schedule "not finalized" | Call 2%, Chat 2%, Appointment 3% (`AD-124`); ₹500 minimum withdrawal, Bank/UPI, 3 working days, Tuesday/Friday release (`AD-125`, `AD-126`) | **Ruled:** approved rules recorded; Wallet top-up 0%; other rates pending (PP-09) |
| PC-03 | Text Question workflow (C3) | Statuses Submitted / Assigned / In Progress / Answered / Overdue / Cancelled / Refunded; auto-assign and Admin reassign | Approved statuses (`AD-51`, `D-25`); User buys from the selected Astrologer's campaign (`D-05`) | **Ruled:** approved workflow used; assignment removed |
| PC-04 | Appointments (C4) | Booked / Upcoming / In Progress / Rescheduled / Refunded statuses; Admin reschedule and slot blocking | `AD-89` statuses; only the User reschedules, once (`AD-94`, `AD-98`, `D-41`) | **Ruled:** approved rules used; Admin reschedule and slot blocking removed |
| PC-05 | Disputes (C5) | New status set; partial refund; Super Admin refund approval | Text Question disputes only; 3-day Astrologer answer; Admin Review (`AD-41`, `D-19`) | **Ruled:** approved flow preserved; refund rules pending (PP-03) |
| PC-06 | Chat transcripts (C6) | Authorized staff may view transcripts | Messages inaccessible to both parties after 24 hours (`AD-111`, `D-47`) | **Ruled:** no automatic staff access; Admin retention / access pending (PP-04) |
| PC-07 | Remedies (C7) | Detailed Remedy rules | No equivalent rules in the app logs (`D-11`, `D-29`, `AD-22` compatible) | **Ruled:** approved as Platform Admin requirements; app alignment PX-01 |
| PC-08 | Assistants (C8) | Admin / Astrologer Assistants | No assistant concept in the Astrologer App | **Ruled:** approved for Platform Admin; Astrologer App integration PX-02 |
| PC-09 | Category; Follow-up / Revision (C9) | Fields listed | Not defined in either app | **Ruled:** pending (PP-05, PP-06) |
| PC-10 | Governance (C10) | Platform is the single source of truth and overrides apps | Root `CLAUDE.md` §5: each app's review list is the official decision log | **Ruled:** current `CLAUDE.md` followed; inconsistency **Open** for later review (PX-09) |
| PC-11 | Dispute record statuses | Open / Under Investigation / Waiting for… / Resolved / Rejected / Closed / Withdrawn | Dispute flow `AD-41`; Text Question statuses Disputed / Dispute Answered (`AD-51`) | **Open** — mapping required |
| PC-12 | Refund approval | Refund approval is Super Admin-only | Automatic rule-based refunds (`AD-30` / `D-18`, `AD-31` / `D-21`, `AD-94`, `AD-98` / `D-41`) | **Open** — does Super Admin approval apply to automatic refunds? |
| PC-13 | Instant Call / Chat statuses | Requested / Connecting / Active / Completed / Missed / Rejected / Cancelled / Failed / Disconnected | Pending, Busy, Declined, Expired, Cancelled, Active, Completed; technical disconnection (`AD-104`, `AD-105`, `AD-109`) | **Open** — approved states used; mapping required |
| PC-14 | Review moderation scope | Admin may flag / review / hide | `AD-133`: Admin may also publish, remove reviews, hide / remove replies, and notify the Astrologer with a reason | **Preserved:** approved `AD-133` permissions kept |
| PC-15 | Appointment "Service Mode" | Service Mode, if applicable | Voice-only appointments (`AD-88`, `D-40`) | **Preserved:** voice-only used |

## 5. Cross-app alignment dependencies

| ID | Dependency | Affected documents (not changed here) |
|----|------------|---------------------------------------|
| PX-01 | Align Remedy rules (start, duration, daily progress, statuses, reminders, edit / cancel before start, moderation) | User `16_REMEDY_TRACKER.md` (`P-16-01`, `P-16-03`, `P-16-04`, `P-16-06`); Astrologer `17_REMEDY_TRACKER.md`, `05_APPOINTMENTS.md` |
| PX-02 | Add Astrologer Assistant creation, invitation, allowed sections, removal | Astrologer App documentation (new) |
| PX-03 | Common login page, role selection, social login UI; Astrologer login | User `02_AUTHENTICATION_AND_ONBOARDING.md`; Astrologer App (no login spec) |
| PX-04 | User account deletion started directly by the User, no Admin review | User `12_USER_PROFILE_AND_SETTINGS.md` |
| PX-05 | Dispute withdrawal and evidence types (text, photo, PDF, screenshot) | User `06_TEXT_QUESTION_SERVICE.md` (`P-06-16`); Astrologer `02_TEXT_BASED_QUESTIONS.md`, `16_HELP_AND_SUPPORT.md` |
| PX-06 | Technical Complaints channel for Users | User `17_HELP_AND_SUPPORT.md` |
| PX-07 | User profile fields, mandatory birth details, referral and consent fields | User `12_USER_PROFILE_AND_SETTINGS.md`, `13_BIRTH_PROFILES_AND_KUNDLI.md` (`P-13-01`) |
| PX-08 | Wallet statuses and Super Admin–approved wallet adjustments | User `10_WALLET_AND_PAYMENTS.md`; Astrologer `08_WALLET_AND_EARNINGS.md` |
| PX-09 | Record `docs/03-platform-admin/` as the Platform Admin documentation location and resolve governance PC-10 | Root `CLAUDE.md` (§5, §6.1 table), `platform-admin/CLAUDE.md` (§2 scope) — shared files, separate approval |
| PX-10 | Add Platform Admin to the documentation map | `CONTEXT.md` — shared file, separate approval |
| PX-11 | Map Astrologer App Platform Admin dependencies PA-01 – PA-11 to Platform modules | Astrologer `00_ASTROLOGER_APP_REVIEW_LIST.md` §5.2 |
| PX-12 | Live Sessions oversight in Platform Admin | Astrologer `07_LIVE_SESSIONS.md`; PP-01 |

## 6. Review log

| Date | Change | Result |
|------|--------|--------|
| 2026-11-25 | Initial Platform Admin documentation drafted from the owner's finalized requirements; rulings C1 – C10 applied; PP-01 – PP-24, PC-01 – PC-15, PX-01 – PX-12 recorded. | Draft — awaiting review |

## 7. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial review list. |
