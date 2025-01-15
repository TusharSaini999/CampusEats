const express = require("express");
const db = require("./db"); // Your DB configuration file
const router = express.Router();

// API Endpoint for fetching locations
//curl "http://localhost:4000/map/locations?ord_id=1&deli_boy=2"
router.get("/locations", (req, res) => {
  const deliveryBoyId = req.query.deli_boy;
  const orderId = req.query.ord_id;

  if (!deliveryBoyId || !orderId) {
    return res
      .status(400)
      .json({ status: "error", message: "Delivery Boy ID and Order ID are required" });
  }

  try {
    // Fetch the customer's location
    const customerQuery = `
      SELECT customer_latitude, customer_longitude
      FROM orders
      WHERE id = ?`;
    
    db.query(customerQuery, [orderId], (err, customerRows) => {
      if (err) {
        return res.status(500).json({ status: "error", message: "Error fetching customer location" });
      }

      // Fetch the delivery boy's location
      const deliveryBoyQuery = `
        SELECT delivery_latitude, delivery_longitude
        FROM delivery_boy
        WHERE id = ?`;

      db.query(deliveryBoyQuery, [deliveryBoyId], (err, deliveryRows) => {
        if (err) {
          return res.status(500).json({ status: "error", message: "Error fetching delivery boy location" });
        }

        if (customerRows.length > 0 && deliveryRows.length > 0) {
          res.json({
            status: "success",
            customer_location: customerRows[0],
            delivery_boy_location: deliveryRows[0],
          });
        } else {
          res.status(404).json({ status: "error", message: "Location not found" });
        }
      });
    });
  } catch (err) {
    console.error("Error fetching locations:", err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});


//curl "http://localhost:4000/map/locationsByCustomer?ord_id=1&customer_id=2"
router.get("/locationsByCustomer", (req, res) => {
    const customerId = req.query.customer_id;
    const orderId = req.query.ord_id;
  
    if (!customerId || !orderId) {
      return res
        .status(400)
        .json({ status: "error", message: "Customer ID and Order ID are required" });
    }
  
    try {
      // Fetch the customer's location and delivery boy ID
      const customerQuery = `
        SELECT customer_latitude, customer_longitude, delivery_boy_id
        FROM orders
        WHERE id = ? AND user_id = ?`;
    
      db.query(customerQuery, [orderId, customerId], (err, customerRows) => {
        if (err) {
          return res.status(500).json({ status: "error", message: "Error fetching customer location" });
        }
  
        if (customerRows.length === 0) {
          return res.status(404).json({ status: "error", message: "Customer location not found" });
        }
  
        const deliveryBoyId = customerRows[0].delivery_boy_id;
  
        // Fetch the delivery boy's location using the delivery boy ID
        const deliveryBoyQuery = `
          SELECT delivery_latitude, delivery_longitude
          FROM delivery_boy
          WHERE id = ?`;
  
        db.query(deliveryBoyQuery, [deliveryBoyId], (err, deliveryRows) => {
          if (err) {
            return res.status(500).json({ status: "error", message: "Error fetching delivery boy location" });
          }
  
          if (deliveryRows.length === 0) {
            return res.status(404).json({ status: "error", message: "Delivery boy location not found" });
          }
  
          // Return both customer and delivery boy locations
          res.json({
            status: "success",
            customer_location: customerRows[0],
            delivery_boy_location: deliveryRows[0],
          });
        });
      });
    } catch (err) {
      console.error("Error fetching locations:", err.message);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  });

  /*curl -X POST http://localhost:4000/map/update-location -H "Content-Type: application/json" -d "{\"delivery_boy_id\": 2, \"latitude\": 28.7041, \"longitude\": 77.1025}"
*/

  router.post('/update-location', (req, res) => {
    const { delivery_boy_id, latitude, longitude } = req.body;
  
    // Validate input data
    if (!delivery_boy_id || !latitude || !longitude) {
      return res.status(400).json({ status: 'error', message: 'Invalid data' });
    }
  
    // Validate that latitude and longitude are numbers
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ status: 'error', message: 'Invalid latitude or longitude' });
    }
  
    // Prepare SQL query to update the delivery boy's location
    const sql = 'UPDATE delivery_boy SET delivery_latitude = ?, delivery_longitude = ? WHERE id = ?';
    
    // Execute SQL query
    db.execute(sql, [latitude, longitude, delivery_boy_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: 'error', message: 'Failed to update location' });
      }
  
      if (results.affectedRows > 0) {
        return res.status(200).json({ status: 'success', message: 'Location updated successfully' });
      } else {
        return res.status(404).json({ status: 'error', message: 'Delivery boy not found' });
      }
    });
  });
  
  // Export the router so it can be used in the main app
  module.exports = router;
  