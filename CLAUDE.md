# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a GitHub badge tool that tracks what percentage of commits are "hand crafted" (human-only) versus AI-assisted. It works by scanning git commit history for known AI tool trailers/patterns and outputs a Shields.io-compatible JSON file.

## Running the Script

```bash
node calculate-stats.js
```

Optional: limit commits analyzed:
```bash
COMMIT_LIMIT=500 node calculate-stats.js
```

Output is written to `hand-crafted-stats.json`.

## Architecture

The project has three core components:

1. **`calculate-stats.js`** — A Node.js script that:
   - Runs `git log` with a special delimiter to extract all commit messages
   - Tests each message against `AI_PATTERNS` (array of regexes)
   - Computes human percentage and writes a Shields.io-schema JSON (path controlled by `OUTPUT_FILE` env var, defaults to `hand-crafted-stats.json`)
   - Appends `human-percentage`, `total-commits`, `ai-commits` to `$GITHUB_OUTPUT` when that env var is set (no-op locally)

2. **`action.yml`** — Composite GitHub Action at the repo root that:
   - Accepts `commit-limit`, `auto-commit`, and `output-file` inputs
   - Runs `calculate-stats.js` via `${{ github.action_path }}` (works for both `uses: ./` and `uses: digitaloracle/handcrafted@v1`)
   - Optionally commits and pushes the updated JSON
   - Exposes `human-percentage`, `total-commits`, `ai-commits` as outputs

3. **`.github/workflows/human-crafted-badge.yml`** — GitHub Actions workflow that:
   - Triggers on push to `main` or manual dispatch
   - Uses `uses: ./` to invoke the action defined in this repo

The badge is served via Shields.io's endpoint feature, pointing at the raw `hand-crafted-stats.json` in the repo.

## Deploying to Another Repository

When helping a user set up this badge in their repo, two things are needed:
1. Create `.github/workflows/human-crafted-badge.yml` in the target repo (referencing `uses: digitaloracle/handcrafted@v1`)
2. Add the badge markdown to their README, replacing `<USER>` and `<REPO>`

**Do NOT copy `calculate-stats.js`** — it is bundled inside the action and invoked via `${{ github.action_path }}`.

**Always present the plan and get explicit user approval before making changes to their repo.**

## AI Detection Patterns

Patterns are defined in `AI_PATTERNS` in `calculate-stats.js`. Current coverage: GitHub Copilot, Cursor, Claude/Claude Code, Gemini, Aider, Amazon Q, Codeium, Tabnine, Windsurf/Cascade, and generic `*ai*@*` co-author email patterns.

## Test Data

`test-data/` contains sample commit message fixtures used for manual testing of detection patterns.
