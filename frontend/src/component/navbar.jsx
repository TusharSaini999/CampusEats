import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Modal from "react-modal";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType || "");

    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId || "");
  }, [location]);

  const handleLogout = async () => {
   /* if (userType === "vendor") {
      const newStatus = 0; // Always set to 0 (offline)
  
      try {
        const response = await fetch("http://localhost:4000/vendors/update-vendor-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorId: userId, // Pass the vendorId
            current: newStatus, // Set status to 0 (offline)
          }),
        });
  
        const data = await response.json(); // Await the response
  
        if (response.ok) {
          // The status is updated to offline, you can perform additional actions here
          console.log("Vendor status updated to offline.");
        } else {
          console.error("Error updating status:", data.error);
          alert("Failed to update vendor status. Try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while updating the status.");
      }
    }
  */
    // Perform logout actions
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("id");
    setIsLoggedIn(false);
    setIsLogoutModalOpen(false);
    navigate("/login");
    window.location.reload();
  };
  

  const closeModal = () => {
    setIsLogoutModalOpen(false);
  };

  const openModal = () => {
    setIsLogoutModalOpen(true);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-purple-700">
      CampusEats
     </Link>
      {userType !== "vendor" && userType !== "delivery_boy" && (
        <form
          onSubmit={handleSearch}
          className="flex items-center border border-gray-300 rounded-full px-4 py-2 w-full max-w-lg"
        >
          <input
            type="text"
            placeholder="Search for food or restaurants"
            className="flex-grow outline-none text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 cursor-pointer"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 3a6 6 0 100 12 6 6 0 000-12zM2 9a7 7 0 1112.39 4.56l4.27 4.27a1 1 0 01-1.42 1.42l-4.27-4.27A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </form>
      )}

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-6 text-gray-600">
        {/* Conditionally Render Links Based on Login Status */}
        <Link to="/recipe-generator">Recipe Generator</Link>
        {isLoggedIn ? (
          <>
            {userType !== "vendor" && (
              <Link to="/menu" className="hover:text-purple-700">
                Menu
              </Link>
            )}
            <Link to="/profile" className="hover:text-purple-700">
              Profile
            </Link>
            {/* Show Cart and Track Order buttons only if userType is NOT vendor */}
            {userType !== "vendor" && (
              <>
                <Link to="/cart" className="hover:text-purple-700">
                  Cart
                </Link>
                <Link to="/order-history" className="hover:text-purple-700">
                  Order History
                </Link>

              </>
            )}
            {userType === "user" && (
              <>
                <Link to={`/delivery/${userId}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Track Order</Link>
              </>
            )}
            <button
              onClick={openModal}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
          >
            Login
          </Link>
        )}
      </div>

      {/* Logout Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onRequestClose={closeModal}
        className="bg-white w-96 p-8 rounded-lg shadow-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;
