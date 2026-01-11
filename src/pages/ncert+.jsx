import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { loadFromDrive } from "./drive"; // 👈 Correct path

// 📌 MAIN NCERT+ FOLDER ID
const NCERT_FOLDER = "1U-Mavl6eEihIlhEvQHnUaLVZ_jX_8bVA";

export default function NcertPlus() {
  const [currentFolder, setCurrentFolder] = useState(NCERT_FOLDER);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadFromDrive(currentFolder).then(list => {
      setFiles(list);
      setLoading(false);
    });
  }, [currentFolder]);

  return (
    <>
      <Navbar />

      <div className="mt-24 text-center">
        <h2 className="text-5xl font-bold text-white">NCERT+</h2>
      </div>

      {/* 🔙 Back Navigation */}
      {currentFolder !== NCERT_FOLDER && (
        <div className="text-center mt-6">
          <button
            onClick={() => setCurrentFolder(NCERT_FOLDER)}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            ⬅ Back to Main
          </button>
        </div>
      )}

      {/* ⏳ Loading */}
      {loading && (
        <p className="text-center text-gray-300 text-xl mt-6 animate-pulse">
          ⏳ Loading materials...
        </p>
      )}

      {/* 📁 Folders & 📄 Files */}
      <div className="flex justify-center mt-10 mb-100">
        <div className="max-w-5xl w-full flex flex-wrap justify-center gap-5 px-4">

          {files.map((item, i) =>
            item.isFolder ? (
              <button
                key={i}
                onClick={() => setCurrentFolder(item.id)}
                className=" rounded-md text-lg sm:text-xl font-medium
          h-12 sm:h-14 w-full sm:w-[260px] md:w-[300px] lg:w-[320px]
          bg-[#42BA96] hover:bg-green-500 text-white
          flex items-center justify-center transition p-3"
              >
                 {item.name}
              </button>
            ) : (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md text-lg sm:text-xl font-medium
          h-12 sm:h-20 w-full sm:w-[260px] md:w-[300px] lg:w-[320px]
          bg-[#3BBAF4] hover:bg-blue-500 text-white
          flex items-center justify-center transition p-3"
              >
                 {item.name}
              </a>
            )
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}
