const { execSync } = require("child_process");
const fs = require("fs");

const AI_PATTERNS = [
  // Claude Code — co-author trailer (covers model-specific variants like "Claude Sonnet 4.5")
  /Co-Authored-By: Claude/i,
  // Claude Code — body text (covers plain and emoji/markdown link variants)
  /Generated with Claude Code/i,

  // Cursor — new email (cursoragent@cursor.com, added ~Jan 2026)
  /Co-authored-by: Cursor <cursoragent@cursor\.com>/i,
  // Cursor — legacy email
  /Co-authored-by: cursor-ai <sos@cursor\.sh>/i,
  /Co-authored-by: Cursor <sos@cursor\.sh>/i,
  // Cursor — second custom trailer injected alongside co-author
  /Made-with: Cursor/i,

  // Aider — co-author trailer with noreply@aider.chat email
  /Co-authored-by: aider.*<noreply@aider\.chat>/i,
  // Aider — author/committer name suffix "(aider)" and commit message prefix "aider:"
  /\(aider\)/i,
  /aider:/i,

  // GitHub Copilot Cloud Agent — commits as bot author, adds Agent-Logs-Url trailer
  /\bcopilot-swe-agent\[bot\]/i,
  /Agent-Logs-Url:/i,

  // Devin — GitHub App bot identity
  /devin-ai-integration\[bot\]/i,

  // OpenHands (formerly OpenDevin)
  /Co-authored-by: openhands/i,
  /openhands@all-hands\.dev/i,

  // Gemini Code Assist — GitHub App bot (PR suggestions)
  /gemini-code-assist\[bot\]/i,
  // Gemini CLI co-author
  /Co-authored-by: .*<.*gemini@google\.com>/i,

  // Cody co-author
  /Co-authored-by: .*<.*cody@sourcegraph\.com>/i,

  // Continue co-author
  /Co-authored-by: .*<.*continue@continue\.dev>/i,

  // Codex Web/Cloud (ChatGPT Codex connector bot)
  /chatgpt-codex-connector\[bot\]/i,

  // Amazon Q — GitHub App bot identity
  /amazon-q-developer\[bot\]/i,

  // Community/org attribution standards
  /Assisted-by:/i,
  /Generated-by:/i,
  /AI-Assisted-By:/i,
  /AI-Generated: true/i,
  /AI-Assistant:/i,
  /AI-Tool:/i,
  /AI-Model:/i,

  // Generic AI co-author email catch-all
  /Co-authored-by: .*<.*\bai\b.*@.*>/i,
  /\[ai-commit\]/i,
];

function getCommits() {
  try {
    const limit = process.env.COMMIT_LIMIT
      ? `-n ${process.env.COMMIT_LIMIT}`
      : "";
    // Get all commit messages, separated by a null byte; each block starts with short hash
    const output = execSync(
      `git log ${limit} --format="%h%x00%B%x00" --no-merges`,
    ).toString();
    const parts = output.split("\0");
    const commits = [];
    for (let i = 0; i < parts.length - 1; i += 2) {
      const hash = parts[i].trim();
      const body = parts[i + 1].trim();
      if (hash) {
        commits.push({ hash, body });
      }
    }
    return commits;
  } catch (error) {
    console.error("Error reading git log:", error.message);
    process.exit(1);
  }
}

function analyzeCommits(commits) {
  let aiCount = 0;
  let totalCount = commits.length;
  const debug = process.env.DEBUG === "true";

  commits.forEach((commit) => {
    const matchingPattern = AI_PATTERNS.find((pattern) =>
      pattern.test(commit.body),
    );
    if (matchingPattern) {
      aiCount++;
      if (debug) {
        console.log(
          `[DEBUG] AI commit ${commit.hash}: matched ${matchingPattern}`,
        );
      }
    }
  });

  const humanCount = totalCount - aiCount;
  const humanPercentage =
    totalCount > 0 ? Math.round((humanCount / totalCount) * 100) : 100;

  return {
    total: totalCount,
    ai: aiCount,
    human: humanCount,
    humanPercentage: humanPercentage,
  };
}

const commits = getCommits();
const stats = analyzeCommits(commits);

console.log("--- Stats ---");
console.log(`Total Commits: ${stats.total}`);
console.log(`Hand Crafted: ${stats.human} (${stats.humanPercentage}%)`);
console.log(`AI Co-edited: ${stats.ai}`);

// Save to a JSON for Shields.io or Action consumption
const shieldsData = {
  schemaVersion: 1,
  label: "hand crafted",
  message: `${stats.humanPercentage}%`,
  color:
    stats.humanPercentage > 80
      ? "green"
      : stats.humanPercentage > 50
        ? "yellow"
        : stats.humanPercentage > 20
          ? "orange"
          : "red",
};

const outputFile = process.env.OUTPUT_FILE || "hand-crafted-stats.json";
fs.writeFileSync(outputFile, JSON.stringify(shieldsData, null, 2));
console.log(`\nSaved stats to ${outputFile}`);

if (process.env.GITHUB_OUTPUT) {
  const outputLines = [
    `human-percentage=${stats.humanPercentage}`,
    `total-commits=${stats.total}`,
    `ai-commits=${stats.ai}`,
  ].join("\n");
  fs.appendFileSync(process.env.GITHUB_OUTPUT, outputLines + "\n");
}
