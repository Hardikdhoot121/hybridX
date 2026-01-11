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

    questionType: {
      type: String,
      enum: ["mcq", "integer"],
      default: "mcq",
    },

    userAnswer: {
      type: String, // Store the user's answer (option identifier or numerical value)
      required: true,
    },

    correctAnswer: {
      type: String, // Store the correct answer for reference
      required: true,
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
