const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let notificationSchema = new Schema({
    toUser: { type: Schema.Types.ObjectId, ref: 'User' },
    fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
    notificationContent: {
        type: String,
        required: true,
    },
    type: {
        type: String,
    },
    isUnRead: {
        type: Boolean,  // read, unread status
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model("Notification", notificationSchema);
