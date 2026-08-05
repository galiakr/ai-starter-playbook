# `a11y` fixture

A minimal HTML fixture with a known set of accessibility violations,
plus correctly-marked-up elements alongside them — the audit should catch
the first set and stay quiet on the second.

## What's planted

`fixture.html` has: an `<img>` with no `alt`, a text `<input>` with no
associated `<label>` or `aria-label`, and a low-contrast text block
(light gray on white, well under WCAG AA). Alongside each one: a properly
`alt`-tagged image, a properly labeled input, and adequately-contrasted
text — included specifically so a run that flags those too is a
false-positive problem worth noting.

## How to run

Serve `fixture.html` (or point the audit at the file directly, depending
on how your `a11y` skill run is set up), then run `a11y` against it.
Compare against `expected-findings.md`. Append the result to
`results-log.md`.
