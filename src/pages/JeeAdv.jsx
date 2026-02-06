import React from "react";
import { motion } from "framer-motion";
import Footer from "./footer";
import Navbar from "./navbar";

export default function JeeAdv() {
  return (
    <>
      <div className="bg-[#15191e] p-3 min-h-screen">
        <Navbar />
        
        <div className="flex flex-col items-center justify-center mt-32 px-4">
          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-8"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-green-500 via-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse shadow-2xl shadow-blue-500/50 relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse"></div>
              
              {/* Buffering/Loading symbol */}
              <svg
                className="w-16 h-16 text-white animate-spin relative z-10 drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              
              {/* Glowing effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-green-400/20 to-blue-400/20 blur-xl animate-pulse"></div>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-center mb-4"
          >
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-white bg-clip-text text-transparent">
              JEE Advanced PYQs
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-200 text-center mb-8"
          >
            This feature is under Construction  
          </motion.p>

          {/* Description cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12"
          >
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-green-600 hover:border-green-400 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Previous Year Questions</h3>
              <p className="text-gray-300 text-sm">Complete collection of JEE Advanced PYQs from 2010-2024 with detailed solutions</p>
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-blue-600 hover:border-blue-400 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Analysis</h3>
              <p className="text-gray-300 text-sm">Instant performance analysis with topic-wise difficulty distribution and trends</p>
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-white hover:border-gray-300 transition-all duration-300">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Filters</h3>
              <p className="text-gray-300 text-sm">Filter PYQs by subject, chapter, difficulty level and year with advanced search</p>
            </div>
          </motion.div>

          {/* Notify button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 via-blue-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          >
            Access PYQs & Analysis
          </motion.button>

          {/* Status indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-12 w-full max-w-md"
          >
            <div className="text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="inline-block"
              >
                <span className="bg-gradient-to-r from-green-400 via-blue-400 to-white bg-clip-text text-transparent text-2xl font-bold">
                  Feature Coming Soon
                </span>
              </motion.div>
            </div>
            
            <div className="text-center mb-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="flex items-center justify-center gap-2"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-blue-200 text-lg">Development in Progress</span>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </motion.div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  duration: 2, 
                  delay: 1.6,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="bg-gradient-to-r from-green-500 via-blue-500 to-blue-600 h-2 rounded-full w-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
