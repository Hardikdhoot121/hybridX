import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ContactUs from "./pages/contactUs";
import Navbar from "./pages/navbar";
import Test from "./pages/test";
import PYQ from "./pages/pyq";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Mains from "./pages/Mains";
import Chemistry from "./pages/chemistrymains";
import Physics from "./pages/physicsmains";
import MainsPYQ from "./pages/MainsPYQ";
import Maths from "./pages/mathematicsmains";
import Dashboard from "./pages/dashboard";
import Overview from "./pages/overview";
import DppResult from "./pages/dppResult";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact_us" element={<ContactUs />} />
        <Route path="/test" element={<Test />} />
        <Route path="/pyq" element={<PYQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jeemains" element={<Mains />} />
        <Route path="/jeemains/chemistry" element={<Chemistry />} />
        <Route path="/jeemains/maths" element={<Maths />} />
        <Route path="/jeemains/physics" element={<Physics />} />
        <Route path="/jeemainspyq/:subject/:chapter" element={<MainsPYQ />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/dpp/:id" element={<DppResult />} />
        <Route path="/navbar" element={<Navbar />} />
      </Routes>
    </>
  );
}
export default App;

