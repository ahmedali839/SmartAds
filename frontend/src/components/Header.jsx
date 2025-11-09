// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { MdAccountCircle } from "react-icons/md";


const Header = () => {
  const token = localStorage.getItem("token");


  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          SmartAds
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-4 items-center">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            Home
          </Link>
          {token ? (
            <>

              <Link
                to="/me"
                className="inline-flex items-center gap-1 px-3 py-2 bg-orange-100 text-gray-700 hover:text-blue-600 hover:bg-orange-200 rounded transition-all duration-200"
              >

                Dashboard
                <CgProfile size={24} />

              </Link>

            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
