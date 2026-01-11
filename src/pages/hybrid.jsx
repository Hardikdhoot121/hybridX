import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";

const Hybrid = () => {
  const navigate = useNavigate();
  const subjects = [
    { name: "DPPs", path: "dpp", icon: "📝", color: "from-blue-500 to-blue-600", bgColor: "bg-blue-500" },
    { name: "Books", path: "books", icon: "📚", color: "from-green-500 to-green-600", bgColor: "bg-green-500" },
    { name: "NCERT+", path: "ncert-plus", icon: "📖", color: "from-purple-500 to-purple-600", bgColor: "bg-purple-500" },
    { name: "Notes", path: "notes", icon: "📓", color: "from-orange-500 to-orange-600", bgColor: "bg-orange-500" },
  ];
  return (
    <>
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen p-6">
        <Navbar />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Choose Study Material
            </h1>
            <p className="text-gray-400 text-lg">
              Select a subject to start learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                onClick={() => navigate(`/${subject.path}`)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  {/* Background circle */}
                  <div className={`absolute inset-0 ${subject.bgColor} rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  
                  {/* Card content */}
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                    {/* Icon circle */}
                    <div className={`w-20 h-20 ${subject.bgColor} rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl text-white">{subject.icon}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                      {subject.name}
                    </h3>
                    
                    <p className="text-gray-600 text-center text-sm">
                      {subject.name === "DPPs" && "Daily Practice Problems"}
                      {subject.name === "Books" && "Reference Books & Materials"}
                      {subject.name === "NCERT+" && "NCERT Study Materials"}
                      {subject.name === "Notes" && "Class Notes & Summaries"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Hybrid;