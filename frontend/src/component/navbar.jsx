import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Modal from "react-modal";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);
  const buttonRef = useRef();
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  useEffect(() => {
    // Handle outside click or touch
    function handleOutsideInteraction(event) {
      if (menuRef.current && buttonRef.current && !buttonRef.current.contains(event.target) && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }

    // Close menu on scroll
    function handleScroll() {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideInteraction);
    document.addEventListener("touchstart", handleOutsideInteraction);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);
  const handleLinkClick = () => setIsMobileMenuOpen(false);
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
         const response = await fetch("https://campuseats-ki1c.onrender.com/vendors/update-vendor-status", {
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
    <div>
      <nav className="flex items-center justify-between px-4 py-3 bg-white shadow-md">
        {/* Logo */}
        {userType === "vendor" && (
          <Link to="/dashboard" className="text-xl font-bold text-purple-700 sm:text-2xl">
            CampusEats
          </Link>
        )}
        {userType === "user" && (
          <Link to="/" className="text-xl font-bold text-purple-700 sm:text-2xl">
            CampusEats
          </Link>
        )}
        {userType === "delivery_boy" && (
          <Link to="/delivery-boy-dashboard" className="text-xl font-bold text-purple-700 sm:text-2xl">
            CampusEats
          </Link>
        )}
        {!userType && (
          <Link to="/" className="text-xl font-bold text-purple-700 sm:text-2xl">
            CampusEats
          </Link>
        )}


        {/* Search Bar */}
        {userType !== "vendor" && userType !== "delivery_boy" && (
          <form
            onSubmit={handleSearch}
            className="flex items-center border border-gray-300 rounded-full px-2 py-1 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
          >
            <input
              type="text"
              placeholder="Search for food or restaurants"
              className="w-1 flex-grow outline-none text-gray-700 text-sm px-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
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
        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>


        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-gray-600">
          <Link to="/recipe-generator">Recipe Generator</Link>
          {isLoggedIn ? (
            <>
              {userType !== "vendor" && userType !== "delivery_boy" && (
                <Link to="/menu" className="hover:text-purple-700">
                  Menu
                </Link>
              )}
              <Link to="/profile" className="hover:text-purple-700">
                Profile
              </Link>
              {userType !== "vendor" && userType !== "delivery_boy" && (
                <>
                  <Link to="/cart" className="hover:text-purple-700">
                    Cart
                  </Link>
                  <Link to="/order-history" className="hover:text-purple-700">
                    Order History
                  </Link>
                </>
              )}
              {userType !== "user" && userType !== "delivery_boy" && (
                <Link to="/menuvendoer" className="hover:text-purple-700">
                  Our Menu
                </Link>
              )}
              {userType === "user" && (
                <Link
                  to={`/delivery/${userId}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Track Order
                </Link>
              )}
              {userType === "delivery_boy" && (
                <Link
                  to={`/custmer/${userId}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Track customer
                </Link>
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

        {/* Mobile Menu */}
        {/* Logout Modal */}
        <Modal
          isOpen={isLogoutModalOpen}
          onRequestClose={closeModal}
          className="bg-white w-96 p-8 rounded-lg shadow-lg mx-auto mt-20 z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-40"
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
      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className={`relative left-0 w-full bg-white z-10 shadow-md md:hidden transform transition-all duration-500 ease-in-out 
      ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
    `}
        >
          <div className="flex flex-col items-start space-y-4 p-4 text-gray-600">
            <Link to="/recipe-generator" onClick={handleLinkClick}>
              Recipe Generator
            </Link>
            {isLoggedIn ? (
              <>
                {userType !== 'vendor' && userType !== 'delivery_boy' && (
                  <Link onClick={handleLinkClick} to="/menu" className="hover:text-purple-700">
                    Menu
                  </Link>
                )}
                <Link onClick={handleLinkClick} to="/profile" className="hover:text-purple-700">
                  Profile
                </Link>
                {userType !== 'vendor' && userType !== 'delivery_boy' && (
                  <>
                    <Link onClick={handleLinkClick} to="/cart" className="hover:text-purple-700">
                      Cart
                    </Link>
                    <Link onClick={handleLinkClick} to="/order-history" className="hover:text-purple-700">
                      Order History
                    </Link>
                  </>
                )}
                {userType !== 'user' && userType !== 'delivery_boy' && (
                  <Link onClick={handleLinkClick} to="/menuvendoer" className="hover:text-purple-700">
                    Our Menu
                  </Link>
                )}
                {userType === 'user' && (
                  <Link
                    onClick={handleLinkClick}
                    to={`/delivery/${userId}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Track Order
                  </Link>
                )}
                {userType === 'delivery_boy' && (
                  <Link
                    onClick={handleLinkClick}
                    to={`/custmer/${userId}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Track customer
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLinkClick();
                    openModal();
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
