# 04.1 — User Management

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`../15-platform-review-list.md`](../15-platform-review-list.md) |

---

## 1. Purpose and scope

User Management contains:
- **All Users List**
- **Individual User Profile** (9 tabs)
- **User Account Management**

Operational changes to services, refunds, and disputes are made in their
standalone modules; the User Profile shows them view-only.

## 2. All Users List

Columns:
- User Photo
- User Name
- User ID
- Mobile Number
- Email
- Account Type
- Account Status
- Registration Date
- Last Active
- Actions

Search / filters: Name · User ID · Mobile · Email · Account Status · Registration Date.

Also: pagination; **PDF / Excel export** of the currently filtered list.

## 3. User Profile — tabs

Exactly nine tabs, in this order:

1. Profile
2. Wallet
3. Services
4. Following
5. Subscriptions
6. Remedies
7. Disputes
8. Activity
9. Account

## 4. Profile tab

Shows all information the User App collects in the User Profile — nothing
omitted, nothing duplicated:
- User ID
- Profile Photo
- Full Name
- Gender
- DOB
- Mobile
- Email
- Location / Address
- **Mandatory Birth Details:** Birth Date · Birth Time · Birth Place

Account metadata:
- Last Login
- Last Active
- Account Created / Registration Date
- Registration Method
- Account Type: Guest / Registered

Preferences and consent:
- Preferred Language
- Notification Preferences
- Preferred Communication Method
- Terms Accepted Date
- Privacy Policy Accepted Date
- Marketing Notification Consent
- Consent History

Referral:
- Referred By (if applicable)
- Referral Code
- User's own Referral Code (if applicable)

Internal **Admin Notes** may be added (not visible to the User).

**Password and OTP are never visible to Admin.**

Alignment: the User App's profile and birth-profile fields are still partly
open (User `P-12-xx`, `P-13-01`) — `PX-07`.

## 5. Wallet tab

### 5.1 Wallet overview
Shows **Available Balance only**. Total Deposited, Total Spent, and Total
Refunded cards are **not** shown.

### 5.2 Wallet transaction history
One list with:
- Transaction ID
- Date / Time
- Description / Service Type
- Credit
- Debit
- Balance After Transaction
- Payment Method
- Gateway Reference ID
- Related Service ID
- Status
- Failure / Refund Details

Filters: Date / Month · Credit / Debit · Service Type · Status · Search.

### 5.3 Refund history
- Refund Request ID
- Original Transaction ID
- Related Service
- Amount
- Reason
- Status
- Processed Date
- Failure Reason

Refund approval and processing happen in Refund Management / Service
Management, not here. After processing, the refund credit appears
automatically in Wallet Transactions. All User refunds go to the Wallet
(User `D-32`).

### 5.4 Wallet adjustment
- Admin **cannot directly edit** a wallet balance.
- **Wallet Adjustment Request:** created by a Wallet Management Assistant, if
  permitted, with Credit / Debit · Amount · **mandatory Reason** · Supporting Reference.
- **Super Admin** approves or rejects. Rejection requires a reason.
- Approved → balance updated. Rejected → balance unchanged.
- Request and approval history is preserved.
- Super Admin is the highest role; no second Admin approval is required at present.

### 5.5 Monthly wallet statement
Month / Year selection · Opening Balance · Total Credit · Total Debit ·
Closing Balance · full transactions · **PDF / Excel download**.

### 5.6 Wallet withdrawal
Where the User App supports withdrawal:
- Withdrawal shown as a debit, with Withdrawal Request ID, Bank / Payment
  Reference, Date / Time, Status, Failure Reason.
- **Minimum balance rule:** ₹500 must remain in the Wallet; only the amount
  above ₹500 may be withdrawn (User `D-32`). This rule is for the User Wallet
  only; it is not the Astrologer withdrawal rule.

### 5.7 Wallet statuses
**Success · Pending · Failed · Reversed · Refunded.**
Pending and Failed transactions do not change the balance; only confirmed,
completed transactions do.

### 5.8 Wallet audit
Records who viewed transactions, who requested an adjustment, who approved /
rejected, and Date / Time. Approved adjustment records are never edited or
deleted without a new audit entry.

## 6. Services tab

**View only.** Reschedule, cancel, refund, and other operational changes are
made in the standalone management modules.

### 6.1 Overview and common table
Overview counts per service and in total.

One common service-history table:
- Service ID
- Service Type
- Astrologer Name / ID
- Created Date
- Service Date (if applicable)
- User Paid Amount
- Payment Status
- Service Status
- View Details

Filters: Service Type · Date Range · Service Status · Payment Status ·
Astrologer · Service ID.

