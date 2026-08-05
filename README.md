# ai-starter-playbook

A personal set of standards, skills, and templates for building AI-ready projects, from git hooks to accessibility audits to Claude skills.

## What this is

My opinionated take on starting and maintaining projects that work well with AI coding assistants (Claude, GitHub Copilot, Cursor) without giving up quality, accessibility, or maintainability.

It's also a learning document. Some of what's here I already knew well; other parts I added because I wanted to understand them, and writing it down is how it stuck. If works for you too, that's the point.

It's a reference I reuse across my own projects, a starting point if you want something similar, and a living document that changes as my tooling and understanding do. It's not a framework or a CLI. Just files you copy, adapt, and then own.

## What's inside

- **`ai/`**: an `AGENTS.md` template plus GitHub Copilot instructions, so an AI assistant has real context instead of starting cold.
- **`skills/`**: Claude skills for a11y audits, GitHub CLI workflows, test review, context-drift checks, i18n string centralization, security review, and the two "meta" skills (`add-logging-step`, `project-memory`) that keep the others honest over time.
- **`git/hooks/`**: Husky pre-commit/pre-push setup.
- **`git/workflows/`**: CI and security GitHub Actions.
- **`git/dependabot.yml`**: weekly dependency updates, on autopilot.
- **`git/pull_request_template.md`**: a PR description template with a checklist so reviews start with context instead of a blank box.
- **`git/ISSUE_TEMPLATE/`**: a bug report template (repro steps, environment, logs) and a feature request template (problem, proposed solution, alternatives considered), so triage starts with the details you need instead of a one-line "it's broken" or "can we add X."
- **`testing/`**: Vitest + RTL + Playwright setup guide.
- **`structure/`**: recommended folder layout, naming conventions, and an `.env.example`.
- **`scripts/`**: a one-time bootstrap script that scaffolds all of the above into a new project.
- **`metrics/`**: _templates only_. A blank findings log and a quarterly health-check guide. Nothing in this repo is pre-filled with real project data — each project that adopts the playbook fills in its own copy.
- **`LICENSE`**: MIT.

## Digging into each folder

### `ai/`

`AGENTS.md` is the template for giving Claude/Cursor project context: what the project is, the stack, coding conventions, testing rules, what to avoid, and a "current focus" section you're meant to keep updated. Copy it to the project root and fill in the blanks. `copilot-instructions.md` says the same things, reformatted for where Copilot looks (`.github/copilot-instructions.md`). Keep the two in sync by hand, or let the `sync-context` skill check for drift between them.

### `skills/`

Each one lives in its own folder, copy the whole thing into `.claude/skills/<name>/` (the `SKILL.md` plus any `assets/` or `references/` it ships). `scripts/bootstrap.sh` does this for you. Every _project-check_ skill ends with a "log the result" step that appends a row to the project's own `metrics/findings-log.md` (more on that below). `add-logging-step` is the one exception. It's an authoring skill that edits other skills, not a check that runs against a project, so it doesn't log to itself.

- **`a11y`**: runs an accessibility audit against a running dev server (axe-core, falling back to Lighthouse, then pa11y), and reports WCAG violations by severity with fix suggestions.
- **`github`**: GitHub CLI workflows for issues and PRs, a rebase-based conflict resolution process, and a triage mode that turns another skill's findings into labeled, assigned issues without duplicating ones that already exist.
- **`review-tests`**: runs tests with coverage, checks that the coverage report is actually measuring the full source tree before trusting the percentage, and reviews test files for the usual AI-written-test problems: tautological assertions, wrong expected values, missing edge cases, weak `toBeTruthy` checks.
- **`sync-context`**: reads `AGENTS.md` and `copilot-instructions.md`, pulls out the rules each one states, and reports where they've drifted (a rule only in one file, or stated inconsistently in both).
- **`language-tokens`**: centralizes user-facing text into one CSV a non-coder can edit, with a generator script that produces per-language JSON. Adapts to an existing i18n setup rather than replacing it, migrates strings incrementally, and won't invent a translation it's not confident about.
- **`add-logging-step`**: retrofits the "log the result" step into skills that don't have one yet, scanning for the gap, skipping skills that already log, and picking outcome vocabulary (`Clean`, `Found → Fixed`, `Action taken`, etc.) that fits each skill. This is what keeps "every project-check skill logs its results" true as new skills get added.
- **`project-memory`**: checks `AGENTS.md`'s "known issues / current focus" checklist against what's actually true in the repo, instead of trusting the checkboxes (the case that prompted this: a checklist that still said "deploy to Vercel" long after the project had shipped to GitHub Pages). It also archives, never deletes, resolved rows out of `findings-log.md` once their linked issues close, so the log stays readable as it grows.
- **`security-review`**: a judgment-level review scoped to what CI's gitleaks/`npm audit` gate doesn't catch: unsafe rendering/injection patterns, auth checks that only exist client-side (plus IDOR and CSRF gaps), missing security headers, and secrets that predate gitleaks adoption sitting in git history. Where a real tool exists, it uses it instead of hand-rolled grep and does only the triage layer on top — `semgrep` for injection patterns, `npm audit --json` for dependency CVEs, `gitleaks detect` against full history for secrets — judging what's actually reachable or a live credential rather than re-deriving findings from scratch. Falls back to a narrower grep, explicitly labeled as degraded, only if the relevant tool isn't installed. It's upfront about its own limits: a heuristic review, not a substitute for a professional audit on anything touching payments or regulated data.
- **`audit-skills`**: security review of `SKILL.md` files themselves, not the project they run against — dangerous command patterns, prompt-injection-style phrasing aimed at the agent, description-vs-behavior mismatches, and scope violations, plus a provenance hash for skills adopted from outside this repo so a later silent edit gets flagged. Never auto-fixes; every finding goes back to a human. The mechanical half of it (the command-pattern and phrasing scans) also runs in CI — see below.

