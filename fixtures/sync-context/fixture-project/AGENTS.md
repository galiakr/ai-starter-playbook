# AGENTS.md

## Coding conventions
- All API calls go through `src/lib/api.ts`. Never call `fetch` directly
  in a component.
- Use TypeScript strict mode.
- Components live in `src/components/`, one folder per component.
