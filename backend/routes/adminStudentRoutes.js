import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/students", async (req, res) => {
  try {
    const students = await User.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
});

router.get("/student/:id", async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student", error: error.message });
  }
});

export default router;   // ✅ THIS LINE IS REQUIRED
