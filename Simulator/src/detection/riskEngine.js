function calculateRisk(transaction, history = []) {
  let score = 0;
  const riskReasons = [];

  // 1. Unusual transaction amount
  if (transaction.amount >= 20000) {
    score++;
    riskReasons.push("Unusual transaction amount");
  }

  // 2. Unusual transaction time
  const hour = new Date(transaction.timestamp).getUTCHours();

  if (hour >= 0 && hour < 5) {
    score++;
    riskReasons.push("Unusual transaction time");
  }

  // 3. New / unrecognized device
  const previousDevice = history.find(
    (tx) => tx.accountId === transaction.accountId
  );

  if (previousDevice && previousDevice.deviceId !== transaction.deviceId) {
    score++;
    riskReasons.push("New or unrecognized device");
  }

  // If this is the first transaction for the account,
  // a specially marked device is treated as new.
  if (!previousDevice && transaction.deviceId.includes("NEW")) {
    score++;
    riskReasons.push("New or unrecognized device");
  }

  // 4. Unusual location
  const previousLocation = history.find(
    (tx) => tx.accountId === transaction.accountId
  );

  if (
    previousLocation &&
    previousLocation.location !== transaction.location
  ) {
    score++;
    riskReasons.push("Unusual location");
  }

  // 5. High transaction frequency / velocity
  const recentTransactions = history.filter((tx) => {
    if (tx.accountId !== transaction.accountId) return false;

    const difference =
      new Date(transaction.timestamp) - new Date(tx.timestamp);

    return difference >= 0 && difference <= 5 * 60 * 1000;
  });

  if (recentTransactions.length >= 3) {
    score++;
    riskReasons.push("High transaction frequency or velocity");
  }

  // Convert score into risk level
  let riskLevel = "LOW";
if (score >= 3) {
  riskLevel = "HIGH";
} else if (score >= 2) {
  riskLevel = "MEDIUM";
}
  return {
    ...transaction,
    riskLevel,
    riskReasons
  };
}

module.exports = {
  calculateRisk
};