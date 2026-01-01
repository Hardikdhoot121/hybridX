import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit2, Check, X, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const API_BASE = import.meta.env.VITE_API_BASE;

/* ================= AUTH HEADERS ================= */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout=()=>{
  localStorage.removeItem("token");
  navigate("/")
};

  /* ================= PROFILE ================= */
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({});
  const [loading, setLoading] = useState(true);

  /* ================= ANALYTICS ================= */
  const [weeklyStats, setWeeklyStats] = useState({
    totalSolved: 0,
    correct: 0,
    accuracy: 0,
    challengesTaken: 0,
  });

  const [weeklyGoal, setWeeklyGoal] = useState(15);
  const [goalInput, setGoalInput] = useState(15);
  const [showGoalModal, setShowGoalModal] = useState(false);

  /* ================= FETCH DASHBOARD ================= */
useEffect(() => {
  const loadDashboard = async () => {
    try {
      const profileRes = await fetch(
        `${API_BASE}/users/profile`,
        { headers: getAuthHeaders() }
      );
      const profileJson = await profileRes.json();

      setProfile(profileJson.user);
      setProfileDraft(profileJson.user);

      const statsRes = await fetch(
        `${API_BASE}/analytics/weekly`,
        { headers: getAuthHeaders() }
      );
      setWeeklyStats(await statsRes.json());

      const goalRes = await fetch(
        `${API_BASE}/analytics/weekly-goal`,
        { headers: getAuthHeaders() }
      );
      const goal = await goalRes.json();
      setWeeklyGoal(goal.target ?? 15);
      setGoalInput(goal.target ?? 15);

    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setLoading(false); // 🔑 VERY IMPORTANT
    }
  };

  loadDashboard();
}, []);

  /* ================= DERIVED ================= */
  const incorrect = weeklyStats.totalSolved - weeklyStats.correct;
  const glow = weeklyStats.correct >= weeklyGoal;

  /* ================= PROFILE SAVE ================= */
  const handleProfileSave = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(profileDraft),
      });
      const data = await res.json();
      setProfile(data.user);
      setProfileDraft(data.user);
      setEditProfile(false);
    } catch {
      alert("Profile update failed");
    }
  };
  
  /* ================= GOAL SAVE ================= */
  const handleSaveGoal = async () => {
await fetch(`${API_BASE}/analytics/weekly-goal`, {
  method: "POST",
  headers: getAuthHeaders(),
  body: JSON.stringify({ target: parseInt(goalInput) || 15 }),
});

    setWeeklyGoal(parseInt(goalInput) || 15);
    setShowGoalModal(false);
  };


  
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Loading dashboard...
    </div>
  );
}

if (!profile) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <div>Login to view dashboard...</div>
      <button
        className="bg-blue-500 mt-3 px-6 py-2 rounded"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>
  );
}

  

  /* ================= CIRCLE CALC ================= */
  const size = 220;
  const center = size / 2;
  const radius = 86;
  const stroke = 16;
  const circumference = 2 * Math.PI * radius;
  const progress =
    weeklyGoal > 0
      ? Math.min(weeklyStats.correct / weeklyGoal, 1)
      : 0;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#0b1020] text-white px-4 md:px-6 py-4">

      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center gap-2 text-gray-300 hover:text-white"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ================= LEFT ================= */}
        <div className="xl:col-span-2 space-y-6">

          {/* PROFILE */}
          <div className="rounded-xl bg-[#0e1628] p-6 border border-white/5">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Student Profile</h2>

              {!editProfile ? (
                <button
                  onClick={() => setEditProfile(true)}
                  className="pill-button small flex items-center gap-2"
                >
                  <Edit2 size={14} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleProfileSave}><Check /></button>
                  <button onClick={() => setEditProfile(false)}><X /></button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                ["name", "Full Name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["classLevel", "Class"],
                ["batch", "Batch"],
                ["targetYear", "Target Year"],
              ].map(([key, label]) => (
                <div key={key}>
                  <p className="text-sm text-gray-400 mb-1">{label}</p>
                  {editProfile ? (
                    <input
                      name={key}
                      value={profileDraft[key] || ""}
                      onChange={(e) =>
                        setProfileDraft({ ...profileDraft, [key]: e.target.value })
                      }
                      className="w-full bg-black/30 px-3 py-2 rounded"
                    />
                  ) : (
                    <p>{profile[key] || "Not set"}</p>
                  )}
                </div>
              ))}               
            </div>
            {/* ================= LOGOUT ================= */}
<div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
  <button
    onClick={handleLogout}
    className="
      flex items-center gap-2
      px-5 py-2
      rounded-lg
      bg-linear-to-r from-red-500/20 to-red-600/20
      text-red-400
      border border-red-500/30
      hover:from-red-500/30 hover:to-red-600/30
      hover:text-red-300
      hover:shadow-lg hover:shadow-red-500/20
      transition-all duration-200
      font-semibold
      active:scale-95
    "
  >
    🚪 Logout
  </button>
</div>


          </div>
          

          {/* ================= WEEKLY GOAL (CIRCULAR) ================= */}
          <div className="rounded-xl bg-[#0e1628] p-6 text-center">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">Weekly Goal</h3>
              <button
                onClick={() => setShowGoalModal(true)}
                className="pill-button small flex items-center"
              >
                <Pencil size={14} className="mr-2" />
                Edit
              </button>
            </div>

            <div className="relative flex justify-center mt-6">
              <svg width={size} height={size}>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <g transform={`rotate(-90 ${center} ${center})`}>
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={stroke}
                    fill="none"
                  />

                  <motion.circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#22C55E"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${progress * circumference} ${circumference}`}
                    filter={glow ? "url(#glow)" : "none"}
                    animate={{
                      opacity: glow ? [0.6, 1, 0.6] : 1,
                    }}
                    transition={{
                      duration: 2,
                      repeat: glow ? Infinity : 0,
                    }}
                  />
                </g>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold">
                  {weeklyStats.correct}
                  <span className="text-white/50"> / {weeklyGoal}</span>
                </div>
                <div className="text-xs tracking-widest text-white/50 mt-1">
                  CORRECT
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6 text-sm">
              <span className="text-green-400">✔ {weeklyStats.correct}</span>
              <span className="text-red-400">✖ {incorrect}</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="rounded-xl bg-[#0e1628] p-6">
          <h3 className="mb-4 font-semibold">Analytics </h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="stat-card"><span>{weeklyStats.totalSolved}</span><p>Questions</p></div>
            <div className="stat-card"><span>{weeklyStats.correct}</span><p>Correct</p></div>
            <div className="stat-card"><span>{weeklyStats.accuracy}%</span><p>Accuracy</p></div>
            <div className="stat-card"><span>{weeklyStats.challengesTaken}</span><p>Challenges</p></div>
          </div>
        </div>
      </div>
                    
      {/* GOAL MODAL */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0e1628] p-6 rounded-xl w-72">
            <h3 className="mb-3">Edit Weekly Goal</h3>
            <input
              type="number"
              min="1"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="w-full mb-4 px-3 py-2 rounded bg-black"
            />
            <button onClick={handleSaveGoal} className="pill-button w-full">
              Save
            </button>
          </div>
        </div>
      )}
      
    </div>
    
  );
};

export default Dashboard;
