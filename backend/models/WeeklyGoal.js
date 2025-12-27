import mongoose from "mongoose";

const weeklyGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    weekStart: {
      type: Date,
      required: true,
    },

    target: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

/* One goal per user per week */
weeklyGoalSchema.index({ userId: 1, weekStart: 1 }, { unique: true });

export default mongoose.model("WeeklyGoal", weeklyGoalSchema);
