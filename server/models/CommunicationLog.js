const mongoose = require("mongoose");

const CommunicationLogSchema = new mongoose.Schema({
  userId: String,
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  message: String,
  status: { type: String, enum: ["PENDING", "SENT", "FAILED"], default: "PENDING" },
  vendorMessageId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommunicationLog", CommunicationLogSchema);
