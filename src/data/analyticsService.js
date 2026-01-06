<<<<<<< HEAD
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
=======
const API_BASE = "https://hybridx-uhj9.onrender.com/api";
>>>>>>> 70bdd6067a8fd36f34a881c6cfb5c1d2ad2a6229

/**
 * ===============================
 * AUTH HEADER HELPER
 * ===============================
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No auth token found");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/**
 * ===============================
 * ANALYTICS
 * ===============================
 */

// Weekly analytics (attempts, accuracy, etc.)
export const fetchWeeklyStats = async () => {
  const res = await fetch(`${API_BASE}/analytics/weekly`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch weekly stats");
  }

  return res.json();
};

// Weekly goal (reusing daily-goal endpoint)
export const fetchDailyGoal = async () => {
  const res = await fetch(`${API_BASE}/analytics/daily-goal`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch daily / weekly goal");
  }

  return res.json();
};

// Update weekly goal (used by Edit Goal modal)
export const updateWeeklyGoal = async (target) => {
  const res = await fetch(`${API_BASE}/analytics/daily-goal`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ target }),
  });

  if (!res.ok) {
    throw new Error("Failed to update weekly goal");
  }

  return res.json();
};

/**
 * ===============================
 * USER PROFILE
 * ===============================
 */

// Fetch logged-in user's profile
export const fetchUserProfile = async () => {
  const res = await fetch(`${API_BASE}/users/profile`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return res.json();
};
