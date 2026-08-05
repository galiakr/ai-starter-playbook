# Results Log — `sync-context` fixture

Every run of `sync-context` against `fixture-project/` gets a row here.

| Date | Run by | Findings caught (of 2) | Matched expected-findings.md? | Notes |
|------|--------|--------------------------|-------------------------------|-------|
| 2026-08-06 | Manual walkthrough per `sync-context/SKILL.md` | 2 of 2 | Yes | Structural note: the skill's step 1 default path is `.github/copilot-instructions.md`, but this fixture has the file at `fixture-project/copilot-instructions.md` directly — a literal default-path run would report it "missing" rather than finding the real drift. Pointed at the actual file directly instead. Both planted findings reported as one `Conflict` entry (the API-call rule) rather than split into a separate "Only in AGENTS.md" row, since the skill's classification scheme doesn't have a distinct "omitted AND contradicted" category — `Conflict` captures both angles. |
