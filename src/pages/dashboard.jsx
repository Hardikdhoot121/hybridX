import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit2, Check, X, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/* ================= AUTH HEADERS ================= */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log('🔑 Getting auth headers, token exists:', !!token);
  console.log('🔑 Token value:', token ? token.substring(0, 50) + '...' : 'null');

  if (!token) {
    console.log('❌ No token found, user might need to login again');
    return null;
  }

  // Check if token is expired (simple check for JWT format)
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000;
      if (payload.exp && payload.exp < currentTime) {
        console.log('❌ Token expired, clearing and redirecting to login');
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentStudent");
        window.location.href = '/login';
        return null;
      }
    }
  } catch (error) {
    console.log('❌ Token validation error:', error);
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
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

  /* ================= FETCH DASHBOARD (PARALLEL) ================= */
  const fetchWeeklyStats = async () => {
    console.log('🔄 Fetching weekly stats...');
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const statsRes = await fetch(`${API_BASE}/analytics/weekly`, { headers });
      console.log('📡 Weekly stats API response status:', statsRes.status);

      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        console.log('✅ Weekly stats updated:', statsJson);
        console.log('📊 Previous weeklyStats:', weeklyStats);
        setWeeklyStats(statsJson);
        console.log('📊 New weeklyStats set:', statsJson);
      } else {
        console.error('❌ Failed to fetch weekly stats:', statsRes.status);
      }
    } catch (err) {
      console.log('❌ Failed to fetch weekly stats:', err);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      console.log('🚀 Starting dashboard load...');
      const headers = getAuthHeaders();
      console.log('📋 Headers for API calls:', headers);

      // Try to get student data from localStorage first
      const localStudent = localStorage.getItem("currentStudent");
      console.log('👤 Local student data exists:', !!localStudent);
      if (localStudent) {
        const student = JSON.parse(localStudent);
        console.log('👤 Using local student data:', student);
        setProfile(student);
        setProfileDraft(student);
        setLoading(false);
      }

      if (!headers) {
        console.log('❌ No headers available, skipping API calls');
        return;
      }

      try {
        console.log('📡 Making parallel API calls...');
        const [profileRes, statsRes, goalRes] = await Promise.all([
          fetch(`${API_BASE}/users/profile`, { headers }),
          fetch(`${API_BASE}/analytics/weekly`, { headers }),
          fetch(`${API_BASE}/analytics/weekly-goal`, { headers }),
        ]);

        console.log('📊 API Response Statuses:', {
          profile: profileRes.status,
          stats: statsRes.status,
          goal: goalRes.status
        });

        if (!profileRes.ok) throw new Error("Profile fetch failed");

        const profileJson = await profileRes.json();
        const statsJson = await statsRes.json();
        const goalJson = await goalRes.json();

        console.log('✅ API Responses received:', { profileJson, statsJson, goalJson });

        setProfile(profileJson.user);
        setProfileDraft(profileJson.user);
        setWeeklyStats(statsJson);
        setWeeklyGoal(goalJson.target ?? 15);
        setGoalInput(goalJson.target ?? 15);

      } catch (err) {
        console.log('❌ Dashboard load failed (using local data only):', err);
        // Don't show error to user since we have local data fallback
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* ================= WEEKLY STATS DEBUG ================= */
  useEffect(() => {
    console.log('📊 weeklyStats state changed:', weeklyStats);
    console.log('🎯 weeklyGoal state changed:', weeklyGoal);
  }, [weeklyStats, weeklyGoal]);

  /* ================= STORAGE EVENT LISTENER ================= */
  useEffect(() => {
    const handleStorageChange = (e) => {
      console.log('📡 Storage event detected:', e.key, e.newValue);

      if (e.key === 'dashboard-refresh-trigger') {
        console.log('📡 Dashboard refresh trigger received:', e.newValue);
        try {
          const data = JSON.parse(e.newValue);
          console.log('🔍 Parsed refresh trigger data:', data);

          if (data.type === 'correct-answer') {
            console.log('🎯 Correct answer detected, refreshing weekly stats...');
            console.log('📊 Stats from trigger:', data.weeklyStats);

            // Option 1: Use the stats from the trigger (immediate)
            if (data.weeklyStats) {
              console.log('⚡ Using immediate stats from trigger');
              console.log('🔄 Previous stats:', weeklyStats);
              console.log('📈 New stats:', data.weeklyStats);
              setWeeklyStats(data.weeklyStats);

              // Force a re-render by updating the state
              setTimeout(() => {
                console.log('🔄 Forced re-render with new stats');
              }, 100);
            }

            // Option 2: Fetch fresh stats from API (fallback/confirmation)
            setTimeout(() => {
              console.log('🔄 Fetching fresh stats from API as confirmation...');
              fetchWeeklyStats();
            }, 500);
          }
        } catch (err) {
          console.log('❌ Failed to parse refresh trigger:', err);
        }
      }
    };

    // Listen for storage events (cross-tab)
    window.addEventListener('storage', handleStorageChange);
    console.log('👂 Storage event listener attached');

    // Also check for direct localStorage changes (same tab)
    const checkLocalStorage = () => {
      const trigger = localStorage.getItem('dashboard-refresh-trigger');
      if (trigger) {
        console.log('🔍 Found trigger in localStorage:', trigger);
        handleStorageChange({ key: 'dashboard-refresh-trigger', newValue: trigger });
        // Clear the trigger after processing
        localStorage.removeItem('dashboard-refresh-trigger');
        console.log('🗑️ Trigger cleared from localStorage');
      }
    };

    const interval = setInterval(checkLocalStorage, 1000);
    console.log('⏰ Started localStorage polling interval');

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
      console.log('🔇 Storage event listener removed');
    };
  }, []);

  /* ================= DERIVED ================= */
  const INCORRECT = weeklyStats.totalSolved - weeklyStats.correct;
  const GLOW = weeklyStats.correct >= weeklyGoal;

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

  /* ================= STATES ================= */
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
        <div>Login to view dashboard</div>
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

  // Debug logging for wheel calculation
  console.log('🎯 Weekly Goal Wheel Debug:', {
    weeklyStats,
    weeklyGoal,
    correct: weeklyStats.correct,
    totalSolved: weeklyStats.totalSolved,
    accuracy: weeklyStats.accuracy,
    progress,
    progressPercentage: Math.round(progress * 100),
    circumference,
    strokeDasharray: `${progress * circumference} ${circumference}`
  });

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#0b1020] text-white px-4 md:px-6 py-4">

      <div className="flex justify-between mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <button
          onClick={() => navigate("/attendance-calendar")}
          className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all font-medium"
        >
          📅 Attendance
        </button>
      </div>

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

            {/* LOGOUT */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-medium"
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
                <Pencil size={14} className="mr-2" />
                Edit
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
                  />
                </g>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold">
                  {weeklyStats.correct}
                  <span className="text-white/50"> / {weeklyGoal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <div className="rounded-xl bg-[#0e1628] p-6">
            <h3 className="mb-4 font-semibold">Analytics</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="stat-card"><span>{weeklyStats.totalSolved}</span><p>Questions</p></div>
              <div className="stat-card"><span>{weeklyStats.correct}</span><p>Correct</p></div>
              <div className="stat-card"><span>{weeklyStats.accuracy}%</span><p>Accuracy</p></div>
              <div className="stat-card"><span>0</span><p>Challenges</p></div>
            </div>
          </div>

          {/* ATTENDANCE CALENDAR LINK */}
          <div className="bg-[#0e1628] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Attendance Calendar</h3>
              <button
                onClick={() => window.location.href = '/attendance-calendar'}
                className="px-4 py-2 bg-[#42BA96] hover:bg-green-600 text-white rounded-lg text-sm font-medium transition"
              >
                View Full Calendar
              </button>
            </div>
            <p className="text-gray-400 text-sm">Click to view your detailed attendance calendar</p>
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
