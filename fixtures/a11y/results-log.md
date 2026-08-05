# Results Log — `a11y` fixture

Every run of `a11y` against `fixture.html` gets a row here.

| Date | Run by | Findings caught (of 3) | False positives on clean elements? | Notes |
|------|--------|--------------------------|--------------------------------------|-------|
| 2026-08-05 | axe-core 4.12.1 (chrome-headless), via `a11y` skill's own process | 2 of 3 | No | `image-alt` and `color-contrast` fired exactly as planted. **`label` did NOT fire** on `input[name="email"]` — axe explicitly reports it under `passes`, not `violations` or `incomplete`. Root cause: Chrome computes an accessible name for that input from its `placeholder="Email"` attribute (HTML-AAM accname fallback), and axe's `label` rule checks for a computed accessible name, not literally for a `<label>`/`aria-label`. Placeholder-as-name is a real, known anti-pattern (disappears on input, inconsistent AT support) but isn't what this automated rule catches. 2 extra, unplanted findings also appeared: `landmark-one-main` and `region` (8 nodes) — the fixture has no `<main>` wrapping its content, which is structural noise from a minimal fixture, not a planted issue. |
