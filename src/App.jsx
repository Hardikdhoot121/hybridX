import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ContactUs from "./pages/contactUs";
import Navbar from "./pages/navbar";
import Test from "./pages/test";
import Leaderboard from "./pages/leaderboard";
import PYQ from "./pages/pyq"
import Login from "./pages/login";
import Signup from "./pages/signup";  
function App() {
  // react routing

  return (
  <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact_us" element={<ContactUs />} />
        <Route path="/test" element={<Test />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/pyq" element={<PYQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jeemains" element={<Mains />} />
        <Route path="/jeemains/chemistry" element={<Chemistry />} />
        <Route path="/jeemains/maths" element={<Maths />} />
        <Route path="/jeemains/physics" element={<Physics />} />
        <Route path="/jeemains/:subject/:chapter" element={<MainsPYQ />} />
        </Routes>

    </Router>
  </>
  );
}
export default App;
