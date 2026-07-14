# ai-starter-playbook

A personal set of standards, skills, and templates for building AI-ready projects, from git hooks to accessibility audits to Claude skills.

---

## What this is

This is my opinionated approach to starting and maintaining projects that work well with AI coding assistants (Claude, GitHub Copilot, Cursor) while staying high-quality, accessible, and maintainable.

It is also a learning document. Some of the standards here are things I already knew well. Others I added because I wanted to understand them better. Writing them down is how I made them stick. If you're in the same position, that's a feature, not a bug.

It is:

- A reference I'm going to reuse across all my projects
- A starting point for anyone who wants a similar setup
- A living document. It evolves as my tooling and understanding do

It is not a framework or a CLI. It's a set of files you copy, adapt, and own.

---

## What's inside

| Folder / file                              | What it contains                                                                                                                                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`ai/`](ai)                                | AGENTS.md template and Copilot instructions                                                                                                                                                                              |
| [`skills/`](skills)                        | Claude skills: a11y audit, GitHub CLI, test review (with coverage-scope verification), context sync check, language-tokens (i18n/copy centralization), add-logging-step (retrofit the metrics-logging step into a skill) |
| [`git/hooks/`](git/hooks)                  | Husky pre-commit and pre-push hook setup guide                                                                                                                                                                           |
| [`git/workflows/`](git/workflows)          | GitHub Actions CI and security workflow templates                                                                                                                                                                        |
| [`git/dependabot.yml`](git/dependabot.yml) | Automated weekly dependency update config                                                                                                                                                                                |
| [`testing/`](testing)                      | Testing setup guide (Vitest, RTL, Playwright)                                                                                                                                                                            |
| [`structure/`](structure)                  | Recommended project folder structure, naming conventions, and `.env.example` template                                                                                                                                    |
| [`scripts/`](scripts)                      | One-time bootstrap script to scaffold a new project from this repo                                                                                                                                                       |
| [`metrics/`](metrics)                      | **Templates only** — a blank findings log and a quarterly health-check guide. Each project that adopts this playbook fills in its own copy; nothing here is pre-filled with any project's actual results.                |
| [`LICENSE`](LICENSE)                       | MIT license for this repo                                                                                                                                                                                                |

---

## File reference

### `ai/`

- **`AGENTS.md`** — Template for Claude/Cursor project context: what the project is, stack, coding conventions, testing rules, what to avoid, and a "current focus" section to keep updated. Copy to the project root and fill in the placeholders.
- **`copilot-instructions.md`** — Same purpose as `AGENTS.md`, reformatted for GitHub Copilot, which looks for it at `.github/copilot-instructions.md`. Keep the two in sync by hand, or run the `sync-context` skill to check for drift between them.

### `skills/`

Copy each skill's whole folder into `.claude/skills/<name>/` (the `SKILL.md` plus any `assets/` and `references/` it ships) — `scripts/bootstrap.sh` does this automatically. Every skill below ends with a "log the result" step that appends one row to the _project's own_ `metrics/findings-log.md` — see the Metrics section for how that fits together.

- **`a11y/SKILL.md`** — Runs an automated accessibility audit against a running dev server, with a fallback chain (axe-core → Lighthouse → pa11y), and reports WCAG violations grouped by severity with fix suggestions.
- **`github/SKILL.md`** — GitHub CLI workflows for issues and PRs, a rebase-based conflict resolution process, and a triage mode for turning another skill's findings into labeled, assigned issues without creating duplicates of ones that already exist.
- **`review-tests/SKILL.md`** — Runs tests with coverage by default, verifies the coverage report is actually measuring the full source tree before trusting its percentage, and reviews test files for quality issues an AI-written test suite tends to have: tautological assertions, wrong expected values, missing edge cases, weak `toBeTruthy` checks.
- **`sync-context/SKILL.md`** — Reads `AGENTS.md` and `copilot-instructions.md`, extracts the rules each one states, and reports where they've drifted apart (a rule that's only in one file, or stated inconsistently in both).
- **`language-tokens/SKILL.md`** — Centralizes all user-facing text into a single CSV a non-coder can edit, plus a generator script that produces per-language JSON for the app to consume. Adapts to an existing i18n setup instead of replacing it, migrates strings incrementally rather than all at once, and refuses to invent translations it isn't confident about.
- **`add-logging-step/SKILL.md`** — Retrofits the "log the result" step into a skill that doesn't have one yet, so every skill run appends a row to `metrics/findings-log.md`. Scans for skills missing the step, skips ones that already have it, and picks the outcome vocabulary (`Clean`, `Found → Fixed`, `Action taken`, …) that fits each skill's nature. This is the skill that keeps the "every skill logs its results" invariant true as you add new skills.

### `git/hooks/`

