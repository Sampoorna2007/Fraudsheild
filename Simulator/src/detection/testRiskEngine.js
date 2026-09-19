const { calculateRisk } = require("./riskEngine.js");

const {
  normalTransaction,
  highRiskTransaction,
  campaignTransactions,
  velocityAttackTransactions
} = require("../../index.js");
async function runTest() {
  console.log("\n===== LAYER 1 RISK ENGINE TEST =====\n");

  const history = [];

  // ---------------------------------------------------------
  // NORMAL TRANSACTION
  // ---------------------------------------------------------

  const normal = normalTransaction();

  const normalResult = await calculateRisk(normal, history);

  console.log("NORMAL TRANSACTION:");
  console.log({
    accountId: normalResult.accountId,
    amount: normalResult.amount,
    riskLevel: normalResult.riskLevel,
    riskReasons: normalResult.riskReasons,
    anomaly: normalResult.anomaly,
    anomalyScore: normalResult.anomalyScore,
    velocity: normalResult.velocity
  });

  history.push(normal);

  // ---------------------------------------------------------
  // SINGLE HIGH-RISK TRANSACTION
  // ---------------------------------------------------------

  const highRisk = highRiskTransaction();

  const highRiskResult = await calculateRisk(highRisk, history);

  console.log("\nHIGH-RISK TRANSACTION:");

  console.log({
    accountId: highRiskResult.accountId,
    amount: highRiskResult.amount,
    riskLevel: highRiskResult.riskLevel,
    riskReasons: highRiskResult.riskReasons,
    anomaly: highRiskResult.anomaly,
    anomalyScore: highRiskResult.anomalyScore,
    velocity: highRiskResult.velocity
  });

  history.push(highRisk);

  // ---------------------------------------------------------
  // COORDINATED CAMPAIGN
  // ---------------------------------------------------------

  const campaign = campaignTransactions();

  console.log("\nCAMPAIGN TRANSACTIONS:");

  for (const transaction of campaign) {
    const result = await calculateRisk(transaction, history);

    console.log({
      accountId: result.accountId,
      amount: result.amount,
      deviceId: result.deviceId,
      recipientId: result.recipientId,
      riskLevel: result.riskLevel,
      riskReasons: result.riskReasons,
      anomaly: result.anomaly,
      anomalyScore: result.anomalyScore,
      velocity: result.velocity
    });

    history.push(transaction);
  }

  // ---------------------------------------------------------
  // VELOCITY / SMURFING ATTACK
  // ---------------------------------------------------------

  const velocityAttack = velocityAttackTransactions();

  console.log("\nVELOCITY / SMURFING ATTACK:");

  for (const transaction of velocityAttack) {
    const result = await calculateRisk(transaction, history);

    console.log({
      transactionId: result.transactionId,
      accountId: result.accountId,
      amount: result.amount,
      recipientId: result.recipientId,
      riskLevel: result.riskLevel,
      riskReasons: result.riskReasons,
      anomaly: result.anomaly,
      anomalyScore: result.anomalyScore,
      velocity: result.velocity
    });

    history.push(transaction);
  }
}

runTest().catch((error) => {
  console.error("\nLayer 1 test failed:");
  console.error(error);
});