# 00 — Platform Admin Documentation Governance

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`15-platform-review-list.md`](15-platform-review-list.md) |
| Index | [`14-platform-admin-index.md`](14-platform-admin-index.md) |

---

## 1. Purpose

Explains who owns Platform Admin documentation, how approved corrections are
applied, how change history is kept, how documents are reviewed, and how
documentation relates to implementation.

## 2. Documentation ownership

- Platform Admin documentation lives in `docs/03-platform-admin/`.
- The product owner intends Platform Admin to be the central control and
  documentation authority for platform-wide business rules (User App,
  Astrologer App, Admin Assistant, Astrologer Assistant, Platform Admin,
  Service Management, Payments & Finance, Disputes & Complaints, Remedies /
  Atonement, Content Management, Ratings & Reviews, Availability & Schedule,
  and platform-wide account and operational rules).
- **Current governance (binding today):** the repository's root
  [`CLAUDE.md`](../../CLAUDE.md) §5 makes each application's review list
  (`00_…_REVIEW_LIST.md`) the official decision log for that application.
  Platform Admin documentation therefore **does not automatically override**
  User App or Astrologer App decisions. Where a Platform Admin requirement
  touches a rule already finalized in an application decision log, this
  documentation uses the application's approved decision and references it by
  ID (for example `AD-124`, `D-32`).
- The difference between the intended "single source of truth" role and the
  current `CLAUDE.md` hierarchy is recorded as conflict **PC-10** in the
  [review list](15-platform-review-list.md). Changing the hierarchy requires a
  separate, approved change to the shared `CLAUDE.md` files.
- **Single owner per rule.** When a rule applies to several applications, one
  authoritative statement is kept and dependent documents reference it. No
  conflicting duplicates are created. Where a dependent document must contain
  a copy, it must stay aligned with its source.

## 3. Applying an approved correction

When an approved correction is received:

1. Update the authoritative module file (Platform Admin file, or the
   application decision log that owns the rule — see §2).
2. Identify affected User App, Astrologer App, Assistant, and Platform Admin
   files.
3. Update dependent documentation or references (each as a separately
   approved task when it belongs to another application branch — root
   `CLAUDE.md` §6.1, §6.4).
4. Add a Change History entry in every changed file.
5. Record the affected modules.
6. Check for conflicts with existing approved decisions; record any conflict
   in the [review list](15-platform-review-list.md) instead of choosing a side.
7. Update the [index](14-platform-admin-index.md) if necessary.

## 4. Change history

Every Platform Admin document includes:
- **Version**
- **Last Updated**
- **Change History** (table of version, date, change)

Actual approval dates and approver names are recorded only when they are
provided; they are never invented.

## 5. Review process

- Documentation changes are reviewed by the product owner before merge.
- Nothing is committed or pushed automatically. Commits, pushes, pull requests,
  and merges follow root `CLAUDE.md` §6 and require explicit approval.
- Shared files (`CLAUDE.md`, `CONTEXT.md`) are changed only under root
  `CLAUDE.md` §6.4.

## 6. Pending and conflict handling

- Requirements that are not finalized are marked **Pending Discussion – Not
  Finalized** and carry a `PP-xx` ID.
- Differences with already approved application decisions carry a `PC-xx` ID.
- Work that the User App or Astrologer App documentation must do to align
  carries a `PX-xx` ID.
- All are listed in [`15-platform-review-list.md`](15-platform-review-list.md).
- No missing requirement is invented.

## 7. Implementation separation

Editing a Markdown requirement does not change application source code.
Application implementation is a separate, approved task.

## 8. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft. Governance aligned with current root `CLAUDE.md` (product-owner ruling C10); single-source-of-truth intent recorded as PC-10. |
