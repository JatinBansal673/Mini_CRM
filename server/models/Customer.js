const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  totalSpend: Number,
  visits: Number,
  lastVisit: Date
});

module.exports = mongoose.model("Customer", customerSchema);