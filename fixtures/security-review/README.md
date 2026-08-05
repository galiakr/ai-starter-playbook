# `security-review` fixture

Fixture app code with planted vulnerabilities `security-review` should
catch, plus one deliberately safe-looking-but-actually-safe pattern it
should *not* flag — this skill is new and judgment-heavy enough that a
false-positive check matters as much as the true-positive checks.

## What's planted

- `fixture-app/routes/transfer.ts` — a state-changing route
  (`POST /transfer`) authenticated by a session cookie, with no CSRF
  token check. Real exposure: a cookie gets attached automatically by the
  browser on a cross-site request.
- `fixture-app/routes/export.ts` — a state-changing route authenticated
  by a bearer token read from an `Authorization` header. **Should not** be
  flagged as CSRF-vulnerable the same way — a cross-site request can't
  make the browser attach a custom `Authorization` header, so this route
  isn't exposed the same way `transfer.ts` is, even though both mutate or
  produce data.
- `fixture-app/lib/render.ts` — renders user-supplied content with no
  sanitization step.
- `fixture-app/config/db.ts` — a hardcoded database connection string
  with a real-shaped (fake) credential embedded in it.

## How to run

    security-review fixtures/security-review/fixture-app

Compare against `expected-findings.md`. Append the result to
`results-log.md`.

## What this fixture already found — and fixed

A real run against this fixture (`results-log.md`, 2026-08-06) surfaced
two genuine gaps in `security-review/SKILL.md` itself, not just fixture
framing questions like the other skills' fixtures did. Both are fixed now;
noted here so the fix stays connected to the fixture that found it.

**Gap 1 — the rendering check only grepped the JSX call site.**
`lib/render.ts`'s `renderComment()` returns `{ __html: comment.body }`
with no sanitization — a real stored-XSS payload-builder — but the
literal grep for `dangerouslySetInnerHTML` only matched this file's own
explanatory *comment*, not real code, since the actual JSX consumer
doesn't live in this fixture. The grep-fallback pattern in step 1 missed
the vulnerability entirely; only reading the function's shape caught it.
**Fixed:** step 1 now also greps for `__html\s*:`, so the function
building the unsafe payload is caught even when the JSX call site that
consumes it is somewhere else (or isn't in this fixture at all).

**Gap 2 — the credential check only covered git history.**
`config/db.ts` has a real-shaped hardcoded database credential, findable
with a plain content grep — but this fixture directory is entirely
untracked (confirmed via `git status`, zero commits), so step 5's actual
mechanism at the time (`gitleaks detect --log-opts="--all"` / `git log`)
had no history to scan. The skill's own scope boundary ("don't duplicate
what CI's gitleaks gate already catches") also made this ambiguous: CI's
gate only runs on push, so it says nothing about a credential in code
that hasn't been pushed yet. **Fixed:** step 5 is now two checks, not
one — full git history (pre-adoption secrets) *and* a `--no-git` scan of
the current working tree (secrets in code that hasn't reached CI yet),
with a content-based grep fallback for the second half when `gitleaks`
isn't installed.
