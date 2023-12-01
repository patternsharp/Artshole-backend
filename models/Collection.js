const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let collectionSchema = new Schema({
  collectionTitle: {
    type: String,
    required: true,
  },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  coverImg: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  artworks: [{ type: Schema.Types.ObjectId, ref: "Artwork" }],
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
    required: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("Collection", collectionSchema);
