import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ContactUs from "./pages/contactUs";
import Navbar from "./pages/navbar";
import PYQ from "./pages/pyq";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Mains from "./pages/Mains";
import Chemistry from "./pages/chemistrymains";
import Physics from "./pages/physicsmains";
import MainsPYQ from "./pages/MainsPYQ";
import Maths from "./pages/mathematicsmains";
import Dashboard from "./pages/dashboard";
import DppResult from "./pages/dppResult";
import Hybrid from "./pages/hybrid";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminAllDetails from "./admin/pages/AdminAllDetails";
import Attendance from "./admin/pages/Attendance";
import AttendanceCalendarPage from "./pages/attendance-calendar";
import Ncertplus from "./pages/ncert+";
import Notes from "./pages/notes";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  // Clear any auto-login on app load
  React.useEffect(() => {
    // Remove any auto-login data to ensure login page is first
    const autoLoginKeys = ['currentStudent', 'token'];
    autoLoginKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`Clearing auto-login data: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact_us" element={<ContactUs />} />
        <Route path="/pyq" element={<PYQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/navbar" element={<Navbar />} />

        <Route path="/hybrid" element={<Hybrid/>} />
        {/* Admin routes - directly accessible */}
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/admin/details/:id" element={<AdminAllDetails/>} />
        <Route path="/admin/attendance" element={<Attendance/>}/>
        
        {/* some protected routes jo bina login kai nhi khulengai */}
        <Route element={<ProtectedRoute/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance-calendar" element={<AttendanceCalendarPage />} />
        <Route path="/dpp/:id" element={<DppResult />} />
        </Route>

      </Routes>
    </>
  );
}
export default App;

