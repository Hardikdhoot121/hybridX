import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/students", async (req, res) => {
  const students = await User.find();
  res.json(students);
});

router.get("/student/:id", async (req, res) => {
  const student = await User.findById(req.params.id);
  res.json(student);
});

export default router;   // ✅ THIS LINE IS REQUIRED
