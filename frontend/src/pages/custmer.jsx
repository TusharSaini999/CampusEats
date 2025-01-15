import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import axios from "axios";
import { useParams } from "react-router-dom";

// Custom marker icons
const deliveryBoyIcon = new L.Icon({
  iconUrl:
    "https://static.vecteezy.com/system/resources/previews/008/481/698/original/3d-delivery-person-going-to-deliver-parcel-png.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: "https://cdn3.iconfinder.com/data/icons/minco-location/24/Position-512.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DeliveryTrackingPage = () => {
  const { deliveryid } = useParams(); // Get delivery boy ID from URL
  const [orderId, setOrderId] = useState("");
  const [customerLocation, setCustomerLocation] = useState(null);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [error, setError] = useState("");

  // Fetch customer and delivery boy locations from the backend
  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/map/locations?ord_id=${orderId}&deli_boy=${deliveryid}`
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

  useEffect(() => {
    if (orderId && deliveryid) {
      fetchLocations(); // Fetch locations initially
    }
  }, [orderId, deliveryid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderId) {
      fetchLocations();
      setError("");
    } else {
      setError("Order ID is required.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 text-gray-900 flex flex-col">
      <div className="max-w-4xl mx-auto w-full p-6 bg-white shadow-md rounded-md mt-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
          Track Your Delivery
        </h1>
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <input
            id="order-id"
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-600 transition duration-200"
          >
            Track
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
      <div className="flex-grow mt-10 px-4">
        <div className="w-full h-[70vh] rounded-md overflow-hidden shadow-md">
          <MapContainer
            center={[28.6139, 77.2090]} // Default center
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {customerLocation && (
              <Marker
                position={[
                  customerLocation.customer_latitude,
                  customerLocation.customer_longitude,
                ]}
                icon={customerIcon}
              >
                <Popup>Customer Location: {customerLocation.address}</Popup>
              </Marker>
            )}
            {deliveryBoyLocation && (
              <Marker
                position={[
                  deliveryBoyLocation.delivery_latitude,
                  deliveryBoyLocation.delivery_longitude,
                ]}
                icon={deliveryBoyIcon}
              >
                <Popup>
                  <div>
                    <strong>Delivery Boy Instructions:</strong><br />
                    Start from your current location: <br />
                    Latitude: {deliveryBoyLocation.delivery_latitude}, Longitude: {deliveryBoyLocation.delivery_longitude} <br />
                    Proceed towards the customer location: <br />
                    Latitude: {customerLocation.customer_latitude}, Longitude: {customerLocation.customer_longitude}
                  </div>
                </Popup>
              </Marker>
            )}
            {customerLocation && deliveryBoyLocation && (
              <Routing
                customerLocation={customerLocation}
                deliveryBoyLocation={deliveryBoyLocation}
              />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

// Routing Component
const Routing = ({ customerLocation, deliveryBoyLocation }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (customerLocation && deliveryBoyLocation) {
      try {
        // Remove existing routing control safely
        if (routingControlRef.current) {
          routingControlRef.current.getPlan().setWaypoints([]);
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }

        // Create a new routing control
        routingControlRef.current = L.Routing.control({
          waypoints: [
            L.latLng(
              deliveryBoyLocation.delivery_latitude,
              deliveryBoyLocation.delivery_longitude
            ),
            L.latLng(
              customerLocation.customer_latitude,
              customerLocation.customer_longitude
            ),
          ],
          routeWhileDragging: false,
          createMarker: function () {
            return null; // Disable default markers for the route
          },
          lineOptions: {
            styles: [{ color: "blue", weight: 4 }],
          },
          draggableWaypoints: false, // Disable waypoint dragging
          addWaypoints: false,
        }).addTo(map);

        // Disable route updates and clicks on the route
        routingControlRef.current.getPlan().on("click", (e) => {
          e.preventDefault();  // Disable any click action on the route
          console.log("Route click disabled");
        });

      } catch (error) {
        console.error("Error setting up routing:", error);
      }

      // Cleanup on component unmount
      return () => {
        try {
          if (routingControlRef.current) {
            routingControlRef.current.getPlan().setWaypoints([]);
            map.removeControl(routingControlRef.current);
            routingControlRef.current = null;
          }
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      };
    }
  }, [customerLocation, deliveryBoyLocation, map]);

  return null;
};

export default DeliveryTrackingPage;
