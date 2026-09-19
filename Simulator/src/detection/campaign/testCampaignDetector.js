const { detectCampaigns } = require("./campaignDetector");

const { campaignTransactions } = require("../../../index.js");
const { calculateRisk } = require("../riskEngine.js");

async function runTest() {
  console.log("\n===== LAYER 2 CAMPAIGN DISCOVERY TEST =====\n");

  const transactions = campaignTransactions();

  const history = [];
  const riskResults = [];

  for (const transaction of transactions) {
    const result = await calculateRisk(transaction, history);

    riskResults.push(result);
    history.push(transaction);
  }

  console.log("LAYER 1 RESULTS:\n");

  riskResults.forEach((transaction) => {
    console.log({
      accountId: transaction.accountId,
      riskLevel: transaction.riskLevel,
      riskReasons: transaction.riskReasons,
      anomaly: transaction.anomaly,
      anomalyScore: transaction.anomalyScore
    });
  });

  const campaigns = detectCampaigns(riskResults);

  console.log("\nLAYER 2 CAMPAIGNS:\n");
  console.log(JSON.stringify(campaigns, null, 2));

  console.log(`\nDetected ${campaigns.length} campaign(s).`);
}

runTest().catch((error) => {
  console.error("\nLayer 2 test failed:");
  console.error(error);
});