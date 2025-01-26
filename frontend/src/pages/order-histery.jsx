import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("id");

    if (userId) {
      fetchOrderHistory(userId);
    } else {
      setError("User not logged in.");
    }
  }, []);

  const fetchOrderHistory = async (userId) => {
    try {
      const response = await axios.post("http://localhost:4000/orders/history", {
        user_id: userId,
      });

      if (response.data.orders) {
        const sortedOrders = response.data.orders.sort((a, b) => b.id - a.id); // Sort in descending order by ID
        setOrders(sortedOrders);
      } else {
        setError("No orders found.");
      }
    } catch (err) {
      console.error("Error fetching order history:", err);
      setError("Failed to fetch order history.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-md text-center w-full sm:w-96 lg:w-1/2 xl:w-1/3">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Order List */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderDate = new Date(order.created_at);
              const date = orderDate.toLocaleDateString();
              const time = orderDate.toLocaleTimeString();

              return (
                <div
                  key={order.order_id}
                  className={`flex flex-col sm:flex-row bg-gray-100 p-4 rounded-lg shadow-sm ${order.status === "rejected"
                      ? "bg-red-100"
                      : order.status === "delivered"
                        ? "bg-green-100"
                        : ""
                    }`}
                >
                  <div className="flex-1">
                    {/* Order ID */}
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                      <h3 className="font-semibold text-gray-700">Order ID:</h3>
                      <p className="text-gray-600">{order.id}</p>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                      <h3 className="font-semibold text-gray-700">Date:</h3>
                      <p className="text-gray-600">{date}</p>
                    </div>

                    {/* Time */}
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                      <h3 className="font-semibold text-gray-700">Time:</h3>
                      <p className="text-gray-600">{time}</p>
                    </div>

                    {/* Total Price */}
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                      <h3 className="font-semibold text-gray-700">Total Price:</h3>
                      <p className="text-gray-600">Rs {order.total_price}</p>
                    </div>

                    {/* Payment Status */}
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                      <h3 className="font-semibold text-gray-700">Payment Status:</h3>
                      <p className="text-gray-600">{order.payment_status}</p>
                    </div>

                    {/* Delivery Address */}
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                      <h3 className="font-semibold text-gray-700">Delivery Address:</h3>
                      <p className="text-gray-600">{order.delivery_address}</p>
                    </div>

                    {/* Delivery Status */}
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                      <h3 className="font-semibold text-gray-700">Delivery Status:</h3>
                      <p className="text-gray-600">{order.status}</p>
                    </div>

                    {/* Details Button */}
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => navigate(`/order-dilivery/${order.id}`)}
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
