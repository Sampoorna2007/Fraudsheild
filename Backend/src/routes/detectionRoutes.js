const express = require("express");
const Transaction = require("../models/Transaction");
const { emitEvent } = require("../socket/socket");

const router = express.Router();

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
            anomalyScore
        } = req.body;

        const transaction = await Transaction.findOneAndUpdate(
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
                anomalyScore
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        emitEvent("transaction:new", transaction);

        if (riskLevel === "MEDIUM" || riskLevel === "HIGH") {
            emitEvent("alert:new", transaction);
        }

        res.status(200).json({
            message: "Layer 1 result received successfully",
            transaction
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to process Layer 1 result",
            error: error.message
        });
    }
});

router.post("/layer2", async (req, res) => {
    try {
        const Campaign = require("../models/Campaign");

        const campaign = await Campaign.findOneAndUpdate(
            { campaignId: req.body.campaignId },
            {
                campaignId: req.body.campaignId,
                accountIds: req.body.accountIds,
                sharedDevices: req.body.sharedDevices,
                sharedRecipients: req.body.sharedRecipients,
                fraudDNA: req.body.fraudDNA
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        emitEvent("campaign:new", campaign);

        res.status(200).json({
            message: "Layer 2 campaign received successfully",
            campaign
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to process Layer 2 campaign",
            error: error.message
        });
    }
});

module.exports = router;