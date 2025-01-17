const express = require("express");
const router = express.Router();
const db = require("./db");
//get orders
//http://localhost:4000/orders/
router.get("/", async (req, res) => {
  try {
    const response = await db
      .promise()
      .query("SELECT * FROM orders");
    res.status(200).json(response[0]);
  } catch (e) {
    res.status(400).json(e);
  }
});


// API to create an order and update order_items
//curl -X POST "http://localhost:4000/orders/create-order" -H "Content-Type: application/json" -d "{\"user_id\": 14, \"total_price\": 100.50, \"delivery_address\": \"123 Main St, City, Country\", \"customer_latitude\": 40.7128, \"customer_longitude\": -74.0060, \"payment_status\": \"success\"}"


router.post("/create-order", async (req, res) => {
  const { user_id, total_price, delivery_address, customer_latitude, customer_longitude, payment_status } = req.body;

  if (!user_id || !total_price || !delivery_address || payment_status === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // First, check if there are any order items with o_id IS NULL for the given user_id
    const [orderItemsCheck] = await db
      .promise()
      .query(
        `SELECT * FROM order_items WHERE user_id = ? AND o_id IS NULL`,
        [user_id]
      );

    // If no order items are found, return an error message
    if (orderItemsCheck.length === 0) {
      return res.status(404).json({ message: "No order items found to update" });
    }

    const [orderResult] = await db
      .promise()
      .query(
        `INSERT INTO orders (user_id, total_price, delivery_address, customer_latitude, customer_longitude, payment_status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, total_price, delivery_address, customer_latitude, customer_longitude, payment_status]
      );

    const orderId = orderResult.insertId;

    const [updateResult] = await db
      .promise()
      .query(
        `UPDATE order_items 
         SET o_id = ? 
         WHERE user_id = ? AND o_id IS NULL`,
        [orderId, user_id]
      );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "No order items found to update" });
    }

    // Respond with the order creation success message and the new order's ID
    res.status(201).json({ message: "Order created successfully", order_id: orderId });

  } catch (error) {
    console.error("Error creating order:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
