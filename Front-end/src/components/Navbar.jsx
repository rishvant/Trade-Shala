import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTrade } from "../context/context";
const Navbar = () => {
  const trade = useTrade();
  const isLogin = trade.isLogin;
  const setIsLogin = trade.setIsLogin;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Refs to handle clicks outside
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsLogin(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // bahar ke click ke liye
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#131722] p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-white text-2xl font-bold tracking-wider">
            TradeGPT
          </Link>
        </div>

        {/* Main Navigation (Centered) */}
        <div className="hidden lg:flex flex-1 justify-center space-x-8">
          <Link
            to="/"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Products
          </Link>
          <Link
            to="/community"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Community
          </Link>
          <Link
            to="/markets"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Markets
          </Link>
          <Link
            to="/news"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            News
          </Link>
          <Link
            to="/contact"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            ContactUs
          </Link>
        </div>

        {/* Right Side Navigation */}
        <div className="flex items-center space-x-4 relative">
          {/* Profile Dropdown */}
          {isLogin ? (
            <div className="relative">
              <button
                ref={profileButtonRef}
                onClick={toggleProfileMenu}
                className="text-gray-300 hover:text-white flex items-center transition-colors duration-300"
              >
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </button>
              {isProfileMenuOpen && (
                <div
                  ref={profileMenuRef}
                  className="absolute right-0 mt-2 bg-[#1e222d] text-gray-300 rounded-lg shadow-lg w-48 z-10"
                >
                  <ul className="space-y-2 p-2">
                    <li>
                      <button className="w-full text-left py-2 px-4 hover:bg-[#2a2d39] transition-colors duration-200">
                        <Link to={"/login"}>Sign In</Link>
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left py-2 px-4 hover:bg-[#2a2d39] transition-colors duration-200">
                        What's New
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left py-2 px-4 hover:bg-[#2a2d39] transition-colors duration-200">
                        More
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <h1></h1>
          )}

          {/* Get Started Button */}
          <button
            className={`p-2 rounded-md text-sm font-semibold shadow-md transition duration-300 transform hover:scale-105 ${
              isLogin
                ? "bg-[#d32f2f] text-white hover:bg-[#c62828]" // Logout button style (red)
                : "bg-[#2962ff] text-white hover:bg-[#1c54d4]" // Login button style (blue)
            }`}
            onClick={isLogin ? handleLogout : null} // Attach the logout function only when logged in
          >
            {isLogin ? (
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white" onClick={toggleMenu}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#1e222d] mt-4 p-4 rounded-lg">
          <div className="space-y-4">
            <Link
              to="/products"
              className="block text-gray-300 hover:text-white transition-colors duration-300"
            >
              Products
            </Link>
            <Link
              to="/community"
              className="block text-gray-300 hover:text-white transition-colors duration-300"
            >
              Community
            </Link>
            <Link
              to="/markets"
              className="block text-gray-300 hover:text-white transition-colors duration-300"
            >
              Markets
            </Link>
            <Link
              to="/news"
              className="block text-gray-300 hover:text-white transition-colors duration-300"
            >
              News
            </Link>
            <Link
              to="/brokers"
              className="block text-gray-300 hover:text-white transition-colors duration-300"
            >
              Brokers
            </Link>
            <div className="border-t border-gray-700 pt-2">
              <button className="w-full bg-[#2962ff] text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2 transition-colors duration-300">
                <Link to={"/login"}>Sign In</Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
