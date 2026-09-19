function createTimeline(transactions, campaigns = []) {
  const events = [];

  transactions.forEach((tx) => {
    events.push({
      timestamp: tx.timestamp,
      type: "TRANSACTION",
      accountId: tx.accountId,
      transactionId: tx.transactionId,
      message: `Transaction of ₹${tx.amount} detected`
    });

    if (tx.anomaly) {
      events.push({
        timestamp: tx.timestamp,
        type: "ANOMALY",
        accountId: tx.accountId,
        transactionId: tx.transactionId,
        message: "Machine learning anomaly detected"
      });
    }

    if (tx.riskLevel === "MEDIUM" || tx.riskLevel === "HIGH") {
      events.push({
        timestamp: tx.timestamp,
        type: "RISK_ALERT",
        accountId: tx.accountId,
        transactionId: tx.transactionId,
        riskLevel: tx.riskLevel,
        message: `${tx.riskLevel} risk transaction detected`
      });
    }
  });

  campaigns.forEach((campaign) => {
    const firstTransaction = transactions
      .filter((tx) => campaign.accountIds.includes(tx.accountId))
      .sort(
        (a, b) =>
          new Date(a.timestamp) - new Date(b.timestamp)
      )[0];

    events.push({
      timestamp: firstTransaction
        ? firstTransaction.timestamp
        : new Date().toISOString(),
      type: "CAMPAIGN_DETECTED",
      campaignId: campaign.campaignId,
      accountIds: campaign.accountIds,
      message: `Campaign ${campaign.campaignId} detected`
    });

    events.push({
      timestamp: firstTransaction
        ? firstTransaction.timestamp
        : new Date().toISOString(),
      type: "FRAUD_DNA",
      campaignId: campaign.campaignId,
      fraudDNA: campaign.fraudDNA,
      message: "Fraud DNA generated"
    });
  });

  events.sort(
    (a, b) =>
      new Date(a.timestamp) - new Date(b.timestamp)
  );

  return events;
}

function replayTimeline(events) {
  return events.map((event, index) => ({
    step: index + 1,
    ...event
  }));
}

module.exports = {
  createTimeline,
  replayTimeline
};