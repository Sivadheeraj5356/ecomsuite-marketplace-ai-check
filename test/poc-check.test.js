import test from "node:test";
import assert from "node:assert/strict";
import { checkMarketplacePoc } from "../src/poc-check.js";

const readyPoc = {
  sellerProblem: "Marketplace sellers struggle to choose search keywords that match buyer demand without manual spreadsheet review.",
  useCase: "keyword-recommendation",
  inputData: "Seller-owned product titles, category metadata, and anonymized historical search-term exports.",
  modelFamily: "Text embeddings with a lightweight ranking model and deterministic fallback rules.",
  baseline: "Compare against the seller's current 20-keyword manual list for the same product set.",
  evaluationMetric: "Improve top-20 keyword precision by at least 10% on reviewed examples.",
  limitation: "The first PoC cannot prove conversion lift until marketplace traffic data is available.",
  reviewOwner: "E-commerce product reviewer"
};

test("accepts a complete marketplace AI PoC", () => {
  const report = checkMarketplacePoc(readyPoc);
  assert.equal(report.ready, true);
  assert.equal(report.score, "10/10");
});

test("rejects an unsupported use case", () => {
  const report = checkMarketplacePoc({ ...readyPoc, useCase: "unrelated-chatbot" });
  assert.equal(report.checks.find((check) => check.id === "supported-use-case").passed, false);
});

test("rejects a missing seller problem", () => {
  const report = checkMarketplacePoc({ ...readyPoc, sellerProblem: "" });
  assert.equal(report.checks.find((check) => check.id === "sellerProblem").passed, false);
});

test("rejects missing input data", () => {
  const report = checkMarketplacePoc({ ...readyPoc, inputData: "" });
  assert.equal(report.checks.find((check) => check.id === "inputData").passed, false);
});

test("requires a measurable evaluation", () => {
  const report = checkMarketplacePoc({ ...readyPoc, baseline: "current process", evaluationMetric: "good quality" });
  assert.equal(report.checks.find((check) => check.id === "measurable-evaluation").passed, false);
});

test("requires a limitation and reviewer", () => {
  const report = checkMarketplacePoc({ ...readyPoc, limitation: "TBD", reviewOwner: "team" });
  assert.equal(report.checks.find((check) => check.id === "limitation").passed, false);
  assert.equal(report.checks.find((check) => check.id === "reviewOwner").passed, false);
});
