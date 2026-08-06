import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import {
  saveAttendance,
  getAttendance,
  getStudentAttendance,
  getAttendanceStats
} from "../controllers/attendanceController.js";

const router = express.Router();

/**
 * Base: /api/attendance
 * Admin Routes  → protect + authorize("admin")
 * Student Route → protect only (student reads own data)
 */
// POST /api/attendance/save=> for particular date {admin ki marzi}
router.post("/save", protect, authorize("admin"), saveAttendance);

// GET /api/attendance=> admin gets attendance sheet , {basic dashboard layout }
router.get("/", protect, authorize("admin"), getAttendance);

// GET /api/attendance/stats=> admin fetches class stats
router.get("/stats", protect, authorize("admin"), getAttendanceStats);

// GET /api/attendance/student=> this is not admin specific route , {student ka calender fetch karnai kai liye , student route}
router.get("/student", protect, getStudentAttendance);

export default router;
