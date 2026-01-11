import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    index: true
  },
  class: {
    type: String,
    required: true,
    enum: ['11th', '12th']
  },
  attendance: {
    type: Map,
    of: Boolean,
    default: new Map()
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for unique date+class combinations
attendanceSchema.index({ date: 1, class: 1 }, { unique: true });

// Static method to get attendance for date and class
attendanceSchema.statics.getAttendance = async function(date, className) {
  const record = await this.findOne({ date, class: className });
  return record ? record.attendance : new Map();
};

// Static method to save attendance
attendanceSchema.statics.saveAttendance = async function(date, className, attendance, markedBy) {
  const record = await this.findOneAndUpdate(
    { date, class: className },
    { 
      attendance, 
      markedBy,
      updatedAt: new Date()
    },
    { 
      upsert: true, 
      new: true 
    }
  );
  return record;
};

// Static method to get student attendance across all dates
attendanceSchema.statics.getStudentAttendance = async function(studentId, className) {
  const records = await this.find({ 
    class: className,
    [`attendance.${studentId}`]: { $exists: true }
  }).sort({ date: 1 });
  
  const studentAttendance = {};
  records.forEach(record => {
    studentAttendance[record.date] = record.attendance.get(studentId.toString());
  });
  
  return studentAttendance;
};

export default mongoose.model('Attendance', attendanceSchema);
