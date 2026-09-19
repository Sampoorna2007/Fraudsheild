const express = require("express");
const Campaign = require("../models/Campaign");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const campaign = await Campaign.create(req.body);

        res.status(201).json({
            message: "Campaign stored successfully",
            campaign
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to store campaign",
            error: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ createdAt: -1 });

        res.json({
            campaigns
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch campaigns",
            error: error.message
        });
    }
});

router.get("/:campaignId", async (req, res) => {
    try {
        const campaign = await Campaign.findOne({
            campaignId: req.params.campaignId
        });

        if (!campaign) {
            return res.status(404).json({
                message: "Campaign not found"
            });
        }

        res.json({
            campaign
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch campaign",
            error: error.message
        });
    }
});

router.patch("/:campaignId/status", async (req, res) => {
    try {
        const { status } = req.body;

        if (!["WATCH", "CONFIRMED", "DISMISSED"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const campaign = await Campaign.findOneAndUpdate(
            { campaignId: req.params.campaignId },
            { status },
            { new: true }
        );

        if (!campaign) {
            return res.status(404).json({
                message: "Campaign not found"
            });
        }

        res.json({
            message: "Campaign status updated successfully",
            campaign
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update campaign status",
            error: error.message
        });
    }
});

module.exports = router;