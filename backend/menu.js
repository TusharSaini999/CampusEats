const express = require("express");
const router = express.Router();
const db = require("./db");
const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');
const { verifyToken } = require("./middleware/auth");

// Get menu by vendor_id
// Example: http://localhost:4000/menu/?vendor_id=1
router.get("/vend", verifyToken, async (req, res) => {
  const { vendor_id } = req.query; // Get vendor_id from query parameter

  if (!vendor_id) {
    return res.status(400).json({ error: "Vendor ID is required" });
  }

  try {
    const response = await db
      .promise()
      .query(`SELECT * FROM menu WHERE vendor_id = ?`, [vendor_id]);
    res.status(200).json(response[0]);
  } catch (e) {
    res.status(400).json(e);
  }
});


// API endpoint to handle POST request for adding a dish
//curl -X POST http://localhost:4000/menu/post-menu -F "vendor_id=1" -F "name=Dish Name" -F "description=Dish Description" -F "price=100" -F "category=Category" -F "availability=1" -F "image_url=@C:/Users/tusha/OneDrive/Pictures/Screenshots/1.png" -F "created_at=2005/04/23"
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'compuseats/menu', // Cloudinary folder for storing images
    format: async (req, file) => 'png', // Automatically convert images to PNG
  },
});

const upload = multer({ storage });

router.post('/post-menu', verifyToken, upload.single('image_url'), async (req, res) => {
  const { vendor_id, name, description, price, category, availability } = req.body;

  const image_url = req.file ? req.file.path : null;

  if (!image_url) {
    return res.status(400).json({ error: "Image is required" });
  }

  try {
    await db.promise().query(
      `INSERT INTO menu (vendor_id, name, description, price, category, image_url, availability) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [vendor_id, name, description, price, category, image_url, availability]
    );
    res.status(201).json({ message: "Dish added successfully!", imageUrl: image_url });
  } catch (e) {
    console.error("POST menu error:", e);
    res.status(400).json({ error: e.message });
  }
});



//get menu
//http://localhost:4000/menu/
router.get("/", async (req, res) => {
  try {
    const response = await db.promise().query(`SELECT 
    menu.*,
    vendors.current
FROM 
    menu
JOIN 
    vendors 
ON 
    menu.vendor_id = vendors.id Where menu.delete != 1;
`);
    res.status(200).json(response[0]);
  } catch (e) {
    res.status(400).json(e);
  }
});
////http://localhost:4000/menu/update-menu/:id=1
router.put("/update-menu/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, availability } =
    req.body;

  try {
    const query = `
      UPDATE menu 
      SET 
        name = ?, 
        description = ?, 
        price = ?, 
        category = ?, 
        availability = ?
      WHERE id = ?`;

    const [response] = await db
      .promise()
      .query(query, [
        name,
        description,
        price,
        category,
        availability,
        id,
      ]);

    res.status(200).json({ message: "Menu item updated successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

////http://localhost:4000/menu/delete-menu/:id=
router.delete("/delete-menu/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const query = "UPDATE menu SET `delete` = 1 WHERE id = ?";
    await db.promise().query(query, [id]);
    res.status(200).json({ message: "Menu item marked as deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark menu item as deleted" });
  }
});


// Search API for menu items
//http://localhost:4000/menu/search-menu/pizza
router.get("/search-menu/:query", (req, res) => {
  const { query } = req.params;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  const sql = `
  SELECT menu.*, vendors.current FROM menu JOIN vendors ON menu.vendor_id = vendors.id WHERE (menu.name LIKE ? OR menu.category LIKE ?) AND menu.delete != 1`;
  const values = [`%${query}%`, `%${query}%`];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error." });
    }
    res.json(results);
  });
});

module.exports = router;
