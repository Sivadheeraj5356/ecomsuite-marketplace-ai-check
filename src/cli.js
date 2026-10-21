#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { checkMarketplacePoc } from "./poc-check.js";

const [pocPath] = process.argv.slice(2);
if (!pocPath) {
  console.error("Usage: npm run check -- <marketplace-ai-poc.json>");
  process.exit(1);
}

const poc = JSON.parse(await readFile(pocPath, "utf8"));
const report = checkMarketplacePoc(poc);
console.log(`Marketplace AI PoC readiness: ${report.score} (${report.ready ? "ready" : "needs work"})`);
for (const check of report.checks) {
  console.log(`${check.passed ? "PASS" : "FAIL"} ${check.id}: ${check.label}`);
  if (!check.passed) console.log(`  Next: ${check.fix}`);
}
