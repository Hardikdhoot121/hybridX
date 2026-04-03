import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    classLevel: "",
    batch: "",
    targetYear: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSignupInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, password, phone, classLevel, batch } = signupInfo;

    if (!name || !email || !password || !phone || !classLevel || !batch) {
      return handleError(
        "Fill all the required Field."
      );
    }

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      
      const response = await fetch(
        `${API_BASE}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signupInfo),
        }
      );

      const result = await response.json();

      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        handleError(result.message || "Signup failed");
      }
    } catch (err) {
      handleError(err.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form
          className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-lg"
          onSubmit={handleSignup}
        >
          <h1 className="text-2xl font-bold text-white mb-6">Sign Up</h1>

          <label className="text-white">Name</label>
          <input
            name="name"
            value={signupInfo.name}
            onChange={handleChange}
            type="text"
            className="w-full mb-4 px-4 py-3 rounded bg-slate-700 text-white"
          />

          <label className="text-white">Email</label>
          <input
            name="email"
            value={signupInfo.email}
            onChange={handleChange}
            type="email"
            className="w-full mb-4 px-4 py-3 rounded bg-slate-700 text-white"
          />

          <label className="text-white">Phone Number</label>
          <input
            name="phone"
            value={signupInfo.phone}
            onChange={handleChange}
            type="text"
            className="w-full mb-4 px-4 py-3 rounded bg-slate-700 text-white"
          />

          <label className="text-white">Class</label>
          <select
            name="classLevel"
            value={signupInfo.classLevel}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded bg-slate-700 text-white"
          >
            <option value="">Select Class</option>
            <option value="11th">11th</option>
            <option value="12th">12th</option>
            <option value="Dropper">Dropper</option>
          </select>

          <label className="text-white">Stream</label>
          <select
            name="batch"
            value={signupInfo.batch}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded bg-slate-700 text-white"
          >
            <option value="">Select Stream</option>
            <option value="Batch 1">Engineering</option>
            <option value="Batch 2">Medical</option>
          </select>

          <label className="text-white">Target Year (optional)</label>
          <input
            name="targetYear"
            value={signupInfo.targetYear}
            onChange={handleChange}
            type="number"
            className="w-full mb-4 px-4 py-3 rounded bg-slate-700 text-white"
          />

          <label className="text-white">Password</label>
          <input
            name="password"
            value={signupInfo.password}
            onChange={handleChange}
            type="password"
            className="w-full mb-6 px-4 py-3 rounded bg-slate-700 text-white"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold"
          >
            Sign Up
          </button>

          {/* ── Google OAuth ── */}
          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-slate-600" />
            <span className="text-slate-400 text-sm">or</span>
            <hr className="flex-1 border-slate-600" />
          </div>

          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
            className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.1-6.1C34.36 3.07 29.45 1 24 1 14.82 1 7.07 6.48 3.72 14.22l7.13 5.54C12.5 13.59 17.8 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v8.98h12.7c-.55 2.9-2.2 5.36-4.68 7.02l7.18 5.58C43.17 37.27 46.52 31.38 46.52 24.5z"/>
              <path fill="#FBBC05" d="M10.85 28.24A14.6 14.6 0 0 1 9.5 24c0-1.48.25-2.91.69-4.24l-7.13-5.54A23.93 23.93 0 0 0 0 24c0 3.87.93 7.53 2.57 10.76l8.28-6.52z"/>
              <path fill="#34A853" d="M24 47c5.45 0 10.02-1.8 13.36-4.9l-7.18-5.58c-1.8 1.21-4.1 1.93-6.18 1.93-6.2 0-11.5-4.09-13.15-9.6l-8.28 6.52C7.07 41.52 14.82 47 24 47z"/>
            </svg>
            Continue with Google
          </a>

          <p className="text-white mt-4 text-sm">
            Already have an account?{" "}
            <Link className="text-blue-400" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>

      <ToastContainer />
    </>
  );
}

export default Signup;
