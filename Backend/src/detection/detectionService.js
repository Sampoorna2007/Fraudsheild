const path = require("path");

const detectionPath = path.resolve(
    __dirname,
    "../../../Simulator/src/detection"
);

const { calculateRisk } = require(
    path.join(detectionPath, "riskEngine.js")
);

const { detectCampaigns } = require(
    path.join(detectionPath, "campaign/campaignDetector.js")
);

const {
    createTimeline,
    replayTimeline
} = require(
    path.join(detectionPath, "campaign/attackTimeline.js")
);

const {
    calculateBlastRadius
} = require(
    path.join(detectionPath, "campaign/blastRadius.js")
);

async function processTransaction(transaction, history = []) {
    const riskResult = await calculateRisk(
        transaction,
        history
    );

    return riskResult;
}

function processCampaigns(transactions) {
    return detectCampaigns(transactions);
}

function createAttackTimeline(transactions, campaigns) {
    return createTimeline(
        transactions,
        campaigns
    );
}

function createReplay(events) {
    return replayTimeline(events);
}

function getBlastRadius(transactions, campaign) {
    return calculateBlastRadius(
        transactions,
        campaign
    );
}

module.exports = {
    processTransaction,
    processCampaigns,
    createAttackTimeline,
    createReplay,
    getBlastRadius
};