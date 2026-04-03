# GitHub Hand Crafted Badge

<img src="./logo.png" width="200" alt="Hand Crafted logo" />

![Hand Crafted](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/digitaloracle/handcrafted/main/hand-crafted-stats.json)

## The idea

Before the industrial revolution, almost everything was handcrafted. Clothes were sewn by tailors, shoes were cobbled by hand, furniture was carved by craftsmen. Then machines arrived — faster, cheaper, more consistent — and handmade goods became the exception rather than the rule. Manufacturers began labelling their products *"hand crafted"* precisely because it had become rare enough to be worth saying.

We are living through a similar shift in software. AI coding tools are becoming capable enough that a growing share of commits, diffs, and entire features are written or heavily shaped by a model rather than a person. Like the industrial revolution before it, this changes what "made by hand" means — and makes it worth marking when it's true.

This badge is that label for your repository. A way to say: *these commits were written by a human.*

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

Tools that automatically inject markers into commits:

| Tool | Detected markers |
|---|---|
| **Claude Code** | `Co-Authored-By: Claude ...` · `Generated with Claude Code` |
| **Cursor** | `Co-authored-by: Cursor <cursoragent@cursor.com>` · `Made-with: Cursor` (+ legacy `sos@cursor.sh`) |
| **Aider** | `Co-authored-by: aider ... <noreply@aider.chat>` · `(aider)` author suffix · `aider:` message prefix |
| **Copilot Cloud Agent** | `copilot-swe-agent[bot]` author · `Agent-Logs-Url:` trailer |
| **Devin** | `devin-ai-integration[bot]` author |
| **OpenHands** | `Co-authored-by: openhands` · `openhands@all-hands.dev` |
| **Gemini Code Assist** | `gemini-code-assist[bot]` author |
| **Codex Web/Cloud** | `chatgpt-codex-connector[bot]` author |
| **Amazon Q** | `amazon-q-developer[bot]` author |

Community/org attribution standards also detected: `Assisted-by:`, `Generated-by:`, `AI-Assisted-By:`, `AI-Tool:`, `AI-Model:`, `AI-Generated: true`, and generic `*ai*@*` co-author emails.

> **Note:** IDE-integrated assistants (Copilot inline, JetBrains AI, Tabnine, Codeium/Windsurf, Cody) inject no commit-level markers and are undetectable at the git level. Absence of a marker does not mean a commit is human-only.

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
