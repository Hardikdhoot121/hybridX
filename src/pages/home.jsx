import React from "react";
import { IoPersonCircle } from "react-icons/io5";
import { AiFillThunderbolt } from "react-icons/ai";
import Navbar from "./navbar";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import banner from "../images/banner.jpeg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SmallMediaSlider from "./SmallMediaSlider";
import LoginModal from "./loginModel";

// images 
import img1 from "../images/10th Achievement hybrid.jpeg";
import img2 from "../images/NEET.jpeg";
import img3 from "../images/JEE.jpeg";
import img4 from "../images/RBSE.jpeg";


const Home = ({ images = [], videos = [], instagram = [] }) => {

   const achievementImages = [
     img1,
     img2,
     img3,
     img4
   ];
  const navigate = useNavigate();
  const [showLoginModel, setshowLoginModel] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const isLoggedIn=!!localStorage.getItem("token");
  // writing function for loggedin or not  -> login wale ko he features denai hai 
  const protection = (path)=>{
    if(isLoggedIn){navigate(path);}
    else{setshowLoginModel(true);}
  }


  const faqs = [
    {
      question: "What courses do you offer??",
      answer: "We offer coaching for JEE Main, JEE Advanced, and foundational programs for classes 9th–12th offline.",
    },
    {
      question: "Do you provide study material and PYQs",
      answer: "Yes, students get complete study material, chapter notes, and JEE Main & Advanced PYQs with solutions.",
    },
    {
      question: "How can I enroll for a course",
      answer: "You can register by contacting us at +91 90248 84949 or visit the institute in person to complete the enrollment process.",
    },
    {
      question: "Do you conduct tests and mock exams",
      answer: "Yes, weekly tests and full-length mock tests are conducted based on the latest JEE exam pattern to track progress and improve performance.",
    },
  ];


  const subjects = [
    { name: "JEE Mains", path: "jeemains" },
    { name: "JEE Advance", path: "jeeadv" },
  ];

  const hybrid = [
    { name: "NCERT+", path: "ncert+" },
    { name: "DPPs", path: "dpp" },
    { name: "Notes", path: "notes" },

  ];
  return (
    <>

    <div className="bg-[#15191e] p-3 min-h-screen">
      <Navbar />
      <div className="
    bg-[#fefeff] mx-auto mt-8 rounded-md 
    flex flex-col sm:flex-row items-center justify-center text-center 
    font-display w-full max-w-[750px]  
    sm:h-[150px] h-[120px] px-4 sm:px-6 py-4
  ">

    {/* Icon */}
    <AiFillThunderbolt className="w-10 h-10 text-yellow-500 mb-2 sm:mb-0 sm:mr-4" />

    {/* Text */}
    <div className="text-2xl sm:text-4xl font-bold flex flex-wrap justify-center gap-2 leading-tight">
      <span className="text-[#3abbf5]">Unlock</span>
      <span className="text-[#15191e]">Your Path to Excellence</span>
    </div>

  </div>

      <div className="text-center font-semibold mt-8 px-4">
  <span className="text-2xl sm:text-3xl text-[#fefeff] leading-snug">
    With Hybrid Test Series and Mentorship.
  </span>
</div>

<div className="text-center mt-3 px-4">
  <span className="text-lg sm:text-xl text-[#fefeff] leading-snug">
    Learn from Experts and Enhance Your Preparation.
  </span>
</div>

      <SmallMediaSlider

      images={achievementImages}

/>



      {/* 📌 Section Title */}
<div className="mt-20 text-center">
  <h2 className="text-3xl sm:text-5xl font-semibold text-white">Chapter Wise PYQs</h2>
</div>

{/* 📌 Buttons Grid */}
<div className="mt-6 flex justify-center">
  <div className="flex flex-wrap justify-center gap-4 sm:gap-6 px-4 py-6 max-w-5xl">

    {subjects.map((title) => (
      <button
        key={title.name}
        onClick={() => protection(`/${title.path}`)}
        className="
          rounded-md text-lg sm:text-xl font-medium
          h-12 sm:h-14 w-full sm:w-[260px] md:w-[300px] lg:w-[320px]
          bg-[#3BBAF4] hover:bg-blue-500 text-white
          flex items-center justify-center transition p-3
        "
      >
        {title.name}
      </button>
    ))}

  </div>
</div>

{/* 📌 Second Section */}
<div className="mt-20 text-center">
  <h2 className="text-3xl sm:text-5xl font-semibold text-white">Hybrid Material</h2>
</div>

<div className="mt-6 flex justify-center">
  <div className="flex flex-wrap justify-center gap-4 sm:gap-6 px-4 py-6 max-w-5xl">

    {hybrid.map((title) => (
      <button
        key={title.name}
        onClick={() => protection(`/${title.path}`)}
        className="
          rounded-md text-lg sm:text-xl font-medium
          h-12 sm:h-14 w-full sm:w-[260px] md:w-[300px] lg:w-[320px]
          bg-[#42BA96] hover:bg-green-500 text-white
          flex items-center justify-center transition p-3
        "
      >
        {title.name}
      </button>
    ))}

  </div>
</div>

          {/*Payment ka abhi kaam ka nhi h */}
       {/*<div className="mt-10 flex justify-center text-5xl">
        <h2 className="font-semibold text-white">Our Pricing</h2>
      </div>
          
     <section className="text-gray-600 body-font mt-6">
        <div className="container px-5 py-3 mx-auto">
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            // three feature cards 
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
      </div> */}

      <section className=" justify-center mt-30 text-white">
        <h1 className="text-center text-5xl font-bold mb-10">Frequently Asked Questions</h1>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((item, i) => (
            <div key={i} className="bg-[#2A2F36] rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleToggle(i)}>
              <div className="p-5 text-lg font-medium flex justify-between items-center">
                {item.question}
                <span className="text-xl">{openIndex === i ? "−" : "+"}</span>
              </div>

              {openIndex === i && (
                <div className="px-5 pb-5 text-gray-300 text-sm border-t border-gray-700">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
    </section>
      
    </div>
    {showLoginModel && (
  <LoginModal onClose={() => setshowLoginModel(false)} />
)}
    <Footer />
    </>
  );
};

export default Home;
