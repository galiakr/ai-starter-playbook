# Playbook Health Check

This playbook makes claims ("this reduces AI-introduced bugs," "this catches
low-quality tests") that are currently unmeasured. Run this check quarterly,
or after adopting the playbook into a new project, to see if it's actually
doing anything.

## 1. Are the gates being bypassed?

```bash
git log --all --grep="no-verify" --oneline
git log --all -p | grep -c -- "--no-verify"
```

A rising count means the local hooks are friction people route around, not
guardrails people trust. If it's happening often, the hooks are probably too
slow or too strict — fix the hook, don't just note the workaround.

## 2. Is CI catching real problems, or just failing on noise?

Pull the last 20 CI runs on `main` and classify each failure:
- caught a real bug/regression
- flaky (passed on rerun with no code change)
- caused by an environment/config issue, not the code

```bash
gh run list --branch main --limit 20 --json conclusion,name,createdAt
```

High flaky-failure rate erodes trust in the pipeline faster than it prevents
bugs — treat it as a bug in the pipeline itself.

## 3. Is coverage trending, not just passing?

Coverage passing the 80% gate tells you nothing about whether it's trending
up or down over time. Track the number from the CI coverage artifact each
month:

| Month | Line coverage | Function coverage |
|-------|---------------|--------------------|
|       |               |                    |

## 4. Is the a11y skill actually run, and what does it find?

Since it's on-demand (not automatic), it's only useful if someone remembers
to run it. Track:
- last date `/a11y` (or equivalent) was run
- violation count by severity at that run
- whether violation count is going down across runs

## 5. Before/after comparison

The strongest evidence this playbook works: pick one project that adopted it
and one that didn't (or a before/after on the same project), and compare:
- bug reports per month
- time-to-detect for regressions (caught in CI vs. caught in production)
- PR review comments flagging things the hooks/skills should have caught

Write the result here, even if it's inconclusive — an honest "no measurable
difference yet, sample size too small" is more credible than an unverified
claim of success.
