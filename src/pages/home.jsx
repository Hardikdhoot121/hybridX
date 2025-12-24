import React from "react";
import { IoPersonCircle } from "react-icons/io5";
import { AiFillThunderbolt } from "react-icons/ai";
import Navbar from "./navbar";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";

import banner from "../images/banner.jpeg"

const Home = () => {
  const navigate = useNavigate();
  const subjects = [
    { name: "JEE Mains", path: "jeemains" },
    { name: "JEE Advance", path: "jeeadv" },
    { name: "Hybrid Material", path: "hybrid" },
  ];
  return (
    <>
    <div className="bg-[#15191e] p-3 min-h-screen">
      <Navbar />
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
        <img src={banner} alt="Banner" style={{ height: '200px', width: 'auto' }} />
      </div> 

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

      <div className="mt-10 flex justify-center text-5xl">
        <h2 className="font-semibold text-white">Our Pricing</h2>
      </div>

      <section className="text-gray-600 body-font mt-6">
        <div className="container px-5 py-3 mx-auto">
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            {/* three feature cards */}
            <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
              <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#CAEEFF] text-[#3BBAF4] mb-5 shrink-0">
                <span className="text-xl">1</span>
              </div>
              <div className="grow">
                <h2 className="text-white text-lg title-font font-medium mb-3">Real Exam Simulation</h2>
                <p className="leading-relaxed text-base">Experience the exact pattern, difficulty, and timing of the actual exam.</p>
              </div>
            </div>

            <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
              <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#CAEEFF] text-[#3BBAF4] mb-5 shrink-0">
                <span className="text-xl">2</span>
              </div>
              <div className="grow">
                <h2 className="text-white text-lg title-font font-medium mb-3">Smart Performance Insights</h2>
                <p className="leading-relaxed text-base">Get AI-based analysis to track your growth and improve faster.</p>
              </div>
            </div>

            <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
              <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#CAEEFF] text-[#3BBAF4] mb-5 shrink-0">
                <span className="text-xl">3</span>
              </div>
              <div className="grow">
                <h2 className="text-white text-lg title-font font-medium mb-3">Topic-Wise Tests</h2>
                <p className="leading-relaxed text-base">Strengthen every chapter with targeted mini-tests and full-length mocks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      <section className="text-gray-600 body-font mt-10">
      <div className="container px-5 py-3 mx-auto">
        <div className="flex flex-wrap sm:-m-4 -mx-4  -mt-4 md:space-y-0 space-y-6">
          <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
            <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#CAEEFF] text-[#3BBAF4] mb-5 shrink-0">
              <a className="text-xl">4</a>
            </div>
            <div className="grow">
              <h2 className="text-white text-lg title-font font-medium ">Expert-Curated Questions</h2>
              <p className="leading-relaxed text-base">Designed by top educators with deep understanding of exam trends.</p>
            </div>
          </div>
          <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
            <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#CAEEFF] text-[#3BBAF4] mb-5 shrink-0">
              <a className="text-xl">5</a>
            </div>
            <div className="grow">
              <h2 className="text-white text-lg title-font font-medium ">Affordable Brilliance</h2>
              <p className="leading-relaxed text-base">Premium-level content and analytics — all at just ₹5990.</p>
              
            </div>
          </div>
          <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
            <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#CAEEFF] text-[#3BBAF4] mb-5 shrink-0">
              <a className="text-xl">6</a>
            </div>
            <div className="grow">
              <h2 className="text-white text-lg title-font font-medium ">Rank Comparison</h2>
              <p className="leading-relaxed text-base">Compete with thousands of students and see where you truly stand.</p>
            </div>
          </div>
        </div>
      </div>
     </section>

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
      
      <div className="mt-40 flex justify-center">
        <a className="text-5xl font-semibold text-white">Frequently Asked Questions</a>
        </div>
      <div className="mx-auto mt-10 rounded-md flex items-center bg-[#272E36] text-white text-center font-display h-15 w-370">
        <a className="ml-5"> Who is eligible for this course?</a>
      </div>
      <div className="mx-auto mt-5 rounded-md flex  items-center bg-[#272E36] text-white text-center font-display h-15 w-370">
          <a className="ml-5"> What about the questions? Will I be required to do something else?</a>
      </div>
      <div className="mx-auto mt-5 rounded-md flex  items-center bg-[#272E36] text-white text-center font-display h-15 w-370">
          <a className="ml-5">Why are Hybrid online test series best for IIT JEE exam Preparation?</a>
      </div>
      <div className="mx-auto mt-5 rounded-md flex  items-center bg-[#272E36] text-white text-center font-display h-15 w-370">
          <a className="ml-5">Does the Hybrid IIT JEE test series provide solutions as well?</a>
      </div>

      
      
    </div>
    <Footer />
    </>
  );
};

export default Home;
