import express from "express";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Mark attendance for a student
router.post("/mark", protect, async (req, res) => {
  try {
    const { studentId, date, classLevel, status, remarks } = req.body;

    // Validate required fields
    if (!studentId || !date || !classLevel || !status) {
      return res.status(400).json({
        message: "Missing required fields: studentId, date, classLevel, status",
      });
    }

    // Check if student exists
    const student = await User.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Create or update attendance
    const attendance = await Attendance.findOneAndUpdate(
      {
        studentId,
        date: new Date(date).setHours(0, 0, 0, 0),
        classLevel,
      },
      {
        studentId,
        date: new Date(date).setHours(0, 0, 0, 0),
        classLevel,
        status,
        markedBy: req.user._id,
        remarks: remarks || "",
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Mark attendance for multiple students (bulk)
router.post("/mark-bulk", protect, async (req, res) => {
  try {
    const { date, classLevel, attendanceRecords } = req.body;

    if (!date || !classLevel || !attendanceRecords || !Array.isArray(attendanceRecords)) {
      return res.status(400).json({
        message: "Missing required fields: date, classLevel, attendanceRecords (array)",
      });
    }

    const results = [];
    const targetDate = new Date(date).setHours(0, 0, 0, 0);

    for (const record of attendanceRecords) {
      const { studentId, status, remarks } = record;

      // Check if student exists
      const student = await User.findOne({ studentId });
      if (!student) {
        results.push({ studentId, success: false, error: "Student not found" });
        continue;
      }

      try {
        const attendance = await Attendance.findOneAndUpdate(
          { studentId, date: targetDate, classLevel },
          {
            studentId,
            date: targetDate,
            classLevel,
            status,
            markedBy: req.user._id,
            remarks: remarks || "",
          },
          { upsert: true, new: true }
        );

        results.push({ studentId, success: true, attendance });
      } catch (error) {
        results.push({ studentId, success: false, error: error.message });
      }
    }

    res.json({
      message: "Bulk attendance processing completed",
      results,
      successCount: results.filter(r => r.success).length,
      failureCount: results.filter(r => !r.success).length,
    });
  } catch (error) {
    console.error("Error marking bulk attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get attendance for a specific date and class
router.get("/class/:date/:classLevel", protect, async (req, res) => {
  try {
    const { date, classLevel } = req.params;
    const targetDate = new Date(date).setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({
      date: targetDate,
      classLevel,
    }).populate('studentId', 'name email studentId classLevel batch');

    res.json(attendance);
  } catch (error) {
    console.error("Error getting class attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get attendance for a specific student
router.get("/student/:studentId", protect, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, classLevel } = req.query;

    let query = { studentId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (classLevel) {
      query.classLevel = classLevel;
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('markedBy', 'name email');

    res.json(attendance);
  } catch (error) {
    console.error("Error getting student attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get attendance statistics for a class
router.get("/stats/:date/:classLevel", protect, async (req, res) => {
  try {
    const { date, classLevel } = req.params;
    const targetDate = new Date(date).setHours(0, 0, 0, 0);

    const totalStudents = await User.countDocuments({ classLevel, role: "student" });
    
    const attendance = await Attendance.find({
      date: targetDate,
      classLevel,
    });

    const presentCount = attendance.filter(a => a.status === "present").length;
    const absentCount = attendance.filter(a => a.status === "absent").length;
    const lateCount = attendance.filter(a => a.status === "late").length;

    const percentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

    res.json({
      date,
      classLevel,
      totalStudents,
      presentCount,
      absentCount,
      lateCount,
      markedCount: attendance.length,
      unmarkedCount: totalStudents - attendance.length,
      percentage,
    });
  } catch (error) {
    console.error("Error getting attendance stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
