---
name: github
description: Use this skill for any GitHub operations in the terminal or Claude Code: opening issues, creating pull requests, reviewing PRs, listing issues, adding labels or comments, checking PR status, merging branches, cloning repos, or any other GitHub workflow. Trigger whenever the user mentions issues, PRs, pull requests, tickets, GitHub, wants to interact with a repository, or asks about repo activity.
---

# GitHub Skill

Use the `gh` CLI for all GitHub operations. The token is already set via `GITHUB_TOKEN` env variable.

## Before anything

Always confirm which repo you're in:

```bash
gh repo view
```

---

## Issues

### Create an issue

```bash
gh issue create --title "Bug: X is broken" --body "Steps to reproduce..." --label bug
```

### List open issues

```bash
gh issue list --state open
```

### View a specific issue

```bash
gh issue view 42
```

### Add a comment

```bash
gh issue comment 42 --body "Looking into this now"
```

### Close an issue

```bash
gh issue close 42
```

---

## Pull Requests

### Create a PR

```bash
gh pr create --title "feat: add X" --body "## What\nDescription here" --base main
```

### List open PRs

```bash
gh pr list
```

### View a PR

```bash
gh pr view 42
```

### See a PR's code diff

```bash
gh pr diff 42
```

### Merge a PR

```bash
gh pr merge 42 --squash
```

### Add a comment to a PR

```bash
gh pr comment 42 --body "Looks good, merging tomorrow"
```

---

## Resolving PR Conflicts

When a PR has conflicts with the base branch, resolve them via rebase (preferred over merge commits).

### 1. Check which files conflict

```bash
gh pr view 42          # confirm the base branch
git fetch origin main
git rebase origin/main # git will stop at each conflicting file
```

### 2. For each conflicting file

Look for conflict markers:

```
<<<<<<< HEAD
your branch's version
=======
main's version
>>>>>>> origin/main
```

Edit the file, then stage it:

```bash
git add path/to/file
```

### 3. Continue or abort

```bash
git rebase --continue
git rebase --abort    # to undo everything
```

### 4. Push the resolved branch

```bash
git push --force-with-lease
```

### Tips

- Prefer `git rebase origin/main` over `git merge origin/main` for linear history
- If the conflict is in a generated file (e.g. `package-lock.json`), delete it, re-run `npm install`, then `git add` and `git rebase --continue`
- Use `git diff --name-only --diff-filter=U` to list all unresolved files

---

## General Tips

- Add `--web` to any command to open it in the browser
- Use `gh issue list --assignee @me` to see only your issues
- Use `gh pr list --author @me` to see your own PRs
- Always confirm the current repo with `gh repo view` before running commands
