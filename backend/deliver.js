const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./db"); // Your DB configuration file
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { verifyToken } = require("./middleware/auth");

// Signup for delivery boy
// POST http://localhost:4000/delivery/signup-delivery-boy

//curl -X POST http://localhost:4000/delivery/signup-delivery-boy -H "Content-Type: application/json" -d "{\"name\": \"John Doe\", \"email\": \"john.doe@example.com\", \"password\": \"securepassword123\", \"userType\": \"delivery_boy\"}"
router.post("/signup-delivery-boy", async (req, res) => {
  const { name, email, password, mobile, userType } = req.body;
  try {

    const [existingDeliveryBoy] = await db
      .promise()
      .query("SELECT * FROM delivery WHERE email = ?", [email]);

    if (existingDeliveryBoy.length > 0) {
      return res.status(400).json({ error: "Delivery boy already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const [insertedDelivery] = await db
      .promise()
      .query(
        "INSERT INTO delivery (name, email, password,moble_no, userType) VALUES (?, ?, ?, ?,?)",
        [name, email, hashedPassword, mobile, userType]
      );


    const deliveryBoyId = insertedDelivery.insertId;

    await db
      .promise()
      .query(
        "INSERT INTO delivery_boy (id) VALUES (?)",
        [deliveryBoyId]
      );

    res.status(201).json({ message: "Delivery boy registered successfully" });
  } catch (err) {
    console.error("Error during delivery boy signup:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all delivery boys data
// GET http://localhost:4000/delivery/get-all-delivery-boys
//curl -X GET http://localhost:4000/delivery/get-all-delivery-boys
router.get("/get-all-delivery-boys", verifyToken, async (req, res) => {
  try {

    const [deliveryBoys] = await db.promise().query("SELECT * FROM delivery");

    if (deliveryBoys.length === 0) {
      return res.status(404).json({ message: "No delivery boys found" });
    }

    res.status(200).json({ deliveryBoys });
  } catch (err) {
    console.error("Error fetching delivery boys:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update delivery boy details
// PUT http://localhost:4000/delivery/update-delivery-boy

//curl -X PUT http://localhost:4000/delivery/update-delivery-boy -H "Content-Type: application/json" -d "{\"id\": 1, \"name\": \"John Updated\", \"email\": \"john.updated@example.com\", \"password\": \"newpassword123\", \"mobile_no\": \"9876543210\"}"
router.put("/update-delivery-boy", verifyToken, async (req, res) => {
  const { id, name, email, password, mobile_no } = req.body;

  try {

    const [deliveryBoy] = await db
      .promise()
      .query("SELECT * FROM delivery WHERE id = ?", [id]);

    if (deliveryBoy.length === 0) {
      return res.status(404).json({ error: "Delivery boy not found" });
    }


    const [existingEmail] = await db
      .promise()
      .query("SELECT * FROM delivery WHERE email = ? AND id != ?", [email, id]);

    if (existingEmail.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }


    let hashedPassword = deliveryBoy[0].password; 
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }


    await db
      .promise()
      .query(
        "UPDATE delivery SET name = ?, email = ?, password = ?, moble_no = ? WHERE id = ?",
        [name, email, hashedPassword, mobile_no, id]
      );

    res.status(200).json({ message: "Delivery boy updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete delivery boy profile
// DELETE http://localhost:4000/delivery/delete-delivery-boy/:id
//curl -X DELETE http://localhost:4000/delivery/delete-delivery-boy/1
router.delete("/delete-delivery-boy/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {

    const [response] = await db
      .promise()
      .query("DELETE FROM delivery WHERE id = ?", [id]);

    if (response.affectedRows === 0) {
      return res.status(404).json({ message: "Delivery boy not found" });
    }
    await db.promise().query("DELETE FROM delivery_boy WHERE id = ?", [id]);

    res.status(200).json({ message: "Delivery boy profile deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all pending orders for delivery boys
// GET http://localhost:4000/delivery/pending-orders
//curl -X GET "http://localhost:4000/delivery/pending-orders?deliveryBoyId=2"
router.get("/pending-orders", verifyToken, async (req, res) => {
  try {
    // Query to fetch pending orders along with customer name
    const [orders] = await db.promise().query(
      `SELECT 
        o.id AS order_id,
        u.id AS customer_id,
        u.name AS customer_name, 
        o.created_at AS order_date, 
        o.total_price AS order_amount,
        o.delivery_address AS delivery_address, 
        o.status AS order_status
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.status = 'pending' AND o.delivery_boy_id IS NULL
      ORDER BY o.id DESC;`   
    );

    // Check if no pending orders are found
    if (orders.length === 0) {
      return res.status(200).json({ pendingOrders: [] });
    }

    // Return the fetched orders
    res.status(200).json({ pendingOrders: orders });
  } catch (err) {
    console.error("Error fetching pending orders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all orders for a specific delivery boy (no status filter)
// GET http://localhost:4000/delivery/all-orders
// Example usage: curl -X GET "http://localhost:4000/delivery/all-orders?deliveryBoyId=2"
router.get("/all-orders", verifyToken, async (req, res) => {
  try {
    const { deliveryBoyId } = req.query;

    // Validate deliveryBoyId parameter
    if (!deliveryBoyId) {
      return res.status(400).json({ error: "Delivery boy ID is required" });
    }

    // Query to fetch all orders for the delivery boy
    const [orders] = await db.promise().query(
      `SELECT 
        o.id AS order_id,
        u.id AS customer_id,
        u.name AS customer_name, 
        o.created_at AS order_date, 
        o.total_price AS order_amount,
        o.delivery_address AS delivery_address, 
        o.status AS order_status
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.delivery_boy_id = ?
      ORDER BY o.id DESC;`,
      [deliveryBoyId]
    );
    // Return the fetched orders
    res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching orders for delivery boy:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Accept an order for delivery
// POST http://localhost:4000/delivery/accept-order
//curl -X POST http://localhost:4000/delivery/accept-order -H "Content-Type: application/json" -d "{\"orderId\":1,\"deliveryBoyId\":2}"

router.post("/accept-order", verifyToken, async (req, res) => {
  const { orderId, deliveryBoyId } = req.body; // Order ID and Delivery Boy ID from request

  try {

    const [order] = await db.promise().query(
      `SELECT * FROM orders WHERE id = ? AND status = 'pending' AND (delivery_boy_id IS NULL OR delivery_boy_id = ?)`,
      [orderId, deliveryBoyId]
    );

    if (order.length === 0) {
      return res.status(404).json({ message: "Order not found or already accepted" });
    }


    await db.promise().query(
      `UPDATE orders SET delivery_boy_id = ?, status = 'accepted' WHERE id = ?`,
      [deliveryBoyId, orderId]
    );

    res.status(200).json({ message: "Order accepted successfully" });
  } catch (err) {
    console.error("Error accepting order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//out for delivery
// Update order status to 'Out for Delivery'
//http://localhost:4000/delivery/out-for-delivery
router.post("/out-for-delivery", verifyToken, async (req, res) => {
  const { orderId, deliveryBoyId } = req.body; // Order ID and Delivery Boy ID from the request

  try {
    const [order] = await db.promise().query(
      `SELECT * FROM orders WHERE id = ? AND delivery_boy_id = ? AND status = 'accepted'`,
      [orderId, deliveryBoyId]
    );

    if (order.length === 0) {
      return res.status(404).json({ message: "Order not found or not accepted by this delivery boy" });
    }

    await db.promise().query(
      `UPDATE orders SET status = 'out for delivery' WHERE id = ?`,
      [orderId]
    );

    res.status(200).json({ message: "Order is now out for delivery" });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// GET http://localhost:4000/delivery/search-orders
// Example: curl -X GET "http://localhost:4000/delivery/search-orders?deliveryBoyId=2&searchQuery=John"
router.get("/search-orders", verifyToken, async (req, res) => {
  try {
    const { deliveryBoyId, searchQuery } = req.query;

    // Validate deliveryBoyId
    if (!deliveryBoyId) {
      return res.status(400).json({ error: "Delivery boy ID is required" });
    }

    // Base query
    let query = `
      SELECT 
        o.id AS order_id,
        u.id AS customer_id,
        u.name AS customer_name, 
        o.created_at AS order_date, 
        o.total_price AS order_amount,
        o.delivery_address AS delivery_address, 
        o.status AS order_status
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.delivery_boy_id = ?`;

    const queryParams = [deliveryBoyId];

    // Add search condition if searchQuery is provided
    if (searchQuery) {
      query += ` AND (u.name LIKE ? OR o.id LIKE ?)`;
      queryParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    query += " ORDER BY o.id DESC;";

    // Execute query
    const [orders] = await db.promise().query(query, queryParams);

    // Check if no orders are found
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found matching the search criteria" });
    }

    // Return the fetched orders
    res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching search results:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Generate OTP and save it to the order and return the otp
//http://localhost:4000/delivery/generate-otp
//curl -X POST http://localhost:4000/delivery/generate-otp -H "Content-Type: application/json" -d "{\"orderId\":1}"

router.post("/generate-otp", verifyToken, async (req, res) => {
  const { orderId } = req.body;

  try {

    const otp = Math.floor(100000 + Math.random() * 900000);

    const [result] = await db.promise().query(
      "UPDATE orders SET delivery_otp = ? WHERE id = ?",
      [otp, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "OTP generated successfully", otp });
    // In production, send this OTP to the delivery boy via SMS or other means
  } catch (err) {
    console.error("Error generating OTP:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
//veryfy delivery
//http://localhost:4000/delivery/verify-delivery
//curl -X POST http://localhost:4000/delivery/verify-delivery -H "Content-Type: application/json" -d "{\"orderId\":1,\"deliveryBoyId\":2,\"otp\":910277}"

router.post("/verify-delivery", verifyToken, async (req, res) => {
  const { orderId, deliveryBoyId, otp } = req.body;
  
  try {
    // Fetch order details
    const [order] = await db
      .promise()
      .query("SELECT * FROM orders WHERE id = ? AND status = 'out for delivery' AND delivery_boy_id = ?", [
        orderId,
        deliveryBoyId,
      ]);

    if (order.length === 0) {
      return res.status(400).json({ error: "Invalid order or delivery boy" });
    }
    if (order[0].delivery_otp != otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Mark the order as delivered
    await db
      .promise()
      .query("UPDATE orders SET status = 'delivered' WHERE id = ?", [orderId]);

    // Update delivery boy revenue and delivery count
    await db
      .promise()
      .query(
        "UPDATE delivery SET revenue = revenue + 40, total_delivery = total_delivery + 1 WHERE id = ?",
        [deliveryBoyId]
      );

    res.status(200).json({ message: "Order delivered successfully" });
  } catch (err) {
    console.error("Error during delivery verification:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// API: Verify OTP for rejection and update the status and revenue
//http://localhost:4000/delivery/reject-order
//curl -X POST http://localhost:4000/delivery/reject-order -H "Content-Type: application/json" -d "{\"orderId\":1,\"deliveryBoyId\":2,\"otp\":910277}"

router.post("/reject-order", verifyToken, async (req, res) => {
  const { orderId, deliveryBoyId, otp } = req.body;

  try {
    // Fetch order details
    const [order] = await db
      .promise()
      .query("SELECT * FROM orders WHERE id = ? AND status = 'out for delivery' AND delivery_boy_id = ?", [
        orderId,
        deliveryBoyId,
      ]);

    if (order.length === 0) {
      return res.status(400).json({ error: "Invalid order or delivery boy" });
    }

    if (order[0].delivery_otp != otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Mark the order as rejected
    await db
      .promise()
      .query("UPDATE orders SET status = 'rejected' WHERE id = ?", [orderId]);

    // Update delivery boy revenue (add +20)
    await db
      .promise()
      .query(
        "UPDATE delivery SET revenue = revenue + 20 WHERE id = ?",
        [deliveryBoyId]
      );

    res.status(200).json({ message: "Order rejected successfully, revenue updated" });
  } catch (err) {
    console.error("Error during rejection process:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
//for on delivery boy
router.post("/open-to-work", verifyToken, (req, res) => {
  const { isOpen } = req.body; 

  try {
    const userId = req.user.id;

    const query = "UPDATE delivery SET current = ? WHERE id = ?";
    db.query(query, [isOpen ? 1 : 0, userId], (err, result) => {
      if (err) {
        console.error("Error updating Open to Work status:", err);
        return res.status(500).json({ error: "Failed to update status" });
      }

      res.json({
        message: "Open to Work status updated successfully",
        current: isOpen ? 1 : 0,
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
// API: Mark order as rejected due to no response from the user
//http://localhost:4000/delivery/reject-order-no-response
//curl -X POST http://localhost:4000/delivery/reject-order-no-response -H "Content-Type: application/json" -d "{\"orderId\":1,\"deliveryBoyId\":2}"

router.post("/reject-order-no-response", verifyToken, async (req, res) => {
  const { orderId, deliveryBoyId } = req.body;

  try {
    // Check if the order exists and belongs to the delivery boy
    const [order] = await db
      .promise()
      .query("SELECT * FROM orders WHERE id = ? AND status = 'out for delivery' AND delivery_boy_id = ?", [
        orderId,
        deliveryBoyId,
      ]);

    if (order.length === 0) {
      return res.status(400).json({ error: "Invalid order or delivery boy" });
    }

    // Update the order status to 'rejected'
    await db
      .promise()
      .query("UPDATE orders SET status = 'rejected' WHERE id = ?", [orderId]);

    res.status(200).json({ message: "Order marked as rejected due to no response from the user" });
  } catch (err) {
    console.error("Error while rejecting order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Mark order as rejected due to no response from the user
//http://localhost:4000/delivery/reject-order-vender
//curl -X POST http://localhost:4000/delivery/reject-order-vender -H "Content-Type: application/json" -d "{\"orderId\":1,\"deliveryBoyId\":2}"

router.post("/reject-order-vender", verifyToken, async (req, res) => {
  const { orderId, deliveryBoyId } = req.body;

  try {
    // Check if the order exists and belongs to the delivery boy
    const [order] = await db
      .promise()
      .query("SELECT * FROM orders WHERE id = ? AND delivery_boy_id = ?", [
        orderId,
        deliveryBoyId,
      ]);

    if (order.length === 0) {
      return res.status(400).json({ error: "Invalid order or delivery boy" });
    }

    // Update the order status to 'rejected'
    await db
      .promise()
      .query("UPDATE orders SET status = 'rejected' WHERE id = ?", [orderId]);

    res.status(200).json({ message: "Order marked as rejected due to no response from the user" });
  } catch (err) {
    console.error("Error while rejecting order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Get OTP for a specific order
//http://localhost:4000/delivery/get-otp?orderId=1
//curl -X GET "http://localhost:4000/delivery/get-otp?orderId=1"

router.get("/get-otp", verifyToken, async (req, res) => {
  const { orderId } = req.query;  // Using query parameter for orderId

  try {
    // Validate that the order exists
    const [order] = await db
      .promise()
      .query("SELECT delivery_otp FROM orders WHERE id = ?", [orderId]);

    if (order.length === 0) {
      return res.status(400).json({ error: "Order not found" });
    }

    // Retrieve the OTP from the order
    const otp = order[0].delivery_otp;

    // Check if OTP exists for the order
    if (!otp) {
      return res.status(400).json({ error: "OTP not generated for this order" });
    }

    // Return the OTP (you can enhance this by adding expiry logic)
    res.status(200).json({ message: "OTP retrieved successfully", otp });
  } catch (err) {
    console.error("Error retrieving OTP:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// API: Get revenue, total deliveries, pending, and rejected orders for a specific delivery boy
//http://localhost:4000/delivery/delivery-details?deliveryBoyId=1
//curl -X GET "http://localhost:4000/delivery/delivery-details?deliveryBoyId=2"
router.get("/delivery-details", verifyToken, async (req, res) => {
  const { deliveryBoyId } = req.query;  // Get deliveryBoyId from the query parameters

  try {
    // Query to get revenue and total deliveries from the delivery table
    const [deliveryDetails] = await db
      .promise()
      .query(
        `SELECT revenue, total_delivery
         FROM delivery 
         WHERE id = ?`,
        [deliveryBoyId]
      );

    if (deliveryDetails.length === 0) {
      return res.status(400).json({ error: "Delivery boy not found" });
    }

    // Query to get the count of accepted orders from the orders table
    const [acceptedOrders] = await db
      .promise()
      .query(
        `SELECT COUNT(*) AS accepted_order_count
         FROM orders
         WHERE delivery_boy_id = ? AND status = 'accepted'`,
        [deliveryBoyId]
      );

    // Query to get the count of pending orders from the orders table
    const [pendingOrders] = await db
      .promise()
      .query(
        `SELECT COUNT(*) AS pending_order_count
         FROM orders
         WHERE status = 'pending'`,
      );

    // Query to get the count of rejected orders from the orders table
    const [rejectedOrders] = await db
      .promise()
      .query(
        `SELECT COUNT(*) AS rejected_order_count
         FROM orders
         WHERE delivery_boy_id = ? AND status = 'rejected'`,
        [deliveryBoyId]
      );

    // Combine the results and return as response
    const result = {
      revenue: deliveryDetails[0].revenue,
      totalDeliveries: deliveryDetails[0].total_delivery,
      acceptedOrderCount: acceptedOrders[0].accepted_order_count,
      pendingOrderCount: pendingOrders[0].pending_order_count,
      rejectedOrderCount: rejectedOrders[0].rejected_order_count,
    };

    res.status(200).json({
      message: "Delivery details retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error retrieving delivery details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//get order for delivery boy
//http://localhost:4000/delivery/orders_boy_deliver/48
// Get order details for delivery boy
router.get('/orders_boy_deliver/:orderId', verifyToken, (req, res) => {
  const orderId = req.params.orderId;

  const query = `
    SELECT 
        o.id AS order_id,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.phone AS user_phone,
        v.id AS vendor_id,
        v.name AS vendor_name,
        IFNULL(ov.status, 'Pending') AS vendor_status,
        IFNULL(v.address, 'NULL') AS vendor_address,
        IFNULL(v.phone, 'NULL') AS vendor_phone,
        IFNULL(ov.otp, 'NULL') AS vendor_otp,
        GROUP_CONCAT(DISTINCT CONCAT(oi.item_name, ' x', oi.quantity, ' @', oi.price, ' INR (Vendor: ', v.name, ')') SEPARATOR '; ') AS items,
        o.total_price,
        o.payment_status,
        o.status,
        o.delivery_address,
        o.created_at,
        o.delivery_otp,
        d.id AS delivery_boy_id,
        d.name AS delivery_boy_name,
        d.email AS delivery_boy_email,
        d.moble_no AS delivery_boy_phone
    FROM 
        orders o
    INNER JOIN 
        users u ON o.user_id = u.id
    LEFT JOIN 
        order_items oi ON oi.o_id = o.id
    LEFT JOIN 
        menu m ON oi.menu_id = m.id
    LEFT JOIN 
        vendors v ON m.vendor_id = v.id
    LEFT JOIN 
        order_vender ov ON o.id = ov.order_id AND v.id = ov.v_id
    LEFT JOIN 
        delivery d ON o.delivery_boy_id = d.id
    WHERE 
        o.id = ?
    GROUP BY 
        o.id, u.id, u.name, u.email, u.phone,
        v.id, v.name, ov.status, v.address, v.phone, ov.otp,
        o.total_price, o.payment_status, o.status, o.delivery_address, o.created_at, o.delivery_otp,
        d.id, d.name, d.email, d.moble_no
    ORDER BY 
        o.created_at DESC;
  `;

  // Execute the query
  db.query(query, [orderId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Collect vendor data and items separately
    const vendors = result.map((row) => ({
      vendor_id: row.vendor_id,
      vendor_name: row.vendor_name,
      status: row.vendor_status,
      address: row.vendor_address,
      phone: row.vendor_phone,
      otp: row.vendor_otp,
    }));

    // Format items from all vendors and all rows
    const items = result.flatMap(row => {
      if (row.items) {
        return row.items.split('; ').map(item => {
          const [itemName, itemDetails] = item.split(' x');
          const [quantity, priceAndVendor] = itemDetails ? itemDetails.split(' @') : ['0', '0 INR (Vendor: Unknown)'];
          const [price, vendor] = priceAndVendor.split(' INR (Vendor: ');
          return {
            name: itemName?.trim() || 'Unknown',
            quantity: parseInt(quantity?.trim()) || 0,
            price: parseInt(price?.trim()) || 0,
            vendor: vendor?.replace(')', '')?.trim() || 'Unknown',
          };
        });
      }
      return [];
    });

    // Prepare final formatted response
    const formattedOrder = {
      order_id: result[0].order_id,
      user_name: result[0].user_name,
      user_email: result[0].user_email,
      user_phone: result[0].user_phone,
      vendors: vendors, // This will include one row per vendor
      items: items, // All items from all vendors
      total_price: result[0].total_price,
      payment_status: result[0].payment_status,
      dstatus: result[0].status,
      delivery_address: result[0].delivery_address,
      created_at: result[0].created_at,
      uotp: result[0].delivery_otp,
      delivery_boy: result[0].delivery_boy_id
        ? {
            id: result[0].delivery_boy_id,
            name: result[0].delivery_boy_name,
            email: result[0].delivery_boy_email,
            phone: result[0].delivery_boy_phone,
          }
        : null, // If no delivery boy is assigned
    };

    res.json(formattedOrder);
  });
});

module.exports = router;
