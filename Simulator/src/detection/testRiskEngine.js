const { calculateRisk } = require("./riskEngine");
const {
  normalTransaction,
  highRiskTransaction,
  campaignTransactions
} = require("../simulator");

console.log("\n===== LAYER 1 RISK ENGINE TEST =====\n");

const history = [];

// Test normal transaction
const normal = normalTransaction();
const normalResult = calculateRisk(normal, history);

console.log("NORMAL TRANSACTION:");
console.log(normalResult);

history.push(normal);

// Test high-risk transaction
const highRisk = highRiskTransaction();
const highRiskResult = calculateRisk(highRisk, history);

console.log("\nHIGH-RISK TRANSACTION:");
console.log(highRiskResult);

history.push(highRisk);

// Test campaign transactions
const campaign = campaignTransactions();

console.log("\nCAMPAIGN TRANSACTIONS:");

campaign.forEach((transaction) => {
  const result = calculateRisk(transaction, history);

  console.log({
    accountId: result.accountId,
    amount: result.amount,
    deviceId: result.deviceId,
    recipientId: result.recipientId,
    riskLevel: result.riskLevel,
    riskReasons: result.riskReasons
  });

  history.push(transaction);
});