import { useNavigate } from "react-router-dom";
import rawData from "../jee_mains_clean.json";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Maths() {
  const navigate = useNavigate();

<<<<<<< HEAD
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://hybridx-uhj9.onrender.com/api";

  const recordAttempt = async (isCorrect) => {
    if (attemptRecorded) {
      console.log('⚠️ Attempt already recorded for this question');
      return; // Prevent duplicate recording
    }

    console.log('🎯 Recording attempt:', { isCorrect, questionIndex: currentQuestion });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('❌ No token found in localStorage');
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const question = chapterQuestions[currentQuestion];
      const isNumerical = question.question_type === 'integer';
      const userAns = isNumerical ? numericalAnswer : selectedAnswer;
      const correctAns = isNumerical ? question.answer : question.correct_option;
      
      console.log('📋 Question data:', {
        questionId: question.question_id || `maths-${currentQuestion}`,
        subject: "maths",
        topic: question.topic || chapter,
        isCorrect,
        questionType: question.question_type,
        userAnswer: userAns,
        correctAnswer: correctAns
      });
      
      const response = await fetch(`${API_BASE}/analytics/practice-attempt`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          questionId: question.question_id || `maths-${currentQuestion}`,
          subject: "maths",
          topic: question.topic || chapter,
          difficulty: "Medium",
          isCorrect,
          questionType: question.question_type || "mcq",
          userAnswer: userAns,
          correctAnswer: correctAns,
        }),
      });

      console.log('📡 API Response Status:', response.status);
      console.log('📡 API Response OK:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Practice attempt recorded:", data);
        setAttemptRecorded(true);
        
        // Show success feedback
        if (isCorrect) {
          console.log("🎉 Correct answer! Weekly goal updated.");
          console.log("📊 Weekly stats from API:", data.weeklyStats);
          
          // Trigger dashboard refresh event
          const refreshEvent = {
            type: 'correct-answer',
            timestamp: Date.now(),
            subject: 'maths',
            questionId: question.question_id || `maths-${currentQuestion}`,
            weeklyStats: data.weeklyStats
          };
          
          console.log("🔄 Triggering dashboard refresh with event:", refreshEvent);
          
          localStorage.setItem('dashboard-refresh-trigger', JSON.stringify(refreshEvent));
          // Dispatch storage event for cross-tab communication
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'dashboard-refresh-trigger',
            newValue: JSON.stringify(refreshEvent)
          }));
          
          console.log("✅ Dashboard refresh event dispatched");
        }
      } else {
        const errorData = await response.json();
        console.error("❌ API Error:", response.status, errorData);
      }
    } catch (error) {
      console.error("❌ Failed to record attempt:", error);
    }
  };
=======
>>>>>>> dedec8d5ef9aa51c952304fe6e2ca621daff864d

  const Data = Array.isArray(rawData) ? rawData : rawData.default;

  const mathsQuestions = Data.filter(
    (q) => q.subject?.toLowerCase() === "maths"
  );
  const chapterQuestions = chapter
  ? mathsQuestions.filter((q) => q.chapter === chapter)
  : [];

  const chapters = [
    ...new Set(mathsQuestions.map((q) => q.chapter))
  ];

  console.log("Total questions:", Data.length);
  console.log("maths questions:", mathsQuestions.length);
  console.log("Chapters:", chapters);

  if (chapters.length === 0) {
    return (
      <div style={{ color: "white", padding: "40px" }}>
        No maths chapters found
      </div>
    );
  }

  return (

    <>
    
    <div className="bg-[#15191E] min-h-screen text-white p-6">
        <Navbar />
      <h1 className="text-4xl font-bold text-center mt-16">
        Maths Chapters
      </h1>

      <div className="max-w-xl mx-auto mt-10 space-y-4">
        {chapters.map((chapter) => (
          <button
            key={chapter}
            onClick={() =>
              navigate(`/jeemains/maths/${chapter}`)
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
