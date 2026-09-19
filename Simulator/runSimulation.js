const axios = require("axios");
const { generateSimulation } = require("./index");
const { calculateRisk } = require("./src/detection/riskEngine");
const { detectCampaigns } = require("./src/detection/campaign/campaignDetector");

async function runSimulation() {
  console.log("\n=== FRAUD SHIELD END-TO-END SIMULATION ===\n");

  const transactions = generateSimulation();

  // Layer 1: Risk detection
  const analysedTransactions = [];

for (const transaction of transactions) {
  const result = await calculateRisk(transaction);
  analysedTransactions.push(result);

  console.log(
    result.transactionId,
    "→",
    result.riskLevel
  );

  await axios.post(
    "http://localhost:5000/api/detection/layer1",
    result
  );
}

  // Layer 2: Campaign detection
  const campaigns = detectCampaigns(analysedTransactions);

console.log("\n=== CAMPAIGNS DETECTED ===\n");
console.log(JSON.stringify(campaigns, null, 2));

for (const campaign of campaigns) {
  await axios.post(
    "http://localhost:5000/api/detection/layer2",
    {
      campaignId: campaign.campaignId,
      accountIds: campaign.accountIds,
      sharedDevices: campaign.sharedDevices,
      sharedRecipients: campaign.sharedRecipients,
      fraudDNA: {
        velocity: campaign.fraudDNA.velocity,
        sharedDevice: campaign.fraudDNA.sharedDevice,
        sharedRecipient: campaign.fraudDNA.sharedRecipient,
        timingPattern: campaign.fraudDNA.timingSync
      }
    }
  );

  console.log(
    "Campaign sent to backend:",
    campaign.campaignId
  );
}
}

runSimulation().catch((error) => {
  console.error("Simulation failed:", error);
});