- **`README.md`** — Husky + lint-staged setup instructions. Documents three hooks: `pre-commit` (lint-staged on staged files only is fast), `pre-push` (full test suite is slower, catches what commit-time linting can't), and an optional `commit-msg` hook enforcing conventional Commits.

### `git/workflows/`

- **`ci.yml`** — Runs on every push/PR to `main`: install, lint, type-check, test with coverage, upload the coverage artifact. The gate that can't be bypassed with `--no-verify`.
- **`security.yml`** — Two jobs: secret scanning with gitleaks and `npm audit` for known vulnerabilities. Runs on push/PR and weekly, so newly disclosed CVEs in existing dependencies get caught even without a code change.

### `git/`

- **`dependabot.yml`** — Weekly automated PRs for outdated npm packages (grouped by dev vs. production dependencies) and GitHub Actions versions, so patching isn't something you have to remember to do manually.

### `testing/`

- **`setup.md`** — Full setup for Vitest + React Testing Library + Playwright + MSW: install commands, `vitest.config.ts`, coverage thresholds, file conventions, and side-by-side examples of a specific/readable test versus a vague one.

### `structure/`

- **`project-template.md`** — Standard folder layout and naming conventions (components, hooks, utils, types) for React + TypeScript projects, plus a table of required files every project should have.
- **`.env.example`** — Template for documenting every environment variable a project uses, with placeholder values only. Copy to the project root as `.env.example`; real values go in a local, gitignored `.env`.

### `scripts/`

- **`bootstrap.sh`** — Copies `AGENTS.md`, Copilot instructions, CI/security workflows, `dependabot.yml`, `LICENSE`, `.env.example`, all skills, and a blank `metrics/` folder into a new project in a single pass. A one-time scaffold, not an installed dependency. The destination project owns the files afterward and can edit them freely.

### `metrics/`

- **`findings-log.md`** — A blank template. Once copied into a real project, every skill run appends a row here: date, skill, outcome, and a one-sentence detail.
- **`playbook-health.md`** — A quarterly checklist that reads from that project's `findings-log.md` rather than starting from scratch: which skills are earning their place, whether `--no-verify` usage is rising, whether CI failures are real catches or flaky noise, whether coverage is trending (not just passing), and a before/after comparison template.

### Root

- **`LICENSE`** — MIT.
- **`.gitignore`** — Standard ignores for this repo itself.
- **`README.md`** — This file.

---

## How the metrics system works

This part is easy to set up wrong, so it's worth being explicit: **`metrics/` in this repo is a template, not a record.** Nothing in `ai-starter-playbook` itself is ever filled in with real project data.

Here's the actual flow:

1. `scripts/bootstrap.sh` copies a _blank_ `metrics/findings-log.md` and `metrics/playbook-health.md` into a new project, the same way it copies a blank `AGENTS.md`.
2. From then on, that project's copy is local and self-contained. Every time you run `a11y`, `review-tests`, `github`, or any other skill in that project, the skill's last step appends one row to _that project's_ `findings-log.md`.
3. Over time, each project accumulates its own history: what each skill has actually found, not just what it's supposed to catch in theory.
4. Quarterly (or whenever you're checking in on a project), `playbook-health.md` reads that project's own log to answer questions like "is this skill actually finding anything" and "is `--no-verify` usage creeping up".
5. If you want a cross-project view, comparing findings across every project that's adopted the playbook, that's a manual step you do yourself during a health check, copying interesting rows out of each project's local log. Nothing automates that rollup, because a Claude Code session working inside one project's repo can't see the others.
6. **If you use a skill that isn't in this repo** (a built-in Claude Code skill, or a third-party one), it won't have a "log the result" step, since there's no `SKILL.md` here to add one to. You'd add that row to the findings log by hand or use the `add-logging-step` skill.

The reason this exists at all: a rule or a check is easy to write down and easy to assume is helping. This system is a memory of what a check actually caught, run by run, project by project.

---

## How to use it

There is no install step and no required tooling. Browse the folder that's relevant to what you're setting up, copy the files you need, and adapt them to your project.

For a full new project, `scripts/bootstrap.sh /path/to/new-project` copies everything in one pass. AI context files, CI/security workflows, dependabot config, license, env template, skills, and a blank `metrics/` folder and then prints the remaining manual steps (installing Husky, filling in placeholders, running the testing setup guide).

For AI skills specifically: copy the whole skill folder from `skills/` into your project's `.claude/skills/` folder — one folder per skill, each with its `SKILL.md` plus any `assets/` and `references/` it needs (language-tokens, for example, ships its `generate.py`). Each skill logs its own results to the project's `metrics/findings-log.md` as its final step.

---

## My AI-assisted development philosophy

**Give AI context, not just code.** The most important thing you can do is write a good `AGENTS.md`: a file that tells the AI what the project is, how it's structured, and what the rules are. Without it, every session starts cold.

**Automate the boring gates.** Pre-commit lint, pre-push tests, CI on every PR, secret scanning, dependency updates. These aren't optional when AI is writing code, they're more important, not less. AI can introduce subtle bugs confidently. Your hooks catch them before they land.

**Accessibility is not an afterthought.** AI-generated UI tends to skip ARIA labels, landmark regions, and focus management. The a11y skill runs an automated audit and surfaces exactly those gaps.

**Test quality matters more than test quantity.** AI writes tests that pass without proving anything. Tautologies, wrong expected values, assertions that can never fail. The review-tests skill catches these and also checks that the coverage number backing them up is measuring the whole project, not just the one file a test happened to import.

**Standards you don't understand are worth writing down.** If a convention is in this playbook and you're not sure why, that's a prompt to find out. The goal is to understand your own standards.

**Claims about "this helps" need checking, not just stating.** It's easy to write a rule and assume it works. `metrics/findings-log.md` and `playbook-health.md` exist so each project's history of what these checks actually caught is something I can look at, not just something I assert.

---

## Contributing

If you find something useful, adapt it freely. If you spot an error or have a suggestion, open an issue.
