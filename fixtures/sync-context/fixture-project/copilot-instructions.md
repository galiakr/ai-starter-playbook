# Copilot instructions

<!-- PLANTED ISSUE: the "all API calls go through src/lib/api.ts" rule
     from AGENTS.md is absent here, and the last bullet below actively
     contradicts it. -->

## Coding conventions
- Use TypeScript strict mode.
- Components live in `src/components/`, one folder per component.
- Keep components self-contained; a component may fetch its own data
  when a shared hook doesn't already exist.
