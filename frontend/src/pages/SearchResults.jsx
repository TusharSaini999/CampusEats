import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [userId, setUserId] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
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
  // Extract query parameter from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId || "");
  });
  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) {
        setLoading(false);
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/menu/search-menu/${searchQuery}`
        );
        setResults(response.data);
      } catch (err) {
        console.log(searchQuery);
        setError("Failed to fetch results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  const handleAddToCart = async (menu_id) => {

    const user_id = userId;

    if (!user_id) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const order_id = Date.now();
    const quantity = 1;

    const selectedItem = results.find((item) => item.id === menu_id);
    if (!selectedItem) return;

    const price = selectedItem.price;

    const cartItem = { order_id, menu_id, quantity, price, user_id }; // Add user_id to cart item

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/order_items/add-to-cart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cartItem),
        }
      );

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
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
          Search Results
        </h1>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 overflow-hidden"
            >
              {/* Skeleton for Image */}
              <div className="w-full h-48 bg-gray-300 animate-pulse" />
    
              {/* Skeleton for Content */}
              <div className="p-4">
                {/* Title Skeleton */}
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 animate-pulse" />
                {/* Category Skeleton */}
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
                {/* Price Skeleton */}
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-3 animate-pulse" />
                {/* Button Skeleton */}
                <div className="h-8 bg-gray-400 rounded-md w-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        )}
        {error && (
          <p className="text-center text-lg text-red-600">{error}</p>
        )}
        {!loading && results.length === 0 && (
          <p className="text-center text-lg text-gray-600">
            No results found for "{searchQuery}"
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 overflow-hidden"
              >
                {/* Image */}
                <img
                  src={
                    result.image_url
                      ? `${result.image_url}`
                      : "https://res.cloudinary.com/cloud451752/image/upload/v1738939765/menu_images/c199pic8rjpnosgnayzg.jpg"
                  }
                  alt={result.name}
                  className="w-full h-48 object-cover"
                />


                {/* Content */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {result.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    Category: {result.category}
                  </p>
                  <p className="text-md font-bold text-gray-900 mt-3">
                    Rs {result.price}
                  </p>


                  {/* Handle Availability and Vendor Current Status */}
                  {result.availability === 0 ? (
                    <p className="text-red-500 text-sm font-semibold mt-4">
                      Out of Stock
                    </p>
                  ) : result.current === 0 ? (
                    <p className="text-gray-500 text-sm font-semibold mt-4">
                      Vendor is unavailable at this moment
                    </p>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(result.id)}
                      className="w-full mt-4 bg-purple-500 text-white text-sm py-2 px-3 rounded-md hover:bg-purple-600"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
