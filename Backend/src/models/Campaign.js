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
                type: Number,
                default: 0
            },

            sharedDevice: {
                type: Number,
                default: 0
            },

            sharedRecipient: {
                type: Number,
                default: 0
            },

            timingPattern: {
    type: Number,
    default: 0
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