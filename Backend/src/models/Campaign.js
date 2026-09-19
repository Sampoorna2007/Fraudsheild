const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
    {
        campaignId: {
            type: String,
            required: true,
            unique: true
        },

        accountIds: {
            type: [String],
            required: true
        },

        sharedDevices: {
            type: [String],
            default: []
        },

        sharedRecipients: {
            type: [String],
            default: []
        },

        fraudDNA: {
            velocity: {
                type: String,
                default: "LOW"
            },

            sharedDevice: {
                type: Boolean,
                default: false
            },

            sharedRecipient: {
                type: Boolean,
                default: false
            },

            timingPattern: {
                type: String,
                default: "NONE"
            }
        },

        status: {
            type: String,
            enum: ["WATCH", "CONFIRMED", "DISMISSED"],
            default: "WATCH"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Campaign", campaignSchema);