import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import Data from "../jee_mains_clean.json";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Navbar from "./navbar";
import Footer from "./footer";

function MainsPYQ() {
  const { subject, chapter } = useParams();

  const [data, setData] = useState([]);
  const [currIndex, setcurrIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const cleanHTML = (html) => {
  if (!html) return html;

  return html
    .replace(/style\s*=\s*["'][^"']*["']/gi, "")
    .replace(/align\s*=\s*["']?(right|left|center)["']?/gi, "")
    .replace(/<\/?table[^>]*>/gi, " ")
    .replace(/<\/?tr[^>]*>/gi, " ")
    .replace(/<\/?td[^>]*>/gi, " ")
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/<div>\s*<\/div>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

  const renderQuestion = (text) => {
    if (!text) return null;

    const parts = text.split("$$");

    return parts.map((part, index) =>
      index % 2 === 0 ? (
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: part }}
        />
      ) : (
        <BlockMath key={index} math={part} />
      )
    );
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

  useEffect(() => {
    const filtered = Data.filter((q) => {
      if (!q.subject || !q.chapter) return false;

      return (
        q.subject.toLowerCase().trim() === subject.toLowerCase() &&
        q.chapter.toLowerCase().trim() === chapter.toLowerCase()
      );
    });

    console.log("Matched questions:", filtered.length);

    setData(filtered);
    setcurrIndex(0);
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

  const prev = () => setcurrIndex((p) => Math.max(p - 1, 0));
  const next = () => setcurrIndex((p) => Math.min(p + 1, data.length - 1));
  const sub = () => setShowResult(true);

  const formatChapterTitle = (slug) =>
    slug.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <div className="bg-[#15191E] text-white w-full min-h-screen">
        <Navbar />

        <div className="flex justify-center text-center font-bold">
          <p className="mt-10">
            JEE MAINS — {formatChapterTitle(chapter)}
          </p>
        </div>

        <div className="bg-[#272E36] rounded-xl p-6 m-5 mx-auto w-[70%] mt-10">
          <div className="flex justify-between font-medium opacity-75">
            <p>Question {currIndex + 1}</p>
            <p>{subject.toUpperCase()}</p>
          </div>

          <div className="font-bold mt-5 leading-7">
            {renderQuestion(
              fixLatex(cleanHTML(currVal.question))
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-[70%] mx-auto">
          {currOptions.map((opt, i) => {
            let border = "border";
            let bg = "bg-[#272E36]";

            if (showResult) {
              if (i === currVal.correct_option_index) {
                border = "border-2 border-green-500";
                bg = "bg-green-800";
              } else if (i === selectedOption) {
                border = "border-2 border-red-500";
                bg = "bg-red-800";
              }
            } else if (i === selectedOption) {
              border = "border-2 border-[#3DBBF4]";
            }

            return (
              <button
                key={i}
                onClick={() => setSelectedOption(i)}
                className={`${border} ${bg} rounded-xl p-6 min-h-20`}
              >
                {renderQuestion(
                  fixLatex(cleanHTML(opt.content))
                )}
              </button>
            );
          })}
        </div>

        <div className="h-60 bg-[#15191E]" />

        <div className="fixed bottom-0 left-0 right-0 bg-[#15191E] py-5">
          <div className="mx-auto w-[70%] flex justify-around">
            <button
              className="border border-white px-12 py-4 rounded-lg font-semibold"
              disabled={currIndex === 0}
              onClick={prev}
            >
              PREVIOUS
            </button>

            <button
              className="bg-[#3DBBF4] px-20 py-4 rounded-lg font-bold"
              onClick={sub}
            >
              SUBMIT
            </button>

            <button
              className="border border-white px-12 py-4 rounded-lg font-semibold"
              disabled={currIndex === data.length - 1}
              onClick={next}
            >
              NEXT
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MainsPYQ;