### `git/`

`hooks/README.md` covers Husky + lint-staged: `pre-commit` (lint-staged on staged files, fast), `pre-push` (full test suite, slower, catches what commit-time linting can't), and an optional `commit-msg` hook for conventional commits.

`workflows/ci.yml` runs on every push/PR to `main`. Install, lint, type-check, test with coverage, upload the artifact. It's the gate `--no-verify` can't get around. `workflows/security.yml` runs gitleaks and `npm audit` on push/PR and weekly, so a newly disclosed CVE in an existing dependency gets caught even without a code change (`security-review` picks up where this leaves off). `ci.yml` also carries an `audit-skill-security` job that scans `.claude/skills/*/SKILL.md` for the mechanical half of what `audit-skills` checks — dangerous command patterns and prompt-injection-style phrasing — so a skill with something obviously wrong in it gets flagged on every PR, not just whenever someone remembers to run the skill by hand. (This repo's own `.github/workflows/ci.yml` runs the same job against `skills/*/SKILL.md` directly, since this is where those files actually live. It also runs a `secret-scan` job — gitleaks only, no `npm audit` job since this repo has no `package.json` — because a template repo can still accidentally commit a real secret inside a skill example or a copied file.)

`dependabot.yml` opens weekly PRs for outdated npm packages (grouped dev vs. production) and GitHub Actions versions, so patching isn't something you have to remember.

`pull_request_template.md` is what GitHub pre-fills into the PR description box: what the change does, how it was tested, and a short checklist (tests, docs, no committed secrets, linked issue). Copy it to `.github/pull_request_template.md` in the destination project and GitHub picks it up automatically.

`ISSUE_TEMPLATE/` holds the forms GitHub shows when someone clicks "New issue," with a picker between them since there's more than one: `bug_report.md` (what happened, steps to reproduce, environment, logs) and `feature_request.md` (problem, proposed solution, alternatives considered). Copy the whole folder to `.github/ISSUE_TEMPLATE/` and GitHub wires it in — no config needed.

### `testing/`

`setup.md` is the full Vitest + React Testing Library + Playwright + MSW setup: install commands, `vitest.config.ts`, coverage thresholds, file conventions, and a side-by-side of a specific, readable test versus a vague one.

### `structure/`

`project-template.md` lays out folder structure and naming conventions (components, hooks, utils, types) for React + TypeScript, plus the files every project should have. `.env.example` is a template for documenting every env var a project uses, placeholders only — real values stay in a local, gitignored `.env`.

### `scripts/`

`bootstrap.sh` copies `AGENTS.md`, Copilot instructions, the CI/security workflows, `dependabot.yml`, the PR and issue templates, `LICENSE`, `.env.example`, every skill folder, and a blank `metrics/` folder into a new project in one pass. It's a one-time scaffold, not a dependency. The destination project owns the files afterward and can edit them freely.

### `metrics/`

`findings-log.md` is a blank template. Once it's copied into a real project, every skill run appends a row: date, skill, outcome, one-sentence detail. `project-memory` is what keeps it from growing forever. `playbook-health.md` is a quarterly checklist that reads from that log rather than starting from scratch. Which skills are earning their place, whether `--no-verify` usage is creeping up, whether CI failures are real catches or flaky noise, whether coverage is actually trending and not just passing.

### Root

Everything above this line is a template. Something `bootstrap.sh` copies _out_ of this repo and into someone else's. The files below run this repo itself and never get copied anywhere:

- **`LICENSE`**: MIT.
- **`.gitignore`**: this repo's own ignore rules — not a template, `structure/` has the `.env.example` for that.
- **`AGENTS.md`**: this repo's own project context file, filled in for real — not to be confused with `ai/AGENTS.md`, which is the blank template other projects copy.
- **`.github/`**: this repo's own CI (`ci.yml`, which validates the playbook's content itself — skill frontmatter, orphaned files, README/skill drift — plus a `secret-scan` job), its own `pull_request_template.md` and `ISSUE_TEMPLATE/`, and its own `dependabot.yml` (`github-actions` only, since there's no `package.json` here for an `npm` block to track). Same names as the `git/` templates, different content — those are what an adopting project gets, these are what this repo actually runs.
- **`.githooks/`**: this repo's own pre-commit/pre-push hooks, wired up via `git config core.hooksPath .githooks` rather than Husky, since there's no `package.json` here for Husky to hook into. See `.githooks/README.md`.
- **`README.md`**: this file.

## How the metrics system actually works

Worth being explicit about this, since it's easy to set up wrong: **`metrics/` here is a template, not a record.** Nothing in this repo is ever filled in with real project data.

The actual flow: `bootstrap.sh` copies a blank findings log and health-check guide into a new project, same as it does with `AGENTS.md`. From then on that copy is local and self-contained. Every time you run `a11y`, `review-tests`, `github`, `sync-context`, `language-tokens`, `security-review`, `project-memory`, or `audit-skills` in that project, the skill's last step appends a row to _that project's_ log. Over time each project builds its own history of what a skill has actually found, not just what it's supposed to catch in theory.

`project-memory` periodically archives resolved rows out of that log (never deletes) and checks the `AGENTS.md` checklist against reality, so the record stays useful instead of turning into noise. Quarterly, or whenever you're checking in, `playbook-health.md` reads that log to answer questions like "is this skill finding anything" and "is `--no-verify` creeping up."

If you want a cross-project view — comparing findings across everything that's adopted the playbook — that's a manual step during a health check, copying interesting rows out of each project's local log by hand. Nothing automates the rollup, because a session working inside one project's repo can't see the others.

And if you use a skill that isn't in this repo (a built-in Claude Code skill, or a third-party one), it won't have a "log the result" step — there's no `SKILL.md` here to add one to. Add the row by hand, or run `add-logging-step` after copying that skill's definition in locally.

The reason any of this exists: a rule is easy to write down and easy to assume is helping. This system is a memory of what a check actually caught, run by run, project by project, and `project-memory` is what keeps that memory from becoming clutter.

## How to use it

No install step, no required tooling. Browse the folder that's relevant to what you're setting up, copy what you need, adapt it.

For a whole new project, `scripts/bootstrap.sh /path/to/new-project` copies everything in one pass — AI context files, CI/security workflows, dependabot config, PR and issue templates, license, env template, every skill folder, a blank `metrics/` folder — then prints the manual steps that are left (installing Husky, filling in placeholders, running the testing setup guide).

For skills specifically, copy the whole folder from `skills/` into your project's `.claude/skills/`. One folder per skill, `SKILL.md` plus whatever `assets/` or `references/` it needs (`language-tokens` ships a `generate.py`, for example). Each project-check skill logs its own results to `metrics/findings-log.md` as its last step.

`AGENTS.md` is the most important file here. Copy it into every new project, fill in the top section, and keep it updated as the project grows, or let `project-memory` catch you when you don't.

## How I think about AI-assisted development

Give the AI context, not just code. The single most useful thing you can do is write a good `AGENTS.md`: what the project is, how it's structured, what the rules are. Without it, every session starts cold.

Automate the boring gates: pre-commit lint, pre-push tests, CI on every PR, secret scanning, dependency updates. None of that is optional once AI is writing code. If anything it matters more, because AI can introduce subtle bugs confidently, and hooks are what catch them before they land.

Accessibility isn't an afterthought. AI-generated UI tends to skip ARIA labels, landmark regions, focus management. The `a11y` skill runs an automated audit and surfaces exactly these gaps.

Test quality matters more. AI writes tests that pass without proving anything, tautologies, wrong expected values, assertions that can't fail. `review-tests` catches that, and also checks that the coverage number behind it is measuring the whole project rather than the one file a test happened to import.

Automated checks deserve the same skepticism as the code they check. `security-review` is scoped deliberately so it doesn't just duplicate what CI already automates.

Standards you don't understand are still worth writing down. If something's in this playbook and you're not sure why, that's a prompt to go find out. The goal is understanding your own standards, not just following them.

And the claim that any of this helps needs checking, not just stating — that record needs upkeep too. It's easy to write a rule and assume it works. `findings-log.md` and `playbook-health.md` exist so each project's history of what these checks actually caught is something I can look at, not just something I assert. `project-memory` exists because that history, left alone, turns into exactly the kind of stale, unverified claim this whole approach is trying to avoid.

## Contributing

Find something useful — adapt it freely. Spot an error or have a suggestion — open an issue.
