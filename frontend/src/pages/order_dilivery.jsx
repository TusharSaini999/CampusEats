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
  const [otp, setOtp] = useState(""); // State to store OTP input

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };
  const [userType, setUserType] = useState("");
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId || "");
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType || "");
  });
  useEffect(() => {
    axios.get(`https://campuseats-ki1c.onrender.com/delivery/orders_boy_deliver/${orderId}`) // Make request with orderId
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
      const response = await axios.post('https://campuseats-ki1c.onrender.com/delivery/accept-order', {
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

  // Function to update order status to 'Out for Delivery'
  const handleOutForDelivery = async () => {
    try {
      const response = await axios.post('https://campuseats-ki1c.onrender.com/delivery/out-for-delivery', {
        orderId: order.order_id,
        deliveryBoyId: userId, // Get the delivery boy ID from local storage
      });

      setSuccessMessage(response.data.message);
      setOrder({ ...order, dstatus: 'out for delivery' });
    } catch (err) {
      console.error('Error updating order status:', err.response?.data || err.message);
      setError('Failed to update order status');
    }
  };

  const allVendorsCompleted = order?.vendors?.every(vendor => vendor.status === 'Completed');

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }
  const handleGenerateOtp = async () => {
    try {
      // Call the API with the order ID
      const response = await axios.post("https://campuseats-ki1c.onrender.com/delivery/generate-otp", {
        orderId: order.order_id, // Replace with your order ID variable
      });

      // Show the generated OTP and update the state
      alert(`Send Otp secssfully`);
      setOrder((prevOrder) => ({ ...prevOrder, delivery_otp: response.data.otp }));
    } catch (err) {
      console.error("Error generating OTP:", err.response?.data || err.message);
      alert("Failed to generate OTP. Please try again.");
    }
  };


  // Handle delivery verification
  const handleVerifyDelivery = async () => {
    if (!otp) {
      alert("Please enter the OTP to verify delivery.");
      return;
    }
    setLoading(true);
    console.log(order.order_id, userId, otp);
    try {
      await axios.post("https://campuseats-ki1c.onrender.com/delivery/verify-delivery", {
        orderId: order.order_id,
        deliveryBoyId: userId, // Pass the delivery boy ID
        otp,
      });
      alert("Order delivered successfully!");
      setOrder((prevOrder) => ({ ...prevOrder, dstatus: "delivered" }));
    } catch (err) {
      console.error("Error verifying delivery:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to verify delivery.");
    } finally {
      setLoading(false);
    }
  };

  // Handle order rejection by user
  const handleRejectOrderByUser = async () => {
    if (!otp) {
      alert("Please enter the OTP to reject the order.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("https://campuseats-ki1c.onrender.com/delivery/reject-order", {
        orderId: order.order_id,
        deliveryBoyId: userId, // Pass the delivery boy ID
        otp,
      });
      alert("Order rejected successfully.");
      setOrder((prevOrder) => ({ ...prevOrder, dstatus: "rejected" }));
    } catch (err) {
      console.error("Error rejecting order:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to reject order.");
    } finally {
      setLoading(false);
    }
  };

  // Handle order rejection due to no response
  const handleRejectOrderNoResponse = async () => {
    setLoading(true);
    try {
      await axios.post("https://campuseats-ki1c.onrender.com/delivery/reject-order-no-response", {
        orderId: order.order_id,
        deliveryBoyId: userId, // Pass the delivery boy ID
      });
      alert("Order rejected due to no response from the user.");
      setOrder((prevOrder) => ({ ...prevOrder, dstatus: "rejected" }));
    } catch (err) {
      console.error("Error rejecting order due to no response:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to reject order.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectvender = async () => {
    setLoading(true);
    try {
      await axios.post("https://campuseats-ki1c.onrender.com/delivery/reject-order-vender", {
        orderId: order.order_id,
        deliveryBoyId: userId, // Pass the delivery boy ID
      });
      alert("Order rejected due to no Vender");
      setOrder((prevOrder) => ({ ...prevOrder, dstatus: "rejected" }));
    } catch (err) {
      console.error("Error rejecting vender", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to reject order.");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="text-gray-600">{order.payment_status}</div>

            <div className="font-medium text-gray-700">Delivery Address</div>
            <div className="text-gray-600">{order.delivery_address}</div>

            <div className="font-medium text-gray-700">Order Created Date</div>
            <div className="text-gray-600">{formatDate(order.created_at)}</div>

            <div className="font-medium text-gray-700">Order Created Time</div>
            <div className="text-gray-600">{formatTime(order.created_at)}</div>
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
        {/* Vendors Information */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Vendors</h3>
          <div className="space-y-4">
            {order.vendors.map((vendor, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-medium text-gray-700">Vendor Name</div>
                  <div className="text-gray-600">{vendor.vendor_name}</div>

                  <div className="font-medium text-gray-700">Status</div>
                  <div className="text-gray-600">{vendor.status}</div>

                  <div className="font-medium text-gray-700">Address</div>
                  <div className="text-gray-600">{vendor.address === 'NULL' ? 'Not Available' : vendor.address}</div>

                  <div className="font-medium text-gray-700">Phone</div>
                  <div className="text-gray-600">{vendor.phone === 'NULL' ? 'Not Available' : vendor.phone}</div>
                  {/* Show OTP if order is accepted and OTP is not null */}
                  {order.dstatus !== 'pending' && userType === 'delivery_boy' && vendor.otp && (
                    <>
                      <div className="font-medium text-red-500">OTP</div>
                      <div className="text-red-500">{vendor.otp}</div>
                    </>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items Information */}
        {userType === "user" && order.delivery_boy && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Delivery Boy Details</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-medium text-gray-700">ID</div>
                  <div className="text-gray-600">{order.delivery_boy.id}</div>

                  <div className="font-medium text-gray-700">Name</div>
                  <div className="text-gray-600">{order.delivery_boy.name}</div>

                  <div className="font-medium text-gray-700">Email</div>
                  <div className="text-gray-600">{order.delivery_boy.email}</div>

                  <div className="font-medium text-gray-700">Phone</div>
                  <div className="text-gray-600">{order.delivery_boy.phone}</div>
                  <div className="font-medium text-gray-700">Delivery Status</div>
                  <div className="text-gray-600">{order.dstatus}</div>
                  {order.uotp && (
                    <>

                      <div className="font-medium text-red-500">OTP</div>
                      <div className="text-red-500">{order.uotp}</div>

                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Total Price */}
        <div className="mt-6 text-lg font-semibold text-gray-800">
          <strong>Total Price:</strong> {formatNumber(order.total_price)} INR
        </div>


        {userType === 'delivery_boy' && (
          <div>
            <div className="grid grid-cols-2 gap-4 mt-4">
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
            {/* Show "Out for Delivery" button if all vendors are completed */}
            {order.dstatus === 'accepted' && allVendorsCompleted && order.dstatus !== 'out for delivery' && (
              <button
                onClick={handleOutForDelivery}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition mt-4"
              >
                Out for Delivery
              </button>
            )}
            {order.dstatus !== 'accepted' && order.dstatus !== 'pending' && (
              <div className="text-yellow-500 font-bold mt-4">
                Already Out for Delivery
              </div>

            )}
            {/* Check if all vendors are completed */}
            {order?.vendors?.every(vendor => vendor.status === 'Completed') && (
              <div className="text-pink-400 font-bold mt-4">
                All vendors have completed their tasks.
              </div>
            )}

            {/* Check if any vendor is rejected */}
            {order?.vendors?.some(vendor => vendor.status === 'Rejected') && order.dstatus !== 'rejected' && (
              <button
                onClick={handleRejectvender} // Replace with your handler function
                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition mt-4"
              >
                Rejected by Vendor
              </button>
            )}
            {order.dstatus === 'out for delivery' && (
              <div className="mt-4">
                {order.uotp ? (
                  <button
                    onClick={handleGenerateOtp}
                    className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateOtp}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                  >
                    Generate OTP
                  </button>
                )}

                <div>
                  {order.dstatus === "out for delivery" && (
                    <div className="mt-4">
                      <input
                        type="text"
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="Enter OTP"
                        className="border border-gray-300 rounded py-2 px-4 w-64 mr-4"
                      />

                      {/* Verify Delivery Button */}
                      <button
                        onClick={handleVerifyDelivery}
                        className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Verify Delivery"}
                      </button>

                      {/* Reject Order by User */}
                      <button
                        onClick={handleRejectOrderByUser}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition ml-4"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Reject by User"}
                      </button>
                    </div>
                  )}

                  {order.dstatus === "out for delivery" && (
                    <div className="mt-4">
                      {/* Reject Order by No Response */}
                      <button
                        onClick={handleRejectOrderNoResponse}
                        className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Reject due to No Response"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {order.dstatus === "delivered" && (
              <p className="text-blue-400 font-bold mt-4" role="alert">
                This Order already Delivered
              </p>
            )}
            {order.dstatus === "rejected" && (
              <p className="text-red-500 font-bold mt-4" role="alert">
                This Order already Rejected
              </p>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
