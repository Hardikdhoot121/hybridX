import React from "react";

export default function Navbar() {
  return (
    <>
      <div className="mx-auto mt-2 rounded-md flex items-center justify-center bg-[#3abbf5] text-white text-center font-display h-10 w-370">
        Premium Test Series — Sale Ends Soon, Get it Now
      </div>

      <nav className="flex items-center justify-center px-8 py-4 text-white font-display">
        <img
          className="rounded-1xl w-9 h-9"
          src="../src/images/hybrid_logo.jpg"
          alt="Hybrid Logo"
        />
        <ul className="flex space-x-7 ml-100 mr-100">
          <li className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200" >Home</li>
          <li className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200">Tests</li>
          <li className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200">Dashboard</li>
          <li className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200">Prices</li>
          <li className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200">Contact Us</li>
        </ul>
        <img
          className="rounded-1xl w-9 h-9"
          src="/images/Avatar.png"
          alt="Avatar"
        />
      </nav>
    </>
  );
}
