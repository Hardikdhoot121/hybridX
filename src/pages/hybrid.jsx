import React from "react";
import { IoPersonCircle } from "react-icons/io5";
import { AiFillThunderbolt } from "react-icons/ai";
import Navbar from "./navbar";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
const Hybrid = () => {
  const navigate = useNavigate();
  const subjects = [
    { name: "DPPs", path: "dpp" },
    { name: "Books", path: "books" },
    { name: "NCERT+", path: "ncert" },
  ];
  return (
    <>

    <div className="bg-[#15191e] p-3 min-h-screen">
            <Navbar />
            <div className="mt-20 flex justify-center">
              <span className="text-5xl font-semibold text-white">
                Choose the Material
              </span>
            </div>
    
            <div className="flex justify-center mt-10">
              <div className="flex flex-wrap justify-center gap-8">
                {subjects.map((sub) => (
                  <button
                    key={sub.name}
                    onClick={() => navigate(`/hybrid/${sub.path}`)}
                    className="rounded-md bg-[#272E36] text-white
                               text-xl font-medium h-16 w-[260px]
                               hover:bg-[#323a44] transition"
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          </div>




    <Footer />
    
    </>

    
  );




};

export default Hybrid;