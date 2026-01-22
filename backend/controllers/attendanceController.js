import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// Save attendance for a specific date and class
export const saveAttendance = async (req, res) => {
  try {
    const { date, classLevel, attendanceRecord } = req.body;
    
    // Validate required fields
    if (!date || !classLevel || !attendanceRecord) {
      return res.status(400).json({
        success: false,
        message: 'Date, classLevel, and attendanceRecord are required'
      });
    }

    // Convert attendanceRecord object to array format for database
    const studentRecords = Object.entries(attendanceRecord).map(([studentId, isPresent]) => ({
      studentId,
      isPresent: Boolean(isPresent)
    }));

    // Create or update attendance record
    const attendance = await Attendance.findOneAndUpdate(
      { 
        date: new Date(date), 
        classLevel 
      },
      {
        date: new Date(date),
        classLevel,
        studentRecords,
        markedBy: req.user.id
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true
      }
    ).populate('studentRecords.studentId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Attendance saved successfully',
      data: attendance
    });

  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save attendance',
      error: error.message
    });
  }
};

// Get attendance for a specific date and class
export const getAttendance = async (req, res) => {
  try {
    const { date, classLevel } = req.query;
    
    if (!date || !classLevel) {
      return res.status(400).json({
        success: false,
        message: 'Date and classLevel are required'
      });
    }

    const attendance = await Attendance.findOne({
      date: new Date(date),
      classLevel
    }).populate('studentRecords.studentId', 'name email');

    if (!attendance) {
      return res.status(200).json({
        success: true,
        data: {}
      });
    }

    // Convert back to object format for frontend compatibility
    const attendanceRecord = {};
    attendance.studentRecords.forEach(record => {
      attendanceRecord[record.studentId._id] = record.isPresent;
    });

    res.status(200).json({
      success: true,
      data: attendanceRecord
    });

  } catch (error) {
    console.error('Error getting attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get attendance',
      error: error.message
    });
  }
};

// Get attendance for a specific student across all dates
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId, classLevel } = req.query;
    
    if (!studentId || !classLevel) {
      return res.status(400).json({
        success: false,
        message: 'StudentId and classLevel are required'
      });
    }

    const attendanceRecords = await Attendance.find({
      classLevel,
      'studentRecords.studentId': studentId
    }).populate('studentRecords.studentId', 'name email');

    const studentAttendance = {};
    
    attendanceRecords.forEach(record => {
      const dateKey = record.date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const studentRecord = record.studentRecords.find(
        sr => sr.studentId._id.toString() === studentId
      );
      
      if (studentRecord) {
        studentAttendance[dateKey] = studentRecord.isPresent;
      }
    });

    res.status(200).json({
      success: true,
      data: studentAttendance
    });

  } catch (error) {
    console.error('Error getting student attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student attendance',
      error: error.message
    });
  }
};

// Get attendance statistics for a class
export const getAttendanceStats = async (req, res) => {
  try {
    const { date, classLevel } = req.query;
    
    if (!date || !classLevel) {
      return res.status(400).json({
        success: false,
        message: 'Date and classLevel are required'
      });
    }

    const attendance = await Attendance.findOne({
      date: new Date(date),
      classLevel
    });

    if (!attendance) {
      return res.status(200).json({
        success: true,
        data: {
          present: 0,
          absent: 0,
          total: 0,
          percentage: 0
        }
      });
    }

    const present = attendance.studentRecords.filter(record => record.isPresent).length;
    const total = attendance.studentRecords.length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        present,
        absent,
        total,
        percentage
      }
    });

  } catch (error) {
    console.error('Error getting attendance stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get attendance statistics',
      error: error.message
    });
  }
};
