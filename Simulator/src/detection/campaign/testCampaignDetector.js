const {
  detectCampaigns
} = require("./campaignDetector");

const {
  campaignTransactions
} = require("../../simulator");

const {
  calculateRisk
} = require("../riskEngine");

console.log("\n===== LAYER 2 CAMPAIGN DISCOVERY TEST =====\n");

// Generate campaign transactions
const transactions = campaignTransactions();

// First pass them through Layer 1
const riskResults = transactions.map((transaction) =>
  calculateRisk(transaction, [])
);

console.log("LAYER 1 RESULTS:\n");

riskResults.forEach((transaction) => {
  console.log({
    accountId: transaction.accountId,
    riskLevel: transaction.riskLevel,
    riskReasons: transaction.riskReasons
  });
});

// Send Layer 1 results into Layer 2
const campaigns = detectCampaigns(riskResults);

console.log("\nLAYER 2 CAMPAIGNS:\n");

console.log(JSON.stringify(campaigns, null, 2));

console.log(
  `\nDetected ${campaigns.length} campaign(s).`
);