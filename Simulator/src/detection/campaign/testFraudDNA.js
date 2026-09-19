const { calculateFraudDNA } = require("./fraudDNA");

const { campaignTransactions } = require("../../../index.js");

console.log("\n===== FRAUD DNA TEST =====\n");

const transactions = campaignTransactions();

const fraudDNA = calculateFraudDNA(transactions);

console.log("Fraud DNA:");
console.log(JSON.stringify(fraudDNA, null, 2));