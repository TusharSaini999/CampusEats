const express = require("express");
const router = express.Router();
const db = require("./db");

// API to create an order and update order_items
//curl -X POST "http://localhost:4000/orders/create-order" -H "Content-Type: application/json" -d "{\"user_id\": 14, \"total_price\": 100.50, \"delivery_address\": \"123 Main St, City, Country\", \"customer_latitude\": 40.7128, \"customer_longitude\": -74.0060, \"payment_status\": \"success\"}"


router.post("/create-order", async (req, res) => {
  const { user_id, total_price, delivery_address, customer_latitude, customer_longitude, payment_status } = req.body;

  if (!user_id || !total_price || !delivery_address || payment_status === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check for pending order items
    const [orderItemsCheck] = await db
      .promise()
      .query(`SELECT * FROM order_items WHERE user_id = ? AND o_id IS NULL`, [user_id]);

    if (orderItemsCheck.length === 0) {
      return res.status(404).json({ message: "No order items found to update" });
    }

    // Insert into orders table
    const [orderResult] = await db
      .promise()
      .query(
        `INSERT INTO orders (user_id, total_price, delivery_address, customer_latitude, customer_longitude, payment_status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, total_price, delivery_address, customer_latitude, customer_longitude, payment_status]
      );

    const orderId = orderResult.insertId;

    // Update order_items with the new order ID
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

    // Fetch all ordered items to update menu availability
    const [orderedItems] = await db
      .promise()
      .query(
        `SELECT menu_id, quantity FROM order_items WHERE o_id = ?`,
        [orderId]
      );

    for (const item of orderedItems) {
      const { menu_id, quantity } = item;

      // Decrease availability in the menu table
      const [menuUpdateResult] = await db
        .promise()
        .query(
          `UPDATE menu SET availability = availability - ? WHERE id = ? AND availability >= ?`,
          [quantity, menu_id, quantity]
        );
    }

    res.status(201).json({ message: "Order created successfully", order_id: orderId });

  } catch (error) {
    console.error("Error creating order:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//total price
//http://localhost:4000/orders/total-price
// Use POST to handle the request
router.post("/total-price", async (req, res) => {
  const userId = req.body.user_id; 

  if (!userId) {
    return res.status(400).json({ error: "User not authenticated" });
  }

  try {

    const [result] = await db.promise().query(
      `SELECT SUM(price * quantity) AS total_price 
       FROM order_items 
       WHERE user_id = ? && o_id is NULL`,
      [userId]
    );

    if (!result[0].total_price) {
      return res.status(404).json({ message: "No order items found for this user" });
    }

    res.status(200).json({
      message: "Total price fetched successfully",
      total_price: result[0].total_price,
    });
  } catch (error) {
    console.error("Error fetching total price:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Example Node.js/Express route
//http://localhost:4000/orders/history
router.post("/history", async (req, res) => {
  const { user_id } = req.body;
  
  try {
    // Query the orders table to get orders based on the user_id
    const [orders] = await db.promise().query("SELECT * FROM orders WHERE user_id = ?", [user_id]);
    
    if (orders.length === 0) {
      return res.status(404).json({ error: "No orders found for this user." });
    }

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching order history." });
  }
});
module.exports = router;
