const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let commentSchema = new Schema({
    artworkId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    collectionId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    pCommentId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    message: {
        type: String,
        required: true,
    },
    postedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
});

module.exports = mongoose.model("Comment", commentSchema);
