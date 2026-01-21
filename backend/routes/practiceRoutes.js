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

    console.log("📊 Practice attempt recorded with details:", {
      userId: req.user.id,
      questionId: req.body.questionId,
      subject: req.body.subject,
      topic: req.body.topic,
      questionType: req.body.questionType,
      userAnswer: req.body.userAnswer,
      correctAnswer: req.body.correctAnswer,
      isCorrect: req.body.isCorrect
    });

    // Get updated weekly analytics
    const { getWeekStart } = await import("../utils/getWeekStart.js");
    const weekStart = getWeekStart();
    const now = new Date();

    const attempts = await PracticeAttempt.find({
      userId: req.user.id,
      solvedAt: { $gte: weekStart, $lte: now },
    });

    const totalSolved = attempts.length;
    const correct = attempts.filter(a => a.isCorrect).length;
    const accuracy = totalSolved
      ? Math.round((correct / totalSolved) * 100)
      : 0;

    // Additional analytics for question types
    const mcqAttempts = attempts.filter(a => a.questionType === 'mcq').length;
    const numericalAttempts = attempts.filter(a => a.questionType === 'integer').length;
    const mcqCorrect = attempts.filter(a => a.questionType === 'mcq' && a.isCorrect).length;
    const numericalCorrect = attempts.filter(a => a.questionType === 'integer' && a.isCorrect).length;

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
        // Enhanced stats
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
