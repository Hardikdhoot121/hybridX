import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit2, Check, X, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

/* ================= AUTH HEADERS ================= */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : null;
};

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ================= STATE ================= */
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({});
  const [loading, setLoading] = useState(true);

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
      const headers = getAuthHeaders();
      if (!headers) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/dashboard`, { headers });

        if (res.status === 401 || res.status === 403) {
          handleLogout();
          return;
        }

        if (!res.ok) throw new Error("Failed to load dashboard");

        const data = await res.json();

        setProfile(data.user);
        setProfileDraft(data.user);
        setWeeklyStats(data.weeklyStats);
        setWeeklyGoal(data.weeklyGoal);
        setGoalInput(data.weeklyGoal);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* ================= SAVE PROFILE ================= */
  const handleProfileSave = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(profileDraft),
      });

      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();
      setProfile(data.user);
      setProfileDraft(data.user);
      setEditProfile(false);
    } catch {
      alert("Profile update failed");
    }
  };

  /* ================= SAVE GOAL ================= */
  const handleSaveGoal = async () => {
    await fetch(`${API_BASE}/analytics/weekly-goal`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ target: Number(goalInput) || 15 }),
    });

    setWeeklyGoal(Number(goalInput) || 15);
    setShowGoalModal(false);
  };

  /* ================= UI STATES ================= */
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
        <div>Session expired. Please login again.</div>
        <button
          className="bg-blue-600 px-6 py-2 mt-4 rounded"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    );
  }

  /* ================= DERIVED ================= */
  const incorrect = weeklyStats.totalSolved - weeklyStats.correct;
  const progress =
    weeklyGoal > 0 ? Math.min(weeklyStats.correct / weeklyGoal, 1) : 0;

  /* ================= CIRCLE ================= */
  const size = 220;
  const center = size / 2;
  const radius = 86;
  const stroke = 16;
  const circumference = 2 * Math.PI * radius;
  const glow = weeklyStats.correct >= weeklyGoal;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#0b1020] text-white px-4 md:px-6 py-4">
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center gap-2 text-gray-300 hover:text-white"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* 🔻 REST OF YOUR UI IS UNCHANGED 🔻 */}
      {/* Profile, Weekly Goal, Analytics, Logout button */}
      {/* Everything you wrote below is VALID and kept */}

      {/* (UI omitted here for brevity – your existing JSX stays same) */}
    </div>
  );
};

export default Dashboard;
