import express from "express";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import PracticeAttempt from "../models/PracticeAttempt.js";
import WeeklyGoal from "../models/WeeklyGoal.js";
import { getWeekStart } from "../utils/getWeekStart.js";

const router = express.Router();

router.get("/students", async (req, res) => {
  const students = await User.find().select("-password");
  res.json(students);
});

router.get("/student/:id", async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 1. Stream (derived from stream field or batch)
    const stream = student.stream || (student.batch === "Batch 1" ? "JEE" : student.batch === "Batch 2" ? "NEET" : "JEE");

    // 2. Real Attendance Percentage from MongoDB Attendance Collection
    const attendanceRecords = await Attendance.find({
      classLevel: student.classLevel,
      "studentRecords.studentId": student._id,
    });

    let totalDays = 0;
    let presentDays = 0;

    attendanceRecords.forEach((record) => {
      const sr = record.studentRecords.find(
        (rec) => rec.studentId.toString() === student._id.toString()
      );
      if (sr) {
        totalDays++;
        if (sr.isPresent) presentDays++;
      }
    });

    const attendancePercentage = totalDays > 0 ? `${Math.round((presentDays / totalDays) * 100)}%` : "0%";

    // 3. Weekly Questions Attempted vs Goal
    const weekStart = getWeekStart();
    const now = new Date();

    const attempts = await PracticeAttempt.find({
      userId: student._id,
      solvedAt: { $gte: weekStart, $lte: now },
    });

    const totalSolved = attempts.length;

    const goalDoc = await WeeklyGoal.findOne({ userId: student._id, weekStart });
    const targetGoal = goalDoc ? goalDoc.target : 30;

    res.json({
      ...student.toObject(),
      stream,
      attendancePercentage,
      weeklyQuestions: `${totalSolved} / ${targetGoal}`,
      totalSolved,
      targetGoal
    });
  } catch (error) {
    console.error("Error fetching admin student detail:", error);
    res.status(500).json({ message: "Server error fetching student details" });
  }
});

export default router;   
