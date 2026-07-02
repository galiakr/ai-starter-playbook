# Git Hooks

Using [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged).

## Setup

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Add to `package.json`:

```json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}
```

## pre-commit

Runs lint-staged on staged files only — fast, auto-fixes what it can.

```bash
# .husky/pre-commit
npx lint-staged
```

## pre-push

Runs the full test suite before pushing. Catches regressions before they hit CI.

```bash
# .husky/pre-push
npm test
```

## commit-msg (optional)

Enforces [Conventional Commits](https://www.conventionalcommits.org/) format.

```bash
# .husky/commit-msg
npx --no -- commitlint --edit $1
```

Requires `@commitlint/cli` and `@commitlint/config-conventional`:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

Valid prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`, `test:`, `ci:`

## Rule

Never use `--no-verify` to skip hooks. If a hook is blocking you, fix the underlying issue.
