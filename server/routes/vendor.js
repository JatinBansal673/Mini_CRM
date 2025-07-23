const express = require("express");
const router = express.Router();
const axios = require("axios");
const CommunicationLog = require("../models/CommunicationLog");
const Campaign = require("../models/Campaign");


router.post("/send", async (req, res) => {
  const { logId, customerId, message } = req.body;

  // Simulate delivery with 90% success rate
  const isSuccess = Math.random() < 0.9;
  const status = isSuccess ? "SENT" : "FAILED";

  // Simulate vendor message ID
  const vendorMessageId = `vendor_${Math.random().toString(36).substr(2, 9)}`;

  // Simulate delivery delay
  setTimeout(async () => {
    // Send delivery receipt to our backend
    await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/vendor/receipt`, {
      logId,
      status,
      vendorMessageId,
    },{ withCredentials: true });
  }, 1000); // 1-second delay

  res.json({ message: "Message sent to vendor." });
});


router.post("/receipt", async (req, res) => {
  const { logId, status, vendorMessageId } = req.body;

  try {
    // Update the delivery log
    const log = await CommunicationLog.findByIdAndUpdate(
      { _id: logId },
      { status, vendorMessageId },
      { new: true }
    );

    // ✅ Increment sent or failed in the parent campaign
    if (log && log.campaignId) {
      const update = status === "SENT" ? { $inc: { sent: 1 } } : { $inc: { failed: 1 } };
      await Campaign.findByIdAndUpdate({ _id: log.campaignId }, update);
    }

    res.json({ message: "Delivery status updated." });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
