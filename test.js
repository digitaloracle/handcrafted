const fs = require("fs");
const path = require("path");

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

function isAiCommit(body) {
  return AI_PATTERNS.some((pattern) => pattern.test(body));
}

const expectations = {
  "ai.txt": "AI",
  "ai-test.txt": "AI",
  "cursor.txt": "AI",
  "windsurf.txt": "HUMAN",
  "human.txt": "HUMAN",
  "init.txt": "HUMAN",
};

const testDataDir = path.join(__dirname, "test-data");
const files = fs
  .readdirSync(testDataDir)
  .filter((f) => f.endsWith(".txt"))
  .sort();

let allPassed = true;

for (const file of files) {
  const body = fs.readFileSync(path.join(testDataDir, file), "utf-8");
  const actual = isAiCommit(body) ? "AI" : "HUMAN";
  const expected = expectations[file];

  if (!expected) {
    console.log(`SKIP  ${file} (no expectation defined)`);
    continue;
  }

  if (actual === expected) {
    console.log(`PASS  ${file} (${actual})`);
  } else {
    console.log(`FAIL  ${file}: expected ${expected}, got ${actual}`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log("\nAll tests passed.");
  process.exit(0);
} else {
  console.log("\nSome tests failed.");
  process.exit(1);
}
