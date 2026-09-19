const { calculateRisk } = require("./riskEngine");

async function runTest() {
  console.log("\n===== VELOCITY DETECTION TEST =====\n");

  const history = [];

  const transactions = [
    {
      transactionId: "VEL001",
      accountId: "ACC777",
      amount: 2000,
      timestamp: "2026-09-19T10:00:00Z",
      deviceId: "DEV777",
      location: "Bangalore",
      recipientId: "ACC100"
    },
    {
      transactionId: "VEL002",
      accountId: "ACC777",
      amount: 2200,
      timestamp: "2026-09-19T10:01:00Z",
      deviceId: "DEV777",
      location: "Bangalore",
      recipientId: "ACC101"
    },
    {
      transactionId: "VEL003",
      accountId: "ACC777",
      amount: 1800,
      timestamp: "2026-09-19T10:02:00Z",
      deviceId: "DEV777",
      location: "Bangalore",
      recipientId: "ACC102"
    },
    {
      transactionId: "VEL004",
      accountId: "ACC777",
      amount: 2100,
      timestamp: "2026-09-19T10:03:00Z",
      deviceId: "DEV777",
      location: "Bangalore",
      recipientId: "ACC103"
    }
  ];

  for (const transaction of transactions) {
    const result = await calculateRisk(transaction, history);

    console.log({
      transactionId: result.transactionId,
      velocity: result.velocity,
      riskLevel: result.riskLevel,
      riskReasons: result.riskReasons,
      anomaly: result.anomaly,
      anomalyScore: result.anomalyScore
    });

    history.push(transaction);
  }
}

runTest().catch((error) => {
  console.error("\nVelocity test failed:");
  console.error(error);
});