const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let artworkSchema = new Schema({
  artworkTitle: {
    type: String,
  },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  artworkImg: {
    type: Array,
    default: [],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  category: {
    type: String, // painting, photography...
  },
  propertyList: [{ type: Schema.Types.ObjectId, ref: "ArtworkProperty" }],
  year: {
    type: String,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  depth: {
    type: Number,
  },
  status: {
    type: Boolean, // available: true , sold: false
  },
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
  },
});

module.exports = mongoose.model("Artwork", artworkSchema);
