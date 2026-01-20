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

    const { name, email, password, phone, classLevel } = signupInfo;

    if (!name || !email || !password || !phone || !classLevel || !batch) {
      return handleError(
        "Fill all the required Field."
      );
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "https://hybridx-uhj9.onrender.com/api"}/auth/signup`,
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
