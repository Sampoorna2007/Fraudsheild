function calculateBlastRadius(transactions, campaign) {
  if (!campaign) {
    return {
      accountCount: 0,
      transactionCount: 0,
      recipientCount: 0,
      deviceCount: 0
    };
  }

  const campaignTransactions = transactions.filter((tx) =>
    campaign.accountIds.includes(tx.accountId)
  );

  const affectedAccounts = new Set(
    campaignTransactions.map((tx) => tx.accountId)
  );

  const affectedRecipients = new Set(
    campaignTransactions.map((tx) => tx.recipientId)
  );

  const affectedDevices = new Set(
    campaignTransactions.map((tx) => tx.deviceId)
  );

  return {
    accountCount: affectedAccounts.size,
    transactionCount: campaignTransactions.length,
    recipientCount: affectedRecipients.size,
    deviceCount: affectedDevices.size
  };
}

module.exports = {
  calculateBlastRadius
};
