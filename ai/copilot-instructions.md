# GitHub Copilot Instructions

> Copy this file to `.github/copilot-instructions.md` in your project. Copilot reads it automatically in VS Code and GitHub.com.
> Keep it in sync with AGENTS.md — they serve the same purpose for different tools.

## Project context

[One sentence: what this project is and what it does]

## Stack

React · TypeScript · Tailwind · [add yours]

## Conventions

- Functional components, named exports, TypeScript strict
- Tailwind for all styling — no inline styles, no CSS modules
- Co-locate test files with the code they test (`*.test.ts`)
- Use Vitest and React Testing Library for tests

## When writing tests

- Always assert specific values — avoid `toBeTruthy` when `toBe('value')` is possible
- Cover the happy path, the empty/null case, and at least one error case
- Name tests as: `it('returns X when Y')`

## When writing components

- Always include accessibility attributes: `alt`, `aria-label`, `role` where needed
- Use semantic HTML first — `<button>` not `<div onClick>`
- Keyboard navigation must work without a mouse

## What to avoid

- No `any` in TypeScript
- No `useEffect` for derived data
- No `--no-verify` on commits
- No hardcoded secrets or API keys
