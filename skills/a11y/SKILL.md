---
name: a11y
description: Test the accessibility of the UI. Runs automated audits using available tools (axe, Lighthouse, pa11y), reports violations grouped by severity, and suggests fixes. Trigger when the user asks about accessibility, a11y, WCAG, screen readers, or wants to audit the UI.
---

# Accessibility (a11y) Skill

You are performing an automated accessibility audit of this project's UI. Your goal is to surface WCAG violations, report them with severity and fix guidance, and leave the dev server in the state you found it.

---

## Steps

### 1. Ensure the dev server is running

Check if the frontend is already listening on its configured port (default: 5173):

```bash
lsof -i :5173 | grep LISTEN
```

If nothing is listening, start it in the background:

```bash
npm run dev &
sleep 3   # give Vite time to boot
```

Record whether you started it so you can stop it afterward.

### 2. Determine which audit tool is available

Use `@axe-core/cli` (preferred). It requires a matching Chrome + ChromeDriver — install them with `browser-driver-manager` first:

```bash
npx --yes browser-driver-manager install chrome
```

Then confirm it works:

```bash
npx --yes @axe-core/cli --version 2>/dev/null && echo "axe-available"
```

Fall back to pa11y only if axe still fails:

```bash
npx --yes pa11y --version 2>/dev/null && echo "pa11y-available"
```

### 3. Run the audit

#### @axe-core/cli (preferred)

```bash
npx @axe-core/cli http://localhost:5173 --save results.json
```

To test additional routes, pass them space-separated:

```bash
npx @axe-core/cli http://localhost:5173 http://localhost:5173/some-route --save results.json
```

#### Lighthouse (fallback)

```bash
npx lighthouse http://localhost:5173 \
  --only-categories=accessibility \
  --output=json \
  --output-path=/tmp/a11y-report.json \
  --chrome-flags="--headless --no-sandbox"
```

#### pa11y (fallback)

```bash
npx pa11y http://localhost:5173 --reporter json > /tmp/a11y-report.json
```

### 4. Parse and report findings

Read the report and group violations by severity.

**axe severity levels:** `critical`, `serious`, `moderate`, `minor`
**Lighthouse:** score out of 100 + individual audit failures
**pa11y:** `error`, `warning`, `notice`

### 5. Stop the dev server if you started it

```bash
kill %1
```

### 6. Log the result

Append one row to `metrics/findings-log.md`: date, project, `a11y`, an
outcome (`Clean` if 0 violations, `Found → Fixed` if you fixed them this
run, `Found — open` if violations remain), and one sentence naming the
violation count and root cause if there was one. A clean run is worth
logging too — it's evidence the practice is holding, not nothing to report.

---

## Output Format

---

## Accessibility Audit — `http://localhost:5173`

**Tool:** axe-cli 4.x | **WCAG level:** 2.1 AA | **Score:** n/a (axe) or X/100 (Lighthouse)

### Critical

| # | Rule | Element | Description | Fix |
|---|------|---------|-------------|-----|
| 1 | `color-contrast` | `.btn-primary` | Foreground/background contrast ratio 2.5:1 (min 4.5:1) | Darken text or lighten background to meet 4.5:1 ratio |

### Serious

| # | Rule | Element | Description | Fix |
|---|------|---------|-------------|-----|

### Moderate / Minor

| # | Rule | Element | Description | Fix |
|---|------|---------|-------------|-----|

### Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| Serious | 0 |
| Moderate | 0 |
| Minor | 0 |
| **Total** | **0** |

**Overall:** PASS / FAIL

---

If no violations are found: `No accessibility violations found. The page passes WCAG 2.1 AA automated checks.`

Note: automated tools catch ~30–40% of real accessibility issues. Manual testing with a screen reader (VoiceOver, NVDA) and keyboard-only navigation is still recommended.

---

## Common Fixes Reference

| Rule | Quick fix |
|------|-----------|
| `color-contrast` | Adjust foreground/background to meet 4.5:1 (normal text) or 3:1 (large text) |
| `image-alt` | Add descriptive `alt` to `<img>`; use `alt=""` for decorative images |
| `label` | Associate every `<input>` with a `<label>` via `for`/`id` or `aria-label` |
| `button-name` | Add visible text or `aria-label` to icon-only buttons |
| `link-name` | Add visible text or `aria-label` to links that contain only an icon |
| `landmark-one-main` | Wrap main content in a `<main>` element |
| `region` | Ensure all content is within a landmark region (`<main>`, `<nav>`, `<header>`, etc.) |
| `heading-order` | Don't skip heading levels (e.g. `<h1>` → `<h3>` skipping `<h2>`) |
| `focus-trap` | Ensure keyboard focus is never trapped without an escape path |
