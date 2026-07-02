---
name: review-tests
description: Review test files for quality issues like wrong assertions, missing edge cases, poor naming, and coverage gaps.
---

# Review Tests Skill

You are performing a focused code review of the test files in this project. Your goal is to identify concrete, actionable quality issues — not style preferences.

## Steps

1. **Find all test files** using Glob with patterns like `**/*.test.*`, `**/*.spec.*`, `**/__tests__/**/*`.

2. **Read each test file** and review it against the criteria below.

3. **Report findings** grouped by file, with line numbers where applicable.

## Review Criteria

### Correctness
- Assertions that can never fail (e.g., `expect(true).toBe(true)`, tautologies)
- Wrong expected values (typos like `'JavaScript111'` instead of `'JavaScript'`)
- Tests that test the mock, not the real behavior
- Missing `await` on async operations

### Test naming
- Vague names like `it('works')` or `it('test 1')`
- Names that don't describe the expected behavior or the scenario
- Names that duplicate the describe block redundantly

### Assertions
- Missing assertions (a test that runs code but asserts nothing)
- Weak assertions (`toBeTruthy` when `toBe('exact value')` is appropriate)
- Asserting too many unrelated things in one test

### Edge cases and coverage
- Happy path only — no error/null/empty/boundary cases tested
- Obvious inputs that are untested (empty string, 0, negative numbers, undefined, very long strings)
- Missing tests for recently added code paths visible in the source files

### Test isolation
- Tests that depend on execution order (shared mutable state between tests)
- Missing cleanup (timers, mocks, side effects left over)
- Global state modified without reset

### Structure
- `describe` blocks that group unrelated tests
- Deeply nested describes that make failures hard to trace
- Repeated setup code that belongs in `beforeEach`

## Output Format

---

## Test Review

### `src/utils/__tests__/foo.test.js`

| # | Severity | Line | Issue |
|---|----------|------|-------|
| 1 | 🔴 CRITICAL | 21 | Wrong expected value — `'JavaScript111'` should be `'JavaScript'` |
| 2 | 🟡 WARNING  | 45 | No edge case for empty string input |
| 3 | 🔵 INFO     | 67 | Test name is vague — rename to describe the expected behavior |

---

### Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 1 |
| 🟡 WARNING  | 2 |
| 🔵 INFO     | 1 |
| **Total**   | **4** |

**Fix first:** `src/utils/__tests__/foo.test.js` line 21 — wrong expected value means this test passes when it should fail.

---

Severity guide:
- 🔴 **CRITICAL** — test is wrong or misleading (passes when it should fail, or vice versa)
- 🟡 **WARNING** — meaningful gap in coverage or assertion quality
- 🔵 **INFO** — naming or structure improvement

If a file has no issues, omit it from the report. If no issues are found at all: `All test files look good. No issues found.`
