# GitHub Hand Crafted Badge

![Logo](./logo.png)

![Hand Crafted](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/digitaloracle/handcrafted/main/hand-crafted-stats.json)

This project provides a way to display a badge in your GitHub repository indicating how many of your commits were "Hand Crafted" (human) versus "AI Co-edited".

## How it works

1. **Detection:** A script scans your git history for trailers and patterns associated with AI tools (GitHub Copilot, Cursor, Windsurf, etc.).
2. **Calculation:** It calculates the percentage of commits that are purely human-made.
3. **Badge:** A GitHub Action automatically updates a `hand-crafted-stats.json` file, which [Shields.io](https://shields.io) uses to render a badge.

## Setup

1. Add the badge Markdown to your `README.md` (replace `<USER>` and `<REPO>`):

```markdown
![Hand Crafted](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/<USER>/<REPO>/main/hand-crafted-stats.json)
```

2. Create `.github/workflows/human-crafted-badge.yml` in your repository:

```yaml
name: Update Hand Crafted Badge

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  update-badge:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: digitaloracle/handcrafted@v1
```

That's it. No scripts to copy.

## Supported AI Detection Patterns

- `Co-authored-by: GitHub Copilot <noreply@github.com>`
- `Co-authored-by: Claude <noreply@anthropic.com>`
- `Co-authored-by: cursor-ai <sos@cursor.sh>`
- `AI-Assistant: ...` (Windsurf/Cascade/Gemini/Claude)
- `Generated-by: ...` or `Generated with Claude Code`
- `AI-Generated: true`
- `Gemini`, `Claude`, `Codex`, `Amazon Q`, `Codeium`, `Tabnine`
- `Assisted-by: ...` or `AI-Model: ...`
- Generic AI co-authorship patterns (`*ai*@*`)

## Optional Configuration

| Input | Default | Description |
|---|---|---|
| `commit-limit` | *(all)* | Limit commits analyzed, useful for large repos |
| `auto-commit` | `true` | Set to `false` to skip committing the badge JSON |
| `output-file` | `hand-crafted-stats.json` | Badge JSON output path |

Example with options:

```yaml
      - uses: digitaloracle/handcrafted@v1
        with:
          commit-limit: '500'
```

## Action Outputs

The action also exposes these outputs for use in subsequent steps:

| Output | Description |
|---|---|
| `human-percentage` | Percentage of commits that are human-authored |
| `total-commits` | Total number of commits analyzed |
| `ai-commits` | Number of AI-assisted commits detected |

## 🤖 For AI Agents

To set up this badge in a user's repo, you only need to do two things:

1. Create `.github/workflows/human-crafted-badge.yml` (full contents in the Setup section above)
2. Add the badge Markdown to their `README.md`, replacing `<USER>` and `<REPO>`

No scripts need to be copied. The action at `digitaloracle/handcrafted@v1` provides everything.

> ⚠️ **Before executing:** Present this setup plan to the user and ask for explicit approval before making any changes.

## License
MIT
