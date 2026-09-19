const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true
        },

        accountId: {
            type: String,
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        timestamp: {
            type: Date,
            required: true
        },

        deviceId: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        recipientId: {
            type: String,
            required: true
        },

        riskLevel: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "LOW"
        },

        riskReasons: {
            type: [String],
            default: []
        },

        anomaly: {
    type: Boolean,
    default: false
},

anomalyScore: {
    type: Number,
    default: null
},

        campaignId: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);