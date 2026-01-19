import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Debug endpoint to check environment and database
router.get('/env', async (req, res) => {
  try {
    const debugInfo = {
      mongoUri: process.env.MONGO_URI ? 'SET' : 'NOT SET',
      jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      port: process.env.PORT || 'DEFAULT',
      nodeEnv: process.env.NODE_ENV || 'NOT SET'
    };

    // Test database connection
    let dbInfo = {};
    try {
      const userCount = await User.countDocuments();
      const adminCount = await User.countDocuments({ role: 'admin' });
      dbInfo = {
        connected: true,
        userCount,
        adminCount,
        sampleAdmins: await User.find({ role: 'admin' }).select('email name role').limit(2)
      };
    } catch (dbError) {
      dbInfo = {
        connected: false,
        error: dbError.message
      };
    }

    res.json({
      environment: debugInfo,
      database: dbInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
