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

// ---------------------------------------------------------
// NORMAL TRANSACTION
// ---------------------------------------------------------

function normalTransaction() {
  return createTransaction();
}

// ---------------------------------------------------------
// SINGLE HIGH-RISK TRANSACTION
// ---------------------------------------------------------

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

// ---------------------------------------------------------
// COORDINATED CAMPAIGN
// ---------------------------------------------------------

function campaignTransactions() {
  const sharedDevice = "DEV_CAMPAIGN_01";
  const sharedRecipient = "ACC500";

  return [
    createTransaction({
      accountId: "ACC101",
      amount: 22000,
      timestamp: new Date("2026-09-19T01:01:00Z").toISOString(),
      deviceId: sharedDevice,
      location: "Bangalore",
      recipientId: sharedRecipient
    }),

    createTransaction({
      accountId: "ACC102",
      amount: 24000,
      timestamp: new Date("2026-09-19T01:02:00Z").toISOString(),
      deviceId: sharedDevice,
      location: "Bangalore",
      recipientId: sharedRecipient
    }),

    createTransaction({
      accountId: "ACC103",
      amount: 21000,
      timestamp: new Date("2026-09-19T01:03:00Z").toISOString(),
      deviceId: sharedDevice,
      location: "Bangalore",
      recipientId: sharedRecipient
    })
  ];
}

// ---------------------------------------------------------
// VELOCITY / SMURFING ATTACK
// ---------------------------------------------------------
// One account performs many small transactions rapidly
// to different recipients.
//
// This simulates a suspicious burst without relying on
// unusually large transaction amounts.
// ---------------------------------------------------------

function velocityAttackTransactions() {
  const accountId = "ACC888";
  const deviceId = "DEV_VELOCITY_01";
  const location = "Mumbai";

  const transactions = [
    {
      amount: 1900,
      timestamp: "2026-09-19T02:10:00Z",
      recipientId: "ACC601"
    },
    {
      amount: 2100,
      timestamp: "2026-09-19T02:11:00Z",
      recipientId: "ACC602"
    },
    {
      amount: 1800,
      timestamp: "2026-09-19T02:12:00Z",
      recipientId: "ACC603"
    },
    {
      amount: 2200,
      timestamp: "2026-09-19T02:13:00Z",
      recipientId: "ACC604"
    },
    {
      amount: 2000,
      timestamp: "2026-09-19T02:14:00Z",
      recipientId: "ACC605"
    }
  ];

  return transactions.map((transaction) =>
    createTransaction({
      accountId,
      amount: transaction.amount,
      timestamp: new Date(transaction.timestamp).toISOString(),
      deviceId,
      location,
      recipientId: transaction.recipientId
    })
  );
}

// ---------------------------------------------------------
// GENERATE SIMULATION DATA
// ---------------------------------------------------------

const transactions = [];

// Normal traffic
for (let i = 0; i < 10; i++) {
  transactions.push(normalTransaction());
}

// Single suspicious transaction
transactions.push(highRiskTransaction());

// Coordinated fraud campaign
transactions.push(...campaignTransactions());

// Velocity / smurfing attack
transactions.push(...velocityAttackTransactions());

// ---------------------------------------------------------
// DISPLAY SIMULATION
// ---------------------------------------------------------

console.log("\n=== FRAUD SHIELD TRANSACTION SIMULATOR ===\n");

transactions.forEach((transaction) => {
  console.log(JSON.stringify(transaction, null, 2));
});

console.log(`\nGenerated ${transactions.length} transactions.`);

// ---------------------------------------------------------
// EXPORT SCENARIOS
// ---------------------------------------------------------

module.exports = {
  normalTransaction,
  highRiskTransaction,
  campaignTransactions,
  velocityAttackTransactions
};