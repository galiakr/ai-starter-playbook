# Expected findings — `sync-context` fixture

Run `sync-context` against `fixtures/sync-context/fixture-project`.

| # | Category | Location | What should be flagged |
|---|----------|----------|--------------------------|
| 1 | Rule missing entirely | `copilot-instructions.md` | "All API calls go through `src/lib/api.ts`" appears in `AGENTS.md` and nowhere in `copilot-instructions.md` |
| 2 | Rule contradicted | `copilot-instructions.md` | "a component may fetch its own data" directly conflicts with AGENTS.md's "never call fetch directly in a component" — a stronger finding than #1, since it doesn't just omit the rule, it states the opposite |

**Not expected to be flagged:** "Use TypeScript strict mode" and the
components-folder convention — both files state these identically.
