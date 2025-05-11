const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Customer = require("../models/Customer");

router.get("/", async (req, res) => {
  try {
    const ordersWithCustomer = await Order.aggregate([
      {
        $lookup: {
          from: "customers", // Join with the Customer collection
          localField: "customerId", // Field in Orders that references Customer
          foreignField: "_id", // Field in Customers to match
          as: "customerDetails", // Resulting field name to hold customer data
        },
      },
      {
        $unwind: "$customerDetails", // Flatten the customerDetails array to make it accessible
      },
      {
        $sort: {
          "createdAt": -1, // Sort by most recent orders first
        },
      },
      {
        $group: {
          _id: "$customerId", // Group by customerId to get the latest order per customer
          latestOrder: { $first: "$$ROOT" }, // Get the most recent order
          customerDetails: { $first: "$customerDetails" }, // Get customer details
        },
      },
      {
        $project: {
          customerId: "$_id",
          product: "$latestOrder.product",
          amount: "$latestOrder.amount",
          lastVisit: "$customerDetails.lastVisit",
          name: "$customerDetails.name",
        },
      },
    ]);

    res.json(ordersWithCustomer); // Send the data back
  } catch (err) {
    console.error("Error fetching orders with customer details:", err);
    res.status(500).json({ error: "Failed to get data" });
  }
});


router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// router.get("/", async (req, res) => {
//   const orders = await Order.find().populate("customerId");
//   res.json(orders);
// });

module.exports = router;
