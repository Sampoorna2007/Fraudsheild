const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);

        res.status(201).json({
            message: "Transaction stored successfully",
            transaction
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to store transaction",
            error: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });

        res.json({
            transactions
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch transactions",
            error: error.message
        });
    }
});

router.get("/:transactionId", async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            transactionId: req.params.transactionId
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.json({
            transaction
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch transaction",
            error: error.message
        });
    }
});

module.exports = router;