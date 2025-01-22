const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./db");
const router = express.Router();

//Vendor signup
//http://localhost:4000/vendors/signup-vendor
router.post("/signup-vendor", async (req, res) => {
  const { name, email, password, userType, mobile } = req.body;

  try {
    const [existingCustomer] = await db
      .promise()
      .query("SELECT * FROM vendors WHERE email = ?", [email]);
    if (existingCustomer.length > 0) {
      return res.status(400).json({ error: "Vendor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .promise()
      .query(
        "INSERT INTO vendors (name, email, password ,phone, userType) VALUES (?, ?, ?, ?,?)",
        [name, email, hashedPassword, mobile, userType]
      );

    res.status(201).json({ message: "Customer registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//http://localhost:4000/vendors/vendor-profile/1
router.get("/vendor-profile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await db
      .promise()
      .query(`SELECT * FROM vendors WHERE id=${id}`);
    res.status(200).json(response[0]);
  } catch (e) {
    res.status(404).json(e);
  }
});

//http://localhost:4000/vendors/vendor-profile-update:id=
router.put("/vendor-profile-update:id", async (req, res) => {
  const { id } = req.params;
  const { name, password, phone, address } = req.body;
  try {
    const query = `
        UPDATE vendors 
        SET 
          name = ?, 
          password = ?, 
          phone = ?, 
          address = ?, 
        WHERE id = ?`;
    const [response] = await db
      .promise()
      .query(query, [name, password, phone, address, id]);
    res.status(200).json({ message: "vendor profile updated successfully" });
  } catch (e) {
    res.status(404).json(e);
  }
});
// Delete Vendor Profile API
//http://localhost:4000/vendors/vendor-profile-delete:id=1
router.delete("/vendor-profile-delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [response] = await db
      .promise()
      .query("DELETE FROM vendors WHERE id = ?", [id]);

    if (response.affectedRows === 0) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    res.status(200).json({
      message: "Vendor profile deleted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "An error occurred while deleting the vendor profile",
    });
  }
});
//update vendor current 1 online and 0 offline
//http://localhost:4000/vendors/update-vendor-status
//curl -X POST http://localhost:4000/vendors/update-vendor-status -H "Content-Type: application/json" -d "{\"vendorId\":1,\"current\":1}"

router.post('/update-vendor-status', (req, res) => {
  const { vendorId, current } = req.body;

  // Validate input
  if (typeof vendorId === 'undefined' || typeof current === 'undefined') {
    return res.status(400).json({ error: 'vendorId and current are required.' });
  }

  // SQL query to update the current status
  const sql = 'UPDATE vendors SET current = ? WHERE id = ?';

  db.query(sql, [current, vendorId], (err, result) => {
    if (err) {
      console.error('Error updating vendor status:', err);
      return res.status(500).json({ error: 'Database error.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vendor not found.' });
    }

    res.status(200).json({ message: 'Vendor status updated successfully.' });
  });
});


// Express endpoint to get vendor status
//get the vendor status
router.get('/vendor-status/:vendorId', (req, res) => {
  const { vendorId } = req.params;

  // SQL query to get the current status of the vendor
  const sql = 'SELECT current FROM vendors WHERE id = ?';

  db.query(sql, [vendorId], (err, result) => {
    if (err) {
      console.error('Error fetching vendor status:', err);
      return res.status(500).json({ error: 'Database error.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Vendor not found.' });
    }

    // Return the current status of the vendor
    res.status(200).json({ current: result[0].current });
  });
});


//get orders for vendoer which is confrom payment
//GET http://localhost:4000/vendors/orders/{vendorId}
//curl -X GET "http://localhost:4000/vendors/orders/21" -H "Content-Type: application/json"

router.get('/orders/:vendorId', (req, res) => {
  const vendorId = req.params.vendorId;

  // SQL query to fetch order details
  const query = `
    SELECT
      oi.o_id AS order_item_id,
      oi.user_id,
      (SELECT u.name 
       FROM users u 
       WHERE u.id = oi.user_id) AS user_name,
      (SELECT u.phone 
       FROM users u 
       WHERE u.id = oi.user_id) AS user_phone,
      (SELECT o.delivery_address 
       FROM orders o 
       WHERE o.id = oi.o_id) AS delivery_address,
      m.name AS menu_name,
      m.image_url,
      oi.quantity,
      (oi.price * oi.quantity) AS total_price,
      (SELECT o.payment_status 
       FROM orders o 
       WHERE o.id = oi.o_id) AS payment_status,
      (SELECT o.created_at 
       FROM orders o 
       WHERE o.id = oi.o_id) AS order_date
    FROM 
      order_items oi
    INNER JOIN 
      menu m ON oi.menu_id = m.id
    WHERE 
      m.vendor_id = ? 
      AND oi.o_id IS NOT NULL
    ORDER BY 
      order_date DESC;
`;
  // Execute the query
  db.query(query, [vendorId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Return the results as JSON
    res.json({ orders: results });
  });
});

//order taken By Vendor

module.exports = router;
