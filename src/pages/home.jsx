import React from "react";
import { IoPersonCircle } from "react-icons/io5";
import { AiFillThunderbolt } from "react-icons/ai";

const Home = () => {
  return (
    <div className="bg-[#15191e] p-3 min-h-screen">
      {/* Top Banner */}
      <div className="mx-auto pt-2 rounded-md flex items-center justify-center bg-[#3abbf5] text-white text-center font-display h-10 w-[370px]">
        Premium Test Series Sale Ends Soon, Get it Now
      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-center px-8 py-4 text-white font-display">
        <img className="rounded-1xl w-30 h-20" src="../src/images/hybrid_logo.jpg" alt="Hybrid Logo" />
        <ul className="flex space-x-7 ml-[100px] mr-[100px]">
          <li className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200">Home</li>
          <li className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200">Tests</li>
          <li className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200">Leaderboard</li>
          <li className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200">Prices</li>
          <li className="px-3 py-2 rounded-md hover:bg-white hover:text-blue-600 cursor-pointer transition-all duration-200">Contact Us</li>
        </ul>
        <IoPersonCircle className="w-9 h-9" />
      </nav>

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
          {["JEE Mains", "JEE Advance", "Hybrid Test"].map((title) => (
            <div
              key={title}
              className="relative flex h-[140px] w-[320px] justify-center items-center rounded-xl bg-[#272E36] text-white text-3xl font-semibold shadow-lg"
            >
              <span>{title}</span>
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#3BBAF4] rounded-b-xl"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Header */}
      <div className="mt-30 flex justify-center text-5xl">
        <span className="font-semibold text-white mb-20">Our Pricing</span>
      </div>

      {/* Features Section */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-3 mx-auto">
          <div className="flex flex-wrap -mx-4 -mt-4 space-y-6 md:space-y-0">
            {[
              ["Real Exam Simulation", "Experience the exact pattern, difficulty, and timing of the actual exam."],
              ["Smart Performance Insights", "Get AI-based analysis to track your growth and improve faster."],
              ["Topic-Wise Tests", "Strengthen every chapter with targeted mini-tests and full-length mocks."],
            ].map(([title, desc], index) => (
              <div key={index} className="p-4 md:w-1/3 flex flex-col text-center items-center">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#CAEEFF] text-[#3BBAF4] mb-5 shrink-0">
                  <span className="text-xl">{index + 1}</span>
                </div>
                <div className="grow">
                  <h2 className="text-white text-lg title-font font-medium mb-3">{title}</h2>
                  <p className="leading-relaxed text-base">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Card */}
      <div className="flex justify-center items-center mt-10 mb-16">
        <div className="relative bg-[#1c2229] text-white w-[420px] h-[200px] rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex flex-col justify-center items-center">
          <p className="text-gray-400 line-through text-xl font-semibold mb-1">₹7,990</p>
          <p className="text-4xl font-extrabold mb-6">₹5,990</p>

          <button className="bg-[#42BA96] hover:bg-[#2ea67f] text-white font-bold py-3 px-10 rounded-xl text-lg shadow-md">
            JOIN NOW
          </button>

          <div className="absolute bottom-0 left-0 w-full h-2 bg-[#42BA96] rounded-b-2xl"></div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-30 flex justify-center">
        <span className="text-5xl font-semibold text-white">Frequently Asked Questions</span>
      </div>

      {[
        "Who is eligible for this course?",
        "What about the questions? Will I be required to do something else?",
        "Why are Hybrid online test series best for IIT JEE exam Preparation?",
        "Does the Hybrid IIT JEE test series provide solutions as well?",
      ].map((faq, index) => (
        <div
          key={index}
          className="mx-auto mt-5 rounded-md flex items-center bg-[#272E36] text-white text-center font-display h-15 w-[70%]"
        >
          <span className="ml-5">{faq}</span>
        </div>
      ))}
      <div className="mb-10"></div>
    </div>
  );
};

export default Home;
