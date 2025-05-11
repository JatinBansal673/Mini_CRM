const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Customer = require("../models/Customer");
const Order = require("../models/Order");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), (req, res) => {
  const results = [];

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
          const lastVisit = new Date(row.lastVisit);
          if (isNaN(lastVisit)) {
            console.log(`Skipping invalid lastVisit date for customer ${row.name}`);
            return; // Skip invalid row
          }

          // 1. Create and save Customer
          const customer = new Customer({
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
          const orderDate = row.orderDate ? new Date(row.orderDate) : new Date(); // Handle missing order date
          if (isNaN(orderDate)) {
            console.log(`Skipping invalid orderDate for customer ${row.name}`);
            return; // Skip invalid row
          }

          const order = new Order({
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

router.get("/summary", async (req, res) => {
  const allCustomers = await Customer.find();
  const now = new Date();

  const active = allCustomers.filter(c => {
    const diff = (now - new Date(c.lastVisit)) / (1000 * 60 * 60 * 24);
    return diff <= 90; // active in last 90 days
  });

  const totalTurnover = allCustomers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);

  res.json({
    totalCustomers: allCustomers.length,
    activeCustomers: active.length,
    totalTurnover
  });
});

router.post("/preview", async (req, res) => {
  const { rules } = req.body;

  if (!Array.isArray(rules) || !rules.length) {
    return res.status(400).json({ error: "Rules are required." });
  }

  const mongoQuery = {};

  rules.forEach(({ field, operator, value }) => {
    switch (operator) {
      case ">":
        mongoQuery[field] = { ...mongoQuery[field], $gt: value };
        break;
      case "<":
        mongoQuery[field] = { ...mongoQuery[field], $lt: value };
        break;
      case "=":
        mongoQuery[field] = { ...mongoQuery[field], $eq: value };
        break;
      case ">=":
        mongoQuery[field] = { ...mongoQuery[field], $gte: value };
        break;
      case "<=":
        mongoQuery[field] = { ...mongoQuery[field], $lte: value };
        break;
      default:
        break;
    }
  });
  try {
    // Special handling for "inactiveDays" field
    if (mongoQuery.inactiveDays) {
      const now = new Date();
      const inactiveDate = new Date(now.setDate(now.getDate() - mongoQuery.inactiveDays.$gt || 0));
      mongoQuery.lastVisit = { $lt: inactiveDate };
      delete mongoQuery.inactiveDays;
    }

    const count = await Customer.countDocuments(mongoQuery);
    res.json({ count });
  } catch (err) {
    console.error("Preview audience error:", err);
    res.status(500).json({ error: "Error previewing audience." });
  }
});

module.exports = router;
