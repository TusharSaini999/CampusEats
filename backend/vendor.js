const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./db");
const router = express.Router();
const crypto = require('crypto');
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
      .query(`SELECT * FROM vendors WHERE id=?`, [id]);
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
       WHERE o.id = oi.o_id) AS order_date,
       (SELECT ov.status FROM order_vender ov WHERE ov.order_id = oi.o_id && ov.v_id=m.vendor_id) AS vender_status
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

// Order taken by Vendor
// Endpoint: http://localhost:4000/vendors/assign-order

router.post('/assign-order', (req, res) => {
  const { vendor_id, order_id, status, message } = req.body;

  // Step 1: Validate Inputs
  if (!vendor_id || !order_id || !status) {
    return res.status(400).json({ error: 'Vendor ID, Order ID, and Status are required.' });
  }

  // Step 2: Check if the order belongs to the vendor
  const queryCheckOrderVendor = `
    SELECT
      oi.o_id AS order_item_id,
      (SELECT o.delivery_address FROM orders o WHERE o.id = oi.o_id) AS delivery_address
    FROM 
      order_items oi
    INNER JOIN 
      menu m ON oi.menu_id = m.id
    WHERE 
      m.vendor_id = ? 
      AND oi.o_id = ?;
  `;

  db.query(queryCheckOrderVendor, [vendor_id, order_id], (error, orderVendorResult) => {
    if (error) {
      console.error('Error fetching order vendor:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (orderVendorResult.length === 0) {
      return res.status(404).json({ error: 'Order does not belong to the specified vendor.' });
    }

    // Step 3: Check if the order-vendor pair already exists
    const queryCheckPair = `
      SELECT * 
      FROM order_vender 
      WHERE order_id = ? AND v_id = ?;
    `;

    db.query(queryCheckPair, [order_id, vendor_id], (error, pairCheckResult) => {
      if (error) {
        console.error('Error checking order-vendor pair:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (pairCheckResult.length > 0) {
        // Step 4: If pair exists, update the status
        const queryUpdateStatus = `
          UPDATE order_vender
          SET status = ?, mes = ?
          WHERE order_id = ? AND v_id = ?;
        `;

        db.query(queryUpdateStatus, [status, message || null, order_id, vendor_id], (error) => {
          if (error) {
            console.error('Error updating order status:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(200).json({
            message: 'Order status successfully updated.',
            order_id,
            vendor_id,
            status,
          });
        });
      } else {
        // Step 5: If pair does not exist, insert a new record
        const queryInsert = `
          INSERT INTO order_vender (order_id, v_id, status, mes) 
          VALUES (?, ?, ?, ?);
        `;

        db.query(queryInsert, [order_id, vendor_id, status, message || null], (error) => {
          if (error) {
            console.error('Error assigning order to vendor:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(201).json({
            message: 'Order successfully assigned to the vendor.',
            order_id,
            vendor_id,
            status,
          });
        });
      }
    });
  });
});

// Endpoint to fetch the current status of an order for a vendor
//http://localhost:4000/vendors/order-status
// Fetch order status
router.get('/order-status', (req, res) => {
  const { order_id, vendor_id } = req.query;

  if (!order_id || !vendor_id) {
    return res.status(400).json({ error: 'Order ID and Vendor ID are required.' });
  }

  db.query(
    'SELECT status FROM order_vender WHERE order_id = ? AND v_id = ?',
    [order_id, vendor_id],
    (error, results) => {
      if (error) {
        console.error('Error fetching order status:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        // Return custom error message with code 1001
        return res.status(400).json({
          errorCode: 1001,
          message: 'First accept the order'
        });
      }

      // Extract the status from the results
      const status = results[0].status;
      return res.status(200).json({ status });
    }
  );
});


//seacrch on order using order id
//curl -X GET "http://localhost:4000/vendors/search-orders/21?orderId=34" -H "Content-Type: application/json"
router.get('/search-orders/:vendorId', (req, res) => {
  const vendorId = req.params.vendorId;
  const orderId = req.query.orderId; 

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
       WHERE o.id = oi.o_id) AS order_date,
      (SELECT ov.status FROM order_vender ov WHERE ov.order_id = oi.o_id && ov.v_id=m.vendor_id) AS vender_status
    FROM 
      order_items oi
    INNER JOIN 
      menu m ON oi.menu_id = m.id
    WHERE 
      m.vendor_id = ? 
      AND oi.o_id = ?  -- Match the order ID provided
    ORDER BY 
      order_date DESC;
  `;

  db.query(query, [vendorId, orderId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No orders found with the provided Order ID.' });
    }


    res.json({ result: results });
  });
});

//genrate otp api
//http://localhost:4000/vendors/generate-otp
//curl -X POST "http://localhost:4000/vendors/generate-otp" -H "Content-Type: application/json" -d "{\"order_id\": 2, \"v_id\": 21}"

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
  return otp;
};

router.post('/generate-otp', (req, res) => {
  const { order_id, v_id } = req.body;
  if (!order_id || !v_id) {
    return res.status(400).json({ message: 'order_id and v_id are required' });
  }

  const otp = generateOTP(); 

  const query = 'UPDATE order_vender SET otp = ? WHERE order_id = ? AND v_id = ?';
  db.query(query, [otp, order_id, v_id], (err, result) => {
    if (err) {
      console.error('Error updating OTP:', err);
      return res.status(500).json({ message: 'Failed to generate OTP' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order ID and Vendor ID not found' });
    }

    res.json({ otp: otp, message: 'OTP generated successfully' });
  });
});

//otp verfy and close the order
//curl -X POST http://localhost:4000/vendors/verify-otp -H "Content-Type: application/json" -d "{"order_id":12, "v_id":21, "otp":787141}"

router.post('/verify-otp', (req, res) => {
  const { order_id, v_id, otp } = req.body;  // Get order_id, vendor_id, and otp from request body
  if (!order_id || !v_id || !otp) {
    return res.status(400).json({ message: 'order_id, v_id, and otp are required' });
  }

  // Query to fetch the current status of the order for the given order_id and v_id from the order_vender table
  const statusQuery = 'SELECT status FROM order_vender WHERE order_id = ? AND v_id = ?';
  db.query(statusQuery, [order_id, v_id], (err, results) => {
    if (err) {
      console.error('Error fetching order status:', err);
      return res.status(500).json({ message: 'Failed to fetch order status' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Order not found for this vendor' });
    }

    const currentStatus = results[0].status;

    // Check if the order status is 'Out for Pickup'
    if (currentStatus !== 'Out for Pickup') {
      return res.status(401).json({ message: 'Order is not in "Out for Pickup" status' });
    }

    // Query to fetch the OTP for the given order_id and v_id from the order_vender table
    const otpQuery = 'SELECT otp FROM order_vender WHERE order_id = ? AND v_id = ?';
    db.query(otpQuery, [order_id, v_id], (err, otpResults) => {
      if (err) {
        console.error('Error verifying OTP:', err);
        return res.status(500).json({ message: 'Failed to verify OTP' });
      }

      if (otpResults.length === 0) {
        return res.status(404).json({ message: 'OTP not found for this order and vendor' });
      }

      const storedOtp = otpResults[0].otp;

      // Check if the OTP matches
      if (storedOtp != otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      // Calculate the total price of the order items
      const totalPriceQuery = `
        SELECT SUM(oi.price * oi.quantity) AS total_price
        FROM order_items oi
        INNER JOIN menu m ON oi.menu_id = m.id
        WHERE oi.o_id = ? AND m.vendor_id = ?;
      `;

      db.query(totalPriceQuery, [order_id, v_id], (err, priceResults) => {
        if (err) {
          console.error('Error calculating total price:', err);
          return res.status(500).json({ message: 'Failed to calculate total price' });
        }

        if (priceResults.length === 0) {
          return res.status(404).json({ message: 'Order items not found for this vendor' });
        }

        const totalPrice = priceResults[0].total_price;

        // Update order_vender status to 'complete'
        const updateStatusQuery = "UPDATE order_vender SET status = 'Completed' WHERE (order_id = ?) and (v_id = ?)";

        db.query(updateStatusQuery, [order_id, v_id], (err, result) => {
          if (err) {
            console.error('Error updating order_vender status:', err);
            return res.status(500).json({ message: 'Failed to update order status' });
          }

          // Update the vendor's total_en with the total price
          const updateVendorQuery = 'UPDATE vendors SET total_en = total_en + ? WHERE id = ?';
          db.query(updateVendorQuery, [totalPrice, v_id], (err, vendorResult) => {
            if (err) {
              console.error('Error updating vendor total_en:', err);
              return res.status(500).json({ message: 'Failed to update vendor total_en' });
            }

            // Send success response
            res.json({ message: 'OTP verified and order completed successfully' });
          });
        });
      });
    });
  });
});

//check otp
router.post('/check-otp-status', (req, res) => {
  const { order_id, v_id } = req.body;

  // Validate input
  if (!order_id || !v_id) {
    return res.status(400).json({ message: 'order_id and v_id are required' });
  }

  const query = 'SELECT otp FROM order_vender WHERE order_id = ? AND v_id = ?';
  
  db.query(query, [order_id, v_id], (err, result) => {
    if (err) {
      console.error('Error fetching OTP status:', err);
      return res.status(500).json({ message: 'Failed to check OTP status' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Order ID and Vendor ID not found' });
    }

    // Check if OTP exists
    const otpExists = result[0].otp !== null && result[0].otp !== '';
    res.json({
      otpExists: otpExists,
      message: otpExists ? 'OTP already generated' : 'No OTP generated',
    });
  });
});

module.exports = router;
