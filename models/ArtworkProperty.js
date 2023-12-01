const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let artworkPropertySchema = new Schema({
  itemTitle: { type: String, required: true },
  parentId: { type: String, default: "0" },
  createdAt: { type: Date, default: Date.now },
  lastUpdatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ArtworkProperty", artworkPropertySchema);
