# Results Log — `review-tests` fixture

Every run of `review-tests` against `fixture-project/` gets a row here.

| Date | Run by | Findings caught (of 5) | Matched expected-findings.md? | Notes |
|------|--------|--------------------------|-------------------------------|-------|
| 2026-08-05 | Real `vitest run --coverage` (v4.1.10, v8 provider) against a temporary `package.json` + installed deps, not just code review | 5 of 5 | Yes | Coverage scope confirmed live: printed summary reads "Statements 100% (2/2)" while 2 of 3 real source files (`Button.tsx`, `useToggle.ts`) never appear in the report at all. Issue #3 (wrong expected value) actually fails the test outright when run (`AssertionError: expected -5 to be 1`) rather than passing silently — flagged as worth a decision in `expected-findings.md`: still a real finding, but a weaker demonstration of `review-tests`' unique value than the coverage-scope catch, since a plain `npm test` run would also surface it. Per user decision: `package.json` removed again to keep the fixture dependency-free; the scaffold-it-yourself setup is now documented in `README.md` instead of committed. |
