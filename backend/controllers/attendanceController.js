const express = require('express');
const router = express.Router();

// In-memory storage for attendance (in production, use a database)
let attendanceData = {};

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Save attendance for a specific date and class
router.post('/', async (req, res) => {
  try {
    const { date, class: className, attendance } = req.body;
    
    if (!date || !className || !attendance) {
      return res.status(400).json({ 
        error: 'Missing required fields: date, class, attendance' 
      });
    }
    
    // Store attendance
    if (!attendanceData[date]) {
      attendanceData[date] = {};
    }
    
    attendanceData[date][className] = attendance;
    
    console.log(`✅ Attendance saved for ${className} on ${date}:`, attendance);
    
    res.json({ 
      success: true, 
      message: 'Attendance saved successfully',
      data: { date, class: className, attendance }
    });
    
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get attendance for a specific date and class
router.get('/:date/:class', async (req, res) => {
  try {
    const { date, class: className } = req.params;
    
    const attendance = attendanceData[date]?.[className] || {};
    
    console.log(`📅 Retrieved attendance for ${className} on ${date}:`, attendance);
    
    res.json({ 
      success: true, 
      data: attendance,
      date,
      class: className
    });
    
  } catch (error) {
    console.error('Error retrieving attendance:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get all attendance data
router.get('/', async (req, res) => {
  try {
    res.json({ 
      success: true, 
      data: attendanceData
    });
    
  } catch (error) {
    console.error('Error retrieving all attendance:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

module.exports = router;
