import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import rawData from "../jee_mains_clean.json";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Chemistry() {
  const navigate = useNavigate();
  const { chapter } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [numericalAnswer, setNumericalAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [attemptRecorded, setAttemptRecorded] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const Data = Array.isArray(rawData) ? rawData : rawData.default;

  const chemistryQuestions = Data.filter(
    (q) => q.subject?.toLowerCase() === "chemistry"
  );

  // If chapter parameter exists, show chapter content
  if (chapter) {
    const chapterQuestions = chemistryQuestions.filter(
      (q) => q.chapter === chapter
    );

    const recordAttempt = async (isCorrect) => {
      if (attemptRecorded) return; // Prevent duplicate recording

      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const question = chapterQuestions[currentQuestion];
      const isNumerical = question.question_type === 'integer';
      const userAns = isNumerical ? numericalAnswer : selectedAnswer;
      const correctAns = isNumerical ? question.answer : question.correct_option;
      
      console.log(' Question data:', {
        questionId: question.question_id || `chemistry-${currentQuestion}`,
        subject: "chemistry",
        topic: question.topic || chapter,
        isCorrect,
        questionType: question.question_type,
        userAnswer: userAns,
        correctAnswer: correctAns
      });
      
      const response = await fetch(`${API_BASE}/practice/attempt`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          questionId: question.question_id || `chemistry-${currentQuestion}`,
          subject: "chemistry",
          topic: question.topic || chapter,
          difficulty: "Medium",
          isCorrect,
          questionType: question.question_type || "mcq",
          userAnswer: userAns,
          correctAnswer: correctAns,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(" Practice attempt recorded:", data);
        setAttemptRecorded(true);
        
        // Show success feedback
        if (isCorrect) {
          console.log(" Correct answer! Weekly goal updated.");
          // Trigger dashboard refresh event
          localStorage.setItem('dashboard-refresh-trigger', JSON.stringify({
            type: 'correct-answer',
            timestamp: Date.now(),
            subject: 'chemistry',
            questionId: question.question_id || `chemistry-${currentQuestion}`
          }));
          // Dispatch storage event for cross-tab communication
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'dashboard-refresh-trigger',
            newValue: JSON.stringify({
              type: 'correct-answer',
              timestamp: Date.now(),
              subject: 'chemistry',
              questionId: question.question_id || `chemistry-${currentQuestion}`
            })
          }));
        }
      }
    } catch (error) {
      console.error(" Failed to record attempt:", error);
    }
  };

    if (chapterQuestions.length === 0) {
      return (
        <div className="bg-[#15191E] min-h-screen text-white p-6">
          <Navbar />
          <div className="max-w-4xl mx-auto mt-16">
            <button
              onClick={() => navigate("/jeemains/chemistry")}
              className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              ← Back to Chemistry Chapters
            </button>
            <h1 className="text-3xl font-bold text-center">
              No questions found for chapter: {chapter?.replaceAll("-", " ")}
            </h1>
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <>
        <div className="bg-[#15191E] min-h-screen text-white p-6">
          <Navbar />
          <div className="max-w-4xl mx-auto mt-16">
            <button
              onClick={() => navigate("/jeemains/chemistry")}
              className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              ← Back to Chemistry Chapters
            </button>
            
            <h1 className="text-4xl font-bold text-center mb-8">
              {chapter?.replaceAll("-", " ").replace(/\b\w/g, (char) => char.toUpperCase())}
            </h1>

            <div className="mb-4 text-center">
              <p className="text-xl">Question {currentQuestion + 1} of {chapterQuestions.length}</p>
            </div>

            {/* Single Question Display */}
            <div className="bg-slate-800 p-6 rounded-lg mb-6">
              <div className="mb-4">
                <span className="text-blue-400 font-semibold">Question {currentQuestion + 1}</span>
                <div 
                  className="mt-2 text-lg"
                  dangerouslySetInnerHTML={{ __html: chapterQuestions[currentQuestion].question }}
                />
              </div>

              {chapterQuestions[currentQuestion].options && chapterQuestions[currentQuestion].options.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {chapterQuestions[currentQuestion].options.map((option, optIndex) => (
                    <div 
                      key={optIndex}
                      onClick={() => setSelectedAnswer(option.identifier)}
                      className={`p-3 rounded cursor-pointer transition ${
                        showAnswer
                          ? option.identifier === chapterQuestions[currentQuestion].correct_option
                            ? 'bg-green-600 text-white' 
                            : 'bg-slate-700 text-gray-300'
                          : selectedAnswer === option.identifier
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      <span className="font-semibold">{option.identifier}.</span> {option.content}
                    </div>
                  ))}
                </div>
              ) : (
                // Numerical answer input
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Answer (Numerical):
                  </label>
                  <input
                    type="number"
                    value={numericalAnswer}
                    onChange={(e) => setNumericalAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    className={`w-full px-4 py-3 rounded-lg bg-slate-700 text-white border-2 transition ${
                      showAnswer
                        ? numericalAnswer === chapterQuestions[currentQuestion].answer?.toString()
                          ? 'border-green-500 bg-green-900/30'
                          : 'border-red-500 bg-red-900/30'
                        : 'border-gray-600 focus:border-blue-500 focus:outline-none'
                    }`}
                    disabled={showAnswer}
                  />
                </div>
              )}

              {showAnswer && (
                <div className="text-sm text-gray-400 mt-4">
                  <p>Correct Answer: {
                    chapterQuestions[currentQuestion].question_type === 'integer' 
                      ? chapterQuestions[currentQuestion].answer 
                      : chapterQuestions[currentQuestion].correct_option
                  }</p>
                  {chapterQuestions[currentQuestion].explanation && (
                    <div className="mt-2">
                      <strong>Explanation:</strong>
                      <div dangerouslySetInnerHTML={{ __html: chapterQuestions[currentQuestion].explanation }} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => {
                  setCurrentQuestion(Math.max(0, currentQuestion - 1));
                  setSelectedAnswer(null);
                  setNumericalAnswer("");
                  setShowAnswer(false);
                  setAttemptRecorded(false); // Reset for new question
                }}
                disabled={currentQuestion === 0}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 rounded"
              >
                PREVIOUS
              </button>

              <button
                onClick={() => {
                  if (!showAnswer) {
                    // Check if answer is provided
                    const isNumerical = chapterQuestions[currentQuestion].question_type === 'integer';
                    const hasAnswer = isNumerical ? numericalAnswer.trim() !== '' : selectedAnswer;
                    
                    if (hasAnswer) {
                      // Record attempt when showing answer for the first time
                      const isCorrect = isNumerical 
                        ? numericalAnswer === chapterQuestions[currentQuestion].answer?.toString()
                        : selectedAnswer === chapterQuestions[currentQuestion].correct_option;
                      recordAttempt(isCorrect);
                    } else {
                      // Show alert if no answer is provided
                      alert(isNumerical ? 'Please enter a numerical answer' : 'Please select an option');
                      return;
                    }
                  }
                  setShowAnswer(!showAnswer);
                }}
                className="px-8 py-2 bg-green-600 hover:bg-green-700 rounded"
              >
                {showAnswer ? 'HIDE' : 'SUBMIT'}
              </button>

              <button
                onClick={() => {
                  setCurrentQuestion(Math.min(chapterQuestions.length - 1, currentQuestion + 1));
                  setSelectedAnswer(null);
                  setNumericalAnswer("");
                  setShowAnswer(false);
                  setAttemptRecorded(false); // Reset for new question
                }}
                disabled={currentQuestion === chapterQuestions.length - 1}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:opacity-50 rounded"
              >
                NEXT
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  // Show chapters list (no chapter parameter)
  const chapters = [
    ...new Set(chemistryQuestions.map((q) => q.chapter))
  ];

  console.log("Total questions:", Data.length);
  console.log("Chemistry questions:", chemistryQuestions.length);
  console.log("Chapters:", chapters);

  if (chapters.length === 0) {
    return (
      <div style={{ color: "white", padding: "40px" }}>
        No Chemistry chapters found
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#15191E] min-h-screen text-white p-6">
        <Navbar />
        <h1 className="text-4xl font-bold text-center mt-16">
          Chemistry Chapters
        </h1>

        <div className="max-w-xl mx-auto mt-10 space-y-4">
          {chapters.map((chapter) => (
            <button
              key={chapter}
              onClick={() =>
                navigate(`/jeemains/chemistry/${chapter}`)
              }
              className="
rounded-md text-lg sm:text-xl font-medium
h-12 sm:h-14 w-full max-w-4xl
bg-[#3BBAF4] hover:bg-blue-500 text-white
flex items-center justify-center transition p-3 mx-auto
"
            >
              {chapter.replaceAll("-", " ").replace(/\b\w/g, (char) => char.toUpperCase())}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
