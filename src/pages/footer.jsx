import React from "react";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import logo from "../images/hybrid_logo.jpg";
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="body-font mt-10 bg-white text-gray-600">
      <div className="container mx-auto flex flex-col flex-wrap px-5 py-12 md:flex-row md:flex-nowrap md:items-start lg:items-start">
        
        {/* Logo and Contact Info Section */}
        <div className="mx-auto w-64 shrink-0 text-center md:mx-0 md:text-left">
          <a className="title-font flex items-center justify-center font-medium text-gray-900 md:justify-start">
            <img 
              src={logo} 
              className="w-10 rounded" 
              alt="Hybrid Logo" 
            />
            <span className="ml-3 text-xl">Hybrid Education Hub</span>
          </a>

          <nav className="mt-4 mb-8 list-none">
          
            <ul className="mb-2 flex items-center justify-center md:justify-start">
              <li className="mr-2">
                <IoMdMail size={22} />
              </li>
              <a href="mailto:hybrideducationhub@email.com" className="mr-2 hover:text-gray-800">
                hybrideduhub@gmail.com
              </a>
            </ul>
            <ul className="mb-2 flex items-center justify-center md:justify-start">
              <li className="mr-2">
                <FaPhoneAlt size={22} />
              </li>
              <a href="tel:+919451248755" className="hover:text-gray-800">
                +91 90248 84949
              </a>

            </ul>
            <ul className="flex items-center justify-center md:justify-start">
              <li className="mr-2">
                <IoLocationSharp size={22} />
              </li>
              <span className="text-sm cursor-pointer" onClick={() => window.open ("https://share.google/4BS6PqtFtJIuQVAOW", "_blank")}>
                A-58, Shri Ram Nagar, Jodhpur, Rajasthan 342008
              </span>
            </ul>
          </nav>
        </div>

        {/* Links Navigation Section */}
        <div className="mt-10 flex grow flex-wrap text-center md:mt-0 md:pl-20 md:text-left">
          
          {/* Column 1: Home */}
          <div className="w-full px-4 md:w-1/3">
            <h2 className="title-font mb-3 text-sm font-medium tracking-widest uppercase text-gray-900">
              Home
            </h2>
            <nav className="mb-6 list-none space-y-2">
              <li><a className="hover:text-gray-800 cursor-pointer"
              onClick={() => navigate(`/`)}>Our Achievements</a></li>
              <li><a className="hover:text-gray-800 cursor-pointer"
              onClick={() => navigate(`/`)}>Chapter-Wise PYQs</a></li>
              <li><a  className="hover:text-gray-800 cursor-pointer"
              onClick={() => navigate(`/`)}>Hybrid Material</a></li>
              <li><a className="hover:text-gray-800 cursor-pointer"
              onClick={() => navigate(`/`)}>FAQs</a></li>
            </nav>
          </div>

          {/* Column 2: About Us */}
          <div className="w-full px-4 md:w-1/3">
            <h2
              className="title-font mb-3 text-sm font-medium tracking-widest uppercase text-gray-900 cursor-pointer"
              onClick={() => navigate(`/contact_us`)}
            >
              Contact Us
            </h2>

            <nav className="mb-6 list-none space-y-2">
              <li>
                <a
                  className="hover:text-gray-800 cursor-pointer"
                  onClick={() => navigate(`/contact_us`)}
                >
                  Director
                </a>
              </li>
              <li>
                <a
                  className="hover:text-gray-800 cursor-pointer"
                  onClick={() => navigate(`/contact_us`)}
                >
                  HOD
                </a>
              </li>
              <li>
                <a
                  className="hover:text-gray-800 cursor-pointer"
                  onClick={() => navigate(`/contact_us`)}
                >
                  Dev Team
                </a>
              </li>
            </nav>
          </div>


          {/* Column 3: Social Media */}
          <div className="w-full px-4 md:w-1/3">
            <h2 className="title-font mb-3 text-sm font-medium tracking-widest uppercase text-gray-900">
              Follow Us
            </h2>
            <nav className="flex list-none justify-center space-x-5 md:justify-start">
            
              <ul>
                <a  className="text-gray-600 hover:text-[#E4405F] cursor-pointer">
                  <li className="mr-2 ">
                    <FaYoutube size={22} onClick={() => window.open("https://www.youtube.com/@hybrideducationhub")}/>
                  </li>
                </a>
              </ul>
              <ul>
                <a className="text-gray-600 hover:text-[#0A66C2] cursor-pointer">
                  <li className="mr-2">
                    <FaInstagram size={22} onClick={() => window.open("https://www.instagram.com/hybrid.edu.hub?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==")}/>
                  </li>
                </a>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 py-4">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Hybrid Education Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer; 