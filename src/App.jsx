import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Eagerly loaded critical landing & auth routes for immediate render
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import AuthSuccess from "./pages/AuthSuccess";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";

// Lazy Loaded Pages & Features (Code Splitting for Production Performance)
const ContactUs = lazy(() => import("./pages/contactUs"));
const Navbar = lazy(() => import("./pages/navbar"));
const PYQ = lazy(() => import("./pages/pyq"));
const Mains = lazy(() => import("./pages/Mains"));
const Chemistry = lazy(() => import("./pages/chemistrymains"));
const Physics = lazy(() => import("./pages/physicsmains"));
const SingleQuestion = lazy(() => import("./pages/MainsPYQ"));
const Maths = lazy(() => import("./pages/mathematicsmains"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const DppResult = lazy(() => import("./pages/dppResult"));
const Dpp = lazy(() => import("./pages/Dpp"));
const Hybrid = lazy(() => import("./pages/hybrid"));
const JeeAdv = lazy(() => import("./pages/JeeAdv"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminAllDetails = lazy(() => import("./admin/pages/AdminAllDetails"));
const Attendance = lazy(() => import("./admin/pages/Attendance"));
const Ncertplus = lazy(() => import("./pages/ncert+"));
const Notes = lazy(() => import("./pages/notes"));
const AttendanceCalendar = lazy(() => import("./components/AttendanceCalendar"));
const MainsPYQ = lazy(() => import("./pages/MainsQuestions"));
const CompleteProfile = lazy(() => import("./pages/CompleteProfile"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

// Production Fallback Loader
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#15191e]">
    <div className="w-10 h-10 border-4 border-[#42BA96] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/contact_us" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/pyq" element={<PYQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/hybrid" element={<Hybrid />} />

        {/* Admin-only routes - protected by AdminProtectedRoute */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/attendance" element={<Attendance />} />
          <Route path="/admin/student/:_id" element={<AdminAllDetails />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/ncert+" element={<Ncertplus />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/jeemains" element={<Mains />} />
          <Route path="/jeemains/chemistry" element={<Chemistry />} />
          <Route path="/jeemains/maths" element={<Maths />} />
          <Route path="/jeemains/physics" element={<Physics />} />
          <Route path="/jeemains/:subject/:chapter/:questionId" element={<SingleQuestion />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance-calendar" element={<AttendanceCalendar />} />
          <Route path="/dpp" element={<Dpp />} />
          <Route path="/dpp/:id" element={<DppResult />} />
          <Route path="/jeeadv" element={<JeeAdv />} />
          <Route path="/jeemains/:subject/:chapter" element={<MainsPYQ />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
