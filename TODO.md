# TODOs & Future Improvements

## 🛠 Features
- [ ] **Dynamic AI Tool Updates**: Implement a mechanism to fetch the latest AI commit patterns/trailers from a central registry or community-maintained list (e.g., a JSON file on GitHub).
- [ ] **Directory Filtering**: Add an option to exclude specific directories (like `vendor/` or `dist/`) from the analysis if they contain large amounts of generated code that shouldn't affect the commit ratio.
- [ ] **Commit Detail View**: Create a simple web view or expanded JSON report that lists which commits were flagged as AI-assisted and why.
- [ ] **Multi-branch Support**: Allow the badge to reflect stats from multiple branches or the entire repository history instead of just `main`.

## 🤖 Deployment Guide for AI Agents
- [ ] **Agent Integration**: Create a guide for AI agents (like Gemini CLI, Aider, Claude Code) on how to automatically include the correct trailers during the commit process.
- [ ] **Pre-commit Hooks**: Provide a standard `.pre-commit-config.yaml` or a local git hook script that ensures AI tools append the necessary metadata before a commit is finalized.
- [ ] **CI/CD Best Practices**: Document how to securely set up the `GITHUB_TOKEN` permissions for automated badge updates in different CI environments.

## 📈 Analytics
- [ ] **Trend Analysis**: Track the human-vs-AI ratio over time and provide a sparkline or history graph.
- [ ] **Contributor Breakdown**: Show the AI assistance ratio per contributor to help teams understand how different members are utilizing AI tools.
- [x] **For AI Agents**: Add agent-friendly instructions with deeplinks
