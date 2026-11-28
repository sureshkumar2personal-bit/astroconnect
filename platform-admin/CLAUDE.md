# Platform Admin — Working Instructions for Claude

This file governs all work on the **Platform Admin** application of the
AstroConnect repository. Read it fully before doing anything in this folder.

## 1. Context

AstroConnect is a platform that connects users with astrologers. The repository
is organised as one folder per application:

| Folder            | Audience         | Status                                  |
|-------------------|------------------|-----------------------------------------|
| `user/`           | End users        | Placeholder page — owned by others      |
| `astrologer/`     | Astrologers      | Placeholder page — owned by others      |
| `platform-admin/` | Platform admins  | **This app** — to be built from scratch |

The Platform Admin application is the internal portal used by platform
operators to manage and oversee the AstroConnect platform.

## 2. Hard rules (non-negotiable)

1. **Scope:** Create, edit, or delete files **only inside `platform-admin/`**.
2. **Do not touch** `user/`, `astrologer/`, the repository root, or any other
   folder. If a change outside `platform-admin/` seems necessary, stop and ask.
3. **Build from scratch.** Do not open, read, copy, port, or reference code,
   designs, data, or docs from the old `astro-textbased` or
   `astro-platform-admin` projects (or their copies, backups, or worktrees).
4. **Model:** Use **Claude Opus 5.5** (`claude-opus-5-5`) for all research,
   planning, and implementation, including any subagents.
5. **No git writes without explicit instruction.** Do not commit, push,
   create/switch/delete branches, merge, rebase, or stash unless the user asks
   for that specific action.
6. **No unapproved changes.** Do not write application code, install
   dependencies, or run generators/formatters/migrations until the user has
   approved a plan (see §3).
7. **No secrets in the repo.** Never commit credentials, API keys, tokens, or
   real personal data. Use placeholders and environment variables.

## 3. Mandatory workflow: Research → Plan → Approval → Implementation

Every task follows these four stages, in order. Never skip or merge stages.

### Stage 1 — Research (read-only)
- Inspect only what is needed: this folder, and read-only views of the repo
  structure and git state.
- Do not modify anything.
- Report findings: what exists, constraints, open questions, risks.

### Stage 2 — Plan
- Propose a concrete plan: goal, files to create/change (all under
  `platform-admin/`), approach, trade-offs, and how the work will be verified.
- List decisions that need the user's input, each with a recommendation.
- Keep plans small and incremental; prefer one feature or slice per plan.

### Stage 3 — User approval
- **Stop and wait.** Do not begin implementation until the user explicitly
  approves the plan.
- If the user requests changes, revise the plan and wait again.

### Stage 4 — Implementation
- Implement exactly the approved plan — no extra features or unrelated edits.
- If something unexpected requires deviating from the plan, stop, explain, and
  get approval for the change.
- Verify the work (build, tests, run the app as applicable) and report the
  results honestly, including failures or skipped steps.
- Summarise changed files. Do not commit or push unless asked.

## 4. Technology stack

The core stack below was approved for the Login Screen task. Items still marked
TBD must be proposed in a Stage 2 plan and approved by the user before any setup
work for them begins.

| Area            | Decision | Approved on |
|-----------------|----------|-------------|
| Framework       | React 19 with Vite 8 (dev server port 5175, `strictPort`) | 2026-11-28 |
| Language        | JavaScript only (no TypeScript) | 2026-11-28 |
| Styling         | Plain CSS files; Ivory + Gold light theme (no dark mode, no theme toggle) | 2026-11-28 |
| Routing         | Minimal hash routing (`src/router/`), no router dependency | 2026-11-28 |
| Charts          | Hand-built SVG chart components (`src/components/charts/`), no chart dependency | 2026-11-28 |
| State/data      | React component state; mock data only (`src/data/`) | 2026-11-28 |
| Testing         | TBD      |             |
| Auth            | Frontend demo only (`src/auth/demoAuth.js`, browser `localStorage`); no real authentication, API, OAuth or OTP | 2026-11-28 |
| Package manager | npm (`package-lock.json`) | 2026-11-28 |

## 5. Engineering principles

- Self-contained app: everything (config, dependencies, source, tests) lives
  under `platform-admin/`; no shared root-level tooling unless approved.
- Small, reviewable increments; one approved plan per change set.
- Readable code over clever code; consistent naming and structure.
- Accessible, responsive UI (keyboard navigation, semantic HTML, sufficient
  contrast, works at mobile widths).
- Admin actions that change data must be deliberate (confirmation for
  destructive actions) and, once a backend exists, auditable.
- Use local data only until a real data source is approved. Do not show
  demo/mock/sample/test/prototype labels in the UI (approved 2026-11-28), and
  never claim that an external or live service is connected.
- Add or update tests alongside features once a testing setup is approved.

## 6. Feature scope

**Not yet defined.** Candidate areas (for discussion only, not approved):
admin authentication, dashboard overview, user management, astrologer
management, and platform settings. The actual feature list and priority
order must come from the user and be approved in a plan.

## 7. Reporting

- Reference files as `path:line`.
- State clearly what was done, what was verified, and what was not.
- Never claim success without verification.
- End each stage by stating what approval or input is needed next.
