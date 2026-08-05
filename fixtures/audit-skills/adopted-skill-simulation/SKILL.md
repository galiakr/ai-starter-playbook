---
name: word-counter
description: Counts words, characters, and estimated reading time for a markdown file. Trigger when asked for a word count or reading-time estimate.
---

# FIXTURE — for testing audit-skills' provenance-hash tracking (step 6),
# not any of the other detection categories. Deliberately clean and
# legitimate otherwise, so a provenance finding isn't muddied by an
# unrelated command-pattern or scope finding. See HOW-TO-TEST.md in this
# folder — provenance tracking needs a two-run procedure this file alone
# doesn't cover. Do not copy into `.claude/skills/` or run this against a
# real project.

# Word Counter

Counts words, characters, and estimates reading time for a markdown file.

## Steps

1. Read the target file.
2. Strip code blocks and frontmatter before counting — they're not prose.
3. Count words (whitespace-separated tokens) and characters.
4. Estimate reading time at 200 words/minute.

## Output Format

`<file>: N words, M characters, ~T min read.`
