const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let videoSchema = new Schema({
  videoLink: {
    type: String,
    required: true,
  },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  description: {
    type: String,
    required: true,
  },
  favorited: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  liked: [{ type: Schema.Types.ObjectId, ref: "User" }],
  viewed: [{ type: Schema.Types.ObjectId, ref: "User" }],
  shared: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  blockedAt: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Video", videoSchema);
