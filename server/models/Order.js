const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  amount: Number,
  product: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
