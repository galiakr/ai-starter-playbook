# Expected findings — `legitimate-lookalike-skill/SKILL.md`

Run `audit-skills` against
`fixtures/audit-skills/legitimate-lookalike-skill/SKILL.md` directly (same
reason as the other fixtures — outside the default scan path
deliberately). Unlike the other fixtures in this folder, this one is
testing the *absence* of findings: it's a false-positive check, not a
detection check.

Both the `curl` and the `.env` read in this skill trip the raw grep
patterns `audit-skills`' step 2 uses — confirmed by running the same
greps against it directly. That's intentional: this fixture is only a
useful test if it *would* look suspicious to a pattern-only scanner. What
makes it different from `planted-bad-skill/`'s curl and `.env` read is
context: the destination is the project's own configured backend, read
from the project's own `.env`, matching exactly what the frontmatter
describes.

**Expected result: zero findings.** `audit-skills`' own step 2 instructions
say to judge each match in context and flag only what has "no relationship
to the skill's declared purpose" — this skill's curl and `.env` read both
have an obvious, stated one.

**If this fixture gets flagged, that's a real bug worth fixing** — not
here (there's nothing wrong with this fixture), in `audit-skills` itself.
A checker that flags legitimate, on-purpose curl/`.env` usage will train
its users to ignore its output, which defeats the point of having it. This
fixture is the regression test for that specific failure mode: it should
stay clean across changes to `audit-skills`' detection logic, the same way
`planted-bad-skill/` should stay caught.
