# ai-starter-playbook

> This is the playbook's own project file and not `ai/AGENTS.md`, which is the
> template handed to _other_ projects. If you're an AI assistant working in
> this repo, this is the file that describes it.

## What this project is

A personal, opinionated set of standards, skills, and templates for
starting and maintaining projects that work well with AI coding
assistants. It's not an app. There's no build, no server, no UI. The
"product" is the files themselves: Claude skills, GitHub Actions
templates, a bootstrap script, and the docs explaining how they fit
together. Read `README.md` first; it's the source of truth for what's
here and why.

## Stack

None. No `package.json`, no framework, no runtime dependency. The repo is Markdown (skills, docs), YAML (GitHub Actions templates), and Bash (`scripts/bootstrap.sh`, `.githooks/`). Don't
introduce npm/Node tooling just to gain a familiar workflow. If a check can be a plain shell script or a grep, prefer that over adding a dependency this repo would then have to maintain.

## Project structure

```
ai/             AGENTS.md + Copilot instructions template (for OTHER projects)
skills/         Claude skills. One folder per skill, each a SKILL.md
git/hooks/      Husky setup guide (template, for OTHER projects)
git/workflows/  CI + security workflow templates (for OTHER projects)
testing/        Vitest/RTL/Playwright setup guide
structure/      Folder layout + .env.example template
scripts/        bootstrap.sh - scaffolds all of the above into a new project
metrics/        BLANK TEMPLATES ONLY. See "What to avoid" below
.github/        THIS repo's own CI, PR/issue templates, dependabot config
.githooks/      THIS repo's own git hooks (same as git/hooks/ note above)
```

The `ai/`, `git/hooks/`, `git/workflows/`, `testing/`, `structure/`,
`metrics/` folders are things this repo _ships_ to other projects. Don't
confuse a template with this repo's own configuration. `.github/` and
`.githooks/` are the real thing, scoped to this repo.

## Conventions

### Skill files (`skills/<name>/SKILL.md`)

- Frontmatter needs `name:` and `description:`. The description states
  when to trigger the skill, specifically enough that another skill (or a
  human) can tell whether it applies.
- A numbered `## Steps` list, ending in a **"Log the result"** step that
  appends one row to `metrics/findings-log.md`. Every _project-check_
  skill does this. Meta/authoring skills that edit other skills' files
  (`add-logging-step`, `audit-skills`) are exempt; they don't log to a
  project's findings record because they don't check a project.
- An `## Output Format` section with a concrete example, and a one-line
  fallback string for the "nothing found" case.
- Judgment-level skills (`sync-context`, `project-memory`, `audit-skills`)
  report findings and let a human decide. They never silently rewrite or
  delete something on their own authority.

### Workflow templates (`git/workflows/*.yml`)

Must pass `actionlint`. The `validate-workflow-templates` CI job checks
this on every push. `.github/workflows/ci.yml` (this repo's own CI, not a
template) isn't linted the same way, but keep it valid YAML and consistent
in style with the templates it sits next to.

### Shell (`scripts/bootstrap.sh`, `.githooks/*`)

Must pass `shellcheck`. Prefer plain POSIX-ish Bash over anything clever —
this script runs unattended on someone else's machine during their first
five minutes with the repo; a cryptic failure there is a bad first
impression.

## What to avoid

- **Never fill in `metrics/findings-log.md` or `metrics/playbook-health.md`
  with real rows in this repo.** They're blank templates that get copied
  into adopting projects; this repo's own copy stays empty, permanently.
  Filling it in here would make it look like a specific project's actual
  results, which is exactly the kind of confusion the metrics system
  exists to prevent.
- Don't add a skill folder without documenting it in `README.md`'s skill
  list — the `validate-skills` CI job warns (doesn't block) when one's
  missing, but treat the warning as real.
- Don't add npm/Node tooling to this repo to solve a problem a shell
  script already solves — see "Stack" above.
- Never use `--no-verify` to skip a hook. If `.githooks/pre-commit` or
  `pre-push` is blocking you, fix the underlying issue.

## Git hygiene

- **Direct commits to `main` are the norm here, not an oversight.** This
  is a solo-maintained repo — one committer, so a PR-to-self workflow
  would be ceremony without a second reviewer to justify it. `ai/AGENTS.md`
  (the template shipped to *other* projects) says "never commit directly
  to main" because that rule earns its keep once there's a team; it isn't
  being applied to this repo about itself, deliberately.
- CI still gates every push to `main`, not just PRs — `.github/workflows/ci.yml`
  runs on `push: branches: [main]` specifically because there's no
  required-status-check branch protection blocking a bad commit *before*
  it lands. The trade-off is real: a broken commit gets caught right
  after landing, not before. `.githooks/pre-commit`/`pre-push` exist to
  catch most of that locally, before it's even pushed.
- `.github/pull_request_template.md` and `.github/ISSUE_TEMPLATE/` still
  exist and still matter even though the maintainer's own commits don't
  go through them — dependabot's automated PRs land in this repo's PR
  surface, and they're what an outside contributor would see if this repo
  ever took an external PR.
- One logical change per commit, and a message that explains *why* — still
  true here regardless of the above. It's about keeping `git log` useful
  later, not about review ceremony.
- Never use `--no-verify` to skip a hook, here or anywhere it's set up.

## Local checks

```bash
git config core.hooksPath .githooks   # one-time, per clone — see .githooks/README.md
chmod +x .githooks/pre-commit .githooks/pre-push
```

`pre-commit` checks staged `SKILL.md` files (frontmatter, dangerous
command patterns, injection-style phrasing). `pre-push` runs the full
pass across all skills, plus `shellcheck`/`actionlint`/`gitleaks` if
they're installed locally (CI runs all three regardless).

## Testing

There's no test suite. Nothing here is application code to unit-test.
"Correctness" for this repo means: skill files have valid frontmatter and
a logging step, workflow templates lint clean, `bootstrap.sh` passes
shellcheck, and the README accurately describes what's in the repo. CI
(`.github/workflows/ci.yml`) checks all of that on every push and PR.

## Instructions for AI assistants

- Treat `README.md` as the authoritative description of what's in this
  repo. If you add, remove, or meaningfully change a file that README
  documents, update README with the change.
- A change to a skill's behavior belongs in that skill's own `SKILL.md`,
  not scattered across README prose. README describes _what_ a skill
  does at a summary level; `SKILL.md` is the actual instructions.
- Before proposing a new CI job or hook, check whether it already exists
  in `.github/workflows/ci.yml`, `.githooks/`, or as a `git/workflows/*`
  template. This repo tends to grow mechanical counterparts to its own
  judgment-level skills (`security-review` ↔ `security.yml`,
  `audit-skills` ↔ the `audit-skill-security` CI job); check that pattern
  before inventing a new one.
- If asked to add something that would only make sense with npm/Node
  present, say so explicitly rather than adding a `package.json` as a side
  effect.

## Current focus / known issues

- [ ] `audit-skills`' provenance-hash tracking (`metrics/skill-provenance.md`)
      has never been exercised — no skill in this repo has been adopted
      from outside it yet. Trigger and verify it once one is.
- [x] This repo's own CI, hooks, and PR/issue templates were audited
      against the playbook's own philosophy and closed out — root
      `AGENTS.md` (this file), `.githooks/`, `.github/pull_request_template.md`,
      `.github/ISSUE_TEMPLATE/`, `.github/dependabot.yml` (github-actions only),
      and a `secret-scan` job in `.github/workflows/ci.yml`.
