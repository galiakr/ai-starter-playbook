# Results Log — `project-memory` fixture

Every run of `project-memory` against `fixture-project/` gets a row here.

| Date | Run by | Findings caught (of 2) | Row 1 archived correctly? | Rows 2/3 left untouched? | Notes |
|------|--------|--------------------------|-----------------------------|-----------------------------|-------|
| 2026-08-05 | `project-memory` skill, manual walkthrough (steps 1-3, report-only) | 2 of 2 planted | Correctly identified as an archive candidate; not physically moved — report-only run per the skill's own step 3, fixture left untouched pending a go-ahead | Yes | Also flagged "Set up CI" as worth a human call: only a deploy-only workflow exists, no actual CI/test workflow. Per user decision: not archived, and the ambiguity is now documented in `expected-findings.md` rather than resolved either way. |
