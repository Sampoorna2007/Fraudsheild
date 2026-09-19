const { faker } = require("@faker-js/faker");

function createTransaction(overrides = {}) {
  return {
    transactionId: faker.string.uuid(),
    accountId: `ACC${faker.string.numeric(3)}`,
    amount: faker.number.int({ min: 500, max: 10000 }),
    timestamp: new Date().toISOString(),
    deviceId: `DEV${faker.string.numeric(3)}`,
    location: faker.helpers.arrayElement([
      "Bangalore",
      "Mumbai",
      "Delhi",
      "Chennai",
      "Hyderabad"
    ]),
    recipientId: `ACC${faker.string.numeric(3)}`,
    ...overrides
  };
}

// 1. Normal transaction
function normalTransaction() {
  return createTransaction();
}

// 2. Clear single high-risk transaction
function highRiskTransaction() {
  return createTransaction({
    accountId: "ACC999",
    amount: 50000,
    timestamp: new Date("2026-09-19T01:15:00Z").toISOString(),
    deviceId: "DEV_NEW_999",
    location: "Delhi",
    recipientId: "ACC501"
  });
}

// 3. Hidden coordinated campaign
function campaignTransactions() {
  const sharedDevice = "DEV_CAMPAIGN_01";
  const sharedRecipient = "ACC500";

 return [
  createTransaction({
    accountId: "ACC101",
    amount: 22000,
    timestamp: new Date("2026-09-19T01:01:00Z").toISOString(),
    deviceId: "DEV_CAMPAIGN_01",
    location: "Bangalore",
    recipientId: sharedRecipient
  }),

  createTransaction({
    accountId: "ACC102",
    amount: 24000,
    timestamp: new Date("2026-09-19T01:02:00Z").toISOString(),
    deviceId: "DEV_CAMPAIGN_01",
    location: "Bangalore",
    recipientId: sharedRecipient
  }),

  createTransaction({
    accountId: "ACC103",
    amount: 21000,
    timestamp: new Date("2026-09-19T01:03:00Z").toISOString(),
    deviceId: "DEV_CAMPAIGN_01",
    location: "Bangalore",
    recipientId: sharedRecipient
  })
];
}

// Demo stream
const transactions = [];

// Normal stream
for (let i = 0; i < 10; i++) {
  transactions.push(normalTransaction());
}

// Single suspicious transaction
transactions.push(highRiskTransaction());

// Hidden coordinated campaign
transactions.push(...campaignTransactions());

console.log("\n=== FRAUD SHIELD TRANSACTION SIMULATOR ===\n");

transactions.forEach((transaction) => {
  console.log(JSON.stringify(transaction, null, 2));
});

console.log(`\nGenerated ${transactions.length} transactions.`);

module.exports = {
  normalTransaction,
  highRiskTransaction,
  campaignTransactions
};
