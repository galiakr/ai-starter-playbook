---
name: security-review
description: Judgment-level security review of the codebase — unsafe rendering/injection patterns, missing security headers, CORS misconfiguration, npm audit findings triaged for actual exploitability, and secrets that may exist in git history from before secret scanning was added. Does not duplicate the gitleaks/npm audit checks already run in CI — trigger when the user asks for a security review, security audit, or to check for vulnerabilities beyond what CI already gates on.
---

# Security Review Skill

`git/workflows/security.yml` already runs gitleaks and `npm audit` as an
automated CI gate on every push and weekly. Re-running those same two tools
here would be redundant — this skill exists for the review a scanner can't
do: reading code for unsafe patterns, checking configuration a linter
doesn't know to look at, and applying judgment to findings CI already
flagged mechanically but never triaged.

**Scope boundary — read this first:** if a finding is something gitleaks or
`npm audit` already catches and reports clearly, don't re-derive it here.
This skill's value is entirely in the parts CI doesn't cover.

## Steps

### 1. Unsafe rendering and injection patterns

Grep for patterns that bypass a framework's built-in escaping:

```bash
grep -rn "dangerouslySetInnerHTML" src/
grep -rn "\.innerHTML\s*=" src/
grep -rn "\bv-html\b" src/          # Vue
grep -rn "\beval(\|new Function(" src/
```

For each match, check whether the value being inserted is user-controlled
or comes from a trusted, static source. Flag only the former — a static
string passed to `dangerouslySetInnerHTML` isn't a finding.

If there's a backend with database access, check for string-concatenated
queries instead of parameterized ones:

```bash
grep -rn "SELECT.*\+\|query(\`" server/ api/ 2>/dev/null
```

### 2. Auth and authorization boundaries

If the project has API routes or a backend:
- Check that every route handling non-public data has a server-side auth
  check — not just a client-side redirect or a hidden UI element. A
  client-only permission check is not a security boundary; note explicitly
  if you find one being treated as if it were.
- Check for IDOR-shaped bugs: an endpoint that takes an ID (`/api/orders/:id`)
  without confirming the requesting user owns that resource.

If the project is client-only (a static SPA with no backend, common for
portfolio projects), say so explicitly and note that no server-side
authorization boundary exists or is needed — don't manufacture findings
that don't apply to the architecture.

### 3. Security headers and CORS

Check hosting config for security headers (CSP, `X-Content-Type-Options`,
`X-Frame-Options` or equivalent) — look in `vercel.json`, `netlify.toml`,
`vite.config.ts`, or hosting-platform-specific config. Absence isn't
automatically a finding for a static portfolio site; note it as
informational unless the app handles sensitive data.

If there's a backend, check CORS configuration for overly permissive
settings — `origin: '*'` combined with `credentials: true` is a real
finding; `origin: '*'` alone on a fully public read-only API is not.

### 4. Triage existing npm audit findings

Run `npm audit --json` and, for each finding CI already flags, check
whether the vulnerable code path is actually reachable:

- Is the vulnerable function/module actually imported and called, or is it
  a transitive dependency of a devDependency that never ships to
  production?
- Is it build-time-only (e.g. a Vite plugin) versus runtime-exposed?

Report this as a triage layer on top of what `npm audit` already says —
"CI flags N vulnerabilities; M are reachable at runtime and worth
prioritizing, N-M are transitive/build-time and lower urgency" — not a
re-listing of the raw audit output.

### 5. Secrets in git history

`gitleaks` in CI only scans commits going forward from when it was added —
it does not retroactively clean history. Check whether a secret might
already be sitting in an old commit:

```bash
git log --all -p | grep -iE "api[_-]?key|secret|password|token" | head -50
```

This is a coarse grep, not a full scan — flag anything suspicious for the
user to investigate with a proper history-scanning tool
(`gitleaks detect --log-opts="--all"` or `trufflehog`) rather than treating
a miss here as clean.

### 6. .env and .gitignore hygiene

Confirm `.gitignore` actually excludes `.env`, and check whether `.env`
(or any file matching common secret-file patterns) was ever committed
before being gitignored:

```bash
git log --all --full-history -- .env
```

### 7. Log the result

Append one row to `metrics/findings-log.md`: date, project,
`security-review`, an outcome (`Clean`, `Found → Fixed`, or
`Found — open`), and one sentence naming the finding count by category
(rendering, auth, headers, audit triage, history).

## Output Format

---

## Security Review

**Note:** this review covers what CI's gitleaks/npm audit gate doesn't —
unsafe patterns, config, and judgment calls, not a re-scan for secrets or
known CVEs. It's a heuristic code review, not a penetration test; for
anything handling payments, health data, or other regulated PII, get a
professional audit before relying on this alone.

### Findings

| # | Category | Severity | Location | Description | Fix |
|---|----------|----------|----------|-------------|-----|
| 1 | Rendering | 🔴 High | `Comment.tsx:42` | `dangerouslySetInnerHTML` renders user-submitted comment body unsanitized | Sanitize with DOMPurify before rendering, or switch to plain-text rendering |

### npm audit triage

| Package | CVE severity (per audit) | Reachable at runtime? | Priority |
|---------|---------------------------|------------------------|----------|
| example-pkg | High | No — devDependency, build-time only | Low |

### Summary

| Category | Findings |
|----------|----------|
| Rendering/injection | 0 |
| Auth boundaries | 0 |
| Headers/CORS | 0 |
| Audit triage (reachable) | 0 |
| Git history | 0 |

**Overall:** [one line — e.g. "1 finding requiring a fix before this handles real user content."]

---

If nothing is found: `No findings beyond what CI's gitleaks/npm audit gate
already covers. This is a heuristic review, not a substitute for a
professional audit if this project ever handles payments or regulated
data.`
