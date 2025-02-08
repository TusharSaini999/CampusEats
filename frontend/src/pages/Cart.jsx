import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isCouponModalOpen, setCouponModalOpen] = useState(false);
  const [isShippingModalOpen, setShippingModalOpen] = useState(false);
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId || "");
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user_id = userId;

        const response = await fetch(
          `https://campuseats-ki1c.onrender.com/order_items?user_id=${user_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        setCartItems(data);

        const total = data.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setSubtotal(total);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleQuantityChange = async (id, newQuantity) => {
    try {
      const response = await fetch(
        `https://campuseats-ki1c.onrender.com/order_items/update-quantity/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      const data = await response.json();

      if (response.status === 400 && data.error) {
        alert(data.error);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );

      setSubtotal(
        cartItems.reduce(
          (sum, item) =>
            item.id === id
              ? sum + item.price * newQuantity
              : sum + item.price * item.quantity,
          0
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await fetch(`https://campuseats-ki1c.onrender.com/order_items/remove-item/${id}`, {
        method: "DELETE",
      });

      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== id);
        const total = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setSubtotal(total);

        return updatedItems;
      });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between p-6">
      {/* Shopping Cart Section */}
      <div className="w-full md:w-2/3">
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

        {/* Dynamically Render Cart Items */}
        {cartItems.length === 0 ? (
          <p className="text-lg text-center font-semibold text-red-600">
            Your cart is empty! Please add items to your cart from the menu.
          </p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      item.image_url
                        ? `${item.image_url}`
                        : "https://res.cloudinary.com/dsljhnanm/image/upload/v1738939765/menu_images/c199pic8rjpnosgnayzg.jpg"
                    }
                    alt={item.name}
                    className="w-20 h-20 object-cover"
                  />

                  <div>
                    <p className="font-semibold">{item.item_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, +e.target.value)
                    }
                    className="w-16 border rounded text-center"
                  />
                  <p className="font-semibold">
                    &#8377;{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-900 mt-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Totals Section */}
      <div className="w-full md:w-1/3 mt-8 md:mt-0 md:ml-6">
        <h2 className="text-2xl font-bold mb-6">Cart Totals</h2>

        <div className="border p-6 space-y-4 rounded">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p className="font-semibold">&#8377;{subtotal.toFixed(2)}</p>
          </div>

          <div>
            <p className="font-semibold mb-2">Shipping</p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <span>Pickup Delivery Cost: &#8377;40.00</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between border-t pt-4">
            <p>Total</p>
            <p className="font-bold">&#8377;{(subtotal + 40).toFixed(2)}</p>
          </div>
          <Link to="/confirm-order">
            <button
              className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 mt-4"
              disabled={cartItems.length === 0} // Disable button if cart is empty
            >
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isCouponModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-white p-6 rounded shadow-lg w-80">
              <h3 className="text-xl font-bold mb-4">Coupon Applied!</h3>
              <p>Your coupon has been successfully applied.</p>
              <button
                onClick={() => setCouponModalOpen(false)}
                className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {isShippingModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-white p-6 rounded shadow-lg w-80">
              <h3 className="text-xl font-bold mb-4">Shipping Calculated</h3>
              <p>Your shipping costs have been updated.</p>
              <button
                onClick={() => setShippingModalOpen(false)}
                className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {isCheckoutModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-white p-6 rounded shadow-lg w-80">
              <h3 className="text-xl font-bold mb-4">Ready to Checkout</h3>
              <p>Proceeding to checkout...</p>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
