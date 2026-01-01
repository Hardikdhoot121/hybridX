import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import Data from "../jee_mains_clean.json";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Navbar from "./navbar";
import Footer from "./footer";

const API_BASE = "http://localhost:5000";

function MainsPYQ() {
  const { subject, chapter } = useParams();

  const [data, setData] = useState([]);
  const [currIndex, setCurrIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [integerAnswer, setIntegerAnswer] = useState("");


  /* ---------------- CLEANERS ---------------- */

  const cleanHTML = (html) => {
    if (!html) return html;

    return html
      .replace(/style\s*=\s*["'][^"']*["']/gi, "")
      .replace(/align\s*=\s*["']?(right|left|center)["']?/gi, "")
      .replace(/<\/?table[^>]*>/gi, " ")
      .replace(/<\/?tr[^>]*>/gi, " ")
      .replace(/<\/?td[^>]*>/gi, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  const fixLatex = (text) => {
    if (!text) return text;
    return text
      .replace(
        /\\buildrel\s*\{([^}]*)\}\s*\\over\s*\\longrightarrow/g,
        "\\xrightarrow{$1}"
      )
      .replace(
        /\\mathrel\s*\{\\mathop\{\\kern0pt\\longrightarrow\}\\limits_\{([^}]*)\}\^\{([^}]*)\}\}/g,
        "\\xrightarrow[$1]{$2}"
      );
  };



  const renderQuestion = (text) => {
    if (!text) return null;
    const parts = text.split("$$");
    return parts.map((part, i) =>
      i % 2 === 0 ? (
        <span key={i} dangerouslySetInnerHTML={{ __html: part }} />
      ) : (
        <BlockMath key={i} math={part} />
      )
    );
  };

  /* ---------------- DATA LOAD ---------------- */

  useEffect(() => {
    const filtered = Data.filter(
      (q) =>
        q.subject?.toLowerCase() === subject.toLowerCase() &&
        q.chapter?.toLowerCase() === chapter.toLowerCase()
    );

    setData(filtered);
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

  /* ---------------- BACKEND SUBMIT ---------------- */

const submitPracticeAttempt = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ No token");
    return;
  }

  const currVal = data[currIndex];

  // 🛑 HARD VALIDATION (THIS FIXES YOUR ERROR)
  if (!currVal || selectedOption === null) {
    console.error("❌ Invalid attempt", currVal, selectedOption);
    return;
  }

  const payload = {
    questionId: currVal.question_id,
    subject: currVal.subject.toLowerCase(),
    topic: currVal.topic || currVal.chapter,
    difficulty: "Medium",
    isCorrect: selectedOption === currVal.correct_option_index
  };

  console.log("✅ Sending payload:", payload);

  try {
    await fetch("http://localhost:5000/api/practice/attempt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("❌ Failed to submit attempt", err);
  }
};


  /* ---------------- CONTROLS ---------------- */

  const prev = () => {
    setCurrIndex((i) => Math.max(i - 1, 0));
    setIntegerAnswer(" ");
  };
  const next = () => {
    setCurrIndex((i) => Math.min(i + 1, data.length - 1) );
    setIntegerAnswer(" ");
  }

  const submit = () => {
    setShowResult(true);
    submitPracticeAttempt();
  };

  const formatTitle = (slug) =>
    slug.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  function capitalizeEachWord(str) {
    const words = str.split('-');
    const capitalizedWords = words.map(word => {
      return word[0].toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(' ');
  }
  /* ---------------- UI ---------------- */

  return (
    <>
      <div className="bg-[#15191E] text-white min-h-screen">
        <Navbar />

        <p className="text-center font-bold mt-10">
          JEE MAINS — {formatTitle(chapter)}
        </p>

        <div className="bg-[#272E36] rounded-xl p-6 mx-auto w-[70%] mt-10">
          <div className="flex justify-between opacity-75">
            <p>Question {currIndex + 1}</p>
            <p>{subject.toUpperCase()}</p>
          </div>
          <div >
            <p className="opacity-75">{capitalizeEachWord(currVal.paper_id)}</p>
          </div>

          <div className="font-bold mt-5">
            {renderQuestion(
              fixLatex(cleanHTML(currVal.question))
            )}
          </div>
        </div>

        {currVal.question_type == "mcq" &&
          <div className="grid grid-cols-2 gap-4 w-[70%] mx-auto mt-6">
            {currOptions.map((opt, i) => {
              let bg = "bg-[#272E36]";
              let border = "border";

              if (showResult) {
                if (i === currVal.correct_option_index) {
                  bg = "bg-green-800";
                  border = "border-2 border-green-500";
                } else if (i === selectedOption) {
                  bg = "bg-red-800";
                  border = "border-2 border-red-500";
                }
              } else if (i === selectedOption) {
                border = "border-2 border-[#3DBBF4]";
              }

              return (
                <button
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  className={`${bg} ${border} rounded-xl p-6`}
                >
                  {renderQuestion(
                    fixLatex(cleanHTML(opt.content))
                  )}
                </button>
              );
            })}
          </div>
        }

        {currVal.question_type === "integer" && (
          <div className="w-[70%] mx-auto mt-6">

            {/* Input Box */}
            <input
            type="number"
            value={integerAnswer}
            onChange={(e) => setIntegerAnswer(e.target.value)}
            disabled={showResult}
            className={`w-full p-4 rounded-xl text-white bg-[#272E36]
              border-solid!
              ${showResult
              ? Number(integerAnswer) === Number(currVal.answer)
              ? "border-2 border-green-400!"
              : "border-2 border-red-400!"
              : "border-2 border-grey-400!"
              }
              outline-none focus:outline-none focus:ring-0
            `}
            placeholder="Enter your answer"
            />

          </div>
        )}


        {showResult && (
          <div className="bg-[#272E36] w-[70%] mx-auto my-6 p-8 rounded-xl">
            {
              currVal.question_type==="integer" && 
              <div className="text-green-500 mb-2">
                Correct Answer is : {currVal.answer}
              </div>
            }
            <p><b>EXPLANATION:</b></p>
            <br></br>
            
            {renderQuestion(
              fixLatex(cleanHTML(currVal.explanation))
            )}
          </div>
        )}

        {/* Bottom Buttons */}
<div className="fixed bottom-0 left-0 w-full bg-[#15191E] py-4 border-t border-white/10 z-50">
  <div className="flex gap-2 px-4 sm:px-0 sm:w-[70%] mx-auto">
    <button
      onClick={prev}
      disabled={currIndex === 0}
      className="w-1/3 border border-white/50 py-3 rounded-xl text-xs sm:text-base hover:border-white"
    >
      PREVIOUS
    </button>

    <button
      onClick={submit}
      className="w-1/3 bg-[#3DBBF4] py-3 rounded-xl text-xs sm:text-base hover:bg-[#35a9df]"
    >
      SUBMIT
    </button>

    <button
      onClick={next}
      disabled={currIndex === data.length - 1}
      className="w-1/3 border border-white/50 py-3 rounded-xl text-xs sm:text-base hover:border-white"
    >
      NEXT
    </button>
  </div>
</div>

      </div>

    </>
  );
}

export default MainsPYQ;
