export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    const weeklyStats = await getWeeklyAnalyticsLogic(userId);
    const weeklyGoal = await WeeklyGoal.findOne({ user: userId });

    res.json({
      user,
      weeklyStats,
      weeklyGoal: weeklyGoal?.target ?? 15,
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard load failed" });
  }
};
