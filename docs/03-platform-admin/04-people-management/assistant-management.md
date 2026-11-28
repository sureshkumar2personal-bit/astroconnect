# 04.3 — Assistant Management

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`../15-platform-review-list.md`](../15-platform-review-list.md) |

---

## 1. Purpose

Defines Admin Assistants and Astrologer Assistants: who creates them, what
they can access, permissions, financial restrictions, audit, list and profile
screens, invitation, permanent email non-reuse, and removal. These
requirements are finalized for Platform Admin (ruling C8). Integration into
the Astrologer App is a dependency — `PX-02`.

## 2. Assistant types

### 2.1 Admin Assistant
- Created **only by Super Admin**.
- May work across **multiple departments**.
- Super Admin may create any number of Admin Assistants.

### 2.2 Astrologer Assistant
- Created by the **Astrologer**.
- One Assistant works for **only one** Astrologer.
- One Astrologer may have any number of Assistants.

## 3. Dashboard and access

There is **no separate Assistant Dashboard.**

| Type | Uses | Sees |
|------|------|------|
| Admin Assistant | Platform Admin Dashboard | Only assigned departments / sections |
| Astrologer Assistant | The assigned Astrologer's existing dashboard | Only explicitly allowed sections |

- An Astrologer Assistant cannot access any other Astrologer's information.
- Access is based on an approved and **verified Email ID**.

## 4. Permissions

Two levels:
1. **Module / Department access.**
2. **Action permissions** within each module: View · Create · Edit · Assign ·
   Approve · Reject · Cancel · Export.

- The creator may change or revoke permissions at any time.
- Changes apply to future access **immediately**.
- Each change logs: who changed · previous permission · new permission ·
  Date / Time.
- The Assistant may view their own permissions; only the creator may change them.

## 5. Wallet and financial security

- An Assistant may have permitted **view** access to financial details.
- An Assistant may create a **Wallet Adjustment Request** only if explicitly allowed.
- An Assistant **cannot approve**: Wallet Adjustments · Wallet Transfers ·
  Payouts · Settlements. **Super Admin alone** approves these.
- An Assistant cannot independently transfer money out of a User Wallet.

## 6. Assistant activity audit

| Assistant | Actions recorded in |
|-----------|--------------------|
| Admin Assistant | Platform Admin → Admin Activity History |
| Astrologer Assistant | The Astrologer's Activity History **and** Platform Admin Activity History |

Each entry shows: Assistant ID / Name · which Astrologer (if applicable) ·
Module · Action · Affected Record · Old / New Values (where relevant) ·
Date / Time. See [Recent Activity / History](../12-recent-activity-history.md).

## 7. All Assistants list

One combined list with an **Assistant Type** filter (Admin Assistant /
Astrologer Assistant).

Columns:
- Assistant Photo (optional)
- Assistant Name
- Assistant ID (mandatory)
- Assistant Type
- Email ID
- Mobile Number
- Department (Admin Assistant; multiple allowed)
- Assigned Astrologer (Astrologer Assistant)
- Assigned Tasks · Pending Tasks · Overdue Tasks · Completed Tasks
- Email Verification Status
- Account Status
- Joined Date
- Actions

Search / filters: Name · Assistant ID · Email · Mobile · Assistant Type ·
Department · Assigned Astrologer · Account Status · Email Verification ·
Task Status.

Pagination and **PDF / Excel export**.

## 8. Individual Assistant profile — tabs

1. Profile
2. Permissions
3. Assigned Tasks
4. Activity
5. Account
6. Wallet & Financial Access

**Profile:** Assistant ID · Photo (optional) · Full Name · Email · Mobile ·
Assistant Type · Department (Admin Assistant) · Assigned Astrologer
(Astrologer Assistant) · Email Verification · Registration Date · Last Login ·
Last Active. The Assistant may edit only permitted profile fields.

**Permissions:** the Assistant can view their permissions; only the creator
can change or revoke them; permission history is kept.

**Assigned Tasks:** Task ID · Task Name · Department / Module · Assigned
Date · Deadline · Priority · Status · Completed Date · Assigned By. The
Assistant sees only tasks they are authorized to access.

**Activity:** Login / Logout · profile changes · permission changes · task
updates · User / Astrologer record actions · financial requests · approvals /
rejections (if permitted) · Date / Time.

**Account:** Active / Suspended / Blocked · Suspend / Block / Unblock /
Reactivate with mandatory Reason · Action Taken By · Date / Time · account
history · Email Verification Status.

**Wallet & Financial Access:** permitted financial details · adjustment
requests · request history · **no approval authority**.

PDF / Excel export for permitted Tasks and Activity.

## 9. Creation and invitation

### 9.1 Admin Assistant (by Super Admin)
Email · Name / Mobile · multiple Departments · Module access · Action
permissions · Email invitation.

### 9.2 Astrologer Assistant (by the Astrologer)
Name / Email / Mobile · one assigned Astrologer · allowed personal work /
sections · Email invitation.

### 9.3 Invitation rules
- Unique invitation link.
- The link expires after **24 hours**; an expired link may be resent.
- Email verification is required.
- The Assistant sets a password on first login.
- Forgot Password uses **Email OTP**.
- Login only after the approved Email ID is verified.

### 9.4 Email reuse — permanent rule
One Assistant account is permanently associated with its registered /
verified Email ID. After the Assistant is removed:
- the Email ID is **never reused**;
- it cannot create another Assistant account;
- it cannot be used to rejoin as a new Assistant;
- any future Assistant account needs a new Email ID.

The removed Assistant ID, account history, tasks, and activity history are preserved.

## 10. Removal

| Type | Removed by |
|------|-----------|
| Admin Assistant | Super Admin |
| Astrologer Assistant | The assigned Astrologer |

After removal: login access is revoked immediately; all historical records
are preserved; the Email ID is permanently unavailable for reuse.

## 11. Cross-app dependency

The Astrologer App documentation has no Assistant feature yet (creating,
inviting, assigning sections, removing Astrologer Assistants). Alignment is
required — `PX-02`. No separate Assistant dashboard may be introduced.

## 12. Acceptance criteria

- [ ] Only Super Admin creates / removes Admin Assistants; only the Astrologer creates / removes their Astrologer Assistants.
- [ ] Assistants see only granted modules and perform only granted actions; changes apply immediately and are logged.
- [ ] Assistants can never approve wallet adjustments, transfers, payouts, or settlements.
- [ ] Invitation links expire after 24 hours; login requires a verified email; Forgot Password uses Email OTP.
- [ ] A removed Assistant's Email ID can never be reused.

## 13. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft from owner-finalized Assistant requirements (ruling C8). Astrologer App integration recorded as PX-02. |
