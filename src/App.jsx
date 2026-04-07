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
import SingleQuestion from "./pages/MainsPYQ";
import Maths from "./pages/mathematicsmains";
import Dashboard from "./pages/dashboard";
import DppResult from "./pages/dppResult";
import Dpp from "./pages/Dpp";
import Hybrid from "./pages/hybrid";
import JeeAdv from "./pages/JeeAdv";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminAllDetails from "./admin/pages/AdminAllDetails";
import AdminAttendance from "./admin/pages/AdminAttendance";
import Ncertplus from "./pages/ncert+";
import Notes from "./pages/notes";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AttendanceCalendar from "./components/AttendanceCalendar";
import MainsPYQ from "./pages/MainsQuestions";
import ScrollToHash from "./pages/scrolltohash";
import AuthSuccess from "./pages/AuthSuccess";
import CompleteProfile from "./pages/CompleteProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";


function App() {
  return (
    <>
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
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/student/:_id" element={<AdminAllDetails />} />
        </Route>


        {/* some protected routes jo bina login kai nhi khulengai */}

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
    </>
  );
}
export default App;

