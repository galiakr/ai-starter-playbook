# `review-tests` fixture

Recreates the actual bug that started this whole approach: a coverage
report that looks passing but is only measuring a fraction of the source
tree, plus test files with the kind of weak assertions AI tends to write.

## What's planted

- `fixture-project/vitest.config.ts` — coverage `include` only covers
  `src/utils/**`, silently excluding `src/components/` and `src/hooks/`
  even though both have real logic and both are missing test files. The
  coverage percentage will look high, or even 100%, while over half the
  source tree is never measured.
- `fixture-project/src/utils/math.test.ts` — passes structurally, but
  doesn't prove the logic is correct: a tautological assertion
  (`toBeTruthy()` instead of checking the real value), a wrong expected
  value on `add(-2, -3)`, and no edge case for `isPositive`'s obvious
  boundary inputs (`0`, a negative number).
- `fixture-project/src/components/Button.tsx` and
  `fixture-project/src/hooks/useToggle.ts` — both have real logic, neither
  has a test file. Because both are excluded from `vitest.config.ts`'s
  coverage `include`, this gap doesn't show up as a coverage drop — which
  is exactly the bug this fixture recreates.

## How to run

`fixture-project/` has no `package.json` on purpose — kept dependency-free
so nothing here needs `npm install` just sitting in the repo. Before
running `review-tests` against it, scaffold a throwaway one:

```bash
cd fixtures/review-tests/fixture-project
cat > package.json << 'EOF'
{
  "name": "review-tests-fixture",
  "private": true,
  "type": "module",
  "scripts": {
    "test:coverage": "vitest run --coverage"
  }
}
EOF
npm install --no-save vitest @vitest/coverage-v8 jsdom
```

Then:

    review-tests fixtures/review-tests/fixture-project

Compare against `expected-findings.md`. Append the result to
`results-log.md`. When done, delete `package.json`, `node_modules/`, and
`coverage/` — none of them belong in the committed fixture.
