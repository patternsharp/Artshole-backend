const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let artistCategorySchema = new Schema({
  name: {
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

module.exports = mongoose.model("ArtistCategory", artistCategorySchema);
