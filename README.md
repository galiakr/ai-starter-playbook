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

| Folder / file | What it contains |
| -------------- | ----------------- |
| [`ai/`](ai) | AGENTS.md template and Copilot instructions |
| [`skills/`](skills) | Claude skills: a11y audit, GitHub CLI, test review, context sync check |
| [`git/hooks/`](git/hooks) | Husky pre-commit and pre-push hook templates |
| [`git/workflows/`](git/workflows) | GitHub Actions CI and security workflow templates |
| [`git/dependabot.yml`](git/dependabot.yml) | Automated weekly dependency update config |
| [`testing/`](testing) | Testing setup guide (Vitest, RTL, Playwright) |
| [`structure/`](structure) | Recommended project folder structure, naming conventions, and `.env.example` template |
| [`scripts/`](scripts) | One-time bootstrap script to scaffold a new project from this repo |
| [`metrics/`](metrics) | Guide for checking whether the playbook is actually helping, not just present |
| [`LICENSE`](LICENSE) | MIT license for this repo |

---

## File reference

A one-line explanation of every file, grouped by folder.

### `ai/`

- **`AGENTS.md`** — Template for Claude/Cursor project context: what the project is, stack, coding conventions, testing rules, what to avoid, and a "current focus" section to keep updated. Copy to the project root and fill in the placeholders. This is the single most important file in the repo — it's what stops every AI session from starting cold.
- **`copilot-instructions.md`** — Same purpose as `AGENTS.md`, reformatted for GitHub Copilot, which looks for it at `.github/copilot-instructions.md`. Keep the two in sync by hand, or run the `sync-context` skill to check for drift between them.

### `skills/`

Drop these into `.claude/skills/<name>/SKILL.md` (or wherever your Claude Code setup expects them) — `scripts/bootstrap.sh` does this automatically.

- **`skill-a11y.md`** — Runs an automated accessibility audit against a running dev server, with a fallback chain (axe-core → Lighthouse → pa11y), and reports WCAG violations grouped by severity with fix suggestions.
- **`skill-github.md`** — GitHub CLI workflows for issues and PRs, plus a rebase-based (not merge-based) conflict resolution process for keeping history linear.
- **`skill-review-tests.md`** — Reviews test files for quality issues an AI-written test suite tends to have: tautological assertions, wrong expected values, missing edge cases, weak `toBeTruthy` checks.
- **`skill-sync-context.md`** — Reads `AGENTS.md` and `copilot-instructions.md`, extracts the rules each one states, and reports where they've drifted apart (a rule that's only in one file, or stated inconsistently in both).

### `git/hooks/`

- **`README.md`** — Husky + lint-staged setup instructions. Documents three hooks: `pre-commit` (lint-staged on staged files only — fast), `pre-push` (full test suite — slower, catches what commit-time linting can't), and an optional `commit-msg` hook enforcing Conventional Commits.

### `git/workflows/`

- **`ci.yml`** — Runs on every push/PR to `main`: install, lint, type-check, test with coverage, upload the coverage artifact. The gate that can't be bypassed with `--no-verify`.
- **`security.yml`** — Two jobs: secret scanning with gitleaks (catches committed credentials the "never commit secrets" rule only used to say, not check) and `npm audit` for known vulnerabilities. Runs on push/PR and weekly, so newly disclosed CVEs in existing dependencies get caught even without a code change.

### `git/`

- **`dependabot.yml`** — Weekly automated PRs for outdated npm packages (grouped by dev vs. production dependencies) and GitHub Actions versions, so patching isn't something you have to remember to do manually.

### `testing/`

- **`setup.md`** — Full setup for Vitest + React Testing Library + Playwright + MSW: install commands, `vitest.config.ts`, coverage thresholds, file conventions, and side-by-side examples of a specific/readable test versus a vague one.

### `structure/`

- **`project-template.md`** — Standard folder layout and naming conventions (components, hooks, utils, types) for React + TypeScript projects, plus a table of required files every project should have.
- **`.env.example`** — Template for documenting every environment variable a project uses, with placeholder values only. Copy to the project root as `.env.example`; real values go in a local, gitignored `.env`.

### `scripts/`

- **`bootstrap.sh`** — Copies `AGENTS.md`, Copilot instructions, CI/security workflows, `dependabot.yml`, `LICENSE`, `.env.example`, and all skills into a new project in a single pass. A one-time scaffold, not an installed dependency — the destination project owns the files afterward and can edit them freely.

### `metrics/`

- **`playbook-health.md`** — A quarterly checklist for whether the playbook is actually working, not just adopted: `--no-verify` usage over time, CI flakiness vs. real catches, coverage trend (not just pass/fail), a11y violation trend, and a before/after comparison template.

### Root

- **`LICENSE`** — MIT.
- **`.gitignore`** — Standard ignores for this repo itself.
- **`README.md`** — This file.

---

## How to use it

There is no install step and no required tooling. Browse the folder that's relevant to what you're setting up, copy the files you need, and adapt them to your project.

For a full new project, `scripts/bootstrap.sh /path/to/new-project` copies everything in one pass — AI context files, CI/security workflows, dependabot config, license, env template, and skills — then prints the remaining manual steps (installing Husky, filling in placeholders, running the testing setup guide).

For AI skills specifically: drop the `.md` files from `skills/` into your project's `.claude/skills/` folder (one subfolder per skill, each containing a `SKILL.md`). Claude picks them up automatically in Claude Code.

The `AGENTS.md` template is the most important file. Copy it into every new project, fill in the top section, and update it as the project grows. It is the single biggest thing you can do to improve AI-assisted development on a project.

---

## My AI-assisted development philosophy

**Give AI context, not just code.** The most important thing you can do is write a good `AGENTS.md`: a file that tells the AI what the project is, how it's structured, and what the rules are. Without it, every session starts cold.

**Automate the boring gates.** Pre-commit lint, pre-push tests, CI on every PR, secret scanning, dependency updates. These aren't optional when AI is writing code, they're more important, not less. AI can introduce subtle bugs confidently. Your hooks catch them before they land.

**Accessibility is not an afterthought.** AI-generated UI tends to skip ARIA labels, landmark regions, and focus management. The a11y skill runs an automated audit and surfaces exactly those gaps.

**Test quality matters more than test quantity.** AI writes tests that pass without proving anything. Tautologies, wrong expected values, assertions that can never fail. The review-tests skill catches these before they get committed.

**Standards you don't understand are worth writing down.** If a convention is in this playbook and you're not sure why, that's a prompt to find out. The goal is to understand your own standards, not just follow them.

**Claims about "this helps" need checking, not just stating.** It's easy to write a rule and assume it works. `metrics/playbook-health.md` exists so the playbook's effectiveness is something I actually look at, not just something I assert.

---

## Contributing

If you find something useful, adapt it freely. If you spot an error or have a suggestion, open an issue.
