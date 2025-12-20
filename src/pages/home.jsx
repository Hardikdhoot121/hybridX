import React from "react";
import { IoPersonCircle } from "react-icons/io5";
import { AiFillThunderbolt } from "react-icons/ai";
import Navbar from "./navbar";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const subjects = [
    { name: "JEE Mains", path: "jeemains" },
    { name: "JEE Advance", path: "jeeadv" },
    { name: "Hybrids Test", path: "hybrid" },
  ];
  return (
    <>
    <div className="bg-[#15191e] p-3 min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-[#fefeff] mx-auto mt-8 rounded-md flex items-center justify-center text-center font-display h-[150px] w-[750px] space-x-7">
        <div>
          <AiFillThunderbolt className="w-10 h-10 text-black-500" />
        </div>
        <div className="text-4xl flex justify-center space-x-2 font-bold">
          <span className="text-[#3abbf5]">Unlock</span>
          <span className="text-[#15191e]">Your True Potential</span>
        </div>
      </div>

      <div className="text-3xl flex justify-center space-x-2 mt-3 font-semibold">
        <span className="text-[#fefeff]">With Hybrid Test Series and Mentorship.</span>
      </div>

      <div className="text-xl flex justify-center space-x-2 mt-3">
        <span className="text-[#fefeff]">Learn from Experts and Enhance Your Preparation.</span>
      </div>

      <div className="justify-center flex mt-10 space-x-3">
        <button type="button" className="bg-[#3BBAF4] hover:bg-blue-500 text-white flex justify-center w-40 h-10 rounded-md items-center">
          Explore Test Series
        </button>
        <button type="button" className="bg-[#42BA96] hover:bg-green-500 text-white flex justify-center w-30 h-10 rounded-md items-center">
          View Pricing
        </button>
      </div>

      <div className="flex justify-center mt-10">
        <img src="../src/images/banner.jpeg" alt="Banner" className="h-50 w-100" />
      </div> 

      {/* Chapter Section */}
      <div className="mt-20 flex justify-center">
        <span className="text-5xl font-semibold text-white">Chapter Wise PYQs</span>
      </div>

      <div className="flex justify-center mt-3">
        <div className="flex justify-center space-x-12 py-7 flex-wrap">
          {subjects.map((title) => (
            
            <button
                key={title.name}
                onClick={() => navigate(`/${title.path}`)}
                className="rounded-md bg-[#272E36] text-white
                           text-xl font-medium h-16 w-[260px]
                           hover:bg-[#323a44] transition"
              >
                {title.name}
              </button>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
