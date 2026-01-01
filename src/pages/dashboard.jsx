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

  /* ================= STATE ================= */
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [weeklyStats, setWeeklyStats] = useState({
    totalSolved: 0,
    correct: 0,
    accuracy: 0,
    challengesTaken: 0,
  });

  const [weeklyGoal, setWeeklyGoal] = useState(15);
  const [goalInput, setGoalInput] = useState(15);
  const [showGoalModal, setShowGoalModal] = useState(false);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ================= FETCH DASHBOARD ================= */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profileRes, statsRes, goalRes] = await Promise.all([
          fetch(`${API_BASE}/users/profile`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/analytics/weekly`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/analytics/weekly-goal`, {
            headers: getAuthHeaders(),
          }),
        ]);

        if (!profileRes.ok) throw new Error("Unauthorized");

        const profileJson = await profileRes.json();
        const stats = await statsRes.json();
        const goal = await goalRes.json();

        setProfile(profileJson.user);
        setProfileDraft(profileJson.user);
        setWeeklyStats(stats);
        setWeeklyGoal(goal.target ?? 15);
        setGoalInput(goal.target ?? 15);
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* ================= GUARDS ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-pulse text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <p className="mb-4">Session expired. Please login again.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    );
  }

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
                  <button onClick={handleProfileSave}>
                    <Check />
                  </button>
                  <button onClick={() => setEditProfile(false)}>
                    <X />
                  </button>
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
                      value={profileDraft[key] || ""}
                      onChange={(e) =>
                        setProfileDraft({
                          ...profileDraft,
                          [key]: e.target.value,
                        })
                      }
                      className="w-full bg-black/30 px-3 py-2 rounded"
                    />
                  ) : (
                    <p>{profile[key] || "Not set"}</p>
                  )}
                </div>
              ))}
            </div>

            {/* LOGOUT */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="px-5 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* WEEKLY GOAL */}
          <div className="rounded-xl bg-[#0e1628] p-6 text-center">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">Weekly Goal</h3>
              <button
                onClick={() => setShowGoalModal(true)}
                className="pill-button small flex items-center"
              >
                <Pencil size={14} className="mr-2" /> Edit
              </button>
            </div>

            <div className="relative flex justify-center mt-6">
              <svg width={size} height={size}>
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
                    fill="none"
                    strokeDasharray={`${progress * circumference} ${circumference}`}
                    animate={{ opacity: glow ? [0.6, 1, 0.6] : 1 }}
                    transition={{ duration: 2, repeat: glow ? Infinity : 0 }}
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0e1628] p-6 rounded-xl w-80">
            <h3 className="text-lg mb-4">Confirm Logout</h3>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
