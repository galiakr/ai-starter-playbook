# `sync-context` fixture

A deliberately drifted pair of AI context files — one rule stated in
`AGENTS.md`, silently missing from `copilot-instructions.md`, and then
directly contradicted by something else that file says.

## What's planted

- `fixture-project/AGENTS.md` states: "All API calls go through
  `src/lib/api.ts` — never call `fetch` directly in a component."
- `fixture-project/copilot-instructions.md` doesn't mention that rule at
  all, and separately says a component "may fetch its own data when a
  shared hook doesn't already exist" — which a Copilot session reading
  only that file would reasonably take as license to do the exact thing
  `AGENTS.md` prohibits.

## How to run

`sync-context/SKILL.md`'s step 1 default path is
`.github/copilot-instructions.md`, but this fixture keeps
`copilot-instructions.md` directly under `fixture-project/`, no `.github/`
nesting — a run that relies on the default path will report the file
"missing" instead of finding the real drift. Point at both files directly
rather than letting the skill discover them on its own:

    sync-context — compare fixtures/sync-context/fixture-project/AGENTS.md
    against fixtures/sync-context/fixture-project/copilot-instructions.md directly

Compare against `expected-findings.md`. Append the result to
`results-log.md`.
