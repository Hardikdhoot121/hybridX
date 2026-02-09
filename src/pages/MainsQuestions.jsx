import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Data from "../jee_mains_clean.json";
import Navbar from "./navbar";
import Footer from "./footer";
import SingleQuestion from "./MainsPYQ";
import MathRenderer from "./mathrender";



const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://hybridx-uhj9.onrender.com/api';

function MainsPYQ() {
  const navigate = useNavigate();
  const { subject, chapter } = useParams();
  const [data, setData] = useState([]);
  const [currIndex, setCurrIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [integerAnswer, setIntegerAnswer] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");





  /* ---------------- DATA LOAD ---------------- */

  useEffect(() => {
    const filtered = Data.filter(
      (q) =>
        q.subject?.toLowerCase() === subject.toLowerCase() &&
        q.chapter?.toLowerCase() === chapter.toLowerCase()
    );

    setData(filtered.reverse());
    setCurrIndex(0);
  }, [subject, chapter]);

  useEffect(() => {
    setSelectedOption(null);
    setShowResult(false);
  }, [currIndex]);

  if (data.length === 0) {
    return (
      <div className="bg-[#15191E] text-white min-h-screen flex items-center justify-center">
        Loading questions...
      </div>
    );
  }

  const currVal = data[currIndex];
  const currOptions = currVal.options;
  

const parseExamDate = (slug) => {
  if (!slug) return new Date(0);

  const parts = slug.toLowerCase().split("-");

  const months = [
    "january","february","march","april","may","june",
    "july","august","september","october","november","december"
  ];

  const year = parts.find(p => /^\d{4}$/.test(p));
  const day = parts.find(p => /\d+/.test(p))?.replace(/\D/g, "");
  const monthIndex = months.indexOf(parts.find(p => months.includes(p)));

  return new Date(year, monthIndex, day);
};






const getYearFromSlug = (slug) => {
  const match = slug?.match(/\b\d{4}\b/);
  return match ? match[0] : null;
};


const formatSlugToTitle = (slug) => {
  if (!slug) return "";
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const sortedData = [...data]
  .filter(q =>
    selectedYear === "All" || getYearFromSlug(q.paper_id) === selectedYear
  )
  .sort((a, b) => parseExamDate(b.paper_id) - parseExamDate(a.paper_id)); // new → old

const years = [
  "All",
  ...new Set(data.map(q => getYearFromSlug(q.paper_id)))
].sort((a, b) => b - a);




const formatExamLabel = (slug) => {
  if (!slug) return "";

  const parts = slug.toLowerCase().split("-");

  const months = [
    "january","february","march","april","may","june",
    "july","august","september","october","november","december"
  ];

  const year = parts.find(p => /^\d{4}$/.test(p));
  const day = parts.find(p => /^(?:\d{1,2})(st|nd|rd|th)$/.test(p));
  const month = parts.find(p => months.includes(p));

  const shiftIndex = parts.findIndex(p =>
    ["morning","afternoon","evening"].includes(p)
  );

  const shift =
    shiftIndex !== -1
      ? `${capitalize(parts[shiftIndex])} ${capitalize(parts[shiftIndex + 1] || "")}`
      : null;

  const exam =
    parts.includes("jee") && parts.includes("main")
      ? "JEE Mains"
      : null;

  // ✅ only include existing pieces
  return [shift, day, month && capitalize(month), exam, year]
    .filter(Boolean)
    .join(" ");
};

const capitalize = (str = "") =>
  str.charAt(0).toUpperCase() + str.slice(1);





  
  /* ---------------- UI ---------------- */

  return (
  <>
    <Navbar />


    <div className="bg-[#15191E] min-h-screen text-white px-6 py-8">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6">
        <h1 className="text-4xl font-bold mb-2">
         {formatSlugToTitle( subject)}
        </h1>
        <h1 className="text-2xl font-bold mb-2">
         {formatSlugToTitle(chapter)}
        </h1>
        <p className="text-slate-400">
          Total Questions: <span className="text-white font-semibold">{data.length}</span>
        </p>
         <select
    value={selectedYear}
    onChange={(e) => setSelectedYear(e.target.value)}
    className="bg-slate-800 border border-slate-600 px-3 py-2 rounded text-white mt-4"
  >
    {years.map(year => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
      </div>


      {/* Question List */}
      <div className="max-w-5xl mx-auto space-y-4">
        {sortedData.map((q, index) => (
          <div
            key={q.question_id || index}
            
            onClick={() =>
             navigate(`/jeemains/${subject}/${chapter}/${q.question_id}`)
            }
            className="bg-slate-800 p-5 rounded-lg hover:bg-slate-700 transition cursor-pointer"
          >
            <div className="flex flex-col gap-2">
              <span className="text-blue-400 font-semibold">
                {index + 1}.
              </span>

            <MathRenderer content={q.question} />
            
              

              <div
                className="text-slate-200 text-sm text-right"
                dangerouslySetInnerHTML={{
                __html: formatExamLabel(q.paper_id)
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    <Footer />
  </>
);

}
export default MainsPYQ;
