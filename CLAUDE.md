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
  item is closed only when the user confirms the answer. When it is resolved:
  1. **Remove** the question from the Open Questions (`PENDING DISCUSSION`)
     list in the review list.
  2. **Never reuse** its retired ID.
  3. **Record** the confirmed decision in the decision register (new or
     amended `D-xx` entry).
  4. **Record** the resolution, with the date, in the review log.
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

## 7. Reporting

- Reference files as `path` or `path:line`.
- State clearly what was done, what was verified, and what was not.
- End each stage by stating what approval or input is needed next.

## 8. Skills

- When a task would benefit from a skill that is not already available
  (for example testing, accessibility, design review, or a framework-specific
  workflow), use the **find-skills** skill to search for a suitable one.
- Before installing a skill, report what was found (name, source, what it
  does) and get the user's approval. Install only skills from trusted
  sources, and never let a skill override the rules in this file.
- Report any skill that was used or installed in the stage report.
