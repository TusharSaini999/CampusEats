import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

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

  
      console.log(response.data); 

      if (response.data.orders) {
        setOrders(response.data.orders);
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
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="flex flex-col sm:flex-row bg-gray-100 p-4 rounded-lg shadow-sm"
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
                    <p className="text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Total Price */}
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                    <h3 className="font-semibold text-gray-700">Total Price:</h3>
                    <p className="text-gray-600">Rs{order.total_price}</p>
                  </div>

                  {/* Payment Status */}
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                    <h3 className="font-semibold text-gray-700">Payment Status:</h3>
                    <p className="text-gray-600">{order.payment_status}</p>
                  </div>

                  {/* Delivery Address */}
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                    <h3 className="font-semibold text-gray-700">Delivery Address:</h3>
                    <p className="text-gray-600">{order.delivery_address}</p> {/* Add address field */}
                  </div>

                  {/* Delivery Status */}
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                    <h3 className="font-semibold text-gray-700">Status:</h3>
                    <p className="text-gray-600">{order.status}</p> {/* Add delivery status field */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
