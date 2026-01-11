import express from 'express';
import attendanceController from '../controllers/attendanceController.js';

const router = express.Router();

// Mount attendance controller routes
router.use('/', attendanceController);

export default router;
