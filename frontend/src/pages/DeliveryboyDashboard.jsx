import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
const DeliveryboyDashboard = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderId: "000134",
      restaurantName: "Pizza Hut",
      restaurantAddress: "123 Main Street, City Center",
      customerName: "John Doe",
      customerAddress: "456 Elm Street, Downtown",
      orderDateTime: "2024-06-17T12:55:00",
      total: "30.80",
      status: "Pending",
      otp: "1234",
    },
    {
      id: 2,
      orderId: "000133",
      restaurantName: "Burger King",
      restaurantAddress: "789 Oak Street, Food Court",
      customerName: "Jane Smith",
      customerAddress: "101 Pine Street, Suburb",
      orderDateTime: "2024-06-17T13:30:00",
      total: "221.60",
      status: "Pending",
      otp: "5678",
    },
  ]);
  const [deliveryDetails, setDeliveryDetails] = useState({
    revenue: 0,
    totalDeliveries: 0,
    acceptedOrderCount: 0,
    pendingOrderCount: 0,
    rejectedOrderCount: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");
  const [userType, setUserType] = useState("");
  const [userData, setUserData] = useState(null);
  const [openToWork, setOpenToWork] = useState(
    JSON.parse(localStorage.getItem("openToWork")) ?? true
  );
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId || "");
  });

  useEffect(() => {
    // Function to fetch delivery details

    const fetchDeliveryDetails = async () => {
      try {
        const user_id = userId;
        
        const response = await axios.get(`http://localhost:4000/delivery/delivery-details?deliveryBoyId=${user_id}`);
        setDeliveryDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching delivery details:", error);
      }
    };
    fetchDeliveryDetails();
    const intervalId = setInterval(fetchDeliveryDetails, 5000);
    return () => clearInterval(intervalId);
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("openToWork", JSON.stringify(openToWork));
  }, [openToWork]);
  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        const response = await axios.get("http://localhost:4000/users/profile", {
          headers: {
            Authorization: token, // Pass token in headers
          },
        });

        setUserData(response.data); // Set fetched user data
        setUserType(response.data.userType); // Set user type
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [token]); // Dependency on token

  const toggleOpenToWork = async (isOpen, token) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/delivery/open-to-work",
        { isOpen },
        {
          headers: {
            Authorization: token, // Pass the token from localStorage
          },
        }
      );

      console.log(response.data.message);
    } catch (error) {
      console.error("Error updating Open to Work status:", error);
    }
  };

  const handleToggle = async () => {
    const newStatus = !openToWork;
    setOpenToWork(newStatus); // Update the UI immediately

    // Call the API to update the status in the database
    await toggleOpenToWork(newStatus, token);
  };
  const openOtpDialog = (order, action) => {
    setSelectedOrder(order);
    setShowOtpDialog(true);
    setActionType(action);
    setOtpInput("");
  };

  const closeOtpDialog = () => {
    setShowOtpDialog(false);
    setSelectedOrder(null);
    setActionType("");
  };

  const handleOtpVerification = () => {
    if (selectedOrder) {
      if (otpInput === selectedOrder.otp) {
        const newStatus = actionType === "accept" ? "Accepted" : "Cancelled";
        updateOrderStatus(selectedOrder.id, newStatus);
        showModalMessage(`Order ${newStatus} Successfully!`);
      } else {
        showModalMessage("Invalid OTP. Please try again.");
      }
      closeOtpDialog();
    }
  };

  // Show Modal Message
  const showModalMessage = (message) => {
    setModalMessage(message);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 3000);
  };

  // Update Order Status
  const updateOrderStatus = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  // Take for Delivery
  const takeForDelivery = (order) => {
    updateOrderStatus(order.id, "Out for Delivery");
    showModalMessage("Order taken for delivery!");
  };

  // Format Date and Time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-purple-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome</h2>
        {userData ? (
          <>
            <p className="text-lg mb-2">
              <strong>Name :{userData.name}</strong>
            </p>
            <p className="text-sm text-white mb-4">Contact: {userData.phone}</p>
            <p className="text-sm mb-4">Address: {userData.address}</p>
            <p className="text-sm text-white mb-4">Dekivery Boy ID {userData.id}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
        <div className="flex items-center">
          <span className="mr-3">Open to Work</span>
          <label className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={openToWork}
              onChange={handleToggle}
              className="hidden"
            />
            <span
              className={`block w-full h-full rounded-full ${openToWork ? "bg-green-500" : "bg-gray-400"
                } transition-all duration-300`}
            ></span>
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${openToWork ? "translate-x-6" : ""
                }`}
            ></span>
          </label>
        </div>
      </div>

      {/* Main Content */}
      {/* Summary Cards */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[{ label: "Revenue", value: `₹${deliveryDetails.revenue.toFixed(2)}` },
          { label: "Total Deliveries", value: deliveryDetails.totalDeliveries },
          { label: "Accepted Orders", value: deliveryDetails.acceptedOrderCount },
          { label: "Pending Orders", value: deliveryDetails.pendingOrderCount },
          { label: "Rejected Orders", value: deliveryDetails.rejectedOrderCount }
          ].map((card, index) => (
            <div key={index} className="bg-white p-4 shadow rounded text-center">
              <h3 className="text-gray-600">{card.label}</h3>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-purple-600 text-white">
              <tr>
                {[
                  "Order ID",
                  "Restaurant",
                  "Customer",
                  "Order Date",
                  "Amount",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <th key={head} className="py-3 px-4 text-left">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 border-b transition-all duration-300"
                >
                  <td className="py-3 px-4">{order.orderId}</td>
                  <td className="py-3 px-4">{order.restaurantName}</td>
                  <td className="py-3 px-4">{order.customerName}</td>
                  <td className="py-3 px-4">
                    {formatDateTime(order.orderDateTime)}
                  </td>
                  <td className="py-3 px-4">₹{order.total}</td>
                  <td className="py-3 px-4">{order.status}</td>
                  <td className="py-3 px-4">
                    <button
                      className="mr-3 text-green-600 text-xl hover:scale-110 transition-all"
                      onClick={() => openOtpDialog(order, "accept")}
                    >
                      ✅
                    </button>
                    <button
                      className="mr-3 text-red-600 text-xl hover:scale-110 transition-all"
                      onClick={() => openOtpDialog(order, "cancel")}
                    >
                      ❌
                    </button>
                    <button
                      className="text-blue-600 text-xl hover:scale-110 transition-all"
                      onClick={() => takeForDelivery(order)}
                    >
                      🚚
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* OTP Dialog */}
        <AnimatePresence>
          {showOtpDialog && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded shadow"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h3 className="text-xl mb-4">Enter OTP</h3>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="border p-2 w-full mb-4"
                  placeholder="Enter OTP"
                />
                <button
                  onClick={handleOtpVerification}
                  className="bg-purple-600 text-white px-4 py-2 rounded mr-2"
                >
                  Submit
                </button>
                <button onClick={closeOtpDialog} className="text-gray-600">
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed bottom-4 right-4 bg-purple-600 text-white p-4 rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {modalMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeliveryboyDashboard;
