const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const Customer = require("../models/Customer");
const CommunicationLog = require("../models/CommunicationLog");
const axios = require("axios");

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// Create a campaign and dispatch messages
router.post("/", isAuthenticated, async (req, res) => {
  const { rules, message } = req.body;

  if (!rules || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Convert rules into MongoDB query
    const query = {};

for (const rule of rules) {
  const { field, operator, value } = rule;

  if (field === "inactiveDays") {
    const days = Number(value);
    const date = new Date();
    date.setDate(date.getDate() - days);
    query["lastVisit"] = { $lt: date };
    continue;
  }

  const val = Number(value);
  if (!query[field] || typeof query[field] !== "object") query[field] = {};

  switch (operator) {
    case ">": query[field]["$gt"] = val; break;
    case "<": query[field]["$lt"] = val; break;
    case "=": query[field] = val; break;
    case ">=": query[field]["$gte"] = val; break;
    case "<=": query[field]["$lte"] = val; break;
    default: break;
  }
}

    const customers = await Customer.find(query);
    const audienceSize = customers.length;

    const campaign = new Campaign({
      rules,
      message,
      audienceSize,
      sent: 0,
      failed: 0,
      createdAt: new Date(),
    });

    await campaign.save();

    // Create communication logs and simulate sending via vendor
    for (const customer of customers) {
      const personalized = message.replace("{name}", customer.name);

      const log = new CommunicationLog({
        campaignId: campaign._id,
        customerId: customer._id,
        message: personalized,
      });

      await log.save();

      // Call dummy vendor API to simulate delivery
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/vendor/send`, {
        logId: log._id,
        message: personalized,
      });
    }

    res.status(201).json({ message: "Campaign created and messages sent.", campaignId: campaign._id });
  } catch (err) {
    console.error("Campaign creation failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch all campaigns (sorted by newest)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});

module.exports = router;
