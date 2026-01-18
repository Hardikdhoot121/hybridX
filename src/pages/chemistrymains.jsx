import { useNavigate } from "react-router-dom";
import rawData from "../jee_mains_clean.json";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Chemistry() {
  const navigate = useNavigate();


  const Data = Array.isArray(rawData) ? rawData : rawData.default;

  const chemistryQuestions = Data.filter(
    (q) => q.subject?.toLowerCase() === "chemistry"
  );

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
