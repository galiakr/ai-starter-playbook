# Results Log — `security-review` fixture

Every run of `security-review` against `fixture-app/` gets a row here.

| Date | Run by | Findings caught (of 3) | False positive on export.ts? | Notes |
|------|--------|--------------------------|--------------------------------|-------|
| 2026-08-06 | Manual walkthrough per `security-review/SKILL.md`; `semgrep`/`gitleaks` not installed, used documented grep fallbacks | 3 of 3 | No | Two real gaps surfaced in the skill itself, not just fixture framing — see `README.md`'s "What this fixture already found — and fixed" section. (1) rendering: the grep fallback only matched a comment, missing the `{ __html: ... }`-returning function. (2) credential: step 5's mechanism only covered git history, and this fixture has none (untracked, zero commits). **Both fixed same-day** in `skills/security-review/SKILL.md`: step 1 now also greps `__html\s*:`; step 5 now runs a `--no-git` current-tree scan alongside the history scan. Re-verified both new patterns actually match the fixture's planted issues after the fix. |
