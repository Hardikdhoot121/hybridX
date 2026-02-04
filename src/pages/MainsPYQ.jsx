import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import Data from "../jee_mains_clean.json";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Navbar from "./navbar";
import Footer from "./footer";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://hybridx-uhj9.onrender.com/api';

function SingleQuestion() {
  const { subject, chapter, questionId } = useParams();
  const [questions, setQuestions] = useState([]);
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
      .replace(/\\buildrel\s*\{([^}]*)\}\s*\\over\s*\\longrightarrow/g, "\\xrightarrow{$1}")
      .replace(/\\mathrel\s*\{\\mathop\{\\kern0pt\\longrightarrow\}\\limits_\{([^}]*)\}\^\{([^}]*)\}\}/g, "\\xrightarrow[$1]{$2}");
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
  // 1. Filter and Sort as usual
  const filtered = Data.filter(
    (q) =>
      q.subject?.toLowerCase() === subject?.toLowerCase() &&
      q.chapter?.toLowerCase() === chapter?.toLowerCase()
  ).sort((a, b) => Number(a.question_number) - Number(b.question_number));

  // 2. REVERSE the array so the last question is now the first
  const reversed = [...filtered].reverse(); 

  setQuestions(reversed);

  // 3. Set the initial index
  if (questionId) {
    const index = reversed.findIndex((q) => String(q.question_id) === String(questionId));
    setCurrIndex(index !== -1 ? index : 0);
  } else {
    setCurrIndex(0);
  }

}, [subject, chapter, questionId]);

useEffect(() => {
  if (showResult) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
}, [showResult]);

  if (questions.length === 0) {
    return (
      <div className="bg-[#15191E] text-white min-h-screen flex items-center justify-center">
        Loading questions...
      </div>
    );
  }

  // Add this helper inside your component to find the solution text


  const currVal = questions[currIndex];
  const solutionText = currVal.explanation || currVal.solution || currVal.detailed_solution;

  /* ---------------- BACKEND SUBMIT ---------------- */
  const submitPracticeAttempt = async () => {
    const token = localStorage.getItem("token");
    if (!token || !currVal || selectedOption === null) return;

    const payload = {
      questionId: currVal.question_id,
      subject: currVal.subject.toLowerCase(),
      topic: currVal.topic || currVal.chapter,
      difficulty: "Medium",
      isCorrect: selectedOption === currVal.correct_option_index,
      questionType: currVal.question_type || "mcq",
      userAnswer: selectedOption,
      correctAnswer: currVal.correct_option_index,
    };

    try {
      const response = await fetch(`${API_BASE}/practice/attempt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok && payload.isCorrect) {
        const trigger = { type: 'correct-answer', timestamp: Date.now(), subject: currVal.subject.toLowerCase(), questionId: currVal.question_id };
        localStorage.setItem('dashboard-refresh-trigger', JSON.stringify(trigger));
        window.dispatchEvent(new StorageEvent('storage', { key: 'dashboard-refresh-trigger', newValue: JSON.stringify(trigger) }));
      }
    } catch (err) {
      console.error("Failed to submit attempt", err);
    }
  };

  /* ---------------- CONTROLS ---------------- */
  const handleNext = () => {
    setCurrIndex((i) => Math.min(i + 1, questions.length - 1));
    setSelectedOption(null);
    setShowResult(false);
  };

  const handlePrev = () => {
    setCurrIndex((i) => Math.max(i - 1, 0));
    setSelectedOption(null);
    setShowResult(false);
  };

  const handleSubmit = () => {
    setShowResult(true);
    submitPracticeAttempt();
  };

  return (
    <div className="bg-[#15191E] min-h-screen text-white px-6 py-10">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#272E36] rounded-xl p-6">
          {/* Header */}
<div className="flex justify-between text-slate-400 mb-4">
  {/* This replaces currIndex + 1 */}
  <p>Question {currIndex} / {questions.length}</p>
  <p>{subject.toUpperCase()}</p>
</div>
          <div className="text-lg font-medium">
            {renderQuestion(fixLatex(cleanHTML(currVal.question)))}
          </div>

          {currVal.question_type === "mcq" && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              {currVal.options.map((opt, i) => {
                let border = "border border-white/20";
                let bg = "bg-[#1F252B]";
                if (showResult) {
                  if (i === currVal.correct_option_index) bg = "bg-green-800";
                  else if (i === selectedOption) bg = "bg-red-800";
                } else if (i === selectedOption) {
                  border = "border-2 border-[#3DBBF4]";
                }
                return (
                  <button key={i} onClick={() => setSelectedOption(i)} disabled={showResult} className={`${bg} ${border} rounded-xl p-4 text-left`}>
                    {renderQuestion(fixLatex(cleanHTML(opt.content)))}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Options grid ends here */}

{/* Explanation Section */}
{showResult && solutionText && (
  <div className="mt-8 pt-6 border-t border-white/20">
    <div className="flex items-center gap-2 mb-4">
      <div className="h-6 w-1 bg-[#3DBBF4] rounded-full"></div>
      <h3 className="text-[#3DBBF4] font-bold text-lg">Solution</h3>
    </div>
    <div className="text-slate-200 leading-relaxed bg-[#1F252B] p-5 rounded-xl border border-white/5">
      {renderQuestion(
        fixLatex(cleanHTML(solutionText))
      )}
    </div>
  </div>
)}

        <div className="flex justify-between mt-6">
          <button onClick={handlePrev} disabled={currIndex === 0} className="px-6 py-3 border border-white/40 rounded-xl disabled:opacity-50">
            Previous
          </button>
          <button onClick={handleSubmit} disabled={selectedOption === null || showResult} className="px-6 py-3 bg-[#3DBBF4] rounded-xl text-black font-semibold disabled:opacity-50">
            Submit
          </button>
          <button onClick={handleNext} disabled={currIndex === questions.length - 1} className="px-6 py-3 border border-white/40 rounded-xl disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SingleQuestion;