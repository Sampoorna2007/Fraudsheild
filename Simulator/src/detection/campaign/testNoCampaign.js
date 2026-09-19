const { detectCampaigns } = require("./campaignDetector");

const transactions = [
  {
    transactionId: "TX001",
    accountId: "ACC201",
    amount: 25000,
    timestamp: "2026-09-19T01:01:00Z",
    deviceId: "DEV201",
    location: "Bangalore",
    recipientId: "ACC701",
    riskLevel: "MEDIUM",
    riskReasons: ["Unusual transaction amount"]
  },

  {
    transactionId: "TX002",
    accountId: "ACC202",
    amount: 26000,
    timestamp: "2026-09-19T08:30:00Z",
    deviceId: "DEV202",
    location: "Mumbai",
    recipientId: "ACC702",
    riskLevel: "MEDIUM",
    riskReasons: ["Unusual transaction amount"]
  },

  {
    transactionId: "TX003",
    accountId: "ACC203",
    amount: 23000,
    timestamp: "2026-09-19T15:45:00Z",
    deviceId: "DEV203",
    location: "Delhi",
    recipientId: "ACC703",
    riskLevel: "HIGH",
    riskReasons: ["Unusual transaction amount"]
  }
];

console.log("\n===== LAYER 2 FALSE-POSITIVE TEST =====\n");

const campaigns = detectCampaigns(transactions);

console.log("Detected campaigns:");
console.log(JSON.stringify(campaigns, null, 2));

console.log(`\nCampaign count: ${campaigns.length}`);