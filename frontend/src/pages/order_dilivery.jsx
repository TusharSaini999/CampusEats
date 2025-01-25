// src/OrderList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Function to format numbers in Indian style
const formatNumber = (num) => {
  return num.toLocaleString('en-IN');
};

// Function to format dates in DD/MM/YYYY format (Indian Date format)
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', options);
};

// Function to format time in IST (Indian Standard Time)
const formatTime = (dateString) => {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Kolkata',
    hour12: true,
  };
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', options);
};

const OrderDetails = () => {
  const { orderId } = useParams();  // Get the orderId from the URL parameter
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingOrder, setAcceptingOrder] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId || "");
  });
  useEffect(() => {
    axios.get(`http://localhost:4000/delivery/orders_boy_deliver/${orderId}`) // Make request with orderId
      .then(response => {
        setOrder(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch order');
        setLoading(false);
      });
  }, [orderId, order]);  // Refetch if orderId changes

  const handleAcceptOrder = async () => {
    setAcceptingOrder(true);
    try {
      const response = await axios.post('http://localhost:4000/delivery/accept-order', {
        orderId: order.order_id,
        deliveryBoyId: userId, // Replace with the actual delivery boy ID (use context or props if needed)
      });
      setSuccessMessage(response.data.message);
      setOrder({ ...order, dstatus: 'accepted' });
    } catch (err) {
      console.error('Error accepting order:', err.response?.data || err.message);
      setError('Failed to accept order');
    } finally {
      setAcceptingOrder(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Id {order.order_id}</h2>

        {/* Order Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="font-medium text-gray-700">User Name</div>
            <div className="text-gray-600">{order.user_name}</div>

            <div className="font-medium text-gray-700">Email</div>
            <div className="text-gray-600">{order.user_email}</div>

            <div className="font-medium text-gray-700">Phone</div>
            <div className="text-gray-600">{order.user_phone}</div>

            <div className="font-medium text-gray-700">Payment Status</div>
            <div className="text-gray-600">{order.status}</div>

            <div className="font-medium text-gray-700">Delivery Address</div>
            <div className="text-gray-600">{order.delivery_address}</div>

            <div className="font-medium text-gray-700">Order Created Date</div>
            <div className="text-gray-600">{formatDate(order.created_at)}</div>

            <div className="font-medium text-gray-700">Order Created Time</div>
            <div className="text-gray-600">{formatTime(order.created_at)}</div>
          </div>
        </div>

        {/* Vendors Information */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Vendors</h3>
          <div className="space-y-4">
            {order.vendors.map((vendor, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-medium text-gray-700">Vendor Name</div>
                  <div className="text-gray-600">{vendor.name}</div>

                  <div className="font-medium text-gray-700">Status</div>
                  <div className="text-gray-600">{vendor.status}</div>

                  <div className="font-medium text-gray-700">Address</div>
                  <div className="text-gray-600">{vendor.address === 'NULL' ? 'Not Available' : vendor.address}</div>

                  <div className="font-medium text-gray-700">Phone</div>
                  <div className="text-gray-600">{vendor.phone === 'NULL' ? 'Not Available' : vendor.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items Information */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Items</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-medium text-gray-700">Item Name</div>
                  <div className="text-gray-600">{item.name}</div>

                  <div className="font-medium text-gray-700">Quantity</div>
                  <div className="text-gray-600">{item.quantity}</div>

                  <div className="font-medium text-gray-700">Price</div>
                  <div className="text-gray-600">{formatNumber(item.price)} INR</div>

                  <div className="font-medium text-gray-700">Vendor</div>
                  <div className="text-gray-600">{item.vendor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Price */}
        <div className="mt-6 text-lg font-semibold text-gray-800">
          <strong>Total Price:</strong> {formatNumber(order.total_price)} INR
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="font-medium text-gray-700">Delivery Status</div>
          <div className="text-gray-600">{order.dstatus}</div>
        </div>
        <div className="mt-6">
          {order.dstatus === 'pending' && !successMessage ? (
            <button
              onClick={handleAcceptOrder}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
              disabled={acceptingOrder}
            >
              {acceptingOrder ? 'Accepting...' : 'Accept Order for Delivery'}
            </button>
          ) : (
            <div className="text-green-600 font-bold">
              {successMessage || 'Order has already been accepted'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
