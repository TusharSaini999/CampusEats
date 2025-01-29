import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import myImage from '../assets/hero.jpg';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  
  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn]);


  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-purple-700">
      {/* Main container */}
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content Section */}
          <div className="text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
              Hungry? We’ve got you covered!
            </h1>
            <p className="text-lg sm:text-xl mb-6">
              Order food from your favorite campus restaurants and get it
              delivered to your dorm or study spot.
            </p>
            <Link
              to="/menu"
              className="px-6 py-3 bg-white text-purple-700 font-bold rounded hover:bg-gray-200 transition duration-300"
            >
              Order Now
            </Link>
          </div>

          {/* Right Image Section */}
          <div className="flex justify-center items-center">
            <img
              src={myImage}
              alt="Egg Sandwich"
              className="rounded-lg shadow-lg w-full max-w-xs md:max-w-md lg:max-w-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
