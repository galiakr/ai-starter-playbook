# Expected findings — `a11y` fixture

Run `a11y` against `fixtures/a11y/fixture.html`.

| # | Category | Location | What should be flagged |
|---|----------|----------|--------------------------|
| 1 | Missing alt text | first `<img>` | No `alt` attribute — screen readers have nothing to announce |
| 2 | Unlabeled form input | `<input name="email">` | No `<label>`, `aria-label`, or `aria-labelledby` associated with the field — see the caveat below, though: automated tools may not catch this one |
| 3 | Insufficient contrast | first `<p>` | `#cccccc` on `#ffffff` fails WCAG AA (both normal and large text thresholds) |

**Not expected to be flagged:** the "banner.png" image (has `alt`), the
"Name" input (has an associated `<label for>`), the second `<p>`
(adequate contrast), the submit `<button>` (has visible text content,
needs no extra label).

**Known automated-tooling blind spot — issue #2 may not fire.** A real run
against this fixture (`fixtures/a11y/results-log.md`, 2026-08-05, axe-core
4.12.1) found `image-alt` and `color-contrast` exactly as planted, but
`label` came back under `passes`, not `violations`, for
`input[name="email"]`. Root cause: the input's only distinguishing
attribute is `placeholder="Email"`, and Chrome's accessible-name
computation (HTML-AAM) falls back to `placeholder` when no `<label>`,
`aria-label`, or `aria-labelledby` exists. axe's `label` rule checks for a
*computed accessible name*, not literally for a `<label>` element — so it
sees a name (from the placeholder) and passes. Placeholder-as-label is
still a real, well-documented anti-pattern (it vanishes once the user
types, and assistive-tech support for reading it as a name is
inconsistent) — it's just not what this specific automated rule catches.

This isn't a fixture bug to fix; it's the actual reason this fixture is
useful. `a11y/SKILL.md` already says automated tools catch roughly
30-40% of real accessibility issues — this is a concrete, checkable
instance of that gap rather than an abstract disclaimer. If a future
`a11y` run ever *does* flag issue #2 (a tool upgrade, a different rule
config), that's worth noting as a change in tool behavior, not assumed to
mean the fixture broke.
