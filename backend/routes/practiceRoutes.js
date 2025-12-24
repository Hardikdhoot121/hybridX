import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import PracticeAttempt from "../models/PracticeAttempt.js";

const router = express.Router();

// mark question as solved
router.post("/attempt", protect, async (req, res) => {
     console.log("Incoming practice attempt:", req.body);
     console.log("User from JWT:", req.user.id);
     console.log("Saving attempt:", req.body);

    try {
    const attempt = await PracticeAttempt.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Practice attempt recorded",
      attempt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to record attempt",
      error: error.message,
    });
  }
});

export default router;
