const {
  calculateBlastRadius
} = require("./blastRadius");

const {
  campaignTransactions
} = require("../../../index.js");

const {
  calculateRisk
} = require("../riskEngine.js");

const {
  detectCampaigns
} = require("./campaignDetector");

async function runTest() {
  console.log("\n===== BLAST RADIUS TEST =====\n");

  const transactions = campaignTransactions();

  const history = [];
  const riskResults = [];

  for (const transaction of transactions) {
    const result = await calculateRisk(
      transaction,
      history
    );

    riskResults.push(result);
    history.push(transaction);
  }

  const campaigns = detectCampaigns(riskResults);

  const blastRadius = calculateBlastRadius(
    riskResults,
    campaigns[0]
  );

  console.log("Campaign:");
  console.log(campaigns[0]);

  console.log("\nBlast Radius:");
  console.log(
    JSON.stringify(blastRadius, null, 2)
  );
}

runTest().catch((error) => {
  console.error("\nBlast radius test failed:");
  console.error(error);
});