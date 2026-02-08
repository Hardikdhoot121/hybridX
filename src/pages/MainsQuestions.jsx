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
  

  const getPreviewText = (htmlText, maxLength = 120) => {
  if (!htmlText) return "";

  // Remove HTML tags
  const text = htmlText.replace(/<[^>]+>/g, "");

  return text.length > maxLength
    ? text.slice(0, maxLength) + "..."
    : text;
};

const formatSlugToTitle = (slug) => {
  if (!slug) return "";
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatExamLabel = (slug) => {
  if (!slug) return "";

  const parts = slug.split("-");

  const year = parts.find(p => /^\d{4}$/.test(p));
  const day = parts.find(p => /^(?:\d{1,2})(st|nd|rd|th)$/.test(p));
  const month = parts.find(p =>
    ["january","february","march","april","may","june",
     "july","august","september","october","november","december"]
    .includes(p)
  );

  return `${day ? capitalize(day) : ""} ${month ? capitalize(month) : ""} JEE Mains ${year || ""}`.trim();
};

const capitalize = (str) =>
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
      </div>


      {/* Question List */}
      <div className="max-w-5xl mx-auto space-y-4">
        {data.map((q, index) => (
          <div
            key={q.question_id || index}
            
            onClick={() =>
             navigate(`/jeemains/${subject}/${chapter}/${q.question_id}`)
            }
            className="bg-slate-800 p-5 rounded-lg hover:bg-slate-700 transition cursor-pointer"
          >
            <div className="flex gap-5">
              <span className="text-blue-400 font-semibold">
                {index + 1}.
              </span>

            <MathRenderer content={q.question} />
            
              

              <div
                className="text-slate-200 text-left"
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
