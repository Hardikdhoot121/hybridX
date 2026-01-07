import WeeklyGoal from "../models/WeeklyGoal.js";
import PracticeAttempt from "../models/PracticeAttempt.js";
import { getWeekStart } from "../utils/getWeekStart.js";

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
