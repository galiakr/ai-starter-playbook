# Project Structure

My standard folder structure for React + TypeScript projects.

## Structure

```
my-project/
├── .github/
│   ├── copilot-instructions.md   ← AI context for Copilot
│   └── workflows/
│       └── ci.yml                ← lint + test on every PR
├── .husky/
│   ├── pre-commit                ← lint-staged
│   └── pre-push                  ← npm test
├── e2e/                          ← Playwright end-to-end tests
├── public/                       ← static assets
├── src/
│   ├── components/               ← React components (PascalCase.tsx)
│   ├── hooks/                    ← custom hooks (useXxx.ts)
│   ├── utils/                    ← pure functions (camelCase.ts)
│   │   └── __tests__/            ← unit tests
│   ├── types/                    ← TypeScript types (PascalCase.ts)
│   ├── constants/                ← app-wide constants
│   ├── test/
│   │   ├── setup.ts              ← jest-dom imports
│   │   └── fixtures/             ← shared test data
│   └── main.tsx
├── AGENTS.md                     ← AI context (Claude, Cursor)
├── .env.example                  ← documented env vars, no real values
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Naming conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Components | PascalCase | `UserCard.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types | PascalCase | `UserProfile.ts` |
| Constants | SCREAMING_SNAKE or camelCase file | `API_ROUTES.ts` |
| Tests | same name as file + `.test` | `formatDate.test.ts` |
| E2e tests | feature name + `.spec` | `auth.spec.ts` |

## Required files in every project

| File | Why |
|------|-----|
| `README.md` | What it is, how to run it, live link, screenshot |
| `AGENTS.md` | AI context — updated as the project evolves |
| `.github/copilot-instructions.md` | Same as AGENTS.md, for Copilot |
| `.env.example` | All env vars documented, no real values |
| `LICENSE` | MIT for open source projects |
| `.gitignore` | node_modules, .env, dist, coverage, .DS_Store |
