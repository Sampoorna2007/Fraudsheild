const {
  createTimeline,
  replayTimeline
} = require("./attackTimeline");

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
  console.log("\n===== ATTACK TIMELINE / REPLAY TEST =====\n");

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

  const timeline = createTimeline(
    riskResults,
    campaigns
  );

  const replay = replayTimeline(timeline);

  console.log("TIMELINE:\n");
  console.log(
    JSON.stringify(timeline, null, 2)
  );

  console.log("\nREPLAY STEPS:\n");
  console.log(
    JSON.stringify(replay, null, 2)
  );

  console.log(
    `\nTimeline events: ${timeline.length}`
  );

  console.log(
    `Replay steps: ${replay.length}`
  );
}

runTest().catch((error) => {
  console.error("\nTimeline test failed:");
  console.error(error);
});