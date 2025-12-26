import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";

export default function Mains() {
  const navigate = useNavigate();

  const subjects = [
    { name: "Chemistry", path: "chemistry" },
    { name: "Mathematics", path: "maths" },
    { name: "Physics", path: "physics" },
  ];

  return (
    <>
    
      <div className="bg-[#15191e] p-3 min-h-screen">
        <Navbar />
        <div className="mt-20 flex justify-center">
          <span className="text-5xl font-semibold text-white">
            Choose The Subject
          </span>
        </div>

        <div className="flex justify-center mt-10">
          <div className="flex flex-wrap justify-center gap-8">
            {subjects.map((sub) => (
              <button
                key={sub.name}
                onClick={() => navigate(`/jeemains/${sub.path}`)}
                className="rounded-md text-lg sm:text-xl font-medium
          h-12 sm:h-14 w-full sm:w-[260px] md:w-[300px] lg:w-[320px]
          bg-[#42BA96] hover:bg-green-500 text-white
          flex items-center justify-center transition p-3"
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
}
