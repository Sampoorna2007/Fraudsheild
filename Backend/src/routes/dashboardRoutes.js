const express = require("express");
const Transaction = require("../models/Transaction");
const Campaign = require("../models/Campaign");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const totalTransactions = await Transaction.countDocuments();

        const highRiskTransactions = await Transaction.countDocuments({
            riskLevel: "HIGH"
        });

        const mediumRiskTransactions = await Transaction.countDocuments({
            riskLevel: "MEDIUM"
        });

        const lowRiskTransactions = await Transaction.countDocuments({
            riskLevel: "LOW"
        });

        const totalCampaigns = await Campaign.countDocuments();

        const confirmedCampaigns = await Campaign.countDocuments({
            status: "CONFIRMED"
        });

        const watchCampaigns = await Campaign.countDocuments({
            status: "WATCH"
        });

        const dismissedCampaigns = await Campaign.countDocuments({
            status: "DISMISSED"
        });

        res.json({
            totalTransactions,
            highRiskTransactions,
            mediumRiskTransactions,
            lowRiskTransactions,
            totalCampaigns,
            confirmedCampaigns,
            watchCampaigns,
            dismissedCampaigns
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
});

module.exports = router;