const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  rules: [Object],
  message: String,
  audienceSize: Number,
  sent: Number,
  failed: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Campaign", campaignSchema);
