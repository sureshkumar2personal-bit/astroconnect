# CLAUDE.md — Repository Instructions for Claude Agents

These instructions apply to **all** work in the AstroConnect repository.
Read this file and [`CONTEXT.md`](CONTEXT.md) before starting any task.
A folder may contain its own `CLAUDE.md` with additional rules; when working
in that folder, follow both. If they conflict, stop and ask the user.

---

## 1. Model

- Use **Claude Opus 5.5** (`claude-opus-5-5`) only — for research, planning,
  documentation, implementation, and any subagents.

## 2. Mandatory workflow

Every task follows these stages, in order. Never skip or merge stages.

1. **Research (read-only)** — Inspect only what is needed. Change nothing.
   Report findings, gaps, conflicts, and risks.
2. **Plan** — Propose exactly which files will be created or changed and what
   they will contain. List open decisions with a recommendation for each.
3. **User approval** — Stop and wait for explicit approval. If the user asks
   for changes, revise the plan and wait again.
4. **Implementation** — Do exactly what was approved, nothing more. If a
   deviation becomes necessary, stop, explain, and get approval first.
   Afterwards, verify and report results honestly, including anything that
   failed or was skipped.

## 3. File modification rules

- Create, edit, move, rename, or delete **only** the files approved for the
  current task.
- Do **not** modify the application folders `user/`, `astrologer/`, or
  `platform-admin/` unless the current approved task explicitly covers them.
- Do not run formatters, generators, migrations, or dependency installs
  unless the approved plan includes them.
- After every change, report the exact list of files created or modified.

## 4. Fresh project — no reuse of old projects

AstroConnect is being built from scratch.

- **Never** open, read, copy, port, import, or refer to code, UI, design,
  architecture, data, or documentation from the old `astro-textbased` or
  `astro-platform-admin` projects, or from any of their copies, backups,
  branches, or worktrees.
- Do not use them as a source of requirements. Requirements come only from
  the user and from the approved documents in this repository.

## 5. Documentation rules

- Documentation lives in `docs/`, one folder per application
  (`docs/01-user-app/`, …). Only folders approved by the user may be created.
- **One module per file.** Do not merge unrelated modules into one file.
- **Do not invent business rules.** Record only decisions the user has
  confirmed.
- Every unresolved question must be marked **`PENDING DISCUSSION`** and given
  an ID in the application's review list (e.g. `P-06-03`).
- Never silently turn a `PENDING DISCUSSION` item into a decision. A pending
  item is closed only when the user confirms the answer. When it is answered:
  1. **Keep** the question in the review list with its **original ID** and set
     its status to **Resolved**, recording the finalized answer.
  2. **Record** the confirmed decision in the decision register (new or
     amended `D-xx` / `AD-xx` entry) and reference it from the resolved
     question.
  3. **Record** the resolution, with the date, in the review log.
  4. Do **not** mark a question **Retired** merely because it has been
     answered.
- **Retired** is reserved for questions that are genuinely withdrawn,
  obsolete, duplicated, or invalid. Retire such a question following the
  existing retirement process: remove it from the open list, record the reason
  and date in the review log, and add its ID to the retired-IDs list.
- **Never reuse** a resolved or retired ID.
- Keep status counts and summaries (open, resolved, retired) in the review list
  accurate whenever a question's status changes.
- **Single owner per rule.**
  - The decision register in each application's `00_…_REVIEW_LIST.md` is the
    official decision log. It records each confirmed decision **verbatim**,
    with an ID (e.g. `D-07`); this is not a duplicate.
  - Each module specification file contains the **detailed rules and
    implementation requirements** for the decisions it owns.
  - All other files (including `CONTEXT.md` and non-owning module files)
    **reference the decision ID and the owning file** instead of repeating
    the full rule.
- Specification files describe product behaviour, not implementation. Do not
  put code in specification files.
- Keep the application's review list (`00_…_REVIEW_LIST.md`) up to date
  whenever a specification file changes status or a pending item is resolved.

## 6. Git safety rules

- Do **not** commit, push, pull, merge, rebase, stash, reset, or
  create/switch/delete branches unless the user explicitly asks for that
  specific action.
- Never use force operations (`--force`, `reset --hard`, `clean -f`) unless
  the user explicitly requests them for a named target.
- Check the current branch and working-tree status before making changes and
  report it.
