# Expected findings — `project-memory` fixture

Run `project-memory` against `fixtures/project-memory/fixture-project`.

| # | Category | Location | What should be flagged |
|---|----------|----------|--------------------------|
| 1 | Stale checklist claim | `AGENTS.md` | "Deploy to Vercel" is checked off, but `.github/workflows/deploy.yml` deploys to GitHub Pages and no Vercel config exists anywhere in the project — the claim doesn't match reality |
| 2 | Archivable resolved row | `metrics/findings-log.md`, row 1 | The a11y row references issue #12 as closed/fixed — should be moved to a `## Archive` section, not left in the active log |

**Not expected to be flagged:** rows 2 and 3 of `findings-log.md` — both
are still open and should stay in the active log untouched. "Add
end-to-end tests" — honestly still unchecked, not a stale claim.

**Ambiguous, not settled — "Set up CI."** A real run (`results-log.md`,
2026-08-05) flagged this one instead of passing it through clean. The only
workflow in the fixture is `.github/workflows/deploy.yml`, and it's
deploy-only (`configure-pages`/`deploy-pages`, no lint/test/build steps) —
there's no `ci.yml` or equivalent. `project-memory/SKILL.md`'s own
verification instruction for this item is "check whether
`.github/workflows/ci.yml` exists," which, read literally, it doesn't.
Whether "Set up CI" was meant loosely (some GitHub Actions workflow exists
at all) or strictly (an actual CI/test workflow exists) isn't resolved
here on purpose — a correct run doing the strict reading should flag this
as worth a human decision, not silently pass it as accurate the way this
fixture originally assumed. If a future run treats it as clean without
comment, that's worth double-checking against this note before assuming
the run is right and this doc is stale.
