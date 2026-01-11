import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log("loginInfo ->", loginInfo);

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("email and password are required");
    }

    try {
      // Use backend API for authentication
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        // Store JWT token and user info in localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("currentStudent", JSON.stringify(result.user)); // Add this for dashboard compatibility
        
        console.log('Login successful:', { user: result.user, token: result.token });
        
        // Dispatch student login event to notify attendance components
        window.dispatchEvent(new CustomEvent('studentLoggedIn', {
          detail: { student: result.user }
        }));
        
        handleSuccess(`Welcome back, ${result.user.name}!`);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        handleError(result.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      handleError("Login failed. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form
          className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-lg"
          onSubmit={handleLogin}
        >
          <h1 className="text-2xl font-bold text-white mb-6">Login</h1>

          <label className="text-white">Email</label>
          <input
            name="email"
            value={loginInfo.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-3 rounded bg-slate-700 text-white"
          />

          <label className="text-white">Password</label>
          <input
            name="password"
            value={loginInfo.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-3 rounded bg-slate-700 text-white"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold"
          >
            Login
          </button>

          <p className="text-slate-400 mt-4 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Signup
            </Link>
          </p>
        </form>
      </div>

      <ToastContainer />
    </>
  );
}

export default Login;
