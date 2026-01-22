import express from 'express';
import { saveAttendance, getAttendance, getStudentAttendance, getAttendanceStats } from '../controllers/attendanceController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Save attendance (admin only)
router.post('/save', protect, isAdmin, saveAttendance);

// Get attendance for a specific date and class
router.get('/', protect, getAttendance);

// Get attendance for a specific student
router.get('/student', protect, getStudentAttendance);

// Get attendance statistics for a class
router.get('/stats', protect, getAttendanceStats);

export default router;
