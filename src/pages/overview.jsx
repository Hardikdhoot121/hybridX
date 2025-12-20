import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Search } from "lucide-react";

const Overview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const testInfo = location.state?.testData;

  const isMinorTest = testInfo?.name?.toLowerCase().includes("minor");

  const getTestData = () => {
    if (isMinorTest) {
      return {
        overallScore: {
          total: 52,
          max: 100,
          subjects: {
            physics: { score: 52, max: 100 },
          },
        },
        predictedPercentile: 85.5,
        percentileDisclaimer: "Prediction is done based on JEE Main 2025 (22 Jan Shift 2) data",
        questionsAttempted: {
          attempted: 25,
          total: 25,
        },
        accuracy: 80.0,
        positiveScore: {
          score: 52,
          max: 100,
        },
        marksLost: {
          lost: 0,
          max: 100,
        },
        timeTaken: {
          minutes: 90,
          unit: "mins",
        },
        topMarksObtained: {
          score: 78,
          max: 100,
        },
      };
    } else {
      return {
        overallScore: {
          total: 135,
          max: 300,
          subjects: {
            math: { score: 23, max: 100 },
            physics: { score: 52, max: 100 },
            chem: { score: 60, max: 100 },
          },
        },
        predictedPercentile: 95.29,
        percentileDisclaimer: "Prediction is done based on JEE Main 2025 (22 Jan Shift 2) data",
        questionsAttempted: {
          attempted: 45,
          total: 75,
        },
        accuracy: 80.0,
        positiveScore: {
          score: 144,
          max: 300,
        },
        marksLost: {
          lost: 9,
          max: 300,
        },
        timeTaken: {
          minutes: 176,
          unit: "mins",
        },
        topMarksObtained: {
          score: 178,
          max: 300,
        },
      };
    }
  };

  const testData = getTestData();

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-7xl mx-auto px-10 py-8">
        <button
          onClick={handleBack}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#2b3647] bg-[#0b1220] hover:bg-[#111827] transition"
        >
          <span className="text-xl">←</span>
        </button>

        <h1 className="text-3xl font-semibold mb-8">Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl bg-[#0b1220] border border-[#1f2937] p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <Trophy className="w-32 h-32 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold mb-4">Overall Score</h2>
            <div className="flex items-baseline mb-4">
              <span className="text-5xl font-bold text-blue-400">
                {testData.overallScore.total}
              </span>
              <span className="text-xl text-gray-400 ml-2">
                /{testData.overallScore.max}
              </span>
            </div>
            <div className="space-y-2">
              {isMinorTest ? (
                <div className="text-sm text-gray-300">
                  Physics Score: {testData.overallScore.subjects.physics.score}/
                  {testData.overallScore.subjects.physics.max}
                </div>
              ) : (
                <>
                  <div className="text-sm text-gray-300">
                    Math Score: {testData.overallScore.subjects.math.score}/
                    {testData.overallScore.subjects.math.max}
                  </div>
                  <div className="text-sm text-gray-300">
                    Physics Score: {testData.overallScore.subjects.physics.score}/
                    {testData.overallScore.subjects.physics.max}
                  </div>
                  <div className="text-sm text-gray-300">
                    Chem Score: {testData.overallScore.subjects.chem.score}/
                    {testData.overallScore.subjects.chem.max}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-[#0b1220] border border-[#1f2937] p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <Search className="w-32 h-32 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold mb-4">Predicted Percentile</h2>
            <div className="flex items-baseline mb-4">
              <span className="text-5xl font-bold text-emerald-400">
                {testData.predictedPercentile}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {testData.percentileDisclaimer}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="rounded-2xl bg-[#0b1220] border border-[#1f2937] p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">QS Attempted</h2>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-white">
                {testData.questionsAttempted.attempted}
              </span>
              <span className="text-xl text-gray-400 ml-2">
                /{testData.questionsAttempted.total}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0b1220] border border-[#1f2937] p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Accuracy</h2>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-white">
                {testData.accuracy.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0b1220] border border-[#1f2937] p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Positive Score</h2>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-white">
                {testData.positiveScore.score}
              </span>
              <span className="text-xl text-gray-400 ml-2">
                /{testData.positiveScore.max}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-[#0b1220] border border-[#1f2937] p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Marks Lost</h2>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-white">
                {testData.marksLost.lost}
              </span>
              <span className="text-xl text-gray-400 ml-2">
                /{testData.marksLost.max}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0b1220] border border-[#1f2937] p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Time Taken</h2>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-white">
                {testData.timeTaken.minutes}
              </span>
              <span className="text-xl text-gray-400 ml-2">
                {testData.timeTaken.unit}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0b1220] border border-[#1f2937] p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Top Marks Obtained</h2>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-white">
                {testData.topMarksObtained.score}
              </span>
              <span className="text-xl text-gray-400 ml-2">
                /{testData.topMarksObtained.max}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
