import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setisLoading] = useState(true);
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
      setisLoading(true);
      const response = await axios.post(import.meta.env.VITE_API_URL + "/orders/history", {
        user_id: userId,
      });

      if (response.data.orders) {
        const sortedOrders = response.data.orders.sort((a, b) => b.id - a.id);
        setOrders(sortedOrders);
        setisLoading(false);
      } else {
        setError("No orders found.");
        setisLoading(false);
      }
    } catch (err) {
      console.error("Error fetching order history:", err);
      setError("Failed to fetch order history.");
      setisLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 flex items-center justify-center py-8 px-4">
      <div className="bg-white min-h-screen p-8 rounded-lg shadow-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Order History</h2>
  
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}
  
        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 text-sm">
                    <th className="p-4 text-left">
                      <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="text-sm text-gray-600 border-b">
                      <td className="p-4">
                        <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Order List
          orders.length > 0 ? (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 text-sm">
                      <th className="p-4 text-left">Order ID</th>
                      <th className="p-4 text-left">Date</th>
                      <th className="p-4 text-left">Time</th>
                      <th className="p-4 text-left">Total Price</th>
                      <th className="p-4 text-left">Payment Status</th>
                      <th className="p-4 text-left">Delivery Address</th>
                      <th className="p-4 text-left">Delivery Status</th>
                      <th className="p-4 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const orderDate = new Date(order.created_at);
                      const date = orderDate.toLocaleDateString();
                      const time = orderDate.toLocaleTimeString();
  
                      return (
                        <tr
                          key={order.order_id}
                          className={`text-sm text-gray-600 border-b ${order.status === "rejected"
                            ? "bg-red-100"
                            : order.status === "delivered"
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          <td className="p-4">{order.id}</td>
                          <td className="p-4">{date}</td>
                          <td className="p-4">{time}</td>
                          <td className="p-4">Rs {order.total_price}</td>
                          <td className="p-4">{order.payment_status}</td>
                          <td className="p-4">{order.delivery_address}</td>
                          <td className="p-4">{order.status}</td>
                          <td className="p-4">
                            <button
                              onClick={() => navigate(`/order-dilivery/${order.id}`)}
                              className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">No orders found.</p>
          )
        )}
      </div>
    </div>
  );
  
};

export default OrderHistory;
