import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * ATTENDANCE ROUTES (Protected)
 * /api/attendance/...
 */

// Get attendance data
router.get("/", protect, (req, res) => {
  res.json({
    message: "Attendance routes working",
    user: req.user
  });
});

export default router;
