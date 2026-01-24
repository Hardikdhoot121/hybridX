import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    classLevel: {
      type: String,
      required: true,
      enum: ["9th", "10th", "11th", "12th", "Dropper"],
    },
    studentRecords: [{
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      isPresent: {
        type: Boolean,
        required: true,
      },
    }],
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { 
    timestamps: true,
    // Ensure unique combination of date and class
    index: { date: 1, classLevel: 1 }, 
    unique: true
  }
);

// Compound index to prevent duplicate attendance records for same date and class
attendanceSchema.index({ date: 1, classLevel: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
