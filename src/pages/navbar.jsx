import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../images/hybrid_logo.jpg";
import { FcBusinessman } from "react-icons/fc";
import { IoPersonCircle } from "react-icons/io5";
export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <>
    
      {/* 🔔 Announcement Banner */}
      <div className="w-full bg-[#3abbf5] text-white text-center h-10 flex items-center justify-center font-medium rounded-b-md px-2 text-sm sm:text-base">
        🌟 Quote Of The Day — Success is made in silence. Results will make the noise. 🚀
      </div>

      <nav className="bg-[#10141b] text-white px-6 py-3 flex items-center justify-between shadow-md relative">

        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="Hybrid Logo"
            className="h-12 w-auto object-contain border-2 border-white rounded-md p-1 bg-white"
          />
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center space-x-6 font-medium">
          <li
            className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200"
            onClick={() => navigate("/")}
          >
            Home
          </li>
          <li
            className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200"
            onClick={() => window.open("https://hybrideduhub.collegedoors.com")}
          >
            Tests
          </li>
          <li
            className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </li>
          <li
            className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200"
            onClick={() => navigate("/contact_us")}
          >
            Contact Us
          </li>
        </ul>

{/* Avatar (Desktop Only) */}
<div className="relative group cursor-pointer">
  {isLoggedIn ? (
    <>
      <FcBusinessman
        className="h-14 w-14 rounded-full bg-gray-800"
        onClick={() => navigate("/dashboard")}
      />

      {/* Tooltip */}
      <div className="
        absolute right-0 mt-2
        whitespace-nowrap
        scale-0 group-hover:scale-100
        transition-transform duration-200
        bg-black text-white text-xs px-3 py-1 rounded-md
        shadow-lg
      ">
        click to access dashboard
      </div>
    </>
  ) : (
    <>
      <IoPersonCircle
        className="h-14 w-14 rounded-full bg-gray-800"
        onClick={() => navigate("/login")}
      />

      {/* Tooltip */}
      <div className="
        absolute right-0 mt-2
        whitespace-nowrap
        scale-0 group-hover:scale-100
        transition-transform duration-200
        bg-black text-white text-xs px-3 py-1 rounded-md
        shadow-lg
      ">
        Login to continue
      </div>
    </>
  )}
</div>


        {/* Hamburger Menu - Mobile */}
        <button
          className="block md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden bg-[#0d1117] text-white px-6 py-4 space-y-3 font-medium border-t border-gray-700">
          
          <p onClick={() => { navigate("/"); setOpen(false); }} className="py-2 hover:text-blue-400 cursor-pointer">Home</p>
          <p onClick={() => { window.open("https://hybrideduhub.collegedoors.com"); setOpen(false); }} className="py-2 hover:text-blue-400 cursor-pointer">Tests</p>
          <p onClick={() => { navigate("/dashboard"); setOpen(false); }} className="py-2 hover:text-blue-400 cursor-pointer">Dashboard</p>
          <p onClick={() => { navigate("/contact_us"); setOpen(false); }} className="py-2 hover:text-blue-400 cursor-pointer">Contact Us</p>
        </div>
      )}
    </>
  );
}
