#!/usr/bin/env bash
# Bootstrap a new project with ai-starter-playbook's files.
#
# Usage: run from inside a checkout of ai-starter-playbook:
#   ./scripts/bootstrap.sh /path/to/new-project
#
# This is a one-time copy, not an installed dependency — the destination
# project owns these files afterward and can edit them freely.

set -euo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="${1:?Usage: ./scripts/bootstrap.sh /path/to/new-project}"

if [ ! -d "$DEST" ]; then
  echo "Destination '$DEST' does not exist. Create the project first (e.g. vite scaffold), then re-run."
  exit 1
fi

echo "Bootstrapping $DEST from $SRC_DIR ..."

mkdir -p "$DEST/.github/workflows"
mkdir -p "$DEST/.claude/skills"

# AI context
cp "$SRC_DIR/ai/AGENTS.md" "$DEST/AGENTS.md"
cp "$SRC_DIR/ai/copilot-instructions.md" "$DEST/.github/copilot-instructions.md"

# CI workflows
cp "$SRC_DIR/git/workflows/ci.yml" "$DEST/.github/workflows/ci.yml"
if [ -f "$SRC_DIR/git/workflows/security.yml" ]; then
  cp "$SRC_DIR/git/workflows/security.yml" "$DEST/.github/workflows/security.yml"
fi
if [ -f "$SRC_DIR/git/dependabot.yml" ]; then
  cp "$SRC_DIR/git/dependabot.yml" "$DEST/.github/dependabot.yml"
fi

# Root files
if [ -f "$SRC_DIR/LICENSE" ]; then
  cp "$SRC_DIR/LICENSE" "$DEST/LICENSE"
fi
if [ -f "$SRC_DIR/structure/.env.example" ]; then
  cp "$SRC_DIR/structure/.env.example" "$DEST/.env.example"
fi

# Claude skills (flat .md files -> one folder per skill, Claude Code convention)
for skill in "$SRC_DIR"/skills/skill-*.md; do
  name=$(basename "$skill" .md | sed 's/^skill-//')
  mkdir -p "$DEST/.claude/skills/$name"
  cp "$skill" "$DEST/.claude/skills/$name/SKILL.md"
done

echo ""
echo "Copied. Remaining manual steps:"
echo "  1. Fill in the placeholders in AGENTS.md and copilot-instructions.md (stack, project description)."
echo "  2. cd $DEST && npm install --save-dev husky lint-staged"
echo "  3. npx husky init, then add pre-commit/pre-push hooks per git/hooks/README.md"
echo "  4. Follow testing/setup.md to install Vitest + RTL + Playwright"
echo "  5. Fill in real values locally in .env (never commit it) — .env.example stays as placeholders"
echo "  6. Update LICENSE copyright line if the author differs"