### 6.2 Text Questions
- Question ID
- User / Astrologer
- Submitted Date / Time
- Question Text
- Attachments (horoscope files, if any — User `D-35`)
- Birth Details Used (only as shared with consent — `D-37`)
- Astrologer Answer and Answer Date / Time
- Deadline (30-day answer deadline — `D-18`)
- Status as shown to the User (New / Received, Pending, Completed — `D-25`)
- Payment Details
- **Category:** Pending Discussion — `PP-05`
- **Follow-up / Revision:** Pending Discussion — `PP-06`

### 6.3 Appointments
- Appointment ID
- Astrologer
- Booking Date / Time
- Appointment Date / Time Slot
- Duration (15 or 30 minutes — `D-40`)
- Type: voice-only (`D-40`; a "service mode" choice does not exist — PC-15)
- Status
- Reschedule History (the User may reschedule once — `D-41`)
- Cancellation Reason
- Refund Amount / Status
- Notifications

Booking rules used: 10-minute slot lock during payment and atomic booking
validation (`D-40`, Astrologer `AD-95`); reschedule and refund rules per
`D-41` / Astrologer `AD-94`, `AD-98`, `AD-99`.

### 6.4 Instant Calls
- Call Session ID
- Astrologer
- Requested / Connected / Ended timestamps
- Duration
- Status / Termination Reason
- **Package purchased** (duration and price) and any **extensions** — prepaid
  packages, minimum 5 minutes; no per-minute billing (User `D-45`,
  Astrologer `AD-106`, `AD-107`; ruling C1)
- User Charged Amount
- Wallet Transaction
- Payment / Refund Details

### 6.5 Instant Chats
- Chat Session ID
- Astrologer
- Requested / Started / Ended timestamps
- Duration
- Status
- Package purchased (duration and price) and extensions (as §6.4)
- User Charged Amount
- Wallet Transaction
- Payment / Refund Details

### 6.6 Attachments
All attachments uploaded by the User and the Astrologer may be viewed by
Admin, with sender and timestamp.

### 6.7 Call audio and chat transcript privacy
- Ordinary access is disabled.
- Chat messages become inaccessible to both parties after 24 hours (`D-47`,
  Astrologer `AD-111`).
- Admin transcript retention and access, including any authorized access
  for a Dispute / Complaint, are **Pending Discussion** — `PP-04`. No staff
  access is granted automatically.
- Call recording is not default. If introduced, both parties must receive
  clear prior notice and give consent.

### 6.8 Service payment separation
User Profile → Services shows: User Paid Amount · Payment Method · Payment
Transaction ID · Payment Date / Time · Payment Status · Refund Amount (if any).

It does **not** show Platform Commission or Astrologer Earnings (these belong
to [Payments & Finance](../06-payments-finance.md)). Records link through the
same Transaction ID. Example: for a ₹390 Text Question, show User Paid
Amount ₹390 only.

## 7. Following tab

Separate from Subscriptions.
- Total Following Count.
- **Current Following list only:** Profile Photo · Name · Astrologer ID ·
  Followed Date / Time · Current Status.
- Unfollowed Astrologers do not appear in the current list.
- Follow / Unfollow history is kept in the background for Admin.
- View only — Admin has no Follow / Unfollow action.
- Clicking an Astrologer name opens the Astrologer Profile.

Follow is free and never subscribes; Subscribe is paid and automatically
follows (User `D-36`).

## 8. Subscriptions tab

Overview: **Active · Expired · Cancelled · Total Purchases.** Failed payments
are not subscriptions; they appear in Payment Details.

Per record: Subscription ID · Astrologer Name / ID / Photo · Plan Name ·
Subscription Amount · Purchase Date / Time · Start Date · Expiry Date ·
Subscription Status · Auto-Renewal Status (if applicable).

Details: Plan Details · Duration · Benefits · Subscriber-only Content Access ·
Daily / Weekly Predictions Access · Renewal / Cancellation Details.

Payment details: Payment Transaction ID · Amount · Method · Payment Date /
Time · Payment Status · Wallet / Gateway Reference · Refund Details.

Lifecycle: Purchase → Successful Payment → Active → Renewal / Cancellation →
Expired. After expiry, subscriber-only access stops. All history is
preserved; old subscriptions are never deleted.

Admin can view but cannot manually change payment or subscription status.
Commission is handled in Payments & Finance.

Subscription price, duration, renewal, and cancellation/refund rules remain
**on hold** (User `P-14-02` – `P-14-05`, cross-app `X-14`) — `PP-16`.
Benefit questions: Silver 1, Gold 3, Platinum 4 (`D-31`); auto-renewal is
optional and off by default (`D-36`).

## 9. Remedies tab

Uses the approved Remedy rules in [Remedy Management](../08-remedy-management.md)
(view-only here except flag / review / hide).

