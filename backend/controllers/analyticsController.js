import WeeklyGoal from "../models/WeeklyGoal.js";
import PracticeAttempt from "../models/PracticeAttempt.js";
import { getWeekStart } from "../utils/getWeekStart.js";

export const recordPracticeAttempt = async (req, res) => {
  try {
    const userId = req.user.id;
    const { questionId, subject, topic, difficulty, isCorrect, questionType, userAnswer, correctAnswer } = req.body;

    if (!questionId || !subject || !topic || typeof isCorrect !== 'boolean') {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Record the practice attempt with enhanced data
    const attempt = await PracticeAttempt.create({
      userId,
      questionId,
      subject,
      topic,
      difficulty: difficulty || "Medium",
      questionType: questionType || "mcq",
      userAnswer: userAnswer || "",
      correctAnswer: correctAnswer || "",
      isCorrect,
      solvedAt: new Date(),
    });

    console.log("📊 Practice attempt recorded with details:", {
      userId,
      questionId,
      subject,
      topic,
      questionType,
      userAnswer,
      correctAnswer,
      isCorrect
    });

    // Get updated weekly analytics
    const weekStart = getWeekStart();
    const now = new Date();

    const attempts = await PracticeAttempt.find({
      userId,
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

    res.json({
      success: true,
      attempt: {
        questionId,
        subject,
        topic,
        questionType,
        userAnswer,
        correctAnswer,
        isCorrect,
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
    console.error("Error recording practice attempt:", error);
    res.status(500).json({ message: "Failed to record practice attempt" });
  }
};

export const setWeeklyGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { target } = req.body;

    if (!target || target <= 0) {
      return res.status(400).json({ message: "Invalid weekly goal" });
    }

    const weekStart = getWeekStart();

    const goal = await WeeklyGoal.findOneAndUpdate(
      { userId, weekStart },
      { target },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      target: goal.target,
      weekStart,
    });
  } catch {
    res.status(500).json({ message: "Failed to save weekly goal" });
  }
};
export const getWeeklyGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const weekStart = getWeekStart();

    let goal = await WeeklyGoal.findOne({ userId, weekStart });

    if (!goal) {
      goal = await WeeklyGoal.create({
        userId,
        weekStart,
        target: 15, // default
      });
    }

    res.json({
      target: goal.target,
      weekStart,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch weekly goal" });
  }
};
export const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const weekStart = getWeekStart();
    const now = new Date();

    const attempts = await PracticeAttempt.find({
      userId,
      solvedAt: { $gte: weekStart, $lte: now },
    });

    const totalSolved = attempts.length;
    const correct = attempts.filter(a => a.isCorrect).length;
    const accuracy = totalSolved
      ? Math.round((correct / totalSolved) * 100)
      : 0;

    res.json({
      totalSolved,
      correct,
      accuracy,
      challengesTaken: totalSolved,
    });
  } catch {
    res.status(500).json({ message: "Weekly analytics failed" });
  }
};
