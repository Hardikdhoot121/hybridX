import { useNavigate } from "react-router-dom";
import rawData from "../jee_mains_clean.json";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Maths() {
  const navigate = useNavigate();


  const Data = Array.isArray(rawData) ? rawData : rawData.default;

  const mathsQuestions = Data.filter(
    (q) => q.subject?.toLowerCase() === "maths"
  );

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
        maths Chapters
      </h1>

      <div className="max-w-xl mx-auto mt-10 space-y-4">
        {chapters.map((chapter) => (
          <button
            key={chapter}
            onClick={() =>
              navigate(`/jeemains/maths/${chapter}`)
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