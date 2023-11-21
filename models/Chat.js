const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        unreadCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);