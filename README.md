# GitHub Hand Crafted Badge

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
- `Co-authored-by: cursor-ai <sos@cursor.sh>`
- `Co-authored-by: Cursor <sos@cursor.sh>`
- `AI-Assistant: ...` (Windsurf/Cascade/Gemini)
- `Generated-by: ...`
- `AI-Generated: true`
- `Gemini` or `Gemini-CLI`
- Generic AI co-authorship patterns

## Optional Configuration

You can limit the number of commits analyzed (useful for very large repositories) by setting the `COMMIT_LIMIT` environment variable in the GitHub Action:

```yaml
      - name: Calculate Stats
        run: node calculate-stats.js
        env:
          COMMIT_LIMIT: 500 # Only look at the last 500 commits
```

## License
MIT
