import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

const PaymentConfirmation = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerLatitude, setCustomerLatitude] = useState(null);
  const [customerLongitude, setCustomerLongitude] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId || "");
  }, []);

  // Fetch current location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCustomerLatitude(position.coords.latitude);
        setCustomerLongitude(position.coords.longitude);
        fetchAddress(position.coords.latitude, position.coords.longitude); // Fetch address after getting location
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const fetchTotalPrice = async () => {
      if (!userId) return;

      try {
        const response = await axios.post(import.meta.env.VITE_API_URL + "/orders/total-price", {
          user_id: userId,
        });

        if (response.data.total_price) {
          const updatedTotalPrice = parseFloat(response.data.total_price) + 40;
          setTotalPrice(updatedTotalPrice);
        } else {
          setError("No order items found.");
        }
      } catch (err) {
        console.error("Error fetching total price:", err);
        setError("Failed to fetch total price.");
      }
    };

    fetchTotalPrice();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + "/orders/create-order", {
        user_id: userId,
        total_price: totalPrice,
        delivery_address: deliveryAddress,
        customer_latitude: customerLatitude,
        customer_longitude: customerLongitude,
        payment_status: "success",
      });

      if (response.data.order_id) {
        setOrderId(response.data.order_id);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Failed to create order.");
    }
  };

  // Custom component to handle map click event
  const LocationMarker = ({ setLocation }) => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation(lat, lng); // Update the latitude and longitude based on click
        map.flyTo([lat, lng], map.getZoom()); // Optionally center the map on the click location

        // Fetch address from the selected location
        fetchAddress(lat, lng);
      },
    });

    return null;
  };

  // Fetch address using reverse geocoding (Nominatim API)
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      if (response.data && response.data.display_name) {
        setDeliveryAddress(response.data.display_name);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setError("Failed to fetch address.");
    }
  };

  // Custom marker icon
  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/5338/5338804.png", // Replace with your image URL
    iconSize: [32, 32], // Adjust the size as needed
    iconAnchor: [16, 32], // Anchor the marker to the bottom center
    popupAnchor: [0, -32], // Position popup above the marker
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center w-full sm:w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Order</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Order Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Delivery Address</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>

            {/* Latitude and Longitude from Map */}
            <div>
              <label className="block text-gray-700">Customer Latitude</label>
              <input
                type="text"
                value={customerLatitude || ""}
                readOnly
                className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700">Customer Longitude</label>
              <input
                type="text"
                value={customerLongitude || ""}
                readOnly
                className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
              />
            </div>

            {/* Toggle Map Button */}
            <div className="my-4">
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {showMap ? "Hide Map" : "Select Location on Map"}
              </button>
            </div>

            {/* Map for selecting location */}
            {showMap && (
              <div className="w-full h-64 mt-4">
                <MapContainer
                  center={[customerLatitude || 28.7041, customerLongitude || 77.1025]} // Default to user's location or a default
                  zoom={13}
                  style={{ width: "100%", height: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker setLocation={(lat, lng) => {
                    setCustomerLatitude(lat);
                    setCustomerLongitude(lng);
                  }} />
                  {customerLatitude && customerLongitude && (
                    <Marker
                      position={[customerLatitude, customerLongitude]}
                      icon={customIcon} // Use the custom icon
                    >
                      <Popup>Your selected location</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            )}

            <div>
              <label className="block text-gray-700">Total Price</label>
              <input
                type="text"
                value={`Rs${totalPrice}`}
                readOnly
                className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </form>

        {/* Modal Confirmation */}
        {isModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 1050 }}>
            <div className="bg-white p-8 rounded-lg shadow-md text-center w-96">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-16 h-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Successful!</h2>
              <p className="text-gray-600 mb-4">
                Your order has been placed successfully.
              </p>
              <div className="bg-gray-100 p-4 rounded-md inline-block mb-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Order ID: </span>
                  {orderId}
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => (window.location.href = "/order-history")}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
                >
                  View Order History
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmation;
