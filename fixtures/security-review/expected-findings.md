# Expected findings — `security-review` fixture

Run `security-review` against `fixtures/security-review/fixture-app`.

| # | Category | Location | What should be flagged |
|---|----------|----------|--------------------------|
| 1 | CSRF exposure | `routes/transfer.ts` | Cookie-session-authenticated state-changing route with no CSRF token check |
| 2 | Unsafe rendering / XSS | `lib/render.ts` | Unsanitized user content rendered with no sanitization step |
| 3 | Hardcoded credential | `config/db.ts` | A real-shaped database connection string with an embedded password committed to source |

**Not expected to be flagged:** `routes/export.ts` as a CSRF gap. It's a
state-changing route, same as `transfer.ts`, but bearer-token auth isn't
exposed to the same cross-site attack. A run that flags this identically
to issue #1 is over-flagging and should be treated as a real gap in the
skill's CSRF judgment, not a conservative extra catch.

**Severity note:** issue #3 should come back at least as high a severity
as gitleaks would flag it in CI — `security-review` isn't meant to catch
less than the automated tools it triages on top of, only add judgment CI
can't.
