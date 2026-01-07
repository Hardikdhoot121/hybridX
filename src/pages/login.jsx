import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import students11th from '../admin/classData/11th_real';
import students12th from '../admin/classData/12th_real';

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
      // Authenticate with real student data
      const allStudents = [...students12th, ...students11th];
      const student = allStudents.find(s => s.email === email);
      
      if (student) {
        // For demo: accept password "password" or student's phone number
        if (password === 'password' || password === student.phone) {
          // Store student info in localStorage
          localStorage.setItem("currentStudent", JSON.stringify(student));
          localStorage.setItem("token", "student-token-" + student.id);
          
          console.log('Login successful:', { student, token: "student-token-" + student.id });
          
          handleSuccess(`Welcome back, ${student.name}!`);
          setTimeout(() => navigate("/dashboard"), 1000);
        } else {
          handleError("Invalid password. Try 'password' or your phone number.");
        }
      } else {
        handleError("Student not found. Please check your email.");
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
            Don’t have an account?{" "}
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
