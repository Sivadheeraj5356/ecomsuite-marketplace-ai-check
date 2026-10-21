const USE_CASES = new Set(["keyword-recommendation", "listing-optimization", "customer-behavior-prediction"]);
const REQUIRED_FIELDS = [
  ["sellerProblem", "The PoC names the marketplace seller problem"],
  ["useCase", "The PoC names the AI use case"],
  ["inputData", "The PoC names the input data and owner"],
  ["modelFamily", "The PoC names the model or framework family to test"],
  ["baseline", "The PoC defines the current process or baseline"],
  ["evaluationMetric", "The PoC defines a measurable quality metric"],
  ["limitation", "The PoC records one known feasibility or data limitation"],
  ["reviewOwner", "The PoC names the person who reviews the result"]
];

export function checkMarketplacePoc(poc) {
  const checks = REQUIRED_FIELDS.map(([field, label]) => ({
    id: field,
    label,
    passed: typeof poc[field] === "string" && poc[field].trim().length >= 8,
    fix: `Add a specific ${field} entry before running the PoC.`
  }));

  checks.push({
    id: "supported-use-case",
    label: "The use case is keyword recommendation, listing optimization, or customer behavior prediction",
    passed: USE_CASES.has(String(poc.useCase || "").toLowerCase()),
    fix: "Use a mapped eComSuite use case."
  });

  checks.push({
    id: "measurable-evaluation",
    label: "The baseline or evaluation metric includes a numeric comparison",
    passed: /\d/.test(`${poc.baseline || ""} ${poc.evaluationMetric || ""}`),
    fix: "Add a numeric baseline, target, or comparison."
  });

  const passed = checks.filter((check) => check.passed).length;
  return {
    ready: passed === checks.length,
    score: `${passed}/${checks.length}`,
    checks
  };
}
