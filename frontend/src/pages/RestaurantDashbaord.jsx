import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
// import { AiOutlinePlus } from "react-icons/ai";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const RestaurantDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  // const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [vendor_id, setVendorId] = useState("");
  const [profileData, setProfileData] = useState([]);
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");
  const [modalOpen, setModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [auccessMessage, aetSuccessMessage] = useState("");
  const [orderId, setOrderId] = useState('');
  const [result, setResult] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderOtp, setOrderOtp] = useState("");
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(""); // For the selected order ID


  const [orderDetails, setOrderDetails] = useState({
    totalEarnings: 0,
    totalCompletedOrders: 0,
    totalPendingOrders: 0,
    totalAcceptedOrders: 0,
    totalRejectedOrders: 0,
    totalOutforPickupOrders: 0,
    totalPrepared: 0,
  });
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId || "");
  });

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [isRejected, setIsRejected] = useState(false);
  const [message, setMessage] = useState("");
  const handleSearch = async () => {
    if (!orderId) {
      setError('Please enter an Order ID.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/vendors/search-orders/${userId}?orderId=${orderId}`);
      const data = await response.json();

      console.log('Response Data:', data); // Log the entire response from the server

      if (response.ok) {
        if (data.result && Array.isArray(data.result) && data.result.length > 0) {
          setResult(data.result); // Set the result state if it's an array and not empty
          setError('');
        } else {
          setResult([]);
          setError('No orders found.');
        }
      } else {
        setResult([]);
        setError(data.message || 'No orders found.');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResult([]);
      setError('An error occurred while searching.');
    }
  };
  // Fetch status when an order is selected
  useEffect(() => {
    if (selectedOrder) {
      axios
        .get(`http://localhost:4000/vendors/order-status?order_id=${selectedOrder}&vendor_id=${userId}`)
        .then((response) => {
          setOrderStatus(response.data.status);
          setErrorMessage(""); // Clear error messages
        })
        .catch((error) => {
          console.error("Error fetching order status:", error);
          setErrorMessage("Failed to fetch order status. Please try again.");
        });
    }
  }, [selectedOrder, userId]);
  const handleGenerateOtp = () => {
    console.log(selectedOrder);
    axios
      .post("http://localhost:4000/vendors/generate-otp", {
        order_id: selectedOrder,
        v_id: userId,
      })
      .then((response) => {
        setIsOtpGenerated(true);
        setErrorMessage(""); // Clear errors
      })
      .catch((error) => {
        console.error("Error generating OTP:", error);
        setErrorMessage("Failed to generate OTP. Please try again.");
      });
  };
  const handleCompleteOrder = () => {
    console.log('Selected Order:', selectedOrder);
    console.log('User ID:', userId);
    console.log('OTP:', orderOtp);

    axios
      .post("http://localhost:4000/vendors/verify-otp", {
        order_id: selectedOrder,
        v_id: userId,
        otp: orderOtp,
      })
      .then((response) => {
        setErrorMessage("");
        alert("Order completed successfully!");
        handleCloseModal(); // Close modal after success
      })
      .catch((error) => {
        console.error("Error completing order:", error.response || error.message);
        setErrorMessage("Invalid OTP or unable to complete order.");
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(""); // Resetting selectedOrder
    setOrderOtp("");
    setIsOtpGenerated(false);
    setOrderStatus(null);
    setErrorMessage("");
  };
  const resetModalState = () => {
    setSelectedOrder("");
    setOrderStatus(null);
    setIsOtpGenerated(false);
    setOrderOtp("");
    setErrorMessage("");
    handleCloseModal();
  };


  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedOrderId("");
    setMessage("");
    setStatus(null);
    setIsRejected(false);
    setSuccessMessage("");
    aetSuccessMessage("");
  };

  const handleAccept = () => {
    setStatus("Accepted");
    updateOrderStatus("Accepted");
  };

  const handlePrepared = () => {
    setStatus("Prepared");
    updateOrderStatus("Prepared");
  };

  const handleReadyForPickup = () => {
    setStatus("Out for Pickup");
    updateOrderStatus("Out for Pickup");
    handleModalClose();
  };

  const handleReject = () => {
    setIsRejected(true);
  };
  const updateOrderStatus = (newStatus) => {
    axios
      .post("http://localhost:4000/vendors/assign-order", {
        vendor_id: userId,
        order_id: selectedOrderId,
        status: newStatus,
        message: message || null,
      })
      .then((response) => {
        console.log(response.data);
        setStatus(newStatus);
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };
  //feache prevous stusts
  useEffect(() => {
    if (modalOpen && selectedOrderId) {
      axios
        .get(`http://localhost:4000/vendors/order-status?order_id=${selectedOrderId}&vendor_id=${userId}`)
        .then((response) => {
          setStatus(response.data.status);
        })
        .catch((error) => {
          console.error("Error fetching order status:", error);
        });
    }
  }, [modalOpen, selectedOrderId, userId]);
  useEffect(() => {
    if (status === "Out for Pickup" || status === "Completed") {
      setSuccessMessage("🚚 This order is marked as Out for Pickup! 🚚");
    } else if (status === "Accepted") {
      setSuccessMessage("✅ This order is marked as Accepted! ✅");
    } else if (status === "Prepared") {
      setSuccessMessage("🍽️ This order is marked as Prepared! 🍽️");
    } else if (status === "Rejected") {
      aetSuccessMessage("❌ This order is marked as Rejected! ❌");
    } else {
      aetSuccessMessage("");
      setSuccessMessage("");
    }
  }, [status]);


  useEffect(() => {
    const fetchVendorStatus = async () => {
      try {
        const response = await fetch(`http://localhost:4000/vendors/vendor-status/${vendor_id}`);
        const data = await response.json();

        if (response.ok) {
          setIsOnline(data.current === 1);
        } else {
          console.error("Error fetching vendor status:", data.error);
          setIsOnline(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setIsOnline(false);
      }
    };

    fetchVendorStatus();
  }, [userId]);




  const toggleOnlineStatus = async () => {
    const newStatus = isOnline ? 0 : 1;
    try {
      const response = await fetch("http://localhost:4000/vendors/update-vendor-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorId: vendor_id,
          current: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {

        setIsOnline(!isOnline);
      } else {
        console.error("Error updating status:", data.error);
        alert("Failed to update vendor status. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating the status.");
    }
  }
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setVendorId(decodedToken.id);
    }
  }, []);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:4000/vendors/orders/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.orders); // Assuming `data.orders` contains the orders array
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userId, orders]);
  const formatDateTime = (dateTime) => {
    const dateOptions = { day: "2-digit", month: "long", year: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

    const formattedDate = new Date(dateTime).toLocaleDateString("en-IN", dateOptions);
    const formattedTime = new Date(dateTime).toLocaleTimeString("en-IN", timeOptions);

    return `${formattedDate} at ${formattedTime}`;
  };


  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.log("No token found!");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:4000/users/profile",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setProfileData(response.data);
      } catch (err) {
        console.error("Error fetching profile data:", err.message);
      }
    };

    if (token) fetchData();
  }, [token, profileData]);

  useEffect(() => {
    // Calculate the total earnings, completed, pending, and rejected orders dynamically
    const totalCompletedOrders = orders.filter(order => order.vender_status === 'Completed').length;
    const totalPendingOrders = orders.filter(order => !order.vender_status).length;
    const totalAcceptedOrders = orders.filter(order => order.vender_status === 'Accepted').length;
    const totalOutforPickupOrders = orders.filter(order => order.vender_status === 'Out for Pickup').length;
    const totalPrepared = orders.filter(order => order.vender_status === 'Prepared').length;
    const totalRejectedOrders = orders.filter(order => order.vender_status === 'Rejected').length;

    setOrderDetails({
      totalCompletedOrders,
      totalPendingOrders,
      totalAcceptedOrders,
      totalRejectedOrders,
      totalOutforPickupOrders,
      totalPrepared,
    });
  }, [orders]);
  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/5 bg-gray-50 text-black flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Name: {profileData.name || 'N/A'}</h1>
          <p className="text-sm text-gray-400">Address: {profileData.address || 'N/A'}</p>
          <p className="text-sm text-gray-400">Mobile No: {profileData.phone || 'N/A'}</p>
          <p className="text-sm text-gray-400">Restaurant Id: {profileData.id || 'N/A'}</p>
        </div>
        <nav className="flex-grow p-4 space-y-4 border-b border-gray-700">
          <div>
            <h2 className="text-lg font-semibold">Order Details</h2>
            <ul className="mt-2 space-y-2">
              <li className="flex items-center justify-between text-sm">
                <span>Total Earnings :</span>
                <span className="text-gray-400">{profileData.total_en || 'N/A'}</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span>Order Completed :</span>
                <span className="text-gray-400">{orderDetails.totalCompletedOrders || 'N/A'}</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span>Pending Orders :</span>
                <span className="text-gray-400">{orderDetails.totalPendingOrders || 'N/A'}</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span>Accepted Orders :</span>
                <span className="text-gray-400">{orderDetails.totalAcceptedOrders || 'N/A'}</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span>Prepared Orders :</span>
                <span className="text-gray-400">{orderDetails.totalPrepared || 'N/A'}</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span>Out for Pickup Orders :</span>
                <span className="text-gray-400">{orderDetails.totalOutforPickupOrders || 'N/A'}</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-red-400">Rejected Orders :</span>
                <span className="text-red-400">{orderDetails.totalRejectedOrders || 'N/A'}</span>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Header */}
        <header className="flex flex-col lg:flex-row items-center justify-between bg-white shadow p-4">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="text-gray-600" onClick={handleSearch}>
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Enter order ID to search"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full lg:w-80"
            />
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm mt-2 lg:mt-0">{error}</p>}

          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
              onClick={() => setModalOpen(true)}
            >
              Accept/Update Order
            </button>
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
              onClick={() => setIsModalOpen(true)}
            >
              Complete Order
            </button>
            <button
              className={`text-white px-4 py-2 rounded-lg ${isOnline ? "bg-green-500" : "bg-red-500"}`}
              onClick={toggleOnlineStatus}
            >
              {isOnline ? "Online" : "Offline"}
            </button>
          </div>
        </header>
        {modalOpen && (
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={handleModalClose}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96 transition-transform duration-300 transform scale-95 hover:scale-100"
              onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
            >
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-400 p-2 rounded-full transition-colors duration-300"
                onClick={handleModalClose}
              >
                ✕
              </button>

              {/* Modal Header */}
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                Update Order Status
              </h3>

              {/* Select Order ID */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Order ID
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-gray-400 focus:outline-none"
                  onChange={(e) => {
                    setSelectedOrderId(e.target.value);
                    setStatus(null); // Reset status when a new order is selected
                  }}
                  value={selectedOrderId}
                >
                  <option value="">Select Order</option>
                  {orders
                    .filter(
                      (value, index, self) =>
                        self.findIndex((order) => order.order_item_id === value.order_item_id) === index // Ensure distinct order_item_id
                    )
                    .map((order) => (
                      <option key={order.order_item_id} value={order.order_item_id}>
                        {order.order_item_id}
                      </option>
                    ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-4 mb-4">
                {/* Success Message */}
                {successMessage && (
                  <div className="text-sm text-green-600 font-semibold mb-2">
                    {successMessage}
                  </div>
                )}
                {auccessMessage && (
                  <div className="text-sm text-red-500 font-semibold mb-2">
                    {auccessMessage}
                  </div>
                )}


                {/* Accept Button - Disabled if no order is selected */}
                {selectedOrderId && status === null && (
                  <button
                    className="w-3/4 px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                    onClick={() => {

                      handleAccept();
                    }}
                  >
                    Accept
                  </button>
                )}
                {/* Prepared Button */}
                {status === "Accepted" && (
                  <button
                    className="w-3/4 px-4 py-2 text-sm rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-300"
                    onClick={() => {

                      handlePrepared();
                    }}
                  >
                    Prepared
                  </button>
                )}
                {/* Ready for Pickup Button */}
                {status === "Prepared" && (
                  <button
                    className="w-3/4 px-4 py-2 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
                    onClick={() => {

                      handleReadyForPickup();
                    }}
                  >
                    Ready for Delivery
                  </button>
                )}

                {/* Reject Button - Hidden if Out for Pickup or no order is selected */}
                {selectedOrderId && status !== "Out for Pickup" && status !== "Completed" && status !== "Rejected" && (
                  <button
                    className="w-3/4 px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
                    onClick={handleReject}
                  >
                    Reject
                  </button>
                )}
              </div>

              {/* Rejection Reason */}
              {isRejected && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Rejection
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-gray-400 focus:outline-none"
                    placeholder="Enter rejection message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    className="mt-3 w-full px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
                    onClick={() => {

                      updateOrderStatus("Rejected");
                      handleModalClose();
                    }}
                  >
                    Submit Rejection
                  </button>
                </div>
              )}
            </div>
          </div>
        )
        }
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={resetModalState}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96 transition-transform duration-300 transform scale-95 hover:scale-100"
              onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
            >
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-400 p-2 rounded-full transition-colors duration-300"
                onClick={resetModalState}
              >
                ✕
              </button>

              {/* Modal Header */}
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                Complete Order
              </h3>

              {/* Select Order ID */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Order ID
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-gray-400 focus:outline-none"
                  onChange={(e) => {
                    setSelectedOrder(e.target.value);
                    setOrderStatus(null); // Reset status when a new order is selected
                    setIsOtpGenerated(false); // Reset OTP state
                    setOrderOtp(""); // Clear any previously entered OTP
                    setErrorMessage(""); // Clear previous error messages
                  }}
                  value={selectedOrder}
                >
                  <option value="">Select Order</option>
                  {orders
                    .filter(
                      (value, index, self) =>
                        self.findIndex((order) => order.order_item_id === value.order_item_id) === index // Ensure distinct order_item_id
                    )
                    .map((order) => (
                      <option key={order.order_item_id} value={order.order_item_id}>
                        {order.order_item_id}
                      </option>
                    ))}
                </select>
              </div>

              {/* Display Messages Based on Status */}
              {orderStatus === "Completed" && (
                <div className="text-red-600 text-sm font-semibold mb-4">
                  This order has already been completed.
                </div>
              )}
              {orderStatus && orderStatus !== "Out for Pickup" && orderStatus !== "Completed" && (
                <div className="text-red-600 text-sm font-semibold mb-4">
                  Order status is not "Out for Delivery". No actions are allowed.
                </div>
              )}

              {/* Action Buttons */}
              {!orderStatus || orderStatus === "Out for Pickup" ? (
                <div className="flex flex-col items-center gap-4 mb-4">
                  {/* Generate OTP Button */}
                  {selectedOrder && !isOtpGenerated && (
                    <button
                      className="w-3/4 px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                      onClick={handleGenerateOtp}
                    >
                      Generate OTP
                    </button>
                  )}

                  {/* OTP Input */}
                  {isOtpGenerated && (
                    <div className="w-full">
                      <p>Taken a OTP from delivery Boy</p>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-gray-400 focus:outline-none"
                        placeholder="Enter OTP"
                        value={orderOtp}
                        onChange={(e) => setOrderOtp(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Complete Order Button */}
                  {isOtpGenerated && orderOtp && (
                    <button
                      className="w-3/4 px-4 py-2 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
                      onClick={handleCompleteOrder}
                    >
                      Complete Order
                    </button>
                  )}
                </div>
              ) : null}

              {/* Error Message */}
              {errorMessage && (
                <div className="text-red-600 text-sm font-semibold mb-4">{errorMessage}</div>
              )}
            </div>
          </div>
        )}
        {/* Order List */}
        <section className="p-4">
          {result && result.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Search Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 text-sm">
                      <th className="p-4 text-left">Image</th>
                      <th className="p-4 text-left">Order Item ID</th>
                      <th className="p-4 text-left">User ID</th>
                      <th className="p-4 text-left">User Name</th>
                      <th className="p-4 text-left">Phone</th>
                      <th className="p-4 text-left">Menu Name</th>
                      <th className="p-4 text-left">Quantity</th>
                      <th className="p-4 text-left">Total Price</th>
                      <th className="p-4 text-left">Delivery Address</th>
                      <th className="p-4 text-left">Payment Status</th>
                      <th className="p-4 text-left">Order Date</th>
                      <th className="p-4 text-left">Vendor Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((order, index) => (
                      <tr
                        key={`${order.order_item_id}-${index}`}
                        className="text-sm text-gray-600 border-b hover:bg-gray-100 transition-colors"
                      >
                        <td className="p-4">
                          <img
                            src={order.image_url} // Assuming `image_url` is available
                            alt={order.menu_name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </td>
                        <td className="p-4">{order.order_item_id}</td>
                        <td className="p-4">{order.user_id}</td>
                        <td className="p-4">{order.user_name}</td>
                        <td className="p-4">{order.user_phone || 'N/A'}</td>
                        <td className="p-4">{order.menu_name}</td>
                        <td className="p-4">{order.quantity}</td>
                        <td className="p-4">{order.total_price} Rs</td>
                        <td className="p-4">{order.delivery_address}</td>
                        <td className="p-4">{order.payment_status}</td>
                        <td className="p-4">{formatDateTime(order.order_date)}</td>
                        <td className="p-4">{order.vender_status || 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* Order Rows */}
          {/* Pending Orders */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Pending Orders</h2>
            {orders.filter(order => !order.vender_status).length === 0 ? (
              <p className="text-gray-500">No orders in this status</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 text-sm">
                      <th className="p-4 text-left">Image</th>
                      <th className="p-4 text-left">Order Item ID</th>
                      <th className="p-4 text-left">User ID</th>
                      <th className="p-4 text-left">User Name</th>
                      <th className="p-4 text-left">Phone</th>
                      <th className="p-4 text-left">Menu Name</th>
                      <th className="p-4 text-left">Quantity</th>
                      <th className="p-4 text-left">Total Price</th>
                      <th className="p-4 text-left">Delivery Address</th>
                      <th className="p-4 text-left">Payment Status</th>
                      <th className="p-4 text-left">Order Date</th>
                      <th className="p-4 text-left">Vendor Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(order => !order.vender_status).sort((a, b) => new Date(b.order_date) - new Date(a.order_date)).map((order, index) => (
                      <tr key={`${order.order_item_id}-${index}`} className="text-sm text-gray-600 border-b hover:bg-gray-100 transition-colors">
                        <td className="p-4"><img src={order.image_url} alt={order.menu_name} className="w-16 h-16 object-cover rounded-md" /></td>
                        <td className="p-4">{order.order_item_id}</td>
                        <td className="p-4">{order.user_id}</td>
                        <td className="p-4">{order.user_name}</td>
                        <td className="p-4">{order.user_phone}</td>
                        <td className="p-4">{order.menu_name}</td>
                        <td className="p-4">{order.quantity}</td>
                        <td className="p-4">{order.total_price} Rs</td>
                        <td className="p-4">{order.delivery_address}</td>
                        <td className="p-4">{order.payment_status}</td>
                        <td className="p-4">{formatDateTime(order.order_date)}</td>
                        <td className="p-4">{order.vender_status || 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Accepted Orders */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Accepted Orders</h2>
            {orders.filter(order => order.vender_status === 'Accepted').length === 0 ? (
              <p className="text-gray-500">No orders in this status</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 text-sm">
                      <th className="p-4 text-left">Image</th>
                      <th className="p-4 text-left">Order Item ID</th>
                      <th className="p-4 text-left">User ID</th>
                      <th className="p-4 text-left">User Name</th>
                      <th className="p-4 text-left">Phone</th>
                      <th className="p-4 text-left">Menu Name</th>
                      <th className="p-4 text-left">Quantity</th>
                      <th className="p-4 text-left">Total Price</th>
                      <th className="p-4 text-left">Delivery Address</th>
                      <th className="p-4 text-left">Payment Status</th>
                      <th className="p-4 text-left">Order Date</th>
                      <th className="p-4 text-left">Vendor Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(order => order.vender_status === 'Accepted').sort((a, b) => new Date(b.order_date) - new Date(a.order_date)).map((order, index) => (
                      <tr key={`${order.order_item_id}-${index}`} className="text-sm text-gray-600 border-b hover:bg-gray-100 transition-colors">
                        <td className="p-4"><img src={order.image_url} alt={order.menu_name} className="w-16 h-16 object-cover rounded-md" /></td>
                        <td className="p-4">{order.order_item_id}</td>
                        <td className="p-4">{order.user_id}</td>
                        <td className="p-4">{order.user_name}</td>
                        <td className="p-4">{order.user_phone}</td>
                        <td className="p-4">{order.menu_name}</td>
                        <td className="p-4">{order.quantity}</td>
                        <td className="p-4">{order.total_price} Rs</td>
                        <td className="p-4">{order.delivery_address}</td>
                        <td className="p-4">{order.payment_status}</td>
                        <td className="p-4">{formatDateTime(order.order_date)}</td>
                        <td className="p-4">{order.vender_status || 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Prepared Orders */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Prepared Orders</h2>
            {orders.filter(order => order.vender_status === 'Prepared').length === 0 ? (
              <p className="text-gray-500">No orders in this status</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 text-sm">
                      <th className="p-4 text-left">Image</th>
                      <th className="p-4 text-left">Order Item ID</th>
                      <th className="p-4 text-left">User ID</th>
                      <th className="p-4 text-left">User Name</th>
                      <th className="p-4 text-left">Phone</th>
                      <th className="p-4 text-left">Menu Name</th>
                      <th className="p-4 text-left">Quantity</th>
                      <th className="p-4 text-left">Total Price</th>
                      <th className="p-4 text-left">Delivery Address</th>
                      <th className="p-4 text-left">Payment Status</th>
                      <th className="p-4 text-left">Order Date</th>
                      <th className="p-4 text-left">Vendor Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(order => order.vender_status === 'Prepared').sort((a, b) => new Date(b.order_date) - new Date(a.order_date)).map((order, index) => (
                      <tr key={`${order.order_item_id}-${index}`} className="text-sm text-gray-600 border-b hover:bg-gray-100 transition-colors">
                        <td className="p-4"><img src={order.image_url} alt={order.menu_name} className="w-16 h-16 object-cover rounded-md" /></td>
                        <td className="p-4">{order.order_item_id}</td>
                        <td className="p-4">{order.user_id}</td>
                        <td className="p-4">{order.user_name}</td>
                        <td className="p-4">{order.user_phone}</td>
                        <td className="p-4">{order.menu_name}</td>
                        <td className="p-4">{order.quantity}</td>
                        <td className="p-4">{order.total_price} Rs</td>
                        <td className="p-4">{order.delivery_address}</td>
                        <td className="p-4">{order.payment_status}</td>
                        <td className="p-4">{formatDateTime(order.order_date)}</td>
                        <td className="p-4">{order.vender_status || 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Out for Pickup Orders */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Out for Pickup Orders</h2>
            {orders.filter(order => order.vender_status === 'Out for Pickup').length === 0 ? (
              <p className="text-gray-500">No orders in this status</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 text-sm">
                      <th className="p-4 text-left">Image</th>
                      <th className="p-4 text-left">Order Item ID</th>
                      <th className="p-4 text-left">User ID</th>
                      <th className="p-4 text-left">User Name</th>
                      <th className="p-4 text-left">Phone</th>
                      <th className="p-4 text-left">Menu Name</th>
                      <th className="p-4 text-left">Quantity</th>
                      <th className="p-4 text-left">Total Price</th>
                      <th className="p-4 text-left">Delivery Address</th>
                      <th className="p-4 text-left">Payment Status</th>
                      <th className="p-4 text-left">Order Date</th>
                      <th className="p-4 text-left">Vendor Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(order => order.vender_status === 'Out for Pickup').sort((a, b) => new Date(b.order_date) - new Date(a.order_date)).map((order, index) => (
                      <tr key={`${order.order_item_id}-${index}`} className="text-sm text-gray-600 border-b hover:bg-gray-100 transition-colors">
                        <td className="p-4"><img src={order.image_url} alt={order.menu_name} className="w-16 h-16 object-cover rounded-md" /></td>
                        <td className="p-4">{order.order_item_id}</td>
                        <td className="p-4">{order.user_id}</td>
                        <td className="p-4">{order.user_name}</td>
                        <td className="p-4">{order.user_phone}</td>
                        <td className="p-4">{order.menu_name}</td>
                        <td className="p-4">{order.quantity}</td>
                        <td className="p-4">{order.total_price} Rs</td>
                        <td className="p-4">{order.delivery_address}</td>
                        <td className="p-4">{order.payment_status}</td>
                        <td className="p-4">{formatDateTime(order.order_date)}</td>
                        <td className="p-4">{order.vender_status || 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Completed Orders */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Completed Orders</h2>
            {orders.filter(order => order.vender_status === 'Completed').length === 0 ? (
              <p className="text-gray-500">No orders in this status</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 text-sm">
                      <th className="p-4 text-left">Image</th>
                      <th className="p-4 text-left">Order Item ID</th>
                      <th className="p-4 text-left">User ID</th>
                      <th className="p-4 text-left">User Name</th>
                      <th className="p-4 text-left">Phone</th>
                      <th className="p-4 text-left">Menu Name</th>
                      <th className="p-4 text-left">Quantity</th>
                      <th className="p-4 text-left">Total Price</th>
                      <th className="p-4 text-left">Delivery Address</th>
                      <th className="p-4 text-left">Payment Status</th>
                      <th className="p-4 text-left">Order Date</th>
                      <th className="p-4 text-left">Vendor Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(order => order.vender_status === 'Completed').sort((a, b) => new Date(b.order_date) - new Date(a.order_date)).map((order, index) => (
                      <tr key={`${order.order_item_id}-${index}`} className="text-sm text-gray-600 border-b hover:bg-gray-100 transition-colors">
                        <td className="p-4"><img src={order.image_url} alt={order.menu_name} className="w-16 h-16 object-cover rounded-md" /></td>
                        <td className="p-4">{order.order_item_id}</td>
                        <td className="p-4">{order.user_id}</td>
                        <td className="p-4">{order.user_name}</td>
                        <td className="p-4">{order.user_phone}</td>
                        <td className="p-4">{order.menu_name}</td>
                        <td className="p-4">{order.quantity}</td>
                        <td className="p-4">{order.total_price} Rs</td>
                        <td className="p-4">{order.delivery_address}</td>
                        <td className="p-4">{order.payment_status}</td>
                        <td className="p-4">{formatDateTime(order.order_date)}</td>
                        <td className="p-4">{order.vender_status || 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Rejected Orders */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Rejected Orders</h2>
            {orders.filter(order => order.vender_status === 'Rejected').length === 0 ? (
              <p className="text-gray-500">No orders in this status</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 text-sm">
                      <th className="p-4 text-left">Image</th>
                      <th className="p-4 text-left">Order Item ID</th>
                      <th className="p-4 text-left">User ID</th>
                      <th className="p-4 text-left">User Name</th>
                      <th className="p-4 text-left">Phone</th>
                      <th className="p-4 text-left">Menu Name</th>
                      <th className="p-4 text-left">Quantity</th>
                      <th className="p-4 text-left">Total Price</th>
                      <th className="p-4 text-left">Delivery Address</th>
                      <th className="p-4 text-left">Payment Status</th>
                      <th className="p-4 text-left">Order Date</th>
                      <th className="p-4 text-left">Vendor Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(order => order.vender_status === 'Rejected').sort((a, b) => new Date(b.order_date) - new Date(a.order_date)).map((order, index) => (
                      <tr key={`${order.order_item_id}-${index}`} className="text-sm text-gray-600 border-b bg-red-100">
                        <td className="p-4"><img src={order.image_url} alt={order.menu_name} className="w-16 h-16 object-cover rounded-md" /></td>
                        <td className="p-4">{order.order_item_id}</td>
                        <td className="p-4">{order.user_id}</td>
                        <td className="p-4">{order.user_name}</td>
                        <td className="p-4">{order.user_phone}</td>
                        <td className="p-4">{order.menu_name}</td>
                        <td className="p-4">{order.quantity}</td>
                        <td className="p-4">{order.total_price} Rs</td>
                        <td className="p-4">{order.delivery_address}</td>
                        <td className="p-4">{order.payment_status}</td>
                        <td className="p-4">{formatDateTime(order.order_date)}</td>
                        <td className="p-4">{order.vender_status || 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </section>
        {/* Menu Section */}

      </main >
    </div >

  );
};

export default RestaurantDashboard;
