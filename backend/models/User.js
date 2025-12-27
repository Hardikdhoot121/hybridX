import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    phone:{
      type:String,
      default:"",
    },
    classLevel: {
      type: String,
      enum: ["9th","10th","11th", "12th", "Dropper"],
      default: "12th",
    },

    batch: {
      type: String,
      enum: ["Batch 1", "Batch 2"],
      default: "Batch 1",
    },

    targetYear: {
      type: Number,
      default: new Date().getFullYear() + 1,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
