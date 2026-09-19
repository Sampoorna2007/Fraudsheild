const express = require("express");
const Transaction = require("../models/Transaction");
const Campaign = require("../models/Campaign");
const { emitEvent } = require("../socket/socket");

const {
    processCampaigns,
    createAttackTimeline,
    getBlastRadius
} = require("../detection/detectionService");

const router = express.Router();


// Receive Layer 1 result
router.post("/layer1", async (req, res) => {
    try {
        const {
            transactionId,
            accountId,
            amount,
            timestamp,
            deviceId,
            location,
            recipientId,
            riskLevel,
            riskReasons,
            anomaly,
            anomalyScore,
            velocity,
            locationChange
        } = req.body;

        const transaction =
            await Transaction.findOneAndUpdate(
                { transactionId },
                {
                    transactionId,
                    accountId,
                    amount,
                    timestamp,
                    deviceId,
                    location,
                    recipientId,
                    riskLevel,
                    riskReasons,
                    anomaly,
                    anomalyScore,
                    velocity,
                    locationChange
                },
                {
                    new: true,
                    upsert: true,
                    runValidators: true
                }
            );

        emitEvent(
            "transaction:new",
            transaction
        );

        if (
            riskLevel === "MEDIUM" ||
            riskLevel === "HIGH"
        ) {
            emitEvent(
                "alert:new",
                transaction
            );
        }

        res.status(200).json({
            message:
                "Layer 1 result received successfully",
            transaction
        });

    } catch (error) {
        res.status(400).json({
            message:
                "Failed to process Layer 1 result",
            error: error.message
        });
    }
});


// Run Layer 2 Campaign Discovery
router.post("/run-campaign-detection", async (req, res) => {
    try {

        const transactions =
            await Transaction.find({
                riskLevel: {
                    $in: ["MEDIUM", "HIGH"]
                }
            }).sort({
                timestamp: 1
            });

        const campaigns =
            processCampaigns(transactions);

        const savedCampaigns = [];

        for (const campaign of campaigns) {

            const savedCampaign =
                await Campaign.findOneAndUpdate(
                    {
                        campaignId:
                            campaign.campaignId
                    },
                    campaign,
                    {
                        new: true,
                        upsert: true,
                        runValidators: true
                    }
                );

            savedCampaigns.push(
                savedCampaign
            );

            emitEvent(
                "campaign:new",
                savedCampaign
            );
        }

        const timeline =
            createAttackTimeline(
                transactions,
                campaigns
            );

        let blastRadius = null;

        if (campaigns.length > 0) {
            blastRadius =
                getBlastRadius(
                    transactions,
                    campaigns[0]
                );
        }

        res.status(200).json({
            message:
                "Campaign detection completed",
            campaigns: savedCampaigns,
            timeline,
            blastRadius
        });

    } catch (error) {

        res.status(400).json({
            message:
                "Failed to run campaign detection",
            error: error.message
        });
    }
});


// Receive an externally generated Layer 2 campaign
router.post("/layer2", async (req, res) => {
    try {

        const campaign =
            await Campaign.findOneAndUpdate(
                {
                    campaignId:
                        req.body.campaignId
                },
                {
                    campaignId:
                        req.body.campaignId,
                    accountIds:
                        req.body.accountIds,
                    sharedDevices:
                        req.body.sharedDevices,
                    sharedRecipients:
                        req.body.sharedRecipients,
                    fraudDNA:
                        req.body.fraudDNA
                },
                {
                    new: true,
                    upsert: true,
                    runValidators: true
                }
            );

        emitEvent(
            "campaign:new",
            campaign
        );

        res.status(200).json({
            message:
                "Layer 2 campaign received successfully",
            campaign
        });

    } catch (error) {

        res.status(400).json({
            message:
                "Failed to process Layer 2 campaign",
            error: error.message
        });
    }
});


module.exports = router;