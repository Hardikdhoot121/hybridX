import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/hybrid_logo.jpg"

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <div className="mx-auto mt-2 rounded-md flex items-center justify-center bg-[#3abbf5] text-white text-center font-display h-10 w-370">
        Premium Test Series🌟 — Sale Ends Soon, Get it Now
      </div>

      <nav className="flex items-center justify-between px-8 py-4 text-white font-display">

        {}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="Hybrid Logo"
            className="h-15 w-auto object-contain border-2 border-amber-50 rounded-[8px] p-2 bg-white"
          />
        </div>

        {}
        <ul className="flex items-center space-x-8">
          <li
            className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200"
            onClick={() => navigate("/")}
          >
            Home
          </li>
          <li className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200">
            Tests
          </li>
          <li
            className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </li>
          <li className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200">
            Prices
          </li>
          <li
            className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200"
            onClick={() => navigate("/contact_us")}
          >
            Contact Us
          </li>
        </ul>

        {}
        <img
          className="w-9 h-9 rounded-full object-cover cursor-pointer"
          src="/images/Avatar.png"
          alt="Avatar"
        />
      </nav>

    </>
  );
}