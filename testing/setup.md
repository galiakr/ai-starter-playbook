# Testing Setup

My standard testing stack for React + TypeScript projects.

## Stack

| Tool | Purpose |
|------|---------|
| [Vitest](https://vitest.dev/) | Test runner — fast, Vite-native |
| [React Testing Library](https://testing-library.com/react) | Component testing |
| [Playwright](https://playwright.dev/) | End-to-end tests |
| [MSW](https://mswjs.io/) | API mocking |

## Install

```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

## vitest.config.ts

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'lcov'],
      thresholds: {
        lines: 80,
        functions: 80,
      },
    },
  },
})
```

## src/test/setup.ts

```ts
import '@testing-library/jest-dom'
```

## package.json scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## File conventions

- Test files live next to the code they test: `utils/format.ts` → `utils/format.test.ts`
- Shared fixtures go in `src/test/fixtures/`
- Integration tests go in `src/test/integration/`
- E2e tests go in `e2e/` at the root

## Writing good tests

```ts
// Good — specific, readable, one thing per test
it('returns empty array when input is empty', () => {
  expect(normalizeTags([])).toEqual([])
})

it('sorts and deduplicates tags', () => {
  expect(normalizeTags(['react', 'css', 'react'])).toEqual(['css', 'react'])
})

// Bad — vague, tests too much, weak assertion
it('works', () => {
  expect(normalizeTags(['react', 'css', 'react'])).toBeTruthy()
})
```

Run `/review-tests` in Claude Code to audit existing tests for quality issues.

## E2e with Playwright

```bash
npm init playwright@latest
```

```ts
// e2e/home.spec.ts
import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
```
