import mongoose from "mongoose";

const practiceAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questionId: {
      type: String, // PYQ id or any unique question identifier
      required: true,
    },

    subject: {
      type: String,
      enum: ["physics", "chemistry", "maths"],
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    isCorrect: {
      type: Boolean,
      required: true,
    },

    solvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PracticeAttempt = mongoose.model(
  "PracticeAttempt",
  practiceAttemptSchema
);

export default PracticeAttempt;
