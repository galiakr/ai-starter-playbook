# Fixtures

Deliberately broken (or deliberately fine-looking) examples for testing
whether this playbook's own skills actually catch what they claim to
catch — and don't cry wolf on what they shouldn't. Not application code,
not a template handed to adopting projects; `scripts/bootstrap.sh` never
copies this folder.

**Excluded from this repo's own automated scans.** Fixtures live outside
`skills/`, so `.github/workflows/ci.yml`'s `audit-skill-security` job
(which scans every `skills/*/SKILL.md` for exactly the patterns planted
in some of these fixtures) never touches them. If a fixture ever needs to
sit inside `skills/` for a specific test, add it to that job's exclusion
list first — the same way `skills/audit-skills/SKILL.md` already is — or
CI breaks permanently on a file that's supposed to look broken.

## Structure

```
fixtures/
  <skill-name>/
    README.md            <- what this skill's fixtures cover, how to run them
    results-log.md       <- every fixture run for this skill, matched or not
    <scenario>/
      SKILL.md (or whatever the fixture actually is)
      expected-findings.md (or HOW-TO-TEST.md, if one run can't test the claim)
```

One folder per skill being tested, each with its own `README.md` — that's
where the specifics live. This file only covers what's true across all of
them. See `fixtures/audit-skills/README.md` for a worked example.

## The pattern

Any skill that makes a specific, checkable claim ("I catch coverage-scope
mismatches," "I catch stale AGENTS.md items," "I don't flag legitimate
code") is a candidate for a fixture here — eventually. That last kind of
claim matters as much as the first: a checker only ever tested against bad
examples has never had its false-positive rate checked.

## The one rule that holds for all of them

**Never log a fixture run to `metrics/findings-log.md`.** That file, in
this repo, never gets real rows — see `AGENTS.md`. A fixture run isn't a
finding about a real project; it's a finding about whether a skill still
works. Log it to that skill's own `fixtures/<skill-name>/results-log.md`
instead.
