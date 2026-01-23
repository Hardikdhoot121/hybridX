import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    studentId: {
      type: String,
      required: true,
      ref: "User",
    },
=======
>>>>>>> bfca7e616eec7a84f58ecc574cae6a1378859848
    date: {
      type: Date,
      required: true,
    },
    classLevel: {
      type: String,
<<<<<<< HEAD
      enum: ["9th", "10th", "11th", "12th", "Dropper"],
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },
    markedBy: {
      type: String,
      required: true,
      ref: "User",
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate attendance entries
attendanceSchema.index({ studentId: 1, date: 1, classLevel: 1 }, { unique: true });
=======
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
>>>>>>> bfca7e616eec7a84f58ecc574cae6a1378859848

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
