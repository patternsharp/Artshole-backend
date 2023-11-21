const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let jobCategorySchema = new Schema({
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

module.exports = mongoose.model("JobCategory", jobCategorySchema);
