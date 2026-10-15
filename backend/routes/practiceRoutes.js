import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import PracticeAttempt from "../models/PracticeAttempt.js";
import redis from "../config/redis.js";

const router = express.Router();

router.post("/attempt", protect, async (req, res) => {
  try {
    const attempt = await PracticeAttempt.create({
      userId: req.user.id,
      ...req.body,
    });

    const weekStart = getWeekStart();
    const now = new Date();

    const attempts = await PracticeAttempt.find({
      userId: req.user.id,
      solvedAt: { $gte: weekStart, $lte: now },
    });


    const totalSolved = attempts.length;
    const correct = attempts.filter((a) => a.isCorrect).length;
    const accuracy = totalSolved
      ? Math.round((correct / totalSolved) * 100)
      : 0;

    const mcqAttempts = attempts.filter((a) => a.questionType === "mcq").length;
    const numericalAttempts = attempts.filter((a) => a.questionType === "integer").length;
    const mcqCorrect = attempts.filter((a) => a.questionType === "mcq" && a.isCorrect).length;
    const numericalCorrect = attempts.filter((a) => a.questionType === "integer" && a.isCorrect).length;

    res.status(201).json({
      success: true,
      message: "Practice attempt recorded",
      attempt: {
        questionId: req.body.questionId,
        subject: req.body.subject,
        topic: req.body.topic,
        questionType: req.body.questionType,
        userAnswer: req.body.userAnswer,
        correctAnswer: req.body.correctAnswer,
        isCorrect: req.body.isCorrect,
        solvedAt: attempt.solvedAt,
      },
      weeklyStats: {
        totalSolved,
        correct,
        accuracy,
        challengesTaken: totalSolved,
        mcqAttempts,
        numericalAttempts,
        mcqCorrect,
        numericalCorrect,
        mcqAccuracy: mcqAttempts ? Math.round((mcqCorrect / mcqAttempts) * 100) : 0,
        numericalAccuracy: numericalAttempts ? Math.round((numericalCorrect / numericalAttempts) * 100) : 0,
      },
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
