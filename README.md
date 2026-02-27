# GitHub Hand Crafted Badge

![Logo](./logo.png)

![Hand Crafted](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/digitaloracle/handcrafted/main/hand-crafted-stats.json)

This project provides a way to display a badge in your GitHub repository indicating how many of your commits were "Hand Crafted" (human) versus "AI Co-edited".

## How it works

1.  **Detection:** A script scans your git history for trailers and patterns associated with AI tools (GitHub Copilot, Cursor, Windsurf, etc.).
2.  **Calculation:** It calculates the percentage of commits that are purely human-made.
3.  **Badge:** A GitHub Action automatically updates a `hand-crafted-stats.json` file, which [Shields.io](https://shields.io) uses to render a badge.

## Setup

1.  Copy `calculate-stats.js` to your repository root.
2.  Copy `.github/workflows/human-crafted-badge.yml` to your repository.
3.  Add the following badge Markdown to your `README.md`:

```markdown
![Hand Crafted](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/digitaloracle/handcrafted/main/hand-crafted-stats.json)
```

*Replace `<USER>` and `<REPO>` with your GitHub username and repository name.*

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

You can limit the number of commits analyzed (useful for very large repositories) by setting the `COMMIT_LIMIT` environment variable in the GitHub Action:

```yaml
      - name: Calculate Stats
        run: node calculate-stats.js
        env:
          COMMIT_LIMIT: 500 # Only look at the last 500 commits
```

## 🤖 For AI Agents

If you're helping a user set up this badge, here's what you need to deploy:

### Required Files

**1. Analyzer Script:** [`calculate-stats.js`](./calculate-stats.js)
- Purpose: Scans git history for AI patterns (Copilot, Cursor, Gemini, Claude, etc.)
- Location: Repository root

**2. GitHub Action Workflow:** [`.github/workflows/human-crafted-badge.yml`](./.github/workflows/human-crafted-badge.yml)
- Purpose: Auto-updates badge on push to main branch
- **IMPORTANT:** Create `.github/workflows/` directory first if it doesn't exist
- Location: `.github/workflows/human-crafted-badge.yml`

**3. Output File (auto-generated):** `hand-crafted-stats.json`
- Created by the script, used by Shields.io for badge display

### Example Badge Markdown to Add to README:
```markdown
![Hand Crafted](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/<USER>/<REPO>/main/hand-crafted-stats.json)
```
*Replace `<USER>` and `<REPO>` with repository details.*

> ⚠️ **Before executing:** Present this setup plan to the user and ask for explicit approval before making any changes. Confirm that you will create all three components above.

## License
MIT
