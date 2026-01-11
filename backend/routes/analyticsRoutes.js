import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getWeeklyAnalytics,
  getWeeklyGoal,
  setWeeklyGoal,
  recordPracticeAttempt,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/weekly", protect, getWeeklyAnalytics);
router.get("/weekly-goal", protect, getWeeklyGoal);
router.post("/weekly-goal", protect, setWeeklyGoal);
router.post("/practice-attempt", protect, recordPracticeAttempt);

export default router;
