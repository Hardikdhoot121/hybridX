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
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
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

        // Role-based redirect
        const redirectPath = result.user.role === "admin" ? "/admin" : "/dashboard";
        console.log(`Redirecting ${result.user.role} to ${redirectPath}`);
        setTimeout(() => navigate(redirectPath), 1000);
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
            {/* Google g logo configuraitons */}
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.1-6.1C34.36 3.07 29.45 1 24 1 14.82 1 7.07 6.48 3.72 14.22l7.13 5.54C12.5 13.59 17.8 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v8.98h12.7c-.55 2.9-2.2 5.36-4.68 7.02l7.18 5.58C43.17 37.27 46.52 31.38 46.52 24.5z" />
              <path fill="#FBBC05" d="M10.85 28.24A14.6 14.6 0 0 1 9.5 24c0-1.48.25-2.91.69-4.24l-7.13-5.54A23.93 23.93 0 0 0 0 24c0 3.87.93 7.53 2.57 10.76l8.28-6.52z" />
              <path fill="#34A853" d="M24 47c5.45 0 10.02-1.8 13.36-4.9l-7.18-5.58c-1.8 1.21-4.1 1.93-6.18 1.93-6.2 0-11.5-4.09-13.15-9.6l-8.28 6.52C7.07 41.52 14.82 47 24 47z" />
            </svg>
            Continue with Google
          </a>

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
