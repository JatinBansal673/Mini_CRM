const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Customer = require("../models/Customer");
const Order = require("../models/Order");

const upload = multer({ dest: "uploads/" });

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

router.post("/upload", isAuthenticated, upload.single("file"), (req, res) => {
  const results = [];

  function parseDDMMYYYY(dateStr) {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("-");
    if (!day || !month || !year) return null;
    return new Date(`${year}-${month}-${day}`);
  }

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      try {
        const customerDocs = [];
        const orderDocs = [];

        // Process each row in the CSV file
        const savePromises = results.map(async (row) => {
          // Validate and parse dates
           const lastVisit = parseDDMMYYYY(row.lastVisit);
          if (!lastVisit || isNaN(lastVisit.getTime())) {
            console.log(`Skipping invalid lastVisit date for customer ${row.name}`);
            return;
          }

          // 1. Create and save Customer
          const customer = new Customer({
            userId: req.user.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            totalSpend: parseFloat(row.totalSpend),
            visits: parseInt(row.visits),
            lastVisit: lastVisit,
          });

          await customer.save();
          customerDocs.push(customer);

          // 2. Create and save Order (linked to Customer)
          const orderDate = row.orderDate ? parseDDMMYYYY(row.orderDate) : new Date(); // Handle missing order date
          if (isNaN(orderDate)) {
            console.log(`Skipping invalid orderDate for customer ${row.name}`);
            return; // Skip invalid row
          }

          const order = new Order({
            userId: req.user.id,
            customerId: customer._id,
            amount: parseFloat(row.amount),
            product: row.product,
            createdAt: orderDate,
          });

          await order.save();
          orderDocs.push(order);
        });

        // Wait for all save operations to complete
        await Promise.all(savePromises);

        fs.unlinkSync(req.file.path); // Clean up file after processing
        res.json({
          message: "Upload successful",
          customersInserted: customerDocs.length,
          ordersInserted: orderDocs.length,
        });
      } catch (err) {
        console.error("Error processing CSV upload:", err);
        res.status(500).json({ error: "Failed to upload data" });
      }
    });
});

router.get("/summary", isAuthenticated, async (req, res) => {
  const allCustomers = await Customer.find({ userId: req.user.id });
  const now = new Date();

  const active = allCustomers.filter(c => {
    const diff = (now - new Date(c.lastVisit)) / (1000 * 60 * 60 * 24);
    return diff <= 90; // active in last 90 days
  });

  const totalTurnover = allCustomers.reduce((sum, c) => sum + (c.totalSpend || 0), 0).toFixed(2);

  res.json({
    totalCustomers: allCustomers.length,
    activeCustomers: active.length,
    totalTurnover
  });
});

// ...existing code...
router.post("/preview", isAuthenticated, async (req, res) => {
  const { rules } = req.body;
  console.log(rules);
  

  if (!Array.isArray(rules) || !rules.length) {
    return res.status(400).json({ error: "Rules are required." });
  }

  const mongoQuery = {};
  let inactiveDaysOps = {};

  rules.forEach(({ field, operator, value }) => {
    if (field === "inactiveDays") {
      // Collect inactiveDays operators for special handling
      switch (operator) {
        case ">":   inactiveDaysOps["$gt"] = value; break;
        case "<":   inactiveDaysOps["$lt"] = value; break;
        case "=":   inactiveDaysOps["$eq"] = value; break;
        case ">=":  inactiveDaysOps["$gte"] = value; break;
        case "<=":  inactiveDaysOps["$lte"] = value; break;
        default:    break;
      }
      return; // Skip adding to mongoQuery directly
    }
    // All other fields
    switch (operator) {
      case ">":   mongoQuery[field] = { ...mongoQuery[field], $gt: value }; break;
      case "<":   mongoQuery[field] = { ...mongoQuery[field], $lt: value }; break;
      case "=":   mongoQuery[field] = { ...mongoQuery[field], $eq: value }; break;
      case ">=":  mongoQuery[field] = { ...mongoQuery[field], $gte: value }; break;
      case "<=":  mongoQuery[field] = { ...mongoQuery[field], $lte: value }; break;
      default:    break;
    }
  });

  try {
    // Special handling for "inactiveDays" field
    if (Object.keys(inactiveDaysOps).length > 0) {
      const now = new Date();
      Object.keys(inactiveDaysOps).forEach(op => {
        const days = inactiveDaysOps[op];
        const targetDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        switch (op) {
          case "$gt":
            mongoQuery.lastVisit = { ...mongoQuery.lastVisit, $lt: targetDate };
            break;
          case "$lt":
            mongoQuery.lastVisit = { ...mongoQuery.lastVisit, $gt: targetDate };
            break;
          case "$gte":
            mongoQuery.lastVisit = { ...mongoQuery.lastVisit, $lte: targetDate };
            break;
          case "$lte":
            mongoQuery.lastVisit = { ...mongoQuery.lastVisit, $gte: targetDate };
            break;
          case "$eq":
            mongoQuery.lastVisit = { ...mongoQuery.lastVisit, $eq: targetDate };
            break;
          default:
            break;
        }
      });
    }

    const count = await Customer.countDocuments({ ...mongoQuery, userId: req.user.id });
    res.json({ count });
  } catch (err) {
    console.error("Preview audience error:", err);
    res.status(500).json({ error: "Error previewing audience." });
  }
});

module.exports = router;