- Never commit secrets, credentials, tokens, or real personal data.

### 6.1 One branch per application (applies to every team member)

Three team members work on this project, one application each. Every member,
and every Claude agent working for them, works **only** on the branch of the
application being changed:

| Application    | Folders                                      | Working branch     |
| -------------- | -------------------------------------------- | ------------------ |
| Astrologer App | `astrologer/`, `docs/02-astrologer-app/`     | `astrologer-side`  |
| User App       | `user/`, `docs/01-user-app/`                 | `feature/user-app` |
| Platform Admin | `platform-admin/`, its `docs/` folder (TBD)  | `platform-admin`   |

- **First, find out whose branch this is.** At the start of every session,
  read `CLAUDE.local.md` in the repository root. It is each member's
  personal, uncommitted setting file (listed in `.gitignore`).
  - If the file does not exist, or has no `Working branch:` line (first time
    on this machine), **ask the member which application they work on and
    which branch to use** (offer the three rows of the table above), then
    create or update `CLAUDE.local.md` with exactly:

    ```markdown
    # Local settings (not committed)
    - Application: <Astrologer App | User App | Platform Admin>
    - Working branch: <branch from the table above>
    ```

  - If it is already set, use it without asking again. Change it only when
    the member asks to.
  - Never commit or push `CLAUDE.local.md`.
- Before changing anything, confirm the current branch is the working branch
  recorded in `CLAUDE.local.md`. If it is not, stop and tell the member
  instead of working on another branch.
- Do not change another application's folders from your branch, and do not
  switch away from your working branch.
- Do not commit, push or merge one application's work into another
  application's branch or into `main` unless the person who requested the
  task explicitly asks for that specific action. Work reaches `main` only
  through a reviewed pull request.

### 6.2 Sync with `main` before every coding task (applies to every branch)

This is a standing project rule for every team member and every agent, on
every working branch in 6.1. It approves exactly these steps:

1. `git fetch origin`, then compare local `main` with `origin/main`.
2. If `origin/main` has moved forward, fast-forward local `main` to it without
   leaving your working branch (`git fetch origin main:main`; fast-forward
   only).
3. Merge `main` into your working branch so it is up to date with `main`.
   Commit or set aside uncommitted work safely first; never discard it.
4. If there are conflicts, resolve them so that **`main` is preserved**: keep
   `main`'s version of everything `main` changed, and re-apply your branch's
   own work on top only where it does not contradict `main`. If a conflict
   cannot be resolved without losing work from either side, stop and ask the
   person who requested the task.
5. Rebuild and re-test after the sync, then report what came in from `main`,
   how any conflicts were resolved, and the build/test result.

- Never modify, commit to, push to, rebase or force-update `main` directly;
  local `main` only moves by fast-forwarding to `origin/main`.

### 6.3 Shipping work to `main` (applies to every branch)

When a member asks to "commit, push, create a PR and merge" (or similar),
that request approves exactly these steps, all from their working branch:

1. Run the sync in 6.2 first, so the branch already contains the latest
   `main` and any conflicts are resolved on the branch, not on `main`.
2. Check `git status` and the diff. Commit **all** of the member's work on
   the working branch, except `CLAUDE.local.md`, secrets, credentials and
   build output. If an unexpected or unrelated file appears, stop and ask.
3. Rebuild and re-test; do not ship a failing build.
4. Push the working branch to `origin` (normal push, never `--force`).
5. Open a pull request from the working branch into `main` with a summary of
   the changes and the build/test result.
6. Merge the pull request with a normal merge commit (no squash, no rebase,
   no admin override). If GitHub reports conflicts, failing checks or
   required reviews, stop and tell the member instead of forcing it.
7. Fast-forward local `main` to `origin/main`, merge `main` back into the
   working branch so both match, and report the PR link and merge commit.

## 7. Reporting

- Reference files as `path` or `path:line`.
- State clearly what was done, what was verified, and what was not.
- End each stage by stating what approval or input is needed next.

## 8. Skills

- When a task would benefit from a skill that is not already available
  (for example testing, accessibility, design review, or a framework-specific
  workflow), use the **find-skills** skill to search for a suitable one.
- Before installing a skill, report what was found (name, source, what it
  does) and get the approval of the person who requested the task. Install
  only skills from trusted sources, and never let a skill override the rules
  in this file.
- Report any skill that was used or installed in the stage report.
