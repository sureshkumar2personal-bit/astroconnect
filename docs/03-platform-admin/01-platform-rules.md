# 01 — Platform Rules (Master)

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`15-platform-review-list.md`](15-platform-review-list.md) |

---

## 1. Purpose

Central platform-wide rules for Platform Admin, with links to the detailed
module documents. Governance and precedence: see
[`00-platform-governance.md`](00-platform-governance.md).

## 2. Platform role and precedence

- Platform Admin is the central control point for platform operations.
- The product owner's intent is that Platform documentation is the single
  source of truth for platform-wide rules. Under the **current** root
  `CLAUDE.md`, application decision logs remain authoritative for their own
  decisions; Platform documents reference them (PC-10).
- User App and Astrologer App requirements that depend on Platform rules are
  tracked as alignment dependencies (`PX-xx`).

## 3. Unique identifiers

Every record has a unique ID:
- Users, Astrologers, Assistants (Admin Assistant and Astrologer Assistant).
- Services (Text Question, Appointment, Instant Call session, Instant Chat session).
- Transactions (payments, wallet transactions, refunds, withdrawals, settlements, adjustments).
- Remedies.
- Disputes and Technical Complaints.
- Activities (activity-history entries).
- Tasks, Invitations, and Wallet Adjustment Requests.

ID formats are **not finalized** — `PP-15`.

Related records link through IDs (for example, a service, its payment
transaction, its refund, and its dispute share the same Service ID and
Transaction ID references).

## 4. Roles and access

| Role | Summary | Detail |
|------|---------|--------|
| Super Admin | Highest role. Approves financial operations (wallet adjustments, wallet transfers, payouts, settlements). Creates and removes Admin Assistants. Controls commission settings. No second Admin approval is required at present. | [Assistant Management](04-people-management/assistant-management.md), [Payments & Finance](06-payments-finance.md) |
| Admin Assistant | Created only by Super Admin; may work across multiple departments; sees only assigned departments/sections of the Platform Admin Dashboard; acts only within granted module and action permissions. | [Assistant Management](04-people-management/assistant-management.md) |
| Astrologer Assistant | Created by an Astrologer; works for exactly one Astrologer; uses that Astrologer's existing dashboard; sees only explicitly allowed sections; cannot access other Astrologers' information. | [Assistant Management](04-people-management/assistant-management.md) |
| User | Uses the User App. | [User Management](04-people-management/user-management.md) |
| Astrologer | Uses the Astrologer App. | [Astrologer Management](04-people-management/astrologer-management.md) |

**Role-based access:** each screen and action is available only to roles and
assistants that hold the required module access and action permission.

## 5. Assistant restrictions

- Two permission levels: Module / Department access, and Action permissions
  (View, Create, Edit, Assign, Approve, Reject, Cancel, Export).
- Assistants can never approve Wallet Adjustments, Wallet Transfers, Payouts,
  or Settlements, and can never independently transfer money out of a User
  Wallet.
- A removed Assistant's Email ID is permanently unavailable for reuse.
- Full rules: [Assistant Management](04-people-management/assistant-management.md).

## 6. Financial approval restrictions

- Admin cannot directly edit any wallet balance; changes happen only through
  an approved Wallet Adjustment Request (Super Admin approval).
- Super Admin alone approves Wallet Adjustments, Wallet Transfers, Payouts,
  and Settlements.
- Refund approval: the rule "refund approval is Super Admin-only" is recorded
  in [Payments & Finance](06-payments-finance.md); its relation to automatic,
  rule-based refunds already approved in the applications is open — **PC-12**.
  Refund approval and partial refunds for disputes/complaints are pending —
  **PP-03**.

## 7. Account status rules (Users, Astrologers, Assistants)

- Statuses: **Active**, **Suspended**, **Blocked**.
- Admin actions: Suspend, Block, Unblock, Reactivate — each requires a
  mandatory Reason and records the acting Admin (ID/Name), Date/Time,
  Previous Status, and New Status in immutable Admin Activity History.
- Suspended or Blocked accounts cannot log in or use services.
- Historical transactions, wallet, earnings, settlements, services, and
  disputes are preserved.
- Password and OTP are never visible to any Admin.

## 8. Historical record preservation and audit

- Important account, payment, service, and dispute audit history is never
  deleted.
- Approved financial adjustment records are never edited or deleted without a
  new audit entry.
- Every Admin and Assistant action is recorded in the appropriate Activity
  History ([Recent Activity / History](12-recent-activity-history.md)).
- Retention periods for technical logs are not finalized — `PP-14`.

## 9. Privacy and sensitive data

- Password and OTP are never visible.
- Call audio: no routine access. Call recording is not default; if introduced,
  both parties must receive clear prior notice and give consent.
- Chat messages: under the approved application rule, chat messages are
  accessible to User and Astrologer for 24 hours only and then become
  inaccessible to both (Astrologer `AD-111`, User `D-47`). Admin transcript
  retention and access are **not finalized** — `PP-04`. No staff member is
  granted transcript access automatically.
- Evidence and attachment access is limited to permitted staff and logged
  (who viewed, what, when).
- Birth details are shared with an Astrologer only with the User's consent for
  the relevant paid service (User `D-37`).

## 10. Service Management finance separation

- Service screens show the **User Paid Amount** and **Payment Status**, never
  Platform Commission or Astrologer Earnings.
- Commission and Astrologer Earnings belong to
  [Payments & Finance](06-payments-finance.md).
- Refund processing belongs to Refund Management (within Payments & Finance).
- Dispute investigation belongs to
  [Dispute & Complaint Management](07-dispute-complaint-management.md).

## 11. Dispute classification

- **Service Disputes:** only Text-Based Question answer disputes; one per Text
  Question (Astrologer `AD-41`, User `D-19`).
- **Technical Complaints:** issues with Appointments, Calls, Chats,
  Subscriptions, Payments, Wallet, Login, and technical problems.
- Details: [Dispute & Complaint Management](07-dispute-complaint-management.md).

## 12. Remedy rules (summary)

Remedy duration starts only when the User clicks **Start Remedy**; Astrologers
may edit or cancel only before the User starts; Admin is view-only except
flag / review / hide. Full rules:
[Remedy Management](08-remedy-management.md).

## 13. Cross-application consistency

- Where a rule is finalized in an application decision log, Platform documents
  reference that decision instead of restating a different rule.
- Approved application rules used by Platform Admin include: prepaid Instant
  Call/Chat packages (`AD-106`), commission rates (`AD-124`), astrologer
  withdrawal and settlement release (`AD-125`, `AD-126`), Text Question
  workflow and statuses (`AD-51`, `D-25`), appointment statuses and
  rescheduling (`AD-89`, `AD-94`, `AD-98`), dispute flow (`AD-41`, `D-19`),
  24-hour chat history (`AD-111`, `D-47`), User Wallet ₹500 retained balance
  (`D-32`).
- Alignment work required in the application documents is listed as `PX-xx`
  in the review list.

## 14. Documentation change governance

See [`00-platform-governance.md`](00-platform-governance.md).

## 15. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft from owner-finalized Platform requirements and the owner's conflict rulings C1–C10 of 2026-11-25. |
