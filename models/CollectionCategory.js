const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let collectionCategorySchema = new Schema({
  itemTitle: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CollectionCategory", collectionCategorySchema);
