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
import AdminProtectedRoute from "./AdminProtectedRoute";

function App() {
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
        <Route path="/dpp" element={<DppResult />} />
        <Route path="/dpp/:id" element={<DppResult />} />
        
        {/* JEE/NEET Mains routes */}
        <Route path="/jeemains" element={<Mains />} />
        <Route path="/jeemains/chemistry" element={<Chemistry />} />
        <Route path="/jeemains/chemistry/:chapter" element={<Chemistry />} />
        <Route path="/jeemains/physics" element={<Physics />} />
        <Route path="/jeemains/physics/:chapter" element={<Physics />} />
        <Route path="/jeemains/maths" element={<Maths />} />
        <Route path="/jeemains/maths/:chapter" element={<Maths />} />
        <Route path="/jeemains/pyq" element={<MainsPYQ />} />
        
        {/* Study material routes */}
        <Route path="/ncert-plus" element={<Ncertplus />} />
        <Route path="/notes" element={<Notes />} />
        </Route>

      </Routes>
    </>
  );
}
export default App;

