---
name: sync-context
description: Check whether AGENTS.md and .github/copilot-instructions.md have drifted out of sync. Trigger when the user asks to check, audit, or sync AI context files, or before a release when project conventions may have changed.
---

# Sync Context Skill

`AGENTS.md` and `copilot-instructions.md` exist because Claude/Cursor and
GitHub Copilot look for context in different well-known paths — but their
content is meant to describe the same project, the same conventions, the same
rules. They drift because they're edited by hand, separately, whenever
someone remembers to.

Your job is to read both files and report where they disagree.

## Steps

1. **Locate both files.** Default paths: `AGENTS.md` at the repo root and
   `.github/copilot-instructions.md`. If either is missing, report that
   directly — a missing file is the most common form of drift.

2. **Extract the rule set from each file.** Both files typically cover:
   stack/tech choices, coding conventions, testing rules and thresholds,
   accessibility requirements, and things to avoid. Normalize each into a
   short list of atomic statements (e.g. "TypeScript strict mode, no `any`").

3. **Diff the two rule sets.** For each atomic statement, classify it as:
   - **Match** — present and consistent in both files
   - **Only in AGENTS.md** — Copilot won't see this rule
   - **Only in copilot-instructions.md** — Claude/Cursor won't see this rule
   - **Conflict** — present in both but stated differently (e.g. one says 80%
     coverage, the other says 90%)

4. **Do not silently fix anything.** Report the drift; let the developer
   decide which file is the source of truth for that rule.

## Output Format

---

## Context File Sync Report

**Files checked:** `AGENTS.md`, `.github/copilot-instructions.md`

### Conflicts

| Rule | AGENTS.md says | copilot-instructions.md says |
|------|-----------------|-------------------------------|
| Coverage threshold | 80% | 90% |

### Only in AGENTS.md

- Git hygiene rules (one logical change per commit, no `--no-verify`)

### Only in copilot-instructions.md

- (none)

### In sync

- Stack, TypeScript strict mode, named exports, accessibility attribute rules

---

**Recommendation:** [one line — e.g. "Copy the git hygiene section into
copilot-instructions.md, and confirm which coverage threshold is current
before the next PR."]

If both files are fully in sync: `No drift found. Both files agree on all
extracted rules.`
