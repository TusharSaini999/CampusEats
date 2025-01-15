import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useParams } from "react-router-dom";

// Custom marker icons
const deliveryBoyIcon = new L.Icon({
  iconUrl: "https://static.vecteezy.com/system/resources/previews/008/481/698/original/3d-delivery-person-going-to-deliver-parcel-png.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: "https://cdn3.iconfinder.com/data/icons/minco-location/24/Position-512.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DeliveryTrackingPage = () => {
  const { customerId } = useParams(); // Get customerId from URL
  const [orderId, setOrderId] = useState("");
  const [customerLocation, setCustomerLocation] = useState(null);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [error, setError] = useState("");

  // Fetch customer and delivery boy locations from the backend
  const fetchLocations = async () => {
    try {
      console.log("Fetching locations with Order ID:", orderId, "Customer ID:", customerId);

      const response = await axios.get(
        `http://localhost:4000/map/locationsByCustomer?ord_id=${orderId}&customer_id=${customerId}`
      );

      if (response.data.status === "success") {
        setCustomerLocation(response.data.customer_location);
        setDeliveryBoyLocation(response.data.delivery_boy_location);
        setError("");
      } else {
        setError("Locations not found. Please check the order ID.");
      }
    } catch (err) {
      setError("Error fetching location data. Please try again.");
      console.error(err);
    }
  };

  // Set interval for fetching location updates if both orderId and customerId are available
  useEffect(() => {
    if (orderId && customerId) {
      const interval = setInterval(fetchLocations, 1000); // Fetch every second
      return () => clearInterval(interval); // Cleanup interval when component unmounts or variables change
    }
  }, [orderId, customerId]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderId) {
      setError("Order ID is required.");
    } else {
      setError("");
    }
  };

  // If customerId is missing, show an error message
  if (!customerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error: Customer ID not provided!</h1>
          <p className="text-gray-700">Please provide a valid Customer ID to track the delivery.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      <div className="max-w-6xl mx-auto w-full px-4 flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
        {/* Form to input Order ID */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap md:flex-nowrap gap-4 bg-white p-4 md:p-6 rounded-lg shadow-lg w-full md:w-auto"
        >
          <input
            id="order-id"
            type="text"
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-600 transition duration-200"
          >
            Track
          </button>
        </form>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>

      {/* Map Container */}
      <div className="flex-grow mt-4 md:mt-6 px-2 md:px-10">
        <div className="w-full h-[80vh] rounded overflow-hidden shadow-md">
          <MapContainer
            center={[28.6139, 77.2090]} // Default center
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapCenter customerLocation={customerLocation} deliveryBoyLocation={deliveryBoyLocation} />
            {customerLocation && (
              <Marker
                position={[customerLocation.customer_latitude, customerLocation.customer_longitude]}
                icon={customerIcon}
              >
                <Popup>Customer Location</Popup>
              </Marker>
            )}
            {deliveryBoyLocation && (
              <Marker
                position={[deliveryBoyLocation.delivery_latitude, deliveryBoyLocation.delivery_longitude]}
                icon={deliveryBoyIcon}
              >
                <Popup>Delivery Boy's Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

// MapCenter component to handle view updates with minimal movement check
const MapCenter = ({ customerLocation, deliveryBoyLocation }) => {
  const map = useMap(); // Access map object

  const prevLocation = useRef(null); // Store previous location to compare

  useEffect(() => {
    if (customerLocation || deliveryBoyLocation) {
      const latitude = customerLocation
        ? customerLocation.customer_latitude
        : deliveryBoyLocation.delivery_latitude;
      const longitude = customerLocation
        ? customerLocation.customer_longitude
        : deliveryBoyLocation.delivery_longitude;

      // Check if the new location is significantly different from the previous one (minimal movement threshold)
      if (
        prevLocation.current &&
        Math.abs(prevLocation.current.lat - latitude) < 0.0001 &&
        Math.abs(prevLocation.current.lng - longitude) < 0.0001
      ) {
        return; // Do not trigger animation for minimal changes
      }

      // Update previous location to the new one
      prevLocation.current = { lat: latitude, lng: longitude };

      // Smooth animation on every significant location change with flyTo()
      map.flyTo([latitude, longitude], 15, { animate: true, duration: 2 }); // 2 seconds smooth animation
    }
  }, [customerLocation, deliveryBoyLocation, map]); // Re-run when locations change

  return null; // This component does not render anything itself
};

export default DeliveryTrackingPage;
