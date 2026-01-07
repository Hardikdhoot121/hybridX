const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Mount attendance controller routes
router.use('/', attendanceController);

module.exports = router;
