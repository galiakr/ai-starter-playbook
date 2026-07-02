# ai-starter-playbook

A personal set of standards, skills, and templates for building AI-ready projects — from git hooks to accessibility audits to Claude skills.

Built and maintained by [Galia Kropach](https://www.linkedin.com/in/galiakr/) · [Talk: How I let AI raise my kids](https://www.youtube.com/watch?v=BVCtD6OQlsk)

---

## What this is

This is my opinionated approach to starting and maintaining projects that work well with AI coding assistants (Claude, GitHub Copilot, Cursor) while staying high-quality, accessible, and maintainable.

It is also a learning document. Some of the standards here are things I already knew well. Others I added because I wanted to understand them better — writing them down is how I made them stick. If you're in the same position, that's a feature, not a bug.

It is:
- A reference I reuse across all my projects
- A starting point for anyone who wants a similar setup
- A living document — it evolves as my tooling and understanding do

It is not a framework or a CLI. It's a set of files you copy, adapt, and own.

---

## What's inside

| Folder | What it contains |
|--------|-----------------|
| [`ai/`](./ai/) | AGENTS.md template and Copilot instructions |
| [`skills/`](./skills/) | Claude skills — a11y audit, GitHub CLI, test review |
| [`git/hooks/`](./git/hooks/) | Husky pre-commit and pre-push hook templates |
| [`git/workflows/`](./git/workflows/) | GitHub Actions CI workflow templates |
| [`testing/`](./testing/) | Testing setup guide (Vitest, RTL, Playwright) |
| [`structure/`](./structure/) | Recommended project folder structure and naming conventions |

---

## How to use it

There is no install step. Browse the folder that's relevant to what you're setting up, copy the files you need, and adapt them to your project.

For AI skills — drop the `.md` files from `skills/` into your project root or `.claude/` folder. Claude picks them up automatically in Claude Code.

The `AGENTS.md` template is the most important file. Copy it into every new project, fill in the top section, and update it as the project grows. It is the single biggest thing you can do to improve AI-assisted development on a project.

---

## My AI-assisted development philosophy

**Give AI context, not just code.** The most important thing you can do is write a good `AGENTS.md` — a file that tells the AI what the project is, how it's structured, and what the rules are. Without it, every session starts cold.

**Automate the boring gates.** Pre-commit lint, pre-push tests, CI on every PR. These aren't optional when AI is writing code — they're more important, not less. AI can introduce subtle bugs confidently. Your hooks catch them before they land.

**Accessibility is not an afterthought.** AI-generated UI tends to skip ARIA labels, landmark regions, and focus management. The a11y skill runs an automated audit and surfaces exactly those gaps.

**Test quality matters more than test quantity.** AI writes tests that pass without proving anything — tautologies, wrong expected values, assertions that can never fail. The review-tests skill catches these before they get committed.

**Standards you don't understand are worth writing down.** If a convention is in this playbook and you're not sure why, that's a prompt to find out. The goal is to understand your own standards, not just follow them.

---

## Contributing

If you find something useful, adapt it freely. If you spot an error or have a suggestion, open an issue.
