import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ContactUs from "./pages/contactUs";
import Navbar from "./pages/navbar";
import Test from "./pages/test";
import Leaderboard from "./pages/leaderboard";
import PYQ from "./pages/pyq"
function App() {
  // react routing

  return (<>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact_us" element={<ContactUs />} />
        <Route path="/test" element={<Test />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/pyq" element={<PYQ />} />
      </Routes>
    </Router>
  </>);
}
export default App;
