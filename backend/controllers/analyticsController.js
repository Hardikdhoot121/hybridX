import WeeklyGoal from "../models/WeeklyGoal.js";
import PracticeAttempt from "../models/PracticeAttempt.js";
import { getWeekStart } from "../utils/getWeekStart.js";
import redis from "../config/redis.js";

export const setWeeklyGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { target } = req.body;

    if (!target || target <= 0) {
      return res.status(400).json({ message: "Invalid weekly goal" });
    }

    const weekStart = getWeekStart();
    const dateKey = weekStart.toISOString().slice(0, 10);

    const goal = await WeeklyGoal.findOneAndUpdate(
      { userId, weekStart },
      { target },
      { upsert: true, new: true }
    );

    if (redis && redis.status === "ready") {
      redis.del(`goal:weekly:${userId}:${dateKey}`).catch(() => { });
    }

    res.json({
      success: true,
      target: goal.target,
      weekStart,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to save weekly goal" });
  }
};

export const getWeeklyGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const weekStart = getWeekStart();
    const dateKey = weekStart.toISOString().slice(0, 10);
    const cacheKey = `goal:weekly:${userId}:${dateKey}`;

    if (redis && redis.status === "ready") {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) return res.json(JSON.parse(cached));
      } catch (e) { }
    }

    let goal = await WeeklyGoal.findOne({ userId, weekStart });
    if (!goal) {
      goal = await WeeklyGoal.create({
        userId,
        weekStart,
        target: 30, // default
      });
    }

    const responseData = {
      target: goal.target,
      weekStart,
    };

    if (redis && redis.status === "ready") {
      redis.setex(cacheKey, 86400, JSON.stringify(responseData)).catch(() => { });
    }

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch weekly goal" });
  }
};

export const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const weekStart = getWeekStart();
    const now = new Date();
    const dateKey = weekStart.toISOString().slice(0, 10);
    const cacheKey = `analytics:weekly:${userId}:${dateKey}`;

    if (redis && redis.status === "ready") {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) return res.json(JSON.parse(cached));
      } catch (e) { }
    }

    // cache miss -> fetch from MongoDB
    const attempts = await PracticeAttempt.find({
      userId,
      solvedAt: { $gte: weekStart, $lte: now },
    });

    const totalSolved = attempts.length;
    const correct = attempts.filter((a) => a.isCorrect).length;
    const accuracy = totalSolved
      ? Math.round((correct / totalSolved) * 100)
      : 0;

    const responseData = {
      totalSolved,
      correct,
      accuracy,
      challengesTaken: totalSolved,
    };

    // Cache in Redis 3600 sec 
    if (redis && redis.status === "ready") {
      redis.setex(cacheKey, 3600, JSON.stringify(responseData)).catch(() => { });
    }

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ message: "Weekly analytics failed" });
  }
};
