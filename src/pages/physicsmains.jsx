import { useNavigate } from "react-router-dom";
import rawData from "../jee_mains_clean.json";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Physics() {
  const navigate = useNavigate();


  const Data = Array.isArray(rawData) ? rawData : rawData.default;

  // 🔍 FILTER physics QUESTIONS
  const physicsQuestions = Data.filter(
    (q) => q.subject?.toLowerCase() === "physics"
  );

  // 🧠 GET UNIQUE CHAPTERS
  const chapters = [
    ...new Set(physicsQuestions.map((q) => q.chapter))
  ];

  // 🪵 DEBUG (IMPORTANT — CHECK CONSOLE)
  console.log("Total questions:", Data.length);
  console.log("physics questions:", physicsQuestions.length);
  console.log("Chapters:", chapters);

  if (chapters.length === 0) {
    return (
      <div style={{ color: "white", padding: "40px" }}>
        No physics chapters found
      </div>
    );
  }

  return (

    <>
    
    <div className="bg-[#15191E] min-h-screen text-white p-6">
        <Navbar />
      <h1 className="text-4xl font-bold text-center mt-16">
        physics Chapters
      </h1>

      <div className="max-w-xl mx-auto mt-10 space-y-4">
        {chapters.map((chapter) => (
          <button
            key={chapter}
            onClick={() =>
              navigate(`/jeemains/physics/${chapter}`)
            }
            className="w-full bg-[#272E36] py-4 px-6 rounded-lg
                       text-left hover:bg-[#323a44] transition"
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

