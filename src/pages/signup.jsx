import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Signup() {
  const [signupInfo, setsignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;

    setsignupInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log("signupInfo ->", signupInfo);
  const handleSignup = async (e) => {
  e.preventDefault();

  const { name, email, password } = signupInfo;
  if (!name || !email || !password) {
    return handleError("name, email and password are required");
  }

  try {
    const url = "http://localhost:8080/auth/signup";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupInfo),
    });

    const result = await response.json();
    const { success, message, error } = result;

    if (success) {
      handleSuccess(message);
      setTimeout(() => navigate("/login"), 1000);
    } else if (error) {
      const details = error?.details?.[0]?.message || message;
      handleError(details);
      
    } else if (!success) {
        handleError(message);
    }
  } catch (err) {
    handleError(err.message || "Something went wrong");
  }
};

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-lg" onSubmit={handleSignup}>
          <h1 className="text-2xl font-bold text-white mb-6">Sign Up</h1>

          {/* Name */}
          <label className="text-white">Name</label>
          <input
            name="name"                 // ✅ IMPORTANT
            value={signupInfo.name}      // ✅ controlled input
            onChange={handleChange}
            type="text"
            placeholder="Name"
            className="w-full mb-4 px-4 py-3 rounded bg-slate-700 text-white"
          />

          {/* Email */}
          <label className="text-white">Email</label>
          <input
            name="email"                // ✅ IMPORTANT
            value={signupInfo.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-3 rounded bg-slate-700 text-white"
          />

          {/* Password */}
          <label className="text-white">Password</label>
          <input
            name="password"             // ✅ IMPORTANT
            value={signupInfo.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-3 rounded bg-slate-700 text-white"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold"
          >
            Sign Up
          </button>
          <span>Already have an account ?
            <Link to="/login">Login</Link>
          </span>
        </form>
      </div>

      <ToastContainer />
    </>
  );
}

export default Signup;
