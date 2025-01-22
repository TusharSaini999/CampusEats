import React, { useState, useEffect } from "react";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [userType, setUserType] = useState("");
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState("");
  
  const Modal = ({ message, onClose }) => {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
          <p className="text-center text-lg text-gray-800">{message}</p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  // Function to fetch menu items
  const fetchMenuItems = async () => {
    try {
      const response = await fetch("http://localhost:4000/menu/");
      const data = await response.json();

      // Assign default image to items with empty image URLs
      const menuWithImages = data.map((item) => ({
        ...item,
        image_url: item.image_url || "/images/coffee.png", // Fallback image
      }));
      setMenuItems(menuWithImages);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);

    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId || "");


    fetchMenuItems();
    const intervalId = setInterval(fetchMenuItems, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddToCart = async (menu_id) => {
    const order_id = Date.now(); // Generate a unique order ID
    const quantity = 1;
    const user_id = userId;

    if (!user_id) {
      alert("User not logged in.");
      return;
    }

    const selectedItem = menuItems.find((item) => item.id === menu_id);
    if (!selectedItem) {
      alert("Item not found.");
      return;
    }

    const price = selectedItem.price;

    const cartItem = { order_id, menu_id, quantity, price, user_id };

    try {
      const response = await fetch("http://localhost:4000/order_items/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        setModalMessage("Item Add Sussesfuly");
        setShowModal(true);
        setCart((prevCart) => [...prevCart, cartItem]); // Update local cart
      }
      else if (response.status === 400) {
        // Show modal with error message if item is already in cart
        setModalMessage("Item not added because it already exists in the cart.");
        setShowModal(true);
      }
      else if (response.status === 404) {
        // Show modal with error message if item is already in cart
        setModalMessage("Menu item not found");
        setShowModal(true);
      }
      else {
        setModalMessage("Menu item not found");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
const [showModal, setShowModal] = useState(false);
const [modalMessage, setModalMessage] = useState("");
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Our Menu</h1>

        {/* Check if menu is empty */}
        {menuItems.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            <p>No items available in the menu at the moment.</p>
            <p>Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out overflow-hidden"
              >
                {/* Display Image */}
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 truncate">
                    {item.description}
                  </p>
                  <p className="text-md font-bold text-gray-900 mt-3">
                    {item.price}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags?.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="w-full mt-4 bg-purple-500 text-white text-sm py-2 px-3 rounded-md hover:bg-purple-600"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
