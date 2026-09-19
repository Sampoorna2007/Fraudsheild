const Graph = require("graphology");

/**
 * Layer 2: Campaign Discovery
 *
 * Suspicious accounts are connected when they share:
 * - Device
 * - Recipient
 * - Coordinated timing
 *
 * A connected group of 2+ suspicious accounts becomes a campaign.
 */

function detectCampaigns(transactions) {
  // Only MEDIUM and HIGH transactions enter Layer 2
  const suspiciousTransactions = transactions.filter(
    (tx) => tx.riskLevel === "MEDIUM" || tx.riskLevel === "HIGH"
  );

  const graph = new Graph();

  // Add account nodes
  suspiciousTransactions.forEach((tx) => {
    if (!graph.hasNode(tx.accountId)) {
      graph.addNode(tx.accountId, {
        type: "account"
      });
    }
  });

  // Connect related accounts
  for (let i = 0; i < suspiciousTransactions.length; i++) {
    for (let j = i + 1; j < suspiciousTransactions.length; j++) {
      const tx1 = suspiciousTransactions[i];
      const tx2 = suspiciousTransactions[j];

      const sharedDevice =
        tx1.deviceId === tx2.deviceId;

      const sharedRecipient =
        tx1.recipientId === tx2.recipientId;

      const timeDifference = Math.abs(
        new Date(tx1.timestamp) -
        new Date(tx2.timestamp)
      );

      const coordinatedTiming =
        timeDifference <= 5 * 60 * 1000;

      if (
        sharedDevice ||
        sharedRecipient ||
        coordinatedTiming
      ) {
        if (!graph.hasEdge(tx1.accountId, tx2.accountId)) {
          graph.addEdge(
            tx1.accountId,
            tx2.accountId,
            {
              sharedDevice,
              sharedRecipient,
              coordinatedTiming
            }
          );
        }
      }
    }
  }

  // No relationships = no campaign
  if (graph.size === 0) {
    return [];
  }

  /*
   * Find connected groups of accounts.
   *
   * This ensures strongly related accounts remain
   * together for our campaign detection.
   */
  const visited = new Set();
  const groups = [];

  function explore(accountId, group) {
    if (visited.has(accountId)) {
      return;
    }

    visited.add(accountId);
    group.push(accountId);

    graph.forEachNeighbor(accountId, (neighbor) => {
      explore(neighbor, group);
    });
  }

  graph.forEachNode((accountId) => {
    if (!visited.has(accountId)) {
      const group = [];
      explore(accountId, group);
      groups.push(group);
    }
  });

  const campaigns = [];

  groups.forEach((accountIds, index) => {
    // A campaign needs at least 2 accounts
    if (accountIds.length < 2) {
      return;
    }

    const campaignTransactions =
      suspiciousTransactions.filter((tx) =>
        accountIds.includes(tx.accountId)
      );

    const sharedDevices = [
      ...new Set(
        campaignTransactions.map(
          (tx) => tx.deviceId
        )
      )
    ];

    const sharedRecipients = [
      ...new Set(
        campaignTransactions.map(
          (tx) => tx.recipientId
        )
      )
    ];

    const timestamps =
      campaignTransactions.map(
        (tx) =>
          new Date(tx.timestamp).getTime()
      );

    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);

    const timingPattern =
      maxTime - minTime <= 5 * 60 * 1000
        ? "COORDINATED"
        : "NORMAL";

    const velocity =
      campaignTransactions.length >= 3
        ? "HIGH"
        : "NORMAL";

    campaigns.push({
      campaignId: `CMP${String(index + 1).padStart(3, "0")}`,

      accountIds,

      sharedDevices,

      sharedRecipients,

      fraudDNA: {
        velocity,

        sharedDevice:
          sharedDevices.length <
          campaignTransactions.length,

        sharedRecipient:
          sharedRecipients.length <
          campaignTransactions.length,

        timingPattern
      }
    });
  });

  return campaigns;
}

module.exports = {
  detectCampaigns
};