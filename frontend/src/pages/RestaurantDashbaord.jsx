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
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId || "");
  });
  console.log(userId);
  // Fetch the vendor status from the database on component mount or after login
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
  }, [vendor_id]);




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
  }, [userId]);
  const formatDateTime = (dateTime) => {
    const dateOptions = { day: "numeric", month: "long", year: "numeric" }; // For date only
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true }; // For time only

    const formattedDate = new Date(dateTime).toLocaleDateString("en-US", dateOptions); // e.g., "21 July 2024"
    const formattedTime = new Date(dateTime).toLocaleTimeString("en-US", timeOptions); // e.g., "08:45 AM"

    return `${formattedDate} at ${formattedTime}`; // Combines date and time
  };



  // const toggleNotificationModal = () => {
  //   setShowNotificationModal(!showNotificationModal);
  // };

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
  }, [token]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-black-100 text-black flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Name: {profileData.name || 'N/A'}</h1>
          <p className="text-sm text-gray-400">Address: {profileData.address}</p>
          <p className="text-sm text-gray-400">Moblie No: {profileData.phone}</p>
          <p className="text-sm text-gray-400">Restaurant Id: {profileData.id}</p>
        </div>
        <nav className="flex-grow p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Order Details</h2>
            <ul className="mt-2 space-y-2">

              <li className="flex items-center justify-between text-sm">
                <span>Total Earnings :</span>
                <span className="text-gray-400">Rs 0</span>
              </li>
              {/* <button className="text-gray-600" onClick={toggleNotificationModal}>
              <FaBell />
            </button> */}
              <li className="flex items-center justify-between text-sm">
                <span>Total Order Completed :</span>
                <span className="text-gray-400">43 Orders</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span>Total Pending Orders :</span>
                <span className="text-gray-400">21 Orders</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span>Total Rejected Orders :</span>
                <span className="text-gray-400">10 Orders</span>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-gray-100">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow p-4">
          <div className="flex items-center space-x-4">
            <div className="text-gray-600">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Enter order ID to search"
              className="border border-gray-300 rounded-lg px-4 py-2 w-80"
            />
          </div>
          <div className="flex items-center space-x-4">
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105">
             Accept/Update Order
            </button>
            <button
              className={`text-white px-4 py-2 rounded-lg ${isOnline ? "bg-green-500" : "bg-red-500"
                }`}
              onClick={toggleOnlineStatus}
            >
              {isOnline ? "Online" : "Offline"}
            </button>
          </div>
        </header>

        {/* Notification Modal */}
        {/* {showNotificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Notifications</h2>
              <ul className="space-y-2">
                <li className="text-sm">Order #1234 has been placed.</li>
                <li className="text-sm">Order #5678 is ready for delivery.</li>
                <li className="text-sm">New dish added to the menu.</li>
              </ul>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                  onClick={toggleNotificationModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* Order List */}
        <section className="p-4">

          {/* Order Rows */}
          <div className="bg-white shadow rounded-lg mb-6">
            <table className="w-full table-auto">
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
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr
                      key={`${order.order_item_id}-${index}`} // Ensure unique key
                      className="text-sm text-gray-600 border-b hover:bg-gray-100 transition-colors"
                    >
                      <td className="p-4">
                        <img
                          src={order.image_url}
                          alt={order.menu_name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center p-4 text-gray-600">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        {/* Menu Section */}

      </main>
    </div>
  );
};

export default RestaurantDashboard;
