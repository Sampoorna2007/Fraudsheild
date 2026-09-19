
const { detectAnomalyWithPython } = require("./ml/pythonBridge");

async function calculateRisk(transaction, history = []) {
  let score = 0;
  const riskReasons = [];

  const hour = new Date(transaction.timestamp).getUTCHours();

  // Calculate transaction velocity for this account.
  // Count previous transactions from the same account
  // within the last 5 minutes.
  const recentTransactions = history.filter((tx) => {
    if (tx.accountId !== transaction.accountId) return false;

    const difference =
      new Date(transaction.timestamp) - new Date(tx.timestamp);

    return difference >= 0 && difference <= 5 * 60 * 1000;
  });

  const velocity = recentTransactions.length + 1;

  // Check whether the account changed location.
  const previousTransaction = history.find(
    (tx) => tx.accountId === transaction.accountId
  );

  const locationChange =
    previousTransaction &&
    previousTransaction.location !== transaction.location
      ? 1
      : 0;

  // Isolation Forest anomaly detection
  const mlResult = await detectAnomalyWithPython({
    amount: transaction.amount,
    hour,
    velocity,
    locationChange
  });

  // 1. Unusual transaction amount
  if (transaction.amount >= 20000) {
    score++;
    riskReasons.push("Unusual transaction amount");
  }

  // 2. Unusual transaction time
  if (hour >= 0 && hour < 5) {
    score++;
    riskReasons.push("Unusual transaction time");
  }

  // 3. New / unrecognized device
  const previousDevice = history.find(
    (tx) => tx.accountId === transaction.accountId
  );

  if (
    previousDevice &&
    previousDevice.deviceId !== transaction.deviceId
  ) {
    score++;
    riskReasons.push("New or unrecognized device");
  }

  if (!previousDevice && transaction.deviceId.includes("NEW")) {
    score++;
    riskReasons.push("New or unrecognized device");
  }

  // 4. Unusual location
  if (locationChange === 1) {
    score++;
    riskReasons.push("Unusual location");
  }

  // 5. High transaction frequency / velocity
  if (recentTransactions.length >= 3) {
    score++;
    riskReasons.push("High transaction frequency or velocity");
  }

  // 6. Isolation Forest anomaly
  if (mlResult.anomaly) {
    riskReasons.push("Machine learning anomaly detected");
  }

  let riskLevel = "LOW";

  if (score >= 3) {
    riskLevel = "HIGH";
  } else if (score >= 2) {
    riskLevel = "MEDIUM";
  }

  return {
    ...transaction,
    riskLevel,
    riskReasons,
    anomaly: mlResult.anomaly,
    anomalyScore: mlResult.anomalyScore,
    velocity,
    locationChange
  };
}

module.exports = {
  calculateRisk
};

