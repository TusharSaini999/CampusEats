const express = require("express");
const router = express.Router();
const db = require("./db");

//curl -X GET "http://localhost:4000/order_items?user_id=14"
router.get("/", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const [response] = await db
      .promise()
      .query(
        `SELECT oi.id, oi.quantity, oi.price, oi.item_name, oi.menu_id, m.image_url 
         FROM order_items oi
         JOIN menu m ON oi.menu_id = m.id
         WHERE oi.user_id = ? AND oi.o_id IS NULL`,
        [user_id]
      );

    if (response.length === 0) {
      return res.status(404).json({ message: "No items found for the user" });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching order items:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// Add item to cart
// http://localhost:4000/order_items/add-to-cart
//curl -X POST http://localhost:4000/order_items/add-to-cart -H "Content-Type: application/json" -d "{\"order_id\":101,\"menu_id\":1,\"quantity\":1,\"user_id\":1}"


router.post("/add-to-cart", async (req, res) => {
  const { order_id, menu_id, quantity, user_id } = req.body; // Extract necessary data
  try {
    // Fetch the menu item details
    const [menuItem] = await db
      .promise()
      .query("SELECT name, price FROM menu WHERE id = ?", [menu_id]);

    // Check if the menu item exists
    if (menuItem.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    const { name, price } = menuItem[0];
    const total_price = price * quantity;

    // Query to insert or update the item in the order_items table
    const query = `
      INSERT INTO order_items (order_id, menu_id, quantity, price, item_name, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        quantity = quantity + VALUES(quantity),
        price = VALUES(quantity) * VALUES(price);
    `;

    await db
      .promise()
      .query(query, [order_id, menu_id, quantity, total_price, name, user_id]);

    res.status(200).json({
      message: "Item added to cart successfully",
    });
  } catch (e) {
    console.error("Error adding to cart:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//http://localhost:4000/order_items/update-quantity/14
//curl -X PUT "http://localhost:4000/order_items/update-quantity/14" -H "Content-Type: application/json" -d "{\"quantity\": 5}"

router.put("/update-quantity/:id", async (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;

  if (quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be greater than 0" });
  }

  try {
    // First, fetch the menu_id from the order_items table using the id
    const [orderItemRows] = await db.promise().query(
      "SELECT menu_id FROM order_items WHERE id = ?",
      [id]
    );

    // Check if the order item exists
    if (orderItemRows.length === 0) {
      return res.status(404).json({ error: "Order item not found" });
    }

    const menuId = orderItemRows[0].menu_id; // Get the menu_id from the result

    // Now, check if the requested quantity is available in the menu using the menu_id
    const isQuantityAvailable = await checkAvailabilityInMenu(menuId, quantity);

    if (!isQuantityAvailable) {
      return res.status(400).json({ error: "Requested quantity exceeds availability" });
    }

    // Update the quantity in the order_items table if valid
    const result = await db.promise().query(
      "UPDATE order_items SET quantity = ? WHERE id = ?",
      [quantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Quantity updated successfully" });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to check if the requested quantity is available in the menu
async function checkAvailabilityInMenu(menuId, requestedQuantity) {
  // Query to get the availability of the menu item based on the menuId
  const [menuRows] = await db.promise().query(
    "SELECT availability FROM menu WHERE id = ?",
    [menuId]
  );

  // If no menu item is found, return false
  if (menuRows.length === 0) {
    return false;
  }

  const availability = menuRows[0].availability;

  // Return true if the requested quantity is available, otherwise false
  return availability >= requestedQuantity;
}


//http://localhost:4000/order_items/remove-item/id
router.delete("/remove-item/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }

    const [result] = await db
      .promise()
      .query("DELETE FROM order_items WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Item not found or already deleted" });
    }

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting item:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
