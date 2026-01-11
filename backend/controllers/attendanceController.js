import express from 'express';
import Attendance from '../models/Attendance.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Attendance backend is running' });
});

// Save attendance for a specific date and class
router.post('/', async (req, res) => {
  try {
    const { date, class: className, attendance } = req.body;
    
    if (!date || !className || !attendance) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: date, class, attendance' 
      });
    }
    
    // Convert attendance object to Map
    const attendanceMap = new Map(Object.entries(attendance));
    
    // Save attendance to database
    const record = await Attendance.saveAttendance(date, className, attendanceMap, req.user.id);
    
    console.log(`✅ Attendance saved for ${className} on ${date} by ${req.user.email}:`, attendance);
    
    res.json({ 
      success: true, 
      message: 'Attendance saved successfully',
      data: { 
        date, 
        class: className, 
        attendance: Object.fromEntries(record.attendance),
        markedBy: req.user.name
      }
    });
    
  } catch (error) {
    console.error('Error saving attendance:', error);
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        error: 'Attendance already exists for this date and class' 
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Get attendance for a specific date and class
router.get('/:date/:class', async (req, res) => {
  try {
    const { date, class: className } = req.params;
    
    const attendance = await Attendance.getAttendance(date, className);
    
    console.log(`📅 Retrieved attendance for ${className} on ${date}:`, Object.fromEntries(attendance));
    
    res.json({ 
      success: true, 
      data: Object.fromEntries(attendance),
      date,
      class: className
    });
    
  } catch (error) {
    console.error('Error retrieving attendance:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Get all attendance data
router.get('/', async (req, res) => {
  try {
    const { class: className, startDate, endDate } = req.query;
    
    let query = {};
    if (className) query.class = className;
    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    const records = await Attendance.find(query).sort({ date: -1 });
    
    const attendanceData = {};
    records.forEach(record => {
      attendanceData[record.date] = {
        [record.class]: Object.fromEntries(record.attendance)
      };
    });
    
    res.json({ 
      success: true, 
      data: attendanceData,
      count: records.length
    });
    
  } catch (error) {
    console.error('Error retrieving all attendance:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Get student attendance across all dates
router.get('/student/:studentId/:class', async (req, res) => {
  try {
    const { studentId, class: className } = req.params;
    
    const studentAttendance = await Attendance.getStudentAttendance(studentId, className);
    
    console.log(`👤 Retrieved attendance for student ${studentId} in ${className}:`, studentAttendance);
    
    res.json({ 
      success: true, 
      data: studentAttendance,
      studentId,
      class: className
    });
    
  } catch (error) {
    console.error('Error retrieving student attendance:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

export default router;
