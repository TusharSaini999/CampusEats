import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
const DeliveryboyDashboard = () => {
  const navigate = useNavigate();
  const [deliveryDetails, setDeliveryDetails] = useState({
    revenue: 0,
    totalDeliveries: 0,
    acceptedOrderCount: 0,
    pendingOrderCount: 0,
    rejectedOrderCount: 0,
  });
  const [orders, setOrders] = useState([]);
  const [allorders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [init, setinit] = useState(true);
  const [listload, setListload] = useState(false);
  const [listinit, setlistinit] = useState(true);
  const [serachload, setsearchload] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");
  const [userType, setUserType] = useState("");
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [openToWork, setOpenToWork] = useState(
    JSON.parse(localStorage.getItem("openToWork")) ?? true
  );
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId || "");
  }, []);

  useEffect(() => {
    // Function to fetch delivery details

    const fetchDeliveryDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/delivery/delivery-details?deliveryBoyId=${userId}`);
        setDeliveryDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching delivery details:", error);
        setinit(false);
        setLoading(false);
      }
      setinit(false);
      setLoading(false);
    };
    if (userId) {
      fetchDeliveryDetails();
    }
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
        const response = await axios.get(import.meta.env.VITE_API_URL + "/users/profile", {
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
  const handleSearch = async () => {
    try {
      setsearchload(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/delivery/search-orders?deliveryBoyId=${userId}&searchQuery=${searchQuery}`
      );
      const data = await response.json();
      if (response.ok) {
        setFilteredOrders(data.orders);
        setsearchload(false); // Updated here
        setSearchTerm("0");
      } else {
        setFilteredOrders([]);
        setsearchload(false); // Updated here
        setSearchTerm("1");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const toggleOpenToWork = async (isOpen, token) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/delivery/open-to-work",
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


  // Format Date and Time
  const formatDateTime = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-IN", options)} ${date.toLocaleTimeString("en-IN")}`;
  };

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/delivery/pending-orders`
        );
        setOrders(response.data.pendingOrders);
      } catch (err) {
        console.error("Failed to fetch pending orders:", err);
        setOrders([]);
      }
    };

    fetchPendingOrders();
  }, []);

  useEffect(() => {
    const fetchDeliverOrders = async () => {
      if (!userId) {
        return;
      }
      try {
        console.log("Fetching orders for deliveryBoyId:", userId);
        setListload(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/delivery/all-orders?deliveryBoyId=${userId}`
        );
        setAllOrders(response.data.orders);
        setListload(false);
        setlistinit(false);
      } catch (err) {
        console.error("Error fetching all orders:", err.response?.data || err.message);
        setAllOrders([]);
        setListload(false);
        setlistinit(false);
      }
    };

    fetchDeliverOrders();
  }, [userId]);



  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }
  // Filter orders based on their status
  const acceptedOrders = allorders.filter((order) => order.order_status === "accepted");
  const outForDeliveryOrders = allorders.filter((order) => order.order_status === "out for delivery");
  const deliveredOrders = allorders.filter((order) => order.order_status === "delivered");
  const rejectedOrders = allorders.filter((order) => order.order_status === "rejected");

  const renderOrderTable = (orders, status) => (
    <div>
      <h2 className="text-2xl font-bold mb-4 mt-4">{status} Orders</h2>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-purple-600 text-white">
            <tr>
              {[
                "Order ID",
                "Customer ID",
                "Customer Name",
                "Order Date",
                "Amount",
                "Delivery Address",
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
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.order_id}
                  className="hover:bg-gray-50 border-b transition-all duration-300"
                >
                  <td className="py-3 px-4">{order.order_id}</td>
                  <td className="py-3 px-4">{order.customer_id}</td>
                  <td className="py-3 px-4">{order.customer_name}</td>
                  <td className="py-3 px-4">{formatDateTime(order.order_date)}</td>
                  <td className="py-3 px-4">₹{order.order_amount}</td>
                  <td className="py-3 px-4">{order.delivery_address}</td>
                  <td className="py-3 px-4">{order.order_status}</td>
                  <td className="py-3 px-4">
                    <button
                      className="mr-3 text-green-600 text-xl hover:scale-110 transition-all"
                      onClick={() => navigate(`/order-dilivery/${order.order_id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-3 px-4">
                  No orders in this status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
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
          <div className="animate-pulse">
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-4" />
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-4" />
          </div>
        )}
        {openToWork !== "undefined" ? (
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
                className={`block w-full h-full rounded-full ${openToWork ? "bg-green-500" : "bg-gray-400"} transition-all duration-300`}
              ></span>
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${openToWork ? "translate-x-6" : ""}`}
              ></span>
            </label>
          </div>
        ) : (
          <div className="flex items-center animate-pulse">
            <div className="h-5 bg-gray-300 rounded w-20 mr-3" />
            <div className="relative inline-block w-12 h-6 bg-gray-300 rounded-full">
              <div className="absolute top-1 left-1 w-4 h-4 bg-gray-400 rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      {/* Summary Cards */}
      <div className="flex-1 p-6">
        {loading && init ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-pulse">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white p-4 shadow rounded text-center">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2 mx-auto" />
                <div className="h-6 bg-gray-400 rounded w-1/3 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
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
        )}


        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full max-w-sm"
          />
          <button
            onClick={handleSearch}
            className="ml-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          >
            Search
          </button>
        </div>
        {serachload && (
          <div>
          <div className="bg-gray-100 rounded-lg shadow overflow-x-auto animate-pulse">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-300">
                <tr>
                  {[
                    "Order ID",
                    "Customer ID",
                    "Customer Name",
                    "Order Date",
                    "Amount",
                    "Delivery Address",
                    "Status",
                    "Actions",
                  ].map((head) => (
                    <th key={head} className="py-3 px-4 text-left bg-gray-300">
                      <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(3)].map((_, index) => (
                  <tr key={index} className="border-b">
                    {Array(8).fill().map((_, i) => (
                      <td key={i} className="py-3 px-4">
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
        {filteredOrders.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    {[
                      "Order ID",
                      "Customer ID",
                      "Customer Name",
                      "Order Date",
                      "Amount",
                      "Delivery Address",
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
                      key={order.order_id}
                      className="hover:bg-gray-50 border-b transition-all duration-300"
                    >
                      <td className="py-3 px-4">{order.order_id}</td>
                      <td className="py-3 px-4">{order.customer_id}</td>
                      <td className="py-3 px-4">{order.customer_name}</td>
                      <td className="py-3 px-4">
                        {new Date(order.order_date).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">₹{order.order_amount}</td>
                      <td className="py-3 px-4">{order.delivery_address}</td>
                      <td className="py-3 px-4">{order.order_status}</td>
                      <td className="py-3 px-4">
                        <button
                          className="mr-3 text-green-600 text-xl hover:scale-110 transition-all"
                          onClick={() => navigate(`/order-dilivery/${order.order_id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {searchTerm == "1" && (<div className="text-center text-gray-600 mt-8">
          <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
          <p>We couldn't find any orders matching your search criteria.</p>
        </div>)}

        {/* Orders Table */}

        <div>
          {openToWork ? (
            <>
              <h2 className="text-2xl font-bold mb-4">New Order</h2>
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-purple-600 text-white">
                    <tr>
                      {[
                        "Order ID",
                        "Customer ID",
                        "Customer Name",
                        "Order Date",
                        "Amount",
                        "Delivery Address",
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
                    {orders.map((order) => (
                      <tr
                        key={order.order_id}
                        className="hover:bg-gray-50 border-b transition-all duration-300"
                      >
                        <td className="py-3 px-4">{order.order_id}</td>
                        <td className="py-3 px-4">{order.customer_id}</td>
                        <td className="py-3 px-4">{order.customer_name}</td>
                        <td className="py-3 px-4">{formatDateTime(order.order_date)}</td>
                        <td className="py-3 px-4">₹{order.order_amount}</td>
                        <td className="py-3 px-4">{order.delivery_address}</td>
                        <td className="py-3 px-4">{order.order_status}</td>
                        <td className="py-3 px-4">
                          <button
                            className="mr-3 text-green-600 text-xl hover:scale-110 transition-all"
                            onClick={() => navigate(`/order-dilivery/${order.order_id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600 mt-8">
              <h2 className="text-xl font-semibold mb-2">You are not available for new orders</h2>
              <p>To start accepting new orders, please toggle "Open to Work".</p>
            </div>
          )}

          {listload && listinit ? (
            <div>
              <div className="bg-gray-100 rounded-lg shadow overflow-x-auto animate-pulse">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-300">
                    <tr>
                      {[
                        "Order ID",
                        "Customer ID",
                        "Customer Name",
                        "Order Date",
                        "Amount",
                        "Delivery Address",
                        "Status",
                        "Actions",
                      ].map((head) => (
                        <th key={head} className="py-3 px-4 text-left bg-gray-300">
                          <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(8)].map((_, index) => (
                      <tr key={index} className="border-b">
                        {Array(8).fill().map((_, i) => (
                          <td key={i} className="py-3 px-4">
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <>
                {renderOrderTable(acceptedOrders, "Accepted")}
                {renderOrderTable(outForDeliveryOrders, "Out for Delivery")}
                {renderOrderTable(deliveredOrders, "Delivered")}
                {renderOrderTable(rejectedOrders, "Rejected")}
              </>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DeliveryboyDashboard;
