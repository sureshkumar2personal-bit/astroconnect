# 20 — My Assistants

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-173 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines My Assistants: inviting team members, roles and permissions, account states, and the read-only profile, task, activity and financial views for each assistant.

## 2. Entry points

- Sidebar **More** list and the phone **All sections** menu. Placement within the main tabs is still open (AP-GL-02 → [00](00_ASTROLOGER_APP_REVIEW_LIST.md)).

## 3. Confirmed decisions

**Owned by this module** (verbatim from the decision register in [`00`](00_ASTROLOGER_APP_REVIEW_LIST.md))

| ID | Decision |
|----|----------|
| AD-173 | **My Assistants:** the astrologer can invite team members (Assistant or Editor) by email, with a name, an email address, an Indian mobile number, a role and permissions. The invitation is valid for 7 days; the account is Pending until the assistant verifies their email, sets a password and accepts, then Active; an unaccepted invitation becomes Expired and can be resent. The astrologer can edit name and mobile, suspend, reactivate, resend, revoke an invitation and remove an assistant; removal is permanent, keeps the record as read-only history and blocks the email from reuse. Permissions are set per module (view, create, edit, manage, delete where applicable) starting from the Assistant or Editor preset and can be customised; changes apply immediately on save. Wallet transfers, withdrawals and Super Admin-only approvals can never be granted, and My Assistants and Settings cannot be delegated. Each assistant's details have three tabs: Profile (with the account actions that apply to the current status), Permissions, and Activity (read-only audit history kept after removal). There are no task or financial-access tabs. *(Added 2026-11-27 at the product owner's request.)* |

## 4. PENDING DISCUSSION

| ID | Question | Status |
|----|----------|--------|
| AP-20-01 | Real access-control definitions, presets and Editor reach | Open |

## 5. Change log

| Date | Change |
|------|--------|
| 2026-11-27 | Initial draft from the product-owner request and the reference design. |
| 2026-11-27 | AD-173 amended: details have three tabs (Profile with account actions, Permissions, Activity). AP-20-02 retired (tasks tab removed). |
