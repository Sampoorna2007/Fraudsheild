function calculateFraudDNA(transactions) {
  if (!transactions || transactions.length === 0) {
    return {
      velocity: 0,
      sharedDevice: 0,
      sharedRecipient: 0,
      timingSync: 0
    };
  }

  // -----------------------------
  // VELOCITY
  // -----------------------------
  const velocity = transactions.length;

  // -----------------------------
  // DEVICE REUSE
  // -----------------------------
  const deviceCounts = {};

  transactions.forEach((tx) => {
    deviceCounts[tx.deviceId] =
      (deviceCounts[tx.deviceId] || 0) + 1;
  });

  const sharedDevice = Object.values(deviceCounts)
    .some((count) => count > 1)
    ? 1
    : 0;

  // -----------------------------
  // RECIPIENT REUSE
  // -----------------------------
  const recipientCounts = {};

  transactions.forEach((tx) => {
    recipientCounts[tx.recipientId] =
      (recipientCounts[tx.recipientId] || 0) + 1;
  });

  const sharedRecipient = Object.values(recipientCounts)
    .some((count) => count > 1)
    ? 1
    : 0;

  // -----------------------------
  // TIMING SYNCHRONIZATION
  // -----------------------------
  const timestamps = transactions.map((tx) =>
    new Date(tx.timestamp).getTime()
  );

  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);

  const timingSync =
    maxTime - minTime <= 5 * 60 * 1000
      ? 1
      : 0;

  return {
    velocity,
    sharedDevice,
    sharedRecipient,
    timingSync
  };
}

module.exports = {
  calculateFraudDNA
};