Overview: **Total · Suggested · In Progress · Completed · Overdue · Cancelled.**

Each Remedy: unique Remedy ID · Remedy information · Instructions · Steps ·
Duration · Astrologer details · Related Service ID · Suggested Date / Time ·
User progress · Attachments · Reminder History · Full History.

Daily tracking values: **Completed for Today · Not Done · Unable to Do –
Reason · Missed Update.** Every update records Date / Time; a missed day does
not cancel or reset the Remedy.

## 10. Disputes tab

Shows only this User's own **Service Disputes** and **Technical
Complaints**, from the same underlying records as the standalone
[Dispute & Complaint Management](../07-dispute-complaint-management.md)
module (no duplicates).

- Service Disputes: Text-Based Question answer disputes only; one per Text
  Question; raised within 7 days after the answer; the Astrologer answers
  once within 3 days, otherwise the dispute goes to Admin Review (`D-19`,
  Astrologer `AD-41`).
- Technical Complaints: Appointments, Calls, Chats, Subscriptions, Payments,
  Wallet, Login, technical problems.

Each record shows: Text Question ID (if applicable) · Complaint Date / Time ·
Category · Evidence (Text Description, Photo, PDF, Screenshot) · Responses ·
Deadline · Investigation · Resolution · Timeline.

Statuses, actions, resolutions, withdrawal, evidence access, and reports:
see [Dispute & Complaint Management](../07-dispute-complaint-management.md)
(status mapping to the approved flow is open — PC-11; refund and partial
refund are pending — `PP-03`).

## 11. Activity tab

Timeline with links to related records, including:
- Account Created · Login / Logout · Last Active
- Profile / Birth Details / Photo changes
- Password Reset event (never the password)
- Text Question submitted / answered
- Appointment booked / rescheduled / cancelled
- Call / Chat started / ended
- Wallet top-up · Payment success / failure · Refund · Withdrawal · Adjustment
- Follow / Unfollow
- Subscription purchase / renewal / cancel / expire
- Remedy started / progress / proof / completed
- Dispute / Complaint / Evidence / Additional information / Withdrawal
- Notifications
- Terms / Privacy consent
- App Version / Device info · Login / Device history
- Failed activities

Admin actions are **not** mixed into User Activity; they appear in the
Account tab and global Admin Activity History.

Supports timeline, filters, search, month-wise history, details, and
**PDF / Excel export**. Important account, payment, service, and dispute
audit history is never deleted.

## 12. Account tab

**Status:** Active · Suspended · Blocked.

Admin actions: **Suspend · Block · Unblock · Reactivate.** Each records:
Reason (mandatory, including for Unblock / Reactivate) · Additional Notes ·
Action Taken By · Admin ID / Name · Date / Time · Previous Status · New
Status — in immutable Admin Activity History.

Suspended / Blocked Users cannot log in or use services. Historical
transactions, wallet, and service history are preserved.

### 12.1 Account deletion
- The User may start deletion directly; no Admin review is required.
- After the User confirms, deletion begins. Legally / financially required
  transaction, payment, wallet, refund, and settlement records are preserved
  and de-identified where possible.
- Admin can view deletion status and history.
- Alignment with the User App — `PX-04`.

### 12.2 Privacy and consent
Terms Accepted Date · Privacy Policy Accepted Date · Marketing Consent ·
Consent History · internal Admin Notes. **Password and OTP are never visible.**

## 13. Pending Discussion – Not Finalized

| ID | Item |
|----|------|
| PP-03 | Dispute / complaint refund approval and partial refunds |
| PP-04 | Admin chat-transcript retention and access |
| PP-05 | Text Question "Category" |
| PP-06 | Text Question "Follow-up / Revision" |
| PP-16 | Subscription price, duration, renewal, cancellation / refund (X-14) |

## 14. Acceptance criteria

- [ ] List columns, filters, pagination, and filtered export as §2.
- [ ] Exactly nine profile tabs in order.
- [ ] Wallet shows Available Balance only; adjustments only via Super Admin–approved requests; ₹500 retained on withdrawal.
- [ ] Services tab is view-only and never shows commission or astrologer earnings; Call/Chat shown as prepaid packages.
- [ ] Following shows current follows only; history kept for Admin.
- [ ] Subscriptions exclude failed payments; status cannot be changed by Admin.
- [ ] Remedies, Disputes, Activity, and Account follow §9 – §12.
- [ ] Password and OTP never displayed.

## 15. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft from owner-finalized User Management requirements, with rulings C1, C3, C4, C5, C6, C9 applied (prepaid packages; approved Text Question and Appointment rules; dispute flow; transcript access pending; Category / Follow-up pending). |
